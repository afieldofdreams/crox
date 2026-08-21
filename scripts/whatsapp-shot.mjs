#!/usr/bin/env node
/**
 * WhatsApp chat screenshot generator — Fred marketing creative.
 *
 * Renders a pixel-accurate replica of the iOS WhatsApp chat screen in
 * headless Chromium at true iPhone resolution (390x844 logical, @3x =
 * 1170x2532), driven by a JSON chat script. Any Fred conversation
 * becomes an Instagram/X-ready image on demand.
 *
 * HONESTY RULE (house rule, same family as "never invent"): these are
 * product demonstrations. The conversation shown must be one Fred can
 * actually have — real capabilities, real pricing, archetypal
 * scenarios. Never present a generated shot as a real user's chat, and
 * never show Fred doing something the product does not do.
 *
 * Usage:
 *   node scripts/whatsapp-shot.mjs --chat convo.json --out shot.png
 *   node scripts/whatsapp-shot.mjs --demo --out shot.png
 *
 * Chat script JSON:
 *   {
 *     "contact": "Fred",           // header name
 *     "status": "online",          // header subtitle
 *     "messages": [
 *       {"day": "Today"},                              // day pill
 *       {"e2e": true},                                 // encryption notice
 *       {"from": "me",   "text": "...", "time": "17:42", "forwarded": true},
 *       {"from": "them", "text": "...", "time": "17:42"},
 *       {"from": "them", "typing": true}               // typing indicator
 *     ]
 *   }
 *
 * "me" = the user (green bubbles, blue read ticks); "them" = Fred
 * (white bubbles, the real brand avatar in the header). Times are
 * whatever the script says — pick believable ones.
 *
 * Options:
 *   --chat   path to the chat script JSON (or --demo for a sample)
 *   --out    output PNG. Default whatsapp-shot.png
 *   --video  render the conversation as an animated MP4 instead: the
 *            messages appear one by one, with a pulsing typing
 *            indicator before each Fred reply. Pass the output path
 *            (e.g. --video demo.mp4). Needs system ffmpeg with libx264
 *            (`apt-get install ffmpeg` — the Playwright-bundled one is
 *            VP8-only, which iPhones won't play).
 *   --time   status bar clock. Default "17:42"
 *   --scale  device pixel ratio. Default 3 (real iPhone)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const W = 390;
const H = 844;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else { out[key] = next; i++; }
  }
  return out;
}

function findChromium() {
  // Prefer the headless shell: full Chrome's old headless mode reserves
  // window-chrome height inside --window-size, so the bottom ~70px of
  // the viewport silently never paints — which for this layout is
  // exactly where the composer bar lives.
  const shells = (() => {
    try {
      const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
      return readdirSync(base)
        .filter((d) => d.startsWith('chromium_headless_shell'))
        .map((d) => join(base, d, 'chrome-linux', 'headless_shell'));
    } catch { return []; }
  })();
  const candidates = [
    process.env.CHROME_PATH,
    ...shells,
    '/opt/pw-browsers/chromium',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  throw new Error('Chromium not found. Set CHROME_PATH.');
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// WhatsApp's own palette (iOS, light mode, 2025+ green-accent design).
const C = {
  green: '#1daa61',        // accent: chevron, call icons
  wallpaper: '#efeae2',    // default chat background
  out: '#d9fdd3',          // outgoing bubble
  inc: '#ffffff',          // incoming bubble
  text: '#111b21',
  meta: '#8696a0',         // times, delivered ticks
  read: '#53bdeb',         // read ticks
  sub: '#667781',          // day pill / e2e text
  bar: 'rgba(249,249,249,0.94)',
  hairline: 'rgba(60,60,67,0.29)',
  icon: '#54656f',
};

// Small hand-drawn SVG icon set. viewBoxes are per-icon; stroke/fill
// colours injected where used.
const ICONS = {
  chevron: `<svg width="12" height="21" viewBox="0 0 12 21"><path d="M10.5 1.5 2 10.5l8.5 9" fill="none" stroke="${C.green}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  video: `<svg width="27" height="18" viewBox="0 0 27 18"><rect x="0.5" y="1" width="18" height="16" rx="4.5" fill="none" stroke="${C.green}" stroke-width="1.9"/><path d="M19.5 7.2 25 3.6a1 1 0 0 1 1.5.9v9a1 1 0 0 1-1.5.9l-5.5-3.6z" fill="none" stroke="${C.green}" stroke-width="1.9" stroke-linejoin="round"/></svg>`,
  phone: `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M4.1 1.4 6 1a1.6 1.6 0 0 1 1.8 1l1.1 2.8a1.6 1.6 0 0 1-.5 1.8L7.2 7.7a12.8 12.8 0 0 0 5.1 5.1l1.1-1.2a1.6 1.6 0 0 1 1.8-.5l2.8 1.1a1.6 1.6 0 0 1 1 1.8l-.4 1.9a1.9 1.9 0 0 1-2 1.5C9.3 18.7 1.3 10.7 1 3.4a1.9 1.9 0 0 1 1.5-2z" fill="none" stroke="${C.green}" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  plus: `<svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 3v16M3 11h16" stroke="${C.icon}" stroke-width="2" stroke-linecap="round"/></svg>`,
  camera: `<svg width="24" height="21" viewBox="0 0 24 21"><path d="M7.5 3.2 8.6 1.4A1.4 1.4 0 0 1 9.8.8h4.4a1.4 1.4 0 0 1 1.2.6l1.1 1.8H21a2.4 2.4 0 0 1 2.4 2.4v11.7A2.4 2.4 0 0 1 21 19.7H3a2.4 2.4 0 0 1-2.4-2.4V5.6A2.4 2.4 0 0 1 3 3.2z" fill="none" stroke="${C.icon}" stroke-width="1.7"/><circle cx="12" cy="11" r="4.4" fill="none" stroke="${C.icon}" stroke-width="1.7"/></svg>`,
  mic: `<svg width="16" height="23" viewBox="0 0 16 23"><rect x="4.6" y="0.9" width="6.8" height="13" rx="3.4" fill="none" stroke="${C.icon}" stroke-width="1.7"/><path d="M1 10.5a7 7 0 0 0 14 0M8 17.5v4.5" fill="none" stroke="${C.icon}" stroke-width="1.7" stroke-linecap="round"/></svg>`,
  sticker: `<svg width="22" height="22" viewBox="0 0 22 22"><path d="M11 1a10 10 0 1 0 10 10 3.3 3.3 0 0 1-.3-1.4V6.3A5.3 5.3 0 0 0 15.4 1z" fill="none" stroke="#8e8e93" stroke-width="1.6"/><path d="M14.6 1.4A7 7 0 0 1 20.7 7.5" fill="none" stroke="#8e8e93" stroke-width="1.6" stroke-linecap="round"/><circle cx="7.6" cy="8.9" r="1.05" fill="#8e8e93"/><circle cx="14.4" cy="8.9" r="1.05" fill="#8e8e93"/><path d="M7 13a5.4 5.4 0 0 0 8 0" fill="none" stroke="#8e8e93" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  send: `<svg width="17" height="18" viewBox="0 0 17 18"><path d="M8.5 16.5V2M2.2 8 8.5 1.6 14.8 8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  globe: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.4" fill="none" stroke="#50555c" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="4.2" ry="9.4" fill="none" stroke="#50555c" stroke-width="1.6"/><path d="M2.6 12h18.8M4 7h16M4 17h16" stroke="#50555c" stroke-width="1.6"/></svg>`,
  dict: `<svg width="16" height="24" viewBox="0 0 16 24"><rect x="4.6" y="1" width="6.8" height="13" rx="3.4" fill="none" stroke="#50555c" stroke-width="1.6"/><path d="M1 11a7 7 0 0 0 14 0M8 18v5" fill="none" stroke="#50555c" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  shift: `<svg width="22" height="19" viewBox="0 0 22 19"><path d="M11 1 2 10.4h5v7.2h8v-7.2h5z" fill="none" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  bksp: `<svg width="24" height="18" viewBox="0 0 24 18"><path d="M8.6 1h13a1.6 1.6 0 0 1 1.6 1.6v12.8a1.6 1.6 0 0 1-1.6 1.6h-13L1 9z" fill="none" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/><path d="m11.6 5.8 6.4 6.4m0-6.4-6.4 6.4" stroke="#000" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  signal: `<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#000"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#000"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#000"/><rect x="15" y="0.5" width="3" height="11.5" rx="1" fill="#000"/></svg>`,
  wifi: `<svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 11.6 5.4 8.4a4.4 4.4 0 0 1 6.2 0zM3.2 6.1a7.7 7.7 0 0 1 10.6 0l-1.9 2a5 5 0 0 0-6.8 0zM.9 3.7l-.9-1a12.4 12.4 0 0 1 17 0l-.9 1a11 11 0 0 0-15.2 0z" fill="#000"/><path d="M1 3.6a11.3 11.3 0 0 1 15 0L14.1 5.6a8.6 8.6 0 0 0-11.2 0z" fill="#000"/></svg>`,
  battery: `<svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="rgba(0,0,0,0.36)"/><rect x="2" y="2" width="15" height="9" rx="2.3" fill="#000"/><path d="M25.5 4.5v4a2.2 2.2 0 0 0 0-4z" fill="rgba(0,0,0,0.4)"/></svg>`,
  fwd: `<svg width="13" height="11" viewBox="0 0 13 11"><path d="M7.5 1 12 5.5 7.5 10V7.2C3.5 7.2 1.6 8.6 1 10.6 1 6.2 3.6 3.9 7.5 3.8z" fill="${C.meta}"/></svg>`,
  tick1: `<svg width="15" height="10" viewBox="0 0 15 10"><path d="M1 5.3 4.2 8.6 10.3 1.4" fill="none" stroke="COL" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  tick2: `<svg width="16" height="10" viewBox="0 0 16 10"><path d="M1 5.3 4.2 8.6 10.3 1.4" fill="none" stroke="COL" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.2 7.4l1.2 1.2 6.3-7.2" fill="none" stroke="COL" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function ticks(status) {
  if (!status || status === 'none') return '';
  const col = status === 'read' ? C.read : C.meta;
  const icon = status === 'sent' ? ICONS.tick1 : ICONS.tick2;
  return icon.replaceAll('COL', col);
}

// The three pulse phases of the typing indicator, as per-dot opacities.
const TYPING_PHASES = [
  [1, 0.55, 0.3],
  [0.35, 1, 0.55],
  [0.55, 0.35, 1],
];

function bubbleHtml(msg, side, groupFirst) {
  const fwd = msg.forwarded
    ? `<div class="fwd">${ICONS.fwd}<span>Forwarded</span></div>`
    : '';
  if (msg.typing) {
    const ph = TYPING_PHASES[(msg.typingPhase || 0) % TYPING_PHASES.length];
    const dots = ph
      .map((o, i) => `<span class="dot" style="opacity:${o}${i === 2 ? ';margin-right:0' : ''}"></span>`)
      .join('');
    return `<div class="row them"><div class="bubble them${groupFirst ? ' first' : ''} typing">${dots}</div></div>`;
  }
  const meta = `<span class="meta">${esc(msg.time || '')}${side === 'me' ? ticks(msg.status || 'read') : ''}</span>`;
  const tail = groupFirst ? ' first' : '';
  const text = esc(msg.text).replace(/\n/g, '<br>');
  return `<div class="row ${side}"><div class="bubble ${side}${tail}">
    ${fwd}<span class="txt">${text}</span>${meta}
  </div></div>`;
}

// iOS keyboard height at 390pt width (keys + globe/dictation strip +
// home-indicator area). The composer rides on top of it when raised.
const KB_H = 268;

/** The iOS light QWERTY keyboard as HTML. pressKey (a single lowercase
 *  char, or ' ') gets the darkened pressed state. */
function keyboardHtml(pressKey) {
  const key = (label, cls = '', w = null) => {
    const pressed =
      pressKey != null &&
      ((label === 'space' && pressKey === ' ') || label === pressKey)
        ? ' pressed'
        : '';
    const style = w ? ` style="flex:0 0 ${w}px"` : '';
    return `<div class="key ${cls}${pressed}"${style}>${label}</div>`;
  };
  const row1 = 'qwertyuiop'.split('').map((c) => key(c)).join('');
  const row2 = 'asdfghjkl'.split('').map((c) => key(c)).join('');
  const row3 = 'zxcvbnm'.split('').map((c) => key(c)).join('');
  return `<div class="kb">
    <div class="krow">${row1}</div>
    <div class="krow inset">${row2}</div>
    <div class="krow">
      <div class="key fn" style="flex:0 0 44px">${ICONS.shift}</div>
      <div class="kgap"></div>${row3}<div class="kgap"></div>
      <div class="key fn" style="flex:0 0 44px">${ICONS.bksp}</div>
    </div>
    <div class="krow">
      ${key('123', 'fn small', 87)}${key('space', 'space')}${key('return', 'fn small', 87)}
    </div>
    <div class="kstrip">${ICONS.globe}${ICONS.dict}</div>
    <div class="khome"><div></div></div>
  </div>`;
}

/**
 * enterP (0..1, optional): how far the LAST message in the list has
 * entered. WhatsApp's arrival animation is the new bubble sliding up
 * from the composer while everything above glides up to make room.
 * With static frames the new row's height is unknown at authoring
 * time, so an inline script measures it and shifts the whole chat
 * column down by (1-p) * height — the layout has already made room,
 * the transform hands it back, and easing p across frames produces
 * the glide. The new bubble itself fades and rises the last few px.
 *
 * kb (0..1): how far the keyboard has slid up. The composer rides on
 * its top edge and the chat compresses above it, like the real app.
 * draft: text sitting in the composer field (caret after it, camera
 * and mic replaced by the green send button).
 * pressKey: which key renders pressed this frame.
 */
function buildHtml(chat, clock, enterP = null, opts = {}) {
  const { kb = 0, draft = null, pressKey = null } = opts;
  const inter = readFileSync(join(HERE, 'assets/fonts/Inter-Variable.ttf')).toString('base64');
  const avatar = readFileSync(join(HERE, 'assets/brand/fred-avatar-400.png')).toString('base64');

  // How far the keyboard has risen, and therefore where the composer
  // sits and where the chat's bottom edge is. With the keyboard up the
  // home indicator belongs to the keyboard, so the composer bar loses
  // its own home-bar strip.
  const kbOff = Math.round(kb * KB_H);
  const bottomH = kb > 0 ? 50 : 71;

  let body = '';
  let prevFrom = null;
  for (const m of chat.messages) {
    if (m.day) { body += `<div class="pill">${esc(m.day)}</div>`; prevFrom = null; continue; }
    if (m.e2e) {
      body += `<div class="e2e">&#128274; Messages and calls are end-to-end encrypted. Only people in this chat can read, listen to or share them.</div>`;
      prevFrom = null; continue;
    }
    const side = m.from === 'me' ? 'me' : 'them';
    body += bubbleHtml(m, side, prevFrom !== side);
    prevFrom = side;
  }

  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family:'Inter'; src:url(data:font/ttf;base64,${inter}) format('truetype'); font-weight:100 900; }
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{font-family:-apple-system,'Inter',sans-serif;position:relative;
     background:${C.wallpaper};-webkit-font-smoothing:antialiased}

/* Absolutely positioned chrome: Chromium's old headless flexbox squashed
   the bottom bar at exactly viewport height, so the layout is pinned
   instead of negotiated. The chat scrolls (clips) behind the translucent
   bars, which is also how iOS actually composites it. */
.top{position:absolute;top:0;left:0;right:0;z-index:2;
     background:${C.bar};backdrop-filter:blur(20px);
     border-bottom:0.5px solid ${C.hairline}}
.status{height:54px;display:flex;align-items:flex-end;justify-content:space-between;
        padding:0 30px 6px 36px}
.clock{font-size:16px;font-weight:600;letter-spacing:-0.3px;color:#000}
.sicons{display:flex;align-items:center;gap:7px}
.header{display:flex;align-items:center;gap:9px;padding:4px 14px 8px 8px}
.back{display:flex;align-items:center;padding:4px 2px 4px 6px}
.avatar{width:38px;height:38px;border-radius:50%;background:url(data:image/png;base64,${avatar}) center/cover}
.who{flex:1;line-height:1.15}
.name{font-size:16px;font-weight:600;color:#000;letter-spacing:-0.2px}
.sub{font-size:12px;color:#8e8e93}
.hicons{display:flex;align-items:center;gap:22px;padding-right:2px}

.chat{position:absolute;top:0;bottom:${bottomH + kbOff}px;left:0;right:0;
      display:flex;flex-direction:column;justify-content:flex-end;
      padding:118px 14px 8px;gap:2px;overflow:hidden}
.pill,.e2e{align-self:center;border-radius:8px;font-size:12.5px;color:${C.sub};
      box-shadow:0 1px 0.5px rgba(11,20,26,0.08)}
.pill{background:rgba(255,255,255,0.95);padding:5px 11px;font-weight:500;margin:5px 0}
.e2e{background:#fdf3c5;padding:6px 11px;text-align:center;max-width:320px;
     line-height:1.35;margin:4px 0 8px}
.row{display:flex;margin-top:2px}
.row.me{justify-content:flex-end}
.row.them{justify-content:flex-start}
.bubble{position:relative;max-width:79%;padding:6px 9px 7px 11px;font-size:16.2px;
        line-height:1.32;color:${C.text};border-radius:16px;
        box-shadow:0 1px 0.5px rgba(11,20,26,0.13)}
.bubble.me{background:${C.out}}
.bubble.them{background:${C.inc}}
.bubble.first{margin-top:8px}
.bubble.me.first{border-top-right-radius:4px}
.bubble.them.first{border-top-left-radius:4px}
.bubble.me.first::after,.bubble.them.first::after{content:'';position:absolute;top:0;
        width:0;height:0;border-top:0 solid transparent}
.bubble.me.first::after{right:-7px;border-left:8px solid ${C.out};
        border-bottom:10px solid transparent}
.bubble.them.first::after{left:-7px;border-right:8px solid ${C.inc};
        border-bottom:10px solid transparent}
.txt{overflow-wrap:break-word;white-space:pre-wrap}
.meta{float:right;display:inline-flex;align-items:center;gap:3px;
      font-size:11px;color:${C.meta};margin:9px -3px -4px 9px;
      position:relative;top:4px}
.fwd{display:flex;align-items:center;gap:5px;font-size:13px;color:${C.meta};
     margin-bottom:3px}
.typing{padding:11px 13px}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;
     background:#9aa4ab;margin-right:3px}

.bottom{position:absolute;bottom:${kbOff}px;left:0;right:0;z-index:2;height:${bottomH}px;
        background:${C.bar};backdrop-filter:blur(20px);
        border-top:0.5px solid ${C.hairline};padding:6px 10px 0}
.composer{display:flex;align-items:center;gap:12px;padding:0 4px}
.field{flex:1;height:35px;background:#fff;border:0.5px solid ${C.hairline};
       border-radius:18px;display:flex;align-items:center;
       padding:0 9px 0 12px;overflow:hidden}
.draft{flex:1;font-size:16px;color:${C.text};white-space:nowrap;overflow:hidden;
       display:flex;align-items:center;justify-content:flex-start}
.draft span{flex:0 0 auto}
.caret{width:2px;height:21px;background:${C.green};margin-left:1px;border-radius:1px}
.spacer{flex:1}
.sendbtn{width:30px;height:30px;border-radius:50%;background:${C.green};
         display:flex;align-items:center;justify-content:center}
.homebar{height:30px;display:flex;align-items:center;justify-content:center}
.homebar div{width:140px;height:5px;border-radius:3px;background:#000}

.kb{position:absolute;bottom:${kbOff - KB_H}px;left:0;right:0;z-index:3;height:${KB_H}px;
    background:#d1d4d9;padding:8px 3px 0}
.krow{display:flex;gap:6px;margin-bottom:11px;padding:0 3px}
.krow.inset{padding:0 ${3 + 20}px}
.kgap{flex:1}
.key{flex:1;height:42px;background:#fff;border-radius:5px;
     box-shadow:0 1px 0 #898a8d;display:flex;align-items:center;
     justify-content:center;font-size:23px;color:#000;font-weight:400}
.key.fn{background:#aeb3be}
.key.small{font-size:15px}
.key.space{font-size:15px}
.key.pressed{background:#aeb3be}
.key.fn.pressed{background:#8b909b}
.kstrip{display:flex;justify-content:space-between;align-items:center;
        padding:8px 28px 0}
.khome{position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:center}
.khome div{width:140px;height:5px;border-radius:3px;background:#000}
</style></head><body>
<div class="top">
  <div class="status">
    <span class="clock">${esc(clock)}</span>
    <span class="sicons">${ICONS.signal}${ICONS.wifi}${ICONS.battery}</span>
  </div>
  <div class="header">
    <span class="back">${ICONS.chevron}</span>
    <div class="avatar"></div>
    <div class="who"><div class="name">${esc(chat.contact || 'Fred')}</div>
    <div class="sub">${esc(chat.status || 'online')}</div></div>
    <div class="hicons">${ICONS.video}${ICONS.phone}</div>
  </div>
</div>
<div class="chat">${body}</div>
<div class="bottom">
  <div class="composer">
    ${ICONS.plus}
    <div class="field">${
      draft === null
        ? `<span class="spacer"></span>${ICONS.sticker}`
        : `<div class="draft"><span>${esc(draft)}</span><span class="caret"></span></div>${draft ? '' : ICONS.sticker}`
    }</div>
    ${draft ? `<div class="sendbtn">${ICONS.send}</div>` : `${ICONS.camera}
    ${ICONS.mic}`}
  </div>
  ${kb > 0 ? '' : '<div class="homebar"><div></div></div>'}
</div>
${kb > 0 ? keyboardHtml(pressKey) : ''}
${enterP === null ? '' : `<script>
  const p = ${enterP};
  const chat = document.querySelector('.chat');
  const rows = chat.children;
  const last = rows[rows.length - 1];
  if (last) {
    const h = last.getBoundingClientRect().height
      + parseFloat(getComputedStyle(last).marginTop || 0) + 2;
    chat.style.transform = 'translateY(' + ((1 - p) * h).toFixed(2) + 'px)';
    last.style.opacity = p.toFixed(3);
    last.style.transform = 'translateY(' + ((1 - p) * 6).toFixed(2) + 'px)';
  }
</script>`}
</body></html>`;
}

// Sample conversation — a real Fred capability (digest a forwarded
// school group-chat message, extract the actionable bits, offer
// reminders), with archetypal details. The opener is a WhatsApp
// forward from the class group because that IS how WhatsApp forwards
// work — an earlier draft opened with a forwarded *email*, which reads
// wrong: forwards come from other chats, and emails don't. Times are
// early evening, the family admin hour.
const DEMO = {
  contact: 'Fred',
  status: 'online',
  messages: [
    { e2e: true },
    { day: 'Today' },
    {
      from: 'me', forwarded: true, time: '17:38', status: 'read',
      text: 'Hi all! Trip money and consent need to be in by Friday 26th Sept please — £9.50 on ParentPay. PE kits back in Monday, and school photos are Thursday 2nd October. Thanks!',
    },
    {
      from: 'them', time: '17:38',
      text: 'Out of the group chat, onto your list. Three things need doing:\n\n1. Trip consent + £9.50 — by Fri 26 Sep\n2. PE kit in school — Monday\n3. School photos — Thu 2 Oct\n\nWant a reminder the evening before each?',
    },
    { from: 'me', time: '17:39', status: 'read', text: 'Yes please' },
    {
      from: 'them', time: '17:39',
      text: 'Done — three reminders set. I’ll nudge you at 7pm the night before each one.',
    },
  ],
};

function screenshot(html, dir, name, scale, chromium) {
  const htmlPath = join(dir, `${name}.html`);
  const shot = join(dir, `${name}.png`);
  writeFileSync(htmlPath, html);
  execFileSync(
    chromium,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      `--force-device-scale-factor=${scale}`,
      `--window-size=${W},${H}`,
      `--screenshot=${shot}`,
      `file://${htmlPath}`,
    ],
    { stdio: 'pipe' }
  );
  if (!existsSync(shot)) throw new Error('Chromium produced no screenshot');
  return shot;
}

/** How long a frame stays on screen: roughly reading speed, longer for
 *  Fred's replies (they carry the demo's content). Seconds. */
function holdFor(msg) {
  const n = (msg.text || '').length;
  return msg.from === 'me'
    ? Math.min(0.9 + n / 110, 2.5)
    : Math.min(1.1 + n / 55, 5.0);
}

/**
 * Animated version: the conversation plays out message by message, with
 * a pulsing typing indicator before each of Fred's replies. Rendered as
 * a sequence of stills (one Chromium screenshot per state) assembled by
 * ffmpeg into an H.264 MP4 — Instagram- and iPhone-friendly.
 */
function renderVideo(chat, clock, out, scale, chromium) {
  const dir = mkdtempSync(join(tmpdir(), 'whatsapp-vid-'));
  const frames = []; // {file, duration}
  let n = 0;
  const snap = (messages, duration, enterP = null, opts = {}) => {
    const html = buildHtml({ ...chat, messages }, clock, enterP, opts);
    const file = screenshot(html, dir, `f${String(n++).padStart(3, '0')}`, scale, chromium);
    frames.push({ file, duration });
  };

  // Arrival animation: ~0.27s of ease-out tween frames at 30fps before
  // the hold, so bubbles glide in instead of cutting in.
  const DT = 1 / 30;
  const TWEEN = 8;
  const easeOut = (t) => 1 - (1 - t) ** 3;
  const appear = (messages, hold, tween = TWEEN, opts = {}) => {
    for (let f = 1; f <= tween; f++) {
      snap(messages, DT, easeOut(f / tween), opts);
    }
    snap(messages, Math.max(hold - tween * DT, 0.2), null, opts);
  };

  const shown = [];
  // Opening state: any leading day pill / e2e notice on their own.
  while (chat.messages.length > shown.length && (chat.messages[shown.length].day || chat.messages[shown.length].e2e)) {
    shown.push(chat.messages[shown.length]);
  }
  snap([...shown], 1.0);

  for (let i = shown.length; i < chat.messages.length; i++) {
    const msg = chat.messages[i];
    if (!msg.day && !msg.e2e && msg.from !== 'me' && !msg.typing) {
      // Fred is typing… the bubble eases in, then two pulse cycles.
      appear([...shown, { from: 'them', typing: true, typingPhase: 0 }], 0.32, 5);
      for (let cycle = 0; cycle < 2; cycle++) {
        for (let phase = cycle ? 0 : 1; phase < TYPING_PHASES.length; phase++) {
          snap([...shown, { from: 'them', typing: true, typingPhase: phase }], 0.28);
        }
      }
    }

    if (msg.from === 'me' && msg.text && !msg.forwarded) {
      // The user types this one: keyboard up, characters land in the
      // composer with the matching key pressed, send, keyboard down.
      // Forwarded messages skip all of this — nobody types a forward.
      for (let f = 1; f <= 4; f++) {
        snap([...shown], DT, null, { kb: easeOut(f / 4), draft: '' });
      }
      snap([...shown], 0.25, null, { kb: 1, draft: '' });
      const steps = Math.min(msg.text.length, 14);
      const per = msg.text.length / steps;
      for (let s = 1; s <= steps; s++) {
        const draft = msg.text.slice(0, Math.round(s * per));
        const ch = draft.slice(-1).toLowerCase();
        snap([...shown], 1 / 15, null, {
          kb: 1, draft, pressKey: /^[a-z ]$/.test(ch) ? ch : null,
        });
      }
      snap([...shown], 0.35, null, { kb: 1, draft: msg.text });
      shown.push(msg);
      appear([...shown], 0.6, TWEEN, { kb: 1 });
      for (let f = 3; f >= 0; f--) {
        snap([...shown], DT, null, { kb: easeOut(f / 4) });
      }
      snap([...shown], Math.max(holdFor(msg) - 0.6, 0.4));
      continue;
    }

    shown.push(msg);
    if (msg.day || msg.e2e) snap([...shown], 0.6);
    else appear([...shown], holdFor(msg));
  }
  // Let the finished conversation breathe before the loop/cut.
  frames[frames.length - 1].duration += 2.0;

  // concat demuxer: last file listed again without a duration so the
  // final hold is honoured.
  const list = frames.map((f) => `file '${f.file}'\nduration ${f.duration}`).join('\n')
    + `\nfile '${frames[frames.length - 1].file}'\n`;
  const listPath = join(dir, 'list.txt');
  writeFileSync(listPath, list);

  try {
    execFileSync(
      'ffmpeg',
      [
        '-y', '-f', 'concat', '-safe', '0', '-i', listPath,
        '-vf', 'fps=30,format=yuv420p',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '18',
        '-movflags', '+faststart',
        out,
      ],
      { stdio: 'pipe' }
    );
  } catch (err) {
    throw new Error(
      'ffmpeg failed (needs system ffmpeg with libx264 — `apt-get install ffmpeg`): '
      + (err.stderr ? String(err.stderr).slice(-400) : err.message)
    );
  }
  const secs = frames.reduce((a, f) => a + f.duration, 0).toFixed(1);
  console.log(`${out}  ${W * scale}x${H * scale}  ${frames.length} frames, ~${secs}s`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const chat = args.demo
    ? DEMO
    : args.chat
      ? JSON.parse(readFileSync(resolve(args.chat), 'utf8'))
      : null;
  if (!chat) {
    console.error('Pass --chat convo.json or --demo. See the header of this file.');
    process.exit(1);
  }

  const scale = Number(args.scale || 3);
  const clock = args.time || '17:42';
  const chromium = findChromium();

  if (args.video) {
    renderVideo(chat, clock, resolve(args.video === true ? 'whatsapp-chat.mp4' : args.video), scale, chromium);
    return;
  }

  const dir = mkdtempSync(join(tmpdir(), 'whatsapp-shot-'));
  const out = resolve(args.out || 'whatsapp-shot.png');
  const shot = screenshot(buildHtml(chat, clock), dir, 'chat', scale, chromium);
  copyFileSync(shot, out);
  console.log(`${out}  ${W * scale}x${H * scale}`);
}

main();
