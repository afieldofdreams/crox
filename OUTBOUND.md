# The Crox Outbound Playbook

Rules for the outbound half of the lead machine. The daily routine (a
scheduled Claude session) and any human doing outreach both follow this
document. If a rule here conflicts with convenience, the rule wins.

## The pipeline

Lives in Fibery (`wildgriffin.fibery.io`), CRM space — no separate tool:

- **CRM/Company** — the firm. `Type=Prospect`, `Pipeline=Crox Direct`,
  `Source=Cold Outbound` for machine-sourced records.
- **CRM/Contact** — the person. `Dossier` holds the research: sector,
  published email + where it was found, research notes, and the one-line
  **angle** the first email must lead with. Contact workflow:
  Identified → Researched → Outreach Sent → Qualified → …
- **CRM/Deal** — one per company, named `<Company> — AI Mapping`.
  Workflow lives HERE (Adam's design): Identified → Outreach Sent →
  Conversing → Call Booked → SoW Sent → Won/Lost. Source attribution at
  Deal level feeds the 90-day gate scoring.

## Targeting

- UK SMEs (~10–250 staff) in: **accounting**, **care sector**,
  **insurance broking / fintech**. Professional-services adjacents are
  fine.
- **Never legal practices or legal tech** — conflict with SideLight.
- Never competitors, never sole traders, never Big 4 / national chains.

## Sourcing rules

- Only **publicly published** contact details (their website, LinkedIn,
  CQC/FCA registers). **Never pattern-guess an email address**
  (no `j.smith@…` construction). If nothing is published, record
  "none published" + the contact-form URL and leave the contact OUT of
  the email cadence.
- **A named person's direct address beats a firm inbox, always.**
  Firm inboxes (info@/hello@/enquiries@) are gatekeeper triage — treat
  them as a last resort, and send them a routing email (below), never
  the pitch. Before settling for info@, run
  `GET https://chat.crox.io/outbound/harvest?domain=<firm domain>`
  (admin token): it fetches the firm's own contact/team pages and
  returns every address they publish, each with its source page.
- Every sourced contact gets a Dossier note: what they do, growth/tech
  signals, the angle, and where the email was found.
- **Evidence rule:** every dossier needs at least one checkable,
  current detail that proves the pain — a live job ad, a review, a
  filing, a press quote. Pain must be evidenced, never asserted from
  sector averages.

## The email itself

- Written fresh per prospect from the Dossier angle — no template with
  the name swapped. If the angle is stale (news moved on), re-research
  before writing. Vary the structure between emails: a batch that
  shares one visible skeleton reads as a template no matter how
  bespoke the research is.
- Fred's voice rules apply (see `server/prompts/system.md`): plain
  English, short sentences, British spelling, no marketing speak, one
  em-dash max per paragraph.
- **Open with the evidence, not a compliment.** The first line is the
  dossier's checkable detail ("you've got openings up for two
  onboarding admins"), never flattery ("impressive growth"). The
  compliment-then-pitch shape is the most recognisable cold-email
  trope there is.
- **Outcome language, not deliverable language.** Owners buy back
  evenings and avoided hires, not "mappings" and "roadmaps". Say what
  they stop doing by hand, not what document they receive.
- **One proof point, one clause.** Canary (canary.crox.io) for care
  prospects; the decade shipping AI in regulated environments
  (Babylon Health, fintech scoring) for lenders and brokers. Never a
  paragraph of credentials.
- CTA: the **preferred CTA is a one-word reply** — offer to send one
  specific, named artefact ("want the one-pager on what this looked
  like for another three-home group? Reply 'yes'"). Replies are the
  metric; make replying the cheapest possible action. The scorecard
  (crox.io/assessment), board briefing
  (crox.io/insights/static-controls-live-models) and 30-min call
  (https://calendar.app.google/dmmq9bdFyc11G8Km8) remain options where
  the altitude clearly fits — one CTA only, never two.
- **Subjects read like internal memos**, not marketing: plain, short,
  specific ("client onboarding at Sedulo"). Clever subjects signal
  cold email before the first line is read.
- Under 120 words. No attachments. No prices. Sign as Adam Field, Crox.

### Reads-human rules

The fastest way to sound like AI is to be too tidy. Every draft must
survive this checklist before sending; rewrite any line that fails.

- **No lists of three.** "Onboarding, quoting and monthly reporting"
  is a model fingerprint. Name ONE thing and let it carry the email.
- **Banned phrases:** "genuinely", "exactly the kind of", "quietly",
  "the usual cost of", "that's exactly what", "impressive",
  "I help firms like yours", "serious trajectory",
  "the good kind of problem", "worth 30 minutes?".
- **No aphorisms.** If a sentence would look at home on LinkedIn
  ("map the processes, rank the winners, build what pays"), cut it.
- **One idea per email.** Offer OR process OR proof — never all three.
- **Mess is allowed.** Fragments are fine. Starting with "And" or
  "But" is fine. Flawless balanced prose is itself a tell.
- **The hook: 12 words or fewer, no adjectives, unwritable about any
  other firm.** Allowed shapes: blunt observation ("You're hiring two
  onboarding admins."), direct question ("Who chases your January
  records?"), admission ("You don't know me."), specific moment ("Saw
  the Westhill Park opening in Care Home Professional.").
- **Mandatory self-check pass:** after drafting, list every phrase a
  reader could flag as "AI wrote this", rewrite each one, and only
  then send. If the email wouldn't survive being read aloud to a
  stranger in a lift, it isn't done.

### Voice examples

Imitate the register of these — never quote them. (INTERIM: written
as placeholders; replace with real emails Adam has written as soon as
a few are supplied.)

> **Subject: your onboarding admin ad**
>
> Hi Dan,
>
> You're advertising for an onboarding administrator. Before you
> hire, it might be worth seeing how much of that job AI can now do —
> the records chasing in particular. I map this for independent firms.
> Three weeks, and you get a straight answer on what's worth
> automating and what isn't.
>
> Want the one-pager from another Midlands firm? Reply yes and it's
> yours.
>
> Adam
> Crox — crox.io

> **Subject: quick question** *(routing email to a firm inbox)*
>
> Morning — could you point me at whoever looks after client
> onboarding? I've got something specific for them and I'd rather not
> clutter this inbox with it. Happy to write to them directly.
>
> Thanks,
> Adam Field, Crox
- **Firm-level inboxes get a routing email, not the pitch:** three
  lines maximum, no selling, one easy ask — "could you point me at
  whoever looks after <process>? Happy to write to them directly."
  A gatekeeper answers a routing question far sooner than they forward
  a pitch, and the answer yields a named contact. The routing email
  counts as that address's touch.

## Sending mechanics

- All cold sends go through `POST https://chat.crox.io/outbound/send`
  (admin bearer token). The endpoint enforces: suppression list,
  no duplicate first-touches, daily cap, DNS deliverability check
  (refuses with `undeliverable_domain` when the address's domain has
  no mail records), unsubscribe footer + List-Unsubscribe headers.
  Do not send cold email any other way.
- `GET /outbound/engagement` reports per-send Resend state
  (delivered/opened/bounced); `GET /outbound/harvest?domain=` finds
  published addresses on a firm's own site. Both take the admin token.
- Sender is `OUTBOUND_FROM_EMAIL` — a Resend-verified address on a
  dedicated subdomain, never bare `@crox.io`. Replies go to
  `adam@crox.io` via Reply-To.
- Check `GET /outbound/status` first. If `configured: false`, do not
  send anything — write the drafts into the contact's Activity Stream
  in Fibery and stop.
- Volume: ≤10 first-touches per weekday while the sending domain warms
  up (first 4 weeks), then at most the endpoint's daily cap. Weekdays
  only, UK morning.

## Cadence

- First touch → wait **4 working days** → one follow-up (shorter, new
  information or a different asset, never "just bumping this") → wait
  **6 working days** → one final follow-up → stop. Three touches max,
  ever.
- Any reply stops the cadence immediately: move Deal to `Conversing`,
  record the reply in the contact's Activity Stream, and leave the
  human conversation to Adam.
- Opt-outs suppress themselves (the /unsubscribe link writes straight
  to the suppression table). Bounces do NOT self-suppress: each run
  must check the previous days' sends in Resend and register every
  bounced address via `POST /outbound/suppress` (admin token, body
  `{"email": ..., "reason": "bounced"}`), then note the bounce in the
  contact's Activity Stream. Never re-add a suppressed address.
- Before sending a follow-up, check the contact's Activity Stream for
  a bounce note or hold instruction (e.g. out-of-office with a return
  date) — a hold overrides the cadence clock.
- If a contact's Activity Stream contains a "DRAFT follow-up" entry
  written by a previous session, send that draft verbatim (with
  `follow_up: true`) rather than writing a new one.

## After each run, update Fibery

- Contact → `Outreach Sent`, Deal → `Outreach Sent` on first touch.
- Append to the contact's Activity Stream: date, subject, and the full
  body of what was sent.

## Compliance (UK PECR / GDPR)

- B2B outreach to corporate addresses under legitimate interest:
  always identify Crox Ltd, always include the working unsubscribe
  link (the endpoint appends it), always honour opt-outs immediately.
- Store only business-relevant data in the CRM. If someone asks where
  we got their details, the Dossier's `email_source` line is the answer.
