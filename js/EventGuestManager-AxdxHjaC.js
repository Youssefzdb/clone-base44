var e=`# event_guest_manager — app files

## base44/entities/Event.jsonc
\`\`\`json
{
  "name": "Event",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "seats_per_table": {
      "type": "integer",
      "default": 12
    },
    "meals": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "default": [
        "Sea bass",
        "Short rib",
        "Risotto (V)",
        "Vegan bowl"
      ]
    }
  },
  "required": [
    "name",
    "date"
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

## base44/entities/Guest.jsonc
\`\`\`json
{
  "name": "Guest",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "party_size": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10,
      "default": 1
    },
    "rsvp": {
      "type": "string",
      "enum": [
        "awaiting",
        "attending",
        "declined"
      ],
      "default": "awaiting"
    },
    "meal": {
      "type": [
        "string",
        "null"
      ]
    },
    "table_id": {
      "type": [
        "string",
        "null"
      ]
    },
    "notes": {
      "type": "string"
    },
    "order": {
      "type": "number"
    },
    "rsvp_at": {
      "type": "string",
      "format": "date-time"
    },
    "seated_at": {
      "type": "string",
      "format": "date-time"
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "name"
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

## base44/entities/Table.jsonc
\`\`\`json
{
  "name": "Table",
  "type": "object",
  "properties": {
    "number": {
      "type": "integer"
    },
    "label": {
      "type": "string"
    },
    "capacity": {
      "type": "integer",
      "default": 12
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "number"
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

## src/components/event-guest-manager/event-guest-manager.css
\`\`\`css
@font-face{font-family:"Neue Haas Grotesk";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-400-normal.woff2) format("woff2")}
@font-face{font-family:"Ogg";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/ogg-400-normal.woff2) format("woff2")}
@font-face{font-family:"Snell Roundhand";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/snell-roundhand-400-normal.woff2) format("woff2")}

/* Swatches: 1 ink, 2 ground (page), 3 surface (cards), 4 muted text. --ui-*: cell fill, hairline,
   dense text, avatar, RSVP-change sweep, and the three status tints [background, text]. */
:root{
  --swatch-1:#F4F1EA;--swatch-1-ink:#111111;
  --swatch-2:#121211;--swatch-2-ink:#FFFFFF;
  --swatch-3:#1C1C1A;--swatch-3-ink:#FFFFFF;
  --swatch-4:#95928B;--swatch-4-ink:#111111;
  --ui-fill:#262523;--ui-line:#2E2D2A;--ui-body:#C9C6BF;--ui-avatar:#3A3834;--ui-sweep:#243A2D;
  --ui-attending:#24402F;--ui-attending-ink:#8FE0B0;
  --ui-awaiting:#33294A;--ui-awaiting-ink:#C7AEF5;
  --ui-declined:#3D2A24;--ui-declined-ink:#F0A88C;
}
/* gallery-look */

.egm{font-family:"Neue Haas Grotesk","Helvetica Neue",Arial,sans-serif;font-weight:400;color:var(--swatch-1);background:var(--swatch-2);letter-spacing:-0.015em;-webkit-font-smoothing:antialiased}
.egm .serif{font-family:"Ogg","Times New Roman",Georgia,serif;letter-spacing:-0.02em}
.egm .script{font-family:"Snell Roundhand",cursive;letter-spacing:0}
.egm .no-scrollbar{scrollbar-width:none}
.egm .no-scrollbar::-webkit-scrollbar{display:none}
@media (prefers-reduced-motion:reduce){.egm *{transition-duration:150ms!important}}
\`\`\`

## src/components/event-guest-manager/format.js
\`\`\`js
export const STATUSES = ['attending', 'awaiting', 'declined'];
export const STATUS_LABEL = { attending: 'Attending', awaiting: 'Awaiting', declined: 'Declined' };
export const DEFAULT_MEALS = ['Sea bass', 'Short rib', 'Risotto (V)', 'Vegan bowl'];
export const EASE_ENTER = [0.2, 0.8, 0.2, 1];
export const EASE_MOVE = [0.4, 0, 0.2, 1];

const CYCLE = { awaiting: 'attending', attending: 'declined', declined: 'awaiting' };
export const nextRsvp = (rsvp) => CYCLE[rsvp] ?? 'awaiting';

/** Tinted background + same-hue text of a status. */
export const tint = (status) => ({ background: \`var(--ui-\${status})\`, color: \`var(--ui-\${status}-ink)\` });

export const party = (n) => \`×\${n}\`;
export const eventDate = (iso) => (iso ? iso.slice(0, 10).split('-').reverse().join('.') : '');
export const sumParty = (guests) => guests.reduce((sum, g) => sum + (g.party_size || 1), 0);
export const nowIso = () => new Date().toISOString();
\`\`\`

## src/components/event-guest-manager/GuestDrawer.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { EASE_ENTER, STATUSES, STATUS_LABEL, tint } from './format';

const field = 'mt-[6px] w-full rounded-[9px] bg-[var(--ui-fill)] px-[11px] text-[14px] text-[var(--swatch-1)] outline-none';
const chip = (on) => \`h-[27px] rounded-full px-[11px] text-[14px] \${on ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : 'bg-[var(--ui-fill)]'}\`;
const Group = ({ title, children }) => (
  <div className="mt-[16px]"><div className="text-[14px] text-[var(--swatch-4)]">{title}</div><div className="mt-[6px] flex flex-wrap gap-[6px]">{children}</div></div>
);

export default function GuestDrawer({ guest, meals, tables, room, onSave, onDelete, onClose, sheet = false }) {
  const [v, setV] = useState({ name: '', party_size: 1, rsvp: 'awaiting', meal: null, table_id: null, notes: '', ...guest });
  const set = (patch) => setV((cur) => ({ ...cur, ...patch }));
  const tableId = v.rsvp === 'attending' ? v.table_id : null;
  const full = !!tableId && !room(tableId, v.party_size, guest?.id);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  // One write at a time: a double click while it is in flight must not add the guest twice.
  const run = (write) => {
    if (saving) return;
    setSaving(true);
    setFailed(false);
    Promise.resolve(write()).catch(() => setFailed(true)).finally(() => setSaving(false));
  };
  const save = () => v.name.trim() && !full && run(() => onSave(guest?.id, { name: v.name.trim(), party_size: v.party_size, rsvp: v.rsvp, meal: v.meal, notes: v.notes, table_id: tableId }));

  return (
    <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose}>
      {/* Mobile opens it as a full-screen sheet from the bottom. */}
      <motion.aside initial={sheet ? { y: '100%' } : { x: 320 }} animate={sheet ? { y: 0 } : { x: 0 }} transition={{ duration: 0.45, ease: EASE_ENTER }} onClick={(e) => e.stopPropagation()}
        className={\`no-scrollbar absolute bottom-0 right-0 top-0 overflow-y-auto bg-[var(--swatch-3)] p-[21px] \${sheet ? 'left-0 pt-[max(21px,env(safe-area-inset-top))]' : 'w-[300px]'}\`}>
        <h3 className="text-[20px]">{guest ? 'Edit guest' : 'New guest'}</h3>
        <label className="mt-[18px] block text-[14px] text-[var(--swatch-4)]">Name
          <input value={v.name} onChange={(e) => set({ name: e.target.value })} className={\`\${field} h-[36px]\`} />
        </label>
        <Group title="Party size">
          <button type="button" className={chip(false)} onClick={() => set({ party_size: Math.max(1, v.party_size - 1) })}>−</button>
          <span className="flex h-[27px] w-[30px] items-center justify-center text-[14px]">{v.party_size}</span>
          <button type="button" className={chip(false)} onClick={() => set({ party_size: Math.min(10, v.party_size + 1) })}>+</button>
        </Group>
        <Group title="RSVP">
          {STATUSES.map((s) => <button key={s} type="button" onClick={() => set({ rsvp: s })} style={v.rsvp === s ? undefined : tint(s)} className={chip(v.rsvp === s)}>{STATUS_LABEL[s]}</button>)}
        </Group>
        <Group title="Meal">
          {[null, ...meals].map((m) => <button key={m ?? 'none'} type="button" onClick={() => set({ meal: m })} className={chip(v.meal === m)}>{m ?? '—'}</button>)}
        </Group>
        {v.rsvp === 'attending' && (
          <Group title="Table">
            {[null, ...tables].map((t) => (
              <button key={t?.id ?? 'none'} type="button" disabled={!!t && v.table_id !== t.id && !room(t.id, v.party_size, guest?.id)}
                onClick={() => set({ table_id: t?.id ?? null })} className={\`\${chip(v.table_id === (t?.id ?? null))} disabled:opacity-35\`}>{t ? t.number : '—'}</button>
            ))}
          </Group>
        )}
        {full && <div className="mt-[8px] text-[14px] text-[var(--ui-declined-ink)]">Not enough seats left at that table for a party of {v.party_size}.</div>}
        {failed && <div role="alert" className="mt-[8px] text-[14px] text-[var(--ui-declined-ink)]">Couldn’t save it. Try again.</div>}
        <label className="mt-[16px] block text-[14px] text-[var(--swatch-4)]">Notes
          <textarea value={v.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} className={\`\${field} resize-none py-[8px]\`} />
        </label>
        <div className="mt-[22px] flex items-center gap-[8px]">
          {guest && <button type="button" onClick={() => window.confirm(\`Delete \${guest.name}?\`) && run(() => onDelete(guest.id))} className="mr-auto text-[14px] text-[var(--ui-declined-ink)]">Delete</button>}
          <button type="button" onClick={onClose} className={\`\${chip(false)} \${guest ? '' : 'ml-auto'}\`}>Cancel</button>
          <button type="button" onClick={save} disabled={!v.name.trim() || full || saving} className={\`\${chip(true)} disabled:opacity-40\`}>Save guest</button>
        </div>
      </motion.aside>
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/GuestList.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { animate, motion, useReducedMotion } from 'framer-motion';
import { EASE_ENTER, EASE_MOVE, STATUS_LABEL, nextRsvp, party, tint } from './format';

const COLS = 'grid grid-cols-[353fr_97fr_150fr_174fr] items-center';

export default function GuestList({ guests, entry, changed, refusedId, tableNumber, onCycle, onOpen }) {
  const scroller = useRef(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    // Arrow keys step a row and Page keys six rows through the list while no field has focus.
    const onKey = (e) => {
      const step = { ArrowDown: 48, ArrowUp: -48, PageDown: 288, PageUp: -288 }[e.key];
      const el = scroller.current;
      if (!step || !el || ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      e.preventDefault();
      animate(el.scrollTop, el.scrollTop + step, { duration: Math.abs(step) > 48 ? 1 : 0.3, ease: EASE_MOVE, onUpdate: (top) => { el.scrollTop = top; } });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={\`\${COLS} h-[57px] flex-none border-b border-[var(--ui-line)] pt-[11px] text-[14px] text-[var(--swatch-4)]\`}>
        <span>Name</span><span>Party</span><span>RSVP</span><span className="grid grid-cols-[120fr_54fr]"><span>Meal</span><span>Table</span></span>
      </div>
      <div ref={scroller} key={entry} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
        {guests.map((g, i) => {
          const swept = changed?.id === g.id;
          const declined = g.rsvp === 'declined';
          return (
            <motion.div key={g.id} onClick={() => onOpen(g)}
              initial={entry ? { opacity: 0, x: 40 } : false} animate={{ opacity: 1, x: 0 }}
              transition={reduce ? { duration: 0.15 } : { duration: 0.5, ease: EASE_ENTER, delay: entry ? Math.min(i, 14) * 0.05 : 0 }}
              className={\`\${COLS} relative h-[48px] cursor-pointer border-b border-[var(--ui-line)]\`}>
              {swept && (
                <motion.span key={changed.at} className="absolute inset-0 origin-left bg-[var(--ui-sweep)]"
                  initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: [1, 1, 0] }}
                  transition={{ scaleX: { duration: 0.55, ease: EASE_ENTER }, opacity: { duration: 2.4, times: [0, 0.7, 1] } }} />
              )}
              <span className={\`relative truncate text-[17px] \${declined ? 'text-[var(--swatch-4)] line-through' : ''}\`}>{g.name}</span>
              <span className="relative text-[14.5px] text-[var(--swatch-4)]">{party(g.party_size)}</span>
              <span className="relative">
                <button type="button" onClick={(e) => { e.stopPropagation(); onCycle(g, nextRsvp(g.rsvp)); }}>
                  <span className="sr-only">{g.name} RSVP: </span>
                  <motion.span key={swept ? changed.at : 'rest'} animate={swept ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}
                    style={tint(refusedId === g.id ? 'declined' : g.rsvp)} className="inline-flex h-[25px] items-center rounded-full px-[12px] text-[14px]">
                    {refusedId === g.id ? <span role="alert">Couldn’t save</span> : STATUS_LABEL[g.rsvp]}
                  </motion.span>
                </button>
              </span>
              <span className="relative grid grid-cols-[120fr_54fr] text-[14.5px]">
                <span>{g.meal || '—'}</span>
                <span className={\`whitespace-nowrap \${g.table_id ? '' : 'text-[var(--swatch-4)]'}\`}>{g.table_id ? \`Table \${tableNumber(g.table_id)}\` : '—'}</span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/LoadError.jsx
\`\`\`jsx
export default function LoadError({ onRetry }) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-[12px] py-[48px] text-[14px] text-[var(--swatch-4)]">
      Couldn’t load the guest list.
      <button type="button" onClick={onRetry} className="h-[28px] rounded-full bg-[var(--swatch-1)] px-[13px] text-[14px] text-[var(--swatch-2)]">Try again</button>
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/MobileApp.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Overview from './Overview';
import MobileGuestList from './MobileGuestList';
import MobileSeating from './MobileSeating';
import LoadError from './LoadError';
import { eventDate } from './format';

const VIEWS = [['overview', 'Overview'], ['list', 'Guest list'], ['seating', 'Seating']];

/** The one-column layout below 760px: same data and behaviour, one view at a time. */
export default function MobileApp({ app, seating, onOpen }) {
  const [view, setView] = useState('overview');
  return (
    <div className="flex flex-col gap-[12px] px-[16px] pb-[24px] pt-[env(safe-area-inset-top)]">
      <header className="relative flex h-[44px] flex-none items-center justify-between">
        <button type="button" onClick={app.refresh} className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[var(--swatch-1)] text-[var(--swatch-2)]">
          <span className="script pt-[3px] text-[21px] leading-none">G</span>
          <span className="sr-only">Refresh</span>
        </button>
        <div className="flex items-baseline gap-[7px]">
          <span className="script text-[20px] leading-none">{app.event?.name}</span>
          <span className="text-[14px] text-[var(--swatch-4)]">{eventDate(app.event?.date)}</span>
        </div>
        <span className="h-[36px] w-[36px] rounded-full bg-[var(--ui-avatar)]" />
      </header>
      <div className="grid grid-cols-3 gap-[6px]">
        {VIEWS.map(([id, label]) => (
          <button key={id} type="button" onClick={() => setView(id)}
            className={\`h-[36px] rounded-full text-[14px] \${view === id ? 'bg-[var(--swatch-1)] text-[var(--swatch-3)]' : 'bg-[var(--swatch-3)]'}\`}>{label}</button>
        ))}
      </div>
      {app.failed && <LoadError onRetry={app.refresh} />}
      {app.loaded && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={view} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {view === 'overview' && <Overview mobile stats={app.stats} mealCounts={app.mealCounts} />}
            {view === 'list' && <MobileGuestList app={app} onOpen={onOpen} />}
            {view === 'seating' && <MobileSeating app={app} seating={seating} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/MobileGuestList.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { STATUSES, STATUS_LABEL, nextRsvp, party, tint } from './format';

const chip = (on) => \`h-[30px] flex-none rounded-full px-[13px] text-[14px] \${on ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : ''}\`;

export default function MobileGuestList({ app, onOpen }) {
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const q = search.trim().toLowerCase();
  const shown = app.guests.filter((g) => (!filter || g.rsvp === filter) && (!q || g.name.toLowerCase().includes(q)));

  return (
    <section className="rounded-[20px] bg-[var(--swatch-3)] p-[18px]">
      <label className="flex h-[40px] items-center gap-[9px] rounded-full bg-[var(--ui-fill)] px-[14px]">
        <Search size={15} strokeWidth={2.2} className="flex-none" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guests"
          className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--swatch-4)]" />
      </label>
      <div className="mt-[16px] flex items-baseline gap-[9px]">
        <h2 className="text-[20px] leading-none">Guest list</h2>
        <span className="text-[14px] text-[var(--swatch-4)]">{app.stats.invitations} invitations</span>
        <button type="button" onClick={() => onOpen('new')} className="ml-auto h-[30px] rounded-full bg-[var(--ui-fill)] px-[13px] text-[14px]">+ Add</button>
      </div>
      <div className="no-scrollbar -mx-[18px] mt-[12px] flex gap-[7px] overflow-x-auto px-[18px]">
        <button type="button" onClick={() => setFilter(null)} className={\`\${chip(!filter)} \${filter ? 'bg-[var(--ui-fill)]' : ''}\`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} type="button" onClick={() => setFilter(filter === s ? null : s)} style={filter === s ? undefined : { background: tint(s).background }} className={chip(filter === s)}>{STATUS_LABEL[s]}</button>
        ))}
      </div>
      <div className="mt-[8px]">
        {shown.map((g) => {
          const swept = app.changed?.id === g.id;
          const meta = [party(g.party_size), g.meal, g.table_id && \`Table \${app.tableNumber(g.table_id)}\`].filter(Boolean).join(' · ');
          return (
            <div key={g.id} onClick={() => onOpen(g)} className="relative flex h-[64px] cursor-pointer items-center gap-[10px] border-b border-[var(--ui-line)] last:border-b-0">
              {swept && (
                <motion.span key={app.changed.at} className="absolute inset-0 origin-left bg-[var(--ui-sweep)]"
                  initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: 1, opacity: [1, 1, 0] }}
                  transition={{ scaleX: { duration: 0.55 }, opacity: { duration: 2.4, times: [0, 0.7, 1] } }} />
              )}
              <div className="relative min-w-0 flex-1">
                <div className={\`truncate text-[17px] leading-tight \${g.rsvp === 'declined' ? 'text-[var(--swatch-4)] line-through' : ''}\`}>{g.name}</div>
                <div className="mt-[3px] truncate text-[14px] text-[var(--swatch-4)]">{meta}</div>
              </div>
              <button type="button" onClick={(e) => { e.stopPropagation(); app.cycleRsvp(g, nextRsvp(g.rsvp)); }} className="relative">
                <span className="sr-only">{g.name} RSVP: </span>
                <motion.span key={swept ? app.changed.at : 'rest'} animate={swept ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 0.35 }}
                  style={tint(app.refusedId === g.id ? 'declined' : g.rsvp)} className="inline-flex h-[30px] items-center rounded-full px-[12px] text-[14px]">
                  {app.refusedId === g.id ? <span role="alert">Couldn’t save</span> : STATUS_LABEL[g.rsvp]}
                </motion.span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/event-guest-manager/MobileSeating.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RollingNumber from './RollingNumber';
import { EASE_MOVE, party } from './format';

const card = 'rounded-[20px] bg-[var(--swatch-3)] p-[18px]';

function TableCard({ table, seating, onName }) {
  const { picked, target, shake, dropOn } = seating;
  const shaking = shake?.id === table.id;
  return (
    <motion.button type="button" onClick={(e) => dropOn(table.id, e.currentTarget)}
      key={shaking ? shake.at : 'rest'} animate={{ scale: target === table.id ? 1.02 : 1, x: shaking ? [0, -7, 7, -4, 4, 0] : 0 }} transition={{ duration: 0.3, ease: EASE_MOVE }}
      className={\`flex h-[150px] flex-col overflow-hidden rounded-[14px] bg-[var(--ui-fill)] p-[12px] text-left outline outline-1 \${target === table.id ? 'outline-[var(--swatch-1)]' : 'outline-transparent'}\`}>
      <span className="flex items-start justify-between">
        <span className="serif text-[24px] leading-[1.1]">Table {table.number}</span>
        <span className="mt-[3px] flex h-[20px] items-center rounded-full bg-[var(--swatch-3)] px-[7px] text-[10.5px]"><RollingNumber value={table.count} />/{table.capacity}</span>
      </span>
      <span className="mt-[8px] flex flex-col text-[14px] leading-[20px] text-[var(--ui-body)]">
        <AnimatePresence initial={false}>
          {table.seated.slice(0, 4).map((g) => (
            <motion.span key={g.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              onClick={(e) => { if (!picked) { e.stopPropagation(); onName(g); } }} className="truncate">{g.name} {party(g.party_size)}</motion.span>
          ))}
        </AnimatePresence>
        {table.seated.length > 4 && <span className="text-[var(--swatch-4)]">+{table.seated.length - 4} more</span>}
      </span>
    </motion.button>
  );
}

/** Touch seating: tap an unseated guest, then a table; tap a seated name to move or unseat it. */
export default function MobileSeating({ app, seating }) {
  const [moving, setMoving] = useState(null);
  const move = async (tableId) => { await app.seat(moving.id, tableId); setMoving(null); };
  return (
    <div className="flex flex-col gap-[12px]">
      <section className={card}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] leading-none">Unseated</h2>
            <div className="mt-[6px] text-[14px] text-[var(--swatch-4)]">tap a guest, then a table</div>
          </div>
          <RollingNumber value={app.unseated.length} className="serif text-[30px] leading-none" />
        </div>
        <div className="no-scrollbar -mx-[18px] mt-[14px] flex gap-[8px] overflow-x-auto px-[18px] py-[2px]">
          <AnimatePresence initial={false}>
            {app.unseated.map((g) => (
              <motion.button key={g.id} layout type="button" exit={{ opacity: 0, width: 0 }} onClick={() => seating.pick(g.id)}
                className={\`flex h-[40px] flex-none items-center gap-[6px] rounded-[14px] bg-[var(--ui-fill)] px-[14px] text-[15px] outline outline-1 \${seating.picked === g.id ? 'outline-[var(--swatch-1)]' : 'outline-transparent'}\`}>
                {g.name}<span className="text-[var(--swatch-4)]">{party(g.party_size)}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </section>
      <section className={card}>
        <div className="flex items-baseline gap-[9px]">
          <h2 className="text-[20px] leading-none">Seating</h2>
          <span className="text-[14px] text-[var(--swatch-4)]">{app.tables.length} tables · {app.event.seats_per_table ?? 12} seats</span>
        </div>
        <div className="mt-[14px] grid grid-cols-2 gap-[10px]">
          {app.seating.map((t) => <TableCard key={t.id} table={t} seating={seating} onName={setMoving} />)}
          <button type="button" onClick={app.addTable} className="flex h-[150px] items-center justify-center rounded-[14px] border border-dashed border-[var(--ui-line)] text-[14px] text-[var(--swatch-4)]">+ Add table</button>
        </div>
      </section>
      <AnimatePresence>
        {moving && (
          <motion.div className="fixed inset-0 z-40 flex items-end bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMoving(null)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.35, ease: EASE_MOVE }} onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[20px] bg-[var(--swatch-3)] p-[18px] pb-[max(18px,env(safe-area-inset-bottom))]">
              <div className="text-[18px]">{moving.name} <span className="text-[var(--swatch-4)]">{party(moving.party_size)}</span></div>
              <div className="mt-[14px] text-[14px] text-[var(--swatch-4)]">Move to…</div>
              <div className="mt-[8px] grid grid-cols-4 gap-[6px]">
                {app.seating.filter((t) => t.id !== moving.table_id).map((t) => (
                  <button key={t.id} type="button" disabled={!app.room(t.id, moving.party_size, moving.id)} onClick={() => move(t.id)}
                    className="h-[40px] rounded-[14px] bg-[var(--ui-fill)] text-[14px] disabled:opacity-35">Table {t.number}</button>
                ))}
              </div>
              <button type="button" onClick={() => move(null)} className="mt-[14px] h-[40px] w-full rounded-full bg-[var(--swatch-1)] text-[14px] text-[var(--swatch-2)]">Unseat</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/Overview.jsx
\`\`\`jsx
import RollingNumber from './RollingNumber';

function Cell({ label, value, mobile }) {
  return (
    <div className={\`border border-[var(--ui-line)] px-[11px] \${mobile ? 'h-[66px] rounded-[12px] pt-[14px]' : 'h-[55px] rounded-[9px] pt-[14px]'}\`}>
      <div className={\`\${mobile ? 'text-[14px]' : 'text-[14px]'} truncate leading-none text-[var(--swatch-4)]\`}>{label}</div>
      <RollingNumber value={value} className={\`\${mobile ? 'mt-[8px] text-[18px]' : 'mt-[3px] text-[15.5px]'} leading-none\`} />
    </div>
  );
}

const card = 'bg-[var(--swatch-3)]';
const DESKTOP = { gap: 'h-full gap-[19px]', card: 'rounded-[16px] px-[21px] pt-[18px]', title: 'text-[22px]', overview: 'h-[352px]', label: 'mt-[22px] text-[14px]', figure: '-ml-[5px] -mt-[2px] text-[152px]', cells: 'mt-[13px] gap-[9px]', meals: 'min-h-0 flex-1', mealGrid: 'mt-[19px] gap-[9px]' };
const MOBILE = { gap: 'gap-[12px]', card: 'rounded-[20px] p-[18px]', title: 'text-[20px]', overview: '', label: 'mt-[14px] text-[14px]', figure: '-ml-[3px] mt-[2px] text-[108px]', cells: 'mt-[10px] gap-[8px]', meals: '', mealGrid: 'mt-[14px] gap-[8px]' };

/** Overview + Meals: the guest list's left column (desktop) or the Overview view (mobile). */
export default function Overview({ stats, mealCounts, mobile = false }) {
  const s = mobile ? MOBILE : DESKTOP;
  return (
    <div className={\`flex flex-col \${s.gap}\`}>
      <section className={\`\${card} \${s.card} \${s.overview} flex-none\`}>
        <h2 className={\`\${s.title} leading-[1.15]\`}>Overview</h2>
        <div className={\`\${s.label} text-[var(--swatch-4)]\`}>Headcount</div>
        <RollingNumber value={stats.headcount} className={\`serif \${s.figure} leading-none\`} />
        <div className={\`\${s.cells} grid grid-cols-3\`}>
          <Cell mobile={mobile} label="Invitations" value={stats.invitations} />
          <Cell mobile={mobile} label="Attending" value={stats.attending} />
          <Cell mobile={mobile} label="Awaiting reply" value={stats.awaiting} />
        </div>
      </section>
      <section className={\`\${card} \${s.card} \${s.meals}\`}>
        <h2 className={\`\${s.title} leading-[1.15]\`}>Meals</h2>
        <div className={\`\${s.mealGrid} grid grid-cols-2\`}>
          {mealCounts.map((m) => <Cell mobile={mobile} key={m.meal} label={m.meal} value={m.count} />)}
        </div>
      </section>
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/RollingNumber.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const H = 1.1;

function Digit({ value, born, ms }) {
  // A place that appears after the first render (e.g. 0 → 106) rolls up from 0.
  const [shown, setShown] = useState(born ? value : 0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <span className="relative inline-block overflow-hidden" style={{ height: \`\${H}em\`, lineHeight: \`\${H}em\` }}>
      <span className="invisible">{value}</span>
      <span className="absolute left-0 top-0 block" style={{ transform: \`translateY(\${-shown * H}em)\`, transition: \`transform \${ms}ms cubic-bezier(0.4,0,0.2,1)\` }}>
        {DIGITS.map((d) => <span key={d} className="block" style={{ height: \`\${H}em\` }}>{d}</span>)}
      </span>
    </span>
  );
}

/** Odometer-style number: every place rolls to its new digit. */
export default function RollingNumber({ value, ms = 900, className = '' }) {
  const born = useRef(true);
  useEffect(() => { born.current = false; }, []);
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.span key={value} initial={born.current ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
        className={\`inline-flex \${className}\`}>{value}</motion.span>
    );
  }
  const digits = String(value).split('');
  return (
    <span className={\`inline-flex \${className}\`} aria-label={String(value)}>
      {digits.map((d, i) => <Digit key={digits.length - 1 - i} value={Number(d)} born={born.current} ms={ms} />)}
    </span>
  );
}
\`\`\`

## src/components/event-guest-manager/Seating.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import RollingNumber from './RollingNumber';
import { EASE_MOVE, party } from './format';

function TableCard({ table, seating }) {
  const { picked, target, shake, pick, dropOn, drag } = seating;
  const over = target === table.id;
  const shaking = shake?.id === table.id;
  const shown = table.seated.slice(0, 6);
  return (
    <motion.button type="button" onClick={(e) => dropOn(table.id, e.currentTarget)}
      onDragOver={(e) => drag.over(e, table.id)} onDragLeave={drag.leave} onDrop={(e) => drag.drop(e, table.id)}
      key={shaking ? shake.at : 'rest'} animate={{ scale: over ? 1.02 : 1, x: shaking ? [0, -7, 7, -4, 4, 0] : 0 }}
      transition={{ duration: shaking ? 0.4 : 0.25, ease: EASE_MOVE }}
      className={\`relative flex h-[224px] flex-col rounded-[13px] bg-[var(--ui-fill)] px-[15px] pt-[13px] text-left outline outline-1 \${over ? 'outline-[var(--swatch-1)]' : 'outline-transparent'}\`}>
      <span className="flex items-start justify-between">
        <span className="serif text-[30px] leading-[1.1]">Table {table.number}</span>
        <span className="mt-[6px] flex h-[21px] items-center rounded-full bg-[var(--swatch-3)] px-[7px] text-[10.5px]">
          <RollingNumber value={table.count} />/{table.capacity}
        </span>
      </span>
      <span className="mt-[14px] flex flex-col text-[14px] leading-[20px] text-[var(--ui-body)]">
        <AnimatePresence initial={false}>
          {shown.map((g) => (
            <motion.span key={g.id} layout draggable onDragStart={(e) => drag.start(e, g.id)}
              onClick={(e) => { if (!picked) { e.stopPropagation(); pick(g.id); } }}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE_MOVE }}
              className={picked === g.id ? 'text-[var(--swatch-1)] underline' : ''}>
              {g.name} {party(g.party_size)}
            </motion.span>
          ))}
        </AnimatePresence>
        {table.seated.length > 6 && <span className="text-[var(--swatch-4)]">+{table.seated.length - 6} more</span>}
      </span>
    </motion.button>
  );
}

export default function Seating({ tables, seating, onAddTable }) {
  return (
    <div className="no-scrollbar -mx-[5px] mt-[56px] h-[477px] overflow-y-auto p-[5px]">
      <div className="grid grid-cols-4 gap-[18px]">
        {tables.map((t) => <TableCard key={t.id} table={t} seating={seating} />)}
        <button type="button" onClick={onAddTable}
          className="flex h-[224px] items-center justify-center rounded-[13px] border border-dashed border-[var(--ui-line)] text-[14px] text-[var(--swatch-4)]">
          + Add table
        </button>
      </div>
    </div>
  );
}
\`\`\`

## src/components/event-guest-manager/seed.js
\`\`\`js
import { base44 } from '@/api/base44Client';
import { DEFAULT_MEALS } from './format';

// name|party|rsvp (a attending, w awaiting, d declined)|meal (b sea bass, r short rib, i risotto, v vegan)|table
const ROWS = \`Jonas Castillo|1|w
Nadia Keller|2|w
Daniel Silva|1|a|r|1
Freya Bennett|2|a|v|2
Leo Bennett|2|w
Rosa Vogel|1|w
Lucas Kowalski|2|a|b|3
Leila Dunmore|2|a|v|4
Priya Raman|2|w
Zoe Kowalski|2|a|b|5
Noah Silva|1|w
Olivia Okafor|1|a|r|6
Mateo Costa|2|w
Ines Duarte|4|a|i|7
Rafael Haddad|3|w
Lina Andersen|1|w
Felix Hale|2|a|b|1
Mateo Russo|2|a|b
Maya Costa|1|a|v|2
Hannah Weiss|1|w
Ruben Castillo|3|a|r|3
Amara Nakamura|2|a|b|4
Rafael Keller|4|a|r
Yara Sato|2|a|b|6
Tom Lindqvist|2|d
Viktor Albers|2|a|b|7
Sofia Ibrahim|2|a|r|8
Felix Brennan|4|a|b
Elena Brennan|4|a|b|1
Clara Moretti|1|w
Marcus Laurent|4|a|b|2
Samuel Dunmore|1|a|i|3
Maya Moreau|3|a|i
Noor Novak|1|a|i|4
Oscar Keller|4|a|r|5
Iris Marsh|1|a|v|6
Julia Brandt|2|w
Nadia Albers|2|a|r|7
Tomas Haddad|2|a|b|8
Ruben Vogel|4|a|b
Leo Duarte|1|a|r|1
Adele Fontaine|1|w
Lucas Hale|2|a|r|2
Leila Weber|1|a|v|3
Oscar Moreau|4|a|r
Noah Okafor|1|a|i|4
Kai Fischer|3|a|i|5
Ines Dunmore|2|a|r|6
Max Hoffmann|1|d
Ethan Haddad|2|a|v|7
Daniel Albers|4|a|r|8
Greta Weber|2|a|v
Clara Sato|2|a|v|1
Iris Petrov|1|a|i|2
Nadia Bennett|2|a|r|3
Amara Silva|2|a|b|4
Leo Nakamura|4|a|b
Elena Haddad|4|a|b|6
Sofia Hale|1|a|v|8
Freya Osei|1|a|r|4
Hugo Costa|1|a|v
Elias Brennan|2|a|v
Ana Ribeiro|2|w
Jakob Meyer|1|w
Camille Roux|2|w
Sara Lindgren|1|w
Omar Farouk|3|w
Lea Schmid|1|d
Theo Marchetti|2|w
Mila Horvat|1|w
Ben Carter|2|w
Zara Ahmed|1|w
Luca Bianchi|2|w
Emma Novak|1|w
Paul Lefevre|2|d
Ivy Chen|1|w
Arjun Mehta|2|w
Lotte de Vries|1|w
Sam Okoro|2|w
Nina Petrova|1|w
Hugo Lambert|2|w
Maren Olsen|1|d
Pablo Ortiz|3|w
Alice Moreau|1|w
Felix Wagner|2|w
Rina Takahashi|1|w
Owen Price|2|w
Clara Jensen|1|w
Diego Alvarez|2|w
Esme Laurent|1|w\`;
const MEAL = { b: 'Sea bass', r: 'Short rib', i: 'Risotto (V)', v: 'Vegan bowl' };
const RSVP = { a: 'attending', w: 'awaiting', d: 'declined' };

const SEED_TABLES = 8;
const seedTables = () => Array.from({ length: SEED_TABLES }, (_, i) => ({ number: i + 1, capacity: 12 }));
// 90 invitations: 47 attending (106 guests), 38 awaiting, 5 declined; 10 attending still unseated.
const seedGuests = () => ROWS.split('\\n').map((row, order) => {
  const [name, size, rsvp, meal, table] = row.split('|');
  return { name, party_size: Number(size), rsvp: RSVP[rsvp], meal: MEAL[meal] ?? null, table: table ? Number(table) : null, order };
});
// Next year's 14 June, so the seeded event is always upcoming.
export const seedEvent = () => ({ name: 'Anna & Theo', date: \`\${new Date().getFullYear() + 1}-06-14\`, seats_per_table: 12, meals: DEFAULT_MEALS });

// What anyone but an admin sees before setup: the samples, unsaved, under fixed ids so seats resolve.
export const bundledSamples = () => ({
  unsaved: true,
  event: { id: 'sample-event', ...seedEvent() },
  tables: seedTables().map((t) => ({ ...t, id: \`sample-table-\${t.number}\` })),
  guests: seedGuests().map(({ table, ...g }) => ({ ...g, id: \`sample-guest-\${g.order}\`, table_id: table ? \`sample-table-\${table}\` : null })),
});

const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));
// Marked rows past the oldest copy of each \`key\`.
const copies = (rows, key) => {
  const seen = new Set();
  return rows.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(r[key]) || !seen.add(r[key]));
};

// Adds the samples still missing (matched on table number and guest order, which never change), unless the builder
// or user already filled that table, and drops the
// duplicate copies two first loads at once can add, keeping the oldest. Only rows marked \`sample\` are touched,
// and a failed request throws, so the Event isn't written and the next admin load retries.
export async function reconcileSamples(tables, guests) {
  const { Guest, Table } = base44.entities;
  // One request per table: entity calls are rate-limited per app, so a seed of single creates fails partway.
  const newTables = tables.some((t) => !t.sample) ? [] : seedTables().filter((s) => !tables.some((t) => t.number === s.number));
  if (newTables.length) {
    await Table.bulkCreate(newTables.map((t) => ({ ...t, sample: true })));
    tables = await Table.list('number', 200);
  }
  const extraTables = copies(tables, 'number');
  const kept = tables.filter((t) => !extraTables.includes(t));
  const tableId = (n) => kept.find((t) => t.sample && t.number === n)?.id ?? null;
  const newGuests = guests.some((g) => !g.sample) ? [] : seedGuests().filter((s) => !guests.some((g) => g.order === s.order));
  if (newGuests.length) {
    await Guest.bulkCreate(newGuests.map(({ table, ...g }) => ({ ...g, table_id: table ? tableId(table) : null, sample: true })));
    guests = await Guest.list('order', 2000);
  }
  const extraGuests = copies(guests, 'order');
  if (extraGuests.length) await Guest.deleteMany({ id: { $in: extraGuests.map((g) => g.id) } });
  // A guest seated at a table copy about to go moves to the copy that stays first.
  const moved = new Map(extraTables.map((t) => [t.id, tableId(t.number)]));
  guests = await Promise.all(guests.filter((g) => !extraGuests.includes(g)).map((g) => (moved.has(g.table_id)
    ? Guest.update(g.id, { table_id: moved.get(g.table_id) }).then(() => ({ ...g, table_id: moved.get(g.table_id) }))
    : g)));
  if (extraTables.length) await Table.deleteMany({ id: { $in: extraTables.map((t) => t.id) } });
  return { tables: kept, guests };
}
\`\`\`

## src/components/event-guest-manager/TopBar.jsx
\`\`\`jsx
import { Search } from 'lucide-react';
import { eventDate } from './format';

export default function TopBar({ event, search, onSearch, onRefresh }) {
  return (
    <header className="relative flex h-[72px] flex-none items-center justify-between px-[19px]">
      <button type="button" onClick={onRefresh} className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-[var(--swatch-1)] text-[var(--swatch-2)]">
        <span className="script pt-[3px] text-[19px] leading-none">G</span>
        <span className="sr-only">Refresh</span>
      </button>
      <label className="absolute left-[37.73%] top-[19px] flex h-[33px] w-[24.61%] items-center gap-[9px] rounded-full bg-[var(--swatch-3)] px-[14px]">
        <Search size={13} strokeWidth={2.2} className="flex-none" />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search guests"
          className="h-full w-full bg-transparent text-[14px] outline-none placeholder:text-[var(--swatch-4)]" />
      </label>
      <div className="flex items-center gap-[13px]">
        <div className="flex h-[33px] items-center gap-[8px] rounded-full bg-[var(--swatch-3)] px-[15px]">
          <span className="script pt-[4px] text-[19px] leading-none">{event?.name}</span>
          <span className="text-[14px] text-[var(--swatch-4)]">{eventDate(event?.date)}</span>
        </div>
        <span className="h-[32px] w-[32px] rounded-full bg-[var(--ui-avatar)]" />
      </div>
    </header>
  );
}
\`\`\`

## src/components/event-guest-manager/Unseated.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import RollingNumber from './RollingNumber';
import { EASE_MOVE, party } from './format';

const Dots = () => (
  <svg width="7" height="12" viewBox="0 0 7 12" className="flex-none fill-current" aria-hidden="true">
    {[0, 1].map((x) => [0, 1, 2].map((y) => <circle key={\`\${x}\${y}\`} cx={1.2 + x * 4.6} cy={1.4 + y * 4.6} r="1.2" />))}
  </svg>
);

const Chip = ({ guest }) => (
  <>
    <span className="text-[var(--swatch-4)]"><Dots /></span>
    <span className="flex-1 text-[15px]">{guest.name}</span>
    <span className="text-[15px] text-[var(--swatch-4)]">{party(guest.party_size)}</span>
  </>
);
const chipClass = 'flex items-center gap-[9px] rounded-[9px] bg-[var(--ui-fill)] pl-[13px] pr-[12px] text-left';

export default function Unseated({ guests, seating }) {
  const { picked, origin, flight, pick, unseat, drag } = seating;
  const lifted = guests.find((g) => g.id === picked);
  return (
    <section onClick={unseat} onDragOver={(e) => e.preventDefault()} onDrop={(e) => drag.drop(e, null)}
      className="flex h-full flex-col rounded-[16px] bg-[var(--swatch-3)] px-[21px] pt-[22px]">
      <div className="flex flex-none items-end justify-between">
        <h2 className="text-[22px] leading-none">Unseated</h2>
        <RollingNumber value={guests.length} className="serif -mb-[4px] text-[33px] leading-none" />
      </div>
      {/* Ten chips tall, scrolling past that. */}
      <div className="no-scrollbar mt-[12px] flex max-h-[461px] flex-col gap-[9px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {guests.map((g) => (
            <motion.div key={g.id} layout exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ ease: EASE_MOVE, duration: 0.4 }}
              draggable onDragStart={(e) => drag.start(e, g.id)}
              className={\`relative h-[38px] flex-none rounded-[9px] \${picked === g.id ? 'border border-dashed border-[var(--swatch-4)]' : ''}\`}>
              <button type="button" data-chip={g.id} onClick={(e) => { e.stopPropagation(); pick(g.id, e.currentTarget); }}
                className={\`\${chipClass} absolute inset-0 \${picked === g.id ? 'opacity-0' : ''}\`}>
                <Chip guest={g} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* The lifted chip floats above both cards (fixed), so the scrolling list can't clip its flight. */}
      {lifted && origin && (
        <motion.div className={\`\${chipClass} pointer-events-none fixed z-50\`}
          style={{ left: origin.left, top: origin.top, width: origin.width, height: origin.height }}
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={flight?.id === lifted.id ? { x: flight.x, y: flight.y, rotate: -1.5 } : { x: 26, y: 12, rotate: -2 }}
          transition={{ ease: EASE_MOVE, duration: flight ? 0.45 : 0.3 }}>
          <Chip guest={lifted} />
        </motion.div>
      )}
    </section>
  );
}
\`\`\`

## src/components/event-guest-manager/useEventGuestManager.js
\`\`\`js
import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { DEFAULT_MEALS, nowIso, sumParty } from './format';
import { bundledSamples, reconcileSamples, seedEvent } from './seed';

const { Event, Guest, Table } = base44.entities;
const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
const latestFirst = (key) => (a, b) => (b[key] ?? '').localeCompare(a[key] ?? '') || byOrder(a, b);
const localId = () => \`local-\${Date.now()}\`;

async function load() {
  const [event] = await Event.list();
  const tables = await Table.list('number', 200);
  const guests = await Guest.list('order', 2000);
  if (event) return { event, tables, guests };
  // Only an admin writes the shared samples: anyone else before setup sees them unsaved, edits staying on the page.
  const me = await base44.auth.me().catch(() => null);
  if (me?.role !== 'admin') return bundledSamples();
  // Not set up yet (or setup was interrupted): reconcile the samples, then write the Event that marks the app
  // set up — so a reload mid-seed resumes and deleted samples never come back.
  const seeded = await reconcileSamples(tables, guests);
  return { ...seeded, event: await Event.create(seedEvent()) };
}

export function useEventGuestManager() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [entry, setEntry] = useState(0);
  const [changed, setChanged] = useState(null);
  const [refused, setRefused] = useState(null); // the guest whose RSVP change didn't save

  const reload = async () => {
    try {
      setData(await load());
    } catch (error) {
      console.error(error);
    } finally {
      setLoaded(true);
      setReady(true);
    }
  };
  useEffect(() => { reload(); }, []);

  const guests = useMemo(() => [...(data?.guests ?? [])].sort(byOrder), [data]);
  const tables = useMemo(() => [...(data?.tables ?? [])].sort((a, b) => a.number - b.number), [data]);
  const meals = data?.event?.meals ?? DEFAULT_MEALS;
  const live = ready ? guests : [];
  const attending = live.filter((g) => g.rsvp === 'attending');

  const patchGuest = async (id, patch) => {
    const updated = data.unsaved ? patch : await Guest.update(id, patch);
    setData((d) => ({ ...d, guests: d.guests.map((g) => (g.id === id ? { ...g, ...updated, ...patch } : g)) }));
  };
  const seatedOn = (tableId) => guests.filter((g) => g.table_id === tableId);
  // Whether a party of \`size\` (the guest \`guestId\`, if already saved) fits on the table.
  const room = (tableId, size, guestId) => {
    const table = tables.find((t) => t.id === tableId);
    return !!table && sumParty(seatedOn(tableId).filter((g) => g.id !== guestId)) + size <= table.capacity;
  };
  const fits = (guestId, tableId) => {
    const guest = guests.find((g) => g.id === guestId);
    return !!guest && room(tableId, guest.party_size, guestId);
  };

  return {
    loaded: loaded && !!data,
    failed: loaded && !data,
    entry,
    event: data?.event,
    guests: live,
    tables,
    meals,
    changed,
    refusedId: refused?.id,
    stats: {
      headcount: sumParty(attending),
      invitations: live.length,
      attending: attending.length,
      awaiting: live.filter((g) => g.rsvp === 'awaiting').length,
    },
    mealCounts: meals.map((meal) => ({ meal, count: sumParty(attending.filter((g) => g.meal === meal)) })),
    seating: tables.map((t) => {
      const seated = seatedOn(t.id).sort(latestFirst('seated_at'));
      return { ...t, seated, count: ready ? sumParty(seated) : 0 };
    }),
    unseated: attending.filter((g) => !g.table_id).sort(latestFirst('rsvp_at')),
    tableNumber: (id) => tables.find((t) => t.id === id)?.number,
    fits,
    room,
    refresh: () => {
      setReady(false);
      setEntry((n) => n + 1);
      setTimeout(reload, 450);
    },
    cycleRsvp: async (guest, rsvp) => {
      setChanged({ id: guest.id, at: Date.now() });
      await patchGuest(guest.id, { rsvp, rsvp_at: nowIso(), ...(rsvp === 'attending' ? {} : { table_id: null }) }).catch((error) => {
        // Members can only change the guests they added (rls): say so on the pill instead of silently reverting.
        console.error(error);
        const at = Date.now();
        setChanged(null);
        setRefused({ id: guest.id, at });
        setTimeout(() => setRefused((r) => (r?.at === at ? null : r)), 2400);
      });
    },
    seat: async (guestId, tableId) => {
      if (tableId && !fits(guestId, tableId)) return false;
      await patchGuest(guestId, { table_id: tableId, seated_at: tableId ? nowIso() : null });
      return true;
    },
    saveGuest: async (id, values) => {
      if (values.table_id && !room(values.table_id, values.party_size, id)) return false;
      const prev = guests.find((g) => g.id === id);
      if (values.table_id && values.table_id !== prev?.table_id) values = { ...values, seated_at: nowIso() };
      if (id) return patchGuest(id, values);
      const order = Math.min(0, ...guests.map((g) => g.order ?? 0)) - 1;
      const row = { ...values, order, rsvp_at: nowIso() };
      const created = data.unsaved ? { ...row, id: localId() } : await Guest.create(row);
      setData((d) => ({ ...d, guests: [...d.guests, created] }));
    },
    deleteGuest: async (id) => {
      if (!data.unsaved) await Guest.delete(id);
      setData((d) => ({ ...d, guests: d.guests.filter((g) => g.id !== id) }));
    },
    addTable: async () => {
      const number = Math.max(0, ...tables.map((t) => t.number)) + 1;
      const row = { number, capacity: data.event.seats_per_table ?? 12 };
      const created = data.unsaved ? { ...row, id: localId() } : await Table.create(row);
      setData((d) => ({ ...d, tables: [...d.tables, created] }));
    },
  };
}
\`\`\`

## src/components/event-guest-manager/useIsMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 759px)';

/** True below 760px, where the app switches to its one-column mobile layout. */
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

## src/components/event-guest-manager/useSeatingDrag.js
\`\`\`js
import { useState } from 'react';

// Seating moves: drag a chip (native drag and drop), or click a chip to lift it and click a table
// to drop it there — the lifted chip then flies onto the table before the move is saved.
export function useSeatingDrag({ fits, seat }) {
  const [picked, setPicked] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [flight, setFlight] = useState(null);
  const [target, setTarget] = useState(null);
  const [shake, setShake] = useState(null);

  const reject = (tableId) => { setShake({ id: tableId, at: Date.now() }); setTarget(null); };
  const land = async (guestId, tableId) => {
    if (tableId && !fits(guestId, tableId)) return reject(tableId);
    try {
      await seat(guestId, tableId);
      setTimeout(() => setTarget(null), 350);
    } catch (error) {
      // Not saved: the guest stays where it was and the table shakes, as for a full one.
      console.error(error);
      reject(tableId);
    }
  };

  return {
    picked,
    origin,
    flight,
    target,
    shake,
    pick: (id, el) => {
      setOrigin(el?.getBoundingClientRect() ?? null);
      setPicked((p) => (p === id ? null : id));
    },
    dropOn: (tableId, el) => {
      if (!picked) return;
      const id = picked;
      if (!fits(id, tableId)) { setPicked(null); return reject(tableId); }
      const chip = document.querySelector(\`[data-chip="\${id}"]\`)?.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      setTarget(tableId);
      if (chip) setFlight({ id, x: box.left + 14 - chip.left, y: box.top + 46 - chip.top });
      setTimeout(async () => { await land(id, tableId); setPicked(null); setFlight(null); }, 450);
    },
    unseat: () => { if (picked) { seat(picked, null).catch(console.error); setPicked(null); } },
    drag: {
      start: (e, id) => { e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move'; },
      over: (e, tableId) => { e.preventDefault(); if (target !== tableId) setTarget(tableId); },
      leave: () => setTarget(null),
      drop: (e, tableId) => { e.preventDefault(); land(e.dataTransfer.getData('text/plain'), tableId); },
    },
  };
}
\`\`\`

## src/pages/EventGuestManager.jsx
\`\`\`jsx
import { useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import '@/components/event-guest-manager/event-guest-manager.css';
import TopBar from '@/components/event-guest-manager/TopBar';
import Overview from '@/components/event-guest-manager/Overview';
import Unseated from '@/components/event-guest-manager/Unseated';
import GuestList from '@/components/event-guest-manager/GuestList';
import Seating from '@/components/event-guest-manager/Seating';
import GuestDrawer from '@/components/event-guest-manager/GuestDrawer';
import MobileApp from '@/components/event-guest-manager/MobileApp';
import LoadError from '@/components/event-guest-manager/LoadError';
import { STATUS_LABEL, STATUSES, tint } from '@/components/event-guest-manager/format';
import { useEventGuestManager } from '@/components/event-guest-manager/useEventGuestManager';
import { useSeatingDrag } from '@/components/event-guest-manager/useSeatingDrag';
import { useIsMobile } from '@/components/event-guest-manager/useIsMobile';

const pill = (on) => \`h-[28px] rounded-full px-[13px] text-[14px] \${on ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : 'bg-[var(--ui-fill)]'}\`;
const slide = { enter: (d) => ({ x: 80 * d, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d) => ({ x: -80 * d, opacity: 0 }) };
const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 } };

export default function EventGuestManager() {
  const app = useEventGuestManager();
  const seating = useSeatingDrag({ fits: app.fits, seat: app.seat });
  const [tab, setTab] = useState('list');
  const [filter, setFilter] = useState(null);
  const [search, setSearch] = useState('');
  const [drawer, setDrawer] = useState(null);
  const mobile = useIsMobile();
  // Reduced motion: MotionConfig drops the slides and drifts, leaving 150ms fades.
  const ms = useReducedMotion() ? 0.15 : 0.5;
  const dir = tab === 'seating' ? 1 : -1;
  const q = search.trim().toLowerCase();
  const shown = app.guests.filter((g) => (!filter || g.rsvp === filter) && (!q || g.name.toLowerCase().includes(q)));

  const sheet = drawer && (
    <GuestDrawer guest={drawer === 'new' ? null : drawer} meals={app.meals} tables={app.tables} room={app.room} sheet={mobile} onClose={() => setDrawer(null)}
      onSave={async (id, values) => { if ((await app.saveGuest(id, values)) !== false) setDrawer(null); }}
      onDelete={async (id) => { await app.deleteGuest(id); setDrawer(null); }} />
  );
  if (mobile) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="egm min-h-screen"><MobileApp app={app} seating={seating} onOpen={setDrawer} />{sheet}</div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="egm flex h-screen min-h-[720px] min-w-[900px] flex-col overflow-hidden">
        <TopBar event={app.event} search={search} onSearch={setSearch} onRefresh={() => { setTab('list'); setFilter(null); setSearch(''); app.refresh(); }} />
        {app.failed && <LoadError onRetry={app.refresh} />}
        {app.loaded && (
          <main className="flex min-h-0 flex-1 gap-[18px] px-[13px] pb-[19px]">
            <div className="relative z-10 min-w-0 flex-[420_1_0%]">
              <AnimatePresence initial={false}>
                <motion.div key={tab} {...fade} transition={{ duration: ms }} className="absolute inset-0">
                  {tab === 'list' ? <Overview stats={app.stats} mealCounts={app.mealCounts} /> : <Unseated guests={app.unseated} seating={seating} />}
                </motion.div>
              </AnimatePresence>
            </div>
            <section className="relative min-w-0 flex-[816_1_0%] overflow-hidden rounded-[16px] bg-[var(--swatch-3)]">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div key={tab} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: ms, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 flex flex-col px-[21px] pt-[18px]">
                  <div className="flex h-[34px] items-baseline gap-[11px]">
                    <h2 className="text-[22px] leading-none">{tab === 'list' ? 'Guest list' : 'Seating'}</h2>
                    <span className="text-[14px] text-[var(--swatch-4)]">
                      {tab === 'list' ? \`\${app.stats.invitations} invitations\` : \`\${app.tables.length} tables · \${app.event.seats_per_table ?? 12} seats\`}
                    </span>
                  </div>
                  {tab === 'list' ? (
                    <>
                      <div className="mt-[11px] flex h-[29px] flex-none gap-[7px]">
                        <button type="button" onClick={() => setFilter(null)} className={pill(!filter)}>All</button>
                        {STATUSES.map((s) => (
                          <button key={s} type="button" onClick={() => setFilter(filter === s ? null : s)} style={filter === s ? undefined : { background: tint(s).background }} className={pill(filter === s)}>{STATUS_LABEL[s]}</button>
                        ))}
                      </div>
                      <GuestList guests={shown} entry={app.entry} changed={app.changed} refusedId={app.refusedId} tableNumber={app.tableNumber} onCycle={app.cycleRsvp} onOpen={setDrawer} />
                    </>
                  ) : (
                    <Seating tables={app.seating} seating={seating} onAddTable={app.addTable} />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="absolute right-[21px] top-[18px] z-10 flex gap-[7px]">
                <button type="button" onClick={() => setTab('list')} className={pill(tab === 'list')}>Guest list</button>
                <button type="button" onClick={() => setTab('seating')} className={pill(tab === 'seating')}>Seating</button>
                <button type="button" onClick={() => setDrawer('new')} className={pill(false)}>+ Add guest</button>
              </div>
            </section>
          </main>
        )}
        {sheet}
      </div>
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};