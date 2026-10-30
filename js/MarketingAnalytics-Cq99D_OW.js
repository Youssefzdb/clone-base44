var e=`# marketing_analytics — app files

## base44/entities/Dashboard.jsonc
\`\`\`json
{
  "name": "Dashboard",
  "type": "object",
  "properties": {
    "brand": {
      "type": "string",
      "description": "The wordmark, top left"
    },
    "period": {
      "type": "string",
      "description": "The month the figures cover, top right"
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
              "currency",
              "count",
              "currency_cents",
              "percent"
            ]
          },
          "comparison": {
            "type": "string"
          },
          "counts_down": {
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "label",
          "value",
          "format"
        ]
      }
    },
    "channels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "channel": {
            "type": "string"
          },
          "leads": {
            "type": "number"
          }
        },
        "required": [
          "channel",
          "leads"
        ]
      }
    },
    "funnel": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "count": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "count"
        ]
      }
    },
    "campaigns": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "spend": {
            "type": "number"
          },
          "revenue": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "spend",
          "revenue"
        ]
      }
    }
  },
  "required": [
    "brand",
    "period",
    "kpis",
    "channels",
    "funnel",
    "campaigns"
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

## src/components/marketing/CampaignTable.jsx
\`\`\`jsx
import { useState } from 'react';
import { dollars } from './data';
import { useGrowth } from './useGrowth';

const SCALE = 19;
// A phone drops the Spend column.
const COLS = 'grid grid-cols-[2.2fr_1fr_1fr_1.5fr] items-center gap-x-[1.302vw] px-[2.5vw] max-[1099px]:gap-x-[16px] max-[1099px]:px-[32px] max-md:grid-cols-[1fr_80px_84px] max-md:gap-x-[8px] max-md:px-[20px]';
// The figure columns sort the table, highest first.
const SORTS = [['spend', 'Spend', 'max-md:hidden'], ['revenue', 'Revenue'], ['roas', <><span className="max-md:hidden">Return on spend</span><span className="md:hidden">ROAS</span></>]];

export default function CampaignTable({ campaigns }) {
  const [ref, grow] = useGrowth();
  const [sort, setSort] = useState('roas');
  const rows = [...campaigns].sort((a, b) => b[sort] - a[sort]);
  return (
    <section ref={ref} className="flex-none pb-[1.146vw] max-[1099px]:pb-[16px] max-md:pb-[12px]">
      <div className={\`\${COLS} ma-rule-b box-content h-[2.917vw] text-[max(14px,1.042vw)] font-medium max-[1099px]:h-[48px] max-[1099px]:text-[16px] max-md:h-[36px] max-md:text-[14px]\`}>
        <span>Campaign</span>
        {SORTS.map(([key, label, hide = '']) => (
          <button key={key} type="button" aria-pressed={sort === key} onClick={() => setSort(key)} className={\`whitespace-nowrap text-right \${hide}\`}>
            {label}{sort === key && ' ↓'}
          </button>
        ))}
      </div>
      {rows.map((c, i) => {
        const share = grow(i * 0.15);
        const roas = c.roas * share;
        return (
          <div key={c.id} className={\`\${COLS} box-content h-[2.396vw] text-[max(14px,1.198vw)] max-[1099px]:h-[44px] max-[1099px]:text-[18px] max-md:h-[36px] max-md:text-[15px] \${i ? 'border-t border-[var(--ma-hair)]' : ''}\`}>
            <span className="truncate font-medium">{c.name}</span>
            <span className="text-right max-md:hidden">{dollars(c.spend)}</span>
            <span className="text-right font-medium">{dollars(c.revenue * share)}</span>
            <span className="flex items-center justify-end gap-[0.833vw] max-[1099px]:gap-[12px]">
              <span className="flex h-[0.521vw] w-[9.375vw] flex-none justify-end border-b border-[var(--ma-hair)] max-[1099px]:h-[8px] max-[1099px]:w-[120px] max-md:h-[4px] max-md:w-[32px]">
                <span className="h-full bg-[var(--swatch-1)]" style={{ width: \`\${Math.min(roas / SCALE, 1) * 100}%\` }} />
              </span>
              <span className="w-[3.333vw] flex-none text-right font-medium max-[1099px]:w-[52px] max-md:w-[40px]">{roas.toFixed(1)}×</span>
            </span>
          </div>
        );
      })}
    </section>
  );
}
\`\`\`

## src/components/marketing/Channels.jsx
\`\`\`jsx
import { count, niceStep } from './data';
import { useGrowth } from './useGrowth';

// The scale is the top channel × 1.175 (the sample's 2,800), with 7% more room on a phone (its 3,000).
const BAR = 'w-[calc(var(--v)/var(--max)*100%)] max-md:w-[calc(var(--v)/(var(--max)*1.0714)*100%)]';
const ROW = 'flex min-h-0 flex-1 items-center';

export default function Channels({ channels }) {
  const [ref, grow] = useGrowth();
  const max = Math.max(...channels.map((c) => c.leads), 1) * 1.175;
  const step = niceStep(max / 2.5);
  const grid = Array.from({ length: Math.ceil(max / step) }, (_, i) => i * step);
  return (
    <section ref={ref} className="flex min-w-0 flex-col px-[2.5vw] min-[1100px]:[border-right:var(--ma-rule)] pb-[2.292vw] pt-[1.5625vw] max-[1099px]:p-[24px_32px_32px] max-[1099px]:[border-bottom:var(--ma-rule)] max-md:p-[16px_20px_18px]">
      <h2 className="ma-display text-[4.167vw] max-[1099px]:text-[60px] max-md:text-[30px]">Leads by channel.</h2>
      <div className="mt-[1.458vw] grid min-h-0 flex-1 grid-cols-[10.833vw_1fr] max-[1099px]:mt-[20px] max-[1099px]:h-[260px] max-[1099px]:flex-none max-[1099px]:grid-cols-[150px_1fr] max-md:mt-[12px] max-md:h-[165px] max-md:grid-cols-[100px_1fr]">
        <div className="flex flex-col">
          {channels.map((c) => (
            <span key={c.id} className={\`\${ROW} truncate text-[max(14px,1.25vw)] font-medium max-[1099px]:text-[18px] max-md:text-[15px]\`}>{c.channel}</span>
          ))}
        </div>
        <div className="relative flex flex-col border-b border-[var(--swatch-1)]" style={{ '--max': max }}>
          {grid.map((v) => (
            <span key={v} className="absolute inset-y-0 w-px bg-[var(--ma-hair)] left-[calc(var(--v)/var(--max)*100%)] max-md:left-[calc(var(--v)/(var(--max)*1.0714)*100%)]" style={{ '--v': v }} />
          ))}
          {channels.map((c, i) => {
            const value = c.leads * grow(i * 0.25);
            return (
              <div key={c.id} className={\`\${ROW} relative\`} style={{ '--v': value }}>
                <span className={\`\${BAR} h-[1.25vw] flex-none bg-[var(--swatch-1)] max-[1099px]:h-[18px] max-md:h-[12px]\`} />
                <span className="ml-[0.625vw] whitespace-nowrap text-[1.5625vw] font-medium leading-none max-[1099px]:ml-[10px] max-[1099px]:text-[22px] max-md:ml-[6px] max-md:text-[16px]">{count(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
\`\`\`

## src/components/marketing/data.js
\`\`\`js
// The dashboard's sample figures, saved as its one Dashboard row the first time the app opens.
const FIGURES = {
  kpis: [
    { label: 'Spend', value: 184320, format: 'currency', comparison: '+8.2% vs August' },
    { label: 'Leads', value: 6412, format: 'count', comparison: '+14.6% vs August' },
    { label: 'Cost per lead', value: 28.75, format: 'currency_cents', comparison: '−5.6% vs August', counts_down: true },
    { label: 'Conversion rate', value: 4.8, format: 'percent', comparison: '+0.6 pt vs August' },
  ],
  channels: [
    { channel: 'Paid Search', leads: 2384 },
    { channel: 'Paid Social', leads: 1796 },
    { channel: 'Email', leads: 1208 },
    { channel: 'Organic', leads: 1024 },
  ],
  funnel: [
    { name: 'Impressions', count: 4820000 },
    { name: 'Clicks', count: 96400 },
    { name: 'Signups', count: 6412 },
    { name: 'Customers', count: 308 },
  ],
  campaigns: [
    { name: 'Spring Nurture Sequence', spend: 3120, revenue: 58970 },
    { name: 'Pillar Guides Hub', spend: 4600, revenue: 41860 },
    { name: 'Brand Search Exact', spend: 18400, revenue: 121440 },
    { name: 'Cart Retargeting', spend: 14250, revenue: 62700 },
    { name: 'Competitor Keywords', spend: 26800, revenue: 85760 },
    { name: 'Lookalike Prospecting', spend: 31600, revenue: 66360 },
  ],
};

export const SAMPLE = { brand: 'TALLVOX®', period: 'September 2026', ...FIGURES };

export const count = (value) => Math.round(value).toLocaleString('en-US');
export const dollars = (value) => \`$\${count(value)}\`;
export const compact = (value) => (value >= 1e6 ? \`\${(value / 1e6).toFixed(2)}M\` : count(value));
export const formatKpi = (value, format) => {
  if (format === 'currency') return dollars(value);
  if (format === 'currency_cents') return \`$\${value.toFixed(2)}\`;
  if (format === 'percent') return \`\${value.toFixed(1)}%\`;
  return count(value);
};
// The largest 1, 2 or 5 × 10ⁿ at or below \`x\`: a round grid-line step.
export const niceStep = (x) => {
  const unit = 10 ** Math.floor(Math.log10(x));
  return [5, 2, 1].find((m) => m * unit <= x) * unit;
};
\`\`\`

## src/components/marketing/Funnel.jsx
\`\`\`jsx
import { compact } from './data';
import { useGrowth } from './useGrowth';

// The stages step down at a fixed rhythm (bar widths, % of the column); each label carries its
// drop-off from the stage above. The label row never narrows below 70% (82% on a phone).
const WIDTHS = [100, 78, 58, 40];

export default function Funnel({ stages }) {
  const [ref, grow] = useGrowth();
  return (
    <section ref={ref} className="flex min-w-0 flex-col px-[2.5vw] pb-[2.292vw] pt-[1.5625vw] max-[1099px]:p-[24px_32px_32px] max-md:p-[16px_20px_20px]">
      <h2 className="ma-display text-[4.167vw] max-[1099px]:text-[60px] max-md:text-[30px]">Funnel.</h2>
      <div className="mt-[1.5625vw] flex min-h-0 flex-1 flex-col justify-between max-[1099px]:mt-[20px] max-[1099px]:h-[260px] max-[1099px]:flex-none max-md:mt-[12px] max-md:h-[185px]">
        {stages.map((s, i) => {
          const share = grow(i * 0.3);
          const drop = i > 0 && stages[i - 1].count ? (s.count / stages[i - 1].count - 1) * 100 : null;
          return (
            <div key={s.id} style={{ '--w': \`\${WIDTHS[i] ?? 30}%\` }}>
              <div className="flex w-[max(var(--w),70%)] items-baseline justify-between max-md:w-[max(var(--w),82%)]">
                <span className="whitespace-nowrap text-[max(14px,1.146vw)] font-medium max-[1099px]:text-[18px] max-md:text-[15px]">
                  {s.name}
                  {drop !== null && <b className="ml-[0.625vw] font-bold max-[1099px]:ml-[10px] max-md:ml-[8px]">↓ −{Math.abs(drop).toFixed(1)}%</b>}
                </span>
                <span className="text-[1.5625vw] font-medium leading-[1.2] tracking-[-0.03em] max-[1099px]:text-[22px] max-md:text-[16px]">{compact(s.count * share)}</span>
              </div>
              <div className="ma-ticks relative mt-[0.3125vw] h-[0.833vw] w-[var(--w)] border-b border-[var(--swatch-1)] max-[1099px]:mt-[6px] max-[1099px]:h-[12px] max-md:mt-[4px] max-md:h-[7px]">
                <span className="absolute inset-y-0 left-0 bg-[var(--swatch-1)]" style={{ width: \`\${share * 100}%\` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/marketing/KpiRow.jsx
\`\`\`jsx
import { formatKpi } from './data';
import { useGrowth } from './useGrowth';

// One row of four on desktop; a 2×2 grid with rules between the tiles below 1100px.
const ruleOf = (i, last) => [
  i < last ? 'min-[1100px]:[border-right:var(--ma-rule)]' : '',
  i % 2 === 0 ? 'max-[1099px]:[border-right:var(--ma-rule)]' : '',
  i < 2 ? 'max-[1099px]:[border-bottom:var(--ma-rule)]' : '',
].join(' ');

export default function KpiRow({ kpis }) {
  const [ref, grow] = useGrowth();
  return (
    <div ref={ref} className="ma-rule-b box-content grid h-[11.042vw] flex-none grid-cols-4 max-[1099px]:h-auto max-[1099px]:grid-cols-2">
      {kpis.map((kpi, i) => (
        <div key={kpi.id} className={\`flex min-w-0 flex-col justify-between px-[2.5vw] pb-[1.667vw] pt-[1.5625vw] max-[1099px]:min-h-[164px] max-[1099px]:p-[22px_32px_24px] max-md:min-h-[100px] max-md:p-[12px_20px] \${ruleOf(i, kpis.length - 1)}\`}
          style={i === 0 ? { background: 'var(--ma-spend-bg)', color: 'var(--ma-spend-ink)' } : undefined}>
          <span className="text-[max(14px,1.146vw)] font-medium leading-[1.15] max-[1099px]:text-[18px] max-md:text-[15px]">{kpi.label}</span>
          <span className="flex flex-col">
            <span className="whitespace-nowrap text-[4.583vw] font-medium leading-[0.92] tracking-[-0.045em] max-[1099px]:text-[64px] max-md:text-[35px]">
              {formatKpi(kpi.value * grow(i * 0.2, kpi.counts_down), kpi.format)}
            </span>
            <span className="mt-[0.521vw] text-[max(14px,1.146vw)] font-medium leading-[1.15] max-[1099px]:mt-[8px] max-[1099px]:text-[18px] max-md:mt-[4px] max-md:text-[14px]">{kpi.comparison}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
\`\`\`

## src/components/marketing/loadDashboard.js
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

## src/components/marketing/marketing.css
\`\`\`css
@font-face{font-family:"Instrument Sans";font-weight:400 700;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-sans-variable-normal.woff2) format("woff2")}

/* The look: ink and surface (--swatch-N, --swatch-N-ink for text on them), plus the inverted Spend tile. */
:root{
  --swatch-1:#0A0A0A;--swatch-1-ink:#FFFFFF;
  --swatch-2:#4A9468;--swatch-2-ink:#111111;
  --ma-spend-bg:var(--swatch-1);--ma-spend-ink:var(--swatch-2);
}
/* gallery-look */

/* Desktop sizes are the 1920-wide design in vw, so the page keeps its proportions at any width. */
.ma{font-family:"Instrument Sans",system-ui,sans-serif;font-variant-numeric:tabular-nums;color:var(--swatch-1);background:var(--swatch-2);-webkit-font-smoothing:antialiased;
  --ma-rule:2px solid var(--swatch-1);--ma-hair:color-mix(in srgb,var(--swatch-1) 30%,transparent);--ma-tick:12px}
@media (min-width:1100px){.ma{--ma-rule:0.1042vw solid var(--swatch-1);--ma-tick:0.729vw}}
.ma-rule-b{border-bottom:var(--ma-rule)}
.ma-display{font-weight:500;letter-spacing:-0.05em;line-height:0.92}
.ma-ticks{background:repeating-linear-gradient(90deg,var(--ma-hair) 0 1px,transparent 1px var(--ma-tick))}
\`\`\`

## src/components/marketing/useGrowth.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const DURATION = 4.2;
const END = DURATION + 1.2; // the last staggered item starts within 1.2 s
const easeInOutCubic = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);

/**
 * A section's figures grow from 90% of their value to all of it, each over 4.2 s from its own
 * \`delay\`; counting down (cost per lead) starts at 110% instead. On desktop every section starts
 * on mount, all at once; narrower, where the page scrolls, a section starts when it first comes
 * into view. Returns [ref for the section, share of the final value for a delay].
 */
export function useGrowth() {
  const ref = useRef(null);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setT(END);
    let frame;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const next = (now - start) / 1000;
        setT(next);
        if (next < END) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    if (window.matchMedia('(min-width: 1100px)').matches || !ref.current) {
      run();
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      run();
    });
    observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  const grow = (delay = 0, down = false) => {
    const p = t >= END ? 1 : easeInOutCubic(Math.min(Math.max((t - delay) / DURATION, 0), 1));
    return down ? 1.1 - 0.1 * p : 0.9 + 0.1 * p;
  };
  return [ref, grow];
}
\`\`\`

## src/components/marketing/useMarketing.js
\`\`\`js
import { useEffect, useState } from 'react';
import { SAMPLE } from './data';
import { loadDashboard, rowsOf } from './loadDashboard';

export function useMarketing() {
  const [data, setData] = useState(null);
  useEffect(() => {
    loadDashboard(SAMPLE).then((dashboard) => setData({
      settings: dashboard,
      kpis: rowsOf(dashboard.kpis).slice(0, 4),
      channels: rowsOf(dashboard.channels).sort((a, b) => b.leads - a.leads),
      funnel: rowsOf(dashboard.funnel),
      campaigns: rowsOf(dashboard.campaigns).map((c) => ({ ...c, roas: c.spend ? c.revenue / c.spend : 0 })),
    }));
  }, []);
  return data;
}
\`\`\`

## src/pages/MarketingAnalytics.jsx
\`\`\`jsx
import '@/components/marketing/marketing.css';
import KpiRow from '@/components/marketing/KpiRow';
import Channels from '@/components/marketing/Channels';
import Funnel from '@/components/marketing/Funnel';
import CampaignTable from '@/components/marketing/CampaignTable';
import { useMarketing } from '@/components/marketing/useMarketing';

// Read-only. Every number and bar starts at 90% and grows into place together, once, on load.
// Desktop (≥1100px) fills the viewport; tablet and phone stack and scroll.
export default function MarketingAnalytics() {
  const data = useMarketing();
  const period = data?.settings.period ?? '';
  return (
    <div className="ma flex h-screen min-h-[56.25vw] flex-col overflow-hidden max-[1099px]:h-auto max-[1099px]:min-h-screen max-[1099px]:overflow-visible">
      <header className="ma-rule-b flex h-[4.375vw] flex-none items-center justify-between px-[2.5vw] max-[1099px]:h-[64px] max-[1099px]:px-[32px] max-md:h-[52px] max-md:px-[20px]">
        <span className="text-[max(14px,1.25vw)] font-semibold max-[1099px]:text-[20px] max-md:text-[17px]">{data?.settings.brand}</span>
        <span className="text-[max(14px,1.146vw)] font-medium max-[1099px]:text-[18px] max-md:text-[14px]">
          <span className="max-md:hidden">{period}</span>
          <span className="md:hidden">{period.replace(/^(\\p{L}{3})\\p{L}*/u, '$1')}</span>
        </span>
      </header>
      {data && (
        <>
          <KpiRow kpis={data.kpis} />
          <div className="ma-rule-b grid min-h-0 flex-1 grid-cols-[1.6fr_1fr] max-[1099px]:flex-none max-[1099px]:grid-cols-1">
            <Channels channels={data.channels} />
            <Funnel stages={data.funnel} />
          </div>
          <CampaignTable campaigns={data.campaigns} />
        </>
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};