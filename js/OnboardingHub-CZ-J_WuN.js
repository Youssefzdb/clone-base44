var e=`# employee_onboarding — app files

## base44/entities/Document.jsonc
\`\`\`json
{
  "name": "Document",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": [
        "PDF",
        "DOC",
        "IMG"
      ]
    },
    "size": {
      "type": "string"
    },
    "url": {
      "type": "string"
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
    "title",
    "type"
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

## base44/entities/NewHire.jsonc
\`\`\`json
{
  "name": "NewHire",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "role": {
      "type": "string"
    },
    "department": {
      "type": "string"
    },
    "startDate": {
      "type": "string",
      "format": "date"
    },
    "startTime": {
      "type": "string"
    },
    "location": {
      "type": "string"
    }
  },
  "required": [
    "name",
    "startDate"
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

## base44/entities/Person.jsonc
\`\`\`json
{
  "name": "Person",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "role": {
      "type": "string"
    },
    "color": {
      "type": "string",
      "enum": [
        "blue",
        "green",
        "pink",
        "yellow",
        "orange"
      ]
    },
    "met": {
      "type": "boolean",
      "default": false
    },
    "meetingDate": {
      "type": "string",
      "format": "date"
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
    "color"
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
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
\`\`\`

## base44/entities/Task.jsonc
\`\`\`json
{
  "name": "Task",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "ownerId": {
      "type": "string",
      "description": "A Person id, or \\"you\\" for the new hire"
    },
    "dueDate": {
      "type": "string",
      "format": "date"
    },
    "phase": {
      "type": "string",
      "enum": [
        "before",
        "week",
        "month"
      ]
    },
    "order": {
      "type": "number"
    },
    "completed": {
      "type": "boolean",
      "default": false
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "title",
    "phase",
    "order"
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
    "delete": {
      "user_condition": {
        "role": "admin"
      }
    }
  }
}
\`\`\`

## src/components/onboarding/Cover.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import CoverList from './CoverList';
import Typed from './Typed';
import Wordmark from './Wordmark';
import { fullDate, pad2, weekday } from './format';
import { useTween } from './motion';
import { useCoverPhase } from './useCoverPhase';

function Column({ label, value, sub, index, build }) {
  const at = index * 0.22;
  return (
    <div className="relative pt-[11px]">
      <motion.span className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--swatch-1)]" initial={build ? { scaleX: 0 } : false} animate={{ scaleX: 1 }} transition={{ delay: at, duration: 0.5 }} />
      <Typed className="label block" text={label} play={build} delay={at} duration={0.2} />
      <Typed className="mt-[12px] block text-[20px] font-medium leading-none tight" text={value} play={build} delay={at + 0.1} />
      <Typed className="mt-[11px] block text-[14px]" text={sub} play={build} delay={at + 0.35} duration={0.4} />
    </div>
  );
}

export default function Cover({ data, run, fromHub, onReplay, onOpen }) {
  const phase = useCoverPhase(run, fromHub);
  const build = phase === 'build' || phase === 'count';
  const total = data.tasks.length;
  // Jumps to 00 as the build starts, then counts up to the total.
  const count = useTween(phase === 'build' ? 0 : total, { duration: phase === 'count' ? 2.2 : 0, ease: 'easeInOut' });
  const { hire } = data;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[var(--swatch-2)]">
      {phase !== 'clear' && (
        <div className="caps absolute inset-x-[27px] top-[26px] flex justify-between text-[14px]">
          <button type="button" onClick={onReplay} title="Replay the intro"><Typed text="NEW HIRE" play={build} duration={0.3} /></button>
          <Typed text={hire.startDate.slice(0, 4)} play={build} duration={0.3} />
        </div>
      )}
      {phase === 'clear' && fromHub && (
        <p className="label absolute left-[27px] top-[84px] font-bold">{total}/{total} tasks · {data.docs.length} documents · {data.people.length} people</p>
      )}
      {phase !== 'clear' && (
        <>
          <div className="absolute left-[27px] top-[80px] grid w-[706px] grid-cols-3 gap-[27px]">
            <Column index={0} build={build} label="New hire" value={hire.name} sub={\`\${hire.role} — \${hire.department}\`} />
            <Column index={1} build={build} label="Start date" value={\`\${weekday(hire.startDate, 'short')} \${fullDate(hire.startDate)}\`} sub={\`\${hire.startTime} — \${hire.location}\`} />
            <Column index={2} build={build} label="Plan" value="Three phases" sub="Before Day One / First Week / First Month" />
          </div>
          <motion.div className="absolute left-[24px] top-[212px] flex items-start" initial={build ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <span className="text-[101px] font-medium leading-none tracking-[-0.05em]" aria-label={\`\${total} tasks\`}>{pad2(count)}</span>
            <span className="caps ml-[10px] mt-[60px] text-[14px] leading-[1.35]">/{total} tasks<br />seeded</span>
          </motion.div>
          <CoverList tasks={data.tasks} build={build} offset={build ? count / 2 : 0} />
        </>
      )}
      {build && (
        <motion.p className="caps absolute left-[27px] top-[429px] flex items-center text-[14px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          <span className="mr-[7px] h-[7px] w-[7px] bg-[var(--swatch-1)]" />New hire onboarding — Before day one → First month
        </motion.p>
      )}
      <Wordmark key={\`\${build}-\${phase === 'clear'}-\${run}\`} mode={build ? 'in' : { rest: 'rest', clear: fromHub ? 'pass' : 'out' }[phase]} onOpen={onOpen} />
    </div>
  );
}
\`\`\`

## src/components/onboarding/CoverList.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { pad2, phaseOf } from './format';

const ROW = 36;

/** Every task on the cover; \`offset\` (rows) scrolls it as the build counts the tasks in. */
export default function CoverList({ tasks, offset, build }) {
  return (
    <div className="absolute left-[787px] right-[27px] top-[80px] h-[300px] overflow-hidden border-t border-[var(--swatch-1)] [mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)]">
      <ul style={{ transform: \`translateY(\${-offset * ROW}px)\` }}>
        {tasks.map((task, i) => {
          const phase = phaseOf(task.phase);
          return (
            <motion.li key={task.id} initial={build ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
              className="flex h-[36px] items-center border-b border-[var(--swatch-4)]">
              <span className="w-[22px] text-[14px]">{pad2(task.order)}</span>
              <span className="ml-[3px] mr-[11px] h-[6px] w-[6px]" style={{ background: phase.color }} />
              <span className="flex-1 truncate text-[14px] font-medium tight">{task.title}</span>
              <span className="border border-[var(--swatch-1)] px-[4px] py-[1px] text-[7px] font-medium uppercase tracking-[0.06em]">{phase.tag}</span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
\`\`\`

## src/components/onboarding/format.js
\`\`\`js
export const PHASES = [
  { id: 'before', title: 'Before Day One', tag: '#BEFORE', color: 'var(--ui-blue)' },
  { id: 'week', title: 'First Week', tag: '#WEEK', color: 'var(--ui-red)' },
  { id: 'month', title: 'First Month', tag: '#MONTH', color: 'var(--ui-yellow)' },
];
export const phaseOf = (id) => PHASES.find((p) => p.id === id) ?? PHASES[0];

export const YOU = 'you';

/** The desktop hub's five columns; the menu above uses the same grid so its links sit over their columns. */
export const HUB_GRID = 'grid grid-cols-[repeat(5,minmax(0,1fr))] gap-x-[32px] px-[27px]';

export const pad2 = (n) => String(Math.round(n)).padStart(2, '0');

const parse = (iso) => new Date(\`\${iso}T00:00:00\`);
export const toIso = (d) => \`\${d.getFullYear()}-\${pad2(d.getMonth() + 1)}-\${pad2(d.getDate())}\`;
export const addDays = (iso, days) => {
  const d = parse(iso);
  d.setDate(d.getDate() + days);
  return toIso(d);
};
export const dayMonth = (iso) => (iso ? \`\${iso.slice(8, 10)}.\${iso.slice(5, 7)}\` : '—');
export const fullDate = (iso, yearDigits = 4) => \`\${dayMonth(iso)}.\${iso.slice(4 - yearDigits, 4)}\`;
export const weekday = (iso, style = 'long') => parse(iso).toLocaleDateString('en-US', { weekday: style });

/** Fill and text color of a person's color. */
export const personTint = (color) => ({ background: \`var(--ui-\${color})\`, color: \`var(--ui-\${color}-ink)\` });
export const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);
\`\`\`

## src/components/onboarding/Hub.jsx
\`\`\`jsx
import { useRef } from 'react';
import HubHeader from './HubHeader';
import PhaseColumn from './PhaseColumn';
import { Documents, People } from './Sidebar';
import { HUB_GRID, PHASES } from './format';
import { useAfter } from './motion';

export default function Hub({ data, onHome }) {
  const sections = { checklist: useRef(null), documents: useRef(null), people: useRef(null) };
  // The percentage counts up once the rows have come in.
  const settled = useAfter(1700);
  const jump = (name) => {
    const el = sections[name].current;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    el?.focus();
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--swatch-3)]">
      <HubHeader hire={data.hire} done={data.done} total={data.tasks.length} percent={settled ? data.percent : 0} onHome={onHome} onJump={jump} />
      <main className={\`\${HUB_GRID} min-h-0 flex-1 grid-rows-[minmax(0,1fr)] pt-[40px]\`}>
        {/* Columns scroll on their own; a task's meta line may still run into the gap. */}
        {PHASES.map((phase, i) => (
          <div key={phase.id} ref={i === 0 ? sections.checklist : undefined} tabIndex={i === 0 ? -1 : undefined} data-col
            className="-mr-[28px] min-h-0 overflow-y-auto pr-[28px]">
            <PhaseColumn phase={phase} index={i} tasks={data.tasks.filter((t) => t.phase === phase.id)} ownerOf={data.ownerOf} onToggle={data.toggleTask} />
          </div>
        ))}
        <aside data-col className="min-h-0 overflow-y-auto"><Documents ref={sections.documents} docs={data.docs} /></aside>
        <aside data-col className="min-h-0 overflow-y-auto"><People ref={sections.people} people={data.people} onToggleMet={data.toggleMet} /></aside>
      </main>
    </div>
  );
}
\`\`\`

## src/components/onboarding/HubHeader.jsx
\`\`\`jsx
import ProgressBar from './ProgressBar';
import { HUB_GRID, fullDate, weekday } from './format';
import { useTween } from './motion';

export default function HubHeader({ hire, done, total, percent, onHome, onJump }) {
  const shown = useTween(percent, { duration: 0.5 });
  return (
    <header className="flex-none bg-[var(--swatch-2)]">
      {/* The bar and menu stay pinned while the rest of the header scrolls away. */}
      <div className="sticky top-0 z-10 bg-[var(--swatch-2)]">
        <div className="relative flex h-[23px] items-center justify-center border-b border-[var(--swatch-1)] bg-[var(--swatch-3)]">
          <span className="absolute left-[11px] flex gap-[5px]">{[0, 1, 2].map((i) => <i key={i} className="h-[8px] w-[8px] border border-[var(--swatch-1)]" />)}</span>
          <span className="text-[14px] font-medium tracking-[0.06em]">ONBOARDING HUB</span>
        </div>
        <nav className={\`caps \${HUB_GRID} h-[31px] items-center\`}>
          <button type="button" onClick={onHome} className="justify-self-start">ONBOARDING HUB<sup className="text-[5px]">®</sup></button>
          <button type="button" onClick={() => onJump('checklist')} className="justify-self-start">CHECKLIST</button>
          <button type="button" onClick={() => onJump('documents')} className="col-start-4 justify-self-start">DOCUMENTS</button>
          <span className="flex items-center justify-between">
            <button type="button" onClick={() => onJump('people')}>PEOPLE</button>
            <span className="ml-[12px] min-w-0 truncate">{hire.name}</span>
          </span>
        </nav>
      </div>
      <div className="relative h-[158px]">
        <div className="absolute left-[27px] top-[54px] w-[266px] border-t border-[var(--swatch-1)] pt-[9px]">
          <div className="label">New hire</div>
          <div className="mt-[12px] text-[31px] font-medium leading-none tight">{hire.name}</div>
          <div className="mt-[4px] text-[14px]">{hire.role} — {hire.department}</div>
        </div>
        <div className="absolute left-[320px] top-[54px] w-[220px] border-t border-[var(--swatch-1)] pt-[9px]">
          <div className="label">Start date</div>
          <div className="mt-[12px] text-[31px] font-medium leading-none tight">{fullDate(hire.startDate, 2)}</div>
          <div className="mt-[4px] text-[14px]">{weekday(hire.startDate)}, {hire.startTime} — {hire.location}</div>
        </div>
        <div className="absolute left-[567px] top-[78px] w-[426px] border-t border-[var(--swatch-1)] pt-[11px]">
          <div className="label">Overall progress</div>
          <ProgressBar done={done} total={total} percent={percent} height={8} className="mt-[7px]" footClass="mt-[8px] text-[14px]" />
        </div>
        <div className="absolute right-[23px] top-[38px] text-[110px] font-medium leading-none tracking-[-0.06em]" aria-hidden="true">{Math.round(shown)}%</div>
      </div>
    </header>
  );
}
\`\`\`

## src/components/onboarding/MobileHeader.jsx
\`\`\`jsx
import ProgressBar from './ProgressBar';
import { fullDate, weekday } from './format';
import { useTween } from './motion';

function Column({ label, value, sub }) {
  return (
    <div className="min-w-0 border-t border-[var(--swatch-1)] pt-[8px]">
      <div className="label">{label}</div>
      <div className="mt-[8px] truncate text-[24px] font-medium leading-none tight">{value}</div>
      <div className="mt-[6px] truncate text-[14px]">{sub}</div>
    </div>
  );
}

export default function MobileHeader({ hire, done, total, percent }) {
  const shown = useTween(percent, { duration: 0.5 });
  const place = hire.location.replace('Floor', 'Fl.');
  return (
    <header className="flex-none bg-[var(--swatch-2)] px-[20px] pb-[16px]">
      <div className="caps flex h-[48px] items-center justify-between">
        <span>ONBOARDING HUB<sup className="text-[7px]">®</sup></span>
        <span>{hire.name}</span>
      </div>
      <div className="mt-[8px] grid grid-cols-2 gap-[16px]">
        <Column label="New hire" value={hire.name} sub={hire.role} />
        <Column label="Start date" value={fullDate(hire.startDate, 2)} sub={\`\${weekday(hire.startDate, 'short')} \${hire.startTime} — \${place}\`} />
      </div>
      <div className="mt-[18px] flex items-end justify-between border-t border-[var(--swatch-1)] pt-[8px]">
        <span className="label mb-[8px]">Overall progress</span>
        <span className="text-[64px] font-medium leading-[0.85] tracking-[-0.06em]" aria-hidden="true">{Math.round(shown)}%</span>
      </div>
      <ProgressBar done={done} total={total} percent={percent} height={10} className="mt-[12px]" footClass="mt-[8px] text-[14px]" />
    </header>
  );
}
\`\`\`

## src/components/onboarding/MobileHub.jsx
\`\`\`jsx
import { useState } from 'react';
import MobileHeader from './MobileHeader';
import PhaseColumn from './PhaseColumn';
import { INVERT, metTag } from './Sidebar';
import { PHASES, dayMonth, initials, pad2, personTint } from './format';

const TABS = ['CHECKLIST', 'DOCUMENTS', 'PEOPLE'];

function Heading({ title, count }) {
  return (
    <div className="mx-[20px] flex h-[60px] items-end justify-between border-b-2 border-[var(--swatch-1)] pb-[10px]">
      <h2 className="text-[22px] font-medium leading-none tight">{title}</h2>
      <span className="text-[14px] font-medium">({count})</span>
    </div>
  );
}

const ROW = \`flex items-center gap-[12px] border-b border-[var(--swatch-4)] px-[20px] \${INVERT}\`;

/** The hub below 768px: the whole page scrolls, the header scrolls away and the tab bar sticks to the top. */
export default function MobileHub({ data }) {
  const [tab, setTab] = useState('CHECKLIST');
  const met = data.people.filter((p) => p.met).length;
  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-[var(--swatch-3)]">
      <MobileHeader hire={data.hire} done={data.done} total={data.tasks.length} percent={data.percent} />
      <div role="tablist" className="caps sticky top-0 z-10 grid h-[44px] grid-cols-3 border-y border-[var(--swatch-1)] bg-[var(--swatch-3)]">
        {TABS.map((name, i) => (
          <button key={name} type="button" role="tab" aria-selected={tab === name} onClick={() => setTab(name)}
            className={\`\${i ? 'border-l border-[var(--swatch-1)]' : ''} \${tab === name ? 'bg-[var(--swatch-1)] text-[var(--swatch-3)]' : ''}\`}>{name}</button>
        ))}
      </div>
      <main role="tabpanel" aria-label={tab} className="pb-[24px]">
        {tab === 'CHECKLIST' && PHASES.map((phase, i) => (
          <PhaseColumn key={phase.id} mobile phase={phase} index={i} tasks={data.tasks.filter((t) => t.phase === phase.id)} ownerOf={data.ownerOf} onToggle={data.toggleTask} />
        ))}
        {tab === 'DOCUMENTS' && (
          <section aria-label="Documents">
            <Heading title="Documents" count={pad2(data.docs.length)} />
            {data.docs.map((doc) => (
              <div key={doc.id} className={\`\${ROW} h-[56px]\`}>
                <span className="flex h-[22px] w-[40px] flex-none items-center justify-center border border-[var(--swatch-1)] text-[10px] font-medium tracking-[0.06em] group-hover:border-[var(--swatch-1-ink)]">{doc.type}</span>
                <span className="min-w-0 flex-1 truncate text-[16px] font-medium tight">{doc.title}</span>
                <span className="text-[14px] font-medium tracking-[0.06em]">{doc.size}</span>
                {doc.url && <a href={doc.url} target="_blank" rel="noreferrer" aria-label={\`Open \${doc.title}\`} className="flex h-[44px] w-[24px] items-center justify-end text-[16px]">↗</a>}
              </div>
            ))}
          </section>
        )}
        {tab === 'PEOPLE' && (
          <section aria-label="People to meet">
            <Heading title="People to meet" count={\`\${pad2(met)}/\${pad2(data.people.length)}\`} />
            {data.people.map((person) => (
              <div key={person.id} className={\`\${ROW} h-[64px]\`}>
                <span className="flex h-[36px] w-[36px] flex-none items-center justify-center text-[12px] font-bold" style={personTint(person.color)}>{initials(person.name)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-medium tight">{person.name}</span>
                  <span className="mt-[3px] block truncate text-[14px] font-medium uppercase tracking-[0.06em]">{person.role}</span>
                </span>
                <button type="button" aria-pressed={person.met} onClick={() => data.toggleMet(person)} title={person.met ? 'Mark as not met' : 'Mark as met'}
                  className={\`flex h-[32px] min-w-[56px] items-center justify-center border border-[var(--swatch-1)] px-[8px] text-[14px] font-bold tracking-[0.06em] group-hover:border-[var(--swatch-1-ink)] \${metTag(person.met)}\`}>
                  {person.met ? 'MET' : dayMonth(person.meetingDate)}
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
\`\`\`

## src/components/onboarding/motion.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** A number that eases to each new target (counters, percentages, the cover's list scroll). */
export function useTween(target, { duration = 0.6, ease = 'easeOut' } = {}) {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const controls = animate(current.current, target, {
      duration: reduced() ? 0 : duration,
      ease,
      onUpdate: (v) => { current.current = v; setValue(v); },
    });
    return () => controls.stop();
  }, [target]);
  return value;
}

/** True once \`ms\` have passed since mount — a staged entrance. */
export function useAfter(ms) {
  const [passed, setPassed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setPassed(true), ms);
    return () => clearTimeout(t);
  }, []);
  return passed;
}

/** How many characters of a typed-in string show: all of it unless \`play\`. */
export function useTyped(text, play, delay = 0, duration = 0.45) {
  const [shown, setShown] = useState(play ? 0 : text.length);
  useEffect(() => {
    if (!play) return undefined;
    let n = 0;
    let tick;
    const start = setTimeout(() => {
      tick = setInterval(() => {
        n += 1;
        setShown(n);
        if (n >= text.length) clearInterval(tick);
      }, (duration * 1000) / text.length);
    }, delay * 1000);
    return () => { clearTimeout(start); clearInterval(tick); };
  }, [play, text]);
  return text.slice(0, shown);
}
\`\`\`

## src/components/onboarding/onboarding.css
\`\`\`css
@font-face{font-family:"Neue Haas Unica";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-500-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-700-normal.woff2) format("woff2")}

/* The look: ink, ground (nav + header), surface (page), rules — plus fixed phase and people colors. */
:root{
  --swatch-1:#111111;--swatch-1-ink:#FFFFFF;
  --swatch-2:#FF7A3D;--swatch-2-ink:#111111;
  --swatch-3:#FFF6EF;--swatch-3-ink:#111111;
  --swatch-4:#D9C2B3;--swatch-4-ink:#111111;
  --ui-blue:#2447F0;--ui-blue-ink:#FFFFFF;
  --ui-red:#EE4B3A;--ui-red-ink:#111111;
  --ui-yellow:#E6D32A;--ui-yellow-ink:#111111;
  --ui-green:#1F9D55;--ui-green-ink:#111111;
  --ui-pink:#E0338C;--ui-pink-ink:#111111;
  --ui-orange:#F08A3C;--ui-orange-ink:#111111;
  --ui-muted:#3D2A22;
}
/* gallery-look */

.ob{font-family:"Neue Haas Unica","Helvetica Neue",Arial,sans-serif;color:var(--swatch-1);font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
.ob *{border-radius:0}
.ob :focus-visible{outline:2px solid var(--swatch-1);outline-offset:2px}
.ob .label{font-size:14px;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
.ob .caps{font-size:14px;font-weight:700;letter-spacing:.02em;text-transform:uppercase}
.ob .tight{letter-spacing:-.03em}
.ob .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){.ob *{transition:none!important}}
\`\`\`

## src/components/onboarding/PhaseColumn.jsx
\`\`\`jsx
import TaskRow from './TaskRow';

export default function PhaseColumn({ phase, index, tasks, ownerOf, mobile, onToggle }) {
  const done = tasks.filter((t) => t.completed).length;
  const complete = tasks.length > 0 && done === tasks.length;
  return (
    <section aria-label={phase.title}>
      <div className={\`flex items-end border-b-2 border-[var(--swatch-1)] \${mobile ? 'mx-[20px] h-[60px] pb-[10px]' : 'h-[54px] pb-[7px]'}\`}>
        <span className={mobile ? 'mb-[5px] mr-[10px] h-[12px] w-[12px]' : 'mb-[6px] mr-[9px] h-[11px] w-[11px]'} style={{ background: phase.color }} />
        <h2 className={\`flex-1 font-medium leading-none tight \${mobile ? 'text-[22px]' : 'text-[21px]'}\`}>{phase.title}</h2>
        {complete
          ? <span className={\`mb-[1px] bg-[var(--swatch-1)] font-bold tracking-[0.06em] text-[var(--swatch-1-ink)] \${mobile ? 'px-[8px] py-[4px] text-[10px]' : 'px-[6px] py-[3px] text-[7.5px]'}\`}>COMPLETE</span>
          : <span className={\`mb-[2px] font-medium \${mobile ? 'text-[14px]' : 'text-[12.5px]'}\`}>({done}/{tasks.length})</span>}
        <span className="sr-only" aria-live="polite">{complete ? \`\${phase.title} complete\` : ''}</span>
      </div>
      {tasks.map((task, i) => (
        <TaskRow key={task.id} task={task} owner={ownerOf(task)} delay={0.15 + index * 0.16 + i * 0.07} mobile={mobile} onToggle={() => onToggle(task)} />
      ))}
    </section>
  );
}
\`\`\`

## src/components/onboarding/ProgressBar.jsx
\`\`\`jsx
import { motion, useReducedMotion } from 'framer-motion';
import { pad2 } from './format';

/** A 1px baseline with ticks at 25/50/75% and a solid fill; the counts sit beneath it. */
export default function ProgressBar({ done, total, percent, height, className = '', footClass }) {
  const reduced = useReducedMotion();
  return (
    <div className={className}>
      <div role="progressbar" aria-label="Overall progress" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total} className="relative" style={{ height }}>
        <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--swatch-1)]" />
        {[25, 50, 75].map((t) => <span key={t} className="absolute top-0 h-full w-px bg-[var(--swatch-1)]" style={{ left: \`\${t}%\` }} />)}
        <motion.span className="absolute left-0 top-0 h-full bg-[var(--swatch-1)]" initial={false} animate={{ width: \`\${percent}%\` }} transition={{ duration: reduced ? 0 : 0.5, ease: 'easeOut' }} />
      </div>
      <div className={\`flex justify-between font-bold tracking-[0.06em] \${footClass}\`}>
        <span>{pad2(done)}/{total} TASKS COMPLETE</span><span>100</span>
      </div>
      <span className="sr-only" aria-live="polite">{done} of {total} tasks complete</span>
    </div>
  );
}
\`\`\`

## src/components/onboarding/seed.js
\`\`\`js
import { addDays, toIso } from './format';

// The coming Monday is day one; every date below is days from it, as in the design (start 05.10).
const nextMonday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
  return toIso(d);
};

const PEOPLE = [
  ['Daniel Park', 'Engineering Manager', 'blue', false, 0],
  ['Leo Alvarez', 'Onboarding Buddy', 'green', false, 0],
  ['Priya Shah', 'People Ops', 'pink', true, -7],
  ['Marcus Lee', 'IT Support', 'yellow', true, -4],
];

const TASKS = [
  ['Sign offer letter & contract', 'Priya Shah', -7, 'before', true],
  ['Set up email & Slack', 'Marcus Lee', -3, 'before'],
  ['Read the team handbook', 'You', -2, 'before'],
  ['Welcome call with manager', 'Daniel Park', -2, 'before'],
  ['Office tour & badge pickup', 'Priya Shah', 0, 'week'],
  ['Team intro lunch', 'Daniel Park', 0, 'week'],
  ['Set up dev environment', 'Leo Alvarez', 2, 'week'],
  ['Ship a first small fix', 'You', 4, 'week'],
  ['Product deep-dive session', 'Daniel Park', 9, 'month'],
  ['Draft your 30-60-90 plan', 'You', 14, 'month'],
  ['Own a first feature', 'Leo Alvarez', 22, 'month'],
  ['30-day check-in', 'Daniel Park', 28, 'month'],
];

const DOCS = [
  ['Employee Handbook', 'PDF', '2.4 MB'],
  ['Benefits Guide 2026', 'PDF', '1.1 MB'],
  ['IT Setup Checklist', 'DOC', '320 KB'],
];

export const buildSeed = () => {
  const start = nextMonday();
  return {
    hire: { name: 'Maya Chen', role: 'Product Engineer', department: 'Engineering', startDate: start, startTime: '9:00', location: 'HQ, Floor 4' },
    people: PEOPLE.map(([name, role, color, met, meet], i) => ({ name, role, color, met, meetingDate: addDays(start, meet), order: i + 1 })),
    // \`owner\` is a name here; the hook swaps it for the Person id once the people exist.
    tasks: TASKS.map(([title, owner, due, phase, completed = false], i) => ({ title, owner, dueDate: addDays(start, due), phase, order: i + 1, completed })),
    docs: DOCS.map(([title, type, size], i) => ({ title, type, size, order: i + 1 })),
  };
};
\`\`\`

## src/components/onboarding/Sidebar.jsx
\`\`\`jsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { dayMonth, initials, pad2, personTint } from './format';

// Hover inverts a row to ink with white text; its bordered tags follow the text color.
export const INVERT = 'group hover:bg-[var(--swatch-1)] hover:text-[var(--swatch-1-ink)]';
export const metTag = (met) => (met ? 'bg-[var(--swatch-1)] text-[var(--swatch-1-ink)] group-hover:bg-[var(--swatch-1-ink)] group-hover:text-[var(--swatch-1)]' : '');

const fade = (i) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.55 + i * 0.07, duration: 0.35 } });

function Heading({ title, count }) {
  return (
    <div className="flex h-[54px] items-end justify-between border-b-2 border-[var(--swatch-1)] pb-[7px]">
      <h2 className="text-[21px] font-medium leading-none tight">{title}</h2>
      <span className="mb-[2px] text-[12.5px] font-medium">({count})</span>
    </div>
  );
}

export const Documents = forwardRef(function Documents({ docs }, ref) {
  return (
    <section ref={ref} tabIndex={-1} aria-label="Documents">
      <Heading title="Documents" count={pad2(docs.length)} />
      {docs.map((doc, i) => (
        <motion.div key={doc.id} {...fade(i)} className={\`flex h-[66px] items-center border-b border-[var(--swatch-4)] \${INVERT}\`}>
          <span className="mr-[9px] flex h-[16px] w-[31px] items-center justify-center border border-[var(--swatch-1)] group-hover:border-[var(--swatch-1-ink)] text-[7.5px] font-medium tracking-[0.06em]">{doc.type}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-medium leading-[1.25] tight">{doc.title}</span>
            <span className="mt-[3px] block text-[14px] leading-[1.25] tracking-[0.02em]">{doc.size}</span>
          </span>
          {doc.url && <a href={doc.url} target="_blank" rel="noreferrer" className="ml-[8px] flex-none text-[14px] font-bold tracking-[0.02em]">OPEN ↗</a>}
        </motion.div>
      ))}
    </section>
  );
});

export const People = forwardRef(function People({ people, onToggleMet }, ref) {
  const met = people.filter((p) => p.met).length;
  return (
    <section ref={ref} tabIndex={-1} aria-label="People to meet">
      <Heading title="People to meet" count={\`\${pad2(met)}/\${pad2(people.length)}\`} />
      {people.map((person, i) => (
        <motion.div key={person.id} {...fade(i + 5)} className={\`flex h-[66px] items-center border-b border-[var(--swatch-4)] \${INVERT}\`}>
          <span className="mr-[8px] flex h-[19px] w-[19px] flex-none items-center justify-center text-[6.5px] font-bold" style={personTint(person.color)}>{initials(person.name)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-medium leading-[1.25] tight">{person.name}</span>
            <span className="mt-[3px] block truncate text-[14px] leading-[1.25] tight">{person.role}</span>
          </span>
          <button type="button" aria-pressed={person.met} onClick={() => onToggleMet(person)} title={person.met ? 'Mark as not met' : 'Mark as met'}
            className={\`ml-[8px] flex h-[17px] min-w-[35px] flex-none items-center justify-center border border-[var(--swatch-1)] group-hover:border-[var(--swatch-1-ink)] px-[4px] text-[14px] font-bold leading-none tracking-[0.02em] \${metTag(person.met)}\`}>
            {person.met ? 'MET' : dayMonth(person.meetingDate)}
          </button>
        </motion.div>
      ))}
    </section>
  );
});
\`\`\`

## src/components/onboarding/TaskRow.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { dayMonth, pad2 } from './format';

export function Check({ size = 11 }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M2 6.3 4.8 9 10 3" />
    </svg>
  );
}

// Desktop sizes (1280×720) and the mobile list's (min 64px rows, 22px box, 16px title).
const SIZES = {
  desktop: { row: 'h-[90px] grid-cols-[25px_25px_1fr] pt-[22px]', num: 'pt-[2px] text-[14px] leading-none', box: 'h-[15px] w-[15px]', check: 11, title: 'max-w-full truncate text-[14px]', meta: '-mr-[28px] mt-[9px] gap-[6px] whitespace-nowrap text-[14px] tracking-[0.02em]', dot: 'h-[6px] w-[6px]' },
  mobile: { row: 'min-h-[64px] grid-cols-[30px_34px_1fr] px-[20px] py-[13px]', num: 'pt-[3px] text-[14px]', box: 'h-[22px] w-[22px]', check: 15, title: 'text-[16px]', meta: 'mt-[6px] gap-[7px] text-[14px] tracking-[0.06em]', dot: 'h-[8px] w-[8px]' },
};

export default function TaskRow({ task, owner, delay, mobile, onToggle }) {
  const done = task.completed;
  const z = SIZES[mobile ? 'mobile' : 'desktop'];
  const ownerName = owner ? owner.name : 'You';
  return (
    <motion.button type="button" role="checkbox" aria-checked={done} onClick={onToggle}
      initial={mobile ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.35 }}
      className={\`grid w-full border-b border-[var(--swatch-4)] text-left \${z.row}\`}>
      <span className={z.num}>{pad2(task.order)}</span>
      <span className={\`flex \${z.box} items-center justify-center border-[1.5px] border-[var(--swatch-1)] \${done ? 'bg-[var(--swatch-1)] text-[var(--swatch-1-ink)]' : ''}\`}>
        {done && <Check size={z.check} />}
      </span>
      <span className="min-w-0">
        <span className={\`relative inline-block \${z.title} font-medium leading-[1.2] tight transition-colors duration-300 \${done ? 'text-[var(--ui-muted)]' : ''}\`}>
          {task.title}
          <span className={\`absolute inset-x-0 top-[55%] h-[1.5px] origin-left motion-reduce:transition-none bg-current transition-transform duration-[350ms] \${done ? 'scale-x-100' : 'scale-x-0'}\`} />
        </span>
        <span className={\`flex items-center font-medium uppercase \${z.meta}\`}>
          <span className={\`flex-none \${z.dot}\`} style={{ background: owner ? \`var(--ui-\${owner.color})\` : 'var(--swatch-1)' }} />
          <span className="min-w-0 truncate">{ownerName}</span><span>/</span><span className="flex-none">Due {dayMonth(task.dueDate)}</span>
        </span>
      </span>
    </motion.button>
  );
}
\`\`\`

## src/components/onboarding/Typed.jsx
\`\`\`jsx
import { useTyped } from './motion';

/** Text that types itself in when \`play\` (the cover's build); otherwise plain text. */
export default function Typed({ text, play, delay, duration, className }) {
  const shown = useTyped(text, play, delay, duration);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <span aria-hidden="true" className="invisible">{text.slice(shown.length)}</span>
    </span>
  );
}
\`\`\`

## src/components/onboarding/useCoverPhase.js
\`\`\`js
import { useEffect, useState } from 'react';

/**
 * The cover is still at first ('rest'). Each replay (\`run\`) clears it, builds it back up, then
 * counts the tasks in ('count'); coming back from the checklist (\`fromHub\`) the wordmark passes
 * through first, so the clear lasts longer.
 */
export function useCoverPhase(run, fromHub) {
  const [phase, setPhase] = useState(run ? 'clear' : 'rest');
  useEffect(() => {
    if (!run) return undefined;
    setPhase('clear');
    const clear = fromHub ? 2950 : 350;
    const timers = [setTimeout(() => setPhase('build'), clear), setTimeout(() => setPhase('count'), clear + 1200)];
    return () => timers.forEach(clearTimeout);
  }, [run]);
  return phase;
}
\`\`\`

## src/components/onboarding/useFitWidth.js
\`\`\`js
import { useEffect, useState } from 'react';

/**
 * A fixed-canvas page laid out for \`width\`: below that width it scales down uniformly (CSS zoom) rather
 * than reflowing, keeping its positions and drag targets intact. Returns the style for its root.
 */
export function useFitWidth(width) {
  // Both sides: the zoom follows the width, the root's height the window's height.
  const [[w, h], setView] = useState(() => (typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight]));
  useEffect(() => {
    const onResize = () => setView([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const fit = Math.min(1, w / width);
  // Exactly the window's height, as at full width; the page scrolls its 720px canvas inside it.
  return fit < 1 ? { zoom: fit, width, height: h / fit } : undefined;
}
\`\`\`

## src/components/onboarding/useIsMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 767px)';

/** Below 768px wide the hub switches to its stacked, tabbed mobile layout. */
export function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && (window.matchMedia?.(QUERY).matches ?? false));
  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return undefined;
    const onChange = () => setMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return mobile;
}
\`\`\`

## src/components/onboarding/useOnboarding.js
\`\`\`js
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { YOU } from './format';
import { buildSeed } from './seed';

const { NewHire, Task, Person, Document } = base44.entities;
const byOrder = (rows) => [...rows].sort((a, b) => a.order - b.order);
const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));
const listAll = (Entity) => Entity.list('order', 1000);

// Adds the sample rows still missing, matched by a stable field among rows marked \`sample\` (dates follow the day
// of seeding), in one request: entity calls are rate-limited per app, so a seed of single creates fails partway.
// Two first loads at once can both add them: the oldest copy of each stays, and a failed delete throws, so the
// NewHire marker isn't written and the next load retries.
const reconcile = async (Entity, rows, samples, key) => {
  // A table holding rows the app didn't mark was filled by the builder (or the user): it isn't ours to seed.
  const missing = rows.some((r) => !r.sample) ? [] : samples.filter((s) => !rows.some((r) => r[key] === s[key]));
  if (missing.length) await Entity.bulkCreate(missing.map((s) => ({ ...s, sample: true })));
  const now = missing.length ? await listAll(Entity) : rows;
  const seen = new Set();
  const extra = now.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(r[key]) || !seen.add(r[key]));
  if (extra.length) await Entity.deleteMany({ id: { $in: extra.map((r) => r.id) } });
  return now.filter((r) => !extra.includes(r));
};

const withOwners = (tasks, people) => {
  const ownerId = (name) => (name === 'You' ? YOU : people.find((p) => p.name === name)?.id ?? YOU);
  return tasks.map(({ owner, ...t }) => ({ ...t, ownerId: ownerId(owner) }));
};

// The bundled samples, not saved: what anyone but an admin sees before the app is set up.
const unsavedSamples = () => {
  const seed = buildSeed();
  const ids = (rows, kind) => rows.map((r, i) => ({ id: \`sample-\${kind}-\${i + 1}\`, ...r }));
  const people = ids(seed.people, 'person');
  return { hire: { id: 'sample-hire', ...seed.hire }, people, tasks: ids(withOwners(seed.tasks, people), 'task'), docs: ids(seed.docs, 'doc'), unsaved: true };
};

async function load() {
  const me = await base44.auth.me().catch(() => null);
  let [hire] = await NewHire.list();
  if (!hire && me?.role !== 'admin') return unsavedSamples();
  let [tasks, people, docs] = await Promise.all([listAll(Task), listAll(Person), listAll(Document)]);
  if (!hire) {
    // The NewHire row marks the app set up, so it is written last: a reload mid-seed resumes,
    // and someone who later deletes every task never gets the samples back.
    const seed = buildSeed();
    people = await reconcile(Person, people, seed.people, 'name');
    tasks = await reconcile(Task, tasks, withOwners(seed.tasks, people), 'title');
    docs = await reconcile(Document, docs, seed.docs, 'title');
    hire = await NewHire.create(seed.hire);
  }
  return { hire, tasks, people, docs, unsaved: false };
}

export function useOnboarding() {
  const [state, setState] = useState({ loading: true, failed: false, unsaved: false, hire: null, tasks: [], people: [], docs: [] });

  useEffect(() => {
    (async () => {
      try {
        const { hire, tasks, people, docs, unsaved } = await load();
        setState((s) => ({ ...s, hire, unsaved, tasks: byOrder(tasks), people: byOrder(people), docs: byOrder(docs) }));
      } catch {
        setState((s) => ({ ...s, failed: true }));
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    })();
  }, []);

  const patch = (list, Entity) => async (id, data) => {
    const set = (values) => setState((s) => ({ ...s, [list]: s[list].map((r) => (r.id === id ? { ...r, ...values } : r)) }));
    const before = state[list].find((r) => r.id === id);
    set(data);
    if (state.unsaved) return;
    try {
      await Entity.update(id, data);
    } catch {
      set(Object.fromEntries(Object.keys(data).map((k) => [k, before[k]])));
    }
  };
  const setTask = patch('tasks', Task);
  const setPerson = patch('people', Person);

  const done = state.tasks.filter((t) => t.completed).length;
  const ownerOf = (task) => (task.ownerId === YOU ? null : state.people.find((p) => p.id === task.ownerId));

  return {
    ...state,
    done,
    percent: state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0,
    ownerOf,
    toggleTask: (task) => setTask(task.id, { completed: !task.completed }),
    toggleMet: (person) => setPerson(person.id, { met: !person.met }),
  };
}
\`\`\`

## src/components/onboarding/Wordmark.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

const LETTERS = 'ONBOARDING'.split('');
const EASE = [0.2, 0.8, 0.2, 1];

// rest: still · in: letters rise from below · out: letters leave upward · pass: rise, hold, leave.
const motionFor = (mode, i) => {
  if (mode === 'in') return { initial: { y: '110%' }, animate: { y: '0%' }, transition: { duration: 0.55, ease: EASE, delay: 0.05 + i * 0.05 } };
  if (mode === 'out') return { initial: { y: '0%' }, animate: { y: '-110%' }, transition: { duration: 0.25, delay: i * 0.012 } };
  if (mode === 'pass') {
    return {
      initial: { y: '110%' },
      animate: { y: ['110%', '0%', '0%', '-110%'] },
      transition: { duration: 2, times: [0, 0.25, 0.78, 1], ease: EASE, delay: 0.4 + i * 0.03 },
    };
  }
  return { initial: false };
};

export default function Wordmark({ mode, onOpen }) {
  return (
    <button type="button" onClick={onOpen} aria-label="Open the onboarding checklist"
      className="absolute bottom-[17px] left-[22px] flex text-[min(15.6vw,27.7vh)] font-medium leading-[0.86] tracking-[-0.055em]">
      {LETTERS.map((letter, i) => (
        <span key={i} className="block pb-[0.04em] [clip-path:inset(0_-0.2em)]">
          <motion.span className="block" {...motionFor(mode, i)}>{letter}</motion.span>
        </span>
      ))}
    </button>
  );
}
\`\`\`

## src/pages/OnboardingHub.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import '@/components/onboarding/onboarding.css';
import { useFitWidth } from '@/components/onboarding/useFitWidth';
import Cover from '@/components/onboarding/Cover';
import Hub from '@/components/onboarding/Hub';
import MobileHub from '@/components/onboarding/MobileHub';
import { useIsMobile } from '@/components/onboarding/useIsMobile';
import { useOnboarding } from '@/components/onboarding/useOnboarding';

// The next screen slides up over the current one; the cover also lifts away as the checklist arrives.
const EASE = [0.65, 0, 0.35, 1];
const sheet = (exitY) => ({
  className: 'absolute inset-0',
  initial: { y: '100%', zIndex: 2 },
  animate: { y: '0%', zIndex: 2, transition: { duration: 0.6, ease: EASE } },
  exit: { y: exitY, zIndex: 1, transition: { duration: 0.6, ease: EASE } },
});

export default function OnboardingHub() {
  const data = useOnboarding();
  const mobile = useIsMobile();
  const [view, setView] = useState('cover');
  // \`visit\` changes only on the way back from the checklist, so a replay restarts the cover in place.
  const [cover, setCover] = useState({ run: 0, fromHub: false, visit: 0 });
  const fit = useFitWidth(1280);
  // Scrolling (or swiping up) past a small threshold on the cover opens the checklist; trackpads send many tiny steps.
  const pull = useRef({ sum: 0, last: 0 });
  const openOnPull = (dy) => {
    const p = pull.current;
    const now = performance.now();
    if (now - p.last > 250) p.sum = 0;
    p.last = now;
    p.sum = Math.max(0, p.sum + dy);
    if (p.sum > 40) { p.sum = 0; land.current = true; setView('hub'); }
  };
  // Opened by scrolling, the checklist lands scrolled down: header block away, menu pinned, the columns in view.
  const scroller = useRef(null);
  const land = useRef(false);
  useEffect(() => {
    if (view !== 'hub' || !land.current) return;
    land.current = false;
    requestAnimationFrame(() => scroller.current?.scrollTo({ top: scroller.current.scrollHeight }));
  }, [view]);
  const touchY = useRef(0);
  // A new scroll (or swipe down) up from the top of the checklist goes back to the cover. The gesture that brought the
  // page to the top stops there, so its trackpad momentum doesn't skip the header.
  const back = useRef({ sum: 0, armed: false, last: 0 });
  const homeOnPull = (dy, target) => {
    const b = back.current;
    const now = performance.now();
    const fresh = now - b.last > 250;
    b.last = now;
    // The page, or the column under the pointer, is still scrolling back to its top: this gesture stops there.
    if (scroller.current?.scrollTop > 0 || target?.closest?.('[data-col]')?.scrollTop > 0) { b.armed = false; b.sum = 0; return; }
    if (fresh) { b.armed = true; b.sum = 0; }
    if (!b.armed) return;
    b.sum = Math.max(0, b.sum + dy);
    if (b.sum > 40) { b.armed = false; b.sum = 0; showCover(true); setView('cover'); }
  };
  const showCover = (fromHub) => setCover((c) => ({ run: c.run + 1, fromHub, visit: c.visit + (fromHub ? 1 : 0) }));

  return (
    <MotionConfig reducedMotion="user">
      {/* The cover fits the window. The checklist is a window plus its 158px header block tall: scrolled down, its
          white section fills the window under the pinned menu. */}
      <div ref={scroller} className="ob relative h-screen w-full overflow-y-auto overflow-x-hidden bg-[var(--swatch-2)]" style={mobile ? undefined : fit}>
        <div className={\`relative h-full overflow-clip \${!mobile && view === 'hub' ? 'min-h-[max(720px,calc(100%_+_158px))]' : ''}\`}>
          {data.failed && <p role="alert" className="caps p-[27px]">Couldn’t load onboarding. Reload the page to try again.</p>}
          {/* The mobile layout is the checklist itself; the cover is the desktop's opening screen. */}
          {!data.loading && data.hire && mobile && <MobileHub data={data} />}
          {!data.loading && data.hire && !mobile && (
            <AnimatePresence initial={false}>
              {view === 'cover' ? (
                <motion.div key={\`cover-\${cover.visit}\`} {...sheet('-100%')} onWheel={(e) => openOnPull(e.deltaY)}
                  onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }} onTouchMove={(e) => { openOnPull(touchY.current - e.touches[0].clientY); touchY.current = e.touches[0].clientY; }}>
                  <Cover data={data} run={cover.run} fromHub={cover.fromHub} onReplay={() => showCover(false)} onOpen={() => { land.current = false; setView('hub'); }} />
                </motion.div>
              ) : (
                <motion.div key="hub" {...sheet('0%')} onWheel={(e) => homeOnPull(-e.deltaY, e.target)}
                  onTouchStart={(e) => { touchY.current = e.touches[0].clientY; back.current.last = 0; }} onTouchMove={(e) => { homeOnPull(e.touches[0].clientY - touchY.current, e.target); touchY.current = e.touches[0].clientY; }}>
                  <Hub data={data} onHome={() => { showCover(true); setView('cover'); }} />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};