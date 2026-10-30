var e=`# product_description_writer — app files

## base44/entities/ProductDescription.jsonc
\`\`\`json
{
  "name": "ProductDescription",
  "type": "object",
  "properties": {
    "image_url": {
      "type": "string",
      "description": "The product photo the descriptions were written from"
    },
    "product": {
      "type": "string",
      "description": "Product name, uppercase, e.g. WIRELESS EARBUDS"
    },
    "tone": {
      "type": "string",
      "enum": [
        "neutral",
        "warm",
        "bold"
      ],
      "default": "neutral"
    },
    "length": {
      "type": "string",
      "enum": [
        "S",
        "M",
        "L"
      ],
      "default": "M"
    },
    "short": {
      "type": "string"
    },
    "detailed": {
      "type": "string"
    },
    "playful": {
      "type": "string"
    }
  },
  "required": [
    "image_url",
    "product",
    "short",
    "detailed",
    "playful"
  ],
  "rls": {
    "read": {
      "$or": [
        {
          "created_by_id": "{{user.id}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "create": {
      "$or": [
        {
          "user_condition": {
            "role": "admin"
          }
        },
        {
          "user_condition": {
            "role": "user"
          }
        }
      ]
    },
    "update": {
      "$or": [
        {
          "created_by_id": "{{user.id}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    },
    "delete": {
      "$or": [
        {
          "created_by_id": "{{user.id}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    }
  }
}
\`\`\`

## base44/functions/describeProduct/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Writes three e-commerce descriptions (short, detailed, playful) of the product in one photo.
const TONES = ['neutral', 'warm', 'bold'];
const LENGTH_GUIDE = {
  S: 'short: one sentence; detailed: two sentences; playful: one sentence',
  M: 'short: one or two sentences (about 90 characters); detailed: three sentences (about 200 characters); playful: two or three short sentences (about 100 characters)',
  L: 'short: two sentences; detailed: four or five sentences (about 320 characters); playful: three or four short sentences',
};
const SCHEMA = {
  type: 'object',
  properties: {
    product: { type: 'string' },
    short: { type: 'string' },
    detailed: { type: 'string' },
    playful: { type: 'string' },
  },
  required: ['product', 'short', 'detailed', 'playful'],
};

const clip = (value, max) => String(value ?? '').replace(/\\s+/g, ' ').trim().slice(0, max);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Sign in to describe a photo.' }, { status: 401 });

    const { image_url, tone, length } = await req.json();
    if (typeof image_url !== 'string' || image_url.length > 2048 || !/^https:\\/\\//.test(image_url)) {
      return Response.json({ error: 'image_url must be an https URL.' }, { status: 400 });
    }
    if (!TONES.includes(tone)) return Response.json({ error: 'tone must be neutral, warm or bold.' }, { status: 400 });
    if (!LENGTH_GUIDE[length]) return Response.json({ error: 'length must be S, M or L.' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: [
        'You write e-commerce product descriptions from a product photo.',
        'Name the product in the photo in two or three words, uppercase (e.g. WIRELESS EARBUDS).',
        'Then write three descriptions of it: short, detailed and playful. Describe only what the photo shows and what such a product typically offers; plain text, no markdown, no emoji.',
        \`Tone: \${tone}. Length: \${length} (\${LENGTH_GUIDE[length]}).\`,
      ].join('\\n'),
      file_urls: [image_url],
      response_json_schema: SCHEMA,
    });

    return Response.json({
      product: clip(result?.product, 40).toUpperCase(),
      short: clip(result?.short, 600),
      detailed: clip(result?.detailed, 1200),
      playful: clip(result?.playful, 800),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## src/components/describe/AccountMenu.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';

/** Signed in: the user's initial, opening a small menu with their email and SIGN OUT. */
export default function AccountMenu({ user, mobile, buttonClass, onSignOut }) {
  const [open, setOpen] = useState(false);
  const label = user.full_name || user.email || 'Account';

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="relative">
      <button type="button" aria-label={\`Account: \${label}\`} aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className={\`\${buttonClass} rounded-[6px] border-[1.5px] border-[var(--swatch-1)] bg-[var(--swatch-1)] font-medium text-[var(--swatch-2)]\`}>
        {label.trim()[0].toUpperCase()}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div role="menu" className={\`absolute right-0 z-40 rounded-[8px] border-[1.5px] border-[var(--swatch-1)] bg-[var(--swatch-2)] \${mobile ? 'top-[124px] w-[600px] p-[36px] text-[34px]' : 'top-[68px] w-[420px] p-[24px] text-[22px]'}\`}>
            <div className="truncate text-[var(--ui-muted)]">{user.email}</div>
            <button type="button" role="menuitem" onClick={onSignOut}
              className={\`mt-[0.8em] w-full rounded-full border-[1.5px] border-[var(--swatch-1)] font-medium tracking-[0.1em] \${mobile ? 'h-[122px]' : 'h-[48px]'}\`}>
              SIGN OUT
            </button>
          </div>
        </>
      )}
    </div>
  );
}
\`\`\`

## src/components/describe/AsciiField.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CELL_W = 14;
const CELL_H = 18;
const CHARS = ['.', '-', '=', '+', '#'];
const RINGS = 4;
const RING_GAP = 0.5; // s between rings
const CYCLE = RINGS * RING_GAP;
const SPEED = 620; // canvas px per second
const BAND = 165;

// Stable per-cell noise in [0, 1).
const hash = (i, j) => {
  const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/** The analysis field: density rings pulse out from the photo, drawn on one canvas around it. */
export default function AsciiField({ width, top, height, zoom, hole }) {
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    const scale = zoom * (window.devicePixelRatio || 1);
    el.width = Math.round(width * scale);
    el.height = Math.round(height * scale);
    const ctx = el.getContext('2d');
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const cols = Math.ceil(width / CELL_W);
    const rows = Math.ceil(height / CELL_H);
    const cx = hole.x + hole.size / 2;
    const cy = hole.y + hole.size / 2 - top;
    const began = performance.now();
    let frame = 0;

    const draw = (now) => {
      const style = getComputedStyle(el);
      const ink = style.getPropertyValue('--swatch-1').trim() || '#111';
      const dot = style.getPropertyValue('--ui-dot').trim() || '#f50';
      const t = reduced ? 1.2 : (now - began) / 1000;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = '600 17px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = 0.85;
      for (let j = 0; j < rows; j += 1) {
        const y = j * CELL_H + CELL_H / 2;
        for (let i = 0; i < cols; i += 1) {
          const x = i * CELL_W + CELL_W / 2;
          if (x > hole.x - 6 && x < hole.x + hole.size + 6 && y + top > hole.y - 6 && y + top < hole.y + hole.size + 6) continue;
          const d = Math.hypot(x - cx, (y - cy) * 1.7);
          let v = 0;
          for (let r = 0; r < RINGS; r += 1) {
            const age = t - r * RING_GAP;
            if (age < 0) continue;
            const phase = age % CYCLE;
            const radius = hole.size * 0.45 + phase * SPEED;
            v += Math.max(0, 1 - Math.abs(d - radius) / BAND) * (1 - phase / CYCLE);
          }
          const n = hash(i, j);
          v = Math.min(1, v * 1.5 * Math.max(0, 1 - d / 1600) + (n - 0.5) * 0.25);
          if (v < 0.22) continue;
          if (n > 0.985 && v > 0.4) {
            ctx.fillStyle = dot;
            ctx.fillRect(x - 3, y - 3, 6, 6);
            continue;
          }
          ctx.fillStyle = ink;
          ctx.fillText(CHARS[Math.min(CHARS.length - 1, Math.floor(v * CHARS.length))], x, y);
        }
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [width, top, height, zoom, hole.x, hole.y, hole.size]);

  return (
    <motion.canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute left-0"
      style={{ top, width, height }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.8 } }} transition={{ duration: 0.3 }} />
  );
}
\`\`\`

## src/components/describe/ChatLog.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { chatParts } from './format';

// Newest first: older lines fade, the fourth back to 32%.
const OPACITY = [1, 0.75, 0.55, 0.32];
const ENTER = [0.33, 1, 0.68, 1];

export function Chip({ children, mobile }) {
  return (
    <span className={\`mx-[0.1em] inline-flex items-center rounded-full bg-[var(--swatch-1)] align-[0.08em] font-medium leading-none tracking-[0.04em] text-[var(--swatch-2)] \${mobile ? 'h-[1.3em] px-[0.45em] text-[0.8em]' : 'h-[40px] px-[12px] text-[23px]'}\`}>
      {children}
    </span>
  );
}

export default function ChatLog({ messages, latestOnly, mobile, inline }) {
  const shown = messages.slice(latestOnly ? -1 : -OPACITY.length);
  // Phone: inside the guide frame (inset 66). In results it sits in the flow (inline), under the
  // options on desktop and after the cards on a phone, so it never covers a button.
  const place = inline
    ? (mobile ? 'mt-[44px]' : 'mt-[28px]')
    : mobile ? 'inset-x-[84px] bottom-[96px]' : latestOnly ? 'left-[40px] top-[890px] w-[560px]' : 'bottom-[70px] left-[40px] w-[560px]';
  return (
    <div className={\`pointer-events-none \${inline ? 'relative' : 'absolute'} z-20 flex flex-col items-start \${mobile ? 'gap-[20px]' : 'gap-[13px]'} \${place}\`} aria-live="polite">
      <AnimatePresence initial={false} mode={inline ? 'popLayout' : 'sync'}>
        {shown.map((m, i) => (
          <motion.div key={m.id}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: OPACITY[shown.length - 1 - i], y: 0 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: ENTER }}
            className={\`max-w-full rounded-[12px] bg-[var(--swatch-3)] text-[var(--ui-bubble-ink)] \${mobile ? 'px-[39px] py-[33px] text-[42px] leading-[1.4]' : 'px-[22px] py-[17px] text-[29px] leading-[1.45]'}\`}>
            {chatParts(m.text).map((part, k) => (part.chip ? <Chip key={k} mobile={mobile}>{part.chip}</Chip> : <span key={k}>{part.text}</span>))}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
\`\`\`

## src/components/describe/describe.css
\`\`\`css
@font-face{font-family:"JetBrains Mono";font-weight:100 800;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/jetbrains-mono-variable-normal.woff2) format("woff2")}

/* The look: ink (text, borders, grid dots), surface, accent (chat bubbles, drag-over), the ASCII field's dots. */
:root{
  --swatch-1:#111111;--swatch-1-ink:#FFFFFF;
  --swatch-2:#FFFFFF;--swatch-2-ink:#111111;
  --swatch-3:#ECFF7C;--swatch-3-ink:#111111;
  --swatch-4:#FF5A1F;--swatch-4-ink:#111111;
  --ui-muted:color-mix(in srgb,var(--swatch-1) 60%,var(--swatch-2));
  --ui-guide:color-mix(in srgb,var(--swatch-1) 9%,var(--swatch-2));
  --ui-frame:color-mix(in srgb,var(--swatch-1) 14%,var(--swatch-2));
  --ui-zone:color-mix(in srgb,var(--swatch-1) 35%,transparent);
  --ui-bubble-ink:var(--swatch-3-ink);
  --ui-dot:var(--swatch-4);
}
/* gallery-look */

.dw{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;color:var(--swatch-1);background:var(--swatch-2);-webkit-font-smoothing:antialiased}
.dw button{cursor:pointer}
.dw-snake{stroke-dasharray:28 72;animation:dw-snake 6s linear infinite;transition:stroke-dasharray .3s cubic-bezier(.33,1,.68,1)}
.dw-snake.is-full{stroke-dasharray:100 0}
@keyframes dw-snake{to{stroke-dashoffset:-100}}
.dw-caret{animation:dw-blink 1s steps(1) infinite}
@keyframes dw-blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.dw-snake{animation:none}}
\`\`\`

## src/components/describe/DescriptionCard.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Pill from './Pill';

const ENTER = [0.33, 1, 0.68, 1];

/** Types \`text\` in over \`duration\` ms after \`delay\` ms, with a block caret while it writes. */
function useTyping(text, delay, duration, animate, run) {
  const [count, setCount] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) { setCount(text.length); return undefined; }
    setCount(0);
    let frame = 0;
    const start = performance.now() + delay;
    const step = (now) => {
      const done = Math.max(0, Math.min(1, (now - start) / duration));
      setCount(Math.round(done * text.length));
      if (now < start + duration + 300) frame = requestAnimationFrame(step);
      else setCount(text.length + 1);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, duration, animate, run]);
  return { shown: text.slice(0, count), typing: count > 0 && count <= text.length && animate };
}

export default function DescriptionCard({ label, text, index, enterDelay, typing, mobile, onCopy }) {
  const { shown, typing: caret } = useTyping(text, typing.delay, typing.duration, typing.animate, typing.key);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = (
    <Pill onClick={async () => setCopied(await onCopy())} active={copied} aria-label={\`Copy \${label.toLowerCase()} description\`}
      className={\`\${mobile ? "absolute right-[14px] top-[14px] h-[72px] px-[24px] text-[28px] before:absolute before:inset-x-0 before:-inset-y-[25px] before:content-['']" : 'absolute bottom-[26px] left-[22px] h-[44px] px-[20px] text-[22px]'} tracking-[0.1em]\`}
      style={copied ? { color: 'var(--swatch-3)' } : undefined}>
      {copied ? 'COPIED ✓' : 'COPY'}
    </Pill>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, clipPath: mobile ? 'inset(-40px 100% -40px 0px)' : 'inset(0 100% 0 0)' }}
      animate={{ opacity: 1, y: 0, clipPath: mobile ? 'inset(-40px -20px -40px 0px)' : 'inset(0 0% 0 0)' }}
      transition={{ duration: 0.5, delay: enterDelay + index * 0.15, ease: ENTER }}
      className={\`relative rounded-[8px] border-[1.5px] border-[var(--swatch-1)] bg-[var(--swatch-2)] \${mobile ? '' : 'h-full overflow-hidden'}\`}>
      <motion.h3
        initial={{ opacity: 0, letterSpacing: '0.6em' }} animate={{ opacity: 1, letterSpacing: '0.12em' }}
        transition={{ duration: 0.55, delay: enterDelay + index * 0.15, ease: ENTER }}
        className={\`flex items-center justify-center whitespace-nowrap border-b-[1.5px] border-[var(--swatch-1)] font-medium \${mobile ? 'h-[100px] text-[30px]' : 'h-[58px] text-[26px]'}\`}>
        *** {label} ***
      </motion.h3>
      <p className={mobile ? 'min-h-[150px] px-[26px] py-[22px] text-[36px] leading-[1.5]' : 'h-[600px] overflow-y-auto p-[22px] text-[29px] leading-[1.55]'}>
        {shown}{caret && <span className="dw-caret">▌</span>}
      </p>
      {copy}
    </motion.article>
  );
}
\`\`\`

## src/components/describe/DropZone.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const urlFrom = (data) => {
  const text = (data.getData('text/uri-list') || data.getData('text/plain') || '').split('\\n')[0].trim();
  return /^https:\\/\\//.test(text) ? text : null; // an image dragged from another page or tab (describeProduct reads https only)
};

export default function DropZone({ rect, mobile, onPhoto }) {
  const input = useRef(null);
  const depth = useRef(0);
  const [over, setOver] = useState(false);

  const enter = (e) => { e.preventDefault(); depth.current += 1; setOver(true); };
  const leave = () => { depth.current = Math.max(0, depth.current - 1); if (!depth.current) setOver(false); };
  const drop = (e) => {
    e.preventDefault();
    depth.current = 0;
    setOver(false);
    const file = e.dataTransfer.files?.[0];
    const url = file ? null : urlFrom(e.dataTransfer);
    if (file || url) onPhoto({ file, url });
  };
  // Lime while the picker is open; closing it (chosen or cancelled) gives the window its focus back.
  const pick = () => {
    setOver(true);
    window.addEventListener('focus', () => setTimeout(() => setOver(false), 300), { once: true });
    input.current?.click();
  };
  const choose = (e) => {
    setOver(false);
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) onPhoto({ file });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="absolute z-10" style={{ left: rect.x, top: rect.y, width: rect.size, height: rect.size }}>
      <button type="button" aria-label="Upload a product photo"
        onClick={pick}
        onDragEnter={enter} onDragOver={(e) => e.preventDefault()} onDragLeave={leave} onDrop={drop}
        className={\`relative flex h-full w-full flex-col items-center justify-center rounded-[10px] border-[1.5px] border-[var(--ui-zone)] transition-colors duration-200 \${over ? 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]' : ''}\`}>
        <svg className="pointer-events-none absolute inset-[-1.5px] overflow-visible" width={rect.size + 3} height={rect.size + 3} aria-hidden="true">
          <rect x="1.5" y="1.5" width={rect.size} height={rect.size} rx="10" pathLength="100" fill="none" stroke="var(--swatch-1)" strokeWidth="2.25" className={\`dw-snake \${over ? 'is-full' : ''}\`} />
        </svg>
        {!over && (
          <span className={\`flex items-center justify-center rounded-full border border-[var(--swatch-1)] \${mobile ? 'h-[176px] w-[176px]' : 'h-[112px] w-[112px]'}\`}>
            <svg width="50%" height="50%" viewBox="0 0 50 50" aria-hidden="true"><path d="M25 3v44M3 25h44" stroke="currentColor" strokeWidth="1.5" /></svg>
          </span>
        )}
        <span className={\`pointer-events-none font-medium tracking-[0.04em] \${mobile ? 'mt-[44px] text-[52px]' : 'mt-[30px] text-[40px]'}\`}>{over ? 'LET GO' : 'DROP A PRODUCT PHOTO'}</span>
        {!over && (
          <span className={\`pointer-events-none mt-[0.9em] leading-[1.4] tracking-[0.08em] text-[var(--ui-muted)] \${mobile ? 'text-[34px]' : 'text-[25px]'}\`}>
            {mobile ? 'OR TAP TO UPLOAD' : 'OR CLICK TO UPLOAD'}<br />JPG · PNG · WEBP
          </span>
        )}
      </button>
      <input ref={input} type="file" className="hidden" onChange={choose}
        accept={mobile ? 'image/*' : 'image/jpeg,image/png,image/webp'} {...(mobile ? { capture: 'environment' } : {})} />
    </motion.div>
  );
}
\`\`\`

## src/components/describe/format.js
\`\`\`js
export const TONES = ['NEUTRAL', 'WARM', 'BOLD'];
export const LENGTHS = ['S', 'M', 'L'];
export const CARDS = [
  { key: 'short', label: 'SHORT' },
  { key: 'detailed', label: 'DETAILED' },
  { key: 'playful', label: 'PLAYFUL' },
];
export const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/** A chat line: plain text with {ENTITY} chips, e.g. 'Drop a {PHOTO} into the frame to begin.' */
export const chatParts = (text) => text.split(/(\\{[^}]+\\})/).filter(Boolean)
  .map((part) => (part.startsWith('{') ? { chip: part.slice(1, -1) } : { text: part }));

export const GREETING = ['Hello.', 'Drop a {PHOTO} into the frame to begin.'];

// Typing runs in a fixed-ish time per card, so a long description doesn't hold the next one back.
export const typingMs = (text) => 420 + text.length * 2;

// The ticker's scramble alphabet; seeded, so the page always opens on the same characters.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export const TICKER_LENGTH = 25;
export function scrambler(seed = 7) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ALPHABET[((t ^ (t >>> 14)) >>> 0) % ALPHABET.length];
  };
}
\`\`\`

## src/components/describe/GuideGrid.jsx
\`\`\`jsx
const INSET = 24;

/** The faint construction grid: a frame inset from the edge, lines on the drop zone's edges, dots where they meet. */
export default function GuideGrid({ width, height, zone, inset = INSET, lines = true }) {
  const right = width - inset;
  const bottom = height - inset;
  // lines=false (phone results): just the frame, so no guide runs through the cards.
  const xs = lines ? [zone.x, zone.x + zone.size] : [];
  const ys = lines ? [zone.y, zone.y + zone.size] : [];
  const dots = [
    ...xs.flatMap((x) => [[x, inset], [x, bottom], ...ys.map((y) => [x, y])]),
    ...ys.flatMap((y) => [[inset, y], [right, y]]),
  ];
  return (
    <svg className="pointer-events-none absolute inset-0" width={width} height={height} aria-hidden="true">
      {xs.map((x, i) => <line key={\`x\${i}\`} x1={x} x2={x} y1={inset} y2={bottom} stroke="var(--ui-guide)" strokeWidth="1.5" />)}
      {ys.map((y, i) => <line key={\`y\${i}\`} x1={inset} x2={right} y1={y} y2={y} stroke="var(--ui-guide)" strokeWidth="1.5" />)}
      <rect x={inset} y={inset} width={width - inset * 2} height={height - inset * 2} fill="none" stroke="var(--ui-frame)" strokeWidth="1.5" />
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="var(--swatch-1)" />)}
    </svg>
  );
}
\`\`\`

## src/components/describe/Header.jsx
\`\`\`jsx
import AccountMenu from './AccountMenu';
import Ticker from './Ticker';

// Phone: the 36px buttons get a 44px tap area.
const TAP = "before:absolute before:inset-x-0 before:-inset-y-[11px] before:content-['']";

export default function Header({ mobile, ticker, account, onAbout }) {
  const button = mobile ? \`relative h-[100px] px-[30px] text-[33px] \${TAP}\` : 'h-[56px] px-[21px] text-[26px]';
  return (
    <>
      {/* Phone: the row sits inside the guide frame (inset 66), clear of its top line. */}
      <header className={\`absolute inset-x-0 top-0 z-20 flex justify-between \${mobile ? 'h-[200px] items-center px-[84px] pt-[18px]' : 'h-[110px] items-center px-[40px] pt-[40px]'}\`}>
        <div className={\`flex items-center font-medium leading-none \${mobile ? 'text-[50px]' : 'text-[44px]'}\`}>
          <span className={\`flex items-center rounded-[8px] border-[1.5px] border-[var(--swatch-1)] tracking-[0.02em] \${mobile ? 'h-[76px] px-[18px]' : 'h-[56px] px-[17px]'}\`}>DESCRIBE</span>
          <span className={\`h-[1.5px] bg-[var(--swatch-1)] \${mobile ? 'w-[16px]' : 'w-[14px]'}\`} />
          <span className={\`flex items-center rounded-[8px] bg-[var(--swatch-1)] text-[var(--swatch-2)] \${mobile ? 'h-[76px] px-[14px]' : 'h-[48px] px-[13px]'}\`}>001</span>
        </div>
        {!mobile && <Ticker target={ticker} className="absolute left-1/2 top-[54px] -translate-x-1/2 text-[27px] tracking-[0.12em]" />}
        <div className={\`flex \${mobile ? 'gap-[18px]' : 'gap-[12px]'}\`}>
          <button type="button" onClick={onAbout} className={\`\${button} rounded-[6px] border-[1.5px] border-[var(--swatch-1)] font-medium tracking-[0.12em] active:scale-[0.96]\`}>ABOUT</button>
          {account.user ? (
            <AccountMenu user={account.user} mobile={mobile} buttonClass={\`\${button} \${mobile ? 'min-w-[122px]' : 'min-w-[56px]'}\`} onSignOut={account.signOut} />
          ) : (
            <button type="button" onClick={account.signIn} className={\`\${button} rounded-[6px] border-[1.5px] border-[var(--swatch-1)] bg-[var(--swatch-1)] font-medium tracking-[0.12em] text-[var(--swatch-2)] active:scale-[0.96]\`}>SIGN IN</button>
          )}
        </div>
      </header>
      {mobile && <Ticker target={ticker} className="absolute inset-x-0 top-[214px] z-10 justify-center text-[33px] tracking-[0.12em]" />}
    </>
  );
}
\`\`\`

## src/components/describe/InfoModal.jsx
\`\`\`jsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';

/** ABOUT: what the app does. Closes on GOT IT, a click outside or Escape. */
export default function InfoModal({ mobile, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[color-mix(in_srgb,var(--swatch-2)_70%,transparent)]" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        onClick={(e) => e.stopPropagation()} role="dialog" aria-label="About DESCRIBE"
        className={\`rounded-[8px] border-[1.5px] border-[var(--swatch-1)] bg-[var(--swatch-2)] \${mobile ? 'w-[912px] p-[48px] text-[38px]' : 'w-[720px] p-[40px] text-[26px]'}\`}>
        <h2 className="font-medium tracking-[0.08em]">ABOUT DESCRIBE</h2>
        <p className="mt-[24px] leading-[1.55] text-[var(--ui-muted)]">
          Drop a product photo and DESCRIBE writes three e-commerce descriptions for it: a short one, a detailed one and a playful one. Pick a tone and a length to rewrite them in place, then copy the one you like.
        </p>
        <div className="mt-[32px] flex justify-end">
          <button type="button" onClick={onClose} className={\`\${mobile ? 'h-[122px]' : 'h-[1.75em]'} rounded-full bg-[var(--swatch-1)] px-[1em] font-medium tracking-[0.08em] text-[var(--swatch-2)] active:scale-[0.94]\`}>
            GOT IT
          </button>
        </div>
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/describe/Photo.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

const GLIDE = [0.65, 0, 0.35, 1];

/** The product photo: snaps into the drop zone, breathes while it is read, then glides to the left column. */
export default function Photo({ src, phase, zone, target, restored }) {
  const rect = phase === 'reading' ? zone : target;
  const reading = phase === 'reading';
  return (
    <motion.div className="absolute z-10 overflow-hidden rounded-[10px] border-[1.5px] border-[var(--swatch-1)]"
      initial={restored ? false : { left: zone.x, top: zone.y, width: zone.size, height: zone.size, rotate: -6, scale: 0.96, opacity: 1 }}
      animate={{
        left: rect.x, top: rect.y, width: rect.size, height: rect.size, rotate: 0,
        scale: reading ? [1, 1.012] : 1,
        opacity: phase === 'leaving' ? 0 : 1,
      }}
      transition={{
        default: { duration: 0.6, ease: GLIDE },
        rotate: { duration: 0.25, ease: [0.33, 1, 0.68, 1] },
        scale: reading ? { duration: 0.9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' } : { duration: 0.25 },
        opacity: { duration: 0.7 },
      }}>
      <img src={src} alt="Product" className="h-full w-full object-cover" draggable={false} />
    </motion.div>
  );
}
\`\`\`

## src/components/describe/Pill.jsx
\`\`\`jsx
import { useAnimate } from 'framer-motion';

/** A pill button; a click pops it 0.86 → 1 (the design's one bounce). */
export default function Pill({ active, onClick, className = '', style, children, ...rest }) {
  const [scope, animate] = useAnimate();
  return (
    <button ref={scope} type="button" aria-pressed={active}
      onClick={(e) => { animate(scope.current, { scale: [0.86, 1] }, { duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }); onClick?.(e); }}
      className={\`flex items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-1)] font-medium leading-none transition-colors duration-150 \${active ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : ''} \${className}\`}
      style={style} {...rest}>
      {children}
    </button>
  );
}
\`\`\`

## src/components/describe/Results.jsx
\`\`\`jsx
import { useRef } from 'react';
import { motion } from 'framer-motion';
import DescriptionCard from './DescriptionCard';
import Pill from './Pill';
import { CARDS, LENGTHS, TONES, typingMs } from './format';

const ENTER = [0.33, 1, 0.68, 1];
// Phone: 32px pills get a 44px tap area.
const TAP = "before:absolute before:inset-x-0 before:-inset-y-[17px] before:content-['']";

// SHORT first; each next card starts when the one before is 60% written.
const schedule = (result, base, animate) => {
  let at = base;
  return CARDS.map(({ key }) => {
    const duration = typingMs(result[key]);
    const slot = { delay: at, duration, animate };
    at += duration * 0.6;
    return slot;
  });
};

function Options({ label, options, value, onPick, mobile, wide }) {
  return (
    <div>
      <div className={\`tracking-[0.2em] text-[var(--ui-muted)] \${mobile ? 'text-[26px] leading-[30px]' : 'text-[20px]'}\`}>{label}</div>
      <div className={\`flex \${mobile ? 'mt-[14px] gap-[14px]' : 'mt-[12px] gap-[8px]'}\`}>
        {options.map((o) => (
          <Pill key={o} active={o === value} onClick={() => onPick(o)}
            className={\`tracking-[0.12em] \${mobile ? \`relative h-[88px] text-[32px] \${TAP} \${wide ? 'px-[26px]' : 'w-[122px]'}\` : \`h-[44px] text-[24px] \${wide ? 'px-[22px]' : 'w-[58px]'}\`}\`}>
            {o}
          </Pill>
        ))}
      </div>
    </div>
  );
}

export default function Results({ app, mobile, chat }) {
  const { result, tone, length, write, busy, phase } = app;
  // The first write waits for the photo's glide and the cards' entrance; a rewrite types at once.
  const firstWrite = useRef(write.id);
  const slots = schedule(result, write.id === firstWrite.current ? 650 : 0, write.animate);
  const leaving = phase === 'leaving';

  return (
    // Phone: one column in the page's flow (photo and options, then the cards, then the chat), so
    // the page grows with the descriptions and nothing is clipped or left as a gap.
    <motion.div className={mobile ? 'relative z-10 px-[84px] pb-[100px] pt-[280px]' : 'absolute inset-0 z-10'} animate={{ opacity: leaving ? 0 : 1 }} transition={{ duration: 0.7 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.25, ease: ENTER }}
        className={mobile ? 'ml-[270px] min-h-[240px]' : 'absolute left-[60px] top-[496px] w-[560px]'}>
        <h1 className={\`break-words font-medium uppercase tracking-[0.02em] \${mobile ? 'text-[44px] leading-[1.15]' : 'text-[50px] leading-none'}\`}>{result.product}</h1>
        <div className={mobile ? 'mt-[24px] space-y-[24px]' : 'mt-[42px] space-y-[26px]'}>
          <Options label="TONE" options={TONES} value={tone} onPick={app.setTone} mobile={mobile} wide />
          <Options label="LENGTH" options={LENGTHS} value={length} onPick={app.setLength} mobile={mobile} />
        </div>
        <Pill onClick={app.reset} disabled={app.busy} className={\`tracking-[0.1em] disabled:opacity-40 \${mobile ? \`relative mt-[36px] h-[88px] px-[26px] text-[30px] \${TAP}\` : 'mt-[28px] h-[40px] px-[18px] text-[20px]'}\`}>NEW PHOTO</Pill>
        {!mobile && chat}
      </motion.div>
      <motion.div animate={{ opacity: busy ? 0.4 : 1 }} transition={{ duration: 0.25 }}
        className={mobile ? 'mt-[44px] flex flex-col gap-[24px]' : 'absolute left-[660px] top-[170px] grid h-[760px] w-[1220px] grid-cols-3 gap-[40px]'}>
        {CARDS.map((c, i) => (
          <DescriptionCard key={c.key} label={c.label} index={i} text={result[c.key]} typing={{ ...slots[i], key: write.id }}
            enterDelay={write.id === firstWrite.current && write.animate ? 0.45 : 0} mobile={mobile} onCopy={() => app.copy(c.key)} />
        ))}
      </motion.div>
      {mobile && chat}
    </motion.div>
  );
}
\`\`\`

## src/components/describe/Ticker.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { TICKER_LENGTH, scrambler } from './format';

const RESOLVE_MS = 800;
const random = scrambler();
const noise = (n) => Array.from({ length: n }, random).join('');
const FIRST = noise(TICKER_LENGTH);

/** Scrambles until it has a target, then resolves into it left to right. */
export default function Ticker({ target, className = '' }) {
  const [text, setText] = useState(FIRST);
  const resolvedAt = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setText(target ?? 'DROP A PHOTO');
      return undefined;
    }
    resolvedAt.current = target ? Date.now() : null;
    const tick = () => {
      if (!target) return setText(noise(TICKER_LENGTH));
      const done = Math.min(1, (Date.now() - resolvedAt.current) / RESOLVE_MS);
      const fixed = Math.floor(done * target.length);
      setText([...target].map((ch, i) => (i < fixed || ch === ' ' ? ch : random())).join(''));
      if (done === 1) clearInterval(timer);
    };
    const timer = setInterval(tick, 60);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className={\`flex items-center whitespace-pre font-medium uppercase \${className}\`} aria-hidden="true">
      <span className="mr-[0.9em] h-[0.37em] w-[0.37em] bg-[var(--swatch-1)]" />
      {text}
      <span className="ml-[0.9em] h-[0.37em] w-[0.37em] bg-[var(--swatch-1)]" />
    </div>
  );
}
\`\`\`

## src/components/describe/useAccount.js
\`\`\`js
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/** The signed-in user (null when signed out); sign-in and sign-out go through the platform's own pages. */
export function useAccount() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    base44.auth.me().then(setUser, () => setUser(null));
  }, []);
  return {
    user,
    signIn: () => base44.auth.redirectToLogin?.(window.location.href),
    signOut: () => base44.auth.logout?.(window.location.href),
  };
}
\`\`\`

## src/components/describe/useDescribe.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ACCEPTED, CARDS, GREETING } from './format';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Analysis shows at least one full ASCII pulse, even when the model answers quickly.
const MIN_READING_MS = 1250;
const READING_TIMEOUT_MS = 60000;
const timeout = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

// The model call runs in the describeProduct backend function (base44/functions/describeProduct).
const describe = async (imageUrl, tone, length) =>
  (await base44.functions.invoke('describeProduct', { image_url: imageUrl, tone: tone.toLowerCase(), length })).data;
const signedOut = (error) => (error?.response?.status ?? error?.status) === 401;

export function useDescribe() {
  const [phase, setPhase] = useState('loading'); // loading → empty → reading → results → leaving → empty
  const [photo, setPhoto] = useState(null); // { display, source }: what the page shows, the URL the model reads
  const [result, setResult] = useState(null);
  const [tone, setToneState] = useState('NEUTRAL');
  const [length, setLengthState] = useState('M');
  const [ticker, setTicker] = useState(null);
  const [busy, setBusy] = useState(false);
  const [write, setWrite] = useState({ id: 0, animate: false });
  const [messages, setMessages] = useState(() => GREETING.map((text, id) => ({ id, text })));
  const nextId = useRef(GREETING.length);
  const rowId = useRef(null);
  const alive = useRef(true);

  const say = (text) => alive.current && setMessages((list) => [...list, { id: nextId.current++, text }]);

  useEffect(() => {
    alive.current = true;
    (async () => {
      try {
        const me = await base44.auth.me().catch(() => null);
        const { ProductDescription } = base44.entities;
        const [last] = await (me ? ProductDescription.filter({ created_by_id: me.id }, '-updated_date', 1) : ProductDescription.list('-updated_date', 1));
        if (last) {
          rowId.current = last.id;
          setPhoto({ display: last.image_url, source: last.image_url });
          setResult({ product: last.product, short: last.short, detailed: last.detailed, playful: last.playful });
          setToneState((last.tone ?? 'neutral').toUpperCase());
          setLengthState(last.length ?? 'M');
          setTicker(\`PRODUCT: \${last.product}\`);
          setMessages([{ id: nextId.current++, text: \`Your last {\${last.product}} descriptions.\` }]);
          setPhase('results');
          return;
        }
        setPhase('empty');
      } catch {
        setPhase('empty');
      }
    })();
    return () => { alive.current = false; };
  }, []);

  // Only the last result is kept: one row per user, overwritten.
  const persist = async (source, next, nextTone, nextLength) => {
    const data = { image_url: source, ...next, tone: nextTone.toLowerCase(), length: nextLength };
    try {
      if (rowId.current) await base44.entities.ProductDescription.update(rowId.current, data);
      else rowId.current = (await base44.entities.ProductDescription.create(data)).id;
    } catch {
      // A failed save still shows the result; it just isn't restored next visit.
    }
  };

  const start = async ({ file, url }) => {
    if (phase !== 'empty') return;
    if (file && !ACCEPTED.includes(file.type)) {
      say('That file isn’t a JPG, PNG or WEBP. Try another {PHOTO}.');
      return;
    }
    const display = file ? URL.createObjectURL(file) : url;
    const began = Date.now();
    setPhoto({ display, source: url ?? null });
    setPhase('reading');
    say('Reading photo…');
    try {
      let source = url;
      const next = await timeout((async () => {
        // Signed out, the file would be stored for nothing: describing it needs a signed-in user.
        if (!source && !(await base44.auth.me().catch(() => null))) throw Object.assign(new Error('signed out'), { status: 401 });
        source ??= (await base44.integrations.Core.UploadFile({ file })).file_url;
        return describe(source, tone, length);
      })(), READING_TIMEOUT_MS);
      setPhoto({ display, source });
      await wait(Math.max(0, MIN_READING_MS - (Date.now() - began)));
      if (!alive.current) return;
      const product = String(next.product).trim().toUpperCase();
      setTicker(\`PRODUCT: \${product}\`);
      await wait(900);
      say(\`Found {\${product}}.\`);
      await wait(450);
      if (!alive.current) return;
      const written = { ...next, product };
      setResult(written);
      setWrite((w) => ({ id: w.id + 1, animate: true }));
      setPhase('results');
      setTimeout(() => say('Writing three descriptions.'), 500);
      persist(source, written, tone, length);
    } catch (error) {
      if (!alive.current) return;
      setPhoto(null);
      setTicker(null);
      setPhase('empty');
      say(signedOut(error) ? '{SIGN IN} to describe a photo.'
        : error?.message === 'timeout' ? 'That took too long. Drop the {PHOTO} again.' : 'Couldn’t read that photo. Try another {PHOTO}.');
    }
  };

  const rewrite = async (nextTone, nextLength, message) => {
    setBusy(true);
    say(message);
    try {
      const next = await describe(photo.source, nextTone, nextLength);
      if (!alive.current) return;
      const written = { ...next, product: result.product };
      setResult(written);
      setWrite((w) => ({ id: w.id + 1, animate: true }));
      persist(photo.source, written, nextTone, nextLength);
    } catch (error) {
      if (!alive.current) return;
      setToneState(tone);
      setLengthState(length);
      say(signedOut(error) ? '{SIGN IN} to rewrite it.' : 'Couldn’t rewrite that. Try again.');
    } finally {
      if (alive.current) setBusy(false);
    }
  };

  const canRewrite = phase === 'results' && !busy && photo?.source;

  return {
    phase, photo, result, tone, length, ticker, busy, write, messages,
    start,
    setTone: (next) => {
      if (!canRewrite || next === tone) return;
      setToneState(next);
      rewrite(next, length, \`Tone set to {\${next}}. Rewriting in place.\`);
    },
    setLength: (next) => {
      if (!canRewrite || next === length) return;
      setLengthState(next);
      rewrite(tone, next, \`Length set to {\${next}}. Rewriting in place.\`);
    },
    copy: async (key) => {
      const label = CARDS.find((c) => c.key === key).label;
      try {
        await navigator.clipboard.writeText(result[key]);
      } catch {
        say(\`Couldn’t copy {\${label}}. Select the text to copy it.\`);
        return false;
      }
      say(\`Copied {\${label}} to clipboard.\`);
      return true;
    },
    reset: () => {
      // Not mid-rewrite: its answer belongs to this photo and would land on the next one.
      if (phase !== 'results' || busy) return;
      setPhase('leaving');
      setTimeout(() => {
        if (!alive.current) return;
        setPhoto(null);
        setResult(null);
        setTicker(null);
        setMessages(GREETING.map((text) => ({ id: nextId.current++, text })));
        setPhase('empty');
      }, 700);
    },
  };
}
\`\`\`

## src/components/describe/useStage.js
\`\`\`js
import { useEffect, useState } from 'react';

// The page is composed on a fixed canvas, 1920×1080 on desktop and 1080 wide on a phone (below
// 1024px), and zoomed to the window, so every position in the design holds at any size.
const measure = () => {
  const [w, h] = typeof window === 'undefined' ? [1920, 1080] : [window.innerWidth, window.innerHeight];
  if (w < 1024) {
    const zoom = w / 1080;
    return { mobile: true, zoom, width: 1080, height: Math.max(1700, Math.round(h / zoom)) };
  }
  return { mobile: false, zoom: Math.min(w / 1920, h / 1080), width: 1920, height: 1080 };
};

export function useStage() {
  const [stage, setStage] = useState(measure);
  useEffect(() => {
    const onResize = () => setStage(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return stage;
}

/** Where the drop zone, and the photo inside it, sit on the canvas. */
export const zoneRect = ({ mobile, width, height }) => {
  if (!mobile) return { x: 660, y: 240, size: 600 };
  const size = width - 132;
  const top = 280;
  const bottom = height - 444;
  return { x: 66, y: Math.round((top + bottom - size) / 2), size };
};

/** Where the photo glides to once the descriptions are written. */
export const resultPhotoRect = ({ mobile }) => (mobile ? { x: 84, y: 280, size: 240 } : { x: 60, y: 170, size: 300 });
\`\`\`

## src/pages/Describe.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import '@/components/describe/describe.css';
import AsciiField from '@/components/describe/AsciiField';
import ChatLog from '@/components/describe/ChatLog';
import DropZone from '@/components/describe/DropZone';
import GuideGrid from '@/components/describe/GuideGrid';
import Header from '@/components/describe/Header';
import InfoModal from '@/components/describe/InfoModal';
import Photo from '@/components/describe/Photo';
import Results from '@/components/describe/Results';
import { useAccount } from '@/components/describe/useAccount';
import { useDescribe } from '@/components/describe/useDescribe';
import { resultPhotoRect, useStage, zoneRect } from '@/components/describe/useStage';

export default function Describe() {
  const app = useDescribe();
  const stage = useStage();
  const account = useAccount();
  const [about, setAbout] = useState(false);
  const { mobile, width, zoom } = stage;
  // Phone: the canvas is at least the window tall and grows with the results; the guides follow it.
  const canvas = useRef(null);
  const [height, setHeight] = useState(stage.height);
  useEffect(() => {
    const el = canvas.current;
    const sync = () => setHeight(mobile ? Math.max(stage.height, el.offsetHeight) : stage.height);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mobile, stage.height]);
  const zone = zoneRect(stage);
  const header = mobile ? 260 : 110;
  const inResults = app.phase === 'results' || app.phase === 'leaving';
  const showResults = inResults && app.result;
  const chat = app.phase !== 'loading' && <ChatLog messages={app.messages} latestOnly={inResults} mobile={mobile} inline={Boolean(showResults)} />;

  return (
    <div className={\`dw h-screen w-screen \${mobile ? 'overflow-y-auto overflow-x-hidden' : 'flex items-center justify-center overflow-hidden'}\`}>
      <div ref={canvas} className="relative flex-none overflow-hidden" style={mobile ? { width, minHeight: stage.height, zoom } : { width, height, zoom }}>
        <GuideGrid width={width} height={height} zone={zone} inset={mobile ? 66 : 24} lines={!(mobile && inResults)} />
        <AnimatePresence>
          {app.phase === 'reading' && <AsciiField key="ascii" width={width} top={header} height={height - header} zoom={zoom} hole={zone} />}
        </AnimatePresence>
        <Header mobile={mobile} ticker={app.ticker} account={account} onAbout={() => setAbout(true)} />
        {app.phase === 'empty' && <DropZone rect={zone} mobile={mobile} onPhoto={app.start} />}
        {app.photo && app.phase !== 'empty' && (
          <Photo src={app.photo.display} phase={app.phase} zone={zone} target={resultPhotoRect(stage)} restored={app.phase === 'results' && !app.write.animate} />
        )}
        {showResults && <Results app={app} mobile={mobile} chat={chat} />}
        {!showResults && chat}
        {about && <InfoModal mobile={mobile} onClose={() => setAbout(false)} />}
      </div>
    </div>
  );
}
\`\`\`
`;export{e as default};