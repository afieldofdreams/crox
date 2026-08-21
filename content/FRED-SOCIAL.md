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
| **X** | Marketing. Every post sells Fred and ends with the try-Fred link. | Adam's call (2026-08-21): X exists to get people to click and try Fred. Solo-builder content is welcome only when the story is Fred, and it still ends in the CTA. Daily, weekends included. |
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

**X (marketing, same idea, direct, ends in the click):**

> Built Fred because every family runs on admin nobody signed up for.
>
> The form that needs signing. The appointment that needs moving. The
> thing that needs buying before Thursday.
>
> It sits with whoever notices it first. Usually the same person.
>
> Fred takes it. First month free: https://fredhelpsyour.family

**Instagram (card):**

> `--text "Every family runs on admin nobody signed up for."`
> Caption carries the longer version; the card carries the line.

## Rules that still apply

Everything in `OUTBOUND.md` — Reads-human, voice examples — and the hard
rules in `WEEKLY-ROUTINE.md`: no invented anecdotes, no fabricated
numbers. No links on LinkedIn; on X the link **is** the point — every
post ends with `First month free: https://fredhelpsyour.family` (and
never plain "free": first month free, then £19.95/month). Fred posts describe a product Adam
actually built and uses. Nothing about a real family goes in a post
without Adam saying so explicitly, and it is his family, so the default
is nothing.

## Connecting Instagram (one-off)

The server side is built: OAuth flow, self-refreshing token, publisher,
and a `/media` store that converts any uploaded image to the public
JPEG URL Instagram requires. What remains is creating the Meta app —
about five minutes, and no App Review because the app stays in
Development mode posting to our own account.

1. At [developers.facebook.com](https://developers.facebook.com), create
   an app: type **Business** (any name, e.g. "Fred posting"). Leave it
   in **Development mode** — do not publish it.
2. Add the product **Instagram** and choose **API setup with Instagram
   login** (not the Facebook-login variant — that one demands a
   Facebook Page).
3. On that product's setup page: add **@familyfredmin** as an
   **Instagram Tester** (App roles → Roles → Add People → Instagram
   Tester), then accept the invite from Instagram's own settings
   (Apps and Websites → Tester Invites) while logged in as
   @familyfredmin.
4. Under the product's **Business login settings**, set the redirect
   URI — exactly:

   ```
   https://chat.crox.io/instagram/callback
   ```

5. Copy the **Instagram app ID** and **Instagram app secret** from the
   product's API setup page (these are *not* the Meta app id on the
   dashboard) into the server env as `INSTAGRAM_APP_ID` and
   `INSTAGRAM_APP_SECRET`, and redeploy.
6. With the admin token:

   ```bash
   curl -s -H "Authorization: Bearer $CROX_ADMIN_TOKEN" \
     https://chat.crox.io/instagram/auth
   ```

   Open `open_this_url` in a browser logged in as **@familyfredmin**
   and approve. Check it took with `GET /instagram/status`.

The token lasts ~60 days and refreshes itself whenever posting is
active, so unlike LinkedIn this is not a recurring chore — it only
needs redoing if posting stops entirely for two months.

### Posting to Instagram once connected

Two steps, because Instagram only accepts a public JPEG URL:

```bash
# 1. Generate the card, upload it to the media store
node scripts/social-card.mjs --text "..." --shape portrait --theme fred --out card.png
curl -s -X POST -H "Authorization: Bearer $CROX_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"fred-2026-08-24\", \"content_base64\": \"$(base64 -w0 card.png)\"}" \
  https://chat.crox.io/media
# → returns {"url": "https://chat.crox.io/media/fred-2026-08-24.jpg"}

# 2. Queue it like any other post
# POST /linkedin/queue with
# {"platform": "instagram", "image_url": "<that url>",
#  "body": "<caption, max 2200 chars>", "post_at": "..."}
```

The store converts PNG to JPEG automatically (quality 90, alpha
flattened onto Fred's near-black). Captions follow IG SEO practice —
keywords in the caption, no hashtag spam — and 4:5 portrait remains
the format call from the cropping lesson. **No music on carousels.**

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
- **Instagram** — account live: **@familyfredmin** (created 21 Aug 2026).
  **Server automation built 21 Aug 2026**: OAuth connect flow
  (`/instagram/auth`), self-refreshing 60-day token, publisher wired
  into the shared queue (`platform: "instagram"`, requires
  `image_url`), and a `/media` store that turns any uploaded image
  into the public JPEG URL the API demands. Waiting on the one-off
  Meta app setup — see "Connecting Instagram" above. Until then,
  manual/native posting continues; the queue rejects nothing (an
  instagram item just errors `instagram_not_configured` if queued
  before the env vars exist).
