var e=`# trivia_quiz — app files

## src/components/floorspin/faces.js
\`\`\`js
import { clamp01, easeOutCubic, shake } from './useGameClock';

export const LETTERS = ['A', 'B', 'C', 'D'];
export const FLASH_MS = 90;
export const REVEAL_RIGHT_MS = 450;
const DIM = 0.28;

const plain = (text) => ({ text, fill: 'face', opacity: 1, popAt: null, shakeAt: null });

/**
 * What each floor's answer face shows at \`t\` for a view: its text, its fill ('face' | 'flash' |
 * 'correct' | 'wrong'), the text opacity, and when it popped or shook.
 */
export function faceStates(view, t) {
  if (view.kind === 'summary') return view.lines.map(plain);
  const { q, result, revealAt: at } = view;
  return q.answers.map((text, i) => {
    if (!result) return plain(text);
    const right = i === q.correct;
    const chose = i === result.chosen;
    if (right && chose) return { text, fill: t - at < FLASH_MS ? 'flash' : 'correct', opacity: 1, popAt: at, shakeAt: null };
    if (chose) return { text, fill: 'wrong', opacity: 1, popAt: null, shakeAt: at };
    if (right && t - at >= REVEAL_RIGHT_MS) return { text, fill: 'correct', opacity: 1, popAt: at + REVEAL_RIGHT_MS, shakeAt: null };
    return { text, fill: 'face', opacity: DIM, popAt: null, shakeAt: null };
  });
}

/** A popped floor grows to 1.045 and holds; \`release\` (0..1) brings it back, e.g. as it spins away. */
export const popScale = (face, t, release = 0) =>
  face.popAt == null || t < face.popAt ? 1 : 1 + 0.045 * easeOutCubic(clamp01((t - face.popAt) / 160)) * (1 - release);

export const shakeX = (face, t) => shake(t, face.shakeAt, 22);

/** Answer text fitted to a width at most \`max\`px, measured in the display face once its font is in. */
const canvas = typeof document !== 'undefined' ? document.createElement('canvas').getContext('2d') : null;
export function fitSize(text, width, max) {
  if (!canvas) return max;
  canvas.font = \`900 100px "Big Shoulders Display", "Arial Narrow", sans-serif\`;
  const measured = canvas.measureText(text.toUpperCase()).width;
  return measured ? Math.min(max, (100 * width) / measured) : max;
}

/** The largest size from \`max\` down to \`min\` at which \`text\` wraps into at most \`lines\` lines of \`width\`. */
export function fitLines(text, width, max, min, lines) {
  if (!canvas) return max;
  const words = text.toUpperCase().split(' ');
  for (let size = max; size > min; size -= 1) {
    canvas.font = \`900 \${size}px "Big Shoulders Display", "Arial Narrow", sans-serif\`;
    let count = 1;
    let line = '';
    for (const word of words) {
      const next = line ? \`\${line} \${word}\` : word;
      if (canvas.measureText(next).width > width && line) { count += 1; line = word; } else line = next;
    }
    if (count <= lines) return size;
  }
  return min;
}
\`\`\`

## src/components/floorspin/floorspin.css
\`\`\`css
@font-face{font-family:"Big Shoulders Display";font-weight:800;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/big-shoulders-display-800-normal.woff2) format("woff2")}
@font-face{font-family:"Big Shoulders Display";font-weight:900;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/big-shoulders-display-900-normal.woff2) format("woff2")}
@font-face{font-family:"Unbounded";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/unbounded-700-normal.woff2) format("woff2")}
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-serif-400-italic.woff2) format("woff2")}

/* The look (Lilac): 1 ground, 2 ink, 3–6 floors A–D (-ink: the letter on each), 7 answer face, 8 score star (-ink: its text). */
:root{
  --swatch-1:#C99AF0;--swatch-1-ink:#3A1410;
  --swatch-2:#3A1410;--swatch-2-ink:#C99AF0;
  --swatch-3:#FF5A0A;--swatch-3-ink:#3A1410;
  --swatch-4:#FF8FC4;--swatch-4-ink:#3A1410;
  --swatch-5:#8A3A1C;--swatch-5-ink:#FFD9D2;
  --swatch-6:#FF1F1F;--swatch-6-ink:#FFD9D2;
  --swatch-7:#FFD9D2;--swatch-7-ink:#3A1410;
  --swatch-8:#FF5A0A;--swatch-8-ink:#3A1410;
  --ui-correct:#2F9E44;--ui-wrong:#3A1410;--ui-on-result:#FFFFFF;
}
/* gallery-look */

.fs{background:var(--swatch-1);color:var(--swatch-2);font-family:"Big Shoulders Display","Arial Narrow",sans-serif;font-weight:900;
  touch-action:manipulation;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased}
.fs-display{font-family:"Big Shoulders Display","Arial Narrow",sans-serif;font-weight:900;text-transform:uppercase}
.fs-serif{font-family:"Instrument Serif",Georgia,serif;font-style:italic;font-weight:400}
.fs-wordmark{font-family:"Unbounded","Futura",sans-serif;font-weight:700;text-transform:uppercase}
.fs-balance{text-wrap:balance}

/* Tower faces: flat fills, no outlines. Roofs are the floor colour darkened by 22%. */
.fs-floor-0{--fl:var(--swatch-3);--fl-ink:var(--swatch-3-ink)}
.fs-floor-1{--fl:var(--swatch-4);--fl-ink:var(--swatch-4-ink)}
.fs-floor-2{--fl:var(--swatch-5);--fl-ink:var(--swatch-5-ink)}
.fs-floor-3{--fl:var(--swatch-6);--fl-ink:var(--swatch-6-ink)}
.fs-side{fill:var(--fl)}
.fs-roof{fill:color-mix(in srgb,var(--fl) 78%,black)}
.fs-letter-0{fill:var(--swatch-3-ink)}.fs-letter-1{fill:var(--swatch-4-ink)}.fs-letter-2{fill:var(--swatch-5-ink)}.fs-letter-3{fill:var(--swatch-6-ink)}
.fs-letter,.fs-answer-text{font-family:"Big Shoulders Display","Arial Narrow",sans-serif;font-weight:900;text-transform:uppercase}
.fs-answer-text{fill:var(--swatch-2)}
.fs-answer-text-lit{fill:var(--ui-on-result)}
.fs-fill-face{fill:var(--swatch-7);background:var(--swatch-7)}
.fs-fill-flash{fill:var(--swatch-8);background:var(--swatch-8)}
.fs-fill-correct{fill:var(--ui-correct);background:var(--ui-correct)}
.fs-fill-wrong{fill:var(--ui-wrong);background:var(--ui-wrong)}
/* Only the drawn floors take taps (the SVG spans the stage): controls beside the tower stay clickable. */
.fs-tower{pointer-events:none}
.fs-tower polygon,.fs-tower text{pointer-events:visiblePainted}

/* Tiles (tablet and phone). */
.fs-tile-letter{background:var(--fl);color:var(--fl-ink)}
.fs-tile-text{color:var(--swatch-2)}
.fs-tile-text-lit{color:var(--ui-on-result)}

.fs-star{fill:var(--swatch-8)}
.fs-star-text{color:var(--swatch-8-ink)}
.fs-hot{color:var(--swatch-8)}
.fs-ring{border-color:var(--swatch-2);color:var(--swatch-2)}
.fs-pill{background:var(--swatch-2);color:var(--swatch-1)}
.fs-ink-bg{background:var(--swatch-2)}
\`\`\`

## src/components/floorspin/Header.jsx
\`\`\`jsx
import { formatScore } from './round';
import { clamp01, easeOutCubic, pulse } from './useGameClock';

const STAR = Array.from({ length: 64 }, (_, i) => {
  const r = i % 2 ? 39 : 50;
  const a = (Math.PI * i) / 32;
  return \`\${(50 + r * Math.sin(a)).toFixed(2)},\${(50 - r * Math.cos(a)).toFixed(2)}\`;
}).join(' ');

/** The solid ink diamond and the wordmark; \`size\` is the diamond's square side. */
export function Logo({ size, gap, fontSize, tracking }) {
  return (
    <div className="flex items-center" style={{ gap }}>
      <span className="fs-ink-bg block rotate-45" style={{ width: size, height: size, margin: size * 0.21 }} aria-hidden="true" />
      <span className="fs-wordmark leading-none" style={{ fontSize, letterSpacing: tracking }}>Floorspin</span>
    </div>
  );
}

/** The 32-point score sticker: wobbles always, pops when points land, floats "+N" beside it, shrinks away on a restart. */
export function ScoreStar({ t, score, scoreAt, gain, size, plusSide = 'right', plusSize, presence = 1 }) {
  const wobble = -10 + 3 * Math.sin((t / 2400) * Math.PI * 2);
  const scale = (1 + 0.3 * pulse(t, scoreAt, 380)) * presence;
  const float = scoreAt == null ? 1 : clamp01((t - scoreAt) / 1100);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute inset-0" style={{ transform: \`rotate(\${wobble}deg) scale(\${scale})\` }}>
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true"><polygon points={STAR} className="fs-star" /></svg>
        <div className="fs-star-text absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="fs-serif" style={{ fontSize: size * 0.141 }}>score</span>
          <span className="fs-display" style={{ fontSize: size * 0.283, marginTop: size * 0.01 }}>{formatScore(score)}</span>
        </div>
      </div>
      {float < 1 && (
        <span className="fs-display pointer-events-none absolute whitespace-nowrap leading-none"
          style={{
            fontSize: plusSize, top: size * 0.05, [plusSide === 'right' ? 'left' : 'right']: size * 1.05,
            transform: \`translateY(\${-plusSize * 0.7 * easeOutCubic(float)}px)\`, opacity: 1 - float ** 2,
          }}>+{gain}</span>
      )}
    </div>
  );
}
\`\`\`

## src/components/floorspin/Nav.jsx
\`\`\`jsx
const Chevron = ({ flip, size }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Double = ({ size }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path d="M5 6l6 6-6 6M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Restart = ({ size }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Previous and next circles, the SKIP pill (NEXT while an answer shows) and, once played, Restart; what can't be used sits at 30%. */
export function Nav({ size, border, text, gap, canPrev, canNext, canSkip, revealing, onPrev, onNext, onSkip, onRestart }) {
  const circle = 'fs-ring flex flex-none items-center justify-center rounded-full disabled:opacity-30';
  return (
    <div className="flex items-center" style={{ gap }}>
      <button type="button" aria-label="Previous question" className={circle} style={{ width: size, height: size, borderWidth: border }}
        disabled={!canPrev} onClick={onPrev}><Chevron flip size={size * 0.44} /></button>
      <button type="button" aria-label="Next question" className={circle} style={{ width: size, height: size, borderWidth: border }}
        disabled={!canNext} onClick={onNext}><Chevron size={size * 0.44} /></button>
      <button type="button" className="fs-pill fs-display flex flex-none items-center rounded-full disabled:opacity-30"
        style={{ height: size, fontSize: text, letterSpacing: text * 0.06, paddingInline: size * 0.47, gap: text * 0.3 }}
        disabled={!canSkip} onClick={revealing ? onNext : onSkip}>{revealing ? 'Next' : 'Skip'}<Double size={text * 0.95} /></button>
      {onRestart && (
        <button type="button" aria-label="Restart the game" title="Restart" className={circle} style={{ width: size, height: size, borderWidth: border }}
          onClick={onRestart}><Restart size={size * 0.44} /></button>
      )}
    </div>
  );
}
\`\`\`

## src/components/floorspin/QuestionBlock.jsx
\`\`\`jsx
import { ROUND_LENGTH, formatScore } from './round';
import { clamp01, easeOutCubic } from './useGameClock';
import { FADE_MS } from './useFloorspin';

const pad = (n) => String(n).padStart(2, '0');

/** Which text shows and how: the old one fades out sliding up, the new one fades in from below. */
function motion(t, game, view, from, slide) {
  if (game.phase === 'reveal') {
    const p = game.leapAt == null ? 0 : clamp01((t - game.leapAt) / FADE_MS);
    return { shown: view, opacity: 1 - p, y: -slide * p };
  }
  if (game.phase !== 'spin') return { shown: view, opacity: 1, y: 0 };
  const since = t - game.spinAt;
  if (since < 500) {
    const p = game.fromReveal ? 1 : clamp01(since / 300);
    return { shown: from, opacity: 1 - p, y: -slide * p };
  }
  const p = easeOutCubic(clamp01((since - 500) / 450));
  return { shown: view, opacity: p, y: slide * (1 - p) };
}

/** The counter and the question, or the end-of-round summary. */
export function QuestionBlock({ t, game, view, from, bestStreak, bestScore, toGo, sizes }) {
  const { shown, opacity, y } = motion(t, game, view, from, sizes.slide);
  return (
    <div style={{ opacity, transform: \`translateY(\${y}px)\` }}>
      {shown.kind === 'summary' ? (
        <>
          <h1 className="fs-display whitespace-nowrap leading-none" style={{ fontSize: sizes.done }}>Round done</h1>
          <p className="fs-wordmark" style={{ fontSize: sizes.note, letterSpacing: sizes.note * 0.12, lineHeight: 1.75, marginTop: sizes.note * 2.2 }}>
            Best score {formatScore(bestScore)}<br />Best streak {bestStreak}
            {toGo > 0 && <><br />{toGo} questions to go</>}
          </p>
        </>
      ) : (
        <>
          <p className="fs-display leading-none" style={{ fontSize: sizes.counter, fontWeight: 800, marginBottom: sizes.counterGap }}>
            {pad(shown.index + 1)} <span className="opacity-[0.45]">/ {ROUND_LENGTH}</span>
          </p>
          <h1 className="fs-display fs-balance" style={{ fontSize: sizes.question(shown.q.text), lineHeight: 1 }}>{shown.q.text}</h1>
        </>
      )}
    </div>
  );
}
\`\`\`

## src/components/floorspin/questions.js
\`\`\`js
// 15 questions, 3 per category; \`correct\` is the index of the right answer.
export const LEVELS = [
  { name: 'Easy', points: 150 },
  { name: 'Medium', points: 200 },
  { name: 'Hard', points: 250 },
];

export const QUESTIONS = [
  { category: 'Science', level: 0, text: 'How many legs does a spider have?', answers: ['Six', 'Eight', 'Ten', 'Twelve'], correct: 1 },
  { category: 'History', level: 0, text: 'Which ancient civilisation built the pyramids of Giza?', answers: ['Romans', 'Greeks', 'Egyptians', 'Persians'], correct: 2 },
  { category: 'Geography', level: 0, text: 'Which is the largest ocean on Earth?', answers: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1 },
  { category: 'Sports', level: 0, text: 'How many players does a soccer team have on the field?', answers: ['Nine', 'Ten', 'Eleven', 'Twelve'], correct: 2 },
  { category: 'Pop Culture', level: 0, text: 'What colour is Pikachu?', answers: ['Red', 'Blue', 'Yellow', 'Green'], correct: 2 },
  { category: 'Geography', level: 1, text: 'What is the capital of Canada?', answers: ['Toronto', 'Ottawa', 'Montreal', 'Vancouver'], correct: 1 },
  { category: 'History', level: 1, text: 'In which year did the Berlin Wall fall?', answers: ['1985', '1989', '1991', '1993'], correct: 1 },
  { category: 'Science', level: 1, text: 'Which gas do plants absorb from the air?', answers: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correct: 2 },
  { category: 'Sports', level: 1, text: 'In which sport would you perform a slam dunk?', answers: ['Volleyball', 'Tennis', 'Basketball', 'Handball'], correct: 2 },
  { category: 'Pop Culture', level: 1, text: 'Which band sang "Bohemian Rhapsody"?', answers: ['The Beatles', 'Queen', 'ABBA', 'The Rolling Stones'], correct: 1 },
  { category: 'Science', level: 2, text: 'What is the chemical symbol for gold?', answers: ['Ag', 'Au', 'Gd', 'Go'], correct: 1 },
  { category: 'Geography', level: 2, text: 'Which country has the most natural lakes?', answers: ['Russia', 'USA', 'Canada', 'Finland'], correct: 2 },
  { category: 'History', level: 2, text: 'Who was the first emperor of Rome?', answers: ['Caesar', 'Nero', 'Augustus', 'Constantine'], correct: 2 },
  { category: 'Sports', level: 2, text: 'Which country has won the most FIFA World Cups?', answers: ['Germany', 'Italy', 'Argentina', 'Brazil'], correct: 3 },
  { category: 'Pop Culture', level: 2, text: 'Who directed the film "Jurassic Park"?', answers: ['James Cameron', 'Steven Spielberg', 'George Lucas', 'Ridley Scott'], correct: 1 },
];
\`\`\`

## src/components/floorspin/round.js
\`\`\`js
import { LEVELS, QUESTIONS } from './questions';

export const ROUND_LENGTH = 15;
export const QUESTION_MS = 10000;

const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const shuffleAnswers = (q) => {
  const order = shuffle([0, 1, 2, 3]);
  return { ...q, answers: order.map((i) => q.answers[i]), correct: order.indexOf(q.correct) };
};

/** A round: each tier shuffled, easy → hard, answers shuffled. \`fixed\` keeps the data order (the first round). */
export function buildRound(fixed = false) {
  return LEVELS.flatMap((_, level) => {
    const tier = QUESTIONS.filter((q) => q.level === level);
    return fixed ? tier : shuffle(tier).map(shuffleAnswers);
  });
}

export const pointsFor = (question, streak) => LEVELS[question.level].points + streak * 10;

// The app opens on its sample round already under way: question 3, 1,250 points, a streak of 4.
export const OPENING = { index: 2, score: 1250, streak: 4 };

export const formatScore = (n) => n.toLocaleString('en-US');
\`\`\`

## src/components/floorspin/Stats.jsx
\`\`\`jsx
import { LEVELS } from './questions';
import { pulse, shake } from './useGameClock';

// Label / VALUE: italic serif label, a 45% slash, the value in the display face.
function Stat({ label, value, sizes, gap, align, style, valueClass = '' }) {
  return (
    <div className={\`flex items-baseline \${align === 'right' ? 'justify-end' : ''}\`} style={{ gap }}>
      <span className="fs-serif leading-none" style={{ fontSize: sizes[0] }}>{label}</span>
      <span className="fs-display leading-none opacity-[0.45]" style={{ fontSize: sizes[1], fontWeight: 800 }}>/</span>
      <span className={\`fs-display inline-block leading-none \${valueClass}\`} style={{ fontSize: sizes[2], ...style }}>{value}</span>
    </div>
  );
}

/**
 * Topic, Streak, Time and Level. Desktop lines are right-aligned and 80px apart,
 * the phone's are a 2×2 grid. The streak pops as it rises and shakes when it resets; time runs hot under 4s.
 */
export function Stats({ t, game, statsView, seconds, layout }) {
  const q = statsView?.q;
  const streak = (
    <Stat label="Streak" value={game.streak}
      style={{ transform: \`translateX(\${shake(t, game.streakResetAt, 10)}px) scale(\${1 + 0.25 * pulse(t, game.streakUpAt, 320)})\`, transformOrigin: 'center' }}
      {...layout.stat('big')} />
  );
  const time = <Stat label="Time" value={seconds == null ? '—' : \`\${seconds}s\`} valueClass={seconds != null && seconds <= 3 ? 'fs-hot' : ''} {...layout.stat('big')} />;
  const topic = <Stat label="Topic" value={q?.category ?? ''} {...layout.stat('small')} />;
  const level = <Stat label="Level" value={q ? LEVELS[q.level].name : ''} {...layout.stat('small')} />;
  return layout.desktop ? (
    <div className="absolute flex flex-col items-end" style={{ right: 80, top: 380 }}>
      {[topic, streak, time, level].map((stat, i) => <div key={i} className="flex h-[80px] items-center">{stat}</div>)}
    </div>
  ) : (
    <div className="grid" style={{ gridTemplateColumns: \`\${188 * layout.k}px 1fr\`, rowGap: layout.k * 10 }}>
      {topic}{streak}{time}{level}
    </div>
  );
}
\`\`\`

## src/components/floorspin/Tiles.jsx
\`\`\`jsx
import { LETTERS, faceStates, fitSize, popScale, shakeX } from './faces';
import { clamp01, easeOutCubic } from './useGameClock';

/** A tile's place in the swap: the old set leaves up 40px (50ms apart), the new one rises 60px (60ms apart). */
function tileMotion(t, spinAt, i) {
  if (spinAt == null) return { old: false, opacity: 1, y: 0 };
  const since = t - spinAt;
  const enter = 350 + i * 60;
  if (since < enter) {
    const p = clamp01((since - i * 50) / 300);
    return { old: true, opacity: 1 - p, y: -40 * p };
  }
  const p = easeOutCubic(clamp01((since - enter) / 450));
  return { old: false, opacity: p, y: 60 * (1 - p) };
}

/** The stacked answer tiles: a letter block in the floor colour and the answer on the answer face. */
export function Tiles({ t, view, from, spinAt, onAnswer, answerable, height, gap, letterSize, textSize, width }) {
  const current = faceStates(view, t);
  const outgoing = from ? faceStates(from, t) : current;
  return (
    <div className="flex flex-col" style={{ gap }}>
      {[0, 1, 2, 3].map((floor) => {
        const m = tileMotion(t, from ? spinAt : null, floor);
        const face = m.old ? outgoing[floor] : current[floor];
        const size = Math.min(textSize, fitSize(face.text, width - height - 28, textSize));
        return (
          <button key={floor} type="button" disabled={!answerable(floor)} onPointerUp={() => answerable(floor) && onAnswer(floor)}
            onClick={(e) => e.detail === 0 && onAnswer(floor)}
            className={\`fs-floor-\${floor} flex flex-none overflow-hidden text-left disabled:cursor-default\`}
            style={{
              height, borderRadius: 12, opacity: m.opacity,
              transform: \`translate(\${shakeX(face, t)}px, \${m.y}px) scale(\${popScale(face, t)})\`,
            }}>
            <span className="fs-tile-letter fs-display flex h-full flex-none items-center justify-center" style={{ width: height, fontSize: letterSize }}>
              {LETTERS[floor]}
            </span>
            <span className={\`fs-fill-\${face.fill} flex h-full min-w-0 flex-1 items-center\`} style={{ paddingLeft: 14 }}>
              <span className={\`fs-display whitespace-nowrap leading-none \${face.fill === 'face' ? 'fs-tile-text' : 'fs-tile-text-lit'}\`}
                style={{ fontSize: size, opacity: face.opacity }}>{face.text}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
\`\`\`

## src/components/floorspin/tower.js
\`\`\`js
// The tower's projection: 4 slabs (450 wide and deep, 116 high, 24 apart) seen 13° from above and
// turned 24°, with a camera 2700 away. Points are in the 1920×1080 stage.
export const SLAB = { w: 450, h: 116, gap: 24 };
const HALF = SLAB.w / 2;
const CENTER = { x: 1150, y: 560 };
const CAMERA = 2700;
const TURN = (-24 * Math.PI) / 180;
const TILT = (13 * Math.PI) / 180;
const TOWER_TOP = -(4 * SLAB.h + 3 * SLAB.gap) / 2;

// Vertical faces by slab-local normal: 0 front, 1 right, 2 back, 3 left. A spin turns 0 towards 3.
const NORMALS = [[0, -1], [1, 0], [0, 1], [-1, 0]];

/** World → view: the slab's own spin \`angle\` (radians), the fixed turn, then the tilt. */
function toView([x, y, z], angle) {
  const a = angle + TURN;
  const x1 = x * Math.cos(a) + z * Math.sin(a);
  const z1 = -x * Math.sin(a) + z * Math.cos(a);
  return [x1, y * Math.cos(TILT) - z1 * Math.sin(TILT), y * Math.sin(TILT) + z1 * Math.cos(TILT)];
}

const project = ([x, y, z]) => {
  const s = CAMERA / (CAMERA + z);
  return [CENTER.x + x * s, CENTER.y + y * s];
};

const facesCamera = (corners) => {
  // Back-face cull: the face normal against the ray from the camera (at z = -CAMERA) to the face.
  const [a, b, c] = corners;
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  return n[0] * a[0] + n[1] * a[1] + n[2] * (a[2] + CAMERA) > 0;
};

const points = (screen) => screen.map(([x, y]) => \`\${x.toFixed(1)},\${y.toFixed(1)}\`).join(' ');

/** Slab \`floor\` (0 = top) at spin \`angle\`: its roof, its visible sides back to front, and its screen centre. */
export function slabGeometry(floor, angle) {
  const top = TOWER_TOP + floor * (SLAB.h + SLAB.gap);
  const bottom = top + SLAB.h;
  const roofWorld = [[-HALF, top, HALF], [HALF, top, HALF], [HALF, top, -HALF], [-HALF, top, -HALF]];
  const roofView = roofWorld.map((p) => toView(p, angle));
  const sides = NORMALS.map(([nx, nz], k) => {
    const [ux, uz] = [-nz, nx];
    const corner = (u, y) => toView([nx * HALF + ux * u, y, nz * HALF + uz * u], angle);
    const view = [corner(-HALF, top), corner(HALF, top), corner(HALF, bottom), corner(-HALF, bottom)];
    const [tl, tr, , bl] = view.map(project);
    return {
      k,
      visible: facesCamera(view),
      depth: view.reduce((sum, p) => sum + p[2], 0) / 4,
      points: points(view.map(project)),
      // Local face space (0..450 × 0..116) onto the screen, so text looks painted on the face.
      matrix: \`matrix(\${[(tr[0] - tl[0]) / SLAB.w, (tr[1] - tl[1]) / SLAB.w, (bl[0] - tl[0]) / SLAB.h, (bl[1] - tl[1]) / SLAB.h, tl[0], tl[1]].map((n) => n.toFixed(4)).join(',')})\`,
      screen: view.map(project),
    };
  }).filter((s) => s.visible).sort((a, b) => b.depth - a.depth);
  const mid = project(toView([0, (top + bottom) / 2, 0], angle));
  return { roof: points(roofView.map(project)), roofVisible: facesCamera(roofView), sides, center: mid };
}

/** Point-in-polygon (even-odd) for hit-testing a floor by its projected front face. */
export function insidePolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
\`\`\`

## src/components/floorspin/Tower.jsx
\`\`\`jsx
import { useRef } from 'react';
import { SLAB, insidePolygon, slabGeometry } from './tower';
import { LETTERS, faceStates, fitSize, popScale, shakeX } from './faces';
import { clamp01, easeInOutCubic } from './useGameClock';

const SPIN_EACH_MS = 1200;
const STAGGER_MS = 130;
const QUARTER = Math.PI / 2;

function FaceText({ side, children, size, className, opacity = 1 }) {
  return (
    <text transform={side.matrix} x={SLAB.w / 2} y={SLAB.h / 2} dy="0.36em" textAnchor="middle" fontSize={size}
      className={className} opacity={opacity}>{children}</text>
  );
}

function Slab({ floor, angle, outgoing, incoming, t, release }) {
  const g = slabGeometry(floor, angle);
  // Painted by where each face ends up: the face turning away keeps its answer until it is more side than front.
  const content = (k) => {
    if (k === 0) return angle < QUARTER / 2 ? outgoing : null;
    if (k === 1) return incoming;
    return null;
  };
  const scale = popScale(outgoing, t, release);
  const [cx, cy] = g.center;
  return (
    <g transform={\`translate(\${shakeX(outgoing, t)} 0) translate(\${cx} \${cy}) scale(\${scale}) translate(\${-cx} \${-cy})\`}>
      <polygon points={g.roof} className={\`fs-roof fs-floor-\${floor}\`} />
      {g.sides.map((side) => {
        const face = content(side.k);
        if (!face) {
          return (
            <g key={side.k}>
              <polygon points={side.points} className={\`fs-side fs-floor-\${floor}\`} />
              <FaceText side={side} size={78} className={\`fs-letter fs-letter-\${floor}\`}>{LETTERS[floor]}</FaceText>
            </g>
          );
        }
        return (
          <g key={side.k}>
            <polygon points={side.points} className={\`fs-answer fs-fill-\${face.fill}\`} />
            <FaceText side={side} size={fitSize(face.text, SLAB.w - 90, 100)} opacity={face.opacity}
              className={\`fs-answer-text\${face.fill === 'face' ? '' : ' fs-answer-text-lit'}\`}>{face.text}</FaceText>
          </g>
        );
      })}
    </g>
  );
}

/** The desktop tower: SVG polygons, answered by tapping a floor's projected front face. */
export default function Tower({ t, view, from, spinAt, onAnswer, answerable }) {
  const svg = useRef(null);
  const current = faceStates(view, t);
  const outgoing = from ? faceStates(from, t) : current;

  const onPointerUp = (event) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix || from) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    const floor = [0, 1, 2, 3].find((f) => insidePolygon([p.x, p.y], slabGeometry(f, 0).sides.find((s) => s.k === 0).screen));
    if (floor != null) onAnswer(floor);
  };

  return (
    <>
      <svg ref={svg} viewBox="0 0 1920 1080" className="fs-tower absolute inset-0 h-full w-full" onPointerUp={onPointerUp} aria-hidden="true">
        {[3, 2, 1, 0].map((floor) => {
          const p = from ? easeInOutCubic(clamp01((t - spinAt - floor * STAGGER_MS) / SPIN_EACH_MS)) : 0;
          const done = from && p >= 1;
          return (
            <Slab key={floor} floor={floor} t={t} angle={done ? 0 : p * QUARTER} release={p}
              outgoing={done ? current[floor] : outgoing[floor]} incoming={current[floor]} />
          );
        })}
      </svg>
      {/* The floors as buttons too: keyboard and screen readers answer here, the tap goes through the polygons. */}
      <div className="sr-only">
        {current.map((face, floor) => (
          <button key={floor} type="button" disabled={!answerable(floor)} onClick={() => onAnswer(floor)}>{face.text}</button>
        ))}
      </div>
    </>
  );
}
\`\`\`

## src/components/floorspin/useFloorspin.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { OPENING, QUESTION_MS, ROUND_LENGTH, buildRound, formatScore, pointsFor } from './round';
import { clamp01, useGameClock } from './useGameClock';

export const REVEAL_MS = 700;
// A picked answer holds its result this long, then the tower spins to the next question on its own.
const PICK_HOLD_MS = 1200;
// After Next, the revealed question fades out before the spin.
export const FADE_MS = 400;
export const SPIN_MS = 1200 + 3 * 130;
export const STATS_SWITCH_MS = 750;
// PLAY AGAIN clears the screen (all but the logo), holds it empty a moment, then the new round fades in.
export const CLEAR_MS = 350;
const STORE = 'floorspin:best';

const loadBest = () => {
  try { return JSON.parse(localStorage.getItem(STORE)) || { score: 0, streak: 0 }; } catch { return { score: 0, streak: 0 }; }
};

const questionView = (g, index) => ({ kind: 'question', index, q: g.round[index], result: g.results[index], revealAt: g.results[index]?.at });

const summaryView = (g) => ({
  kind: 'summary',
  lines: ['Round done', formatScore(g.score), \`\${g.right} / \${g.played} right\`, 'Play again'],
});

const viewOf = (g) => (g.index >= ROUND_LENGTH ? summaryView(g) : questionView(g, g.index));

const newGame = (fixed) => {
  const opening = fixed ? OPENING : { index: 0, score: 0, streak: 0 };
  return {
    // base and own keep the opening's sample score and streak out of the saved bests
    round: buildRound(fixed), ...opening, start: opening.index, base: opening.score, own: 0, best: 0, played: 0, right: 0, results: {},
    phase: 'ask', askAt: 0, revealAt: null, spinAt: null, target: null, from: null, timeLeft: QUESTION_MS,
    scoreAt: null, gain: 0, streakUpAt: null, streakResetAt: null, clearAt: null, enterAt: null,
  };
};

/** The shared game state both views read: question, chosen answer, reveal and spin timing, score, streak, timer. */
export function useFloorspin() {
  const t = useGameClock();
  const tRef = useRef(t);
  tRef.current = t;
  const [game, setGame] = useState(() => newGame(true));
  const [best, setBest] = useState(loadBest);

  const go = (g, index, now) => ({ ...g, index: Math.min(index, ROUND_LENGTH), from: viewOf(g), fromReveal: g.phase === 'reveal', phase: 'spin', spinAt: now, target: null });

  const settle = (g, chosen, now) => {
    const q = g.round[g.index];
    const right = chosen === q.correct;
    const gain = right ? pointsFor(q, g.streak + 1) : 0;
    const streak = right ? g.streak + 1 : 0;
    const own = right ? g.own + 1 : 0;
    return {
      ...g,
      phase: 'reveal', revealAt: now, target: g.index + 1, leapAt: null, autoLeap: false, timeLeft: Math.max(0, QUESTION_MS - (now - g.askAt)),
      results: { ...g.results, [g.index]: { chosen, at: now } },
      score: g.score + gain, streak, own, best: Math.max(g.best, own), played: g.played + 1, right: g.right + (right ? 1 : 0),
      scoreAt: right ? now : g.scoreAt, gain: right ? gain : g.gain,
      streakUpAt: right ? now : g.streakUpAt, streakResetAt: !right && g.streak > 0 ? now : g.streakResetAt,
    };
  };

  const act = (fn) => setGame((g) => fn(g, tRef.current) ?? g);
  const answerable = (g) => g.phase === 'ask' && g.index < ROUND_LENGTH && !g.results[g.index];

  const answer = (i) => act((g, now) => {
    if (g.phase === 'done') return i === 3 ? { ...g, phase: 'clear', clearAt: now } : null;
    return answerable(g) ? { ...settle(g, i, now), leapAt: now + PICK_HOLD_MS - FADE_MS, autoLeap: true } : null;
  });
  const skip = () => act((g, now) => (answerable(g) ? settle(g, null, now) : null));
  // Leaving an unanswered question skips it, so moving away and back can't reset its timer.
  const next = () => act((g, now) => {
    // The answer stays shown until Next; each further Next before the spin goes a question further.
    // The first Next after a pick only hurries its own spin.
    if (g.phase === 'reveal') {
      return g.leapAt != null && !g.autoLeap ? { ...g, target: Math.min(g.target + 1, ROUND_LENGTH) }
        : { ...g, autoLeap: false, leapAt: Math.min(g.leapAt ?? Infinity, Math.max(now, g.revealAt + REVEAL_MS - FADE_MS)) };
    }
    if (answerable(g)) return settle(g, null, now);
    return g.phase === 'ask' ? go(g, g.index + 1, now) : null;
  });
  const restart = () => act((g, now) => (g.phase === 'clear' ? null : { ...g, phase: 'clear', clearAt: now }));
  const prev = () => act((g, now) => {
    if (g.phase !== 'ask' || g.index <= g.start) return null;
    return answerable(g) ? { ...settle(g, null, now), target: g.index - 1 } : go(g, g.index - 1, now);
  });

  // The clock drives every timed step: reveal → spin → ask (or the end), and the countdown.
  useEffect(() => {
    if (game.phase === 'clear' && t - game.clearAt >= CLEAR_MS) setGame((g) => (g.phase === 'clear' ? { ...newGame(false), askAt: t, enterAt: t } : g));
    else if (game.phase === 'reveal' && game.leapAt != null && t - game.leapAt >= FADE_MS) setGame((g) => (g.phase === 'reveal' ? go(g, g.target, t) : g));
    else if (game.phase === 'spin' && t - game.spinAt >= SPIN_MS) {
      setGame((g) => (g.phase === 'spin' ? { ...g, phase: g.index >= ROUND_LENGTH ? 'done' : 'ask', askAt: t, timeLeft: QUESTION_MS } : g));
    } else if (answerable(game) && t - game.askAt >= QUESTION_MS) setGame((g) => (answerable(g) ? settle(g, null, t) : g));
  }, [t, game]);

  // [ / PageUp and ] / PageDown move between questions; 1–4 or A–D answer.
  const keys = useRef();
  keys.current = { answer, next, prev };
  useEffect(() => {
    const onKey = (e) => {
      // Browser shortcuts (Cmd+[ is Back) and typing in a field aren't answers.
      if (e.metaKey || e.ctrlKey || e.altKey || e.target?.closest?.('input, textarea, select, [contenteditable]')) return;
      const k = e.key.toLowerCase();
      const floor = ['1', '2', '3', '4'].indexOf(k) >= 0 ? Number(k) - 1 : ['a', 'b', 'c', 'd'].indexOf(k);
      if (k === '[' || k === 'pageup') keys.current.prev();
      else if (k === ']' || k === 'pagedown') keys.current.next();
      else if (floor >= 0) keys.current.answer(floor);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The round's records are kept on this device.
  useEffect(() => {
    if (game.phase !== 'done') return;
    setBest((b) => {
      const kept = { score: Math.max(b.score, game.score - game.base), streak: Math.max(b.streak, game.best) };
      try { localStorage.setItem(STORE, JSON.stringify(kept)); } catch { /* storage unavailable */ }
      return kept;
    });
  }, [game.phase]);

  const view = viewOf(game);
  const answered = !!game.results[game.index];
  const incoming = game.phase === 'spin' && t - game.spinAt >= STATS_SWITCH_MS;
  const remaining = game.phase === 'ask' && !answered ? QUESTION_MS - (t - game.askAt) : incoming ? QUESTION_MS : game.timeLeft;
  return {
    t, game, view, from: game.phase === 'spin' ? game.from : null,
    done: game.index >= ROUND_LENGTH,
    presence: game.phase === 'clear' ? 1 - clamp01((t - game.clearAt) / CLEAR_MS) : game.enterAt == null ? 1 : clamp01((t - game.enterAt - 150) / CLEAR_MS),
    statsView: game.phase === 'spin' && !incoming ? game.from : view,
    seconds: answered && game.phase === 'ask' ? null : Math.max(0, Math.ceil(remaining / 1000)),
    bestStreak: Math.max(best.streak, game.best),
    bestScore: Math.max(best.score, game.score - game.base),
    toGo: ROUND_LENGTH - game.start - game.played,
    canPrev: game.index > game.start && game.index < ROUND_LENGTH,
    answer, skip, next, prev, restart,
  };
}
\`\`\`

## src/components/floorspin/useGameClock.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const paused = () => window.__galleryPlaying === false;

/** The one game clock: ms of play time, advanced every animation frame (held while a gallery tile is paused). */
export function useGameClock() {
  const [t, setT] = useState(0);
  const elapsed = useRef(0);
  useEffect(() => {
    let frame;
    let last = performance.now();
    const tick = (now) => {
      if (!paused()) {
        elapsed.current += Math.min(Math.max(now - last, 0), 100);
        setT(elapsed.current);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return t;
}

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
export const easeOutCubic = (x) => 1 - (1 - x) ** 3;
/** 0 → 1 → 0 over \`ms\` from \`at\`. */
export const pulse = (t, at, ms) => (at == null ? 0 : Math.sin(Math.PI * clamp01((t - at) / ms)));
/** A decaying side-to-side shake: ±amp over \`ms\` from \`at\`. */
export const shake = (t, at, amp, ms = 500) => {
  if (at == null || t < at || t > at + ms) return 0;
  const p = (t - at) / ms;
  return amp * Math.sin(p * Math.PI * 8) * (1 - p);
};
\`\`\`

## src/components/floorspin/useLayout.js
\`\`\`js
import { useEffect, useState } from 'react';

const STAGE = { w: 1920, h: 1080 };

/**
 * The layout from the viewport: desktop (1100px and up) scales a 1920×1080 stage to fit, letterboxed;
 * tablet (700–1099px, portrait or landscape) and phone use tiles in real responsive CSS. Re-evaluated on
 * every resize, height-only and orientation changes included.
 */
export function useLayout() {
  const [[w, h], setSize] = useState(() => (typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight]));
  useEffect(() => {
    const onResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  if (w >= 1100) {
    const scale = Math.min(w / STAGE.w, h / STAGE.h);
    return {
      mode: 'desktop', desktop: true, scale, k: 1,
      stage: { width: STAGE.w, height: STAGE.h, left: (w - STAGE.w * scale) / 2, top: (h - STAGE.h * scale) / 2 },
      stat: (kind) => ({ sizes: [36, 44, kind === 'big' ? 58 : 46], gap: 18, align: 'right' }),
    };
  }
  const landscape = w >= 700 && w > h;
  const k = w >= 700 && !landscape ? 1.4 : 1;
  const short = landscape ? h < 600 : w < 700 && h < 760;
  const pad = landscape && short ? 24 : 48;
  const column = landscape ? Math.round(w * 0.45) - 72 : Math.min(w, 620) - 58 * k;
  return {
    mode: landscape ? 'landscape' : w >= 700 ? 'portrait' : 'phone', desktop: false, landscape, short, k, column, width: w,
    tileWidth: landscape ? Math.round(w * 0.55) - 72 : column,
    // Landscape tiles shrink to fit a short window (a phone held sideways): the padding top and bottom, three 16px gaps.
    tileHeight: landscape ? Math.max(52, Math.min(96, (h - 2 * pad - 48) / 4)) : short ? 56 : 72 * k,
    pad,
    // A short window (a phone under 760px tall, e.g. 360×640 or a builder preview; landscape under 600px) tightens the gaps.
    space: short ? { star: 64, stats: 12, question: 18, tiles: 14, tileGap: 8 } : { star: 77 * k, stats: 22 * k, question: 40 * k, tiles: 24 * k, tileGap: (landscape ? 16 : 12) * k },
    stat: (kind) => ({ sizes: [17 * k, 19 * k, (kind === 'big' ? 26 : 22) * k], gap: 7 * k, align: 'left' }),
  };
}
\`\`\`

## src/pages/Floorspin.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import '@/components/floorspin/floorspin.css';
import { Logo, ScoreStar } from '@/components/floorspin/Header';
import { Stats } from '@/components/floorspin/Stats';
import { QuestionBlock } from '@/components/floorspin/QuestionBlock';
import { Nav } from '@/components/floorspin/Nav';
import Tower from '@/components/floorspin/Tower';
import { Tiles } from '@/components/floorspin/Tiles';
import { fitLines } from '@/components/floorspin/faces';
import { useFloorspin } from '@/components/floorspin/useFloorspin';
import { useLayout } from '@/components/floorspin/useLayout';

export default function Floorspin() {
  const fs = useFloorspin();
  const layout = useLayout();
  const [, setFontsIn] = useState(false);
  // Answers are fitted by measuring them; measure again once the display face has loaded.
  useEffect(() => { document.fonts?.ready.then(() => setFontsIn(true)); }, []);

  const { t, game, view, done } = fs;
  // Stats and navigation leave once the tower has spun to the summary.
  const ended = game.phase === 'done' || game.phase === 'clear';
  const fade = { opacity: fs.presence };
  const answerable = (floor) => (done ? game.phase === 'done' && floor === 3 : game.phase === 'ask' && !game.results[game.index]);
  const nav = (size) => (
    <Nav {...size} canPrev={fs.canPrev} canNext={!done} canSkip={!done} revealing={game.phase === 'reveal'}
      onPrev={fs.prev} onNext={fs.next} onSkip={fs.skip} onRestart={game.played > 0 ? fs.restart : null} />
  );
  const star = (size, plusSize, plusSide) => <ScoreStar t={t} score={game.score} scoreAt={game.scoreAt} gain={game.gain} size={size} plusSize={plusSize} plusSide={plusSide} presence={fs.presence} />;
  const question = (sizes) => <QuestionBlock t={t} game={game} view={view} from={fs.from} bestStreak={fs.bestStreak} bestScore={fs.bestScore} toGo={fs.toGo} sizes={sizes} />;
  const stats = <Stats t={t} game={game} statsView={fs.statsView} seconds={fs.seconds} layout={layout} />;

  if (layout.desktop) {
    return (
      <div className="fs relative h-screen w-screen overflow-hidden">
        <div className="absolute origin-top-left" style={{ ...layout.stage, transform: \`scale(\${layout.scale})\` }}>
          <div className="absolute" style={{ left: 63, top: 53 }}><Logo size={62} gap={30} fontSize={30} tracking={4} /></div>
          <div className="absolute" style={{ left: 640, top: 56 }}>{star(184, 72, 'right')}</div>
          <div className="absolute" style={{ left: 190, top: 300, width: 540, ...fade }}>
            {question({ counter: 40, counterGap: 17, question: (text) => fitLines(text, 540, 112, 72, 5), done: 112, note: 22, slide: 40 })}
          </div>
          <div className="pointer-events-none absolute inset-0" style={fade}>
            <Tower t={t} view={view} from={fs.from} spinAt={game.spinAt} onAnswer={fs.answer} answerable={answerable} />
          </div>
          {!ended && <div style={fade}>{stats}</div>}
          {!ended && <div className="absolute" style={{ left: 190, top: 948, ...fade }}>{nav({ size: 72, border: 4, text: 34, gap: 16 })}</div>}
        </div>
      </div>
    );
  }

  const k = layout.k;
  const tiles = (
    <Tiles t={t} view={view} from={fs.from} spinAt={game.spinAt} onAnswer={fs.answer} answerable={answerable} width={layout.tileWidth}
      height={layout.tileHeight} gap={layout.space.tileGap} letterSize={35 * k} textSize={29 * k} />
  );
  const questionSize = layout.landscape ? (layout.short ? 36 : 52) : 36 * k;
  const left = (
    <>
      <header className="flex items-center justify-between">
        <Logo size={25 * k} gap={14 * k} fontSize={14 * k} tracking={1.5 * k} />
        {star(layout.space.star, 26 * k, 'left')}
      </header>
      {!ended && <div style={{ marginTop: layout.space.stats, ...fade }}>{stats}</div>}
      <div style={{ marginTop: layout.space.question, ...fade }}>
        {question({
          counter: 20 * k, counterGap: 7 * k, done: questionSize, note: 11 * k, slide: layout.short ? 8 : 20 * k,
          question: (text) => fitLines(text, layout.column, questionSize, Math.round(questionSize * 0.83), 3),
        })}
      </div>
    </>
  );
  const bottom = !ended && <div className={\`flex \${layout.landscape ? '' : 'justify-center'}\`} style={{ paddingBottom: 16, ...fade }}>{nav({ size: k > 1 ? 64 : 52, border: 3, text: 24 * k, gap: 12 * k })}</div>;

  return (
    <div className="fs h-[100dvh] w-screen overflow-y-auto overflow-x-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {layout.landscape ? (
        <div className="grid min-h-full grid-cols-[45%_55%]" style={{ padding: layout.pad }}>
          <div className="flex min-h-0 flex-col pr-6">{left}<div className="mt-auto">{bottom}</div></div>
          <div className="flex flex-col justify-center pl-6" style={fade}>{tiles}</div>
        </div>
      ) : (
        <div className="mx-auto flex min-h-full max-w-[620px] flex-col" style={{ paddingInline: 29 * k, paddingTop: 12 * k }}>
          {left}
          <div style={{ marginTop: layout.space.tiles, ...fade }}>{tiles}</div>
          <div className="mt-auto pt-3">{bottom}</div>
        </div>
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};