var e=`# personal_finance — app files

## base44/entities/Dashboard.jsonc
\`\`\`json
{
  "name": "Dashboard",
  "type": "object",
  "properties": {
    "greeting": {
      "type": "string",
      "default": "Hey, good morning"
    },
    "monthly_income": {
      "type": "number"
    },
    "income_note": {
      "type": "string"
    },
    "spend_note": {
      "type": "string"
    },
    "savings_note": {
      "type": "string"
    },
    "hero_image_url": {
      "type": "string"
    },
    "avatar_url": {
      "type": "string"
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
          "net_worth": {
            "type": "number"
          },
          "note": {
            "type": "string",
            "description": "Optional annotation on the trend chart"
          },
          "note_short": {
            "type": "string",
            "description": "Shorter annotation for phone screens"
          },
          "note_below": {
            "type": "boolean",
            "default": false
          }
        },
        "required": [
          "month",
          "net_worth"
        ]
      }
    },
    "allocation": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "percent": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "percent"
        ]
      }
    },
    "spending": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "amount": {
            "type": "number"
          }
        },
        "required": [
          "name",
          "amount"
        ]
      }
    }
  },
  "required": [
    "monthly_income",
    "months",
    "allocation",
    "spending"
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

## src/components/personal-finance/data.js
\`\`\`js
// The dashboard's sample figures, saved as its one Dashboard row the first time the app opens: steady saving,
// a December bonus jump and small dips in February and June.
const NET_WORTH = [186400, 190150, 199800, 203100, 199650, 204900, 209300, 213600, 208200, 214700, 219450, 224380];
const NOTES = { 2: ['Year-end bonus', 'Bonus', false], 8: ['Car replaced', 'New car', true] };

export const SAMPLE = {
  months: NET_WORTH.map((net_worth, i) => {
    const [note, note_short, below] = NOTES[i] ?? [];
    return { month: i < 3 ? \`2025-\${10 + i}\` : \`2026-0\${i - 2}\`, net_worth, ...(note && { note, note_short, note_below: below }) };
  }),
  allocation: [['Equities', 52], ['Bonds', 18], ['Real estate', 16], ['Cash', 10], ['Other', 4]].map(([name, percent]) => ({ name, percent })),
  spending: [['Home', 1850], ['Food', 640], ['Travel', 520], ['Shop', 470], ['Transit', 410], ['Dining', 380], ['Bills', 290], ['Health', 260]].map(([name, amount]) => ({ name, amount })),
  greeting: 'Hey, good morning',
  monthly_income: 8450,
  income_note: 'Take-home, Sep',
  spend_note: '6.2% below average',
  savings_note: '12-month avg 38.1%',
  // The designer's pastel meadow hero and portrait; replace with any landscape and photo.
  hero_image_url: 'https://media.base44.com/images/public/builder-assets/gallery-personal-finance-hero.webp',
  avatar_url: 'https://media.base44.com/images/public/builder-assets/gallery-personal-finance-avatar.webp',
};

export const money = (value) => \`$\${Math.round(value).toLocaleString('en-US')}\`;
const parse = (month) => new Date(\`\${month}-01T00:00:00\`);
export const monthShort = (month) => parse(month).toLocaleDateString('en-US', { month: 'short' });
export const monthYear = (month) => parse(month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
export const monthLong = (month) => parse(month).toLocaleDateString('en-US', { month: 'long' });
\`\`\`

## src/components/personal-finance/loadDashboard.js
\`\`\`js
import { base44 } from '@/api/base44Client';

// Each user's dashboard is their own row, created with the sample figures the first time they open the
// app: a single write, so a reload can't leave it half seeded. Two first loads at once may each create
// one; every later load reads the oldest of the user's own (admins can read everyone's rows).
// If it can't load at all, {} — the page still renders.
export async function loadDashboard(sample) {
  try {
    // A failed identity lookup can't pick the user's row (admins read every row): show the samples, write nothing.
    let me;
    try {
      me = await base44.auth.me();
    } catch {
      return sample;
    }
    const { Dashboard } = base44.entities;
    const [saved] = me ? await Dashboard.filter({ created_by_id: me.id }, 'created_date', 1) : await Dashboard.list('created_date', 1);
    return saved ?? (await Dashboard.create(sample).catch(() => sample));
  } catch (error) {
    console.error(error);
    return {};
  }
}

/** A list field as rows with ids (React keys); a missing list is empty. */
export const rowsOf = (list) => (list ?? []).map((item, i) => ({ id: String(i), ...item }));
\`\`\`

## src/components/personal-finance/Nav.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { Bell, House } from 'lucide-react';

const Chart = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="4" width="17" height="16" rx="3.5" /><path d="M8.5 11v3M12 8.5v6.5M15.5 11.5v2.5" />
  </svg>
);
const Wallet = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="14" rx="3.5" /><path d="M20.5 10h-4a2 2 0 0 0 0 4h4" />
  </svg>
);
const ITEMS = [[House, 'overview', 'Overview'], [Chart, 'trend', 'Net worth trend'], [Wallet, 'assets', 'Asset allocation'], [Bell, 'spending', 'Spending']];

// A one-page app: each item brings its panel into view and flashes it; Overview goes back to the top.
// A side rail on wide screens, a tab bar on phones.
export default function Nav() {
  const [active, setActive] = useState('overview');
  // Scrolling by hand moves the highlight to the panel under the top third (the last one in view at the page end).
  // A screen that fits the whole page never scrolls, so there a click's highlight stays.
  useEffect(() => {
    const sync = () => {
      if (document.documentElement.scrollHeight <= window.innerHeight + 2) return;
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const line = atEnd ? window.innerHeight : window.innerHeight / 3;
      const above = ITEMS.filter(([, panel]) => (document.querySelector(\`[data-pf-panel="\${panel}"]\`)?.getBoundingClientRect().top ?? Infinity) <= line);
      setActive(above.length ? above[above.length - 1][1] : 'overview');
    };
    sync(); // a reload can restore the scroll without an event
    window.addEventListener('scroll', sync, { passive: true });
    return () => window.removeEventListener('scroll', sync);
  }, []);
  const go = (panel) => {
    setActive(panel);
    const el = document.querySelector(\`[data-pf-panel="\${panel}"]\`);
    if (panel === 'overview') window.scrollTo({ top: 0, behavior: 'smooth' });
    else el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (el) el.animate([{ outlineColor: getComputedStyle(el).getPropertyValue('--pf-line') }, { outlineColor: 'transparent' }], { duration: 1400, easing: 'ease-out' });
  };
  const items = (size, button) => ITEMS.map(([Icon, panel, label]) => (
    <button key={panel} type="button" aria-label={label} title={label} aria-current={active === panel ? 'true' : undefined} onClick={() => go(panel)}
      className={\`flex items-center justify-center rounded-full transition-colors \${button} \${active === panel ? 'bg-white shadow-[0_2px_6px_rgba(0,0,0,0.06)]' : 'pf-sunk'}\`}>
      <Icon size={size} strokeWidth={1.8} />
    </button>
  ));
  return (
    <>
      <nav className="pf-sunk absolute left-[41px] top-1/2 flex -translate-y-1/2 flex-col gap-[6px] rounded-full p-[5px] max-md:hidden">
        {items(18, 'h-[39px] w-[39px]')}
      </nav>
      <nav className="fixed inset-x-0 bottom-[14px] z-10 flex justify-center md:hidden">
        <div className="pf-sunk flex gap-[12px] rounded-full p-[6px]">{items(24, 'h-[52px] w-[52px]')}</div>
      </nav>
    </>
  );
}
\`\`\`

## src/components/personal-finance/personal-finance.css
\`\`\`css
@font-face{font-family:"Newsreader";font-weight:300 600;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/newsreader-variable-normal.woff2) format("woff2")}

/* The look: page, ink, trend line, spending fill, equities (--swatch-N, --swatch-N-ink for text on them),
   then the design's own tones: the other donut segments, muted text, pace line, sunk gradient, card, shadow tint. */
:root{
  --swatch-1:#F4F1EC;--swatch-1-ink:#2A302A;
  --swatch-2:#2A302A;--swatch-2-ink:#FFFFFF;
  --swatch-3:#A29B90;--swatch-3-ink:#FFFFFF;
  --swatch-4:#E8A5CC;--swatch-4-ink:#2A302A;
  --swatch-5:#7E9F5D;--swatch-5-ink:#FFFFFF;
  --pf-seg-2:#E39BC4;--pf-seg-3:#9CC2EF;--pf-seg-4:#BBD599;--pf-seg-5:#F1C8DD;
  --pf-muted:#66625C;--pf-pace:#D4D1C9;--pf-sunk1:#EBE6DF;--pf-sunk2:#EFEBE5;--pf-card:#FAF8F5;--pf-shadow:#786450;--pf-glow:#E2D0BA;
}
/* gallery-look */

.pf{font-family:"Newsreader",Georgia,serif;font-optical-sizing:auto;font-variant-numeric:tabular-nums;color:var(--swatch-2);-webkit-font-smoothing:antialiased;
  --pf-page:var(--swatch-1);--pf-ink:var(--swatch-2);--pf-line:var(--swatch-3);--pf-fill:var(--swatch-4);--pf-seg-1:var(--swatch-5);
  background:radial-gradient(circle at 6% 4%,rgba(255,255,255,0.75),transparent 42%),radial-gradient(circle at 96% 98%,color-mix(in srgb,var(--pf-glow) 28%,transparent),transparent 48%),var(--pf-page)}
.pf-sunk{background:linear-gradient(145deg,var(--pf-sunk1) 0%,var(--pf-sunk2) 50%,var(--pf-page) 100%);
  box-shadow:inset 7px 7px 16px color-mix(in srgb,var(--pf-shadow) 22%,transparent),inset -7px -7px 15px rgba(255,255,255,0.95),inset 1px 1px 3px color-mix(in srgb,var(--pf-shadow) 13%,transparent),inset -1px -1px 0 rgba(255,255,255,0.9)}
.pf-well{box-shadow:inset 3px 3px 8px color-mix(in srgb,var(--pf-shadow) 22%,transparent),inset -3px -3px 8px rgba(255,255,255,0.9)}
.pf-label{letter-spacing:0.14em;text-transform:uppercase}
@media (max-width:767px){
  .pf-sunk{box-shadow:inset 6px 6px 14px color-mix(in srgb,var(--pf-shadow) 22%,transparent),inset -6px -6px 13px rgba(255,255,255,0.95),inset 1px 1px 3px color-mix(in srgb,var(--pf-shadow) 13%,transparent),inset -1px -1px 0 rgba(255,255,255,0.9)}
}
[data-pf-panel]{scroll-margin:20px;outline:2px solid transparent;outline-offset:3px}
\`\`\`

## src/components/personal-finance/SidePanels.jsx
\`\`\`jsx
import { useRef } from 'react';
import { money, monthLong, monthShort } from './data';
import { END, progress, useStarted, useTimeline } from './timeline';

const GAP = 3;
const COLORS = [1, 2, 3, 4, 5].map((n) => \`var(--pf-seg-\${n})\`);
const colorOf = (i) => COLORS[i % COLORS.length];
// Segments fill one after another, clockwise; each legend row counts up with its segment; the stagger tightens so the last of \`n\` ends by END.
const segment = (t, i, n) => progress(t, i * Math.min(0.8, (END - 0.9) / n), 0.9);

export function Allocation({ allocation, total, compact }) {
  const ref = useRef(null);
  const t = useTimeline(useStarted(ref, compact));
  const [size, r, stroke, inset] = compact ? [150, 62, 18, 36] : [126, 52, 16, 27];
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <section ref={ref} data-pf-panel="assets" className="pf-sunk flex flex-col rounded-[24px] p-[20px] md:rounded-[20px] md:px-[21px] md:pb-0 md:pt-[17px]">
      <h2 className="pf-label text-[15px] font-medium tracking-[0.08em] md:text-[14px]">Asset allocation</h2>
      <div className="mt-[14px] flex flex-col items-center gap-[18px] md:mt-[9px] md:flex-row md:gap-[19px]">
        <div className="pf-well relative flex-none rounded-full" style={{ width: size, height: size }}>
          <svg viewBox={\`0 0 \${size} \${size}\`} className="absolute inset-0" aria-hidden="true">
            {allocation.map((a, i) => {
              const share = (a.percent / 100) * c;
              const drawn = Math.max(share - GAP, 0) * segment(t, i, allocation.length);
              const ring = <circle key={a.id} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colorOf(i)} strokeWidth={stroke}
                strokeDasharray={\`\${drawn} \${c}\`} strokeDashoffset={-offset} transform={\`rotate(-90 \${size / 2} \${size / 2})\`} />;
              offset += share;
              return ring;
            })}
          </svg>
          <div className="pf-sunk absolute flex flex-col items-center justify-center rounded-full" style={{ inset }}>
            <span className="pf-label text-[11px] text-[var(--pf-muted)] md:text-[10px]">Invested</span>
            <span className="text-[22px] font-medium leading-tight md:text-[19px]">\${Math.round(total / 1000)}k</span>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-[8px] md:gap-[3px]">
          {allocation.map((a, i) => {
            const p = segment(t, i, allocation.length);
            return (
              <div key={a.id} className="grid grid-cols-[1fr_auto_48px] items-baseline gap-x-[10px] md:grid-cols-[1fr_auto_42px]" style={{ opacity: p }}>
                <span className="flex items-center gap-[8px] text-[18px] md:gap-[7px] md:text-[15px]"><i className="h-[8px] w-[8px] flex-none rounded-full md:h-[7px] md:w-[7px]" style={{ background: colorOf(i) }} />{a.name}</span>
                <span className="text-[16px] text-[var(--pf-muted)] md:text-[13px]">{money((total * a.percent * p) / 100)}</span>
                <span className="text-right text-[18px] font-medium md:text-[16px]">{Math.round(a.percent * p)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Spending({ spending, total, month, compact }) {
  const ref = useRef(null);
  const t = useTimeline(useStarted(ref, compact));
  const top = Math.max(...spending.map((s) => s.amount), 1);
  const grow = (i) => progress(t, 0.2 + i * 0.2, 1.2);
  return (
    <section ref={ref} data-pf-panel="spending" className="pf-sunk flex flex-col rounded-[24px] p-[20px] md:rounded-[20px] md:px-[21px] md:pb-0 md:pt-[15px]">
      <div className="flex items-baseline justify-between">
        <h2 className="text-[20px] font-medium md:text-[16px]">Spending</h2>
        <span className="text-[16px] text-[var(--pf-muted)] md:text-[14px]">{month && \`\${compact ? monthShort(month) : monthLong(month)} · \`}<b className="font-medium text-[var(--pf-ink)]">{money(total)}</b></span>
      </div>
      {compact ? (
        <div className="mt-[14px] flex flex-col gap-[12px]">
          {spending.map((s, i) => (
            <div key={s.id} className="grid grid-cols-[80px_1fr_64px] items-center gap-x-[10px] text-[17px]">
              <span className="text-[var(--pf-muted)]">{s.name}</span>
              <span className="pf-well relative h-[12px] overflow-hidden rounded-full">
                <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--pf-fill)]" style={{ width: \`\${(s.amount / top) * 100 * grow(i)}%\`, minWidth: 12 }} />
              </span>
              <span className="text-right">{money(s.amount)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-[11px] flex justify-between">
          {spending.map((s, i) => (
            <div key={s.id} className="flex w-[42px] flex-col items-center">
              <span className="whitespace-nowrap text-[length:clamp(11px,1.016vw,13px)]">{money(s.amount)}</span>
              <span className="pf-well relative mt-[5px] h-[45px] w-[19px] overflow-hidden rounded-full">
                <span className="absolute inset-x-0 bottom-0 rounded-full bg-[var(--pf-fill)]" style={{ height: \`\${(s.amount / top) * 100 * grow(i)}%\`, minHeight: grow(i) * 8 }} />
              </span>
              <span className="mt-[3px] whitespace-nowrap text-[length:clamp(11px,1.016vw,13px)] text-[var(--pf-muted)]">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
\`\`\`

## src/components/personal-finance/timeline.js
\`\`\`js
import { useEffect, useState } from 'react';

export const END = 5;
export const easeOut = (x) => 1 - (1 - x) ** 3;
export const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
// Everything starts 90% of the way there, so the first frame is the finished page, a touch short.
const FROM = 0.9;
/** 0.9 → 1 between \`start\` and \`start + duration\` seconds, eased. */
export const progress = (t, start, duration, ease = easeOut) => FROM + (1 - FROM) * ease(Math.min(Math.max((t - start) / duration, 0), 1));

/** Seconds since \`active\` turned on, ticking every frame until the load animation ends; the end at once when motion is reduced. */
export function useTimeline(active = true) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
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
  }, [active]);
  return t;
}

const PHONE = '(max-width: 767px)';
/** True below 768px, the phone layout. */
export function useCompact() {
  const [compact, setCompact] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE).matches);
  useEffect(() => {
    const query = window.matchMedia(PHONE);
    const update = () => setCompact(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return compact;
}

/** On a phone, true once the element has scrolled into view; on wider screens, at once. */
export function useStarted(ref, compact) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!compact || !ref.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setSeen(true), { threshold: 0.35 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [compact, ref]);
  return !compact || seen;
}
\`\`\`

## src/components/personal-finance/TopRow.jsx
\`\`\`jsx
import { ChevronDown } from 'lucide-react';
import { money } from './data';
import { SPANS } from './useFinance';
import { progress } from './timeline';

export function TopBar({ summary, range, span, onSpan }) {
  return (
    <header className="flex items-center justify-between md:h-[64px] md:pl-[13px]">
      <div>
        <h1 className="text-[28px] font-medium leading-tight tracking-[-0.01em] md:text-[27px]">{summary.greeting}</h1>
        {range && <p className="mt-[2px] text-[16px] text-[var(--pf-muted)] md:hidden">{range}</p>}
      </div>
      <div className="flex items-center gap-[13px]">
        {range && (
          <label className="pf-sunk relative flex h-[32px] cursor-pointer items-center gap-[5px] rounded-full p-[3px] pr-[9px] max-md:hidden">
            <span className="rounded-full bg-[var(--pf-card)] px-[12px] py-[3px] text-[15px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">{range}</span>
            <ChevronDown size={12} strokeWidth={2.4} />
            <select aria-label="Period" value={span} onChange={(e) => onSpan(Number(e.target.value))} className="absolute inset-0 cursor-pointer opacity-0">
              {SPANS.map((months) => <option key={months} value={months}>Last {months} months</option>)}
            </select>
          </label>
        )}
        {summary.avatar_url && <img src={summary.avatar_url} alt="" className="h-[48px] w-[48px] rounded-full object-cover ring-2 ring-white md:h-[37px] md:w-[37px]" />}
      </div>
    </header>
  );
}

export function Hero({ data, t }) {
  const count = progress(t, 0, 2.8);
  const sign = data.saved < 0 ? '−' : '+';
  return (
    <div data-pf-panel="overview" className="relative h-[190px] overflow-hidden rounded-[24px] md:col-span-3 md:h-[193px] md:rounded-[17px] lg:col-span-1 lg:mr-[4px] lg:h-full">
      {data.summary.hero_image_url && <img src={data.summary.hero_image_url} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_45%]" />}
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_8px_8px_17px_rgba(40,55,35,0.38),inset_-7px_-7px_15px_rgba(255,255,255,0.55)]" />
      <div className="pf-well absolute inset-y-[10px] left-[10px] flex w-[70%] flex-col items-center justify-center rounded-[16px] bg-[color-mix(in_srgb,var(--pf-card)_84%,transparent)] backdrop-blur-[6px] md:inset-y-[9px] md:left-[9px] md:w-[220px] md:rounded-[13px]">
        <span className="text-[44px] font-medium leading-none md:text-[39px]">{money(data.netWorth * count)}</span>
        <span className="pf-label mt-[9px] text-[14px] text-[var(--pf-muted)] md:text-[11px]">Net worth</span>
        <span className="mt-[3px] text-[15px] md:text-[11px]">{sign}{money(Math.abs(data.saved))} ({sign}{Math.abs(data.savedPct).toFixed(1)}%) · {data.span} mo</span>
      </div>
    </div>
  );
}

const figures = (data, t) => {
  const count = progress(t, 0, 2.8);
  return [
    ['Monthly income', \`$\${Math.round(data.summary.monthly_income * count).toLocaleString('en-US')}\`, data.summary.income_note],
    ['Monthly spend', \`$\${Math.round(data.spend * count).toLocaleString('en-US')}\`, data.summary.spend_note],
    ['Savings rate', \`\${(data.savingsRate * count).toFixed(1)}%\`, data.summary.savings_note],
  ];
};

/** Three cards side by side; on a phone, one section of three rows. */
export function Kpis({ data, t }) {
  const rows = figures(data, t);
  return (
    <>
      {rows.map(([label, value, note]) => (
        <div key={label} className="pf-sunk flex min-h-[150px] flex-col rounded-[17px] px-[21px] pb-[19px] pt-[21px] max-md:hidden lg:min-h-0">
          <span className="text-[15px] text-[var(--pf-muted)]">{label}</span>
          <span className="mt-auto text-[29px] font-medium leading-none">{value}</span>
          <span className="mt-[6px] text-[13px] text-[var(--pf-muted)]">{note}</span>
        </div>
      ))}
      <section className="pf-sunk rounded-[24px] px-[20px] py-[6px] md:hidden">
        {rows.map(([label, value, note], i) => (
          <div key={label} className={\`flex items-center justify-between gap-[12px] py-[14px] \${i ? 'border-t border-[color-mix(in_srgb,var(--pf-ink)_8%,transparent)]' : ''}\`}>
            <div>
              <p className="text-[18px] leading-tight">{label}</p>
              <p className="mt-[2px] text-[15px] text-[var(--pf-muted)]">{note}</p>
            </div>
            <span className="text-[30px] font-medium leading-none">{value}</span>
          </div>
        ))}
      </section>
    </>
  );
}
\`\`\`

## src/components/personal-finance/TrendChart.jsx
\`\`\`jsx
import { money, monthShort, monthYear } from './data';
import { easeInOut, progress } from './timeline';

// Desktop draws over the whole section; a phone gets its own narrower canvas under the header.
const WIDE = { w: 705, h: 362, x0: 72, x1: 665, top: 136, bottom: 285, months: 329, grid: 62, label: 21, axis: 15, month: 17, note: 16, tip: [94, 38, 16, 13] };
const PHONE = { w: 320, h: 230, x0: 58, x1: 298, top: 46, bottom: 176, months: 216, grid: 54, label: 0, axis: 15, month: 15, note: 15, tip: [92, 40, 16, 13] };

// The series fills the band, whatever its figures; grid lines sit on round values inside it.
const scaleOf = (values, g) => {
  const [min, max] = [Math.min(...values), Math.max(...values)];
  const span = Math.max(max - min, 1);
  const mag = 10 ** Math.floor(Math.log10(span / 4));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= span / 4);
  const grid = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) grid.push(v);
  return { grid, y: (v) => g.bottom - ((v - min) / span) * (g.bottom - g.top) };
};

// Catmull-Rom through evenly spaced points, as cubic Béziers; with even spacing x runs linearly in t.
const segments = (pts) => pts.slice(0, -1).map((p, i) => {
  const prev = pts[i - 1] ?? [2 * p[0] - pts[i + 1][0], 2 * p[1] - pts[i + 1][1]];
  const next = pts[i + 1];
  const after = pts[i + 2] ?? [2 * next[0] - p[0], 2 * next[1] - p[1]];
  return [p, [p[0] + (next[0] - prev[0]) / 6, p[1] + (next[1] - prev[1]) / 6], [next[0] - (after[0] - p[0]) / 6, next[1] - (after[1] - p[1]) / 6], next];
});
const bezierY = ([a, b, c, d], s) => (1 - s) ** 3 * a[1] + 3 * (1 - s) ** 2 * s * b[1] + 3 * (1 - s) * s ** 2 * c[1] + s ** 3 * d[1];

export default function TrendChart({ trend, saved, span, t, compact }) {
  const g = compact ? PHONE : WIDE;
  const scale = scaleOf(trend.map((m) => m.net_worth), g);
  const { y } = scale;
  const grid = compact ? scale.grid.filter((_, i) => i % 2 === 0) : scale.grid;
  const pts = trend.map((m, i) => [g.x0 + (i / Math.max(trend.length - 1, 1)) * (g.x1 - g.x0), y(m.net_worth)]);
  const segs = segments(pts);
  const path = segs.map(([a, b, c, d], i) => \`\${i ? '' : \`M\${a[0]},\${a[1]}\`}C\${b[0]},\${b[1]} \${c[0]},\${c[1]} \${d[0]},\${d[1]}\`).join('');
  // The line draws left to right; the tooltip rides its tip.
  const reach = progress(t, 0, 3.6, easeInOut) * (pts.length - 1);
  const seg = Math.min(Math.floor(reach), segs.length - 1);
  const tip = [g.x0 + (reach / Math.max(pts.length - 1, 1)) * (g.x1 - g.x0), segs.length ? bezierY(segs[seg], reach - seg) : pts[0][1]];
  const at = trend[Math.round(reach)] ?? trend[0];
  const value = trend[seg] ? trend[seg].net_worth + ((trend[seg + 1]?.net_worth ?? trend[seg].net_worth) - trend[seg].net_worth) * (reach - seg) : (trend[0]?.net_worth ?? 0);
  const last = trend.length - 1;
  const [tipW, tipH, tipValue, tipDate] = g.tip;
  const tipX = Math.min(Math.max(tip[0], g.grid + tipW / 2), g.w - tipW / 2);
  const legend = (
    <div className="flex gap-[20px] text-[15px] md:text-[17px]">
      <span className="flex items-center gap-[7px]"><i className="h-[7px] w-[7px] rounded-full bg-[var(--pf-line)]" />Net worth</span>
      <span className="flex items-center gap-[7px]"><i className="h-[7px] w-[7px] rounded-full bg-[var(--pf-pace)]" />Steady pace</span>
    </div>
  );
  return (
    <section data-pf-panel="trend" className="pf-sunk relative rounded-[24px] p-[20px] md:h-[362px] md:rounded-[20px] md:p-0 lg:h-auto">
      <div className="flex items-start justify-between md:px-[21px] md:pt-[17px]">
        <div>
          <h2 className="text-[24px] font-medium leading-none md:text-[21px]">Net worth trend</h2>
          <p className="mt-[10px] flex items-baseline gap-[10px] md:mt-[13px]">
            <span className="text-[16px] text-[var(--pf-muted)] md:text-[17px]">{span === 12 ? 'Saved this year' : \`Saved in \${span} months\`}</span>
            <span className="text-[22px] font-medium md:text-[23px]">{money(saved * progress(t, 0, 2.8))}</span>
          </p>
        </div>
        {!compact && legend}
      </div>
      {compact && <div className="mt-[10px]">{legend}</div>}
      <svg viewBox={\`0 0 \${g.w} \${g.h}\`} className={compact ? 'mt-[4px] block h-auto w-full overflow-visible' : 'absolute inset-0 h-full w-full overflow-visible'} aria-hidden="true">
        <defs><clipPath id={\`pf-drawn-\${compact ? 'p' : 'w'}\`}><rect x="0" y="0" width={tip[0]} height={g.h} /></clipPath></defs>
        {grid.map((v) => (
          <g key={v}>
            <line x1={g.grid} x2={g.x1 + 13} y1={y(v)} y2={y(v)} stroke="var(--pf-ink)" strokeOpacity="0.06" />
            <text x={g.label} y={y(v)} dominantBaseline="central" fontSize={g.axis} fill="var(--pf-muted)">\${v / 1000}k</text>
          </g>
        ))}
        {pts.length > 1 && <line x1={pts[0][0]} y1={pts[0][1]} x2={pts[last][0]} y2={pts[last][1]} stroke="var(--pf-pace)" strokeWidth="2" strokeLinecap="round" />}
        <path d={path} fill="none" stroke="var(--pf-line)" strokeWidth="2.7" strokeLinecap="round" clipPath={\`url(#pf-drawn-\${compact ? 'p' : 'w'})\`} />
        {trend.map((m, i) => m.note && reach >= i && (
          <g key={m.id} style={{ opacity: Math.min((reach - i) * 2, 1) }}>
            <circle cx={pts[i][0]} cy={pts[i][1]} r="4.5" fill="var(--pf-line)" stroke="white" strokeWidth="1.6" />
            <text x={pts[i][0]} y={pts[i][1] + (m.note_below ? 25 : -17)} textAnchor="middle" fontSize={g.note} fontWeight="500" fill="var(--pf-ink)">{compact ? m.note_short ?? m.note : m.note}</text>
          </g>
        ))}
        <circle cx={tip[0]} cy={tip[1]} r="6" fill="var(--pf-line)" stroke="white" strokeWidth="2" />
        <line x1={tip[0]} x2={tip[0]} y1={tip[1] - 8} y2={tip[1] - 15} stroke="var(--pf-ink)" strokeOpacity="0.4" />
        <g transform={\`translate(\${tipX} \${tip[1] - 15 - tipH / 2})\`}>
          <rect x={-tipW / 2} y={-tipH / 2} width={tipW} height={tipH} rx="5" fill="white" />
          <text y="-4" textAnchor="middle" fontSize={tipValue} fontWeight="500" fill="var(--pf-ink)">{money(value)}</text>
          <text y="12" textAnchor="middle" fontSize={tipDate} fill="var(--pf-muted)">{at && monthYear(at.month)}</text>
        </g>
        {trend.map((m, i) => (!compact || (last - i) % 2 === 0) && (
          <text key={m.id} x={pts[i][0]} y={g.months} textAnchor="middle" fontSize={g.month} fontWeight={i === last ? 600 : 400} fill={i === last ? 'var(--pf-ink)' : 'var(--pf-muted)'}>{monthShort(m.month)}</text>
        ))}
      </svg>
    </section>
  );
}
\`\`\`

## src/components/personal-finance/useFinance.js
\`\`\`js
import { useEffect, useMemo, useState } from 'react';
import { SAMPLE } from './data';
import { loadDashboard, rowsOf } from './loadDashboard';

/** The trend's spans, in months, offered by the range picker. */
export const SPANS = [12, 6, 3];

const summarize = (dashboard, span) => {
  const summary = { monthly_income: 0, ...dashboard };
  const trend = rowsOf(dashboard.months).sort((a, b) => a.month.localeCompare(b.month)).slice(-span);
  const spending = rowsOf(dashboard.spending);
  const netWorth = trend.at(-1)?.net_worth ?? 0;
  const saved = netWorth - (trend[0]?.net_worth ?? 0);
  const spend = spending.reduce((sum, s) => sum + s.amount, 0);
  return {
    summary,
    span,
    trend,
    allocation: rowsOf(dashboard.allocation),
    spending,
    netWorth,
    saved,
    savedPct: trend[0]?.net_worth ? (saved / trend[0].net_worth) * 100 : 0,
    spend,
    savingsRate: summary.monthly_income ? ((summary.monthly_income - spend) / summary.monthly_income) * 100 : 0,
  };
};

export function useFinance(span) {
  const [dashboard, setDashboard] = useState(null);
  useEffect(() => {
    loadDashboard(SAMPLE).then(setDashboard);
  }, []);
  return useMemo(() => dashboard && summarize(dashboard, span), [dashboard, span]);
}
\`\`\`

## src/pages/PersonalFinance.jsx
\`\`\`jsx
import { useState } from 'react';
import '@/components/personal-finance/personal-finance.css';
import { Hero, Kpis, TopBar } from '@/components/personal-finance/TopRow';
import TrendChart from '@/components/personal-finance/TrendChart';
import { Allocation, Spending } from '@/components/personal-finance/SidePanels';
import Nav from '@/components/personal-finance/Nav';
import { useFinance } from '@/components/personal-finance/useFinance';
import { monthYear } from '@/components/personal-finance/data';
import { useCompact, useTimeline } from '@/components/personal-finance/timeline';

// Read-only but for the period picker. On load every figure, the trend, the donut and the bars grow
// from 90% into place, once; on a phone the donut and bars wait until they scroll into view.
export default function PersonalFinance() {
  const [span, setSpan] = useState(12);
  const data = useFinance(span);
  const t = useTimeline();
  const compact = useCompact();
  const range = data?.trend.length ? \`\${monthYear(data.trend[0].month)} – \${monthYear(data.trend.at(-1).month)}\` : null;
  return (
    <div className="pf relative flex min-h-screen flex-col px-[16px] pb-[104px] pt-[20px] md:min-w-[768px] md:py-[27px] md:pl-[41px] md:pr-[47px] lg:h-screen lg:min-h-[720px] lg:overflow-hidden">
      {data && (
        <>
          <TopBar summary={data.summary} span={span} onSpan={setSpan} range={range} />
          <Nav />
          <div className="mt-[14px] grid grid-cols-[minmax(0,1fr)] gap-[14px] lg:flex-1 md:mt-[18px] md:grid-cols-3 md:gap-[16px] md:pl-[74px] lg:min-h-0 lg:grid-cols-[566fr_172fr_172fr_172fr] lg:grid-rows-[193px_1fr] lg:gap-x-[12px] lg:gap-y-[23px]">
            <Hero data={data} t={t} />
            <Kpis data={data} t={t} />
            <div className="grid grid-cols-[minmax(0,1fr)] gap-[14px] md:col-span-3 md:gap-[16px] lg:col-span-4 lg:min-h-0 lg:grid-cols-[705fr_396fr] lg:gap-x-[17px]">
              {data.trend.length ? <TrendChart trend={data.trend} saved={data.saved} span={data.span} t={t} compact={compact} /> : <span />}
              <div className="grid grid-cols-[minmax(0,1fr)] gap-[14px] md:grid-cols-2 md:gap-[16px] lg:min-h-0 lg:grid-cols-1 lg:grid-rows-[200px_1fr] lg:gap-y-[12px]">
                <Allocation allocation={data.allocation} total={data.netWorth} compact={compact} />
                <Spending spending={data.spending} total={data.spend} month={data.trend.at(-1)?.month} compact={compact} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};