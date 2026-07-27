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
- Any bounce or opt-out: suppression is handled server-side; also
  record it in Fibery and never re-add the address.

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
