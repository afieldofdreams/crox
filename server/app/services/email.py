"""Resend email client. Best-effort, non-blocking failures.

Used only by the /assessment endpoint to mail Adam the scored
breakdown. Other CRM-shaped notifications stay on the Fibery Activity
Stream side — this service exists because the assessment lead value
is high enough to justify a direct inbox poke.

Failure mode: log and return False rather than raising. The /assessment
endpoint treats email as one of several best-effort sinks; the
canonical record is the flight-deck/Fibery contact.
"""
from __future__ import annotations

import httpx

from app.config import settings


def is_configured() -> bool:
    return bool(settings.resend_api_key)


async def send(
    *,
    to: str,
    subject: str,
    text: str,
    reply_to: str | None = None,
) -> bool:
    if not is_configured():
        print("[email] RESEND_API_KEY not set — skipping send")
        return False

    payload: dict[str, object] = {
        "from": settings.assessment_from_email,
        "to": [to],
        "subject": subject,
        "text": text,
    }
    if reply_to:
        payload["reply_to"] = reply_to

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if resp.status_code >= 300:
                print(f"[email] resend rejected {resp.status_code}: {resp.text[:200]}")
                return False
            return True
    except Exception as exc:
        print(f"[email] send failed: {type(exc).__name__}: {str(exc)[:200]}")
        return False
