"""Tracked short links — owned click data for social posts.

Every LinkedIn post's link points at /l/<tag> instead of the raw
article URL, so click counts per post live in our own Postgres and the
weekly content routine can read what actually got clicked (LinkedIn's
API does not expose member post analytics on standard tiers).

Routes:
  POST /links        — create/update a tag → target mapping (admin)
  GET  /l/{tag}      — public redirect + click log
  GET  /links/stats  — clicks per tag, total and last-7-days (admin)
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field

from app.api.admin import _require_admin
from app.services import db

router = APIRouter()

_FALLBACK = "https://crox.io"


class LinkRequest(BaseModel):
    tag: str = Field(..., min_length=1, max_length=64, pattern=r"^[a-z0-9\-]+$")
    target: str = Field(..., min_length=8, max_length=1000)


@router.post("/links")
async def create_link(req: LinkRequest, _: None = Depends(_require_admin)) -> dict:
    if not req.target.startswith("https://"):
        raise HTTPException(status_code=422, detail="https_targets_only")
    ok = await db.upsert_tracked_link(req.tag, req.target)
    if not ok:
        raise HTTPException(status_code=503, detail="db_unavailable")
    return {"tag": req.tag, "url": f"https://chat.crox.io/l/{req.tag}"}


@router.get("/l/{tag}")
async def follow_link(tag: str, request: Request) -> RedirectResponse:
    target = await db.get_tracked_link(tag)
    if target:
        await db.log_link_click(
            tag,
            request.headers.get("referer"),
            request.headers.get("user-agent", "")[:300],
        )
    return RedirectResponse(url=target or _FALLBACK, status_code=302)


@router.get("/links/stats")
async def link_stats(_: None = Depends(_require_admin)) -> dict:
    rows = await db.link_click_stats()
    if rows is None:
        raise HTTPException(status_code=503, detail="db_unavailable")
    return {
        "links": [
            {
                "tag": r["tag"],
                "target": r["target"],
                "created_at": r["created_at"].isoformat(),
                "clicks_total": int(r["clicks_total"]),
                "clicks_7d": int(r["clicks_7d"]),
            }
            for r in rows
        ]
    }
