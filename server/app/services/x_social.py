"""Posting to X (Twitter) for the weekly content routine.

Posts to Adam's own account via the X API v2 `POST /2/tweets` endpoint
using OAuth 2.0 with a refresh token, which is the only user-context
auth X still offers for writes.

Billing note (X moved to pay-per-use in February 2026): a post costs
about $0.015, but a post *containing a link* costs about $0.20 — more
than thirteen times as much. Our posts are text-only anyway (Adam's
reach call), so we stay on the cheap rate. If links are ever
reintroduced, that decision has a bill attached.

Auth: X access tokens are short-lived (about two hours), so unlike the
LinkedIn member token we cannot store one and forget it. We store the
refresh token in config and mint an access token per publish. Refresh
tokens rotate on every use, so the newly returned one is persisted.
"""
from __future__ import annotations

import base64

import httpx

from app.config import settings
from app.services import db

_TOKEN_URL = "https://api.x.com/2/oauth2/token"
_TWEETS_URL = "https://api.x.com/2/tweets"

# X Premium raises the limit to 25,000; standard accounts are 280. Adam
# is on Premium (confirmed 2026-08-10), so the long-form LinkedIn copy
# can be reposted verbatim. Kept as a guard rather than a silent trim —
# a truncated post is worse than a refused one.
MAX_CHARS = 25_000


def is_configured() -> bool:
    return bool(
        settings.x_client_id
        and settings.x_client_secret
        and settings.x_refresh_token
    )


async def _access_token() -> dict:
    """Mint a short-lived access token from the stored refresh token.
    X rotates refresh tokens on use, so persist whatever comes back or
    the next publish fails with an invalid_grant."""
    refresh = await db.get_x_refresh_token() or settings.x_refresh_token
    if not refresh:
        return {"token": None, "error": "not_connected"}
    basic = base64.b64encode(
        f"{settings.x_client_id}:{settings.x_client_secret}".encode()
    ).decode()
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                _TOKEN_URL,
                data={
                    "grant_type": "refresh_token",
                    "refresh_token": refresh,
                    "client_id": settings.x_client_id,
                },
                headers={
                    "Authorization": f"Basic {basic}",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            )
        if resp.status_code >= 300:
            return {"token": None, "error": f"x_token_{resp.status_code}: {resp.text[:200]}"}
        body = resp.json()
        if body.get("refresh_token") and body["refresh_token"] != refresh:
            await db.save_x_refresh_token(body["refresh_token"])
        return {"token": body.get("access_token"), "error": None}
    except Exception as exc:
        return {"token": None, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


async def publish(body: str, **_ignored) -> dict:
    """Post to X. Returns {"ok", "post_id", "error"} to match the
    LinkedIn publisher so the queue can dispatch on platform alone.

    Attachments are accepted and ignored: media upload on X needs the
    v1.1 endpoint and is not wired up, so silently posting text without
    the image would be worse than the caller knowing it was dropped.
    """
    if not is_configured():
        return {"ok": False, "post_id": None, "error": "x_not_configured"}
    if len(body) > MAX_CHARS:
        return {"ok": False, "post_id": None, "error": f"x_too_long_{len(body)}"}

    auth = await _access_token()
    if not auth["token"]:
        return {"ok": False, "post_id": None, "error": auth["error"]}
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                _TWEETS_URL,
                json={"text": body},
                headers={
                    "Authorization": f"Bearer {auth['token']}",
                    "Content-Type": "application/json",
                },
            )
        if resp.status_code >= 300:
            return {"ok": False, "post_id": None, "error": f"x_{resp.status_code}: {resp.text[:200]}"}
        data = resp.json().get("data", {})
        return {"ok": True, "post_id": data.get("id"), "error": None}
    except Exception as exc:
        return {"ok": False, "post_id": None, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


async def status_summary() -> str:
    if not is_configured():
        return "X: not configured (needs x_client_id, x_client_secret, x_refresh_token)."
    auth = await _access_token()
    if not auth["token"]:
        return f"X: configured but cannot mint a token — {auth['error']}. Re-authorise."
    return "X: connected."
