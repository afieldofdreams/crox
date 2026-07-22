# Deploying `crox-chat`

This is the chat backend that powers the floating widget on crox.io and the
general `/contact-form` posted from the `/contact` page. It runs on
flight-deck via Coolify, same pattern as every other Crox app.

Public URL: `https://chat.crox.io`

## One-time setup

### 1. DNS

Add a Cloudflare CNAME in the `crox.io` zone:

| Type  | Name   | Value                              | Proxy   |
|-------|--------|------------------------------------|---------|
| CNAME | `chat` | `flight-deck.crox.io` (or droplet) | Proxied |

The wildcard `*.crox.io` → flight-deck record already covers this if
present in `dns.md`. Adding the explicit `chat` record makes the intent
visible.

### 2. Create Coolify app

In `https://coolify.crox.io`, create a new application:

- **Source:** GitHub repo `afieldofdreams/crox`, branch `main`, deploy on push
- **Build pack:** Dockerfile
- **Base Directory:** `/server`
- **Dockerfile Location:** `/Dockerfile`
- **Port:** `8001`
- **Domain:** `chat.crox.io`
- **Health check path:** `/health`

### 3. Env vars

Set these in the Coolify app's "Environment Variables" section. Master
copies of each secret in 1Password under `Crox Chat — <key>`.

```
ANTHROPIC_API_KEY=sk-ant-...           # 1Password: Anthropic — Crox Chat (NEW key, dedicated)
ANTHROPIC_MODEL=claude-haiku-4-5
DAILY_INPUT_TOKEN_BUDGET=2000000       # ~£1.60/day worst case at Haiku rates

FLIGHT_DECK_BASE_URL=https://flight-deck.crox.io
FORM_CSRF_SECRET=...                   # 1Password: Flight Deck — FORM_CSRF_SECRET
PROJECT_HOST=crox.io                   # Must exist in flight-deck's project_host table

FIBERY_HOST=wildgriffin.fibery.io
FIBERY_TOKEN=...                       # 1Password: Fibery API — Crox Chat (read+write on CRM)

POSTHOG_HOST=https://us.posthog.com
POSTHOG_PROJECT_API_KEY=phc_...        # 1Password: PostHog — Crox Chat (write-only project key)

CORS_ALLOWED_ORIGINS=https://crox.io,https://www.crox.io
BASE_URL=https://chat.crox.io

DATABASE_URL=postgresql://...                # See "Postgres" below
BOOKING_URL=https://calendar.app.google/dmmq9bdFyc11G8Km8

# --- Cold outbound (lead machine) — all optional, defaults shown
OUTBOUND_FROM_EMAIL=Adam Field <adam@crox.io>  # default; must be Resend-verified. Set empty to disable outbound.
OUTBOUND_REPLY_TO=adam@crox.io               # where replies land
OUTBOUND_DAILY_CAP=25                        # hard ceiling on cold sends per UTC day
OUTBOUND_UNSUBSCRIBE_SECRET=...              # HMAC key for unsubscribe links (falls back to FORM_CSRF_SECRET)
```

**Cold outbound:** `POST /outbound/send` (admin bearer token) sends one
cold email via Resend with an unsubscribe footer, List-Unsubscribe
headers, a suppression check, a duplicate-first-touch check, and the
daily cap. `GET /outbound/status` reports configured/sent-today.
`GET /unsubscribe` is the public opt-out.

With `RESEND_API_KEY` and `FORM_CSRF_SECRET` already set, outbound is
ACTIVE by default using the adam@crox.io sender (Adam's decision,
2026-07-22 — cold volume shares the main domain's reputation for now).
If deliverability wobbles, verify a dedicated subdomain in Resend
(e.g. `hello.crox.io`) and point `OUTBOUND_FROM_EMAIL` at it, or set
`OUTBOUND_FROM_EMAIL=` (empty) to switch outbound off entirely.

**`ANTHROPIC_API_KEY`:** mint a fresh, dedicated key for this app. Don't
share with other Crox projects — that way the daily-spend dashboard in
flight-deck can attribute usage cleanly per app.

**`FORM_CSRF_SECRET`:** must be byte-identical to flight-deck's
`FORM_CSRF_SECRET`. The HMAC parity has been verified — see
`app/services/flight_deck.py` for the signing contract.

**`POSTHOG_PROJECT_API_KEY`:** the write-only project key, NOT the
personal API key (which is only on flight-deck for reads).

### 4. Postgres for chat persistence

Each chat session lands in Postgres so Adam has a raw archive that
survives Fibery being down and catches anonymous/abandoned chats
(Fibery only sees the ones that hit `/capture`).

In Coolify:

1. Project → **+ New Resource** → **PostgreSQL** (any recent version,
   16+ is fine). Name it `crox-chat-db`.
2. Wait for it to come up. Coolify shows an internal connection string
   like `postgresql://postgres:<pass>@crox-chat-db:5432/postgres`.
3. Paste that into the `DATABASE_URL` env var on the `crox-chat` app.
4. Redeploy the app. On startup it logs
   `[db] connection pool ready, schema applied` and creates the
   `conversations` + `messages` tables on first boot (idempotent DDL,
   no Alembic needed at this scale).

To peek at conversations, use Coolify's built-in psql tab or:

```sql
SELECT id, name, email, captured_at, started_at, last_message_at
FROM conversations
ORDER BY started_at DESC
LIMIT 20;

SELECT role, content, created_at
FROM messages
WHERE conversation_id = $1
ORDER BY id;
```

The app degrades gracefully if `DATABASE_URL` is unset — the chat still
works, conversations just aren't archived. Use that mode for local dev
when you don't want to run Postgres.

### 5. Add crox.io to flight-deck's `project_host` table

If not already present, on flight-deck's Postgres:

```sql
INSERT INTO project_host (host, project_id, project_name) VALUES
  ('crox.io', '<pensive-project-uuid-for-crox.io>', 'crox.io marketing')
ON CONFLICT DO NOTHING;
```

The Pensive project UUID is whatever the `crox.io` `Pensive/Node` with
`Node Type = Project` has as its `fibery/id`. Without this row,
`/api/forms` rejects submissions with `unknown_project_host`.

### 6. Update flight-deck `FORM_ALLOWED_ORIGINS`

Make sure `https://chat.crox.io` is **not** added to flight-deck's
`FORM_ALLOWED_ORIGINS` — origin checks happen on the *browser-origin*,
not the server-to-server call. The chat backend sets `Origin:
https://crox.io` itself in `submit_form()`, so the only origins that
need allow-listing are the actual sites where users land.

If `FORM_ALLOWED_ORIGINS` is currently unset, the default (any `*.crox.io`
https origin) already covers crox.io. No change needed.

## Verifying the deploy

After Coolify reports the deploy healthy:

```bash
curl https://chat.crox.io/health
# → {"status":"ok","budget":{"day":"2026-05-21","used_input_tokens":0}}

curl -X POST https://chat.crox.io/chat/start \
  -H 'content-type: application/json' \
  -H 'origin: https://crox.io' \
  -d '{"name":"Smoke Test","email":"smoke@example.com","page_url":"https://crox.io"}'
# → {"conversation_id":<int>,"greeting":"Hi Smoke — Fred here..."}

curl -N -X POST https://chat.crox.io/chat \
  -H 'content-type: application/json' \
  -H 'origin: https://crox.io' \
  -d '{"messages":[{"role":"user","content":"hi"}],"visitor_name":"Smoke","visitor_email":"smoke@example.com"}'
# → streaming token events
```

Then load `https://crox.io`, open the chat widget, send a message, watch
the response stream.

## End-to-end smoke test (production)

After deploy, fill in the `/contact` form with a real email. Within ~5
seconds:

1. Check `https://wildgriffin.fibery.io` — a `CRM/Contact` should exist
   for that email with a `Contact form` entry in its Activity Stream
   containing the message text.
2. Check `https://flight-deck.crox.io/admin/contacts/<tracking-token>` —
   the same contact's timeline should show:
   - the PostHog `contact_form_submitted` event,
   - the form_submission row from flight-deck's own Postgres,
   - the Activity Stream excerpt.

If only (1) shows and not (2): the PostHog write happened but the
identity bridge from track.js didn't fire — likely a `posthog.identify`
not being called because the visitor didn't carry a `utm_content`
tracking token. That's expected for walk-up traffic and is not a bug.

## Cost monitoring

This service is deliberately on Haiku 4.5 with prompt caching enabled.
Expected steady-state cost per conversation: **~£0.005** (after first
cache hit). The hard daily budget (`DAILY_INPUT_TOKEN_BUDGET`) refuses
new chats once exhausted; it's a safety net, not a billing system.

Truth lives in flight-deck Widget #4 (Cost) — pulls from each
provider's usage API on a cron. See `WIDGET-4-PLAN.md` in this repo for
the build spec.

## Rollback

Coolify keeps the previous image. Roll back via the Coolify dashboard —
no DNS change needed; the domain stays pointed at the same Coolify app.

## Local dev

```bash
cd server
uv sync --group dev
cp .env.example .env  # fill in real values

PYTHONPATH=. uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

For the frontend to call this local backend during dev:

```bash
cd client
echo "PUBLIC_CHAT_BASE_URL=http://localhost:8001" > .env
npm run dev
```

Make sure `CORS_ALLOWED_ORIGINS` on the backend includes
`http://localhost:3099`.
