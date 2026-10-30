var e=`# social_post_generator — app files

## base44/entities/BrandSettings.jsonc
\`\`\`json
{
  "name": "BrandSettings",
  "type": "object",
  "properties": {
    "name": { "type": "string", "default": "Atelier Nord" },
    "handle": { "type": "string", "default": "ateliernord" },
    "instagram": { "type": "string", "default": "atelier.nord" },
    "voice": { "type": "string" }
  },
  "required": ["name"],
  "rls": {
    "read": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "create": { "$or": [{ "user_condition": { "role": "admin" } }, { "user_condition": { "role": "user" } }] },
    "update": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "delete": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] }
  }
}
\`\`\`

## base44/entities/Image.jsonc
\`\`\`json
{
  "name": "Image",
  "type": "object",
  "properties": {
    "url": { "type": "string" },
    "name": { "type": "string" },
    "sample": { "type": "boolean", "description": "A sample row the app added on its first load" }
  },
  "required": ["url"],
  "rls": {
    "read": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "create": { "$or": [{ "user_condition": { "role": "admin" } }, { "user_condition": { "role": "user" } }] },
    "update": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "delete": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] }
  }
}
\`\`\`

## base44/entities/Post.jsonc
\`\`\`json
{
  "name": "Post",
  "type": "object",
  "properties": {
    "platform": { "type": "string", "enum": ["instagram", "linkedin", "x"] },
    "text": { "type": "string" },
    "title": { "type": "string", "description": "Short label shown on the calendar chip" },
    "imageUrls": { "type": "array", "items": { "type": "string" } },
    "topic": { "type": "string" },
    "topicId": { "type": "string" },
    "scheduledAt": { "type": ["string", "null"], "format": "date-time" },
    "sample": { "type": "boolean", "description": "A sample row the app added on its first load" }
  },
  "required": ["platform", "text"],
  "rls": {
    "read": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "create": { "$or": [{ "user_condition": { "role": "admin" } }, { "user_condition": { "role": "user" } }] },
    "update": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "delete": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] }
  }
}
\`\`\`

## base44/entities/Topic.jsonc
\`\`\`json
{
  "name": "Topic",
  "type": "object",
  "properties": {
    "text": { "type": "string" },
    "imageUrls": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["text"],
  "rls": {
    "read": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "create": { "$or": [{ "user_condition": { "role": "admin" } }, { "user_condition": { "role": "user" } }] },
    "update": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] },
    "delete": { "$or": [{ "created_by_id": "{{user.id}}" }, { "user_condition": { "role": "admin" } }] }
  }
}
\`\`\`

## base44/functions/generatePosts/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Writes the Instagram, LinkedIn and X posts for one topic in a single LLM call.
const RULES = {
  instagram: 'instagram: casual; 2–4 short paragraphs; ends with a question; exactly 4 lowercase hashtags on their own last line; at most 2,200 characters.',
  linkedin: 'linkedin: professional, first-person plural ("we"); 3 short paragraphs separated by blank lines; a forward-looking closing line; then exactly 3 CamelCase hashtags on their own last line; at most 3,000 characters.',
  x: 'x: punchy; 1–2 sentences; 1–2 hashtags; strictly at most 280 characters including hashtags.',
};
const POST = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    title: { type: 'string', description: 'a 2–4 word label for the calendar, e.g. "Autumn capsule launch"' },
  },
  required: ['text', 'title'],
};
const LIMITS = { instagram: 2200, linkedin: 3000, x: 280 };
const MAX_IMAGES = 6;

const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const fit = (text, max) => (text.length <= max ? text : \`\${text.slice(0, max - 1).replace(/\\s+\\S*$/, '')}…\`);
const imagesOf = (list) => (Array.isArray(list) ? list : [])
  .slice(0, MAX_IMAGES)
  .map((i) => ({ url: str(i?.url, 1000), name: str(i?.name, 100) }))
  .filter((i) => /^https:\\/\\//.test(i.url));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const topic = str(body.topic, 500);
    if (!topic) return Response.json({ error: 'Describe a topic or paste a link.' }, { status: 400 });
    const images = imagesOf(body.images);
    const brand = {
      name: str(body.brand?.name, 80) || 'our brand',
      handle: str(body.brand?.handle, 40).replace(/^@/, ''),
      instagram: str(body.brand?.instagram, 40).replace(/^@/, ''),
      voice: str(body.brand?.voice, 500),
    };
    const handles = [brand.instagram && \`Instagram @\${brand.instagram}\`, brand.handle && \`X @\${brand.handle}\`].filter(Boolean);

    const prompt = [
      \`You write social posts for the brand \${brand.name}\${handles.length ? \` (\${handles.join(', ')})\` : ''}.\`,
      brand.voice ? \`Brand voice: \${brand.voice}\` : '',
      \`Topic or link: \${topic}\`,
      'If the topic is plainly about a different business than this brand, write as that business and leave the brand and its handles out.',
      images.length ? \`\${images.length} attached image(s), in order: \${images.map((i) => i.name || 'photo').join('; ')}. Use what they show.\` : 'No images attached.',
      '',
      'Write one post per platform:',
      \`- \${RULES.instagram}\`,
      \`- \${RULES.linkedin}\`,
      \`- \${RULES.x}\`,
      'Return JSON with the fields instagram, linkedin and x, each { text, title }.',
    ].join('\\n');

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: /https?:\\/\\//.test(topic), // a pasted link: read the page, not just its URL
      response_json_schema: { type: 'object', properties: { instagram: POST, linkedin: POST, x: POST }, required: ['instagram', 'linkedin', 'x'] },
      file_urls: images.map((i) => i.url),
    });

    const out = {};
    for (const platform of ['instagram', 'linkedin', 'x']) {
      const post = result?.[platform];
      if (!post?.text) return Response.json({ error: 'The model returned no posts. Try again.' }, { status: 502 });
      out[platform] = { text: fit(String(post.text).trim(), LIMITS[platform]), title: str(post.title, 60) };
    }
    return Response.json(out);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## base44/functions/regeneratePost/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Rewrites one platform's post from a noticeably different angle.
const RULES = {
  instagram: 'instagram: casual; 2–4 short paragraphs; ends with a question; exactly 4 lowercase hashtags on their own last line; at most 2,200 characters.',
  linkedin: 'linkedin: professional, first-person plural ("we"); 3 short paragraphs separated by blank lines; a forward-looking closing line; then exactly 3 CamelCase hashtags on their own last line; at most 3,000 characters.',
  x: 'x: punchy; 1–2 sentences; 1–2 hashtags; strictly at most 280 characters including hashtags.',
};
const NAMES = { instagram: 'Instagram', linkedin: 'LinkedIn', x: 'X' };
const LIMITS = { instagram: 2200, linkedin: 3000, x: 280 };
const MAX_IMAGES = 6;

const str = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const fit = (text, max) => (text.length <= max ? text : \`\${text.slice(0, max - 1).replace(/\\s+\\S*$/, '')}…\`);
const imagesOf = (list) => (Array.isArray(list) ? list : [])
  .slice(0, MAX_IMAGES)
  .map((i) => ({ url: str(i?.url, 1000), name: str(i?.name, 100) }))
  .filter((i) => /^https:\\/\\//.test(i.url));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const platform = body.platform;
    if (!RULES[platform]) return Response.json({ error: 'Unknown platform.' }, { status: 400 });
    const topic = str(body.topic, 500);
    if (!topic) return Response.json({ error: 'Missing topic.' }, { status: 400 });
    const current = str(body.current, 3200);
    const images = imagesOf(body.images);
    const brand = {
      name: str(body.brand?.name, 80) || 'our brand',
      handle: str(body.brand?.handle, 40).replace(/^@/, ''),
      instagram: str(body.brand?.instagram, 40).replace(/^@/, ''),
      voice: str(body.brand?.voice, 500),
    };
    const handles = [brand.instagram && \`Instagram @\${brand.instagram}\`, brand.handle && \`X @\${brand.handle}\`].filter(Boolean);

    const prompt = [
      \`You write social posts for the brand \${brand.name}\${handles.length ? \` (\${handles.join(', ')})\` : ''}.\`,
      brand.voice ? \`Brand voice: \${brand.voice}\` : '',
      \`Topic or link: \${topic}\`,
      'If the topic is plainly about a different business than this brand, write as that business and leave the brand and its handles out.',
      images.length ? \`\${images.length} attached image(s), in order: \${images.map((i) => i.name || 'photo').join('; ')}. Use what they show.\` : 'No images attached.',
      '',
      \`Rewrite the \${NAMES[platform]} post from a noticeably different angle (a new hook, a different detail). Do not reuse its opening.\`,
      \`Rules — \${RULES[platform]}\`,
      current ? \`Current version:\\n\${current}\` : '',
      '',
      'Return JSON { text, title }.',
    ].join('\\n');

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: /https?:\\/\\//.test(topic), // a pasted link: read the page, not just its URL
      response_json_schema: {
        type: 'object',
        properties: { text: { type: 'string' }, title: { type: 'string', description: 'a 2–4 word label for the calendar' } },
        required: ['text', 'title'],
      },
      file_urls: images.map((i) => i.url),
    });
    if (!result?.text) return Response.json({ error: 'The model returned no post. Try again.' }, { status: 502 });
    return Response.json({ text: fit(String(result.text).trim(), LIMITS[platform]), title: str(result.title, 60) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## src/components/captelle/AccountView.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const FIELDS = [
  ['name', 'Brand name'],
  ['instagram', 'Instagram username'],
  ['handle', 'X handle'],
];

/** Account: the brand the posts are written for, and its voice (sent with every request). */
export default function AccountView({ brand, onSave }) {
  const [form, setForm] = useState(() => ({ name: brand.name, instagram: brand.instagram, handle: brand.handle, voice: brand.voice }));
  const [state, setState] = useState('');
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    base44.auth.me().then(setUser, () => setUser(null));
  }, []);
  const set = (key) => (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setState(''); };
  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || state === 'saving') return;
    setState('saving');
    try {
      await onSave({ ...form, name: form.name.trim(), handle: form.handle.replace(/^@/, '').trim(), instagram: form.instagram.replace(/^@/, '').trim() });
      setState('saved');
    } catch {
      setState('error');
    }
  };
  const input = 'mt-[6px] block min-h-[40px] w-full border border-[var(--ui-line)] bg-transparent px-3 text-[15px] text-[var(--swatch-1)] outline-none focus:border-[var(--swatch-1)] max-lg:min-h-[44px] max-lg:text-[16px]';

  return (
    <div className="flex max-w-[640px] flex-col gap-[14px]">
      <section className="cp-panel flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <b className="block text-[17px] font-medium">Account</b>
          <span className="text-[14px] text-[var(--ui-muted)]">{user === undefined ? '…' : user ? \`Signed in as \${user.email}\` : 'Not signed in'}</span>
        </div>
        {user === null && <button type="button" onClick={() => base44.auth.redirectToLogin()} className="cp-on min-h-[36px] px-4 text-[14px] font-semibold max-lg:min-h-[44px]">Sign in</button>}
        {user && <button type="button" onClick={() => base44.auth.logout()} className="cp-tag min-h-[36px] px-4 text-[14px] font-semibold max-lg:min-h-[44px]">Sign out</button>}
      </section>
      <form onSubmit={save} className="cp-panel flex flex-col gap-4 p-5">
        <b className="text-[17px] font-medium">Brand</b>
        <div className="grid gap-4 lg:grid-cols-3">
          {FIELDS.map(([key, label]) => (
            <label key={key} className="block text-[13px] font-medium text-[var(--ui-muted)]">{label}
              <input value={form[key]} onChange={set(key)} className={input} />
            </label>
          ))}
        </div>
        <label className="block text-[13px] font-medium text-[var(--ui-muted)]">Brand voice
          <textarea rows={3} value={form.voice} onChange={set('voice')} className={\`\${input} resize-y py-2 leading-[21px]\`} />
        </label>
        <div className="flex items-center justify-end gap-3">
          {state === 'saved' && <span className="text-[13px] text-[var(--ui-muted)]">Saved</span>}
          {state === 'error' && <span className="text-[13px]">Couldn’t save. Try again.</span>}
          <button type="submit" disabled={state === 'saving'} className="cp-on min-h-[36px] px-4 text-[14px] font-semibold disabled:opacity-50 max-lg:min-h-[44px]">Save</button>
        </div>
      </form>
    </div>
  );
}
\`\`\`

## src/components/captelle/Bars.jsx
\`\`\`jsx
import { CalendarDays, Images, Sparkles, UserRound } from './Icons';
import { TABS } from './TopBar';

const Segments = ({ options, value, onChange, widths }) => (
  <span className="flex">
    {options.map((o, i) => (
      <button key={o} type="button" onClick={() => onChange(o)}
        className={\`h-[19px] pl-[3px] text-left text-[14px] font-medium leading-none \${widths[i] ?? widths[0]} \${value === o ? 'cp-on' : 'cp-tag'}\`}>{o}</button>
    ))}
  </span>
);

/** Desktop bottom bar: Grid | List and 3 | 2 | 1 on the left, the platform filter on the right. */
export function BottomBar({ hidden, view, setView, cols, setCols, filter, setFilter }) {
  return (
    <footer className={\`fixed inset-x-0 bottom-[5px] z-30 flex items-center justify-between px-4 transition-opacity duration-500 \${hidden ? 'pointer-events-none opacity-0' : ''}\`}>
      <span className="flex">
        <Segments options={['Grid', 'List']} value={view} onChange={setView} widths={['w-[69px]', 'w-[70px]']} />
        <Segments options={['3', '2', '1']} value={String(cols)} onChange={(c) => setCols(Number(c))} widths={['w-[29px]']} />
      </span>
      <Segments options={['All posts', 'Instagram', 'LinkedIn', 'X']} value={filter} onChange={setFilter} widths={['w-[80px]', 'w-[80px]', 'w-[80px]', 'w-[40px]']} />
    </footer>
  );
}

const ICONS = { Generate: Sparkles, Calendar: CalendarDays, Library: Images, Account: UserRound };

/** Phone tab bar: the desktop tabs, at the bottom. */
export function MobileTabs({ tab, onTab }) {
  return (
    <nav className="cp-panel fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--ui-line)] pb-[env(safe-area-inset-bottom)]">
      {TABS.map((t) => {
        const Icon = ICONS[t];
        return (
          <button key={t} type="button" onClick={() => onTab(t)} className={\`flex min-h-[56px] flex-col items-center justify-center gap-[3px] text-[12px] font-medium \${tab === t ? 'cp-on' : ''}\`}>
            <Icon size={18} strokeWidth={1.8} />{t}
          </button>
        );
      })}
    </nav>
  );
}
\`\`\`

## src/components/captelle/captelle.css
\`\`\`css
@font-face{font-family:"Geist";font-weight:100 900;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/geist-variable-normal.woff2) format("woff2")}
/* Stand-in for Geist Mono until it is hosted. */
@font-face{font-family:"Captelle Mono";font-weight:100 800;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/jetbrains-mono-variable-normal.woff2) format("woff2")}

/* The look recolours the shell only: ink, surface, panel and tag (--swatch-N), plus the shell's UI colours.
   The previews keep each platform's own colours (--pf-*). */
:root{
  --swatch-1:#111214;--swatch-1-ink:#FFFFFF;
  --swatch-2:#C9B7D9;--swatch-2-ink:#111111;
  --swatch-3:#F4F3F1;--swatch-3-ink:#111111;
  --swatch-4:#F1F2F4;--swatch-4-ink:#111111;
  --ui-muted:#2E2D2A;--ui-line:#DDD8D3;--ui-tag2:#E4E1DD;--ui-tint:rgba(255,255,255,0.18);
  --ui-chip:#FFFFFF;--ui-chip-edge:transparent;--ui-ghost:rgba(255,255,255,0.3);--ui-field-edge:transparent;
  --ui-shadow:rgba(17,18,20,0.08);
}
/* gallery-look */
:root{
  --pf-card:#FFFFFF;--pf-text:#0F1419;--pf-mute:#737373;--pf-avatar:#2D4263;
  --pf-ig-edge:#DBDBDB;--pf-ig-tag:#00376B;--pf-ig-blue:#0095F6;--pf-ig-dot:#D62976;
  --pf-li-edge:#E0DFDC;--pf-li:#0A66C2;--pf-li-mute:#666666;
  --pf-x-edge:#EFF3F4;--pf-x:#1D9BF0;--pf-x-mute:#536471;--pf-x-flash:rgba(29,155,240,0.45);
  --pf-photo:#ECECEC;
}

.cp{isolation:isolate;font-family:"Geist",system-ui,-apple-system,"Helvetica Neue",sans-serif;color:var(--swatch-1);background:var(--swatch-2);-webkit-font-smoothing:antialiased;letter-spacing:-0.005em}
.cp *{border-radius:0}
.cp-mono{font-family:"Captelle Mono",ui-monospace,"SF Mono",Menlo,monospace;letter-spacing:0}
.cp-caps{letter-spacing:0.16em;text-transform:none}
.cp-panel{background:var(--swatch-3);box-shadow:0 10px 30px var(--ui-shadow);border:1px solid var(--ui-field-edge)}
.cp-tag{background:var(--swatch-4);color:var(--swatch-1)}
.cp-on{background:var(--swatch-1);color:var(--swatch-1-ink)}
.cp-tag2{background:var(--ui-tag2);color:var(--swatch-1)}
.cp-hint{background:color-mix(in srgb,var(--ui-muted) 62%,var(--swatch-3));color:var(--swatch-3)}
.cp-chip{background:var(--ui-chip);border:1px solid var(--ui-chip-edge)}
.cp-scroll{scrollbar-width:none}
.cp-scroll::-webkit-scrollbar{display:none}

/* Background: the blurred illustration drifting slowly under the look's tint. */
.cp-bg{position:fixed;z-index:-1;inset:-18.5%;background-size:cover;background-position:center;filter:blur(10px);animation:cp-drift 38s ease-in-out infinite alternate;will-change:transform}
.cp-bg::after{content:"";position:absolute;inset:0;background:var(--ui-tint)}
@keyframes cp-drift{from{transform:translate3d(2.5%,-0.5%,0)}to{transform:translate3d(-0.5%,1.5%,0)}}
@media (prefers-reduced-motion:reduce){.cp-bg{animation:none}}

.cp-ghost{background:var(--ui-ghost);position:relative;overflow:hidden}
.cp-ghost::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,0.28) 50%,transparent 70%);background-size:220% 100%;animation:cp-shimmer 1.4s linear infinite}
@keyframes cp-shimmer{from{background-position:120% 0}to{background-position:-120% 0}}
.cp-drop{border:1px dashed color-mix(in srgb,var(--swatch-1) 55%,transparent);background:linear-gradient(90deg,color-mix(in srgb,var(--swatch-3) 45%,transparent),color-mix(in srgb,var(--swatch-3) 70%,transparent))}
.cp-slot-over{outline:1.5px dashed var(--swatch-1);outline-offset:-5px}
.cp-caret{display:inline-block;width:1.5px;height:1.05em;margin-left:1px;vertical-align:-0.15em;background:currentColor}
.cp-spin{animation:cp-rot 0.9s linear infinite}
@keyframes cp-rot{to{transform:rotate(360deg)}}

/* The platform previews: system font, their own colours and radii. */
.pf{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--pf-card);color:var(--pf-text);letter-spacing:0}
.cp .pf-ig{border:1px solid var(--pf-ig-edge);border-radius:7px;overflow:hidden}
.cp .pf-li{border:1px solid var(--pf-li-edge);border-radius:7px;overflow:hidden}
.cp .pf-x{border:1px solid var(--pf-x-edge);border-radius:12px;overflow:hidden}
.cp .pf-x-photo{border-radius:11px;border:1px solid var(--pf-x-edge)}
.cp .pf-round{border-radius:9999px}
.pf-ring{background:conic-gradient(from 200deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5,#FEDA75)}
\`\`\`

## src/components/captelle/Composer.jsx
\`\`\`jsx
import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Link2, LoaderCircle, X } from './Icons';
import ImagePicker from './ImagePicker';

const GLIDE = { layout: { duration: 1, ease: [0.65, 0, 0.35, 1] } };

/** The topic field: attach icon, multi-line text that grows, Generate; under it the attached images, the drop target and the picker. */
export default function Composer({ bar, mobile, topic, setTopic, attached, onRemove, picker, imageDrag, status, onGenerate, onFiles }) {
  const area = useRef(null);
  const writing = status === 'writing';
  useLayoutEffect(() => {
    const el = area.current;
    el.style.height = 'auto';
    el.style.height = \`\${el.scrollHeight}px\`;
  }, [topic, bar, mobile]);

  const dropping = imageDrag?.payload?.kind === 'images';
  const overField = dropping && imageDrag.over === 'field';
  const showBelow = picker.open || dropping || (!bar && attached.length > 0);

  return (
    <div className={\`relative \${bar ? 'w-full' : mobile ? 'w-full max-w-[680px]' : 'w-[59.5%] min-w-[560px]'}\`}>
      <motion.div layout layoutId="composer" transition={GLIDE} data-drop="field"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); }}
        className={\`cp-panel relative z-20 flex items-start \${bar ? 'min-h-[40px] gap-[9px] py-[6px] pl-[10px] pr-[6px]' : 'min-h-[53px] gap-[9px] py-[6px] pl-[10px] pr-[6px]'}\`}>
        <motion.button layout transition={GLIDE} type="button" onClick={picker.toggle} aria-label="Add images"
          className={\`flex flex-none items-center justify-center border border-[var(--ui-line)] \${bar ? 'mt-[3px] h-[22px] w-[22px]' : 'mt-[4px] h-[30px] w-[30px]'} \${picker.open ? 'cp-tag2' : ''}\`}>
          <Link2 size={bar ? 12 : 15} strokeWidth={1.8} className="-rotate-45" />
        </motion.button>
        <motion.label layout transition={GLIDE} className="flex min-w-0 flex-1 self-center">
          <span className="sr-only">Topic</span>
          <textarea ref={area} rows={1} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Paste a link or describe a topic"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onGenerate(); } }}
            className={\`block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-[color-mix(in_srgb,var(--swatch-1)_62%,transparent)] \${bar ? 'text-[14px] leading-[20px]' : mobile ? 'text-[17px] leading-[24px]' : 'text-[17px] leading-[24px]'}\`} />
        </motion.label>
        <motion.button layout transition={GLIDE} type="button" onClick={onGenerate} disabled={writing}
          className={\`cp-on flex flex-none items-center justify-center gap-[7px] font-semibold \${bar ? 'h-[28px] w-[96px] text-[13px]' : 'h-[40px] w-[109px] text-[16px]'}\`}>
          {writing ? <><LoaderCircle size={bar ? 12 : 14} className="cp-spin" />Writing</> : <>Generate <ArrowRight size={bar ? 12 : 13} strokeWidth={2} /></>}
        </motion.button>
      </motion.div>

      {showBelow && (
        <div className={\`\${bar ? 'absolute inset-x-0 top-full z-30' : 'absolute inset-x-0 top-full z-30'}\`}>
          <div className="relative mt-[11px] h-[45px]">
            {!bar && attached.length > 0 && (
              <div className="flex gap-[6px]">
                {attached.map((img) => (
                  <span key={img.id} className="relative h-[44px] w-[44px] flex-none border border-[var(--ui-line)] bg-[var(--pf-photo)]">
                    <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
                    <button type="button" onClick={() => onRemove(img.id)} aria-label="Remove image" className="cp-on pf-round absolute -right-[5px] -top-[5px] flex h-[15px] w-[15px] items-center justify-center"><X size={9} strokeWidth={2.5} /></button>
                  </span>
                ))}
              </div>
            )}
            {dropping && (
              <div data-drop="field" className={\`cp-drop absolute inset-0 flex items-center justify-center text-[12.5px] \${overField ? 'bg-[var(--swatch-3)]' : ''}\`}>Drop images here</div>
            )}
          </div>
          {picker.open && <ImagePicker picker={picker} mobile={mobile} bar={bar} attached={attached} onRemove={onRemove} />}
        </div>
      )}
    </div>
  );
}
\`\`\`

## src/components/captelle/content.js
\`\`\`js
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/social-post-generator';

export const BACKGROUND_URL = \`\${PHOTOS}/background-butterflies.jpg\`;

export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', tone: 'Casual' },
  { id: 'linkedin', name: 'LinkedIn', tone: 'Professional' },
  { id: 'x', name: 'X', tone: 'Punchy' },
];
export const platformName = (id) => PLATFORMS.find((p) => p.id === id)?.name ?? id;

export const BRAND = {
  name: 'Atelier Nord',
  handle: 'ateliernord',
  instagram: 'atelier.nord',
  voice: 'Warm, direct and a little playful. Craft over hype; talks about materials and how things are made.',
};

// The library's starting photos, created once for a new app.
export const SEED_IMAGES = [
  { url: \`\${PHOTOS}/post-instagram-cap.jpg\`, name: 'Navy cap and hoodie' },
  { url: \`\${PHOTOS}/post-linkedin-jacket.jpg\`, name: 'Striped jacket, blue shorts' },
  { url: \`\${PHOTOS}/post-x-tee.jpg\`, name: 'Grey tee, blue shorts' },
];

// Two posts already planned this week: [platform, title, text, weekday (0 = Mon), hour].
export const SEED_POSTS = [
  ['instagram', 'Behind the seams reel', 'A look behind the seams: how one pair of old jeans becomes a new jacket. Full reel on the grid.\\n\\n#behindtheseams #recycleddenim #slowfashion #madeinstudio', 0, 12],
  ['x', 'Lookbook sneak peek', 'Lookbook sneak peek: 12 pieces, one denim story. Full drop Oct 1. #recycleddenim', 2, 17],
];

export const TIMES = [9, 12, 17];

const brandOf = (brand) => ({ name: brand.name, handle: brand.handle, instagram: brand.instagram, voice: brand.voice });
const imagesOf = (images) => images.map((i) => ({ url: i.url, name: i.name }));

/** Arguments of the generatePosts backend function (it holds the prompt and the platform rules). */
export const generateArgs = (brand, topic, images) => ({ topic, images: imagesOf(images), brand: brandOf(brand) });

/** Arguments of the regeneratePost backend function: one platform again, from a different angle. */
export const regenerateArgs = (brand, topic, images, platform, current) => ({ platform, topic, current, images: imagesOf(images), brand: brandOf(brand) });
\`\`\`

## src/components/captelle/CopyButton.jsx
\`\`\`jsx
import { useState } from 'react';
import { Check, Copy } from './Icons';

/** Copies a post's text; says Copied only once the clipboard took it. */
export default function CopyButton({ text, className = '' }) {
  const [state, setState] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('Copied');
    } catch {
      setState('Couldn’t copy');
    }
    setTimeout(() => setState(''), 1600);
  };
  return (
    <button type="button" onClick={copy} className={\`cp-tag flex h-[27px] items-center gap-[6px] px-[8px] text-[13.5px] font-medium \${className}\`}>
      {state === 'Copied' ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={2} />}{state || 'Copy'}
    </button>
  );
}
\`\`\`

## src/components/captelle/DragGhost.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { platformName } from './content';
import { chipTitle, hourLabel, parseIso } from './format';
import { dotClass } from './Schedule';

/** What follows the pointer while dragging: the picked images as a stack, or the post's calendar chip. */
export default function DragGhost({ drag, images, posts }) {
  if (!drag) return null;
  const { payload, x, y, over } = drag;
  if (payload.kind === 'images') {
    const ids = [payload.tapped, ...payload.ids.filter((id) => id !== payload.tapped)];
    const picked = ids.map((id) => images.find((i) => i.id === id)).filter(Boolean);
    return (
      <div className="pointer-events-none fixed z-[60]" style={{ left: x - 26, top: y - 33 }}>
        <motion.div initial={{ rotate: 0, scale: 0.9 }} animate={{ rotate: -3, scale: 1 }} className="relative h-[66px] w-[52px] shadow-[0_10px_24px_rgba(0,0,0,0.22)]">
          {picked.slice(0, 3).reverse().map((img, i, list) => (
            <img key={img.id} src={img.url} alt="" className="absolute inset-0 h-full w-full border border-white object-cover"
              style={{ transform: \`translate(\${(list.length - 1 - i) * -3}px, \${(list.length - 1 - i) * 2}px)\` }} />
          ))}
          <span className="cp-on pf-round absolute -right-[6px] -top-[6px] flex h-[14px] w-[14px] items-center justify-center text-[9px] font-semibold">{payload.ids.length}</span>
        </motion.div>
      </div>
    );
  }
  const post = posts.find((p) => p.id === payload.id);
  if (!post) return null;
  const hour = over?.startsWith('slot:') ? Number(over.split(':')[2]) : post.scheduledAt ? parseIso(post.scheduledAt).getHours() : 9;
  return (
    <div className="pointer-events-none fixed z-[60]" style={{ left: x + 10, top: y - 14 }}>
      <motion.div initial={{ rotate: 0, y: 0 }} animate={{ rotate: -2.5, y: -4 }} transition={{ duration: 0.2 }}
        className="cp-chip w-[137px] px-[8px] py-[6px] shadow-[0_14px_28px_rgba(0,0,0,0.18)]">
        <div className="flex items-center gap-[4px] text-[10px] font-semibold leading-[14px]">
          <span className={\`h-[5px] w-[5px] \${dotClass(post.platform)}\`} />{platformName(post.platform)}
          <span className="cp-mono ml-auto font-normal text-[var(--ui-muted)]">{hourLabel(hour)}</span>
        </div>
        <div className="mt-[2px] truncate text-[10.5px] leading-[14px] text-[var(--ui-muted)]">{chipTitle(post)}</div>
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/captelle/ErrorNote.jsx
\`\`\`jsx
import { base44 } from '@/api/base44Client';
import { X } from './Icons';

/** A failed request: what happened, Sign in when that is the cause, and a close. */
export default function ErrorNote({ error, needsSignIn, onDismiss, className = '' }) {
  return (
    <div role="alert" className={\`cp-panel flex items-center gap-3 py-[4px] pl-3 pr-[4px] text-[13.5px] \${className}\`}>
      {error}
      {needsSignIn && <button type="button" onClick={() => base44.auth.redirectToLogin()} className="cp-on min-h-[30px] px-3 font-semibold max-lg:min-h-[44px]">Sign in</button>}
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="flex h-[30px] w-[30px] items-center justify-center max-lg:h-[44px] max-lg:w-[44px]"><X size={13} /></button>
    </div>
  );
}
\`\`\`

## src/components/captelle/format.js
\`\`\`js
const DAY_MS = 86400000;

/** Local midnight of the Monday that starts \`date\`'s week. */
export const weekStartOf = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
};
export const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
export const weekDays = (start) => Array.from({ length: 7 }, (_, i) => addDays(start, i));
export const sameDay = (a, b) => a.toDateString() === b.toDateString();

/** A slot's moment in UTC, so it reads back as the same local wall time whatever the server does with zones. */
export const slotIso = (start, day, hour) => {
  const d = addDays(start, day);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour).toISOString();
};
export const sameSlot = (a, b) => Boolean(a && b) && Date.parse(a) === Date.parse(b);
/** A day already gone (today stays open, so a post can still go out later today). */
export const pastDay = (start, day) => addDays(start, day) < addDays(new Date(), 0);
export const parseIso = (iso) => new Date(iso);
/** [day index, hour] of an ISO moment inside the week starting \`start\`, or null outside it. */
export const slotOf = (start, iso) => {
  if (!iso) return null;
  const d = parseIso(iso);
  const day = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - start) / DAY_MS + 0.5);
  return day >= 0 && day < 7 ? [day, d.getHours()] : null;
};

const SHORT = { weekday: 'short' };
export const dayLabel = (d) => \`\${d.toLocaleDateString('en-US', SHORT)} \${d.getDate()}\`;
export const hourLabel = (h) => \`\${h}:00\`;
export const slotLabel = (iso) => \`\${dayLabel(parseIso(iso))} · \${hourLabel(parseIso(iso).getHours())}\`;
export const weekLabel = (start) => {
  const end = addDays(start, 6);
  const month = (d) => d.toLocaleDateString('en-US', { month: 'short' });
  return start.getMonth() === end.getMonth()
    ? \`\${month(start)} \${start.getDate()} – \${end.getDate()}\`
    : \`\${month(start)} \${start.getDate()} – \${month(end)} \${end.getDate()}\`;
};
export const clockLabel = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

/** The calendar label of a post: its title, or the first line of its text. */
export const chipTitle = (post) => post.title || post.text.split('\\n')[0].replace(/#\\w+/g, '').trim().slice(0, 40);
\`\`\`

## src/components/captelle/Icons.jsx
\`\`\`jsx
// Line icons on a 24px grid, drawn in the current text colour.
const icon = (paths) => function Icon({ size = 16, strokeWidth = 2, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={\`flex-none \${className}\`} aria-hidden="true">
      {paths.map((d) => <path key={d} d={d} />)}
    </svg>
  );
};

export const ArrowRight = icon(['M5 12h14', 'm12 5 7 7-7 7']);
export const Link2 = icon(['M9 17H7A5 5 0 0 1 7 7h2', 'M15 7h2a5 5 0 1 1 0 10h-2', 'M8 12h8']);
export const LoaderCircle = icon(['M21 12a9 9 0 1 1-6.22-8.56']);
export const X = icon(['M18 6 6 18', 'm6 6 12 12']);
export const Check = icon(['M20 6 9 17l-5-5']);
export const ChevronLeft = icon(['m15 18-6-6 6-6']);
export const ChevronRight = icon(['m9 18 6-6-6-6']);
export const RefreshCw = icon(['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5']);
export const GripVertical = icon(['M9 5h.01', 'M9 12h.01', 'M9 19h.01', 'M15 5h.01', 'M15 12h.01', 'M15 19h.01']);
export const Heart = icon(['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z']);
export const MessageCircle = icon(['M7.9 20A9 9 0 1 0 4 16.1L2 22Z']);
export const Send = icon(['m22 2-7 20-4-9-9-4Z', 'M22 2 11 13']);
export const Bookmark = icon(['m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z']);
export const ThumbsUp = icon(['M7 10v12', 'M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z']);
export const Repeat2 = icon(['m2 9 3-3 3 3', 'M13 18H7a2 2 0 0 1-2-2V6', 'm22 15-3 3-3-3', 'M11 6h6a2 2 0 0 1 2 2v10']);
export const BarChart2 = icon(['M18 20V10', 'M12 20V4', 'M6 20v-6']);
export const Globe = icon(['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z', 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20', 'M2 12h20']);
export const MoreHorizontal = icon(['M12 12h.01', 'M19 12h.01', 'M5 12h.01']);
export const Sparkles = icon(['M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z']);
export const CalendarDays = icon(['M8 2v4', 'M16 2v4', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z', 'M3 10h18', 'M8 14h.01', 'M12 14h.01', 'M16 14h.01', 'M8 18h.01', 'M12 18h.01', 'M16 18h.01']);
export const Images = icon(['M18 22H4a2 2 0 0 1-2-2V6', 'm22 13-1.3-1.3a2.4 2.4 0 0 0-3.4 0L12 17', 'M8 2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z', 'M16 6h.01']);
export const UserRound = icon(['M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z', 'M20 21a8 8 0 0 0-16 0']);
export const ImagePlus = icon(['M16 5h6', 'M19 2v6', 'M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5', 'm21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21', 'M9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z']);
export const Trash2 = icon(['M3 6h18', 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6', 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2', 'M10 11v6', 'M14 11v6']);
export const Copy = icon(['M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z', 'M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2']);
\`\`\`

## src/components/captelle/ImagePicker.jsx
\`\`\`jsx
import { useRef } from 'react';
import { Check, X } from './Icons';

/** "Add images": the library as thumbnails; pick several, then drag them onto the field (or tap Add). */
export default function ImagePicker({ picker, mobile, bar, attached, onRemove }) {
  const file = useRef(null);
  const count = picker.selected.length;
  const dragging = picker.dragging;

  return (
    <div className={\`cp-panel mt-[19px] p-[9px] \${mobile ? 'w-full' : bar ? 'w-[400px]' : 'w-[52.2%] min-w-[340px]'}\`}>
      <div className="flex items-baseline gap-[6px] text-[10px] leading-[14px]">
        <b className="whitespace-nowrap text-[12.5px] font-semibold">Add images</b>
        <span className="truncate text-[var(--ui-muted)]">Select, then {mobile ? 'tap Add' : 'drag onto the field'}</span>
        <span className="ml-auto flex flex-none items-baseline gap-[8px]">
          <button type="button" onClick={() => file.current.click()} className="text-[10px] underline decoration-[var(--ui-line)] underline-offset-2 max-lg:min-h-[44px] max-lg:px-1 max-lg:text-[13px]">Upload</button>
          <span>{count} selected</span>
          {mobile && (
            <button type="button" disabled={!count} onClick={picker.add} className="cp-on min-h-[44px] px-4 text-[14px] font-semibold disabled:opacity-40">Add</button>
          )}
          <button type="button" onClick={picker.toggle} aria-label="Close image picker" className={\`flex items-center justify-center self-center \${mobile ? 'h-[44px] w-[36px]' : 'h-[14px] w-[14px]'}\`}><X size={mobile ? 16 : 10} strokeWidth={2.2} /></button>
        </span>
        <input ref={file} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { picker.upload(e.target.files); e.target.value = ''; }} />
      </div>
      {bar && attached.length > 0 && (
        <div className="mt-[8px] flex flex-wrap gap-[6px]">
          {attached.map((img) => (
            <span key={img.id} className="relative h-[36px] w-[36px] border border-[var(--ui-line)]">
              <img src={img.url} alt="" className="h-full w-full object-cover" draggable={false} />
              <button type="button" onClick={() => onRemove(img.id)} aria-label="Remove image" className="cp-on pf-round absolute -right-[5px] -top-[5px] flex h-[14px] w-[14px] items-center justify-center"><X size={8} strokeWidth={2.5} /></button>
            </span>
          ))}
        </div>
      )}
      <div className={\`mt-[7px] grid grid-cols-3 gap-[3px] \${dragging ? 'opacity-50' : ''}\`}>
        {picker.images.map((img) => {
          const on = picker.selected.includes(img.id);
          return (
            <button key={img.id} type="button" data-pick={img.id} onPointerDown={(e) => picker.press(e, img)} onClick={(e) => e.detail === 0 && picker.select(img.id)}
              aria-label={img.name || 'Image'} aria-pressed={on}
              className={\`relative aspect-[103/100] touch-pan-y overflow-hidden bg-[var(--pf-photo)] \${on ? 'outline outline-[1.5px] outline-offset-[-1.5px] outline-[var(--swatch-1)]' : ''}\`}>
              <img src={img.url} alt="" className="pointer-events-none h-full w-full object-cover" draggable={false} />
              {on && <span className="cp-on pf-round absolute right-[5px] top-[5px] flex h-[13px] w-[13px] items-center justify-center"><Check size={9} strokeWidth={3} /></span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
\`\`\`

## src/components/captelle/LibraryView.jsx
\`\`\`jsx
import { useRef } from 'react';
import { ImagePlus, Trash2 } from './Icons';
import { platformName } from './content';
import { slotLabel } from './format';
import { dotClass } from './Schedule';
import CopyButton from './CopyButton';

/** Library: the brand's images (upload, remove) and every post written so far. */
export default function LibraryView({ images, posts, onUpload, onRemoveImage, onDeletePost }) {
  const file = useRef(null);
  return (
    <div className="flex flex-col gap-[14px] pb-8">
      <section className="cp-panel p-4">
        <div className="mb-3 flex items-center justify-between">
          <b className="text-[17px] font-medium">Images <span className="text-[var(--ui-muted)]">{images.length}</span></b>
          <button type="button" onClick={() => file.current.click()} className="cp-on flex min-h-[32px] items-center gap-[6px] px-3 text-[13px] font-semibold max-lg:min-h-[44px]"><ImagePlus size={14} />Upload</button>
          <input ref={file} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { onUpload(e.target.files); e.target.value = ''; }} />
        </div>
        <div className="grid grid-cols-3 gap-[4px] sm:grid-cols-6">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square bg-[var(--pf-photo)]">
              <img src={img.url} alt={img.name || ''} className="h-full w-full object-cover" />
              <button type="button" onClick={() => window.confirm('Remove this image from the library?') && onRemoveImage(img.id)} aria-label="Remove image"
                className="cp-on absolute right-1 top-1 flex h-[28px] w-[28px] items-center justify-center opacity-0 group-hover:opacity-100 max-lg:opacity-100"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      </section>
      <section className="cp-panel p-4">
        <b className="mb-2 block text-[17px] font-medium">Posts <span className="text-[var(--ui-muted)]">{posts.length}</span></b>
        {posts.length === 0 && <p className="text-[14px] text-[var(--ui-muted)]">Nothing written yet.</p>}
        {posts.map((p) => (
          <div key={p.id} className="group grid grid-cols-[110px_1fr_auto] items-start gap-4 border-t border-[var(--ui-line)] py-[10px] max-lg:grid-cols-1 max-lg:gap-1">
            <span className="flex items-center gap-[6px] text-[13.5px] font-semibold"><span className={\`h-[6px] w-[6px] \${dotClass(p.platform)}\`} />{platformName(p.platform)}</span>
            <p className="line-clamp-2 whitespace-pre-line text-[13.5px] leading-[19px]">{p.text}</p>
            <span className="flex items-center gap-3 text-[12.5px] text-[var(--ui-muted)]">
              {p.scheduledAt ? <span className="cp-mono">{slotLabel(p.scheduledAt)}</span> : 'Not planned'}
              <CopyButton text={p.text} className="max-lg:min-h-[44px]" />
              <button type="button" onClick={() => window.confirm('Delete this post?') && onDeletePost(p.id)} aria-label="Delete post" className="flex h-[28px] w-[28px] items-center justify-center opacity-0 group-hover:opacity-100 max-lg:h-[44px] max-lg:w-[44px] max-lg:opacity-100"><Trash2 size={13} /></button>
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}
\`\`\`

## src/components/captelle/PlatformCards.jsx
\`\`\`jsx
import { BarChart2, Bookmark, Globe, Heart, MessageCircle, MoreHorizontal, Repeat2, Send, ThumbsUp } from './Icons';
import PostText from './PostText';

// A post without an attached image is a text post: no empty photo box. \`crop\` sets where a wide frame sits on a tall photo.
const Photo = ({ url, className, crop = '' }) => url && (
  <div className={\`overflow-hidden bg-[var(--pf-photo)] \${className}\`}>
    <img src={url} alt="" className={\`h-full w-full object-cover \${crop}\`} draggable={false} />
  </div>
);
const Avatar = ({ className }) => (
  <span className={\`flex flex-none items-center justify-center bg-[var(--pf-avatar)] font-semibold text-white \${className}\`}>A</span>
);

export function InstagramCard({ brand, post, text, reserve, animate }) {
  return (
    <div className="pf pf-ig">
      <div className="flex h-[39px] items-center gap-[7px] px-[9px] text-[12.5px]">
        <span className="pf-ring pf-round flex h-[24px] w-[24px] flex-none items-center justify-center">
          <span className="pf-round flex h-[21px] w-[21px] items-center justify-center bg-white"><Avatar className="pf-round h-[18px] w-[18px] text-[8.5px]" /></span>
        </span>
        <b className="font-semibold">{brand.instagram}</b>
        <span className="text-[var(--pf-mute)]">•</span>
        <span className="font-semibold text-[var(--pf-ig-blue)]">Follow</span>
        <MoreHorizontal size={14} className="ml-auto" />
      </div>
      <Photo url={post.imageUrls?.[0]} className="aspect-[520/270]" />
      <div className="px-[10px] pb-[11px] pt-[7px] text-[12.5px] leading-[15.4px]">
        <div className="mb-[5px] flex items-center gap-[12px]">
          <Heart size={15} strokeWidth={1.9} /><MessageCircle size={15} strokeWidth={1.9} /><Send size={15} strokeWidth={1.9} />
          <Bookmark size={15} strokeWidth={1.9} className="ml-auto" />
        </div>
        <b className="font-semibold">1,204 likes</b>
        <PostText text={text} reserve={reserve} animate={animate} tagClass="text-[var(--pf-ig-tag)]" lead={<b className="font-semibold">{brand.instagram} </b>} className="mt-[3px]" />
      </div>
    </div>
  );
}

export function LinkedInCard({ brand, post, text, reserve, animate }) {
  return (
    <div className="pf pf-li">
      <div className="flex gap-[6px] px-[11px] pt-[9px]">
        <Avatar className="h-[32px] w-[32px] text-[13px]" />
        <div className="min-w-0 flex-1 leading-[12px]">
          <b className="block text-[12.5px] font-semibold leading-[15px]">{brand.name}</b>
          <span className="block text-[9.5px] text-[var(--pf-li-mute)]">12,480 followers</span>
          <span className="flex items-center gap-[2px] text-[9.5px] text-[var(--pf-li-mute)]">Now · <Globe size={8} /></span>
        </div>
        <span className="text-[12.5px] font-semibold text-[var(--pf-li)]">+ Follow</span>
      </div>
      <PostText text={text} reserve={reserve} animate={animate} tagClass="text-[var(--pf-li)]" className="px-[11px] pb-[9px] pt-[9px] text-[12.2px] leading-[16.6px]" />
      <Photo url={post.imageUrls?.[0]} className="aspect-[518/150]" crop="object-[50%_30%]" />
      <div className="flex h-[27px] items-center justify-around text-[12px] font-semibold text-[var(--pf-li-mute)]">
        {[[ThumbsUp, 'Like'], [MessageCircle, 'Comment'], [Repeat2, 'Repost'], [Send, 'Send']].map(([Icon, label]) => (
          <span key={label} className="flex items-center gap-[4px]"><Icon size={11} strokeWidth={1.9} />{label}</span>
        ))}
      </div>
    </div>
  );
}

export function XCard({ brand, post, text, reserve, animate }) {
  return (
    <div className="pf pf-x flex gap-[7px] px-[11px] pb-[8px] pt-[10px]">
      <Avatar className="pf-round h-[27px] w-[27px] text-[11px]" />
      <div className="min-w-0 flex-1">
        <div className="text-[12.8px] leading-[16px]"><b className="font-bold">{brand.name}</b> <span className="text-[var(--pf-x-mute)]">@{brand.handle} · 1m</span></div>
        <PostText text={text} reserve={reserve} animate={animate} tagClass="text-[var(--pf-x)]" className="text-[12.8px] leading-[16.6px]" />
        <Photo url={post.imageUrls?.[0]} className="pf-x-photo mt-[13px] aspect-[436/240]" crop="object-[50%_20%]" />
        <div className="mt-[8px] flex items-center justify-between pr-[10px] text-[11px] text-[var(--pf-x-mute)]">
          {[[MessageCircle, '12'], [Repeat2, '48'], [Heart, '310'], [BarChart2, '14K']].map(([Icon, n]) => (
            <span key={n} className="flex items-center gap-[4px]"><Icon size={11} strokeWidth={1.9} />{n}</span>
          ))}
          <Bookmark size={11} strokeWidth={1.9} />
        </div>
      </div>
    </div>
  );
}

export const CARDS = { instagram: InstagramCard, linkedin: LinkedInCard, x: XCard };
\`\`\`

## src/components/captelle/PostColumn.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, GripVertical, RefreshCw } from './Icons';
import { CARDS } from './PlatformCards';
import { slotLabel } from './format';
import CopyButton from './CopyButton';

const GHOST_HEIGHT = { instagram: 'h-[403px]', linkedin: 'h-[405px]', x: 'h-[311px]' };

// Mounted with its post: slides up and types in only the first time this post is shown.
function PostCard({ Card, brand, post, typed, regenerating, dragging, mobile }) {
  const [fresh] = useState(() => typed.first(post.id));
  const [flash, setFlash] = useState(0);
  const wasRegen = useRef(false);
  useEffect(() => {
    if (wasRegen.current && !regenerating) setFlash((n) => n + 1);
    wasRegen.current = regenerating;
  }, [regenerating]);
  return (
    <motion.div initial={fresh ? { y: 48, opacity: 0 } : false} animate={{ y: 0, opacity: dragging ? 0.5 : 1 }} transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative">
      <Card brand={brand} post={post} text={regenerating ? '' : post.text} reserve={post.text} animate={fresh} />
      {flash > 0 && (
        <motion.span key={flash} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.1, delay: 0.2 }}
          className="pointer-events-none absolute inset-0 rounded-[8px] shadow-[0_0_0_2px_var(--pf-x-flash)]" />
      )}
    </motion.div>
  );
}

/** One platform: name and tone, the preview (or its WRITING placeholder), then Regenerate, Copy and the Plan handle. */
export default function PostColumn({ platform, brand, post, typed, writing, regenerating, onRegenerate, onPress, onPlan, dragging, tall, mobile }) {
  const Card = CARDS[platform.id];
  const [spin, setSpin] = useState(0);

  return (
    <div className={\`flex min-w-0 flex-col \${mobile ? 'mx-auto w-full max-w-[560px]' : ''}\`}>
      <div className="mb-[10px] flex h-[19px] items-center justify-between">
        <motion.span initial={writing ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.75 }} className="text-[15px] font-medium">{platform.name}</motion.span>
        {(post || !writing) && <span className="cp-tag px-[4px] text-[12.5px] font-medium leading-[17px]">{platform.tone}</span>}
      </div>
      <div className={mobile || !tall ? '' : 'min-h-[407px]'}>
        {writing && !post ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.75 }} className={\`cp-ghost flex items-center justify-center \${GHOST_HEIGHT[platform.id]}\`}>
            <span className="cp-caps text-[8.5px] font-semibold">WRITING</span>
          </motion.div>
        ) : post && (
          <PostCard Card={Card} brand={brand} post={post} typed={typed} regenerating={regenerating} dragging={dragging} mobile={mobile} />
        )}
      </div>
      {post && (
        <div className="mt-[10px] flex items-center justify-between">
          <span className="flex gap-[6px]">
            <button type="button" disabled={regenerating} onClick={() => { setSpin((n) => n + 1); onRegenerate(post); }}
              className="cp-tag flex h-[27px] min-h-[27px] items-center gap-[6px] px-[8px] text-[13.5px] font-medium max-lg:min-h-[44px]">
              <motion.span key={spin} initial={{ rotate: 0 }} animate={{ rotate: spin ? 360 : 0 }} transition={{ duration: 0.6, ease: 'easeInOut' }} className="flex">
                <RefreshCw size={11} strokeWidth={2} />
              </motion.span>
              Regenerate
            </button>
            {!regenerating && <CopyButton text={post.text} className="max-lg:min-h-[44px]" />}
          </span>
          {post.scheduledAt ? (
            <motion.button key={post.scheduledAt} type="button" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.4, bounce: 0.5 }}
              onPointerDown={(e) => onPress(e, post)} onClick={(e) => e.detail === 0 && onPlan(post)} className="cp-on flex h-[27px] touch-pan-y items-center gap-[6px] px-[8px] text-[13.5px] font-semibold max-lg:min-h-[44px]">
              <Check size={11} strokeWidth={2.5} />{slotLabel(post.scheduledAt)}
            </motion.button>
          ) : (
            <button type="button" onPointerDown={(e) => onPress(e, post)} onClick={(e) => e.detail === 0 && onPlan(post)} className="cp-tag2 flex h-[27px] touch-pan-y items-center gap-[6px] px-[8px] text-[13.5px] font-medium max-lg:min-h-[44px]">
              <GripVertical size={11} strokeWidth={2} />Plan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
\`\`\`

## src/components/captelle/PostText.jsx
\`\`\`jsx
import { useTypewriter } from './useTypewriter';

const withTags = (text, tagClass) =>
  text.split(/(#[\\p{L}\\p{N}_]+)/u).map((part, i) => (part.startsWith('#') ? <span key={i} className={tagClass}>{part}</span> : part));

/**
 * A post's text typing in. The finished text is laid out invisibly underneath, so the card already has
 * its final height while the words arrive (\`reserve\`: the old text while a rewrite is on its way); \`lead\` (e.g. Instagram's bold username) is always shown.
 */
export default function PostText({ text, reserve = text, animate, tagClass, lead = null, className = '' }) {
  const { shown, typing } = useTypewriter(text, animate);
  return (
    <div className={\`whitespace-pre-line break-words \${className}\`}>
      <div className="relative">
        <div aria-hidden="true" className="invisible">{lead}{withTags(reserve, tagClass)}</div>
        <div className="absolute inset-0">
          {lead}{withTags(shown, tagClass)}{typing && <span className="cp-caret" />}
        </div>
      </div>
    </div>
  );
}
\`\`\`

## src/components/captelle/ResultsGrid.jsx
\`\`\`jsx
import { GripVertical, RefreshCw } from './Icons';
import { PLATFORMS } from './content';
import { slotLabel } from './format';
import PostColumn from './PostColumn';
import CopyButton from './CopyButton';

const COLS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' };

/** Thin vertical rules between (and just outside) the columns, from the top of the page down. */
export function RuleLines({ cols }) {
  return (
    <div aria-hidden="true" className={\`pointer-events-none absolute inset-y-0 left-[6.25%] right-[6.25%] grid gap-x-[40px] \${COLS[cols]}\`}>
      {Array.from({ length: cols }, (_, i) => (
        <span key={i} className="relative">
          <span className={\`absolute inset-y-0 w-px bg-[var(--ui-line)] \${i === 0 ? '-left-[13px]' : '-left-[20px]'}\`} />
          {i === cols - 1 && <span className="absolute inset-y-0 -right-[13px] w-px bg-[var(--ui-line)]" />}
        </span>
      ))}
    </div>
  );
}

const shown = (filter) => PLATFORMS.filter((p) => filter === 'All posts' || p.name === filter);

function ListRow({ platform, post, regenerating, onRegenerate, onPress, onPlan }) {
  return (
    <div className="cp-panel grid grid-cols-[140px_1fr_auto] items-start gap-5 px-4 py-3">
      <div><b className="block text-[15px] font-medium">{platform.name}</b><span className="cp-tag mt-1 inline-block px-[4px] text-[12.5px]">{platform.tone}</span></div>
      <p className={\`whitespace-pre-line text-[13.5px] leading-[19px] \${regenerating ? 'opacity-40' : ''}\`}>{post.text}</p>
      <div className="flex flex-col items-end gap-[6px]">
        <button type="button" disabled={regenerating} onClick={() => onRegenerate(post)} className="cp-tag flex h-[27px] items-center gap-[6px] px-[8px] text-[13.5px] font-medium"><RefreshCw size={11} className={regenerating ? 'cp-spin' : ''} />Regenerate</button>
        {!regenerating && <CopyButton text={post.text} />}
        <button type="button" onPointerDown={(e) => onPress(e, post)} onClick={(e) => e.detail === 0 && onPlan(post)} className={\`flex h-[27px] touch-pan-y items-center gap-[6px] px-[8px] text-[13.5px] font-medium \${post.scheduledAt ? 'cp-on' : 'cp-tag2'}\`}>
          <GripVertical size={11} />{post.scheduledAt ? slotLabel(post.scheduledAt) : 'Plan'}
        </button>
      </div>
    </div>
  );
}

/** The three previews (or the rows of List view), filtered to the picked platforms. */
export default function ResultsGrid({ brand, posts, typed, writing, regenerating, onRegenerate, onPress, onPlan, draggingId, view, cols, filter, mobile }) {
  const platforms = shown(filter);
  const postOf = (id) => (writing ? null : posts.find((p) => p.platform === id));
  // With photos the previews are tall, so the toolbars line up on one row; text-only posts sit close to theirs.
  const tall = writing || posts.some((p) => p.imageUrls?.length);
  if (view === 'List' && !writing) {
    return (
      <div className="flex flex-col gap-[8px]">
        {platforms.map((p) => postOf(p.id) && <ListRow key={p.id} platform={p} post={postOf(p.id)} regenerating={regenerating[p.id]} onRegenerate={onRegenerate} onPress={onPress} onPlan={onPlan} />)}
      </div>
    );
  }
  return (
    <div className={\`grid \${mobile ? 'grid-cols-1 gap-y-[36px]' : \`gap-x-[40px] gap-y-[30px] \${COLS[cols]}\`}\`}>
      {platforms.map((p) => (
        <PostColumn key={p.id} platform={p} brand={brand} post={postOf(p.id)} typed={typed} writing={writing} regenerating={!!regenerating[p.id]}
          onRegenerate={onRegenerate} onPress={onPress} onPlan={onPlan} dragging={draggingId && draggingId === postOf(p.id)?.id} tall={tall} mobile={mobile} />
      ))}
    </div>
  );
}
\`\`\`

## src/components/captelle/Schedule.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from './Icons';
import { platformName, TIMES } from './content';
import { chipTitle, dayLabel, hourLabel, sameDay, slotOf, weekDays, weekLabel } from './format';

export const dotClass = (platform) => (platform === 'instagram' ? 'bg-[var(--pf-ig-dot)]' : platform === 'linkedin' ? 'bg-[var(--pf-li)]' : 'bg-[var(--swatch-1)]');

/** A planned post on the calendar: platform dot and name, time, its label. Drag it to move it. */
export function Chip({ post, hour, compact, fresh, onPress, onRemove }) {
  return (
    <motion.div initial={fresh ? { scale: 0.7, opacity: 0 } : false} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.45, bounce: 0.45 }}
      onPointerDown={onPress && ((e) => onPress(e, post))}
      className={\`cp-chip group relative touch-pan-y select-none text-left \${compact ? 'px-[6px] py-[5px]' : 'px-[8px] py-[6px]'} \${fresh ? 'outline outline-[1.5px] outline-offset-[-1.5px] outline-[var(--swatch-1)]' : ''}\`}>
      <div className="flex items-center gap-[4px] text-[10.5px] font-semibold leading-[14px]">
        <span className={\`h-[5px] w-[5px] flex-none \${dotClass(post.platform)}\`} />
        <span className="truncate">{platformName(post.platform)}</span>
        <span className="cp-mono ml-auto text-[10.5px] font-normal text-[var(--ui-muted)]">{hourLabel(hour)}</span>
      </div>
      {!compact && <div className="mt-[2px] truncate text-[11.3px] leading-[15px] text-[var(--ui-muted)]">{chipTitle(post)}</div>}
      {onRemove && (
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={() => onRemove(post)} aria-label="Remove from plan"
          className="cp-on pf-round absolute -right-[6px] -top-[6px] hidden h-[15px] w-[15px] items-center justify-center group-hover:flex"><X size={9} strokeWidth={2.5} /></button>
      )}
    </motion.div>
  );
}

export function ScheduleHeader({ week, queued, onWeek, onQueued, onHint, mobile }) {
  return (
    <div className={\`flex items-center gap-[12px] \${mobile ? 'flex-wrap' : ''}\`}>
      <span className="cp-caps text-[11px] font-semibold">PLAN</span>
      <span className="text-[25px] font-medium leading-none tracking-[-0.02em]">{weekLabel(week)}</span>
      {onWeek && (
        <span className="flex gap-[2px]">
          <button type="button" onClick={() => onWeek(-1)} aria-label="Previous week" className="cp-tag flex h-[22px] w-[22px] items-center justify-center max-lg:h-[44px] max-lg:w-[44px]"><ChevronLeft size={13} /></button>
          <button type="button" onClick={() => onWeek(0)} className="cp-tag h-[22px] px-[6px] text-[12px] font-medium max-lg:h-[44px]">This week</button>
          <button type="button" onClick={() => onWeek(1)} aria-label="Next week" className="cp-tag flex h-[22px] w-[22px] items-center justify-center max-lg:h-[44px] max-lg:w-[44px]"><ChevronRight size={13} /></button>
        </span>
      )}
      <span className={\`flex gap-[10px] \${mobile ? '' : 'ml-auto'}\`}>
        {onQueued
          ? <button type="button" onClick={onQueued} aria-label="Open the calendar" className="cp-on cp-caps flex h-[17px] items-center px-[6px] text-[10.5px] font-semibold max-lg:h-[44px]">• {queued} PLANNED</button>
          : <span className="cp-caps flex h-[17px] items-center text-[10.5px] font-semibold text-[var(--ui-muted)] max-lg:h-[44px]">• {queued} PLANNED</span>}
        {!mobile && onHint && <button type="button" onClick={onHint} className="cp-hint cp-caps flex h-[17px] items-center px-[7px] text-[10.5px] font-semibold">DRAG TO PLAN</button>}
      </span>
    </div>
  );
}

/** The calendar under fresh posts comes in once their text has typed in; seen before, it is just there. */
export function Reveal({ typed, id, className, children }) {
  const [fresh] = useState(() => typed.first(\`calendar-\${id}\`));
  return (
    <motion.div initial={fresh ? { opacity: 0, y: 24 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 3.2, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  );
}

/** Desktop calendar: Mon–Sun columns × 9:00 / 12:00 / 17:00 rows; every cell is a drop target. */
export default function Schedule({ week, posts, over, freshId, onPress, onRemove, onWeek, onQueued, onHint }) {
  const days = weekDays(week);
  const today = new Date();
  const at = (day, hour) => posts.filter((p) => { const s = slotOf(week, p.scheduledAt); return s && s[0] === day && s[1] === hour; });
  const queued = posts.filter((p) => slotOf(week, p.scheduledAt)).length;

  return (
    <section className="cp-panel relative z-20 px-[16px] pb-[14px] pt-[17px]">
      <ScheduleHeader week={week} queued={queued} onWeek={onWeek} onQueued={onQueued} onHint={onHint} />
      <div className="mt-[14px] grid grid-cols-[57px_repeat(7,1fr)]">
        <span />
        {days.map((d) => (
          <span key={d.toISOString()} className={\`flex h-[29px] items-center justify-center border-b border-l border-[var(--ui-line)] text-[13px] \${sameDay(d, today) ? 'font-semibold' : 'text-[var(--ui-muted)]'}\`}>{dayLabel(d)}</span>
        ))}
        {TIMES.map((hour) => [
          <span key={\`t\${hour}\`} className="cp-mono pt-[11px] text-[11.5px]">{hourLabel(hour)}</span>,
          ...days.map((d, day) => (
            <div key={\`\${day}-\${hour}\`} data-drop={\`slot:\${day}:\${hour}\`}
              className={\`flex h-[83px] flex-col gap-[4px] border-l border-[var(--ui-line)] p-[5px] \${hour !== 17 ? 'border-b' : ''} \${over === \`slot:\${day}:\${hour}\` ? 'cp-slot-over' : ''}\`}>
              {at(day, hour).map((p) => <Chip key={p.id} post={p} hour={hour} fresh={p.id === freshId} onPress={onPress} onRemove={onRemove} />)}
            </div>
          )),
        ])}
      </div>
    </section>
  );
}
\`\`\`

## src/components/captelle/ScheduleList.jsx
\`\`\`jsx
import { TIMES } from './content';
import { dayLabel, hourLabel, sameDay, slotOf, weekDays } from './format';
import { Chip, ScheduleHeader } from './Schedule';

/** Phone calendar: one row per day, the three times as columns across it; chips are compact. */
export default function ScheduleList({ week, posts, over, freshId, onPress, onWeek, onQueued }) {
  const days = weekDays(week);
  const today = new Date();
  const at = (day, hour) => posts.filter((p) => { const s = slotOf(week, p.scheduledAt); return s && s[0] === day && s[1] === hour; });
  const queued = posts.filter((p) => slotOf(week, p.scheduledAt)).length;

  return (
    <section className="cp-panel relative z-20 px-[14px] pb-[10px] pt-[16px]">
      <ScheduleHeader week={week} queued={queued} onWeek={onWeek} onQueued={onQueued} mobile />
      <div className="mt-[12px] grid grid-cols-[64px_repeat(3,1fr)] text-[15px]">
        <span />
        {TIMES.map((h) => <span key={h} className="cp-mono pb-[6px] text-center text-[13px] text-[var(--ui-muted)]">{hourLabel(h)}</span>)}
        {days.map((d, day) => {
          const isToday = sameDay(d, today);
          return [
            <span key={\`d\${day}\`} className={\`flex items-center border-t border-[var(--ui-line)] \${isToday ? 'font-semibold' : 'text-[var(--ui-muted)]'}\`}>
              {dayLabel(d)}{isToday && <span className="cp-on ml-[5px] h-[6px] w-[6px]" />}
            </span>,
            ...TIMES.map((hour) => (
              <div key={\`\${day}-\${hour}\`} data-drop={\`slot:\${day}:\${hour}\`}
                className={\`flex min-h-[56px] flex-col justify-center gap-[3px] border-l border-t border-[var(--ui-line)] p-[4px] \${over === \`slot:\${day}:\${hour}\` ? 'cp-slot-over' : ''}\`}>
                {at(day, hour).map((p) => <Chip key={p.id} post={p} hour={hour} compact fresh={p.id === freshId} onPress={onPress} />)}
              </div>
            )),
          ];
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/captelle/SlotSheet.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { platformName, TIMES } from './content';
import { chipTitle, dayLabel, hourLabel, pastDay, sameSlot, slotIso, weekDays, weekLabel } from './format';

/** The tap fallback for dragging: pick a day and time for a post (or take it off the calendar). */
export default function SlotSheet({ post, week, mobile, onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 lg:items-center" onClick={onClose}>
      <motion.div initial={mobile ? { y: 60 } : { y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()} className="cp-panel w-full max-w-[460px] p-[18px] pb-[22px]">
        <div className="flex items-baseline justify-between gap-3">
          <b className="text-[17px] font-semibold">Plan {platformName(post.platform)} post</b>
          <span className="text-[13px] text-[var(--ui-muted)]">{weekLabel(week)}</span>
        </div>
        <p className="mt-[4px] truncate text-[13px] text-[var(--ui-muted)]">{chipTitle(post)}</p>
        <div className="mt-[14px] grid grid-cols-[70px_repeat(3,1fr)] gap-[3px] text-[14px]">
          {weekDays(week).map((d, day) => [
            <span key={\`d\${day}\`} className="flex items-center">{dayLabel(d)}</span>,
            ...TIMES.map((hour) => {
              const iso = slotIso(week, day, hour);
              return (
                <button key={iso} type="button" disabled={pastDay(week, day)} onClick={() => onPick(post, iso)}
                  className={\`cp-mono min-h-[44px] text-[13px] disabled:opacity-35 lg:min-h-[32px] \${sameSlot(post.scheduledAt, iso) ? 'cp-on' : 'cp-tag'}\`}>{hourLabel(hour)}</button>
              );
            }),
          ])}
        </div>
        <div className="mt-[16px] flex justify-end gap-[6px]">
          {post.scheduledAt && <button type="button" onClick={() => onPick(post, null)} className="cp-tag2 min-h-[44px] px-4 text-[14px] font-medium lg:min-h-[34px]">Remove from plan</button>}
          <button type="button" onClick={onClose} className="cp-tag min-h-[44px] px-4 text-[14px] font-medium lg:min-h-[34px]">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/captelle/TopBar.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import { clockLabel } from './format';

export const TABS = ['Generate', 'Calendar', 'Library', 'Account'];

function Clock({ brand }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="cp-mono flex items-center gap-[7px] whitespace-nowrap text-[12.5px] lg:text-[14.5px]">
      <span className="pf-round inline-block h-[7px] w-[7px] border border-current" />
      {clockLabel(now)} · {brand.name}
    </span>
  );
}

export default function TopBar({ brand, tab, onTab, onHome, mobile }) {
  return (
    <header className="relative z-10 flex h-[48px] items-start justify-between px-4 pt-[15px] lg:px-4">
      <div className="flex items-center">
        <button type="button" onClick={onHome} aria-label="Captelle, start a new topic" className={\`cp-tag flex h-[18px] items-center pl-[4px] pr-[2px] font-medium leading-none \${mobile ? 'text-[13px] tracking-[0.45em]' : 'text-[14.5px] tracking-[0.74em]'}\`}>CAPTELLE</button>
        {!mobile && <span className="ml-[58px]"><Clock brand={brand} /></span>}
      </div>
      {mobile ? <Clock brand={brand} /> : (
        <nav className="grid w-[53.7%] grid-cols-4 gap-[1.5px]">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => onTab(t)} className={\`h-[18px] pl-[3px] text-left text-[14.5px] font-medium leading-none \${tab === t ? 'cp-on' : 'cp-tag'}\`}>{t}</button>
          ))}
        </nav>
      )}
    </header>
  );
}
\`\`\`

## src/components/captelle/useCaptelle.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { BRAND, SEED_IMAGES, SEED_POSTS, generateArgs, regenerateArgs } from './content';
import { slotIso, weekStartOf } from './format';

const { Post, Topic, Image, BrandSettings } = base44.entities;
const createAll = async (Entity, rows) => (rows.length ? Entity.bulkCreate(rows) : []);
const mineOf = (me) => (Entity, sort, limit) => (me ? Entity.filter({ created_by_id: me.id }, sort, limit) : Entity.list(sort, limit));
// The input glides to the top (~1s) and the placeholders settle; results never land before that.
const GLIDE_MS = 1500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));

// Adds the samples still missing (matched on \`key\`, marked \`sample\` so a user's row is never dropped); another
// first load (a second tab) may seed at the same time, so only the oldest copy stays. A failed delete throws: setup retries.
async function seedMissing(Entity, rows, samples, key, relist) {
  // A table holding rows the app didn't mark was filled by the builder (or the user): it isn't ours to seed.
  const missing = rows.some((r) => !r.sample) ? [] : samples.filter((s) => !rows.some((r) => key(r) === key(s)));
  if (missing.length) await Entity.bulkCreate(missing.map((s) => ({ ...s, sample: true })));
  const fresh = missing.length ? await relist() : rows;
  const seen = new Set();
  const extra = fresh.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(key(r)) || !seen.add(key(r)));
  if (extra.length) await Entity.deleteMany({ id: { $in: extra.map((r) => r.id) } }); // one request per table
  return fresh.filter((r) => !extra.includes(r));
}

const samplePosts = (week = weekStartOf(new Date())) => SEED_POSTS.map(([platform, title, text, day, hour]) => ({
  platform, title, text, imageUrls: [], topic: 'Autumn capsule', scheduledAt: slotIso(week, day, hour),
}));

// The library photos and two planned posts, created once: the settings row that marks the app set up
// is written only after both, so a reload mid-seed resumes and a deleted sample stays deleted.
async function seed(mine) {
  let [settings] = await mine(BrandSettings, 'created_date');
  let images = await mine(Image, 'created_date', 500);
  let posts = await mine(Post, '-created_date', 500);
  if (!settings) {
    images = await seedMissing(Image, images, SEED_IMAGES, (i) => i.url, () => mine(Image, 'created_date', 500));
    posts = await seedMissing(Post, posts, samplePosts(), (p) => \`\${p.platform}|\${p.title}\`, () => mine(Post, '-created_date', 500));
    const created = await BrandSettings.create(BRAND);
    [settings = created] = await mine(BrandSettings, 'created_date');
    if (settings.id !== created.id) await BrandSettings.delete(created.id);
  }
  return { settings, images, posts };
}

// Signed out the app can't save (the seed fails), so a visitor sees the samples, not saved, until they sign in.
const samples = () => ({
  settings: { id: null },
  images: SEED_IMAGES.map((image, i) => ({ ...image, id: \`sample-image-\${i}\` })),
  posts: samplePosts().map((post, i) => ({ ...post, id: \`sample-post-\${i}\` })),
});
const load = () => base44.auth.me().catch(() => null)
  .then((me) => seed(mineOf(me)).catch((e) => { if (me) throw e; return samples(); }));

// Single-flight (StrictMode mounts twice), cleared once settled so a later mount reads fresh.
let inflight = null;
const loadOnce = () => (inflight ??= load().finally(() => { inflight = null; }));

export function useCaptelle() {
  const [brand, setBrand] = useState(BRAND);
  const [settingsId, setSettingsId] = useState(null);
  const [images, setImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [current, setCurrent] = useState(null); // { topic, images, ids: { instagram, linkedin, x } }
  const [status, setStatus] = useState('idle'); // idle | writing | ready
  const [error, setError] = useState('');
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [regenerating, setRegenerating] = useState({});
  const busy = useRef(false);

  useEffect(() => {
    loadOnce()
      .then(({ settings, images: imgs, posts: rows }) => {
        setSettingsId(settings.id);
        setBrand({ ...BRAND, ...settings });
        setImages(imgs);
        setPosts(rows);
      })
      .catch(() => setError('Couldn’t load your posts. Reload to try again.'));
  }, []);

  // The AI functions need a signed-in user: a 401 asks for sign-in rather than a retry.
  const fail = (e, message, action) => {
    const signedOut = [401, 403].includes(e?.response?.status ?? e?.status);
    setNeedsSignIn(signedOut);
    setError(signedOut ? \`Sign in to \${action}.\` : message);
  };

  const patchPost = (id, data) => setPosts((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));

  const generate = async (topic, attached) => {
    if (busy.current || !topic.trim()) return;
    busy.current = true;
    setError('');
    setNeedsSignIn(false);
    setStatus('writing');
    const started = Date.now();
    try {
      const imageUrls = attached.map((i) => i.url);
      const { data: result } = await base44.functions.invoke('generatePosts', generateArgs(brand, topic, attached));
      const saved = await Topic.create({ text: topic, imageUrls });
      await wait(GLIDE_MS - (Date.now() - started));
      // Each platform shows a different attached photo where there are several (first one on Instagram).
      const rows = await Post.bulkCreate(['instagram', 'linkedin', 'x'].map((platform, i) => ({
        platform,
        text: result[platform].text,
        title: result[platform].title,
        imageUrls: imageUrls.length ? [imageUrls[i % imageUrls.length]] : [],
        topic,
        topicId: saved.id,
        scheduledAt: null,
      })));
      setPosts((list) => [...rows, ...list]);
      setCurrent({ topic, images: attached, ids: Object.fromEntries(rows.map((r) => [r.platform, r.id])) });
      setStatus('ready');
    } catch (e) {
      fail(e, 'Couldn’t write the posts. Try again.', 'write posts');
      setStatus(current ? 'ready' : 'idle');
    } finally {
      busy.current = false;
    }
  };

  const regenerate = async (post) => {
    if (regenerating[post.platform]) return;
    setRegenerating((r) => ({ ...r, [post.platform]: true }));
    try {
      const { data: result } = await base44.functions.invoke('regeneratePost', regenerateArgs(brand, current?.topic ?? post.topic, current?.images ?? [], post.platform, post.text));
      const data = { text: result.text, title: result.title };
      await Post.update(post.id, data);
      patchPost(post.id, data);
    } catch (e) {
      fail(e, 'Couldn’t rewrite that post. Try again.', 'rewrite a post');
    } finally {
      setRegenerating((r) => ({ ...r, [post.platform]: false }));
    }
  };

  const schedule = async (postId, scheduledAt) => {
    const before = posts.find((p) => p.id === postId)?.scheduledAt ?? null;
    patchPost(postId, { scheduledAt });
    try {
      await Post.update(postId, { scheduledAt });
    } catch (e) {
      patchPost(postId, { scheduledAt: before });
      fail(e, 'Couldn’t save that plan. Try again.', 'plan posts');
    }
  };

  const addImages = async (files) => {
    try {
      const uploaded = await Promise.all([...files].map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return { url: file_url, name: file.name };
      }));
      const rows = await createAll(Image, uploaded);
      setImages((list) => [...list, ...rows]);
      return rows;
    } catch (e) {
      fail(e, 'Couldn’t upload those images. Try again.', 'upload images');
      return [];
    }
  };

  return {
    brand, images, posts, current, status, error, needsSignIn, regenerating,
    currentPosts: current ? ['instagram', 'linkedin', 'x'].map((p) => posts.find((row) => row.id === current.ids[p])).filter(Boolean) : [],
    generate, regenerate, schedule, addImages,
    dismissError: () => setError(''),
    /** Back to the empty "What should we post about?" state; the posts stay in the library and calendar. */
    reset: () => {
      if (busy.current) return;
      setCurrent(null);
      setStatus('idle');
      setError('');
    },
    removeImage: async (id) => {
      try {
        await Image.delete(id);
        setImages((list) => list.filter((i) => i.id !== id));
      } catch (e) {
        fail(e, 'Couldn’t remove that image. Try again.', 'edit your library');
      }
    },
    deletePost: async (id) => {
      try {
        await Post.delete(id);
        setPosts((list) => list.filter((p) => p.id !== id));
      } catch (e) {
        fail(e, 'Couldn’t delete that post. Try again.', 'edit your library');
      }
    },
    saveBrand: async (data) => {
      if (!settingsId) throw new Error('Settings not loaded'); // creating the row would mark the app set up
      await BrandSettings.update(settingsId, data);
      setBrand((b) => ({ ...b, ...data }));
    },
  };
}
\`\`\`

## src/components/captelle/useDrag.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const targetAt = (x, y) => document.elementFromPoint(x, y)?.closest('[data-drop]')?.dataset.drop ?? null;
const HOLD_MS = 350;
const EDGE = 64;

/**
 * Pointer drag onto \`[data-drop]\` targets. A mouse drags once it travels 6px; a finger holds still
 * for 350ms first (moving earlier scrolls), and the page auto-scrolls while the finger nears an edge.
 * A press that never becomes a drag calls \`onTap\`. \`drag\` is { payload, x, y, over } while dragging.
 */
export function useDrag({ onDrop, onTap, scroller }) {
  const [drag, setDrag] = useState(null);
  const lifted = useRef(false);

  useEffect(() => {
    const block = (e) => lifted.current && e.cancelable && e.preventDefault();
    window.addEventListener('touchmove', block, { passive: false });
    return () => window.removeEventListener('touchmove', block);
  }, []);

  const start = (event, payload) => {
    if (event.button !== 0) return;
    const from = { x: event.clientX, y: event.clientY };
    const touch = event.pointerType === 'touch';
    let held = !touch;
    let active = false;
    let at = from;
    let scrollTimer = null;
    const show = () => setDrag({ payload, x: at.x, y: at.y, over: targetAt(at.x, at.y) });
    const holdTimer = touch && setTimeout(() => {
      held = active = lifted.current = true;
      scrollTimer = setInterval(autoScroll, 16);
      navigator.vibrate?.(10);
      show();
    }, HOLD_MS);
    const autoScroll = () => {
      const el = scroller?.current;
      if (!el || !touch) return;
      const dy = at.y < EDGE ? -12 : at.y > window.innerHeight - EDGE ? 12 : 0;
      if (dy) { el.scrollTop += dy; show(); }
    };
    const move = (e) => {
      at = { x: e.clientX, y: e.clientY };
      const far = Math.hypot(at.x - from.x, at.y - from.y) >= 6;
      if (!held) { if (far) end(); return; }
      if (!active && !far) return;
      if (!active) scrollTimer = setInterval(autoScroll, 16);
      active = true;
      show();
    };
    const up = (e) => {
      const was = active;
      end();
      setDrag(null);
      if (!was) { onTap?.(payload); return; }
      const over = targetAt(e.clientX, e.clientY);
      if (over) onDrop(payload, over);
    };
    const end = () => {
      clearTimeout(holdTimer);
      clearInterval(scrollTimer);
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

  return { drag, start };
}
\`\`\`

## src/components/captelle/useStudio.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';
import { useDrag } from './useDrag';
import { addDays, pastDay, slotIso, weekStartOf } from './format';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 1024;

/** The page's UI state on top of the data: tab, topic, attached images, picker, view toggles, drags, the slot sheet. */
export function useStudio(app) {
  const scroller = useRef(null);
  const seen = useRef(new Set());
  const [mobile, setMobile] = useState(isMobile);
  const [tab, setTab] = useState('Generate');
  const [topic, setTopic] = useState('');
  const [attachedIds, setAttachedIds] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [view, setView] = useState('Grid');
  const [cols, setCols] = useState(3);
  const [filter, setFilter] = useState('All posts');
  const [week, setWeek] = useState(() => weekStartOf(new Date()));
  const [sheet, setSheet] = useState(null);
  const [freshId, setFreshId] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setSheet(null);
      setPickerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const onResize = () => setMobile(isMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const attach = (ids) => {
    setAttachedIds((list) => [...list, ...ids.filter((id) => !list.includes(id))]);
    setSelected([]);
    setPickerOpen(false);
  };
  const toggleSelect = (id) => setSelected((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
  const schedule = (post, iso) => {
    setSheet(null);
    setFreshId(iso ? post.id : null);
    app.schedule(post.id, iso);
  };

  const drag = useDrag({
    scroller,
    onTap: (payload) => (payload.kind === 'images' ? toggleSelect(payload.tapped) : setSheet(app.posts.find((p) => p.id === payload.id))),
    onDrop: (payload, target) => {
      if (payload.kind === 'images' && target === 'field') attach(payload.ids);
      if (payload.kind === 'post' && target.startsWith('slot:')) {
        const [, day, hour] = target.split(':').map(Number);
        if (!pastDay(week, day)) schedule(app.posts.find((p) => p.id === payload.id), slotIso(week, day, hour));
      }
    },
  });

  const attached = attachedIds.map((id) => app.images.find((i) => i.id === id)).filter(Boolean);

  return {
    scroller, mobile, tab, topic, setTopic, attached, view, setView, cols, setCols, filter, setFilter,
    week, sheet, freshId, drag: drag.drag, scrolled, setScrolled,
    typed: { first: (id) => !seen.current.has(id) && Boolean(seen.current.add(id)) },
    home: () => {
      setTab('Generate');
      setPickerOpen(false);
      setTopic('');
      setAttachedIds([]);
      app.reset();
      scroller.current?.scrollTo({ top: 0 });
    },
    /** The DRAG TO PLAN hint as a tap: the slot sheet for the first post of this set not yet planned. */
    scheduleNext: () => {
      const next = app.currentPosts.find((p) => !p.scheduledAt) ?? app.currentPosts[0];
      if (next) setSheet(next);
    },
    setTab: (t) => { setTab(t); setPickerOpen(false); scroller.current?.scrollTo({ top: 0 }); },
    shiftWeek: (n) => setWeek((w) => (n === 0 ? weekStartOf(new Date()) : addDays(w, 7 * n))),
    removeAttached: (id) => setAttachedIds((list) => list.filter((x) => x !== id)),
    picker: {
      open: pickerOpen,
      toggle: () => setPickerOpen((o) => !o),
      images: app.images,
      selected,
      select: toggleSelect,
      dragging: drag.drag?.payload.kind === 'images',
      // Pressing a picked image drags every picked one; pressing another drags just it.
      press: (e, img) => drag.start(e, { kind: 'images', tapped: img.id, ids: selected.includes(img.id) ? selected : [img.id] }),
      add: () => attach(selected),
      upload: async (files) => { const rows = await app.addImages(files); setSelected((list) => [...list, ...rows.map((r) => r.id)]); },
    },
    uploadToField: async (files) => attach((await app.addImages(files)).map((r) => r.id)),
    pressPost: (e, post) => drag.start(e, { kind: 'post', id: post.id }),
    openSheet: setSheet,
    closeSheet: () => setSheet(null),
    schedule,
    generate: () => {
      setPickerOpen(false);
      app.generate(topic, attached);
    },
  };
}
\`\`\`

## src/components/captelle/useTypewriter.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

const TYPE_MS = 2500;
const RETYPE_MS = 1000;
const DELETE_MS = 350;
const TICK = 30;

/**
 * The text as it is typed: a new \`target\` first deletes what is shown (quickly), then types in over
 * ~2.5s whatever its length (a rewrite in ~1s). \`typeFirst\` false shows the first text at once (a post seen before).
 */
export function useTypewriter(target, typeFirst = true) {
  const [shown, setShown] = useState(typeFirst ? '' : target);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const first = useRef(true);

  useEffect(() => {
    const skip = first.current && !typeFirst;
    const ms = first.current ? TYPE_MS : RETYPE_MS;
    first.current = false;
    if (skip) return undefined;
    let text = shownRef.current;
    const keep = target.startsWith(text) ? text.length : 0;
    const delStep = Math.max(1, Math.ceil(text.length / (DELETE_MS / TICK)));
    const typeStep = Math.max(1, Math.ceil(target.length / (ms / TICK)));
    const timer = setInterval(() => {
      if (text.length > keep && !target.startsWith(text)) text = text.slice(0, Math.max(0, text.length - delStep));
      else if (text.length < target.length) text = target.slice(0, Math.min(target.length, text.length + typeStep));
      else { clearInterval(timer); return; }
      setShown(text);
    }, TICK);
    return () => clearInterval(timer);
  }, [target]);

  return { shown, typing: shown !== target };
}
\`\`\`

## src/pages/Captelle.jsx
\`\`\`jsx
import '@/components/captelle/captelle.css';
import { LayoutGroup } from 'framer-motion';
import TopBar from '@/components/captelle/TopBar';
import Composer from '@/components/captelle/Composer';
import ResultsGrid, { RuleLines } from '@/components/captelle/ResultsGrid';
import Schedule, { Reveal } from '@/components/captelle/Schedule';
import ScheduleList from '@/components/captelle/ScheduleList';
import SlotSheet from '@/components/captelle/SlotSheet';
import DragGhost from '@/components/captelle/DragGhost';
import LibraryView from '@/components/captelle/LibraryView';
import AccountView from '@/components/captelle/AccountView';
import ErrorNote from '@/components/captelle/ErrorNote';
import { BottomBar, MobileTabs } from '@/components/captelle/Bars';
import { BACKGROUND_URL } from '@/components/captelle/content';
import { useCaptelle } from '@/components/captelle/useCaptelle';
import { useStudio } from '@/components/captelle/useStudio';

export default function Captelle() {
  const app = useCaptelle();
  const ui = useStudio(app);
  const { mobile, drag } = ui;
  const started = app.status !== 'idle' || app.current;
  const writing = app.status === 'writing';
  const pad = mobile ? 'px-6' : 'px-[6.25%]';

  const composer = (
    <Composer bar={started} mobile={mobile} topic={ui.topic} setTopic={ui.setTopic} attached={ui.attached} onRemove={ui.removeAttached}
      picker={ui.picker} imageDrag={drag} status={app.status} onGenerate={ui.generate} onFiles={ui.uploadToField} />
  );
  const calendar = (props) => (mobile
    ? <ScheduleList week={ui.week} posts={app.posts} over={drag?.over} freshId={ui.freshId} onPress={ui.pressPost} {...props} />
    : <Schedule week={ui.week} posts={app.posts} over={drag?.over} freshId={ui.freshId} onPress={ui.pressPost} onRemove={(p) => ui.schedule(p, null)} {...props} />);

  return (
    <div ref={ui.scroller} onScroll={(e) => ui.setScrolled(e.currentTarget.scrollTop > 60)} className={\`cp cp-scroll relative h-screen overflow-y-auto overflow-x-hidden \${mobile ? 'pb-[72px]' : 'min-h-[720px] min-w-[1024px]'} \${drag ? 'select-none' : ''}\`}>
      <div className="cp-bg" style={{ backgroundImage: \`url(\${BACKGROUND_URL})\` }} />
      <LayoutGroup>
        {ui.tab === 'Generate' && !started && (
          <div className="relative flex h-screen min-h-[600px] flex-col lg:min-h-[720px]">
            <TopBar brand={app.brand} tab={ui.tab} onTab={ui.setTab} onHome={ui.home} mobile={mobile} />
            <div className={\`flex flex-1 flex-col items-center justify-center pb-[52px] \${pad}\`}>
              <h1 className="text-center text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] lg:text-[49px]">What should we post about?</h1>
              <p className="mb-[16px] mt-[10px] text-center text-[17px] text-[var(--ui-muted)] lg:mb-[17px] lg:mt-[9px] lg:text-[20px]">Instagram, LinkedIn and X, written in one pass.</p>
              {composer}
              {app.error && <ErrorNote error={app.error} needsSignIn={app.needsSignIn} onDismiss={app.dismissError} className="mt-[70px]" />}
            </div>
          </div>
        )}
        {ui.tab === 'Generate' && started && (
          <>
            <div className="relative pb-[35px]">
              {!mobile && <RuleLines cols={ui.cols} />}
              <TopBar brand={app.brand} tab={ui.tab} onTab={ui.setTab} onHome={ui.home} mobile={mobile} />
              <div className={\`relative \${pad}\`}>
                <div className="relative z-30 mt-[13px]">{composer}</div>
                {app.error && <ErrorNote error={app.error} needsSignIn={app.needsSignIn} onDismiss={app.dismissError} className="mt-2" />}
                <div className="mt-[25px]">
                  <ResultsGrid brand={app.brand} posts={app.currentPosts} typed={ui.typed} writing={writing} regenerating={app.regenerating} onRegenerate={app.regenerate}
                    onPress={ui.pressPost} onPlan={ui.openSheet} draggingId={drag?.payload.kind === 'post' ? drag.payload.id : null} view={ui.view} cols={ui.cols} filter={ui.filter} mobile={mobile} />
                </div>
              </div>
            </div>
            {!writing && <Reveal typed={ui.typed} id={app.current?.ids.instagram} className={\`relative z-20 mb-[16px] mt-[8px] \${pad}\`}>{calendar({ onQueued: () => ui.setTab('Calendar'), onHint: ui.scheduleNext })}</Reveal>}
          </>
        )}
      </LayoutGroup>
      {ui.tab !== 'Generate' && (
        <>
          <TopBar brand={app.brand} tab={ui.tab} onTab={ui.setTab} onHome={ui.home} mobile={mobile} />
          <div className={\`relative mt-[13px] pb-[40px] \${pad}\`}>
            {app.error && <ErrorNote error={app.error} needsSignIn={app.needsSignIn} onDismiss={app.dismissError} className="mb-2" />}
            {ui.tab === 'Calendar' && calendar({ onWeek: ui.shiftWeek })}
            {ui.tab === 'Library' && <LibraryView images={app.images} posts={app.posts} onUpload={app.addImages} onRemoveImage={app.removeImage} onDeletePost={app.deletePost} />}
            {ui.tab === 'Account' && <AccountView brand={app.brand} onSave={app.saveBrand} />}
          </div>
        </>
      )}
      {mobile ? <MobileTabs tab={ui.tab} onTab={ui.setTab} /> : ui.tab === 'Generate' && (
        <BottomBar hidden={ui.scrolled} view={ui.view} setView={ui.setView} cols={ui.cols} setCols={ui.setCols} filter={ui.filter} setFilter={ui.setFilter} />
      )}
      <DragGhost drag={drag} images={app.images} posts={app.posts} />
      {ui.sheet && <SlotSheet post={ui.sheet} week={ui.week} mobile={mobile} onPick={ui.schedule} onClose={ui.closeSheet} />}
    </div>
  );
}
\`\`\`
`;export{e as default};