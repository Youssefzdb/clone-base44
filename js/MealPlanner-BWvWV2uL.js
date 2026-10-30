var e=`# meal_recipe_planner — app files

## base44/entities/MealPlanEntry.jsonc
\`\`\`json
{
  "name": "MealPlanEntry",
  "type": "object",
  "properties": {
    "week_start": {
      "type": "string",
      "format": "date"
    },
    "day": {
      "type": "number",
      "minimum": 0,
      "maximum": 6
    },
    "meal": {
      "type": "string",
      "enum": [
        "breakfast",
        "lunch",
        "dinner"
      ]
    },
    "recipe_id": {
      "type": "string"
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "week_start",
    "day",
    "meal",
    "recipe_id"
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

## base44/entities/PlannerSettings.jsonc
\`\`\`json
{
  "name": "PlannerSettings",
  "type": "object",
  "properties": {
    "seeded": {
      "type": "boolean",
      "description": "Set once the sample recipes, plan and shopping list are saved"
    }
  },
  "required": [
    "seeded"
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

## base44/entities/Recipe.jsonc
\`\`\`json
{
  "name": "Recipe",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "photo_url": {
      "type": "string"
    },
    "prep_minutes": {
      "type": "number"
    },
    "servings": {
      "type": "number"
    },
    "meal_types": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "breakfast",
          "lunch",
          "dinner"
        ]
      }
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "quick",
          "veggie"
        ]
      }
    },
    "ingredients": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "unit": {
            "type": "string"
          }
        },
        "required": [
          "name"
        ]
      }
    },
    "steps": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "name",
    "prep_minutes",
    "ingredients"
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

## base44/entities/ShoppingItem.jsonc
\`\`\`json
{
  "name": "ShoppingItem",
  "type": "object",
  "properties": {
    "week_start": {
      "type": "string",
      "format": "date"
    },
    "name": {
      "type": "string"
    },
    "quantity": {
      "type": "number"
    },
    "unit": {
      "type": "string"
    },
    "source_recipe_id": {
      "type": "string"
    },
    "plan_entry_id": {
      "type": "string"
    },
    "checked": {
      "type": "boolean",
      "default": false
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "week_start",
    "name"
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

## src/components/meal-planner/DesktopPlanner.jsx
\`\`\`jsx
import { AnimatePresence } from 'framer-motion';
import TopBar from './TopBar';
import RecipeRail from './RecipeRail';
import WeekGrid from './WeekGrid';
import RecipeDrawer from './RecipeDrawer';
import ShoppingPanel from './ShoppingPanel';
import RecipePicker from './RecipePicker';
import { DragGhost, FlyCount, Toast } from './Feedback';
import PlannerError from './PlannerError';
import { useFitWidth } from './useFitWidth';

/** The 1280×720 board (zoomed to the window): rail, week grid, and the drawers over it. */
export default function DesktopPlanner({ ui }) {
  const { planner, feedback, drag } = ui;
  const fit = useFitWidth(1280, 720, 13);
  return (
    <div className="mp mp-checker relative flex h-screen w-screen items-center justify-center overflow-hidden">
      {/* The frame is in screen px, so the checker border is the same at every window size; the board scales inside it. */}
      <div className="absolute inset-[13px] rounded-[19px] border-[1.5px] border-[var(--swatch-3)] bg-[var(--swatch-2)]" />
      <div className="relative flex-none overflow-hidden" style={fit}>
        <TopBar week={planner.week} onPrev={planner.prevWeek} onNext={planner.nextWeek} count={ui.count} onOpenList={ui.toggleList} />
        <RecipeRail recipes={ui.shown} query={ui.query} onQuery={ui.setQuery} filter={ui.filter} onFilter={ui.setFilter}
          draggingId={ui.draggingRecipeId} onPress={ui.start} onOpen={ui.openRecipeCard} />
        {!planner.loading && (
          <WeekGrid week={planner.week} entryAt={planner.entryAt} recipeById={planner.recipeById} over={drag?.over}
            draggingEntryId={ui.draggingEntryId} freshId={feedback.freshId} onPress={ui.start}
            onOpen={ui.openTile} onRemove={planner.remove} onPick={ui.pick} />
        )}
        <Toast toast={feedback.toast} />
        <PlannerError planner={planner} />
        <AnimatePresence>{ui.listOpen && <ShoppingPanel {...ui.list} onClose={ui.closeList} />}</AnimatePresence>
        {ui.picker && <RecipePicker {...ui.picker} />}
        <AnimatePresence>{ui.detail && <RecipeDrawer key={ui.detailKey} {...ui.detail} />}</AnimatePresence>
        <DragGhost drag={drag} recipe={ui.dragRecipeId && planner.recipeById.get(ui.dragRecipeId)} zoom={fit.zoom} />
        <FlyCount fly={feedback.fly} zoom={fit.zoom} />
      </div>
    </div>
  );
}
\`\`\`

## src/components/meal-planner/Feedback.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { RecipeCard } from './RecipeRail';

// Both are fixed inside the desktop's zoomed canvas (zoom 1 on phones), where offsets scale by the zoom: pointer and
// rect positions (viewport px) are divided by it to land where they were measured.

/** The card under the pointer while dragging: lifted, tilted, never a drop target itself. */
export function DragGhost({ drag, recipe, zoom = 1, mobile = false }) {
  if (!drag || !recipe) return null;
  return (
    <motion.div initial={{ rotate: 0, scale: 1 }} animate={{ rotate: -3, scale: 1.04 }} transition={{ duration: 0.18 }}
      className="pointer-events-none fixed z-50" style={{ left: (drag.rect.left + drag.dx) / zoom, top: (drag.rect.top + drag.dy) / zoom, width: mobile ? 240 : 245 }}>
      {mobile ? (
        <div className="mp-card mp-lift flex items-center gap-[12px] rounded-[16px] p-[8px]">
          <img src={recipe.photo_url} alt="" className="h-[64px] w-[64px] flex-none rounded-[10px] bg-[var(--ui-photo)] object-cover" />
          <span className="text-[18px] font-bold leading-tight">{recipe.name}</span>
        </div>
      ) : (
        <RecipeCard recipe={recipe} tabIndex={-1} className="mp-lift" />
      )}
    </motion.div>
  );
}

/** "+6" travelling from the planned slot to the shopping-list badge. */
export function FlyCount({ fly, zoom = 1 }) {
  const from = fly && { x: fly.from.x / zoom, y: fly.from.y / zoom };
  const to = fly && { x: fly.to.x / zoom, y: fly.to.y / zoom };
  return (
    <AnimatePresence>
      {fly && (
        <motion.span key={fly.id} initial={{ x: from.x, y: from.y, scale: 0.6, opacity: 0 }}
          animate={{ x: [from.x, from.x + 10, to.x], y: [from.y, from.y - 40, to.y], scale: [0.6, 1.1, 0.9], opacity: [0, 1, 1] }}
          exit={{ opacity: 0 }} transition={{ duration: 1, ease: 'easeInOut', times: [0, 0.25, 1] }}
          className="pointer-events-none fixed left-0 top-0 z-40 flex h-[20px] items-center rounded-full bg-[var(--swatch-3)] px-[7px] text-[11px] font-bold text-[var(--swatch-3-ink)]">
          +{fly.count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Toast({ toast, mobile = false }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div key={toast.id} initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
          role="status" className={\`mp-lift z-30 bg-[var(--swatch-3)] text-[var(--swatch-3-ink)] \${mobile ? 'fixed inset-x-[20px] top-[76px] rounded-[14px] px-[16px] py-[12px]' : 'absolute right-[27px] top-[62px] w-[240px] rounded-[10px] px-[13px] py-[9px]'}\`}>
          <div className={\`font-bold leading-tight \${mobile ? 'text-[17px]' : 'text-[12.5px]'}\`}>{toast.title}</div>
          <div className={\`mt-[2px] leading-tight opacity-90 \${mobile ? 'text-[16px]' : 'text-[10px]'}\`}>{toast.detail}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

## src/components/meal-planner/format.js
\`\`\`js
const parse = (iso) => new Date(\`\${iso}T00:00:00\`);
const iso = (d) => \`\${d.getFullYear()}-\${String(d.getMonth() + 1).padStart(2, '0')}-\${String(d.getDate()).padStart(2, '0')}\`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmt = (d, options) => d.toLocaleDateString('en-US', options);

export const MEALS = ['breakfast', 'lunch', 'dinner'];
export const FILTERS = ['All', 'Quick', 'Veggie', 'Dinner'];

export const weekStartOf = (date) => iso(addDays(date, -((date.getDay() + 6) % 7)));
export const shiftWeek = (week, n) => iso(addDays(parse(week), 7 * n));
export const weekDays = (week) => Array.from({ length: 7 }, (_, i) => addDays(parse(week), i));
export const weekLabel = (week) => \`\${fmt(parse(week), { month: 'short', day: 'numeric' })} – \${fmt(addDays(parse(week), 6), { month: 'short', day: 'numeric' })}\`;
export const dayNumber = (d) => d.getDate();
export const weekdayName = (d) => fmt(d, { weekday: 'long' });
const dayOf = (week, day) => addDays(parse(week), day);

export const slotKey = (day, meal) => \`\${day}-\${meal}\`;
export const parseSlot = (key) => {
  const [day, meal] = key.split('-');
  return { day: Number(day), meal };
};
/** "Tue dinner" */
export const slotLabel = (week, day, meal) => \`\${fmt(dayOf(week, day), { weekday: 'short' })} \${meal}\`;
/** "Tue 29 · Dinner" */
export const slotTitle = (week, day, meal) => \`\${fmt(dayOf(week, day), { weekday: 'short' })} \${dayOf(week, day).getDate()} · \${meal[0].toUpperCase()}\${meal.slice(1)}\`;

const qty = (n) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100));
/** "600 g", "4" */
export const amount = ({ quantity, unit }) => [quantity ? qty(quantity) : '', unit].filter(Boolean).join(' ');

export const matchesFilter = (recipe, filter, query) =>
  recipe.name.toLowerCase().includes(query.trim().toLowerCase()) &&
  (filter === 'All' ||
    (filter === 'Quick' && recipe.prep_minutes < 20) ||
    (filter === 'Veggie' && recipe.tags?.includes('veggie')) ||
    (filter === 'Dinner' && recipe.meal_types?.includes('dinner')));

/** Shopping rows combined by name, quantities added per unit ("5 cloves", "1 kg + 2"). Checked only when all are. */
export const combineItems = (items) => {
  const groups = new Map();
  items.forEach((item) => {
    const group = groups.get(item.name) ?? { name: item.name, ids: [], units: new Map(), checked: true };
    group.ids.push(item.id);
    group.units.set(item.unit ?? '', (group.units.get(item.unit ?? '') ?? 0) + (Number(item.quantity) || 0));
    group.checked = group.checked && item.checked;
    groups.set(item.name, group);
  });
  return [...groups.values()]
    .map((g) => ({ ...g, amount: [...g.units].map(([unit, quantity]) => amount({ quantity, unit })).filter(Boolean).join(' + ') }))
    .sort((a, b) => a.checked - b.checked || a.name.localeCompare(b.name));
};

/** The badge: names still to buy. */
export const toBuyCount = (items) => combineItems(items).filter((g) => !g.checked).length;
\`\`\`

## src/components/meal-planner/Icons.jsx
\`\`\`jsx
const Svg = ({ size, children, width = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" className="flex-none" aria-hidden="true">{children}</svg>
);

export const ClockIcon = ({ size = 12 }) => (
  <Svg size={size}><rect x="2" y="2.5" width="12" height="12" rx="4" /><path d="M8 2.5v3" /></Svg>
);

export const BagIcon = ({ size = 15 }) => (
  <Svg size={size} width={1.3}><path d="M2 4v6.5A3.5 3.5 0 0 0 5.5 14h5a3.5 3.5 0 0 0 3.5-3.5V4" /></Svg>
);

export const RingIcon = ({ size = 11 }) => (
  <Svg size={size} width={1.3}><circle cx="8" cy="8" r="6" /></Svg>
);

export const CheckIcon = ({ size = 10 }) => (
  <Svg size={size} width={2.4}><path d="m3.5 8.5 3 3 6-7" /></Svg>
);

/** Recipe name and prep time, as on rail cards, tiles and the drag ghost. */
export const RecipeMeta = ({ recipe, className = '' }) => (
  <span className={\`block min-w-0 \${className}\`}>
    <span className="block text-[12.5px] font-bold leading-[1.12] tracking-[-0.025em]">{recipe.name}</span>
    <span className="mt-[5px] flex items-center gap-[5px] text-[11px] text-[var(--ui-muted)]">
      <span className="text-[var(--swatch-3)]"><ClockIcon /></span>{recipe.prep_minutes} min
    </span>
  </span>
);
\`\`\`

## src/components/meal-planner/meal-planner.css
\`\`\`css
/* Stand-ins for the design's Shrikhand / Archivo / DM Mono: swap a src (or add a face) to use the originals. */
@font-face{font-family:"Sprig Display";font-weight:700;font-style:italic;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-700-italic.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-500-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Unica";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-unica-700-normal.woff2) format("woff2")}

/* The look: ink, cream page, the accent and its light tint (--swatch-N), plus the fixed UI colors. */
:root{
  --swatch-1:#2B1A12;--swatch-1-ink:#FFFFFF;
  --swatch-2:#FCF9F2;--swatch-2-ink:#111111;
  --swatch-3:#E8322B;--swatch-3-ink:#FFFFFF;
  --swatch-4:#F2A79E;--swatch-4-ink:#111111;
  --ui-card:#FFFEFB;--ui-photo:#F4EDE1;--ui-muted:#6B4A36;
}
/* gallery-look */

.mp{font-family:"Archivo","Neue Haas Unica",system-ui,-apple-system,"Helvetica Neue",sans-serif;color:var(--swatch-1);-webkit-font-smoothing:antialiased;user-select:none}
.mp-display{font-family:"Sprig Display",system-ui,sans-serif;font-weight:700;font-style:italic;letter-spacing:-0.025em}
.mp-mono{font-family:"DM Mono",ui-monospace,"SF Mono",Menlo,Consolas,monospace}
.mp-checker{background:repeating-conic-gradient(var(--swatch-3) 0 25%,var(--swatch-2) 0 50%) 0 0/25.4px 25.4px}
.mp-card{background:var(--ui-card);border:1.5px solid var(--swatch-3)}
.mp-empty{border:1.5px dashed var(--swatch-4);color:var(--swatch-4)}
.mp-over{border:1.5px solid var(--swatch-3);background:color-mix(in srgb,var(--swatch-4) 28%,var(--swatch-2));color:var(--swatch-3)}
.mp-dim{background:color-mix(in srgb,var(--swatch-1) 24%,transparent)}
.mp-lift{box-shadow:0 14px 30px color-mix(in srgb,var(--swatch-1) 22%,transparent)}
.mp-scroll{scrollbar-width:none}
.mp-scroll::-webkit-scrollbar{display:none}
\`\`\`

## src/components/meal-planner/MobileDayPlan.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { ClockIcon } from './Icons';
import { MEALS, slotKey } from './format';

function DayCard({ ui, entry, recipe, over }) {
  const fresh = entry.id === ui.feedback.freshId;
  const armed = ui.armed === entry.id;
  return (
    <motion.div initial={fresh ? { scale: 0.9 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 16 }}
      className={\`relative h-full \${ui.draggingEntryId === entry.id ? 'opacity-40' : ''}\`}>
      <button type="button" onPointerDown={(e) => ui.start(e, { kind: 'entry', entry })} onClick={() => ui.tapTile(entry)}
        onContextMenu={(e) => e.preventDefault()}
        className="mp-card flex h-full w-full touch-pan-y items-center gap-[14px] overflow-hidden rounded-[18px] pr-[52px] text-left">
        <img src={recipe.photo_url} alt="" draggable={false} className="h-full w-[104px] flex-none bg-[var(--ui-photo)] object-cover" />
        <span className="min-w-0">
          <span className="block text-[22px] font-bold leading-[1.1] tracking-[-0.01em]">{recipe.name}</span>
          <span className="mt-[6px] flex items-center gap-[6px] text-[16px] text-[var(--ui-muted)]"><span className="text-[var(--swatch-3)]"><ClockIcon size={16} /></span>{recipe.prep_minutes} min</span>
        </span>
      </button>
      {over && <span className="mp-over pointer-events-none absolute inset-0 rounded-[18px] opacity-60" />}
      {armed && (
        <button type="button" aria-label={\`Remove \${recipe.name}\`} onClick={() => { ui.disarm(); ui.planner.remove(entry); }}
          className="absolute right-[6px] top-1/2 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center rounded-full bg-[var(--swatch-3)] text-[22px] leading-none text-[var(--swatch-3-ink)]">×</button>
      )}
    </motion.div>
  );
}

/** One day: a card per meal, each a drop target; an empty one opens the picker. */
export default function MobileDayPlan({ ui, day, date }) {
  const { planner, drag } = ui;
  return (
    <>
      <h2 className="mp-display text-[28px] leading-none text-[var(--swatch-3)]">{date.toLocaleDateString('en-US', { weekday: 'long' })} {date.getDate()}</h2>
      {MEALS.map((meal) => {
        const slot = slotKey(day, meal);
        const entry = planner.entryAt(day, meal);
        const recipe = entry && planner.recipeById.get(entry.recipe_id);
        const over = drag?.over === slot && ui.draggingEntryId !== entry?.id;
        return (
          <section key={meal} className="mt-[18px]">
            <h3 className="mp-mono mb-[8px] text-[20px] uppercase tracking-[0.04em]">{meal}</h3>
            <div data-slot={slot} className="h-[104px]">
              {recipe ? <DayCard ui={ui} entry={entry} recipe={recipe} over={over} /> : (
                <button type="button" aria-label={\`Plan \${meal}\`} onClick={() => ui.pick(day, meal)}
                  className={\`flex h-full w-full items-center justify-center gap-[12px] rounded-[18px] \${over ? 'mp-over' : 'mp-empty'}\`}>
                  <span className="text-[40px] font-light leading-none">+</span>
                  {over && <span className="mp-mono text-[16px] font-bold uppercase tracking-[0.04em]">Drop to plan</span>}
                </button>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
\`\`\`

## src/components/meal-planner/MobileDock.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, RingIcon } from './Icons';
import { FILTERS } from './format';

function DockCard({ ui, recipe, wide }) {
  return (
    <button type="button" onPointerDown={(e) => ui.start(e, { kind: 'recipe', recipeId: recipe.id })} onClick={() => ui.openRecipeCard(recipe)}
      onContextMenu={(e) => e.preventDefault()}
      className={\`mp-card flex flex-none flex-col overflow-hidden rounded-[16px] text-left \${wide ? 'w-full touch-pan-y' : 'w-[148px] touch-pan-x'} \${ui.draggingRecipeId === recipe.id ? 'opacity-40' : ''}\`}>
      <img src={recipe.photo_url} alt="" draggable={false} className="h-[80px] w-full flex-none bg-[var(--ui-photo)] object-cover" />
      <span className="px-[10px] pb-[10px] pt-[8px]">
        <span className="line-clamp-2 block text-[16px] font-bold leading-tight">{recipe.name}</span>
        <span className="mt-[4px] flex items-center gap-[5px] text-[16px] text-[var(--ui-muted)]"><span className="text-[var(--swatch-3)]"><ClockIcon size={15} /></span>{recipe.prep_minutes} min</span>
      </span>
    </button>
  );
}

/** Docked at the bottom: a row of recipes to drag up into the day; drag the handle up for the full browser with search. */
export default function MobileDock({ ui }) {
  const [expanded, setExpanded] = useState(false);
  const pull = useRef(null);
  const pulled = useRef(false);
  const onHandleUp = (e) => {
    const dy = pull.current === null ? 0 : e.clientY - pull.current;
    pull.current = null;
    pulled.current = Math.abs(dy) >= 8;
    if (pulled.current) setExpanded(dy < 0);
  };

  return (
    <motion.section aria-label="Recipes" initial={false} animate={{ height: expanded ? 'calc(100% - 56px)' : 272 }} transition={{ type: 'tween', duration: 0.3 }}
      className="mp-lift absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-[22px] border-t-2 border-[var(--swatch-3)] bg-[var(--ui-card)]">
      <button type="button" aria-label={expanded ? 'Collapse recipes' : 'Expand recipes'} aria-expanded={expanded}
        onPointerDown={(e) => { pull.current = e.clientY; }} onPointerUp={onHandleUp}
        onClick={() => { if (!pulled.current) setExpanded((v) => !v); pulled.current = false; }}
        className="flex h-[28px] flex-none touch-none items-center justify-center">
        <span className="h-[5px] w-[44px] rounded-full bg-[var(--swatch-4)]" />
      </button>
      <div className="flex flex-none items-center justify-between px-[16px]">
        <h2 className="mp-display text-[26px] leading-none text-[var(--swatch-3)]">Recipes</h2>
      </div>
      {expanded && (
        <label className="mx-[16px] mt-[12px] flex h-[44px] flex-none items-center gap-[8px] rounded-full border-[1.5px] border-[var(--swatch-3)] px-[14px] text-[var(--swatch-3)]">
          <RingIcon size={16} />
          <input value={ui.query} onChange={(e) => ui.setQuery(e.target.value)} placeholder="Search recipes" aria-label="Search recipes"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-[var(--swatch-1)] outline-none placeholder:text-[var(--ui-muted)]" />
        </label>
      )}
      <div className="mp-scroll mt-[10px] flex flex-none gap-[6px] overflow-x-auto px-[16px]">
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => ui.setFilter(f)} aria-pressed={ui.filter === f}
            className={\`mp-mono h-[44px] flex-none rounded-full border-[1.5px] border-[var(--swatch-3)] px-[14px] text-[16px] font-bold uppercase \${ui.filter === f ? 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]' : 'text-[var(--swatch-3)]'}\`}>{f}</button>
        ))}
      </div>
      <div className={\`mp-scroll mt-[12px] min-h-0 flex-1 gap-[10px] px-[16px] pb-[14px] \${expanded ? 'grid auto-rows-max grid-cols-2 content-start overflow-y-auto' : 'flex overflow-x-auto'}\`}>
        {ui.shown.map((r) => <DockCard key={r.id} ui={ui} recipe={r} wide={expanded} />)}
        {ui.shown.length === 0 && <p className="text-[16px] text-[var(--ui-muted)]">No recipes match.</p>}
      </div>
    </motion.section>
  );
}
\`\`\`

## src/components/meal-planner/MobilePlanner.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Badge } from './TopBar';
import MobileDayPlan from './MobileDayPlan';
import MobileDock from './MobileDock';
import RecipeDetail from './RecipeDetail';
import ShoppingPanel from './ShoppingPanel';
import RecipePicker from './RecipePicker';
import Sheet from './Sheet';
import { DragGhost, FlyCount, Toast } from './Feedback';
import PlannerError from './PlannerError';
import { weekDays, weekLabel, weekStartOf } from './format';

const Arrow = ({ label, onClick, children }) => (
  <button type="button" aria-label={label} onClick={onClick}
    className="flex h-[44px] w-[44px] items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-1)] text-[18px] leading-none active:scale-90">{children}</button>
);

/** Phones and small tablets: one day at a time, a docked recipe drawer, and bottom sheets. */
export default function MobilePlanner({ ui }) {
  const { planner, feedback } = ui;
  const thisWeek = weekStartOf(new Date());
  const [day, setDay] = useState(() => (planner.week === thisWeek ? (new Date().getDay() + 6) % 7 : 0));
  const swipe = useRef(null);
  const days = weekDays(planner.week);

  const onSwipeEnd = (e) => {
    const from = swipe.current;
    swipe.current = null;
    if (!from || ui.drag) return;
    const dx = e.clientX - from.x;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(e.clientY - from.y)) setDay((d) => Math.min(6, Math.max(0, d + (dx < 0 ? 1 : -1))));
  };

  return (
    <div className="mp mp-checker fixed inset-0 p-[10px]">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[20px] border-2 border-[var(--swatch-3)] bg-[var(--swatch-2)]">
        <header className="flex flex-none items-center justify-between px-[16px] pt-[12px]">
          <span className="mp-display text-[34px] leading-none text-[var(--swatch-3)]">Sprig</span>
          <button type="button" onClick={ui.toggleList} aria-label="Shopping list"
            className="flex h-[44px] items-center gap-[8px] rounded-full border-[1.5px] border-[var(--swatch-3)] pl-[16px] pr-[5px]">
            <span className="mp-mono text-[16px] uppercase tracking-[0.04em]">List</span>
            <Badge count={ui.count} className="h-[34px] min-w-[34px] px-[8px] text-[16px]" />
          </button>
        </header>
        <div className="mt-[8px] flex flex-none items-center justify-center gap-[12px]">
          <Arrow label="Previous week" onClick={() => { planner.prevWeek(); setDay(0); }}>‹</Arrow>
          <span className="mp-display min-w-[150px] whitespace-nowrap text-center text-[21px] leading-none text-[var(--swatch-3)] [word-spacing:0.12em]">{weekLabel(planner.week)}</span>
          <Arrow label="Next week" onClick={() => { planner.nextWeek(); setDay(0); }}>›</Arrow>
        </div>
        <nav aria-label="Days" className="mt-[10px] grid flex-none grid-cols-7 gap-[5px] px-[12px]">
          {days.map((date, i) => (
            <button key={i} type="button" onClick={() => setDay(i)} aria-pressed={day === i}
              className={\`flex h-[64px] flex-col items-center justify-center rounded-[16px] border-[1.5px] border-[var(--swatch-3)] \${day === i ? 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]' : 'text-[var(--swatch-3)]'}\`}>
              <span className="mp-display text-[22px] leading-none">{date.getDate()}</span>
              <span className={\`mp-mono mt-[3px] text-[16px] uppercase leading-none \${day === i ? '' : 'text-[var(--swatch-1)]'}\`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            </button>
          ))}
        </nav>
        <div className="mp-scroll min-h-0 flex-1 touch-pan-y overflow-y-auto px-[16px] pb-[288px] pt-[16px]"
          onPointerDown={(e) => { swipe.current = { x: e.clientX, y: e.clientY }; }} onPointerUp={onSwipeEnd} onPointerCancel={() => { swipe.current = null; }}>
          {!planner.loading && <MobileDayPlan ui={ui} day={day} date={days[day]} />}
        </div>
        <MobileDock ui={ui} />
      </div>
      <Toast toast={feedback.toast} mobile />
      <PlannerError planner={planner} mobile />
      <AnimatePresence>{ui.listOpen && <ShoppingPanel {...ui.list} mobile onClose={ui.closeList} />}</AnimatePresence>
      <AnimatePresence>{ui.picker && <RecipePicker {...ui.picker} mobile />}</AnimatePresence>
      <AnimatePresence>
        {ui.detail && <Sheet key={ui.detailKey} label={ui.detail.recipe.name} onClose={ui.detail.onClose}><RecipeDetail {...ui.detail} mobile /></Sheet>}
      </AnimatePresence>
      <DragGhost drag={ui.drag} recipe={ui.dragRecipeId && planner.recipeById.get(ui.dragRecipeId)} mobile />
      <FlyCount fly={feedback.fly} />
    </div>
  );
}
\`\`\`

## src/components/meal-planner/PlannerError.jsx
\`\`\`jsx
/** A failed load (with a retry, in place of the plan) or a failed save (a dismissible banner). */
export default function PlannerError({ planner, mobile = false }) {
  if (!planner.failed) return null;
  const load = planner.failed === 'load';
  return (
    <div role="alert" className={\`mp-lift z-50 flex items-center gap-[10px] bg-[var(--swatch-1)] text-[var(--swatch-1-ink)] \${mobile ? 'fixed inset-x-[20px] top-[76px] rounded-[14px] px-[16px] py-[12px] text-[16px]' : 'absolute left-1/2 top-[62px] -translate-x-1/2 rounded-[10px] px-[13px] py-[9px] text-[12.5px]'}\`}>
      <span className="font-bold leading-tight">{load ? 'Couldn’t load your planner.' : 'Couldn’t save that change.'}</span>
      <button type="button" onClick={load ? planner.retry : planner.dismissError}
        className={\`flex-none rounded-full bg-[var(--swatch-3)] px-[12px] font-bold text-[var(--swatch-3-ink)] \${mobile ? 'h-[36px]' : 'h-[26px]'}\`}>
        {load ? 'Try again' : 'OK'}
      </button>
    </div>
  );
}
\`\`\`

## src/components/meal-planner/RecipeDetail.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from './Icons';
import { amount } from './format';

// Desktop sizes follow the clip (1280-wide); phones keep every text at 16px or more.
const SIZE = {
  desktop: { context: 'text-[13px]', close: 'h-[29px] w-[29px] text-[13px]', hero: 'mt-[17px] h-[164px]', title: 'mt-[19px] text-[29px]', tag: 'h-[22px] px-[9px] text-[10px]', head: 'text-[20px]', note: 'text-[8.5px]', row: 'text-[12px]', qty: 'text-[9px]', box: 'h-[13px] w-[13px]', step: 'py-[9px] text-[11.5px]', num: 'h-[21px] w-[21px] text-[10px]', action: 'mt-[40px] h-[34px] text-[11px]' },
  mobile: { context: 'text-[16px]', close: 'h-[44px] w-[44px] text-[18px]', hero: 'mt-[14px] h-[190px]', title: 'mt-[18px] text-[30px]', tag: 'h-[32px] px-[12px] text-[16px]', head: 'text-[24px]', note: 'text-[16px]', row: 'text-[16px]', qty: 'text-[16px]', box: 'h-[20px] w-[20px]', step: 'py-[12px] text-[16px]', num: 'h-[30px] w-[30px] text-[16px]', action: 'mt-[16px] h-[48px] text-[16px]' },
};

const Tag = ({ filled, size, children }) => (
  <span className={\`mp-mono flex items-center rounded-full border-[1.5px] border-[var(--swatch-3)] uppercase tracking-[0.04em] \${size} \${filled ? 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]' : 'text-[var(--swatch-3)]'}\`}>{children}</span>
);

/**
 * The recipe: ticks for a planned meal mean "on the shopping list", for a rail recipe a plain checklist.
 * \`planned\` drives the closing button: "Add to week" or "Remove from week".
 */
export default function RecipeDetail({ recipe, context, onList, onToggle, planned, onAdd, onRemove, onClose, mobile = false }) {
  const s = SIZE[mobile ? 'mobile' : 'desktop'];
  const [ticked, setTicked] = useState([]);
  const opening = useRef(true);
  useEffect(() => { const t = setTimeout(() => { opening.current = false; }, 1600); return () => clearTimeout(t); }, []);
  const listed = Boolean(onList);
  const isTicked = (ing) => (listed ? onList.includes(ing.name) : ticked.includes(ing.name));
  const toggle = (ing) => (listed ? onToggle(ing, !isTicked(ing)) : setTicked((t) => (t.includes(ing.name) ? t.filter((n) => n !== ing.name) : [...t, ing.name])));
  const allOnList = listed && recipe.ingredients.every(isTicked);

  return (
    <>
      <div className="flex items-center justify-between">
        <span className={\`mp-mono uppercase tracking-[0.04em] text-[var(--swatch-3)] \${s.context}\`}>Recipe{context ? \` · \${context}\` : ''}</span>
        <button type="button" aria-label="Close" onClick={onClose}
          className={\`flex flex-none items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-3)] text-[var(--swatch-3)] \${s.close}\`}>×</button>
      </div>
      <img src={recipe.photo_url} alt={recipe.name} className={\`w-full rounded-[12px] border-[1.5px] border-[var(--swatch-3)] bg-[var(--ui-photo)] object-cover \${s.hero}\`} />
      <h2 className={\`mp-display leading-none text-[var(--swatch-3)] \${s.title}\`}>{recipe.name}</h2>
      <div className="mt-[16px] flex flex-wrap gap-[6px]">
        <Tag filled size={s.tag}>{recipe.prep_minutes} min</Tag><Tag size={s.tag}>Serves {recipe.servings}</Tag><Tag size={s.tag}>{recipe.meal_types?.[0]}</Tag>
      </div>
      <section className="mt-[15px] rounded-[12px] bg-[var(--swatch-3)] px-[17px] pb-[16px] pt-[14px] text-[var(--swatch-3-ink)]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h3 className={\`mp-display leading-none text-[var(--swatch-3-ink)] \${s.head}\`}>Ingredients</h3>
          {allOnList && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: opening.current ? 1.1 : 0 }} className={\`mp-mono uppercase tracking-[0.04em] \${s.note}\`}>✓ On your shopping list</motion.span>}
        </div>
        <div className="mt-[12px] grid grid-cols-2 gap-x-[27px] gap-y-[11px] max-[429px]:grid-cols-1">
          {recipe.ingredients.map((ing, i) => (
            <button key={ing.name} type="button" role="checkbox" aria-checked={isTicked(ing)} onClick={() => toggle(ing)} className={\`flex items-center gap-[9px] text-left \${mobile ? 'min-h-[44px]' : ''}\`}>
              <span className={\`flex flex-none items-center justify-center rounded-[3px] border-[1.5px] border-current \${s.box}\`}>
                {isTicked(ing) && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: opening.current ? 1.1 + i * 0.07 : 0, type: 'spring', stiffness: 500, damping: 22 }}
                    className={\`flex items-center justify-center rounded-[3px] bg-[var(--swatch-3-ink)] text-[var(--swatch-3)] \${s.box}\`}><CheckIcon size={mobile ? 13 : 9} /></motion.span>
                )}
              </span>
              <span className={\`flex-1 truncate font-bold \${s.row}\`}>{ing.name}</span>
              <span className={\`mp-mono font-bold \${s.qty}\`}>{amount(ing)}</span>
            </button>
          ))}
        </div>
      </section>
      <h3 className={\`mp-display mt-[17px] leading-none text-[var(--swatch-3)] \${s.head}\`}>Steps</h3>
      <ol className="mp-card mt-[12px] rounded-[12px] px-[15px] py-[4px]">
        {recipe.steps.map((step, i) => (
          <motion.li key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.2, duration: 0.3 }}
            className={\`flex items-center gap-[11px] border-b border-[color:var(--swatch-4)] last:border-b-0 \${s.step}\`}>
            <span className={\`flex flex-none items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-3)] text-[var(--swatch-3)] \${s.num}\`}>{i + 1}</span>
            {step}
          </motion.li>
        ))}
      </ol>
      <button type="button" onClick={planned ? onRemove : onAdd} disabled={!planned && !onAdd}
        className={\`mp-mono w-full rounded-full border-[1.5px] border-[var(--swatch-3)] font-bold uppercase tracking-[0.04em] disabled:opacity-40 \${s.action} \${planned ? 'text-[var(--swatch-3)]' : 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]'}\`}>
        {planned ? 'Remove from week' : 'Add to week'}
      </button>
    </>
  );
}
\`\`\`

## src/components/meal-planner/RecipeDrawer.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import RecipeDetail from './RecipeDetail';

/** Desktop: the recipe slides in from the right over a dimmed page. */
export default function RecipeDrawer({ onClose, ...detail }) {
  return (
    <>
      <motion.div className="mp-dim absolute inset-0 z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside role="dialog" aria-label={detail.recipe.name} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="mp-scroll absolute bottom-0 right-0 top-0 z-30 w-[505px] overflow-y-auto border-l-[1.5px] border-[var(--swatch-3)] bg-[var(--swatch-2)] px-[22px] pb-[22px] pt-[17px]">
        <RecipeDetail {...detail} onClose={onClose} />
      </motion.aside>
    </>
  );
}
\`\`\`

## src/components/meal-planner/RecipePicker.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Sheet from './Sheet';

function Choices({ title, meal, recipes, onPick, onClose, mobile }) {
  const forMeal = recipes.filter((r) => r.meal_types?.includes(meal));
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className={\`mp-display leading-none text-[var(--swatch-3)] \${mobile ? 'text-[26px]' : 'text-[24px]'}\`}>Plan {title}</h2>
        <button type="button" aria-label="Close" onClick={onClose}
          className={\`flex flex-none items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-3)] text-[var(--swatch-3)] \${mobile ? 'h-[44px] w-[44px] text-[18px]' : 'h-[27px] w-[27px] text-[13px]'}\`}>×</button>
      </div>
      <div className={\`mp-scroll mt-[14px] grid min-h-0 overflow-y-auto \${mobile ? 'grid-cols-1 gap-[10px]' : 'grid-cols-3 gap-[8px]'}\`}>
        {(forMeal.length ? forMeal : recipes).map((r) => (
          <button key={r.id} type="button" onClick={() => onPick(r)}
            className={\`flex items-center rounded-[10px] border-[1.5px] border-[var(--swatch-4)] text-left hover:border-[var(--swatch-3)] \${mobile ? 'gap-[12px] p-[8px]' : 'gap-[8px] p-[5px]'}\`}>
            <img src={r.photo_url} alt="" className={\`flex-none rounded-[6px] bg-[var(--ui-photo)] object-cover \${mobile ? 'h-[64px] w-[64px]' : 'h-[38px] w-[38px]'}\`} />
            <span className="min-w-0">
              <span className={\`block truncate font-medium \${mobile ? 'text-[18px]' : 'text-[12px]'}\`}>{r.name}</span>
              <span className={\`block text-[var(--ui-muted)] \${mobile ? 'text-[16px]' : 'text-[10px]'}\`}>{r.prep_minutes} min</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

/** Opened by an empty slot's "+": the recipes for that meal (all of them if none is tagged for it). */
export default function RecipePicker({ mobile = false, ...props }) {
  if (mobile) return <Sheet label={\`Plan \${props.title}\`} onClose={props.onClose}><Choices {...props} mobile /></Sheet>;
  return (
    <div className="mp-dim absolute inset-0 z-30" onClick={props.onClose}>
      <motion.div role="dialog" aria-label={\`Plan \${props.title}\`} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', duration: 0.35, bounce: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="mp-card mp-lift absolute left-[calc(50%-290px)] top-[110px] flex max-h-[500px] w-[580px] flex-col rounded-[16px] p-[18px]">
        <Choices {...props} />
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/meal-planner/RecipeRail.jsx
\`\`\`jsx
import { RecipeMeta, RingIcon } from './Icons';
import { FILTERS } from './format';

export function RecipeCard({ recipe, faded = false, className = '', ...props }) {
  return (
    <button type="button" {...props}
      className={\`mp-card flex h-[82px] w-[245px] flex-none touch-none items-center gap-[12px] rounded-[12px] p-[8px] text-left transition-opacity \${faded ? 'opacity-40' : ''} \${className}\`}>
      <img src={recipe.photo_url} alt="" draggable={false} className="h-[65px] w-[65px] flex-none rounded-[8px] bg-[var(--ui-photo)] object-cover" />
      <RecipeMeta recipe={recipe} />
    </button>
  );
}

export default function RecipeRail({ recipes, query, onQuery, filter, onFilter, draggingId, onPress, onOpen }) {
  return (
    <aside className="mp-card absolute left-[27px] top-[83px] flex h-[calc(612px_+_var(--fit-extra,0px))] w-[266px] flex-col rounded-[13px] px-[12px] pt-[20px]">
      <h2 className="mp-display text-[var(--swatch-3)] ml-[2px] text-[25px] leading-none">Recipes</h2>
      <label className="mt-[21px] flex h-[22px] items-center gap-[6px] rounded-full border-[1.5px] border-[var(--swatch-3)] px-[9px] text-[var(--swatch-3)]">
        <RingIcon />
        <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Search recipes" aria-label="Search recipes"
          className="min-w-0 flex-1 bg-transparent text-[11.5px] text-[var(--swatch-1)] outline-none placeholder:text-[var(--ui-muted)]" />
      </label>
      <div className="mt-[11px] flex gap-[6px]">
        {FILTERS.map((f) => (
          <button key={f} type="button" onClick={() => onFilter(f)}
            className={\`mp-mono uppercase tracking-[0.04em] h-[22px] rounded-full border-[1.5px] border-[var(--swatch-3)] px-[9px] text-[9px] font-bold \${filter === f ? 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]' : 'text-[var(--swatch-3)]'}\`}>
            {f}
          </button>
        ))}
      </div>
      <div className="mp-scroll -mx-[12px] mb-[19px] mt-[17px] flex min-h-0 flex-1 flex-col gap-[10px] overflow-y-auto px-[12px]">
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} faded={draggingId === r.id}
            onPointerDown={(e) => onPress(e, { kind: 'recipe', recipeId: r.id })} onClick={() => onOpen(r)} />
        ))}
        {recipes.length === 0 && <p className="px-[4px] pt-[6px] text-[12px] text-[var(--ui-muted)]">No recipes match.</p>}
      </div>
    </aside>
  );
}
\`\`\`

## src/components/meal-planner/recipes.js
\`\`\`js
// Every photo lives here: the designer's set on media.base44.com, one per recipe.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/meal-recipe-planner';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

// [name, photo file, minutes, servings, meal types, tags, 'name|qty|unit' ingredients, steps]
const RAW = [
  ['Shakshuka', 'Shakshuka', 30, 2, ['breakfast', 'lunch'], ['veggie'],
    ['Eggs|4', 'Crushed tomatoes|400|g', 'Red pepper|1', 'Onion|1', 'Garlic|2|cloves', 'Feta|60|g'],
    ['Soften onion and pepper in olive oil.', 'Add garlic, cumin and paprika; cook 1 min.', 'Pour in tomatoes and simmer 10 min.', 'Crack in the eggs, cover and cook until just set.', 'Crumble over feta and serve with bread.']],
  ['Basil Pesto Pasta', 'Basil-Pesto-Pasta', 20, 4, ['lunch', 'dinner'], ['veggie'],
    ['Farfalle|400|g', 'Fresh basil|2|bunches', 'Pine nuts|40|g', 'Parmesan|60|g', 'Cherry tomatoes|250|g', 'Garlic|1|clove'],
    ['Cook the pasta in salted water.', 'Blitz basil, pine nuts, parmesan, garlic and oil.', 'Halve the tomatoes.', 'Toss pasta with pesto and tomatoes; loosen with pasta water.']],
  ['Lemon Herb Salmon', 'Lemon-Herb-Salmon', 25, 4, ['dinner'], [],
    ['Salmon fillets|4', 'Lemons|2', 'Fresh dill|1|bunch', 'Garlic|3|cloves', 'Baby potatoes|600|g', 'Green beans|300|g'],
    ['Heat oven to 200°C. Halve the potatoes.', 'Roast potatoes with olive oil for 15 min.', 'Add salmon and beans; top with lemon, garlic and dill.', 'Roast 10–12 min more, until salmon flakes.']],
  ['Veggie Stir-fry', 'Veggie-Stir-fry', 15, 2, ['lunch', 'dinner'], ['quick', 'veggie'],
    ['Jasmine rice|200|g', 'Broccoli|1|head', 'Carrots|2', 'Snap peas|150|g', 'Soy sauce|3|tbsp', 'Ginger|1|thumb'],
    ['Cook the rice.', 'Stir-fry broccoli, carrots and peas over high heat.', 'Add ginger and soy sauce.', 'Toss through the rice and serve.']],
  ['Berry Smoothie Bowl', 'Berry-Smoothie-Bowl', 10, 1, ['breakfast'], ['quick', 'veggie'],
    ['Frozen berries|200|g', 'Banana|1', 'Greek yogurt|150|g', 'Granola|40|g', 'Honey|1|tbsp'],
    ['Blend berries, banana and yogurt until thick.', 'Spoon into a bowl.', 'Top with granola and sliced fruit.', 'Drizzle with honey.']],
  ['Chickpea Curry', 'Chickpea-Curry', 35, 4, ['dinner'], ['veggie'],
    ['Chickpeas|2|cans', 'Coconut milk|400|ml', 'Spinach|100|g', 'Onion|1', 'Curry paste|3|tbsp', 'Basmati rice|300|g'],
    ['Soften the onion, then fry the curry paste.', 'Add chickpeas and coconut milk; simmer 15 min.', 'Stir in spinach until wilted.', 'Serve over rice.']],
  ['Chicken Caesar', 'Chicken-Caesar', 20, 2, ['lunch'], [],
    ['Chicken breasts|2', 'Romaine|1|head', 'Parmesan|40|g', 'Sourdough|2|slices', 'Caesar dressing|4|tbsp'],
    ['Season and pan-fry the chicken, then slice.', 'Toast cubed sourdough into croutons.', 'Toss romaine with dressing.', 'Top with chicken, croutons and parmesan.']],
  ['Overnight Oats', 'Overnight-Oats', 5, 1, ['breakfast'], ['quick', 'veggie'],
    ['Rolled oats|60|g', 'Milk|150|ml', 'Chia seeds|1|tbsp', 'Blueberries|80|g', 'Kiwi|1', 'Maple syrup|1|tbsp'],
    ['Stir oats, milk, chia and maple together.', 'Cover and chill overnight.', 'Top with berries and sliced kiwi.', 'Loosen with a splash of milk.']],
  ['Greek Salad', 'Greek-Salad', 15, 2, ['lunch'], ['quick', 'veggie'],
    ['Cucumber|1', 'Tomatoes|4', 'Red onion|1', 'Feta|150|g', 'Kalamata olives|80|g', 'Oregano|1|tsp'],
    ['Chop cucumber and tomatoes into chunks.', 'Thinly slice the red onion.', 'Add olives and a slab of feta.', 'Dress with olive oil and oregano.']],
  ['Chicken Tikka', 'Chicken-Tikka', 40, 4, ['dinner'], [],
    ['Chicken thighs|600|g', 'Yogurt|200|g', 'Tikka spice|2|tbsp', 'Chopped tomatoes|400|g', 'Cream|100|ml', 'Garlic|3|cloves'],
    ['Marinate chicken in yogurt and spice.', 'Sear the chicken until charred.', 'Simmer tomatoes, garlic and spice 10 min.', 'Add chicken and cream; cook 10 min more.']],
  ['Avocado Toast', 'Avocado-Toast', 10, 1, ['breakfast'], ['quick', 'veggie'],
    ['Sourdough|2|slices', 'Avocado|1', 'Eggs|2', 'Lime|1', 'Chili flakes|1|pinch'],
    ['Toast the sourdough.', 'Soft-boil the eggs for 6½ min.', 'Mash avocado with lime and salt.', 'Spread, top with eggs and chili.']],
  ['Tomato Soup', 'Tomato-Soup', 30, 4, ['lunch'], ['veggie'],
    ['Plum tomatoes|1|kg', 'Onion|1', 'Garlic|2|cloves', 'Vegetable stock|500|ml', 'Basil|1|bunch', 'Cream|50|ml'],
    ['Soften onion and garlic.', 'Add tomatoes and stock; simmer 20 min.', 'Blend until smooth with basil.', 'Swirl in cream to serve.']],
  ['Blueberry Pancakes', 'Blueberry-Pancakes', 20, 4, ['breakfast'], ['veggie'],
    ['Flour|200|g', 'Milk|250|ml', 'Eggs|2', 'Blueberries|150|g', 'Butter|30|g', 'Maple syrup|4|tbsp'],
    ['Whisk flour, milk, eggs and melted butter.', 'Fold in the blueberries.', 'Cook ladlefuls in a hot pan, 2 min a side.', 'Stack and pour over maple syrup.']],
  ['Mushroom Risotto', 'Mushroom-Risotto', 45, 4, ['dinner'], ['veggie'],
    ['Arborio rice|300|g', 'Mushrooms|400|g', 'Shallots|2', 'White wine|150|ml', 'Vegetable stock|1|l', 'Parmesan|60|g'],
    ['Fry mushrooms until golden; set aside.', 'Soften shallots, add rice and toast 1 min.', 'Add wine, then stock a ladle at a time.', 'Stir in mushrooms, butter and parmesan.']],
  ['Falafel Wrap', 'Falafel-Wrap', 25, 2, ['lunch'], ['veggie'],
    ['Falafel|8', 'Flatbreads|2', 'Hummus|100|g', 'Cucumber|1', 'Red cabbage|100|g', 'Tahini|2|tbsp'],
    ['Warm the falafel in the oven.', 'Shred cabbage and slice cucumber.', 'Spread flatbreads with hummus.', 'Fill, drizzle with tahini and roll.']],
  ['Beef Tacos', 'Beef-Tacos', 30, 4, ['dinner'], [],
    ['Ground beef|500|g', 'Corn tortillas|8', 'Taco spice|2|tbsp', 'Avocado|1', 'Lime|2', 'Cilantro|1|bunch'],
    ['Brown the beef with taco spice.', 'Warm the tortillas in a dry pan.', 'Slice avocado and chop cilantro.', 'Fill tortillas; squeeze over lime.']],
  ['BBQ Chicken Pizza', 'BBQ-Chicken-Pizza', 35, 4, ['dinner'], [],
    ['Pizza dough|500|g', 'Chicken breast|1', 'BBQ sauce|6|tbsp', 'Mozzarella|200|g', 'Red onion|1', 'Cilantro|1|bunch'],
    ['Heat oven to 240°C.', 'Stretch dough and spread with BBQ sauce.', 'Top with chicken, onion and mozzarella.', 'Bake 12 min; finish with cilantro.']],
  ['Chicken Alfredo Bake', 'Chicken-Alfredo-Bake', 40, 4, ['lunch', 'dinner'], [],
    ['Penne|400|g', 'Chicken breasts|2', 'Cream|300|ml', 'Parmesan|80|g', 'Garlic|2|cloves', 'Parsley|1|bunch'],
    ['Cook penne 2 min short of al dente.', 'Pan-fry the chicken and slice.', 'Simmer cream, garlic and parmesan.', 'Combine, top with cheese and bake 20 min.']],
  ['Spaghetti & Meatballs', 'Spaghetti-and-Meatballs', 45, 4, ['dinner'], [],
    ['Spaghetti|400|g', 'Ground beef|500|g', 'Breadcrumbs|50|g', 'Passata|700|g', 'Egg|1', 'Parmesan|40|g'],
    ['Mix beef, breadcrumbs and egg; roll meatballs.', 'Brown the meatballs all over.', 'Simmer in passata for 20 min.', 'Toss with spaghetti and parmesan.']],
];

export const SEED_RECIPES = RAW.map(([name, id, prep_minutes, servings, meal_types, tags, ingredients, steps]) => ({
  name, photo_url: photo(id), prep_minutes, servings, meal_types, tags, steps,
  ingredients: ingredients.map((row) => {
    const [n, quantity, unit = ''] = row.split('|');
    return { name: n, quantity: Number(quantity), unit };
  }),
}));

// The current week as first planned: 12 meals, Tuesday dinner left free.
export const SEED_PLAN = [
  [0, 'breakfast', 'Overnight Oats'], [1, 'breakfast', 'Avocado Toast'], [2, 'breakfast', 'Blueberry Pancakes'],
  [0, 'lunch', 'Greek Salad'], [1, 'lunch', 'Tomato Soup'], [3, 'lunch', 'Falafel Wrap'], [4, 'lunch', 'Chicken Alfredo Bake'],
  [0, 'dinner', 'Chicken Tikka'], [2, 'dinner', 'Mushroom Risotto'], [3, 'dinner', 'Beef Tacos'],
  [4, 'dinner', 'BBQ Chicken Pizza'], [5, 'dinner', 'Spaghetti & Meatballs'],
];

// What the first week still has to buy (all else is checked off): 23 on the list. Garlic is bought,
// so planning Lemon Herb Salmon adds six names to it.
export const SEED_TO_BUY = [
  'Blueberries', 'Kiwi', 'Avocado', 'Lime', 'Cucumber', 'Tomatoes', 'Red onion', 'Feta', 'Plum tomatoes', 'Basil', 'Cream', 'Falafel',
  'Flatbreads', 'Red cabbage', 'Chicken breasts', 'Parsley', 'Chicken thighs', 'Yogurt', 'Mushrooms', 'Ground beef', 'Corn tortillas', 'Cilantro', 'Mozzarella',
];
\`\`\`

## src/components/meal-planner/seed.js
\`\`\`js
import { base44 } from '@/api/base44Client';
import { SEED_PLAN, SEED_RECIPES, SEED_TO_BUY } from './recipes';
import { weekStartOf } from './format';

const { Recipe, MealPlanEntry, ShoppingItem, PlannerSettings } = base44.entities;
const ORDER = SEED_RECIPES.map((r) => r.name);
const byOrder = (a, b) => ((ORDER.indexOf(a.name) + 1 || 999) - (ORDER.indexOf(b.name) + 1 || 999)) || (a.created_date ?? '').localeCompare(b.created_date ?? '');
// Shown oldest first (the lists load newest first); ids break ties within one bulk create.
const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));
const slotOf = (e) => \`\${e.week_start}|\${e.day}|\${e.meal}\`;
const sampled = (row) => ({ ...row, sample: true });

// One request per table: entity calls are rate-limited per app, so a seed of single creates fails partway.
export const createAll = async (Entity, rows) => (rows.length ? Entity.bulkCreate(rows) : []);

// Each row belongs to one planned meal (plan_entry_id), so a recipe planned twice keeps two sets.
export const itemsFor = (entry, recipe, checked = () => false) =>
  recipe.ingredients.map((ing) => ({
    week_start: entry.week_start, name: ing.name, quantity: ing.quantity, unit: ing.unit,
    source_recipe_id: recipe.id, plan_entry_id: entry.id, checked: checked(ing.name),
  }));

// Each user's own rows only, filtered on the server: admins can read everyone's (see the entities' rls).
const mineOf = (me) => (Entity, sort, limit) => (me ? Entity.filter({ created_by_id: me.id }, sort, limit) : Entity.list(sort, limit));
// Newest first, so the caps drop the oldest weeks, never the current one.
const readAll = (mine) => Promise.all([mine(Recipe, 'created_date', 500), mine(MealPlanEntry, '-created_date', 1000), mine(ShoppingItem, '-created_date', 5000)]);

// Every marked copy after the oldest of its key.
const duplicates = (rows, key) => {
  const seen = new Set();
  return rows.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(key(r)) || !seen.add(key(r)));
};

// Two first loads at once (a reload mid-seed, a second tab) can both add the samples: keep the oldest copy
// of each and drop the rest, with the plan entries of dropped recipes and the items of dropped entries.
async function dropDuplicateSamples(recipes, entries, items) {
  const goneRecipes = duplicates(recipes, (r) => r.name);
  const onGone = new Set(goneRecipes.map((r) => r.id));
  const goneEntries = [...entries.filter((e) => onGone.has(e.recipe_id)), ...duplicates(entries.filter((e) => !onGone.has(e.recipe_id)), slotOf)];
  const ofGone = new Set(goneEntries.map((e) => e.id));
  const goneItems = [...items.filter((i) => ofGone.has(i.plan_entry_id)), ...duplicates(items.filter((i) => !ofGone.has(i.plan_entry_id)), (i) => \`\${i.plan_entry_id}|\${i.name}\`)];
  // One request per table: a delete per row overruns the per-app delete limit.
  const drop = (Entity, gone) => gone.length && Entity.deleteMany({ id: { $in: gone.map((r) => r.id) } });
  const done = await Promise.allSettled([drop(Recipe, goneRecipes), drop(MealPlanEntry, goneEntries), drop(ShoppingItem, goneItems)]);
  const kept = (rows, gone, i) => (done[i].status === 'fulfilled' ? rows.filter((r) => !gone.includes(r)) : rows);
  return [kept(recipes, goneRecipes, 0), kept(entries, goneEntries, 1), kept(items, goneItems, 2), done.every((d) => d.status === 'fulfilled')];
}

// The first plan, created once: the settings row that marks the app set up is written only after the
// recipes, the plan and its shopping rows, so a reload mid-seed resumes and later edits never bring samples back.
export async function seed() {
  const mine = mineOf(await base44.auth.me().catch(() => null));
  const [settings] = await mine(PlannerSettings);
  let [recipes, entries, items] = await readAll(mine);
  if (!settings) {
    // Only while not set up, so a sample the user deleted later stays deleted. Recipes the app didn't mark were added
    // by the builder (or the user): then the recipes, and the plan built on them, aren't ours to seed.
    const missing = recipes.some((r) => !r.sample) ? [] : SEED_RECIPES.filter((s) => !recipes.some((r) => r.name === s.name));
    recipes = [...recipes, ...(await createAll(Recipe, missing.map(sampled)))];
    const week = weekStartOf(new Date());
    const plan = SEED_PLAN.map(([day, meal, name]) => ({ week_start: week, day, meal, recipe: recipes.find((r) => r.sample && r.name === name) })).filter((p) => p.recipe);
    // A slot the user already filled keeps their meal.
    const free = plan.filter((p) => !entries.some((e) => slotOf(e) === slotOf(p)));
    entries = [...entries, ...(await createAll(MealPlanEntry, free.map((p) => sampled({ week_start: week, day: p.day, meal: p.meal, recipe_id: p.recipe.id }))))];
    // Everything checked off but SEED_TO_BUY: 23 names on the list.
    const rows = plan.flatMap((p) => {
      const entry = entries.find((e) => e.sample && slotOf(e) === slotOf(p));
      return !entry || items.some((i) => i.plan_entry_id === entry.id) ? [] : itemsFor(entry, p.recipe, (n) => !SEED_TO_BUY.includes(n)).map(sampled);
    });
    await createAll(ShoppingItem, rows);
    let clean;
    [recipes, entries, items, clean] = await dropDuplicateSamples(...(await readAll(mine)));
    if (clean) await PlannerSettings.create({ seeded: true }); // a failed cleanup retries on the next load
  }
  return { recipes: recipes.sort(byOrder), entries: entries.sort(byAge), items: items.sort(byAge) };
}
\`\`\`

## src/components/meal-planner/Sheet.jsx
\`\`\`jsx
import { motion, useDragControls } from 'framer-motion';

/** Phone bottom sheet: slides up, grab handle on top (drag it down to close), content scrolls inside. */
export default function Sheet({ label, full = false, onClose, children }) {
  const controls = useDragControls();
  return (
    <>
      <motion.div className="mp-dim fixed inset-0 z-30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div role="dialog" aria-label={label} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        drag="y" dragListener={false} dragControls={controls} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
        className={\`fixed inset-x-0 bottom-0 z-40 flex flex-col rounded-t-[24px] border-t-2 border-[var(--swatch-3)] bg-[var(--swatch-2)] \${full ? 'top-[16px]' : 'max-h-[85%]'}\`}>
        <div onPointerDown={(e) => controls.start(e)} className="flex h-[28px] flex-none touch-none items-center justify-center" aria-hidden="true">
          <span className="h-[5px] w-[44px] rounded-full bg-[var(--swatch-4)]" />
        </div>
        <div className="mp-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-[18px] pb-[20px]">{children}</div>
      </motion.div>
    </>
  );
}
\`\`\`

## src/components/meal-planner/ShoppingPanel.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { CheckIcon } from './Icons';
import Sheet from './Sheet';
import { combineItems } from './format';

function ShoppingList({ items, count, onToggle, onClear, mobile }) {
  const rows = combineItems(items);
  const anyChecked = rows.some((r) => r.checked);
  return (
    <>
      <div className={\`flex items-baseline justify-between \${mobile ? 'pb-[12px] pt-[4px]' : 'px-[16px] pb-[10px] pt-[14px]'}\`}>
        <h2 className={\`mp-display leading-none text-[var(--swatch-3)] \${mobile ? 'text-[28px]' : 'text-[22px]'}\`}>Shopping list</h2>
        <span className={\`mp-mono uppercase tracking-[0.04em] text-[var(--ui-muted)] \${mobile ? 'text-[16px]' : 'text-[10px]'}\`}>{count} to buy</span>
      </div>
      <div className={\`mp-scroll min-h-0 flex-1 overflow-y-auto \${mobile ? '' : 'px-[8px]'}\`}>
        {rows.length === 0 && <p className={\`px-[8px] py-[10px] text-[var(--ui-muted)] \${mobile ? 'text-[16px]' : 'text-[12px]'}\`}>Plan a meal to fill your list.</p>}
        {rows.map((row) => (
          <button key={row.name} type="button" role="checkbox" aria-checked={row.checked} onClick={() => onToggle(row.ids, !row.checked)}
            className={\`flex w-full items-center rounded-[8px] px-[8px] text-left \${mobile ? 'min-h-[48px] gap-[12px]' : 'gap-[9px] py-[6px]'}\`}>
            <span className={\`flex flex-none items-center justify-center rounded-[3px] border-[1.5px] border-[var(--swatch-3)] \${mobile ? 'h-[20px] w-[20px]' : 'h-[14px] w-[14px]'} \${row.checked ? 'bg-[var(--swatch-3)] text-[var(--swatch-3-ink)]' : ''}\`}>
              {row.checked && <CheckIcon size={mobile ? 13 : 9} />}
            </span>
            <span className={\`flex-1 truncate font-medium \${mobile ? 'text-[17px]' : 'text-[12.5px]'} \${row.checked ? 'text-[var(--ui-muted)] line-through' : ''}\`}>{row.name}</span>
            <span className={\`mp-mono text-[var(--ui-muted)] \${mobile ? 'text-[16px]' : 'text-[9.5px]'}\`}>{row.amount}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={onClear} disabled={!anyChecked}
        className={\`mp-mono flex-none self-end rounded-full border-[1.5px] border-[var(--swatch-3)] font-bold uppercase tracking-[0.04em] text-[var(--swatch-3)] disabled:opacity-40 \${mobile ? 'mt-[12px] h-[44px] px-[18px] text-[16px]' : 'mx-[16px] mt-[8px] h-[26px] px-[12px] text-[9.5px]'}\`}>
        Clear checked
      </button>
    </>
  );
}

/** Desktop: a panel under the pill. Phone: a full-height bottom sheet. */
export default function ShoppingPanel({ mobile = false, onClose, ...list }) {
  if (mobile) return <Sheet label="Shopping list" full onClose={onClose}><ShoppingList {...list} mobile /></Sheet>;
  return (
    <>
      <div className="absolute inset-0 z-20" onClick={onClose} />
      <motion.div role="dialog" aria-label="Shopping list" initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8 }}
        className="mp-card mp-lift absolute right-[27px] top-[66px] z-30 flex max-h-[600px] w-[300px] flex-col rounded-[13px] pb-[12px]">
        <ShoppingList {...list} />
      </motion.div>
    </>
  );
}
\`\`\`

## src/components/meal-planner/TopBar.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BagIcon } from './Icons';
import { weekLabel } from './format';

const Arrow = ({ label, onClick, children }) => (
  <button type="button" aria-label={label} onClick={onClick}
    className="flex h-[29px] w-[29px] items-center justify-center rounded-full border-[1.5px] border-[var(--swatch-1)] text-[13px] leading-none transition-transform active:scale-90">
    {children}
  </button>
);

/** The shopping-list count: bumps when it changes, not when it first appears. */
export function Badge({ count, className = '' }) {
  const seen = useRef(null);
  const bump = seen.current !== null && seen.current !== count;
  useEffect(() => { if (count !== null) seen.current = count; });
  return (
    <motion.span key={count} data-badge initial={bump ? { scale: 1.35 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      className={\`flex items-center justify-center rounded-full bg-[var(--swatch-3)] font-bold text-[var(--swatch-3-ink)] \${className}\`}>
      {count ?? ''}
    </motion.span>
  );
}

export default function TopBar({ week, onPrev, onNext, count, onOpenList }) {
  return (
    <>
      <div className="mp-display text-[var(--swatch-3)] absolute left-[42px] top-[19px] text-[37px] leading-none">Sprig</div>
      <div className="absolute left-[384px] top-[25px] flex items-center gap-[11px]">
        <Arrow label="Previous week" onClick={onPrev}>‹</Arrow>
        <span className="mp-display text-[var(--swatch-3)] whitespace-nowrap text-[21px] leading-none [word-spacing:0.12em]">{weekLabel(week)}</span>
        <Arrow label="Next week" onClick={onNext}>›</Arrow>
      </div>
      <button type="button" onClick={onOpenList}
        className="absolute left-[1071px] top-[21px] flex h-[38px] w-[166px] items-center rounded-full border-[1.5px] border-[var(--swatch-3)] pl-[14px] pr-[4px]">
        <BagIcon />
        <span className="mp-mono uppercase ml-[9px] flex-1 text-left text-[10.5px] tracking-[0.05em]">Shopping list</span>
        <Badge count={count} className="h-[28px] min-w-[28px] px-[6px] text-[13px]" />
      </button>
    </>
  );
}
\`\`\`

## src/components/meal-planner/useDrag.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const slotAt = (x, y) => document.elementFromPoint(x, y)?.closest('[data-slot]')?.dataset.slot ?? null;
const HOLD_MS = 300;

/**
 * Pointer drag of recipe cards and planned tiles onto \`[data-slot]\` targets. A mouse drags once it
 * travels; a finger has to hold still for 300ms first (moving earlier scrolls instead). A hold that
 * is released without moving calls \`onHold\`. \`wasDrag()\` lets the following click tell them apart.
 */
export function useDrag(onDrop, onHold) {
  const [drag, setDrag] = useState(null);
  const dragged = useRef(false);
  const lifted = useRef(false);

  // Once a finger has lifted a card, the page must not scroll under it.
  useEffect(() => {
    const block = (e) => lifted.current && e.cancelable && e.preventDefault();
    window.addEventListener('touchmove', block, { passive: false });
    return () => window.removeEventListener('touchmove', block);
  }, []);

  const start = (event, payload) => {
    if (event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const from = { x: event.clientX, y: event.clientY };
    const touch = event.pointerType === 'touch';
    let active = false;
    let moved = false;
    let held = !touch;
    dragged.current = false;
    const show = (x, y) => setDrag({ payload, rect, dx: x - from.x, dy: y - from.y, over: slotAt(x, y) });
    const timer = touch && setTimeout(() => {
      held = true;
      lifted.current = true;
      dragged.current = true;
      navigator.vibrate?.(10);
      show(from.x, from.y);
    }, HOLD_MS);
    const move = (e) => {
      const far = Math.hypot(e.clientX - from.x, e.clientY - from.y) >= 6;
      if (!held) { if (far) end(); return; }
      if (!active && !far) return;
      active = moved = true;
      dragged.current = true;
      show(e.clientX, e.clientY);
    };
    const up = (e) => {
      const wasHeld = touch && held;
      end();
      if (!active && !wasHeld) return;
      setTimeout(() => { dragged.current = false; }, 0);
      setDrag(null);
      const over = moved && slotAt(e.clientX, e.clientY);
      if (over) onDrop(payload, over);
      else if (!moved && wasHeld) onHold?.(payload);
    };
    const end = () => {
      clearTimeout(timer);
      lifted.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
    const cancel = () => { end(); setDrag(null); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
  };

  const wasDrag = () => {
    const was = dragged.current;
    dragged.current = false;
    return was;
  };

  return { drag, start, wasDrag };
}
\`\`\`

## src/components/meal-planner/useFitWidth.js
\`\`\`js
import { useEffect, useState } from 'react';

/**
 * A fixed canvas laid out for \`width\`×\`height\`, scaled uniformly (CSS zoom) rather than reflowed, keeping its
 * positions and drag targets intact. Its area inside a \`frame\` margin is fitted to the window inside the same
 * margin in screen px, so a frame drawn around it stays the same size at every window size. A window taller than
 * the board's proportions stretches the canvas down to fill it; \`--fit-extra\` is the added height, for the parts
 * that grow with it. Returns the style for its root.
 */
export function useFitWidth(width, height = 720, frame = 0) {
  const [[w, h], setView] = useState(() => (typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight]));
  useEffect(() => {
    const onResize = () => setView([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const fit = Math.min((w - 2 * frame) / (width - 2 * frame), (h - 2 * frame) / (height - 2 * frame));
  const tall = Math.max(height, (h - 2 * frame) / fit + 2 * frame);
  return { zoom: fit, width, height: tall, '--fit-extra': \`\${tall - height}px\` };
}
\`\`\`

## src/components/meal-planner/useMealPlanner.js
\`\`\`js
import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MEALS, shiftWeek, toBuyCount, weekStartOf } from './format';
import { createAll, itemsFor, seed } from './seed';

const { MealPlanEntry, ShoppingItem } = base44.entities;
const WEEK_KEY = 'meal-planner-week';
// Storage can be blocked (private mode, sandboxed frames): the week then just isn't remembered.
const storedWeek = () => { try { return localStorage.getItem(WEEK_KEY); } catch { return null; } };
const storeWeek = (week) => { try { localStorage.setItem(WEEK_KEY, week); } catch { /* not remembered */ } };

export function useMealPlanner() {
  const [recipes, setRecipes] = useState([]);
  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState([]);
  const [week, setWeekState] = useState(() => storedWeek() || weekStartOf(new Date()));
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(null); // 'load' | 'save'

  const load = () => {
    setFailed(null);
    setLoading(true);
    seed()
      .then((data) => { setRecipes(data.recipes); setEntries(data.entries); setItems(data.items); })
      .catch((err) => { console.error('Meal planner: could not load', err); setFailed('load'); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // The actions await the server before changing the screen, so a failed one leaves it as saved: say so.
  const reported = (fn) => (...args) => fn(...args).catch((err) => { console.error('Meal planner: could not save', err); setFailed('save'); });

  const setWeek = (next) => { storeWeek(next); setWeekState(next); };
  const recipeById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);
  const weekEntries = entries.filter((e) => e.week_start === week);
  const weekItems = items.filter((i) => i.week_start === week);
  const entryAt = (day, meal) => weekEntries.find((e) => e.day === day && e.meal === meal);

  const rowsOf = (entry) => items.filter((i) => i.plan_entry_id === entry.id);

  const removeEntry = async (entry) => {
    const own = rowsOf(entry);
    // One step at a time, each shown once saved: a failure midway leaves the screen as the server has it.
    if (own.length) await ShoppingItem.deleteMany({ plan_entry_id: entry.id });
    setItems((list) => list.filter((i) => !own.includes(i)));
    await MealPlanEntry.delete(entry.id);
    setEntries((list) => list.filter((e) => e.id !== entry.id));
  };

  const plan = reported(async (recipeId, day, meal) => {
    const taken = entryAt(day, meal);
    if (taken) await removeEntry(taken);
    const recipe = recipeById.get(recipeId);
    const entry = await MealPlanEntry.create({ week_start: week, day, meal, recipe_id: recipeId });
    let rows;
    // Shown with its ingredients, so it can't be removed while they are still saving (it would orphan them).
    try { rows = await createAll(ShoppingItem, itemsFor(entry, recipe)); } finally {
      setEntries((list) => [...list, entry]);
      if (rows) setItems((list) => [...list, ...rows]);
    }
    const kept = taken ? weekItems.filter((i) => !rowsOf(taken).includes(i)) : weekItems;
    return { entry, count: rows.length, added: toBuyCount([...kept, ...rows]) - toBuyCount(weekItems) };
  });

  /** The first free slot for a recipe: its own meal types first, Monday to Sunday. */
  const freeSlot = (recipe) => {
    const meals = [...(recipe.meal_types ?? []), ...MEALS.filter((m) => !recipe.meal_types?.includes(m))];
    for (const meal of meals) for (let day = 0; day < 7; day += 1) if (!entryAt(day, meal)) return { day, meal };
    return null;
  };

  return {
    loading, failed, retry: load, dismissError: () => setFailed(null), week, recipes, recipeById, weekEntries, weekItems, entryAt, freeSlot, plan,
    prevWeek: () => setWeek(shiftWeek(week, -1)),
    nextWeek: () => setWeek(shiftWeek(week, 1)),
    listCount: toBuyCount(weekItems),
    move: reported(async (entry, day, meal) => {
      const taken = entryAt(day, meal);
      if (taken?.id === entry.id) return;
      if (taken) await removeEntry(taken);
      const moved = await MealPlanEntry.update(entry.id, { day, meal });
      setEntries((list) => list.map((e) => (e.id === entry.id ? { ...e, ...moved, day, meal } : e)));
    }),
    remove: reported(removeEntry),
    removeRecipe: reported(async (recipeId) => {
      for (const entry of weekEntries.filter((e) => e.recipe_id === recipeId)) await removeEntry(entry);
    }),
    setChecked: reported(async (ids, checked) => {
      await Promise.all(ids.map((id) => ShoppingItem.update(id, { checked })));
      setItems((list) => list.map((i) => (ids.includes(i.id) ? { ...i, checked } : i)));
    }),
    clearChecked: reported(async () => {
      const done = weekItems.filter((i) => i.checked);
      // One request, by id: a delete per row overruns the per-app delete limit on a full week.
      if (done.length) await ShoppingItem.deleteMany({ id: { $in: done.map((i) => i.id) } });
      setItems((list) => list.filter((i) => !done.includes(i)));
    }),
    /** Names of a planned meal's ingredients that are on the list. */
    onListOf: (entry) => rowsOf(entry).map((i) => i.name),
    /** Drawer checkbox of a planned meal: puts that ingredient on the list or takes it off. */
    setOnList: reported(async (entry, ingredient, on) => {
      const row = rowsOf(entry).find((i) => i.name === ingredient.name);
      if (!on && row) {
        await ShoppingItem.delete(row.id);
        setItems((list) => list.filter((i) => i.id !== row.id));
      } else if (on && !row) {
        const created = await ShoppingItem.create({ week_start: entry.week_start, name: ingredient.name, quantity: ingredient.quantity, unit: ingredient.unit, source_recipe_id: entry.recipe_id, plan_entry_id: entry.id, checked: false });
        setItems((list) => [...list, created]);
      }
    }),
  };
}
\`\`\`

## src/components/meal-planner/usePlanFeedback.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const centerOf = (selector, dx = 0, dy = 0) => {
  const r = document.querySelector(selector)?.getBoundingClientRect();
  return r ? { x: r.left + r.width / 2 + dx, y: r.top + dy } : { x: 0, y: 0 };
};

/** After planning: the tile pops, "+N" flies to the badge (which counts it on arrival, 1s later), then a toast. */
export function usePlanFeedback() {
  const [freshId, setFreshId] = useState(null);
  const [fly, setFly] = useState(null);
  const [toast, setToast] = useState(null);
  const [pending, setPending] = useState(0);
  const timers = useRef([]);
  const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const celebrate = ({ entry, count, added, slot, title, detail }) => {
    setFreshId(entry.id);
    setPending((n) => n + added);
    const id = entry.id;
    later(400, () => setFly({ id, count, from: centerOf(\`[data-slot="\${slot}"]\`, 30, 20), to: centerOf('[data-badge]', -14, 4) }));
    later(1400, () => { setFly(null); setPending((n) => Math.max(0, n - added)); });
    later(1800, () => setToast({ id, title, detail }));
    later(4000, () => setToast((t) => (t?.id === id ? null : t)));
  };

  return { freshId, fly, toast, celebrate, pending };
}
\`\`\`

## src/components/meal-planner/usePlannerUi.js
\`\`\`js
import { useEffect, useState } from 'react';
import { useMealPlanner } from './useMealPlanner';
import { useDrag } from './useDrag';
import { usePlanFeedback } from './usePlanFeedback';
import { matchesFilter, parseSlot, slotKey, slotLabel, slotTitle } from './format';

/** Everything both layouts share: the data, the drag, what is open, and the actions behind each control. */
export function usePlannerUi() {
  const planner = useMealPlanner();
  const feedback = usePlanFeedback();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(null); // { recipeId, entryId? }
  const [picking, setPicking] = useState(null); // { day, meal }
  const [listOpen, setListOpen] = useState(false);
  const [armed, setArmed] = useState(null); // phone: the tile a long-press revealed × on

  const planInto = async (recipeId, day, meal) => {
    const recipe = planner.recipeById.get(recipeId);
    const result = await planner.plan(recipeId, day, meal); // undefined when the save failed: nothing to celebrate
    if (result) feedback.celebrate({ ...result, slot: slotKey(day, meal), title: \`\${result.count} ingredients added\`, detail: \`From \${recipe.name} · \${slotLabel(planner.week, day, meal)}\` });
  };

  const { drag, start, wasDrag } = useDrag(
    (payload, slot) => {
      const { day, meal } = parseSlot(slot);
      if (payload.kind === 'recipe') planInto(payload.recipeId, day, meal);
      else planner.move(payload.entry, day, meal);
    },
    (payload) => payload.kind === 'entry' && setArmed(payload.entry.id),
  );

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setOpen(null), setPicking(null), setListOpen(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openEntry = open?.entryId && planner.weekEntries.find((e) => e.id === open.entryId);
  const openRecipe = open && planner.recipeById.get(open.recipeId);
  const plannedThisWeek = openRecipe && planner.weekEntries.some((e) => e.recipe_id === openRecipe.id);
  const free = openRecipe && planner.freeSlot(openRecipe);
  const close = () => setOpen(null);

  return {
    planner, feedback, drag, start,
    query, setQuery, filter, setFilter,
    shown: planner.recipes.filter((r) => matchesFilter(r, filter, query)),
    count: planner.loading ? null : planner.listCount - feedback.pending,
    dragRecipeId: drag && (drag.payload.kind === 'recipe' ? drag.payload.recipeId : drag.payload.entry.recipe_id),
    draggingRecipeId: drag?.payload.kind === 'recipe' ? drag.payload.recipeId : null,
    draggingEntryId: drag?.payload.kind === 'entry' ? drag.payload.entry.id : null,
    armed, disarm: () => setArmed(null),
    openRecipeCard: (r) => !wasDrag() && setOpen({ recipeId: r.id }),
    openTile: (entry) => !wasDrag() && setOpen({ recipeId: entry.recipe_id, entryId: entry.id }),
    // The click that follows a long-press is the hold's own: it must not undo the arming.
    tapTile: (entry) => {
      if (wasDrag()) return;
      if (armed === entry.id) setArmed(null);
      else setOpen({ recipeId: entry.recipe_id, entryId: entry.id });
    },
    pick: (day, meal) => setPicking({ day, meal }),
    listOpen, toggleList: () => setListOpen((v) => !v), closeList: () => setListOpen(false),
    list: { items: planner.weekItems, count: planner.listCount, onToggle: planner.setChecked, onClear: planner.clearChecked },
    picker: picking && {
      title: slotTitle(planner.week, picking.day, picking.meal), meal: picking.meal, recipes: planner.recipes,
      onClose: () => setPicking(null),
      onPick: (r) => { setPicking(null); planInto(r.id, picking.day, picking.meal); },
    },
    detailKey: open && (open.entryId ?? open.recipeId),
    detail: openRecipe && {
      recipe: openRecipe,
      context: openEntry ? slotTitle(planner.week, openEntry.day, openEntry.meal) : '',
      onList: openEntry ? planner.onListOf(openEntry) : null,
      onToggle: (ing, on) => planner.setOnList(openEntry, ing, on),
      planned: Boolean(openEntry || plannedThisWeek),
      onAdd: free ? () => { close(); planInto(openRecipe.id, free.day, free.meal); } : null,
      onRemove: () => { close(); if (openEntry) planner.remove(openEntry); else planner.removeRecipe(openRecipe.id); },
      onClose: close,
    },
  };
}
\`\`\`

## src/components/meal-planner/useViewport.js
\`\`\`js
import { useEffect, useState } from 'react';

// Below 1024px wide the one-day phone layout takes over from the desktop board.
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

export function useViewport() {
  const [mobile, setMobile] = useState(isMobile);
  useEffect(() => {
    const onResize = () => setMobile(isMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return { mobile };
}
\`\`\`

## src/components/meal-planner/WeekGrid.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { RecipeMeta } from './Icons';
import { MEALS, dayNumber, slotKey, weekDays, weekdayName } from './format';

function Tile({ recipe, fresh, dragging, over, onPress, onOpen, onRemove }) {
  return (
    <motion.div initial={fresh ? { scale: 0.86 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 16 }}
      className={\`group relative h-full \${dragging ? 'opacity-40' : ''}\`}>
      {fresh && (
        <motion.span initial={{ opacity: 0.75, scale: 1 }} animate={{ opacity: 0, scale: 1.12 }} transition={{ duration: 0.7 }}
          className="pointer-events-none absolute inset-0 rounded-[12px] bg-[var(--swatch-4)]" />
      )}
      <button type="button" onPointerDown={onPress} onClick={onOpen}
        className="mp-card relative flex h-full w-full touch-none flex-col overflow-hidden rounded-[12px] text-left">
        <img src={recipe.photo_url} alt="" draggable={false} className="h-[calc(98px_+_var(--fit-extra,0px)/3)] w-full flex-none bg-[var(--ui-photo)] object-cover" />
        <RecipeMeta recipe={recipe} className="px-[10px] pt-[9px]" />
      </button>
      {over && <span className="mp-over pointer-events-none absolute inset-0 rounded-[12px] opacity-60" />}
      <button type="button" aria-label={\`Remove \${recipe.name}\`} onClick={onRemove}
        className="absolute right-[6px] top-[6px] flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[var(--ui-card)] text-[13px] leading-none text-[var(--swatch-3)] opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100">×</button>
    </motion.div>
  );
}

export default function WeekGrid({ week, entryAt, recipeById, over, draggingEntryId, freshId, onPress, onOpen, onRemove, onPick }) {
  return (
    <>
      {weekDays(week).map((date, day) => (
        <div key={day} className="absolute top-[74px]" style={{ left: 390 + day * 122.67 }}>
          <div className="mp-display text-[var(--swatch-3)] text-[29px] leading-none">{dayNumber(date)}</div>
          <div className="mp-mono uppercase mt-[3px] text-[10.5px] tracking-[0.02em]">{weekdayName(date)}</div>
        </div>
      ))}
      {MEALS.map((meal, row) => (
        <div key={meal} className="absolute left-[322px] flex h-[calc(174px_+_var(--fit-extra,0px)/3)] w-[34px] items-center justify-center"
          style={{ top: \`calc(\${136 + row * 188}px + var(--fit-extra, 0px) * \${row} / 3)\` }}>
          <span className="mp-display text-[var(--swatch-3)] -rotate-90 whitespace-nowrap text-[27px] capitalize leading-none">{meal}</span>
        </div>
      ))}
      <div className="absolute left-[387px] top-[136px] grid grid-cols-[repeat(7,108px)] grid-rows-[repeat(3,calc(174px_+_var(--fit-extra,0px)/3))] gap-x-[14.67px] gap-y-[14px]">
        {MEALS.map((meal) => Array.from({ length: 7 }, (_, day) => {
          const key = slotKey(day, meal);
          const entry = entryAt(day, meal);
          const recipe = entry && recipeById.get(entry.recipe_id);
          const isOver = over === key && draggingEntryId !== entry?.id;
          return (
            <div key={key} data-slot={key} className="relative">
              {recipe ? (
                <Tile recipe={recipe} fresh={entry.id === freshId} dragging={draggingEntryId === entry.id} over={isOver}
                  onPress={(e) => onPress(e, { kind: 'entry', entry })} onOpen={() => onOpen(entry)} onRemove={() => onRemove(entry)} />
              ) : (
                <button type="button" aria-label={\`Plan \${meal}\`} onClick={() => onPick(day, meal)}
                  className={\`flex h-full w-full flex-col items-center justify-center rounded-[12px] \${isOver ? 'mp-over' : 'mp-empty'}\`}>
                  <span className="text-[19px] font-light leading-none">+</span>
                  {isOver && <span className="mp-mono uppercase tracking-[0.04em] mt-[8px] text-[9px] font-bold">Drop to plan</span>}
                </button>
              )}
            </div>
          );
        }))}
      </div>
    </>
  );
}
\`\`\`

## src/pages/MealPlanner.jsx
\`\`\`jsx
import '@/components/meal-planner/meal-planner.css';
import DesktopPlanner from '@/components/meal-planner/DesktopPlanner';
import MobilePlanner from '@/components/meal-planner/MobilePlanner';
import { usePlannerUi } from '@/components/meal-planner/usePlannerUi';
import { useViewport } from '@/components/meal-planner/useViewport';

export default function MealPlanner() {
  const ui = usePlannerUi();
  const { mobile } = useViewport();
  return mobile ? <MobilePlanner ui={ui} /> : <DesktopPlanner ui={ui} />;
}
\`\`\`
`;export{e as default};