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
import hashlib
import hmac
from urllib.parse import urlencode

import httpx

from app.config import settings
from app.services import db

_AUTH_URL = "https://x.com/i/oauth2/authorize"
_TOKEN_URL = "https://api.x.com/2/oauth2/token"
_TWEETS_URL = "https://api.x.com/2/tweets"

# tweet.write to post, users.read because X requires it alongside, and
# offline.access — without which no refresh token is issued at all and
# the connection dies in two hours.
_SCOPES = "tweet.read tweet.write users.read offline.access"

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


def redirect_uri() -> str:
    """Must match a Callback URI registered on the X app *exactly* —
    including scheme, host, path, and absence of a trailing slash."""
    return f"{settings.base_url}/x/callback"


def _code_verifier() -> str:
    """PKCE verifier, derived deterministically from a server-side secret
    rather than stored between the two legs of the flow.

    PKCE's security property is that whoever redeems the authorisation
    code must also know the verifier. Deriving it from a secret that
    never leaves the server preserves that, and avoids needing session
    state for a flow one person runs twice a year. 64 hex chars sits
    inside the 43–128 unreserved-character range the spec requires.
    """
    secret = settings.unsubscribe_secret or settings.admin_token
    return hmac.new(secret.encode(), b"x-oauth-pkce-verifier", hashlib.sha256).hexdigest()


def _code_challenge() -> str:
    digest = hashlib.sha256(_code_verifier().encode()).digest()
    return base64.urlsafe_b64encode(digest).decode().rstrip("=")


def auth_url(state: str) -> str:
    params = {
        "response_type": "code",
        "client_id": settings.x_client_id,
        "redirect_uri": redirect_uri(),
        "scope": _SCOPES,
        "state": state,
        "code_challenge": _code_challenge(),
        "code_challenge_method": "S256",
    }
    return f"{_AUTH_URL}?{urlencode(params)}"


async def exchange_code(code: str) -> dict:
    """Swap the authorisation code for tokens and persist the refresh
    token. X authorisation codes expire in 30 seconds, so a slow click
    through the consent screen shows up here as invalid_grant rather
    than anything more descriptive."""
    basic = base64.b64encode(
        f"{settings.x_client_id}:{settings.x_client_secret}".encode()
    ).decode()
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                _TOKEN_URL,
                data={
                    "grant_type": "authorization_code",
                    "code": code,
                    "client_id": settings.x_client_id,
                    "redirect_uri": redirect_uri(),
                    "code_verifier": _code_verifier(),
                },
                headers={
                    "Authorization": f"Basic {basic}",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            )
        if resp.status_code >= 300:
            return {"ok": False, "error": f"x_token_{resp.status_code}: {resp.text[:200]}"}
        body = resp.json()
        refresh = body.get("refresh_token")
        if not refresh:
            # Almost always a missing offline.access scope on the app.
            return {"ok": False, "error": "no_refresh_token (is offline.access enabled?)"}
        if not await db.save_x_refresh_token(refresh):
            return {"ok": False, "error": "db_unavailable"}
        return {"ok": True, "error": None}
    except Exception as exc:
        return {"ok": False, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


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
