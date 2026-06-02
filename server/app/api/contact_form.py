"""POST /contact-form — general contact form ingestion.

Distinct from /capture (chat-widget end-of-conversation flow): here the
visitor explicitly fills name, email, and a free-text message.

Plumbing:
  1. POST flight-deck /api/forms (HMAC CSRF, canonical identity merge).
  2. Persist the submission to crox-chat-db (contact_form_submissions).
  3. Fire `contact_form_submitted` PostHog event.

The Flight Deck admin reads from contact_form_submissions to surface
these in the consolidated lead view. Fibery Activity Stream writes
were removed when Crox moved off Fibery as a CRM (2026-06).
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
import httpx

from app.services import analytics, db, flight_deck

router = APIRouter()


class ContactFormRequest(BaseModel):
    email: EmailStr
    name: str | None = Field(None, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    page_url: str = Field(..., max_length=2000)
    visitor_id: str | None = None
    contact_ref: str | None = None


class ContactFormResponse(BaseModel):
    contact_id: str | None
    captured: bool


@router.post("/contact-form", response_model=ContactFormResponse)
async def contact_form(req: ContactFormRequest) -> ContactFormResponse:
    if not flight_deck.is_configured():
        raise HTTPException(status_code=503, detail="capture_not_configured")

    visitor_id = flight_deck.ensure_visitor_id(req.visitor_id)
    form_fields = {
        "email": str(req.email),
        "source": "contact_form",
        "message": req.message,
    }
    if req.name:
        form_fields["name"] = req.name

    try:
        result = await flight_deck.submit_form(
            visitor_id=visitor_id,
            page_url=req.page_url,
            form_fields=form_fields,
            contact_ref=req.contact_ref,
        )
    except httpx.HTTPStatusError as exc:
        body = exc.response.text[:200] if exc.response is not None else ""
        print(f"[contact-form] flight-deck rejected: {exc.response.status_code if exc.response else '?'} {body}")
        raise HTTPException(status_code=502, detail="upstream_rejected") from exc
    except httpx.RequestError as exc:
        print(f"[contact-form] flight-deck unreachable: {type(exc).__name__}: {str(exc)[:200]}")
        raise HTTPException(status_code=502, detail="upstream_unreachable") from exc

    contact_id = result.get("contact_id")

    # Persist to local Postgres regardless of flight-deck contact_id —
    # we want the message in our CRM even if flight-deck queued the upsert.
    await db.insert_contact_form_submission(
        name=req.name,
        email=str(req.email),
        message=req.message,
        page_url=req.page_url,
        visitor_id=visitor_id,
        contact_ref=req.contact_ref,
        contact_id=contact_id,
    )

    if contact_id:
        await analytics.fire_event(
            distinct_id=contact_id,
            event="contact_form_submitted",
            properties={
                "page_url": req.page_url,
                "message_length": len(req.message),
                "had_name": bool(req.name),
                "visitor_id": visitor_id,
            },
        )

    return ContactFormResponse(contact_id=contact_id, captured=True)
