# Flight Deck Widget #4 (Cost) — how crox-chat ties in

Widget #4 **already exists** in flight-deck. As of 2026-05-21 there's:

- `dashboard/db/migrations/003_provider_cost.sql` — `provider_cost_daily`
  table keyed by (provider × model × day) with input/output tokens and
  USD cost.
- `dashboard/lib/fetchers/anthropic-cost.ts` — pulls
  `/v1/organizations/cost_report` and `/v1/organizations/usage_report/messages`
  via an Anthropic admin key.
- `dashboard/lib/fetchers/openai-cost.ts` — same shape for OpenAI.
- `dashboard/lib/fetchers/{digitalocean,cloudflare,coolify}.ts` — infra
  cost + state.
- `dashboard/components/widgets/cost.tsx` — month-to-date cost widget
  shown on the dashboard root.
- `dashboard/app/api/internal/sync-provider-costs/route.ts` — nightly
  cron entry-point.

**This supersedes the spec that used to live here.** What follows is
just how crox-chat appears in that dashboard.

## What crox-chat needs to do

Nothing new in code. The widget pulls from the **provider** side
(Anthropic's cost API), not from crox-chat's own logs. So crox-chat
just needs:

1. **Its own dedicated Anthropic API key.** Mint a new key in the
   Anthropic console labelled "Crox Chat". Don't share with other
   Crox projects — so the widget can attribute spend cleanly.
2. **The admin key for the puller.** Flight-deck's sync job needs
   `ANTHROPIC_ADMIN_API_KEY` (sk-ant-admin01-...) set. This is an
   **org-level** key, mint once at console.anthropic.com → Organization
   → Admin Keys, store in 1Password as "Anthropic — Flight Deck Admin".
   One key covers reporting for every Crox app's project keys.
3. **The widget will then show crox-chat's Haiku 4.5 spend** as part of
   the Anthropic line, broken down by model.

The current widget aggregates by (provider × model), not by app. If you
want per-app attribution shown separately ("crox-chat", "canary",
"dodar"), the `provider_cost_daily` schema would need an `app_slug`
column and the fetcher would need to read the API key label / workspace
from each cost bucket. That's a small extension to flight-deck —
out of scope for this delivery, but worth a note in the dashboard
backlog if app-level attribution becomes useful.

## What crox-chat does to stay cheap

These belong here in the chat backend, not in the cost dashboard:

- **Haiku 4.5 default** (`ANTHROPIC_MODEL=claude-haiku-4-5`).
- **Prompt caching** on the ~3.5k-token system prompt (~10× cheaper
  input on cache hits).
- **`DAILY_INPUT_TOKEN_BUDGET=2000000`** — hard refuse new chats once
  exhausted. ~£1.60/day worst case at Haiku rates.
- **`max_tokens=1024`** per response — no runaway long outputs.
- **80-message conversation cap** in the pydantic schema.

The widget tells you "is the trend looking right" over days/weeks. The
budget tells you "is something on fire right now." Both belong.

## If the trend looks wrong

Walk back through this list in order:

1. Is `ANTHROPIC_MODEL` still set to `claude-haiku-4-5`? (Easy to
   accidentally pin to Sonnet/Opus during a debug session.)
2. Is the cache-creation token count high relative to cache-reads? If
   yes, the system prompt is being treated as fresh on every request —
   either prompts/system.md was edited and the cache hasn't reformed,
   or `cache_control` got removed.
3. Is conversation length climbing? Check the per-request input tokens
   in `/health`. If they're 10k+ on first turn, the system prompt grew
   without anyone noticing.
4. Is one bad actor burning a lot of requests? Add IP rate-limiting (not
   currently configured — deliberate trade-off, the daily budget covers
   the worst case).
