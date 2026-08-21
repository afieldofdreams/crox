"""Posting to Instagram (@familyfredmin) for the content routine.

Uses the "Instagram API with Instagram Login" product — the variant
verified in August 2026 to need no App Review and no Facebook Page for
posting to our own account, provided the Meta app stays in Development
mode and the account is added as an Instagram Tester.

Two constraints shape everything here:

  - The API accepts JPEG only, and only by *public URL* — Instagram's
    servers fetch the image; bytes cannot be pushed. The /media store
    (app/api/media.py) exists to satisfy both: it converts whatever is
    uploaded to JPEG and serves it publicly.
  - There is no text-only post. A queue item with platform "instagram"
    must carry an image_url or it is refused at queue time and again here.

Auth: Instagram Login issues a long-lived token (~60 days) that CAN be
refreshed — unlike LinkedIn's member token — as long as the token is
at least a day old and not yet expired. Publishing refreshes it
opportunistically when under 15 days remain, so the connection renews
itself while posting continues. A lapse only happens if nothing posts
for two months, in which case /instagram/auth is a one-click re-connect.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx

from app.config import settings
from app.services import db

_AUTH_URL = "https://www.instagram.com/oauth/authorize"
_SHORT_TOKEN_URL = "https://api.instagram.com/oauth/access_token"
_GRAPH = "https://graph.instagram.com"
_API_VERSION = "v23.0"

_SCOPES = "instagram_business_basic,instagram_business_content_publish"

# Instagram truncates nothing — it refuses. Caption hard limit per the
# Content Publishing API docs.
MAX_CAPTION = 2_200

# Refresh the long-lived token once it's inside this window. The API
# requires the token to be older than 24h to refresh, hence the
# updated_at check in _ensure_token.
_REFRESH_WINDOW = timedelta(days=15)


def is_configured() -> bool:
    return bool(settings.instagram_app_id and settings.instagram_app_secret)


async def is_connected() -> bool:
    return await db.get_instagram_auth() is not None


def redirect_uri() -> str:
    """Must be registered verbatim under the app's Instagram business
    login settings (HTTPS is mandatory there)."""
    return f"{settings.base_url}/instagram/callback"


def auth_url(state: str) -> str:
    params = {
        "client_id": settings.instagram_app_id,
        "redirect_uri": redirect_uri(),
        "response_type": "code",
        "scope": _SCOPES,
        "state": state,
    }
    return f"{_AUTH_URL}?{urlencode(params)}"


async def exchange_code(code: str) -> dict:
    """Authorisation code → short-lived token → long-lived token (~60
    days), persisted with the Instagram user id. Returns {"ok",
    "error", "username"}."""
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                _SHORT_TOKEN_URL,
                data={
                    "client_id": settings.instagram_app_id,
                    "client_secret": settings.instagram_app_secret,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect_uri(),
                    "code": code,
                },
            )
            if resp.status_code >= 300:
                return {"ok": False, "error": f"ig_token_{resp.status_code}: {resp.text[:200]}"}
            body = resp.json()
            # Business login wraps the payload in a data array; be
            # tolerant of the flat shape too.
            if isinstance(body.get("data"), list) and body["data"]:
                body = body["data"][0]
            short_token = body.get("access_token")
            user_id = body.get("user_id")
            if not short_token or not user_id:
                return {"ok": False, "error": "ig_token_malformed"}

            long_resp = await client.get(
                f"{_GRAPH}/access_token",
                params={
                    "grant_type": "ig_exchange_token",
                    "client_secret": settings.instagram_app_secret,
                    "access_token": short_token,
                },
            )
            if long_resp.status_code >= 300:
                return {"ok": False, "error": f"ig_exchange_{long_resp.status_code}: {long_resp.text[:200]}"}
            long_body = long_resp.json()
            token = long_body.get("access_token")
            expires_in = int(long_body.get("expires_in", 0)) or 5_184_000
            if not token:
                return {"ok": False, "error": "ig_exchange_malformed"}

            username = None
            me = await client.get(
                f"{_GRAPH}/{_API_VERSION}/me",
                params={"fields": "username", "access_token": token},
            )
            if me.status_code < 300:
                username = me.json().get("username")

        expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
        if not await db.save_instagram_auth(token, str(user_id), expires_at):
            return {"ok": False, "error": "db_unavailable"}
        return {"ok": True, "error": None, "username": username}
    except Exception as exc:
        return {"ok": False, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


async def _ensure_token() -> dict:
    """Return {"token", "user_id", "error"}, refreshing the long-lived
    token when it is inside the refresh window. The refresh endpoint
    rejects tokens younger than 24h, so a freshly connected account
    simply skips the refresh until tomorrow."""
    auth = await db.get_instagram_auth()
    if not auth:
        return {"token": None, "user_id": None, "error": "instagram_not_connected"}
    now = datetime.now(timezone.utc)
    if auth["expires_at"] <= now:
        return {"token": None, "user_id": None, "error": "instagram_token_expired (re-auth at /instagram/auth)"}

    if auth["expires_at"] - now < _REFRESH_WINDOW and now - auth["updated_at"] > timedelta(hours=24):
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.get(
                    f"{_GRAPH}/refresh_access_token",
                    params={
                        "grant_type": "ig_refresh_token",
                        "access_token": auth["access_token"],
                    },
                )
            if resp.status_code < 300:
                body = resp.json()
                token = body.get("access_token")
                expires_in = int(body.get("expires_in", 0)) or 5_184_000
                if token:
                    expires_at = now + timedelta(seconds=expires_in)
                    await db.save_instagram_auth(token, auth["user_id"], expires_at)
                    return {"token": token, "user_id": auth["user_id"], "error": None}
            # Refresh failing is not fatal while the current token still
            # works — publish with it and let the next attempt retry.
            print(f"[instagram] token refresh failed ({resp.status_code}): {resp.text[:200]}")
        except Exception as exc:
            print(f"[instagram] token refresh error: {type(exc).__name__}: {str(exc)[:200]}")
    return {"token": auth["access_token"], "user_id": auth["user_id"], "error": None}


async def publish(body: str, *, image_url: str | None = None, **_ignored) -> dict:
    """Post a single image with caption. Returns {"ok", "post_id",
    "error"} to match the other publishers so the queue can dispatch on
    platform alone.

    Two-step flow: create a media container from the public image URL,
    wait for Instagram to fetch and process it, then publish the
    container. The image MUST be a JPEG at a publicly fetchable URL —
    the /media store guarantees both.
    """
    if not is_configured():
        return {"ok": False, "post_id": None, "error": "instagram_not_configured"}
    if not image_url:
        return {"ok": False, "post_id": None, "error": "instagram_needs_image"}
    if len(body) > MAX_CAPTION:
        return {"ok": False, "post_id": None, "error": f"instagram_caption_too_long_{len(body)}"}

    auth = await _ensure_token()
    if not auth["token"]:
        return {"ok": False, "post_id": None, "error": auth["error"]}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            container = await client.post(
                f"{_GRAPH}/{_API_VERSION}/{auth['user_id']}/media",
                data={
                    "image_url": image_url,
                    "caption": body,
                    "access_token": auth["token"],
                },
            )
            if container.status_code >= 300:
                return {"ok": False, "post_id": None, "error": f"instagram_container_{container.status_code}: {container.text[:200]}"}
            container_id = container.json().get("id")
            if not container_id:
                return {"ok": False, "post_id": None, "error": "instagram_container_malformed"}

            # Instagram fetches the image asynchronously; publishing an
            # unfinished container fails. Single images are usually
            # ready in a second or two — poll briefly rather than sleep
            # blind.
            for _ in range(10):
                status = await client.get(
                    f"{_GRAPH}/{_API_VERSION}/{container_id}",
                    params={"fields": "status_code,status", "access_token": auth["token"]},
                )
                code = status.json().get("status_code") if status.status_code < 300 else None
                if code == "FINISHED":
                    break
                if code == "ERROR":
                    detail = status.json().get("status", "")
                    return {"ok": False, "post_id": None, "error": f"instagram_processing: {str(detail)[:200]}"}
                await asyncio.sleep(3)
            else:
                return {"ok": False, "post_id": None, "error": "instagram_processing_timeout"}

            pub = await client.post(
                f"{_GRAPH}/{_API_VERSION}/{auth['user_id']}/media_publish",
                data={"creation_id": container_id, "access_token": auth["token"]},
            )
            if pub.status_code >= 300:
                return {"ok": False, "post_id": None, "error": f"instagram_publish_{pub.status_code}: {pub.text[:200]}"}
            return {"ok": True, "post_id": pub.json().get("id"), "error": None}
    except Exception as exc:
        return {"ok": False, "post_id": None, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


async def status_summary() -> str:
    if not is_configured():
        return "Instagram: not configured (needs instagram_app_id and instagram_app_secret)."
    auth = await db.get_instagram_auth()
    if not auth:
        return "Instagram: configured but not connected — run the flow at /instagram/auth."
    days = (auth["expires_at"] - datetime.now(timezone.utc)).days
    if days <= 0:
        return "Instagram: token EXPIRED — re-authorise at /instagram/auth."
    return f"Instagram: connected, token valid {days} more days (renews itself while posting)."
