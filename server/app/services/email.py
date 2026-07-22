"""Resend email client. Used by the admin email-send endpoint.

When Adam clicks 'Send email' on a contact in the Flight Deck admin,
the request POSTs to /admin/contacts/{email}/send-email which calls
this module. The Resend message id (if returned) is persisted to the
outbound_emails table so the admin can show what's been sent.

Failure mode: returns a SendResult dataclass with `ok=False` and an
error string rather than raising. The admin endpoint persists both
success and failure rows so the operator can see what was attempted.
"""
from __future__ import annotations

from dataclasses import dataclass

import httpx

from app.config import settings


_RESEND_EMAILS_URL = "https://api.resend.com/emails"


@dataclass(frozen=True)
class SendResult:
    ok: bool
    resend_id: str | None = None
    error: str | None = None


def is_configured() -> bool:
    return bool(settings.resend_api_key)


async def send(
    *,
    to: str,
    subject: str,
    text: str,
    reply_to: str | None = None,
    from_address: str | None = None,
    headers: dict[str, str] | None = None,
) -> SendResult:
    """Send an email via Resend.

    `from_address` defaults to settings.assessment_from_email if not
    given. `headers` lets callers set extras like List-Unsubscribe.
    Returns a SendResult with the Resend id (or error string) so the
    caller can persist it.
    """
    if not is_configured():
        return SendResult(ok=False, error="resend_not_configured")

    payload: dict[str, object] = {
        "from": from_address or settings.assessment_from_email,
        "to": [to],
        "subject": subject,
        "text": text,
    }
    if reply_to:
        payload["reply_to"] = reply_to
    if headers:
        payload["headers"] = headers

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                _RESEND_EMAILS_URL,
                headers={
                    "Authorization": f"Bearer {settings.resend_api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if resp.status_code >= 300:
                err = f"resend_{resp.status_code}: {resp.text[:300]}"
                print(f"[email] {err}")
                return SendResult(ok=False, error=err)
            body = resp.json()
            return SendResult(ok=True, resend_id=str(body.get("id")) if body.get("id") else None)
    except Exception as exc:
        err = f"{type(exc).__name__}: {str(exc)[:200]}"
        print(f"[email] send failed: {err}")
        return SendResult(ok=False, error=err)


async def get_status(resend_id: str) -> dict:
    """Fetch delivery/engagement state for a sent email from Resend.

    Returns {"last_event": str | None, "error": str | None}. Resend's
    last_event moves through sent → delivered → opened/clicked (opens and
    clicks only appear if tracking is enabled on the sending domain), or
    bounced/complained/delivery_delayed on failure paths.
    """
    if not is_configured():
        return {"last_event": None, "error": "resend_not_configured"}
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                f"{_RESEND_EMAILS_URL}/{resend_id}",
                headers={"Authorization": f"Bearer {settings.resend_api_key}"},
            )
            if resp.status_code >= 300:
                return {"last_event": None, "error": f"resend_{resp.status_code}"}
            body = resp.json()
            return {"last_event": body.get("last_event"), "error": None}
    except Exception as exc:
        return {"last_event": None, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}
