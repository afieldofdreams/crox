"""Postgres layer for chat conversation persistence.

Two tables:

  - conversations: one row per chat session. Captures name + email on
    start, plus flight-deck contact_id once /capture succeeds, plus the
    visitor_id and page_url at start.
  - messages: append-only log of each turn within a conversation.

The database is the *raw archive* for Adam to read. Fibery Activity
Stream + flight-deck remain the canonical CRM-shaped record (one entry
per chat at the moment of capture). Postgres is what survives if Fibery
is down, what catches anonymous/abandoned conversations, and what we
can query in bulk.

Schema is applied via init_db() at app startup. We use plain DDL with
IF NOT EXISTS rather than Alembic because the schema is small and the
service is the only writer.

If DATABASE_URL is empty the module no-ops: init_db() does nothing and
the public CRUD functions return None. The /chat endpoint should still
work in that mode (useful for local dev without Postgres).
"""
from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

import asyncpg

from app.config import settings


_pool: asyncpg.Pool | None = None


def is_enabled() -> bool:
    return bool(settings.database_url)


async def init_db() -> None:
    """Create the connection pool and apply schema. Idempotent."""
    global _pool
    if not is_enabled():
        print("[db] DATABASE_URL not set — conversation persistence disabled")
        return
    if _pool is not None:
        return
    _pool = await asyncpg.create_pool(
        settings.database_url,
        min_size=1,
        max_size=10,
        command_timeout=10,
    )
    async with _pool.acquire() as conn:
        await conn.execute(SCHEMA_SQL)
    print("[db] connection pool ready, schema applied")


async def close_db() -> None:
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS conversations (
    id              BIGSERIAL PRIMARY KEY,
    visitor_id      TEXT,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    contact_ref     TEXT,
    contact_id      TEXT,
    page_url        TEXT,
    user_agent      TEXT,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    captured_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS conversations_email_idx ON conversations (lower(email));
CREATE INDEX IF NOT EXISTS conversations_started_idx ON conversations (started_at DESC);

CREATE TABLE IF NOT EXISTS messages (
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_conv_idx ON messages (conversation_id, id);
"""


async def create_conversation(
    *,
    name: str,
    email: str,
    visitor_id: str | None,
    contact_ref: str | None,
    page_url: str | None,
    user_agent: str | None,
) -> int | None:
    """Insert a new conversation. Returns its id, or None if DB disabled / write fails."""
    if not _pool:
        return None
    try:
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO conversations
                    (visitor_id, name, email, contact_ref, page_url, user_agent)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
                """,
                visitor_id, name, email, contact_ref, page_url, user_agent,
            )
            return row["id"] if row else None
    except Exception as exc:
        print(f"[db] create_conversation failed: {type(exc).__name__}: {str(exc)[:200]}")
        return None


async def append_messages(
    conversation_id: int,
    messages: list[dict[str, str]],
) -> bool:
    """Append messages to a conversation and bump last_message_at.

    Each message is a dict with `role` and `content`. Roles must be
    'user' or 'assistant'. Returns False on failure, True on success.
    """
    if not _pool or not messages:
        return False
    try:
        async with _pool.acquire() as conn:
            async with conn.transaction():
                await conn.executemany(
                    """
                    INSERT INTO messages (conversation_id, role, content)
                    VALUES ($1, $2, $3)
                    """,
                    [(conversation_id, m["role"], m["content"]) for m in messages],
                )
                await conn.execute(
                    "UPDATE conversations SET last_message_at = NOW() WHERE id = $1",
                    conversation_id,
                )
        return True
    except Exception as exc:
        print(f"[db] append_messages failed: {type(exc).__name__}: {str(exc)[:200]}")
        return False


async def mark_captured(conversation_id: int, contact_id: str | None) -> bool:
    """Record that the conversation has been pushed to flight-deck/Fibery.

    Stores the resulting contact_id (may be None if flight-deck queued
    it) and a captured_at timestamp.
    """
    if not _pool:
        return False
    try:
        async with _pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE conversations
                SET contact_id = COALESCE($2, contact_id),
                    captured_at = COALESCE(captured_at, NOW())
                WHERE id = $1
                """,
                conversation_id, contact_id,
            )
        return True
    except Exception as exc:
        print(f"[db] mark_captured failed: {type(exc).__name__}: {str(exc)[:200]}")
        return False
