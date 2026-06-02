"""Postgres layer — the Crox lead/contact data store.

Tables:

  - conversations / messages — one row per chat session + per-turn log.
  - assessment_submissions   — Scorecard submissions with full breakdown JSON.
  - contact_form_submissions — /contact form submissions.
  - outbound_emails          — admin replies sent via Resend, for thread history.

This is the system of record for Crox leads. Flight Deck reads from
here (via the /admin/contacts JSON endpoints) and is allowed to write
back to outbound_emails when Adam sends a reply through the admin UI.

The previous Fibery Activity Stream pattern has been retired in favour
of this Postgres-centric model.

Schema is applied via init_db() at app startup. Idempotent DDL with
IF NOT EXISTS — no Alembic at this scale; the service is the only writer.

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
    """Create the connection pool and apply schema. Idempotent.

    Tolerates a bad DSN at startup: logs loudly and leaves _pool unset
    rather than crashing the app. The chat endpoints still serve; the
    persistence functions just no-op until the env var is fixed and the
    app is redeployed. This matters in Coolify where a typo'd
    DATABASE_URL would otherwise hold the whole service offline.
    """
    global _pool
    if not is_enabled():
        print("[db] DATABASE_URL not set — conversation persistence disabled")
        return
    if _pool is not None:
        return
    try:
        _pool = await asyncpg.create_pool(
            settings.database_url,
            min_size=1,
            max_size=10,
            command_timeout=10,
        )
        async with _pool.acquire() as conn:
            await conn.execute(SCHEMA_SQL)
        print("[db] connection pool ready, schema applied")
    except Exception as exc:
        _pool = None
        print(
            f"[db] init failed ({type(exc).__name__}: {str(exc)[:200]}) — "
            "conversation persistence DISABLED until DATABASE_URL is fixed and the app is redeployed"
        )


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

CREATE TABLE IF NOT EXISTS assessment_submissions (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    company         TEXT,
    score           INTEGER NOT NULL,
    max_score       INTEGER NOT NULL,
    band            TEXT NOT NULL,
    answers         JSONB NOT NULL,
    breakdown       JSONB NOT NULL,
    page_url        TEXT,
    visitor_id      TEXT,
    contact_ref     TEXT,
    contact_id      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS assessment_email_idx ON assessment_submissions (lower(email));
CREATE INDEX IF NOT EXISTS assessment_created_idx ON assessment_submissions (created_at DESC);

CREATE TABLE IF NOT EXISTS contact_form_submissions (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT,
    email           TEXT NOT NULL,
    message         TEXT NOT NULL,
    page_url        TEXT,
    visitor_id      TEXT,
    contact_ref     TEXT,
    contact_id      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_form_email_idx ON contact_form_submissions (lower(email));
CREATE INDEX IF NOT EXISTS contact_form_created_idx ON contact_form_submissions (created_at DESC);

CREATE TABLE IF NOT EXISTS outbound_emails (
    id              BIGSERIAL PRIMARY KEY,
    to_email        TEXT NOT NULL,
    from_email      TEXT NOT NULL,
    reply_to        TEXT,
    subject         TEXT NOT NULL,
    body_text       TEXT NOT NULL,
    -- Free-text label: 'admin_reply', 'assessment_followup', etc. So the
    -- admin can filter / understand the conversation history.
    source          TEXT NOT NULL DEFAULT 'admin_reply',
    -- The Resend message id once accepted; null if the send failed.
    resend_id       TEXT,
    -- Last-attempted error from Resend if the send failed.
    send_error      TEXT,
    sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS outbound_emails_to_idx ON outbound_emails (lower(to_email));
CREATE INDEX IF NOT EXISTS outbound_emails_sent_idx ON outbound_emails (sent_at DESC);
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


async def list_recent_conversations(limit: int = 50) -> list[dict]:
    """Return the most recent conversations for the admin view.

    Each row carries the conversation header plus the message count.
    Cheap query (one SELECT with a subquery) — fine for a few hundred
    rows; if conversations ever grow into the thousands we'd want a
    materialised count column instead.
    """
    if not _pool:
        return []
    try:
        async with _pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT
                    c.id,
                    c.name,
                    c.email,
                    c.page_url,
                    c.contact_id,
                    c.started_at,
                    c.last_message_at,
                    c.captured_at,
                    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) AS message_count
                FROM conversations c
                ORDER BY c.started_at DESC
                LIMIT $1
                """,
                limit,
            )
            return [dict(r) for r in rows]
    except Exception as exc:
        print(f"[db] list_recent_conversations failed: {type(exc).__name__}: {str(exc)[:200]}")
        return []


async def get_conversation_messages(conversation_id: int) -> list[dict]:
    """Return every message in a conversation, oldest first."""
    if not _pool:
        return []
    try:
        async with _pool.acquire() as conn:
            rows = await conn.fetch(
                """
                SELECT role, content, created_at
                FROM messages
                WHERE conversation_id = $1
                ORDER BY id
                """,
                conversation_id,
            )
            return [dict(r) for r in rows]
    except Exception as exc:
        print(f"[db] get_conversation_messages failed: {type(exc).__name__}: {str(exc)[:200]}")
        return []


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


# ---------------------------------------------------------------------------
# Assessment submissions
# ---------------------------------------------------------------------------

async def insert_assessment_submission(
    *,
    name: str,
    email: str,
    company: str | None,
    score: int,
    max_score: int,
    band: str,
    answers: dict,
    breakdown: list[dict],
    page_url: str | None,
    visitor_id: str | None,
    contact_ref: str | None,
    contact_id: str | None,
) -> int | None:
    """Persist a Scorecard submission. Returns the row id, or None on failure."""
    if not _pool:
        return None
    try:
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO assessment_submissions
                    (name, email, company, score, max_score, band,
                     answers, breakdown, page_url, visitor_id, contact_ref, contact_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11, $12)
                RETURNING id
                """,
                name, email, company, score, max_score, band,
                json.dumps(answers), json.dumps(breakdown),
                page_url, visitor_id, contact_ref, contact_id,
            )
            return row["id"] if row else None
    except Exception as exc:
        print(f"[db] insert_assessment_submission failed: {type(exc).__name__}: {str(exc)[:200]}")
        return None


# ---------------------------------------------------------------------------
# Contact-form submissions
# ---------------------------------------------------------------------------

async def insert_contact_form_submission(
    *,
    name: str | None,
    email: str,
    message: str,
    page_url: str | None,
    visitor_id: str | None,
    contact_ref: str | None,
    contact_id: str | None,
) -> int | None:
    """Persist a /contact-form submission. Returns the row id, or None on failure."""
    if not _pool:
        return None
    try:
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO contact_form_submissions
                    (name, email, message, page_url, visitor_id, contact_ref, contact_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
                """,
                name, email, message, page_url, visitor_id, contact_ref, contact_id,
            )
            return row["id"] if row else None
    except Exception as exc:
        print(f"[db] insert_contact_form_submission failed: {type(exc).__name__}: {str(exc)[:200]}")
        return None


# ---------------------------------------------------------------------------
# Outbound emails — admin replies sent via Resend, logged so the contact
# detail view shows the full thread.
# ---------------------------------------------------------------------------

async def insert_outbound_email(
    *,
    to_email: str,
    from_email: str,
    reply_to: str | None,
    subject: str,
    body_text: str,
    source: str = "admin_reply",
    resend_id: str | None = None,
    send_error: str | None = None,
) -> int | None:
    if not _pool:
        return None
    try:
        async with _pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO outbound_emails
                    (to_email, from_email, reply_to, subject, body_text,
                     source, resend_id, send_error)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
                """,
                to_email, from_email, reply_to, subject, body_text,
                source, resend_id, send_error,
            )
            return row["id"] if row else None
    except Exception as exc:
        print(f"[db] insert_outbound_email failed: {type(exc).__name__}: {str(exc)[:200]}")
        return None


# ---------------------------------------------------------------------------
# Consolidated contact view — used by Flight Deck admin.
# Joins assessment / contact-form / conversations / outbound emails by email.
# ---------------------------------------------------------------------------

async def list_contacts(limit: int = 200) -> list[dict]:
    """Return one row per unique email across all lead-source tables.

    The shape is the 'lead list' as it appears in Flight Deck. Each row
    has: email, name (best guess), company (latest if any), counts per
    source, last activity timestamp, latest assessment score+band if any.
    """
    if not _pool:
        return []
    try:
        async with _pool.acquire() as conn:
            rows = await conn.fetch(
                """
                WITH all_emails AS (
                    SELECT lower(email) AS email_l, email AS email_raw FROM conversations
                    UNION
                    SELECT lower(email), email FROM assessment_submissions
                    UNION
                    SELECT lower(email), email FROM contact_form_submissions
                ),
                conv_agg AS (
                    SELECT lower(email) AS email_l,
                           COUNT(*) AS n,
                           MAX(last_message_at) AS last_activity,
                           (ARRAY_AGG(name ORDER BY started_at DESC))[1] AS latest_name
                    FROM conversations
                    GROUP BY lower(email)
                ),
                ass_agg AS (
                    SELECT lower(email) AS email_l,
                           COUNT(*) AS n,
                           MAX(created_at) AS last_activity,
                           (ARRAY_AGG(name ORDER BY created_at DESC))[1] AS latest_name,
                           (ARRAY_AGG(company ORDER BY created_at DESC))[1] AS latest_company,
                           (ARRAY_AGG(score ORDER BY created_at DESC))[1] AS latest_score,
                           (ARRAY_AGG(band ORDER BY created_at DESC))[1] AS latest_band
                    FROM assessment_submissions
                    GROUP BY lower(email)
                ),
                cf_agg AS (
                    SELECT lower(email) AS email_l,
                           COUNT(*) AS n,
                           MAX(created_at) AS last_activity,
                           (ARRAY_AGG(name ORDER BY created_at DESC))[1] AS latest_name
                    FROM contact_form_submissions
                    GROUP BY lower(email)
                ),
                out_agg AS (
                    SELECT lower(to_email) AS email_l,
                           COUNT(*) AS n,
                           MAX(sent_at) AS last_sent
                    FROM outbound_emails
                    GROUP BY lower(to_email)
                )
                SELECT
                    e.email_raw AS email,
                    COALESCE(c.latest_name, a.latest_name, f.latest_name) AS name,
                    a.latest_company AS company,
                    COALESCE(a.n, 0) AS assessment_count,
                    COALESCE(c.n, 0) AS conversation_count,
                    COALESCE(f.n, 0) AS contact_form_count,
                    COALESCE(o.n, 0) AS outbound_email_count,
                    a.latest_score AS latest_score,
                    a.latest_band AS latest_band,
                    GREATEST(
                        COALESCE(c.last_activity, 'epoch'::timestamptz),
                        COALESCE(a.last_activity, 'epoch'::timestamptz),
                        COALESCE(f.last_activity, 'epoch'::timestamptz),
                        COALESCE(o.last_sent, 'epoch'::timestamptz)
                    ) AS last_activity
                FROM all_emails e
                LEFT JOIN conv_agg c ON c.email_l = e.email_l
                LEFT JOIN ass_agg  a ON a.email_l = e.email_l
                LEFT JOIN cf_agg   f ON f.email_l = e.email_l
                LEFT JOIN out_agg  o ON o.email_l = e.email_l
                -- Dedupe — `all_emails` UNION already deduped on email_l
                -- but a raw email may appear in multiple casings; collapse
                -- by picking one arbitrary raw form per lowercase key.
                ORDER BY last_activity DESC
                LIMIT $1
                """,
                limit,
            )
            return [dict(r) for r in rows]
    except Exception as exc:
        print(f"[db] list_contacts failed: {type(exc).__name__}: {str(exc)[:200]}")
        return []


async def get_contact_detail(email: str) -> dict | None:
    """Return everything we know about a single email.

    Shape:
        {
          email, name, company,
          assessments: [...],
          contact_forms: [...],
          conversations: [{ ..., messages: [...] }, ...],
          outbound_emails: [...],
        }
    """
    if not _pool:
        return None
    email_l = email.lower()
    try:
        async with _pool.acquire() as conn:
            assessments = await conn.fetch(
                """
                SELECT id, name, email, company, score, max_score, band,
                       answers, breakdown, page_url, visitor_id, contact_ref,
                       contact_id, created_at
                FROM assessment_submissions
                WHERE lower(email) = $1
                ORDER BY created_at DESC
                """,
                email_l,
            )
            contact_forms = await conn.fetch(
                """
                SELECT id, name, email, message, page_url, visitor_id, contact_ref,
                       contact_id, created_at
                FROM contact_form_submissions
                WHERE lower(email) = $1
                ORDER BY created_at DESC
                """,
                email_l,
            )
            convs = await conn.fetch(
                """
                SELECT id, visitor_id, name, email, contact_ref, contact_id,
                       page_url, user_agent, started_at, last_message_at, captured_at
                FROM conversations
                WHERE lower(email) = $1
                ORDER BY started_at DESC
                """,
                email_l,
            )
            outbound = await conn.fetch(
                """
                SELECT id, to_email, from_email, reply_to, subject, body_text,
                       source, resend_id, send_error, sent_at
                FROM outbound_emails
                WHERE lower(to_email) = $1
                ORDER BY sent_at DESC
                """,
                email_l,
            )

            # Hydrate messages for each conversation
            conv_dicts: list[dict] = []
            for c in convs:
                msgs = await conn.fetch(
                    """
                    SELECT role, content, created_at
                    FROM messages
                    WHERE conversation_id = $1
                    ORDER BY id
                    """,
                    c["id"],
                )
                conv_dicts.append({**dict(c), "messages": [dict(m) for m in msgs]})

        # Nothing across any table = unknown contact
        if not assessments and not contact_forms and not convs and not outbound:
            return None

        # Best-effort name/company from most recent source
        latest_name = None
        latest_company = None
        if assessments:
            latest_name = assessments[0]["name"]
            latest_company = assessments[0]["company"]
        if not latest_name and convs:
            latest_name = convs[0]["name"]
        if not latest_name and contact_forms and contact_forms[0]["name"]:
            latest_name = contact_forms[0]["name"]

        return {
            "email": email,
            "name": latest_name,
            "company": latest_company,
            "assessments": [dict(r) for r in assessments],
            "contact_forms": [dict(r) for r in contact_forms],
            "conversations": conv_dicts,
            "outbound_emails": [dict(r) for r in outbound],
        }
    except Exception as exc:
        print(f"[db] get_contact_detail failed: {type(exc).__name__}: {str(exc)[:200]}")
        return None
