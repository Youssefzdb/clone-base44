var e=`# calendar_assistant — app files

## base44/entities/Appointment.jsonc
\`\`\`json
{
  "name": "Appointment",
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date"
    },
    "startHour": {
      "type": "integer",
      "minimum": 9,
      "maximum": 16
    },
    "durationHours": {
      "type": "integer",
      "enum": [
        1,
        2
      ]
    },
    "clientName": {
      "type": "string"
    },
    "service": {
      "type": "string",
      "enum": [
        "Cut & Style",
        "Beard Trim",
        "Colour",
        "Balayage",
        "Treatment"
      ]
    },
    "category": {
      "type": "string",
      "enum": [
        "cut",
        "col",
        "trt"
      ]
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "date",
    "startHour",
    "durationHours",
    "clientName",
    "service",
    "category"
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

## base44/entities/CalendarSettings.jsonc
\`\`\`json
{
  "name": "CalendarSettings",
  "type": "object",
  "properties": {
    "seeded": {
      "type": "boolean",
      "default": true
    }
  },
  "required": [
    "seeded"
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

## src/components/calendar-assistant/AppointmentBlock.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { dayHeader, hh, tint } from './format';

const enter = [0.33, 1, 0.68, 1];

/** A booking in the week grid: pops and blinks twice when just booked, cascades in on a replay. */
export default function AppointmentBlock({ appt, isNew, introDelay, onOpen }) {
  const motionProps = isNew
    ? { initial: { scale: 0.85, opacity: 0 }, animate: { scale: 1, opacity: [0, 1, 0.3, 1, 0.3, 1] },
        transition: { scale: { type: 'spring', duration: 0.45, bounce: 0.4 }, opacity: { duration: 1.5, times: [0, 0.12, 0.35, 0.55, 0.78, 1] } } }
    : introDelay != null
      ? { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, transition: { delay: introDelay, duration: 0.35, ease: enter } }
      : { initial: false };
  const style = { ...tint(appt.category), top: \`calc(\${(appt.startHour - 9) * 12.5}% + 3px)\`, height: \`calc(\${appt.durationHours * 12.5}% - 6px)\` };
  const body = (
    <>
      <div className="truncate text-[14px] font-bold uppercase leading-[1.3]">{appt.clientName}</div>
      <div className="truncate text-[14px] leading-[1.45]">{appt.service} · {appt.durationHours}H</div>
    </>
  );
  // Without \`onOpen\` (a booking the viewer may not change) it stays a plain block.
  if (!onOpen) return <motion.div {...motionProps} className="pointer-events-none absolute left-[3px] right-[3px] overflow-hidden px-[8px] py-[6px]" style={style}>{body}</motion.div>;
  return (
    <motion.button type="button" {...motionProps} onClick={() => onOpen(appt)}
      aria-label={\`\${appt.clientName}, \${appt.service}, \${dayHeader(appt.date)} \${hh(appt.startHour)}\`}
      className="absolute left-[3px] right-[3px] flex flex-col overflow-hidden px-[8px] py-[6px] text-left" style={style}>
      {body}
    </motion.button>
  );
}
\`\`\`

## src/components/calendar-assistant/BookingPopover.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { useFocusTrap } from './useFocusTrap';
import { HOURS, SERVICES, dayShort, hh } from './format';

const FIELD = 'flex h-[40.7px] w-full flex-col items-start justify-center border-b border-[var(--swatch-1-ink)] text-left text-[14px] uppercase';
const VALUE = 'text-[14px] font-bold uppercase leading-[1.35]';

/** A new booking at \`draft.hour\`, or, with \`draft.appt\`, that booking to move, change or delete. */
export default function BookingPopover({ draft, dayIndex, slotAt, onSave, onDelete, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref);
  const editing = draft.appt;
  const [client, setClient] = useState(editing?.clientName ?? '');
  const [service, setService] = useState(editing?.service ?? null);
  const [hours, setHours] = useState(editing?.durationHours ?? null);
  const [hour, setHour] = useState(draft.hour);
  const [status, setStatus] = useState(null);
  const free = HOURS.filter((h) => !slotAt(draft.date, h, editing?.id));
  const canTwoHours = hour < 16 && free.includes(hour + 1);
  const duration = hours === 2 && !canTwoHours ? 1 : hours;
  // A 2H booking moved where only 1H fits becomes 1H, and shows it.
  const moveTo = (h) => { setHour(h); if (!(h < 16 && free.includes(h + 1))) setHours((d) => (d === 2 ? 1 : d)); };
  const save = () => client.trim() && status !== 'saving' && (setStatus('saving'),
    onSave({ date: draft.date, startHour: hour, durationHours: duration ?? 1, clientName: client.trim(), service: service ?? SERVICES[0] })
      .catch(() => setStatus('failed')));
  // A first tap asks to confirm, so a stray one can't remove the booking.
  const remove = () => status !== 'saving' && (status !== 'confirm' ? setStatus('confirm') : (setStatus('saving'), onDelete().catch(() => setStatus('failed'))));
  const busy = status === 'saving';
  const title = \`\${editing ? 'Edit' : 'New'} booking\`;

  // Anchored right of its slot (left of it for Thu/Fri), kept inside the grid.
  const anchor = { top: \`clamp(-20px, calc(\${(draft.hour - 9) * 12.5}% - 42px), calc(100% - \${editing ? 294 : 219}px))\`,
    ...(dayIndex < 3 ? { left: \`calc(\${(dayIndex + 1) * 20}% + 7px)\` } : { right: \`calc(\${(5 - dayIndex) * 20}% + 7px)\` }) };
  const dialog = (
    <div ref={ref} role="dialog" aria-modal="true" aria-label={title}
      onKeyDown={(e) => e.key === 'Enter' && e.target.tagName === 'INPUT' && save()}
      className={\`z-30 w-[227px] bg-[var(--swatch-1)] px-[13px] pb-[13px] pt-[14px] text-[var(--swatch-1-ink)] \${draft.centered ? '' : 'absolute'}\`}
      style={draft.centered ? undefined : anchor}>
      <h3 className="border-b-[1.5px] border-[var(--swatch-1-ink)] pb-[9px] text-[14px] font-bold uppercase tracking-[-0.02em]">{title} — {dayShort(draft.date)} {hh(hour)}</h3>
      <label className={FIELD}>CLIENT
        <input autoFocus value={client} onChange={(e) => setClient(e.target.value)} placeholder="—"
          className={\`\${VALUE} w-full bg-transparent caret-[var(--swatch-1-ink)] outline-none placeholder:text-[var(--swatch-1-ink)]\`} />
      </label>
      <button type="button" className={FIELD} onClick={() => setService(SERVICES[(SERVICES.indexOf(service) + 1) % SERVICES.length])}>
        SERVICE<span className={VALUE}>{service ?? '—'}</span>
      </button>
      {editing && (
        <button type="button" className={FIELD} onClick={() => moveTo(free[(free.indexOf(hour) + 1) % free.length])}>
          TIME<span className={VALUE}>{hh(hour)}</span>
        </button>
      )}
      <button type="button" className={FIELD} onClick={() => setHours((h) => (h === 1 && canTwoHours ? 2 : 1))}>
        DURATION<span className={VALUE}>{duration ? \`\${duration}H\` : '—'}</span>
      </button>
      <div className="mt-[7px] flex items-center gap-[9px] text-[14px]">
        <button type="button" onClick={save} disabled={!client.trim() || busy} className="h-[27px] w-[75px] bg-[var(--swatch-1-ink)] font-bold text-[var(--swatch-1)]">[SAVE]</button>
        <button type="button" onClick={onClose} className="h-[27px] px-[2px]">[CANCEL]</button>
      </div>
      {editing && <button type="button" onClick={remove} disabled={busy} className="mt-[7px] h-[27px] px-[2px] text-[14px]">{status === 'confirm' ? '[CONFIRM DELETE]' : '[DELETE]'}</button>}
      {status === 'failed' && <p role="alert" className="mt-[7px] text-[14px] font-bold uppercase">Not saved — try again</p>}
    </div>
  );
  return draft.centered ? <div className="fixed inset-0 z-30 flex items-center justify-center" onClick={(e) => e.target === e.currentTarget && onClose()}>{dialog}</div> : dialog;
}
\`\`\`

## src/components/calendar-assistant/BookingSheet.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useFocusTrap } from './useFocusTrap';
import { HOURS, SERVICES, dayMonth, dayShort, hh } from './format';

const ROW = 'flex h-[72px] flex-none border-b border-[var(--swatch-1-ink)] text-[14px] uppercase';
const SELECT = 'h-[36px] w-full appearance-none bg-transparent pr-8 text-[17px] font-bold uppercase outline-none';

/** Mobile booking form: a full-screen ink page in place of the desktop popover; with \`draft.appt\`, edits that booking. */
export default function BookingSheet({ draft, slotAt, onSave, onClose }) {
  const ref = useRef(null);
  useFocusTrap(ref);
  const editing = draft.appt;
  const [client, setClient] = useState(editing?.clientName ?? '');
  const [service, setService] = useState(editing?.service ?? SERVICES[0]);
  const [hour, setHour] = useState(draft.hour);
  const [hours, setHours] = useState(editing?.durationHours ?? 1);
  const taken = (h) => slotAt(draft.date, h, editing?.id);
  const canTwo = hour < 16 && !taken(hour + 1);
  const duration = canTwo ? hours : 1;
  // A 2H booking moved where only 1H fits becomes 1H, and shows it.
  const moveTo = (h) => { setHour(h); if (!(h < 16 && !taken(h + 1))) setHours(1); };
  const [status, setStatus] = useState(null);
  const save = () => client.trim() && status !== 'saving' && (setStatus('saving'),
    onSave({ date: draft.date, startHour: hour, durationHours: duration, clientName: client.trim(), service }).catch(() => setStatus('failed')));

  return (
    <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={editing ? 'Edit booking' : 'New booking'}
      initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      onKeyDown={(e) => e.key === 'Enter' && e.target.tagName === 'INPUT' && save()}
      className="fixed inset-0 z-50 flex flex-col bg-[var(--swatch-1)] p-5 text-[var(--swatch-1-ink)]">
      <div className="flex flex-none items-center justify-between border-b-2 border-[var(--swatch-1-ink)] text-[14px] uppercase">
        <button type="button" onClick={onClose} className="h-[44px] pr-3 font-bold">[CANCEL]</button>
        <span>{dayShort(draft.date)} {dayMonth(draft.date)} · {hh(hour)}</span>
      </div>
      <h2 className="flex-none pb-4 pt-5 text-[34px] font-bold uppercase leading-[1]">{editing ? 'Edit' : 'New'}<br />booking</h2>
      <label className={\`\${ROW} flex-col justify-center gap-1\`}>CLIENT
        <input autoFocus value={client} onChange={(e) => setClient(e.target.value)} placeholder="—"
          className="h-[36px] w-full bg-transparent text-[17px] font-bold uppercase outline-none placeholder:text-[var(--swatch-1-ink)]" />
      </label>
      <label className={\`\${ROW} flex-col justify-center gap-1\`}>SERVICE
        <span className="relative">
          <select value={service} onChange={(e) => setService(e.target.value)} className={SELECT}>
            {SERVICES.map((s) => <option key={s} value={s} className="bg-[var(--swatch-1)]">{s}</option>)}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </span>
      </label>
      <div className={\`\${ROW} items-center justify-between\`}>
        <span>DURATION</span>
        <div className="flex gap-2" role="group" aria-label="Duration">
          {[1, 2].map((h) => (
            <button key={h} type="button" aria-pressed={duration === h} disabled={h === 2 && !canTwo} onClick={() => setHours(h)}
              className={\`h-[44px] w-[64px] text-[15px] font-bold disabled:opacity-40 \${duration === h ? 'bg-[var(--swatch-1-ink)] text-[var(--swatch-1)]' : 'border border-[var(--swatch-1-ink)]'}\`}>{h}H</button>
          ))}
        </div>
      </div>
      <label className={\`\${ROW} flex-col justify-center gap-1\`}>TIME
        <span className="relative">
          <select value={hour} onChange={(e) => moveTo(Number(e.target.value))} className={SELECT}>
            {HOURS.filter((h) => h === draft.hour || !taken(h)).map((h) => <option key={h} value={h} className="bg-[var(--swatch-1)]">{hh(h)}</option>)}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </span>
      </label>
      {status === 'failed' && <p role="alert" className="mt-auto pb-3 text-[14px] font-bold uppercase">Not saved — try again</p>}
      <button type="button" onClick={save} disabled={!client.trim()}
        className={\`\${status === 'failed' ? '' : 'mt-auto '}h-[56px] w-full flex-none bg-[var(--swatch-1-ink)] text-[17px] font-bold text-[var(--swatch-1)] disabled:opacity-60\`}>[SAVE]</button>
    </motion.div>
  );
}
\`\`\`

## src/components/calendar-assistant/calendar-assistant.css
\`\`\`css
@font-face{font-family:"Neue Haas Grotesk";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-700-normal.woff2) format("woff2")}

/* The look: ink (--swatch-1), page ground (--swatch-2), cream blocks (--swatch-3), treatment blocks (--swatch-4). */
:root{
  --swatch-1:#0B0B0B;--swatch-1-ink:#FFFFFF;
  --swatch-2:#F5C518;--swatch-2-ink:#111111;
  --swatch-3:#F2EEDC;--swatch-3-ink:#111111;
  --swatch-4:#4A78FF;--swatch-4-ink:#111111;
  --ui-grid:color-mix(in srgb,var(--swatch-1) 60%,transparent);
}
/* gallery-look */

.ca{font-family:"Neue Haas Grotesk",Helvetica,Arial,sans-serif;background:var(--swatch-2);color:var(--swatch-1);letter-spacing:-0.01em;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
.ca *{border-radius:0}
.ca button:focus-visible{outline:2px solid var(--swatch-1);outline-offset:-2px}
.ca [role="dialog"] button:focus-visible,.ca [role="dialog"] input:focus-visible{outline-color:var(--swatch-1-ink)}
.ca-slot:hover,.ca-slot[data-selected="true"]{outline:2px solid var(--swatch-1);outline-offset:-2px}
.ca-slot .ca-slot-label{opacity:0}
.ca-slot:hover .ca-slot-label{opacity:1}
.ca-slot[data-selected="true"] .ca-slot-label{opacity:0}
.ca-cell:hover{outline:2px solid var(--swatch-1);outline-offset:-2px}
@media (max-width:767px){.ca button:focus-visible{outline-width:3px;outline-offset:-3px}}
\`\`\`

## src/components/calendar-assistant/ConfirmBand.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { dayMonth, dayShort, hh } from './format';

export default function ConfirmBand({ booking, compact }) {
  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 top-0 z-40 overflow-hidden">
      <AnimatePresence>
        {booking && (
          <motion.div key={booking.id} initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className={\`flex items-center bg-[var(--swatch-1)] font-bold \${compact ? 'h-[48px] px-4 text-[15px]' : 'h-[40px] px-[27px] text-[14px]'} uppercase text-[var(--swatch-1-ink)]\`}>
            Booked
            <span className="mx-[14px] h-[18px] w-[1.5px] flex-none bg-[var(--swatch-1-ink)]" />
            <span className="truncate">{booking.clientName} · {booking.service} · {dayShort(booking.date)} {dayMonth(booking.date)} · {hh(booking.startHour)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\`\`\`

## src/components/calendar-assistant/DayView.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { HOURS, dayLong, hh } from './format';

const ROW = 'grid flex-1 grid-cols-[80px_1fr_1fr_80px_67px] items-center border-b border-[var(--swatch-1)] px-[8px] text-[14px]';

export default function DayView({ focus, isToday, slotAt, count, open, recentId, onOpen, onEdit, canChange }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-[31px] flex-none items-center justify-between border-b-4 border-[var(--swatch-1)] text-[14px] font-bold uppercase">
        <span>{dayLong(focus)}{isToday ? ' · Today' : ''}</span>
        <span>{count} {count === 1 ? 'booking' : 'bookings'} · {open} open</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        {HOURS.map((h, i) => {
          const appt = slotAt(focus, h);
          const starts = appt?.startHour === h;
          const isNew = starts && appt.id === recentId;
          return (
            <motion.div key={h} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
              className={\`\${ROW} \${isNew ? 'bg-[var(--swatch-1)] text-[var(--swatch-1-ink)]' : ''}\`}>
              <span className={appt && !starts ? 'opacity-70' : ''}>{hh(h)}</span>
              {!appt && <><b className="uppercase">Open</b><span>—</span><span /><span className="text-right"><button type="button" onClick={() => onOpen(h)} className="min-h-[44px] min-w-[44px] text-right">[+]</button></span></>}
              {starts && <><b className="truncate uppercase">{appt.clientName}</b><span>{appt.service}</span><span>{appt.durationHours}H</span><span className="text-right">{isNew ? 'NEW' : canChange(appt) && <button type="button" onClick={() => onEdit(appt)} aria-label={\`Edit \${appt.clientName}\`} className="min-h-[44px] min-w-[44px] text-right">[EDIT]</button>}</span></>}
              {appt && !starts && <><b className="truncate uppercase opacity-70">— {appt.clientName}</b><span className="opacity-70">{appt.service} (CONT.)</span><span /><span /></>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
\`\`\`

## src/components/calendar-assistant/DetailsSheet.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useFocusTrap } from './useFocusTrap';
import { dayMonth, dayShort, hh } from './format';

const ROW = 'flex h-[72px] flex-none flex-col justify-center gap-1 border-b border-[var(--swatch-1-ink)] text-[14px] uppercase';

/** Mobile: a booking's details, opened by tapping its block or row, with its edit and delete actions. */
export default function DetailsSheet({ appt, canChange, onClose, onEdit, onDelete }) {
  const ref = useRef(null);
  useFocusTrap(ref);
  const [status, setStatus] = useState(null);
  // A first tap asks to confirm, so a stray one can't remove the booking.
  const remove = () => status !== 'saving' && (status !== 'confirm' ? setStatus('confirm') : (setStatus('saving'), onDelete().catch(() => setStatus('failed'))));
  const busy = status === 'saving';
  const rows = [['SERVICE', appt.service], ['DURATION', \`\${appt.durationHours}H\`], ['TIME', \`\${hh(appt.startHour)} – \${hh(appt.startHour + appt.durationHours)}\`]];
  return (
    <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={appt.clientName}
      initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-[var(--swatch-1)] p-5 text-[var(--swatch-1-ink)]">
      <div className="flex flex-none items-center justify-between border-b-2 border-[var(--swatch-1-ink)] text-[14px] uppercase">
        <button type="button" autoFocus onClick={onClose} className="h-[44px] pr-3 font-bold">[CLOSE]</button>
        <span>{dayShort(appt.date)} {dayMonth(appt.date)} · {hh(appt.startHour)}</span>
      </div>
      <h2 className="flex-none pb-4 pt-5 text-[34px] font-bold uppercase leading-[1]">{appt.clientName}</h2>
      {rows.map(([label, value]) => (
        <div key={label} className={ROW}>{label}<span className="text-[17px] font-bold uppercase">{value}</span></div>
      ))}
      {status === 'failed' && <p role="alert" className="mt-auto pb-3 text-[14px] font-bold uppercase">Not deleted — try again</p>}
      {canChange && <div className={\`\${status === 'failed' ? '' : 'mt-auto '}flex flex-none gap-3\`}>
        <button type="button" onClick={remove} disabled={busy} className="h-[56px] flex-1 border border-[var(--swatch-1-ink)] text-[17px] font-bold">{status === 'confirm' ? '[CONFIRM DELETE]' : '[DELETE]'}</button>
        <button type="button" onClick={onEdit} disabled={busy} className="h-[56px] flex-1 bg-[var(--swatch-1-ink)] text-[17px] font-bold text-[var(--swatch-1)]">[EDIT]</button>
      </div>}
    </motion.div>
  );
}
\`\`\`

## src/components/calendar-assistant/format.js
\`\`\`js
export const HOURS = [9, 10, 11, 12, 13, 14, 15, 16];
export const SERVICES = ['Cut & Style', 'Beard Trim', 'Colour', 'Balayage', 'Treatment'];
export const CATEGORY = { 'Cut & Style': 'cut', 'Beard Trim': 'cut', Colour: 'col', Balayage: 'col', Treatment: 'trt' };
export const LEGEND = [['cut', 'Cut & Style / Beard'], ['col', 'Colour / Balayage'], ['trt', 'Treatment']];
export const MOBILE_LEGEND = [['cut', 'Cut / Beard'], ['col', 'Colour'], ['trt', 'Treatment']];

const FILL = { cut: 1, col: 3, trt: 4 };
/** Fill and text colors of a category's swatch. */
export const tint = (category) => ({ background: \`var(--swatch-\${FILL[category]})\`, color: \`var(--swatch-\${FILL[category]}-ink)\` });

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');

export const parse = (iso) => new Date(\`\${iso}T00:00:00\`);
export const toIso = (d) => \`\${d.getFullYear()}-\${pad(d.getMonth() + 1)}-\${pad(d.getDate())}\`;
export const addDays = (iso, n) => { const d = parse(iso); d.setDate(d.getDate() + n); return toIso(d); };
export const todayIso = () => toIso(new Date());

/** The day the sidebar counts: today on a weekday, otherwise the coming Monday. */
export const focusDay = () => {
  const dow = new Date().getDay();
  return dow === 6 ? addDays(todayIso(), 2) : dow === 0 ? addDays(todayIso(), 1) : todayIso();
};
/** Mon–Fri of the week containing a weekday. */
export const weekOf = (iso) => {
  const monday = addDays(iso, 1 - parse(iso).getDay());
  return [0, 1, 2, 3, 4].map((i) => addDays(monday, i));
};
export const isoWeek = (iso) => {
  const d = parse(iso);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const jan4 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - jan4) / 86400000 - 3 + ((jan4.getDay() + 6) % 7)) / 7);
};

export const hh = (h) => \`\${pad(h)}:00\`;
export const two = (n) => pad(n);
export const dayShort = (iso) => DAYS[parse(iso).getDay()].slice(0, 3).toUpperCase();
export const dayHeader = (iso) => \`\${dayShort(iso)} \${pad(parse(iso).getDate())}\`;
export const dayMonth = (iso) => \`\${parse(iso).getDate()} \${MONTHS[parse(iso).getMonth()].toUpperCase()}\`;
export const sidebarDate = (iso) => \`\${dayShort(iso)} \${dayMonth(iso)} \${parse(iso).getFullYear()}\`;
export const dayLong = (iso) => \`\${DAYS[parse(iso).getDay()].toUpperCase()} \${dayMonth(iso)}\`;
export const dayName = (iso) => DAYS[parse(iso).getDay()].toUpperCase();
export const dayNum = (iso) => pad(parse(iso).getDate());
export const dayMonthPadded = (iso) => \`\${dayNum(iso)} \${MONTHS[parse(iso).getMonth()].toUpperCase()}\`;
export const firstName = (name) => name.split(' ')[0];
\`\`\`

## src/components/calendar-assistant/Logo.jsx
\`\`\`jsx
export default function Logo({ width = 29 }) {
  return (
    <svg width={width} height={width / 2} viewBox="0 0 44 22" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" aria-hidden="true">
      <path d="M2 17C6 5 14 4 21 11s15 7 21-6" />
    </svg>
  );
}
\`\`\`

## src/components/calendar-assistant/MobileCalendar.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import MobileDayView from './MobileDayView';
import MobileWeekView from './MobileWeekView';
import BookingSheet from './BookingSheet';
import DetailsSheet from './DetailsSheet';
import ConfirmBand from './ConfirmBand';

const VIEWS = [['week', '[WEEK]'], ['day', '[DAY]']];

/** Below 768px: Day view first, a pinned [+ NEW BOOKING] button, full-screen sheets instead of the popover. */
export default function MobileCalendar({ cal }) {
  const [view, setView] = useState('day');
  const [switched, setSwitched] = useState(false);
  const [draft, setDraft] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setDraft(null), setDetails(null));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const show = (next) => { setSwitched(true); setView(next); };
  const openNew = () => { const hour = cal.nextFreeHour(); if (hour != null) setDraft({ date: cal.focus, hour }); };

  return (
    <div className="ca flex h-screen flex-col overflow-hidden p-4">
      <header className="flex h-[36px] flex-none items-stretch justify-between border-b-2 border-[var(--swatch-1)]">
        <div className="flex items-center gap-2 text-[15px] font-bold uppercase tracking-[-0.02em]"><Logo width={26} />Halden &amp; Co.</div>
        <nav className="flex">
          {VIEWS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={view === id} onClick={() => show(id)}
              className={\`relative min-w-[44px] px-[8px] text-[14px] font-bold after:absolute after:inset-x-0 after:-bottom-1 after:-top-1 after:content-[''] \${view === id ? 'bg-[var(--swatch-1)] text-[var(--swatch-1-ink)]' : ''}\`}>{label}</button>
          ))}
        </nav>
      </header>
      <main className="relative min-h-0 flex-1">
        <AnimatePresence initial={false}>
          <motion.div key={view} className="absolute inset-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}>
            {cal.loading ? null : view === 'day' ? (
              <MobileDayView focus={cal.focus} isToday={cal.isToday} loading={cal.loading} count={cal.focusCount} open={cal.openHours}
                slotAt={cal.slotAt} recentId={cal.recentId} stagger={switched} onOpen={(hour) => setDraft({ date: cal.focus, hour })} onDetails={setDetails} />
            ) : (
              <MobileWeekView days={cal.days} focus={cal.focus} count={cal.focusCount} slotAt={cal.slotAt} recentId={cal.recentId}
                onOpen={(date, hour) => setDraft({ date, hour })} onDetails={setDetails} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <button type="button" onClick={openNew} className="mt-3 h-12 w-full flex-none bg-[var(--swatch-1)] text-[15px] font-bold text-[var(--swatch-1-ink)]">[+ NEW BOOKING]</button>
      {draft && <BookingSheet key={\`\${draft.date}-\${draft.hour}-\${draft.appt?.id}\`} draft={draft} slotAt={cal.slotAt} onClose={() => setDraft(null)} onSave={async (booking) => { await (draft.appt ? cal.update(draft.appt.id, booking) : cal.book(booking)); setDraft(null); }} />}
      {details && <DetailsSheet appt={details} canChange={cal.canChange(details)} onClose={() => setDetails(null)}
        onEdit={() => { setDetails(null); setDraft({ date: details.date, hour: details.startHour, appt: details }); }}
        onDelete={async () => { await cal.remove(details.id); setDetails(null); }} />}
      <ConfirmBand booking={cal.lastBooked} compact />
    </div>
  );
}
\`\`\`

## src/components/calendar-assistant/MobileDayView.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Numeral from './Numeral';
import { HOURS, dayName, dayNum, hh, isoWeek, sidebarDate } from './format';

const BLINK = { opacity: [1, 0.3, 1, 0.3, 1] };

export default function MobileDayView({ focus, isToday, loading, count, open, slotAt, recentId, stagger, onOpen, onDetails }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-none pt-3 text-[14px] uppercase">{isToday ? 'Today’s' : \`\${dayName(focus)}’S\`} bookings:</div>
      <div className="flex flex-none items-end justify-between border-b-2 border-[var(--swatch-1)]">
        <Numeral count={count} loading={loading} boxClassName="h-[92px] w-[140px]" className="text-[96px] leading-[92px]" />
        <div className="pb-[12px] text-right text-[14px] uppercase leading-[1.35]">
          <div>{sidebarDate(focus)}</div>
          <div>Week {isoWeek(focus)}</div>
        </div>
      </div>
      <div className="flex h-10 flex-none items-center justify-between border-b-4 border-[var(--swatch-1)] text-[14px] font-bold uppercase">
        <span>{dayName(focus)} {dayNum(focus)}{isToday ? ' · Today' : ''}</span>
        <span>{count} booked · {open} open</span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        {HOURS.map((h, i) => {
          const appt = slotAt(focus, h);
          const cont = appt && appt.startHour !== h;
          return (
            <motion.button key={h} type="button" onClick={() => (appt ? onDetails(appt) : onOpen(h))}
              initial={stagger ? { opacity: 0, y: 16 } : false}
              animate={appt?.id === recentId ? BLINK : { opacity: 1, y: 0 }}
              transition={appt?.id === recentId ? { duration: 1.2 } : { delay: 0.15 + i * 0.06, duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
              className="grid min-h-[44px] flex-1 grid-cols-[52px_1fr_auto] items-center border-b border-[var(--swatch-1)] text-left">
              <span className={\`text-[14px] \${cont ? 'opacity-70' : ''}\`}>{hh(h)}</span>
              <span className={\`min-w-0 \${cont ? 'opacity-70' : ''}\`}>
                <b className="block truncate text-[14px] uppercase leading-[1.25]">{appt ? \`\${cont ? '— ' : ''}\${appt.clientName}\` : 'Open'}</b>
                <span className="block truncate text-[14px] leading-[1.35]">{appt ? \`\${appt.service}\${cont ? ' (CONT.)' : \` · \${appt.durationHours}H\`}\` : '—'}</span>
              </span>
              <span className="pl-2 text-[14px]">{appt ? '' : '[+]'}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
\`\`\`

## src/components/calendar-assistant/MobileWeekView.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { HOURS, MOBILE_LEGEND, dayHeader, dayMonthPadded, dayNum, dayShort, firstName, hh, isoWeek, tint, two } from './format';

const CELL = 'min-h-[44px] flex-1 border-b border-[var(--ui-grid)] last:border-b-0';

export default function MobileWeekView({ days, focus, count, slotAt, recentId, onOpen, onDetails }) {
  return (
    <div className="flex h-full flex-col pt-3">
      <div className="flex flex-none justify-between pb-2 text-[14px] uppercase">
        <span>Week {isoWeek(focus)} · {dayMonthPadded(days[0])} to {dayMonthPadded(days[4])}</span>
        <span>Today: {two(count)}</span>
      </div>
      <div className="grid flex-none grid-cols-[40px_repeat(5,1fr)] border-b-2 border-[var(--swatch-1)]">
        <span />
        {days.map((d) => (
          <div key={d} className="relative py-[5px] text-center text-[14px] font-bold uppercase leading-[1.2]">
            {dayShort(d)}<br />{dayNum(d)}
            {d === focus && <span className="absolute inset-x-0 -bottom-[2px] h-[5px] bg-[var(--swatch-1)]" />}
          </div>
        ))}
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[40px] flex-none flex-col">
          {HOURS.map((h) => <span key={h} className="flex min-h-[44px] flex-1 items-center text-[11px]">{hh(h)}</span>)}
        </div>
        <div className="grid flex-1 grid-cols-5 border-b-2 border-r-2 border-[var(--swatch-1)]">
          {days.map((d) => (
            <div key={d} className="flex flex-col border-l border-[var(--ui-grid)]">
              {HOURS.map((h) => {
                const appt = slotAt(d, h);
                return appt ? (
                  <motion.button key={h} type="button" onClick={() => onDetails(appt)} className={\`\${CELL} p-[2px]\`}
                    animate={appt.id === recentId ? { opacity: [1, 0.3, 1, 0.3, 1] } : { opacity: 1 }} transition={{ duration: 1.2 }}
                    aria-label={\`\${appt.clientName}, \${appt.service}, \${dayHeader(d)} \${hh(h)}\`}>
                    <span className="flex h-full items-center justify-center overflow-hidden text-[12px] font-bold uppercase" style={tint(appt.category)}>{firstName(appt.clientName)}</span>
                  </motion.button>
                ) : (
                  <button key={h} type="button" onClick={() => onOpen(d, h)} className={\`ca-cell \${CELL}\`} aria-label={\`Book \${dayHeader(d)} \${hh(h)}\`} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <ul className="flex flex-none gap-4 pt-2 text-[14px] uppercase">
        {MOBILE_LEGEND.map(([category, label]) => (
          <li key={category} className="flex items-center gap-[6px]"><span className="h-[10px] w-[10px]" style={tint(category)} />{label}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

## src/components/calendar-assistant/Numeral.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { two } from './format';

/** Two-digit count: the old value slides up out of its clipped box as the new one slides in. Static on mount. */
export default function Numeral({ count, loading, className, boxClassName }) {
  return (
    <div className={\`relative flex-none overflow-hidden \${boxClassName}\`} aria-live="polite">
      {!loading && (
        <AnimatePresence initial={false}>
          <motion.div key={count} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
            className={\`absolute inset-0 tracking-[-0.03em] \${className}\`}>{two(count)}</motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
\`\`\`

## src/components/calendar-assistant/Sidebar.jsx
\`\`\`jsx
import Numeral from './Numeral';
import { LEGEND, dayName, isoWeek, sidebarDate, tint } from './format';

export default function Sidebar({ focus, isToday, count, loading }) {
  return (
    <aside className="flex w-[240px] flex-none flex-col">
      <div className="flex h-[31px] flex-none items-center border-b-[1.5px] border-[var(--swatch-1)] text-[14px] uppercase">
        {isToday ? 'Today’s' : \`\${dayName(focus)}’S\`} bookings:
      </div>
      <Numeral count={count} loading={loading} boxClassName="h-[154px] border-b-[1.5px] border-[var(--swatch-1)]" className="pt-[3px] text-[167px] leading-[154px]" />
      <div className="flex h-[32px] flex-none items-center justify-between text-[14px] uppercase">
        <span>{sidebarDate(focus)}</span>
        <span>Week {isoWeek(focus)}</span>
      </div>
      <ul className="mt-auto pb-[2px]">
        {LEGEND.map(([category, label]) => (
          <li key={category} className="flex h-[20px] items-center gap-[8px] text-[14px] uppercase">
            <span className="h-[12px] w-[12px] flex-none" style={tint(category)} />{label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
\`\`\`

## src/components/calendar-assistant/TopBar.jsx
\`\`\`jsx
import Logo from './Logo';

const VIEWS = [['week', '[WEEK]'], ['day', '[DAY]']];

export default function TopBar({ view, onWeek, onDay, onNew }) {
  return (
    <header className="flex h-[37px] flex-none items-stretch justify-between border-b-[1.5px] border-[var(--swatch-1)]">
      <div className="flex items-center gap-[11px] text-[15px] font-bold uppercase tracking-[-0.02em]">
        <Logo />
        Halden &amp; Co. — Schedule
      </div>
      <nav className="flex gap-[11px]">
        {VIEWS.map(([id, label]) => (
          <button key={id} type="button" aria-pressed={view === id} onClick={id === 'week' ? onWeek : onDay}
            className={\`min-w-[44px] px-[8px] text-[14px] font-bold \${view === id ? 'bg-[var(--swatch-1)] text-[var(--swatch-1-ink)]' : ''}\`}>{label}</button>
        ))}
        <button type="button" onClick={onNew} className="px-[8px] text-[14px] font-bold">[+ NEW]</button>
      </nav>
    </header>
  );
}
\`\`\`

## src/components/calendar-assistant/useCalendar.js
\`\`\`js
import { useEffect, useMemo, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CATEGORY, HOURS, focusDay, todayIso, weekOf } from './format';

// The sample week, Mon–Fri: [startHour, client, service, hours]. The "today" day (index 2) is
// swapped onto the real focus day, so today always has 4 bookings with 14:00 free.
const SAMPLE = [
  [[9, 'Dana Whitfield', 'Cut & Style', 1], [11, 'Tom Adeyemi', 'Beard Trim', 1], [14, 'Priya Nair', 'Colour', 2]],
  [[10, 'Lucas Ferreira', 'Cut & Style', 1], [13, 'Hannah Cole', 'Balayage', 2], [16, 'Omar Haddad', 'Treatment', 1]],
  [[9, 'Sofia Lindqvist', 'Cut & Style', 1], [10, 'Ben Okafor', 'Beard Trim', 1], [12, 'Kai Tanaka', 'Treatment', 1], [15, 'Elena Ruiz', 'Colour', 2]],
  [[9, 'Jonas Berg', 'Cut & Style', 1], [12, 'Aisha Rahman', 'Colour', 2], [16, 'Leo Marchetti', 'Beard Trim', 1]],
  [[10, 'Grace Liu', 'Treatment', 1], [11, 'Sam Porter', 'Cut & Style', 1], [14, 'Nadia Petrov', 'Balayage', 2]],
];
// One request per table: entity calls are rate-limited per app, so a seed of single creates fails partway.
const createAll = async (Entity, rows) => (rows.length ? Entity.bulkCreate(rows) : []);
const sampleKey = (a) => \`\${a.clientName}|\${a.service}|\${a.startHour}\`;
const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));
// Samples carry \`sample\`, so cleanup never touches an appointment the user booked. Two first loads at once
// (a preview reload mid-seed, a second tab) can both add them: keep the oldest copy of each and delete the
// rest. Every load before setup runs this, so a failed delete (it throws, leaving the app unset) is retried.
async function reconcileSamples(rows, samples) {
  // Bookings the app didn't mark were added by the builder (or the user): the calendar isn't ours to seed.
  const missing = rows.some((a) => !a.sample) ? [] : samples.filter((s) => !rows.some((a) => sampleKey(a) === sampleKey(s)));
  await createAll(base44.entities.Appointment, missing.map((s) => ({ ...s, sample: true })));
  const now = missing.length ? await base44.entities.Appointment.list('-date', 1000) : rows;
  const seen = new Set();
  const extra = now.filter((a) => a.sample).sort(byAge).filter((a) => seen.has(sampleKey(a)) || !seen.add(sampleKey(a)));
  if (extra.length) await base44.entities.Appointment.deleteMany({ id: { $in: extra.map((a) => a.id) } });
  return now.filter((a) => !extra.includes(a));
}
const seedRows = (days, focusIdx) => days.flatMap((date, i) =>
  SAMPLE[i === focusIdx ? 2 : i === 2 ? focusIdx : i].map(([startHour, clientName, service, durationHours]) =>
    ({ date, startHour, durationHours, clientName, service, category: CATEGORY[service] })));

export function useCalendar() {
  const focus = useMemo(focusDay, []);
  const days = useMemo(() => weekOf(focus), [focus]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentId, setRecentId] = useState(null);
  const [lastBooked, setLastBooked] = useState(null);
  const [me, setMe] = useState(null);
  const timers = useRef([]);

  useEffect(() => {
    (async () => {
      try {
        const me = await base44.auth.me().catch(() => null);
        setMe(me);
        const [saved] = await base44.entities.CalendarSettings.list();
        // Latest dates first, so the cap drops old weeks, never the one on screen.
        let rows = await base44.entities.Appointment.list('-date', 1000);
        const samples = !saved && seedRows(days, days.indexOf(focus));
        if (samples && me?.role === 'admin') {
          // Resumable: add only the samples still missing (matched on fields that don't depend on the date),
          // then mark the app set up, so a reload mid-seed resumes and a cleared calendar stays cleared.
          rows = await reconcileSamples(rows, samples);
          await base44.entities.CalendarSettings.create({ seeded: true });
        } else if (samples && !rows.length) {
          // Only an admin writes the shared samples: anyone else before setup sees them unsaved.
          rows = samples.map((s, i) => ({ id: \`sample-\${i + 1}\`, ...s }));
        }
        setAppointments(rows);
      } finally {
        setLoading(false);
      }
    })();
    return () => timers.current.forEach(clearTimeout);
  }, [days, focus]);

  // \`ignoreId\`: the booking being moved, so its own hours count as free.
  const slotAt = (date, hour, ignoreId) =>
    appointments.find((a) => a.id !== ignoreId && a.date === date && hour >= a.startHour && hour < a.startHour + a.durationHours);
  const focusCount = appointments.filter((a) => a.date === focus).length;
  const openHours = HOURS.filter((h) => !slotAt(focus, h)).length;

  const nextFreeHour = () => {
    const d = new Date();
    // An hour that has already started isn't "next".
    const now = focus === todayIso() ? d.getHours() + (d.getMinutes() > 0 ? 1 : 0) : 0;
    const free = HOURS.filter((h) => !slotAt(focus, h));
    return free.find((h) => h >= now) ?? free[0] ?? null;
  };

  const book = async (draft) => {
    if (slotAt(draft.date, draft.startHour) || (draft.durationHours === 2 && slotAt(draft.date, draft.startHour + 1))) return;
    const created = await base44.entities.Appointment.create({ ...draft, category: CATEGORY[draft.service] });
    setAppointments((rows) => [...rows, created]);
    setRecentId(created.id);
    setLastBooked(created);
    timers.current.push(
      setTimeout(() => setLastBooked((b) => (b?.id === created.id ? null : b)), 2000),
      setTimeout(() => setRecentId((id) => (id === created.id ? null : id)), 6000),
    );
  };

  const update = async (id, patch) => {
    if (slotAt(patch.date, patch.startHour, id) || (patch.durationHours === 2 && slotAt(patch.date, patch.startHour + 1, id))) throw new Error('Slot taken');
    const changes = { ...patch, category: CATEGORY[patch.service] };
    await base44.entities.Appointment.update(id, changes);
    setAppointments((rows) => rows.map((a) => (a.id === id ? { ...a, ...changes } : a)));
  };

  // As the Appointment rls allows: an admin changes any booking, anyone else their own (unsaved samples have no creator).
  const canChange = (appt) => me?.role === 'admin' || (me != null && appt.created_by_id === me.id);

  const remove = async (id) => {
    await base44.entities.Appointment.delete(id);
    setAppointments((rows) => rows.filter((a) => a.id !== id));
    setLastBooked((b) => (b?.id === id ? null : b));
    setRecentId((r) => (r === id ? null : r));
  };

  return { loading, focus, isToday: focus === todayIso(), days, appointments, slotAt, focusCount, openHours, nextFreeHour, book, update, remove, canChange, recentId, lastBooked };
}
\`\`\`

## src/components/calendar-assistant/useFocusTrap.js
\`\`\`js
import { useEffect } from 'react';

const FOCUSABLE = 'button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])';

/** Keeps Tab inside the dialog at \`ref\` and hands focus back to whatever opened it on close. */
export function useFocusTrap(ref) {
  useEffect(() => {
    const opener = document.activeElement;
    const node = ref.current;
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = [...node.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (opener?.isConnected) opener.focus();
    };
  }, [ref]);
}
\`\`\`

## src/components/calendar-assistant/useIsMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 767px)';

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

## src/components/calendar-assistant/WeekView.jsx
\`\`\`jsx
import AppointmentBlock from './AppointmentBlock';
import { HOURS, dayHeader, hh } from './format';

export default function WeekView({ days, focus, isToday, appointments, slotAt, selected, introKey, recentId, onSlot, onEdit, canChange, children }) {
  const order = appointments.filter((a) => days.includes(a.date)).sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour).map((a) => a.id);
  return (
    <div className="flex h-full flex-col">
      <div className="grid h-[31px] flex-none grid-cols-[53px_repeat(5,1fr)] border-b-[1.5px] border-[var(--swatch-1)]">
        <span />
        {days.map((d) => (
          <div key={d} className={\`relative flex items-center px-[8px] text-[14px] font-bold uppercase \${d === focus ? '-mt-[3px]' : ''}\`}>
            {dayHeader(d)}{d === focus && isToday ? ' · Today' : ''}
            {d === focus && <span className="absolute inset-x-0 -bottom-[1.5px] h-[4px] bg-[var(--swatch-1)]" />}
          </div>
        ))}
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="flex w-[53px] flex-none flex-col">
          {HOURS.map((h) => <span key={h} className="flex flex-1 items-center text-[11.3px]">{hh(h)}</span>)}
        </div>
        <div className="relative grid flex-1 grid-cols-5 border-b-[1.5px] border-r-[1.5px] border-[var(--swatch-1)]">
          {days.map((d) => (
            <div key={d} className="relative flex flex-col border-l border-[var(--ui-grid)]">
              {HOURS.map((h) => <div key={h} className="flex-1 border-b border-[var(--ui-grid)] last:border-b-0" />)}
              {HOURS.filter((h) => !slotAt(d, h)).map((h) => (
                <button key={h} type="button" onClick={() => onSlot(d, h)}
                  data-selected={selected?.date === d && selected?.hour === h}
                  className="ca-slot absolute inset-x-0 flex items-center justify-center text-[14px]"
                  style={{ top: \`\${(h - 9) * 12.5}%\`, height: '12.5%' }}>
                  <span className="ca-slot-label">+ {hh(h)}</span>
                  <span className="sr-only">Book {hh(h)} {d === focus && isToday ? 'today' : dayHeader(d)}</span>
                </button>
              ))}
              {appointments.filter((a) => a.date === d).map((a) => (
                <AppointmentBlock key={\`\${a.id}-\${introKey}\`} appt={a} isNew={a.id === recentId && introKey === 0}
                  introDelay={introKey > 0 ? order.indexOf(a.id) * 0.07 : null} onOpen={canChange(a) ? onEdit : undefined} />
              ))}
            </div>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}
\`\`\`

## src/pages/CalendarAssistant.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import '@/components/calendar-assistant/calendar-assistant.css';
import TopBar from '@/components/calendar-assistant/TopBar';
import Sidebar from '@/components/calendar-assistant/Sidebar';
import WeekView from '@/components/calendar-assistant/WeekView';
import DayView from '@/components/calendar-assistant/DayView';
import BookingPopover from '@/components/calendar-assistant/BookingPopover';
import ConfirmBand from '@/components/calendar-assistant/ConfirmBand';
import MobileCalendar from '@/components/calendar-assistant/MobileCalendar';
import { useCalendar } from '@/components/calendar-assistant/useCalendar';
import { useIsMobile } from '@/components/calendar-assistant/useIsMobile';

export default function CalendarAssistant() {
  const cal = useCalendar();
  const isMobile = useIsMobile();
  const [view, setView] = useState('week');
  const [introKey, setIntroKey] = useState(0);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setDraft(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (isMobile) return <MobileCalendar cal={cal} />;

  const openNew = () => { const hour = cal.nextFreeHour(); if (hour != null) setDraft({ date: cal.focus, hour, centered: true }); };
  const popover = draft && (
    <BookingPopover key={\`\${draft.date}-\${draft.hour}-\${draft.appt?.id}\`} draft={draft} dayIndex={cal.days.indexOf(draft.date)} slotAt={cal.slotAt}
      onClose={() => setDraft(null)} onDelete={async () => { await cal.remove(draft.appt.id); setDraft(null); }}
      onSave={async (booking) => { await (draft.appt ? cal.update(draft.appt.id, booking) : cal.book(booking)); setDraft(null); }} />
  );

  return (
    <div className="ca flex h-screen min-h-[720px] min-w-[900px] flex-col overflow-hidden p-[27px]">
      <TopBar view={view} onNew={openNew} onDay={() => { setDraft(null); setView('day'); }}
        onWeek={() => (view === 'week' ? setIntroKey((k) => k + 1) : setView('week'))} />
      <div className="flex min-h-0 flex-1 gap-[26px] pt-[16px]">
        <Sidebar focus={cal.focus} isToday={cal.isToday} count={cal.focusCount} loading={cal.loading} />
        <main className="relative min-w-0 flex-1">
          <AnimatePresence initial={false}>
            <motion.div key={view} className="absolute inset-0" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}>
              {cal.loading ? null : view === 'week' ? (
                <WeekView days={cal.days} focus={cal.focus} isToday={cal.isToday} appointments={cal.appointments} slotAt={cal.slotAt}
                  selected={draft} introKey={introKey} recentId={cal.recentId} onSlot={(date, hour) => setDraft({ date, hour })}
                  canChange={cal.canChange} onEdit={(appt) => setDraft({ date: appt.date, hour: appt.startHour, appt })}>
                  {!draft?.centered && popover}
                </WeekView>
              ) : (
                <DayView focus={cal.focus} isToday={cal.isToday} slotAt={cal.slotAt} count={cal.focusCount} open={cal.openHours}
                  recentId={cal.recentId} canChange={cal.canChange} onOpen={(hour) => setDraft({ date: cal.focus, hour, centered: true })}
                  onEdit={(appt) => setDraft({ date: appt.date, hour: appt.startHour, appt, centered: true })} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {draft?.centered && popover}
      <ConfirmBand booking={cal.lastBooked} />
    </div>
  );
}
\`\`\`
`;export{e as default};