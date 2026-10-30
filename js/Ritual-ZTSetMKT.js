var e=`# fitness_habit_tracker — app files

## base44/entities/Habit.jsonc
\`\`\`json
{
  "name": "Habit",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "tone": {
      "type": "number",
      "description": "Accent colour 1–4, assigned in order and cycling",
      "enum": [
        1,
        2,
        3,
        4
      ]
    },
    "sample": {
      "type": "boolean",
      "description": "A sample habit the app added on its first load"
    }
  },
  "required": [
    "name",
    "tone"
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

## base44/entities/HabitCompletion.jsonc
\`\`\`json
{
  "name": "HabitCompletion",
  "type": "object",
  "properties": {
    "habit_id": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "habit_id",
    "date"
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

## base44/entities/RitualSettings.jsonc
\`\`\`json
{
  "name": "RitualSettings",
  "type": "object",
  "properties": {
    "rest_weekday": {
      "type": "number",
      "description": "0 = Sunday … 6 = Saturday; a rest day never breaks a streak",
      "default": 0
    }
  },
  "required": [
    "rest_weekday"
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

## src/components/ritual/ActivityDialog.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';

/** Add or rename an activity: a centred modal on desktop, a bottom sheet on mobile. */
export default function ActivityDialog({ title, initialName = '', mobile, onSave, onClose }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const save = () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    Promise.resolve(onSave(name.trim())).catch(() => setSaving(false));
  };

  return (
    <div className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--ui-ink)_16%,transparent)]" onClick={onClose}>
      <motion.form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); save(); }}
        initial={mobile ? { y: '100%' } : { opacity: 0, scale: 0.94 }} animate={mobile ? { y: 0 } : { opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
        className={\`absolute bg-[var(--ui-inner)] p-6 shadow-[0_20px_60px_rgba(60,40,90,0.18)] \${mobile ? 'inset-x-0 bottom-0 rounded-t-[16px] pb-8' : 'left-[calc(50%-200px)] top-[calc(50%-110px)] w-[400px] rounded-[8px]'}\`}>
        <h3 className="rt-serif text-[28px] leading-none">{title}</h3>
        <label className="rt-caps mt-5 block text-[14px] text-[var(--ui-grey)]">Name
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Read 20 pages"
            className="mt-2 h-11 w-full rounded-[8px] border-[1.5px] border-[var(--ui-inner-line)] bg-transparent px-3 text-[15px] normal-case tracking-normal text-[var(--ui-ink)] outline-none placeholder:text-[var(--ui-grey)]" />
        </label>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rt-caps h-11 px-3 text-[14px] text-[var(--ui-grey)]">Cancel</button>
          <button type="submit" disabled={!name.trim() || saving}
            className="rt-caps h-11 rounded-[8px] bg-[var(--ui-ink)] px-5 text-[14px] text-[var(--ui-on-ink)] disabled:opacity-40">Save</button>
        </div>
      </motion.form>
    </div>
  );
}
\`\`\`

## src/components/ritual/dates.js
\`\`\`js
export const iso = (d) => \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
export const parse = (day) => new Date(\`\${day}T00:00:00\`);
export const todayIso = () => iso(new Date());
export const weekday = (day) => parse(day).getDay();
export const addDays = (day, n) => {
  const d = parse(day);
  d.setDate(d.getDate() + n);
  return iso(d);
};

const name = (day, part) => parse(day).toLocaleDateString('en-GB', { [part]: 'long' });
export const longDate = (day) => \`\${name(day, 'weekday')}, \${parse(day).getDate()} \${name(day, 'month')}\`;
export const monthName = (day) => name(day, 'month');

/** Monday to Sunday of the week holding \`day\`. */
export const weekOf = (day) => {
  const back = (weekday(day) + 6) % 7;
  return Array.from({ length: 7 }, (_, i) => addDays(day, i - back));
};

/** The month of \`day\` as Monday-first grid cells: null for the blanks before the 1st. */
export const monthCells = (day) => {
  const first = \`\${day.slice(0, 8)}01\`;
  const d = parse(first);
  const length = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return [
    ...Array((weekday(first) + 6) % 7).fill(null),
    ...Array.from({ length }, (_, i) => \`\${day.slice(0, 8)}\${String(i + 1).padStart(2, '0')}\`),
  ];
};
\`\`\`

## src/components/ritual/HabitRow.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import ProgressRing from './ProgressRing';
import { useHabitRow } from './useHabitRow';

const LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function Dot({ letter, done, future, tone, onClick, label, todayText }) {
  return (
    <button type="button" disabled={future} onClick={onClick} aria-label={label} aria-pressed={done}
      className="flex h-11 items-center justify-center lg:h-auto">
      <motion.span initial={false} animate={{ scale: done ? [1, 1.14, 1] : 1 }} transition={{ duration: 0.34, ease: 'easeInOut' }}
        className="relative flex h-[38px] w-[38px] items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[var(--ui-inner-line)] bg-[var(--ui-inner)] lg:h-[45px] lg:w-[45px]">
        <motion.span initial={false} animate={{ scale: done ? 1 : 0 }} transition={{ duration: 0.34, ease: 'easeInOut' }}
          className="absolute inset-[-2px] rounded-full" style={{ background: tone }} />
        <span className={\`relative text-[10px] font-bold tracking-[0.08em] \${done ? 'text-[var(--ui-ink)]' : 'text-[var(--ui-grey)]'} \${future ? 'opacity-40' : ''}\`}>{letter}</span>
      </motion.span>
      {todayText && <span className="sr-only">{todayText}</span>}
    </button>
  );
}

function RowMenu({ at, onRename, onDelete, onClose }) {
  return (
    <div className="fixed inset-0 z-30" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }}>
      <div className="absolute w-[150px] overflow-hidden rounded-[8px] bg-[var(--ui-inner)] py-1 shadow-[0_10px_30px_rgba(60,40,90,0.16)]"
        style={{ left: Math.min(at.x, window.innerWidth - 160), top: Math.min(at.y, window.innerHeight - 90) }}>
        <button type="button" onClick={onRename} className="block w-full px-4 py-2.5 text-left text-[14px]">Rename</button>
        <button type="button" onClick={onDelete} className="block w-full px-4 py-2.5 text-left text-[14px]">Delete</button>
      </div>
    </div>
  );
}

export default function HabitRow({ habit, week, today, onToggle, onRename, onDelete }) {
  const row = useHabitRow(onToggle);
  const tone = \`var(--swatch-\${habit.tone})\`;
  return (
    <motion.div animate={row.lift} {...row.rowHandlers}
      className="rt-glass flex select-none flex-col gap-3 rounded-[8px] p-4 lg:min-h-0 lg:flex-1 lg:flex-row lg:items-center lg:gap-4 lg:rounded-[5px] lg:px-4 lg:py-[13px]">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <ProgressRing value={habit.count} color={tone} />
        <div className="min-w-0">
          <div className="rt-serif truncate text-[26px] leading-[0.96] tracking-[-0.02em] lg:text-[31px]">{habit.name}</div>
          <div className="mt-[5px] flex items-baseline gap-[6px]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span key={habit.streak} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
                className="rt-serif text-[20px] leading-none lg:text-[23px]">{habit.streak}</motion.span>
            </AnimatePresence>
            <span className="rt-caps text-[14px] text-[var(--ui-grey)]">Day streak</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-[6px] lg:flex lg:gap-[8px]">
        {week.map((day, i) => (
          <Dot key={day} letter={LETTERS[i]} done={habit.week[i]} future={day > today} tone={tone}
            onClick={() => row.toggle(habit.id, day)} label={\`\${habit.name}, \${day}\${habit.week[i] ? ', done' : ''}\`}
            todayText={day === today ? \`\${habit.name} today\` : null} />
        ))}
      </div>
      {row.menu && (
        <RowMenu at={row.menu} onClose={row.closeMenu}
          onRename={() => { row.closeMenu(); onRename(habit); }}
          onDelete={() => { row.closeMenu(); onDelete(habit.id); }} />
      )}
    </motion.div>
  );
}
\`\`\`

## src/components/ritual/Headers.jsx
\`\`\`jsx
import { ArrowRight } from 'lucide-react';
import { longDate } from './dates';

export function TodayTitle({ day, today }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-[14px]">
      <h1 className="rt-serif truncate text-[34px] leading-none tracking-[-0.01em] lg:text-[27px]">{day === today ? 'Today' : longDate(day)}</h1>
      <span className="hidden h-px flex-1 bg-[var(--ui-hair)] lg:block" />
    </div>
  );
}

export function AddActivity({ onAdd }) {
  return (
    <div className="flex items-center gap-[10px]">
      <button type="button" onClick={onAdd} className="text-[14px] font-bold uppercase tracking-[0.08em] underline underline-offset-[4px]">Add activity</button>
      <button type="button" onClick={onAdd} aria-label="Add activity"
        className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[var(--ui-ink)] text-[var(--ui-on-ink)] lg:h-6 lg:w-6 lg:rounded-[5px]">
        <ArrowRight size={14} strokeWidth={2.2} />
      </button>
    </div>
  );
}
\`\`\`

## src/components/ritual/MonthCard.jsx
\`\`\`jsx
import { Check } from 'lucide-react';
import { longDate, monthName } from './dates';

const LEGEND = ['None', 'Some', 'Most', 'All'];
const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Share of habits done: 0 none, under half some, half or more most, every habit all. */
const levelOf = (n, total) => (n === 0 || total === 0 ? 0 : n === total ? 3 : n / total < 0.5 ? 1 : 2);

function Day({ day, today, selected, onSelect, n, total }) {
  const number = Number(day.slice(8));
  const future = day > today;
  const isToday = day === today;
  const fill = future ? 'transparent' : isToday && n > 0 ? 'var(--swatch-2)' : \`var(--ui-level-\${levelOf(n, total)})\`;
  const className = \`relative aspect-square rounded-[6px] px-[6px] pt-[5px] text-[11px] lg:aspect-auto lg:rounded-[5px] lg:px-[7px] lg:pt-[7px] lg:text-[10px] \${
    future ? 'text-[var(--ui-grey)] opacity-70 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--ui-ink)_5%,transparent)]' : 'font-bold'} \${day === selected ? 'shadow-[inset_0_0_0_1px_var(--ui-ink)]' : ''}\`;
  const marks = n > 0 && !future && (
    <>
      <Check size={13} strokeWidth={2} className="absolute bottom-[5px] right-[5px] hidden lg:block" />
      <Check size={10} strokeWidth={2.2} className="absolute bottom-[3px] right-[3px] lg:hidden" />
    </>
  );
  // A future day has nothing to log yet, so only past days and today can be picked.
  if (future) return <div style={{ background: fill }} className={className}>{number}</div>;
  return (
    <button type="button" onClick={() => onSelect(day)} aria-pressed={day === selected} aria-label={longDate(day)}
      style={{ background: fill }} className={\`\${className} flex items-start text-left\`}>
      {number}{marks}
    </button>
  );
}

export default function MonthCard({ today, selected, onSelect, cells, countOn, habitCount, daysDone, dayOfMonth, rate }) {
  return (
    <section className="rt-glass flex flex-col rounded-[8px] p-4 lg:min-h-0 lg:flex-1 lg:rounded-[5px] lg:p-[17px]">
      <div className="flex items-center">
        <h2 className="rt-serif text-[26px] leading-none lg:text-[24px]">{monthName(today)}</h2>
        <span className="mx-[12px] h-px flex-1 bg-[var(--ui-hair)]" />
        <span className="rt-caps text-[14px] !tracking-[0.1em] text-[var(--ui-grey)]">{daysDone} of {dayOfMonth} days done</span>
      </div>
      <div className="mt-[16px] grid grid-cols-7 gap-x-[5px]">
        {WEEKDAYS.map((d, i) => <span key={i} className="rt-caps text-center text-[9px] text-[var(--ui-grey)] lg:text-[8px]">{d}</span>)}
      </div>
      <div className="mt-[8px] grid grid-cols-7 gap-[5px] lg:min-h-0 lg:flex-1 lg:auto-rows-fr">
        {cells.map((day, i) => (day ? <Day key={day} day={day} today={today} selected={selected} onSelect={onSelect} n={countOn(day)} total={habitCount} /> : <span key={\`b\${i}\`} />))}
      </div>
      <div className="mt-[16px] flex flex-wrap gap-x-[16px] gap-y-2">
        {LEGEND.map((label, i) => (
          <span key={label} className="rt-caps flex items-center gap-[6px] text-[9px] text-[var(--ui-grey)] lg:text-[8px]">
            <span className="h-[11px] w-[11px] rounded-[2px]" style={{ background: \`var(--ui-level-\${i})\` }} />{label}
          </span>
        ))}
      </div>
      <div className="rt-caps mt-[12px] text-[14px] text-[var(--ui-grey)]">Habits done per day</div>
      <div className="mt-[14px] flex items-baseline gap-[8px] border-t border-[var(--ui-hair)] pt-[14px] lg:pt-[18px]">
        <span className="rt-serif text-[44px] leading-none tracking-[-0.04em] lg:text-[43px]">{rate}%</span>
        <span className="rt-caps text-[14px] text-[var(--ui-grey)]">Completion rate</span>
      </div>
    </section>
  );
}
\`\`\`

## src/components/ritual/ProgressRing.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

const R = 35.25;
const C = 2 * Math.PI * R;

export default function ProgressRing({ value, color }) {
  const progress = Math.min(value / 7, 1);
  return (
    <div className="relative h-16 w-16 flex-none lg:h-20 lg:w-20">
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={R} fill="none" stroke="color-mix(in srgb, var(--ui-ink) 10%, transparent)" strokeWidth="9.5" />
        <motion.circle cx="40" cy="40" r={R} fill="none" stroke={color} strokeWidth="9.5" strokeDasharray={C}
          initial={false} animate={{ strokeDashoffset: C * (1 - progress) }} transition={{ duration: 0.6, ease: 'easeInOut' }} />
      </svg>
      <span className="rt-serif absolute inset-[12%] flex items-center justify-center rounded-full border-[1.5px] border-[var(--ui-inner-line)] bg-[var(--ui-inner)] text-[22px] lg:text-[25px]">{value}</span>
    </div>
  );
}
\`\`\`

## src/components/ritual/ritual.css
\`\`\`css
/* EB Garamond (the design's serif) isn't hosted on media.base44.com yet; Minion Pro stands in. */
@font-face{font-family:"Minion Pro";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/minion-pro-400-normal.woff2) format("woff2")}
@font-face{font-family:"Univers LT Std";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/univers-lt-std-400-normal.woff2) format("woff2")}
@font-face{font-family:"Univers LT Std";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/univers-lt-std-700-normal.woff2) format("woff2")}

/* The look (Sand): the four habit accents (--swatch-N), then the ground, the inner disc and the heat ramp. */
:root{
  --swatch-1:#BDB19C;--swatch-1-ink:#14140F;
  --swatch-2:#DDAA2C;--swatch-2-ink:#14140F;
  --swatch-3:#C9C5FA;--swatch-3-ink:#14140F;
  --swatch-4:#97D9BF;--swatch-4-ink:#14140F;
  --ui-ink:#14140F;--ui-on-ink:#FFFFFF;--ui-grey:#6E6E66;--ui-hair:#E4E3DC;
  --ui-base-1:#F3DCA4;--ui-base-2:#EFD69C;--ui-glow-1:#F6E3B4;--ui-glow-2:#EBD196;
  --ui-inner:#FAEFD2;--ui-inner-line:#EAD6A6;
  --ui-level-0:#FFFFFF;--ui-level-1:#F3DD9E;--ui-level-2:#E8C56A;--ui-level-3:#D3A33A;
}
/* gallery-look */

.rt{font-family:"Univers LT Std","Helvetica Neue",Helvetica,Arial,sans-serif;color:var(--ui-ink);-webkit-font-smoothing:antialiased;
  background:
    radial-gradient(933px 667px at 0% 0%,var(--ui-glow-1),transparent 75%),
    radial-gradient(933px 667px at 100% 100%,var(--ui-glow-2),transparent 75%),
    linear-gradient(160deg,var(--ui-base-1),var(--ui-base-2))}
.rt-serif{font-family:"Minion Pro","EB Garamond",Georgia,serif;font-weight:400}
.rt-caps{text-transform:uppercase;letter-spacing:0.22em;line-height:1}
.rt-glass{background:linear-gradient(135deg,rgba(255,255,255,0.62),rgba(255,255,255,0.34));-webkit-backdrop-filter:blur(28px) saturate(160%);backdrop-filter:blur(28px) saturate(160%);box-shadow:inset 0 1px 0 rgba(255,255,255,0.9),0 10px 30px rgba(60,40,90,0.08)}
.rt-tint{background:linear-gradient(135deg,color-mix(in srgb,var(--tint) 80%,transparent),color-mix(in srgb,var(--tint) 53%,transparent));-webkit-backdrop-filter:blur(28px) saturate(160%);backdrop-filter:blur(28px) saturate(160%);box-shadow:inset 0 1px 0 rgba(255,255,255,0.6),0 10px 30px rgba(60,40,90,0.08)}
\`\`\`

## src/components/ritual/seed.js
\`\`\`js
import { addDays, iso, weekday } from './dates';

export const SEED_HABITS = [
  { name: 'Morning run', tone: 1, sample: true },
  { name: 'Strength', tone: 2, sample: true },
  { name: 'Stretch', tone: 3, sample: true },
  { name: 'Lights out 11', tone: 4, sample: true },
];

// One character per active (non-rest) day, newest first from the day before the habit was created:
// about seven weeks that read as streaks of 12, 6, 21 and 3, an overall run of 12 and a longest of 23.
const alternate = Array.from({ length: 23 }, (_, k) => (k % 2 === 1 || k === 6 || k === 7 ? '1' : '0')).join('');
const HISTORY = {
  'Morning run': \`\${'1'.repeat(12)}001\${'1'.repeat(23)}0011111\`,
  Strength: \`010111011001100\${alternate}0000000\`,
  Stretch: \`\${'1'.repeat(21)}00\${'1'.repeat(22)}\`,
  'Lights out 11': \`101100111101110\${'1'.repeat(23)}0000000\`,
};

/** Each habit's sample history, dated from its own created_date so a resumed seed matches it exactly. */
export function seedCompletions(habits, rest) {
  const rows = [];
  habits.forEach((h) => {
    let day = iso(h.created_date ? new Date(h.created_date) : new Date());
    for (let k = 0; k < (HISTORY[h.name]?.length ?? 0); k += 1) {
      do day = addDays(day, -1); while (weekday(day) === rest);
      if (HISTORY[h.name][k] === '1') rows.push({ habit_id: h.id, date: day });
    }
  });
  return rows;
}
\`\`\`

## src/components/ritual/StatCards.jsx
\`\`\`jsx
const Card = ({ value, label, tint }) => (
  <div className="rt-tint flex flex-1 flex-col justify-end rounded-[8px] px-4 pb-4 pt-5 lg:rounded-[5px] lg:px-[17px] lg:pb-[15px] lg:pt-0" style={{ '--tint': tint }}>
    <div className="rt-serif leading-[0.8]">
      <span className="text-[52px] tracking-[-0.03em] lg:text-[57px]">{value}</span>
      <span className="ml-[1px] text-[22px] lg:text-[23px]">d</span>
    </div>
    <div className="rt-caps mt-[12px] text-[14px] !tracking-[0.04em] lg:mt-[10px] lg:leading-none">{label}</div>
  </div>
);

export default function StatCards({ current, longest }) {
  return (
    <div className="flex gap-[14px] lg:h-[108px] lg:flex-none lg:gap-[12px]">
      <Card value={current} label="Current streak" tint="var(--swatch-2)" />
      <Card value={longest} label="Longest" tint="var(--swatch-3)" />
    </div>
  );
}
\`\`\`

## src/components/ritual/streaks.js
\`\`\`js
import { addDays, weekday } from './dates';

// A rest day counts when kept and never breaks a run; one missed day is forgiven, two in a row end it.
const LOOKBACK_DAYS = 400;

/** The run ending today: today joins it once \`countToday\`, and an open today is never a miss. */
export function currentRun(kept, today, rest, countToday = kept(today)) {
  let run = countToday ? 1 : 0;
  let misses = 0;
  for (let i = 1; i < LOOKBACK_DAYS; i += 1) {
    const day = addDays(today, -i);
    if (kept(day)) { run += 1; misses = 0; }
    else if (weekday(day) !== rest && ++misses === 2) break;
  }
  return run;
}

export function longestRun(kept, from, today, rest) {
  let best = 0;
  let run = 0;
  let misses = 0;
  for (let day = from; day < today; day = addDays(day, 1)) {
    if (kept(day)) { run += 1; misses = 0; best = Math.max(best, run); }
    else if (weekday(day) !== rest && ++misses === 2) { run = 0; misses = 0; }
  }
  return best;
}
\`\`\`

## src/components/ritual/useHabitRow.js
\`\`\`js
import { useRef, useState } from 'react';
import { useAnimationControls } from 'framer-motion';

const LONG_PRESS_MS = 500;

/** The row's lift on a toggle, and its Rename/Delete menu (right-click, or long-press on touch). */
export function useHabitRow(onToggle) {
  const lift = useAnimationControls();
  const [menu, setMenu] = useState(null);
  const timer = useRef(null);
  const clear = () => clearTimeout(timer.current);

  return {
    lift,
    menu,
    closeMenu: () => setMenu(null),
    toggle: (habitId, day) => {
      lift.start({ y: [0, -4, 0], transition: { duration: 0.42, ease: 'easeOut' } });
      onToggle(habitId, day);
    },
    rowHandlers: {
      onContextMenu: (e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      },
      onTouchStart: (e) => {
        const { clientX, clientY } = e.touches[0];
        timer.current = setTimeout(() => setMenu({ x: clientX, y: clientY }), LONG_PRESS_MS);
      },
      onTouchMove: clear,
      onTouchEnd: clear,
    },
  };
}
\`\`\`

## src/components/ritual/useIsMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

// Below Tailwind's lg the desktop row (ring, name, seven dots) no longer fits, so the stacked layout takes over.
const QUERY = '(max-width: 1023px)';

export function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = () => setMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return mobile;
}
\`\`\`

## src/components/ritual/useRitual.js
\`\`\`js
import { useEffect, useMemo, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { monthCells, todayIso, weekOf, weekday } from './dates';
import { SEED_HABITS, seedCompletions } from './seed';
import { currentRun, longestRun } from './streaks';

const { Habit, HabitCompletion, RitualSettings } = base44.entities;
// Habits made in one request share a timestamp: their tone keeps them in order.
const byCreated = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || (a.tone ?? 0) - (b.tone ?? 0) || String(a.id).localeCompare(String(b.id));
// Each user's own rows only, filtered on the server: admins can read everyone's (see the entities' rls).
const mineOf = (me) => (Entity, sort, limit) => (me ? Entity.filter({ created_by_id: me.id }, sort, limit) : Entity.list(sort, limit));
// One request per table: entity calls are rate-limited per app, so a seed of single creates fails partway.
const createAll = async (Entity, rows) => (rows.length ? Entity.bulkCreate(rows) : []);

// Two first loads at once (a preview reload mid-seed, a second tab) can both add the samples:
// keep the oldest copy of each sample habit, drop the other copies, and drop every completion of a
// habit not kept (the other load may have written some after its own cleanup ran). Samples carry
// \`sample\`, so a habit the user added is never dropped.
async function dropDuplicateSamples(hs, rows) {
  const seen = new Set();
  const extra = [...hs].sort(byCreated).filter((h) => {
    if (!h.sample) return false;
    if (seen.has(h.name)) return true;
    seen.add(h.name);
    return false;
  });
  const kept = new Set(hs.filter((h) => !extra.includes(h)).map((h) => h.id));
  const orphans = rows.filter((r) => !kept.has(r.habit_id));
  // One request per table: a delete per row overruns the per-app delete limit.
  const [habitsGone, rowsGone] = await Promise.allSettled([
    extra.length && Habit.deleteMany({ id: { $in: extra.map((h) => h.id) } }),
    orphans.length && HabitCompletion.deleteMany({ id: { $in: orphans.map((r) => r.id) } }),
  ]);
  return [
    habitsGone.status === 'fulfilled' ? hs.filter((h) => kept.has(h.id)) : hs,
    rowsGone.status === 'fulfilled' ? rows.filter((r) => kept.has(r.habit_id)) : rows,
    habitsGone.status === 'fulfilled' && rowsGone.status === 'fulfilled',
  ];
}

export function useRitual() {
  const pending = useRef(new Set()); // habit|day toggles still saving: a second click waits
  const today = useMemo(todayIso, []);
  const [habits, setHabits] = useState([]);
  const [log, setLog] = useState([]);
  const [rest, setRest] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(today);

  useEffect(() => {
    (async () => {
      try {
        const mine = mineOf(await base44.auth.me().catch(() => null));
        const [settings] = await mine(RitualSettings);
        let hs = await mine(Habit, 'created_date');
        let rows = await mine(HabitCompletion, '-date', 5000);
        if (!settings) {
          // Seed only what is missing, then write the settings row that marks setup done, so an
          // interrupted seed resumes and a user who clears everything never gets the samples back.
          // Habits the app didn't mark were added by the builder (or the user): the table isn't ours to seed.
          if (!hs.some((h) => !h.sample)) hs = [...hs, ...(await createAll(Habit, SEED_HABITS.filter((s) => !hs.some((h) => h.name === s.name))))];
          const missing = seedCompletions(hs.filter((h) => h.sample), 0).filter((s) => !rows.some((r) => r.habit_id === s.habit_id && r.date === s.date));
          await createAll(HabitCompletion, missing);
          let clean;
          [hs, rows, clean] = await dropDuplicateSamples(await mine(Habit, 'created_date'), await mine(HabitCompletion, '-date', 5000));
          if (clean) await RitualSettings.create({ rest_weekday: 0 }); // a failed cleanup retries on the next load
        }
        setHabits([...hs].sort(byCreated));
        setLog(rows);
        setRest(settings?.rest_weekday ?? 0);
      } finally {
        setLoading(false);
      }
    })();
  }, [today]);

  return useMemo(() => {
    const done = new Set(log.map((r) => \`\${r.habit_id}|\${r.date}\`));
    const perDay = new Map();
    log.forEach((r) => perDay.set(r.date, (perDay.get(r.date) ?? 0) + 1));
    const count = (day) => perDay.get(day) ?? 0;
    const week = weekOf(selected);
    const earliest = log.reduce((min, r) => (r.date < min ? r.date : min), today);

    const rows = habits.map((h) => {
      const isDone = (day) => done.has(\`\${h.id}|\${day}\`);
      return { ...h, week: week.map(isDone), count: week.filter(isDone).length, streak: currentRun(isDone, today, rest) };
    });

    // A day is kept when most habits are done; today joins the overall run only once every habit is.
    const kept = (day) => habits.length > 0 && count(day) > habits.length / 2;
    const current = currentRun(kept, today, rest, habits.length > 0 && count(today) === habits.length);

    const cells = monthCells(today);
    const elapsed = cells.filter((d) => d && d <= today);
    // Possible habit-days: every habit on every day so far, a rest day only when something was done on it.
    const possible = elapsed.filter((d) => weekday(d) !== rest || count(d) > 0).length * habits.length;
    const monthDone = elapsed.reduce((sum, d) => sum + count(d), 0);

    return {
      loading,
      today,
      selected,
      select: setSelected,
      week,
      habits: rows,
      currentStreak: current,
      longestStreak: Math.max(current, longestRun(kept, earliest, today, rest)),
      cells,
      habitCount: habits.length,
      countOn: count,
      daysDone: elapsed.filter((d) => count(d) > 0).length,
      dayOfMonth: elapsed.length,
      rate: possible ? Math.round((monthDone / possible) * 100) : 0,
      toggle: async (habitId, day) => {
        const key = \`\${habitId}|\${day}\`;
        if (pending.current.has(key)) return;
        pending.current.add(key);
        try {
          const row = log.find((r) => r.habit_id === habitId && r.date === day);
          if (row) {
            await HabitCompletion.delete(row.id); // only then off the screen: a failed delete keeps the day done
            setLog((all) => all.filter((r) => r !== row));
          } else {
            const created = await HabitCompletion.create({ habit_id: habitId, date: day });
            setLog((all) => [...all, created]);
          }
        } finally {
          pending.current.delete(key);
        }
      },
      addHabit: async (name) => {
        const created = await Habit.create({ name, tone: (habits.length % 4) + 1 });
        setHabits((all) => [...all, created]);
      },
      renameHabit: async (id, name) => {
        await Habit.update(id, { name });
        setHabits((all) => all.map((h) => (h.id === id ? { ...h, name } : h)));
      },
      deleteHabit: async (id) => {
        // One request for the whole log: a delete per completion overruns the per-app delete limit.
        await Promise.all([Habit.delete(id), HabitCompletion.deleteMany({ habit_id: id })]);
        setHabits((all) => all.filter((h) => h.id !== id));
        setLog((all) => all.filter((r) => r.habit_id !== id));
      },
    };
  }, [habits, log, rest, today, selected, loading]);
}
\`\`\`

## src/pages/Ritual.jsx
\`\`\`jsx
import { useState } from 'react';
import '@/components/ritual/ritual.css';
import { AddActivity, TodayTitle } from '@/components/ritual/Headers';
import HabitRow from '@/components/ritual/HabitRow';
import StatCards from '@/components/ritual/StatCards';
import MonthCard from '@/components/ritual/MonthCard';
import ActivityDialog from '@/components/ritual/ActivityDialog';
import { useRitual } from '@/components/ritual/useRitual';
import { useIsMobile } from '@/components/ritual/useIsMobile';

export default function Ritual() {
  const r = useRitual();
  const mobile = useIsMobile();
  const [dialog, setDialog] = useState(null);

  const rows = r.habits.map((h) => (
    <HabitRow key={h.id} habit={h} week={r.week} today={r.today} onToggle={r.toggle}
      onRename={(habit) => setDialog({ habit })} onDelete={r.deleteHabit} />
  ));
  const stats = <StatCards current={r.currentStreak} longest={r.longestStreak} />;
  const month = <MonthCard today={r.today} selected={r.selected} onSelect={r.select} cells={r.cells} countOn={r.countOn} habitCount={r.habitCount} daysDone={r.daysDone} dayOfMonth={r.dayOfMonth} rate={r.rate} />;
  const add = <AddActivity onAdd={() => setDialog({})} />;

  return (
    <div className={\`rt min-h-screen \${mobile ? '' : 'h-screen overflow-hidden'}\`}>
      {/* Mounted once loaded, so the first frame is the seeded state rather than a fade into it. */}
      {!r.loading && (mobile ? (
        <main className="flex flex-col gap-[14px] px-[18px] pb-8 pt-5">
          <div className="flex items-center justify-between"><TodayTitle day={r.selected} today={r.today} />{add}</div>
          {stats}
          {rows}
          {month}
        </main>
      ) : (
        <main className="grid h-full grid-cols-[minmax(0,1fr)_373px] gap-x-[16px] p-[21px]">
          <section className="flex min-h-0 flex-col gap-[12px]">
            <div className="flex h-[31px] flex-none items-center"><TodayTitle day={r.selected} today={r.today} /></div>
            {rows}
          </section>
          <aside className="flex min-h-0 flex-col gap-[12px]">
            <div className="flex h-[31px] flex-none items-center justify-end">{add}</div>
            {stats}
            {month}
          </aside>
        </main>
      ))}
      {dialog && (
        <ActivityDialog mobile={mobile} title={dialog.habit ? 'Rename activity' : 'New activity'} initialName={dialog.habit?.name}
          onClose={() => setDialog(null)}
          onSave={async (name) => {
            await (dialog.habit ? r.renameHabit(dialog.habit.id, name) : r.addHabit(name));
            setDialog(null);
          }} />
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};