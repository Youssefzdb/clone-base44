var e=`# task_project_tracker — app files

## base44/entities/BoardSettings.jsonc
\`\`\`json
{
  "name": "BoardSettings",
  "type": "object",
  "properties": {
    "workspace": {
      "type": "string",
      "description": "The wordmark above the title"
    },
    "title": {
      "type": "string",
      "description": "The board title"
    }
  },
  "required": [
    "workspace",
    "title"
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

## base44/entities/Task.jsonc
\`\`\`json
{
  "name": "Task",
  "type": "object",
  "properties": {
    "title": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "backlog",
        "in_progress",
        "review",
        "done"
      ],
      "default": "backlog"
    },
    "position": {
      "type": "number",
      "description": "Order within its column"
    },
    "priority": {
      "type": "string",
      "enum": [
        "low",
        "med",
        "high"
      ],
      "default": "med"
    },
    "due_date": {
      "type": "string",
      "format": "date"
    },
    "assignee": {
      "type": "string",
      "description": "A TeamMember name"
    },
    "description": {
      "type": "string"
    },
    "checklist": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "text": {
            "type": "string"
          },
          "done": {
            "type": "boolean"
          }
        }
      }
    },
    "comments": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "author": {
            "type": "string"
          },
          "text": {
            "type": "string"
          },
          "created": {
            "type": "string"
          }
        }
      }
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "title",
    "status",
    "position",
    "priority"
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

## base44/entities/TeamMember.jsonc
\`\`\`json
{
  "name": "TeamMember",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "avatar_url": {
      "type": "string"
    },
    "sort_order": {
      "type": "number"
    },
    "sample": {
      "type": "boolean",
      "description": "A sample row the app added on its first load"
    }
  },
  "required": [
    "name",
    "sort_order"
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

## src/components/lane/Avatar.jsx
\`\`\`jsx
export default function Avatar({ member, name, size = 29, className = '' }) {
  const label = member?.name ?? name ?? '';
  return member?.avatar_url ? (
    <img src={member.avatar_url} alt={label} style={{ width: size, height: size }} className={\`flex-none rounded-full object-cover ring-2 ring-white \${className}\`} />
  ) : (
    <span style={{ width: size, height: size }} className={\`flex flex-none items-center justify-center rounded-full bg-[var(--lane-low)] text-[11px] font-semibold ring-2 ring-white \${className}\`}>
      {label.split(' ').map((p) => p[0]).join('').slice(0, 2)}
    </span>
  );
}
\`\`\`

## src/components/lane/Board.jsx
\`\`\`jsx
import { ColumnCards, ColumnHeader } from './Column';
import DragGhost from './DragGhost';

export default function Board({ columns, member, dragger, onOpen, visible }) {
  const { drag, columnRef } = dragger;
  return (
    <div className="relative grid min-h-0 flex-1 grid-cols-4 gap-x-[20px] max-lg:grid-cols-2 max-lg:gap-y-[28px]">
      {columns.map((col) => {
        const target = drag?.over?.status === col.id && drag.from !== col.id;
        return (
          <section key={col.id} ref={columnRef(col.id)} className="flex min-h-0 flex-col">
            <ColumnHeader col={col} target={target} />
            <div className="lane-divider" />
            <ColumnCards col={col} cards={col.tasks.filter(visible)} member={member} dragger={dragger} onOpen={onOpen} target={target} />
          </section>
        );
      })}
      <DragGhost columns={columns} member={member} drag={drag} />
    </div>
  );
}
\`\`\`

## src/components/lane/Card.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Avatar from './Avatar';
import { priorityName, shortDate } from './data';

export function PriorityDot({ priority, size = 9 }) {
  return <span className="flex-none rounded-full" style={{ width: size, height: size, background: \`var(--lane-\${priority})\` }} />;
}

// The lifted copy follows the pointer instantly; the card in its column settles into place with a calm ease.
const SETTLE = { layout: { duration: 0.4, ease: [0.45, 0, 0.25, 1] } };
const FOLLOW = { layout: { duration: 0 }, default: { duration: 0.2 } };

/** A board card; \`lifted\` is the copy that follows the pointer while dragging, \`big\` the phone size. */
export default function Card({ task, member, lifted, big, placeholder, ...props }) {
  return (
    <motion.button type="button" layoutId={placeholder ? undefined : task.id} layout="position" transition={lifted ? FOLLOW : SETTLE} {...props}
      initial={false} animate={{ scale: lifted ? 1.04 : 1, rotate: lifted ? -2 : 0 }} whileHover={lifted || big ? undefined : { y: -2 }}
      className={\`lane-glass lane-card flex w-full touch-manipulation select-none \${placeholder ? 'invisible' : ''} flex-col justify-between text-left \${
        big ? 'min-h-[132px] gap-[14px] rounded-[28px] px-[22px] pb-[18px] pt-[20px]' : 'h-[97px] rounded-[16px] px-[17px] pb-[13px] pt-[12px]'
      } \${lifted ? 'cursor-grabbing !bg-white/90 !shadow-[0_22px_48px_rgba(0,0,0,0.16)] outline-dashed outline-1 outline-offset-[-1px] outline-[var(--lane-dash)]' : 'cursor-grab'}\`}>
      <span className={\`line-clamp-2 flex-none pb-[2px] font-[450] leading-[1.13] tracking-[-0.035em] \${big ? 'text-[22px]' : 'text-[length:clamp(17px,1.72vw,22px)]'}\`}>{task.title}</span>
      <span className={\`flex items-center \${big ? 'gap-[9px] text-[16px]' : 'gap-[7px] text-[14px]'}\`}>
        <PriorityDot priority={task.priority} size={big ? 11 : 9} />
        <span className="font-semibold">{priorityName(task.priority)}</span>
        <span className="ml-[8px] font-semibold text-[var(--lane-muted)]">{shortDate(task.due_date)}</span>
        <Avatar member={member} name={task.assignee} size={big ? 40 : 29} className="ml-auto" />
      </span>
    </motion.button>
  );
}
\`\`\`

## src/components/lane/Column.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Card from './Card';
import RollingNumber from './RollingNumber';

/** One column's cards; \`target\` draws the dashed drop zone while a card is dragged over it. */
export function ColumnCards({ col, cards, member, dragger, onOpen, target, big }) {
  return (
    <div className={\`relative flex min-h-0 flex-1 flex-col \${big ? 'pb-[24px] pt-[16px]' : 'mt-[8px] pb-[12px]'}\`}>
      <AnimatePresence>
        {target && <motion.div key="zone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          className={\`pointer-events-none absolute border border-dashed border-[color-mix(in_srgb,var(--swatch-1)_55%,transparent)] \${big ? 'inset-x-[-8px] bottom-[12px] top-[8px] rounded-[34px]' : 'inset-x-[-6px] bottom-0 top-[-6px] rounded-[20px]'}\`} />}
      </AnimatePresence>
      {/* Desktop scrolls here; on phones the column itself scrolls (the edge auto-scroll relies on it). */}
      <div className={\`flex min-h-0 flex-1 flex-col \${big ? 'gap-[12px]' : '-mx-[6px] -mt-[4px] gap-[10px] overflow-y-auto px-[6px] pt-[4px]'}\`}>
        {cards.map((task) => (
          // The lifted card stays mounted (hidden), holding its place: a touch keeps targeting the element it started on.
          <Card key={task.id} task={task} member={member(task.assignee)} big={big} placeholder={task.id === dragger.drag?.id} {...dragger.cardProps(task.id, onOpen)} />
        ))}
        {!col.tasks.length && <p className={\`px-[4px] text-[var(--lane-muted)] \${big ? 'text-[16px]' : 'text-[14px]'}\`}>Nothing here yet</p>}
      </div>
    </div>
  );
}

export function ColumnHeader({ col, target }) {
  return (
    <h2 className="flex h-[86px] items-end gap-[11px] pb-[12px]">
      <RollingNumber value={col.tasks.length} className="h-[64px] text-[length:clamp(56px,5.5vw,70px)] font-light leading-[0.92] tracking-[-0.04em]" />
      <span className="text-[length:clamp(18px,1.72vw,22px)] font-medium tracking-[-0.03em]">{col.name}</span>
      <motion.span aria-hidden initial={false} animate={{ opacity: target ? 1 : 0, scale: target ? 1 : 0.8 }} transition={{ duration: 0.3 }}
        className="mb-[6px] ml-auto flex h-[21px] w-[21px] items-center justify-center rounded-full border border-[var(--swatch-1)]"><Plus size={11} strokeWidth={2} /></motion.span>
    </h2>
  );
}
\`\`\`

## src/components/lane/data.js
\`\`\`js
export const COLUMNS = [
  { id: 'backlog', name: 'Backlog' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'review', name: 'Review' },
  { id: 'done', name: 'Done' },
];
export const SETTINGS = { workspace: 'Lane', title: 'Project board' };
export const PRIORITIES = [
  { id: 'low', name: 'Low' },
  { id: 'med', name: 'Med' },
  { id: 'high', name: 'High' },
];
export const priorityName = (id) => PRIORITIES.find((p) => p.id === id)?.name ?? 'Med';

// The designer's portraits, cropped to a face square (320px) and hosted on the media platform.
const face = (initials) => \`https://media.base44.com/images/public/builder-assets/gallery-task-tracker-\${initials}.webp\`;
export const SEED_MEMBERS = [
  { name: 'Rina K.', avatar_url: face('rk'), sort_order: 1 },
  { name: 'Tom M.', avatar_url: face('tm'), sort_order: 2 },
  { name: 'Leo D.', avatar_url: face('ao'), sort_order: 3 },
  { name: 'Sam L.', avatar_url: face('sl'), sort_order: 4 },
  { name: 'Mia C.', avatar_url: face('jp'), sort_order: 5 },
];

const isoIn = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const list = (...items) => items.map((text, i) => ({ text, done: i === 0 && items.length > 2 }));
const say = (author, text) => ({ author, text, created: new Date().toISOString() });

// 12 product tasks across the four columns; due dates count from today.
const TASKS = [
  ['backlog', 'Audit empty states across mobile', 'med', 4, 'Rina K.', 'Every list, filter and search view needs a first-run state.',
    list('Inventory all empty states', 'Write the copy variants', 'Hand one pattern to design'),
    [say('Tom M.', 'Screens 4 and 7 are the worst offenders.'), say('Sam L.', 'Reuse the onboarding illustration set.')]],
  ['backlog', 'Spec offline sync conflicts', 'low', 12, 'Tom M.', 'Decide what wins when two people edit the same card offline.', list('List conflict cases', 'Draft the merge rules'), []],
  ['backlog', 'Rewrite billing error copy', 'med', 9, 'Leo D.', 'Card declines read like our fault; make them clear and calm.', list('Collect current messages', 'Rewrite with support', 'Ship behind a flag'), []],
  ['backlog', 'Kill legacy webhook retries', 'low', 16, 'Mia C.', 'The old retry queue doubles deliveries since the new worker landed.', list('Confirm no callers left', 'Remove the queue'), []],
  ['in_progress', 'Board drag-and-drop physics', 'high', 3, 'Rina K.', 'Cards should lift, follow the pointer and settle with a soft ease.', list('Lift and shadow on pick-up', 'Placeholder in the target column', 'Settle animation on drop'), [say('Leo D.', 'The settle feels great on trackpads now.')]],
  ['in_progress', 'Realtime presence cursors', 'med', 5, 'Sam L.', 'Show who else is on the board, live.', list('Broadcast cursor positions', 'Fade idle cursors'), []],
  ['in_progress', 'Column virtualisation pass', 'high', 6, 'Tom M.', 'Long columns stutter past 200 cards.', list('Measure with 1,000 cards', 'Window the list', 'Keep drag working'), []],
  ['review', 'Keyboard shortcut layer', 'med', 2, 'Leo D.', 'Move, open and assign cards without the mouse.', list('Map the shortcuts', 'Add the cheat sheet'), []],
  ['review', 'Invite flow rate limits', 'high', 2, 'Mia C.', 'Stop invite spam without blocking real teams.', list('Pick the limits', 'Add the error state', 'Load test'), [say('Rina K.', 'Ten an hour per workspace sounds right.')]],
  ['review', 'Dark theme token audit', 'low', 7, 'Sam L.', 'Check every token against the dark palette.', list('Export the token list', 'Flag low contrast pairs'), []],
  ['done', 'Checklist reordering', 'med', -1, 'Rina K.', 'Drag checklist items into a new order.', list('Drag handles', 'Persist the order'), []],
  ['done', 'Comment mentions', 'high', -2, 'Leo D.', 'Mention a teammate and they get notified.', list('Autocomplete names', 'Send the notification'), []],
];

export const seedTasks = () => {
  const seen = {};
  return TASKS.map(([status, title, priority, days, assignee, description, checklist, comments]) => {
    seen[status] = (seen[status] ?? 0) + 1;
    return { status, title, priority, due_date: isoIn(days), assignee, description, checklist, comments, position: seen[status] };
  });
};

export const shortDate = (iso) => (iso ? new Date(\`\${iso}T00:00:00\`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date');
\`\`\`

## src/components/lane/DetailPanel.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import Avatar from './Avatar';
import { PriorityDot } from './Card';
import TaskThread from './TaskThread';
import { PRIORITIES, priorityName, shortDate } from './data';

const next = (list, value) => list[(list.indexOf(value) + 1) % list.length];
const EASE = { type: 'tween', ease: [0.45, 0, 0.25, 1], duration: 0.45 };
const SIDE = { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } };
const SHEET = { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } };

/** The task detail: a panel from the right on desktop, a bottom sheet (swipe down to close) on phones. */
export default function DetailPanel({ task, member, members, me, phone, onSave, onClose }) {
  const [editing, setEditing] = useState(null);
  const controls = useDragControls();
  const owner = member(task.assignee);
  const finish = (key) => (e) => {
    setEditing(null);
    const value = e.target.value.replace(/\\s+/g, ' ').trim();
    if (value || key === 'description') onSave({ [key]: value });
  };
  const titleClass = 'text-[44px] font-light leading-[1] tracking-[-0.05em] max-md:text-[40px]';

  return (
    <>
      {phone && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={EASE} onClick={onClose}
        className="fixed inset-0 z-30 bg-[color-mix(in_srgb,var(--swatch-1)_18%,transparent)]" />}
      <motion.aside {...(phone ? SHEET : SIDE)} transition={EASE}
        drag={phone ? 'y' : false} dragControls={controls} dragListener={false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.8 }}
        onDragEnd={(_, info) => (info.offset.y > 120 || info.velocity.y > 600) && onClose()}
        className={\`lane-sheet z-30 flex flex-col overflow-y-auto \${phone
          ? 'fixed inset-x-0 bottom-0 h-[85vh] rounded-t-[36px] px-[24px] pb-[28px] pt-[12px] shadow-[0_-18px_50px_rgba(0,0,0,0.1)]'
          : 'absolute inset-y-0 right-0 w-[467px] px-[38px] pb-[24px] pt-[37px] shadow-[-24px_0_60px_rgba(0,0,0,0.06)]'}\`}>
        {phone && <div onPointerDown={(e) => controls.start(e)} className="-mx-[24px] -mt-[12px] flex h-[40px] flex-none touch-none justify-center pt-[12px]">
          <span aria-hidden className="h-[5px] w-[44px] rounded-full bg-[var(--lane-dash)]" />
        </div>}
        <button type="button" aria-label="Close" onClick={onClose}
          className={\`absolute flex items-center justify-center rounded-full border border-[var(--lane-dash)] \${phone ? 'right-[20px] top-[22px] h-[44px] w-[44px]' : 'right-[37px] top-[37px] h-[32px] w-[32px]'}\`}><X size={14} /></button>
        {editing === 'title' ? (
          <textarea autoFocus rows={2} defaultValue={task.title} aria-label="Title" onBlur={finish('title')}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), e.currentTarget.blur())}
            className={\`mt-[54px] block w-full resize-none bg-transparent outline-none max-md:mt-[20px] \${titleClass}\`} />
        ) : (
          <h2 onClick={() => setEditing('title')} className={\`mt-[54px] max-w-[350px] cursor-text max-md:mt-[20px] max-md:pr-[40px] \${titleClass}\`}>
            {task.title} <span className="font-normal">↘</span>
          </h2>
        )}
        <div className="lane-divider mt-[23px]" />
        <div className="flex min-h-[58px] items-center gap-[17px] text-[17px] max-md:flex-wrap max-md:gap-x-[16px] max-md:py-[8px] max-md:text-[16px]">
          <button type="button" onClick={() => onSave({ priority: next(PRIORITIES.map((p) => p.id), task.priority) })} className="flex min-h-[44px] items-center gap-[7px] text-[13px] font-semibold max-md:text-[16px]">
            <PriorityDot priority={task.priority} />{priorityName(task.priority)}
          </button>
          <label className="relative flex min-h-[44px] cursor-pointer items-center">{shortDate(task.due_date)}
            <input type="date" aria-label="Due date" value={task.due_date ?? ''} onChange={(e) => onSave({ due_date: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
          </label>
          <label className="relative ml-auto flex min-h-[44px] cursor-pointer items-center gap-[9px]">
            <Avatar member={owner} name={task.assignee} size={31} />{task.assignee ?? 'Unassigned'}
            <select aria-label="Assignee" value={task.assignee ?? ''} onChange={(e) => onSave({ assignee: e.target.value || null })} className="absolute inset-0 cursor-pointer opacity-0">
              <option value="">Unassigned</option>
              {members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </label>
        </div>
        <div className="lane-divider" />
        {editing === 'description' ? (
          <textarea autoFocus rows={3} defaultValue={task.description} aria-label="Description" onBlur={finish('description')}
            className="mt-[25px] block w-full resize-none bg-transparent text-[18px] leading-[1.45] text-[var(--lane-muted)] outline-none" />
        ) : (
          <p onClick={() => setEditing('description')} className="mt-[25px] cursor-text text-[18px] leading-[1.45] text-[var(--lane-muted)]">
            {task.description || 'Add a description'}
          </p>
        )}
        <TaskThread task={task} member={member} me={me} onSave={onSave} />
      </motion.aside>
    </>
  );
}
\`\`\`

## src/components/lane/DragGhost.jsx
\`\`\`jsx
import Card from './Card';

export default function DragGhost({ columns, member, drag, big }) {
  const task = drag && columns.flatMap((c) => c.tasks).find((t) => t.id === drag.id);
  if (!task) return null;
  return (
    <div className="pointer-events-none fixed left-0 top-0 z-40" style={{ width: drag.width, transform: \`translate(\${drag.x}px, \${drag.y}px)\` }}>
      <Card task={task} member={member(task.assignee)} big={big} lifted />
    </div>
  );
}
\`\`\`

## src/components/lane/Header.jsx
\`\`\`jsx
import { useState } from 'react';
import { ArrowRight, Menu, Plus } from 'lucide-react';
import Avatar from './Avatar';
import { PRIORITIES } from './data';
import { PriorityDot } from './Card';

export default function Header({ settings, members, me, person, onPerson, priority, onPriority, onNew }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="relative flex flex-none items-start justify-between">
      <div>
        {settings && (
          <>
            <p className="flex items-baseline gap-[9px]">
              <span className="text-[22px] font-bold tracking-[-0.01em] max-md:text-[20px]">{settings.workspace}<sup className="text-[11px]">®</sup></span>
              <span className="text-[12px] font-medium text-[var(--lane-muted)]">Project tracker</span>
            </p>
            <h1 className="-ml-[2px] mt-[4px] text-[length:clamp(48px,4.7vw,60px)] font-light leading-[1.05] tracking-[-0.06em] max-md:mt-[18px] max-md:text-[40px]">{settings.title} <span className="font-normal">↘</span></h1>
          </>
        )}
      </div>
      <div className="mt-[31px] flex items-center gap-[15px] max-md:absolute max-md:right-0 max-md:top-0 max-md:mt-0 max-md:gap-[10px]">
        <div className="flex max-md:hidden">
          {members.slice(0, 4).map((m, i) => (
            <button key={m.id} type="button" title={m.name} onClick={() => onPerson(person === m.name ? null : m.name)}
              className={\`\${i ? '-ml-[10px]' : ''} rounded-full transition-transform hover:-translate-y-[2px] \${person && person !== m.name ? 'opacity-40' : ''}\`}>
              <Avatar member={m} size={40} />
            </button>
          ))}
        </div>
        <Avatar member={members.find((m) => m.name === me)} name={me} size={44} className="md:hidden" />
        <button type="button" aria-label="Filter by priority" onClick={() => setMenu((open) => !open)}
          className="lane-glass flex h-[41px] w-[41px] items-center justify-center rounded-full border border-[var(--lane-dash)] max-md:hidden"><Menu size={16} /></button>
        <button type="button" onClick={onNew} className="flex h-[40px] items-center gap-[12px] rounded-full bg-[var(--swatch-1)] pl-[20px] pr-[5px] text-[16px] font-semibold text-[var(--swatch-1-ink)] max-md:hidden">
          New task<span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--swatch-1-ink)] text-[var(--swatch-1)]"><ArrowRight size={15} strokeWidth={2.2} /></span>
        </button>
        <button type="button" aria-label="New task" onClick={onNew} className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[var(--swatch-1)] text-[var(--swatch-1-ink)] md:hidden">
          <Plus size={20} strokeWidth={2.2} />
        </button>
        {menu && (
          <div className="lane-solid absolute right-[140px] top-[80px] z-30 flex flex-col gap-[4px] rounded-[18px] p-[8px] text-[15px] shadow-[0_18px_40px_rgba(0,0,0,0.1)]">
            {[{ id: null, name: 'All priorities' }, ...PRIORITIES].map((p) => (
              <button key={p.name} type="button" onClick={() => { onPriority(p.id); setMenu(false); }}
                className={\`flex items-center gap-[8px] rounded-full px-[12px] py-[6px] text-left \${priority === p.id ? 'bg-white' : ''}\`}>
                {p.id && <PriorityDot priority={p.id} />}{p.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
\`\`\`

## src/components/lane/lane.css
\`\`\`css
@font-face{font-family:"Archivo";font-weight:300 700;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/archivo-variable-normal.woff2) format("woff2")}

/* The look: ink, canvas and the two arch colours (--swatch-N, --swatch-N-ink for text on them), plus the arch core, the outer arch ring and the Med dot. */
:root{
  --swatch-1:#221F14;--swatch-1-ink:#FFFFFF;
  --swatch-2:#F3F1EC;--swatch-2-ink:#111111;
  --swatch-3:#E2E310;--swatch-3-ink:#111111;
  --swatch-4:#2F5220;--swatch-4-ink:#FFFFFF;
  --lane-arch-core:#16290D;--lane-arch-outer:#6F8FD8;--lane-med:#5F8A3F;
}
/* gallery-look */

.lane{font-family:"Archivo",system-ui,sans-serif;color:var(--swatch-1);background:var(--swatch-2);letter-spacing:-0.02em;-webkit-font-smoothing:antialiased;
  --lane-low:color-mix(in srgb,var(--lane-med) 50%,var(--swatch-2));--lane-high:color-mix(in srgb,var(--lane-med) 25%,var(--lane-arch-core));
  --lane-muted:color-mix(in srgb,var(--swatch-1) 72%,transparent);--lane-dash:color-mix(in srgb,var(--swatch-1) 30%,transparent);
  --lane-panel:rgba(255,255,255,0.62);--lane-shadow:0 1px 2px rgba(0,0,0,0.025),0 10px 30px rgba(0,0,0,0.03)}
.lane-sheet{background:color-mix(in srgb,var(--swatch-2) 70%,rgba(255,255,255,0.7));backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px)}
.lane-grain{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");opacity:.06;mix-blend-mode:multiply}
/* Concentric arches from the bottom edge, outer blue ring to the dark core, blurred into one glow. */
.lane-arches{background:
  radial-gradient(ellipse 12% 15% at 53% 100%,var(--lane-arch-core) 0%,color-mix(in srgb,var(--lane-arch-core) 0%,transparent) 100%),
  radial-gradient(ellipse 34% 34% at 53% 100%,var(--swatch-4) 0%,color-mix(in srgb,var(--swatch-4) 55%,transparent) 40%,color-mix(in srgb,var(--swatch-4) 0%,transparent) 100%),
  radial-gradient(ellipse 50% 50% at 53% 100%,var(--swatch-3) 0%,color-mix(in srgb,var(--swatch-3) 80%,transparent) 45%,color-mix(in srgb,var(--swatch-3) 0%,transparent) 100%),
  radial-gradient(ellipse 80% 70% at 53% 100%,color-mix(in srgb,var(--lane-arch-outer) 32%,var(--swatch-2)) 0%,color-mix(in srgb,var(--lane-arch-outer) 0%,transparent) 100%),
  radial-gradient(ellipse 30% 45% at 98% 100%,color-mix(in srgb,var(--lane-arch-outer) 30%,transparent) 0%,color-mix(in srgb,var(--lane-arch-outer) 0%,transparent) 100%);
  filter:blur(30px);animation:lane-drift 26s ease-in-out infinite alternate}
@keyframes lane-drift{from{transform:translateX(-2%) scaleY(1)}to{transform:translateX(3%) scaleY(1.05)}}
.lane-glass{background:var(--lane-panel);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:var(--lane-shadow)}
/* Overlays (dialog, menu) are opaque: the glass tone over the canvas, so the board never shows through. */
.lane-solid{background:color-mix(in srgb,white 62%,var(--swatch-2));box-shadow:var(--lane-shadow)}
.lane-divider{border-top:1px dashed var(--lane-dash)}
.lane-card{-webkit-touch-callout:none}
.lane-snap{scroll-snap-type:x mandatory;scrollbar-width:none}
.lane-snap::-webkit-scrollbar{display:none}
\`\`\`

## src/components/lane/MobileBoard.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ColumnCards } from './Column';
import DragGhost from './DragGhost';
import RollingNumber from './RollingNumber';

const EDGE = 36;

/** Phones: one column at a time, swiped and snapped, under a tab row with the counts. */
export default function MobileBoard({ columns, member, dragger, onOpen, visible }) {
  const { drag, columnRef } = dragger;
  const scroller = useRef(null);
  const [active, setActive] = useState(0);
  const show = (i) => scroller.current?.scrollTo({ left: i * scroller.current.clientWidth, behavior: 'smooth' });

  // Holding a lifted card near a screen edge turns the board to the next column.
  useEffect(() => {
    if (!drag) return undefined;
    const step = drag.px < EDGE ? -1 : drag.px > window.innerWidth - EDGE ? 1 : 0;
    if (!step) return undefined;
    const turn = () => { show(Math.min(columns.length - 1, Math.max(0, active + step))); setTimeout(dragger.refresh, 420); };
    const timer = setTimeout(turn, 350);
    return () => clearTimeout(timer);
  }, [drag?.px, active]);

  return (
    <div className="relative -mx-[24px] flex min-h-0 min-w-0 flex-1 flex-col">
      <nav className="sticky top-0 z-10 flex gap-[12px] px-[24px]">
        {columns.map((col, i) => (
          <button key={col.id} type="button" onClick={() => show(i)} className="relative flex h-[52px] flex-auto items-end gap-[4px] pb-[9px]">
            <RollingNumber value={col.tasks.length} className="h-[28px] text-[28px] font-light leading-none tracking-[-0.04em]" />
            <span className={\`whitespace-nowrap text-[13px] font-medium \${i === active ? '' : 'text-[var(--lane-muted)]'}\`}>{col.name}</span>
            <span className="lane-divider absolute inset-x-[-6px] bottom-0" />
            {i === active && <motion.span layoutId="lane-tab" transition={{ duration: 0.35, ease: [0.45, 0, 0.25, 1] }} className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[var(--swatch-1)]" />}
          </button>
        ))}
      </nav>
      <div ref={scroller} onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="lane-snap flex min-h-0 flex-1 overflow-x-auto">
        {columns.map((col) => (
          <section key={col.id} ref={columnRef(col.id)} className="flex w-full flex-none snap-start flex-col overflow-y-auto px-[24px]">
            <ColumnCards col={col} cards={col.tasks.filter(visible)} member={member} dragger={dragger} onOpen={onOpen}
              target={drag?.over?.status === col.id && drag.from !== col.id} big />
          </section>
        ))}
      </div>
      <DragGhost columns={columns} member={member} drag={drag} big />
    </div>
  );
}
\`\`\`

## src/components/lane/NewTaskDialog.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { COLUMNS, PRIORITIES } from './data';

const field = 'mt-[6px] h-[44px] w-full rounded-full border border-[var(--lane-dash)] bg-white/60 px-[16px] text-[17px] text-[var(--swatch-1)] outline-none';

// The native arrow ignores padding and sits in the pill's curve; ours keeps the field's inset.
const Select = ({ children, ...props }) => (
  <span className="relative block">
    <select {...props} className={\`\${field} appearance-none pr-[40px]\`}>{children}</select>
    <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-[16px] top-[calc(50%+3px)] -translate-y-1/2 text-[var(--swatch-1)]" />
  </span>
);

export default function NewTaskDialog({ members, onCreate, onClose }) {
  const [draft, setDraft] = useState({ title: '', status: 'backlog', priority: 'med', due_date: '', assignee: members[0]?.name ?? '' });
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  // One create per dialog: a second click or Enter while it saves is ignored; a failed save can be retried.
  const submit = (e) => {
    e.preventDefault();
    if (saving || !draft.title.trim()) return;
    setSaving(true);
    Promise.resolve(onCreate({ ...draft, title: draft.title.trim(), due_date: draft.due_date || undefined })).catch(() => setSaving(false));
  };
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-[color-mix(in_srgb,var(--swatch-2)_40%,transparent)]" onClick={onClose}>
      <motion.form initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onSubmit={submit} onClick={(e) => e.stopPropagation()}
        className="lane-solid w-[min(460px,calc(100vw-32px))] rounded-[28px] p-[28px] max-md:rounded-[36px] max-md:p-[24px] text-[14px] font-medium text-[var(--lane-muted)] shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
        <h2 className="text-[32px] font-light tracking-[-0.05em] text-[var(--swatch-1)]">New task</h2>
        <label className="mt-[16px] block">Title<input autoFocus value={draft.title} onChange={set('title')} placeholder="What needs doing?" className={field} /></label>
        <div className="mt-[12px] grid grid-cols-2 gap-[12px]">
          <label>Column<Select value={draft.status} onChange={set('status')}>{COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></label>
          <label>Priority<Select value={draft.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></label>
          <label>Due<input type="date" value={draft.due_date} onChange={set('due_date')} className={field} /></label>
          <label>Assignee<Select value={draft.assignee} onChange={set('assignee')}>{members.map((m) => <option key={m.id} value={m.name}>{m.name}</option>)}</Select></label>
        </div>
        <div className="mt-[22px] flex justify-end gap-[10px]">
          <button type="button" onClick={onClose} className="h-[42px] rounded-full px-[18px] text-[16px] text-[var(--swatch-1)]">Cancel</button>
          <button type="submit" disabled={saving || !draft.title.trim()} className="h-[42px] rounded-full bg-[var(--swatch-1)] px-[22px] text-[16px] font-semibold text-[var(--swatch-1-ink)] disabled:opacity-40">Add task</button>
        </div>
      </motion.form>
    </div>
  );
}
\`\`\`

## src/components/lane/RollingNumber.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';

// The count tick: the old number slides up and out, the new one slides in from below.
export default function RollingNumber({ value, className = '' }) {
  return (
    <span className={\`relative inline-flex overflow-hidden \${className}\`}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span key={value} className="block" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
\`\`\`

## src/components/lane/seedOnce.js
\`\`\`js
const LIMIT = 1000;
const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));

// Adds the samples still missing (matched on \`key\`), unless the builder or user already filled the table, and drops the duplicate copies two
// first loads at once can add, keeping the oldest. Only marked rows are touched; a failed request throws.
async function reconcile({ entity, seed, key, sort }, rows) {
  const missing = rows.some((r) => !r.sample) ? [] : seed.filter((s) => !rows.some((r) => r[key] === s[key]));
  // One request: entity calls are rate-limited per app.
  if (missing.length) await entity.bulkCreate(missing.map((s) => ({ ...s, sample: true })));
  const now = missing.length ? await entity.list(sort, LIMIT) : rows;
  const seen = new Set();
  const extra = now.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(r[key]) || !seen.add(r[key]));
  if (extra.length) await entity.deleteMany({ id: { $in: extra.map((r) => r.id) } });
  return now.filter((r) => !extra.includes(r));
}

// Loads the settings row and each table, seeding a new app once. The settings row doubles as the
// "set up" marker: it's written only after every table is reconciled, so a reload mid-seed adds just the
// samples still missing and drops any copies, and a table the user later empties stays empty.
// Never rejects: a table that fails comes back empty (and the app isn't marked set up).
export async function loadSeeded(settings, tables, user) {
  // undefined: not set up yet; null: the lookup failed, so read only and don't seed.
  const saved = await settings.entity.list().then(([row]) => row, () => null);
  // Only an admin writes the team, the settings and the shared samples.
  const seeding = saved === undefined && user?.role === 'admin';
  let complete = true;
  // \`bundled[i]\`: table i shows its samples unsaved, as anyone else sees an empty table before setup.
  const bundled = tables.map(() => false);
  const rows = await Promise.all(tables.map(async (table, i) => {
    try {
      const existing = await table.entity.list(table.sort, LIMIT);
      if (seeding) return await reconcile(table, existing);
      bundled[i] = saved === undefined && !existing.length;
      return bundled[i] ? table.seed.map((s, n) => ({ ...s, id: \`sample-\${n + 1}\` })) : existing;
    } catch (error) {
      console.error(error);
      complete = false;
      return [];
    }
  }));
  if (!seeding || !complete) return { settings: saved ?? settings.seed, rows, bundled };
  // Two first loads at once can both write it: the oldest stays.
  const row = await settings.entity.create(settings.seed)
    .then(() => settings.entity.list())
    .then(async (all) => {
      const [first, ...extra] = all.sort(byAge);
      if (extra.length) await settings.entity.deleteMany({ id: { $in: extra.map((r) => r.id) } });
      return first;
    })
    .catch((error) => console.error(error));
  return { settings: row ?? settings.seed, rows, bundled };
}
\`\`\`

## src/components/lane/TaskThread.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Avatar from './Avatar';

const text = 'text-[18px]';

/** The detail's checklist (tick, untick, add) and comments (post adds one at once). */
export default function TaskThread({ task, member, me, onSave }) {
  const [comment, setComment] = useState('');
  const [item, setItem] = useState('');
  const checklist = task.checklist ?? [];
  const toggle = (i) => onSave({ checklist: checklist.map((it, j) => (j === i ? { ...it, done: !it.done } : it)) });
  const add = () => { if (item.trim()) onSave({ checklist: [...checklist, { text: item.trim(), done: false }] }); setItem(''); };
  const post = () => {
    if (!comment.trim()) return;
    onSave({ comments: [...(task.comments ?? []), { author: me, text: comment.trim(), created: new Date().toISOString() }] });
    setComment('');
  };
  return (
    <>
      <div className="group mt-[20px] flex flex-col gap-[13px] max-md:gap-[8px]">
        {checklist.map((it, i) => (
          <button key={i} type="button" onClick={() => toggle(i)} className={\`flex items-center gap-[12px] text-left max-md:min-h-[44px] \${text}\`}>
            <span className={\`flex h-[24px] w-[24px] flex-none items-center justify-center rounded-full border transition-colors duration-300 \${it.done ? 'border-[var(--swatch-1)] bg-[var(--swatch-1)] text-[var(--swatch-1-ink)]' : 'border-[var(--lane-dash)]'}\`}>
              {it.done && <Check size={13} strokeWidth={3} />}
            </span>
            <span className={it.done ? 'text-[var(--lane-muted)] line-through' : ''}>{it.text}</span>
          </button>
        ))}
        <label className={\`flex items-center gap-[12px] max-md:min-h-[44px] \${checklist.length ? 'md:hidden md:group-focus-within:flex md:group-hover:flex' : ''} \${text}\`}>
          <span className="sr-only">Add item</span>
          <span className="h-[24px] w-[24px] flex-none rounded-full border border-dashed border-[var(--lane-dash)]" />
          <input value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} onBlur={add} placeholder="Add an item"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--lane-muted)]" />
        </label>
      </div>
      <div className="lane-divider mt-[19px]" />
      <div className="mt-[17px] flex flex-col gap-[14px]">
        {(task.comments ?? []).map((c, i) => (
          <motion.p key={c.created + i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={\`flex gap-[11px] leading-[1.35] \${text}\`}>
            <Avatar member={member(c.author)} name={c.author} size={33} />
            <span><b className="font-semibold">{c.author}</b> {c.text}</span>
          </motion.p>
        ))}
      </div>
      <label className="mt-[20px] flex h-[56px] flex-none items-center gap-[11px] rounded-full border border-transparent bg-white/70 pl-[11px] transition-colors duration-300 focus-within:border-[var(--swatch-1)] pr-[16px]">
        <span className="sr-only">Comment</span>
        <Avatar member={member(me)} name={me} size={33} />
        <input value={comment} onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && post()} placeholder="Write a comment…"
          className={\`min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--lane-muted)] \${text}\`} />
      </label>
    </>
  );
}
\`\`\`

## src/components/lane/useBoard.js
\`\`\`js
import { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { COLUMNS, SEED_MEMBERS, SETTINGS, seedTasks } from './data';
import { loadSeeded } from './seedOnce';

export function useBoard() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [me, setMe] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loaded, setLoaded] = useState(false);
  // The tasks are the unsaved samples (see loadSeeded): changes stay on the page.
  const [unsaved, setUnsaved] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await base44.auth.me().catch(() => null);
      const { settings: saved, rows: [taskRows, memberRows], bundled } = await loadSeeded({ entity: base44.entities.BoardSettings, seed: SETTINGS }, [
        { entity: base44.entities.Task, seed: seedTasks(), key: 'title', sort: 'position' },
        { entity: base44.entities.TeamMember, seed: SEED_MEMBERS, key: 'sort_order', sort: 'sort_order' },
      ], user);
      setSettings(saved);
      setUnsaved(bundled[0]);
      setTasks(taskRows);
      const sorted = memberRows.sort((a, b) => a.sort_order - b.sort_order);
      setMembers(sorted);
      setMe(user?.full_name ?? sorted[0]?.name ?? 'You');
    })().finally(() => setLoaded(true));
  }, []);

  const columns = useMemo(() => COLUMNS.map((c) => ({
    ...c,
    tasks: tasks.filter((t) => t.status === c.id).sort((a, b) => a.position - b.position),
  })), [tasks]);

  // The board shows a change at once; a write that fails puts back only the fields it changed,
  // so other writes that did save (a renumbered card, a comment) stay.
  const persist = (writes) => {
    if (unsaved) return Promise.resolve();
    const before = writes.map(({ id, changes }) => {
      const row = tasks.find((t) => t.id === id);
      return { id, fields: Object.fromEntries(Object.keys(changes).map((k) => [k, row?.[k]])) };
    });
    return Promise.allSettled(writes.map(({ id, changes }) => base44.entities.Task.update(id, changes))).then((results) => {
      const failed = before.filter((_, i) => results[i].status === 'rejected');
      if (!failed.length) return;
      console.error(results.find((r) => r.status === 'rejected').reason);
      setTasks((rows) => rows.map((t) => ({ ...t, ...failed.find((f) => f.id === t.id)?.fields })));
    });
  };

  const save = (id, changes) => {
    setTasks((rows) => rows.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    return persist([{ id, changes }]);
  };

  return {
    loaded,
    settings,
    columns,
    members,
    me,
    member: (name) => members.find((m) => m.name === name),
    task: (id) => tasks.find((t) => t.id === id),
    save,
    /** Moves a task into column \`status\` above the card \`before\` (null: last), renumbering only the cards whose place changed. */
    move: (id, status, before) => {
      const target = columns.find((c) => c.id === status).tasks.filter((t) => t.id !== id);
      const index = before ? target.findIndex((t) => t.id === before) : -1;
      target.splice(index < 0 ? target.length : index, 0, tasks.find((t) => t.id === id));
      const changed = target.map((t, i) => ({ t, changes: { status, position: i + 1 } }))
        .filter(({ t, changes }) => t.status !== changes.status || t.position !== changes.position);
      setTasks((rows) => rows.map((t) => ({ ...t, ...changed.find((c) => c.t.id === t.id)?.changes })));
      return persist(changed.map(({ t, changes }) => ({ id: t.id, changes })));
    },
    create: async (draft) => {
      // After the column's highest rank: a card moved out leaves a gap, so the count could repeat one.
      const position = Math.max(0, ...(columns.find((c) => c.id === draft.status)?.tasks.map((task) => task.position) ?? [])) + 1;
      const row = { ...draft, position, checklist: [], comments: [] };
      const created = unsaved ? { ...row, id: \`local-\${Date.now()}\` } : await base44.entities.Task.create(row);
      setTasks((rows) => [...rows, created]);
      return created;
    },
  };
}
\`\`\`

## src/components/lane/useDrag.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const THRESHOLD = 4;
const LONG_PRESS = 300;
const TOUCH_SLOP = 8;

/**
 * Pointer drag for cards. A mouse press that moves a few pixels becomes a drag; a touch press lifts
 * only after a ~300ms hold (moving sooner is a scroll). The drag follows the pointer and reports the
 * column and slot under it; a press that never lifts is a click.
 */
export function useDrag({ onDrop }) {
  const [drag, setDrag] = useState(null);
  const press = useRef(null);
  const dragged = useRef(false);
  const columnsRef = useRef({});

  const slotAt = (x, y, id) => {
    const hit = Object.entries(columnsRef.current).find(([, el]) => {
      const r = el?.getBoundingClientRect();
      return r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    });
    if (!hit) return null;
    const cards = [...hit[1].querySelectorAll('[data-card]')].filter((el) => el.dataset.card !== id);
    const index = cards.filter((el) => { const r = el.getBoundingClientRect(); return y > r.top + r.height / 2; }).length;
    // \`before\` names the card it lands above, so a drop into a filtered column keeps its place among hidden cards.
    return { status: hit[0], index, before: cards[index]?.dataset.card ?? null };
  };

  const follow = (p, x, y) => {
    p.dragging = true;
    p.lastX = x;
    p.lastY = y;
    setDrag({ id: p.id, from: p.from, x: x - p.dx, y: y - p.dy, px: x, py: y, width: p.width, height: p.height, over: slotAt(x, y, p.id) });
  };

  useEffect(() => {
    const move = (e) => {
      const p = press.current;
      if (!p) return;
      const far = Math.hypot(e.clientX - p.x, e.clientY - p.y);
      if (p.touch && !p.dragging) {
        if (far > TOUCH_SLOP) { clearTimeout(p.timer); press.current = null; }
        return;
      }
      if (!p.dragging && far < THRESHOLD) return;
      follow(p, e.clientX, e.clientY);
    };
    const up = (e) => {
      const p = press.current;
      press.current = null;
      clearTimeout(p?.timer);
      if (!p?.dragging) return;
      // The click the browser sends right after this pointerup ends the drag; it isn't an open.
      dragged.current = true;
      setTimeout(() => { dragged.current = false; }, 0);
      const over = slotAt(e.clientX, e.clientY, p.id);
      setDrag(null);
      if (over) onDrop(p.id, over.status, over.before);
    };
    const cancel = () => { clearTimeout(press.current?.timer); press.current = null; setDrag(null); };
    // A lifted card owns the gesture: stop the page from scrolling under the finger.
    const hold = (e) => press.current?.dragging && e.cancelable && e.preventDefault();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('touchmove', hold, { passive: false });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('touchmove', hold);
    };
  });

  return {
    drag,
    /** Re-reads the slot under a still pointer, e.g. after the board auto-scrolls. */
    refresh: () => { const p = press.current; if (p?.dragging) follow(p, p.lastX, p.lastY); },
    columnRef: (status) => (el) => { columnsRef.current[status] = el; },
    cardProps: (id, onOpen) => ({
      'data-card': id,
      onPointerDown: (e) => {
        if (e.button !== 0) return;
        const r = e.currentTarget.getBoundingClientRect();
        const from = Object.entries(columnsRef.current).find(([, el]) => el?.contains(e.currentTarget))?.[0];
        const p = { id, from, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, width: r.width, height: r.height, touch: e.pointerType === 'touch' };
        press.current = p;
        if (p.touch) p.timer = setTimeout(() => { navigator.vibrate?.(12); follow(p, p.x, p.y); }, LONG_PRESS);
      },
      onClick: () => !dragged.current && onOpen(id),
      onContextMenu: (e) => e.preventDefault(),
    }),
  };
}
\`\`\`

## src/components/lane/useIsPhone.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 767px)';

export function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const onChange = () => setPhone(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return phone;
}
\`\`\`

## src/pages/ProjectBoard.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import '@/components/lane/lane.css';
import Header from '@/components/lane/Header';
import Board from '@/components/lane/Board';
import MobileBoard from '@/components/lane/MobileBoard';
import DetailPanel from '@/components/lane/DetailPanel';
import NewTaskDialog from '@/components/lane/NewTaskDialog';
import { useBoard } from '@/components/lane/useBoard';
import { useDrag } from '@/components/lane/useDrag';
import { useIsPhone } from '@/components/lane/useIsPhone';

export default function ProjectBoard() {
  const board = useBoard();
  const dragger = useDrag({ onDrop: board.move });
  const phone = useIsPhone();
  const [openId, setOpenId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [person, setPerson] = useState(null);
  const [priority, setPriority] = useState(null);
  const open = openId && board.task(openId);
  const BoardView = phone ? MobileBoard : Board;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setOpenId(null), setAdding(false));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="lane relative flex h-screen min-h-[720px] flex-col overflow-hidden px-[43px] pb-[44px] pt-[31px] max-lg:h-auto max-md:h-[100dvh] max-md:min-h-0 max-md:px-[24px] max-md:pb-0 max-md:pt-[20px] md:min-w-[640px]">
      <div className="lane-arches pointer-events-none absolute inset-x-[-8%] bottom-[-80px] h-[calc(100%+80px)] max-md:fixed" />
      <div className="lane-grain pointer-events-none absolute inset-0" />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Header settings={board.settings} members={board.members} me={board.me} person={person} onPerson={setPerson} priority={priority} onPriority={setPriority} onNew={() => setAdding(true)} />
        <div className="mt-[24px] flex min-h-0 flex-1 max-md:mt-[18px]">
          {board.loaded && <LayoutGroup>
            <BoardView columns={board.columns} member={board.member} dragger={dragger} onOpen={setOpenId}
              visible={(t) => (!person || t.assignee === person) && (!priority || t.priority === priority)} />
          </LayoutGroup>}
        </div>
      </div>
      <AnimatePresence>
        {open && <DetailPanel key={open.id} task={open} phone={phone} member={board.member} members={board.members} me={board.me} onSave={(changes) => board.save(open.id, changes)} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
      {adding && <NewTaskDialog members={board.members} onClose={() => setAdding(false)} onCreate={async (draft) => { const created = await board.create(draft); setAdding(false); setOpenId(created.id); }} />}
    </div>
  );
}
\`\`\`
`;export{e as default};