"""Chat endpoints.

  POST /chat/start  — gate the chat behind name + email. Creates a
                      conversation row in Postgres and returns its id.
                      The widget must call this before /chat.

  POST /chat        — Server-Sent Events stream of a Claude completion.
                      Persists the user message and the streamed
                      assistant reply (if conversation_id is known).

SSE event types on /chat:
    event: token   — data: {"text": "<chunk>"}
    event: done    — data: {}
    event: error   — data: {"message": "<short reason>"}

System prompt is loaded from prompts/system.md on every request so it
can be edited without a redeploy in development. In production it
ships in the Docker image; a redeploy is needed to change it.

The visitor's name + email are injected into the system prompt so Fred
can greet by name and never re-ask for the email.

Cost controls (see memory: feedback-cost-monitoring):
- Defaults to Haiku 4.5; configurable via ANTHROPIC_MODEL.
- System prompt is marked with cache_control so Anthropic caches it
  across requests (~10× cheaper input after the first hit). The
  per-visitor injection is appended as a separate (uncached) block so
  the big shared prompt stays cacheable.
- Daily input-token budget is enforced via app.budget. Exhausted budget
  returns 503 without calling Anthropic.
"""
from __future__ import annotations

import json
from pathlib import Path

from anthropic import AsyncAnthropic
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field

from app import budget
from app.config import settings
from app.services import db

router = APIRouter()


SYSTEM_PROMPT_PATH = Path(__file__).resolve().parents[2] / "prompts" / "system.md"


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatStartRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    page_url: str = Field("", max_length=2000)
    visitor_id: str | None = None
    contact_ref: str | None = None
    user_agent: str | None = Field(None, max_length=500)


class ChatStartResponse(BaseModel):
    conversation_id: int | None
    greeting: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1, max_length=80)
    contact_ref: str | None = None  # tracking token or fibery_id if known
    conversation_id: int | None = None
    # Visitor identity is injected into the system prompt so Fred can
    # greet by name and never re-ask for the email. The widget supplies
    # these from the chat-start response so they don't need to be
    # re-fetched per request.
    visitor_name: str | None = Field(None, max_length=200)
    visitor_email: str | None = Field(None, max_length=320)


def _load_system_prompt() -> str:
    return SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")


def _sse(event: str, data: dict) -> bytes:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n".encode()


def _estimate_input_tokens(system_prompt: str, messages: list[ChatMessage]) -> int:
    """Cheap pre-call estimate: ~4 chars per token.

    Used solely to reserve against the daily budget before the API call
    so a runaway loop can't burn the budget in flight. Corrected to the
    actual usage once the response's usage block arrives.
    """
    chars = len(system_prompt) + sum(len(m.content) for m in messages)
    return max(1, chars // 4)


@router.post("/chat/start", response_model=ChatStartResponse)
async def chat_start(req: ChatStartRequest, request: Request) -> ChatStartResponse:
    """Create a conversation record from name + email.

    The widget calls this once when the visitor submits the intro form,
    before any messages are sent. Returns the conversation_id which the
    widget then passes to /chat and /capture.

    If Postgres is disabled (DATABASE_URL empty), returns
    conversation_id=None — the chat still works, just isn't persisted.
    """
    name = req.name.strip()
    email = str(req.email).strip().lower()
    if not name:
        raise HTTPException(status_code=400, detail="invalid_name")

    user_agent = req.user_agent or request.headers.get("user-agent", "")[:500]

    conv_id = await db.create_conversation(
        name=name,
        email=email,
        visitor_id=req.visitor_id,
        contact_ref=req.contact_ref,
        page_url=req.page_url,
        user_agent=user_agent or None,
    )

    greeting = (
        f"Hi {name.split()[0]} — Fred here, Adam's assistant. "
        "What brought you to Crox today?"
    )
    return ChatStartResponse(conversation_id=conv_id, greeting=greeting)


@router.post("/chat")
async def chat(req: ChatRequest, request: Request):
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=503, detail="chat_not_configured")

    for m in req.messages:
        if m.role not in ("user", "assistant"):
            raise HTTPException(status_code=400, detail="invalid_role")
        if not m.content or not m.content.strip():
            raise HTTPException(status_code=400, detail="empty_content")

    if req.messages[0].role != "user":
        raise HTTPException(status_code=400, detail="must_start_with_user")

    system_prompt = _load_system_prompt()
    estimated = _estimate_input_tokens(system_prompt, req.messages)

    # Budget gate. If today's budget is exhausted, refuse with 503 — do not
    # call Anthropic.
    if not await budget.check_and_reserve(estimated, settings.daily_input_token_budget):
        print(f"[chat] daily budget exhausted: {budget.snapshot()}")
        raise HTTPException(status_code=503, detail="daily_budget_exhausted")

    # Persist the *last* user message before streaming. Earlier turns are
    # already persisted from prior /chat calls. We rely on the widget to
    # send the full history so we can deduce which message is new — it's
    # always the last one (the assistant placeholder isn't sent here).
    last = req.messages[-1]
    if req.conversation_id and last.role == "user":
        await db.append_messages(req.conversation_id, [{"role": "user", "content": last.content}])

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    # Prompt caching. The system prompt is identical across every request,
    # so we mark it as a cacheable block. Anthropic caches it for ~5 minutes
    # and bills cached reads at ~10% of the normal rate. On a hot endpoint
    # this dominates the saving.
    #
    # The per-visitor injection (name + email) goes in a separate, uncached
    # block so the big shared prompt stays cacheable across visitors.
    system_blocks: list[dict] = [
        {
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"},
        }
    ]
    if req.visitor_name or req.visitor_email:
        injection = (
            "## Current visitor\n\n"
            f"VISITOR_NAME: {req.visitor_name or '(unknown)'}\n"
            f"VISITOR_EMAIL: {req.visitor_email or '(unknown)'}\n"
        )
        system_blocks.append({"type": "text", "text": injection})

    async def event_stream():
        actual_input_tokens = estimated  # Fallback if usage block doesn't arrive
        assistant_buffer: list[str] = []
        try:
            async with client.messages.stream(
                model=settings.anthropic_model,
                max_tokens=1024,
                system=system_blocks,
                messages=[m.model_dump() for m in req.messages],
            ) as stream:
                async for text in stream.text_stream:
                    if await request.is_disconnected():
                        break
                    assistant_buffer.append(text)
                    yield _sse("token", {"text": text})
                # Final message carries the usage block.
                final = await stream.get_final_message()
                if final and final.usage:
                    u = final.usage
                    actual_input_tokens = (
                        (u.input_tokens or 0)
                        + (getattr(u, "cache_creation_input_tokens", 0) or 0)
                        + (getattr(u, "cache_read_input_tokens", 0) or 0)
                    )
            yield _sse("done", {})
        except Exception as exc:
            print(f"[chat] stream error: {type(exc).__name__}: {str(exc)[:300]}")
            yield _sse("error", {"message": "stream_failed"})
        finally:
            # Correct the reservation to actuals. Best-effort.
            await budget.record_actual(estimated, actual_input_tokens)
            # Persist the assistant reply now we know it in full. Empty
            # buffers (early disconnect with no tokens) aren't saved.
            full_reply = "".join(assistant_buffer).strip()
            if req.conversation_id and full_reply:
                await db.append_messages(
                    req.conversation_id,
                    [{"role": "assistant", "content": full_reply}],
                )

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
