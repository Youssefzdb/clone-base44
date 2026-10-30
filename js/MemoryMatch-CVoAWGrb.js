var e=`# memory_match — app files

## src/components/memory-match/Board.jsx
\`\`\`jsx
import Card from './Card';
import { InkFilter } from './symbols';

// Arrow keys move between cards (Enter / Space flips the focused one).
const STEP = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

export default function Board({ game, cols, card, spec }) {
  const onKeyDown = (event) => {
    const step = STEP[event.key];
    const from = Number(event.target.dataset?.card);
    if (!step || Number.isNaN(from)) return;
    event.preventDefault();
    const rows = game.cards.length / cols;
    // Found pairs can't take focus: step over them to the next card still in play.
    for (let col = (from % cols) + step[0], row = Math.floor(from / cols) + step[1]; col >= 0 && col < cols && row >= 0 && row < rows; col += step[0], row += step[1]) {
      if (!game.cards[row * cols + col].matched) return event.currentTarget.querySelector(\`[data-card="\${row * cols + col}"]\`)?.focus();
    }
  };

  return (
    <div
      role="group"
      aria-label="Cards"
      onKeyDown={onKeyDown}
      className="grid"
      style={{ gridTemplateColumns: \`repeat(\${cols}, \${card.width}px)\`, gap: spec.gap, '--card-radius': \`\${spec.cardRadius}px\` }}
    >
      <InkFilter />
      {game.cards.map((c, i) => (
        <Card
          key={c.id}
          index={i}
          card={c}
          up={game.up.includes(i)}
          shaking={game.misses.includes(i)}
          width={card.width}
          height={card.height}
          eye={spec.eye}
          symbol={spec.symbol}
          onFlip={game.flip}
        />
      ))}
    </div>
  );
}
\`\`\`

## src/components/memory-match/Card.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { useAnimate } from 'framer-motion';
import Eye from './Eye';
import { SymbolArt } from './symbols';
import { SYMBOL_NAMES, pad2 } from './deck';
import { lookAt } from './gaze';

const FLIP = { duration: 0.42, ease: [0.65, 0, 0.35, 1] };

/** One card slot: the button stays in place when matched (faded out), so the grid never jumps. */
export default function Card({ index, card, up, shaking, width, height, eye, symbol, onFlip }) {
  const [slot, animateSlot] = useAnimate();
  const [inner, animateInner] = useAnimate();
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) return;
    animateInner(inner.current, { rotateY: up ? 180 : 0, y: [0, -16, 0] }, FLIP);
  }, [up]);

  useEffect(() => {
    if (!mounted.current || !card.matched) return;
    animateSlot(slot.current, { scale: [1, 1.14, 1, 0.65], opacity: [1, 1, 1, 0] }, { delay: 0.42, duration: 0.81, times: [0, 0.235, 0.47, 1], ease: 'easeInOut' });
  }, [card.matched]);

  useEffect(() => {
    if (!mounted.current || !shaking) return;
    animateSlot(slot.current, { x: [0, -12, 12, -12, 12, -12, 12, 0] }, { delay: 0.42, duration: 0.45, ease: 'easeInOut' });
  }, [shaking]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  const click = (event) => {
    // A keyboard (or scripted) press has no pointer position: the eyes look at the card instead.
    if (event.detail === 0) {
      const r = event.currentTarget.getBoundingClientRect();
      lookAt(r.left + r.width / 2, r.top + r.height / 2);
    }
    onFlip(index);
  };

  const label = \`Card \${pad2(index + 1)}\`;
  return (
    <button
      ref={slot}
      type="button"
      data-card={index}
      onClick={click}
      disabled={card.matched}
      aria-label={up ? \`\${label}, \${SYMBOL_NAMES[card.symbol]}\` : \`\${label}, face down\`}
      className="card relative block border-0 bg-transparent p-0"
      style={{ width, height, perspective: 1100, boxShadow: 'none' }}
    >
      <span className="sr-only">{label}</span>
      <span ref={inner} className="card absolute inset-0 block" style={{ transformStyle: 'preserve-3d', transform: \`rotateY(\${up ? 180 : 0}deg)\` }}>
        <span className="face bg-[var(--swatch-1)]">
          <Eye size={width * eye} />
        </span>
        <span className="face bg-[var(--ui-white)]" style={{ transform: 'rotateY(180deg)' }}>
          <SymbolArt symbol={card.symbol} size={width * symbol} />
        </span>
      </span>
    </button>
  );
}
\`\`\`

## src/components/memory-match/Confetti.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';

const KINDS = ['rect', 'rect', 'dot', 'cross'];
const COLORS = ['--swatch-4', '--swatch-4', '--ui-white'];

function piece(x, y, angle, speed, s, styles) {
  return {
    x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    rot: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.4,
    flutter: Math.random() * Math.PI * 2, size: (8 + Math.random() * 14) * s,
    kind: KINDS[Math.floor(Math.random() * KINDS.length)],
    color: styles.getPropertyValue(COLORS[Math.floor(Math.random() * COLORS.length)]).trim(),
  };
}

/** The win burst: pieces from the board's center plus a cannon from each bottom corner. */
export default function Confetti({ fire, originRef, scale, amount }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!fire) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const styles = getComputedStyle(canvas);
    const box = originRef.current?.getBoundingClientRect();
    const cx = box ? box.left + box.width / 2 : w / 2;
    const cy = box ? box.top + box.height / 2 : h / 2;
    const n = (count) => Math.round(count * amount);
    const pieces = [
      ...Array.from({ length: n(110) }, () => piece(cx, cy, Math.random() * Math.PI * 2, (3 + Math.random() * 22) * scale, scale, styles)),
      ...Array.from({ length: n(45) }, () => piece(0, h, -Math.PI / 2 + 0.25 + Math.random() * 0.5, (18 + Math.random() * 16) * scale, scale, styles)),
      ...Array.from({ length: n(45) }, () => piece(w, h, -Math.PI / 2 - 0.25 - Math.random() * 0.5, (18 + Math.random() * 16) * scale, scale, styles)),
    ];
    let raf = 0;
    const start = performance.now();
    let last = start;
    const loop = (now) => {
      // Steps are tuned per 60 Hz frame: scaled by the frames elapsed, a 120 Hz screen keeps the same pace.
      const f = Math.min(Math.max(now - last, 0), 100) / (1000 / 60);
      last = now;
      const drag = 0.965 ** f;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const fade = Math.max(0, 1 - (now - start - 2600) / 900);
      pieces.forEach((p) => {
        p.vx *= drag;
        p.vy = p.vy * drag + 0.16 * scale * f;
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.rot += p.spin * f;
        p.flutter += 0.18 * f;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flutter));
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.kind === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else if (p.kind === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = Math.max(1.5, p.size / 5);
          ctx.beginPath();
          ctx.moveTo(-p.size / 2.4, -p.size / 2.4);
          ctx.lineTo(p.size / 2.4, p.size / 2.4);
          ctx.moveTo(p.size / 2.4, -p.size / 2.4);
          ctx.lineTo(-p.size / 2.4, p.size / 2.4);
          ctx.stroke();
        }
        ctx.restore();
      });
      if (fade > 0) raf = requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [fire]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
\`\`\`

## src/components/memory-match/deck.js
\`\`\`js
export const SYMBOLS = ['star', 'heart', 'skull', 'eye', 'bolt', 'worm', 'sun', 'hand', 'flower', 'bone', 'globe', 'ghost'];

export const SYMBOL_NAMES = {
  star: 'Grinning star', heart: 'Toothy heart', skull: 'Skull', eye: 'Eye', bolt: 'Dripping bolt', worm: 'Worm',
  sun: 'Sun', hand: 'Hand', flower: 'Flower', bone: 'Bone', globe: 'Crying globe', ghost: 'Horned ghost',
};

// Columns × rows, landscape and portrait: the same index is the same preset, turned.
export const SIZES = {
  landscape: [[4, 3], [4, 4], [6, 4]],
  portrait: [[3, 4], [4, 4], [4, 6]],
};
export const DEFAULT_SIZE = 2;
export const sizeLabel = ([cols, rows]) => \`\${cols}×\${rows}\`;
export const pairsFor = (size) => (SIZES.landscape[size][0] * SIZES.landscape[size][1]) / 2;

// The very first 6×4 board, row by row: the deal the designer's clip plays.
const FIRST_DEAL = [
  'skull', 'eye', 'bolt', 'worm', 'heart', 'sun',
  'hand', 'flower', 'star', 'bone', 'eye', 'globe',
  'ghost', 'worm', 'sun', 'heart', 'hand', 'skull',
  'flower', 'bolt', 'bone', 'star', 'globe', 'ghost',
];

function shuffle(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function deal(size, first = false) {
  const pairs = pairsFor(size);
  const symbols = first && pairs === 12 ? FIRST_DEAL : shuffle(shuffle(SYMBOLS).slice(0, pairs).flatMap((s) => [s, s]));
  return symbols.map((symbol, i) => ({ id: \`\${i}-\${symbol}\`, symbol, matched: false }));
}

export const formatTime = (ms) => {
  const s = Math.floor(ms / 1000);
  return \`\${Math.floor(s / 60)}:\${String(s % 60).padStart(2, '0')}\`;
};
export const pad2 = (n) => String(n).padStart(2, '0');
\`\`\`

## src/components/memory-match/Eye.jsx
\`\`\`jsx
import { useLayoutEffect, useRef } from 'react';
import { registerEye } from './gaze';

/** The cartoon eye: white ball, iris, pupil and highlight; the look group turns toward the pointer. */
export default function Eye({ size, idle = false }) {
  const ref = useRef(null);
  const look = useRef(null);
  useLayoutEffect(() => registerEye(ref.current, look.current, idle), [idle]);
  return (
    <svg ref={ref} width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true" className="block">
      <circle r="50" fill="var(--ui-white)" />
      <g ref={look}>
        <circle r="24" fill="var(--swatch-3)" />
        <circle r="16" fill="var(--swatch-4)" />
        <circle cx="-6.5" cy="-6.5" r="4.2" fill="var(--ui-white)" />
      </g>
    </svg>
  );
}
\`\`\`

## src/components/memory-match/gaze.js
\`\`\`js
// One animation loop moves every eye's iris toward the pointer (viewport coordinates, so it holds
// inside the CSS-zoomed stage too: eye rects and pointer positions are both on screen).
const eyes = new Set();
const MAX = 0.42 * 50; // iris travel, in the eye's 100-unit viewBox
let target = null;
let lastInput = 0;
let touch = false;
let frame = 0;

const restTarget = () => ({ x: window.innerWidth * 0.9, y: window.innerHeight * 1.25 });

function wanderTarget(t) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return { x: w / 2 + w * 0.32 * Math.sin(t * 0.55), y: h / 2 + h * 0.3 * Math.sin(t * 0.83 + 1) };
}

function update(eye, ms, shared) {
  const t = ms / 1000;
  const rect = eye.el.getBoundingClientRect();
  if (!rect.width) return;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const r = rect.width / 2;
  const to = eye.idle ? { x: cx + r * 5 * Math.sin(t * 1.1), y: cy + r * 2.5 * Math.sin(t * 0.7 + 2) } : shared;
  const dx = to.x - cx;
  const dy = to.y - cy;
  const dist = Math.hypot(dx, dy) || 1;
  const reach = Math.min(1, dist / (r * 1.6)) * MAX;
  const gx = (dx / dist) * reach;
  const gy = (dy / dist) * reach;
  const k = eye.fresh ? 1 : 0.15;
  eye.x += (gx - eye.x) * k;
  eye.y += (gy - eye.y) * k;
  eye.fresh = false;
  const len = Math.hypot(eye.x, eye.y);
  const angle = (Math.atan2(eye.y, eye.x) * 180) / Math.PI;
  const squash = 1 - 0.22 * Math.min(1, len / MAX);
  eye.look.setAttribute('transform', \`translate(\${eye.x.toFixed(2)} \${eye.y.toFixed(2)}) rotate(\${angle.toFixed(1)}) scale(\${squash.toFixed(3)} 1) rotate(\${(-angle).toFixed(1)})\`);
}

const sharedTarget = (ms) => (touch && ms - lastInput > 2000 ? wanderTarget(ms / 1000) : target ?? restTarget());

function tick(ms) {
  const shared = sharedTarget(ms);
  eyes.forEach((eye) => update(eye, ms, shared));
  frame = eyes.size ? requestAnimationFrame(tick) : 0;
}

const onPointer = (event) => {
  target = { x: event.clientX, y: event.clientY };
  touch = event.pointerType === 'touch';
  lastInput = performance.now();
};

export function registerEye(el, look, idle) {
  const eye = { el, look, idle, x: 0, y: 0, fresh: true };
  if (!eyes.size) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
  }
  eyes.add(eye);
  update(eye, performance.now(), sharedTarget(performance.now()));
  if (!frame) frame = requestAnimationFrame(tick);
  return () => {
    eyes.delete(eye);
    if (eyes.size) return;
    cancelAnimationFrame(frame);
    frame = 0;
    target = null; // a remounted page starts at rest again
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('pointerdown', onPointer);
  };
}

/** Points every eye at a spot on screen, e.g. the card a keyboard just flipped. */
export function lookAt(x, y) {
  target = { x, y };
  lastInput = performance.now();
}
\`\`\`

## src/components/memory-match/memory-match.css
\`\`\`css
@font-face{font-family:"Instrument Serif";font-weight:400;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-serif-400-normal.woff2) format("woff2")}
@font-face{font-family:"Inter";font-weight:100 900;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/inter-variable-normal.woff2) format("woff2")}

/* The look: accent (frame, card backs, results card), background (behind the "^" wave), iris, ink. */
:root{
  --swatch-1:#E8402F;--swatch-1-ink:#121212;
  --swatch-2:#F7D4F4;--swatch-2-ink:#121212;
  --swatch-3:#4775FF;--swatch-3-ink:#FFFFFF;
  --swatch-4:#121212;--swatch-4-ink:#FFFFFF;
  --ui-white:#FFFFFF;
  --ui-pill:rgba(18,18,18,.88);
  --ui-pill-line:rgba(255,255,255,.18);
  --ui-shadow:rgba(40,20,10,.22);
  --ui-pill-shadow:rgba(40,20,10,.18);
  --ui-soft:rgba(255,255,255,.35);
}
/* gallery-look */

.mm{font-family:"Inter",system-ui,sans-serif;color:var(--swatch-4);-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none}
.mm .serif{font-family:"Instrument Serif",Georgia,serif;font-weight:400}
.mm .pill{background:var(--ui-pill);height:52px;border-radius:999px;box-shadow:0 8px 20px var(--ui-pill-shadow);color:var(--ui-white)}
.mm .card{touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:var(--card-radius);box-shadow:0 10px 24px var(--ui-shadow)}
.mm .face{position:absolute;inset:0;border-radius:inherit;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;align-items:center;justify-content:center;overflow:hidden}
.mm .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.mm button{cursor:pointer;font-family:inherit}
.mm button:focus-visible{outline:3px solid var(--swatch-4);outline-offset:3px}
.mm-window{padding-top:env(safe-area-inset-top);padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right);padding-bottom:env(safe-area-inset-bottom)}
\`\`\`

## src/components/memory-match/Results.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import Eye from './Eye';
import { StatRow } from './TopBar';
import { formatTime, pad2 } from './deck';

const BUTTON = 'h-[72px] shrink-0 rounded-[26px] border-0 text-[26px] font-semibold text-[var(--swatch-4)]';

export default function Results({ game, portrait, stack }) {
  const open = game.stage === 'results';
  const button = \`\${BUTTON} \${stack ? 'w-full' : 'flex-1'}\`;
  const items = [['Moves', pad2(game.moves)], ['Time', formatTime(game.elapsed)], ['Pairs', \`\${pad2(game.pairs)}/\${pad2(game.total)}\`]];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="results"
          // Portrait: fixed over the scrolled page, and itself scrollable on a screen shorter than the card.
          className={\`z-40 flex \${portrait ? 'fixed inset-0 flex-col items-center overflow-y-auto py-[16px]' : 'absolute inset-0 items-center justify-center'}\`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Board cleared"
            className={\`flex flex-col items-center rounded-[26px] bg-[var(--swatch-1)] shadow-[0_30px_80px_var(--ui-shadow)] \${
              portrait ? 'my-auto w-[90%] max-w-[560px] shrink-0 p-[32px]' : 'h-[500px] w-[660px] justify-center px-[45px]'
            }\`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Eye size={112} idle />
            <h2 className={\`serif m-0 mt-[14px] leading-[1.05] tracking-[-1px] text-[var(--swatch-4)] \${portrait ? 'text-[clamp(52px,13vw,80px)]' : 'text-[96px]'}\`}>
              Board cleared
            </h2>
            <div className="mt-[20px] flex h-[76px] w-full items-center rounded-[26px] bg-[var(--swatch-4)]">
              <StatRow
                items={items}
                divider="var(--ui-pill-line)"
                sectionClass={portrait ? 'flex-1 px-[4px] !gap-[6px]' : 'flex-1 px-[8px]'}
                labelClass={\`font-semibold text-[var(--ui-white)] opacity-75 \${portrait ? 'text-[clamp(12px,3.4vw,18px)]' : 'text-[18px]'}\`}
                valueClass={\`serif leading-none text-[var(--ui-white)] \${portrait ? 'text-[clamp(22px,7vw,44px)]' : 'text-[44px]'}\`}
              />
            </div>
            {game.best && (
              <p className="m-0 mt-[14px] text-[20px] font-semibold text-[var(--swatch-4)]">
                {game.best.isNew ? 'New best · ' : 'Best · '}{game.best.moves} moves · {formatTime(game.best.time)}
              </p>
            )}
            <div className={\`mt-[22px] flex w-full gap-[14px] \${stack ? 'flex-col' : ''}\`}>
              <button type="button" className={\`\${button} bg-[var(--ui-white)]\`} onClick={game.playAgain} autoFocus>Play again</button>
              <button type="button" className={\`\${button} bg-[var(--ui-soft)]\`} onClick={game.nextGrid}>New grid</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## src/components/memory-match/symbols.jsx
\`\`\`jsx
// The twelve card fronts, drawn on a 100-unit square: ink shapes with white cut-outs.
const I = 'var(--swatch-4)';
const W = 'var(--ui-white)';
const line = (color, width) => ({ fill: 'none', stroke: color, strokeWidth: width, strokeLinecap: 'round', strokeLinejoin: 'round' });

const ray = (n, r1, r2, spread) => Array.from({ length: n }, (_, i) => {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  const p = (r, d) => \`\${(50 + r * Math.cos(a + d)).toFixed(1)},\${(50 + r * Math.sin(a + d)).toFixed(1)}\`;
  return <polygon key={i} points={\`\${p(r1, -spread)} \${p(r2, 0)} \${p(r1, spread)}\`} fill={I} />;
});

const star = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  const r = i % 2 ? 22 : 46;
  return \`\${(50 + r * Math.cos(a)).toFixed(1)},\${(52 + r * Math.sin(a)).toFixed(1)}\`;
}).join(' ');

export const SYMBOL_ART = {
  star: (
    <>
      <polygon points={star} fill={I} strokeLinejoin="round" stroke={I} strokeWidth="3" />
      <path d="M43 40 q5 -6 11 0 q-5 5 -11 0z" fill={W} />
      <path d="M38 55 q11 10 24 -1" {...line(W, 5)} />
    </>
  ),
  heart: (
    <>
      <path d="M50 88 C20 66 8 50 10 34 C12 18 30 12 42 20 C46 23 49 27 50 30 C51 27 54 23 58 20 C70 12 88 18 90 34 C92 50 80 66 50 88z" fill={I} />
      {[34, 46, 58].map((x) => <rect key={x} x={x} y="44" width="9" height="13" rx="3.5" fill={W} />)}
    </>
  ),
  skull: (
    <>
      <path d="M50 10 C26 10 14 26 14 44 C14 56 20 64 28 68 L28 80 Q28 88 36 88 L64 88 Q72 88 72 80 L72 68 C80 64 86 56 86 44 C86 26 74 10 50 10z" fill={I} />
      <ellipse cx="36" cy="44" rx="10" ry="11" fill={W} />
      <ellipse cx="64" cy="44" rx="10" ry="11" fill={W} />
      <path d="M50 56 L45 64 L55 64z" fill={W} />
      {[42, 50, 58].map((x) => <rect key={x} x={x - 2} y="74" width="4" height="14" fill={W} />)}
    </>
  ),
  eye: (
    <>
      <path d="M12 56 Q50 18 88 56 Q50 90 12 56z" {...line(I, 7)} />
      <circle cx="50" cy="56" r="14" fill={I} />
      <circle cx="45" cy="51" r="4" fill={W} />
      {[[26, 40, 20, 28], [38, 33, 35, 20], [50, 31, 50, 17], [62, 33, 65, 20], [74, 40, 80, 28]].map(([x1, y1, x2, y2]) => (
        <line key={x1} x1={x1} y1={y1} x2={x2} y2={y2} {...line(I, 6)} />
      ))}
    </>
  ),
  bolt: (
    <>
      <polygon points="58,8 22,56 46,56 36,92 78,40 54,40 66,8" fill={I} strokeLinejoin="round" stroke={I} strokeWidth="4" />
      <path d="M30 56 L30 74" {...line(I, 8)} />
      <circle cx="30" cy="80" r="4.5" fill={I} />
      <path d="M43 62 L43 70" {...line(I, 6)} />
    </>
  ),
  worm: (
    <>
      <path d="M16 70 C26 44 38 44 44 62 C50 80 62 80 68 58 C72 44 78 36 84 34" {...line(I, 16)} />
      <circle cx="84" cy="32" r="3.5" fill={W} />
      <path d="M36 54 l4 4 M56 70 l-3 5" {...line(W, 3)} />
    </>
  ),
  sun: (
    <>
      {ray(10, 30, 47, 0.2)}
      <circle cx="50" cy="50" r="27" fill={I} />
      <circle cx="41" cy="45" r="4.5" fill={W} />
      <circle cx="59" cy="45" r="4.5" fill={W} />
      <path d="M39 57 Q50 67 61 57" {...line(W, 5)} />
    </>
  ),
  hand: (
    <>
      <path d="M30 88 L30 58 Q30 52 36 52 L66 52 Q72 52 72 58 L72 76 Q72 88 60 88z" fill={I} />
      {[[30, 18], [42, 10], [54, 12], [66, 22]].map(([x, top]) => <rect key={x} x={x} y={top} width="11" height={60 - top} rx="5.5" fill={I} />)}
      <path d="M72 66 L86 52" {...line(I, 11)} />
      <path d="M44 72 Q51 77 58 72" {...line(W, 4)} />
    </>
  ),
  flower: (
    <>
      <path d="M50 62 L50 94" {...line(I, 7)} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <circle key={i} cx={50 + 20 * Math.cos(a)} cy={40 + 20 * Math.sin(a)} r="14" fill={I} />;
      })}
      <circle cx="50" cy="40" r="11" fill={W} />
      <circle cx="50" cy="40" r="5" fill={I} />
    </>
  ),
  bone: (
    <>
      <g transform="rotate(-35 50 50)">
        <rect x="24" y="42" width="52" height="16" fill={I} />
        {[[22, 40], [22, 60], [78, 40], [78, 60]].map(([x, y]) => <circle key={\`\${x}\${y}\`} cx={x} cy={y} r="12" fill={I} />)}
      </g>
    </>
  ),
  globe: (
    <>
      <circle cx="50" cy="46" r="34" fill={I} />
      <path d="M18 40 Q50 30 82 40 M20 60 Q50 68 80 58 M50 12 Q30 46 50 80" {...line(W, 3)} />
      <circle cx="38" cy="44" r="5" fill={W} />
      <circle cx="62" cy="44" r="5" fill={W} />
      <path d="M38 52 Q34 60 38 64 Q42 60 38 52z" fill={W} />
      <path d="M70 80 Q64 90 70 94 Q76 90 70 80z" fill={I} />
    </>
  ),
  ghost: (
    <>
      <path d="M22 88 L22 44 C22 26 34 16 50 16 C66 16 78 26 78 44 L78 88 L69 80 L60 88 L50 80 L40 88 L31 80z" fill={I} />
      <path d="M30 26 L24 8 L42 18z M70 26 L76 8 L58 18z" fill={I} />
      <ellipse cx="40" cy="46" rx="6" ry="8" fill={W} />
      <ellipse cx="60" cy="46" rx="6" ry="8" fill={W} />
      <ellipse cx="50" cy="64" rx="6" ry="4" fill={W} />
    </>
  ),
};

/** Shared once per board: the inked edge every symbol is drawn through. */
export function InkFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="mm-ink" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}

export function SymbolArt({ symbol, size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="block">
      <g filter="url(#mm-ink)">{SYMBOL_ART[symbol]}</g>
    </svg>
  );
}
\`\`\`

## src/components/memory-match/TopBar.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { useAnimate } from 'framer-motion';
import { SIZES, formatTime, pad2, sizeLabel } from './deck';

/** A value that does a quick scale bump whenever it changes (not on first paint). */
function Bump({ value, className }) {
  const [scope, animate] = useAnimate();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) first.current = false;
    else animate(scope.current, { scale: [1, 1.28, 1] }, { duration: 0.3, ease: 'easeOut' });
  }, [value]);
  return <span ref={scope} className={\`inline-block \${className}\`}>{value}</span>;
}

export function StatRow({ items, labelClass, valueClass, sectionClass, divider }) {
  return items.map(([label, value, bump], i) => (
    <div key={label} className={\`flex items-baseline justify-center gap-[10px] \${sectionClass}\`} style={i ? { borderLeft: \`1px solid \${divider}\` } : undefined}>
      <span className={labelClass}>{label}</span>
      {bump ? <Bump value={value} className={valueClass} /> : <span className={valueClass}>{value}</span>}
    </div>
  ));
}

export function SizeSelector({ size, orientation, onChange, portrait }) {
  return (
    <div className="pill relative flex items-center p-[5px]" role="radiogroup" aria-label="Grid size">
      <span
        aria-hidden="true"
        className="absolute bottom-[5px] left-[5px] top-[5px] rounded-full bg-[var(--ui-white)] transition-transform duration-[250ms] ease-in-out"
        style={{ width: 'calc((100% - 10px) / 3)', transform: \`translateX(\${size * 100}%)\` }}
      />
      {SIZES[orientation].map((dims, i) => (
        <button
          key={sizeLabel(dims)}
          type="button"
          role="radio"
          aria-checked={i === size}
          onClick={() => onChange(i)}
          className={\`relative z-[1] h-[42px] rounded-full border-0 bg-transparent font-bold transition-colors duration-[250ms] \${
            portrait ? 'min-w-[56px] px-[10px] text-[clamp(16px,4.6vw,28px)]' : 'w-[96px] text-[22px]'
          } \${i === size ? 'text-[var(--swatch-4)]' : 'text-[var(--ui-white)]'}\`}
        >
          {sizeLabel(dims)}
        </button>
      ))}
    </div>
  );
}

export function StatsPill({ game, portrait }) {
  const items = [['Moves', pad2(game.moves), true], ['Time', formatTime(game.elapsed)], ['Pairs', \`\${pad2(game.pairs)}/\${pad2(game.total)}\`, true]];
  return (
    <div className="pill grid auto-cols-fr grid-flow-col items-center py-[12px]" aria-live="polite">
      <StatRow
        items={items}
        divider="var(--ui-pill-line)"
        sectionClass={portrait ? 'px-[15px]' : 'px-[31px]'}
        labelClass={\`font-semibold text-[var(--ui-white)] opacity-[.65] \${portrait ? 'text-[clamp(13px,3.6vw,23px)]' : 'text-[17px]'}\`}
        valueClass={\`serif leading-none \${portrait ? 'text-[clamp(20px,5.6vw,34px)]' : 'text-[30px]'}\`}
      />
    </div>
  );
}

export function Title({ portrait }) {
  return (
    <h1
      className={\`serif m-0 text-[var(--swatch-4)] \${portrait ? 'text-center text-[clamp(44px,9vw,88px)]' : 'text-[56px]'}\`}
      style={{ lineHeight: 0.86, letterSpacing: '-1px' }}
    >
      Memory
      <br />
      of the Mess
    </h1>
  );
}
\`\`\`

## src/components/memory-match/useLayout.js
\`\`\`js
import { useEffect, useState } from 'react';
import { SIZES } from './deck';

// Landscape is composed on a 1920×1080 stage (40px frame, top bar band, 250×186 cards at 6×4, as in the clip) and zoomed
// down to fit; portrait lays out at real size, sizes cards to the window height left under its measured top bar, and
// scrolls the page when even the smallest cards don't fit (nothing is clipped).
const STAGE = [1920, 1080];
const LANDSCAPE = { frame: 40, radius: 96, gap: 22, cardRadius: 26, aspect: 186 / 250, glyph: 22, eye: 0.512, symbol: 0.46, top: 152, bottom: 38, side: 115 };
// The portrait column needs about this much height for its top bar and the 4×6 board at minCard; a shorter landscape
// window (a phone held sideways) takes the zoomed landscape stage instead.
const PORTRAIT_MIN_H = 760;
const PORTRAIT = { frame: 14, radius: 40, gap: 12, cardRadius: 18, aspect: 220 / 208, glyph: 18, eye: 0.62, symbol: 0.52, minCard: 70 };

function fitCard(width, height, [cols, rows], { gap, aspect, minCard = 0 }) {
  const byWidth = (width - gap * (cols - 1)) / cols;
  const byHeight = (height - gap * (rows - 1)) / rows / aspect;
  const w = Math.max(minCard, Math.floor(Math.min(byWidth, byHeight)));
  return { width: w, height: Math.round(w * aspect) };
}

export function useLayout(size, headerRef) {
  const [[vw, vh], setView] = useState(() => (typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight]));
  const [headerH, setHeaderH] = useState(null);
  useEffect(() => {
    const onResize = () => setView([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const portrait = vh > vw || (vw < 900 && vh >= PORTRAIT_MIN_H);
  useEffect(() => {
    const el = headerRef.current;
    if (!portrait || !el) return undefined;
    const observer = new ResizeObserver(() => setHeaderH(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [portrait, headerRef]);

  const orientation = portrait ? 'portrait' : 'landscape';
  const dims = SIZES[orientation][size];
  if (portrait) {
    const s = PORTRAIT;
    const card = fitCard(vw - 2 * s.frame - 24, vh - 2 * s.frame - (headerH ?? 250) - 18, dims, s);
    return { portrait, orientation, cols: dims[0], zoom: 1, stage: { width: '100%', minHeight: '100dvh' }, spec: s, card, topWidth: undefined, vw };
  }
  const zoom = Math.min(1, vw / STAGE[0], vh / STAGE[1]);
  const W = vw / zoom;
  const H = vh / zoom;
  const s = LANDSCAPE;
  const availW = W - 2 * s.frame - 2 * s.side;
  const card = fitCard(availW, H - 2 * s.frame - s.top - s.bottom, dims, s);
  const gridW = dims[0] * card.width + (dims[0] - 1) * s.gap;
  return {
    portrait, orientation, cols: dims[0], zoom, stage: { zoom, width: W, height: H }, spec: s, card,
    topWidth: Math.max(gridW, Math.min(availW, 1610)), vw,
  };
}
\`\`\`

## src/components/memory-match/useMemoryGame.js
\`\`\`js
import { useCallback, useEffect, useReducer, useState } from 'react';
import { DEFAULT_SIZE, deal, pairsFor } from './deck';

const STORAGE_KEY = 'memory-of-the-mess:size';
const DEALT_KEY = 'memory-of-the-mess:dealt';
const BEST_KEY = 'memory-of-the-mess:best';
const MISMATCH_MS = 850; // flip (0.42s) + shake (0.45s), then back face-down
const CONFETTI_MS = 800; // the last pair's pulse ends and its fade begins
const RESULTS_MS = 1150;
const FLIP_MS = 420; // a found pair counts once its second card has turned over

const readSize = () => {
  const stored = read(STORAGE_KEY);
  return ['0', '1', '2'].includes(stored) ? Number(stored) : DEFAULT_SIZE;
};

const read = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // storage unavailable: nothing is remembered
  }
};

const fresh = (size, round, first = false) => ({
  size, round, cards: deal(size, first), up: [], open: [], misses: [], locked: false, moves: 0, pairs: 0, start: null, end: null,
});

function reducer(state, action) {
  if (action.type === 'reset') return fresh(action.size, state.round + 1);
  if (action.type === 'unflip') {
    return { ...state, up: state.up.filter((i) => !state.open.includes(i)), open: [], misses: [], locked: false };
  }
  // flip
  const i = action.index;
  const card = state.cards[i];
  if (state.locked || state.end || !card || card.matched || state.up.includes(i)) return state;
  const up = [...state.up, i];
  const open = [...state.open, i];
  const start = state.start ?? action.now;
  if (open.length < 2) return { ...state, up, open, start };
  const moves = state.moves + 1;
  const [a, b] = open;
  if (state.cards[a].symbol !== state.cards[b].symbol) return { ...state, up, open, start, moves, misses: [a, b], locked: true };
  const cards = state.cards.map((c, j) => (j === a || j === b ? { ...c, matched: true } : c));
  const pairs = state.pairs + 1;
  return { ...state, cards, up, open: [], start, moves, pairs, end: pairs === pairsFor(state.size) ? action.now : null };
}

export function useMemoryGame() {
  // The clip's fixed deal is only a first visit's board; later visits deal at random.
  const [state, dispatch] = useReducer(reducer, null, () => fresh(readSize(), 0, !read(DEALT_KEY)));
  const [now, setNow] = useState(() => Date.now());
  const [stage, setStage] = useState('playing');
  const [shownPairs, setShownPairs] = useState(0);
  const [best, setBest] = useState(null);

  useEffect(() => write(DEALT_KEY, '1'), []);

  useEffect(() => {
    if (!state.end) return setBest(null);
    let all = {};
    try {
      all = JSON.parse(read(BEST_KEY)) || {};
    } catch {
      // unreadable: start over
    }
    const old = all[state.size];
    const time = state.end - state.start;
    // One whole game is the best (fewest moves, then fastest), so its moves and time never come from two games.
    const isNew = !old || state.moves < old.moves || (state.moves === old.moves && time < old.time);
    const kept = isNew ? { moves: state.moves, time } : old;
    write(BEST_KEY, JSON.stringify({ ...all, [state.size]: kept }));
    setBest({ ...kept, isNew });
  }, [state.end, state.round]);

  useEffect(() => {
    if (!state.pairs) return setShownPairs(0);
    const timer = setTimeout(() => setShownPairs(state.pairs), FLIP_MS);
    return () => clearTimeout(timer);
  }, [state.pairs, state.round]);

  useEffect(() => {
    if (!state.locked) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'unflip' }), MISMATCH_MS);
    return () => clearTimeout(timer);
  }, [state.locked]);

  useEffect(() => {
    if (!state.start || state.end) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [state.start, state.end]);

  useEffect(() => {
    setStage('playing');
    if (!state.end) return undefined;
    const timers = [setTimeout(() => setStage('confetti'), CONFETTI_MS), setTimeout(() => setStage('results'), RESULTS_MS)];
    return () => timers.forEach(clearTimeout);
  }, [state.end, state.round]);

  const restart = useCallback((size) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(size));
    } catch {
      // storage unavailable: the size just isn't remembered
    }
    dispatch({ type: 'reset', size });
  }, []);

  const flip = useCallback((index) => dispatch({ type: 'flip', index, now: Date.now() }), []);
  const elapsed = state.start ? (state.end ?? Math.max(now, state.start)) - state.start : 0;

  return {
    ...state,
    pairs: shownPairs,
    best,
    total: pairsFor(state.size),
    elapsed,
    stage,
    flip,
    restart,
    playAgain: () => restart(state.size),
    nextGrid: () => restart((state.size + 1) % 3),
  };
}
\`\`\`

## src/components/memory-match/WaveBackground.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';

/** The "^" field in the accent color, swaying as a gravity wave. \`scale\` is the stage's CSS zoom. */
export default function WaveBackground({ glyph, scale }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const colStep = glyph * 0.6 + 7;
    const rowStep = glyph + 6;
    let t = 0;
    let last = performance.now();
    let raf = 0;
    let color = '';
    let frames = 0;

    const draw = () => {
      const ratio = (window.devicePixelRatio || 1) * scale;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
      }
      // The look can change live: re-read the accent every half second.
      if (frames++ % 30 === 0) color = getComputedStyle(canvas).getPropertyValue('--swatch-1').trim();
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      ctx.font = \`400 \${glyph}px Inter, system-ui, sans-serif\`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cols = Math.ceil(w / colStep) + 6;
      const rows = Math.ceil(h / rowStep) + 3;
      for (let row = -1; row < rows; row += 1) {
        for (let col = -3; col < cols; col += 1) {
          const raw = Math.sin(t + row * 0.25 + col * 0.23);
          const wave = Math.sign(raw) * Math.abs(raw) ** 1.1;
          ctx.fillText('^', col * colStep + wave * 42, row * rowStep + wave * wave * 12.6);
        }
      }
    };

    const loop = (now) => {
      t += 0.014 * (Math.min(Math.max(now - last, 0), 100) / (1000 / 60)); // per 60 Hz frame, at any refresh rate
      last = now;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };
    draw();
    raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [glyph, scale]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
\`\`\`

## src/pages/MemoryMatch.jsx
\`\`\`jsx
import { useRef } from 'react';
import { MotionConfig } from 'framer-motion';
import '@/components/memory-match/memory-match.css';
import Board from '@/components/memory-match/Board';
import Confetti from '@/components/memory-match/Confetti';
import Results from '@/components/memory-match/Results';
import WaveBackground from '@/components/memory-match/WaveBackground';
import { SizeSelector, StatsPill, Title } from '@/components/memory-match/TopBar';
import { useLayout } from '@/components/memory-match/useLayout';
import { useMemoryGame } from '@/components/memory-match/useMemoryGame';

export default function MemoryMatch() {
  const game = useMemoryGame();
  const boardRef = useRef(null);
  const headerRef = useRef(null);
  const layout = useLayout(game.size, headerRef);
  const { portrait, spec } = layout;
  const selector = <SizeSelector size={game.size} orientation={layout.orientation} onChange={game.restart} portrait={portrait} />;
  const stats = <StatsPill game={game} portrait={portrait} />;

  return (
    <MotionConfig reducedMotion="user">
      <div className={\`mm relative bg-[var(--swatch-1)] \${portrait ? 'flex flex-col' : 'overflow-hidden'}\`} style={{ ...layout.stage, padding: spec.frame }}>
        <div className={\`mm-window relative flex w-full flex-1 flex-col overflow-hidden bg-[var(--swatch-2)] \${portrait ? '' : 'h-full'}\`} style={{ borderRadius: spec.radius }}>
          <WaveBackground glyph={spec.glyph} scale={layout.zoom} />
          {portrait ? (
            <header ref={headerRef} className="relative flex flex-col items-center gap-[14px] px-[12px] pb-[16px] pt-[22px]">
              <Title portrait />
              <div className="flex flex-wrap items-center justify-center gap-[12px]">{selector}{stats}</div>
            </header>
          ) : (
            <header className="relative mx-auto grid h-[52px] shrink-0 grid-cols-[1fr_auto_1fr] grid-rows-[52px] items-center" style={{ width: layout.topWidth, marginTop: 59, marginBottom: 41 }}>
              <Title />
              {selector}
              <div className="flex justify-end">{stats}</div>
            </header>
          )}
          <main
            ref={boardRef}
            // Portrait grows with its board (the page scrolls), so the board never spills over the top bar.
            className={\`relative flex flex-1 items-center justify-center \${portrait ? '' : 'min-h-0'}\`}
            style={portrait ? { padding: '0 12px 16px' } : { paddingBottom: spec.bottom }}
          >
            {/* A new round remounts the cards: a fresh board, every card face-down. */}
            <Board key={game.round} game={game} cols={layout.cols} card={layout.card} spec={spec} />
          </main>
        </div>
        <Results game={game} portrait={portrait} stack={portrait && layout.vw * 0.9 < 380} />
      </div>
      <Confetti fire={game.stage !== 'playing' ? game.round + 1 : 0} originRef={boardRef} scale={layout.zoom * 1.5} amount={portrait ? 0.6 : 1} />
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};