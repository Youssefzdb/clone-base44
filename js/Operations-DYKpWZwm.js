var e=`# operations_kpi_report — app files

## base44/entities/Dashboard.jsonc
\`\`\`json
{
  "name": "Dashboard",
  "type": "object",
  "properties": {
    "team": {
      "type": "string",
      "description": "The team the report is for, top left"
    },
    "kpis": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "short_name": {
            "type": "string",
            "description": "The label on narrow screens"
          },
          "value": {
            "type": "number"
          },
          "unit": {
            "type": "string",
            "enum": [
              "",
              "d",
              "%"
            ]
          },
          "target_label": {
            "type": "string"
          },
          "short_target_label": {
            "type": "string",
            "description": "The target on narrow screens"
          },
          "status": {
            "type": "string",
            "enum": [
              "green",
              "amber",
              "red"
            ]
          }
        },
        "required": [
          "name",
          "value",
          "unit",
          "target_label",
          "status"
        ]
      }
    },
    "days": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "format": "date"
          },
          "items": {
            "type": "number"
          }
        },
        "required": [
          "date",
          "items"
        ]
      }
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "owner_name": {
            "type": "string"
          },
          "age_days": {
            "type": "number"
          }
        },
        "required": [
          "title",
          "owner_name",
          "age_days"
        ]
      }
    }
  },
  "required": [
    "team",
    "kpis",
    "days",
    "items"
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

## src/components/operations/data.js
\`\`\`js
// The dashboard's sample figures, saved as its one Dashboard row the first time the app opens.
const KPIS = [
  ['Throughput', 'Throughput', 1284, '', 'Target ≥ 1,200 / day', 'Target ≥ 1,200', 'green'],
  ['Cycle time', 'Cycle time', 3.6, 'd', 'Target ≤ 3.0 days', 'Target ≤ 3.0d', 'amber'],
  ['On-time rate', 'On-time', 94.2, '%', 'Target ≥ 92%', 'Target ≥ 92%', 'green'],
  ['Backlog', 'Backlog', 412, '', 'Target ≤ 350 items', 'Target ≤ 350', 'amber'],
  ['Open incidents', 'Incidents', 7, '', 'Target ≤ 3', 'Target ≤ 3', 'red'],
  ['Utilisation', 'Utilisation', 87, '%', 'Target 75–90%', 'Target 75–90%', 'green'],
];

// The last 30 days, ending today on 1,284.
const DAILY = [1126, 1193, 1151, 1052, 1020, 973, 1143, 1114, 1065, 1097, 1205, 1262, 1089, 1128, 1133,
  1202, 1210, 1136, 1086, 1037, 1266, 1293, 1244, 1205, 1259, 1231, 1208, 1247, 1262, 1284];

const TOP_ITEMS = [
  ['Carrier API timeouts', 'R. Okafor', 14],
  ['Dock 3 scanner fault', 'M. Lindqvist', 9],
  ['Returns queue backlog', 'A. Patel', 6],
  ['Label printer firmware', 'J. Moreau', 4],
  ['Shift roster gap — Thu', 'S. Nakamura', 3],
  ['SLA breach review #88', 'R. Okafor', 2],
];
// The rest of the 24 open items, all younger than the top six.
const MORE_ITEMS = ['Pallet wrap reorder', 'Forklift 2 service', 'Bay 7 lighting', 'Picker app login loop', 'Cycle count — aisle C',
  'Carrier invoice mismatch', 'Seal stock low', 'Night shift handover notes', 'Damaged inbound — PO 4471', 'Dock door 5 sensor',
  'Temp logger offline', 'Packing station 3 scale', 'Return labels misprint', 'Zone B slotting review', 'Badge reader — east gate',
  'Overflow rack audit', 'Conveyor belt squeak', 'Tote shortage — Mon'];
const OWNERS = ['R. Okafor', 'M. Lindqvist', 'A. Patel', 'J. Moreau', 'S. Nakamura'];

const isoDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const sample = () => ({
  team: 'Team North',
  kpis: KPIS.map(([name, short_name, value, unit, target_label, short_target_label, status]) => ({ name, short_name, value, unit, target_label, short_target_label, status })),
  days: DAILY.map((items, i) => ({ date: isoDaysAgo(DAILY.length - 1 - i), items })),
  items: [
    ...TOP_ITEMS.map(([title, owner_name, age_days]) => ({ title, owner_name, age_days })),
    ...MORE_ITEMS.map((title, i) => ({ title, owner_name: OWNERS[i % OWNERS.length], age_days: i % 2 })),
  ],
});

export const TARGET = 1200;
// Decimals follow the final value, so a count-up never flickers between formats.
export const formatValue = (value, final) => value.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(final) ? 0 : 1, maximumFractionDigits: Number.isInteger(final) ? 0 : 1 });
export const initials = (name) => name.split(/[\\s.]+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
export const severity = (age) => (age >= 10 ? 'high' : age >= 5 ? 'medium' : 'low');
\`\`\`

## src/components/operations/Hero.jsx
\`\`\`jsx
import ThroughputChart from './ThroughputChart';
import { useClock } from './timeline';

// Desktop: titles bottom left, chart bottom right. Below lg: title first, chart full width under it.
export default function Hero({ team, days, t }) {
  const clock = useClock();
  return (
    <section className="relative flex flex-none flex-col gap-[14px] rounded-[20px] bg-[var(--swatch-3)] px-[16px] py-[14px] text-[var(--swatch-3-ink)] lg:h-[293px] lg:justify-between lg:gap-0 lg:rounded-[21px] lg:px-[29px] lg:pb-[18px] lg:pt-[24px]">
      <div className="flex items-center justify-between gap-[8px] lg:items-start">
        <span className="truncate text-[14px] opacity-70 lg:mt-[9px] lg:text-[20px]">{team} · Read-only</span>
        <span className="flex h-[26px] flex-none items-center gap-[6px] rounded-full bg-[var(--ui-pill)] px-[10px] text-[13px] font-medium text-[var(--ui-pill-ink)] lg:h-[38px] lg:gap-[8px] lg:px-[17px] lg:text-[19px]">
          <span className="ops-blink h-[6px] w-[6px] rounded-full bg-[var(--ui-green)]" />
          <span className="ops-num"><span className="max-lg:hidden">Synced </span>{clock}</span>
        </span>
      </div>
      <div className="flex min-w-0 flex-col gap-[4px] lg:flex-row lg:items-end lg:justify-between lg:gap-[24px]">
        <div className="flex flex-col-reverse lg:flex-col">
          <p className="text-[14px] opacity-70 lg:text-[23px]">Throughput, last 30 days</p>
          <h1 className="-ml-[2px] whitespace-nowrap text-[52px] font-normal leading-[0.9] tracking-[-0.05em] lg:-ml-[3px] lg:mt-[2px] lg:text-[104px]">Operations</h1>
        </div>
        {days.length > 0 && (
          <>
            <div className="min-w-0 lg:hidden"><ThroughputChart days={days} t={t} compact /></div>
            <div className="-mb-[2px] min-w-0 flex-1 max-lg:hidden"><ThroughputChart days={days} t={t} /></div>
          </>
        )}
      </div>
    </section>
  );
}
\`\`\`

## src/components/operations/KpiTile.jsx
\`\`\`jsx
import { formatValue } from './data';
import { easeOutQuad, progress, ramp } from './timeline';

// The clip's strip: a fixed rising rhythm, the last two bars the tallest.
const TICKS = [5, 6.5, 5, 8.5, 6.5, 10.5, 8.5, 8.5, 12, 10.5, 14, 12, 15, 15];
const LAST = TICKS.length - 2;

export default function KpiTile({ kpi, index, t }) {
  const count = progress(t, index * 0.04, 2.8, easeOutQuad);
  // Once its count lands, each tile in turn pulses its dot and lights its last two bars.
  const landed = 2.8 + index * 0.25;
  const pulse = ramp(t, landed, 0.5);
  const color = \`var(--ui-\${kpi.status})\`;
  return (
    <div className="ops-card flex h-[84px] flex-col justify-between rounded-[14px] p-[12px] lg:h-auto lg:rounded-[15px] lg:px-[19px] lg:pb-[17px] lg:pt-[16px]">
      <div className="flex items-center justify-between gap-[8px]">
        <span className="truncate text-[14px] text-[var(--ui-muted)] lg:text-[16px]">
          <span className="lg:hidden">{kpi.short_name || kpi.name}</span><span className="max-lg:hidden">{kpi.name}</span>
        </span>
        <span className="relative h-[12px] w-[12px] flex-none lg:h-[14px] lg:w-[14px]">
          <span className="absolute inset-0 rounded-full" style={{ background: color }} />
          {t >= landed && pulse < 1 && <span className="absolute inset-0 rounded-full border-2" style={{ borderColor: color, transform: \`scale(\${1 + pulse * 1.4})\`, opacity: 1 - pulse }} />}
        </span>
      </div>
      <div className="ops-num whitespace-nowrap text-[34px] font-normal leading-none tracking-[-0.04em] lg:text-[63px] lg:tracking-[-0.03em]">
        {formatValue(kpi.value * count, kpi.value)}{kpi.unit}
      </div>
      <div className="flex items-end justify-between gap-[8px]">
        <span className="flex h-[15px] flex-none origin-bottom items-end gap-[3px] max-lg:hidden" style={{ transform: \`scaleY(\${count})\` }}>
          {TICKS.map((h, i) => (
            <span key={i} className="w-[2px] rounded-[1px]" style={{ height: h, background: i < LAST ? 'color-mix(in srgb, var(--swatch-4) 35%, transparent)' : t >= landed ? color : 'var(--swatch-4)' }} />
          ))}
        </span>
        <span className="truncate whitespace-nowrap text-right text-[12px] text-[var(--ui-muted)] max-lg:ml-auto lg:text-[length:clamp(12px,1.1vw,14px)]">
          <span className="lg:hidden">{kpi.short_target_label || kpi.target_label}</span><span className="max-lg:hidden">{kpi.target_label}</span>
        </span>
      </div>
    </div>
  );
}
\`\`\`

## src/components/operations/loadDashboard.js
\`\`\`js
import { base44 } from '@/api/base44Client';

// The dashboard is one row, created with the sample figures the first time the app opens: a single
// write, so a reload can't leave it half seeded. Two first loads at once may each create one; every
// later load reads the oldest. A user who may read but not create it (only admins write) still sees
// the samples; if it can't load at all, {} — the page still renders.
export async function loadDashboard(sample) {
  try {
    const [saved] = await base44.entities.Dashboard.list('created_date', 1);
    if (saved) return saved;
    // Only an admin may create it, so no one else tries (the request would be refused).
    const me = await base44.auth.me().catch(() => null);
    return me?.role === 'admin' ? await base44.entities.Dashboard.create(sample).catch(() => sample) : sample;
  } catch (error) {
    console.error(error);
    return {};
  }
}

/** A list field as rows with ids (React keys); a missing list is empty. */
export const rowsOf = (list) => (list ?? []).map((item, i) => ({ id: String(i), ...item }));
\`\`\`

## src/components/operations/OpenItems.jsx
\`\`\`jsx
import { initials, severity } from './data';
import { easeOutQuad, progress } from './timeline';

const PILL = {
  high: 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)] border-transparent',
  medium: 'border-[var(--swatch-3)] text-[var(--swatch-3)]',
  low: 'border-[color-mix(in_srgb,var(--swatch-4)_18%,transparent)] text-[var(--swatch-4)]',
};
const COLUMNS = 'lg:grid-cols-[1fr_118px_57px]';

// Desktop: a six-row table. Below lg: the top four as stacked rows, no column header.
export default function OpenItems({ items, t }) {
  const count = progress(t, 0, 2.8, easeOutQuad);
  return (
    <section className="ops-card flex min-h-0 flex-col rounded-[14px] pb-[6px] pt-[12px] lg:rounded-[15px] lg:pb-[8px] lg:pt-[16px]">
      <div className="flex items-baseline justify-between px-[14px] lg:px-[20px]">
        <h2 className="text-[15px] text-[var(--ui-muted)] lg:text-[16px]">Open items</h2>
        <span><b className="ops-num text-[24px] font-normal tracking-[-0.03em] lg:text-[30px]">{Math.round(items.length * count)}</b> <span className="text-[14px] text-[var(--ui-muted)] lg:text-[15px]">open</span></span>
      </div>
      <div className={\`mt-[9px] grid border-b border-[var(--ops-line)] px-[20px] pb-[9px] text-[12px] text-[var(--ui-muted)] max-lg:hidden \${COLUMNS} gap-x-[8px]\`}>
        <span>Item</span><span>Owner</span><span className="text-right">Age</span>
      </div>
      <div className="flex flex-1 flex-col justify-evenly px-[6px] max-lg:mt-[6px] max-lg:border-t max-lg:border-[var(--ops-line)] max-lg:pt-[4px] lg:px-[8px]">
        {items.slice(0, 6).map((item, i) => {
          const level = severity(item.age_days);
          const avatar = (
            <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--swatch-4)_9%,var(--swatch-2))] text-[10px] font-semibold text-[var(--swatch-4)] lg:h-[23px] lg:w-[23px] lg:text-[9px]">{initials(item.owner_name)}</span>
          );
          return (
            <div key={item.id} className={\`grid min-h-[48px] grid-cols-[26px_1fr_40px] items-center gap-x-[10px] rounded-[8px] px-[8px] lg:h-[40px] lg:min-h-0 lg:gap-x-[8px] lg:px-[12px] \${COLUMNS} \${i >= 4 ? 'max-lg:hidden' : ''} \${level === 'high' ? 'bg-[color-mix(in_srgb,var(--swatch-3)_8%,transparent)]' : ''}\`}>
              <span className="lg:hidden">{avatar}</span>
              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium">{item.title}</span>
                <span className="block truncate text-[13px] text-[var(--ui-muted)] lg:hidden">{item.owner_name}</span>
              </span>
              <span className="flex items-center gap-[6px] truncate text-[12px] text-[var(--ui-muted)] max-lg:hidden">
                {avatar}{item.owner_name}
              </span>
              <span className={\`ops-num flex h-[24px] items-center justify-center rounded-full border text-[13px] font-medium lg:h-[25px] lg:text-[14px] \${PILL[level]}\`}>
                {Math.max(1, Math.round(item.age_days * progress(t, i * 0.05, 2.8, easeOutQuad)))}d
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/operations/operations.css
\`\`\`css
@font-face{font-family:"Geist";font-weight:400 600;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/geist-variable-normal.woff2) format("woff2")}

/* The look: page, tile, hero and text (--swatch-N, --swatch-N-ink for text on them), plus the UI colors. */
:root{
  --swatch-1:#111214;--swatch-1-ink:#FFFFFF;
  --swatch-2:#1E1F22;--swatch-2-ink:#FFFFFF;
  --swatch-3:#E4B6DC;--swatch-3-ink:#111111;
  --swatch-4:#F2F2F3;--swatch-4-ink:#111111;
  --ui-green:#5FC46F;--ui-amber:#E3D45C;--ui-red:#EE7358;--ui-pill:#111111;--ui-pill-ink:#F2F2F3;
  --ui-muted:#8E9096;--ui-border:rgba(255,255,255,0.07);
}
/* gallery-look */

.ops{font-family:"Geist",Inter,system-ui,sans-serif;background:var(--swatch-1);color:var(--swatch-4);letter-spacing:-0.01em;-webkit-font-smoothing:antialiased;
  --ops-line:color-mix(in srgb,var(--swatch-4) 7%,transparent)}
.ops-num{font-variant-numeric:tabular-nums}
.ops-blink{animation:ops-blink 1.2s steps(1) infinite}
@keyframes ops-blink{50%{opacity:.2}}
.ops-card{background:var(--swatch-2);border:1px solid var(--ui-border)}
.ops-ring{transform-box:fill-box;transform-origin:center;animation:ops-ring 2.4s ease-out infinite}
@keyframes ops-ring{from{transform:scale(1);opacity:.35}to{transform:scale(2.4);opacity:0}}
@media (prefers-reduced-motion:reduce){.ops-ring,.ops-blink{animation:none}}
\`\`\`

## src/components/operations/ThroughputChart.jsx
\`\`\`jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { TARGET } from './data';
import { easeInOutSine, ramp } from './timeline';

const START = 0.085;

// Drawn in real pixels at its box width, so text and line keep their size on any screen.
const SIZES = {
  wide: { maxW: 627, H: 160, base: 146, font: 17, pill: 36, dot: 6, lift: 31 },
  compact: { maxW: Infinity, H: 110, base: 98, font: 13, pill: 26, dot: 4.5, lift: 24 },
};

function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    // Measured before the first paint, so the chart is in the first frame (the poster).
    setWidth(ref.current.getBoundingClientRect().width);
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, width];
}

export default function ThroughputChart({ days, t, compact }) {
  const [ref, width] = useWidth();
  const s = compact ? SIZES.compact : SIZES.wide;
  const W = Math.min(width, s.maxW);
  const values = days.map((d) => d.items);
  const [lo, hi] = [Math.min(...values, TARGET) - 70, Math.max(...values, TARGET) + 40];
  const x = (i) => (i / Math.max(days.length - 1, 1)) * W;
  const y = (v) => s.base - ((v - lo) / (hi - lo)) * (s.base - 20);
  // The line draws left to right from its first few days (the clip's first frame); the tip and its tooltip ride it to today.
  const reach = (START + (1 - START) * ramp(t, 0, 6.3, easeInOutSine)) * (days.length - 1);
  const whole = Math.floor(reach);
  const tipValue = values[whole] + ((values[whole + 1] ?? values[whole]) - values[whole]) * (reach - whole);
  const tip = [x(reach), y(tipValue)];
  const points = [...values.slice(0, whole + 1).map((v, i) => [x(i), y(v)]), tip];
  const line = points.map(([px, py], i) => \`\${i ? 'L' : 'M'}\${px},\${py}\`).join('');
  const done = whole >= days.length - 1;
  const label = \`\${Math.round(tipValue).toLocaleString('en-US')} items\${done ? ' · today' : ''}\`;
  const pillW = ((done ? 164 : 128) * s.font) / 17;
  // Centred on the tip while drawing, right-aligned to it at today; never past either edge.
  const pillX = Math.min(Math.max(done ? tip[0] - pillW : tip[0] - pillW / 2, 0), W - pillW);
  return (
    <div ref={ref} className={\`w-full min-w-0 \${compact ? '' : 'flex justify-end'}\`}>
      {W > 0 && (
        <svg width={W} height={s.H + 46} viewBox={\`0 -40 \${W} \${s.H + 46}\`} className="overflow-visible" aria-hidden="true">
          <line x1="0" x2={W} y1={y(TARGET)} y2={y(TARGET)} stroke="currentColor" strokeOpacity="0.45" strokeDasharray="4 4" />
          <text x="0" y={y(TARGET) - 9} fontSize={s.font} fill="currentColor" fillOpacity="0.7">Target {TARGET.toLocaleString('en-US')}</text>
          <path d={\`\${line}L\${tip[0]},\${s.base}L0,\${s.base}Z\`} fill="currentColor" fillOpacity="0.08" />
          <path d={line} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
          <line x1={tip[0]} x2={tip[0]} y1={tip[1]} y2={s.base} stroke="currentColor" strokeOpacity="0.5" />
          {days.map((d, i) => <line key={d.id} x1={x(i)} x2={x(i)} y1={s.base + 6} y2={s.base + (i % 7 === 0 ? 14 : 11)} stroke="currentColor" strokeOpacity="0.4" />)}
          {done && <circle className="ops-ring" cx={tip[0]} cy={tip[1]} r={s.dot} fill="currentColor" />}
          <circle cx={tip[0]} cy={tip[1]} r={s.dot} fill="currentColor" />
          <g transform={\`translate(\${pillX} \${tip[1] - s.lift})\`} opacity={ramp(t, 0.5, 0.6)}>
            <rect y={-s.pill / 2} width={pillW} height={s.pill} rx={s.pill / 2} fill="var(--ui-pill)" />
            <text x={pillW / 2} textAnchor="middle" dominantBaseline="central" fontSize={s.font} fontWeight="500" fill="var(--ui-pill-ink)" className="ops-num">{label}</text>
          </g>
        </svg>
      )}
    </div>
  );
}
\`\`\`

## src/components/operations/timeline.js
\`\`\`js
import { useEffect, useState } from 'react';

export const END = 7;
export const easeOutCubic = (x) => 1 - (1 - x) ** 3;
export const easeOutQuad = (x) => 1 - (1 - x) ** 2;
export const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
// Figures start 85% of the way there (the clip's first frame), never from zero.
const FROM = 0.85;
/** 0 → 1 between \`start\` and \`start + duration\` seconds, eased. */
export const ramp = (t, start, duration, ease = easeOutCubic) => ease(Math.min(Math.max((t - start) / duration, 0), 1));
/** 0.85 → 1 over the same span. */
export const progress = (...args) => FROM + (1 - FROM) * ramp(...args);

/** Seconds since mount, ticking every frame until the load animation ends; the end at once when motion is reduced. */
export function useTimeline() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setT(END);
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const next = Math.min((now - start) / 1000, END);
      setT(next);
      if (next < END) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return t;
}

/** The live clock on the sync pill. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now.toLocaleTimeString('en-GB', { hour12: false });
}
\`\`\`

## src/components/operations/useOperations.js
\`\`\`js
import { useEffect, useState } from 'react';
import { sample } from './data';
import { loadDashboard, rowsOf } from './loadDashboard';

export function useOperations() {
  const [data, setData] = useState(null);
  useEffect(() => {
    loadDashboard(sample()).then((dashboard) => setData({
      settings: dashboard,
      kpis: rowsOf(dashboard.kpis).slice(0, 6),
      days: rowsOf(dashboard.days).sort((a, b) => a.date.localeCompare(b.date)).slice(-30),
      items: rowsOf(dashboard.items).sort((a, b) => b.age_days - a.age_days),
    }));
  }, []);
  return data;
}
\`\`\`

## src/pages/Operations.jsx
\`\`\`jsx
import '@/components/operations/operations.css';
import Hero from '@/components/operations/Hero';
import KpiTile from '@/components/operations/KpiTile';
import OpenItems from '@/components/operations/OpenItems';
import { useOperations } from '@/components/operations/useOperations';
import { useTimeline } from '@/components/operations/timeline';

// Read-only, no inputs. The page appears at once; values grow from 85%, dots pulse and the line finishes, once.
// Below lg (1024px) it stacks and scrolls: 2 KPI columns on phones, 3 from md.
export default function Operations() {
  const data = useOperations();
  const t = useTimeline();
  return (
    <div className="ops flex min-h-screen flex-col gap-[8px] p-[12px] lg:h-screen lg:min-h-[720px] lg:gap-[11px] lg:overflow-hidden lg:p-[24px]">
      {data && (
        <>
          <Hero team={data.settings.team} days={data.days} t={t} />
          <div className="grid min-h-0 gap-[8px] lg:flex-1 lg:grid-cols-[780fr_440fr] lg:gap-[12px]">
            <div className="grid grid-cols-2 gap-[8px] md:grid-cols-3 lg:grid-rows-2 lg:gap-[11px]">
              {data.kpis.map((kpi, i) => <KpiTile key={kpi.id} kpi={kpi} index={i} t={t} />)}
            </div>
            <OpenItems items={data.items} t={t} />
          </div>
        </>
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};