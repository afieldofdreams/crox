# The weekly content routine

The instructions a scheduled Claude session follows every Sunday. Three
outputs, in this order: **queue the week's LinkedIn posts, publish the
long-form piece, draft the TikTok scripts.** This file is the routine.
The schedule only points at it.

**Why this file exists, and why the order is fixed.** The routine ran on
3 and 10 August, reported success both times, and produced nothing:
no queued posts, no article, no log entry. Posting went quiet for ten
days without a single error anywhere.

The instructions at the time lived only inside the scheduled session and
put the most expensive task — a long-form article — before the cheapest
and most time-critical one, queueing five posts. Anything that exhausts a
run's budget therefore killed exactly the output that mattered daily,
while the run still ended looking clean.

So: the runbook lives in git, the cheap-and-urgent work happens first,
and the run **verifies its own output before it finishes** (step 8). A
run that queues nothing must say so loudly rather than ending green.

## Order of work — the one rule that matters

1. Review last week (steps 1–4)
2. **Write and queue the five LinkedIn posts (steps 5–6)**
3. Publish the long-form piece, draft the TikTok scripts (step 7)
4. **Verify the queue is actually full (step 8)**
5. Log it (step 9)

The queue comes before the article, always. Five posts take minutes and
carry the week; an article takes the rest of the run. Doing them the
other way round is what produced two silent weeks.

## How the two halves work

**Posting is already durable and needs no schedule.** The
`_linkedin_poster` loop inside the deployed server flushes due posts
every ten minutes, 24/7, independent of any Claude session. It has never
been the thing that failed.

**Writing is the fragile half.** It needs research, source-checking, and
judgement, so it runs as a Claude session — and a session that runs but
produces nothing is exactly how the August outage happened. Three guards
now exist:

- `_queue_watchdog` in the server emails adam@crox.io if the queue is
  ever empty (checked every 6h, at most one mail every 48h). Silence is
  no longer invisible.
- A missing entry in `LEARNING-LOG.md` means the routine did not run, or
  ran without finishing.
- Step 8 makes the run check its own output before reporting success.

## Setup (one-off, human)

Create a recurring Claude session, **Sundays 17:00 Europe/London**,
whose prompt is:

> Read `content/WEEKLY-ROUTINE.md` in the crox repo and follow it.

That is the whole schedule. Everything else changes in this file.

## Every Sunday

### 1. Read before writing

Fetch `origin/main` first — the log lives on main. Then read
`content/LEARNING-LOG.md` end to end, newest entry first. It is the
memory of this loop. Never write posts before reading it.

### 2. Pull last week's numbers

```
GET https://chat.crox.io/linkedin/queue        (admin bearer token)
GET https://chat.crox.io/outbound/engagement   (admin bearer token)
```

Never print the token.

- Confirm last week's five posts actually published: every item should
  have `posted_at` set and `post_error: null`. **A `post_error` is the
  headline of this week's log entry** — do not bury it. So is a week
  where nothing was queued at all.
- Check the token: `GET /linkedin/status` reports `token_days_left`.
  **Under 14 days, say so loudly in the report** — the member token
  cannot refresh itself and posting stops dead when it lapses.
- Conversions are the real signal now (see Measurement below): count
  assessment submissions, contact forms, and chat conversations in the
  crox-chat DB in the hours after each post window.
- `GET /links/stats` still works but only covers the 27–31 July posts.
  Posts carry no links now, so there are no new clicks to read.

### 3. Score last week

For last week's stated hypothesis: what happened, and what is the
decision — keep, kill, or double down? One variable, one verdict.
Small numbers are normal; judge direction over weeks, never a single
post. Only act on a difference that repeats.

### 4. State this week's hypothesis

Exactly one, testing exactly one variable: hook style, topic, sector,
format, or posting day. Never several at once or the result reads as
noise.

### 5. Write five posts

Monday to Friday, `07:30` UTC each day, staggered by day. Written
Sunday, so the whole week is queued before it starts and there is a
full veto window on every post.

**Standing format mix** (Adam's call, 2026-08-09):

| Day | Format |
|---|---|
| Mon | **Something in the news.** Research it Sunday afternoon and check nothing has moved before it goes out — do not post stale news. Verify every factual claim against a primary or reputable source before writing, and cite the source in the log entry. |
| Tue | **Build in public.** A real thing that happened building Crox this week, with the actual numbers. Failures outperform wins. |
| Wed | Research or data observation, with figures that can be traced to a named source. |
| Thu | Sector-specific and concrete — accounting, care, insurance broking first (see `OUTBOUND.md` targeting). |
| Fri | Opinion, ending in a genuine question. |

**Hard rules for the post bodies:**

- **No links.** Text only — no `link_url`, no `image_url`. Adam's call:
  he believes outbound links suppress reach. This costs us click
  tracking (see Measurement).
- **Never invent.** No made-up clients, quotes, conversations, or
  statistics. If a number cannot be traced to a real source or Adam's
  own work, it does not go in the post. This is the whole basis of the
  positioning and one fabricated detail spends all of it.
- Reads-human: short sentences, blank line between thoughts, concrete
  specifics over adjectives, British spelling. No emoji, no hashtags,
  no "🚀 excited to share". If a line sounds like a brochure, cut it.
  The Reads-human rules and Voice examples in `OUTBOUND.md` apply to
  every piece of content this routine produces, not just the posts.
- 2,900 character hard limit (API rejects longer).

### 6. Queue them

```
POST https://chat.crox.io/linkedin/queue
{"posts": [{"body": "...", "post_at": "2026-08-10T07:30:00Z"}, ...]}
```

Queuing is not publishing. The background poster flushes due items every
ten minutes, so a week queued on Sunday has a veto window on every post —
the earliest fires Monday morning. Veto with `DELETE /linkedin/queue/{id}`.

### 7. Then, and only then, the rest of the week's content

The posts are queued and the cadence is safe. Now do the expensive work.
If a run is going to run short, it runs short **here**, not above.

**7a. The long-form piece — published to crox.io.**

- Topic comes from the **SME AI governance and readiness cluster**
  (decided 2026-07-28): one topical cluster matching the homepage buyer.
- Every article ends at the readiness scorecard (`/assessment`).
- Publish via the markdown pipeline: `client/src/content/insights/<slug>.md`
  plus a `blogPosts.ts` entry (or `content/learn/` plus `learnPosts.ts`
  for a Learn piece). `llms.txt` and the RSS feed pick it up on build.
- Check it builds (`cd client && npm run build`) before committing.
- Verify any factual or legal claim against a primary source. The site's
  EU AI Act content was wrong for a week in August 2026 because a
  deadline moved and nothing re-checked it.

**7b. TikTok scripts — drafts only.**

Never posted by this routine or any other automation. Drafts for Adam.

**Authorisation, unchanged (Adam, 2026-07-27):** publishing the article
to crox.io and queueing the LinkedIn posts are both authorised. Nothing
else posts to any platform by any other means.

### 8. Verify before finishing — do not skip

The failure this routine is recovering from was a run that ended green
having produced nothing. Before writing the log entry:

```
GET https://chat.crox.io/linkedin/queue
```

Confirm **five pending items** exist for the coming Monday–Friday. If
there are fewer, the run has failed at its most important job: say so at
the top of the report, in plain words, and do not describe the run as
successful. A quiet week is the one outcome that must never look fine.

### 9. Append the log entry

Newest first in `content/LEARNING-LOG.md`: the date, last week's verdict,
this week's hypothesis, the five posts with their formats, the article
published, and the sources behind any factual claims. Commit it. **An
unappended log entry means the routine did not run** — that is the
tripwire, backed by the server's empty-queue alarm.

## Measurement (changed 2026-08-09)

Dropping links removed the only automated per-post signal. Clicks per
post no longer exist. What is left, in order of worth:

1. **Conversions.** Assessment submissions, contact forms, and chat
   conversations in the window after a post. Fewer, slower, and worth
   more than any click ever was.
2. **Replies and DMs.** Adam-reported. On a no-link cadence, a reply is
   the strongest signal available.
3. **Impressions and reactions.** Adam-supplied from LinkedIn's own
   analytics; the API cannot read them. Optional — never block the loop
   waiting for them.

Attribution is now weaker and honest about it. If we ever want per-post
numbers back without putting a link in the body, the middle path is a
tracked link in the first comment — worth testing as a deliberate
hypothesis, not a silent change.

## If posting has stopped

Diagnose in this order — the last outage was the third one:

1. `GET /linkedin/status` — token expired? (`token_days_left`) Not
   connected? Re-auth at `/linkedin/auth`.
2. `GET /linkedin/queue` — any item with `post_error`? A `426
   NONEXISTENT_VERSION` means `_API_VERSION` in
   `server/app/services/linkedin.py` has aged out; LinkedIn sunsets
   versions about twelve months after release.
3. **Is the queue simply empty?** Then nothing is broken and the
   Sunday schedule stopped running. The server should already have
   emailed about this. Check the recurring session still exists,
   and check whether `LEARNING-LOG.md` has an entry for the last Sunday.
   No entry, empty queue, healthy token — the routine did not run.

## Cadence

Written Sundays, published Monday to Friday. Every working day, always
a week in hand.
