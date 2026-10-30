var e=`# sales_dashboard — app files

## base44/entities/Dashboard.jsonc
\`\`\`json
{
  "name": "Dashboard",
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "The dashboard title, top left"
    },
    "kpis": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "value": {
            "type": "number"
          },
          "format": {
            "type": "string",
            "enum": [
              "currency_k",
              "number",
              "currency",
              "percent"
            ]
          },
          "change": {
            "type": "number",
            "description": "Change vs last month, in percent"
          }
        },
        "required": [
          "label",
          "value",
          "format",
          "change"
        ]
      }
    },
    "months": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "month": {
            "type": "string",
            "description": "YYYY-MM"
          },
          "revenue": {
            "type": "number"
          }
        },
        "required": [
          "month",
          "revenue"
        ]
      }
    },
    "stages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "deals": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "deals"
        ]
      }
    },
    "reps": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "closed_revenue": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "closed_revenue"
        ]
      }
    }
  },
  "required": [
    "title",
    "kpis",
    "months",
    "stages",
    "reps"
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

## src/components/sales-dashboard/data.js
\`\`\`js
// The dashboard's sample figures, saved as its one Dashboard row the first time the app opens.
// The five reps sum to September's $312,400; $312,400 ÷ 47 deals = $6,647 average deal.
const FIGURES = {
  kpis: [
    { label: 'Revenue', value: 312400, format: 'currency_k', change: 8.1 },
    { label: 'Deals', value: 47, format: 'number', change: 6.8 },
    { label: 'Avg deal', value: 6647, format: 'currency', change: 1.2 },
    { label: 'Win rate', value: 31.4, format: 'percent', change: -1.6 },
  ],
  months: [182.1, 190.8, 198.4, 207.2, 218.9, 226.3, 238.0, 247.5, 261.2, 274.0, 289.0, 312.4].map((k, i) => ({
    month: i < 3 ? \`2025-\${10 + i}\` : \`2026-0\${i - 2}\`,
    revenue: Math.round(k * 1000),
  })),
  stages: [
    { name: 'Lead', deals: 420 },
    { name: 'Qualified', deals: 236 },
    { name: 'Proposal', deals: 128 },
    { name: 'Negotiation', deals: 74 },
    { name: 'Closed won', deals: 47 },
  ],
  reps: [
    { name: 'Maya O.', closed_revenue: 84000 },
    { name: 'Daniel R.', closed_revenue: 72400 },
    { name: 'Priya N.', closed_revenue: 64000 },
    { name: 'Tom L.', closed_revenue: 52000 },
    { name: 'Aiko T.', closed_revenue: 40000 },
  ],
};

export const SAMPLE = { title: 'Sales', ...FIGURES };

export const formatKpi = (value, format) => {
  if (format === 'currency_k') return \`$\${(value / 1000).toFixed(1)}k\`;
  if (format === 'currency') return \`$\${Math.round(value).toLocaleString('en-US')}\`;
  if (format === 'percent') return \`\${value.toFixed(1)}%\`;
  return Math.round(value).toLocaleString('en-US');
};
export const thousands = (value) => \`$\${Math.round(value / 1000)}k\`;
export const monthLetter = (month) => new Date(\`\${month}-01T00:00:00\`).toLocaleDateString('en-US', { month: 'narrow' });
// The largest 1, 2 or 5 × 10ⁿ at or below \`x\`: a round grid-line step.
export const niceStep = (x) => {
  const unit = 10 ** Math.floor(Math.log10(x));
  return [5, 2, 1].find((m) => m * unit <= x) * unit;
};
\`\`\`

## src/components/sales-dashboard/KpiTile.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { CountUp, EASE_OUT_BACK, FROM, POP_FROM } from './motion';
import { formatKpi } from './data';

const TICKS = 60;
export const KPI_STAGGER = 0.2;
const COUNT_TIME = 1.6;

function Gauge({ value, delay }) {
  const lit = Math.round((value / 100) * TICKS);
  const first = Math.round(lit * FROM);
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true"
      className="absolute right-[14px] top-[14px] h-[56px] w-[56px] sm:right-[19px] sm:top-1/2 sm:h-[90px] sm:w-[90px] sm:-translate-y-1/2">
      {Array.from({ length: TICKS }, (_, i) => {
        const angle = (i / TICKS) * 2 * Math.PI;
        const [sin, cos] = [Math.sin(angle), -Math.cos(angle)];
        const line = { x1: 50 + sin * 36, y1: 50 + cos * 36, x2: 50 + sin * 49, y2: 50 + cos * 49, strokeWidth: 1.6, strokeLinecap: 'round' };
        if (i >= lit) return <line key={i} {...line} stroke="var(--ui-elevated)" />;
        return (
          <motion.line key={i} {...line} stroke="var(--swatch-3)" initial={i >= first ? { opacity: 0 } : false} animate={{ opacity: 1 }}
            transition={{ delay: delay + ((i - first + 1) / (lit - first)) * COUNT_TIME * 0.5, duration: 0.12 }} />
        );
      })}
    </svg>
  );
}

export default function KpiTile({ kpi, index }) {
  const delay = index * KPI_STAGGER;
  const up = kpi.change >= 0;
  const tone = up ? 'var(--swatch-3)' : 'var(--ui-negative)';
  return (
    <div className="sd-card relative flex min-h-[120px] min-w-0 flex-col p-[18px] sm:min-h-0 sm:p-[19px]">
      <span className="text-[13px] leading-[1.3] text-[var(--ui-muted)] sm:text-[19px]">{kpi.label}</span>
      <CountUp value={kpi.value} format={(v) => formatKpi(v, kpi.format)} delay={delay} duration={COUNT_TIME}
        className="sd-num mb-[14px] whitespace-nowrap text-[min(34px,7vw)] font-light leading-[1.15] sm:mb-[16px] sm:text-[56px]" />
      <motion.span initial={{ scale: POP_FROM }} animate={{ scale: 1 }} transition={{ delay: delay + COUNT_TIME, duration: 0.45, ease: EASE_OUT_BACK }}
        style={{ color: tone, borderColor: \`color-mix(in srgb, \${tone} 45%, transparent)\` }}
        className="sd-mono mt-auto inline-flex h-[20px] w-fit origin-left items-center gap-[6px] rounded-full border px-[8px] text-[12px] font-medium sm:h-[25px] sm:gap-[9px] sm:px-[11px] sm:text-[17px]">
        <span className="text-[10px] sm:text-[15px]">{up ? '▲' : '▼'}</span>{Math.abs(kpi.change).toFixed(1)}%
      </motion.span>
      {kpi.format === 'percent' && <Gauge value={kpi.value} delay={delay} />}
    </div>
  );
}
\`\`\`

## src/components/sales-dashboard/loadDashboard.js
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

## src/components/sales-dashboard/motion.jsx
\`\`\`jsx
import { useEffect } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

export const EASE_OUT_QUART = [0.25, 1, 0.5, 1];
export const EASE_OUT_BACK = [0.34, 1.56, 0.64, 1];
// Figures start at 90% of their value, so the first frame is the finished page, a touch short.
export const FROM = 0.9;
/** A pop from 0.6 to 1, started at 90% of the way like the figures. */
export const POP_FROM = 1 - 0.4 * (1 - FROM);

/** A number that grows from 90% to its value once, \`delay\` seconds after it mounts. */
export function CountUp({ value, format, delay = 0, duration = 1.3, className }) {
  const reduced = useReducedMotion();
  const current = useMotionValue(reduced ? value : value * FROM);
  const text = useTransform(current, format);
  useEffect(() => {
    if (reduced) return current.set(value);
    const controls = animate(current, value, { delay, duration, ease: EASE_OUT_QUART });
    return () => controls.stop();
  }, [current, value, delay, duration, reduced]);
  return <motion.span className={className}>{text}</motion.span>;
}
\`\`\`

## src/components/sales-dashboard/RankedRows.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { CountUp, EASE_OUT_QUART, FROM } from './motion';

const GROW_TIME = 0.8;

/** The pipeline funnel (thick bars fading down the stages, the last in accent) or the rep leaderboard (thin bars sliding in, the leader in accent). */
export default function RankedRows({ title, rows, accent, variant, start, stagger, format }) {
  const top = Math.max(...rows.map((r) => r.value), 1);
  const funnel = variant === 'funnel';
  return (
    <section className="sd-card flex min-h-0 flex-1 flex-col p-[18px] sm:p-[19px] lg:pb-0">
      <h2 className="text-[18px] font-normal leading-[1.25] tracking-[0.01em] sm:text-[24px]">{title}</h2>
      <div className="mt-[10px] flex flex-col">
        {rows.map((row, i) => {
          const delay = start + i * stagger;
          const lit = i === accent;
          const width = (row.value / top) * 100;
          const fill = lit ? 'var(--swatch-3)' : \`color-mix(in srgb, var(--swatch-4) \${funnel ? Math.max(34 - 5 * i, 6) : 40}%, transparent)\`;
          return (
            <motion.div key={row.id}
              initial={funnel ? false : { opacity: FROM, x: -20 * (1 - FROM) }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.5, ease: EASE_OUT_QUART }}
              className={\`grid h-[26px] items-center gap-x-[10px] text-[15px] font-medium sm:h-[24px] sm:gap-x-[12px] sm:text-[17px] \${funnel ? 'grid-cols-[110px_1fr_44px] sm:grid-cols-[125px_1fr_41px]' : 'grid-cols-[96px_1fr_52px] sm:grid-cols-[99px_1fr_73px]'}\`}>
              <span className={\`truncate \${lit ? (funnel ? 'font-semibold' : 'text-[var(--swatch-3)]') : ''}\`}>{row.name}</span>
              <span className={\`relative overflow-hidden rounded-full bg-[var(--ui-elevated)] \${funnel ? 'h-[14px]' : 'h-[4px]'}\`}>
                <motion.span initial={{ width: \`\${width * FROM}%\` }} animate={{ width: \`\${width}%\` }} transition={{ delay, duration: GROW_TIME, ease: EASE_OUT_QUART }}
                  className="absolute inset-y-0 left-0 rounded-full" style={{ background: fill }} />
              </span>
              <CountUp value={row.value} format={format} delay={delay} duration={GROW_TIME}
                className={\`sd-mono text-right font-medium \${lit && funnel ? 'text-[var(--swatch-3)]' : ''}\`} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/sales-dashboard/RevenueChart.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { EASE_OUT_BACK, EASE_OUT_QUART, FROM, POP_FROM } from './motion';
import { monthLetter, niceStep, thousands } from './data';

const BAR_GAP = 0.17;
const BAR_TIME = 0.6;
// Headroom above the tallest bar for its tag.
const HEADROOM = 1.143;

export default function RevenueChart({ months, start }) {
  const top = Math.max(...months.map((m) => m.revenue), 1) * HEADROOM;
  const last = months.length - 1;
  const pct = (v) => \`\${(v / top) * 100}%\`;
  const step = niceStep(top / 2.5);
  const gridlines = Array.from({ length: Math.ceil(top / step) - 1 }, (_, i) => (i + 1) * step);
  return (
    <section className="sd-card flex h-[300px] min-h-0 flex-col p-[18px] sm:h-[400px] sm:p-[19px] lg:h-auto">
      <h2 className="text-[18px] font-normal leading-[1.25] tracking-[0.01em] sm:text-[24px]">Monthly revenue</h2>
      <div className="relative mt-[5px] flex-1">
        {gridlines.map((v) => (
          <span key={v} className="absolute inset-x-0 h-px bg-[color-mix(in_srgb,var(--ui-ink)_7%,transparent)]" style={{ bottom: pct(v) }} />
        ))}
        <div className="absolute inset-0 flex items-end gap-[6px] sm:gap-[11px]">
          {months.map((m, i) => {
            const alpha = 10 + (i / Math.max(last - 1, 1)) * 12;
            return (
              <div key={m.id} className="relative flex h-full flex-1 items-end">
                <motion.div initial={{ height: pct(m.revenue * FROM) }} animate={{ height: pct(m.revenue) }}
                  transition={{ delay: start + i * BAR_GAP, duration: BAR_TIME, ease: EASE_OUT_QUART }}
                  className="w-full rounded-[4px] sm:rounded-[5px]"
                  style={{ background: i === last ? 'var(--swatch-3)'
                    : \`linear-gradient(180deg, color-mix(in srgb, var(--swatch-4) \${alpha}%, transparent), color-mix(in srgb, var(--swatch-4) 3.5%, transparent))\` }} />
                {i === last && (
                  <motion.span initial={{ scale: POP_FROM }} animate={{ scale: 1 }}
                    transition={{ delay: start + last * BAR_GAP + BAR_TIME, duration: 0.45, ease: EASE_OUT_BACK }}
                    className="sd-mono absolute right-0 flex h-[20px] origin-bottom-right items-center whitespace-nowrap rounded-full bg-[var(--swatch-4)] px-[7px] text-[12px] text-[var(--swatch-4-ink)] sm:h-[29px] sm:px-[11px] sm:text-[17px]"
                    style={{ bottom: \`calc(\${pct(m.revenue)} + 10px)\` }}>
                    {thousands(m.revenue)}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="sd-mono mt-[10px] flex gap-[6px] text-[11px] sm:mt-[13px] sm:gap-[11px] sm:text-[16px]">
        {months.map((m, i) => (
          <span key={m.id} className={\`flex-1 text-center \${i === last ? 'text-[var(--ui-ink)]' : 'text-[var(--ui-muted)]'}\`}>{monthLetter(m.month)}</span>
        ))}
      </div>
    </section>
  );
}
\`\`\`

## src/components/sales-dashboard/sales-dashboard.css
\`\`\`css
@font-face{font-family:"Sora";font-weight:300 600;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/sora-variable-normal.woff2) format("woff2")}
@font-face{font-family:"JetBrains Mono";font-weight:400 500;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/jetbrains-mono-variable-normal.woff2) format("woff2")}

/* The look: canvas, card, accent and accent light (--swatch-N, --swatch-N-ink for text on them), plus the UI colors (--ui-elevated: bar tracks and unlit gauge ticks). */
:root{
  --swatch-1:#000A06;--swatch-1-ink:#FFFFFF;
  --swatch-2:#0A1A14;--swatch-2-ink:#FFFFFF;
  --swatch-3:#7AFFB4;--swatch-3-ink:#111111;
  --swatch-4:#E3FFEF;--swatch-4-ink:#111111;
  --ui-ink:#FFFFFF;--ui-muted:#828282;--ui-negative:#FF7A7A;--ui-elevated:#161818;
}
/* gallery-look */

.sd{font-family:"Sora",system-ui,sans-serif;color:var(--ui-ink);background:var(--swatch-1);letter-spacing:0.02em;-webkit-font-smoothing:antialiased}
.sd-glow{background:radial-gradient(ellipse 60% 62% at 50% 64%,color-mix(in srgb,var(--swatch-3) 15%,transparent),transparent 74%)}
.sd-card{background:var(--swatch-2);border:1px solid color-mix(in srgb,var(--swatch-3) 28%,transparent);border-radius:14px}
@media (min-width:640px){.sd-card{border-radius:11px}}
.sd-mono{font-family:"JetBrains Mono",ui-monospace,monospace;font-variant-numeric:tabular-nums;letter-spacing:0}
.sd-num{font-variant-numeric:tabular-nums;letter-spacing:-0.035em}
.sd-live{letter-spacing:0.18em}
.sd-live-dot{box-shadow:0 0 8px 1px var(--swatch-3);animation:sd-pulse 2.2s ease-in-out infinite}
@keyframes sd-pulse{50%{opacity:.35;box-shadow:0 0 2px 0 var(--swatch-3)}}
@media (prefers-reduced-motion:reduce){.sd-live-dot{animation:none}}
\`\`\`

## src/components/sales-dashboard/useSalesData.js
\`\`\`js
import { useEffect, useState } from 'react';
import { SAMPLE } from './data';
import { loadDashboard, rowsOf } from './loadDashboard';

const by = (key, dir = 1) => (a, b) => (a[key] > b[key] ? dir : a[key] < b[key] ? -dir : 0);

export function useSalesData() {
  const [data, setData] = useState(null);
  useEffect(() => {
    loadDashboard(SAMPLE).then((dashboard) => setData({
      settings: dashboard,
      kpis: rowsOf(dashboard.kpis),
      months: rowsOf(dashboard.months).sort(by('month')).slice(-12),
      stages: rowsOf(dashboard.stages),
      reps: rowsOf(dashboard.reps).sort(by('closed_revenue', -1)).slice(0, 5),
    }));
  }, []);
  return data;
}
\`\`\`

## src/pages/SalesDashboard.jsx
\`\`\`jsx
import { MotionConfig } from 'framer-motion';
import '@/components/sales-dashboard/sales-dashboard.css';
import KpiTile from '@/components/sales-dashboard/KpiTile';
import RevenueChart from '@/components/sales-dashboard/RevenueChart';
import RankedRows from '@/components/sales-dashboard/RankedRows';
import { useSalesData } from '@/components/sales-dashboard/useSalesData';
import { thousands } from '@/components/sales-dashboard/data';

// Read-only: the page shows at once, its figures at 90%, and they grow into place once — KPIs, then revenue, pipeline, reps.
const BARS_START = 2.1;
const PIPELINE_START = 4.05;
const REPS_START = 5.3;

export default function SalesDashboard() {
  const data = useSalesData();
  return (
    <MotionConfig reducedMotion="user">
      <div className="sd relative flex min-h-screen min-w-[320px] flex-col overflow-x-hidden p-4 sm:p-[28px] lg:h-screen lg:min-h-[720px] lg:overflow-hidden lg:p-[37px]">
        <div className="sd-glow pointer-events-none absolute inset-0" />
        <header className="relative flex h-[40px] flex-none items-center justify-between sm:h-[48px]">
          <h1 className="text-[32px] font-light leading-none tracking-[-0.01em] sm:text-[40px]">{data?.settings.title}</h1>
          <span className="sd-mono sd-live flex items-center gap-[8px] text-[12px] uppercase text-[var(--swatch-3)] sm:gap-[9px] sm:text-[16px]">
            <span className="sd-live-dot h-[8px] w-[8px] rounded-full bg-current sm:h-[7px] sm:w-[7px]" />Live
          </span>
        </header>
        {data && (
          <main className="relative mt-3 flex min-h-0 flex-col lg:flex-1 gap-3 sm:mt-4 sm:gap-4">
            <div className="grid flex-none grid-cols-2 gap-3 sm:auto-rows-[170px] sm:gap-4 lg:grid-cols-[1.1fr_1fr_1fr_1.15fr]">
              {data.kpis.map((kpi, i) => <KpiTile key={kpi.id} kpi={kpi} index={i} />)}
            </div>
            <div className="grid min-h-0 grid-cols-1 gap-3 sm:gap-4 lg:flex-1 lg:grid-cols-[1023fr_758fr]">
              <RevenueChart months={data.months} start={BARS_START} />
              <div className="grid min-h-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1 lg:grid-rows-2">
                <RankedRows title="Pipeline" variant="funnel" start={PIPELINE_START} stagger={0.26} accent={data.stages.length - 1}
                  rows={data.stages.map((s) => ({ id: s.id, name: s.name, value: s.deals }))} format={(v) => String(Math.round(v))} />
                <RankedRows title="Top reps" variant="leaderboard" start={REPS_START} stagger={0.22} accent={0}
                  rows={data.reps.map((r) => ({ id: r.id, name: r.name, value: r.closed_revenue }))} format={thousands} />
              </div>
            </div>
          </main>
        )}
      </div>
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};