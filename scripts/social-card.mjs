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
 *        --footer "fred.crox.io" --shape square --theme fred
 *
 * Options:
 *   --text     required. The line on the card. Keep it short — a card is
 *              a headline, not a paragraph. Font size auto-scales.
 *   --kicker   small uppercase label above the text. Default "Fred".
 *   --footer   bottom-right label. Default "fred.crox.io".
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

const THEMES = {
  // Fred is the family product: warmer and lighter than the consultancy.
  fred: { bg: '#1a1512', fg: '#f2ede5', dim: '#c9bfb2', accent: '#e07a3f' },
  crox: { bg: '#12100e', fg: '#e8e4de', dim: '#d0cbc5', accent: '#e05a3a' },
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

function buildHtml({ text, kicker, footer, shape, theme }) {
  const { w, h } = SHAPES[shape];
  const t = THEMES[theme];
  const serif = readFileSync(join(HERE, 'assets/fonts/InstrumentSerif-Regular.ttf')).toString('base64');
  const mono = readFileSync(join(HERE, 'assets/fonts/DMMono-Regular.ttf')).toString('base64');
  const size = fontSizeFor(text, shape);
  const pad = Math.round(w * 0.09);

  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family:'Instrument Serif'; src:url(data:font/ttf;base64,${serif}) format('truetype'); }
@font-face { font-family:'DM Mono'; src:url(data:font/ttf;base64,${mono}) format('truetype'); }
*{margin:0;padding:0;box-sizing:border-box}
body{width:${w}px;height:${h}px;background:${t.bg};color:${t.fg};
     display:flex;flex-direction:column;justify-content:space-between;
     padding:${pad}px;position:relative;overflow:hidden}
.kicker{font-family:'DM Mono',monospace;font-size:${Math.round(w * 0.026)}px;
        letter-spacing:.24em;text-transform:uppercase;color:${t.accent}}
main{display:flex;align-items:center;flex:1;padding:${Math.round(pad * 0.6)}px 0}
h1{font-family:'Instrument Serif',Georgia,serif;font-weight:400;
   font-size:${size}px;line-height:1.14;letter-spacing:-.01em;
   /* Long words must break rather than bleed off the card edge. */
   overflow-wrap:anywhere}
.rule{width:${Math.round(w * 0.11)}px;height:5px;background:${t.accent};margin-bottom:${Math.round(pad * 0.5)}px}
footer{display:flex;justify-content:space-between;align-items:flex-end;
       font-family:'DM Mono',monospace;font-size:${Math.round(w * 0.024)}px;color:${t.dim}}
.glow{position:absolute;right:-14%;top:-14%;width:62%;aspect-ratio:1;border-radius:50%;
      background:radial-gradient(circle,${t.accent}2b 0%,transparent 68%)}
</style></head><body>
<div class="glow"></div>
<div class="kicker">${esc(kicker)}</div>
<main><h1>${esc(text)}</h1></main>
<div>
  <div class="rule"></div>
  <footer><span>${esc(footer)}</span><span>An AI agent for families</span></footer>
</div>
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
    kicker: args.kicker || 'Fred',
    footer: args.footer || 'fred.crox.io',
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
