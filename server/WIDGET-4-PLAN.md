# Flight Deck Widget #4 — Cost dashboard

**This spec lives in `crox-chat` for now because the cost concerns that
motivated it surfaced here. When picked up, move to
`flight-deck/spec/widget-4-cost.md`.**

## What it does

A widget on `flight-deck.crox.io/` showing daily spend across every paid
provider Crox uses, broken down by:

- **Provider** (Anthropic, OpenAI, DigitalOcean, Cloudflare, Resend,
  Stripe fees, etc.)
- **App** (which Crox app burned the spend — crox-chat, canary, ...)
- **Day** for the last 30 days

The MVP is just the chart + a "this month so far" total. Drill-downs
come later.

## Why a widget, not per-app dashboards

Adam's stated preference (memory: feedback-cost-monitoring): cost
observability is one of the things flight-deck exists for. Building a
spend chart inside every Crox app creates drift — different conventions,
duplicated API calls, missed providers. One canonical place.

## Architecture

```
                  ┌──────────────────────────────────────────┐
                  │ flight-deck (Next.js + Postgres)         │
                  │                                          │
                  │   nightly cron (Coolify scheduled task)  │
                  │     pulls usage from each provider's API │
                  │     → upsert into `provider_usage` table │
                  │                                          │
                  │   GET /api/widgets/cost  ────► reads     │
                  │     provider_usage, returns JSON         │
                  │                                          │
                  │   <CostWidget />  ◄── fetches /api/...   │
                  │     Recharts line/stacked-bar            │
                  └──────────────────────────────────────────┘
```

The reason cost is **pulled** not **pushed**: each provider has a usage
API that already does the per-day rollup correctly (handles cache hits,
prorations, refunds). Pushing events from each app means we have to
replicate that math, and we get it wrong.

## Providers — MVP scope

| Provider     | API endpoint                                                          | Auth                                | Granularity        |
|--------------|-----------------------------------------------------------------------|-------------------------------------|--------------------|
| Anthropic    | `/v1/organizations/usage_report/messages`                             | `x-api-key: <ADMIN_API_KEY>`        | day × model × key  |
| OpenAI       | `/v1/usage` (admin key)                                               | `Authorization: Bearer <ADMIN_KEY>` | day × model × project |
| DigitalOcean | `/v2/customers/my/balance` + `/v2/customers/my/billing_history`       | `Authorization: Bearer <DO_TOKEN>`  | invoice/day        |
| Cloudflare   | GraphQL Analytics (zone-level) — for traffic/bandwidth, free anyway   | `Authorization: Bearer <CF_TOKEN>`  | day                |
| Resend       | `/emails?` count (paid-tier email sends)                              | `Authorization: Bearer <RESEND>`    | manual rollup      |
| Stripe       | `/v1/balance_transactions` (Crox's own Stripe revenue, not a cost)    | (skip MVP)                          | —                  |

**Attribution to apps:** Anthropic and OpenAI both bill per **API key**.
The trick: mint a dedicated key per Crox app (e.g. `crox-chat`,
`canary`, `dodar`) and label it in the provider dashboard. The usage
endpoint then surfaces spend keyed by `api_key_id` which the dashboard
can resolve back to an app via a lookup table.

For DigitalOcean / Cloudflare / Resend, attribution is by app where the
billing entity has a sensible label; otherwise it's lumped under
"shared infra."

## Postgres schema

Add to `flight-deck/dashboard/db/migrations/`:

```sql
-- Daily spend rollup, one row per (provider × app × day × cost_type).
-- cost_type = "input_tokens" | "output_tokens" | "cache_write" | "cache_read"
-- | "compute_hours" | "bandwidth_gb" | "email_sends" | "flat" depending on
-- provider. Keep granular so per-token-type cost ratios stay queryable.
CREATE TABLE provider_usage (
    id           BIGSERIAL PRIMARY KEY,
    provider     TEXT NOT NULL,         -- anthropic | openai | digitalocean | ...
    app_slug     TEXT NOT NULL,         -- crox-chat | canary | shared | ...
    day          DATE NOT NULL,
    cost_type    TEXT NOT NULL,
    units        NUMERIC NOT NULL,      -- raw count (tokens, hours, etc.)
    cost_gbp     NUMERIC NOT NULL,      -- pre-computed at FX-of-the-day; we don't recompute
    raw          JSONB,                 -- provider response row for auditability
    pulled_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, app_slug, day, cost_type)
);

CREATE INDEX provider_usage_day_idx ON provider_usage (day DESC);
CREATE INDEX provider_usage_app_idx ON provider_usage (app_slug);
```

`UNIQUE` lets the puller use `INSERT … ON CONFLICT … DO UPDATE` to be
re-run safely.

## Files to add to `flight-deck/dashboard`

```
dashboard/
  lib/cost/
    anthropic.ts       # fetcher: provider-shaped → provider_usage rows
    openai.ts
    digitalocean.ts
    cloudflare.ts
    rollup.ts          # entry-point: foreach provider → write rows
  app/api/widgets/cost/route.ts   # GET handler the widget calls
  app/components/CostWidget.tsx   # Recharts stacked bar by app
  scripts/pull-costs.ts           # nightly cron entry-point
  db/migrations/00X_provider_usage.sql
```

## Cron schedule

Coolify scheduled task on flight-deck, daily at 04:00 UTC (after the
03:00 UTC Postgres backup):

```
0 4 * * *  cd /app && node scripts/pull-costs.js
```

The Anthropic usage report endpoint is ~24h delayed, so a 04:00 UTC pull
captures yesterday completely. Re-runs are idempotent via the unique
constraint.

## Env vars (flight-deck)

```
ANTHROPIC_ADMIN_API_KEY=    # admin key, NOT a project key — different perms
OPENAI_ADMIN_API_KEY=
DO_API_TOKEN=               # already set per .env.example
CF_API_TOKEN=               # already set per .env.example
RESEND_API_KEY=             # optional MVP
```

## Out of scope for MVP

- Real-time alerting on budget overruns (the per-app daily caps —
  e.g. `DAILY_INPUT_TOKEN_BUDGET` on crox-chat — already cover that
  in the short term)
- Forecasting / projection
- Per-conversation drill-down (the per-contact admin timeline already
  shows individual events)

## Rough effort

Half a day for the chart + Anthropic + DigitalOcean. Other providers
~1h each. Schema migration is 15min.

## What to do until Widget #4 exists

- Watch the daily Anthropic console (`console.anthropic.com/usage`)
- The crox-chat `/health` endpoint exposes today's `used_input_tokens`
- The hard daily budget refuses new chats if exhausted

These three are enough to catch a runaway. Widget #4 is for the
"is the trend looking right?" question, not the "is something on fire
right now?" question.
