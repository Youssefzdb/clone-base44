var e=`# word_puzzle — app files

## src/components/five/answers.js
\`\`\`js
// The daily answers, in play order from START_DAY (one per day, then it wraps). Common words only.
export const ANSWERS = \`
label table error final petal truck spark roast unity heavy medal blend actor young depth click color paint
check space magic elite peach brook clear honey forth ghost blind again blade court ivory youth canoe scout
cedar fifth dealt smile treat shake point lilac ready image couch pulse lemon sweet jewel clown flock north
agree vivid drink aware theme vocal enjoy ridge chalk bound brush quart cocoa plume delay plate blush polar
faint orbit ember melon punch flood shrub cover ranch alarm novel reply vapor rocky diary trend fancy scone
shore along proud style bride penny wheat straw exact lucky range share hedge noise round bless chief staff
opera forge outer bloom yacht brand story scent tower route eager early arrow sugar cubic stove slide scarf
storm voice brief world quiet event study swamp begin grill guard honor chess guide scale asset minor shift
creek spice happy cliff olive tulip glass grove shape raise shirt earth value stone admit comet cause squad
spray prime drift usual apart arise close throw drive money empty metal fight aroma valid woman allow lunar
camel swift grain cargo badge elbow inner sauce block peace bleak thick booth glory ankle false beast teach
boast touch today tutor small relax relay grace agent stand quick river fruit beach frame quilt moral harsh
alert prune alike berry clerk argue pearl angel plain brain radar fluid shout water bring cable bacon judge
faith solid snack trail bunch power solar glade dream essay focus royal about thorn found board clash quite
crumb model blank flute candy raven dwell globe amuse paper cycle zebra shelf lunch pinch chase stack cheer
album feast write quote knack nurse think panel scope plant blaze ruler dress beard arena easel pixel chest
order breed amber comic class match fleet equal taste prize great green grass ocean patch movie rapid learn
train pilot angry bench joint toast ferry cough audio ideal grand shade aside sunny count draft urban carol
float after pupil stamp cider batch under whale crash slope prism pause crown brisk scene mount apron wreck
floor jolly flour worth track human sport snake carry cloth salad anger other knife mouth humor gleam catch
motor habit video slice clock bliss trace noble baker birth house drama layer alter trade fence place knock
broom input skill climb torch linen guest blame crawl crisp angle fresh crowd choir quest above charm elder
music silky bread plane craft radio shine black major upper smart blink adopt steel kayak sound queen white
sight snail grape chord laugh drain level sleep total whole eagle clean child brick score flame armor exist
robot mercy merit fever cheek apply piano mirth width piece blast curve gauge trust shark chair coach alone
claim bonus crane civic chart coast mayor mango brown laser visit phone chill dairy twist acute chain attic
crust fable brake basin spoon daily maple adapt lodge awake uncle field pizza skate sharp waltz topic light
tribe extra cling yield sword glove cheap fairy pasta march shell enter juice dizzy robin short trick price
swing graph vital hello pedal guess dough press spare porch reach pouch adult alive ahead sheep bland flash
three speak stage avoid trial haven party steam stair rally dance being cabin thank burst fudge thumb birch
giant index boost proof rifle broad heart thing print cream plaza tiger onion photo would funny hotel watch
coral frost otter owner right pride break jelly smoke mouse apple truth greet cloud start horse build brave
daisy award wheel month realm basic
\`.trim().split(/\\s+/);
\`\`\`

## src/components/five/Blob.jsx
\`\`\`jsx
import { useId } from 'react';

const shapeProps = ({ x, y, w, h = w, r = Math.min(w, h) / 2 }, inset = 0) => ({
  x: x + inset, y: y + inset, width: Math.max(0, w - inset * 2), height: Math.max(0, h - inset * 2), rx: Math.max(0, r - inset),
});

/**
 * Circles and capsules ({ x, y, w, h } boxes, rounded to their short side unless \`r\` is given) fused into one liquid shape:
 * blurred, then the alpha is thresholded back to a hard edge (a gooey metaball filter), and that edge is
 * grown by \`stroke\` px and painted as one thin outline around the whole group. \`tint\` adds a soft fill
 * of that colour inset from the edge, blurred so it fades out before the outline (\`bare\` shapes get none,
 * \`tintOnly\` ones only tint); a \`drift\` shape floats a little on its own.
 */
export default function Blob({ width, height, shapes, goo = 5, stroke = 1, tint, tintInset = 10, tintBlur = 7, fill = 'var(--ui-surface)', className = '', children }) {
  const id = \`fv\${useId().replace(/:/g, '')}\`;
  return (
    <svg className={\`pointer-events-none absolute left-0 top-0 overflow-visible \${className}\`} width={width} height={height} viewBox={\`0 0 \${width} \${height}\`} aria-hidden="true">
      <defs>
        <filter id={\`\${id}-goo\`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation={goo} result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -4.5" result="shape" />
          <feMorphology in="shape" operator="dilate" radius={stroke} result="grown" />
          <feFlood style={{ floodColor: 'var(--ui-line)' }} result="ink" />
          <feComposite in="ink" in2="grown" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="shape" />
          </feMerge>
        </filter>
        <filter id={\`\${id}-soft\`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={tintBlur} />
        </filter>
      </defs>
      <g filter={\`url(#\${id}-goo)\`} style={{ fill }}>
        {shapes.filter((s) => !s.tintOnly).map((s, i) => <rect key={i} className={s.drift ? 'fv-drift' : undefined} {...shapeProps(s)} />)}
      </g>
      {tint && (
        <g filter={\`url(#\${id}-soft)\`} style={{ fill: tint }}>
          {shapes.filter((s) => !s.bare).map((s, i) => <rect key={i} className={s.drift ? 'fv-drift' : undefined} {...shapeProps(s, tintInset)} />)}
        </g>
      )}
      {children}
    </svg>
  );
}
\`\`\`

## src/components/five/Board.jsx
\`\`\`jsx
import { useEffect, useMemo, useRef } from 'react';
import Blob from './Blob';
import Tile from './Tile';
import { LENGTH, ROWS } from './game';
import { boardShape } from './geometry';

const SHAKE = [0, -7, 7, -5, 5, -2, 0].map((x) => ({ transform: \`translateX(\${x}px)\` }));

/** The 6×5 board: one fused white blob with an outline, a ring per empty tile, the current row typed in. */
export default function Board({ size, rows, current, revealing, shake }) {
  const shape = useMemo(() => boardShape(size), [size]);
  const typingRow = useRef(null);
  useEffect(() => {
    if (shake) typingRow.current?.animate(SHAKE, { duration: 400, easing: 'ease-out' });
  }, [shake]);
  return (
    <div className="relative shrink-0" style={{ width: shape.width, height: shape.height }} role="grid" aria-label="Board">
      <Blob width={shape.width} height={shape.height} shapes={shape.shapes} goo={4}>
        {shape.dots.map((d, i) => <circle key={i} {...d} className="fv-dot" />)}
      </Blob>
      {Array.from({ length: ROWS }, (_, r) => {
        const row = rows[r];
        const typing = r === rows.length;
        return (
          <div key={r} ref={typing ? typingRow : undefined} className="absolute inset-0" role="row">
            {Array.from({ length: LENGTH }, (_, c) => {
              const letter = row ? row.word[c] : typing ? current[c] : undefined;
              const [cx, cy] = shape.center(r, c);
              return (
                <Tile
                  key={\`\${c}-\${letter ?? ''}\`}
                  letter={letter}
                  mark={row?.marks[c]}
                  flip={r === revealing}
                  index={c}
                  size={size.tile}
                  font={size.letter}
                  cx={cx}
                  cy={cy}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
\`\`\`

## src/components/five/Corners.jsx
\`\`\`jsx
import Blob from './Blob';

// Desktop geometry from the clip; mobile draws the same shapes smaller via \`scale\`.
const LOGO = {
  width: 298, height: 94,
  shapes: [0, 64, 128, 192].map((x) => ({ x, y: 0, w: 80, bare: true }))
    .concat({ x: 0, y: 0, w: 272, h: 80, tintOnly: true }, { x: 257, y: 57, w: 14, bare: true }, { x: 264, y: 60, w: 33 }),
};
const DAY = { width: 142, height: 107, shapes: [{ x: 0, y: 0, w: 106 }, { x: 98, y: 55, w: 44, drift: true }] };
const TRIES = { width: 141, height: 107, shapes: [{ x: 35, y: 0, w: 106 }, { x: 0, y: 54, w: 44, drift: true }] };

const Scaled = ({ shape, scale, className, children }) => (
  <div className={\`relative \${className}\`} style={{ width: shape.width * scale, height: shape.height * scale }}>
    <div className="absolute left-0 top-0 origin-top-left" style={{ width: shape.width, height: shape.height, transform: scale === 1 ? undefined : \`scale(\${scale})\` }}>
      {children}
    </div>
  </div>
);

export function Logo({ scale = 1 }) {
  return (
    <Scaled shape={LOGO} scale={scale}>
      <Blob {...LOGO} goo={4} tint="var(--swatch-5)" tintInset={9} tintBlur={8} />
      <h1 className="fv-serif absolute left-[8px] top-[10px] flex h-[80px] w-[256px] items-center text-[52px] leading-none">
        {[...'FIVE'].map((ch) => <span key={ch} className="w-[64px] text-center">{ch}</span>)}
      </h1>
    </Scaled>
  );
}

export function DayBubble({ label, scale = 1 }) {
  return (
    <Scaled shape={DAY} scale={scale} className="fv-breathe fv-breathe-2">
      <Blob {...DAY} goo={4} tint="var(--swatch-3)" tintInset={7} tintBlur={9} />
      <div className="absolute left-0 top-0 flex h-[106px] w-[106px] flex-col items-center justify-center pt-1">
        <span className="text-[16px] leading-none">Today’s</span>
        <span className="fv-serif mt-[3px] text-[33px] leading-none">{label}</span>
      </div>
    </Scaled>
  );
}

/** "Tries 2/6"; once the game is over it reopens the result window. */
export function TriesBubble({ tries, total, onOpen, scale = 1 }) {
  const Inner = onOpen ? 'button' : 'div';
  return (
    <Scaled shape={TRIES} scale={scale} className="fv-breathe fv-breathe-3">
      <Blob {...TRIES} goo={4} tint="var(--swatch-2)" tintInset={7} tintBlur={9} />
      <Inner
        {...(onOpen ? { type: 'button', onClick: onOpen, 'aria-label': \`Tries \${tries} of \${total}, see result\` } : {})}
        className="absolute left-[35px] top-0 flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full pt-1"
      >
        <span className="text-[16px] leading-none">Tries</span>
        <span className="fv-serif mt-[3px] text-[33px] leading-none">{tries}/{total}</span>
      </Inner>
    </Scaled>
  );
}
\`\`\`

## src/components/five/five.css
\`\`\`css
@font-face{font-family:"Libre Caslon Text";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/libre-caslon-text-400-normal.woff2) format("woff2")}
@font-face{font-family:"Geist";font-weight:100 900;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/geist-variable-normal.woff2) format("woff2")}

/* The look: paper, correct, present, absent and the accent (logo and result card), then the ink and lines. */
:root{
  --swatch-1:#F3F2EE;--swatch-1-ink:#111111;
  --swatch-2:#B5EBB0;--swatch-2-ink:#111111;
  --swatch-3:#F7F35A;--swatch-3-ink:#111111;
  --swatch-4:#BDBDB8;--swatch-4-ink:#111111;
  --swatch-5:#F8C6EA;--swatch-5-ink:#111111;
  --ui-ink:#111111;--ui-line:#1A1A1A;--ui-surface:#FFFFFF;--ui-ring:#D9D9D6;--ui-dim:#76766F;
  --ui-press:#2A2A2A;--ui-on-press:#FFFFFF;
}
/* gallery-look */

.fv{font-family:"Geist",system-ui,-apple-system,"Helvetica Neue",sans-serif;font-weight:400;color:var(--ui-ink);-webkit-font-smoothing:antialiased;
  background-color:var(--swatch-1);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.fv-serif{font-family:"Libre Caslon Text",Georgia,serif;font-weight:400;letter-spacing:0}
.fv button{font:inherit;color:inherit;background:none;border:0;padding:0;-webkit-tap-highlight-color:transparent}
.fv button:focus-visible{outline:2px solid var(--ui-line);outline-offset:2px}

.fv-dot{fill:color-mix(in srgb,var(--swatch-1) 75%,var(--ui-surface))}
.fv-tile{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:var(--ui-surface);line-height:1}
.fv-tile-empty{box-shadow:inset 0 0 0 2px var(--ui-ring)}
.fv-tile-typed,.fv-tile-mark{box-shadow:inset 0 0 0 1px var(--ui-line)}
/* Ink soaking into paper: the colour is strongest in the middle and fades to white just inside the outline. */
.fv-fill{position:absolute;inset:1px;border-radius:9999px;background:radial-gradient(circle closest-side,color-mix(in srgb,var(--mark) 92%,var(--ui-surface)) 0%,color-mix(in srgb,var(--mark) 70%,var(--ui-surface)) 52%,color-mix(in srgb,var(--mark) 22%,var(--ui-surface)) 86%,var(--ui-surface) 100%)}
.fv-pop{animation:fv-pop 140ms ease-out}
.fv-flip{animation-name:fv-flip;animation-timing-function:ease-in-out;animation-fill-mode:both}
.fv-flip .fv-fill{animation-name:fv-fill;animation-timing-function:steps(1,end);animation-fill-mode:both}
@keyframes fv-fade{from{opacity:0}}
@keyframes fv-pop{50%{transform:scale(1.08)}}
@keyframes fv-flip{50%{transform:rotateX(90deg)}}
@keyframes fv-fill{0%{opacity:0}50%,100%{opacity:1}}

.fv-key{position:absolute;display:flex;font-weight:500;align-items:center;justify-content:center;border-radius:9999px;line-height:1;cursor:pointer;touch-action:manipulation;user-select:none}
.fv-key-mark{position:absolute;border-radius:9999px;animation:fv-fade .3s ease-out;background:var(--ui-press)}
.fv .fv-key-down{color:var(--ui-on-press)}

.fv .fv-veil{background:color-mix(in srgb,color-mix(in srgb,var(--swatch-1) 70%,var(--ui-surface)) 86%,transparent)}
.fv-grid-dot{display:block;border-radius:9999px;box-shadow:inset 0 0 0 1px var(--ui-line)}
.fv-share{height:39px;min-width:92px;padding:0 22px;border-radius:9999px;font-size:14px;cursor:pointer;transition:background-color .25s,color .25s}
.fv .fv-share{background:var(--ui-ink);color:var(--ui-surface)}
.fv .fv-share-done{background:var(--swatch-2);color:var(--swatch-2-ink)}

/* The corner bubbles breathe by a pixel or two, their small circle drifting on its own; the logo stays still. */
.fv-breathe{animation:fv-breathe 6s ease-in-out infinite}
.fv-breathe-2{animation-duration:7s}
.fv-breathe-3{animation-duration:6.5s}
@keyframes fv-breathe{0%,100%{transform:translate(0,0)}50%{transform:translate(0,-1.5px)}}
.fv-drift{transform-box:fill-box;transform-origin:center;animation:fv-drift 4.5s ease-in-out infinite}
@keyframes fv-drift{0%,100%{transform:translate(0,0)}50%{transform:translate(1.5px,1px)}}
/* Toast letters ride a wave along the word. */
.fv-wave{animation:fv-wave 1.4s ease-in-out infinite}
@keyframes fv-wave{0%,100%{transform:translateY(-3px)}50%{transform:translateY(3px)}}
@media (prefers-reduced-motion:reduce){.fv-breathe,.fv-drift,.fv-wave,.fv-pop,.fv-flip,.fv-flip .fv-fill{animation:none}}
\`\`\`

## src/components/five/game.js
\`\`\`js
import { ANSWERS } from './answers';
import { GUESSES } from './guesses';

export const ROWS = 6;
export const LENGTH = 5;
// Puzzle #1 is this local day; every day after it moves one answer along the list.
const START = [2026, 0, 1];
const VALID = new Set([...ANSWERS, ...GUESSES]);

const dayNumber = (date) => Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(...START)) / 86400000);

/** The local day's key (2026-09-30) and its answer: the same for every player that day. */
export function puzzleFor(date = new Date()) {
  const n = dayNumber(date);
  const pad = (v) => String(v).padStart(2, '0');
  return {
    day: \`\${date.getFullYear()}-\${pad(date.getMonth() + 1)}-\${pad(date.getDate())}\`,
    answer: ANSWERS[((n % ANSWERS.length) + ANSWERS.length) % ANSWERS.length],
    label: \`\${pad(date.getDate())}.\${pad(date.getMonth() + 1)}\`,
    number: n + 1,
  };
}

export const isWord = (word) => VALID.has(word);

/** Standard rules: exact matches first, then each remaining answer letter colours at most one guess letter. */
export function score(guess, answer) {
  const result = Array(LENGTH).fill('absent');
  const left = {};
  [...answer].forEach((ch, i) => {
    if (guess[i] === ch) result[i] = 'correct';
    else left[ch] = (left[ch] ?? 0) + 1;
  });
  [...guess].forEach((ch, i) => {
    if (result[i] !== 'correct' && left[ch] > 0) {
      result[i] = 'present';
      left[ch] -= 1;
    }
  });
  return result;
}

const EMOJI = { correct: '🟩', present: '🟨', absent: '⬜' };

export const shareText = (rows, won, puzzle) =>
  \`Five #\${puzzle.number} · \${puzzle.label} \${won ? rows.length : 'X'}/\${ROWS}\\n\\n\${rows.map(({ marks }) => marks.map((m) => EMOJI[m]).join('')).join('\\n')}\`;

/** Time left until local midnight, as 09:14:31. */
export function untilMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const s = Math.max(0, Math.floor((next - now) / 1000));
  return [s / 3600, (s % 3600) / 60, s % 60].map((v) => String(Math.floor(v)).padStart(2, '0')).join(':');
}
\`\`\`

## src/components/five/geometry.js
\`\`\`js
import { LENGTH, ROWS } from './game';

// Sizes in px: desktop is the clip at 1280×720; mobile is a 390-wide phone. Tiles and keys are circles
// on desktop; on mobile the keys become capsules so ten fit a row and still give a tall touch target.
export const SIZES = {
  desktop: { pitch: 63, blobR: 34, tile: 56, letter: 34, dot: 6, key: { pitch: 48, w: 50, h: 50, row: 49, wide: 82, mark: 40, font: 16 } },
  mobile: { pitch: 56, blobR: 30, tile: 50, letter: 29, dot: 5, key: { pitch: 34.2, w: 31, h: 48, row: 51, wide: 52, mark: 28, font: 14 } },
};

export const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', ['Enter', ...'ZXCVBNM', 'Del']];

export function boardShape({ pitch, blobR, dot }) {
  const width = pitch * (LENGTH - 1) + blobR * 2;
  const height = pitch * (ROWS - 1) + blobR * 2;
  const circles = [];
  const dots = [];
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < LENGTH; c += 1) {
      circles.push({ x: c * pitch, y: r * pitch, w: blobR * 2 });
      if (r < ROWS - 1 && c < LENGTH - 1) dots.push({ cx: blobR + (c + 0.5) * pitch, cy: blobR + (r + 0.5) * pitch, r: dot });
    }
  }
  // The inside is solid; the gaps where four tiles meet are drawn as soft dots instead of outlined holes.
  const inside = { x: blobR, y: blobR, w: pitch * (LENGTH - 1), h: pitch * (ROWS - 1), r: 0 };
  return { width, height, shapes: [...circles, inside], dots, center: (r, c) => [blobR + c * pitch, blobR + r * pitch] };
}

/** Every key's box ({ key, x, y, w, h }) and the keyboard's size; rows are centred on the widest. */
export function keyboardShape({ pitch, w, h, row, wide }) {
  const rows = KEY_ROWS.map((keys) => {
    let x = 0;
    return [...keys].map((key) => {
      const kw = key.length > 1 ? wide : w;
      const box = { key, x, w: kw };
      x += kw + (pitch - w);
      return box;
    });
  });
  const widths = rows.map((r) => r.at(-1).x + r.at(-1).w);
  const width = Math.max(...widths);
  const keys = rows.flatMap((r, i) => r.map((k) => ({ ...k, x: k.x + (width - widths[i]) / 2, y: i * row, h })));
  // Fills the gaps between staggered rows (which fused circles alone leave as holes), Q's centre to P's.
  const inside = { x: keys[0].x + w / 2, y: h / 2, w: widths[0] - w, h: row * 2, r: 0 };
  return { width, height: row * 2 + h, keys, shapes: [...keys, inside] };
}

/** A card with a wavy edge: small circles (\`d\` wide, about \`pitch\` apart) along a rounded rectangle, filled. */
export function scallopShape(width, height, { d = 24, pitch = 22, corner = 22 } = {}) {
  const inset = d / 2;
  const w = width - d;
  const h = height - d;
  const straight = [w - corner * 2, h - corner * 2];
  const arc = (Math.PI / 2) * corner;
  const perimeter = 2 * (straight[0] + straight[1]) + 4 * arc;
  const count = Math.round(perimeter / pitch);
  // Walks the rounded rectangle clockwise from its top-left straight edge and returns the point at \`t\`.
  const at = (t) => {
    const segs = [
      [straight[0], (s) => [corner + s, 0]],
      [arc, (s) => { const a = -Math.PI / 2 + s / corner; return [w - corner + Math.cos(a) * corner, corner + Math.sin(a) * corner]; }],
      [straight[1], (s) => [w, corner + s]],
      [arc, (s) => { const a = s / corner; return [w - corner + Math.cos(a) * corner, h - corner + Math.sin(a) * corner]; }],
      [straight[0], (s) => [w - corner - s, h]],
      [arc, (s) => { const a = Math.PI / 2 + s / corner; return [corner + Math.cos(a) * corner, h - corner + Math.sin(a) * corner]; }],
      [straight[1], (s) => [0, h - corner - s]],
      [arc, (s) => { const a = Math.PI + s / corner; return [corner + Math.cos(a) * corner, corner + Math.sin(a) * corner]; }],
    ];
    for (const [len, point] of segs) {
      if (t <= len) return point(t);
      t -= len;
    }
    return [corner, 0];
  };
  const circles = Array.from({ length: count }, (_, i) => {
    // A circle centred on the path (inset by d/2) has its box at the path point itself.
    const [x, y] = at((i * perimeter) / count);
    return { x, y, w: d, bare: true };
  });
  return [...circles, { x: inset, y: inset, w, h, r: corner }];
}
\`\`\`

## src/components/five/guesses.js
\`\`\`js
// Other accepted guesses: common five-letter words that are not answers. Every answer is accepted too.
export const GUESSES = \`
aback abase abate abbey abbot abhor abide abled abode abort abuse abyss acorn acrid adage added adder adept
admin adobe adore adorn aeons affix afire afoot afoul agile aging aglow agony aided aider aides aimed aimer
aired aisle alder algae alias alibi alien align alley allot alloy aloft aloof aloud alpha altar amass amaze
amble amend amiss amity among ample amply angst anime annex annoy annul anvil aptly arbor ardor armed arose
array arson artsy ascot ashen ashes asked atlas atoll atoms audit augur aunts aunty avail avert avian await
awash awful awoke axial axiom axles azure babel badly bagel baggy baked bakes balls balmy banal bands banjo
banks barge barks baron basal based bases basil basis baste bathe baths baton batty bawdy bayou beads beady
beams beans bears beats beech beefy beers beets began beget begun beige belch belie belle bells belly below
belts bends beret berth beset bests betel bevel bible bicep biddy bided bides bight bigot biker bikes bills
billy binge bingo biome birds bison bites bitty blare blase bleat bleed blimp blitz bloat blobs bloke blond
blood blown blows blues bluff blunt blurb blurt boats bobby boils bolts bombs bonds boned bones boots booty
booze bored borne bosom bossy botch bough bouts bowed bowel bowls boxed boxer boxes brace braid brash brass
bravo brawl brawn briar bribe brine brink briny broil broke brood broth brows brunt brute buddy budge buggy
bugle built bulge bulky bulls bully bumps bumpy bunny burly burns burnt bused buses bushy butch butte buyer
bylaw cabal cacao cache cacti caddy cadet cafes cagey cairn cakes cameo camps canal canny canon caper capes
carat cards cared carer cares carts carve cases caste cater catty caulk caves cease cello chafe chaff champ
chant chaos chaps chard chasm cheat chick chide chili chime chimp china chink chips chirp chive choke chomp
chops chore chose chuck chump chunk churn chute cigar cinch circa cited cites civil clack clamp clams clang
clank clasp claws cleat cleft clink cloak clods clone clout clove clubs cluck clued clues clump clung coals
coats cobra coded codes coils coins colon comas combo comfy comma conch condo cones cords corer corny corps
costs could coupe coven covet cower crabs crack cramp crank crass crate crave craze crazy creak credo creed
creep creme crepe crept cress crest crews cribs cried crier cries crime crimp croak crock crone crony crook
croon crops cross crows crude cruel crush crypt cubed cubes cumin cupid curbs curds cured cures curio curls
curly curry curse curvy cushy cynic daddy dally dandy dared dares dated dates datum daunt dazed deals dears
death debit debts debug debut decal decay decks decor decoy decry deeds deems deeps deity delta delve demon
demur denim dense dents depot derby desks deter detox deuce devil diced dicey diets digit dimly dined diner
dines dingo dingy dirty disco discs ditch ditto ditty divan diver dives divot dodge doers doggy dogma doing
dolls dolly domed domes donor donut dooms doors dopey dorms dosed doses doubt douse dowdy dowel downs downy
dowry dozed dozen drake drank drape drawl drawn draws dread dregs dried drier dries drill drips droll drone
drool droop drops dross drove drown drugs drums drunk dryer dryly ducks ducts dudes duels duets dully dummy
dumps dumpy dunce dunes dusky dusty duvet dwarf dwelt dying earns eased eases eaten eater eaves ebony edged
edges edict edify eerie egret eight eject eking elect elegy elfin elope elude elves email embed emcee emery
enact ended endow enemy ennui ensue entry envoy epoch epoxy equip erase erect erode erupt ether ethic ethos
evade evens every evict evils evoke exalt exams excel exert exile exits expat expel extol exude exult faced
faces facet facts faded fades fails fairs faked fakes falls famed fangs farce fared fares farms fatal fated
fates fatty fault fauna favor fawns feats feeds feels feign feint fella felon femur feral ferns fetal fetch
fetid fetus fewer fiber fibre fiend fiery fifty filch filed files fills filly films filmy filth finch finds
fined finer fines fired fires firms first fishy fists fixed fixer fixes fizzy fjord flags flail flair flake
flaky flank flaps flare flask flats flaws fleas fleck flees flesh flick flier flies fling flint flips flirt
flops flora floss flout flown flows fluff fluke flung flunk flush foamy focal foggy foils folds folks folly
fonts foods fools foray force forgo forks forms forte forty forum fouls fount fours foyer frail frank fraud
freak freed freer frees friar fried fries frill frisk fritz frizz frock frogs front froth frown froze fuels
fully fumed fumes funds fungi funky furor furry fused fuses fussy fuzzy gains gaits gales gamer games gamma
gamut gangs gases gassy gates gaudy gaunt gauze gavel gawky gazed gazer gazes gears geese genie genre gents
germs ghoul giddy gifts gilds gills girls girth given giver gives gizmo gland glare glaze glean glide glint
gloat gloom gloss glows glued glues gnash gnome goals goats godly going golds golfs goner goods goody gooey
goofy goose gorge gorse gouge gourd gowns grade graft grail grant grasp grate grave gravy graze greed grief
grime grimy grind grins gripe grips grist grits groan groin groom grope gross group grout growl grown grows
gruel gruff grunt guava guild guilt guise gulch gulfs gully gumbo gummy gusto gusty gutsy hacks hairs hairy
halls halve hands handy hangs hardy harem harms harps haste hasty hatch hated hater hates haunt havoc hawks
hazel heads heady heals heaps heard hears heath heats heave heeds heels hefty heirs heist helix helps hence
herbs herds heron hertz hides highs hiker hikes hills hilly hinge hints hippo hired hires hitch hoard hobby
hoist holds holes holly homer homes hoods hooks hoops hoped hopes horde horns hosed hoses hosts hound hours
hover howdy howls huffy humid humps humus hunch hunks hunts hurls hurry hurts husky hutch hydra hyena hymns
hyper icing icons ideas idiom idiot idled idler idols igloo imbue impel imply inane inbox incur inept inert
infer ingot inlay inlet inter intro ionic irate irons irony islet issue itchy items jaded jails jazzy jeans
jerks jerky jiffy joins joist joked joker jokes joule joust juicy jumbo jumps jumpy junks juror kappa karma
kebab keels keeps ketch keyed khaki kicks kills kinds kinks kiosk kites kitty knead kneed kneel knees knelt
knits knobs knoll knots known knows koala kudos labor laced laces lacks laden ladle lager lairs lakes lambs
lamps lance lands lanes lanky lapel lapse large larva lasso lasts latch later latte lawns leads leafy leaks
leaky leans leant leaps leapt lease leash least leave ledge leech leery lefty legal leggy lemur lends lever
liars libel licks liege lifts liked liken likes limbo limbs limes limit lined liner lines lingo links lions
lipid lists liter lithe lived liven liver lives livid llama loads loafs loamy loans loath lobby lobes local
lochs locks locus lofty logic login logos looks looms loony loops loose loots lords lorry loser loses lotus
louse lousy loved lover loves lower lowly loyal lucid lumen lumps lumpy lunge lungs lurch lured lures lurid
lurks lusty lying lymph lyric macaw macho madam madly mafia magma maids maize maker makes males malls mamma
mangy mania manic manly manor mares marks marry marsh masks mason masts mated mates matte mauve maxim maybe
meals mealy means meant meats meaty media medic meets melee melts memos mends menus merge merry messy meter
metro micro midst might milky mills mimed mimes mimic mince minds mined miner mines mints minty minus mired
miser missy misty miter mixed mixer mixes moans moats mocha mocks modem modes moist molar molds moldy moles
monks moods moody moons moose moped moray morph mossy motel moths motif motto mould mound mourn mousy moved
mover moves mowed mower mucky muddy muggy mulch mules mumps munch mural murky mused muses mushy musky musty
muted myths nacho nails naive naked named names nanny nasal nasty natal naval navel needs needy neigh nerds
nerdy nerve nervy nests never newer newly newts nexus niche niece night ninja ninny ninth nippy nobly nodes
noisy nomad nooks noose norms nosed noses nosey notch noted notes nudge nuked nutty nylon nymph oaken oasis
oaths obese obeys occur octet odder oddly odors offal offer often ogled ogres oiled olden older omega omens
onset oozed opals opens opine opium opted optic organ ought ounce outdo outgo ovals ovary ovens overt owing
owned oxide ozone paced paces packs paddy padre pagan paged pager pages pails pains pairs palms palsy panda
panes panic pansy pants papal papas parka parks parry parse parts paste pasty paths patio patsy patty paved
paves payee payer peaks peaky pears pecan peeks peels peeps peers penal pence peony perch peril perks perky
pesky pesto petty phase phony picks picky piety piggy piles pills pines piney pinky pints pious piped piper
pipes pique pitch pithy pivot pixie plaid plait plank plans plays plead pleat plots plows ploys pluck plugs
plumb plump plums plunk plush poach podgy poems poets poise poked poker pokes poles polio polka polls polyp
ponds pools poppy pored pores ports posed poser poses posse posts potty pound pours pouty prank prawn prays
preen prick pried pries primp prior privy probe promo prone prong props prose prove prowl proxy prude psalm
pudgy puffs puffy pulls pulps pumps punks puppy puree purge purse pushy putty quack quail quake qualm quash
queer quell query queue quill quirk quota rabbi rabid raced racer races racks radii rafts rails rains rainy
raked rakes ramps randy ranks rarer raspy rated rates ratio ratty raved raves rayon razor react reads reams
reaps rearm rears rebel rebus recap recur redid reeds reedy reefs reeks reels refer regal rehab reign reins
relic remit renal renew rents repay repel rerun reset resin rests retro retry reuse revel revue rhino rhyme
ricer rider rides rifts rigid rigor rinds rings rinse riots ripen riper risen riser rises risks risky rites
ritzy rival riven rivet roach roads roams roars robed robes rocks rodeo rogue roles rolls romps roofs rooks
rooms roomy roost roots roped ropes roses rotor rouge rough rouse rover rowdy rowed rower ruddy ruder rugby
ruins ruled rules rumba rumor runny rural rusty sable sabre sacks sadly safer safes sagas sager sails saint
sakes sales salon salsa salty salve salvo samba sandy saner sappy sassy satin satyr saucy sauna saute saved
saver saves savor savvy sawed scald scalp scaly scamp scams scant scare scars scary scion scoff scold scoop
scoot scorn scour scowl scram scrap scree screw scrub scuba scuff seals seams seats sedan seeds seedy seeks
seems seeps seize sells semis sends sense sepia serif serum serve setup seven sever sewed sewer shack shady
shaft shaky shale shall shame shank shard shave shawl shear sheds sheen sheer sheet sheik shins shiny ships
shoal shock shoes shone shook shoot shops shots shove shown shows showy shred shrew shrug shuck shunt shush
shyly sided sides siege sieve sigma signs silks silly since sinew singe sings sinks sinus siren sites sixth
sixty sized sizes skews skied skier skies skimp skins skips skirt skull skunk slabs slack slain slang slant
slaps slash slate slave sleek sleet slept slick slime slimy sling slink sloth slots slugs slump slung slunk
slurp slush slyly smack smash smear smell smelt smirk smite smith smock smoky snags snaky snaps snare snarl
sneak sneer sniff snipe snoop snore snort snout snowy snuck snuff soapy sober socks sofas softy soggy soils
soled soles solve sonar songs sonic sooth sooty sorry sorts souls soups soupy south spade spank spans spasm
spawn spear speck specs speed spell spelt spend spent spicy spied spiel spies spike spiky spill spilt spine
spiny spire spite splat split spoil spoke spoof spook spool spore spots spout spree sprig spunk spurn spurt
squat squib staid stain stake stale stalk stall stank stare stark stars stash state stats stave stays stead
steak steal steed steep steer stems steps stern stick stiff still stilt sting stink stint stock stoic stoke
stole stomp stony stood stool stoop stops store stork stout strap stray strew strip strut stuck studs stuff
stump stung stunk stunt suave suing suite suits sulky sully sumac super surer surge surly sushi swami swans
swaps swarm swash swath swear sweat sweep swell swept swill swine swipe swirl swish swoon swoop swore sworn
swung synod syrup tabby taboo tacit tacky tacos taffy tails taint taken taker takes tales talks tally talon
tamed tamer tango tangy tanks taper tapir tardy tarot tasty tatty taunt tawny taxed taxes taxis teams tears
teary tease teddy teens teeth tempo temps tempt tends tenet tenor tense tenth tents tepee tepid terms terse
tests testy texts thaws theft their there these thief thigh third thong those threw throb thrum thump thyme
tiara tibia tidal tided tides tiers tight tilde tiled tiles tilts timed timer times timid tinge tints tipsy
tired tires titan title toddy token tolls tombs tonal toned toner tones tonic tools tooth topaz torso totem
tough tours towed towel towns toxic toxin tract trait tramp trams traps trash trawl trays tread trees tress
triad trice tried tries trill trims tripe trips trite troll troop trope trots trout trove truce truer truly
trump trunk truss tryst tubas tubby tubes tummy tumor tunas tuned tuner tunes tunic turbo turns twang tweak
tweed tweet twice twigs twine twins twirl tying udder ulcer ultra umbra uncut undid undue unfed unfit unify
union unite units unlit unmet untie until unwed unzip upend upset urged urges urine usage users usher using
usurp utile utter vague valet valor valve vamps vault vaunt vegan veils veins venom vents venue verbs verge
verse verso verve vests vexed vials vibes vicar views vigil vigor villa vines vinyl viola viper viral virus
visas visor vista vixen vodka vogue voids voila volts vomit voted voter votes vouch vowed vowel wacky waded
wader wades wafer wager wages wagon waist waits waive waked waken wakes walks walls wands waned wanes wants
wards wares warms warns warps warty washy waste watts waved waver waves waxed waxen waxes weary weave wedge
weeds weedy weeks weeps weigh weird wells whack wharf whelp where which whiff while whims whine whiny whips
whirl whisk whoop whose widen wider widow wield wight wilds wills wimpy wince winch winds windy wines wings
winks wiped wiper wipes wired wires wiser wispy witch witty wives woken women woods woody wooed wooer woozy
words wordy works worms worry worse worst wound woven wowed wrack wrath wreak wrest wring wrist wrong wrote
wrung wryly yards yarns yawns yearn years yeast yells yelps yodel yokel yolks yours yucky yummy zeros zesty
zilch zippy zonal zoned zones zooms
\`.trim().split(/\\s+/);
\`\`\`

## src/components/five/Keyboard.jsx
\`\`\`jsx
import { useMemo } from 'react';
import Blob from './Blob';
import { keyboardShape } from './geometry';

/** QWERTY in one fused blob, one colour throughout: only the board shows how a guess scored. */
export default function Keyboard({ size, pressed, onPress }) {
  const shape = useMemo(() => keyboardShape(size), [size]);
  return (
    <div className="relative shrink-0" style={{ width: shape.width, height: shape.height }}>
      <Blob width={shape.width} height={shape.height} shapes={shape.shapes} goo={4} />
      {shape.keys.map(({ key, x, y, w, h }) => {
        const wide = key.length > 1;
        // The press mark: a circle inside a round key, a capsule inside a wide or tall one.
        const mw = wide ? w - 8 : Math.min(size.mark, w - 4);
        const mh = w === h ? mw : Math.min(size.mark, h - 8);
        return (
          <button
            key={key}
            type="button"
            className={\`fv-key \${pressed === key ? 'fv-key-down' : ''}\`}
            style={{ left: x, top: y, width: w, height: h, fontSize: size.font }}
            onClick={() => onPress(key)}
            aria-label={key === 'Del' ? 'Delete' : key}
          >
            {pressed === key && <span className="fv-key-mark" style={{ width: mw, height: mh }} />}
            <span className="relative">{key}</span>
          </button>
        );
      })}
    </div>
  );
}
\`\`\`

## src/components/five/ResultCard.jsx
\`\`\`jsx
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Blob from './Blob';
import { MARK_COLOR } from './Tile';
import { ROWS } from './game';
import { scallopShape } from './geometry';
import { useCountdown } from './useCountdown';

const fade = (delay) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay } });

function Grid({ rows, dot, gap }) {
  return (
    <div className="grid w-max grid-cols-5" style={{ gap }} aria-hidden="true">
      {rows.flatMap(({ marks }, r) => marks.map((mark, c) => (
        <motion.span key={\`\${r}-\${c}\`} className="fv-grid-dot" style={{ width: dot, height: dot, background: MARK_COLOR[mark] }} {...fade(0.45 + (r * 5 + c) * 0.035)} />
      )))}
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div>
    <div className="text-[14px] leading-none">{label}</div>
    <div className="fv-serif mt-[5px] text-[29px] leading-none">{value}</div>
  </div>
);

/** The scalloped result window over a veiled page; the veil (or Escape) closes it. */
export default function ResultCard({ mobile, zoom, rows, won, stats, copied, onShare, onClose }) {
  const [width, height] = mobile ? [342, 560] : [666, 410];
  const shapes = useMemo(() => scallopShape(width, height), [width, height]);
  const next = useCountdown();
  const pct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  const shareAt = 0.45 + rows.length * 5 * 0.035 + 0.1;
  const share = (
    <motion.button type="button" className={\`fv-share \${copied ? 'fv-share-done' : ''} \${mobile ? 'w-full' : ''}\`} onClick={onShare} {...fade(shareAt)}>
      {copied ? 'Copied' : 'Share'}
    </motion.button>
  );
  const statList = [['Played', stats.played], ['Win', \`\${pct}%\`], ['Streak', stats.streak], ['Next', next]];

  return (
    // Fixed to the window (outside the zoomed page), so the card is centred in view even on a scrolled phone page.
    <motion.div className="fixed inset-0 z-20 flex overflow-auto p-[12px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <button type="button" className="fv-veil fixed inset-0 cursor-default" aria-label="Close result" onClick={onClose} />
      <motion.div className="relative m-auto shrink-0" style={{ width, height, zoom }} {...fade(0.2)} role="dialog" aria-modal="true" aria-label={won ? \`Solved in \${rows.length} of \${ROWS}\` : 'Result'}>
        <Blob width={width} height={height} shapes={shapes} goo={3} tint="var(--swatch-5)" tintInset={mobile ? 26 : 30} tintBlur={mobile ? 14 : 18} />
        {mobile ? (
          <div className="relative flex h-full flex-col items-center justify-between px-[40px] pb-[40px] pt-[44px]">
            <div className="text-center">
              <div className="text-[16px] leading-none">{won ? 'Solved in' : 'Not this time'}</div>
              <div className="fv-serif mt-[6px] text-[96px] leading-[0.9]">{won ? rows.length : 'X'}/{ROWS}</div>
            </div>
            <Grid rows={rows} dot={30} gap={6} />
            <div className="grid w-full grid-cols-[1fr_auto] gap-x-4 gap-y-4 pl-[10px]">
              {statList.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
            </div>
            {share}
          </div>
        ) : (
          <div className="relative flex h-full flex-col justify-between px-[88px] pb-[72px] pt-[89px]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[16px] leading-none">{won ? 'Solved in' : 'Not this time'}</div>
                <div className="fv-serif -ml-[3px] mt-[2px] text-[116px] leading-[0.92]">{won ? rows.length : 'X'}/{ROWS}</div>
              </div>
              <div className="pt-[17px]"><Grid rows={rows} dot={24} gap={5} /></div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex gap-[24px]">
                {statList.map(([label, value]) => <Stat key={label} label={label} value={value} />)}
              </div>
              {share}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
\`\`\`

## src/components/five/storage.js
\`\`\`js
// Per device, as the design asks: today's board, the running stats and the last day played.
const BOARD = 'five:board';
const STATS = 'five:stats';
const EMPTY_STATS = { played: 0, wins: 0, streak: 0, lastPlayed: null, lastWon: null };

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; the game still plays, it just won't survive a refresh.
  }
};

/** Today's guesses, or none when the saved board is from another day. */
export const loadBoard = (day) => {
  const saved = read(BOARD);
  return saved?.day === day && Array.isArray(saved.words) ? saved.words : [];
};
export const saveBoard = (day, words) => write(BOARD, { day, words });

export const loadStats = () => ({ ...EMPTY_STATS, ...read(STATS) });

const yesterdayOf = (day) => {
  const [y, m, d] = day.split('-').map(Number);
  const prev = new Date(y, m - 1, d - 1);
  return \`\${prev.getFullYear()}-\${String(prev.getMonth() + 1).padStart(2, '0')}-\${String(prev.getDate()).padStart(2, '0')}\`;
};

/** Counts today's finished game once, whatever reloads happen around it. */
export function recordResult(day, won) {
  const stats = loadStats();
  if (stats.lastPlayed === day) return stats;
  const next = {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    streak: won ? (stats.lastWon === yesterdayOf(day) ? stats.streak + 1 : 1) : 0,
    lastPlayed: day,
    lastWon: won ? day : stats.lastWon,
  };
  write(STATS, next);
  return next;
}
\`\`\`

## src/components/five/Tile.jsx
\`\`\`jsx
import { FLIP_MS, FLIP_STAGGER } from './useFive';

export const MARK_COLOR = { correct: 'var(--swatch-2)', present: 'var(--swatch-3)', absent: 'var(--swatch-4)' };

/** One board circle: an empty ring, a typed letter (pops in), or a revealed letter (flips to its colour). */
export default function Tile({ letter, mark, flip, index, size, font, cx, cy }) {
  const state = mark ? 'fv-tile-mark' : letter ? 'fv-tile-typed' : 'fv-tile-empty';
  const motion = mark && flip ? { animationDelay: \`\${index * FLIP_STAGGER}ms\`, animationDuration: \`\${FLIP_MS}ms\` } : undefined;
  return (
    <div
      className={\`fv-tile \${state} \${flip && mark ? 'fv-flip' : ''} \${letter && !mark ? 'fv-pop' : ''}\`}
      style={{ width: size, height: size, left: cx - size / 2, top: cy - size / 2, '--mark': MARK_COLOR[mark], ...motion }}
    >
      {mark && <span className="fv-fill" style={motion} />}
      {letter && <span className="fv-serif relative" style={{ fontSize: font }}>{letter.toUpperCase()}</span>}
    </div>
  );
}
\`\`\`

## src/components/five/Toast.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import Blob from './Blob';

const D = 31;
const PITCH = 31.5;
const GAP = 23;

// The bubbles sit on one line; the letters inside ride a slow wave along the word, as in the clip.
function Word({ word, offset }) {
  const shapes = [...word].map((_, i) => ({ x: i * PITCH, y: 4, w: D }));
  const width = (word.length - 1) * PITCH + D;
  return (
    <div className="relative" style={{ width, height: D + 8 }}>
      <Blob width={width} height={D + 8} shapes={shapes} goo={3} />
      {[...word].map((ch, i) => (
        <span key={i} className="fv-serif fv-wave absolute flex items-center justify-center text-[20px] leading-none" style={{ left: i * PITCH, top: 4, width: D, height: D, animationDelay: \`\${-(offset + i) * 0.17}s\` }}>
          {ch}
        </span>
      ))}
    </div>
  );
}

/** A short message above the board: each letter in its own white circle, each word one fused blob. */
export default function Toast({ toast }) {
  return (
    <div className="pointer-events-none relative h-[43px] w-full" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="absolute inset-0 flex items-center justify-center" style={{ gap: GAP }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {toast.text.split(' ').map((word, i, all) => (
              <Word key={i} word={word} offset={all.slice(0, i).join('').length} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\`\`\`

## src/components/five/useCountdown.js
\`\`\`js
import { useEffect, useState } from 'react';
import { untilMidnight } from './game';

/** The live time left until the next puzzle (local midnight), ticking every second. */
export function useCountdown() {
  const [left, setLeft] = useState(() => untilMidnight());
  useEffect(() => {
    const id = setInterval(() => setLeft(untilMidnight()), 250);
    return () => clearInterval(id);
  }, []);
  return left;
}
\`\`\`

## src/components/five/useFive.js
\`\`\`js
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LENGTH, ROWS, isWord, puzzleFor, score, shareText } from './game';
import { loadBoard, loadStats, recordResult, saveBoard } from './storage';

// The clip's reveal: tiles 200ms apart (the prompt's 250 reads slower than the film).
export const FLIP_STAGGER = 200;
export const FLIP_MS = 400;
const REVEAL_MS = FLIP_STAGGER * (LENGTH - 1) + FLIP_MS;
const TOAST_MS = 1200;

const finished = (words, answer) => words.includes(answer) || words.length >= ROWS;

/** The whole game: today's puzzle, the board, typing, reveal timing, toasts, stats and sharing. */
export function useFive() {
  const [puzzle, setPuzzle] = useState(() => puzzleFor());
  const [words, setWords] = useState(() => loadBoard(puzzle.day));
  const [current, setCurrent] = useState('');
  const [revealing, setRevealing] = useState(-1);
  const [shake, setShake] = useState(0);
  const [toast, setToast] = useState(null);
  const [pressed, setPressed] = useState(null);
  const [stats, setStats] = useState(() => loadStats());
  const [resultOpen, setResultOpen] = useState(() => finished(words, puzzle.answer));
  const [copied, setCopied] = useState(false);
  const timers = useRef([]);
  const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const rows = useMemo(() => words.map((word) => ({ word, marks: score(word, puzzle.answer) })), [words, puzzle.answer]);
  const shown = revealing >= 0 ? rows.slice(0, revealing) : rows;
  const won = words.includes(puzzle.answer);
  const over = finished(words, puzzle.answer);

  const showToast = useCallback((text) => {
    const id = Date.now();
    setToast({ text, id });
    timers.current.push(setTimeout(() => setToast((t) => (t?.id === id ? null : t)), TOAST_MS));
  }, []);

  // Keys can land faster than renders (a quick typist, a replayed demo), so input reads the live board.
  const live = useRef({});
  live.current = { words, current, locked: over || revealing >= 0, puzzle };
  const type = (value) => {
    live.current.current = value;
    setCurrent(value);
  };

  const submit = () => {
    const { words: done, current: word, puzzle: today } = live.current;
    if (word.length < LENGTH || !isWord(word)) {
      setShake((n) => n + 1);
      showToast(word.length < LENGTH ? 'Not enough letters' : 'Not a word');
      return;
    }
    const next = [...done, word];
    live.current.locked = true;
    setWords(next);
    type('');
    setRevealing(done.length);
    saveBoard(today.day, next);
    const win = next.includes(today.answer);
    // Recorded with the board, not after the reveal: a tab closed mid-reveal would lose the day's result.
    const result = finished(next, today.answer) && recordResult(today.day, win);
    later(REVEAL_MS, () => {
      setRevealing(-1);
      if (!result) return;
      setStats(result);
      showToast(win ? 'Splendid' : today.answer.toUpperCase());
      later(win ? 600 : TOAST_MS, () => setResultOpen(true));
    });
  };

  const press = (key) => {
    setPressed(key);
    later(140, () => setPressed((k) => (k === key ? null : k)));
    const { locked, current: word } = live.current;
    if (locked) return;
    if (key === 'Enter') submit();
    else if (key === 'Del') type(word.slice(0, -1));
    else if (word.length < LENGTH) type(word + key.toLowerCase());
  };
  const pressRef = useRef(press);
  pressRef.current = press;

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.key === 'Escape') return setResultOpen(false);
      if (resultOpen) return;
      const key = e.key === 'Enter' ? 'Enter' : e.key === 'Backspace' ? 'Del' : /^[a-z]$/i.test(e.key) ? e.key.toUpperCase() : null;
      if (!key) return;
      e.preventDefault();
      pressRef.current(key);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resultOpen]);

  // A new puzzle starts at local midnight, even with the page left open.
  useEffect(() => {
    const id = setInterval(() => {
      const today = puzzleFor();
      if (today.day === puzzle.day) return;
      // Drop a reveal still running from yesterday; its result is already recorded for yesterday (see submit).
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setRevealing(-1);
      setToast(null);
      setPressed(null);
      setStats(loadStats());
      setPuzzle(today);
      setWords(loadBoard(today.day));
      type('');
      setResultOpen(false);
      setCopied(false);
    }, 15000);
    return () => clearInterval(id);
  }, [puzzle.day]);

  const share = async () => {
    const text = shareText(rows, won, puzzle);
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(area);
      area.select();
      ok = document.execCommand('copy');
      area.remove();
    }
    if (ok) setCopied(true);
    else showToast("Couldn't copy");
  };

  return {
    puzzle, rows, current, revealing, shake, toast, pressed, stats, won, over, copied,
    tries: over && revealing < 0 ? words.length : Math.min(shown.length + 1, ROWS),
    resultOpen, openResult: () => setResultOpen(true), closeResult: () => setResultOpen(false),
    press, share,
  };
}
\`\`\`

## src/components/five/useLayout.js
\`\`\`js
import { useEffect, useState } from 'react';

const BREAKPOINT = 900;
const DESKTOP = [1280, 720];
const PHONE = 390;
// Tablets get the phone column a little larger, never wider than its max width.
const MAX_PHONE_ZOOM = 1.25;

/**
 * From 900px wide: the clip's 1280×720 stage, zoomed to fit the window both ways (the stage grows along the free
 * axis so the corner shapes stay in the window's corners). Below: the phone column, drawn 390px wide and zoomed to
 * the window's width only; it is at least the window's height and grows past it, so a short window scrolls instead
 * of clipping. Re-renders on any resize, height-only ones included.
 */
export function useLayout() {
  const [[w, h], setView] = useState(() => (typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight]));
  useEffect(() => {
    const onResize = () => setView([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  if (w < BREAKPOINT) {
    const zoom = Math.min(w / PHONE, MAX_PHONE_ZOOM);
    return { mobile: true, zoom, width: w / zoom, height: h / zoom };
  }
  const zoom = Math.min(w / DESKTOP[0], h / DESKTOP[1]);
  return { mobile: false, zoom, width: w / zoom, height: h / zoom };
}
\`\`\`

## src/pages/Five.jsx
\`\`\`jsx
import { AnimatePresence, MotionConfig } from 'framer-motion';
import '@/components/five/five.css';
import Board from '@/components/five/Board';
import Keyboard from '@/components/five/Keyboard';
import Toast from '@/components/five/Toast';
import ResultCard from '@/components/five/ResultCard';
import { DayBubble, Logo, TriesBubble } from '@/components/five/Corners';
import { ROWS } from '@/components/five/game';
import { SIZES } from '@/components/five/geometry';
import { useFive } from '@/components/five/useFive';
import { useLayout } from '@/components/five/useLayout';

const Label = ({ className = '' }) => <p className={\`text-[17px] font-semibold leading-[21px] \${className}\`}>Daily Word<br />Puzzle</p>;

export default function Five() {
  const game = useFive();
  const { mobile, zoom, width, height } = useLayout();
  const size = SIZES[mobile ? 'mobile' : 'desktop'];
  const board = <Board size={size} rows={game.rows} current={game.current} revealing={game.revealing} shake={game.shake} />;
  const keyboard = <Keyboard size={size.key} pressed={game.pressed} onPress={game.press} />;
  const tries = <TriesBubble tries={game.tries} total={ROWS} onOpen={game.over && !game.resultOpen && game.revealing < 0 ? game.openResult : undefined} scale={mobile ? 0.72 : 1} />;

  return (
    <MotionConfig reducedMotion="user">
      <div className={\`fv relative w-full \${mobile ? 'min-h-screen' : 'h-screen overflow-hidden'}\`}>
        <div className="relative" style={mobile ? { zoom, width, minHeight: height } : { zoom, width, height }}>
          {mobile ? (
            // Each part keeps its own space: at least a 14px gap, more when the window is taller.
            <div className="mx-auto flex max-w-[440px] flex-col justify-between gap-[14px] px-[24px] pb-[max(16px,env(safe-area-inset-bottom))] pt-[max(20px,env(safe-area-inset-top))]" style={{ minHeight: height }}>
              <div>
                <Logo scale={0.6} />
                <Label className="mt-[6px] text-[15px] leading-[19px]" />
              </div>
              <Toast toast={game.toast} />
              <div className="flex justify-center">{board}</div>
              <div className="flex justify-center">{keyboard}</div>
              <div className="flex items-end justify-between">
                <DayBubble label={game.puzzle.label} scale={0.72} />
                {tries}
              </div>
            </div>
          ) : (
            <>
              <div className="absolute left-[48px] top-[60px]"><Logo /></div>
              <Label className="absolute left-[50px] top-[155px]" />
              <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: (height - 720) / 2 }}>
                <div className="mt-[30px] w-full"><Toast toast={game.toast} /></div>
                <div className="mt-[24px]">{board}</div>
                <div className="mt-[25px]">{keyboard}</div>
              </div>
              <div className="absolute bottom-[53px] left-[87px]"><DayBubble label={game.puzzle.label} /></div>
              <div className="absolute bottom-[53px] right-[88px]">{tries}</div>
            </>
          )}
        </div>
        <AnimatePresence>
          {game.resultOpen && (
            <ResultCard mobile={mobile} zoom={zoom} rows={game.rows} won={game.won} stats={game.stats} copied={game.copied} onShare={game.share} onClose={game.closeResult} />
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};