"""POST /contact-form — general contact form ingestion.

Distinct from /capture (which is the chat-widget end-of-conversation
flow): here the visitor explicitly fills in name, email, and a free-text
message. The message is the primary content; there's no transcript.

Plumbing is the same as /capture:
  1. POST flight-deck /api/forms (HMAC CSRF, canonical Fibery upsert)
  2. Append the message as a Contact form entry to CRM/Activity Stream
  3. Fire `contact_form_submitted` PostHog event

Distinct event name and Activity Stream label so the per-contact
timeline at flight-deck admin reads correctly.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
import httpx

from app.services import analytics, fibery, flight_deck

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


def _render_message(name: str | None, email: str, message: str) -> str:
    """Render the contact form submission as markdown for Activity Stream.

    Each line of the message becomes a blockquote line so it stays
    visually owned by the visitor — the same convention the chat
    transcript uses (see api/capture.py)."""
    body = "\n".join(f"> {line}" for line in message.strip().splitlines())
    header = f"**From:** {name} <{email}>" if name else f"**From:** <{email}>"
    return f"{header}\n\n{body}"


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
    if not contact_id:
        # Queued by flight-deck for retry.
        return ContactFormResponse(contact_id=None, captured=True)

    # Append the message itself to the contact's Activity Stream (best-effort).
    md = _render_message(req.name, str(req.email), req.message)
    await fibery.append_contact_form_message(contact_id, md)

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
