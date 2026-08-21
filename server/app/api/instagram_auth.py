"""Instagram connection for the content routine.

Routes:
  GET /instagram/status    — configured? connected? (admin)
  GET /instagram/auth      — start OAuth; returns the URL to open (admin)
  GET /instagram/callback  — Instagram redirects here (HMAC state check)

Mirrors the X flow. Uses "Instagram API with Instagram Login": the Meta
app stays in Development mode, @familyfredmin is added as an Instagram
Tester, and no App Review or Facebook Page is involved.

Posting itself lives in the shared queue — POST /linkedin/queue with
{"platform": "instagram", "image_url": ...} — there is no separate
Instagram queue. Images must be public JPEG URLs; POST /media provides
them.
"""
from __future__ import annotations

import hashlib
import hmac

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse

from app.api.admin import _require_admin
from app.config import settings
from app.services import instagram

router = APIRouter()

_PAGE = (
    "<!doctype html><html><body style='font-family:Georgia,serif;padding:3rem'>"
    "<h1>{h}</h1><p>{p}</p></body></html>"
)


def _state_token() -> str:
    secret = settings.unsubscribe_secret or settings.admin_token
    return hmac.new(secret.encode(), b"instagram-oauth-state", hashlib.sha256).hexdigest()[:32]


def _require_configured() -> None:
    if not instagram.is_configured():
        raise HTTPException(status_code=503, detail="instagram_not_configured")


@router.get("/instagram/status")
async def instagram_status(_: None = Depends(_require_admin)) -> dict:
    configured = instagram.is_configured()
    return {
        "configured": configured,
        "connected": await instagram.is_connected() if configured else False,
        # The exact string to register under the Meta app's Instagram
        # business-login settings — it must match verbatim.
        "redirect_uri": instagram.redirect_uri(),
        "auth_url": f"{settings.base_url}/instagram/auth" if configured else None,
        "summary": await instagram.status_summary() if configured else "Instagram: not configured.",
    }


@router.get("/instagram/auth")
async def instagram_auth(_: None = Depends(_require_admin)) -> dict:
    """Returns the Instagram consent URL for Adam to open in a browser
    logged in as @familyfredmin. Deliberately not a redirect: the admin
    token lives in curl and routines, the consent click in a browser."""
    _require_configured()
    return {
        "open_this_url": instagram.auth_url(_state_token()),
        "redirect_uri": instagram.redirect_uri(),
        "note": "Log in as the account that should post (@familyfredmin) before opening.",
    }


@router.get("/instagram/callback", response_class=HTMLResponse)
async def instagram_callback(code: str = "", state: str = "", error: str = "", error_description: str = "") -> HTMLResponse:
    _require_configured()
    if error or not code:
        return HTMLResponse(
            _PAGE.format(h="Instagram connection failed", p=error_description or error or "no code returned"),
            status_code=400,
        )
    if not hmac.compare_digest(state, _state_token()):
        return HTMLResponse(
            _PAGE.format(h="Invalid state", p="Restart from /instagram/auth."), status_code=400
        )
    result = await instagram.exchange_code(code)
    if not result["ok"]:
        return HTMLResponse(
            _PAGE.format(h="Instagram connection failed", p=result["error"]), status_code=502
        )
    who = f" as @{result['username']}" if result.get("username") else ""
    return HTMLResponse(
        _PAGE.format(
            h="Instagram connected",
            p=f"Posting is live{who}. The token renews itself while posting "
            "continues, so this should not need doing again unless posting "
            "stops for two months. You can close this tab.",
        )
    )
