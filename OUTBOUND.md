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
- Every sourced contact gets a Dossier note: what they do, growth/tech
  signals, the angle, and where the email was found.

## The email itself

- Written fresh per prospect from the Dossier angle — no template with
  the name swapped. If the angle is stale (news moved on), re-research
  before writing.
- Fred's voice rules apply (see `server/prompts/system.md`): plain
  English, short sentences, British spelling, no marketing speak, one
  em-dash max per paragraph.
- Shape: 1 line that proves we looked at *their* business → 1–2 lines
  connecting a specific process pain to what Crox does → one soft CTA.
- CTA is ONE of: the AI Readiness Scorecard (crox.io/assessment), the
  board briefing (crox.io/insights/static-controls-live-models), or a
  30-min call (https://calendar.app.google/dmmq9bdFyc11G8Km8). Pick
  whichever matches the prospect's altitude — briefing for boards/CEOs,
  scorecard for ops-level, call only when the fit is obvious.
- Under 120 words. No attachments. No prices. Sign as Adam Field, Crox.
- Firm-level inboxes (info@/hello@): write the first line so a
  gatekeeper would forward it.

## Sending mechanics

- All cold sends go through `POST https://chat.crox.io/outbound/send`
  (admin bearer token). The endpoint enforces: suppression list,
  no duplicate first-touches, daily cap, unsubscribe footer +
  List-Unsubscribe headers. Do not send cold email any other way.
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
