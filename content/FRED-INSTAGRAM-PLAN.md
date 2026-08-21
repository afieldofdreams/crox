# Fred on Instagram — the from-zero plan

Written 2026-08-21 for @familyfredmin (created 21 Aug, ~0 followers).
Strategy researched against the 2026 algorithm; sources in the session
log. Sits under `FRED-SOCIAL.md` (framing) and Adam's directive that
all Fred social content is marketing: get people to try Fred.

## The zero-follower reality

Three facts decide everything below:

1. **At zero followers, feed posts reach nobody.** Every post is an
   audition for the recommendation engine (Reels tab, Explore,
   suggested posts), not a broadcast. Reels are the primary path to
   non-followers; carousels also get recommended and, from our August
   research, perform disproportionately well per-post for small
   accounts.
2. **The strongest distribution signal in 2026 is sends per reach** —
   people DMing the post to someone — which Mosseri has said carries
   roughly 3–5× the weight of likes for pushing content to
   non-followers. Watch time is the #1 signal for Reels specifically.
   This is a gift: family-admin chaos is the most "send this to your
   co-parent" niche on the platform. Optimise for the send, not the
   like.
3. **Trial Reels — testing content on non-followers — need 1,000
   followers.** Not available at zero. Note the milestone: at 1,000,
   they become the testing tool.

## What to post — three pillars, all Fred

| Pillar | What it is | Job | Format |
|---|---|---|---|
| **The pain** | School group chat chaos, the 900-word email, the permission slip found on the morning it's due, the mental load ledger. | Sends. "Tag the one who runs the group chat." | Reels + carousels |
| **The proof** | Fred actually doing it: screen recording of forwarding a school email, Fred returning the three dates and the £9.50. | Watch time, saves, and belief. This is the marketing. | Reels (screen demos) |
| **The builder** | Solo dad building Fred in public — what broke, what shipped. Face optional. | Trust and differentiation. At most 1 in 5 posts. | Reels or carousel |

Every caption ends with the CTA: **"First month free — link in bio."**
Captions cannot carry clickable links; the bio link
(fredhelpsyour.family) does the converting. Never plain "free" —
first month free, then £19.95/month.

## When to post — the UK parent clock

The audience is UK parents. Their scroll windows, per 2026 UK timing
data: **evenings 6–10pm are the biggest window, Tue–Thu strongest**,
with lunch (~1pm) secondary. For parents specifically the prime slot
is the post-bedtime collapse: **8–9:30pm UK**. Weekend mornings are
when family admin actually gets done — a natural moment for Fred.

## The week (4–5 posts)

| Day | Slot (UK) | Post |
|---|---|---|
| Mon | 8:30pm | **Reel — the pain.** 15–45s, hook in the first 2 seconds ("The school email is 900 words…"). |
| Wed | 8:30pm | **Carousel — the pain, in depth.** 4:5, no music (audio makes IG render 9:16 and crop the cards — learned 21 Aug). 5–7 slides, last slide = Fred + CTA. |
| Thu | 8:30pm | **Reel — the proof.** Screen demo of Fred doing something real. |
| Sat | 9:30am | **Card or carousel — weekend admin.** The Sunday-night school bag excavation, the week ahead. |
| Sun | 8:30pm | **Reel or carousel — rotating:** builder episode (≤1/week) or a second pain post. |

Stories: near-daily once there are followers to see them; at zero they
reach nobody, so weeks 1–2 they are a low priority, not a guilt trip.

## The work that isn't posting

This is the half influencers do and brands skip, and at zero followers
it is most of the growth:

- **15–20 minutes a day engaging as @familyfredmin**: genuine comments
  on UK parenting creators, school-life meme accounts, dad accounts.
  At zero followers, comments on big accounts are the billboard.
- **Reply to every comment, fast.** Early engagement in the first hour
  is what earns wider distribution.
- **SEO everywhere**: Name field "Fred | Family Admin Assistant",
  captions written with real search phrases (school email, family
  organiser, mental load, school group chat). Keywords, not hashtag
  spam — hashtags are dead as a reach tool.
- **The CTA is a send, not a follow**: "Send this to the one who runs
  the group chat" beats "follow for more".

## Rules

- Everything visual follows the Fred brand system in `FRED-SOCIAL.md`.
- No invented users, testimonials, or numbers — archetypal scenarios
  only. Nothing about Adam's real family without his explicit say-so.
- No music on carousels. 4:5 for feed images.
- Consistency beats volume: this calendar must be sustainable for
  8–12 weeks, because the first thousand followers are the slowest.
  Don't add slots in an enthusiastic week two.

## What the automation covers, and what it can't

Once the Meta app is connected (`FRED-SOCIAL.md`, "Connecting
Instagram"), the queue can auto-publish the **image posts** — the
Wednesday carousel slides and Saturday cards — via `platform:
"instagram"` with `/media` URLs.

**Reels creative is generated, posting is manual.**
`scripts/whatsapp-shot.mjs` (added 21 Aug) renders pixel-accurate
WhatsApp conversations from a JSON chat script — stills at true iPhone
resolution, or `--video` for an animated MP4 with messages landing one
by one behind a typing indicator. That covers "the proof" pillar
without filming anything: write the conversation, render, upload from
the phone. The generator's honesty rule applies: only conversations
Fred can actually have, never presented as a real user's chat. The
publisher itself is image-only, so the MP4 is posted natively — which
is where Instagram's own captions/audio tools live anyway.

Cadence decision, connection, and whether the Monday routine takes
over the image slots: Adam's call once the account is connected.
