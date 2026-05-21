"""In-process daily token budget tracker.

A safety net, not a billing system. The Crox cost dashboard lives in
flight-deck (Widget #4) and pulls actual usage from Anthropic's
organization usage API. This module exists so a runaway request loop
can't burn through a month's budget in an hour — it refuses new chats
once the daily input-token budget is exhausted, resetting at UTC
midnight.

Counts input tokens only. Output tokens cost ~5× more but you can't
know them until the stream finishes; input is what callers control
and the more useful pre-emptive signal. For per-request streams we
add the input count post-hoc when the final usage block arrives.

Process-local state. If the service runs more than one worker the
budget multiplies by worker count — currently we deploy a single
uvicorn worker, but if that changes this needs to move to Redis or
a Postgres row.
"""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import UTC, date, datetime


@dataclass
class _BudgetState:
    day: date
    used: int = 0
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)


_state = _BudgetState(day=datetime.now(UTC).date())


async def check_and_reserve(estimated_input_tokens: int, daily_budget: int) -> bool:
    """Reserve estimated tokens against today's budget.

    Returns True if there's room (caller may proceed), False if exhausted.
    Caller is expected to call `record_actual(...)` once the real input
    token count is known so the reservation gets corrected to actuals.
    """
    async with _state.lock:
        today = datetime.now(UTC).date()
        if today != _state.day:
            _state.day = today
            _state.used = 0
        if _state.used + estimated_input_tokens > daily_budget:
            return False
        _state.used += estimated_input_tokens
        return True


async def record_actual(estimated_input_tokens: int, actual_input_tokens: int) -> None:
    """Correct a previous reservation to the actual usage."""
    async with _state.lock:
        delta = actual_input_tokens - estimated_input_tokens
        if delta != 0:
            _state.used = max(0, _state.used + delta)


def snapshot() -> dict:
    """Read-only view for /health and logs."""
    return {"day": _state.day.isoformat(), "used_input_tokens": _state.used}
