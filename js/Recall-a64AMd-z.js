var e=`# flashcard_quiz_game — app files

## base44/entities/Card.jsonc
\`\`\`json
{
  "name": "Card",
  "type": "object",
  "properties": {
    "deck_id": {
      "type": "string"
    },
    "prompt": {
      "type": "string"
    },
    "answer": {
      "type": "string"
    },
    "illustration": {
      "type": "string",
      "description": "A built-in illustration key (e.g. portugal) or an image URL"
    },
    "order": {
      "type": "number"
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "deck_id",
    "prompt",
    "answer"
  ],
  "rls": {
    "read": {
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
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
\`\`\`

## base44/entities/CardProgress.jsonc
\`\`\`json
{
  "name": "CardProgress",
  "type": "object",
  "properties": {
    "card_id": {
      "type": "string"
    },
    "ease": {
      "type": "number",
      "default": 2.5
    },
    "interval": {
      "type": "number",
      "description": "Days until the card is due again",
      "default": 0
    },
    "due_date": {
      "type": "string",
      "format": "date"
    },
    "lapses": {
      "type": "number",
      "default": 0
    }
  },
  "required": [
    "card_id",
    "ease",
    "interval",
    "due_date",
    "lapses"
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

## base44/entities/Deck.jsonc
\`\`\`json
{
  "name": "Deck",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "glyph": {
      "type": "string",
      "description": "Badge text, e.g. Aa"
    },
    "label": {
      "type": "string",
      "description": "Front label, e.g. CAPITAL OF"
    },
    "answer_label": {
      "type": "string",
      "description": "Back label; {prompt} is replaced by the card's prompt, e.g. CAPITAL OF {prompt}"
    },
    "order": {
      "type": "number"
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "name",
    "glyph",
    "label"
  ],
  "rls": {
    "read": {
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
    "create": {
      "user_condition": {
        "role": "admin"
      }
    },
    "update": {
      "user_condition": {
        "role": "admin"
      }
    },
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
\`\`\`

## base44/entities/LibrarySetup.jsonc
\`\`\`json
{"name":"LibrarySetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{"$or":[{"user_condition":{"role":"admin"}},{"user_condition":{"role":"user"}}]},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Session.jsonc
\`\`\`json
{
  "name": "Session",
  "type": "object",
  "properties": {
    "deck_id": {
      "type": "string"
    },
    "rating": {
      "type": "string",
      "enum": [
        "hard",
        "easy"
      ]
    },
    "completed_at": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "deck_id",
    "rating",
    "completed_at"
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

## src/components/recall/CardFace.jsx
\`\`\`jsx
import { Illustration } from './illustrations/index';

export const answerLabel = (deck, card) => (deck.answer_label ?? \`\${deck.label} {prompt}\`).replace('{prompt}', card.prompt);

/** One side's content (the frame is drawn by the card around it). */
export function CardFace({ deck, card, back }) {
  return (
    <span className="rc-face__body">
      <span className="rc-mono rc-face__label">{back ? answerLabel(deck, card) : deck.label}</span>
      <span className="rc-face__main">
        <Illustration name={card.illustration} />
        <span className="rc-face__word">{back ? card.answer : card.prompt}</span>
      </span>
      <span className="rc-mono rc-face__hint">{back ? 'Swipe for next' : 'Tap to reveal'}</span>
    </span>
  );
}
\`\`\`

## src/components/recall/CardStage.jsx
\`\`\`jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CardFace } from './CardFace';
import { DeckStack, Frame } from './Frame';
import { FlipCard } from './FlipCard';
import { scaleOf } from './useFit';

const GROW = { duration: 0.8, ease: 'easeInOut' };

/** The picked set's frame resizes into the full card (content laid out at full size, clipped and fading in). */
function useGrow(origin) {
  const slot = useRef(null);
  const [grow, setGrow] = useState(null);
  useLayoutEffect(() => {
    if (!origin || !slot.current) return;
    const scale = scaleOf(slot.current);
    const s = slot.current.getBoundingClientRect();
    const o = origin.getBoundingClientRect();
    setGrow({
      from: { left: (o.left - s.left) / scale, top: (o.top - s.top) / scale, width: o.width / scale, height: o.height / scale },
      to: { left: 0, top: 0, width: slot.current.offsetWidth, height: slot.current.offsetHeight },
    });
  }, [origin]);
  // A timer rather than onAnimationComplete alone: a throttled or hidden frame may never finish the animation.
  useEffect(() => {
    if (!grow || grow === 'done') return undefined;
    const t = setTimeout(() => setGrow('done'), GROW.duration * 1000 + 30);
    return () => clearTimeout(t);
  }, [grow]);
  return { slot, grow, growing: Boolean(origin) && grow !== 'done' };
}

export function CardStage({ game }) {
  const { deck, cards, index, flipped, round, origin } = game;
  const { slot, grow, growing } = useGrow(origin);
  const card = cards[index];

  return (
    <motion.div className="rc-stage" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div ref={slot} className="rc-slot">
        <motion.span className="rc-slot__stack" initial={origin ? { opacity: 0 } : false} animate={{ opacity: growing ? 0 : 1 }} transition={{ duration: 0.3 }}>
          <DeckStack />
        </motion.span>
        {growing ? (
          grow && grow !== 'done' && (
            <motion.div className="rc-grow" initial={grow.from} animate={grow.to} transition={GROW}>
              <Frame />
              <motion.span className="rc-grow__body" style={{ width: grow.to.width, height: grow.to.height }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={GROW}>
                {card && <CardFace deck={deck} card={card} />}
              </motion.span>
            </motion.div>
          )
        ) : (
          <AnimatePresence initial={false}>
            {card && (
              <FlipCard key={\`\${round}-\${index}\`} deck={deck} card={card} flipped={flipped} depth={100 - index} onFlip={game.flip} onNext={game.next} />
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
\`\`\`

## src/components/recall/Confetti.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { scaleOf } from './useFit';

// As in the clip: a quick burst that falls off the screen within a second, before the summary settles.
const GRAVITY = 9000; // local px / s²
const LIFE = 0.9; // s

// A seeded generator, so every burst (and the preview) falls the same way.
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

function particles(span) {
  const r = rng(44);
  return Array.from({ length: 64 }, (_, i) => {
    const dot = i % 3 === 2;
    return {
      dot,
      size: dot ? 7 + r() * 6 : 18 + r() * 40,
      x: span.left + r() * span.width,
      y: span.top + (r() - 0.5) * 20,
      vx: (r() - 0.5) * 1400,
      vy: -200 - r() * 500,
    };
  });
}

/** Accent circles with ink borders and small ink dots, burst from the meter and falling with gravity. */
export function Confetti({ from, rootRef }) {
  const [bits, setBits] = useState(null);
  const els = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!from || !root) return undefined;
    const scale = scaleOf(root);
    const m = from.getBoundingClientRect();
    const o = root.getBoundingClientRect();
    setBits(particles({ left: (m.left - o.left) / scale, top: (m.top + m.height / 2 - o.top) / scale, width: m.width / scale }));
    return () => setBits(null);
  }, [from, rootRef]);

  useEffect(() => {
    if (!bits) return undefined;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = (now - start) / 1000;
      bits.forEach((b, i) => {
        const el = els.current[i];
        if (!el) return;
        const x = b.x + b.vx * t;
        const y = b.y + b.vy * t + (GRAVITY * t * t) / 2;
        el.style.transform = \`translate(\${x - b.size / 2}px, \${y - b.size / 2}px)\`;
        el.style.opacity = String(Math.min(1, Math.max(0, (LIFE - t) / 0.25)));
      });
      if (t < LIFE) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bits]);

  if (!bits) return null;
  return (
    <div className="rc-confetti" aria-hidden="true">
      {bits.map((b, i) => (
        <i key={i} ref={(el) => (els.current[i] = el)} className={b.dot ? 'rc-bit rc-bit--dot' : 'rc-bit'} style={{ width: b.size, height: b.size, transform: \`translate(\${b.x}px, \${b.y}px)\` }} />
      ))}
    </div>
  );
}
\`\`\`

## src/components/recall/FlipCard.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion, useIsPresent } from 'framer-motion';
import { CardFace } from './CardFace';
import { Frame } from './Frame';
import { useSwipe } from './useSwipe';

const FLY = { x: -2400, y: -40, rotate: -9, transition: { duration: 0.6, ease: [0.5, 0, 0.9, 0.6] } };
// A card skipped before it finished dealing just goes, so rapid advances don't fan a trail of cards across the screen.
const SKIP = { opacity: 0, transition: { duration: 0 } };

// Tap flips the front; tap or a left swipe sends the back off to the left. The next card deals up from the stack.
export function FlipCard({ deck, card, flipped, depth, onFlip, onNext }) {
  const { x, rotate, handlers } = useSwipe(flipped ? onNext : onFlip, onNext);
  // The outgoing card stays on top while it flies off; taps belong to the newly dealt one.
  const present = useIsPresent();
  const [variants] = useState(() => {
    const dealt = performance.now();
    return { out: () => (performance.now() - dealt < 250 ? SKIP : FLY) };
  });
  return (
    <motion.button
      type="button"
      className="rc-card"
      aria-label={flipped ? \`\${card.answer}. Next card\` : \`\${card.prompt}. Reveal answer\`}
      style={{ x, rotate, zIndex: depth, pointerEvents: present ? undefined : 'none' }}
      initial={{ scale: 0.93, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      variants={variants}
      exit="out"
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      {...(present ? handlers : {})}
    >
      <motion.span className="rc-flip" initial={false} animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
        <span className="rc-face">
          <Frame />
          <CardFace deck={deck} card={card} />
        </span>
        <span className="rc-face rc-face--back">
          <Frame fill="var(--rc-accent)" />
          <CardFace deck={deck} card={card} back />
        </span>
      </motion.span>
    </motion.button>
  );
}
\`\`\`

## src/components/recall/Frame.jsx
\`\`\`jsx
// The card frame: open corners (each line stops short of its corner) and a folded bottom-right corner.
export function Frame({ fill = 'var(--rc-bg)', fold = true }) {
  return (
    <span className={fold ? 'rc-frame' : 'rc-frame rc-frame--plain'} style={{ '--rc-fill': fill }} aria-hidden="true">
      {fold && <span className="rc-frame__fill" />}
      <i className="rc-frame__t" />
      <i className="rc-frame__l" />
      <i className="rc-frame__r" />
      <i className="rc-frame__b" />
      {fold && (
        <svg className="rc-frame__fold" viewBox="0 0 70 70" preserveAspectRatio="none">
          <polygon points="1,1 69,1 1,69" />
        </svg>
      )}
    </span>
  );
}

/** Two outlines stacked behind a card, so it reads as a deck. */
export function DeckStack() {
  return (
    <>
      <span className="rc-stack rc-stack--2"><Frame fold={false} /></span>
      <span className="rc-stack rc-stack--1"><Frame fold={false} /></span>
    </>
  );
}
\`\`\`

## src/components/recall/Header.jsx
\`\`\`jsx
import { forwardRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Meter } from './Meter';

function Logo() {
  return (
    <div className="rc-logo">
      <svg viewBox="0 0 46 46" aria-hidden="true">
        <rect x="13" y="3" width="30" height="30" fill="var(--rc-accent)" />
        <path d="M3 13h30v22l-8 8H3z" fill="var(--rc-bg)" />
        <path d="M33 35h-8v8z" fill="var(--rc-secondary)" />
      </svg>
      <span>Recall</span>
    </div>
  );
}

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35 } };

export const Header = forwardRef(function Header({ playing, total, done, pulsing, onRestart }, meterRef) {
  return (
    <header className="rc-header">
      <Logo />
      <AnimatePresence>
        {playing && (
          <motion.div key="meter" className="rc-header__meter" {...fade}>
            <Meter ref={meterRef} total={total} done={done} pulsing={pulsing} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="rc-header__end">
        <AnimatePresence>
          {playing && (
            <motion.p key="streak" className="rc-streak" {...fade}>
              <span className="rc-mono">Card</span> <span className="rc-streak__n">{Math.min(done + 1, total)}/{total}</span>
            </motion.p>
          )}
        </AnimatePresence>
        <button type="button" className="rc-restart" onClick={onRestart} aria-label="Restart round">
          <RotateCcw strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
});
\`\`\`

## src/components/recall/illustrations/capitals.jsx
\`\`\`jsx
// World Capitals, drawn in the look's colours: accent, secondary and paper fills, ink outlines, dashed shading.
const A = 'var(--rc-accent)';
const S = 'var(--rc-secondary)';
const P = 'var(--rc-paper)';
const N = 'none';

const Cloud = ({ x, y, w = 88 }) => (
  <path fill={P} d={\`M\${x} \${y}q\${w * 0.06}-\${w * 0.16} \${w * 0.24}-\${w * 0.12}q\${w * 0.12}-\${w * 0.16} \${w * 0.3}-\${w * 0.06}q\${w * 0.14}-\${w * 0.06} \${w * 0.24} \${w * 0.08}q\${w * 0.16}-\${w * 0.02} \${w * 0.22} \${w * 0.16}z\`} />
);
const Sun = ({ x, y, r = 30 }) => <circle cx={x} cy={y} r={r} fill={A} />;

export const portugal = () => (
  <>
    <path fill={N} d="M25 68 395 35M202 51l6 106" />
    <Sun x={302} y={80} r={29} />
    <path fill={S} d="M25 272 395 200v165H25z" />
    <path fill={N} d="M25 293l370-69M25 312l370-70" />
    <path fill={N} d="M186 160l46-8" strokeWidth={6} />
    <path fill={A} d="M133 176l155-32 12 63-156 29z" />
    <path fill={P} d="M144 236l156-29 4 21-156 34z" />
    <path fill={S} d="M152 184l28-6 5 26-28 6zM193 175l28-6 5 26-28 6zM234 167l28-6 5 26-28 6z" />
    <circle cx={173} cy={276} r={9} fill={P} />
    <circle cx={268} cy={258} r={9} fill={P} />
    <path fill={N} strokeDasharray="7 7" d="M245 310l95-18M43 338l33-7" />
  </>
);

export const japan = () => (
  <>
    <Cloud x={72} y={76} w={88} />
    <Sun x={307} y={70} r={33} />
    <path fill={A} d="M60 287 219 84l158 203z" />
    <path fill={S} d="M219 84l37 49-10-4-13 14-13-15-14 15-12-14-11 4z" />
    <path fill={N} strokeDasharray="8 8" d="M178 168l-26 62M219 146l-13 66M255 160l27 77" />
    <path fill={S} d="M35 287h368v58H35z" />
    <path fill={N} d="M78 313h68M163 330h57M236 309h76" />
  </>
);

export const peru = () => (
  <>
    <Cloud x={118} y={44} w={75} />
    <Cloud x={266} y={62} w={75} />
    <path fill={A} d="M45 303 153 157l69 84 82-136 111 198v19H45z" />
    <path fill={S} d="M153 157l20 26-13-2-15 12-14-2zM304 105l27 45-11-4-16 17-14-15-12 5z" />
    <path fill={A} d="M45 322h370v33H45z" />
    <path fill={N} strokeDasharray="8 8" d="M160 177l22 85M291 152l-23 106M322 150l36 95" />
  </>
);

export const australia = () => (
  <>
    <Cloud x={60} y={92} w={84} />
    <Sun x={330} y={86} r={28} />
    <path fill={A} d="M70 266c20-70 66-118 128-132-26 40-40 88-40 132zM150 266c18-80 74-136 146-150-32 46-50 96-50 150zM236 266c20-62 64-104 120-114-22 36-34 74-34 114z" />
    <path fill={N} strokeDasharray="7 7" d="M120 254c10-36 28-66 52-88M206 254c12-44 34-80 62-106M286 254c10-32 26-58 48-76" />
    <path fill={P} d="M40 266h360v26H40z" />
    <path fill={S} d="M25 292h390v66H25z" />
    <path fill={N} d="M66 318h70M184 336h64M282 314h82" />
  </>
);

export const kenya = () => (
  <>
    <Sun x={300} y={140} r={64} />
    <path fill={N} d="M210 290c0-50 4-90 14-122M224 168l-40-34M226 186l44-36" />
    <path fill={A} d="M86 132c10-24 50-34 90-28 30-20 92-20 118 4 34-2 62 12 62 30-26 12-246 16-270-6z" />
    <path fill={S} d="M25 280c80-20 300-20 390 0v80H25z" />
    <path fill={N} strokeDasharray="7 7" d="M70 312h64M250 300h96M150 336h80" />
  </>
);
\`\`\`

## src/components/recall/illustrations/index.jsx
\`\`\`jsx
import * as capitals from './capitals';
import * as sets from './sets';

const DRAWINGS = { ...capitals, ...sets };

/** A card's illustration: a built-in drawing key, an image URL, or nothing. */
export function Illustration({ name, className = 'rc-ill' }) {
  if (/^https?:\\/\\//.test(name ?? '')) return <img className={className} src={name} alt="" />;
  const Drawing = DRAWINGS[name];
  if (!Drawing) return null;
  return (
    <svg className={className} viewBox="0 0 440 400" aria-hidden="true">
      <Drawing />
    </svg>
  );
}
\`\`\`

## src/components/recall/illustrations/sets.jsx
\`\`\`jsx
// Spanish Basics and Element Symbols, in the same flat style as the capitals.
const A = 'var(--rc-accent)';
const S = 'var(--rc-secondary)';
const P = 'var(--rc-paper)';
const N = 'none';
const dash = { fill: N, strokeDasharray: '8 8' };

export const gracias = () => (
  <>
    <path fill={A} d="M80 170h280v180H80z" />
    <path fill={S} d="M200 170h40v180h-40zM60 130h320v44H60z" />
    <path fill={P} d="M220 130c-30-60-100-70-100-26 0 22 50 26 100 26zM220 130c30-60 100-70 100-26 0 22-50 26-100 26z" />
    <path {...dash} d="M110 210v110M330 210v110" />
  </>
);

export const hola = () => (
  <>
    <circle cx={318} cy={92} r={32} fill={A} />
    <path fill={P} d="M60 110h220v130H150l-50 46v-46H60z" />
    <path fill={N} d="M100 160h140M100 196h96" />
    <path fill={S} d="M40 320c60-20 300-20 360 0v34H40z" />
    <path {...dash} d="M300 160c24 10 44 30 52 56M310 128c34 14 60 42 70 76" />
  </>
);

export const porfavor = () => (
  <>
    <path {...dash} d="M180 70c-14 20 14 36 0 56M220 60c-14 22 14 40 0 62M260 70c-14 20 14 36 0 56" />
    <path fill={A} d="M120 150h200l-20 140H140z" />
    <path fill={N} d="M320 180c44 0 44 70 0 70" />
    <path fill={S} d="M60 300h320l-24 34H84z" />
    <path {...dash} d="M150 190h140" />
  </>
);

export const agua = () => (
  <>
    <path fill={P} d="M120 90h200l-24 260H144z" />
    <path fill={S} d="M128 170h184l-16 180H144z" />
    <path {...dash} d="M146 210h148M152 270h136" />
    <path fill={A} d="M336 60c-24 34-34 52-34 68a34 34 0 0068 0c0-16-10-34-34-68z" />
  </>
);

export const adios = () => (
  <>
    <path fill={A} d="M110 250a110 110 0 01220 0z" />
    <path fill={S} d="M25 250h390v100H25z" />
    <path fill={N} d="M70 286h80M200 312h60M300 284h70M110 82q20-18 40 0q20-18 40 0M250 120q14-12 28 0q14-12 28 0" />
    <path {...dash} d="M150 340h140" />
  </>
);

export const au = () => (
  <>
    <path fill={A} d="M70 290l30-60h110l30 60zM200 290l30-60h110l30 60zM135 230l30-60h110l30 60z" />
    <path fill={S} d="M40 290h360v50H40z" />
    <path fill={N} d="M330 70v50M305 95h50M110 110v30M95 125h30" />
    <path {...dash} d="M110 270h70M240 270h70M175 210h70" />
  </>
);

export const fe = () => (
  <>
    <path fill={S} d="M70 150h300c0 50-40 70-110 74v46h70v40H110v-40h70v-46c-60-4-110-24-110-74z" />
    <path fill={A} d="M230 70l90 40-20 30-90-40z" />
    <path fill={P} d="M246 112l-48 108" />
    <path {...dash} d="M100 180h140" />
  </>
);

export const na = () => (
  <>
    <path fill={P} d="M150 140h140v200H150z" />
    <path fill={S} d="M160 90h120l10 50H150z" />
    <circle cx={200} cy={115} r={5} fill={N} />
    <circle cx={240} cy={115} r={5} fill={N} />
    <path fill={A} d="M150 210h140v70H150z" />
    <path {...dash} d="M80 80l30 30M70 140h34M330 74l-24 30" />
  </>
);

export const o = () => (
  <>
    <path fill={P} d="M180 60h80v100l80 150c8 20-4 40-26 40H126c-22 0-34-20-26-40l80-150z" />
    <path fill={S} d="M130 270h180l30 40c8 20-4 40-26 40H126c-22 0-34-20-26-40z" />
    <circle cx={200} cy={300} r={14} fill={A} />
    <circle cx={250} cy={240} r={10} fill={A} />
    <circle cx={224} cy={190} r={7} fill={A} />
    <path {...dash} d="M200 90v50" />
  </>
);

export const ag = () => (
  <>
    <circle cx={200} cy={200} r={130} fill={P} />
    <circle cx={200} cy={200} r={100} fill={S} />
    <path {...dash} d="M140 170a70 70 0 0160-60" />
    <path fill={A} d="M330 70l10 24 24 10-24 10-10 24-10-24-24-10 24-10z" />
  </>
);
\`\`\`

## src/components/recall/Meter.jsx
\`\`\`jsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';

// Five numbered circles; a completed card fills its circle and thickens the line before it.
export const Meter = forwardRef(function Meter({ total, done, pulsing }, ref) {
  return (
    <ol ref={ref} className={pulsing ? 'rc-meter rc-meter--pulse' : 'rc-meter'} aria-label={\`\${done} of \${total} cards done\`}>
      {Array.from({ length: total }).flatMap((_, i) => [
        i > 0 && <li key={\`line-\${i}\`} aria-hidden="true" className={i < done ? 'rc-meter__line rc-meter__line--on' : 'rc-meter__line'} />,
        <li key={\`step-\${i}\`} className="rc-meter__step" style={{ animationDelay: \`\${i * 0.12}s\` }}>
          {i < done && (
            <motion.span className="rc-meter__fill" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }} />
          )}
          <span className="rc-meter__num">{i + 1}</span>
        </li>,
      ])}
    </ol>
  );
});
\`\`\`

## src/components/recall/recall.css
\`\`\`css
@font-face{font-family:"EB Garamond";font-weight:400;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/eb-garamond-400-normal.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:500;font-display:block;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/ibm-plex-mono-500-normal.woff2) format("woff2")}

/* The look: background, ink (every line and text), accent, secondary, paper. */
:root{
  --swatch-1:#E2F7E5;--swatch-1-ink:#111111;
  --swatch-2:#6B6A00;--swatch-2-ink:#FFFFFF;
  --swatch-3:#FFFF5C;--swatch-3-ink:#111111;
  --swatch-4:#B8CBFF;--swatch-4-ink:#111111;
  --swatch-5:#F7FCF4;--swatch-5-ink:#111111;
}
/* gallery-look */

.rc{
  --rc-bg:var(--swatch-1);--rc-ink:var(--swatch-2);--rc-accent:var(--swatch-3);--rc-secondary:var(--swatch-4);--rc-paper:var(--swatch-5);
  --rc-line:2px;--rc-gap:10px;--rc-fold:70px;
  --rc-serif:"EB Garamond",Garamond,Georgia,serif;--rc-monof:"IBM Plex Mono",ui-monospace,monospace;
  position:relative;display:flex;flex-direction:column;overflow:hidden;width:100vw;height:100vh;
  background:var(--rc-bg);color:var(--rc-ink);font-family:var(--rc-serif);-webkit-font-smoothing:antialiased;
  user-select:none;-webkit-tap-highlight-color:transparent;
}
.rc *{box-sizing:border-box;margin:0;border-radius:0}
.rc button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.rc-mono{font-family:var(--rc-monof);font-weight:500;text-transform:uppercase;letter-spacing:.12em}

/* Frame: open corners, folded bottom-right corner, and the outlines stacked behind */
.rc-frame{position:absolute;inset:0;display:block;pointer-events:none}
.rc-frame__fill{position:absolute;inset:0;background:var(--rc-fill);clip-path:polygon(0 0,100% 0,100% calc(100% - var(--rc-fold)),calc(100% - var(--rc-fold)) 100%,0 100%)}
.rc-frame i{position:absolute;display:block;background:var(--rc-ink)}
.rc-frame__t{top:0;left:var(--rc-gap);right:var(--rc-gap);height:var(--rc-line)}
.rc-frame__l{left:0;top:var(--rc-gap);bottom:var(--rc-gap);width:var(--rc-line)}
.rc-frame__r{right:0;top:var(--rc-gap);bottom:var(--rc-fold);width:var(--rc-line)}
.rc-frame__b{bottom:0;left:var(--rc-gap);right:var(--rc-fold);height:var(--rc-line)}
.rc-frame--plain .rc-frame__r{bottom:var(--rc-gap)}
.rc-frame--plain .rc-frame__b{right:var(--rc-gap)}
.rc-frame__fold{position:absolute;right:0;bottom:0;width:var(--rc-fold);height:var(--rc-fold);overflow:visible}
.rc-frame__fold polygon{fill:var(--rc-secondary);stroke:var(--rc-ink);stroke-width:var(--rc-line);vector-effect:non-scaling-stroke;stroke-linejoin:miter}
.rc-stack{position:absolute;display:block;left:var(--dx);right:var(--dx);top:var(--dy);bottom:calc(-1 * var(--dy))}
.rc-stack--1{--dx:var(--dx1);--dy:var(--dy1)}
.rc-stack--2{--dx:var(--dx2);--dy:var(--dy2)}

/* Header */
.rc-header{position:relative;z-index:3;flex:none;display:flex;align-items:center;justify-content:space-between;height:124px;padding:0 100px}
.rc-logo{display:flex;align-items:center;gap:22px;font-size:52px;line-height:1}
.rc-logo svg{width:46px;height:46px;overflow:visible}
.rc-logo svg *{stroke:var(--rc-ink);stroke-width:2;stroke-linejoin:miter}
.rc-header__meter{position:absolute;left:50%;top:50%;width:1000px;transform:translate(-50%,-50%)}
.rc-header__end{display:flex;align-items:center;gap:34px}
.rc-streak{display:flex;align-items:baseline;gap:16px}
.rc-streak .rc-mono{font-size:22px}
.rc-streak__n{font-size:42px;line-height:1}
.rc .rc-restart{display:grid;place-items:center;width:62px;height:62px;margin-bottom:6px;border-radius:50%;background:var(--rc-accent);border:var(--rc-line) solid var(--rc-ink);box-shadow:0 6px 0 var(--rc-ink);transition:transform .08s,box-shadow .08s}
.rc .rc-restart:active{transform:translateY(6px);box-shadow:0 0 0 var(--rc-ink)}
.rc-restart svg{width:30px;height:30px;color:var(--rc-ink)}

/* Streak meter */
.rc-meter{display:flex;align-items:center;list-style:none;padding:0}
.rc-meter__step{position:relative;flex:none;display:grid;place-items:center;width:44px;height:44px;border:var(--rc-line) solid var(--rc-ink);border-radius:50% !important}
.rc-meter__fill{position:absolute;inset:0;border-radius:50% !important;background:var(--rc-accent)}
.rc-meter__num{position:relative;font-family:var(--rc-monof);font-weight:500;font-size:17px;line-height:1}
.rc-meter__line{flex:1;height:var(--rc-line);margin:0 16px;background:var(--rc-ink);transition:height .35s ease}
.rc-meter__line--on{height:6px}
.rc-meter--pulse .rc-meter__step,.rc-meter--pulse .rc-meter__line{animation:rc-pulse 1.6s ease-in-out infinite}
@keyframes rc-pulse{0%,100%{opacity:.75;transform:scale(1)}50%{opacity:.3;transform:scale(.94)}}

.rc-main{position:relative;z-index:1;flex:1;min-height:0}
.rc-foot{position:relative;z-index:2;flex:none;height:134px;padding-top:40px}
.rc-tip{position:absolute;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:14px;font-size:38px;line-height:40px}
.rc-tip i{width:18px;height:18px;border-radius:50% !important;background:var(--rc-accent);border:var(--rc-line) solid var(--rc-ink)}
.rc-badge{display:grid;place-items:center;border-radius:50% !important;background:var(--rc-accent);border:var(--rc-line) solid var(--rc-ink)}

/* Choose a set */
.rc-sets{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center}
.rc-sets::before,.rc-done::before{content:"";flex:0 0 max(0px,calc((100% - 822px) / 2))}
.rc-title{margin-top:38px;font-size:64px;font-weight:400;line-height:1.1}
.rc-sets__grid{display:flex;gap:120px;margin-top:85px}
.rc-sets__grid--scroll{max-width:100%;overflow-x:auto;padding:0 100px 80px}
.rc-sets__grid--scroll .rc-set{flex:none}
.rc .rc-set{--rc-fold:46px;--dx1:12px;--dy1:7px;--dx2:24px;--dy2:15px;position:relative;display:block;width:440px;height:560px;text-align:left}
.rc-set__card{position:absolute;inset:0;display:block}
.rc-set__body{position:absolute;inset:0;display:flex;flex-direction:column;align-items:flex-start;padding:37px 40px 35px}
.rc-set__no,.rc-set__count{font-size:22px}
.rc-set .rc-badge{position:absolute;top:44px;right:40px;width:108px;height:108px;font-size:42px}
.rc-set__name{margin-top:auto;max-width:330px;font-size:74px;line-height:1}
.rc-set__count{margin-top:94px}

/* Card */
.rc-stage{position:absolute;inset:0;display:flex;flex-direction:column}
.rc-slot{--dx1:32px;--dy1:12px;--dx2:62px;--dy2:26px;position:relative;flex:1;margin:56px 100px 28px}
.rc-slot__stack{position:absolute;inset:0;display:block}
.rc-grow{position:absolute;overflow:hidden}
.rc-grow__body{position:absolute;left:0;top:0;display:block}
.rc .rc-card{position:absolute;inset:0;display:block;perspective:9000px;touch-action:pan-y;text-align:left}
.rc-flip{position:absolute;inset:0;display:block;transform-style:preserve-3d}
.rc-face{position:absolute;inset:0;display:block;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.rc-face--back{transform:rotateY(180deg)}
.rc-face__body{position:absolute;inset:0;display:flex;flex-direction:column;padding:66px 63px 64px}
.rc-face__label{display:block;font-size:32px;line-height:1.2}
.rc-face__main{flex:1;display:flex;align-items:center;justify-content:center;gap:70px;margin-bottom:16px}
.rc-ill{flex:none;width:440px;height:400px;overflow:visible}
img.rc-ill{object-fit:contain}
.rc-ill *{stroke:var(--rc-ink);stroke-width:3;stroke-linejoin:round;stroke-linecap:round}
.rc-face__word{display:block;font-size:200px;line-height:1;white-space:nowrap}
.rc-face__hint{display:block;text-align:center;font-size:26px}

/* Round complete */
.rc-done{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding-top:94px}
.rc-done__glow{position:absolute;top:-124px;bottom:-134px;left:0;right:0;z-index:-1;background:radial-gradient(ellipse 72% 70% at 50% 52%,var(--rc-accent) 0%,var(--rc-accent) 52%,transparent 100%)}
.rc-done__title{font-size:44px;font-weight:400;line-height:1.1}
.rc-done__row{display:flex;align-items:center;gap:72px;margin-top:36px}
.rc-done__score{position:relative;display:grid;place-items:center;width:300px;height:300px;border-radius:50% !important;background:var(--rc-accent);border:var(--rc-line) solid var(--rc-ink);font-size:200px;line-height:1;font-variant-numeric:oldstyle-nums;padding-bottom:20px}
.rc-done__label{position:absolute;bottom:42px;left:0;right:0;text-align:center;font-size:22px;line-height:1}
.rc-done__list{--rc-fold:48px;position:relative;width:518px;height:300px}
.rc-done__list ol{position:relative;list-style:none;padding:36px 46px;font-size:39px;line-height:49px}
.rc-done__ask{margin-top:30px;font-size:44px;text-align:center}
.rc-done__rate{display:flex;gap:260px;margin-top:33px}
.rc .rc-rate{width:180px;height:180px;border-radius:50%;border:var(--rc-line) solid var(--rc-ink);font-size:50px;transition:background .15s,color .15s}
.rc .rc-rate:active,.rc .rc-rate[aria-pressed="true"]{background:var(--rc-ink);color:var(--rc-accent)}

.rc-confetti{position:absolute;inset:0;z-index:5;overflow:hidden;pointer-events:none}
.rc-bit{position:absolute;left:0;top:0;display:block;border-radius:50% !important;background:var(--rc-accent);border:var(--rc-line) solid var(--rc-ink);will-change:transform}
.rc-bit--dot{background:var(--rc-ink);border:0}

/* Mobile (portrait, under 900px): 1:1, full height, no page scroll */
/* Phone and tablet portrait (under 900px wide, or taller than wide): at least the window's height, and the page
   scrolls when the content is taller, so nothing is clipped. Tablets get the phone column, centred. */
.rc--m{--rc-fold:44px;width:100%;height:auto;min-height:100vh;min-height:100dvh;overflow:clip;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);touch-action:manipulation}
.rc--m>header,.rc--m>main,.rc--m>footer{width:100%;max-width:640px;margin-inline:auto}
/* The screens share one grid cell (so they still cross-fade in place) and the cell grows to the tallest. */
.rc--m .rc-main{display:grid;grid-template:minmax(0,1fr) / minmax(0,1fr);min-height:auto}
.rc--m .rc-main>*{grid-area:1/1;position:relative;inset:auto}
.rc--m .rc-stage{min-height:440px}
.rc--m .rc-slot{min-height:380px}
.rc--m .rc-done{padding-bottom:24px}
.rc--m .rc-header{flex-wrap:wrap;height:auto;padding:14px 20px 4px;row-gap:14px}
.rc--m .rc-logo{gap:12px;font-size:28px}
.rc--m .rc-logo svg{width:36px;height:36px}
.rc--m .rc-header__meter{position:static;order:3;width:100%;transform:none}
.rc--m .rc-header__end{gap:16px}
.rc--m .rc-streak{gap:8px}
.rc--m .rc-streak .rc-mono{font-size:12px}
.rc--m .rc-streak__n{font-size:22px}
.rc--m .rc-restart{width:48px;height:48px;margin-bottom:4px;box-shadow:0 4px 0 var(--rc-ink)}
.rc--m .rc-restart:active{transform:translateY(4px)}
.rc--m .rc-restart svg{width:22px;height:22px}
.rc--m .rc-meter__step{width:30px;height:30px}
.rc--m .rc-meter__num{font-size:12px}
.rc--m .rc-meter__line{margin:0 8px}
.rc--m .rc-meter__line--on{height:5px}
.rc--m .rc-foot{height:56px;padding-top:12px}
.rc--m .rc-tip{gap:10px;font-size:17px;line-height:24px}
.rc--m .rc-tip i{width:12px;height:12px}
.rc--m .rc-sets{padding:0 20px 8px}
.rc--m .rc-sets::before,.rc--m .rc-done::before{display:none}
.rc--m .rc-title{margin-top:12px;font-size:34px}
.rc--m .rc-sets__grid{flex-direction:column;gap:24px;width:100%;margin-top:22px}
.rc--m .rc-set{--rc-fold:32px;--dx1:8px;--dy1:5px;--dx2:16px;--dy2:10px;width:100%;height:140px}
.rc--m .rc-set__body{padding:18px 20px 18px}
.rc--m .rc-set__no,.rc--m .rc-set__count{font-size:12px}
.rc--m .rc-set .rc-badge{top:50%;right:28px;width:60px;height:60px;font-size:26px;transform:translateY(-50%)}
.rc--m .rc-set__name{max-width:70%;font-size:34px;line-height:1}
.rc--m .rc-set__count{margin-top:8px}
.rc--m .rc-slot{--dx1:14px;--dy1:8px;--dx2:28px;--dy2:16px;margin:16px 20px 22px}
.rc--m .rc-face__body{padding:24px 20px 24px}
.rc--m .rc-face__label{font-size:12px}
.rc--m .rc-face__main{flex-direction:column;gap:18px;margin-bottom:12px}
.rc--m .rc-ill{width:170px;height:155px}
.rc--m .rc-face__word{font-size:clamp(46px,15vw,64px);white-space:normal;text-align:center}
.rc--m .rc-face__hint{font-size:12px}
.rc--m .rc-done{padding:28px 20px 0}
.rc--m .rc-done__glow{top:-140px;bottom:-80px}
.rc--m .rc-done__title{font-size:32px}
.rc--m .rc-done__row{gap:18px;margin-top:28px}
.rc--m .rc-done__score{width:110px;height:110px;font-size:76px;padding-bottom:8px}
.rc--m .rc-done__label{bottom:12px;font-size:12px}
.rc--m .rc-done__list{--rc-fold:26px;width:170px;height:140px}
.rc--m .rc-done__list ol{padding:14px 18px;font-size:18px;line-height:22px}
.rc--m .rc-done__ask{margin-top:36px;font-size:26px}
.rc--m .rc-done__rate{gap:48px;margin-top:26px}
.rc--m .rc-rate{width:88px;height:88px;font-size:26px}
\`\`\`

## src/components/recall/RoundComplete.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { Frame } from './Frame';

const RATINGS = [['hard', 'Hard'], ['easy', 'Easy']];

export function RoundComplete({ cards, revealed, rating, onRate }) {
  return (
    <motion.section
      className="rc-done"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.35 }}
    >
      <motion.div className="rc-done__glow" aria-hidden="true" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: 'easeOut' }} />
      <h2 className="rc-done__title">Round complete</h2>
      <div className="rc-done__row">
        <motion.p className="rc-done__score" initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          {revealed}
          <span className="rc-mono rc-done__label">flipped</span>
        </motion.p>
        <div className="rc-done__list">
          <Frame fill="var(--rc-accent)" />
          <ol>
            {cards.map((c, i) => (
              <motion.li key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.07, duration: 0.25 }}>
                {c.answer}
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
      <p className="rc-done__ask">How did this round feel?</p>
      <div className="rc-done__rate">
        {RATINGS.map(([value, label]) => (
          <button key={value} type="button" className="rc-rate" aria-pressed={rating === value} onClick={() => onRate(value)}>
            {label}
          </button>
        ))}
      </div>
    </motion.section>
  );
}
\`\`\`

## src/components/recall/schedule.js
\`\`\`js
// Spaced repetition: one rating per round applies to all of its cards.
export const ROUND_SIZE = 5;
export const FRESH = { ease: 2.5, interval: 0, due_date: '', lapses: 0 };

const pad = (n) => String(n).padStart(2, '0');
export const isoDay = (d) => \`\${d.getFullYear()}-\${pad(d.getMonth() + 1)}-\${pad(d.getDate())}\`;
export const todayIso = () => isoDay(new Date());
const addDays = (iso, days) => {
  const d = new Date(\`\${iso}T12:00:00\`);
  d.setDate(d.getDate() + days);
  return isoDay(d);
};

/** Rated Hard first, then due cards (never-seen ones count as due) by oldest due date, then the rest. */
export function buildRound(cards, progressByCard, today) {
  const rank = (card) => {
    const p = progressByCard[card.id];
    if (p && p.interval === 0 && p.lapses > 0) return 0;
    return !p || p.due_date <= today ? 1 : 2;
  };
  const due = (card) => progressByCard[card.id]?.due_date ?? '';
  return [...cards]
    .sort((a, b) => rank(a) - rank(b) || due(a).localeCompare(due(b)) || (a.order ?? 0) - (b.order ?? 0))
    .slice(0, ROUND_SIZE);
}

export function applyRating(progress, rating, today) {
  const p = { ...FRESH, ...progress };
  if (rating === 'easy') {
    const interval = Math.max(1, Math.round(p.interval * p.ease));
    return { ease: +(p.ease + 0.15).toFixed(2), interval, due_date: addDays(today, interval), lapses: p.lapses };
  }
  return { ease: +Math.max(1.3, p.ease - 0.2).toFixed(2), interval: 0, due_date: today, lapses: p.lapses + 1 };
}
\`\`\`

## src/components/recall/seed.js
\`\`\`js
// The three sample sets. Cards name a built-in illustration (see illustrations/index.jsx).
export const SEED_DECKS = [
  {
    name: 'World Capitals', glyph: 'Aa', label: 'CAPITAL OF', answer_label: 'CAPITAL OF {prompt}', order: 1,
    cards: [['Portugal', 'Lisbon'], ['Japan', 'Tokyo'], ['Australia', 'Canberra'], ['Kenya', 'Nairobi'], ['Peru', 'Lima']],
  },
  {
    name: 'Spanish Basics', glyph: 'Ñ', label: 'SPANISH', answer_label: '{prompt} IN ENGLISH', order: 2,
    cards: [['Gracias', 'Thank you'], ['Hola', 'Hello'], ['Por favor', 'Please'], ['Agua', 'Water'], ['Adiós', 'Goodbye']],
  },
  {
    name: 'Element Symbols', glyph: 'Au', label: 'ELEMENT SYMBOL', answer_label: 'SYMBOL {prompt}', order: 3,
    cards: [['Au', 'Gold'], ['Fe', 'Iron'], ['Na', 'Sodium'], ['O', 'Oxygen'], ['Ag', 'Silver']],
  },
];

const keyOf = (prompt) => prompt.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');

export const deckRow = ({ cards, ...deck }) => deck;

export const seedCardsFor = (deck) =>
  (SEED_DECKS.find((s) => s.name === deck.name)?.cards ?? []).map(([prompt, answer], i) => ({
    deck_id: deck.id, prompt, answer, illustration: keyOf(prompt), order: i + 1,
  }));

/** The samples as plain objects, for a visitor who can't read or seed the shared sets. */
export const bundledDecks = () =>
  SEED_DECKS.map((s) => {
    const deck = { ...deckRow(s), id: \`seed-\${s.order}\` };
    return { ...deck, cards: seedCardsFor(deck).map((c, i) => ({ ...c, id: \`\${deck.id}-\${i + 1}\` })) };
  });
\`\`\`

## src/components/recall/SetPicker.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { DeckStack, Frame } from './Frame';

const pad = (n) => String(n).padStart(2, '0');
const APPEAR = 0.35; // after the round-complete screen has faded out

// Picking a set hands its frame's rect to the card, which grows out of it; the others fade and slide down.
export function SetPicker({ mobile, decks, picked, appear, onPick }) {
  return (
    <section className="rc-sets">
      <motion.h1 className="rc-title" initial={appear ? { opacity: 0 } : false} animate={{ opacity: picked ? 0 : 1 }} transition={{ duration: 0.4, delay: picked ? 0 : APPEAR }}>
        Choose a set
      </motion.h1>
      {/* More than three sets scroll sideways, the mouse wheel included. */}
      <div className={\`rc-sets__grid \${!mobile && decks.length > 3 ? 'rc-sets__grid--scroll' : ''}\`} onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }}>
        {decks.map((deck, i) => {
          const isPicked = picked === deck.id;
          return (
            <motion.button
              key={deck.id}
              type="button"
              className="rc-set"
              initial={appear ? { opacity: 0, y: 24 } : false}
              animate={picked ? { opacity: 0, y: isPicked ? 0 : 60 } : { opacity: 1, y: 0 }}
              transition={{ duration: picked ? (isPicked ? 0.25 : 0.5) : 0.45, delay: picked ? 0 : APPEAR + i * 0.06, ease: 'easeInOut' }}
              disabled={Boolean(picked)}
              onClick={(e) => onPick(deck, e.currentTarget.querySelector('.rc-set__card'))}
            >
              <DeckStack />
              <span className="rc-set__card">
                <Frame />
                <span className="rc-set__body">
                  <span className="rc-mono rc-set__no">Set {pad(i + 1)}</span>
                  <span className="rc-badge">{deck.glyph}</span>
                  <span className="rc-set__name">{deck.name}</span>
                  <span className="rc-mono rc-set__count">{deck.cards.length} cards</span>
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/recall/useFit.js
\`\`\`js
import { useEffect, useState } from 'react';

// Desktop is composed on a 1920×1080 canvas and scaled to the window (CSS zoom), filling both sides.
// A narrow or portrait window gets the phone layout: 1:1 on a phone, scaled up as a ~480px-wide column on a
// tablet (its height is the window's at least, and it scrolls when taller).
const W = 1920;
const H = 1080;
const PHONE = 480;
const TABLET = 600;

export function useFit() {
  const [[w, h], setView] = useState(() => (typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight]));
  useEffect(() => {
    const onResize = () => setView([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const mobile = w < 900 || h > w;
  if (mobile) {
    if (w < TABLET) return { mobile, style: undefined };
    const zoom = Math.min(w / PHONE, 1.7);
    return { mobile, style: { zoom, minHeight: h / zoom } };
  }
  const zoom = Math.min(w / W, h / H);
  return { mobile, style: { zoom, width: w / zoom, height: h / zoom } };
}

/** Viewport px per local CSS px of \`el\` (the zoom, however the browser reports zoomed rects). */
export const scaleOf = (el) => (el && el.offsetWidth ? el.getBoundingClientRect().width / el.offsetWidth : 1);
\`\`\`

## src/components/recall/useLibrary.js
\`\`\`js
import { useCallback, useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { applyRating, todayIso } from './schedule';
import { SEED_DECKS, bundledDecks, deckRow, seedCardsFor } from './seed';

const { Deck, Card, CardProgress, Session, LibrarySetup } = base44.entities;
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
// The player's own rows only, filtered on the server (admins can read everyone's, see the entities' rls).
const mineOf = (me) => (Entity, sort, limit) => (me ? Entity.filter({ created_by_id: me.id }, sort, limit) : Promise.resolve([]));

const deckKey = (d) => \`\${d.name}|\${d.glyph}|\${d.label}\`;
const cardKey = (c) => \`\${c.deck_id}|\${c.prompt}\`;
const sampled = (row) => ({ ...row, sample: true });
const oldestFirst = (a, b) => String(a.created_date).localeCompare(String(b.created_date)) || String(a.id).localeCompare(String(b.id));
// Marked rows sharing a key: the oldest stays, the newer copies (another first visit seeding at once) go.
const duplicates = (rows, keyOf) => {
  const seen = new Set();
  return rows.filter((r) => r.sample).sort(oldestFirst).filter((r) => seen.has(keyOf(r)) || !seen.add(keyOf(r)));
};
// One request per table; a failure throws, so the marker isn't written and the next admin visit retries.
const dropAll = async (Entity, rows) => {
  if (rows.length) await Entity.deleteMany({ id: { $in: rows.map((r) => r.id) } });
  return rows.map((r) => r.id);
};

// The sets are shared and written by admins: the first admin visit seeds them (one bulkCreate per table) and
// then writes the LibrarySetup marker. Until then each visit adds only the samples still missing.
async function seed(decks, cards) {
  // Decks the app didn't mark were added by the builder (or the user): the library isn't ours to seed.
  const missingDecks = decks.some((d) => !d.sample) ? [] : SEED_DECKS.filter((s) => !decks.some((d) => deckKey(d) === deckKey(s)));
  if (missingDecks.length) await Deck.bulkCreate(missingDecks.map((s) => sampled(deckRow(s))));
  decks = await Deck.list('order');
  const goneDecks = await dropAll(Deck, duplicates(decks, deckKey));
  decks = decks.filter((d) => !goneDecks.includes(d.id));
  const missingCards = decks.filter((d) => d.sample).flatMap(seedCardsFor).filter((s) => !cards.some((c) => c.sample && cardKey(c) === cardKey(s)));
  if (missingCards.length) await Card.bulkCreate(missingCards.map(sampled));
  // Read after the deck cleanup, so it also finds the cards another visit wrote on a deck dropped here.
  cards = await Card.list('order', 1000);
  const orphans = cards.filter((c) => c.sample && !decks.some((d) => d.id === c.deck_id));
  const goneCards = await dropAll(Card, [...orphans, ...duplicates(cards.filter((c) => !orphans.includes(c)), cardKey)]);
  await LibrarySetup.create({ set_up: true });
  const [, ...extraSetups] = (await LibrarySetup.list()).sort(oldestFirst);
  if (extraSetups.length) await LibrarySetup.deleteMany({ id: { $in: extraSetups.map((r) => r.id) } }).catch(() => {});
  return { decks, cards: cards.filter((c) => !goneCards.includes(c.id)) };
}

async function loadDecks(admin) {
  const [setup] = await LibrarySetup.list();
  let decks = await Deck.list('order');
  let cards = await Card.list('order', 1000);
  // Only an admin may write the sets: anyone else plays the bundled samples until one has.
  if (!setup && admin) ({ decks, cards } = await seed(decks, cards).catch(() => ({ decks, cards })));
  return [...decks].sort(byOrder).map((d) => ({ ...d, cards: cards.filter((c) => c.deck_id === d.id).sort(byOrder) }));
}

// Progress saved on the bundled samples (before an admin seeded them) moves onto the seeded cards, once.
function adoptBundled(rows, decks) {
  const seeded = new Map(decks.flatMap((d) => d.cards.map((c) => [\`\${d.name}|\${c.prompt}\`, c.id])));
  const toSeeded = new Map(bundledDecks().flatMap((d) => d.cards.map((c) => [c.id, seeded.get(\`\${d.name}|\${c.prompt}\`)])));
  const taken = new Set(rows.map((r) => r.card_id));
  return Promise.all(rows.map(async (r) => {
    const card_id = toSeeded.get(r.card_id);
    if (!card_id || taken.has(card_id)) return r;
    await CardProgress.update(r.id, { card_id }).catch(() => {});
    return { ...r, card_id };
  }));
}

// Single-flight: two mounts at once (React StrictMode) share one load, so the seed can't run twice.
let inflight = null;
const loadOnce = (admin) => (inflight ??= loadDecks(admin).finally(() => { inflight = null; }));

export function useLibrary() {
  const me = useRef(null);
  const [decks, setDecks] = useState(bundledDecks);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const ids = useRef({}); // card_id → its saved CardProgress row
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    (async () => {
      try {
        me.current = await base44.auth.me().catch(() => null);
        // A visitor who can't read or seed the shared sets still plays the bundled samples.
        const loaded = await loadOnce(me.current?.role === 'admin').catch(() => null);
        if (loaded?.length) setDecks(loaded);
        const saved = await mineOf(me.current)(CardProgress, '-updated_date', 2000).catch(() => []);
        const rows = await adoptBundled(saved, loaded ?? []);
        setProgress(Object.fromEntries(rows.map((r) => [r.card_id, r])));
        ids.current = Object.fromEntries(rows.map((r) => [r.card_id, r.id]));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const rate = useCallback((deck, cards, rating) => {
    const today = todayIso();
    const rated = Object.fromEntries(cards.map((c) => [c.id, applyRating(progress[c.id], rating, today)]));
    setProgress((all) => ({ ...all, ...Object.fromEntries(cards.map((c) => [c.id, { ...all[c.id], card_id: c.id, ...rated[c.id] }])) }));
    // One save at a time: a quick replay waits for the last round's new rows and updates them instead of creating twice.
    writes.current = writes.current.then(async () => {
      const fresh = cards.filter((c) => !ids.current[c.id]);
      const created = fresh.length ? await CardProgress.bulkCreate(fresh.map((c) => ({ card_id: c.id, ...rated[c.id] }))) : [];
      created.forEach((r) => { ids.current[r.card_id] = r.id; });
      await Promise.all([
        ...cards.filter((c) => !fresh.includes(c)).map((c) => CardProgress.update(ids.current[c.id], rated[c.id])),
        Session.create({ deck_id: deck.id, rating, completed_at: new Date().toISOString() }),
      ]);
    }).catch(() => {
      // Signed out or offline: the schedule still holds for this visit.
    });
  }, [progress]);

  return { decks, progress, loading, rate };
}
\`\`\`

## src/components/recall/useRound.js
\`\`\`js
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { buildRound, todayIso } from './schedule';

// sets → card (5 cards, each flip then next) → complete (rate) → sets
const START = { screen: 'sets', deck: null, cards: [], index: 0, flipped: false, round: 0, origin: null, rating: null, coached: false, revealed: [] };
const CELEBRATE_MS = 420;
const RATED_MS = 380;

function reducer(s, a) {
  switch (a.type) {
    case 'pick':
      return { ...s, screen: 'card', deck: a.deck, cards: a.cards, index: 0, flipped: false, round: s.round + 1, origin: a.origin, rating: null, revealed: [] };
    case 'flip':
      if (s.screen !== 'card' || s.index >= s.cards.length) return s;
      return { ...s, flipped: !s.flipped, revealed: s.revealed.includes(s.index) ? s.revealed : [...s.revealed, s.index] };
    case 'next':
      return s.screen === 'card' && s.index < s.cards.length ? { ...s, index: s.index + 1, flipped: false, coached: true } : s;
    case 'complete':
      return s.screen === 'card' ? { ...s, screen: 'complete' } : s;
    case 'restart':
      return s.deck && s.screen !== 'sets' ? { ...s, screen: 'card', index: 0, flipped: false, round: s.round + 1, origin: null, rating: null, revealed: [] } : s;
    case 'rate':
      return s.screen === 'complete' && !s.rating ? { ...s, rating: a.rating } : s;
    case 'done':
      return { ...START, round: s.round, coached: s.coached };
    default:
      return s;
  }
}

export function useRound(library) {
  const [s, dispatch] = useReducer(reducer, START);
  const timer = useRef(0);
  const later = (ms, action) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => dispatch(action), ms);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const done = Math.min(s.index, s.cards.length);
  const finished = s.screen === 'card' && s.cards.length > 0 && done === s.cards.length;
  useEffect(() => {
    if (finished) later(CELEBRATE_MS, { type: 'complete' });
  }, [finished]);

  const pick = useCallback((deck, origin) => {
    if (library.loading) return;
    dispatch({ type: 'pick', deck, origin, cards: buildRound(deck.cards, library.progress, todayIso()) });
  }, [library.loading, library.progress]);

  const rate = (rating) => {
    if (s.screen !== 'complete' || s.rating) return;
    dispatch({ type: 'rate', rating });
    library.rate(s.deck, s.cards, rating);
    later(RATED_MS, { type: 'done' });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      if (e.key === ' ') { e.preventDefault(); dispatch({ type: 'flip' }); }
      if (e.key === 'ArrowRight' && !e.repeat) { e.preventDefault(); dispatch({ type: 'next' }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return {
    ...s,
    done,
    finished,
    pick,
    rate,
    flip: () => dispatch({ type: 'flip' }),
    next: () => dispatch({ type: 'next' }),
    restart: () => { clearTimeout(timer.current); dispatch({ type: 'restart' }); },
  };
}
\`\`\`

## src/components/recall/useSwipe.js
\`\`\`js
import { useRef } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';
import { scaleOf } from './useFit';

const SWIPE = 90;
const TAP = 8;

/** Drag the card sideways: a left swipe past SWIPE calls onSwipe, a still press calls onTap. */
export function useSwipe(onTap, onSwipe) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-400, 0, 400], [-6, 0, 6]);
  const drag = useRef(null);

  const handlers = {
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      drag.current = { start: e.clientX, scale: scaleOf(e.currentTarget), moved: 0 };
    },
    onPointerMove: (e) => {
      const d = drag.current;
      if (!d) return;
      const dx = (e.clientX - d.start) / d.scale; // the root is zoomed: viewport px → local px
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (d.moved > TAP) x.set(dx);
    },
    onPointerUp: () => {
      const d = drag.current;
      drag.current = null;
      if (!d) return;
      if (d.moved <= TAP) onTap();
      else if (x.get() < -SWIPE) onSwipe();
      else animate(x, 0, { type: 'spring', stiffness: 500, damping: 34 });
    },
    onPointerCancel: () => {
      drag.current = null;
      animate(x, 0);
    },
    // Keyboard activation (Enter) arrives as a click with no pointer.
    onClick: (e) => e.detail === 0 && onTap(),
  };
  return { x, rotate, handlers };
}
\`\`\`

## src/pages/Recall.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import '@/components/recall/recall.css';
import { Header } from '@/components/recall/Header';
import { SetPicker } from '@/components/recall/SetPicker';
import { CardStage } from '@/components/recall/CardStage';
import { RoundComplete } from '@/components/recall/RoundComplete';
import { Confetti } from '@/components/recall/Confetti';
import { ROUND_SIZE } from '@/components/recall/schedule';
import { useFit } from '@/components/recall/useFit';
import { useLibrary } from '@/components/recall/useLibrary';
import { useRound } from '@/components/recall/useRound';

const LEAVE_MS = 800;

export default function Recall() {
  const { mobile, style } = useFit();
  const library = useLibrary();
  const game = useRound(library);
  const root = useRef(null);
  const meter = useRef(null);
  const [leaving, setLeaving] = useState(null); // the set growing into the card, while the others leave

  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(() => setLeaving(null), LEAVE_MS);
    return () => clearTimeout(t);
  }, [leaving]);

  const pick = (deck, frame) => {
    if (library.loading) return;
    setLeaving(deck.id);
    game.pick(deck, frame);
  };

  const playing = game.screen !== 'sets';
  const hint = game.screen === 'sets' ? 'Pick a deck to start' : game.screen === 'card' && !game.coached ? 'Tap the card to flip it' : null;

  return (
    <div ref={root} className={mobile ? 'rc rc--m' : 'rc'} style={style}>
      <Header ref={meter} playing={playing} total={game.cards.length || ROUND_SIZE} done={game.done} pulsing={game.screen === 'complete'} onRestart={game.restart} />
      <main className="rc-main">
        {(game.screen === 'sets' || leaving) && (
          <SetPicker mobile={mobile} decks={library.decks} picked={leaving} appear={game.round > 0} onPick={pick} />
        )}
        <AnimatePresence>
          {game.screen === 'card' && <CardStage key="stage" game={game} />}
          {game.screen === 'complete' && <RoundComplete key="done" cards={game.cards} revealed={game.revealed.length} rating={game.rating} onRate={game.rate} />}
        </AnimatePresence>
      </main>
      <footer className="rc-foot">
        <AnimatePresence initial={false}>
          {hint && (
            <motion.p key={hint} className="rc-tip" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.18, duration: 0.25 } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              <i aria-hidden="true" />
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </footer>
      <Confetti from={game.finished || game.screen === 'complete' ? meter.current : null} rootRef={root} />
    </div>
  );
}
\`\`\`
`;export{e as default};