var e=`# endless_runner — app files

## src/components/meadow-run/Cards.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { Check, Pause, Play } from 'lucide-react';
import { TIERS } from './engine';

export const fmt = (n) => n.toLocaleString('en-US');

export const CoinOrb = ({ size }) => <span className="mr-coin inline-block shrink-0 rounded-full" style={{ width: size, height: size }} aria-hidden />;
export const Orb = ({ size }) => <span className="mr-orb inline-block shrink-0 rounded-full" style={{ width: size, height: size }} aria-hidden />;

export function PauseButton({ paused, onClick, size }) {
  return (
    <button type="button" onClick={onClick} className="mr-pause pointer-events-auto flex shrink-0 items-center justify-center rounded-full" style={{ width: size, height: size }}>
      {paused ? <Play size={size * 0.4} fill="currentColor" strokeWidth={0} /> : <Pause size={size * 0.42} fill="currentColor" strokeWidth={0} />}
      <span className="sr-only">{paused ? 'Resume' : 'Pause'}</span>
    </button>
  );
}

const pop = { initial: { opacity: 0, y: -8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.28, ease: 'easeOut' } };

export function TierToast({ tier, compact }) {
  if (compact) {
    return (
      <motion.div {...pop} className="mr-tint flex h-[26px] items-center gap-2 rounded-full pl-1.5 pr-3 text-[11px] font-medium text-[var(--ui-ink)]">
        <Orb size={16} /> Up to {TIERS[tier]} · speed increased
      </motion.div>
    );
  }
  return (
    <motion.div {...pop} className="mr-tint flex h-[60px] w-[200px] items-center justify-between rounded-[14px] pl-4 pr-2">
      <div>
        <div className="mr-serif text-[21px] leading-[1.1]">Up to {TIERS[tier]}</div>
        <div className="text-[11.5px] text-[var(--ui-muted)]">Speed increased</div>
      </div>
      <Orb size={52} />
    </motion.div>
  );
}

const zoomIn = { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.98 }, transition: { duration: 0.3, ease: 'easeOut' } };

export function NearMissCard({ compact, className = '' }) {
  if (compact) {
    return (
      <motion.div {...zoomIn} className={\`mr-tint flex h-[64px] w-full items-center justify-between rounded-[22px] pl-5 pr-2 \${className}\`}>
        <div>
          <div className="mr-serif text-[22px] leading-[1.15]">Near miss</div>
          <div className="text-[12px] text-[var(--ui-muted)]">+250 bonus · slow-motion</div>
        </div>
        <Orb size={54} />
      </motion.div>
    );
  }
  return (
    <motion.div {...zoomIn} className={\`mr-tint flex h-[156px] w-[280px] justify-between rounded-[22px] py-4 pl-5 pr-2 \${className}\`}>
      <div className="flex flex-col">
        <div className="mr-serif text-[29px] leading-[1.15]">Near miss</div>
        <div className="mt-0.5 text-[13px] text-[var(--ui-muted)]">+250 bonus</div>
        <div className="mt-auto space-y-[7px] text-[12.5px] text-[var(--ui-muted)]">
          {['Cleared by a hair', 'Slow-motion'].map((row) => (
            <div key={row} className="flex items-center gap-2">
              <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[var(--ui-muted)] text-[var(--ui-card)]"><Check size={9} strokeWidth={3.5} /></span>
              {row}
            </div>
          ))}
        </div>
      </div>
      <Orb size={110} />
    </motion.div>
  );
}
\`\`\`

## src/components/meadow-run/course.js
\`\`\`js
import { mulberry32 } from './paint/color';

// World units: one is a pixel of the 1280×720 desktop frame. Heights are above the ground.
export const RUN_SPEED = 540;
export const JUMP_VELOCITY = 1100;
export const GRAVITY = 2500;
export const PLAYER = { hw: 26, stand: 190, slide: 96 };
export const POM_HEIGHT = 168;

export const HAZARDS = {
  puff: { ground: true, hw: 20, h: 100 },
  berries: { ground: true, hw: 20, h: 66 },
  florets: { ground: true, hw: 22, h: 46 },
  alliums: { ground: true, hw: 24, h: 110 },
  pomOrange: { ground: false, hw: 36, low: 124, high: 212 },
  pomInk: { ground: false, hw: 36, low: 124, high: 212 },
  pomBlue: { ground: false, hw: 36, low: 124, high: 212 },
  pomMoss: { ground: false, hw: 36, low: 124, high: 212 },
};
const TYPES = Object.keys(HAZARDS);

export const jumpHeight = (t) => Math.max(0, JUMP_VELOCITY * t - (GRAVITY * t * t) / 2);
const APEX = JUMP_VELOCITY / GRAVITY;

const hazard = (type, x) => ({ type, x, ...HAZARDS[type], spin: (x * 0.013) % (Math.PI * 2) });
const coin = (x, y) => ({ x, y, taken: false });

// Coins along the jump that clears a plant (apex over it), or a low row under a pom.
function coinsFor(h, speed) {
  if (h.ground) {
    const takeoff = h.x - APEX * speed;
    return [0.14, 0.29, 0.44, 0.59, 0.74].map((t) => coin(takeoff + speed * t, jumpHeight(t) + 95));
  }
  return [0, 1, 2, 3].map((i) => coin(h.x - 93 + i * 62, 40));
}
const row = (from, to) => {
  const n = Math.max(3, Math.min(4, Math.floor((to - from) / 70)));
  const mid = (from + to) / 2;
  return Array.from({ length: n }, (_, i) => coin(mid + (i - (n - 1) / 2) * 62, 50));
};

// The first run picks up the promo's moment: mid-jump over the berries at 12,480 points, then its
// exact sequence of plants and poms (speeds are the run's speed as each one comes up).
const OPENING = [
  ['pomOrange', 1065, 575], ['puff', 1839, 609], ['alliums', 2777, 641], ['pomOrange', 3763, 675],
  ['puff', 4728, 704], ['pomInk', 6105, 745], ['florets', 7325, 780], ['pomMoss', 8278, 805],
  ['puff', 9009, 825], ['alliums', 9846, 847], ['pomMoss', 10877, 870],
];

// The clip's moves on the opening course, at the distance each one lands in its clean run (worked out
// from the clip's key timings): the gallery demo plays these, so they hit their beats at any frame rate.
export const OPENING_MOVES = [
  [768.5, 'slide'], [1582.4, 'jump'], [2497.6, 'jump'], [3431.2, 'slide'], [4422.5, 'jump'], [5979.1, 'slide'],
  [6995, 'jump'], [7887.7, 'slide'], [8647.2, 'jump'], [9482.5, 'jump'], [10460, 'slide'],
];

export function openingCourse() {
  const hazards = [hazard('berries', -15)];
  const coins = [[28, 244], [68, 216], [110, 168], [151, 98]].map(([x, y]) => coin(x, y));
  coins.push(...[0, 1, 2, 3, 4].map((i) => coin(375 + i * 62.5, 53)));
  let last = -15;
  for (const [type, x, speed] of OPENING) {
    const h = hazard(type, x);
    if (x - last > 900 && last > 0) coins.push(...row(last + 260, x - 300));
    hazards.push(h);
    coins.push(...coinsFor(h, speed));
    last = x;
  }
  return { hazards, coins, end: last, rng: mulberry32(2026) };
}

export function freshCourse(seed) {
  return { hazards: [], coins: [], end: 500, rng: mulberry32(seed) };
}

// Keeps the course laid out ahead of the runner: gaps grow with speed so every hazard stays readable.
export function extendCourse(course, dist, speed) {
  while (course.end < dist + 2600) {
    const { rng } = course;
    const gap = speed * (1.25 + rng() * 0.75);
    const x = course.end + gap;
    const h = hazard(TYPES[Math.floor(rng() * TYPES.length)], x);
    if (gap > 900) course.coins.push(...row(course.end + 260, x - 300));
    course.hazards.push(h);
    course.coins.push(...coinsFor(h, speed));
    course.end = x;
  }
}
\`\`\`

## src/components/meadow-run/DesktopHud.jsx
\`\`\`jsx
import { AnimatePresence } from 'framer-motion';
import { TIERS } from './engine';
import { CoinOrb, NearMissCard, PauseButton, TierToast, fmt } from './Cards';
import { TouchControls } from './MobileHud';

const SEGMENT = 70;

function TierControl({ tier, mult }) {
  return (
    <div className="mr-card flex h-[43px] items-center rounded-[22px] pl-[6px] pr-4">
      <div className="relative flex h-[31px] rounded-full bg-[var(--ui-track)]" role="group" aria-label="Speed">
        <span className="mr-pill absolute top-[3px] h-[25px] rounded-full bg-[var(--ui-card)] shadow-[0_1px_4px_color-mix(in_srgb,var(--ui-shade)_14%,transparent)]" style={{ width: SEGMENT - 4, transform: \`translateX(\${tier * SEGMENT + 3}px)\` }} />
        {TIERS.map((name, i) => (
          <span key={name} className={\`relative z-[1] flex items-center justify-center text-[13px] \${i === tier ? 'font-semibold text-[var(--ui-ink)]' : 'text-[var(--ui-muted)]'}\`} style={{ width: SEGMENT }} aria-current={i === tier}>{name}</span>
        ))}
      </div>
      <span className="mr-serif ml-[14px] text-[18px]">×{mult}</span>
    </div>
  );
}

function KeyHints() {
  const keys = [['Space', 'Jump'], ['↓', 'Slide'], ['P', 'Pause']];
  return (
    <div className="mr-card absolute bottom-[27px] left-[27px] flex h-[39px] items-center gap-3 rounded-[20px] pl-[8px] pr-4 text-[13px] text-[var(--ui-muted)]">
      {keys.map(([key, label]) => (
        <span key={key} className="flex items-center gap-[7px]">
          <kbd className="mr-kbd flex h-[24px] min-w-[24px] items-center justify-center rounded-[8px] px-[6px] font-[inherit] text-[11px] font-semibold">{key}</kbd>
          {label}
        </span>
      ))}
    </div>
  );
}

// On a touch screen (a tablet, a phone held sideways) the key hints become Jump and Slide buttons.
export default function DesktopHud({ hud, onPause, touch, onJump, onSlide }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="mr-card absolute left-[27px] top-[27px] h-[98px] w-[219px] rounded-[18px] px-[18px] pt-[14px]">
        <div className="text-[12.5px] text-[var(--ui-muted)]">Score</div>
        <div className="mr-serif -mt-[2px] text-[41px] leading-[1.05] tracking-[-0.01em]">{fmt(hud.score)}</div>
        <div className="mt-[1px] text-[11.5px] text-[var(--ui-muted)]">Best {fmt(hud.best)}</div>
      </div>
      <div className="absolute left-1/2 top-[27px] flex -translate-x-1/2 flex-col items-center gap-3">
        <TierControl tier={hud.tier} mult={hud.mult} />
        <AnimatePresence>{hud.tierCard !== null && <TierToast key={hud.tierCard} tier={hud.tierCard} />}</AnimatePresence>
      </div>
      <div className="absolute right-[28px] top-[27px] flex items-center gap-[10px]">
        <div className="mr-card flex h-[43px] w-[130px] items-center gap-[10px] rounded-[22px] px-[13px]">
          <CoinOrb size={28} />
          <div className="leading-none">
            <div className="mr-serif text-[21px]">{hud.coins}</div>
            <div className="mt-[2px] text-[10px] text-[var(--ui-muted)]">Coins</div>
          </div>
        </div>
        <PauseButton paused={hud.status === 'paused'} onClick={onPause} size={43} />
      </div>
      <AnimatePresence>
        {hud.near && <NearMissCard key="near" className="absolute left-[calc(48%-140px)] top-[36.5%]" />}
      </AnimatePresence>
      {touch
        ? <TouchControls onJump={onJump} onSlide={onSlide} className="left-1/2 w-[min(420px,calc(100%-32px))] -translate-x-1/2" />
        : <KeyHints />}
    </div>
  );
}
\`\`\`

## src/components/meadow-run/engine.js
\`\`\`js
import { GRAVITY, JUMP_VELOCITY, PLAYER, RUN_SPEED, extendCourse, freshCourse, openingCourse } from './course';

export const TIERS = ['Stroll', 'Jog', 'Sprint'];
const tierOf = (mult) => (mult >= 1.42 ? 2 : mult >= 1.19 ? 1 : 0);
const STEP = 1 / 240;
const SLIDE_TIME = 0.9;
const NEAR_WINDOW = 0.26; // dodged this late (s) = by a hair
const SLOW_TIME = 1.25; // wall seconds of the slow-motion beat
const SLOW = 0.04; // the promo nearly freezes: the pom hangs over her for a second
export const NEAR_BONUS = 250;

// The promo's frame: score 12,480, 86 coins, coming down over the berries.
export function createGame({ opening, best, seed = 1 }) {
  const course = opening ? openingCourse() : freshCourse(seed);
  return {
    status: opening ? 'ready' : 'running',
    course, best, opening, record: false, t: 0, dist: 0, mult: 1, tier: 0,
    score: opening ? 12480 : 0, coins: opening ? 86 : 0,
    h: opening ? 210 : 0, vh: opening ? -283 : 0, air: opening, slideLeft: 0, actionAt: -1,
    slowLeft: 0, nearLeft: 0, bonusIn: 0, tierLeft: 0, events: [],
    moves: [], // [distance, 'jump' | 'slide']: a scripted run (the gallery demo) plays each on reaching it
  };
}

// Wall-clock seconds into the slow-motion beat → time scale (eases down, holds, eases back).
function timeScale(g) {
  if (g.slowLeft <= 0) return 1;
  const s = SLOW_TIME - g.slowLeft;
  if (s < 0.05) return 1 - (s / 0.05) * (1 - SLOW);
  if (s < 1) return SLOW;
  return SLOW + ((s - 1) / 0.25) * (1 - SLOW);
}

export const slowAmount = (g) => (1 - timeScale(g)) / (1 - SLOW);
export const isSliding = (g) => g.slideLeft > 0 && !g.air;

export function jump(g) {
  if (g.status !== 'running' || g.air) return;
  g.air = true;
  g.vh = JUMP_VELOCITY;
  g.slideLeft = 0;
  g.actionAt = g.t;
}

export function slide(g) {
  if (g.status !== 'running') return;
  if (g.air) {
    g.vh = Math.min(g.vh, -1200); // drop out of a jump, then slide on landing
    g.slideLeft = SLIDE_TIME + 0.15;
  } else {
    if (g.slideLeft <= 0) g.actionAt = g.t;
    g.slideLeft = SLIDE_TIME;
  }
}

function collides(g, hz) {
  if (hz.ground) return g.h < hz.h;
  const top = g.h + (isSliding(g) ? PLAYER.slide : PLAYER.stand);
  return g.h < hz.high && top > hz.low;
}

function tick(g, dt) {
  while (g.moves.length && g.dist >= g.moves[0][0]) (g.moves.shift()[1] === 'jump' ? jump : slide)(g);
  g.t += dt;
  g.mult = Math.min(2, 1 + 0.0415 * g.t);
  const v = RUN_SPEED * g.mult;
  g.dist += v * dt;
  g.score += v * dt * 0.165;
  if (g.air) {
    g.vh -= GRAVITY * dt;
    g.h += g.vh * dt;
    if (g.h <= 0) Object.assign(g, { h: 0, vh: 0, air: false });
  }
  g.slideLeft -= g.air ? 0 : dt;
  const top = g.h + (isSliding(g) ? PLAYER.slide : PLAYER.stand);
  for (const hz of g.course.hazards) {
    if (hz.cleared || Math.abs(hz.x - g.dist) >= hz.hw + PLAYER.hw) continue;
    if (collides(g, hz)) {
      g.status = 'over';
      g.record = !g.opening && Math.floor(g.score) > g.best; // the opening run's promo points never count
      if (g.record) g.best = Math.floor(g.score);
      g.events.push({ kind: 'crash' });
      return;
    }
    if (!hz.entered) {
      hz.entered = true;
      if (g.t - g.actionAt < NEAR_WINDOW) {
        g.bonusIn = 0.65; // the promo's +250 lands a beat into the slow-motion
        g.slowLeft = SLOW_TIME;
        g.nearLeft = 1.5;
        g.events.push({ kind: 'near' });
      }
    }
  }
  for (const hz of g.course.hazards) if (hz.entered && hz.x + hz.hw + PLAYER.hw < g.dist) hz.cleared = true;
  for (const c of g.course.coins) {
    if (c.taken || Math.abs(c.x - g.dist) > PLAYER.hw + 14 || c.y < g.h - 12 || c.y > top + 12) continue;
    c.taken = true;
    g.coins += 1;
    g.score += 10;
    g.events.push({ kind: 'coin', x: c.x, y: c.y });
  }
  const tier = tierOf(g.mult);
  if (tier > g.tier) Object.assign(g, { tier, tierLeft: 1.6 });
}

export function step(g, wallDt) {
  if (g.status !== 'running') return;
  const dt = Math.min(wallDt, 1); // a stalled frame catches up (substeps), so the run keeps to the clock
  g.slowLeft = Math.max(0, g.slowLeft - dt);
  g.nearLeft = Math.max(0, g.nearLeft - dt);
  g.tierLeft = Math.max(0, g.tierLeft - dt);
  if (g.bonusIn > 0 && (g.bonusIn -= dt) <= 0) g.score += NEAR_BONUS;
  let left = dt * timeScale(g);
  while (left > 0 && g.status === 'running') {
    tick(g, Math.min(STEP, left));
    left -= STEP;
  }
  extendCourse(g.course, g.dist, RUN_SPEED * g.mult);
  const behind = g.dist - 800;
  g.course.hazards = g.course.hazards.filter((h) => h.x > behind);
  g.course.coins = g.course.coins.filter((c) => c.x > behind && !c.taken);
}
\`\`\`

## src/components/meadow-run/meadow-run.css
\`\`\`css
@font-face{font-family:"Newsreader";font-weight:300 600;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/newsreader-variable-normal.woff2) format("woff2")}
@font-face{font-family:"Figtree";font-weight:300 700;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/figtree-variable-normal.woff2) format("woff2")}
@font-face{font-family:"Instrument Sans";font-weight:400 700;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-sans-variable-normal.woff2) format("woff2")}

/* The look: UI tint, accent, sky, foliage and tee (--swatch-N), then the rest of the painted scene. */
:root{
  --swatch-1:#DBE7F6;--swatch-1-ink:#111111;
  --swatch-2:#4F86E3;--swatch-2-ink:#111111;
  --swatch-3:#8ABCEA;--swatch-3-ink:#111111;
  --swatch-4:#4E9A35;--swatch-4-ink:#111111;
  --swatch-5:#FC8F7C;--swatch-5-ink:#111111;
  --ui-sky-1:#6BAAE5;--ui-sky-2:#A9CDE6;--ui-haze:#8F89F9;
  --ui-leaf-1:#8CC63F;--ui-leaf-3:#2A4F22;--ui-trunk:#3E4A36;--ui-far:#6E8F6A;
  --ui-grass-1:#B9CFA6;--ui-grass-2:#9DBE80;--ui-grass-3:#5D8B45;
  --ui-tuft-1:#F2B8C6;--ui-tuft-2:#F5C9A0;--ui-tuft-3:#C9B5E8;
  --ui-hair:#FDEFDC;--ui-boot:#F8DC88;--ui-hem:#C8E66A;
  --ui-skin:#F4B8A8;--ui-skin-2:#F9D3C4;--ui-lash:#3B2A2A;--ui-blush:#F28C8C;--ui-lip:#9BD447;
  --ui-coin:#F7B6CF;--ui-cream:#FFF3E6;
  --ui-puff:#FFFFFF;--ui-puff-core:#F4A6C0;--ui-stem:#4E8A3A;--ui-berry:#E0352B;--ui-floret:#9CC3EE;--ui-allium:#F2A9CF;
  --ui-pom-orange:#F58A2A;--ui-pom-ink:#1C1420;--ui-pom-fringe:#E77FC0;--ui-pom-blue:#6E92E6;--ui-pom-moss:#6E8A2E;--ui-pom-star:#E8E36A;
  --ui-ink:#262626;--ui-muted:#6E6E6E;--ui-track:#EFEFEF;--ui-button:#0D0D0D;--ui-on-button:#FFFFFF;--ui-card:#FFFFFF;--ui-shade:#0D0D0D;
}
/* gallery-look */

.mr{font-family:"Figtree","Instrument Sans",system-ui,-apple-system,sans-serif;color:var(--ui-ink);background:var(--ui-sky-1);-webkit-font-smoothing:antialiased;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.mr-serif{font-family:"Newsreader",Georgia,serif;font-variant-numeric:tabular-nums lining-nums}
.mr-card{background:color-mix(in srgb,var(--ui-card) 94%,transparent);box-shadow:0 6px 24px color-mix(in srgb,var(--ui-shade) 9%,transparent),0 1px 3px color-mix(in srgb,var(--ui-shade) 6%,transparent);backdrop-filter:blur(6px)}
.mr-tint{background:color-mix(in srgb,var(--swatch-1) 92%,transparent);box-shadow:0 8px 28px color-mix(in srgb,var(--ui-shade) 12%,transparent)}
/* Grainy orbs: white speckle over the soft colour, fading out at the rim. */
.mr-orb{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.6 -0.7'/%3E%3C/filter%3E%3Crect width='48' height='48' filter='url(%23n)'/%3E%3C/svg%3E"),radial-gradient(circle at 50% 50%,color-mix(in srgb,var(--swatch-2) 70%,var(--ui-card)) 0%,var(--swatch-2) 45%,color-mix(in srgb,var(--swatch-2) 0%,transparent) 72%);-webkit-mask-image:radial-gradient(circle,black 40%,transparent 70%);mask-image:radial-gradient(circle,black 40%,transparent 70%)}
.mr-coin{background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1.6 -0.7'/%3E%3C/filter%3E%3Crect width='48' height='48' filter='url(%23n)'/%3E%3C/svg%3E"),radial-gradient(circle at 45% 40%,color-mix(in srgb,var(--ui-coin) 50%,var(--ui-card)) 0%,var(--ui-coin) 55%,color-mix(in srgb,var(--ui-coin) 0%,transparent) 78%);-webkit-mask-image:radial-gradient(circle,black 50%,transparent 72%);mask-image:radial-gradient(circle,black 50%,transparent 72%)}
.mr-kbd{background:var(--ui-track);color:var(--ui-ink)}
.mr-pill{transition:transform .38s cubic-bezier(.3,.8,.3,1),width .38s cubic-bezier(.3,.8,.3,1)}
.mr-pause{background:var(--ui-button);color:var(--ui-on-button)}
.mr-pause:active,.mr-touch:active{transform:scale(.97)}
.mr-touch{background:var(--ui-button);color:var(--ui-on-button);box-shadow:0 8px 24px color-mix(in srgb,var(--ui-shade) 18%,transparent)}
.mr canvas{display:block;width:100%;height:100%}
\`\`\`

## src/components/meadow-run/MobileHud.jsx
\`\`\`jsx
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TIERS } from './engine';
import { CoinOrb, NearMissCard, PauseButton, TierToast, fmt } from './Cards';

// Acts on touch-down (no click delay); a keyboard or programmatic click (detail 0) still works.
function TouchPill({ label, Icon, onPress }) {
  return (
    <button
      type="button"
      onPointerDown={(e) => (e.preventDefault(), onPress())}
      onClick={(e) => e.detail === 0 && onPress()}
      className="mr-touch pointer-events-auto flex h-16 flex-1 items-center justify-center gap-2.5 rounded-full text-[18px] font-semibold"
    >
      <Icon size={24} strokeWidth={2.6} />
      {label}
    </button>
  );
}

export function TouchControls({ onJump, onSlide, className }) {
  return (
    <div className={\`absolute bottom-[max(34px,env(safe-area-inset-bottom))] flex gap-3 \${className}\`}>
      <TouchPill label="Jump" Icon={ChevronUp} onPress={onJump} />
      <TouchPill label="Slide" Icon={ChevronDown} onPress={onSlide} />
    </div>
  );
}

// One centred column (at most 520px) so a portrait tablet keeps the phone's proportions; the tier pill,
// its toast and the near-miss card stack, so they never overlap.
export default function MobileHud({ hud, onPause, onJump, onSlide }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 left-1/2 w-full max-w-[520px] -translate-x-1/2">
      <div className="absolute inset-x-4 top-[54px] flex items-center gap-3">
        <div className="mr-card flex h-[76px] flex-1 items-start justify-between rounded-[24px] px-5 pt-[13px]">
          <div>
            <div className="text-[10.5px] font-medium tracking-[0.06em] text-[var(--ui-muted)]">SCORE</div>
            <div className="mr-serif -mt-[1px] text-[31px] leading-[1.1]">{fmt(hud.score)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-[11.5px] text-[var(--ui-muted)]">Best {fmt(hud.best)}</div>
            <div className="mt-[7px] flex items-center gap-2">
              <CoinOrb size={24} />
              <span className="mr-serif text-[22px] leading-none">{hud.coins}</span>
            </div>
          </div>
        </div>
        <PauseButton paused={hud.status === 'paused'} onClick={onPause} size={48} />
      </div>
      <div className="absolute inset-x-0 top-[140px] flex flex-col items-center gap-[10px]">
        <div className="mr-card flex h-9 items-center gap-2 rounded-full px-[14px]">
          <span className="h-3 w-3 rounded-full bg-[var(--swatch-2)]" aria-hidden />
          <span className="text-[14px] font-semibold">{TIERS[hud.tier]}</span>
          <span className="mr-serif text-[15px] text-[var(--ui-muted)]">×{hud.mult}</span>
        </div>
        <AnimatePresence>{hud.tierCard !== null && <TierToast key={hud.tierCard} tier={hud.tierCard} compact />}</AnimatePresence>
        <div className="w-full px-[45px]">
          <AnimatePresence>{hud.near && <NearMissCard key="near" compact />}</AnimatePresence>
        </div>
      </div>
      <TouchControls onJump={onJump} onSlide={onSlide} className="inset-x-4" />
    </div>
  );
}
\`\`\`

## src/components/meadow-run/Overlay.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { CoinOrb, fmt } from './Cards';

const Stat = ({ label, children }) => (
  <div className="flex-1 rounded-[14px] bg-[var(--ui-track)] px-3 py-2.5">
    <div className="text-[11px] text-[var(--ui-muted)]">{label}</div>
    <div className="mr-serif mt-0.5 flex items-center gap-1.5 text-[22px] leading-tight">{children}</div>
  </div>
);

// The end of a run, and the paused card. Space or Enter also runs again.
// It sits in the band between the top HUD and the bottom controls, so it never covers them.
export default function Overlay({ hud, mobile, onRestart, onResume }) {
  const over = hud.status === 'over';
  const open = over || hud.status === 'paused';
  const record = over && hud.record;
  return (
    <AnimatePresence>
      {open && (
        // Gone at once on Run again / Resume: a fading card over the live run would still take its taps.
        <motion.div key={hud.status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 0.1 } }} className={\`absolute inset-x-0 flex items-center justify-center px-4 \${mobile ? 'bottom-[110px] top-[190px]' : 'bottom-[90px] top-[140px]'}\`}>
          <motion.div initial={{ y: 12, scale: 0.97 }} animate={{ y: 0, scale: 1 }} className="mr-card w-full max-w-[340px] rounded-[26px] px-6 py-5 text-center">
            <div className="mr-serif text-[31px] leading-tight">{over ? (record ? 'New best' : 'Run over') : 'Paused'}</div>
            <div className="mt-1 text-[13px] text-[var(--ui-muted)]">{over ? 'Bumped into the meadow. Catch your breath.' : 'The meadow waits for you.'}</div>
            {over && (
              <div className="mt-4 flex gap-2 text-left">
                <Stat label="Score">{fmt(hud.score)}</Stat>
                <Stat label="Best">{fmt(hud.best)}</Stat>
                <Stat label="Coins"><CoinOrb size={18} />{hud.coins}</Stat>
              </div>
            )}
            <button type="button" onClick={over ? onRestart : onResume} className="mr-touch mt-5 h-14 w-full rounded-full text-[16px] font-semibold">
              {over ? 'Run again' : 'Resume'}
            </button>
            <div className="mt-3 text-[11.5px] text-[var(--ui-muted)]">{over ? 'or press Space' : 'or press P'}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## src/components/meadow-run/paint/backdrop.js
\`\`\`js
import { alpha, makeCanvas, mix, mulberry32 } from './color';
import { feltCurls, fuzzBall, grain } from './fuzz';

// The painted garden, in chunks of CHUNK backdrop units (it scrolls at 0.2× the run), each painted
// once per look. Every tree is seeded by its own index, so one spanning two chunks paints the same in both.
export const CHUNK = 1024;
export const TOP = -260;
const BOTTOM = 600;
const HORIZON = 548;

// \`shift\` places the first element; \`jitter\` (share of the spacing) scatters the rest.
const layer = (seed, spacing, reach, paint, shift = 0, jitter = 0.5) => ({ seed, spacing, reach, paint, shift, jitter });

// The promo's garden for the first stretch (backdrop units = 1280×720 pixels at the start): the trees of
// its first frame, then the great stacked topiary she passes under the near miss.
const OPENING = [
  [90, 450, 160, 110, false], [250, 335, 140, 100, false], [175, 110, 175, 120, true],
  [1000, 400, 100, 100, true], [870, 270, 125, 125, true], [720, 330, 120, 110, false], [550, 165, 195, 140, true],
];
const OPENING_END = 1150;
const CAKE = { x: 1860, from: 1300, to: 2450 };

const LAYERS = [
  layer(11, 1400, 300, (ctx, rng, x, p) => {
    const rx = 150 + rng() * 90;
    ctx.save();
    ctx.translate(x, 480);
    ctx.scale(1, 0.55);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, alpha(p.haze, 0.95));
    g.addColorStop(0.55, alpha(p.haze, 0.55));
    g.addColorStop(1, alpha(p.haze, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }, 600, 0),
  layer(23, 1500, 340, (ctx, rng, x, p) => {
    for (let i = 0; i < 90; i++) {
      const lx = x - 170 + rng() * 340;
      const top = 60 + rng() * 140;
      const g = ctx.createLinearGradient(0, top, 0, HORIZON);
      g.addColorStop(0, alpha(p.white, 0));
      g.addColorStop(0.5, alpha(p.white, 0.1 + rng() * 0.16));
      g.addColorStop(0.85, alpha(p.white, 0.12));
      g.addColorStop(1, alpha(p.white, 0));
      ctx.fillStyle = g;
      ctx.fillRect(lx, top, 1 + rng() * 2.5, HORIZON - top);
    }
  }, 1190, 0),
  layer(37, 26, 60, (ctx, rng, x, p) => {
    const top = 330 + rng() * 90;
    ctx.globalAlpha = 0.55;
    if (rng() < 0.5) fuzzBall(ctx, rng, { x: x + 1, y: top, rx: 30 + rng() * 26, ry: 26 + rng() * 16, color: mix(p.far, p.sky2, 0.35), light: mix(p.far, p.sky2, 0.6), dark: mix(p.far, p.sky2, 0.15), density: 0.5, reach: 0.2, width: 1 });
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = mix(p.trunk, p.sky2, 0.4);
    ctx.fillRect(x, top + 10, 1.5 + rng() * 2.5, HORIZON - top - 10);
    ctx.globalAlpha = 1;
  }),
  layer(41, 170, 150, (ctx, rng, x, p) => {
    const cy = 330 + rng() * 70;
    ctx.fillStyle = mix(p.trunk, p.sky2, 0.3);
    ctx.fillRect(x - 3, cy, 5 + rng() * 3, HORIZON - cy);
    const leaf = mix(p.leaf, p.sky2, 0.2);
    const rx = 50 + rng() * 34;
    fuzzBall(ctx, rng, { x, y: cy, rx, ry: rx * 0.8, color: leaf, light: mix(p.leaf, p.leaf1, 0.4), dark: mix(p.leaf3, p.sky2, 0.15), density: 0.8, reach: 0.14 });
    feltCurls(ctx, rng, { x, y: cy, rx, ry: rx * 0.8, light: mix(p.leaf1, p.sky2, 0.3), dark: mix(p.leaf3, p.sky2, 0.3), size: 4, density: 0.7 });
  }),
  layer(53, 215, 320, (ctx, rng, x, p) => {
    if (x < OPENING_END || (x > CAKE.from && x < CAKE.to)) return;
    const kind = rng();
    if (kind < 0.2) return cake(ctx, rng, x, p);
    if (kind < 0.4) return canopy(ctx, rng, x, 440 + rng() * 40, 150 + rng() * 60, 110 + rng() * 30, p);
    const rx = 150 + rng() * 80;
    const ry = rx * (0.74 + rng() * 0.12);
    const cy = 110 + rng() * 170;
    trunk(ctx, rng, x, cy + ry * 0.45, 14 + rng() * 8, p);
    canopy(ctx, rng, x, cy, rx, ry, p);
  }),
  layer(59, 1e6, 2600, (ctx, rng, x, p) => {
    if (x !== 0) return;
    for (const [cx, cy, rx, ry, tall] of OPENING) {
      if (tall) trunk(ctx, rng, cx, cy + ry * 0.45, 16, p);
      canopy(ctx, rng, cx, cy, rx, ry, p);
    }
    cake(ctx, rng, CAKE.x, p, 420);
  }, 0, 0),
];

function trunk(ctx, rng, x, top, w, p) {
  ctx.fillStyle = p.trunk;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, HORIZON);
  ctx.lineTo(x - w * 0.3, top + 40);
  ctx.lineTo(x - w * 1.6, top);
  ctx.lineTo(x - w * 1.2, top - 4);
  ctx.lineTo(x, top + 28);
  ctx.lineTo(x + w * 1.4, top - 6);
  ctx.lineTo(x + w * 1.7, top);
  ctx.lineTo(x + w * 0.3, top + 40);
  ctx.lineTo(x + w / 2, HORIZON);
  ctx.fill();
}

// A felted canopy: a glowing rim (shadow blur, so the edge is soft), a top-lit body, dense curls.
function canopy(ctx, rng, x, y, rx, ry, p) {
  ctx.save();
  ctx.shadowColor = alpha(p.leaf1, 0.9);
  ctx.shadowBlur = 10;
  ctx.fillStyle = mix(p.leaf, p.leaf1, 0.4);
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.97, ry * 0.97, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  const body = ctx.createRadialGradient(x - rx * 0.1, y - ry * 0.75, ry * 0.2, x, y - ry * 0.2, ry * 1.5);
  body.addColorStop(0, mix(p.leaf, p.leaf1, 0.2));
  body.addColorStop(0.4, mix(p.leaf, p.leaf3, 0.45));
  body.addColorStop(1, mix(p.leaf, p.leaf3, 0.85));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.95, ry * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  fuzzBall(ctx, rng, { x, y, rx: rx * 0.98, ry: ry * 0.98, color: p.leaf, light: p.leaf1, dark: mix(p.leaf, p.leaf3, 0.4), density: 2.6, reach: 0.07, width: 1, core: false, opacity: 0.5, from: 0.9 });
  feltCurls(ctx, rng, { x, y, rx, ry, light: mix(p.leaf, p.leaf1, 0.6), dark: p.leaf3, size: 5, density: 4 });
}

// A stacked topiary: three tiers of wide felt ovals on two trunks.
function cake(ctx, rng, x, p, w = 200 + rng() * 60) {
  trunk(ctx, rng, x - w * 0.42, -10, 10, p);
  trunk(ctx, rng, x + w * 0.42, -10, 10, p);
  canopy(ctx, rng, x - w * 0.42, 40, w * 0.5, w * 0.2, p);
  canopy(ctx, rng, x + w * 0.42, 40, w * 0.5, w * 0.2, p);
  canopy(ctx, rng, x - w * 0.45, 210, w * 0.55, w * 0.29, p);
  canopy(ctx, rng, x + w * 0.45, 210, w * 0.55, w * 0.29, p);
  canopy(ctx, rng, x - w * 0.62, 440, w * 0.6, w * 0.26, p);
  canopy(ctx, rng, x + w * 0.62, 440, w * 0.6, w * 0.26, p);
  canopy(ctx, rng, x, 340, w * 0.7, w * 0.33, p);
}

export function paintBackdropChunk(index, p, scale) {
  const x0 = index * CHUNK;
  const canvas = makeCanvas(CHUNK * scale, (BOTTOM - TOP) * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.translate(-x0, -TOP);
  const sky = ctx.createLinearGradient(0, TOP, 0, BOTTOM);
  sky.addColorStop(0, p.sky1);
  sky.addColorStop(0.55, p.sky);
  sky.addColorStop(0.92, p.sky2);
  ctx.fillStyle = sky;
  ctx.fillRect(x0, TOP, CHUNK, BOTTOM - TOP);
  for (const { seed, spacing, reach, paint, shift, jitter } of LAYERS) {
    const first = Math.floor((x0 - reach - shift) / spacing);
    const last = Math.ceil((x0 + CHUNK + reach - shift) / spacing);
    for (let i = first; i <= last; i++) {
      const rng = mulberry32(seed * 100003 + i * 7919);
      paint(ctx, rng, i * spacing + shift + (rng() - 0.5) * spacing * jitter, p);
    }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  grain(ctx, mulberry32(index + 5), canvas.width, canvas.height, 0.05);
  return canvas;
}
\`\`\`

## src/components/meadow-run/paint/color.js
\`\`\`js
// The canvas paints with the look's CSS variables, read once per look.
const VARS = {
  sky1: '--ui-sky-1', sky: '--swatch-3', sky2: '--ui-sky-2', haze: '--ui-haze',
  leaf1: '--ui-leaf-1', leaf: '--swatch-4', leaf3: '--ui-leaf-3', trunk: '--ui-trunk', far: '--ui-far',
  grass1: '--ui-grass-1', grass2: '--ui-grass-2', grass3: '--ui-grass-3',
  tuft1: '--ui-tuft-1', tuft2: '--ui-tuft-2', tuft3: '--ui-tuft-3',
  hair: '--ui-hair', tee: '--swatch-5', hem: '--ui-hem', boot: '--ui-boot',
  skin: '--ui-skin', skin2: '--ui-skin-2', lash: '--ui-lash', blush: '--ui-blush', lip: '--ui-lip',
  coin: '--ui-coin', cream: '--ui-cream', white: '--ui-card', ink: '--ui-ink', shade: '--ui-shade',
  puff: '--ui-puff', puffCore: '--ui-puff-core', stem: '--ui-stem', berry: '--ui-berry', floret: '--ui-floret', allium: '--ui-allium',
  pomOrange: '--ui-pom-orange', pomInk: '--ui-pom-ink', pomFringe: '--ui-pom-fringe', pomBlue: '--ui-pom-blue', pomMoss: '--ui-pom-moss', pomStar: '--ui-pom-star',
};

export function readPalette() {
  const style = getComputedStyle(document.documentElement);
  const palette = {};
  for (const [key, name] of Object.entries(VARS)) palette[key] = style.getPropertyValue(name).trim() || '#808080';
  palette.key = Object.values(palette).join();
  return palette;
}

const rgb = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

export const mix = (a, b, t) => {
  const [x, y] = [rgb(a), rgb(b)];
  return \`#\${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}\`;
};

export const alpha = (hex, a) => \`rgba(\${rgb(hex).join(',')},\${a})\`;

export function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const makeCanvas = (w, h) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(w));
  canvas.height = Math.max(1, Math.ceil(h));
  return canvas;
};
\`\`\`

## src/components/meadow-run/paint/fuzz.js
\`\`\`js
import { alpha, mix } from './color';

function paintCore(ctx, x, y, rx, ry, color, light, dark) {
  const core = ctx.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 0, x, y, Math.max(rx, ry) * 1.05);
  core.addColorStop(0, light);
  core.addColorStop(0.5, color);
  core.addColorStop(1, dark);
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.93, ry * 0.93, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Felted shapes: a soft shaded core, then fine strands breaking the edge — never an outline.
export function fuzzBall(ctx, rng, { x, y, rx, ry = rx, color, light, dark, density = 1, reach = 0.22, width = 1.2, core: solid = true, opacity = 1, from = 0.7 }) {
  if (solid) paintCore(ctx, x, y, rx, ry, color, light, dark);
  ctx.lineCap = 'round';
  const strands = Math.round((rx + ry) * 4 * density);
  for (let i = 0; i < strands; i++) {
    const a = rng() * Math.PI * 2;
    const r0 = from + rng() * (0.95 - from + 0.05);
    const len = (0.4 + rng()) * reach;
    const lift = (1 - Math.sin(a)) / 2; // the top catches the light
    ctx.strokeStyle = mix(dark, light, Math.min(1, lift * 0.9 + rng() * 0.35));
    ctx.globalAlpha = (0.35 + rng() * 0.45) * opacity;
    ctx.lineWidth = width * (0.6 + rng() * 0.8);
    const bend = (rng() - 0.5) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * rx * r0, y + Math.sin(a) * ry * r0);
    ctx.lineTo(x + Math.cos(a + bend * len) * rx * (r0 + len), y + Math.sin(a + bend * len) * ry * (r0 + len));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// The felt's curly texture inside a canopy: small light and dark loops.
export function feltCurls(ctx, rng, { x, y, rx, ry, light, dark, size = 5, density = 1 }) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 0.95, ry * 0.95, 0, 0, Math.PI * 2);
  ctx.clip();
  const n = Math.round(((rx * ry) / (size * size * 5)) * density);
  ctx.lineWidth = Math.max(0.8, size * 0.28);
  for (let i = 0; i < n; i++) {
    const px = x + (rng() * 2 - 1) * rx;
    const py = y + (rng() * 2 - 1) * ry;
    const shade = (py - (y - ry)) / (2 * ry);
    ctx.strokeStyle = rng() < 0.55 - shade * 0.3 ? light : dark;
    ctx.globalAlpha = 0.1 + rng() * 0.2;
    const r = size * (0.5 + rng() * 0.8);
    const a = rng() * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(px, py, r, a, a + 2.4 + rng() * 2.4);
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

// Spiky fibre pom (the floating hazards): fibres radiating from the core.
export function fibrePom(ctx, rng, { x, y, r, core, tip, inner, fibres = 260, width = 1.6 }) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, r);
  glow.addColorStop(0, inner ?? core);
  glow.addColorStop(0.55, core);
  glow.addColorStop(1, alpha(core, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineCap = 'round';
  for (let i = 0; i < fibres; i++) {
    const a = rng() * Math.PI * 2;
    const len = r * (0.55 + rng() * 0.45);
    const from = r * rng() * 0.2;
    const g = ctx.createLinearGradient(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len);
    g.addColorStop(0, core);
    g.addColorStop(1, tip);
    ctx.strokeStyle = g;
    ctx.globalAlpha = 0.5 + rng() * 0.5;
    ctx.lineWidth = width * (0.5 + rng());
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * from, y + Math.sin(a) * from);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// Fine grain over a finished sprite, so nothing reads as a flat vector fill.
export function grain(ctx, rng, w, h, amount = 0.06) {
  const n = Math.round((w * h) / 30);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = rng() < 0.5 ? \`rgba(255,255,255,\${amount})\` : \`rgba(0,0,0,\${amount})\`;
    ctx.fillRect(rng() * w, rng() * h, 1, 1);
  }
}
\`\`\`

## src/components/meadow-run/paint/fx.js
\`\`\`js
import { alpha, mulberry32 } from './color';

// Visual-only effects in world units (x along the course, y above the ground), aged in game time
// so they slow down with the near-miss beat.
export const createFx = () => ({ bursts: [], texts: [], dust: [], streaks: [], rng: mulberry32(9), dustIn: 0, streakIn: 0 });

export function updateFx(fx, g, dt, sliding) {
  const { rng } = fx;
  for (const e of g.events) {
    if (e.kind !== 'coin') continue;
    for (let i = 0; i < 14; i++) {
      const a = rng() * Math.PI * 2;
      const s = 60 + rng() * 160;
      fx.bursts.push({ x: e.x, y: e.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, age: 0, life: 0.45 + rng() * 0.3, cream: rng() < 0.4, r: 1.5 + rng() * 2.5 });
    }
    fx.bursts.push({ x: e.x, y: e.y, vx: 0, vy: 0, age: 0, life: 0.35, glow: true, r: 26 });
    fx.texts.push({ dx: 10 + (fx.texts.length % 2) * 22, y: g.h + 215 + (fx.texts.length % 2) * 16, age: 0 });
  }
  const age = (list, life) => list.filter((p) => (p.age += dt) < (p.life ?? life));
  fx.bursts = age(fx.bursts);
  const drag = 0.96 ** (dt * 60); // per 60 Hz frame of game time, so bursts spread alike at any refresh rate
  for (const p of fx.bursts) Object.assign(p, { x: p.x + p.vx * dt, y: p.y + p.vy * dt, vx: p.vx * drag, vy: p.vy * drag });
  fx.texts = age(fx.texts, 0.7);
  for (const t of fx.texts) t.y += 70 * dt;
  fx.dustIn -= dt;
  if (sliding && fx.dustIn <= 0) {
    fx.dust.push({ x: g.dist - 10, y: 14, age: 0, r: 9 + rng() * 5 });
    fx.dustIn = 0.05;
  }
  fx.dust = age(fx.dust, 0.5);
  fx.streakIn -= dt;
  const fast = Math.min(1, Math.max(0, (g.mult - 1.12) / 0.4));
  if (fast > 0 && fx.streakIn <= 0) {
    fx.streaks.push({ x: g.dist + 900 + rng() * 600, y: 120 + rng() * 520, len: 90 + rng() * 160, age: 0, a: fast });
    fx.streakIn = 0.12 / fast;
  }
  fx.streaks = age(fx.streaks, 0.9);
  for (const s of fx.streaks) s.x -= 900 * dt;
}

// \`at(x, y)\` maps world units to the screen; \`k\` is the scale.
export function drawFx(ctx, fx, p, at, k, dist) {
  for (const s of fx.streaks) {
    const [x, y] = at(s.x, s.y, dist);
    ctx.strokeStyle = alpha(p.white, 0.45 * s.a * Math.sin((s.age / 0.9) * Math.PI));
    ctx.lineWidth = 1.5 * k;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + s.len * k, y);
    ctx.stroke();
  }
  for (const d of fx.dust) {
    const [x, y] = at(d.x - d.age * 260, d.y, dist);
    ctx.fillStyle = alpha(p.white, 0.55 * (1 - d.age / 0.5));
    ctx.beginPath();
    ctx.arc(x, y, (d.r + d.age * 18) * k, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const b of fx.bursts) {
    const [x, y] = at(b.x, b.y, dist);
    const fade = 1 - b.age / b.life;
    if (b.glow) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, b.r * k * (1 + b.age * 2));
      g.addColorStop(0, alpha(p.coin, 0.6 * fade));
      g.addColorStop(1, alpha(p.coin, 0));
      ctx.fillStyle = g;
      ctx.fillRect(x - 80 * k, y - 80 * k, 160 * k, 160 * k);
      continue;
    }
    ctx.fillStyle = alpha(b.cream ? p.cream : p.coin, fade);
    ctx.fillRect(x, y, b.r * k, b.r * k);
  }
  ctx.font = \`400 \${Math.round(24 * k)}px Newsreader, Georgia, serif\`;
  ctx.textAlign = 'center';
  for (const t of fx.texts) {
    const [x, y] = at(dist + t.dx, t.y, dist);
    ctx.fillStyle = alpha(p.white, 0.9 * (1 - t.age / 0.7));
    ctx.fillText('+10', x, y);
  }
}

// The near-miss beat: white speed lines fanning out from her and a soft dark vignette.
export function drawNearMiss(ctx, amount, cx, cy, W, H, k, p) {
  if (amount <= 0) return;
  const rng = mulberry32(31);
  ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const a = rng() * Math.PI * 2;
    const r0 = (150 + rng() * 120) * k;
    const len = (120 + rng() * 260) * k;
    ctx.strokeStyle = alpha(p.white, (0.35 + rng() * 0.35) * amount);
    ctx.lineWidth = (2 + rng() * 2.5) * k;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
    ctx.lineTo(cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len));
    ctx.stroke();
  }
  const v = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.35, cx, cy, Math.max(W, H) * 0.75);
  v.addColorStop(0, alpha(p.shade, 0));
  v.addColorStop(1, alpha(p.shade, 0.32 * amount));
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, H);
}
\`\`\`

## src/components/meadow-run/paint/grass.js
\`\`\`js
import { alpha, makeCanvas, mix, mulberry32 } from './color';
import { grain } from './fuzz';

// The meadow: repeating strips of fine blades, painted once per look. FAR scrolls at 0.6×, NEAR at 1×,
// FRONT (a few tall blades over her boots) at 1.15×.
export const TILE = 1600;
const wave = (x, a, b) => Math.sin((x / TILE) * Math.PI * 2 * a) * b;
export const meadowTop = (x) => 556 + wave(x, 3, 9) + wave(x + 300, 7, 4);

function blades(ctx, rng, { n, x0 = 0, top, bottom, len, colors, tufts, lean = 0.25, width = 1.3, tuftChance = 0.04 }) {
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = x0 + rng() * TILE;
    const base = top(x) + rng() * (bottom - top(x));
    const depth = (base - top(x)) / Math.max(1, bottom - top(x));
    const l = len * (0.5 + rng() * 0.8) * (0.7 + depth * 0.5);
    const tuft = tufts && rng() < tuftChance;
    const c = tuft ? tufts[Math.floor(rng() * tufts.length)] : colors[Math.floor(rng() * colors.length)];
    ctx.strokeStyle = c;
    ctx.globalAlpha = 0.55 + rng() * 0.45;
    ctx.lineWidth = width * (0.6 + rng() * 0.8);
    const dx = (rng() - 0.5) * l * lean * 2;
    for (const off of [0, -TILE, TILE]) {
      ctx.beginPath();
      ctx.moveTo(x + off, base);
      ctx.quadraticCurveTo(x + off + dx * 0.3, base - l * 0.6, x + off + dx, base - l);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

function strip(scale, y0, y1, paint) {
  const canvas = makeCanvas(TILE * scale, (y1 - y0) * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.translate(0, -y0);
  paint(ctx);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { canvas, y0, y1 };
}

export function paintMeadow(p, scale) {
  const rng = mulberry32(77);
  const tufts = [p.tuft1, p.tuft2, p.tuft3];
  const hazy = (c) => mix(c, p.sky2, 0.35);
  const farTop = (x) => 520 + wave(x, 2, 10) + wave(x + 500, 5, 5);
  const far = strip(scale, 470, 600, (ctx) => {
    ctx.fillStyle = hazy(p.grass1);
    ctx.beginPath();
    ctx.moveTo(0, 600);
    for (let x = 0; x <= TILE; x += 20) ctx.lineTo(x, farTop(x) + 6);
    ctx.lineTo(TILE, 600);
    ctx.fill();
    // Small pale ponds in the far meadow, as in the promo.
    ctx.fillStyle = alpha(mix(p.floret, p.sky, 0.4), 0.8);
    for (const x of [260, 870, 1330]) {
      ctx.beginPath();
      ctx.ellipse(x, farTop(x) + 16, 34, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    blades(ctx, rng, { n: 5200, top: farTop, bottom: 600, len: 20, colors: [hazy(p.grass1), hazy(p.grass2), p.white], tufts: tufts.map(hazy), width: 1 });
  });
  const nearBottom = 760;
  const near = strip(scale, 520, nearBottom, (ctx) => {
    const g = ctx.createLinearGradient(0, 560, 0, nearBottom);
    g.addColorStop(0, p.grass1);
    g.addColorStop(0.45, mix(p.grass1, p.grass2, 0.5));
    g.addColorStop(0.7, p.grass2);
    g.addColorStop(0.8, p.grass3);
    g.addColorStop(1, mix(p.grass3, p.shade, 0.1));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, nearBottom);
    for (let x = 0; x <= TILE; x += 20) ctx.lineTo(x, meadowTop(x) + 8);
    ctx.lineTo(TILE, nearBottom);
    ctx.fill();
    const light = [p.grass1, mix(p.grass1, p.white, 0.2), p.grass2, p.grass2, mix(p.grass2, p.grass3, 0.5)];
    blades(ctx, rng, { n: 11000, top: meadowTop, bottom: 700, len: 30, colors: light, tufts, tuftChance: 0.08, width: 1.1 });
    blades(ctx, rng, { n: 3500, top: () => 680, bottom: nearBottom, len: 30, colors: [p.grass2, p.grass3, mix(p.grass3, p.shade, 0.12)], tufts, tuftChance: 0.04, width: 1.4 });
  });
  const front = strip(scale, 640, 760, (ctx) => {
    blades(ctx, rng, { n: 500, top: () => 715, bottom: 760, len: 40, colors: [p.grass2, p.grass3], tufts, tuftChance: 0.08, width: 1.4 });
  });
  for (const s of [far, near]) grain(s.canvas.getContext('2d'), rng, s.canvas.width, s.canvas.height, 0.05);
  return { far, near, front, shadow: alpha(p.grass3, 0.45) };
}
\`\`\`

## src/components/meadow-run/paint/runner.js
\`\`\`js
import { alpha, makeCanvas, mix, mulberry32 } from './color';
import { fuzzBall, grain } from './fuzz';

// The runner, facing right, feet at the origin (y up is negative). Hair and boots are felt sprites;
// the body is posed each frame. Only the body bends: the head and face keep their shape in every pose.
export function paintRunnerParts(p, scale) {
  const part = (w, h, paint) => {
    const canvas = makeCanvas(w * scale, h * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);
    ctx.translate(w / 2, h / 2);
    paint(ctx, mulberry32(w + h * 3));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    grain(ctx, mulberry32(w), canvas.width, canvas.height, 0.04);
    return { canvas, w, h };
  };
  return {
    hair: part(160, 130, (ctx, rng) => {
      const light = mix(p.hair, p.white, 0.35);
      const dark = mix(p.hair, p.skin, 0.35);
      // A felt dome with a flat fringe, wispy on top.
      fuzzBall(ctx, rng, { x: 0, y: -2, rx: 45, ry: 35, color: p.hair, light, dark, density: 2.6, reach: 0.22, width: 0.9 });
      fuzzBall(ctx, rng, { x: 0, y: 20, rx: 50, ry: 13, color: p.hair, light, dark, density: 1.4, reach: 0.22, width: 1 });
    }),
    boot: part(60, 60, (ctx, rng) => {
      fuzzBall(ctx, rng, { x: 0, y: 0, rx: 19, color: p.boot, light: mix(p.boot, p.white, 0.5), dark: mix(p.boot, p.shade, 0.12), density: 2, reach: 0.45, width: 1 });
    }),
  };
}

const img = (ctx, part, x, y) => ctx.drawImage(part.canvas, x - part.w / 2, y - part.h / 2, part.w, part.h);

function limb(ctx, color, x0, y0, x1, y1, w) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function face(ctx, p) {
  const skin = ctx.createRadialGradient(0, -6, 4, 0, 0, 36);
  skin.addColorStop(0, mix(p.skin2, p.white, 0.2));
  skin.addColorStop(1, p.skin);
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = alpha(p.blush, 0.5);
  for (const x of [-14, 22]) {
    ctx.beginPath();
    ctx.ellipse(x, 15, 9, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = p.lash;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  for (const x of [-8, 14]) {
    ctx.beginPath();
    ctx.arc(x, 4, 6, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    for (const a of [0.3, 0.5, 0.7]) {
      const ang = a * Math.PI;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(ang) * 6, 4 + Math.sin(ang) * 6);
      ctx.lineTo(x + Math.cos(ang) * 9.5, 4 + Math.sin(ang) * 9.5);
      ctx.stroke();
    }
  }
  ctx.fillStyle = p.lip;
  ctx.beginPath();
  ctx.ellipse(5, 22, 3, 2.4, 0, 0, Math.PI * 2);
  ctx.fill();
}

function dress(ctx, p) {
  const g = ctx.createLinearGradient(-30, -110, 30, -50);
  g.addColorStop(0, mix(p.tee, p.white, 0.18));
  g.addColorStop(1, mix(p.tee, p.shade, 0.06));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-18, -110);
  ctx.quadraticCurveTo(0, -116, 20, -110);
  ctx.quadraticCurveTo(33, -82, 40, -48);
  ctx.quadraticCurveTo(0, -40, -38, -48);
  ctx.quadraticCurveTo(-30, -82, -18, -110);
  ctx.fill();
  ctx.strokeStyle = p.hem;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-37, -49);
  ctx.quadraticCurveTo(0, -41, 39, -49);
  ctx.stroke();
}

// pose: { phase, lift (feet above the ground, world units), scale (her size over the world's), air (0..1 tuck), slide (0..1 crouch), lean }
export function drawRunner(ctx, parts, p, pose) {
  const { phase, air, slide } = pose;
  const bob = (1 - air) * (1 - slide) * Math.abs(Math.sin(phase)) * -5;
  const stride = (1 - air) * (1 - slide);
  const swing = Math.sin(phase);
  const feet = [
    [swing * 16 * stride + air * -18 + slide * 30, -17 - Math.max(0, swing) * 10 * stride - air * 4 + slide * 2],
    [-swing * 16 * stride + air * 10 + slide * 52, -17 - Math.max(0, -swing) * 10 * stride - air * 14 + slide * 4],
  ];
  const drop = slide * 44;
  const hip = [slide * 6, -50 + drop + bob];
  ctx.save();
  ctx.fillStyle = alpha(p.shade, 0.18 * (1 - Math.min(1, pose.lift / 220)));
  ctx.beginPath();
  ctx.ellipse(8 + slide * 20, pose.lift / pose.scale, 44, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const [fx, fy] of feet) {
    limb(ctx, p.skin2, hip[0] + fx * 0.25, hip[1] + 4, fx, fy - 6, 9);
    img(ctx, parts.boot, fx, fy);
  }
  ctx.translate(hip[0], hip[1]);
  ctx.rotate(pose.lean + slide * 0.42);
  ctx.translate(0, 50);
  dress(ctx, p);
  ctx.save();
  ctx.translate(6, -136);
  ctx.rotate(-slide * 0.22);
  face(ctx, p);
  img(ctx, parts.hair, -2, -30);
  ctx.restore();
  const hand = air > 0.3 ? [20, -112] : [16 + swing * 10 * stride, -70 + slide * -8];
  limb(ctx, mix(p.tee, p.white, 0.2), 2, -100, 9, -90, 13);
  limb(ctx, p.skin2, 8, -93, hand[0], hand[1], 8);
  ctx.restore();
}
\`\`\`

## src/components/meadow-run/paint/scene.js
\`\`\`js
import { CHUNK, TOP, paintBackdropChunk } from './backdrop';
import { TILE, paintMeadow } from './grass';
import { drawSprite, paintSprites } from './sprites';
import { drawRunner, paintRunnerParts } from './runner';
import { drawFx, drawNearMiss } from './fx';
import { alpha } from './color';
import { POM_HEIGHT } from '../course';
import { isSliding, slowAmount } from '../engine';

const GROUND = 620; // the ground line, in the backdrop's and meadow's own units
const BACKDROP_PARALLAX = 0.2;
export const PAINT_AHEAD = 3; // chunks past the first on screen painted between frames

// Everything painted once per look and size; backdrop chunks are painted as the run reaches them.
export const assetKey = (p, k, dpr) => \`\${p.key}|\${k * Math.min(dpr, 2)}\`;

export function createAssets(p, k, dpr) {
  const fine = k * Math.min(dpr, 2);
  const soft = k * Math.min(dpr, 1.25);
  const chunks = new Map();
  return {
    key: assetKey(p, k, dpr),
    meadow: paintMeadow(p, soft),
    sprites: paintSprites(p, fine),
    parts: paintRunnerParts(p, fine * 1.25),
    chunk(i) {
      if (!chunks.has(i)) chunks.set(i, paintBackdropChunk(i, p, soft));
      return chunks.get(i);
    },
    ready: (i) => chunks.has(i),
    // Keeps only the chunks on screen and the few painted ahead, so an endless run (or many runs) stays bounded.
    keep(first, last) {
      for (const i of chunks.keys()) if (i < first || i > last) chunks.delete(i);
    },
  };
}

// The layout: world scale \`k\`, the runner's screen x and the ground's screen y. The phone layout draws
// her larger than the world (as the designer's mobile cut does), so she reads at 390 px wide.
// The phone layout serves every portrait screen and anything narrower than the desktop HUD (820px).
export const isPhoneLayout = (W, H) => W < 820 || H > W;

export function viewFor(W, H) {
  const mobile = isPhoneLayout(W, H);
  return mobile ? { W, H, mobile, k: Math.min(W, H * 0.4643) / 490, runner: 1.18, px: W * 0.31, gy: H * 0.664 } : { W, H, mobile, k: H / 720, runner: 1, px: W * 0.3125, gy: H * (GROUND / 720) };
}

function tiles(ctx, strip, offset, view, factor = 1, shift = 0) {
  const { k, gy, W } = view;
  const w = TILE * k * factor;
  const y = gy + (strip.y0 + shift - GROUND) * k;
  const h = (strip.y1 - strip.y0) * k * factor;
  for (let x = -((offset * k) % w); x < W; x += w) ctx.drawImage(strip.canvas, x, y, w + 1, h);
}

function backdrop(ctx, a, view, dist) {
  const { k, gy, W } = view;
  const off = dist * BACKDROP_PARALLAX;
  const first = Math.floor(off / CHUNK);
  let i = first;
  for (; (i * CHUNK - off) * k < W; i++) {
    const c = a.chunk(i);
    ctx.drawImage(c, (i * CHUNK - off) * k, gy + (TOP - GROUND) * k, CHUNK * k + 1, (c.height / c.width) * CHUNK * k);
  }
  a.keep(first, Math.max(i - 1, first + PAINT_AHEAD));
  return first;
}

function chevron(ctx, x, y, k, p) {
  const w = 30 * k;
  const h = 22 * k;
  ctx.fillStyle = p.white;
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
  ctx.fill();
  ctx.strokeStyle = p.ink;
  ctx.lineWidth = 2.2 * k;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 5 * k, y - 2.5 * k);
  ctx.lineTo(x, y + 2.5 * k);
  ctx.lineTo(x + 5 * k, y - 2.5 * k);
  ctx.stroke();
}

export function drawScene(ctx, g, fx, a, view, p, clock) {
  const { k, gy, px, W, H } = view;
  const at = (x, y, dist) => [px + (x - dist) * k, gy - y * k];
  const slow = slowAmount(g);
  ctx.fillStyle = p.sky1;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  const zoom = 1 + 0.06 * slow;
  const cy = gy - 110 * k;
  ctx.translate(px, cy);
  ctx.scale(zoom, zoom);
  ctx.translate(-px, -cy);
  const chunk = backdrop(ctx, a, view, g.dist);
  tiles(ctx, a.meadow.far, g.dist * 0.6, view);
  tiles(ctx, a.meadow.near, g.dist, view);
  if (view.mobile) {
    const top = gy + 58 * k;
    const band = ctx.createLinearGradient(0, top, 0, top + 70 * k);
    band.addColorStop(0, alpha(p.grass3, 0));
    band.addColorStop(0.4, p.grass3);
    band.addColorStop(1, p.grass3);
    ctx.fillStyle = band;
    ctx.fillRect(0, top, W, H - top);
    tiles(ctx, a.meadow.near, g.dist * 1.25, view, 1.25, 175);
  }
  for (const hz of g.course.hazards) {
    const [x, y] = at(hz.x, 0, g.dist);
    if (x < -200 * k || x > W + 200 * k) continue;
    ctx.fillStyle = a.meadow.shadow;
    ctx.beginPath();
    ctx.ellipse(x, y, (hz.ground ? 40 : 52) * k, 6 * k, 0, 0, Math.PI * 2);
    ctx.fill();
    if (hz.ground) drawSprite(ctx, a.sprites[hz.type], x, y, k);
    else {
      const top = gy - POM_HEIGHT * k;
      drawSprite(ctx, a.sprites[hz.type], x, top, k, hz.spin + clock * 0.6);
      chevron(ctx, x, top - (a.sprites[hz.type].ay + 7) * k, k, p);
    }
  }
  for (const c of g.course.coins) {
    const [x, y] = at(c.x, c.y, g.dist);
    if (x > -40 && x < W + 40) drawSprite(ctx, a.sprites.coin, x, y, k);
  }
  const slide = Math.min(1, Math.max(0, isSliding(g) ? Math.min(1, (0.9 - g.slideLeft) / 0.08, g.slideLeft / 0.1) : 0));
  ctx.save();
  ctx.translate(px, gy - g.h * k);
  ctx.scale(k * view.runner, k * view.runner);
  drawRunner(ctx, a.parts, p, {
    phase: g.dist / 34, lift: g.h, scale: view.runner, slide,
    air: g.air ? Math.min(1, g.h / 60) : 0, lean: g.air ? 0.2 : 0.04,
  });
  ctx.restore();
  tiles(ctx, a.meadow.front, g.dist * 1.15, view);
  drawFx(ctx, fx, p, at, k, g.dist);
  ctx.restore();
  drawNearMiss(ctx, slow, px, cy, W, H, k, p);
  if (g.status === 'over') {
    ctx.fillStyle = alpha(p.shade, 0.18);
    ctx.fillRect(0, 0, W, H);
  }
  return chunk;
}
\`\`\`

## src/components/meadow-run/paint/sprites.js
\`\`\`js
import { alpha, makeCanvas, mix, mulberry32 } from './color';
import { fibrePom, fuzzBall, grain } from './fuzz';

// Hazards and coins, painted once per look into sprites. Sizes are world units; \`ax\`/\`ay\` is the
// anchor (ground plants: the foot of the stem; poms and coins: the centre).
function sprite(w, h, ax, ay, scale, paint) {
  const canvas = makeCanvas(w * scale, h * scale);
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.translate(ax, ay);
  paint(ctx, mulberry32(w * 31 + h));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  grain(ctx, mulberry32(h), canvas.width, canvas.height, 0.04);
  return { canvas, w, h, ax, ay };
}

function stem(ctx, p, x0, x1, top, width = 2.4) {
  ctx.strokeStyle = p.stem;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0, 0);
  ctx.quadraticCurveTo(x0, top * 0.5, x1, top);
  ctx.stroke();
}

function leaves(ctx, rng, p, n, h, spread) {
  ctx.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = (rng() - 0.5) * spread;
    const l = h * (0.5 + rng() * 0.5);
    ctx.strokeStyle = mix(p.stem, p.white, rng() * 0.35);
    ctx.lineWidth = 2 + rng() * 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.quadraticCurveTo(x, -l * 0.6, x + (rng() - 0.5) * 18, -l);
    ctx.stroke();
  }
}

const blob = (ctx, rng, x, y, r, color, light, dark, reach = 0.3) =>
  fuzzBall(ctx, rng, { x, y, rx: r, color, light, dark, density: 1.4, reach, width: 1 });

export function paintSprites(p, scale) {
  const pom = (core, tip, inner, star, r = 72) => sprite(r * 2 + 26, r * 2 + 26, r + 13, r + 13, scale, (ctx, rng) => {
    fibrePom(ctx, rng, { x: 0, y: 0, r, core, tip, inner, fibres: Math.round(r * 7.2), width: 1.5 });
    if (star) {
      ctx.strokeStyle = star;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * 34, Math.sin(a) * 34);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  });
  return {
    puff: sprite(110, 150, 55, 142, scale, (ctx, rng) => {
      stem(ctx, p, 0, 2, -84, 2.6);
      leaves(ctx, rng, p, 5, 26, 24);
      blob(ctx, rng, 2, -92, 38, p.white, p.white, mix(p.puffCore, p.white, 0.4), 0.45);
      blob(ctx, rng, 2, -92, 10, p.puffCore, mix(p.puffCore, p.white, 0.4), p.puffCore, 0.3);
    }),
    berries: sprite(80, 90, 40, 84, scale, (ctx, rng) => {
      leaves(ctx, rng, p, 16, 58, 30);
      for (let i = 0; i < 9; i++) {
        const x = (rng() - 0.5) * 34;
        const y = -38 - rng() * 36;
        stem(ctx, p, x * 0.4, x, y, 1.2);
        blob(ctx, rng, x, y, 5 + rng() * 1.5, p.berry, mix(p.berry, p.white, 0.4), mix(p.berry, p.shade, 0.25), 0.2);
      }
    }),
    florets: sprite(90, 70, 45, 64, scale, (ctx, rng) => {
      leaves(ctx, rng, p, 10, 30, 40);
      for (let i = 0; i < 11; i++) {
        blob(ctx, rng, (rng() - 0.5) * 44, -24 - rng() * 22, 7 + rng() * 3, p.floret, p.white, mix(p.floret, p.shade, 0.15), 0.35);
      }
    }),
    alliums: sprite(100, 140, 50, 134, scale, (ctx, rng) => {
      leaves(ctx, rng, p, 6, 34, 30);
      for (const [x, top] of [[-16, -86], [4, -108], [20, -78]]) {
        stem(ctx, p, x * 0.3, x, top, 2.2);
        blob(ctx, rng, x, top, 16, p.allium, mix(p.allium, p.white, 0.5), mix(p.allium, p.shade, 0.12), 0.35);
      }
    }),
    pomOrange: pom(p.pomOrange, mix(p.pomOrange, p.white, 0.35), mix(p.pomOrange, p.shade, 0.08)),
    pomInk: pom(p.pomInk, p.pomFringe, p.pomInk, null, 94), // the near-miss pom is the big one
    pomBlue: pom(p.pomBlue, mix(p.pomBlue, p.white, 0.3), p.white),
    pomMoss: pom(p.pomMoss, mix(p.pomMoss, p.pomStar, 0.45), mix(p.pomMoss, p.shade, 0.2), p.pomStar),
    coin: sprite(56, 56, 28, 28, scale, (ctx, rng) => {
      const glow = ctx.createRadialGradient(0, 0, 4, 0, 0, 27);
      glow.addColorStop(0, alpha(p.coin, 0.6));
      glow.addColorStop(0.5, alpha(p.coin, 0.22));
      glow.addColorStop(1, alpha(p.coin, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(-28, -28, 56, 56);
      blob(ctx, rng, 0, 0, 13, p.coin, mix(p.coin, p.white, 0.45), mix(p.coin, p.shade, 0.08), 0.25);
      ctx.strokeStyle = p.white;
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(5, 0);
      ctx.moveTo(0, -5);
      ctx.lineTo(0, 5);
      ctx.stroke();
    }),
  };
}

export const drawSprite = (ctx, s, x, y, k = 1, rotate = 0) => {
  ctx.save();
  ctx.translate(x, y);
  if (rotate) ctx.rotate(rotate);
  ctx.drawImage(s.canvas, -s.ax * k, -s.ay * k, s.w * k, s.h * k);
  ctx.restore();
};
\`\`\`

## src/components/meadow-run/useMeadowRun.js
\`\`\`js
import { useCallback, useEffect, useRef, useState } from 'react';
import { OPENING_MOVES } from './course';
import { createGame, isSliding, jump, slide, step } from './engine';
import { PAINT_AHEAD, assetKey, createAssets, drawScene, isPhoneLayout, viewFor } from './paint/scene';
import { createFx, updateFx } from './paint/fx';
import { readPalette } from './paint/color';

const BEST_KEY = 'meadow-run-best';
const SAMPLE_BEST = 18240;

function loadBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

const saveBest = (best) => {
  try {
    localStorage.setItem(BEST_KEY, String(best));
  } catch {
    // storage blocked: best lasts the session
  }
};

const snapshot = (g) => ({
  status: g.status, score: Math.floor(g.score), coins: g.coins, record: g.record,
  best: g.opening && g.status !== 'over' ? g.best || SAMPLE_BEST : g.best, // the promo's best shows until the opening run ends
  mult: g.mult.toFixed(2), tier: g.tier, near: g.nearLeft > 0, tierCard: g.tierLeft > 0 ? g.tier : null,
});
const same = (a, b) => Object.keys(a).every((key) => a[key] === b[key]);

// The run: the engine, its canvas loop, keyboard and the HUD's numbers. The first run starts frozen on
// the promo's frame and begins on the first key or tap.
export function useMeadowRun() {
  const canvasRef = useRef(null);
  const game = useRef(null);
  if (!game.current) game.current = createGame({ opening: true, best: loadBest() });
  const fx = useRef(createFx());
  const [hud, setHud] = useState(() => snapshot(game.current));
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && isPhoneLayout(window.innerWidth, window.innerHeight));
  const [touch, setTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);

  const start = useCallback(() => {
    const g = game.current;
    if (g.status !== 'ready') return g;
    g.status = 'running';
    // The gallery's hover demo (preview only) asks the opening run to play the clip's moves itself:
    // timed keys drift on a slow machine, while distances land on every beat.
    if (window.__meadowRunDemo) g.moves = OPENING_MOVES.map((move) => [...move]);
    return g;
  }, []);
  const restart = useCallback(() => {
    game.current = createGame({ opening: false, best: game.current.best, seed: Date.now() % 100000 });
    fx.current = createFx();
  }, []);
  const doJump = useCallback(() => jump(start()), [start]);
  const doSlide = useCallback(() => slide(start()), [start]);
  const togglePause = useCallback(() => {
    const g = start();
    if (g.status === 'running') g.status = 'paused';
    else if (g.status === 'paused') g.status = 'running';
  }, [start]);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)');
    const onChange = () => setTouch(coarse.matches);
    coarse.addEventListener('change', onChange);
    return () => coarse.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      const g = game.current;
      if ([' ', 'arrowup', 'arrowdown'].includes(key)) e.preventDefault();
      if (g.status === 'over') {
        if ([' ', 'enter'].includes(key) && !e.repeat) restart(); // a key held through the crash doesn't skip the card
        return;
      }
      if ([' ', 'arrowup', 'w'].includes(key)) doJump();
      else if (['arrowdown', 's'].includes(key)) doSlide();
      else if (key === 'p' || key === 'escape') togglePause();
      else if (key === 'enter') start();
    };
    const onHide = () => document.hidden && game.current.status === 'running' && (game.current.status = 'paused');
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [doJump, doSlide, togglePause, restart, start]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let palette = readPalette();
    let assets = null;
    let view = null;
    let frame = 0;
    let last = performance.now();
    let painting = false;
    const fit = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      view = viewFor(width, height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (assets?.key !== assetKey(palette, view.k, dpr)) assets = createAssets(palette, view.k, dpr);
      setMobile(view.mobile);
      // Resizing clears the canvas: repaint this frame now, not on the next one (a paused page may never get it).
      drawScene(ctx, game.current, fx.current, assets, view, palette, game.current.t);
    };
    const restyle = () => {
      const next = readPalette();
      if (next.key === palette.key) return;
      palette = next;
      assets = null;
      fit();
    };
    const loop = (now) => {
      const g = game.current;
      const dt = (now - last) / 1000;
      last = now;
      const before = g.t;
      step(g, dt);
      updateFx(fx.current, g, g.t - before, isSliding(g));
      if (g.events.some((e) => e.kind === 'crash') && g.record) saveBest(g.best);
      g.events.length = 0;
      const shown = drawScene(ctx, g, fx.current, assets, view, palette, g.t);
      // Paint the next stretch of garden between frames, before the run reaches it.
      const ahead = Array.from({ length: PAINT_AHEAD }, (_, i) => shown + i + 1).find((i) => !assets.ready(i));
      if (ahead !== undefined && !painting) {
        painting = true;
        const target = assets;
        setTimeout(() => (target.chunk(ahead), (painting = false)), 0);
      }
      const next = snapshot(g);
      setHud((prev) => (same(prev, next) ? prev : next));
      frame = requestAnimationFrame(loop);
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(canvas);
    const looks = new MutationObserver(restyle);
    looks.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      looks.disconnect();
    };
  }, []);

  return { canvasRef, hud, mobile, touch, jump: doJump, slide: doSlide, togglePause, restart, start };
}
\`\`\`

## src/pages/MeadowRun.jsx
\`\`\`jsx
import '@/components/meadow-run/meadow-run.css';
import DesktopHud from '@/components/meadow-run/DesktopHud';
import MobileHud from '@/components/meadow-run/MobileHud';
import Overlay from '@/components/meadow-run/Overlay';
import { useMeadowRun } from '@/components/meadow-run/useMeadowRun';

export default function MeadowRun() {
  const run = useMeadowRun();
  return (
    // Full-window stage; below the layout's floor height the page scrolls instead of squeezing the HUD.
    <div className={\`mr relative h-[100dvh] w-full \${run.mobile ? 'min-h-[600px]' : 'min-h-[440px]'}\`}>
      <canvas ref={run.canvasRef} onPointerDown={run.jump} aria-label="Meadow Run — the runner, the garden and what's coming up" role="img" />
      {run.mobile
        ? <MobileHud hud={run.hud} onPause={run.togglePause} onJump={run.jump} onSlide={run.slide} />
        : <DesktopHud hud={run.hud} onPause={run.togglePause} touch={run.touch} onJump={run.jump} onSlide={run.slide} />}
      <Overlay hud={run.hud} mobile={run.mobile} onRestart={run.restart} onResume={run.togglePause} />
    </div>
  );
}
\`\`\`
`;export{e as default};