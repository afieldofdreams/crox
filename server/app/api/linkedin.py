"""LinkedIn connection + posting queue for the weekly content routine.

Routes:
  GET    /linkedin/status      — connected? days left? queue state (admin)
  GET    /linkedin/auth        — start OAuth; returns the URL to open (admin)
  GET    /linkedin/callback    — LinkedIn redirects here (HMAC state check)
  POST   /linkedin/queue       — queue posts with staggered post_at (admin)
  GET    /linkedin/queue       — list queue (admin)
  DELETE /linkedin/queue/{id}  — veto a not-yet-posted item (admin)

The queue is published by a background loop in main.py, so the Monday
content report doubles as a veto window before anything goes live.
"""
from __future__ import annotations

import hashlib
import hmac
from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

from app.api.admin import _require_admin
from app.config import settings
from app.services import db, linkedin

router = APIRouter()


def _state_token() -> str:
    secret = settings.unsubscribe_secret or settings.admin_token
    return hmac.new(
        secret.encode(), b"linkedin-oauth-state", hashlib.sha256
    ).hexdigest()[:32]


def _require_configured() -> None:
    if not linkedin.is_configured():
        raise HTTPException(status_code=503, detail="linkedin_not_configured")


@router.get("/linkedin/status")
async def linkedin_status(_: None = Depends(_require_admin)) -> dict:
    auth = await db.get_linkedin_auth()
    queue = await db.list_linkedin_queue(limit=20) or []
    now = datetime.now(timezone.utc)
    days_left = None
    if auth:
        days_left = max(0, int((auth["expires_at"] - now).total_seconds() // 86400))
    return {
        "configured": linkedin.is_configured(),
        "connected": auth is not None and auth["expires_at"] > now,
        "token_days_left": days_left,
        "reauth_url": f"{settings.base_url}/linkedin/auth" if linkedin.is_configured() else None,
        "queued": [
            {
                "id": q["id"],
                "post_at": q["post_at"].isoformat(),
                "posted_at": q["posted_at"].isoformat() if q["posted_at"] else None,
                "post_error": q["post_error"],
                "preview": q["body"][:120],
            }
            for q in queue
        ],
    }


@router.get("/linkedin/auth")
async def linkedin_auth(_: None = Depends(_require_admin)) -> dict:
    """Returns the LinkedIn consent URL for Adam to open in a browser.
    Deliberately not a redirect: the admin token lives in curl/routines,
    while the consent click happens in a logged-in browser."""
    _require_configured()
    return {"open_this_url": linkedin.auth_url(_state_token())}


@router.get("/linkedin/callback", response_class=HTMLResponse)
async def linkedin_callback(code: str = "", state: str = "", error: str = "") -> HTMLResponse:
    _require_configured()
    page = "<!doctype html><html><body style='font-family:Georgia,serif;padding:3rem'><h1>{h}</h1><p>{p}</p></body></html>"
    if error or not code:
        return HTMLResponse(page.format(h="LinkedIn connection failed", p=error or "no code returned"), status_code=400)
    if not hmac.compare_digest(state, _state_token()):
        return HTMLResponse(page.format(h="Invalid state", p="Restart from /linkedin/auth."), status_code=400)
    result = await linkedin.exchange_code(code)
    if not result["ok"]:
        return HTMLResponse(page.format(h="LinkedIn connection failed", p=result["error"]), status_code=502)
    expires = result["expires_at"].date().isoformat()
    return HTMLResponse(page.format(h="LinkedIn connected", p=f"Posting is live until {expires}. You can close this tab."))


class QueueItem(BaseModel):
    body: str = Field(..., min_length=1, max_length=2900)
    post_at: datetime
    # Which network to publish to. Defaults to linkedin so every existing
    # caller keeps working unchanged. Instagram is not accepted: it has
    # no text-only post type, so it needs the image pipeline first.
    platform: Literal["linkedin", "x"] = "linkedin"
    # Optional attachment: a link card (link_url + link_title) OR an
    # image fetched from image_url — not both.
    link_url: str | None = Field(default=None, max_length=1000)
    link_title: str | None = Field(default=None, max_length=200)
    image_url: str | None = Field(default=None, max_length=1000)


class QueueRequest(BaseModel):
    posts: list[QueueItem] = Field(..., min_length=1, max_length=10)


@router.post("/linkedin/queue")
async def queue_posts(req: QueueRequest, _: None = Depends(_require_admin)) -> dict:
    _require_configured()
    auth = await db.get_linkedin_auth()
    if not auth:
        raise HTTPException(status_code=409, detail="linkedin_not_connected")
    queued = []
    for item in req.posts:
        if item.link_url and item.image_url:
            raise HTTPException(status_code=422, detail="link_or_image_not_both")
        post_id = await db.queue_linkedin_post(
            item.body,
            item.post_at,
            link_url=item.link_url,
            link_title=item.link_title,
            image_url=item.image_url,
            platform=item.platform,
        )
        if post_id is None:
            raise HTTPException(status_code=503, detail="db_unavailable")
        queued.append({
            "id": post_id,
            "post_at": item.post_at.isoformat(),
            "platform": item.platform,
        })
    return {"queued": queued}


@router.get("/linkedin/queue")
async def get_queue(_: None = Depends(_require_admin)) -> dict:
    rows = await db.list_linkedin_queue(limit=50)
    if rows is None:
        raise HTTPException(status_code=503, detail="db_unavailable")
    return {"queue": rows}


@router.delete("/linkedin/queue/{post_id}")
async def veto_post(post_id: int, _: None = Depends(_require_admin)) -> dict:
    deleted = await db.delete_linkedin_post(post_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="not_found_or_already_posted")
    return {"deleted": post_id}
