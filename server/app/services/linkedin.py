"""LinkedIn auto-posting for the weekly content routine.

Posts to Adam's own profile via the official "Share on LinkedIn"
product (w_member_social). Flow:

  1. Adam creates a free LinkedIn developer app and puts its client
     id/secret in the environment (LINKEDIN_CLIENT_ID / _SECRET).
  2. GET /linkedin/auth (admin token) redirects to LinkedIn's consent
     screen; the callback stores a member access token. Standard apps
     get ~60-day tokens with no refresh, so this click repeats every
     couple of months — /linkedin/status reports days remaining.
  3. The content routine queues posts with staggered post_at times;
     a background loop in main.py publishes them when due, so the
     Monday report doubles as a veto window before anything goes out.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode

import httpx

from app.config import settings
from app.services import db, x_social

_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"
_USERINFO_URL = "https://api.linkedin.com/v2/userinfo"
_POSTS_URL = "https://api.linkedin.com/rest/posts"
# LinkedIn sunsets versions ~12 months out; keep this within the last
# year or every call fails with 426 NONEXISTENT_VERSION.
_API_VERSION = "202606"


def is_configured() -> bool:
    return bool(settings.linkedin_client_id and settings.linkedin_client_secret)


def redirect_uri() -> str:
    return f"{settings.base_url}/linkedin/callback"


def auth_url(state: str) -> str:
    params = {
        "response_type": "code",
        "client_id": settings.linkedin_client_id,
        "redirect_uri": redirect_uri(),
        "state": state,
        "scope": "openid profile w_member_social",
    }
    return f"{_AUTH_URL}?{urlencode(params)}"


async def exchange_code(code: str) -> dict:
    """Swap the OAuth code for an access token, resolve the member URN,
    and persist both. Returns {"ok": bool, "error": str | None,
    "expires_at": datetime | None}."""
    async with httpx.AsyncClient(timeout=20.0) as client:
        token_resp = await client.post(
            _TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": settings.linkedin_client_id,
                "client_secret": settings.linkedin_client_secret,
                "redirect_uri": redirect_uri(),
            },
        )
        if token_resp.status_code >= 300:
            return {"ok": False, "error": f"token_{token_resp.status_code}: {token_resp.text[:200]}"}
        token_body = token_resp.json()
        access_token = token_body.get("access_token")
        expires_in = int(token_body.get("expires_in", 0))
        if not access_token:
            return {"ok": False, "error": "no_access_token"}

        user_resp = await client.get(
            _USERINFO_URL, headers={"Authorization": f"Bearer {access_token}"}
        )
        if user_resp.status_code >= 300:
            return {"ok": False, "error": f"userinfo_{user_resp.status_code}"}
        sub = user_resp.json().get("sub")
        if not sub:
            return {"ok": False, "error": "no_member_id"}

    expires_at = datetime.now(timezone.utc) + timedelta(seconds=expires_in or 5184000)
    member_urn = f"urn:li:person:{sub}"
    saved = await db.save_linkedin_auth(access_token, member_urn, expires_at)
    if not saved:
        return {"ok": False, "error": "db_unavailable"}
    return {"ok": True, "error": None, "expires_at": expires_at}


async def _upload_image(auth: dict, image_url: str) -> dict:
    """Register an image upload, fetch the bytes from image_url, and
    push them to LinkedIn. Returns {"urn": str | None, "error": ...}."""
    headers = {
        "Authorization": f"Bearer {auth['access_token']}",
        "LinkedIn-Version": _API_VERSION,
        "X-Restli-Protocol-Version": "2.0.0",
    }
    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
            init = await client.post(
                "https://api.linkedin.com/rest/images?action=initializeUpload",
                json={"initializeUploadRequest": {"owner": auth["member_urn"]}},
                headers=headers,
            )
            if init.status_code >= 300:
                return {"urn": None, "error": f"image_init_{init.status_code}: {init.text[:200]}"}
            value = init.json().get("value", {})
            upload_url, image_urn = value.get("uploadUrl"), value.get("image")
            if not upload_url or not image_urn:
                return {"urn": None, "error": "image_init_malformed"}

            src = await client.get(image_url)
            if src.status_code >= 300 or not src.content:
                return {"urn": None, "error": f"image_fetch_{src.status_code}"}

            put = await client.put(
                upload_url,
                content=src.content,
                headers={"Authorization": f"Bearer {auth['access_token']}"},
            )
            if put.status_code >= 300:
                return {"urn": None, "error": f"image_upload_{put.status_code}"}
        return {"urn": image_urn, "error": None}
    except Exception as exc:
        return {"urn": None, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


async def publish(
    body: str,
    *,
    link_url: str | None = None,
    link_title: str | None = None,
    image_url: str | None = None,
) -> dict:
    """Post to the connected member's feed: plain text, text + link
    card, or text + image. Returns {"ok", "post_id", "error"}."""
    auth = await db.get_linkedin_auth()
    if not auth:
        return {"ok": False, "post_id": None, "error": "not_connected"}
    if auth["expires_at"] <= datetime.now(timezone.utc):
        return {"ok": False, "post_id": None, "error": "token_expired"}
    payload = {
        "author": auth["member_urn"],
        "commentary": body,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": [],
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }
    if image_url:
        upload = await _upload_image(auth, image_url)
        if not upload["urn"]:
            return {"ok": False, "post_id": None, "error": upload["error"]}
        payload["content"] = {"media": {"id": upload["urn"]}}
    elif link_url:
        payload["content"] = {"article": {"source": link_url, "title": link_title or link_url}}
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            resp = await client.post(
                _POSTS_URL,
                json=payload,
                headers={
                    "Authorization": f"Bearer {auth['access_token']}",
                    "LinkedIn-Version": _API_VERSION,
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            )
        if resp.status_code >= 300:
            return {"ok": False, "post_id": None, "error": f"linkedin_{resp.status_code}: {resp.text[:200]}"}
        return {"ok": True, "post_id": resp.headers.get("x-restli-id"), "error": None}
    except Exception as exc:
        return {"ok": False, "post_id": None, "error": f"{type(exc).__name__}: {str(exc)[:200]}"}


# Platform dispatch for the shared queue. Each publisher takes the body
# plus optional attachments and returns {"ok", "post_id", "error"}.
# Instagram is deliberately absent: it has no text-only post type, so it
# needs the image pipeline before it can be wired in at all.
_PUBLISHERS = {
    "linkedin": lambda body, **kw: publish(body, **kw),
    "x": lambda body, **kw: x_social.publish(body, **kw),
}


async def status_summary() -> str:
    """One-line health summary for alarm emails: is the connection still
    good, so the reader knows whether re-auth is also needed."""
    if not is_configured():
        return "LinkedIn: not configured (no client id/secret)."
    auth = await db.get_linkedin_auth()
    if not auth:
        return "LinkedIn: not connected — re-authorise at /linkedin/auth."
    days = (auth["expires_at"] - datetime.now(timezone.utc)).days
    if days <= 0:
        return "LinkedIn: token EXPIRED — re-authorise at /linkedin/auth."
    warn = " (expiring soon — re-authorise)" if days <= 14 else ""
    return f"LinkedIn: connected, token valid for {days} more days{warn}."


async def pending_upcoming() -> int | None:
    """How many posts are queued and still to go out. Returns None if the
    queue can't be read (so callers can tell 'empty' from 'unknown')."""
    rows = await db.list_linkedin_queue(limit=50)
    if rows is None:
        return None
    now = datetime.now(timezone.utc)
    return sum(
        1
        for r in rows
        if r.get("posted_at") is None
        and r.get("post_error") is None
        and r.get("post_at")
        and r["post_at"] > now
    )


async def flush_due() -> None:
    """Publish every queued post whose time has come. Called by the
    background loop in main.py; each post is marked posted or errored
    so failures never retry silently forever."""
    for row in await db.due_linkedin_posts():
        platform = row.get("platform") or "linkedin"
        publisher = _PUBLISHERS.get(platform)
        if publisher is None:
            # Unknown platform: record it rather than retrying forever.
            # due_linkedin_posts() skips rows with post_error, so this
            # errors once and stays put until someone looks.
            await db.mark_linkedin_post(
                row["id"], linkedin_post_id=None, error=f"unknown_platform_{platform}"
            )
            print(f"[social] queue item {row['id']} unknown platform {platform!r}")
            continue
        result = await publisher(
            row["body"],
            link_url=row.get("link_url"),
            link_title=row.get("link_title"),
            image_url=row.get("image_url"),
        )
        await db.mark_linkedin_post(
            row["id"], linkedin_post_id=result.get("post_id"), error=result.get("error")
        )
        state = "posted" if result["ok"] else f"failed: {result['error']}"
        print(f"[{platform}] queue item {row['id']} {state}")
