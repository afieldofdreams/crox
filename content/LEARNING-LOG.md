# Content learning log

The memory of the content loop. The weekly routine READS this before
writing anything, and APPENDS a dated entry every Monday. Strategy
changes happen here, with evidence, or not at all.

## How the loop works

The full runbook is `content/WEEKLY-ROUTINE.md` — the scheduled session
reads that. In short: read this log, pull last week's numbers, score the
hypothesis, state one new one, write and queue five posts, append here.

## Measurement notes (revised 2026-08-09)

Posts no longer carry links (Adam's call — he believes outbound links
suppress reach). That removed clicks, which had been the only automated
per-post signal. Tracked-link tags `li-YYYYMMDD-slot` apply to the 27–31
July posts only and stop there.

What counts now, in order of worth:

- **Conversions.** Assessment submissions, contact forms, chat
  conversations in the window after a post. Fewer, slower, worth more.
- **Replies and DMs.** Adam-reported. On a no-link cadence this is the
  strongest available signal.
- **Impressions/reactions.** Adam-supplied from LinkedIn analytics; the
  API cannot read them. Optional — never block the loop waiting.
- Small numbers are the norm. Judge direction over weeks, not single
  posts; only act on differences that repeat.

Attribution is genuinely weaker than it was. If per-post numbers are
wanted back without a link in the body, the middle path is a tracked
link in the first comment — run it as a stated hypothesis, not a quiet
change.

## Standing observations

(Seeded 2026-07-27, before any measured posts. Replace with evidence
as it accumulates. A retrospective of Adam's historical LinkedIn posts
is pending his data export — its conclusions go here as week zero.)

- Hypothesis: concrete numbers from real research ("I read 44
  accounting firms' hiring pages") will out-perform opinion posts.
- Hypothesis: sector-specific posts (accounting/care/broking) will
  out-click general AI commentary.
- Hypothesis: posts that read like a person (reads-human rules) will
  out-perform anything with AI tells.

## Weekly entries

### 2026-08-09 — week one (restart after a nine-day outage)

**What happened to week zero's follow-up:** nothing was queued after
Friday 31 July, so posting stopped for nine days. Diagnosis: not a
failure — an absence. Token healthy (47 days left), server up, poster
loop running, all five week-zero posts published cleanly. The queue was
simply empty, because the recurring session that was supposed to take
over from Monday 3 August was never created. No log entry for 3 August
either, which is the tripwire that should have caught it and did not,
because nobody was reading for it.

Fixed by moving the routine's instructions out of the scheduled job and
into `content/WEEKLY-ROUTINE.md`, so a missing schedule is the only
possible failure and an unappended entry here is its visible symptom.

**Week zero's results** (all five carried tracked links; 20 clicks
total):

| Tag | Format | Clicks |
|---|---|---|
| `li-20260729-wed` | Build-in-public, real numbers | 10 |
| `li-20260728-tue` | Research observation | 5 |
| `li-20260730-thu` | Sector how-to (care) | 3 |
| `li-20260731-fri` | Opinion + question | 2 |

**Verdict:** build-in-public with real numbers took half of all clicks
from one of four posts. Consistent with the seeded hypothesis. Far too
small a sample to call, but it is the direction to lean while we gather
more — and Adam has made build-in-public a permanent Tuesday fixture on
the strength of it.

**Two changes this week, which is one too many** — noted so the results
are read with appropriate suspicion:

1. Links removed from post bodies entirely (reach hypothesis).
2. Monday is now a news slot, researched that morning.

**This week's hypothesis:** timely news commentary, published while the
story is live, out-performs evergreen advice on replies. Measured on
replies and DMs, not clicks — there are none to measure any more.

**Posts, Mon 10 – Fri 14 August, 07:30 UTC:**

- Mon — **News.** EU AI Act: transparency obligations live from 2 Aug
  2026 (Art. 50, applies to deployers too); high-risk obligations
  postponed by the Digital Omnibus to 2 Dec 2027, and 2 Aug 2028 for
  AI embedded in regulated products. Sources: European Commission
  announcement (digital-strategy.ec.europa.eu), Cooley, Norton Rose
  Fulbright Data Protection Report. **Includes a public commitment to
  correct crox.io's own EU AI Act article, which currently states the
  high-risk obligations began this month.**
- Tue — **Build in public.** The nine-day outage above, told straight.
- Wed — **Data.** ONS, *Artificial intelligence in UK businesses: 2023
  to 2026* (ref. June 2026): 35% of 10+ staff businesses use at least
  one AI technology, up from ~12% in late 2023; large firms 49%, micro
  28%; average adopter uses 1.6 technologies; only 10% extensive use.
- Thu — **Sector.** Accounting practices: the chase-and-retype layer.
- Fri — **Opinion.** "We're not ready for AI" as three non-AI problems.

**Note for next Monday:** the ONS figures and the AI Act dates were
verified against primary sources before drafting. A "70% of UK SMBs use
AI, 31% see positive ROI" statistic surfaced during research from two
low-authority marketing blogs and was **discarded as unverifiable** —
it is not in the ONS release. Do not let that number back in.

### 2026-07-28 — week zero (baseline; daily cadence begins)

Adam moved the cadence to one post every weekday, starting today.
This week's four posts (Tue–Fri) were queued ad hoc mid-week, so
there is no single hypothesis — the aim is a baseline across four
formats, each with a tracked link card to crox.io:

- `li-20260728-tue` — research observation (100 firms' websites vs
  their job ads).
- `li-20260729-wed` — build-in-public with real numbers (2 of first
  25 emails bounced; the checker built in response).
- `li-20260730-thu` — sector-specific how-to (care providers, daily
  notes via speech-to-text).
- `li-20260731-fri` — opinion with a reply question (one task, not
  an AI strategy).

Next Monday: compare clicks across the four tags, note any replies
or conversions Adam reports, and pick week one's single hypothesis
from whichever format leads. From this week on the routine queues
five posts, Monday to Friday.
