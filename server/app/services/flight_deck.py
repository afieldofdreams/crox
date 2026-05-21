"""Client for flight-deck.crox.io /api/forms.

This is the only correct way for any Crox property to upsert a contact
into the Fibery CRM. Flight-deck handles identity resolution (token →
email lookup → create-new), Fibery upsert, tracking-token minting, and
PostHog identity bridging in one place. Reproducing any of that here
would create drift.

CSRF contract (see flight-deck/dashboard/lib/csrf.ts):
    Signed payload: <ts>.<visitor_id>.<project_host>.<bodyHash>
    Signature:      HMAC-SHA256(secret, payload), base64-url no-pad
    Header:         x-flight-deck-csrf: <ts>.<signature>
    Window:         5 minutes from ts

`visitor_id` MUST be a UUID — flight-deck validates this and 400s
otherwise. Browsers get one from track.js (`crox_vid` cookie). If a
visitor arrives via the chat without ever seeing track.js (e.g. a bot
or a stripped-cookies browser), we synthesise a fresh UUID per
capture; flight-deck's engagement-table merge will be a no-op which is
fine.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
import uuid
from typing import Any

import httpx

from app.config import settings


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _body_hash(raw_json: str) -> str:
    return _b64url(hashlib.sha256(raw_json.encode("utf-8")).digest())


def is_configured() -> bool:
    return bool(settings.form_csrf_secret)


def _sign(payload: str) -> str:
    if not settings.form_csrf_secret:
        raise RuntimeError("FORM_CSRF_SECRET not configured")
    return _b64url(
        hmac.new(
            settings.form_csrf_secret.encode("utf-8"),
            payload.encode("utf-8"),
            hashlib.sha256,
        ).digest()
    )


def ensure_visitor_id(provided: str | None) -> str:
    """Use the client's track.js visitor_id if it's a UUID; otherwise mint one.

    Flight-deck's /api/forms requires a UUID-shaped visitor_id. Track.js
    sets one in the `crox_vid` cookie and exposes it as
    `window.croxAttribution.visitorId`. Anonymous / bot traffic that
    didn't load track.js still needs *some* UUID for the form to be
    accepted — a synthetic one is fine because flight-deck only uses it
    to merge engagement rows we don't have anyway.
    """
    if provided:
        try:
            uuid.UUID(provided)
            return provided
        except ValueError:
            pass
    return str(uuid.uuid4())


async def submit_form(
    *,
    visitor_id: str,
    page_url: str,
    form_fields: dict[str, Any],
    contact_ref: str | None = None,
) -> dict[str, Any]:
    """POST to flight-deck /api/forms. Returns the parsed response body.

    Raises httpx.HTTPStatusError on non-2xx (caller decides whether the
    capture path itself fails or just logs and continues).
    """
    payload = {
        "project_host": settings.project_host,
        "visitor_id": visitor_id,
        "page_url": page_url,
        "form_fields": form_fields,
    }
    if contact_ref:
        # Flight-deck accepts either a tracking-token OR a UUID here. The
        # field name is utm_content for historical reasons (it doubles as
        # a UTM param in attribution links).
        payload["utm_content"] = contact_ref

    raw = json.dumps(payload, separators=(",", ":"))
    ts = int(time.time() * 1000)
    signed_payload = f"{ts}.{visitor_id}.{settings.project_host}.{_body_hash(raw)}"
    signature = _sign(signed_payload)

    headers = {
        "Content-Type": "application/json",
        "Origin": f"https://{settings.project_host}",
        "x-flight-deck-csrf": f"{ts}.{signature}",
    }
    url = f"{settings.flight_deck_base_url.rstrip('/')}/api/forms"

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(url, content=raw, headers=headers)
        resp.raise_for_status()
        return resp.json()
