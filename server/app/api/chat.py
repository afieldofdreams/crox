"""POST /chat — Server-Sent Events stream of a Claude completion.

The frontend chat widget posts the full conversation history (stateless on
the server) and consumes the SSE stream. Events emitted:

    event: token   — data: {"text": "<chunk>"}
    event: done    — data: {}
    event: error   — data: {"message": "<short reason>"}

System prompt is loaded from prompts/system.md on every request so it can
be edited without a redeploy in development. In production it ships in
the Docker image; a redeploy is needed to change it.

Cost controls (see memory: feedback-cost-monitoring):
- Defaults to Haiku 4.5; configurable via ANTHROPIC_MODEL.
- System prompt is marked with cache_control so Anthropic caches it
  across requests (~10× cheaper input after the first hit).
- Daily input-token budget is enforced via app.budget. Exhausted budget
  returns 503 without calling Anthropic.
"""
from __future__ import annotations

import json
from pathlib import Path

from anthropic import AsyncAnthropic
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from app import budget
from app.config import settings

router = APIRouter()


SYSTEM_PROMPT_PATH = Path(__file__).resolve().parents[2] / "prompts" / "system.md"


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(..., min_length=1, max_length=80)
    contact_ref: str | None = None  # tracking token or fibery_id if known


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

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)

    # Prompt caching. The system prompt is identical across every request,
    # so we mark it as a cacheable block. Anthropic caches it for ~5 minutes
    # and bills cached reads at ~10% of the normal rate. On a hot endpoint
    # this dominates the saving.
    system_blocks = [
        {
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"},
        }
    ]

    async def event_stream():
        actual_input_tokens = estimated  # Fallback if usage block doesn't arrive
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
                    yield _sse("token", {"text": text})
                # Final message carries the usage block.
                final = await stream.get_final_message()
                if final and final.usage:
                    # Sum: regular input + cache-write input (full price) + cache-read (10%).
                    # For budget purposes we count everything that gets billed as input.
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
            # Correct the reservation to actuals. Best-effort; budget tracking
            # is a safety net, not billing — flight-deck Widget #4 is truth.
            await budget.record_actual(estimated, actual_input_tokens)

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache, no-transform",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
