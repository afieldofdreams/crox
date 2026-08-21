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

### 2026-08-21 — X went silent for a week: the runbook never queued it

Adam flagged two things on Friday: LinkedIn was "still posting AI
things", and nothing had gone out on X since the launch post.

**LinkedIn is timing, not a failure.** This week's five posts were
queued by Monday's run — two days *before* Wednesday's solo-builder
repositioning — so the pre-repositioning genre finished out the week
as already noted in the 2026-08-20 entry. The next run writes entirely
under the journey frame.

**X is a real gap, now closed.** The runbook documented the
`platform: "x"` API but never made X a standing output, so no run ever
queued an X post — the only one ever published was the manually queued
launch post (id 19, 20 Aug). Fix, in the same runbook edit: X became a
standing weekly output, and step 8's verification now counts pending
X items as well as LinkedIn ones. Three interim posts (ids 22–24)
were queued Friday to cover Fri–Sun until the next run takes over.

**Raised the same day, Adam's call: X posts daily — seven a week,
weekends included.** Mon–Fri repost the LinkedIn journey bodies
verbatim (afternoon slots; swap in a product post if a body can't
stand alone), Sat–Sun are Fred product posts. Weekends are on because
X's consumer audience doesn't stop on Friday the way LinkedIn's does.
Cost at daily cadence: ~\$0.11 a week from the prepaid balance.

Lesson, same family as the August outage: an output that no step
explicitly produces and no step verifies will silently not exist,
however well the mechanism underneath it works.


### 2026-08-20 — LinkedIn repositioned: the solo builder journey (Adam's call)

Owner directive, mid-week: **every LinkedIn post is now an episode of
Adam's solo builder journey** — one person building a consultancy and a
stable of products in public, with real numbers. Detached AI advice is
out; today's insurance-broker policy post (id 15) is the last of that
genre. The test written into the runbook: could a competent competitor
have written this post? If yes, it isn't a journey post.

Not evidence-led, but the evidence points the same way: build-in-public
took 10 of week zero's 20 clicks, and the only traceable conversion
since (11 Aug, 07:53) landed fifteen minutes after a build-in-public
post.

Effective from the next Sunday run. Friday's queued post (id 16 — nine
posts, one measurable result) already fits the frame and stands. Next
Tuesday's build log should be the Fred launch story: shipped to X on 20
August, first post live, what building and launching it taught.


### 2026-08-17 — week two

**The run fired Monday 07:10 UTC, not Sunday 17:00 as the runbook
specifies.** The Monday 07:30 UTC slot was 20 minutes away and
unreachable, so Monday's post was queued for 11:00 UTC instead. Tue–Fri
are on the normal 07:30. This is a schedule problem, not a content one:
`WEEKLY-ROUTINE.md` says Sundays 17:00 Europe/London, and the recurring
job is still on its old Monday-morning trigger. Until the schedule moves,
every Monday post will either be late or be written under time pressure.
Adam needs to move the trigger.

**Last week's posts all published cleanly.** Ids 7–11, Mon 10 – Fri 14
August, every one with `posted_at` set and `post_error: null`. Token
healthy at 39 days.

**Last week's hypothesis was: timely news commentary, published while
the story is live, out-performs evergreen advice on replies.**

**Verdict: unscoreable, and that is the finding.** Replies and DMs are
Adam-reported and none were reported. The only automated signal left is
conversions, and the whole week produced one:

| Signal | Week of 10–14 Aug |
|---|---|
| Assessment submissions | 1 (Tue 11 Aug, 07:53 UTC) |
| Chat conversations | 0 |
| Contact forms | 0 |
| New pipeline contacts | 0 |
| Clicks | n/a — no links in bodies |

The single submission landed **15 minutes after Tuesday's build-in-public
post**, not after Monday's news post. So the one data point we have
points away from the news hypothesis and, for the second time, towards
build-in-public. The submitter (a Gmail address, company field
"Computer", band Mixed) does not look like a UK SME buyer, so this is
one weak data point and is not being treated as more.

**Decision: kill the practice of setting hypotheses that can only be
scored by data we do not collect.** Last week's test was unfalsifiable
the day it was written — replies were the stated metric and nothing in
the stack can read replies. That is a loop defect, not a content result.
From now on a hypothesis has to name a metric this routine can pull
itself, or it does not get set.

**Where the 62 emails actually went** (Adam asked; worth keeping): 35
firms, not 62 — 13 got one email, 17 got two, 5 got three. Accounting is
24 of the 35 firms and 45 of the 62 sends; care 6 firms; lending/fintech
3; insurance broking only 2. All sent 22–31 July, and **nothing has gone
out in the 17 days since**. Broking being nearly untouched is why
Thursday's sector post went there.

**Escalated to Adam, because it is his call and not mine:** the no-link
cadence has now run two weeks and produced one traceable conversion
across nine posts. The routine cannot A/B a reach hypothesis it has no
reach data for. The middle path this log has already named — a tracked
link in the first comment — is **not executable by this routine**, since
the LinkedIn queue API posts a body and nothing else. So the real choice
is: keep flying blind on reach, or put a link back on one post a week and
accept the reach cost. Not changing it unilaterally.

**This week's hypothesis: a specific number in the first line lifts
engagement, whatever the format.** One variable — the opening line
carries a concrete quantity, as digits. Everything else held: same
format mix, same days, same 07:30 slots (bar Monday), no links. Last
week only 2 of 5 posts opened on a number. This week all 5 do.
Scoreable on conversions, and on impressions if Adam sends them.

**Posts, Mon 17 – Fri 21 August (ids 12–16):**

- Mon 11:00 UTC (id 12) — **News.** ICO has 7 pieces of AI/data guidance
  in drafting; 3 will never go to public consultation, including agentic
  AI (final due winter 2026). The ADM and profiling update (consultation
  closed, due winter 2026) is the one that reaches a UK SME. Source:
  ICO, "Our plans for new and updated guidance — technology",
  ico.org.uk, fetched 17 Aug 2026.
- Tue 07:30 (id 17) — **Build in public.** Only 5 of 62 cold emails
  reached a named person; the other 57 went to a firm inbox or a branch
  address, against the playbook's own named-person rule — 92% of sends.
  The harvester that fixes it already existed and was not being run.
  Source: `/outbound/engagement`, 62 emails, 35 firms, 2 bounced.
  **Corrected before it sent:** the first draft said "48 of 62 / 77%",
  from a pattern-match that missed `contactus@`, `getintouch@` and
  `service@`. Id 13 was deleted and re-queued as id 17. Classify
  addresses explicitly, never by regex — a post whose whole argument is
  "I broke my own rule" cannot afford a soft number.
- Wed 07:30 (id 14) — **Data.** £200m government AI adoption funding,
  £100m of it expanding BridgeAI, announced at the first AI Adoption
  Summit, 8 June 2026 (gov.uk). Argument: the blocker is not money, it
  is that nobody can say what the firm already uses.
- Thu 07:30 (id 15) — **Sector: insurance broking.** A 7-question AI
  policy under Consumer Duty; the never-list is the question doing the
  work. First use of broking — accounting and care are already spent.
- Fri 07:30 (id 16) — **Opinion + question.** 9 posts, 1 measurable
  result; the measurement gap is self-inflicted and the same one the
  firms we sell to have. Ends on a real question, which is also an
  attempt to generate the reply signal we lack.

**Article published:** `/insights/ai-governance-for-smes` — "AI
Governance for SMEs: What You Actually Need Before You Deploy". First
item off the governance/readiness backlog. Ends at `/assessment`, links
the `static-controls-live-models` pillar. Legal claims re-verified
before publishing: ICO ADM guidance due winter 2026 (ico.org.uk); EU AI
Act transparency live 2 Aug 2026, high-risk moved to 2 Dec 2027 —
consistent with the site's corrected EU AI Act article.

**Discarded during research, do not let it back in:** "SME AI adoption
rose from 25% in 2024 to 54% by early 2026" appeared on two low-authority
marketing blogs, contradicts the ONS figure of 35% for businesses with
10+ staff, and has no primary source. Same treatment as the "70% of UK
SMBs" number binned last week.

**Housekeeping:** queue item id 1 is still sitting there from 27 July
with a permanent `linkedin_426 NONEXISTENT_VERSION` error and a body
that reads "Testing a new publishing setup." It has never posted and
appears not to be retried, but it is noise in every queue check. Worth
deleting.

### 2026-08-10 — correction to the diagnosis below

**The routine was never missing. It ran, twice, and produced nothing.**

Yesterday's entry said the recurring session had never been created.
That was wrong, and worth recording plainly because the real failure is
more instructive than the one I invented.

The routine — "Crox weekly content — LinkedIn, insights piece, TikTok
scripts" — exists, is active, and fired on schedule on **Monday 3 August
at 09:16** and again on **Monday 10 August at 09:15**. Both runs are
marked successful. Both produced nothing: no queued posts, no article, no
entry in this log, no commit of any kind. Ten days of silence with a
green tick at each end.

The likely mechanism, and it is inference rather than proof — the run
logs are not available to read: the instructions put the long-form
article ahead of queueing the five posts. The article is the expensive
task and the queue is the cheap, time-critical one, so anything that
exhausted a run — budget, context, a swallowed error — took out the
daily cadence first and left the run looking clean.

**What changed as a result:**

1. Order inverted. Queue the five posts, *then* write the article. If a
   run runs short it now runs short on the article.
2. New step 8: the run must re-read the queue and confirm five pending
   items before finishing. A run that queued nothing has to say so at
   the top of its report and must not describe itself as successful.
3. `_queue_watchdog` in the server (shipped 2026-08-09) emails
   adam@crox.io whenever the queue is empty. Independent of any session,
   so it catches this class of failure whatever the cause.
4. `WEEKLY-ROUTINE.md` now covers all three outputs, not just LinkedIn —
   the earlier version silently narrowed the routine's job to the part I
   happened to be looking at.

**Lesson for this log:** "the automation didn't run" and "the automation
ran and did nothing" look identical from the outside and have opposite
fixes. Check the run history before diagnosing the schedule.

### 2026-08-09 — week one (restart after a nine-day outage)

> **Superseded in part by the 2026-08-10 entry above.** The claim below
> that the recurring session "was never created" is incorrect — it
> existed and had been running. Everything else here stands.

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
