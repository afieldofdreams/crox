"""Cold-outbound endpoints — the sending leg of the Crox lead machine.

The daily outbound routine (a scheduled Claude session working the
Fibery CRM) researches prospects, writes the email, and calls
POST /outbound/send with the admin bearer token. This module owns the
guardrails so no caller — human or agent — can bypass them:

  - Sends only when OUTBOUND_FROM_EMAIL is configured (a Resend-verified
    sender on a dedicated subdomain, so cold volume never rides on the
    main crox.io reputation).
  - Refuses suppressed addresses (unsubscribed / bounced / manual).
  - Refuses duplicate first-touches unless follow_up=true.
  - Hard daily cap across all callers (OUTBOUND_DAILY_CAP, default 25).
  - Every email gets an unsubscribe footer + List-Unsubscribe header;
    GET /unsubscribe is public and one-click.

Routes:
  POST /outbound/send     — send one cold email (admin token)
  GET  /outbound/status   — configured? sent today? cap? (admin token)
  GET  /unsubscribe       — public opt-out landing (HMAC-signed link)
"""
from __future__ import annotations

import hashlib
import hmac

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr, Field

from app.api.admin import _require_admin
from app.config import settings
from app.services import db, email as email_service

router = APIRouter()


def _unsubscribe_token(email: str) -> str:
    secret = settings.unsubscribe_secret
    return hmac.new(
        secret.encode(), email.lower().encode(), hashlib.sha256
    ).hexdigest()[:32]


def _unsubscribe_url(email: str) -> str:
    return f"{settings.base_url}/unsubscribe?e={email.lower()}&t={_unsubscribe_token(email)}"


def _outbound_configured() -> bool:
    return bool(
        email_service.is_configured()
        and settings.outbound_from_email
        and settings.unsubscribe_secret
    )


class OutboundSendRequest(BaseModel):
    to: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    body_text: str = Field(..., min_length=1, max_length=10000)
    # Set true for a deliberate follow-up to someone already cold-emailed.
    follow_up: bool = False


class OutboundSendResponse(BaseModel):
    ok: bool
    outbound_id: int | None = None
    resend_id: str | None = None
    error: str | None = None
    sent_today: int | None = None


@router.get("/outbound/status")
async def outbound_status(_: None = Depends(_require_admin)) -> dict:
    sent_today = await db.count_cold_sends_today()
    return {
        "configured": _outbound_configured(),
        "from": settings.outbound_from_email or None,
        "daily_cap": settings.outbound_daily_cap,
        "sent_today": sent_today,
        "db_ok": sent_today is not None,
    }


@router.post("/outbound/send", response_model=OutboundSendResponse)
async def outbound_send(
    req: OutboundSendRequest,
    _: None = Depends(_require_admin),
) -> OutboundSendResponse:
    if not _outbound_configured():
        raise HTTPException(status_code=503, detail="outbound_not_configured")

    to = str(req.to)

    if await db.is_suppressed(to):
        return OutboundSendResponse(ok=False, error="suppressed")

    if not req.follow_up and await db.already_sent_cold(to):
        return OutboundSendResponse(ok=False, error="already_contacted")

    sent_today = await db.count_cold_sends_today()
    if sent_today is None:
        # DB down — fail closed rather than send uncounted volume.
        return OutboundSendResponse(ok=False, error="db_unavailable")
    if sent_today >= settings.outbound_daily_cap:
        return OutboundSendResponse(ok=False, error="daily_cap_reached", sent_today=sent_today)

    unsubscribe_url = _unsubscribe_url(to)
    body = (
        f"{req.body_text.rstrip()}\n\n"
        "--\n"
        "Crox Ltd, London · crox.io\n"
        f"Prefer not to hear from us? One click and you never will: {unsubscribe_url}\n"
    )

    result = await email_service.send(
        to=to,
        subject=req.subject,
        text=body,
        reply_to=settings.outbound_reply_to or None,
        from_address=settings.outbound_from_email,
        headers={
            "List-Unsubscribe": f"<{unsubscribe_url}>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
    )

    outbound_id = await db.insert_outbound_email(
        to_email=to,
        from_email=settings.outbound_from_email,
        reply_to=settings.outbound_reply_to or None,
        subject=req.subject,
        body_text=body,
        source="cold_outbound",
        resend_id=result.resend_id,
        send_error=result.error,
    )

    return OutboundSendResponse(
        ok=result.ok,
        outbound_id=outbound_id,
        resend_id=result.resend_id,
        error=result.error,
        sent_today=(sent_today + 1) if result.ok else sent_today,
    )


_UNSUB_PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>{title}</title>
<style>
  body {{ background:#0a0a0a; color:#e8e4de; font-family: Georgia, serif;
         display:flex; align-items:center; justify-content:center;
         min-height:100vh; margin:0; padding:2rem; }}
  main {{ max-width:28rem; text-align:center; }}
  h1 {{ font-weight:normal; font-size:1.6rem; }}
  p {{ color:#a8a29b; line-height:1.7; font-size:0.95rem; }}
  a {{ color:#e07070; }}
</style></head>
<body><main><h1>{title}</h1><p>{body}</p></main></body></html>"""


@router.get("/unsubscribe", response_class=HTMLResponse)
async def unsubscribe(e: str = "", t: str = "") -> HTMLResponse:
    """Public one-click opt-out. Link is HMAC-signed so nobody can
    unsubscribe third parties by guessing addresses."""
    email_addr = e.strip().lower()
    if not email_addr or not t or not settings.unsubscribe_secret:
        return HTMLResponse(
            _UNSUB_PAGE.format(title="Invalid link", body="This unsubscribe link is incomplete. Reply to the email instead and we'll remove you by hand."),
            status_code=400,
        )
    if not hmac.compare_digest(t, _unsubscribe_token(email_addr)):
        return HTMLResponse(
            _UNSUB_PAGE.format(title="Invalid link", body="This unsubscribe link isn't valid. Reply to the email instead and we'll remove you by hand."),
            status_code=400,
        )
    ok = await db.add_suppression(email_addr, reason="unsubscribed")
    if not ok:
        return HTMLResponse(
            _UNSUB_PAGE.format(title="Something went wrong", body="We couldn't record that just now. Reply to the email and a human will remove you."),
            status_code=500,
        )
    return HTMLResponse(
        _UNSUB_PAGE.format(title="You're unsubscribed", body="Done — you won't hear from Crox again. No hard feelings.")
    )


# Resend can also POST one-click unsubscribes (List-Unsubscribe-Post).
@router.post("/unsubscribe", response_class=HTMLResponse)
async def unsubscribe_post(e: str = "", t: str = "") -> HTMLResponse:
    return await unsubscribe(e=e, t=t)
