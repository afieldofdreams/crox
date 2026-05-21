"""PostHog event firing for lead capture.

Server-side `capture` call keyed by the Fibery contact_id (matching the
client-side `posthog.identify(<ref>)` bridge that track.js sets up — see
memory: crox-ecosystem). Once both sides agree on the distinct_id,
flight-deck's per-contact admin timeline at /admin/contacts/<token>
picks up the event automatically.

Best-effort. Failure logs and returns False — never raises into the
capture path.
"""
from __future__ import annotations

from typing import Any

import httpx

from app.config import settings


async def fire_event(
    *,
    distinct_id: str,
    event: str,
    properties: dict[str, Any] | None = None,
) -> bool:
    """Send a single event to PostHog. distinct_id should be the Fibery
    contact_id (or tracking token) so it aligns with the browser-side
    posthog.identify() call."""
    if not settings.posthog_project_api_key or not distinct_id:
        return False
    try:
        url = f"{settings.posthog_host.rstrip('/')}/capture/"
        payload = {
            "api_key": settings.posthog_project_api_key,
            "event": event,
            "distinct_id": distinct_id,
            "properties": properties or {},
        }
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(url, json=payload)
            return resp.status_code < 300
    except Exception as exc:
        print(f"[posthog] fire_event failed: {type(exc).__name__}: {str(exc)[:200]}")
        return False
