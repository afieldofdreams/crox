#!/usr/bin/env node
/**
 * Branded social card generator.
 *
 * Instagram has no text-only post type — every feed post needs an image
 * or video — so the text-only copy that goes to LinkedIn and X cannot be
 * used there at all. This turns a line of copy into a branded card so
 * the same idea can run on all three networks.
 *
 * Renders HTML in headless Chromium rather than a canvas library: the
 * layout is CSS, so it is inspectable, restyleable, and reuses the real
 * brand fonts (vendored in assets/fonts, no network at render time).
 *
 * Usage:
 *   node scripts/social-card.mjs --text "..." --out card.png
 *   node scripts/social-card.mjs --text "..." --kicker "Fred" \
 *        --footer "fredhelpsyour.family" --shape square --theme fred
 *
 * Options:
 *   --text     required. The headline. Wrap the phrase to highlight in
 *              double square brackets: "Family admin, [[handled.]]" —
 *              on the fred theme it renders periwinkle, like the site.
 *   --bubble   fred theme only: a short message shown in a white
 *              WhatsApp-style reply bubble under the headline, as if
 *              Fred sent it. Optional.
 *   --kicker   label above the text. Default "Fred" (fred theme renders
 *              it as the gradient F badge + wordmark, like the site).
 *   --footer   bottom-left label. Default "fredhelpsyour.family".
 *   --shape    portrait (1080x1350, default) | square (1080x1080) |
 *              story (1080x1920)
 *   --theme    fred (default, warm) | crox (site palette, darker)
 *   --out      output PNG path. Default social-card.png
 *
 * Chromium is located via PLAYWRIGHT_BROWSERS_PATH or CHROME_PATH, or
 * falls back to common locations.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const SHAPES = {
  portrait: { w: 1080, h: 1350 },
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
};

// Palettes come from each brand's live site, not from taste.
// Fred's is the fredhelpsyour.family hero system: near-black base with
// indigo and pink radial glows, Inter 800 headlines with the key phrase
// in periwinkle, the purple-to-pink gradient F badge, and white
// WhatsApp-style reply bubbles as the product's voice. The beige/green
// WhatsApp colours are the CHAT MOCKUP inside the page, not the brand —
// a mistake made once already; do not reintroduce it.
// Crox keeps its dark serif look.
const THEMES = {
  fred: {
    bg: '#0b0d12',
    glowA: 'rgba(99,102,241,0.28)',   // indigo, ellipse at top
    glowB: 'rgba(236,72,153,0.20)',   // pink, ellipse at bottom right
    fg: '#f1f5f9', dim: '#94a3b8',
    accent: '#818cf8',                // periwinkle highlight phrase
    badgeFrom: '#a855f7', badgeTo: '#ec4899',
    bubbleFg: '#111b21', time: '#667781',
    font: 'inter', style: 'panel',
  },
  crox: {
    bg: '#12100e', fg: '#e8e4de', dim: '#d0cbc5', accent: '#e05a3a',
    font: 'serif', style: 'plain',
  },
};

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) continue;
    out[argv[i].slice(2)] = argv[i + 1];
  }
  return out;
}

function findChromium() {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.PLAYWRIGHT_BROWSERS_PATH && join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium'),
    '/opt/pw-browsers/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error(
    'Chromium not found. Set CHROME_PATH, or install Chromium.\nLooked in: ' +
      candidates.join(', ')
  );
}

/** Long text needs a smaller face or it overflows the card. Stepped
 *  rather than continuous so cards in a set look like a set. */
function fontSizeFor(text, shape) {
  const n = text.length;
  const base = shape === 'story' ? 1.15 : 1;
  if (n <= 60) return 92 * base;
  if (n <= 110) return 74 * base;
  if (n <= 180) return 60 * base;
  if (n <= 280) return 48 * base;
  return 40 * base;
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function buildHtml({ text, bubble, kicker, footer, shape, theme }) {
  const { w, h } = SHAPES[shape];
  const t = THEMES[theme];
  const serif = readFileSync(join(HERE, 'assets/fonts/InstrumentSerif-Regular.ttf')).toString('base64');
  const mono = readFileSync(join(HERE, 'assets/fonts/DMMono-Regular.ttf')).toString('base64');
  const inter = readFileSync(join(HERE, 'assets/fonts/Inter-Variable.ttf')).toString('base64');
  const size = fontSizeFor(text.replace(/\[\[|\]\]/g, ''), shape);
  const pad = Math.round(w * 0.09);
  // Story/Reel (9:16) plays under Instagram's own overlays — username up
  // top, caption/CTA at the bottom — so keep a much deeper vertical
  // margin there or the card's chrome sits beneath the app's.
  const padV = shape === 'story' ? Math.round(h * 0.15) : pad;
  const headFont = t.font === 'inter' ? "'Inter',system-ui,sans-serif" : "'Instrument Serif',Georgia,serif";
  const smallFont = t.font === 'inter' ? "'Inter',system-ui,sans-serif" : "'DM Mono',monospace";

  // [[...]] in the headline becomes the site's periwinkle highlight.
  const headline = esc(text).replace(/\[\[/g, '<span class="hl">').replace(/\]\]/g, '</span>');

  if (t.style !== 'panel') {
    return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family:'Instrument Serif'; src:url(data:font/ttf;base64,${serif}) format('truetype'); }
@font-face { font-family:'DM Mono'; src:url(data:font/ttf;base64,${mono}) format('truetype'); }
@font-face { font-family:'Inter'; src:url(data:font/ttf;base64,${inter}) format('truetype'); font-weight:100 900; }
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;background:${t.bg};color:${t.fg};
     display:flex;flex-direction:column;justify-content:space-between;
     padding:${pad}px;position:relative;overflow:hidden}
.kicker{font-family:'DM Mono',monospace;font-size:${Math.round(w * 0.026)}px;
        letter-spacing:.24em;text-transform:uppercase;color:${t.accent}}
main{display:flex;align-items:center;flex:1;padding:${Math.round(pad * 0.6)}px 0}
h1{font-family:${headFont};font-weight:400;font-size:${size}px;line-height:1.14;
   letter-spacing:-.01em;overflow-wrap:anywhere}
.hl{color:${t.accent}}
.rule{width:${Math.round(w * 0.11)}px;height:5px;background:${t.accent};margin-bottom:${Math.round(pad * 0.5)}px}
footer{display:flex;justify-content:space-between;align-items:flex-end;gap:${Math.round(pad*0.4)}px;
       font-family:'DM Mono',monospace;font-size:${Math.round(w * 0.024)}px;color:${t.dim}}
</style></head><body>
<div class="kicker">${esc(kicker)}</div>
<main><h1>${headline}</h1></main>
<div><div class="rule"></div>
<footer><span>${esc(footer)}</span></footer></div>
</body></html>`;
  }

  // Fred panel: the fredhelpsyour.family hero, card-shaped.
  const bubbleHtml = bubble
    ? `<div class="reply"><div class="msg">${esc(bubble)}</div><div class="time">08:12</div></div>`
    : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family:'Inter'; src:url(data:font/ttf;base64,${inter}) format('truetype'); font-weight:100 900; }
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;
     background:radial-gradient(ellipse at top, ${t.glowA}, transparent 60%),
                radial-gradient(ellipse at bottom right, ${t.glowB}, transparent 50%),
                ${t.bg};
     color:${t.fg};font-family:${smallFont};
     display:flex;flex-direction:column;padding:${padV}px ${pad}px;overflow:hidden}
.brand{display:flex;align-items:center;gap:${Math.round(w*0.022)}px}
.badge{width:${Math.round(w*0.062)}px;height:${Math.round(w*0.062)}px;border-radius:50%;
       background:linear-gradient(135deg, ${t.badgeFrom}, ${t.badgeTo});
       display:flex;align-items:center;justify-content:center;
       font-weight:800;font-size:${Math.round(w*0.032)}px;color:#fff}
.wordmark{font-weight:800;font-size:${Math.round(w*0.042)}px;color:${t.fg}}
.domain{font-weight:500;font-size:${Math.round(w*0.026)}px;color:${t.dim};margin-left:${Math.round(w*0.012)}px}
main{flex:1;display:flex;flex-direction:column;justify-content:center;gap:${Math.round(h*0.045)}px}
h1{font-weight:800;font-size:${size}px;line-height:1.12;letter-spacing:-.025em;overflow-wrap:anywhere}
.hl{color:${t.accent}}
.reply{background:#ffffff;color:${t.bubbleFg};align-self:flex-start;max-width:86%;
       border-radius:${Math.round(w*0.022)}px;border-top-left-radius:${Math.round(w*0.006)}px;
       padding:${Math.round(w*0.032)}px ${Math.round(w*0.04)}px ${Math.round(w*0.02)}px;
       box-shadow:0 ${Math.round(w*0.008)}px ${Math.round(w*0.03)}px rgba(0,0,0,.35)}
.msg{font-weight:500;font-size:${Math.round(w*0.036)}px;line-height:1.4}
.time{text-align:right;color:${t.time};font-size:${Math.round(w*0.022)}px;margin-top:${Math.round(w*0.01)}px}
footer{font-weight:500;font-size:${Math.round(w*0.026)}px;color:${t.dim}}
</style></head><body>
<div class="brand"><div class="badge">F</div><span class="wordmark">Fred</span><span class="domain">${esc(footer)}</span></div>
<main><h1>${headline}</h1>${bubbleHtml}</main>
<footer>Your family assistant. On WhatsApp.</footer>
</body></html>`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const text = args.text;
  if (!text) {
    console.error('--text is required. See the header of this file for usage.');
    process.exit(1);
  }
  const shape = args.shape || 'portrait';
  const theme = args.theme || 'fred';
  if (!SHAPES[shape]) {
    console.error(`Unknown --shape ${shape}. Options: ${Object.keys(SHAPES).join(', ')}`);
    process.exit(1);
  }
  if (!THEMES[theme]) {
    console.error(`Unknown --theme ${theme}. Options: ${Object.keys(THEMES).join(', ')}`);
    process.exit(1);
  }

  const html = buildHtml({
    text,
    bubble: args.bubble,
    kicker: args.kicker || 'Fred',
    footer: args.footer || 'fredhelpsyour.family',
    shape,
    theme,
  });

  const dir = mkdtempSync(join(tmpdir(), 'social-card-'));
  const htmlPath = join(dir, 'card.html');
  writeFileSync(htmlPath, html);

  const { w, h } = SHAPES[shape];
  const out = resolve(args.out || 'social-card.png');
  const shot = join(dir, 'shot.png');
  execFileSync(
    findChromium(),
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${w},${h}`,
      `--screenshot=${shot}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'pipe' }
  );
  if (!existsSync(shot)) throw new Error('Chromium produced no screenshot');
  copyFileSync(shot, out);
  console.log(`${out}  ${w}x${h}  ${theme}`);
}

main();
