# Crox chat backend

FastAPI service powering the floating chat widget on crox.io. Streams Claude responses, captures leads via flight-deck `/api/forms`, appends transcripts to the Fibery `CRM/Contact` Activity Stream, fires PostHog events.

Deployed at `chat.crox.io`.

## Architecture

The chat is one node in the wider Crox attribution graph. It does not own contact records.

```
crox.io (Astro)                        chat.crox.io (this service)            flight-deck.crox.io           Fibery CRM
─────────────────                      ───────────────────────────             ─────────────────────         ─────────────
ChatWidget (React)
  reads window.croxAttribution
  POST /chat {messages} ────────────►  /chat
                                         streams Claude (SSE) ◄──── Anthropic
  POST /capture {email, ...} ────────►  /capture
                                         signs HMAC + POST /api/forms ──────►  upserts CRM/Contact ─────────►   …
                                                                  ◄───── contact_id ──────
                                         PUT /api/documents/<secret> ──────────────────────────────────────►  appends Activity Stream
                                         POST posthog /capture ──────────────────────────►  PostHog (chat_lead_captured)
```

See memory: `crox-ecosystem`, `flight-deck-forms-contract`, `fibery-crm-contact`.

## Setup

```bash
cd server
uv sync --group dev
cp .env.example .env  # fill in real values
PYTHONPATH=. uv run uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Smoke test:

```bash
curl -N -X POST http://localhost:8001/chat \
  -H 'content-type: application/json' \
  -H 'origin: http://localhost:3099' \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

## Endpoints

| Method | Path      | Purpose                                                                |
|--------|-----------|------------------------------------------------------------------------|
| GET    | `/health` | Liveness                                                               |
| POST   | `/chat`   | SSE stream of a Claude completion. Body: `{messages, contact_ref?}`    |
| POST   | `/capture`| Lead capture: flight-deck upsert + Fibery Activity Stream + PostHog    |

## Editing the bot's voice

The system prompt lives at `prompts/system.md`. It's loaded on each request, so edits don't need a redeploy in dev (they do in prod — the file ships in the Docker image). Treat it as the source of truth for what the bot says about Crox.
