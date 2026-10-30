var e=`# interior_design_visualizer — app files

## base44/entities/Plan.jsonc
\`\`\`json
{
  "name": "Plan",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "room_id": {
      "type": "string"
    },
    "style": {
      "type": "string"
    },
    "pieces": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "price": {
            "type": "number",
            "description": "Euros"
          },
          "x": {
            "type": "number",
            "description": "Pin position, % from the left of the photo"
          },
          "y": {
            "type": "number",
            "description": "Pin position, % from the top"
          }
        },
        "required": [
          "name",
          "price"
        ]
      }
    },
    "total": {
      "type": "number"
    }
  },
  "required": [
    "name",
    "room_id",
    "style",
    "pieces",
    "total"
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

## base44/entities/Render.jsonc
\`\`\`json
{
  "name": "Render",
  "type": "object",
  "properties": {
    "room_id": {
      "type": "string"
    },
    "style": {
      "type": "string",
      "enum": [
        "Scandinavian",
        "Mid-century",
        "Bohemian",
        "Industrial",
        "Minimalist"
      ]
    },
    "image_url": {
      "type": "string",
      "description": "The furnished image, drawn over the room photo (a full render, or a transparent furniture layer)"
    },
    "image_box": {
      "type": "object",
      "description": "Where the image sits in the room's 4:3 frame, in % (left, top, width, height); unset fills the frame",
      "properties": {
        "left": {
          "type": "number"
        },
        "top": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      }
    },
    "pieces": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "price": {
            "type": "number",
            "description": "Euros"
          },
          "x": {
            "type": "number",
            "description": "Pin position, % from the left of the photo"
          },
          "y": {
            "type": "number",
            "description": "Pin position, % from the top"
          }
        },
        "required": [
          "name",
          "price"
        ]
      }
    },
    "total": {
      "type": "number"
    }
  },
  "required": [
    "room_id",
    "style",
    "image_url",
    "pieces",
    "total"
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

## base44/entities/Room.jsonc
\`\`\`json
{
  "name": "Room",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "image_url": {
      "type": "string",
      "description": "The original (empty) photo"
    },
    "image_box": {
      "type": "object",
      "description": "Where the image sits in the room's 4:3 frame, in % (left, top, width, height); unset fills the frame",
      "properties": {
        "left": {
          "type": "number"
        },
        "top": {
          "type": "number"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        }
      }
    },
    "sample": {
      "type": "boolean",
      "default": false
    }
  },
  "required": [
    "name",
    "image_url"
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

## base44/entities/StudioSettings.jsonc
\`\`\`json
{
  "name": "StudioSettings",
  "type": "object",
  "properties": {
    "seeded": {
      "type": "boolean",
      "default": true,
      "description": "Set once the sample rooms and renders are saved"
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

## base44/functions/listRoomPieces/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Reads a furnished room image and returns the 3–6 priced pieces seen in it, each at the centre of
// its object (x/y as % of that image), right-most first.
const STYLES = ['Scandinavian', 'Mid-century', 'Bohemian', 'Industrial', 'Minimalist'];

const PIECES_SCHEMA = {
  type: 'object',
  properties: {
    pieces: {
      type: 'array',
      minItems: 3,
      maxItems: 6,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Short product name, e.g. "Camel armchair"' },
          price: { type: 'number', description: 'Realistic retail price in euros' },
          x: { type: 'number', description: 'Centre of the object, % of the image width from the left' },
          y: { type: 'number', description: 'Centre of the object, % of the image height from the top' },
        },
        required: ['name', 'price', 'x', 'y'],
      },
    },
  },
  required: ['pieces'],
};

const clamp = (v) => Math.min(94, Math.max(6, Number(v) || 50));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Sign in to restyle a room.' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const imageUrl = typeof body.image_url === 'string' ? body.image_url.trim() : '';
    const style = STYLES.includes(body.style) ? body.style : null;
    if (!/^https:\\/\\/\\S+$/.test(imageUrl) || imageUrl.length > 2048) return Response.json({ error: 'image_url must be an https URL.' }, { status: 400 });
    // The room before it was furnished: what it already had isn't for sale.
    const before = typeof body.room_image_url === 'string' && /^https:\\/\\/\\S+$/.test(body.room_image_url.trim()) && body.room_image_url.length <= 2048 ? body.room_image_url.trim() : null;
    if (!style) return Response.json({ error: \`style must be one of: \${STYLES.join(', ')}.\` }, { status: 400 });

    const list = await base44.asServiceRole.integrations.Core.InvokeLLM({
      model: 'gemini_3_8_flash',
      prompt: \`\${before ? 'The first photo is a room as it was; the second is the same room furnished' : 'This photo shows a room furnished'} in the \${style} style. List the 3 to 6 most prominent furniture pieces actually visible in \${before ? 'the furnished photo that were not already in the first one' : 'it'} (furniture, rugs, lamps, plants), each with a short product name, a realistic retail price in euros, and the centre of that object in the furnished image: x as % of the image width from the left edge, y as % of the image height from the top edge. Only list objects you can see.\`,
      file_urls: before ? [before, imageUrl] : [imageUrl],
      response_json_schema: PIECES_SCHEMA,
    });

    const pieces = (Array.isArray(list?.pieces) ? list.pieces : []).slice(0, 6)
      .map((p) => ({ name: String(p?.name ?? '').slice(0, 60), price: Math.max(0, Math.round(Number(p?.price) || 0)), x: clamp(p?.x), y: clamp(p?.y) }))
      .filter((p) => p.name)
      .sort((a, b) => b.x - a.x);
    if (pieces.length < 3) return Response.json({ error: 'Not enough pieces came back.' }, { status: 502 });

    return Response.json({ pieces, total: pieces.reduce((sum, p) => sum + p.price, 0) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## base44/functions/restyleRoom/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Furnishes one room photo in one of five styles and returns the furnished image as soon as it
// exists; its pieces are priced separately (listRoomPieces) while the page reveals it.
const STYLES = ['Scandinavian', 'Mid-century', 'Bohemian', 'Industrial', 'Minimalist'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Sign in to restyle a room.' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const imageUrl = typeof body.room_image_url === 'string' ? body.room_image_url.trim() : '';
    const style = STYLES.includes(body.style) ? body.style : null;
    const roomName = typeof body.room_name === 'string' ? body.room_name.replace(/[\\r\\n]+/g, ' ').trim().slice(0, 60) : '';
    if (!/^https:\\/\\/\\S+$/.test(imageUrl) || imageUrl.length > 2048) return Response.json({ error: 'room_image_url must be an https URL.' }, { status: 400 });
    if (!style) return Response.json({ error: \`style must be one of: \${STYLES.join(', ')}.\` }, { status: 400 });

    const room = roomName ? \`this room (\${roomName})\` : 'this room';
    const image = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: \`Furnish \${room} in a \${style} interior style. Keep the camera angle, framing, aspect ratio, walls, windows, ceiling, floor and light exactly as in the photo; only add furniture, rugs, lamps and plants. Photorealistic interior photography.\`,
      existing_image_urls: [imageUrl],
    });
    if (!image?.url) return Response.json({ error: 'No image came back.' }, { status: 502 });

    return Response.json({ image_url: image.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## src/components/restyle/format.js
\`\`\`js
export const STYLES = ['Scandinavian', 'Mid-century', 'Bohemian', 'Industrial', 'Minimalist'];

export const euro = (value) => '€' + Math.round(value).toLocaleString('en-US');

export const totalOf = (pieces) => pieces.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

/** Inline placement of an image in the room's frame; unset fills it. */
export const boxStyle = (box) =>
  box ? { left: \`\${box.left}%\`, top: \`\${box.top}%\`, width: \`\${box.width}%\`, height: \`\${box.height}%\` } : { inset: 0, width: '100%', height: '100%' };

export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** What the photo says while a new render is made. */
export const STATUS = {
  furnishing: 'Furnishing the room…',
  pricing: 'Pricing the pieces…',
  priceFailed: 'The prices didn’t come through.',
};

/** The signed-in user's initials for the avatar (the design's "MA" when there is no user). */
export const initialsOf = (user) => {
  const name = (user?.full_name || user?.email || '').trim();
  if (!name) return 'MA';
  const words = name.split(/[\\s@._-]+/).filter(Boolean);
  return (words.length > 1 && user?.full_name ? words[0][0] + words[1][0] : name.slice(0, 2)).toUpperCase();
};
\`\`\`

## src/components/restyle/generate.js
\`\`\`js
import { base44 } from '@/api/base44Client';

const FRAME = 4 / 3; // the room's frame; a render with no image_box covers it (object-cover)

// Loads the image (so the reveal never shows it half drawn) and returns its aspect ratio.
const load = (url) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : FRAME);
  img.onerror = () => resolve(FRAME);
  img.src = url;
});

// Pins come back as % of the furnished image; cover-fit crops a wider or taller image, so map them
// to % of the frame it is shown in (centre crop), keeping them inside the photo.
const toFrame = (aspect) => {
  const kx = aspect > FRAME ? aspect / FRAME : 1;
  const ky = aspect < FRAME ? FRAME / aspect : 1;
  const fit = (v, k) => Math.min(94, Math.max(6, Math.round((50 + (v - 50) * k) * 10) / 10));
  return (p) => ({ ...p, x: fit(p.x, kx), y: fit(p.y, ky) });
};

/** Step 1 (restyleRoom): the room photo furnished in a style, loaded and ready to reveal. */
export async function furnishRoom(room, style) {
  const { data } = await base44.functions.invoke('restyleRoom', { room_image_url: room.image_url, room_name: room.name, style });
  await load(data.image_url);
  return data.image_url;
}

/** Step 2 (listRoomPieces): the priced pieces the style added (not what the room photo already had), pinned where they show, right-most first. */
export async function priceRoom(imageUrl, style, roomImageUrl) {
  const [{ data }, aspect] = await Promise.all([base44.functions.invoke('listRoomPieces', { image_url: imageUrl, style, room_image_url: roomImageUrl }), load(imageUrl)]);
  const pieces = data.pieces.map(toFrame(aspect)).sort((a, b) => b.x - a.x);
  return { pieces, total: data.total };
}
\`\`\`

## src/components/restyle/ListSheet.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { euro, totalOf } from './format';

const PEEK = 'calc(334px + env(safe-area-inset-bottom))';
const OPEN = 'calc(100dvh - 88px)';

/** Phone: the shopping list as a bottom sheet. Peek shows the header, two rows and the total;
 *  drag the handle up (or tap it) for every row and "Add all to plan". */
export default function ListSheet({ style, rows, totalShown, active, setActive, onAddAll }) {
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState(null); // live height in px while dragging
  const start = useRef(null);
  const sheet = useRef(null);
  const empty = rows.length === 0;

  useEffect(() => {
    const move = (e) => start.current && setDrag(Math.max(200, start.current.h - (e.clientY - start.current.y)));
    const up = (e) => {
      if (!start.current) return;
      const dy = e.clientY - start.current.y;
      setOpen((o) => (Math.abs(dy) < 6 ? !o : dy < 0));
      start.current = null;
      setDrag(null);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []);

  const grab = (e) => { start.current = { y: e.clientY, h: sheet.current.offsetHeight }; };

  return (
    <motion.aside ref={sheet} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      style={{ height: drag ?? (open ? OPEN : PEEK), transition: drag ? 'none' : 'height 0.35s cubic-bezier(0.33,1,0.68,1)' }}
      className="absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[28px] bg-[var(--panel)] px-[18px] pb-[calc(92px+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
      <div onPointerDown={grab} className="flex-none touch-none cursor-grab">
        <button type="button" aria-label={open ? 'Collapse the list' : 'Expand the list'} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setOpen((o) => !o))} className="flex h-[28px] w-full items-center justify-center">
          <span className="h-[5px] w-[40px] rounded-full bg-[color-mix(in_srgb,var(--ink)_22%,transparent)]" />
        </button>
        <div className="flex h-[40px] items-center justify-between">
          <h2 className="rs-serif text-[24px]">Shopping list</h2>
          {style && <span className="rs-serif text-[20px] text-[var(--muted)]">{style}</span>}
        </div>
      </div>

      <div className={\`mt-[6px] min-h-0 flex-1 \${open ? 'overflow-y-auto' : 'overflow-hidden'}\`}>
        {empty ? (
          <div className="pt-[10px] text-center">
            <div className="rs-serif text-[22px]">No pieces yet</div>
            <p className="mt-[4px] text-[14px] leading-[20px] text-[var(--body)]">Pick a style and every piece in the room lands here with its price.</p>
          </div>
        ) : rows.map((p, i) => (
          <motion.button key={i} type="button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
            onClick={() => setActive(active === i ? null : i)}
            className={\`mb-[8px] flex h-[60px] w-full items-center justify-between rounded-[16px] px-[16px] text-left \${active === i ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'bg-[var(--surface)]'}\`}>
            <span>
              <span className="block text-[15px] font-medium leading-[19px]">{p.name}</span>
              <span className={\`block text-[14px] leading-[19px] \${active === i ? '' : 'text-[var(--muted)]'}\`}>{euro(p.price)}</span>
            </span>
            <span className="text-[18px] text-[var(--muted)]">›</span>
          </motion.button>
        ))}
      </div>

      <motion.div animate={{ opacity: totalShown && !empty ? 1 : 0 }} transition={{ duration: 0.45 }} className="rs-serif flex h-[36px] flex-none items-center justify-between px-[2px] text-[17px]">
        <span className="text-[var(--muted)]">{rows.length} {rows.length === 1 ? 'piece' : 'pieces'}</span>
        <span>{euro(totalOf(rows))}</span>
      </motion.div>
      {(open || drag) && (
        <button type="button" disabled={!totalShown || empty} onClick={onAddAll}
          className="rs-serif mt-[6px] flex h-[52px] w-full flex-none items-center justify-center gap-[6px] rounded-full bg-[var(--ink)] text-[17px] text-[var(--canvas)] active:scale-[0.98] disabled:bg-[var(--muted)]">
          <span className="text-[20px] leading-none">+</span> Add all to plan
        </button>
      )}
    </motion.aside>
  );
}
\`\`\`

## src/components/restyle/loadStudio.js
\`\`\`js
import { base44 } from '@/api/base44Client';
import { SAMPLE_RENDERS, SAMPLE_ROOMS } from './samples';
import { totalOf } from './format';

const { Room, Render, Plan, StudioSettings } = base44.entities;

// One request per table: entity calls are rate-limited per app, so a seed of single creates fails partway.
const createAll = async (Entity, rows) => (rows.length ? Entity.bulkCreate(rows) : []);
// Each user's own rows only, filtered on the server: admins can read everyone's (see the entities' rls).
const mineOf = (me) => (Entity, sort, limit) => (me ? Entity.filter({ created_by_id: me.id }, sort, limit) : Entity.list(sort, limit));
const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));

// Adds the samples still missing; another first load (a second tab) may seed at the same time, so
// each copy this load added that has an older twin is removed again: the oldest copy stays.
async function addMissing(mine, Entity, rows, samples, same, sort, limit) {
  const added = await createAll(Entity, samples.filter((s) => !rows.some((r) => same(r, s))));
  if (!added.length) return rows;
  const now = await mine(Entity, sort, limit);
  const extra = added.filter((m) => now.some((r) => r.id !== m.id && same(r, m) && byAge(r, m) < 0));
  if (extra.length) await Entity.deleteMany({ id: { $in: extra.map((m) => m.id) } });
  return now.filter((r) => !extra.some((m) => m.id === r.id));
}

// The sample rooms and their stored renders, created once: the settings row that marks the app set up
// is written only after both, so a reload mid-seed resumes and a deleted sample never comes back.
async function load() {
  const me = await base44.auth.me().catch(() => null);
  // Signed out, the rls refuses the seed with a 403: it reads as sign-in-required, not as a reload.
  return loadFor(me).catch((e) => { throw me ? e : Object.assign(new Error('Sign in required'), { status: 401 }); });
}

async function loadFor(me) {
  const mine = mineOf(me);
  const [settings] = await mine(StudioSettings);
  let rooms = await mine(Room, 'created_date', 200);
  let renders = await mine(Render, 'created_date', 1000);
  const plans = await mine(Plan, '-created_date', 200);
  if (!settings) {
    rooms = await addMissing(mine, Room, rooms, SAMPLE_ROOMS.map(({ key, ...r }) => r), (a, b) => a.image_url === b.image_url, 'created_date', 200);
    const roomOf = (key) => rooms.find((r) => r.image_url === SAMPLE_ROOMS.find((s) => s.key === key).image_url);
    const samples = SAMPLE_RENDERS.map(({ room, ...s }) => ({ ...s, room_id: roomOf(room).id, total: totalOf(s.pieces) }));
    renders = await addMissing(mine, Render, renders, samples, (a, b) => a.room_id === b.room_id && a.style === b.style, 'created_date', 1000);
    const marker = await StudioSettings.create({ seeded: true });
    const [oldest] = (await mine(StudioSettings)).sort(byAge);
    if (oldest && oldest.id !== marker.id) await StudioSettings.delete(marker.id);
  }
  return { me, rooms: rooms.sort(byAge), renders, plans };
}

// Single-flight: StrictMode (and any two first mounts at once) would both see no marker and seed twice.
let pending = null;
export const loadOnce = () => (pending ??= load().finally(() => { pending = null; }));
\`\`\`

## src/components/restyle/PieceCard.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { euro } from './format';

/** Phone: a tapped pin's card, full width over the bottom of the photo. */
export default function PieceCard({ piece, onAdd, onClose }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }} onPointerDown={(e) => e.stopPropagation()}
      className="absolute inset-x-[12px] bottom-[12px] z-10 rounded-[20px] bg-[var(--surface)] p-[16px] shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="rs-serif text-[22px] leading-tight">{piece.name}</div>
          <span className="mt-[8px] inline-block rounded-full bg-[var(--accent)] px-[10px] py-[3px] text-[14px] font-medium text-[var(--on-accent)]">{euro(piece.price)}</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="-mr-[8px] -mt-[8px] flex h-[44px] w-[44px] flex-none items-center justify-center text-[22px] text-[var(--muted)]">×</button>
      </div>
      <button type="button" onClick={() => onAdd(piece)} className="mt-[14px] flex h-[48px] w-full items-center justify-center rounded-full bg-[var(--ink)] text-[15px] font-medium text-[var(--canvas)] active:scale-[0.98]">+ Add to plan</button>
    </motion.div>
  );
}
\`\`\`

## src/components/restyle/pinLayout.js
\`\`\`js
import { useEffect, useState } from 'react';

/** The photo card's size in px, kept current. */
export function useBoxSize(ref) {
  const [size, setSize] = useState(null);
  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

const labelWidth = (name) => name.length * 4.6 + 24; // dot, gap, padding: an estimate

/**
 * Per piece: does its label sit left of the dot (it would run off the card's right edge) and is it
 * shown at all (a label that would overlap one placed before it keeps only its dot; tap still opens it).
 * Mirrors the frame's CSS: cover-fit 4:3, centred, or panned to \`fx\` when \`pan\`.
 */
export function pinLayout(pieces, size, { pan, fx }) {
  if (!size) return () => ({ flip: false, label: true });
  const fw = Math.max(size.w, (size.h * 4) / 3);
  const fh = Math.max(size.h, (size.w * 3) / 4);
  const left = pan ? Math.min(0, Math.max(size.w - fw, size.w / 2 - fx * fw)) : (size.w - fw) / 2;
  const top = (size.h - fh) / 2;
  const placed = [];
  const out = new Map();
  for (const p of pieces) {
    const x = left + (p.x / 100) * fw;
    const y = top + (p.y / 100) * fh;
    const w = labelWidth(p.name);
    const flip = x + w > size.w - 8;
    const box = { l: flip ? x - w : x, r: flip ? x : x + w, t: y - 11, b: y + 11 };
    const label = !placed.some((o) => box.l < o.r && box.r > o.l && box.t < o.b && box.b > o.t);
    if (label) placed.push(box);
    out.set(p, { flip, label });
  }
  return (p) => out.get(p) ?? { flip: false, label: true };
}
\`\`\`

## src/components/restyle/Pins.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { euro } from './format';

/** A pin per piece (\`active\` is its index: two pieces may share a name): white dot with a halo and its name; hover or tap opens the piece card. */
export default function Pins({ pieces, reveal, active, setActive, onAdd, phone, layout }) {
  return (
    <div className={\`absolute inset-0 transition-opacity duration-200 \${reveal.comparing ? 'pointer-events-none opacity-0' : ''}\`}>
      {pieces.map((p, i) => {
        const { flip, label } = layout(p);
        return reveal.pinShown(p) && (
          <motion.div key={i} className="absolute" style={{ left: \`\${p.x}%\`, top: \`\${p.y}%\`, zIndex: active === i ? 5 : 1 }}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            onMouseEnter={phone ? undefined : () => setActive(i)} onMouseLeave={phone ? undefined : () => setActive(null)}>
            <button type="button" onClick={() => setActive(active === i ? null : i)} aria-label={\`\${p.name}, \${euro(p.price)}\`}
              className={\`absolute left-0 top-0 flex -translate-y-1/2 items-center gap-[4px] whitespace-nowrap \${phone ? 'min-h-[44px]' : ''} \${flip ? 'flex-row-reverse -translate-x-[calc(100%-4.5px)]' : '-translate-x-[4.5px]'}\`}>
              <span className="h-[9px] w-[9px] flex-none rounded-full bg-[var(--surface)] shadow-[0_0_0_3px_rgba(255,255,255,0.45),0_1px_4px_rgba(0,0,0,0.25)]" />
              {label && <span className="rs-serif flex h-[19px] items-center rounded-full bg-[var(--surface)] px-[7px] pt-px text-[11px] text-[var(--ink)] shadow-[0_2px_8px_rgba(0,0,0,0.12)]">{p.name}</span>}
            </button>
            <AnimatePresence>
              {active === i && !phone && (
                <motion.div initial={{ opacity: 0, x: '-50%', y: 8, scale: 0.9 }} animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }} exit={{ opacity: 0, x: '-50%', y: 8, scale: 0.9 }}
                  transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
                  className="absolute bottom-[14px] left-0 w-[172px] origin-bottom rounded-[13px] bg-[var(--surface)] p-[12px] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  <div className="rs-serif text-[15px] leading-tight">{p.name}</div>
                  <span className="mt-[6px] inline-block rounded-full bg-[var(--accent)] px-[8px] py-[2px] text-[11px] font-medium text-[var(--on-accent)]">{euro(p.price)}</span>
                  <button type="button" onClick={() => onAdd(p)} className="mt-[10px] flex h-[28px] w-full items-center justify-center rounded-full bg-[var(--ink)] text-[11px] font-medium text-[var(--canvas)] active:scale-[0.97]">+ Add to plan</button>
                  <span className="absolute -bottom-[5px] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rotate-45 bg-[var(--surface)]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
\`\`\`

## src/components/restyle/restyle.css
\`\`\`css
@font-face{font-family:"Minion Pro";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/minion-pro-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-500-normal.woff2) format("woff2")}

/* The look (Sage & Lime): ink, accent, canvas, panel, muted, body as --swatch-1..6; surfaces stay white. */
:root{
  --swatch-1:#171A17;--swatch-1-ink:#FFFFFF;
  --swatch-2:#EEFC8F;--swatch-2-ink:#111111;
  --swatch-3:#F5F9DF;--swatch-3-ink:#111111;
  --swatch-4:#E2E8DA;--swatch-4-ink:#111111;
  --swatch-5:#7F857C;--swatch-5-ink:#111111;
  --swatch-6:#4F554D;--swatch-6-ink:#FFFFFF;
  --ui-surface:#FFFFFF;
}
/* gallery-look */

.rs{
  --ink:var(--swatch-1);--accent:var(--swatch-2);--on-accent:var(--swatch-2-ink);--canvas:var(--swatch-3);
  --panel:var(--swatch-4);--muted:var(--swatch-5);--body:var(--swatch-6);--surface:var(--ui-surface);
  font-family:"Neue Haas Grotesk","Helvetica Neue",Helvetica,Arial,sans-serif;color:var(--ink);background:var(--canvas);
  font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;
}
.rs-serif{font-family:"Minion Pro","EB Garamond",Georgia,"Times New Roman",serif;font-weight:400}
.rs-frame{position:absolute;left:50%;top:50%;width:max(100cqw,133.334cqh);height:max(100cqh,75cqw);transform:translate(-50%,-50%)}
.rs-push{animation:rs-push 10s ease-out forwards}
@keyframes rs-push{to{transform:scale(1.06)}}
@media (prefers-reduced-motion:reduce){.rs-push{animation:none}}
/* Phone: the frame pans toward the pieces (--fx, 0..1) instead of centring, so a portrait card still shows them. */
.rs-pan{left:clamp(calc(100cqw - max(100cqw,133.334cqh)),calc(50cqw - var(--fx,0.5)*max(100cqw,133.334cqh)),0px);transform:translateY(-50%)}
.rs-noscroll{scrollbar-width:none}
.rs-noscroll::-webkit-scrollbar{display:none}
.rs-phone-panel button,.rs-phone-panel label{min-height:44px;font-size:14px}
\`\`\`

## src/components/restyle/RoomList.jsx
\`\`\`jsx
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

/** The Rooms panel's rows: open a room, rename it in place, or delete it (a second tap confirms). */
export default function RoomList({ rooms, current, onOpen, onRename, onDelete, phone }) {
  const [editing, setEditing] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const hit = phone ? 'h-[44px] w-[44px]' : 'h-[28px] w-[28px]';
  const save = (id, name) => { setEditing(null); onRename(id, name); };

  return rooms.map((r) => {
    const on = r.id === current;
    return (
      <div key={r.id} className={\`mb-[6px] flex items-center gap-[2px] rounded-[10px] pr-[4px] text-[12px] \${on ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'bg-[var(--panel)]'}\`}>
        {editing === r.id ? (
          <input autoFocus defaultValue={r.name} aria-label="Room name" maxLength={60}
            onBlur={(e) => save(r.id, e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { e.stopPropagation(); setEditing(null); } }}
            className="m-[4px] min-w-0 flex-1 rounded-[6px] bg-[var(--surface)] px-[8px] py-[6px] text-[var(--ink)] outline-none" />
        ) : (
          <button type="button" onClick={() => onOpen(r.id)} className="flex min-w-0 flex-1 items-center gap-[10px] px-[10px] py-[8px] text-left">
            <img src={r.image_url} alt="" className="h-[30px] w-[40px] flex-none rounded-[6px] object-cover" />
            <span className="truncate">{r.name}</span>
          </button>
        )}
        {confirming === r.id ? (
          <button type="button" onClick={() => { setConfirming(null); onDelete(r.id); }} onBlur={() => setConfirming(null)} autoFocus
            className={\`\${phone ? 'h-[44px]' : 'h-[28px]'} flex-none rounded-full px-[8px] text-[11px] font-medium underline underline-offset-2\`}>Delete?</button>
        ) : (
          <>
            <button type="button" aria-label={\`Rename \${r.name}\`} onClick={() => setEditing(r.id)} className={\`\${hit} flex flex-none items-center justify-center rounded-full opacity-60 hover:opacity-100\`}><Pencil size={13} /></button>
            <button type="button" aria-label={\`Delete \${r.name}\`} onClick={() => setConfirming(r.id)} className={\`\${hit} flex flex-none items-center justify-center rounded-full opacity-60 hover:opacity-100\`}><Trash2 size={13} /></button>
          </>
        )}
      </div>
    );
  });
}
\`\`\`

## src/components/restyle/RoomStage.jsx
\`\`\`jsx
import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STATUS, STYLES, boxStyle } from './format';
import Pins from './Pins';
import PieceCard from './PieceCard';
import { pinLayout, useBoxSize } from './pinLayout';
import WelcomeCard from './WelcomeCard';

const EASE_OUT = [0.33, 1, 0.68, 1];

export default function RoomStage({ studio, reveal, welcome, onBuild, active, setActive, phone, tablet, stack }) {
  const { room, shown, style, busy, error, stage } = studio;
  const render = shown?.render;
  const piece = phone && active !== null && render?.pieces?.[active];
  // Phone: the frame pans to the middle of the pieces.
  const card = useRef(null);
  const size = useBoxSize(card);
  const fx = render?.pieces?.length ? render.pieces.reduce((sum, p) => sum + p.x, 0) / render.pieces.length / 100 : 0.5;
  // Stacked: the welcome card needs the height, so the photo grows until Build now.
  const shape = stack ? \`relative w-full rounded-[19px] \${welcome ? 'min-h-0 flex-1' : 'flex-none aspect-[4/3] max-h-[64%]'}\`
    : !phone ? 'relative min-w-0 flex-1 rounded-[19px]'
    : welcome ? 'absolute inset-0' : 'relative mx-[12px] mt-[calc(12px+env(safe-area-inset-top))] h-[50dvh] flex-none rounded-[28px]';
  const drop = (e) => {
    e.preventDefault();
    studio.upload(e.dataTransfer.files?.[0]);
  };

  return (
    <section ref={card} onPointerDown={reveal.onPointerDown} onDragOver={(e) => e.preventDefault()} onDrop={drop}
      className={\`\${shape} touch-none select-none overflow-hidden bg-[var(--panel)] [container-type:size] \${reveal.phase === 'done' ? 'cursor-ew-resize' : ''}\`}>
      {room && (
        <div className={\`rs-frame \${phone || tablet ? 'rs-pan' : ''}\`} style={phone || tablet ? { '--fx': fx } : undefined}>
          <div ref={reveal.stage} className={\`absolute inset-0 origin-[50%_60%] \${reveal.idle ? 'rs-push' : ''}\`}>
            <img src={room.image_url} alt={room.name} draggable={false} className="absolute max-w-none object-cover" style={boxStyle(room.image_box)} />
            {render && (
              <div className="absolute inset-0" style={{ clipPath: \`inset(0 0 0 \${reveal.pos}%)\` }}>
                <img src={render.image_url} alt={\`\${room.name}, \${render.style}\`} draggable={false} className="absolute max-w-none object-cover" style={boxStyle(render.image_box)} />
              </div>
            )}
            {render && <Pins pieces={render.pieces ?? []} reveal={reveal} active={active} setActive={setActive} onAdd={(p) => studio.addToPlan([p])} phone={phone} layout={pinLayout(render.pieces ?? [], size, { pan: phone || tablet, fx })} />}
            {(render || busy) && !welcome && (
              <div className={\`pointer-events-none absolute inset-y-0 w-[1.5px] -translate-x-1/2 \${render ? 'bg-[var(--surface)]' : ''}\`} style={{ left: \`\${render ? reveal.pos : 100}%\` }}>
                <span className={\`absolute left-1/2 top-[44%] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--accent)] \${phone ? 'h-[48px] w-[48px] text-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.2)]' : 'h-[23px] w-[23px] text-[9px]'} tracking-[1px] text-[var(--on-accent)] \${busy ? 'animate-pulse' : ''}\`}>‹ ›</span>
              </div>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {reveal.comparing && ['Before', 'After'].map((label) => (
          <motion.span key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={\`rs-serif pointer-events-none absolute flex items-center rounded-full bg-[var(--surface)] pt-px tracking-[1px] \${phone ? 'bottom-[12px] h-[24px] px-[10px] text-[11px]' : 'bottom-[15px] h-[16px] px-[7px] text-[8.5px]'} \${label === 'Before' ? (phone ? 'left-[12px]' : 'left-[16px]') : (phone ? 'right-[12px]' : 'right-[16px]')}\`}>
            {label.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>

      {!welcome && room && (
        <div className={\`absolute flex overflow-x-auto [scrollbar-width:none] \${phone ? 'rs-noscroll left-0 right-0 top-[12px] gap-[6px] px-[12px]' : \`left-[16px] right-[16px] top-[16px] gap-[5px] \${tablet ? 'flex-wrap' : ''}\`}\`}>
          {STYLES.map((s, i) => (
            <motion.button key={s} type="button" onClick={() => studio.pickStyle(s)} disabled={!room}
              initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.05 * i, ease: EASE_OUT }} whileTap={{ scale: 0.94 }}
              className={\`\${phone ? 'h-[44px] px-[18px] text-[14px]' : 'h-[25px] w-[105px] text-[12px]'} flex-none rounded-full font-medium shadow-[0_2px_10px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors \${style === s ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-[var(--ink)]'}\`}>
              {s}
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {stage && !welcome && (
          <motion.div key={stage} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}
            className={\`absolute inset-x-0 mx-auto flex w-fit items-center gap-[10px] rounded-full bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-[var(--body)] shadow-[0_6px_20px_rgba(0,0,0,0.12)] backdrop-blur-md \${phone ? 'bottom-[48px] h-[44px] px-[18px] text-[14px]' : 'bottom-[40px] h-[30px] px-[14px] text-[12px]'}\`}>
            {stage !== 'priceFailed' && <span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[var(--ink)]" />}
            {STATUS[stage]}
            {stage === 'priceFailed' && (
              <button type="button" onClick={studio.retryPricing} className={\`font-medium text-[var(--ink)] underline underline-offset-2 \${phone ? 'min-h-[44px]' : ''}\`}>Try again</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="absolute bottom-[16px] left-1/2 flex -translate-x-1/2 items-center gap-[10px] rounded-full bg-[var(--surface)] px-4 py-2 text-[12px] text-[var(--body)] shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
          {error}
          {studio.needsSignIn && <button type="button" onClick={studio.signIn} className={\`font-medium text-[var(--ink)] underline underline-offset-2 \${phone ? 'min-h-[44px]' : ''}\`}>Sign in</button>}
        </div>
      )}

      <AnimatePresence>{piece && <PieceCard key={active} piece={piece} onAdd={(p) => studio.addToPlan([p])} onClose={() => setActive(null)} />}</AnimatePresence>
      <AnimatePresence>{welcome && <WelcomeCard onBuild={onBuild} onUpload={studio.upload} phone={phone} />}</AnimatePresence>
    </section>
  );
}
\`\`\`

## src/components/restyle/samples.js
\`\`\`js
const ASSETS = 'https://media.base44.com/images/public/builder-assets/gallery/interior-design-visualizer';

// The sample rooms, created once. Boxes place each photo in the room's 4:3 frame (% of it), as the
// designer composed them: the square loft photo is cropped from its top, the furniture layers sit
// where they meet the floor.
export const SAMPLE_ROOMS = [
  { key: 'loft', name: 'Concrete loft', image_url: \`\${ASSETS}/dining-loft-empty.jpg\`, image_box: { left: -0.87, top: -0.46, width: 101.67, height: 135.56 }, sample: true },
  { key: 'bedroom', name: 'White bedroom', image_url: \`\${ASSETS}/bedroom-empty.jpg\`, sample: true },
  { key: 'kitchen', name: 'Open kitchen', image_url: \`\${ASSETS}/kitchen-empty.jpg\`, sample: true },
];

// Stored renders, so the samples never call the generator: a transparent furniture layer over the
// empty photo. Pieces in list order (right-most first), pins at % of the photo.
export const SAMPLE_RENDERS = [
  {
    room: 'loft',
    style: 'Mid-century',
    image_url: \`\${ASSETS}/dining-furniture-cutout.png\`,
    image_box: { left: -1.91, top: 1.74, width: 103.85, height: 103.85 },
    pieces: [
      { name: 'Blue steel sideboard', price: 1900, x: 48.9, y: 50 },
      { name: 'Marble table + 6 chairs', price: 5400, x: 16.2, y: 64.6 },
      { name: 'Geometric wool rug', price: 1150, x: 33.2, y: 71.5 },
      { name: 'Camel armchair', price: 890, x: 25.3, y: 50.6 },
      { name: 'Fiddle-leaf fig', price: 240, x: 17.5, y: 31.3 },
    ],
  },
  {
    room: 'bedroom',
    style: 'Bohemian',
    image_url: \`\${ASSETS}/bedroom-furniture-cutout.png\`,
    image_box: { left: 14.76, top: 18.4, width: 82.81, height: 82.81 },
    pieces: [
      { name: 'Nightstand + ceramic lamp', price: 640, x: 78, y: 53.5 },
      { name: 'Channel-tufted bed', price: 2140, x: 52.4, y: 64.6 },
      { name: 'Floor cushions ×4', price: 360, x: 30.6, y: 70.1 },
    ],
  },
];
\`\`\`

## src/components/restyle/ShoppingList.jsx
\`\`\`jsx
import { AnimatePresence, motion } from 'framer-motion';
import { euro, totalOf } from './format';

const EASE_OUT = [0.33, 1, 0.68, 1];

export default function ShoppingList({ style, rows, totalShown, active, setActive, onAddAll, tablet, stack, compact }) {
  const empty = rows.length === 0;
  return (
    <aside className={\`flex \${stack ? (compact ? 'h-[280px] w-full flex-none' : 'min-h-0 w-full flex-1') : tablet ? 'w-[34%] min-w-[220px] max-w-[280px] flex-none' : 'w-[26.2%] min-w-[250px] max-w-[360px] flex-none'} flex-col rounded-[19px] bg-[var(--panel)] px-[21px] pb-[17px] pt-[20px]\`}>
      <div className="flex h-[26px] items-baseline justify-between">
        <h2 className="rs-serif flex-none text-[18px]">Shopping list</h2>
        <AnimatePresence mode="wait">
          {style && <motion.span key={style} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="rs-serif ml-[8px] min-w-0 truncate text-[18px] text-[var(--muted)]">{style}</motion.span>}
        </AnimatePresence>
      </div>

      <div className="relative mt-[22px] min-h-0 flex-1 overflow-hidden">
        {/* Unmounted the moment a row arrives: an exit fade could leave it ghosting behind the rows. */}
          {empty && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="absolute inset-x-0 top-0">
              {(stack ? [1] : [1, 0.75, 0.4]).map((o) => (
                <div key={o} style={{ opacity: o }} className="mb-[6px] h-[50px] rounded-[12px] border border-dashed border-[color-mix(in_srgb,var(--ink)_16%,transparent)] px-[14px] pt-[15px]">
                  <div className="h-[5px] w-[45%] rounded-full bg-[color-mix(in_srgb,var(--ink)_9%,transparent)]" />
                  <div className="mt-[6px] h-[5px] w-[24%] rounded-full bg-[color-mix(in_srgb,var(--ink)_7%,transparent)]" />
                </div>
              ))}
              <div className={\`\${stack ? 'mt-[14px]' : 'mt-[34px]'} px-[8px] text-center\`}>
                <div className="rs-serif text-[20px]">No pieces yet</div>
                <p className="mt-[5px] text-[11.5px] leading-[17px] text-[var(--body)]">Pick a style and every piece in the room lands here with its price.</p>
              </div>
            </motion.div>
          )}
        <div className={\`absolute inset-0 overflow-y-auto [scrollbar-width:none] \${stack ? 'grid auto-rows-[57px] grid-cols-2 content-start gap-x-[8px]' : ''}\`}>
          {rows.map((p, i) => (
            <motion.button key={i} type="button" layout="position" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: EASE_OUT }}
              onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} onClick={() => setActive(active === i ? null : i)}
              className={\`mb-[6px] flex h-[51px] w-full items-center justify-between rounded-[12px] px-[13px] text-left transition-colors \${active === i ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'bg-[var(--surface)]'}\`}>
              <span>
                <span className="block text-[12.5px] font-medium leading-[16px]">{p.name}</span>
                <span className={\`block text-[12px] leading-[16px] \${active === i ? '' : 'text-[var(--muted)]'}\`}>{euro(p.price)}</span>
              </span>
              <span className="text-[13px] text-[var(--muted)]">›</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div animate={{ opacity: totalShown && !empty ? 1 : 0 }} transition={{ duration: 0.45 }} className="rs-serif mb-[9px] flex items-baseline justify-between px-[2px] text-[13px]">
        <span className="text-[var(--muted)]">{rows.length} {rows.length === 1 ? 'piece' : 'pieces'}</span>
        <span>{euro(totalOf(rows))}</span>
      </motion.div>
      <button type="button" disabled={!totalShown || empty} onClick={onAddAll}
        className="rs-serif flex h-[35px] w-full flex-none items-center justify-center gap-[6px] rounded-full bg-[var(--ink)] text-[13px] text-[var(--canvas)] transition-[background-color,transform] duration-300 active:scale-[0.98] disabled:bg-[var(--muted)] disabled:text-[color-mix(in_srgb,var(--canvas)_85%,transparent)]">
        <span className="text-[15px] leading-none">+</span> Add all to plan
      </button>
    </aside>
  );
}
\`\`\`

## src/components/restyle/Sidebar.jsx
\`\`\`jsx
import { initialsOf } from './format';

export const ICONS = {
  Home: <path d="M4 10.2 12 4l8 6.2V19a2 2 0 0 1-2 2h-3.2v-5.4a2.8 2.8 0 0 0-5.6 0V21H6a2 2 0 0 1-2-2v-8.8z" fill="currentColor" />,
  Rooms: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>,
  Styles: <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" /></>,
  Plan: <><rect x="4.5" y="4.5" width="15" height="15" rx="3" /><path d="M8.5 10h7M8.5 14h7" /></>,
  Saved: <path d="M12 3.8 20.2 12 12 20.2 3.8 12z" strokeLinejoin="round" />,
  Settings: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="2.6" fill="currentColor" /></>,
};
export const NAV = Object.keys(ICONS);

/** Icons only: each opens its panel (Home closes it); the avatar sits at the bottom. */
export default function Sidebar({ open, onOpen, onHome, tablet, user }) {
  return (
    <nav className={\`flex \${tablet ? 'w-[64px] pt-[25px] pb-[24px]' : 'w-[80px] pb-[40px] pt-[41px]'} flex-none flex-col items-center\`}>
      {NAV.map((name) => {
        const current = (open ?? 'Home') === name;
        return (
          <button key={name} type="button" onClick={() => (name === 'Home' ? onHome() : onOpen(open === name ? null : name))} title={name}
            className={\`mb-[17px] flex h-[28px] w-[28px] items-center justify-center rounded-full transition-opacity \${current ? '' : 'opacity-75 hover:opacity-100'}\`}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{ICONS[name]}</svg>
            <span className="sr-only">{name}</span>
          </button>
        );
      })}
      <span title={user?.email} className="rs-serif mt-auto flex h-[27px] w-[27px] items-center justify-center rounded-full bg-[var(--panel)] pt-px text-[12px]">{initialsOf(user)}</span>
    </nav>
  );
}
\`\`\`

## src/components/restyle/SidePanel.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { STYLES, euro } from './format';
import RoomList from './RoomList';

const Row = ({ children, onClick, current }) => (
  <button type="button" onClick={onClick} className={\`mb-[6px] flex w-full items-center gap-[10px] rounded-[10px] px-[10px] py-[8px] text-left text-[12px] \${current ? 'bg-[var(--accent)] text-[var(--on-accent)]' : 'bg-[var(--panel)] hover:bg-[color-mix(in_srgb,var(--panel)_70%,var(--surface))]'}\`}>{children}</button>
);

/** The sidebar's panels: rooms (and upload), styles, saved plans, saved renders, settings. */
export default function SidePanel({ open, studio, onClose, onWelcome, onPick, phone, tablet }) {
  const { rooms, room, renders, plans } = studio;
  const roomName = (id) => rooms.find((r) => r.id === id)?.name ?? 'Room';
  const go = (fn) => () => { fn(); onClose(); };

  return (
    <motion.div initial={phone ? { opacity: 0, y: 12 } : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.2 }}
      className={\`\${phone ? 'rs-phone-panel inset-x-[12px] bottom-[calc(92px+env(safe-area-inset-bottom))] max-h-[60dvh] rounded-[22px] p-[16px]' : \`\${tablet ? 'left-[60px] top-[128px] max-h-[calc(100%-160px)]' : 'left-[76px] top-[125px] max-h-[523px]'} w-[260px] rounded-[16px] p-[14px]\`} absolute z-30 overflow-y-auto bg-[var(--surface)] shadow-[0_18px_50px_rgba(0,0,0,0.16)]\`}>
      <div className="mb-[10px] flex items-center justify-between">
        <h3 className="rs-serif text-[17px]">{open === 'Plan' ? 'Your plans' : open === 'Saved' ? 'Saved looks' : open}</h3>
        <button type="button" onClick={onClose} className="-mr-[6px] flex h-[28px] items-center rounded-full px-[8px] text-[11px] text-[var(--muted)] hover:bg-[var(--panel)]">Close</button>
      </div>

      {open === 'Rooms' && (
        <>
          <RoomList rooms={rooms} current={room?.id} onOpen={(id) => go(() => studio.openRoom(id))()} onRename={studio.renameRoom} onDelete={studio.deleteRoom} phone={phone} />
          <label className="mt-[8px] flex h-[34px] cursor-pointer items-center justify-center rounded-full bg-[var(--ink)] text-[12px] text-[var(--canvas)]">
            Upload a room photo
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { studio.upload(e.target.files?.[0]); onClose(); }} />
          </label>
        </>
      )}

      {open === 'Styles' && STYLES.map((s) => <Row key={s} current={s === studio.style} onClick={go(() => onPick(s))}>{s}</Row>)}

      {open === 'Plan' && (plans.length === 0
        ? <p className="text-[12px] leading-[17px] text-[var(--body)]">No plans yet. Add a piece, or the whole list, to start one.</p>
        : plans.map((p) => (
          <div key={p.id} className="mb-[6px] rounded-[10px] bg-[var(--panel)] px-[10px] py-[8px] text-[12px]">
            <div className="flex justify-between font-medium"><span>{rooms.some((r) => r.id === p.room_id) ? \`\${roomName(p.room_id)} · \${p.style}\` : p.name}</span><span>{euro(p.total)}</span></div>
            <div className="mt-[2px] text-[11px] text-[var(--muted)]">{p.pieces.map((x) => x.name).join(' · ')}</div>
            <button type="button" onClick={() => studio.removePlan(p.id)} className="mt-[4px] text-[11px] text-[var(--muted)] underline">Remove</button>
          </div>
        )))}

      {open === 'Saved' && renders.map((r) => (
        <Row key={r.id} onClick={go(() => { studio.openRoom(r.room_id); onPick(r.style, r.room_id); })}>
          <span className="flex-1">{roomName(r.room_id)}</span><span className="text-[var(--muted)]">{r.style}</span>
        </Row>
      ))}

      {open === 'Settings' && (
        <>
          <Row onClick={go(onWelcome)}>Show the welcome card</Row>
          <p className="mt-[6px] text-[11px] leading-[16px] text-[var(--muted)]">Prices in euros. Renders keep your photo’s camera, walls, windows and floor.</p>
        </>
      )}
    </motion.div>
  );
}
\`\`\`

## src/components/restyle/TabBar.jsx
\`\`\`jsx
import { ICONS, NAV } from './Sidebar';
import { initialsOf } from './format';

/** Phone: the sidebar as a floating pill at the bottom; the open tab sits in an ink circle. */
export default function TabBar({ open, onOpen, onHome, user }) {
  return (
    <nav className="absolute inset-x-[14px] bottom-[calc(14px+env(safe-area-inset-bottom))] z-30 flex h-[64px] items-center justify-between rounded-[32px] bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
      {NAV.map((name) => {
        const current = (open ?? 'Home') === name;
        return (
          <button key={name} type="button" onClick={() => (name === 'Home' ? onHome() : onOpen(open === name ? null : name))} title={name}
            className={\`flex h-[44px] w-[44px] items-center justify-center rounded-full \${current ? 'bg-[var(--ink)] text-[var(--canvas)]' : 'text-[var(--ink)]'}\`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">{ICONS[name]}</svg>
            <span className="sr-only">{name}</span>
          </button>
        );
      })}
      <span title={user?.email} className="rs-serif flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[var(--panel)] pt-px text-[15px]">{initialsOf(user)}</span>
    </nav>
  );
}
\`\`\`

## src/components/restyle/useIsPhone.js
\`\`\`js
import { useEffect, useState } from 'react';

const PHONE = '(max-width: 767px)';
const TABLET = '(max-width: 1023px)';
const PORTRAIT = '(orientation: portrait)';
const match = (q) => typeof window !== 'undefined' && (window.matchMedia?.(q).matches ?? false);
const read = () => (match(PHONE) ? 'phone' : match(TABLET) ? (match(PORTRAIT) ? 'tablet-stack' : 'tablet') : 'desktop');

/** phone (<768): photo on top, list as a sheet, tab bar. tablet (768–1023): the desktop columns tightened, or
 *  stacked (photo over list) when the window is portrait.
 *  desktop (1024+): the designed canvas. */
export function useLayout() {
  const [size, setSize] = useState(read);
  useEffect(() => {
    const on = () => setSize(read());
    const lists = [PHONE, TABLET, PORTRAIT].map((q) => window.matchMedia?.(q)).filter(Boolean);
    lists.forEach((mq) => mq.addEventListener('change', on));
    return () => lists.forEach((mq) => mq.removeEventListener('change', on));
  }, []);
  return size;
}
\`\`\`

## src/components/restyle/usePricingJobs.js
\`\`\`js
import { useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { priceRoom } from './generate';

const { Render } = base44.entities;
const keyOf = (roomId, style) => \`\${roomId}|\${style}\`;

// One pricing and save per room and style while it runs: picking that style again waits on it rather
// than furnishing a second render, and a room deleted meanwhile keeps no render.
export function usePricingJobs(rooms, setRenders) {
  const jobs = useRef(new Map()); // key → { draft, job }
  const gone = useRef(new Set());

  const save = async ({ room_id, style, image_url }) => {
    const priced = await priceRoom(image_url, style, rooms.find((r) => r.id === room_id)?.image_url);
    if (gone.current.has(room_id)) return null;
    const render = await Render.create({ room_id, style, image_url, ...priced });
    if (gone.current.has(room_id)) { Render.delete(render.id).catch(() => undefined); return null; }
    setRenders((list) => [...list, render]); // kept for reuse even if the user moved on
    return render;
  };

  return {
    pending: (roomId, style) => jobs.current.get(keyOf(roomId, style))?.draft,
    job: (draft) => {
      const key = keyOf(draft.room_id, draft.style);
      if (!jobs.current.has(key)) {
        const job = save(draft);
        jobs.current.set(key, { draft, job });
        job.catch(() => undefined).finally(() => jobs.current.delete(key));
      }
      return jobs.current.get(key).job;
    },
    forget: (roomId) => gone.current.add(roomId),
  };
}
\`\`\`

## src/components/restyle/useRestyle.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { totalOf } from './format';
import { furnishRoom } from './generate';
import { loadOnce } from './loadStudio';
import { usePricingJobs } from './usePricingJobs';

const { Room, Render, Plan } = base44.entities;

const preload = (url) => new Promise((resolve) => { const img = new Image(); img.onload = img.onerror = resolve; img.src = url; });
const signedOutOf = (e) => (e?.response?.status ?? e?.status) === 401;
// Plan pieces are told apart by name and pin: two pieces may share a name.
const samePiece = (a, b) => a.name === b.name && a.x === b.x && a.y === b.y;
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function useRestyle() {
  const [rooms, setRooms] = useState([]);
  const [renders, setRenders] = useState([]);
  const [plans, setPlans] = useState([]);
  const plansRef = useRef(plans);
  plansRef.current = plans;
  const planQueue = useRef(Promise.resolve());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [style, setStyle] = useState(null);
  const [shown, setShown] = useState(null); // { render, key }: the render being revealed
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [toast, setToast] = useState(null);
  const [stage, setStage] = useState(null); // furnishing | pricing | priceFailed, while a new render is made
  const ticket = useRef(0);
  const unpriced = useRef(null); // the furnished image still waiting for its pieces
  const pricing = usePricingJobs(rooms, setRenders);

  useEffect(() => {
    loadOnce().then((data) => { setUser(data.me); setRooms(data.rooms); setRenders(data.renders); setPlans(data.plans); setRoomId(data.rooms[0]?.id ?? null); })
      // Signed out, the sample rooms can't be saved (rls): say so instead of showing an empty stage.
      .catch((e) => fail(e, 'Couldn’t load your rooms. Reload to try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const room = rooms.find((r) => r.id === roomId) ?? null;

  const openRoom = (id) => {
    ticket.current += 1;
    setRoomId(id); setStyle(null); setShown(null); setBusy(false); setError(null); setNeedsSignIn(false); setStage(null);
  };

  // The AI functions need a signed-in user: a 401 asks for sign-in rather than a retry.
  const fail = (e, message) => {
    const signedOut = signedOutOf(e);
    setNeedsSignIn(signedOut);
    setError(signedOut ? 'Sign in to restyle a room.' : message);
  };

  // Prices the shown furnished image; the Render row is saved only once it has its pieces.
  const price = async (mine, draft) => {
    setStage('pricing');
    try {
      const render = await pricing.job(draft);
      if (!render || mine !== ticket.current) return;
      setShown((s) => (s?.key === mine ? { ...s, render } : s));
      setStage(null); unpriced.current = null;
    } catch (e) {
      if (mine !== ticket.current) return;
      if (signedOutOf(e)) { setStage(null); fail(e); return; }
      unpriced.current = draft; setStage('priceFailed');
    }
  };

  // Always from the original photo: a stored render is reused; otherwise the room is furnished, its
  // reveal starts as soon as the image is in, and the pieces are priced alongside it.
  const pickStyle = async (next, forRoom = roomId) => {
    const room = rooms.find((r) => r.id === forRoom);
    if (!room) return;
    const mine = ++ticket.current;
    setStyle(next); setShown(null); setError(null); setNeedsSignIn(false); setBusy(true); setStage(null); unpriced.current = null;
    const stored = renders.find((r) => r.room_id === room.id && r.style === next);
    try {
      if (stored) {
        await Promise.all([preload(stored.image_url), pause(450)]);
        if (mine === ticket.current) setShown({ render: stored, key: mine });
        return;
      }
      const pending = pricing.pending(room.id, next);
      if (pending) { setShown({ render: { ...pending, pieces: null }, key: mine }); price(mine, pending); return; }
      setStage('furnishing');
      const image_url = await furnishRoom(room, next);
      if (mine !== ticket.current) return;
      const draft = { room_id: room.id, style: next, image_url };
      setShown({ render: { ...draft, pieces: null }, key: mine });
      setBusy(false);
      price(mine, draft);
    } catch (e) {
      if (mine === ticket.current) { setStage(null); fail(e, 'That render didn’t come through. Pick the style again to retry.'); }
    } finally {
      if (mine === ticket.current) setBusy(false);
    }
  };

  // Taken before the call, so a second tap while "Try again" fades out can't price twice; a failure restores it.
  const retryPricing = () => {
    const draft = unpriced.current;
    unpriced.current = null;
    return draft && price(ticket.current, draft);
  };

  const upload = async (file) => {
    if (!file?.type?.startsWith('image/')) return;
    setBusy(true); setError(null); setNeedsSignIn(false);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const created = await Room.create({ name: file.name.replace(/\\.[^.]+$/, '') || 'My room', image_url: file_url });
      setRooms((list) => [...list, created]);
      openRoom(created.id);
    } catch (e) {
      fail(e, 'That photo didn’t upload. Try another one.');
      setBusy(false);
    }
  };

  // Adds pieces to this room and style's plan, creating it the first time. Additions queue, each from
  // the latest plans, so two quick clicks neither drop a piece nor create the plan twice.
  const addNow = async (pieces) => {
    const render = shown?.render;
    if (!render?.pieces || !room) return;
    const existing = plansRef.current.find((p) => p.room_id === room.id && p.style === render.style);
    const commit = (next) => { plansRef.current = next; setPlans(next); };
    try {
      if (existing) {
        const merged = [...existing.pieces, ...pieces.filter((p) => !existing.pieces.some((e) => samePiece(e, p)))];
        const updated = { ...existing, ...(await Plan.update(existing.id, { pieces: merged, total: totalOf(merged) })), pieces: merged, total: totalOf(merged) };
        commit(plansRef.current.map((p) => (p.id === existing.id ? updated : p)));
      } else {
        const created = await Plan.create({ name: \`\${room.name} · \${render.style}\`, room_id: room.id, style: render.style, pieces, total: totalOf(pieces) });
        commit([created, ...plansRef.current]);
      }
      setToast(pieces.length === 1 ? \`\${pieces[0].name} added to your plan\` : \`\${pieces.length} pieces added to your plan\`);
    } catch {
      setToast('Couldn’t add to your plan. Try again.');
    }
  };
  const addToPlan = (pieces) => (planQueue.current = planQueue.current.then(() => addNow(pieces)));

  const removePlan = async (id) => {
    try {
      await Plan.delete(id);
      setPlans((list) => list.filter((p) => p.id !== id));
    } catch {
      setToast('Couldn’t remove that plan. Try again.');
    }
  };

  const renameRoom = async (id, name) => {
    const next = name.trim();
    if (!next || next === rooms.find((r) => r.id === id)?.name) return;
    try {
      await Room.update(id, { name: next });
      setRooms((list) => list.map((r) => (r.id === id ? { ...r, name: next } : r)));
    } catch {
      setToast('Couldn’t rename that room. Try again.');
    }
  };

  // The room's stored renders go with it; its plans stay, they're the shopping.
  const deleteRoom = async (id) => {
    try {
      await Room.delete(id);
      pricing.forget(id);
      await Render.deleteMany({ room_id: id }).catch(() => undefined);
    } catch {
      setToast('Couldn’t delete that room. Try again.');
      return;
    }
    const left = rooms.filter((r) => r.id !== id);
    setRooms(left);
    setRenders((list) => list.filter((r) => r.room_id !== id));
    if (id === roomId) openRoom(left[0]?.id ?? null);
  };

  return {
    loading, user, rooms, room, renders, plans, style, shown, busy, error, needsSignIn, toast, stage,
    retryPricing, openRoom, pickStyle, upload, addToPlan, removePlan, renameRoom, deleteRoom,
    signIn: () => base44.auth.redirectToLogin(),
  };
}
\`\`\`

## src/components/restyle/useReveal.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { reducedMotion } from './format';

const SWEEP_MS = 1200;
const IDLE_PUSH_MS = 3000;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The before/after handle of the shown render. \`pos\` is the handle, % from the left: the furnished
 * image is right of it. A new render sweeps it from the right edge to the left; rows arrive in list
 * order through the sweep, pins as the handle passes them, the total last. Then it is dragged freely.
 */
export function useReveal(shown) {
  const [pos, setPos] = useState(100);
  const [phase, setPhase] = useState('empty'); // empty | sweep | done
  const [progress, setProgress] = useState(0);
  const [comparing, setComparing] = useState(false);
  const [idle, setIdle] = useState(false);
  const stage = useRef(null);
  const dragging = useRef(false);
  // A fresh render's pieces can arrive during (or after) its sweep: until then there are none.
  const pieces = shown?.render.pieces ?? [];
  const priced = Boolean(shown?.render.pieces);

  // Keyed on the reveal, not the render: pieces landing later must not restart the sweep.
  useEffect(() => {
    setComparing(false); setIdle(false);
    if (!shown) { setPos(100); setPhase('empty'); setProgress(0); return undefined; }
    if (reducedMotion()) { setPos(0); setProgress(1); setPhase('done'); return undefined; }
    setPhase('sweep'); setProgress(0); setPos(100);
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / SWEEP_MS);
      setPos(100 * (1 - easeInOut(t)));
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPhase('done');
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shown?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  // The slow push-in, once the finished render has sat untouched for a moment.
  useEffect(() => {
    if (phase !== 'done' || comparing) return undefined;
    const t = setTimeout(() => setIdle(true), IDLE_PUSH_MS);
    return () => clearTimeout(t);
  }, [phase, comparing, pos]);

  const moveTo = (clientX) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r?.width) return;
    const next = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    setPos(next);
    setComparing(next > 0.5);
    setIdle(false);
  };

  useEffect(() => {
    const move = (e) => dragging.current && moveTo(e.clientX);
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []);

  const onPointerDown = (e) => {
    if (phase !== 'done' || e.button > 0 || e.target.closest('button')) return;
    dragging.current = true;
    moveTo(e.clientX);
  };

  return {
    stage,
    pos,
    phase,
    comparing,
    idle,
    onPointerDown,
    rows: phase === 'done' ? pieces : pieces.slice(0, Math.floor(progress * (pieces.length + 1))),
    pinShown: (piece) => phase === 'done' || pos <= piece.x,
    totalShown: phase === 'done' && priced,
  };
}
\`\`\`

## src/components/restyle/WelcomeCard.jsx
\`\`\`jsx
import { motion } from 'framer-motion';

const STEPS = [
  ['01', 'Upload a room', 'Any photo, empty or not'],
  ['02', 'Pick a style', 'Five looks, one tap'],
  ['03', 'Shop the look', 'Every piece, priced'],
];

// Desktop: over the photo's left third. Phone: docked to the bottom of the screen.
const DESKTOP = {
  card: 'absolute bottom-[33px] left-[32px] top-[32px] w-[34.3%] min-w-[250px] rounded-[16px] px-[27px] pt-[46px]',
  label: 'text-[9.5px]', title: 'mt-[10px] text-[37px] leading-[41px]', text: 'mt-[13px] text-[12px] leading-[17.5px]',
  steps: 'mt-[31px] gap-[7px]', step: 'h-[49px] rounded-[8px] px-[12px]', num: 'w-[33px] text-[16px]',
  stepTitle: 'text-[12px] leading-[15px]', stepSub: 'text-[10px] leading-[13px]',
  build: 'mt-auto mb-[26px] h-[39px] w-[133px] text-[13px]',
};
const PHONE = {
  card: 'absolute inset-x-[14px] bottom-[calc(14px+env(safe-area-inset-bottom))] rounded-[30px] px-[22px] pb-[22px] pt-[26px]',
  label: 'text-[11px]', title: 'mt-[10px] text-[44px] leading-[46px]', text: 'mt-[12px] text-[15px] leading-[21px]',
  steps: 'mt-[18px] gap-[8px]', step: 'min-h-[56px] rounded-[14px] px-[14px]', num: 'w-[40px] text-[20px]',
  stepTitle: 'text-[15px] leading-[19px]', stepSub: 'text-[13px] leading-[17px]',
  build: 'mt-[18px] h-[56px] w-full text-[16px]',
};

/** The first screen: a frosted card over the sample room. "Build now" slides it away. */
export default function WelcomeCard({ onBuild, onUpload, phone }) {
  const c = phone ? PHONE : DESKTOP;
  return (
    <motion.div exit={phone ? { y: 60, opacity: 0 } : { x: -60, opacity: 0 }} transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
      className={\`\${c.card} flex flex-col border border-white/60 bg-[color-mix(in_srgb,var(--panel)_55%,transparent)] backdrop-blur-[20px]\`}>
      <div className={\`\${c.label} font-medium tracking-[1.4px] text-[var(--body)]\`}>AI ROOM STYLING</div>
      <h1 className={\`rs-serif \${c.title} tracking-[-0.3px]\`}>Build Your<br />Dream Home</h1>
      <p className={\`\${c.text} text-[var(--body)]\`}>Pick a style and watch your empty room fill with furniture, with a shopping list of every piece.</p>
      <div className={\`\${c.steps} flex flex-col\`}>
        {STEPS.map(([n, title, sub], i) => {
          const body = (
            <>
              <span className={\`rs-serif \${c.num} flex-none\`}>{n}</span>
              <span className="text-left">
                <span className={\`block \${c.stepTitle} font-medium\`}>{title}</span>
                <span className={\`block \${c.stepSub} text-[var(--body)]\`}>{sub}</span>
              </span>
            </>
          );
          const cls = \`flex \${c.step} items-center bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]\`;
          return i === 0 ? (
            <label key={n} className={\`\${cls} cursor-pointer\`}>
              {body}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
            </label>
          ) : <button key={n} type="button" onClick={onBuild} className={cls}>{body}</button>;
        })}
      </div>
      <button type="button" onClick={onBuild}
        className={\`\${c.build} flex flex-none items-center justify-center gap-[8px] rounded-full bg-[var(--accent)] font-medium text-[var(--on-accent)] transition-transform active:scale-[0.96]\`}>
        Build now <span className="text-[15px] leading-none">⟶</span>
      </button>
    </motion.div>
  );
}
\`\`\`

## src/pages/Restyle.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import '@/components/restyle/restyle.css';
import Sidebar from '@/components/restyle/Sidebar';
import RoomStage from '@/components/restyle/RoomStage';
import ShoppingList from '@/components/restyle/ShoppingList';
import SidePanel from '@/components/restyle/SidePanel';
import TabBar from '@/components/restyle/TabBar';
import ListSheet from '@/components/restyle/ListSheet';
import { useLayout } from '@/components/restyle/useIsPhone';
import { useRestyle } from '@/components/restyle/useRestyle';
import { useReveal } from '@/components/restyle/useReveal';

export default function Restyle() {
  const studio = useRestyle();
  const reveal = useReveal(studio.shown);
  const size = useLayout();
  const phone = size === 'phone';
  const stack = size === 'tablet-stack';
  const tablet = size === 'tablet' || stack;
  const [welcome, setWelcome] = useState(true);
  const [panel, setPanel] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setPanel(null), setActive(null));
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Anything that changes the room or its render leaves the welcome card behind.
  const pick = (style, roomId) => { setWelcome(false); setActive(null); studio.pickStyle(style, roomId); };
  const studioView = { ...studio, upload: (file) => { setWelcome(false); return studio.upload(file); }, pickStyle: pick, openRoom: (id) => { setWelcome(false); setActive(null); studio.openRoom(id); } };
  // Home closes an open panel; from the room itself it goes back to the start, the welcome card.
  const home = () => { if (panel) setPanel(null); else { setActive(null); setWelcome(true); if (studio.room) studio.openRoom(studio.room.id); } };
  const list = { style: studio.style, rows: reveal.rows, totalShown: reveal.totalShown, active, setActive, onAddAll: () => studio.addToPlan(studio.shown.render.pieces) };
  const stage = studio.loading ? <div className="flex-1 rounded-[19px] bg-[var(--panel)]" /> : (
    <RoomStage studio={studioView} reveal={reveal} welcome={welcome} onBuild={() => setWelcome(false)} active={active} setActive={setActive} phone={phone} tablet={tablet} stack={stack} />
  );

  return (
    <div className={\`rs relative flex overflow-hidden \${phone ? 'h-[100dvh] flex-col' : tablet ? 'h-screen min-h-[600px]' : 'h-screen min-h-[640px] min-w-[1024px]'}\`}>
      {phone ? (
        <>
          {stage}
          {!welcome && <ListSheet {...list} />}
          {!welcome && <TabBar open={panel} onOpen={setPanel} onHome={home} user={studio.user} />}
        </>
      ) : (
        <>
          <Sidebar open={panel} onOpen={setPanel} onHome={home} tablet={tablet} user={studio.user} />
          <main className={\`flex min-w-0 flex-1 \${tablet ? \`gap-[16px] py-[32px] pl-[8px] pr-[24px] \${stack ? 'flex-col' : ''}\` : 'gap-[20px] py-[72px] pl-[66px] pr-[66px]'}\`}>
            {stage}
            <ShoppingList {...list} tablet={tablet} stack={stack} compact={welcome} />
          </main>
        </>
      )}
      <AnimatePresence>
        {panel && <SidePanel key={panel} open={panel} studio={studioView} onClose={() => setPanel(null)} onWelcome={() => setWelcome(true)} onPick={pick} phone={phone} tablet={tablet} />}
      </AnimatePresence>
      <AnimatePresence>
        {studio.toast && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className={\`absolute inset-x-0 \${phone ? 'top-[calc(16px+env(safe-area-inset-top))] text-[14px]' : 'bottom-[24px] text-[12px]'} z-40 mx-auto w-fit rounded-full bg-[var(--ink)] px-[16px] py-[9px] text-[var(--canvas)] shadow-[0_10px_30px_rgba(0,0,0,0.2)]\`}>
            {studio.toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
\`\`\`
`;export{e as default};