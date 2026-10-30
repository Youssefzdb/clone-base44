var e=`# expense_tracker — app files

## base44/entities/BudgetSettings.jsonc
\`\`\`json
{
  "name": "BudgetSettings",
  "type": "object",
  "properties": {
    "monthly_budget": {
      "type": "number",
      "default": 2400
    }
  },
  "required": [
    "monthly_budget"
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

## base44/entities/Expense.jsonc
\`\`\`json
{
  "name": "Expense",
  "type": "object",
  "properties": {
    "merchant": {
      "type": "string"
    },
    "amount": {
      "type": "number"
    },
    "category": {
      "type": "string",
      "enum": [
        "Food",
        "Travel",
        "Shopping",
        "Bills",
        "Transport"
      ]
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "merchant",
    "amount",
    "category",
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

## src/components/expense-tracker/AddExpenseModal.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES, longDate, money, tint, todayIso } from './format';

export default function AddExpenseModal({ onClose, onSave }) {
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(todayIso());
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const value = Number(String(amount).replace(/[$,]/g, ''));
  const valid = merchant.trim() && value > 0 && category;

  // One save at a time: a double click or Enter while it is in flight must not add the expense twice.
  const save = () => {
    if (!valid || saving) return;
    setSaving(true);
    setFailed(false);
    Promise.resolve(onSave({ merchant: merchant.trim(), amount: Math.round(value * 100) / 100, category, date }))
      .catch(() => { setSaving(false); setFailed(true); });
  };

  return (
    <div className="fixed inset-0 z-30 backdrop-blur-[10px]" onClick={onClose}>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.35 }}
        onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.key === 'Enter' && e.target.tagName !== 'BUTTON' && save()}
        className="absolute inset-x-4 top-[170px] mx-auto flex min-h-[380px] max-w-[560px] flex-col border border-[var(--ui-hair)] bg-[var(--ui-bg)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
        <h3 className="text-[22px] font-medium">New expense</h3>
        <div className="mt-6 grid grid-cols-[1fr_minmax(0,180px)] gap-4">
          <label className="block text-[13px] font-medium text-[var(--ui-muted)]">Merchant
            <input autoFocus value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Where did it go?" className="mt-1.5 h-12 w-full bg-[var(--ui-input)] px-3.5 text-base font-medium text-[var(--ui-ink)] outline-none placeholder:text-[var(--ui-faint)]" />
          </label>
          <label className="block text-[13px] font-medium text-[var(--ui-muted)]">Amount
            <input value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} onBlur={() => value > 0 && setAmount(money(value))} placeholder="$0.00" className="mt-1.5 h-12 w-full bg-[var(--ui-input)] px-3.5 text-base font-medium text-[var(--ui-ink)] outline-none placeholder:text-[var(--ui-faint)]" />
          </label>
        </div>
        <div className="mb-2.5 mt-[22px] text-[13px] font-medium text-[var(--ui-muted)]">Category</div>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} style={category === c ? { background: 'var(--ui-ink)', color: 'var(--ui-on-ink)' } : tint(c)}
              className="flex items-center gap-2 py-[5px] pl-[5px] pr-3.5 text-sm font-medium">
              <span className="flex h-[22px] w-[22px] items-center justify-center" style={tint(c)}><CategoryIcon category={c} size={14} /></span>{c}
            </button>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-6">
          <label className="relative cursor-pointer text-sm text-[var(--ui-muted)]">{longDate(date)}
            <input type="date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" />
          </label>
          {failed && <span role="alert" className="text-sm font-medium text-[var(--ui-red)]">Couldn’t save it. Try again.</span>}
          <button type="button" disabled={!valid || saving} onClick={save} className="flex h-11 w-[148px] items-center justify-center bg-[var(--ui-ink)] text-sm font-medium text-[var(--ui-on-ink)] transition-transform active:scale-[0.94] disabled:opacity-40">Save expense</button>
        </div>
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/expense-tracker/CategoryIcon.jsx
\`\`\`jsx
const PATHS = {
  Food: 'M6 3v6a3 3 0 0 0 6 0V3M9 12v9M17 21V3c-2.5 1.6-3.5 4.2-3.5 7.5V14H17',
  Travel: 'M21 3 3 10.5l7 2.5 2.5 7L21 3zM10 13l5-5',
  Shopping: 'M5 8h14l-1 12H6L5 8zM9 8V6.5a3 3 0 0 1 6 0V8',
  Bills: 'M13 2 4.5 13.5H11L10 22l9-12h-6.5L13 2z',
  Transport: 'M5 17v2M19 17v2M4 17h16v-5l-1.8-4.6A1.5 1.5 0 0 0 16.8 6.5H7.2a1.5 1.5 0 0 0-1.4.9L4 12v5zM4 12h16M7.5 14.5h.01M16.5 14.5h.01',
};

export default function CategoryIcon({ category, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">
      <path d={PATHS[category]} />
    </svg>
  );
}
\`\`\`

## src/components/expense-tracker/CategoryTiles.jsx
\`\`\`jsx
import CategoryIcon from './CategoryIcon';
import { money, tint } from './format';

export default function CategoryTiles({ byCategory, selected, onSelect }) {
  const top = Math.max(...byCategory.map((c) => c.total), 1);
  return (
    <div className="grid h-[104px] flex-none grid-cols-5">
      {byCategory.map(({ category, total }) => (
        <button key={category} type="button" onClick={() => onSelect(selected === category ? null : category)} style={tint(category)}
          className={\`relative flex flex-col justify-between px-[18px] py-4 text-left \${selected && selected !== category ? 'opacity-50' : ''}\`}>
          <span className="flex items-center justify-between text-sm font-medium">{category}<CategoryIcon category={category} /></span>
          <span className="text-[26px] tracking-[-0.03em]">{money(total)}</span>
          <span className="absolute inset-x-0 bottom-0 h-[5px] bg-black/[0.12]">
            <span className="block h-full bg-current transition-[width] duration-500" style={{ width: \`\${(total / top) * 100}%\` }} />
          </span>
        </button>
      ))}
    </div>
  );
}
\`\`\`

## src/components/expense-tracker/expense-tracker.css
\`\`\`css
@font-face{font-family:"Neue Haas Unica";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-500-normal.woff2) format("woff2")}

/* The look: five category fills (--swatch-N) with readable text on each (--swatch-N-ink), plus the UI colors. */
:root{
  --swatch-1:#E9CF6A;--swatch-1-ink:#111111;
  --swatch-2:#6F8FCF;--swatch-2-ink:#111111;
  --swatch-3:#E39AB9;--swatch-3-ink:#111111;
  --swatch-4:#E8956E;--swatch-4-ink:#111111;
  --swatch-5:#7FB894;--swatch-5-ink:#111111;
  --ui-ink:#111111;--ui-on-ink:#FFFFFF;--ui-bg:#FFFFFF;--ui-page:#FAFAF9;
  --ui-muted:#6E6E6E;--ui-faint:#9A9A9A;--ui-hair:#E6E6E3;--ui-input:#F1EFE8;--ui-red:#E5261F;
}
/* gallery-look */

.et{font-family:"Neue Haas Unica",system-ui,-apple-system,"Helvetica Neue",sans-serif;color:var(--ui-ink);background:var(--ui-bg);letter-spacing:-0.02em;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
.et *{border-radius:0}
\`\`\`

## src/components/expense-tracker/format.js
\`\`\`js
export const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Transport'];

/** Fill and text colors of a category's swatch. */
export const tint = (category) => {
  const n = CATEGORIES.indexOf(category) + 1;
  return { background: \`var(--swatch-\${n})\`, color: \`var(--swatch-\${n}-ink)\` };
};

export const money = (value) =>
  '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const parse = (iso) => new Date(\`\${iso}T00:00:00\`);
export const shortDate = (iso) => parse(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const longDate = (iso) => parse(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const monthLabel = (month) => parse(\`\${month}-01\`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const localIso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
export const todayIso = () => localIso(new Date());
export const daysAgoIso = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return localIso(d);
};
export const shiftMonth = (month, delta) => {
  const d = parse(\`\${month}-01\`);
  d.setMonth(d.getMonth() + delta);
  return \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}\`;
};
\`\`\`

## src/components/expense-tracker/Header.jsx
\`\`\`jsx
import { useState } from 'react';
import { monthLabel } from './format';

export default function Header({ month, onPrevMonth, onNextMonth, budget, onBudgetChange, onAdd }) {
  const [monthOpen, setMonthOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="relative flex h-[72px] flex-none items-center justify-between border-b border-[var(--ui-hair)] px-6">
      <div className="flex items-center">
        {[0, 1, 2].map((i) => <span key={i} className="mr-2 h-3 w-3 !rounded-full bg-[var(--ui-hair)]" />)}
        <button type="button" onClick={() => setSettingsOpen((open) => !open)} className="ml-2 mr-[18px] text-base font-medium">Ledger</button>
        <button type="button" onClick={() => setMonthOpen((open) => !open)} className="flex h-9 items-center bg-[var(--ui-input)] px-3.5 text-sm font-medium">{monthLabel(month)}</button>
        {monthOpen && (
          <div className="absolute left-[150px] top-[62px] z-20 flex items-center gap-4 border border-[var(--ui-hair)] bg-[var(--ui-bg)] px-4 py-3 text-sm font-medium shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
            <button type="button" onClick={onPrevMonth} aria-label="Previous month">‹</button>
            <span>{monthLabel(month)}</span>
            <button type="button" onClick={onNextMonth} aria-label="Next month">›</button>
          </div>
        )}
        {settingsOpen && (
          <label className="absolute left-[72px] top-[62px] z-20 block w-56 border border-[var(--ui-hair)] bg-[var(--ui-bg)] p-4 text-[13px] font-medium text-[var(--ui-muted)] shadow-[0_24px_60px_rgba(0,0,0,0.10)]">
            Monthly budget
            <input type="number" min="0" defaultValue={budget} onBlur={(e) => onBudgetChange(Number(e.target.value) || budget)} className="mt-1.5 h-10 w-full bg-[var(--ui-input)] px-3 text-base text-[var(--ui-ink)] outline-none" />
          </label>
        )}
      </div>
      <button type="button" onClick={onAdd} className="flex h-10 w-[156px] items-center justify-center gap-2 bg-[var(--ui-ink)] text-sm font-medium text-[var(--ui-on-ink)] transition-transform active:scale-[0.96]">
        <b className="text-xl font-normal leading-none">+</b> Add expense
      </button>
    </header>
  );
}
\`\`\`

## src/components/expense-tracker/Hero.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { money } from './format';

export default function Hero({ total, budget, onBudgetChange }) {
  const [editing, setEditing] = useState(false);
  const pct = budget > 0 ? Math.round((total / budget) * 100) : 0;
  const over = total > budget;

  return (
    <section className="flex h-[168px] flex-none items-end justify-between px-6 pb-7 pt-6">
      <div>
        <div className="mb-1.5 flex items-center gap-2.5 text-xs uppercase tracking-[0.06em] text-[var(--ui-faint)]">
          Spent this month
          {over && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block bg-[var(--ui-red)] px-[9px] py-[3px] text-xs font-medium normal-case tracking-normal text-white">Over budget</motion.span>
          )}
        </div>
        <div className={\`text-[92px] font-light leading-[0.95] tracking-[-0.04em] \${over ? 'text-[var(--ui-red)]' : ''}\`}>{money(total)}</div>
      </div>
      <div className="w-[300px]">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className={\`text-[13px] font-medium \${over ? 'text-[var(--ui-red)]' : ''}\`}>{pct}% of budget</span>
          {editing ? (
            <input autoFocus type="number" min="0" defaultValue={budget} onBlur={(e) => { setEditing(false); onBudgetChange(Number(e.target.value) || budget); }} onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()} className="w-24 bg-[var(--ui-input)] px-2 text-right text-xs outline-none" />
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="text-xs text-[var(--ui-faint)]">Budget {money(budget)}</button>
          )}
        </div>
        <div className="h-1 bg-[var(--ui-hair)]">
          <motion.div animate={{ width: \`\${Math.min(pct, 100)}%\` }} className={\`h-full \${over ? 'bg-[var(--ui-red)]' : 'bg-[var(--ui-ink)]'}\`} />
        </div>
      </div>
    </section>
  );
}
\`\`\`

## src/components/expense-tracker/RecentList.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import CategoryIcon from './CategoryIcon';
import { money, shortDate, tint } from './format';

export default function RecentList({ expenses, onDelete }) {
  return (
    <section className="min-h-0 flex-1 overflow-auto px-6 pt-5">
      <div className="flex h-6 items-baseline justify-between">
        <h2 className="text-base font-medium">Recent</h2>
        <span className="text-sm text-[var(--ui-muted)]">{expenses.length} transactions</span>
      </div>
      <div className="mt-[10px]">
        {expenses.length === 0 && <p className="text-sm text-[var(--ui-muted)]">Nothing here yet.</p>}
        <AnimatePresence initial={false}>
          {expenses.map((e) => (
            <motion.div key={e.id} layout initial={{ opacity: 0, y: -90 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="group mb-2.5 grid h-[52px] grid-cols-[32px_1fr_160px_120px] items-center gap-x-3.5 border-b border-[var(--ui-hair)] px-1.5">
              <span className="flex h-8 w-8 items-center justify-center" style={tint(e.category)}><CategoryIcon category={e.category} /></span>
              <span className="truncate text-base font-medium">{e.merchant}</span>
              <span className="text-sm text-[var(--ui-muted)]">{e.category} · {shortDate(e.date)}</span>
              <span className="flex items-center justify-end gap-3 text-base font-medium">
                <button type="button" onClick={() => window.confirm(\`Delete \${e.merchant}?\`) && onDelete(e.id)} className="text-sm text-[var(--ui-muted)] opacity-0 group-hover:opacity-100">Delete</button>
                {money(e.amount)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
\`\`\`

## src/components/expense-tracker/useExpenseTracker.js
\`\`\`js
import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CATEGORIES, daysAgoIso, shiftMonth, todayIso } from './format';

// 40 sample expenses over the last three weeks ([merchant, category, amount, days ago], oldest first),
// created once for an empty app: $2,225.78 in all, 93% of the default budget.
const SEED = [
  ['Airbnb', 'Travel', 67.76, 20], ['United', 'Travel', 51.15, 20], ['Delta Air Lines', 'Travel', 97.47, 20],
  ['Apple', 'Shopping', 113.88, 20], ['Zara', 'Shopping', 66.19, 20], ['Con Edison', 'Bills', 64.56, 20],
  ['Uber', 'Transport', 26.61, 20], ['Shell', 'Transport', 15.08, 19], ['Trader Joe’s', 'Food', 61.77, 18],
  ['Shell', 'Transport', 26.17, 17], ['Verizon', 'Bills', 34.68, 16], ['Whole Foods', 'Food', 77.67, 15],
  ['Trader Joe’s', 'Food', 64.91, 15], ['Uber', 'Transport', 22.18, 15], ['Airbnb', 'Travel', 132.42, 14],
  ['Uniqlo', 'Shopping', 51.79, 13], ['Spotify', 'Bills', 34.48, 13], ['Lyft', 'Transport', 15.30, 12],
  ['Lyft', 'Transport', 17.49, 12], ['Comcast', 'Bills', 43.50, 11], ['National Grid', 'Bills', 72.73, 9],
  ['Verizon', 'Bills', 50.17, 9], ['Starbucks', 'Food', 48.80, 8], ['Amazon', 'Shopping', 54.01, 8],
  ['Amazon', 'Shopping', 123.75, 7], ['Con Edison', 'Bills', 57.16, 7], ['MTA', 'Transport', 21.05, 6],
  ['Uniqlo', 'Shopping', 45.82, 5], ['Apple', 'Shopping', 67.76, 5], ['Blue Bottle', 'Food', 42.92, 4],
  ['Starbucks', 'Food', 41.83, 4], ['MTA', 'Transport', 29.17, 4], ['Sweetgreen', 'Food', 86.29, 3],
  ['Marriott', 'Travel', 96.16, 3], ['Marriott', 'Travel', 103.44, 3], ['Lyft', 'Transport', 24.95, 3],
  ['Trader Joe’s', 'Food', 54.12, 1], ['Netflix', 'Bills', 15.99, 1], ['Uber', 'Transport', 18.20, 0],
  ['Whole Foods', 'Food', 86.40, 0],
];
// The samples span 20 days; squeeze them into the days this month has had, so the app opens on the
// full $2,225.78 month (in order, newest today) whatever the date.
const SEED_SPAN_DAYS = 20;
const seedExpenses = () => {
  const elapsed = new Date().getDate() - 1;
  return SEED.map(([merchant, category, amount, days]) => ({
    merchant, category, amount, date: daysAgoIso(Math.floor((days * Math.min(elapsed, SEED_SPAN_DAYS)) / SEED_SPAN_DAYS)),
  }));
};

const MONTH_KEY = 'expense-tracker-month';
// By merchant and amount only: a sample's date follows the day it was created, its amount doesn't.
const sampleKey = (e) => \`\${e.merchant}|\${e.amount}\`;
const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));
// Each user's own rows only, filtered on the server: admins can read everyone's (see the entities' rls).
const mineOf = (me) => (Entity, sort, limit) => (me ? Entity.filter({ created_by_id: me.id }, sort, limit) : Entity.list(sort, limit));

// Samples carry \`sample\`, so cleanup never touches an expense the user added. Two first loads at once (a
// preview reload mid-seed, a second tab) can both add them: keep the oldest copy of each and delete the rest.
// Every load before setup runs this, so a failed delete (it throws, leaving the app unset) is retried.
async function reconcileSamples(mine, rows) {
  // Expenses the app didn't mark were added by the builder (or the user): the table isn't ours to seed.
  const missing = rows.some((e) => !e.sample) ? [] : seedExpenses().filter((s) => !rows.some((e) => sampleKey(e) === sampleKey(s)));
  // One request: entity calls are rate-limited per app, so 40 single creates can fail partway.
  if (missing.length) await base44.entities.Expense.bulkCreate(missing.map((s) => ({ ...s, sample: true })));
  const now = missing.length ? await mine(base44.entities.Expense, '-date', 1000) : rows;
  const seen = new Set();
  const extra = now.filter((e) => e.sample).sort(byAge).filter((e) => seen.has(sampleKey(e)) || !seen.add(sampleKey(e)));
  if (extra.length) await base44.entities.Expense.deleteMany({ id: { $in: extra.map((e) => e.id) } });
  return now.filter((e) => !extra.includes(e));
}

export function useExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(null);
  const [month, setMonthState] = useState(() => (typeof localStorage !== 'undefined' && localStorage.getItem(MONTH_KEY)) || todayIso().slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const mine = mineOf(await base44.auth.me().catch(() => null));
        const [saved] = await mine(base44.entities.BudgetSettings);
        let rows = await mine(base44.entities.Expense, '-date', 1000);
        // Not set up yet (or setup was interrupted): add the samples still missing, and only then write the
        // settings row that marks the app set up, so a user who later deletes every expense never gets them back.
        if (!saved) rows = await reconcileSamples(mine, rows);
        setExpenses(rows);
        setSettings(saved ?? (await base44.entities.BudgetSettings.create({ monthly_budget: 2400 })));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setMonth = (next) => { localStorage.setItem(MONTH_KEY, next); setMonthState(next); };

  const monthExpenses = useMemo(
    () => expenses
      .filter((e) => e.date?.startsWith(month))
      .sort((a, b) => b.date.localeCompare(a.date) || (b.created_date ?? '').localeCompare(a.created_date ?? '')),
    [expenses, month],
  );
  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = CATEGORIES.map((category) => ({
    category,
    total: monthExpenses.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0),
  }));

  return {
    loading,
    month,
    prevMonth: () => setMonth(shiftMonth(month, -1)),
    nextMonth: () => setMonth(shiftMonth(month, 1)),
    expenses: monthExpenses,
    total,
    byCategory,
    budget: settings?.monthly_budget ?? 2400,
    setBudget: async (value) => setSettings(await base44.entities.BudgetSettings.update(settings.id, { monthly_budget: value })),
    addExpense: async (expense) => {
      const created = await base44.entities.Expense.create(expense);
      setExpenses((rows) => [created, ...rows]);
    },
    deleteExpense: async (id) => {
      await base44.entities.Expense.delete(id);
      setExpenses((rows) => rows.filter((e) => e.id !== id));
    },
  };
}
\`\`\`

## src/pages/ExpenseTracker.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import '@/components/expense-tracker/expense-tracker.css';
import Header from '@/components/expense-tracker/Header';
import Hero from '@/components/expense-tracker/Hero';
import CategoryTiles from '@/components/expense-tracker/CategoryTiles';
import RecentList from '@/components/expense-tracker/RecentList';
import AddExpenseModal from '@/components/expense-tracker/AddExpenseModal';
import { useExpenseTracker } from '@/components/expense-tracker/useExpenseTracker';

export default function ExpenseTracker() {
  const tracker = useExpenseTracker();
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setAdding(false);
      if (e.key.toLowerCase() === 'n' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) { e.preventDefault(); setAdding(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const shown = filter ? tracker.expenses.filter((e) => e.category === filter) : tracker.expenses;

  return (
    <div className="et flex h-screen min-h-[720px] min-w-[1024px] flex-col overflow-hidden">
      <Header month={tracker.month} onPrevMonth={tracker.prevMonth} onNextMonth={tracker.nextMonth} budget={tracker.budget} onBudgetChange={tracker.setBudget} onAdd={() => setAdding(true)} />
      <Hero total={tracker.total} budget={tracker.budget} onBudgetChange={tracker.setBudget} />
      <CategoryTiles byCategory={tracker.byCategory} selected={filter} onSelect={setFilter} />
      {tracker.loading ? <div className="flex-1" /> : <RecentList expenses={shown} onDelete={tracker.deleteExpense} />}
      {adding && <AddExpenseModal onClose={() => setAdding(false)} onSave={async (expense) => { await tracker.addExpense(expense); setAdding(false); }} />}
    </div>
  );
}
\`\`\`
`;export{e as default};