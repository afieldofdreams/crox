# Fred on social

Fred is a consumer product — an AI agent for families, live at
fred.crox.io. Crox is a B2B consultancy selling to SME owners. They are
different audiences and the same post will not serve both.

Adam's call (2026-08-10): **all three platforms, but Fred appears on
LinkedIn as build-in-public, not as a product pitch.**

## The framing, per platform

| Platform | Framing | Why |
|---|---|---|
| **LinkedIn** | Build-in-public. What building Fred taught me, with real numbers. | The audience is SME owners deciding whether Adam can build. Fred is proof of capability, not a product they'll buy. A family-AI pitch here dilutes the SME positioning the rest of the content strategy rests on. |
| **X** | The product, plainly. What Fred does, what it costs, what broke. | Mixed audience, tolerant of both builder and product talk. Premium account, so LinkedIn copy can be reposted nearly verbatim when it fits. |
| **Instagram** | Visual. Cards, screenshots, short demos. | The consumer audience actually lives here. Also the only platform where the copy *cannot* be reused — see below. |

## Instagram needs pictures, and that is not a preference

There is no text-only Instagram feed post. The publishing API supports
photos, Reels, carousels, and Stories — every one requires an image or a
video. The text-only copy that goes to LinkedIn and X cannot be posted
to Instagram in any form.

So a Fred idea becomes an Instagram post by way of `scripts/social-card.mjs`:

```bash
node scripts/social-card.mjs \
  --text "Every family runs on admin nobody signed up for." \
  --shape portrait --theme fred --out fred-card.png
```

Portrait (1080×1350) takes the most feed space; `--shape square` and
`--shape story` are there for carousels and Stories. `--theme crox`
switches to the consultancy palette for Crox posts.

Cards suit a single sharp line. Screenshots of Fred doing something real
will outperform a typographic card every time — use cards when there is
nothing to screenshot, not as the default.

## Example set — one idea, three platforms

**The idea:** the invisible admin load families carry.

**LinkedIn (build-in-public):**

> I built an AI agent for my own family before I built one for a client.
>
> The reason was selfish. Every household runs on admin nobody agreed to
> do: the form that needs signing, the appointment that needs moving, the
> thing that needs buying before Thursday. It sits with whoever notices
> it first.
>
> What building it taught me transferred straight into client work. The
> hard part was never the model. It was deciding what the agent is
> allowed to do on its own, what it has to ask about, and how a person
> sees what it did. Exactly the questions that decide whether an
> automation survives in a business.
>
> Consumer software gets tested harder than most business software,
> because the people using it have no obligation to be patient.
>
> What's the equivalent invisible admin in your firm?

**X (product, same idea, direct):**

> Built Fred because every family runs on admin nobody signed up for.
>
> The form that needs signing. The appointment that needs moving. The
> thing that needs buying before Thursday.
>
> It sits with whoever notices it first. Usually the same person.

**Instagram (card):**

> `--text "Every family runs on admin nobody signed up for."`
> Caption carries the longer version; the card carries the line.

## Rules that still apply

Everything in `OUTBOUND.md` — Reads-human, voice examples — and the hard
rules in `WEEKLY-ROUTINE.md`: no invented anecdotes, no fabricated
numbers, no links in the body. Fred posts describe a product Adam
actually built and uses. Nothing about a real family goes in a post
without Adam saying so explicitly, and it is his family, so the default
is nothing.

## Status

- **LinkedIn** — live, working.
- **X** — code shipped, needs credentials (see `ROUTINE-PROMPT.md` and
  the config block in `server/app/config.py`). Queued X posts error
  rather than vanish until then.
- **Instagram** — card generator ready; publishing blocked on a Meta app,
  an Instagram Professional account linked to a Facebook Page, and App
  Review (2–4 weeks). Nothing is wired to publish there yet, deliberately.
