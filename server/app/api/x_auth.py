"""X (Twitter) connection for the weekly content routine.

Routes:
  GET /x/status    — configured? connected? (admin)
  GET /x/auth      — start OAuth; returns the URL to open (admin)
  GET /x/callback  — X redirects here (HMAC state check)

Mirrors the LinkedIn flow deliberately, with one difference: X requires
PKCE, and its authorisation codes expire 30 seconds after issue.

Posting itself lives in the shared queue — POST /linkedin/queue with
{"platform": "x"} — so there is no separate X queue to manage.
"""
from __future__ import annotations

import hashlib
import hmac

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse

from app.api.admin import _require_admin
from app.config import settings
from app.services import db, x_social

router = APIRouter()

_PAGE = (
    "<!doctype html><html><body style='font-family:Georgia,serif;padding:3rem'>"
    "<h1>{h}</h1><p>{p}</p></body></html>"
)


def _state_token() -> str:
    secret = settings.unsubscribe_secret or settings.admin_token
    return hmac.new(secret.encode(), b"x-oauth-state", hashlib.sha256).hexdigest()[:32]


def _require_configured() -> None:
    if not (settings.x_client_id and settings.x_client_secret):
        raise HTTPException(status_code=503, detail="x_not_configured")


@router.get("/x/status")
async def x_status(_: None = Depends(_require_admin)) -> dict:
    configured = bool(settings.x_client_id and settings.x_client_secret)
    refresh = await db.get_x_refresh_token() if configured else None
    return {
        "configured": configured,
        "connected": bool(refresh or settings.x_refresh_token),
        # The exact string to paste into the X app's Callback URI field.
        # X requires an exact match, so this is worth reading rather than
        # retyping from memory.
        "redirect_uri": x_social.redirect_uri(),
        "auth_url": f"{settings.base_url}/x/auth" if configured else None,
        "summary": await x_social.status_summary() if configured else "X: not configured.",
    }


@router.get("/x/auth")
async def x_auth(_: None = Depends(_require_admin)) -> dict:
    """Returns the X consent URL for Adam to open in a browser.
    Deliberately not a redirect: the admin token lives in curl and
    routines, while the consent click happens in a logged-in browser."""
    _require_configured()
    return {
        "open_this_url": x_social.auth_url(_state_token()),
        "redirect_uri": x_social.redirect_uri(),
        "note": "The code expires 30 seconds after you approve — don't leave the tab sitting.",
    }


@router.get("/x/callback", response_class=HTMLResponse)
async def x_callback(code: str = "", state: str = "", error: str = "") -> HTMLResponse:
    _require_configured()
    if error or not code:
        return HTMLResponse(
            _PAGE.format(h="X connection failed", p=error or "no code returned"),
            status_code=400,
        )
    if not hmac.compare_digest(state, _state_token()):
        return HTMLResponse(
            _PAGE.format(h="Invalid state", p="Restart from /x/auth."), status_code=400
        )
    result = await x_social.exchange_code(code)
    if not result["ok"]:
        return HTMLResponse(
            _PAGE.format(h="X connection failed", p=result["error"]), status_code=502
        )
    return HTMLResponse(
        _PAGE.format(
            h="X connected",
            p="Posting is live. The refresh token renews itself on every post, "
            "so this should not need doing again. You can close this tab.",
        )
    )
