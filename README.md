# crox.io

Personal site and consultancy page for Adam Field. Monorepo:

- **`client/`** — Astro static site (Tailwind, React islands). Deploys via DigitalOcean App Platform per `crox.yaml`.
- **`server/`** — FastAPI chat backend powering the floating "Chat with Fred" widget. Deploys via Coolify at `chat.crox.io`.

## Quick start

```bash
# 1. Postgres (chat conversations are persisted here)
docker run -d --name crox-chat-pg \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=crox_chat \
  -p 5432:5432 -v crox-chat-pgdata:/var/lib/postgresql/data \
  postgres:16

# 2. Server (terminal A)
cd server
uv sync --group dev
cp .env.example .env   # fill ANTHROPIC_API_KEY at minimum; add
                       # DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crox_chat
PYTHONPATH=. uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

# 3. Client (terminal B)
cd client
echo 'PUBLIC_CHAT_BASE_URL=http://localhost:8001' > .env
npm install
npm run dev   # → http://localhost:4321 (or whatever Astro prints)
```

From the repo root, `npm run dev` is a shortcut for the client only.

## Chat backend — architecture

The chat is one node in the wider Crox attribution graph. It does not own contact records; flight-deck does. Postgres on this service is the raw archive for Adam's review.

```
crox.io (Astro)                        chat.crox.io (this service)            flight-deck.crox.io           Fibery CRM
─────────────────                      ───────────────────────────             ─────────────────────         ─────────────
ChatWidget (React) — gated on name+email
  reads window.croxAttribution
  POST /chat/start {name,email} ────►  /chat/start
                                         INSERT conversations row ─► Postgres (this service's DB)
                                         returns conversation_id + Fred's greeting
  POST /chat {messages,conv_id,...} ─►  /chat
                                         INSERT user message  ───► Postgres
                                         streams Claude (SSE) ◄──── Anthropic (Fred persona, DODAR script)
                                         INSERT assistant msg ───► Postgres
  POST /capture {conv_id, ...} ──────►  /capture (fired when Fred drops the booking link)
                                         signs HMAC + POST /api/forms ──────►  upserts CRM/Contact ─────────►   …
                                                                  ◄───── contact_id ──────
                                         UPDATE conversation contact_id ─► Postgres
                                         PUT /api/documents/<secret> ──────────────────────────────────────►  appends Activity Stream
                                         POST posthog /capture ──────────────────────────►  PostHog (chat_lead_captured)
```

See memory: `crox-ecosystem`, `flight-deck-forms-contract`, `fibery-crm-contact`.

## Endpoints

| Method | Path           | Purpose                                                           |
|--------|----------------|-------------------------------------------------------------------|
| GET    | `/health`      | Liveness                                                          |
| POST   | `/chat/start`  | Open a chat: name + email → Postgres row + opening greeting       |
| POST   | `/chat`        | SSE stream of a Claude completion; persists each turn             |
| POST   | `/capture`     | End-of-chat: flight-deck upsert + Fibery Activity Stream + PostHog |
| POST   | `/contact-form`| `/contact` page form: same plumbing as `/capture` minus transcript |

## Editing Fred's voice

The system prompt lives at [server/prompts/system.md](server/prompts/system.md). It's loaded on each request, so edits don't need a redeploy in dev (they do in prod — the file ships in the Docker image). Treat it as the source of truth for what Fred says about Crox.

The prompt runs every visitor through **DODAR** (Diagnose → Options → Decide → Action → Review). The Action step always ends with the Google Calendar link `https://calendar.app.google/dmmq9bdFyc11G8Km8`.

## Deploy

See [server/DEPLOY.md](server/DEPLOY.md) for the Coolify setup, env vars, Postgres provisioning, and the end-to-end smoke test.

## Smoke test (local)

```bash
curl -s -X POST http://localhost:8001/chat/start \
  -H 'content-type: application/json' \
  -H 'origin: http://localhost:4321' \
  -d '{"name":"Sarah Patel","email":"sarah@example.com","page_url":"http://localhost:4321"}' | jq

# Then send a message (use the conversation_id returned above)
curl -N -X POST http://localhost:8001/chat \
  -H 'content-type: application/json' \
  -d '{"conversation_id":1,"visitor_name":"Sarah Patel","visitor_email":"sarah@example.com",
       "messages":[{"role":"user","content":"I run a 12-person accounting firm. Where do I begin with AI?"}]}'

# Peek at what landed
psql postgresql://postgres:postgres@localhost:5432/crox_chat -c \
  "SELECT id, name, email, started_at FROM conversations ORDER BY id DESC LIMIT 5;"
```
