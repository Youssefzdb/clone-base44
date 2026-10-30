var e=`# customer_insights — app files

## base44/entities/Dashboard.jsonc
\`\`\`json
{
  "name": "Dashboard",
  "type": "object",
  "properties": {
    "business_line": {
      "type": "string",
      "description": "Under the title, e.g. the business and its customer count"
    },
    "period_line": {
      "type": "string",
      "description": "The period covered and when it was updated"
    },
    "responses_note": {
      "type": "string",
      "description": "Under Sentiment: how many responses it draws on"
    },
    "tiles": {
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
              "count",
              "percent",
              "decimal"
            ]
          },
          "note": {
            "type": "string"
          }
        },
        "required": [
          "label",
          "value",
          "format"
        ]
      }
    },
    "sentiment": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string",
            "enum": [
              "Positive",
              "Neutral",
              "Negative"
            ]
          },
          "percent": {
            "type": "number"
          }
        },
        "required": [
          "label",
          "percent"
        ]
      }
    },
    "themes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "mentions": {
            "type": "number"
          }
        },
        "required": [
          "label",
          "mentions"
        ]
      }
    },
    "retention": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "month": {
            "type": "string",
            "description": "YYYY-MM"
          },
          "retained": {
            "type": "number",
            "description": "Percent of the cohort still active"
          },
          "retained_count": {
            "type": "number",
            "description": "Customers of the cohort still active"
          },
          "churned": {
            "type": "number",
            "description": "Customers of the cohort lost that month"
          }
        },
        "required": [
          "month",
          "retained"
        ]
      }
    }
  },
  "required": [
    "business_line",
    "period_line",
    "responses_note",
    "tiles",
    "sentiment",
    "themes",
    "retention"
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

## src/components/customer-insights/Blocks.jsx
\`\`\`jsx
import { formatTile } from './data';
import { SCENE, fade, progress } from './timeline';

/**
 * A grid block in fill \`n\`, spanning \`span\` = [phone, tablet, desktop] columns (2, 12, 12 grids).
 * After the opening hold it wipes in top to bottom, \`at\` seconds into the open, then its content fades in.
 */
export function Block({ t, at, span, n, id, className = '', inner = '', children }) {
  const wipe = fade(t, SCENE.open + at, 0.3);
  return (
    <section id={id} tabIndex={id ? -1 : undefined} className={\`min-h-0 overflow-hidden outline-none max-md:scroll-mt-[57px] focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--ci-ink)] [grid-column:span_var(--sm)] md:[grid-column:span_var(--md)] lg:[grid-column:span_var(--lg)] \${className}\`}
      style={{ '--sm': span[0], '--md': span[1], '--lg': span[2], background: \`var(--ci-\${n})\`, clipPath: wipe < 1 ? \`inset(0 0 \${100 - wipe * 100}% 0)\` : undefined }}>
      <div className={\`flex h-full min-h-0 \${inner || 'flex-col p-[20px] md:px-[24px] md:py-[22.67px]'}\`} style={{ opacity: fade(t, SCENE.open + at + 0.14, 0.28) }}>
        {children}
      </div>
    </section>
  );
}

export function HeaderBlock({ t, settings }) {
  return (
    <Block t={t} at={0.11} span={[2, 12, 4]} n={1} id="overview" className="md:max-lg:min-h-[260px]">
      <div className="flex items-center justify-between md:items-start">
        <span className="text-[14px] font-medium leading-[1.5]">Customer Insights</span>
        <span className="bg-[var(--ci-ink)] px-[9px] py-[4px] text-[11px] font-medium leading-[1.5] text-[var(--ci-on-ink)] md:px-[9.33px] md:text-[10.67px]">Read-only</span>
      </div>
      <h1 className="ci-serif mt-[14px] text-[44px] leading-[0.95] tracking-[-0.03em] md:mt-[17px] md:text-[50.67px]">How customers<br />are <em>feeling.</em></h1>
      <p className="mt-[28px] text-[14px] leading-[1.4] md:mt-auto">{settings.business_line}<br />{settings.period_line}</p>
    </Block>
  );
}

export function TileBlock({ t, tile, i }) {
  const value = progress(t, SCENE.tiles + i * 0.08, 0.88);
  return (
    <Block t={t} at={0.19 + 0.055 * i} span={[1, 3, 2]} n={i + 2} id={i ? undefined : 'customers'}
      className={\`max-md:min-h-[150px] md:max-lg:min-h-[230px] \${i === 1 ? 'text-[var(--ci-on-3)]' : ''}\`} inner="flex-col px-[16px] pb-[16px] pt-[18px] md:px-[24px] md:py-[22.67px]">
      <span className="ci-serif text-[48px] leading-[0.9] tracking-[-0.03em] md:text-[64px]">{formatTile(tile.value * value, tile.format)}</span>
      <span className="mt-[12px] text-[14px] font-medium leading-[1.3] md:mt-[14.67px] md:text-[14.67px]">{tile.label}</span>
      <span className="mt-auto pt-[8px] text-[14px] leading-[1.4]" style={{ opacity: fade(t, SCENE.tiles + 0.83 + 0.05 * i, 0.28) }}>{tile.note}</span>
    </Block>
  );
}

export function BlockHeading({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-[12px]">
      <div>
        <h2 className="text-[16px] font-medium leading-[1.3] md:text-[14.67px]">{title}</h2>
        {subtitle && <p className="mt-[4px] text-[14px] leading-[1.3]">{subtitle}</p>}
      </div>
      {right && <p className="mt-[2px] text-right text-[14px] leading-[1.3]">{right}</p>}
    </div>
  );
}
\`\`\`

## src/components/customer-insights/customer-insights.css
\`\`\`css
@font-face{font-family:"Minion Pro";font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/minion-pro-400-normal.woff2) format("woff2")}
@font-face{font-family:"Minion Pro";font-weight:400;font-style:italic;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/minion-pro-400-italic.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:350;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-350-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:500;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-500-normal.woff2) format("woff2")}

/* The look (Pop): the seven swatches (--swatch-N), plus the UI colors built on them — the eight blocks
   in reading order (--ci-1 … --ci-8; the nav shares --ci-1), the ink for text and marks, the hairline
   grid, text on the Active tile, the Neutral sentiment segment, and text on ink (badge, tooltip, card). */
:root{
  --swatch-1:#F4F53A;--swatch-1-ink:#111111;
  --swatch-2:#0F8F5C;--swatch-2-ink:#FFFFFF;
  --swatch-3:#FFB3E0;--swatch-3-ink:#111111;
  --swatch-4:#C7CCD2;--swatch-4-ink:#111111;
  --swatch-5:#FF6A5C;--swatch-5-ink:#111111;
  --swatch-6:#8F74FF;--swatch-6-ink:#111111;
  --swatch-7:#0E0E0E;--swatch-7-ink:#FFFFFF;
  --ci-1:#FFFFFF;--ci-2:var(--swatch-1);--ci-3:var(--swatch-2);--ci-4:var(--swatch-3);
  --ci-5:var(--swatch-4);--ci-6:var(--swatch-5);--ci-7:#FFFFFF;--ci-8:var(--swatch-6);
  --ci-ink:var(--swatch-7);--ci-grid:var(--ci-ink);--ci-on-3:#FFFFFF;--ci-neutral:#FFFFFF;--ci-on-ink:#FFFFFF;
  /* Shades laid over any fill: bar and donut tracks, legend swatch edges, the phone menu's scrim. */
  --ci-track:rgb(0 0 0 / 0.12);--ci-donut-track:rgb(0 0 0 / 0.18);--ci-swatch-edge:rgb(0 0 0 / 0.5);
  --ci-scrim:color-mix(in srgb, var(--ci-ink) 40%, transparent);
}
/* gallery-look */

.ci{font-family:"Neue Haas Unica",system-ui,sans-serif;color:var(--ci-ink);background:var(--ci-grid);-webkit-font-smoothing:antialiased}
.ci-serif{font-family:"Minion Pro","Times New Roman",serif;font-weight:400;font-variant-numeric:tabular-nums}
\`\`\`

## src/components/customer-insights/data.js
\`\`\`js
// The dashboard's sample figures, saved as its one Dashboard row the first time the app opens.
const FIGURES = {
  tiles: [
    { label: 'Total customers', value: 4128, format: 'count', note: '+312 this quarter' },
    { label: 'Active customers', value: 3562, format: 'count', note: '86% of total' },
    { label: 'Churn rate', value: 3.4, format: 'percent', note: 'Monthly, trailing 6 mo' },
    { label: 'Satisfaction Rate', value: 4.3, format: 'decimal', note: 'out of 5 · 1,204 responses' },
  ],
  sentiment: [
    { label: 'Positive', percent: 62 },
    { label: 'Neutral', percent: 24 },
    { label: 'Negative', percent: 14 },
  ],
  themes: [
    { label: 'Onboarding experience', mentions: 412 },
    { label: 'Pricing clarity', mentions: 356 },
    { label: 'Mobile app speed', mentions: 298 },
    { label: 'Support response time', mentions: 241 },
    { label: 'Reporting & exports', mentions: 187 },
  ],
  // Share of the April cohort still active each month, with the head counts behind it.
  retention: [
    [100, 4128, 0], [96.8, 3998, 130], [94.1, 3886, 112], [92.3, 3810, 76], [90.9, 3752, 58], [89.6, 3699, 53],
  ].map(([retained, retained_count, churned], i) => ({ month: \`2026-0\${i + 4}\`, retained, retained_count, churned })),
};

export const SAMPLE = {
  business_line: 'Subscription business · 4,128 customers',
  period_line: 'Apr – Sep 2026 · Updated today, 08:10',
  responses_note: '1,204 survey responses',
  ...FIGURES,
};

export const formatTile = (value, format) => {
  if (format === 'percent') return \`\${value.toFixed(1)}%\`;
  if (format === 'decimal') return value.toFixed(1);
  return Math.round(value).toLocaleString('en-US');
};
const monthDate = (month) => new Date(\`\${month}-01T00:00:00\`);
export const monthShort = (month) => monthDate(month).toLocaleDateString('en-US', { month: 'short' });
export const monthLong = (month) => monthDate(month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
export const count = (n) => Math.round(n).toLocaleString('en-US');
\`\`\`

## src/components/customer-insights/loadDashboard.js
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

## src/components/customer-insights/Nav.jsx
\`\`\`jsx
import { Block } from './Blocks';
import { LINKS } from './useNav';

const PERIOD = 'Apr – Sep 2026';

export function Brand() {
  return (
    <span className="flex items-center gap-[8px] text-[18px] font-medium md:gap-[9.33px] md:text-[14px]">
      <span className="h-[12px] w-[12px] bg-[var(--ci-ink)] md:h-[9.33px] md:w-[9.33px]" />Pulse
    </span>
  );
}

export function Avatar() {
  return (
    <span className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[var(--ci-ink)] text-[14px] font-medium text-[var(--ci-on-ink)] md:h-[24px] md:w-[24px] md:text-[10px]">NL</span>
  );
}

/** The period picker: the board covers one period, shown checked. */
export function PeriodButton({ nav, className = '', tabIndex }) {
  return (
    <div className={\`relative \${className}\`}>
      <button type="button" tabIndex={tabIndex} aria-haspopup="menu" aria-expanded={nav.periodMenu} onClick={() => nav.setPeriodMenu(!nav.periodMenu)}
        className="w-full whitespace-nowrap border border-[var(--ci-ink)] px-[14px] py-[10px] text-[18px] md:px-[9.33px] md:py-[4px] md:text-[14px]">
        {PERIOD} <span className="text-[0.75em]">▾</span>
      </button>
      {nav.periodMenu && (
        <div role="menu" className="absolute right-0 top-[calc(100%+4px)] z-30 w-max min-w-full border border-[var(--ci-ink)] bg-[var(--ci-1)] text-[14px]">
          <button type="button" role="menuitemradio" aria-checked="true" onClick={() => nav.setPeriodMenu(false)} className="flex w-full items-center justify-between gap-[16px] px-[12px] py-[8px] text-left font-medium">
            {PERIOD}<span aria-hidden="true">✓</span>
          </button>
          <p className="border-t border-[var(--ci-ink)] px-[12px] py-[8px]">Earlier periods appear as data arrives</p>
        </div>
      )}
    </div>
  );
}

export default function Nav({ t, nav }) {
  return (
    <Block t={t} at={0.055} span={[2, 12, 12]} n={1} className="relative z-20 !overflow-visible max-md:sticky max-md:top-0 max-md:h-[56px]"
      inner="flex-row items-center justify-between px-[20px] md:justify-start md:gap-[32px] md:px-[24px]">
      <Brand />
      <nav className="flex h-full gap-[24px] max-md:hidden">
        {LINKS.map((link) => (
          <button key={link} type="button" onClick={() => nav.select(link)} aria-current={nav.active === link ? 'page' : undefined}
            className={\`relative h-full text-[14px] \${nav.active === link ? 'font-medium' : ''}\`}>
            {link}
            {nav.active === link && <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--ci-ink)]" />}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-[4px] md:ml-auto md:gap-[18.67px]">
        <PeriodButton nav={nav} className="max-md:hidden" />
        <button type="button" onClick={nav.exportFigures} className="text-[14px] max-md:hidden">Export</button>
        <Avatar />
        <button type="button" aria-label="Open menu" onClick={() => nav.setDrawer(true)} className="flex h-[44px] w-[44px] flex-col items-center justify-center gap-[5px] md:hidden">
          {[0, 1, 2].map((bar) => <span key={bar} className="h-[2px] w-[22px] bg-[var(--ci-ink)]" />)}
        </button>
      </div>
    </Block>
  );
}
\`\`\`

## src/components/customer-insights/NavDrawer.jsx
\`\`\`jsx
import { PeriodButton } from './Nav';
import { LINKS } from './useNav';

/** The phone menu: section links, the period and Export, sliding in from the right over a scrim. */
export default function NavDrawer({ nav }) {
  const open = nav.drawer;
  return (
    <div className={\`fixed inset-0 z-40 md:hidden \${open ? '' : 'pointer-events-none'}\`} aria-hidden={!open}>
      <div className={\`absolute inset-0 bg-[var(--ci-scrim)] transition-opacity duration-[250ms] \${open ? 'opacity-100' : 'opacity-0'}\`} onClick={() => nav.setDrawer(false)} />
      <div role="dialog" aria-modal="true" aria-label="Menu"
        className={\`absolute inset-y-0 right-0 flex w-[80%] flex-col overflow-y-auto border-l border-[var(--ci-ink)] bg-[var(--ci-1)] px-[20px] pb-[24px] text-[var(--ci-ink)] transition-transform duration-[250ms] ease-out \${open ? 'translate-x-0' : 'translate-x-full'}\`}>
        <button type="button" aria-label="Close menu" onClick={() => nav.setDrawer(false)} className="-mr-[12px] flex h-[56px] w-[44px] items-center justify-center self-end text-[28px] leading-none">×</button>
        <nav className="flex flex-col">
          {LINKS.map((link) => (
            <button key={link} type="button" tabIndex={open ? 0 : -1} onClick={() => nav.select(link)} aria-current={nav.active === link ? 'page' : undefined}
              className="ci-serif border-b border-[var(--ci-ink)] py-[20px] text-left text-[24px] leading-none">
              <span className={\`pb-[4px] \${nav.active === link ? 'border-b-[3px] border-[var(--ci-ink)]' : ''}\`}>{link}</span>
            </button>
          ))}
        </nav>
        <div className="mt-[24px] flex flex-col gap-[12px]">
          <PeriodButton nav={nav} tabIndex={open ? 0 : -1} />
          <button type="button" tabIndex={open ? 0 : -1} onClick={nav.exportFigures} className="w-full border border-[var(--ci-ink)] px-[14px] py-[10px] text-[18px]">Export</button>
        </div>
      </div>
    </div>
  );
}
\`\`\`

## src/components/customer-insights/Retention.jsx
\`\`\`jsx
import { Block, BlockHeading } from './Blocks';
import { monthShort } from './data';
import { DetailCard, Tooltip } from './RetentionMarks';
import { SCENE, easeInOutCubic, easeOutBack, fade, progress } from './timeline';
import { useRetention } from './useRetention';

// Hover a point to move the tooltip there; click it to pin its detail card.
export default function Retention({ t, points, mobile }) {
  const chart = useRetention(t, points, mobile);
  const { dims, x, at, last } = chart;
  const axes = fade(t, SCENE.retention - 0.1, 0.33);
  const tip = fade(t, SCENE.retention + 1.32, 0.28, easeOutBack);
  return (
    <Block t={t} at={0.55} span={[2, 12, 5]} n={8} id="retention" className="md:max-lg:min-h-[320px]">
      <BlockHeading title="Retention" right="April cohort, retained" />
      <svg viewBox={\`0 0 \${dims.W} \${dims.H}\`} className="mt-[24px] w-full overflow-visible md:mt-auto md:max-lg:max-h-[240px]" onMouseLeave={() => chart.hoverPoint(null)}>
        <g opacity={axes}>
          {points.map((p, i) => (
            <g key={p.id}>
              <line x1={x(i)} x2={x(i)} y1={dims.PT - 30} y2={dims.H - dims.PB} stroke="var(--ci-ink)" strokeOpacity="0.35" strokeWidth="1" />
              <text x={x(i)} y={dims.H - 8} fontSize={dims.label} fill="var(--ci-ink)" textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}>{monthShort(p.month)}</text>
            </g>
          ))}
        </g>
        <path d={chart.path} fill="none" stroke="var(--ci-ink)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" pathLength="1"
          strokeDasharray="1" strokeDashoffset={1 - progress(t, SCENE.retention + 0.1, 1.2, easeInOutCubic)} />
        {points.map((p, i) => {
          const pop = fade(t, SCENE.retention + 0.08 + 0.24 * i, 0.22, easeOutBack);
          const { x: cx, y: cy } = at(i);
          return (
            <g key={p.id}>
              {chart.rings.has(i) && <circle cx={cx} cy={cy} r={10 * pop} fill="none" stroke="var(--ci-ink)" strokeWidth="2" />}
              <circle cx={cx} cy={cy} r={4 * pop} fill="var(--ci-ink)" />
            </g>
          );
        })}
        {chart.ripple && (
          <circle cx={at(chart.ripple.i).x} cy={at(chart.ripple.i).y} r={6 + 22 * chart.ripple.p} fill="none" stroke="var(--ci-ink)" strokeWidth="2" opacity={1 - chart.ripple.p} />
        )}
        {points[chart.active] && <Tooltip point={points[chart.active]} at={at(chart.active)} dims={dims} mobile={mobile} scale={tip} />}
        {chart.card && <DetailCard points={points} i={chart.card.i} at={at(chart.card.i)} dims={dims} scale={chart.card.scale} />}
        {points.map((p, i) => (
          <circle key={p.id} cx={at(i).x} cy={at(i).y} r="18" fill="transparent" className="cursor-pointer outline-none" role="button" tabIndex={0}
            aria-label={\`\${monthShort(p.month)}: \${p.retained.toFixed(1)}% retained\`}
            onMouseEnter={() => chart.hoverPoint(i)} onFocus={() => chart.hoverPoint(i)} onBlur={() => chart.hoverPoint(null)}
            onClick={() => chart.togglePin(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && chart.togglePin(i)} />
        ))}
      </svg>
    </Block>
  );
}
\`\`\`

## src/components/customer-insights/RetentionMarks.jsx
\`\`\`jsx
import { count, monthLong, monthShort } from './data';

/** The tooltip over the active point: "Sep · 89.6% retained" (just the value on phones). */
export function Tooltip({ point, at, dims, mobile, scale }) {
  const [w, h, above] = dims.tip;
  const left = Math.min(Math.max(at.x - w / 2, 0), dims.W - w);
  const top = at.y - above;
  return (
    <g transform={\`translate(\${left + w / 2} \${top + h / 2}) scale(\${scale})\`} pointerEvents="none">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="var(--ci-ink)" />
      <text textAnchor="middle" dominantBaseline="central" fontSize={mobile ? 13 : 18} fontWeight="500" fill="var(--ci-on-ink)">
        {mobile ? \`\${point.retained.toFixed(1)}%\` : \`\${monthShort(point.month)} · \${point.retained.toFixed(1)}% retained\`}
      </text>
    </g>
  );
}

/** A month's detail card, popping out of its point. */
export function DetailCard({ points, i, at, dims, scale }) {
  const point = points[i];
  const prev = points[i - 1];
  const k = dims.card;
  const [w, h] = [290 * k, 148 * k];
  const left = Math.min(Math.max(at.x + 18 * k, 0), dims.W - w);
  const top = Math.max(at.y - 162 * k, -40 * k);
  const cohort = points[0].retained_count;
  const change = prev && (point.retained - prev.retained).toFixed(1).replace('-', '−');
  return (
    <g transform={\`translate(\${at.x} \${at.y}) scale(\${scale}) translate(\${left - at.x} \${top - at.y}) scale(\${k})\`} opacity={Math.min(scale, 1)} pointerEvents="none">
      <rect width="290" height="148" fill="var(--ci-ink)" />
      <g fill="var(--ci-on-ink)">
        <text x="18" y="32" fontSize="16" fontWeight="500" letterSpacing="0.04em">{monthLong(point.month).toUpperCase()}</text>
        <text x="18" y="72" fontSize="36" className="ci-serif">{point.retained.toFixed(1)}%</text>
        {point.retained_count != null && <text x="18" y="102" fontSize="17">{count(point.retained_count)} of {count(cohort)} retained</text>}
        <text x="18" y="128" fontSize="17">
          {prev ? \`\${point.churned != null ? \`\${count(point.churned)} churned · \` : ''}\${change} pts vs \${monthShort(prev.month)}\` : 'Cohort start'}
        </text>
      </g>
    </g>
  );
}
\`\`\`

## src/components/customer-insights/Sentiment.jsx
\`\`\`jsx
import { Block, BlockHeading } from './Blocks';
import { SCENE, easeInOutCubic, fade, progress } from './timeline';

const R = 74;
const STROKE = 30;
const C = 2 * Math.PI * R;
const GAP = 3;
const COLORS = { Positive: 'var(--ci-ink)', Neutral: 'var(--ci-neutral)', Negative: 'color-mix(in srgb, var(--ci-ink) 33%, transparent)' };
const segmentStart = (i) => SCENE.sentiment + 0.1 + i * 0.41;

export default function Sentiment({ t, shares, note, mobile }) {
  let offset = 0;
  const lead = shares[0];
  return (
    <Block t={t} at={0.44} span={[2, 5, 3]} n={6} id="feedback" className="md:max-lg:min-h-[300px]">
      <BlockHeading title="Sentiment" subtitle={note} />
      <div className="mt-[24px] flex items-end justify-between md:mt-auto">
        <div className="mb-[4px] flex flex-col gap-[8px] md:gap-[6.67px]">
          {shares.map((s, i) => (
            <div key={s.id} className="grid grid-cols-[19px_64px_auto] items-center md:grid-cols-[16px_62.67px_auto]" style={{ opacity: fade(t, segmentStart(i) + 0.17, 0.2) }}>
              <span className="h-[11px] w-[11px] rounded-full border border-[var(--ci-swatch-edge)] md:h-[8px] md:w-[8px]" style={{ background: COLORS[s.label] }} />
              <span className="text-[14px]">{s.label}</span>
              <span className="ci-serif text-[19px] leading-[1.3] md:text-[16px]">{s.percent}%</span>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 190 190" className="h-[150px] w-[150px] md:-mb-[10.67px] md:-mr-[10.67px] md:h-[126.67px] md:w-[126.67px]" aria-hidden="true">
          <circle cx="95" cy="95" r={R} fill="none" stroke="var(--ci-donut-track)" strokeWidth={STROKE} />
          {shares.map((s, i) => {
            const length = Math.max((s.percent / 100) * C - GAP, 0) * progress(t, segmentStart(i), 0.5, easeInOutCubic);
            const dash = <circle key={s.id} cx="95" cy="95" r={R} fill="none" stroke={COLORS[s.label]} strokeWidth={STROKE}
              strokeDasharray={\`\${length} \${C}\`} strokeDashoffset={-offset} transform="rotate(-90 95 95)" />;
            offset += (s.percent / 100) * C;
            return dash;
          })}
          <text x="95" y="95" textAnchor="middle" dominantBaseline="central" className="ci-serif" fontSize={mobile ? 45.6 : 40} fill="var(--ci-ink)">
            {Math.round((lead?.percent ?? 0) * progress(t, SCENE.sentiment + 0.1, 0.6))}%
          </text>
        </svg>
      </div>
    </Block>
  );
}
\`\`\`

## src/components/customer-insights/Themes.jsx
\`\`\`jsx
import { Block, BlockHeading } from './Blocks';
import { SCENE, fade, progress } from './timeline';

export default function Themes({ t, themes }) {
  const top = Math.max(...themes.map((th) => th.mentions), 1);
  return (
    <Block t={t} at={0.5} span={[2, 7, 4]} n={7} id="themes" className="md:max-lg:min-h-[300px]">
      <BlockHeading title="Top feedback themes" subtitle="Mentions across support, surveys and reviews" />
      <div className="mt-[24px] flex flex-col gap-[14px] md:mt-auto md:gap-[12px]">
        {themes.map((th, i) => {
          const grow = progress(t, SCENE.themes + 0.14 + 0.09 * i, 0.6);
          return (
            <div key={th.id} className="grid grid-cols-[1fr_auto] items-center gap-x-[10.67px] gap-y-[6px] md:grid-cols-[153.33px_1fr_40px]" style={{ opacity: fade(t, SCENE.themes + 0.05 + 0.09 * i, 0.28) }}>
              <span className="truncate text-[14px]">{th.label}</span>
              <span className="h-[14px] bg-[var(--ci-track)] max-md:order-last max-md:col-span-2 md:h-[14.67px]">
                <span className="block h-full bg-[var(--ci-ink)]" style={{ width: \`\${(th.mentions / top) * 100 * grow}%\` }} />
              </span>
              <span className="ci-serif text-right text-[20px] leading-none tabular-nums md:-mt-[4px] md:text-[16px]">{Math.round(th.mentions * grow)}</span>
            </div>
          );
        })}
      </div>
    </Block>
  );
}
\`\`\`

## src/components/customer-insights/timeline.js
\`\`\`js
import { useEffect, useState } from 'react';

// Seconds from load. The finished board holds until \`open\`, then every block wipes back in and each
// section's figures settle in turn; \`explore\` taps June on the retention chart.
export const SCENE = { open: 0.7, tiles: 1.72, sentiment: 3.35, themes: 5.1, retention: 6.35, explore: 8.1, end: 11.6 };

export const easeOutCubic = (x) => 1 - (1 - x) ** 3;
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
export const easeOutBack = (x) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2;

const clamp = (x) => Math.min(Math.max(x, 0), 1);
/** 0 → 1 between \`start\` and \`start + duration\`, eased; 1 while the finished board holds before \`open\`. */
export const fade = (t, start, duration, ease = easeOutCubic) => (t < SCENE.open ? 1 : ease(clamp((t - start) / duration)));

/** A figure's share of its value: whole on the first frame, then counted and drawn in again from the open. */
export const progress = fade;

/** Seconds since \`ready\`, ticking every frame until the timeline ends; the finished time when motion is reduced. */
export function useTimeline(ready) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!ready) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setT(SCENE.end);
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const next = Math.min((now - start) / 1000, SCENE.end);
      setT(next);
      if (next < SCENE.end) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);
  return t;
}

/** True below 768px, where the board stacks into one column. */
export function useIsMobile() {
  const query = '(max-width: 767px)';
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMobile(list.matches);
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, []);
  return mobile;
}
\`\`\`

## src/components/customer-insights/useInsights.js
\`\`\`js
import { useEffect, useState } from 'react';
import { SAMPLE } from './data';
import { loadDashboard, rowsOf } from './loadDashboard';

const SENTIMENT_ORDER = ['Positive', 'Neutral', 'Negative'];

export function useInsights() {
  const [data, setData] = useState(null);
  useEffect(() => {
    loadDashboard(SAMPLE).then((dashboard) => setData({
      settings: dashboard,
      tiles: rowsOf(dashboard.tiles).slice(0, 4),
      sentiment: rowsOf(dashboard.sentiment).sort((a, b) => SENTIMENT_ORDER.indexOf(a.label) - SENTIMENT_ORDER.indexOf(b.label)),
      themes: rowsOf(dashboard.themes).sort((a, b) => b.mentions - a.mentions).slice(0, 5),
      retention: rowsOf(dashboard.retention).sort((a, b) => a.month.localeCompare(b.month)).slice(-6),
    }));
  }, []);
  return data;
}
\`\`\`

## src/components/customer-insights/useNav.js
\`\`\`js
import { useEffect, useState } from 'react';
import { formatTile, monthShort } from './data';

export const LINKS = ['Overview', 'Customers', 'Feedback', 'Retention', 'Reports'];
// The block each link scrolls to on a stacked board and outlines (focus) on the one-screen desktop board;
// Reports downloads the board's figures (the same CSV as Export).
const TARGETS = { Overview: 'overview', Customers: 'customers', Feedback: 'feedback', Retention: 'retention' };

const csvCell = (v) => (/[",\\n]/.test(String(v)) ? \`"\${String(v).replace(/"/g, '""')}"\` : String(v));

/** Every figure on the board as CSV rows: section, item, value. */
export function figuresCsv(data) {
  const rows = [
    ['Section', 'Item', 'Value'],
    ...data.tiles.map((tile) => ['Overview', tile.label, formatTile(tile.value, tile.format)]),
    ...data.sentiment.map((s) => ['Sentiment', s.label, \`\${s.percent}%\`]),
    ...data.themes.map((th) => ['Feedback themes', th.label, th.mentions]),
    ...data.retention.map((p) => ['Retention (April cohort)', monthShort(p.month), \`\${p.retained.toFixed(1)}%\`]),
  ];
  return rows.map((row) => row.map(csvCell).join(',')).join('\\n');
}

export function useNav(data) {
  const [active, setActive] = useState('Overview');
  const [drawer, setDrawer] = useState(false);
  const [periodMenu, setPeriodMenu] = useState(false);

  useEffect(() => {
    const close = (e) => e.key === 'Escape' && (setDrawer(false), setPeriodMenu(false));
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const select = (link) => {
    setDrawer(false);
    if (link === 'Reports') return exportFigures();
    setActive(link);
    const block = document.getElementById(TARGETS[link]);
    block?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    block?.focus({ preventScroll: true });
  };

  const exportFigures = () => {
    const url = URL.createObjectURL(new Blob([figuresCsv(data)], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'customer-insights.csv' });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return { active, select, drawer, setDrawer, periodMenu, setPeriodMenu, exportFigures };
}
\`\`\`

## src/components/customer-insights/useRetention.js
\`\`\`js
import { useState } from 'react';
import { SCENE, easeOutBack } from './timeline';

const DESKTOP = { W: 760, H: 250, PT: 50, PB: 40, label: 18, tip: [190, 40, 62], card: 1 };
const MOBILE = { W: 360, H: 200, PT: 46, PB: 30, label: 13, tip: [64, 28, 40], card: 0.62 };
const [PL, PR] = [10, 10];
const SCRIPTED = 2; // the opening tour taps June

const clamp = (x) => Math.min(Math.max(x, 0), 1);
/** The tour's tap: a ripple, the hover ring, then June's detail card popping out and back. */
function tour(t) {
  const e = t - SCENE.explore;
  const ripple = e >= 0.3 && e < 0.8 ? (e - 0.3) / 0.5 : null;
  let card = 0;
  if (e >= 0.45 && e < 0.75) card = easeOutBack((e - 0.45) / 0.3);
  else if (e >= 0.75 && e < 2.65) card = 1;
  else if (e >= 2.65 && e < 3) card = 1 - clamp((e - 2.65) / 0.35) ** 3;
  return { ripple, card, ring: e >= 0.3 && e < 3 };
}

/** Chart geometry, plus which point is hovered (moves the tooltip) and pinned (shows its detail card). */
export function useRetention(t, points, mobile) {
  const dims = mobile ? MOBILE : DESKTOP;
  const { W, H, PT, PB } = dims;
  const [hover, setHover] = useState(null);
  const [pinned, setPinned] = useState(null);
  const last = points.length - 1;
  const values = points.map((p) => p.retained);
  const top = Math.max(...values);
  // A little room under the lowest point, whatever the figures.
  const span = Math.max(top - Math.min(...values), 1) * 1.15;
  const x = (i) => PL + (i / Math.max(last, 1)) * (W - PL - PR);
  const y = (v) => PT + ((top - v) / span) * (H - PT - PB);
  const at = (i) => ({ x: x(i), y: y(points[i].retained) });
  const scripted = Math.min(SCRIPTED, last);
  // No points (the dashboard couldn't load): nothing for the tour to tap.
  const demo = last >= 0 ? tour(t) : { ripple: null, card: 0, ring: false };
  const card = pinned != null ? { i: pinned, scale: 1 } : demo.card > 0 ? { i: scripted, scale: demo.card } : null;
  const rings = new Set([hover ?? last, pinned, demo.ring ? scripted : null].filter((i) => i != null));
  return {
    dims, x, y, at, last, rings, card,
    active: hover ?? last,
    ripple: demo.ripple != null ? { i: scripted, p: demo.ripple } : null,
    path: points.map((p, i) => \`\${i ? 'L' : 'M'}\${x(i)},\${y(p.retained)}\`).join(''),
    hoverPoint: setHover,
    togglePin: (i) => setPinned((current) => (current === i ? null : i)),
  };
}
\`\`\`

## src/pages/CustomerInsights.jsx
\`\`\`jsx
import '@/components/customer-insights/customer-insights.css';
import { HeaderBlock, TileBlock } from '@/components/customer-insights/Blocks';
import Nav from '@/components/customer-insights/Nav';
import NavDrawer from '@/components/customer-insights/NavDrawer';
import Sentiment from '@/components/customer-insights/Sentiment';
import Themes from '@/components/customer-insights/Themes';
import Retention from '@/components/customer-insights/Retention';
import { useInsights } from '@/components/customer-insights/useInsights';
import { useNav } from '@/components/customer-insights/useNav';
import { SCENE, fade, useIsMobile, useTimeline } from '@/components/customer-insights/timeline';

// Read-only. On load the finished board holds a beat, then wipes back in block by block while each
// section's figures settle, and the retention chart taps June to show its detail card.
export default function CustomerInsights() {
  const data = useInsights();
  const t = useTimeline(Boolean(data));
  const mobile = useIsMobile();
  const nav = useNav(data);
  const rise = fade(t, SCENE.open + 0.03, 0.45);
  return (
    <div className="ci flex min-h-screen flex-col lg:h-screen lg:min-h-[720px] lg:overflow-hidden">
      {data && (
        <>
          <div className="grid flex-1 grid-cols-2 content-start gap-px md:grid-cols-12 md:max-lg:grid-rows-[48px_auto_auto_auto_1fr] lg:grid-rows-[48px_306.67px_1fr]"
            style={rise < 1 ? { opacity: rise, transform: \`translateY(\${(1 - rise) * 13}px)\` } : undefined}>
            <Nav t={t} nav={nav} />
            <HeaderBlock t={t} settings={data.settings} />
            {data.tiles.map((tile, i) => <TileBlock key={tile.id} t={t} tile={tile} i={i} />)}
            <Sentiment t={t} shares={data.sentiment} note={data.settings.responses_note} mobile={mobile} />
            <Themes t={t} themes={data.themes} />
            <Retention t={t} points={data.retention} mobile={mobile} />
          </div>
          <NavDrawer nav={nav} />
        </>
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};