# Fred on social

Fred is a consumer product — your family assistant, on WhatsApp, live
at fredhelpsyour.family. Crox is a B2B consultancy selling to SME owners. They are
different audiences and the same post will not serve both.

Adam's call (2026-08-10): **all three platforms, but Fred appears on
LinkedIn as build-in-public, not as a product pitch.**

## The framing, per platform

| Platform | Framing | Why |
|---|---|---|
| **LinkedIn** | An episode of the solo builder journey: building Fred, with real numbers. | LinkedIn is Adam's builder-journey channel (his call, 2026-08-20). Fred is proof he builds things, told as story — never pitched as a product there. |
| **X** | The product, plainly. What Fred does, what it costs, what broke. | Mixed audience, tolerant of both builder and product talk. Premium account, so LinkedIn copy can be reposted nearly verbatim when it fits. |
| **Instagram** | Visual. Cards, screenshots, short demos. | The consumer audience actually lives here. Also the only platform where the copy *cannot* be reused — see below. |

## The visual system (corrected 2026-08-21)

Fred's brand is the fredhelpsyour.family hero system, and only that:
near-black `#0b0d12` with an indigo glow top (`rgba(99,102,241)`) and a
pink glow bottom-right (`rgba(236,72,153)`), Inter 800 headlines with
the key phrase in periwinkle `#818cf8`, the purple-to-pink gradient F
badge, and white WhatsApp-style reply bubbles as Fred's voice.

The beige/teal/green WhatsApp colours that appear on the site are the
**chat mockup inside the phone frame, not the brand** — the first
attempt at cards and avatars copied them and read as a different
product. `scripts/social-card.mjs` (`--theme fred`) now renders the
hero system, including `[[...]]` for the periwinkle highlight and
`--bubble` for a Fred reply. Profile images (bubble-mark on the dark
gradient, circle-crop safe) live in `scripts/assets/brand/` — 1000px
for Instagram, 400px for X.

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

## Connecting X (one-off)

The callback URL X asks for is:

```
https://chat.crox.io/x/callback
```

X matches it **exactly** — scheme, host, path, no trailing slash. Paste
it, don't retype it. `GET /x/status` returns the same string if it's ever
in doubt.

In the X developer portal, on the app:

1. **User authentication settings** → App permissions **Read and write**,
   Type of App **Web App / Automated App or Bot** (a confidential client,
   which is what the token exchange assumes).
2. **Callback URI**: the URL above. **Website URL**: `https://crox.io`.
3. Copy the OAuth 2.0 **Client ID** and **Client Secret** into the server
   env as `X_CLIENT_ID` and `X_CLIENT_SECRET`. Leave `X_REFRESH_TOKEN`
   empty — the connect flow fills it in.

Then, with the admin token:

```bash
curl -s -H "Authorization: Bearer $CROX_ADMIN_TOKEN" \
  https://chat.crox.io/x/auth
```

Open the `open_this_url` value in a logged-in browser and approve.
**Don't leave the tab sitting** — X authorisation codes expire 30 seconds
after approval, and a slow click comes back as `invalid_grant`.

Check it took with `GET /x/status`. This should be a one-time job: X
rotates the refresh token on every post and the new one is persisted, so
the connection renews itself rather than expiring like LinkedIn's
60-day member token.

## Status

- **LinkedIn** — live, working.
- **X** — live. Connected 19 Aug 2026; first post published the same day
  (the Fred launch post). The connect flow above is kept for reference —
  it should not need running again, since the refresh token renews itself
  on every post.
- **X billing** — prepaid credits, not a monthly bill. Posting stops with
  a `402 credits depleted` the moment the balance hits zero, so a 402 in
  the queue means top up at developer.x.com, not debug the code. A post
  is ~\$0.015, or ~\$0.20 if it contains a link.
- **Instagram** — card generator ready; publishing blocked on a Meta app,
  an Instagram Professional account linked to a Facebook Page, and App
  Review (2–4 weeks). Nothing is wired to publish there yet, deliberately.
