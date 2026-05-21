"""POST /capture — lead capture from the chat widget.

Flow:
  1. Validate input (email, conversation, page_url)
  2. POST to flight-deck /api/forms with HMAC CSRF → returns Fibery contact_id
  3. Append the conversation transcript to that contact's CRM/Activity Stream
  4. Fire a `chat_lead_captured` PostHog event keyed by contact_id

Step 1 is hard-fail: if flight-deck rejects the form (bad CSRF, validation,
unknown project_host, etc.) we 4xx/5xx back to the widget so the user sees
a real error. Steps 3 and 4 are best-effort — we already have the contact;
losing a transcript append or a PostHog event is recoverable noise.

The transcript markdown is built server-side so the widget can't inject
arbitrary content into Fibery documents. We render each turn as a
quoted block with a role prefix.
"""
from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field
from fastapi import APIRouter, HTTPException
import httpx

from app.api.chat import ChatMessage
from app.services import analytics, fibery, flight_deck

router = APIRouter()


class CaptureRequest(BaseModel):
    email: EmailStr
    name: str | None = Field(None, max_length=200)
    page_url: str = Field(..., max_length=2000)
    visitor_id: str | None = None  # window.croxAttribution.visitorId if present
    contact_ref: str | None = None  # tracking token / fibery_id if known
    conversation: list[ChatMessage] = Field(..., min_length=1, max_length=80)


class CaptureResponse(BaseModel):
    contact_id: str | None
    captured: bool


def _render_transcript(messages: list[ChatMessage]) -> str:
    """Render the conversation as markdown for the Activity Stream.

    Each turn becomes a labelled blockquote. Markdown special chars in
    user content are left as-is — Fibery renders them, but the worst
    case is mild formatting weirdness, not injection (the document is
    private to the CRM workspace).
    """
    lines: list[str] = []
    for m in messages:
        label = "**Visitor**" if m.role == "user" else "**Adam-bot**"
        # Indent every line of the content to keep the block visually owned.
        body = "\n".join(f"> {line}" for line in m.content.strip().splitlines())
        lines.append(f"{label}\n{body}")
    return "\n\n".join(lines)


@router.post("/capture", response_model=CaptureResponse)
async def capture(req: CaptureRequest) -> CaptureResponse:
    if not flight_deck.is_configured():
        raise HTTPException(status_code=503, detail="capture_not_configured")

    # 1. Hand the lead to flight-deck — it owns the canonical upsert.
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
        # Flight-deck rejected the submission. Surface a sanitised error.
        body = exc.response.text[:200] if exc.response is not None else ""
        print(f"[capture] flight-deck rejected: {exc.response.status_code if exc.response else '?'} {body}")
        raise HTTPException(status_code=502, detail="upstream_rejected") from exc
    except httpx.RequestError as exc:
        print(f"[capture] flight-deck unreachable: {type(exc).__name__}: {str(exc)[:200]}")
        raise HTTPException(status_code=502, detail="upstream_unreachable") from exc

    contact_id = result.get("contact_id")
    if not contact_id:
        # Flight-deck queued the form (Fibery was down on their side). The
        # widget should still treat this as success — they will retry.
        print(f"[capture] flight-deck queued for retry: {result}")
        return CaptureResponse(contact_id=None, captured=True)

    # 2. Append transcript to the contact's Activity Stream (best-effort).
    transcript_md = _render_transcript(req.conversation)
    appended = await fibery.append_chat_transcript(contact_id, transcript_md)
    if not appended:
        print(f"[capture] activity-stream append failed for contact={contact_id}")

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
