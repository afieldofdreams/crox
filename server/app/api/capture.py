"""POST /capture — lead capture from the chat widget.

Flow:
  1. POST to flight-deck /api/forms with HMAC CSRF. Flight-deck still
     owns identity resolution (tracking tokens, visitor->engagement
     merge) so chat captures join up with other Crox properties.
  2. Mark the local Postgres conversation row as captured. The transcript
     itself is already stored in the `messages` table — Flight Deck's
     admin view joins by email so there's nothing extra to do here.
  3. Fire `chat_lead_captured` to PostHog keyed by contact_id.

Step 1 is hard-fail: if flight-deck rejects (bad CSRF, unknown host)
we surface the error to the widget. Steps 2 and 3 are best-effort.

Fibery Activity Stream writes were removed when Crox moved off Fibery
as a CRM (2026-06). Postgres + Flight Deck is the canonical record.
"""
from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field
from fastapi import APIRouter, HTTPException
import httpx

from app.api.chat import ChatMessage
from app.services import analytics, db, flight_deck

router = APIRouter()


class CaptureRequest(BaseModel):
    email: EmailStr
    name: str | None = Field(None, max_length=200)
    page_url: str = Field(..., max_length=2000)
    visitor_id: str | None = None  # window.croxAttribution.visitorId if present
    contact_ref: str | None = None  # tracking token / fibery_id if known
    conversation: list[ChatMessage] = Field(..., min_length=1, max_length=80)
    conversation_id: int | None = None  # Postgres conversation row, if /chat/start was used


class CaptureResponse(BaseModel):
    contact_id: str | None
    captured: bool


@router.post("/capture", response_model=CaptureResponse)
async def capture(req: CaptureRequest) -> CaptureResponse:
    if not flight_deck.is_configured():
        raise HTTPException(status_code=503, detail="capture_not_configured")

    # 1. Hand the lead to flight-deck — it owns identity resolution.
    visitor_id = flight_deck.ensure_visitor_id(req.visitor_id)
    form_fields = {
        "email": str(req.email),
        "source": "chat",
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
        print(f"[capture] flight-deck rejected: {exc.response.status_code if exc.response else '?'} {body}")
        raise HTTPException(status_code=502, detail="upstream_rejected") from exc
    except httpx.RequestError as exc:
        print(f"[capture] flight-deck unreachable: {type(exc).__name__}: {str(exc)[:200]}")
        raise HTTPException(status_code=502, detail="upstream_unreachable") from exc

    contact_id = result.get("contact_id")
    if not contact_id:
        # Flight-deck queued. Widget treats this as success.
        print(f"[capture] flight-deck queued for retry: {result}")
        if req.conversation_id:
            await db.mark_captured(req.conversation_id, None)
        return CaptureResponse(contact_id=None, captured=True)

    # 2. Link the Postgres conversation row to the resolved contact (best-effort).
    if req.conversation_id:
        await db.mark_captured(req.conversation_id, contact_id)

    # 3. Fire PostHog event keyed by contact_id (best-effort).
    await analytics.fire_event(
        distinct_id=contact_id,
        event="chat_lead_captured",
        properties={
            "page_url": req.page_url,
            "turn_count": len(req.conversation),
            "had_name": bool(req.name),
            "visitor_id": visitor_id,
        },
    )

    return CaptureResponse(contact_id=contact_id, captured=True)
