"""Admin endpoints for peeking at the conversation archive.

Lightweight read-only views over the Postgres tables. Gated by an
ADMIN_TOKEN env var; missing token → 401, mismatching → 403.

This is intentionally minimal — not a full admin UI. Just enough that
Adam can hit a URL with a bearer header and see what's landed without
needing Coolify terminal access.

  GET /admin/conversations             — recent conversations (50)
  GET /admin/conversations/{id}        — full transcript for one

Both return JSON. Both require:
    Authorization: Bearer <ADMIN_TOKEN>
"""
from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings
from app.services import db

router = APIRouter(prefix="/admin")

# auto_error=False so we can return a clear 401 instead of FastAPI's
# default 403 when no Authorization header is sent.
_bearer = HTTPBearer(auto_error=False)


def _require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> None:
    if not settings.admin_token:
        # Refuse to expose admin routes if no token is configured —
        # don't fall back to "no auth" on a missing env var.
        raise HTTPException(status_code=503, detail="admin_not_configured")
    if credentials is None:
        raise HTTPException(status_code=401, detail="missing_token")
    if credentials.credentials != settings.admin_token:
        raise HTTPException(status_code=403, detail="bad_token")


def _iso(dt: datetime | None) -> str | None:
    return dt.isoformat() if dt else None


@router.get("/conversations")
async def list_conversations(_: None = Depends(_require_admin)) -> dict:
    rows = await db.list_recent_conversations(limit=50)
    return {
        "conversations": [
            {
                "id": r["id"],
                "name": r["name"],
                "email": r["email"],
                "page_url": r["page_url"],
                "contact_id": r["contact_id"],
                "started_at": _iso(r["started_at"]),
                "last_message_at": _iso(r["last_message_at"]),
                "captured_at": _iso(r["captured_at"]),
                "message_count": r["message_count"],
            }
            for r in rows
        ],
    }


@router.get("/conversations/{conv_id}")
async def get_conversation(conv_id: int, _: None = Depends(_require_admin)) -> dict:
    messages = await db.get_conversation_messages(conv_id)
    return {
        "conversation_id": conv_id,
        "messages": [
            {"role": m["role"], "content": m["content"], "created_at": _iso(m["created_at"])}
            for m in messages
        ],
    }
