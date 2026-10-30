var e=`# ad_copy_generator — app files

## base44/entities/Campaign.jsonc
\`\`\`json
{
  "name": "Campaign",
  "type": "object",
  "properties": {
    "seq": {
      "type": "integer",
      "description": "Per-user campaign number, 1-based"
    },
    "brief": {
      "type": "string"
    },
    "brand": {
      "type": "string",
      "description": "The brief's first word"
    },
    "category": {
      "type": "string"
    },
    "active_platform": {
      "type": "string",
      "enum": [
        "search",
        "social",
        "display"
      ],
      "default": "social"
    }
  },
  "required": [
    "seq",
    "brief",
    "brand"
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

## base44/entities/Variant.jsonc
\`\`\`json
{
  "name": "Variant",
  "type": "object",
  "properties": {
    "campaign_id": {
      "type": "string"
    },
    "index": {
      "type": "integer",
      "description": "0..2"
    },
    "image_url": {
      "type": "string",
      "description": "Product image used by the Social and Display previews"
    },
    "search": {
      "type": "object",
      "properties": {
        "headline": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "cta": {
          "type": "string"
        }
      }
    },
    "social": {
      "type": "object",
      "properties": {
        "headline": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "cta": {
          "type": "string"
        }
      }
    },
    "display": {
      "type": "object",
      "properties": {
        "headline": {
          "type": "string"
        },
        "body": {
          "type": "string"
        },
        "cta": {
          "type": "string"
        }
      }
    },
    "regen_count": {
      "type": "integer",
      "default": 0
    }
  },
  "required": [
    "campaign_id",
    "index",
    "search",
    "social",
    "display"
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

## base44/functions/generateProductImage/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// One product/lifestyle photo for a campaign's Social and Display previews.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { brief } = await req.json();
    const clean = typeof brief === 'string' ? brief.trim().replace(/\\s+/g, ' ') : '';
    if (clean.length < 8 || clean.length > 200) return Response.json({ error: 'The brief must be 8 to 200 characters.' }, { status: 400 });

    const { url } = await base44.asServiceRole.integrations.Core.GenerateImage({
      prompt: \`Bright natural-light product lifestyle photo for an ad: \${clean}. No text, no logos.\`,
    });
    return Response.json({ url: typeof url === 'string' ? url : null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## base44/functions/regenerateVariant/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Rewrites one variant of a campaign (all three platforms, so the tabs stay consistent), unlike its previous copy.
const COPY = { type: 'object', properties: { headline: { type: 'string' }, body: { type: 'string' }, cta: { type: 'string' } }, required: ['headline', 'body', 'cta'] };
const SCHEMA = { type: 'object', properties: { search: COPY, social: COPY, display: COPY }, required: ['search', 'social', 'display'] };
const ANGLES = ['feature-led', 'audience-led', 'offer-led'];
const RULES = \`Character limits (headline / body / CTA): search 30 / 90 / 25, social 40 / 125 / 20, display 30 / 90 / 15.
Respect the limits, but never truncate: return the copy as written. CTAs are 1–3 words, imperative.
Search headlines use Title Case; social and display use sentence case.\`;

const text = (value, max) => String(value ?? '').slice(0, max);
const copyOf = (c) => ({ headline: text(c?.headline, 200), body: text(c?.body, 400), cta: text(c?.cta, 60) });
const variantOf = (v) => ({ search: copyOf(v?.search), social: copyOf(v?.social), display: copyOf(v?.display) });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { brief, index, previous } = await req.json();
    const clean = typeof brief === 'string' ? brief.trim().replace(/\\s+/g, ' ') : '';
    if (clean.length < 8 || clean.length > 200) return Response.json({ error: 'The brief must be 8 to 200 characters.' }, { status: 400 });
    if (!Number.isInteger(index) || index < 0 || index > 2) return Response.json({ error: 'index must be 0, 1 or 2.' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: \`You write ad copy. Brief: \${clean}
Regenerate variant \${index + 1} of 3 (\${ANGLES[index]}). Make it clearly different from the previous copy of this variant:
Previous copy: \${JSON.stringify(variantOf(previous))}
Return search, social and display copy, each with headline, body and cta.
\${RULES}\`,
      response_json_schema: SCHEMA,
    });
    const variant = variantOf(result);
    if (Object.values(variant).some((c) => !c.headline.trim() || !c.body.trim() || !c.cta.trim())) {
      return Response.json({ error: 'The model returned incomplete copy.' }, { status: 502 });
    }
    return Response.json(variant);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## base44/functions/writeCampaignCopy/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Writes a campaign's three ad variants (search, social and display copy each) from a one-line brief.
const COPY = { type: 'object', properties: { headline: { type: 'string' }, body: { type: 'string' }, cta: { type: 'string' } }, required: ['headline', 'body', 'cta'] };
const VARIANT = { type: 'object', properties: { search: COPY, social: COPY, display: COPY }, required: ['search', 'social', 'display'] };
const SCHEMA = {
  type: 'object',
  properties: { category: { type: 'string' }, variants: { type: 'array', items: VARIANT, minItems: 3, maxItems: 3 } },
  required: ['category', 'variants'],
};
const RULES = \`Character limits (headline / body / CTA): search 30 / 90 / 25, social 40 / 125 / 20, display 30 / 90 / 15.
Respect the limits, but never truncate: return the copy as written. CTAs are 1–3 words, imperative.
Search headlines use Title Case; social and display use sentence case.\`;

const text = (value, max) => String(value ?? '').slice(0, max);
const copyOf = (c) => ({ headline: text(c?.headline, 200), body: text(c?.body, 400), cta: text(c?.cta, 60) });

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { brief } = await req.json();
    const clean = typeof brief === 'string' ? brief.trim().replace(/\\s+/g, ' ') : '';
    if (clean.length < 8 || clean.length > 200) return Response.json({ error: 'The brief must be 8 to 200 characters.' }, { status: 400 });

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: \`You write ad copy. Brief: \${clean}
Write three distinct ad variants with different angles: 1 feature-led, 2 audience-led, 3 offer-led.
For each variant return search, social and display copy, each with headline, body and cta.
Also return category: the product category in 1–2 words (e.g. "Oat milk").
\${RULES}\`,
      response_json_schema: SCHEMA,
    });
    const variants = (result?.variants ?? []).slice(0, 3);
    if (variants.length < 3) return Response.json({ error: 'The model returned too few variants.' }, { status: 502 });
    return Response.json({
      category: text(result.category, 40),
      variants: variants.map((v) => ({ search: copyOf(v.search), social: copyOf(v.social), display: copyOf(v.display) })),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## src/components/ad-copy/ad-copy.css
\`\`\`css
@font-face{font-family:"Neue Haas Grotesk";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-500-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-700-normal.woff2) format("woff2")}
@font-face{font-family:"Minion Pro";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/minion-pro-400-normal.woff2) format("woff2")}

/* The look (Paper): ink (type, lines, primary button), paper (ground), soft (outlines, empty bars) and
   accent (caret, tab underline) as swatches; muted, bar (a counter past 85%) and red (over limit) as UI colors. */
:root{
  --swatch-1:#1F35C9;--swatch-2:#FFFFFF;--swatch-3:#DDE1F5;--swatch-4:#0A0A0A;
  --ui-muted:#6470B8;--ui-bar:var(--swatch-4);--ui-red:#E0301E;
}
/* gallery-look */

/* Platform previews: fixed platform colours, the same in every look. */
.acg{--ad-white:#FFFFFF;--ad-avatar:#1F3A2E;--ad-cream:#F1EDE3;--ad-placeholder:#E4E1DA;--ad-search-ink:#202124;--ad-search-muted:#5F6368;--ad-link:#1F3FD1;--ad-search-body:#4D5156;--ad-social-ink:#1C1E21;--ad-social-muted:#65676B;--ad-social-footer:#F0F2F5;--ad-social-chip:#E2E5E9;--ad-display-ink:#16241D;--ad-badge:#555;--ad-display-body:#4A4F48;
  font-family:"Neue Haas Grotesk","Helvetica Neue",Arial,sans-serif;color:var(--swatch-1);background:var(--swatch-2);-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.acg-logo{font-family:"Minion Pro",Georgia,serif}
.acg input::placeholder{color:var(--ui-muted);opacity:1}
.acg-caret{animation:acg-blink 1s steps(1) infinite}
@keyframes acg-blink{50%{opacity:0}}
.acg-regen:hover:not(:disabled){background:var(--swatch-1);color:var(--swatch-2)}
\`\`\`

## src/components/ad-copy/AdPreview.jsx
\`\`\`jsx
import { domainOf } from './copy';

// Platform previews keep fixed platform colours in every look, so they read like the real thing.
export const AUTHORED = { search: [560, 420], social: [400, 594], display: [510, 425] };

export const Avatar = ({ brand, size, text = 13 }) => (
  <span className="flex flex-none items-center justify-center !rounded-full bg-[var(--ad-avatar)] font-extrabold text-[var(--ad-cream)]" style={{ width: size, height: size, fontSize: text }}>
    {brand.charAt(0).toLowerCase()}
  </span>
);

export const Photo = ({ url, className }) => (url
  ? <img src={url} alt="" className={\`block object-cover \${className}\`} />
  : <div className={\`bg-[var(--ad-placeholder)] \${className}\`} />);

function Search({ copy, brand, category }) {
  return (
    <div className="relative h-[420px] w-[560px] bg-[var(--ad-white)] p-[40px] text-[var(--ad-search-ink)]">
      <div className="text-[17px] font-bold">Sponsored</div>
      <div className="mt-[14px] flex items-center gap-[14px]">
        <Avatar brand={brand} size={40} text={14} />
        <div>
          <div className="text-[19px] leading-[1.2]">{brand}</div>
          <div className="text-[15px] leading-[1.3] text-[var(--ad-search-muted)]">{domainOf(brand)} › {category.toLowerCase()}</div>
        </div>
      </div>
      <div className="mt-[28px] text-[38px] leading-[1.2] text-[var(--ad-link)]">{copy.headline}</div>
      <p className="mt-[10px] text-[23px] leading-[1.45] text-[var(--ad-search-body)]">{copy.body}</p>
      <div className="absolute bottom-[40px] left-[40px] text-[21px] font-semibold text-[var(--ad-link)]">{copy.cta} ›</div>
    </div>
  );
}

function Social({ copy, brand, image }) {
  return (
    <div className="h-[594px] w-[400px] bg-[var(--ad-white)] text-[var(--ad-social-ink)]">
      <div className="flex h-[60px] items-center gap-[10px] px-[16px]">
        <Avatar brand={brand} size={36} text={14} />
        <div className="leading-[1.15]">
          <div className="text-[18px] font-bold">{brand}</div>
          <div className="text-[14px] text-[var(--ad-social-muted)]">Sponsored</div>
        </div>
      </div>
      <p className="h-[76px] overflow-hidden px-[16px] pt-[2px] text-[17px] leading-[1.4]">{copy.body}</p>
      <Photo url={image} className="h-[400px] w-[400px]" />
      <div className="flex h-[58px] items-center justify-between gap-[10px] bg-[var(--ad-social-footer)] px-[16px]">
        <div className="min-w-0 leading-[1.2]">
          <div className="text-[13px] uppercase text-[var(--ad-social-muted)]">{domainOf(brand)}</div>
          <div className="truncate text-[18px] font-bold">{copy.headline}</div>
        </div>
        <span className="flex-none whitespace-nowrap rounded-[6px] bg-[var(--ad-social-chip)] px-[14px] py-[9px] text-[15px] font-bold">{copy.cta}</span>
      </div>
    </div>
  );
}

function Display({ copy, brand, image }) {
  return (
    <div className="relative h-[425px] w-[510px] overflow-hidden bg-[var(--ad-cream)] text-[var(--ad-display-ink)]">
      <div className="relative h-[170px]">
        <Photo url={image} className="h-full w-full" />
        <span className="absolute left-[24px] top-[22px] text-[14px] font-bold uppercase tracking-[3px] text-[var(--ad-white)] [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">{brand}</span>
        <span className="absolute right-[12px] top-[12px] rounded-[3px] bg-[var(--ad-white)] px-[6px] py-[2px] text-[12px] text-[var(--ad-badge)]">Ad</span>
      </div>
      <div className="px-[24px] pt-[22px]">
        <div className="text-[30px] font-bold leading-[1.08] tracking-[-0.5px]">{copy.headline}</div>
        <p className="mt-[10px] text-[17px] leading-[1.4] text-[var(--ad-display-body)]">{copy.body}</p>
      </div>
      <span className="absolute bottom-[26px] left-[24px] !rounded-full bg-[var(--ad-display-ink)] px-[22px] py-[13px] text-[15px] font-bold leading-none text-[var(--ad-cream)]">{copy.cta}</span>
    </div>
  );
}

/** The variant's preview for a platform, at its authored size. */
export default function AdPreview({ platform, variant, brand, category }) {
  const props = { copy: variant[platform] ?? {}, brand, category: category || 'Shop', image: variant.image_url };
  if (platform === 'search') return <Search {...props} />;
  if (platform === 'social') return <Social {...props} />;
  return <Display {...props} />;
}
\`\`\`

## src/components/ad-copy/BriefRow.jsx
\`\`\`jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DiagonalArrow } from './Icons';
import { BRIEF_MAX } from './copy';

export const MOVE = { duration: 0.9, ease: [0.65, 0, 0.35, 1] };
// To results the row waits for the hero to fade, then slides up (as in the design's clip).
export const moveFor = (phase) => (phase === 'results' ? { ...MOVE, duration: 0.5, delay: 0.4 } : MOVE);
const SIZES = {
  empty: { top: 470, height: 96, label: 22, text: 28, buttonW: 220, buttonH: 60, buttonText: 18 },
  results: { top: 128, height: 68, label: 18, text: 21, buttonW: 184, buttonH: 44, buttonText: 15 },
};

export default function BriefRow({ phase, brief, onChange, onGenerate, generating, error }) {
  const s = SIZES[phase];
  const t = moveFor(phase);
  const [focused, setFocused] = useState(false);
  const [edited, setEdited] = useState(false);
  useLayoutEffect(() => setEdited(false), [phase]);
  const mirror = useRef(null);
  const [caretX, setCaretX] = useState(0);
  useLayoutEffect(() => setCaretX(mirror.current?.offsetWidth ?? 0), [brief, phase]);
  const ready = brief.trim().length >= 8;

  return (
    <motion.div initial={false} animate={{ top: s.top, height: s.height }} transition={t}
      className="absolute left-[80px] right-[80px] z-10 flex items-center border-y border-[var(--swatch-1)]">
      <label className="flex min-w-0 flex-1 items-center self-stretch">
        <motion.span initial={false} animate={{ fontSize: \`\${s.label}px\` }} transition={t} className="w-[260px] flex-none uppercase">BRIEF</motion.span>
        <motion.span initial={false} animate={{ fontSize: \`\${s.text}px\` }} transition={t} className="relative mr-[40px] flex min-w-0 flex-1 items-center self-stretch">
          <input value={brief} onChange={(e) => { setEdited(true); onChange(e.target.value); }} onFocus={() => { setFocused(true); setEdited(true); }} onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && onGenerate()} placeholder="PRODUCT AND WHO IT IS FOR" aria-label="Brief" maxLength={BRIEF_MAX}
            className="h-full w-full min-w-0 bg-transparent uppercase outline-none [caret-color:transparent]" />
          <span ref={mirror} aria-hidden="true" className="invisible absolute left-0 whitespace-pre uppercase">{brief}</span>
          {focused && (phase === 'empty' || edited) && (
            <span aria-hidden="true" className="acg-caret pointer-events-none absolute top-1/2 h-[1.05em] w-[2px] -translate-y-1/2 bg-[var(--swatch-4)]" style={{ left: caretX + 1 }} />
          )}
        </motion.span>
      </label>
      <motion.button type="button" onClick={onGenerate} disabled={!ready || generating} aria-disabled={!ready}
        initial={false} animate={{ width: s.buttonW, height: s.buttonH, fontSize: \`\${s.buttonText}px\` }} transition={t} whileTap={{ scale: 0.94 }}
        className="flex flex-none items-center justify-between bg-[var(--swatch-1)] px-[18px] tracking-[1px] text-[var(--swatch-2)] disabled:cursor-default">
        {generating ? 'GENERATING' : 'GENERATE'}
        <DiagonalArrow size={16} stroke={10} />
      </motion.button>
      {error && <p className={\`absolute top-full mt-[10px] text-[18px] text-[var(--ui-red)] \${phase === 'results' ? 'right-0 text-right' : 'left-[340px]'}\`}>{error}</p>}
    </motion.div>
  );
}
\`\`\`

## src/components/ad-copy/CampaignMenu.jsx
\`\`\`jsx
import { useEffect } from 'react';
import { pad2 } from './copy';

/** The header's menu button: two 30×1.5px lines, 7px apart, in a 44px tap area. */
export function MenuButton({ open, onToggle }) {
  return (
    <button type="button" onClick={onToggle} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}
      className="-mr-[7px] flex h-[44px] w-[44px] flex-none flex-col items-center justify-center gap-[7px]">
      <span className="h-[1.5px] w-[30px] bg-[var(--swatch-1)]" />
      <span className="h-[1.5px] w-[30px] bg-[var(--swatch-1)]" />
    </button>
  );
}

/** Campaign history: open one, or start a new campaign. Closes on ×, Escape or a click outside. \`touch\` sizes it for a phone. */
export default function CampaignMenu({ className, touch = false, history, onClose, onOpen, onNew, signedIn, onAccount }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const tap = touch ? 'min-h-[44px]' : 'min-h-[32px]';
  const size = touch ? 'text-[15px]' : 'text-[18px]';

  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-label="Campaigns" className={\`absolute z-30 \${className} border border-[var(--swatch-1)] bg-[var(--swatch-2)] p-[20px]\`}>
        <div className={\`mb-[12px] flex items-center justify-between gap-[16px] whitespace-nowrap tracking-[0.6px] \${size}\`}>
          CAMPAIGNS
          <span className={\`flex items-center \${touch ? 'gap-[4px]' : 'gap-[16px]'}\`}>
            <button type="button" onClick={() => { onClose(); onNew(); }} className={\`\${tap} \${size} tracking-[0.6px] text-[var(--ui-muted)] hover:text-[var(--swatch-1)]\`}>+ NEW CAMPAIGN</button>
            <button type="button" onClick={onClose} aria-label="Close menu" className={\`\${tap} min-w-[44px] text-[26px] leading-none\`}>×</button>
          </span>
        </div>
        {history.length === 0 && <p className="border-t border-[var(--swatch-1)] pt-[14px] text-[18px] text-[var(--ui-muted)]">No campaigns yet.</p>}
        <div className="max-h-[min(480px,60vh)] overflow-auto">
          {history.map((c) => (
            <button key={c.id} type="button" onClick={() => { onClose(); onOpen(c); }}
              className="block w-full border-t border-[var(--swatch-1)] py-[12px] text-left hover:bg-[var(--swatch-3)]">
              <span className={\`flex justify-between gap-[12px] uppercase tracking-[0.6px] \${size}\`}>
                <span className="min-w-0 truncate">{c.brand} — CAMPAIGN {pad2(c.seq)}</span>
                <span className="flex-none text-[var(--ui-muted)]">{new Date(c.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </span>
              <span className={\`mt-[4px] block truncate uppercase text-[var(--ui-muted)] \${touch ? 'text-[13px]' : 'text-[16px]'}\`}>{c.brief}</span>
            </button>
          ))}
        </div>
        <button type="button" onClick={onAccount} className={\`block w-full border-t border-[var(--swatch-1)] pt-[12px] text-left tracking-[0.6px] text-[var(--ui-muted)] hover:text-[var(--swatch-1)] \${tap} \${size}\`}>{signedIn ? 'SIGN OUT' : 'SIGN IN'}</button>
      </div>
    </>
  );
}
\`\`\`

## src/components/ad-copy/copy.js
\`\`\`js
export const PLATFORMS = ['search', 'social', 'display'];
export const FIELDS = ['headline', 'body', 'cta'];

export const LIMITS = {
  search: { headline: 30, body: 90, cta: 25 },
  social: { headline: 40, body: 125, cta: 20 },
  display: { headline: 30, body: 90, cta: 15 },
};

// The examples gallery: static marketing content (not user data). Clicking one fills the brief.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/ad-copy-generator/';
export const EXAMPLES = [
  { image: \`\${PHOTOS}candles.png\`, headline: ['One Candle.', 'Whole Room.'], cta: 'Shop scents', brief: 'Wickhaven hand-poured soy candles for small apartments' },
  { image: \`\${PHOTOS}linen.png\`, headline: ['Sleep Cooler', 'From Night One'], cta: 'Shop linen', brief: 'Lunelle stonewashed linen bedding for hot sleepers' },
  { image: \`\${PHOTOS}dog.png\`, headline: ['Joint Support', 'In Every Chew'], cta: 'Build a plan', brief: 'Whisk senior joint chews for older dogs who slow down on walks' },
  { image: \`\${PHOTOS}pots.png\`, headline: ['Room For', 'One More Plant'], cta: 'See sizes', brief: 'Terrace glazed ceramic plant pots for apartment plant collectors' },
  { image: \`\${PHOTOS}sourdough.png\`, headline: ['Your First Loaf', 'This Weekend'], cta: 'Get the kit', brief: 'Crumbwell sourdough starter kit for first-time home bakers' },
];

/** The brand is the brief's first word. */
export const brandOf = (brief) => {
  const word = brief.trim().split(/\\s+/)[0] ?? '';
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
export const domainOf = (brand) => \`\${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.co\`;
export const pad2 = (n) => String(n).padStart(2, '0');

export const fieldCount = (copy, field) => (copy?.[field] ?? '').length;
export const isOver = (copy, platform) => FIELDS.some((f) => fieldCount(copy, f) > LIMITS[platform][f]);

// Longest brief the backend functions accept.
export const BRIEF_MAX = 200;
\`\`\`

## src/components/ad-copy/CopyButton.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';

/** Copies one ad field; says COPIED only when the clipboard write went through. */
export default function CopyButton({ text, label, className = '' }) {
  const [state, setState] = useState('');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('COPIED');
    } catch {
      setState('COPY FAILED');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState(''), 1600);
  };
  return (
    <button type="button" onClick={copy} disabled={!text} className={\`uppercase text-[var(--ui-muted)] hover:text-[var(--swatch-1)] disabled:opacity-40 \${className}\`}>
      <span aria-live="polite">{state || 'COPY'}</span><span className="sr-only"> {label}</span>
    </button>
  );
}
\`\`\`

## src/components/ad-copy/Counter.jsx
\`\`\`jsx
import { useCountUp } from './useCountUp';

/** A field's character count against its limit: the number and bar animate to each new value. */
export default function Counter({ name, count, limit, delay = 0, action }) {
  const shown = useCountUp(count, delay);
  const over = count > limit;
  const fill = over ? 'var(--ui-red)' : count / limit > 0.85 ? 'var(--ui-bar)' : 'var(--swatch-1)';

  return (
    <div className={over ? 'text-[var(--ui-red)]' : ''}>
      <div className="flex justify-between text-[18px] uppercase leading-[22px] tracking-[0.6px]">
        {name}
        <span className="flex gap-[20px]">{action}<span className={over ? '' : 'text-[var(--ui-muted)]'}>MAX {limit}</span></span>
      </div>
      <div className="mt-[12px] flex items-baseline gap-[12px]" aria-live="polite">
        <span className="text-[56px] leading-[0.9] tracking-[-2.5px]">{shown}</span>
        <span className={\`text-[20px] \${over ? '' : 'text-[var(--ui-muted)]'}\`}>{over ? \`+\${count - limit} over limit\` : 'characters'}</span>
      </div>
      <div className="mt-[11px] h-[3px] bg-[var(--swatch-3)]">
        <div className="h-full" style={{ width: \`\${Math.min(100, (shown / limit) * 100)}%\`, background: fill }} />
      </div>
    </div>
  );
}
\`\`\`

## src/components/ad-copy/EmptyState.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { EXAMPLES } from './copy';
import { DiagonalArrow } from './Icons';

const STRIDE = 420 + 24; // card + gap
const SPEED = 38; // px/s

function ExampleCard({ example, onPick }) {
  return (
    <button type="button" onClick={() => onPick(example.brief)} aria-label={\`Use example: \${example.brief}\`}
      className="flex h-[396px] w-[420px] flex-none flex-col items-start border border-[var(--swatch-3)] bg-[var(--swatch-2)] p-[20px] text-left">
      <img src={example.image} alt="" className="h-[200px] w-full object-cover" />
      <span className="mt-[14px] text-[28px] font-medium leading-[1.1] tracking-[-0.5px]">{example.headline[0]}<br />{example.headline[1]}</span>
      <span className="mt-auto flex items-center gap-[12px] bg-[var(--swatch-1)] px-[18px] py-[12px] text-[16px] uppercase leading-none tracking-[0.8px] text-[var(--swatch-2)]">
        {example.cta}<DiagonalArrow size={12} stroke={12} />
      </span>
    </button>
  );
}

export default function EmptyState({ visible, onPick }) {
  const fade = { opacity: visible ? 1 : 0, y: visible ? 0 : -30 };
  const t = { duration: 0.4, ease: [0.65, 0, 0.35, 1] };
  return (
    <div className={visible ? '' : 'pointer-events-none'} aria-hidden={!visible}>
      <motion.h1 initial={false} animate={fade} transition={t}
        className="absolute left-[80px] top-[130px] text-[150px] font-medium uppercase leading-[0.88] tracking-[-6px]">
        What are you<br />selling?
      </motion.h1>
      <motion.div initial={false} animate={fade} transition={t} aria-hidden="true" className="pointer-events-none absolute right-[80px] top-[270px] select-none">
        <DiagonalArrow size={120} stroke={9} />
      </motion.div>
      <motion.section initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={t} className="absolute bottom-0 left-[80px] right-[80px] top-[619px] overflow-hidden">
        <h2 className="text-[22px] uppercase leading-[26px]">Examples</h2>
        <motion.div className="mt-[19px] flex w-max gap-[24px]"
          animate={visible ? { x: -STRIDE * EXAMPLES.length } : undefined}
          transition={{ duration: (STRIDE * EXAMPLES.length) / SPEED, ease: 'linear', repeat: Infinity, delay: 1.3 }}>
          {[...EXAMPLES, ...EXAMPLES].map((example, i) => <ExampleCard key={i} example={example} onPick={onPick} />)}
        </motion.div>
      </motion.section>
    </div>
  );
}
\`\`\`

## src/components/ad-copy/Header.jsx
\`\`\`jsx
import { useState } from 'react';
import { pad2 } from './copy';
import CampaignMenu, { MenuButton } from './CampaignMenu';

export default function Header({ results, brand, seq, history, onOpen, onNew, signedIn, onAccount }) {
  const [open, setOpen] = useState(false);
  const label = results ? \`\${brand.toUpperCase()} — CAMPAIGN \${pad2(seq)}\` : 'NEW CAMPAIGN';
  const close = () => setOpen(false);

  return (
    <header className="absolute left-[80px] right-[80px] top-[40px] z-20 flex h-[34px] items-center justify-between">
      {/* The logo leads home: results go back to an empty brief, and the page returns to its top. */}
      <button type="button" aria-label="Home" onClick={(e) => { if (results) onNew(); e.currentTarget.closest('.acg')?.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="acg-logo flex h-[32px] w-[58px] flex-none items-center justify-center !rounded-full border-[1.5px] border-[var(--swatch-1)] pt-[3px] text-[24px] leading-none">H</button>
      {/* The campaign's name, a status label (not a link): muted, and centred once it names a campaign. */}
      <div className={\`pointer-events-none text-[18px] uppercase tracking-[0.8px] text-[var(--ui-muted)] \${results ? 'absolute inset-x-0 text-center' : 'ml-auto mr-[24px]'}\`}>{label}</div>
      <MenuButton open={open} onToggle={() => setOpen((o) => !o)} />
      {open && <CampaignMenu className="right-0 top-[48px] w-[560px]" history={history} onClose={close} onOpen={onOpen} onNew={onNew} signedIn={signedIn} onAccount={onAccount} />}
    </header>
  );
}
\`\`\`

## src/components/ad-copy/Icons.jsx
\`\`\`jsx
/** A diagonal arrow, top-left to bottom-right, with a square-capped arrowhead. */
export function DiagonalArrow({ size, stroke }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="square" aria-hidden="true" className="flex-none">
      <path d="M8 8 112 112M112 44v68H44" />
    </svg>
  );
}

export function RegenIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.35-5.65M20 4v4.5h-4.5" />
    </svg>
  );
}
\`\`\`

## src/components/ad-copy/MobileBrief.jsx
\`\`\`jsx
import { DiagonalArrow } from './Icons';
import { BRIEF_MAX } from './copy';

/** The phone brief block: label on its own line, the input, then a full-width Generate button (with Cancel when editing). */
export default function MobileBrief({ brief, onChange, onGenerate, onCancel, generating, error }) {
  const ready = brief.trim().length >= 8;
  return (
    <div>
      <label className="block border-y border-[var(--swatch-1)] py-[16px]">
        <span className="block text-[12px] uppercase leading-[16px]">BRIEF</span>
        <input value={brief} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onGenerate()}
          placeholder="PRODUCT AND WHO IT IS FOR" aria-label="Brief" maxLength={BRIEF_MAX} enterKeyHint="go"
          className="mt-[4px] h-[44px] w-full min-w-0 bg-transparent text-[18px] uppercase outline-none [caret-color:var(--swatch-4)]" />
      </label>
      <div className="mt-[16px] flex gap-[12px]">
      {onCancel && (
        <button type="button" onClick={onCancel} className="h-[52px] flex-none border border-[var(--swatch-1)] px-[18px] text-[15px] tracking-[1px]">CANCEL</button>
      )}
      <button type="button" onClick={onGenerate} disabled={!ready || generating}
        className="flex h-[52px] min-w-0 flex-1 items-center justify-between bg-[var(--swatch-1)] px-[18px] text-[15px] tracking-[1px] text-[var(--swatch-2)] transition-transform active:scale-[0.97] disabled:cursor-default">
        {generating ? 'GENERATING' : 'GENERATE'}
        <DiagonalArrow size={16} stroke={10} />
      </button>
      </div>
      {error && <p className="mt-[10px] text-[13px] text-[var(--ui-red)]">{error}</p>}
    </div>
  );
}
\`\`\`

## src/components/ad-copy/MobileCards.jsx
\`\`\`jsx
import { Avatar, Photo } from './AdPreview';
import { domainOf } from './copy';

// Phone versions of the platform previews (fixed platform colours, like AdPreview). Social keeps a
// 300px feed post; Search and Display fill the card. Header content starts 44px in, clear of the index chip.
function Social({ copy, brand, image }) {
  return (
    <div className="flex h-full w-[300px] flex-col bg-[var(--ad-white)] text-[var(--ad-social-ink)]">
      <div className="flex h-[52px] flex-none items-center gap-[8px] pl-[56px] pr-[12px]">
        <Avatar brand={brand} size={30} />
        <div className="leading-[1.15]">
          <div className="text-[15px] font-bold">{brand}</div>
          <div className="text-[12px] text-[var(--ad-social-muted)]">Sponsored</div>
        </div>
      </div>
      <p className="h-[60px] flex-none overflow-hidden px-[12px] text-[14px] leading-[1.4]">{copy.body}</p>
      <Photo url={image} className="min-h-0 w-full flex-1" />
      <div className="flex h-[52px] flex-none items-center justify-between gap-[8px] bg-[var(--ad-social-footer)] px-[12px]">
        <div className="min-w-0 leading-[1.2]">
          <div className="text-[12px] uppercase text-[var(--ad-social-muted)]">{domainOf(brand)}</div>
          <div className="truncate text-[15px] font-bold">{copy.headline}</div>
        </div>
        <span className="flex-none whitespace-nowrap rounded-[6px] bg-[var(--ad-social-chip)] px-[12px] py-[8px] text-[13px] font-bold">{copy.cta}</span>
      </div>
    </div>
  );
}

function Search({ copy, brand, category }) {
  return (
    <div className="relative h-full w-full bg-[var(--ad-white)] p-[20px] text-[var(--ad-search-ink)]">
      <div className="pl-[44px] text-[14px] font-bold leading-[24px]">Sponsored</div>
      <div className="mt-[12px] flex items-center gap-[10px]">
        <Avatar brand={brand} size={32} />
        <div>
          <div className="text-[16px] leading-[1.2]">{brand}</div>
          <div className="text-[13px] leading-[1.3] text-[var(--ad-search-muted)]">{domainOf(brand)} › {(category || 'shop').toLowerCase()}</div>
        </div>
      </div>
      <div className="mt-[20px] text-[24px] leading-[1.2] text-[var(--ad-link)]">{copy.headline}</div>
      <p className="mt-[8px] text-[16px] leading-[1.45] text-[var(--ad-search-body)]">{copy.body}</p>
      <div className="absolute bottom-[20px] left-[20px] text-[17px] font-semibold text-[var(--ad-link)]">{copy.cta} ›</div>
    </div>
  );
}

function Display({ copy, brand, image }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[var(--ad-cream)] text-[var(--ad-display-ink)]">
      <div className="relative h-[46%] flex-none">
        <Photo url={image} className="h-full w-full" />
        <span className="absolute left-[56px] top-[14px] text-[12px] font-bold uppercase tracking-[3px] text-[var(--ad-white)] [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]">{brand}</span>
        <span className="absolute right-[10px] top-[10px] rounded-[3px] bg-[var(--ad-white)] px-[6px] py-[2px] text-[12px] text-[var(--ad-badge)]">Ad</span>
      </div>
      <div className="px-[18px] pt-[16px]">
        <div className="text-[24px] font-bold leading-[1.08] tracking-[-0.5px]">{copy.headline}</div>
        <p className="mt-[8px] text-[15px] leading-[1.4] text-[var(--ad-display-body)]">{copy.body}</p>
      </div>
      <span className="absolute bottom-[18px] left-[18px] !rounded-full bg-[var(--ad-display-ink)] px-[18px] py-[11px] text-[14px] font-bold leading-none text-[var(--ad-cream)]">{copy.cta}</span>
    </div>
  );
}

export default function MobileCard({ platform, variant, brand, category }) {
  const props = { copy: variant[platform] ?? {}, brand, category, image: variant.image_url };
  if (platform === 'social') return <Social {...props} />;
  if (platform === 'search') return <Search {...props} />;
  return <Display {...props} />;
}
\`\`\`

## src/components/ad-copy/MobileCarousel.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MobileCard from './MobileCards';
import { Flip } from './Stage';
import { pad2 } from './copy';

const GAP = 12;

/** The variants as a swipe row: Social cards are 300px with the next one peeking; Search and Display fill the width. */
export default function MobileCarousel({ variants, selected, onSelect, platform, brand, category, over, flip, flipIndex }) {
  const row = useRef(null);
  const step = () => {
    const card = row.current?.firstElementChild;
    return card ? card.offsetWidth + GAP : 1;
  };
  // Keep the selected variant in view when the platform (and so the card width) changes.
  useEffect(() => { row.current?.scrollTo({ left: selected * step() }); }, [platform]); // eslint-disable-line react-hooks/exhaustive-deps
  const onScroll = () => {
    const index = Math.min(variants.length - 1, Math.max(0, Math.round(row.current.scrollLeft / step())));
    if (index !== selected) onSelect(index);
  };
  const pick = (i) => {
    onSelect(i);
    row.current?.scrollTo({ left: i * step(), behavior: 'smooth' });
  };
  const social = platform === 'social';

  return (
    <motion.div ref={row} onScroll={onScroll} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 0.15 }}
      className="flex min-h-0 flex-1 snap-x snap-mandatory gap-[12px] overflow-x-auto scroll-pl-[var(--m)] px-[var(--m)] py-[3px] [scrollbar-width:none]">
      {variants.map((variant, i) => {
        const active = i === selected;
        const red = active && over;
        return (
          <Flip key={variant.id} token={i === flipIndex ? flip : 0}
            className={\`h-full flex-none snap-start transition-opacity duration-300 \${social ? 'w-[300px]' : 'w-[calc(100vw-2*var(--m))]'} \${active ? '' : 'opacity-[0.55]'}\`}>
            <button type="button" onClick={() => pick(i)} aria-label={\`Variant \${pad2(i + 1)}\`} aria-pressed={active}
              className="relative block h-full w-full overflow-hidden text-left">
              <AnimatePresence initial={false}>
                <motion.div key={platform} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.3 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                  <MobileCard platform={platform} variant={variant} brand={brand} category={category} />
                </motion.div>
              </AnimatePresence>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-10"
                style={{ border: active ? \`2px solid \${red ? 'var(--ui-red)' : 'var(--swatch-1)'}\` : '1px solid var(--swatch-3)' }} />
              <span className={\`absolute left-[2px] top-[2px] z-10 px-[9px] py-[5px] text-[13px] leading-[15px] text-[var(--swatch-2)] \${red ? 'bg-[var(--ui-red)]' : 'bg-[var(--swatch-1)]'}\`}>{pad2(i + 1)}</span>
            </button>
          </Flip>
        );
      })}
      {/* Trailing room so the last 300px Social card can still reach its snap point on a wide phone. */}
      {social && <div aria-hidden="true" className="h-px w-[max(0px,calc(100vw-2*var(--m)-312px))] flex-none" />}
    </motion.div>
  );
}
\`\`\`

## src/components/ad-copy/MobileEmpty.jsx
\`\`\`jsx
import { EXAMPLES } from './copy';
import { DiagonalArrow } from './Icons';
import MobileBrief from './MobileBrief';

export default function MobileEmpty({ app }) {
  return (
    <div className="flex-1 overflow-y-auto pb-[28px]">
      <h1 className="mx-[var(--m)] mt-[28px] text-[64px] font-medium uppercase leading-[0.9] tracking-[-3px] md:text-[96px] md:tracking-[-4px]">What are you selling?</h1>
      <div className="mx-[var(--m)] mt-[28px]">
        <MobileBrief brief={app.brief} onChange={app.setBrief} onGenerate={app.generate} generating={app.generating} error={app.error} />
      </div>
      <h2 className="mx-[var(--m)] mt-[28px] text-[13px] uppercase leading-[16px]">Examples</h2>
      <div className="mt-[12px] flex snap-x snap-mandatory gap-[12px] overflow-x-auto scroll-pl-[var(--m)] px-[var(--m)] [scrollbar-width:none]">
        {EXAMPLES.map((example) => (
          <button key={example.brief} type="button" onClick={() => app.setBrief(example.brief)} aria-label={\`Use example: \${example.brief}\`}
            className="flex w-[240px] flex-none snap-start md:w-[320px] flex-col items-start border border-[var(--swatch-3)] bg-[var(--swatch-2)] p-[12px] text-left">
            <img src={example.image} alt="" className="h-[110px] w-full object-cover md:h-[180px]" />
            <span className="mt-[10px] text-[18px] font-medium leading-[1.1] md:text-[22px] tracking-[-0.3px]">{example.headline[0]}<br />{example.headline[1]}</span>
            <span className="mt-[14px] flex items-center gap-[8px] bg-[var(--swatch-1)] px-[12px] py-[9px] text-[13px] uppercase leading-none tracking-[0.8px] text-[var(--swatch-2)]">
              {example.cta}<DiagonalArrow size={10} stroke={12} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
\`\`\`

## src/components/ad-copy/MobileLayout.jsx
\`\`\`jsx
import { useState } from 'react';
import CampaignMenu, { MenuButton } from './CampaignMenu';
import MobileEmpty from './MobileEmpty';
import MobileResults from './MobileResults';
import { pad2 } from './copy';

/** The phone and tablet layout (below 1024px): one column, 20px margins (40px from 768px), the same tokens and type as desktop. */
export default function MobileLayout({ app }) {
  const [menu, setMenu] = useState(false);
  const results = app.phase === 'results';
  const brand = app.campaign?.brand ?? app.brand;

  return (
    <div className="acg relative flex h-[100dvh] min-h-[600px] flex-col overflow-hidden pb-[max(36px,env(safe-area-inset-bottom))] [--m:20px] md:[--m:40px]">
      <header className="mx-[var(--m)] mt-[14px] flex h-[44px] flex-none items-center">
        <button type="button" onClick={() => results && app.newCampaign()} aria-label="Home" className="flex h-[44px] items-center">
          <span className="acg-logo flex h-[26px] w-[46px] items-center justify-center !rounded-full border-[1.5px] border-[var(--swatch-1)] pt-[2px] text-[19px] leading-none">H</span>
        </button>
        <span className="ml-auto mr-[12px] min-w-0 truncate text-[12px] uppercase tracking-[0.8px] text-[var(--ui-muted)]">{results ? \`\${brand.toUpperCase()} — CAMPAIGN \${pad2(app.seq)}\` : 'NEW CAMPAIGN'}</span>
        <MenuButton open={menu} onToggle={() => setMenu((o) => !o)} />
      </header>
      {menu && (
        <CampaignMenu touch className="right-[var(--m)] top-[60px] w-[min(560px,calc(100vw-2*var(--m)))]" history={app.history}
          onClose={() => setMenu(false)} onOpen={app.openCampaign} onNew={app.newCampaign} signedIn={app.signedIn} onAccount={app.account} />
      )}
      {results ? <MobileResults app={app} brand={brand} /> : <MobileEmpty app={app} />}
    </div>
  );
}
\`\`\`

## src/components/ad-copy/MobileResults.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import MobileBrief from './MobileBrief';
import MobileCarousel from './MobileCarousel';
import MobileStrip from './MobileStrip';
import { FIELDS, LIMITS, PLATFORMS, fieldCount, pad2 } from './copy';

function Tabs({ platform, onSelect }) {
  return (
    <div className="mx-[var(--m)] flex flex-none gap-[22px]" role="tablist">
      {PLATFORMS.map((p) => (
        <button key={p} type="button" role="tab" aria-selected={p === platform} onClick={() => onSelect(p)}
          className={\`relative h-[44px] text-[15px] uppercase transition-colors duration-500 \${p === platform ? '' : 'text-[var(--ui-muted)]'}\`}>
          {p}
          {p === platform && <motion.span layoutId="acg-phone-tab" transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }} className="absolute inset-x-0 bottom-[8px] h-[2px] bg-[var(--swatch-4)]" />}
        </button>
      ))}
    </div>
  );
}

export default function MobileResults({ app, brand }) {
  const [editing, setEditing] = useState(false);
  const variant = app.variants[app.selected];
  const copy = variant?.[app.platform];
  const overFields = copy ? FIELDS.filter((f) => fieldCount(copy, f) > LIMITS[app.platform][f]).length : 0;
  const generate = () => { setEditing(false); app.generate(); };
  // Cancel drops the edit: the brief goes back to the shown campaign's.
  const cancel = () => { setEditing(false); if (app.campaign) app.setBrief(app.campaign.brief); };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mx-[var(--m)] mt-[16px] flex-none">
        {editing ? (
          <MobileBrief brief={app.brief} onChange={app.setBrief} onGenerate={generate} onCancel={cancel} generating={app.generating} error={app.error} />
        ) : (
          <button type="button" onClick={() => setEditing(true)} aria-label="Edit brief"
            className="flex min-h-[44px] w-full items-center border-y border-[var(--swatch-1)] py-[12px] text-left">
            <b className="flex-none text-[12px] font-bold">BRIEF</b>
            <span className="mx-[10px] h-[14px] w-px flex-none bg-[var(--swatch-1)]" />
            <span className="min-w-0 truncate text-[13px] uppercase">{app.brief}</span>
          </button>
        )}
        {!editing && app.error && <p className="mt-[10px] text-[13px] text-[var(--ui-red)]">{app.error}</p>}
      </div>
      <div className="mt-[8px]"><Tabs platform={app.platform} onSelect={app.setPlatform} /></div>
      <div className="mx-[var(--m)] mt-[8px] flex flex-none justify-between text-[12px] uppercase leading-[16px] tracking-[0.6px]">
        <span>Variants {variant && <span className="text-[var(--ui-muted)]">{pad2(app.selected + 1)} / {pad2(app.variants.length)}</span>}</span>
        {variant && (overFields
          ? <span className="text-[var(--ui-red)]">{overFields} {overFields === 1 ? 'field' : 'fields'} over limit</span>
          : <span className="text-[var(--ui-muted)]">Swipe →</span>)}
      </div>
      {variant ? (
        <div key={app.run} className="mt-[12px] flex min-h-0 flex-1 flex-col">
          <MobileCarousel variants={app.variants} selected={app.selected} onSelect={app.setSelected} platform={app.platform} brand={brand}
            category={app.campaign?.category} over={overFields > 0} flip={app.regen.flip} flipIndex={app.regen.index} />
          <div className="mx-[var(--m)] mt-[16px]">
            <MobileStrip copy={copy} platform={app.platform} selected={app.selected} regen={app.regen} onRegenerate={app.regenerate} />
          </div>
        </div>
      ) : (
        <p className="mx-[var(--m)] mt-[24px] text-[13px] uppercase tracking-[0.6px] text-[var(--ui-muted)]">Writing three variants…</p>
      )}
    </div>
  );
}
\`\`\`

## src/components/ad-copy/MobileStrip.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import CopyButton from './CopyButton';
import { FIELDS, LIMITS, fieldCount, pad2 } from './copy';
import { RegenIcon } from './Icons';
import { useCountUp } from './useCountUp';

function Cell({ name, count, limit, delay }) {
  const shown = useCountUp(count, delay);
  const over = count > limit;
  const fill = over ? 'var(--ui-red)' : count / limit > 0.85 ? 'var(--ui-bar)' : 'var(--swatch-1)';
  return (
    <div className={\`min-w-0 px-[10px] py-[12px] first:pl-0 last:pr-0 [&+&]:border-l [&+&]:border-[var(--swatch-1)] \${over ? 'text-[var(--ui-red)]' : ''}\`}>
      <div className="flex justify-between gap-[4px] text-[13px] uppercase leading-[16px]">
        {name}<span className={over ? '' : 'text-[var(--ui-muted)]'}>{limit}</span>
      </div>
      <div className="mt-[6px] flex items-baseline gap-[6px]" aria-live="polite">
        <span className="text-[30px] leading-[0.95] tracking-[-1.2px]">{shown}</span>
        {over && <span className="text-[13px]">+{count - limit}</span>}
      </div>
      <div className="mt-[8px] h-[3px] bg-[var(--swatch-3)]">
        <div className="h-full" style={{ width: \`\${Math.min(100, (shown / limit) * 100)}%\`, background: fill }} />
      </div>
    </div>
  );
}

/** Counters for the selected variant, then its full-width regenerate button. */
export default function MobileStrip({ copy, platform, selected, regen, onRegenerate }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay: 0.6 }} className="flex-none">
      <div className="grid grid-cols-3 border-t border-[var(--swatch-1)]">
        {FIELDS.map((field, i) => <Cell key={field} name={field} count={fieldCount(copy, field)} limit={LIMITS[platform][field]} delay={0.6 + 0.15 * i} />)}
      </div>
      <div className="grid grid-cols-3 gap-[10px]">
        {FIELDS.map((field) => <CopyButton key={field} text={copy?.[field] ?? ''} label={field} className="min-h-[44px] text-left text-[13px]" />)}
      </div>
      <button type="button" onClick={onRegenerate} disabled={regen.busy} aria-label={\`Regenerate variant \${pad2(selected + 1)}\`}
        className={\`mt-[12px] flex h-[50px] w-full items-center justify-center gap-[10px] border border-[var(--swatch-1)] text-[14px] tracking-[1px] transition-colors \${regen.waiting ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : ''}\`}>
        <motion.span key={regen.spin} initial={{ rotate: 0 }} animate={{ rotate: regen.spin ? 360 : 0 }} transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }} className="flex">
          <RegenIcon size={18} />
        </motion.span>
        REGENERATE VARIANT {pad2(selected + 1)}
      </button>
    </motion.div>
  );
}
\`\`\`

## src/components/ad-copy/PlatformTabs.jsx
\`\`\`jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PLATFORMS } from './copy';
import { moveFor } from './BriefRow';

export default function PlatformTabs({ visible, platform, onSelect }) {
  const refs = useRef({});
  const [line, setLine] = useState({ x: 0, width: 0 });
  useLayoutEffect(() => {
    const el = refs.current[platform];
    if (el) setLine({ x: el.offsetLeft, width: el.offsetWidth });
  }, [platform]);

  return (
    <motion.div initial={false} animate={{ opacity: visible ? 1 : 0, top: visible ? 226 : 300 }} transition={visible ? { opacity: { duration: 0.6, delay: 0.15 }, top: moveFor('results') } : { duration: 0.4 }}
      className={\`absolute left-[80px] z-10 h-[34px] \${visible ? '' : 'pointer-events-none'}\`} role="tablist">
      {PLATFORMS.map((p, i) => (
        <button key={p} ref={(el) => { refs.current[p] = el; }} type="button" role="tab" aria-selected={p === platform} onClick={() => onSelect(p)}
          style={{ left: i * 170 }}
          className={\`absolute top-0 text-[22px] uppercase leading-[28px] transition-colors duration-500 \${p === platform ? '' : 'text-[var(--ui-muted)]'}\`}>
          {p}
        </button>
      ))}
      <motion.span initial={false} animate={line} transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute left-0 top-[32px] h-[2px] bg-[var(--swatch-4)]" />
    </motion.div>
  );
}
\`\`\`

## src/components/ad-copy/Stage.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import AdPreview, { AUTHORED } from './AdPreview';

export const ENTER = [0.33, 1, 0.68, 1];
const HALF = 0.325;

/** Enters by fading, sliding up and revealing top to bottom. Outlines sit outside, so the clip leaves room. */
export function Reveal({ delay, rise, className, children }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: rise, clipPath: 'inset(-4px -4px 100% -4px)' }}
      animate={{ opacity: 1, y: 0, clipPath: 'inset(-4px -4px -4px -4px)' }}
      transition={{ opacity: { duration: 0.25, delay }, y: { duration: 1, ease: ENTER, delay }, clipPath: { duration: 0.9, ease: ENTER, delay } }}>
      {children}
    </motion.div>
  );
}

/** Flips on its vertical axis when \`token\` changes (the copy swaps at the midpoint), then pulses an accent glow. */
export function Flip({ token, className, children }) {
  const flip = useAnimationControls();
  const glow = useAnimationControls();
  const seen = useRef(token);
  useEffect(() => {
    if (token <= seen.current) return; // only a new regenerate flips, not re-selecting a flipped variant
    seen.current = token;
    flip.start({ scaleX: [1, 0, 1], scaleY: [1, 1.03, 1], transition: { duration: 0.75, ease: [0.65, 0, 0.35, 1] } })
      .then(() => glow.start({ opacity: [0, 1, 0], scale: [1, 1.004, 1], transition: { duration: 1.2 } }));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <motion.div animate={flip} className={\`relative \${className ?? ''}\`}>
      {children}
      <motion.span animate={glow} initial={{ opacity: 0 }} aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[0_0_0_3px_var(--swatch-4)]" />
    </motion.div>
  );
}

/** The variant's preview fitted into a box; on a tab change it morphs to the new size and cross-fades. */
export function FittedPreview({ platform, variant, brand, category, width, height, fixedWidth }) {
  const [w, h] = AUTHORED[platform];
  const scale = fixedWidth ? width / w : Math.min(width / w, height / h);
  return (
    <AnimatePresence initial={false}>
      <motion.div key={platform} className="absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, scale }}
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: HALF, delay: HALF } }} exit={{ opacity: 0, transition: { duration: HALF } }}>
        <AdPreview platform={platform} variant={variant} brand={brand} category={category} />
      </motion.div>
    </AnimatePresence>
  );
}

export default function Stage({ platform, variant, brand, category, boxWidth, over, flip }) {
  const [w, h] = AUTHORED[platform];
  const scale = Math.min(boxWidth / w, 640 / h);
  return (
    <Reveal delay={0.45} rise={56} className="flex justify-center">
      <Flip token={flip}>
        <motion.div initial={false} animate={{ width: w * scale, height: h * scale }} transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
          className="relative overflow-hidden bg-[var(--ad-white)]"
          style={{ outline: over ? '2px solid var(--ui-red)' : '1px solid var(--swatch-3)' }}>
          <FittedPreview platform={platform} variant={variant} brand={brand} category={category} width={boxWidth} height={640} />
        </motion.div>
      </Flip>
    </Reveal>
  );
}
\`\`\`

## src/components/ad-copy/Stats.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import Counter from './Counter';
import CopyButton from './CopyButton';
import { FIELDS, LIMITS, fieldCount, pad2 } from './copy';
import { RegenIcon } from './Icons';

const START = 1.05; // 0.9s after the first thumbnail
const fadeIn = (delay) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.35, delay } });

export function StatsLabel({ platform }) {
  return (
    <motion.div {...fadeIn(START)} className="flex justify-between text-[18px] uppercase leading-[22px] tracking-[0.6px]">
      Character count<span className="text-[var(--ui-muted)]">{platform} limits</span>
    </motion.div>
  );
}

export default function Stats({ copy, platform, selected, regen, onRegenerate }) {
  return (
    <div className="border-b border-[var(--swatch-1)]">
      {FIELDS.map((field, i) => {
        const delay = START + 0.15 * (i + 1);
        return (
          <motion.div key={field} {...fadeIn(delay)} className="flex items-end gap-[24px] border-t border-[var(--swatch-1)] py-[22px]">
            <div className="flex-1">
              <Counter name={field} count={fieldCount(copy, field)} limit={LIMITS[platform][field]} delay={delay}
                action={<CopyButton text={copy?.[field] ?? ''} label={field} className="tracking-[0.6px]" />} />
            </div>
            {field === 'cta' && (
              <button type="button" onClick={onRegenerate} disabled={regen.busy} aria-label={\`Regenerate variant \${pad2(selected + 1)}\`}
                className={\`acg-regen flex h-[56px] w-[56px] flex-none items-center justify-center border border-[var(--swatch-1)] transition-colors \${regen.waiting ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : 'bg-[var(--swatch-2)]'}\`}>
                <motion.span key={regen.spin} initial={{ rotate: 0 }} animate={{ rotate: regen.spin ? 360 : 0 }} transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }} className="flex">
                  <RegenIcon size={26} />
                </motion.span>
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
\`\`\`

## src/components/ad-copy/Thumbnails.jsx
\`\`\`jsx
import { Flip, FittedPreview, Reveal } from './Stage';
import { pad2 } from './copy';

export default function Thumbnails({ variants, selected, onSelect, platform, brand, category, overSelected, flip, flipIndex }) {
  return (
    <div className="flex flex-col gap-[20px]">
      {variants.map((variant, i) => {
        const active = i === selected;
        return (
          <Reveal key={variant.id} delay={0.15 + i * 0.4} rise={40}>
            <Flip token={i === flipIndex ? flip : 0}>
              <button type="button" onClick={() => onSelect(i)} aria-label={\`Variant \${pad2(i + 1)}\`} aria-pressed={active}
                className={\`relative block h-[200px] w-full text-left overflow-hidden bg-[var(--ad-white)] transition-opacity duration-300 \${active ? '' : 'opacity-[0.55]'}\`}
                style={{ outline: active ? \`2px solid \${overSelected ? 'var(--ui-red)' : 'var(--swatch-1)'}\` : '1px solid var(--swatch-3)' }}>
                <FittedPreview platform={platform} variant={variant} brand={brand} category={category} width={260} fixedWidth />
                <span className={\`absolute bottom-0 left-0 px-[10px] py-[5px] text-[18px] leading-[20px] tracking-[0.8px] \${active ? 'bg-[var(--swatch-1)] text-[var(--swatch-2)]' : 'bg-[var(--swatch-2)] text-[var(--swatch-1)]'}\`}>
                  {pad2(i + 1)}
                </span>
              </button>
            </Flip>
          </Reveal>
        );
      })}
    </div>
  );
}
\`\`\`

## src/components/ad-copy/useAdCopyGenerator.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { brandOf } from './copy';

const FLIP_MS = 750;
// The AI runs in backend functions that need a signed-in user: a 401 sends the visitor to the platform's sign-in.
const signInIfNeeded = (error) => {
  if (error?.response?.status === 401 || error?.status === 401) base44.auth.redirectToLogin?.();
};

export function useAdCopyGenerator() {
  const [brief, setBrief] = useState('');
  const [phase, setPhase] = useState('empty'); // 'empty' | 'results'
  const [pending, setPending] = useState(null); // seq of the generation running in this view
  const [reserved, setReserved] = useState(0); // highest seq handed to a generation still running
  const [error, setError] = useState('');
  const [campaign, setCampaign] = useState(null);
  const [variants, setVariants] = useState([]);
  const [platform, setPlatformState] = useState('social');
  const [selected, setSelected] = useState(0);
  const [run, setRun] = useState(0); // bumps on every result set, replaying the entrance
  const [regen, setRegen] = useState({ busy: false, waiting: false, spin: 0, flip: 0, index: 0 });
  const [history, setHistory] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const timers = useRef([]);
  // Bumps when the user opens or starts another campaign: work begun earlier finishes in the background.
  const view = useRef(0);
  const later = (ms, fn) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    (async () => {
      try {
        // Admins can read every user's campaigns: the history (and its numbering) is the current user's.
        const me = await base44.auth.me().catch(() => null);
        setSignedIn(Boolean(me));
        const { Campaign } = base44.entities;
        setHistory(await (me ? Campaign.filter({ created_by_id: me.id }, '-created_date', 50) : Campaign.list('-created_date', 50)));
      } catch {
        setHistory([]);
      }
    })();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const generating = pending !== null;
  const nextSeq = Math.max(reserved, ...history.map((c) => c.seq ?? 0)) + 1;
  const brand = campaign?.brand ?? brandOf(brief);
  const seq = campaign?.seq ?? pending ?? nextSeq;
  const leave = () => {
    view.current += 1;
    setPending(null);
    setRegen((r) => ({ ...r, busy: false, waiting: false }));
  };

  const generate = async () => {
    const text = brief.trim();
    if (text.length < 8 || generating) return;
    const mine = view.current;
    const here = () => view.current === mine;
    const mySeq = nextSeq;
    setPending(mySeq);
    setReserved(mySeq);
    setError('');
    const hadResults = Boolean(campaign);
    setPhase('results');
    try {
      const [result, image] = await Promise.all([
        base44.functions.invoke('writeCampaignCopy', { brief: text }).then((r) => r.data),
        // No image is fine: the previews fall back to a neutral placeholder.
        base44.functions.invoke('generateProductImage', { brief: text }).then((r) => r.data).catch(() => null),
      ]);
      const created = await base44.entities.Campaign.create({
        seq: mySeq, brief: text, brand: brandOf(text), category: result.category, active_platform: 'social',
      });
      // A campaign without its variants would reopen empty: drop it if they don't save.
      const rows = await base44.entities.Variant.bulkCreate(result.variants.slice(0, 3).map((v, index) => ({
        campaign_id: created.id, index, image_url: image?.url ?? '', search: v.search, social: v.social, display: v.display, regen_count: 0,
      }))).catch(async (e) => {
        await base44.entities.Campaign.delete(created.id).catch(() => {});
        throw e;
      });
      setHistory((list) => [created, ...list]);
      if (!here()) return;
      setCampaign(created);
      setVariants(rows.sort((a, b) => a.index - b.index));
      setPlatformState('social');
      setSelected(0);
      setRun((n) => n + 1);
    } catch (error) {
      signInIfNeeded(error);
      setReserved((r) => (r === mySeq ? mySeq - 1 : r));
      if (!here()) return;
      setError('Couldn’t generate that one — try again.');
      if (!hadResults) setPhase('empty');
    } finally {
      if (here()) setPending(null);
    }
  };

  const regenerate = async () => {
    const variant = variants[selected];
    if (!variant || !campaign || regen.busy) return;
    const index = selected;
    const mine = view.current;
    const here = () => view.current === mine;
    setRegen((r) => ({ ...r, busy: true, waiting: true, spin: r.spin + 1 }));
    setError('');
    try {
      const { data: next } = await base44.functions.invoke('regenerateVariant', {
        brief: campaign.brief, index, previous: { search: variant.search, social: variant.social, display: variant.display },
      });
      const data = { search: next.search, social: next.social, display: next.display, regen_count: (variant.regen_count ?? 0) + 1 };
      base44.entities.Variant.update(variant.id, data).catch(() => {});
      if (!here()) return;
      setRegen((r) => ({ ...r, waiting: false, flip: r.flip + 1, index }));
      // The new copy swaps in at the flip's midpoint, when the card is edge-on.
      later(FLIP_MS / 2, () => setVariants((list) => list.map((v) => (v.id === variant.id ? { ...v, ...data } : v))));
      later(FLIP_MS, () => here() && setRegen((r) => ({ ...r, busy: false })));
    } catch (error) {
      signInIfNeeded(error);
      if (!here()) return;
      setError('Couldn’t regenerate that variant — try again.');
      setRegen((r) => ({ ...r, busy: false, waiting: false }));
    }
  };

  const setPlatform = (next) => {
    setPlatformState(next);
    if (campaign) base44.entities.Campaign.update(campaign.id, { active_platform: next }).catch(() => {});
  };

  const openCampaign = async (c) => {
    let rows;
    try {
      rows = await base44.entities.Variant.filter({ campaign_id: c.id });
    } catch {
      setError('Couldn’t open that campaign — try again.');
      return;
    }
    leave();
    setError('');
    setBrief(c.brief);
    setCampaign(c);
    setVariants(rows.sort((a, b) => a.index - b.index));
    setPlatformState(c.active_platform ?? 'social');
    setSelected(0);
    setPhase('results');
    setRun((n) => n + 1);
  };

  const newCampaign = () => {
    leave();
    setError('');
    setPhase('empty');
    setCampaign(null);
    setVariants([]);
    setBrief('');
  };

  return {
    brief, setBrief, phase, generating, error, generate, campaign, variants, platform, setPlatform,
    selected, setSelected, run, regen, regenerate, history, openCampaign, newCampaign, brand, seq,
    signedIn,
    account: () => (signedIn ? base44.auth.logout() : base44.auth.redirectToLogin()),
  };
}
\`\`\`

## src/components/ad-copy/useCanvasScale.js
\`\`\`js
import { useEffect, useState } from 'react';

const DESIGN = { width: 1920, height: 1080, min: 1024 };

// The page is composed on a 1920×1080 canvas (absolute tops, as in the design). Below 1920px wide it
// scales down whole with CSS zoom; wider, the canvas grows and the columns reflow.
const measure = () => {
  if (typeof window === 'undefined') return { zoom: 1, width: DESIGN.width, height: DESIGN.height };
  const zoom = Math.min(1, Math.max(DESIGN.min, window.innerWidth) / DESIGN.width);
  return {
    zoom,
    width: Math.max(DESIGN.width, window.innerWidth / zoom),
    height: Math.max(DESIGN.height, window.innerHeight / zoom),
  };
};

export function useCanvasScale() {
  const [canvas, setCanvas] = useState(measure);
  useEffect(() => {
    const onResize = () => setCanvas(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return canvas;
}
\`\`\`

## src/components/ad-copy/useCountUp.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

/** The shown number for a count: counts up on first show (after \`delay\`), then interpolates to each new value. */
export function useCountUp(count, delay = 0) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  const first = useRef(true);
  useEffect(() => {
    const controls = animate(from.current, count, {
      duration: first.current ? 1 : 0.65, delay: first.current ? delay : 0, ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => { from.current = v; setShown(Math.round(v)); },
    });
    first.current = false;
    return () => controls.stop();
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps
  return shown;
}
\`\`\`

## src/components/ad-copy/useIsPhone.js
\`\`\`js
import { useEffect, useState } from 'react';

// Phones and tablets: below 1024px the desktop canvas would have to shrink past legibility.
const QUERY = '(max-width: 1023px)';

/** True below 1024px wide, where the page switches to its single-column layout. */
export function useIsPhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && (window.matchMedia?.(QUERY).matches ?? false));
  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return undefined;
    const onChange = () => setPhone(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return phone;
}
\`\`\`

## src/pages/AdCopyGenerator.jsx
\`\`\`jsx
import { MotionConfig, motion } from 'framer-motion';
import '@/components/ad-copy/ad-copy.css';
import Header from '@/components/ad-copy/Header';
import BriefRow from '@/components/ad-copy/BriefRow';
import EmptyState from '@/components/ad-copy/EmptyState';
import PlatformTabs from '@/components/ad-copy/PlatformTabs';
import Thumbnails from '@/components/ad-copy/Thumbnails';
import Stage from '@/components/ad-copy/Stage';
import Stats, { StatsLabel } from '@/components/ad-copy/Stats';
import { isOver, pad2 } from '@/components/ad-copy/copy';
import { useAdCopyGenerator } from '@/components/ad-copy/useAdCopyGenerator';
import { useCanvasScale } from '@/components/ad-copy/useCanvasScale';
import { useIsPhone } from '@/components/ad-copy/useIsPhone';
import MobileLayout from '@/components/ad-copy/MobileLayout';

// Fixed side columns around the stage: 80px margins, 260px thumbnails, 480px stats, 60px gutters.
const SIDES = 80 * 2 + 260 + 480 + 60 * 2;

export default function AdCopyGenerator() {
  const app = useAdCopyGenerator();
  const canvas = useCanvasScale();
  const phone = useIsPhone();
  const results = app.phase === 'results';
  const variant = app.variants[app.selected];
  const over = variant ? isOver(variant[app.platform], app.platform) : false;
  const shared = { platform: app.platform, brand: app.campaign?.brand ?? app.brand, category: app.campaign?.category };

  if (phone) return <MotionConfig reducedMotion="user"><MobileLayout app={app} /></MotionConfig>;

  return (
    <MotionConfig reducedMotion="user">
      <div className="acg h-screen overflow-auto">
        <div className="relative overflow-hidden" style={{ zoom: canvas.zoom, width: canvas.width, height: canvas.height }}>
          <Header results={results} brand={app.brand} seq={app.seq} history={app.history} onOpen={app.openCampaign} onNew={app.newCampaign} signedIn={app.signedIn} onAccount={app.account} />
          <EmptyState visible={!results} onPick={app.setBrief} />
          <BriefRow phase={app.phase} brief={app.brief} onChange={app.setBrief} onGenerate={app.generate} generating={app.generating} error={app.error} />
          <PlatformTabs visible={results} platform={app.platform} onSelect={app.setPlatform} />
          {results && variant && (
            <div key={app.run} className="absolute left-[80px] right-[80px] top-[300px] grid grid-cols-[260px_1fr_480px] grid-rows-[48px_auto] gap-x-[60px]">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="text-[18px] uppercase leading-[22px] tracking-[0.6px]">
                Variants <span className="text-[var(--ui-muted)]">{pad2(app.selected + 1)} / {pad2(app.variants.length)}</span>
              </motion.div>
              <div />
              <StatsLabel platform={app.platform} />
              <Thumbnails variants={app.variants} selected={app.selected} onSelect={app.setSelected} overSelected={over}
                flip={app.regen.flip} flipIndex={app.regen.index} {...shared} />
              <Stage variant={variant} boxWidth={canvas.width - SIDES} over={over} flip={app.regen.index === app.selected ? app.regen.flip : 0} {...shared} />
              <Stats copy={variant[app.platform]} platform={app.platform} selected={app.selected} regen={app.regen} onRegenerate={app.regenerate} />
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
\`\`\`
`;export{e as default};