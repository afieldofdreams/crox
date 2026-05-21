"""Minimal Fibery client for appending chat transcripts to CRM/Contact records.

Flight-deck `/api/forms` owns the canonical contact upsert (see
flight_deck.submit_form). After we have a contact_id back from there,
this module appends a structured Activity Stream entry so the chat
shows up on the per-contact timeline in flight-deck admin.

Reference implementation: ~/Code/Personal/canary/app/services/crm.py
which does the same thing for Stripe / form / lifecycle events.

Failure mode: every public function returns False on failure and never
raises. The capture path treats Fibery as best-effort — losing a
transcript append is preferable to losing the lead. The contact still
exists; flight-deck already saw the form submission.
"""
from __future__ import annotations

import json
from datetime import UTC, datetime

import httpx

from app.config import settings


CRM_TYPE = "CRM/Contact"
STREAM_FIELD = "CRM/Activity Stream"


def _enabled() -> bool:
    return bool(settings.fibery_token and settings.fibery_host)


def _api_url(path: str) -> str:
    return f"https://{settings.fibery_host}{path}"


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Token {settings.fibery_token}",
        "Content-Type": "application/json",
    }


async def _stream_secret(client: httpx.AsyncClient, contact_id: str) -> str | None:
    """Resolve the document secret for a contact's Activity Stream field."""
    res = await client.post(
        _api_url("/api/commands"),
        headers=_headers(),
        content=json.dumps([{
            "command": "fibery.entity/query",
            "args": {
                "query": {
                    "q/from": CRM_TYPE,
                    "q/select": {
                        "secret": [STREAM_FIELD, "Collaboration~Documents/secret"],
                    },
                    "q/where": ["=", ["fibery/id"], "$id"],
                    "q/limit": 1,
                },
                "params": {"$id": contact_id},
            },
        }]),
    )
    if res.status_code >= 300:
        return None
    body = res.json()
    if not body or not body[0].get("success"):
        return None
    rows = body[0].get("result", [])
    return rows[0].get("secret") if rows else None


async def _append_activity_entry(contact_id: str, label: str, body_md: str) -> bool:
    """Append a labelled entry to the contact's Activity Stream.

    Format follows the Stance Library convention used elsewhere in the
    CRM so the per-contact admin timeline reads consistently:

        **[YYYY-MM-DD HH:MM UTC | <label>]**
        <body_md>

    Best-effort. Failures log and return False.
    """
    if not _enabled() or not contact_id:
        return False

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            secret = await _stream_secret(client, contact_id)
            if not secret:
                print(f"[fibery] no Activity Stream doc on {contact_id}")
                return False

            r = await client.get(
                _api_url(f"/api/documents/{secret}?format=md"),
                headers=_headers(),
            )
            existing = ""
            if r.status_code == 200:
                existing = (r.json().get("content") or "").rstrip()

            stamp = datetime.now(UTC).strftime("%Y-%m-%d %H:%M UTC")
            block = f"**[{stamp} | {label}]**\n{body_md.strip()}"
            new_content = (existing + "\n\n" + block + "\n") if existing else (block + "\n")

            w = await client.put(
                _api_url(f"/api/documents/{secret}?format=md"),
                headers=_headers(),
                content=json.dumps({"content": new_content}),
            )
            return w.status_code in (200, 204)
    except Exception as exc:
        print(f"[fibery] _append_activity_entry({label}) failed: {type(exc).__name__}: {str(exc)[:200]}")
        return False


async def append_chat_transcript(contact_id: str, transcript_md: str) -> bool:
    """Append a chat-widget transcript to the contact's Activity Stream."""
    return await _append_activity_entry(contact_id, "Chat capture", transcript_md)


async def append_contact_form_message(contact_id: str, message_md: str) -> bool:
    """Append a general contact-form submission to the contact's Activity Stream."""
    return await _append_activity_entry(contact_id, "Contact form", message_md)
