"""Admin JSON API for Flight Deck.

Flight Deck's /admin/crox page calls these endpoints server-side
(token never reaches the browser). Cloudflare Access protects the
Flight Deck admin URL, so the only privileged surface here is the
ADMIN_TOKEN bearer secret that Flight Deck holds in its env.

All endpoints gated by:
    Authorization: Bearer <ADMIN_TOKEN>

Routes:
  GET  /admin/conversations           — recent chat conversations (legacy)
  GET  /admin/conversations/{id}      — full transcript for one (legacy)
  GET  /admin/contacts                — consolidated leads view (by email)
  GET  /admin/contacts/{email}        — everything for one email:
                                          assessments + contact forms +
                                          chat transcripts + outbound emails
  POST /admin/contacts/{email}/send-email
                                      — send a reply via Resend; logs to
                                          outbound_emails so the thread
                                          history is visible
"""
from __future__ import annotations

from datetime import datetime
from typing import Any
from urllib.parse import unquote

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, Field

from app.config import settings
from app.services import db, email as email_service

router = APIRouter(prefix="/admin")

_bearer = HTTPBearer(auto_error=False)


def _require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> None:
    if not settings.admin_token:
        raise HTTPException(status_code=503, detail="admin_not_configured")
    if credentials is None:
        raise HTTPException(status_code=401, detail="missing_token")
    if credentials.credentials != settings.admin_token:
        raise HTTPException(status_code=403, detail="bad_token")


def _iso(dt: datetime | None) -> str | None:
    return dt.isoformat() if dt else None


def _serialize(value: Any) -> Any:
    """Recursively convert datetimes/UUIDs to JSON-safe primitives."""
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: _serialize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_serialize(v) for v in value]
    return value


# ---------------------------------------------------------------------------
# Legacy conversation endpoints (kept for the existing curl tooling)
# ---------------------------------------------------------------------------

@router.get("/conversations")
async def list_conversations(_: None = Depends(_require_admin)) -> dict:
    rows = await db.list_recent_conversations(limit=50)
    return {
        "conversations": [
            {
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "page_url": r["page_url"],
                "contact_id": r["contact_id"],
                "started_at": _iso(r["started_at"]),
                "last_message_at": _iso(r["last_message_at"]),
                "captured_at": _iso(r["captured_at"]),
                "message_count": r["message_count"],
            }
            for r in rows
        ],
    }


@router.get("/conversations/{conv_id}")
async def get_conversation(conv_id: int, _: None = Depends(_require_admin)) -> dict:
    messages = await db.get_conversation_messages(conv_id)
    return {
        "conversation_id": conv_id,
        "messages": [
            {"role": m["role"], "content": m["content"], "created_at": _iso(m["created_at"])}
            for m in messages
        ],
    }


# ---------------------------------------------------------------------------
# Consolidated contact endpoints — what Flight Deck reads.
# ---------------------------------------------------------------------------

@router.get("/contacts")
async def list_contacts(_: None = Depends(_require_admin)) -> dict:
    """One row per unique email across all lead sources, newest first."""
    rows = await db.list_contacts(limit=200)
    return {
        "contacts": [
            {
                "email": r["email"],
                "name": r["name"],
                "company": r["company"],
                "assessment_count": r["assessment_count"],
                "conversation_count": r["conversation_count"],
                "contact_form_count": r["contact_form_count"],
                "outbound_email_count": r["outbound_email_count"],
                "latest_score": r["latest_score"],
                "latest_band": r["latest_band"],
                "last_activity": _iso(r["last_activity"]),
            }
            for r in rows
        ],
    }


@router.get("/contacts/{email}")
async def get_contact(email: str, _: None = Depends(_require_admin)) -> dict:
    """Everything we know about one email — assessments, conversations,
    contact forms, outbound emails.
    """
    detail = await db.get_contact_detail(unquote(email))
    if detail is None:
        raise HTTPException(status_code=404, detail="contact_not_found")
    return _serialize(detail)


# ---------------------------------------------------------------------------
# Send email — admin-triggered outbound reply via Resend
# ---------------------------------------------------------------------------

class SendEmailRequest(BaseModel):
    subject: str = Field(..., min_length=1, max_length=300)
    body_text: str = Field(..., min_length=1, max_length=20000)
    # If omitted, falls back to settings.assessment_from_email.
    # e.g. "Adam Field <adam@crox.io>" — must be a Resend-verified sender.
    from_address: str | None = Field(None, max_length=300)
    # The visitor's reply destination. Defaults to settings.assessment_from_email
    # so they can't reply directly if we don't want that; usually set to
    # adam@crox.io so replies route to the inbox.
    reply_to: EmailStr | None = None


class SendEmailResponse(BaseModel):
    ok: bool
    outbound_id: int | None
    resend_id: str | None
    error: str | None = None


@router.post("/contacts/{email}/send-email", response_model=SendEmailResponse)
async def send_email_to_contact(
    email: str,
    req: SendEmailRequest,
    _: None = Depends(_require_admin),
) -> SendEmailResponse:
    if not email_service.is_configured():
        raise HTTPException(status_code=503, detail="resend_not_configured")
    to = unquote(email)
    result = await email_service.send(
        to=to,
        subject=req.subject,
        text=req.body_text,
        reply_to=str(req.reply_to) if req.reply_to else None,
        from_address=req.from_address,
    )
    # Log both success and failure so the admin shows what was attempted.
    outbound_id = await db.insert_outbound_email(
        to_email=to,
        from_email=req.from_address or settings.assessment_from_email,
        reply_to=str(req.reply_to) if req.reply_to else None,
        subject=req.subject,
        body_text=req.body_text,
        source="admin_reply",
        resend_id=result.resend_id,
        send_error=result.error,
    )
    return SendEmailResponse(
        ok=result.ok,
        outbound_id=outbound_id,
        resend_id=result.resend_id,
        error=result.error,
    )
