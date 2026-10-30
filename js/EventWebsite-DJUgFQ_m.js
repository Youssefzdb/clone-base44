var e=`# event_website — app files

## base44/entities/Rsvp.jsonc
\`\`\`json
{"name":"Rsvp","type":"object","properties":{"full_name":{"type":"string"},"email":{"type":"string","format":"email"},"studio":{"type":"string"}},"required":["full_name","email"],"rls":{"create":{"user_condition":{"role":"admin"}},"read":{"$or":[{"created_by_id":"{{user.id}}"},{"user_condition":{"role":"admin"}}]},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Session.jsonc
\`\`\`json
{"name":"Session","type":"object","properties":{"title":{"type":"string"},"time":{"type":"string","description":"Start, HH:MM"},"duration":{"type":"string","description":"e.g. 45 min, until 19:00"},"room":{"type":"string"},"speaker":{"type":"string"},"image":{"type":"string","format":"uri"},"order":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["title","time","duration","room"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/SiteSetup.jsonc
\`\`\`json
{"name":"SiteSetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Speaker.jsonc
\`\`\`json
{"name":"Speaker","type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"country":{"type":"string","description":"Three-letter code, e.g. PRT"},"photo":{"type":"string","format":"uri"},"order":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["name","role","country"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/functions/claimSeat/entry.ts
\`\`\`ts
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Saves an RSVP once per email, up to the venue's seats. Guests can't read each other's RSVPs (rls), so the checks run here.
const SEATS = 240; // SEATS in useEventWebsite.js
const EMAIL = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const full_name = text(body.full_name, 120);
    const email = text(body.email, 200).toLowerCase();
    const studio = text(body.studio, 120);
    if (!full_name || !EMAIL.test(email)) return Response.json({ error: 'A name and a valid email are required.' }, { status: 400 });

    const rsvps = base44.asServiceRole.entities.Rsvp;
    if ((await rsvps.filter({ email }, undefined, 1)).length) return Response.json({ status: 'duplicate' });
    if ((await rsvps.list(undefined, SEATS)).length >= SEATS) return Response.json({ status: 'full' });
    await rsvps.create({ full_name, email, studio });
    return Response.json({ status: 'claimed' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
\`\`\`

## src/components/event-website/event-website.css
\`\`\`css
@font-face{font-family:"Neue Haas Grotesk Display";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-500-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk Display";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-700-normal.woff2) format("woff2")}

/* The look: ink, accent, paper and card pink (--swatch-N), the section grounds, and the nine card colours bands and speakers cycle through. */
:root{
  --swatch-1:#0B0B0B;--swatch-1-ink:#FFFFFF;
  --swatch-2:#FFF04C;--swatch-2-ink:#111111;
  --swatch-3:#FFFFFF;--swatch-3-ink:#111111;
  --swatch-4:#FBC9D2;--swatch-4-ink:#111111;
  --ui-ink:var(--swatch-1);--ui-on-ink:var(--ui-page);--ui-card-ink:var(--swatch-1);
  --ui-hero:var(--swatch-3);--ui-page:var(--swatch-3);
  --ui-accent:var(--swatch-2);--ui-accent-ink:var(--swatch-1);
  --ui-card-1:#FB4A3C;--ui-card-2:var(--swatch-4);--ui-card-3:#E0A6F5;--ui-card-4:#8FBFA0;--ui-card-5:#93BEDD;
  --ui-card-6:var(--swatch-2);--ui-card-7:#FB9C8A;--ui-card-8:#9B6BF2;--ui-card-9:#DCDCDC;
  --ui-spk-1:var(--ui-card-6);--ui-spk-2:var(--ui-card-5);--ui-spk-3:var(--ui-card-7);--ui-spk-4:var(--ui-card-3);
  --ui-spk-5:var(--ui-card-4);--ui-spk-6:var(--ui-card-1);--ui-spk-7:var(--ui-card-9);--ui-spk-8:var(--ui-card-8);
  --ui-portrait:var(--swatch-1);--ui-ph:#D4ECF7;--ui-ph-portrait:#8C8C8C;--ui-ring:rgba(255,255,255,0.6);--ui-shadow:0 28px 60px rgba(0,0,0,0.22);
}
/* gallery-look */

.pdd{font-family:"Neue Haas Grotesk Display","Helvetica Neue",Helvetica,Arial,sans-serif;color:var(--ui-ink);background:var(--ui-page);-webkit-font-smoothing:antialiased}
.pdd .mono{font-family:Menlo,"SF Mono",ui-monospace,monospace;font-weight:400}
.no-bar{scrollbar-width:none}
.no-bar::-webkit-scrollbar{display:none}
@keyframes pdd-marquee{to{transform:translateX(-50%)}}
.pdd .marquee{animation:pdd-marquee 15s linear infinite}
\`\`\`

## src/components/event-website/Footer.jsx
\`\`\`jsx
import { useState } from 'react';
import Star, { Starred } from './Star';
import { SEATS } from './useEventWebsite';

const FIELDS = [['full_name', 'full name', 'text'], ['email', 'email', 'email'], ['studio', 'studio', 'text']];
const EMPTY = { full_name: '', email: '', studio: '' };

export default function Footer({ onClaim }) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [refused, setRefused] = useState(null); // 'duplicate' | 'full'

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setFailed(false);
    setRefused(null);
    try {
      const { status } = await onClaim({ full_name: form.full_name.trim(), email: form.email.trim(), studio: form.studio.trim() });
      if (status === 'duplicate' || status === 'full') return setRefused(status);
      setForm(EMPTY);
      setClaimed(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <footer id="rsvp" className="mt-[max(196px,15.3125vw)] px-[max(40px,3.125vw)] pb-[max(26px,2.03125vw)] uppercase max-lg:mt-[140px] max-sm:mt-[110px] max-sm:px-[20px] max-sm:pb-[20px]">
      <div className="flex items-end justify-between text-[max(85px,6.640625vw)] font-bold leading-[max(74px,5.78125vw)] tracking-[-0.031em] max-lg:text-[length:clamp(44px,13vw,85px)] max-lg:leading-[0.87]">
        <h2>Parallel<br />Design</h2>
        <div className="flex flex-col items-end"><Star size={67} weight={2} className="h-[max(67px,5.234375vw)] w-[max(67px,5.234375vw)] mb-[max(6px,0.46875vw)] max-lg:h-[0.8em] max-lg:w-[0.8em]" />Day</div>
      </div>
      <p className="mt-[max(36px,2.8125vw)] text-[max(44px,3.4375vw)] font-bold leading-[max(41px,3.203125vw)] tracking-[-0.025em] max-lg:text-[length:clamp(26px,6.5vw,44px)] max-lg:leading-[0.95] max-sm:mt-[28px]">A one-day conference<br className="max-sm:hidden" /> for people who make things<br className="max-sm:hidden" /> with type, systems and motion</p>
      <div className="mt-[max(53px,4.140625vw)] border-t-[max(1.5px,0.1171875vw)] border-[var(--ui-ink)] pt-[max(34px,2.65625vw)] max-sm:mt-[40px] max-sm:pt-[28px]">
        <h2 className="text-[max(61px,4.765625vw)] font-bold normal-case leading-[max(61px,4.765625vw)] tracking-[-0.05em]">RSVP</h2>
        <form onSubmit={submit} className="mt-[max(8px,0.625vw)] flex items-end gap-[max(30px,2.34375vw)] normal-case max-lg:mt-[16px] max-lg:flex-col max-lg:items-stretch max-lg:gap-[24px]">
          {FIELDS.map(([key, label, type]) => (
            <label key={key} className="block w-[max(284px,22.1875vw)] max-xl:w-auto max-xl:min-w-0 max-xl:flex-1">
              <span className="mono text-[max(20px,1.5625vw)] opacity-60">[{label}]</span>
              <input required={key !== 'studio'} type={type} value={form[key]} onChange={(e) => { setClaimed(false); setRefused(null); setForm((f) => ({ ...f, [key]: e.target.value })); }}
                className="mt-[max(14px,1.09375vw)] block h-[max(63px,4.921875vw)] w-full border-b-[max(2px,0.15625vw)] pb-[max(14px,1.09375vw)] border-[var(--ui-ink)] bg-transparent text-[max(33px,2.578125vw)] font-bold tracking-[-0.03em] text-[var(--ui-ink)] outline-none max-sm:mt-[6px] max-sm:h-[52px] max-sm:pb-[8px] max-sm:text-[24px]" />
            </label>
          ))}
          <button type="submit" disabled={sending} className="mb-[max(2px,0.15625vw)] ml-auto flex h-[max(63px,4.921875vw)] w-[max(252px,19.6875vw)] items-center justify-center gap-[max(10px,0.78125vw)] bg-[var(--ui-ink)] text-[max(28px,2.1875vw)] font-bold tracking-[-0.03em] text-[var(--ui-on-ink)] transition-transform hover:scale-[1.04] active:scale-[0.97] max-lg:mb-0 max-lg:ml-0 max-lg:mt-[8px] max-lg:h-[64px] max-lg:w-full max-lg:hover:scale-100 disabled:opacity-60">
            <Starred text={failed ? 'Try again ✳' : claimed ? 'Seat claimed ✳' : 'Claim a seat ✳'} size="0.72em" />
          </button>
        </form>
        {(failed || refused) && (
          <p role="alert" className="mono mt-[max(18px,1.40625vw)] text-[max(20px,1.5625vw)] normal-case max-sm:text-[16px]">
            {{ duplicate: 'This email already has a seat.', full: \`All \${SEATS} seats are taken.\` }[refused] ?? 'We couldn’t save your seat. Check your connection and try again.'}
          </p>
        )}
      </div>
      <div className="mt-[max(22px,1.71875vw)] grid grid-cols-[max(615px,48.046875vw)_1fr_auto] items-center text-[max(20px,1.5625vw)] font-bold tracking-[0.04em] max-lg:flex max-lg:flex-wrap max-lg:justify-between max-lg:gap-[12px] max-sm:mt-[28px] max-sm:text-[16px]">
        <span className="tracking-[0.08em] max-sm:tracking-[0.02em] max-sm:[overflow-wrap:anywhere]">@ parallel-designday.pt</span>
        <span className="max-sm:hidden"><Starred text={\`Free ✳ \${SEATS} seats\`} size="0.8em" className="mx-[0.3em]" /></span>
        <span className="bg-[var(--ui-accent)] px-[max(12px,0.9375vw)] py-[max(5px,0.390625vw)] text-[max(22px,1.71875vw)] tracking-[-0.02em] text-[var(--ui-accent-ink)] max-sm:text-[18px]"><Starred text="P✳26" size="0.75em" /></span>
      </div>
    </footer>
  );
}
\`\`\`

## src/components/event-website/Header.jsx
\`\`\`jsx
import { useState } from 'react';
import { Starred } from './Star';

const NAV = [['Programme', 'programme'], ['Speakers', 'speakers'], ['RSVP', 'rsvp']];

export default function Header({ active, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 flex h-[max(67px,5.234375vw)] items-center justify-between border-b-[max(1.5px,0.1171875vw)] border-[var(--ui-ink)] bg-[var(--ui-hero)] pl-[max(42px,3.28125vw)] pr-[max(32px,2.5vw)] pt-[max(11px,0.859375vw)] uppercase max-lg:pl-[40px] max-lg:pr-[30px] max-lg:pt-0 max-sm:pl-[20px] max-sm:pr-[10px]">
      <span className="text-[max(28px,2.1875vw)] font-bold tracking-[-0.03em]"><Starred text="Parallel ✳" size="0.62em" className="mx-[0.12em]" /><span className="max-sm:hidden"> Design Day</span></span>
      <nav className="flex gap-[max(20px,1.5625vw)] max-xl:gap-[4px] max-lg:hidden">
        {NAV.map(([label, target]) => (
          <button key={label} type="button" onClick={() => onNavigate(label, target)}
            className={\`h-[max(34px,2.65625vw)] px-[max(10px,0.78125vw)] text-[max(22px,1.71875vw)] font-bold uppercase tracking-[0.02em] hover:bg-[var(--ui-ink)] hover:text-[var(--ui-hero)] \${active === label ? 'bg-[var(--ui-ink)] text-[var(--ui-hero)]' : ''}\`}>
            {label}
          </button>
        ))}
      </nav>
      <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="hidden size-[44px] flex-col items-center justify-center gap-[8px] max-lg:flex">
        <span className="h-[2px] w-[26px] bg-[var(--ui-ink)]" /><span className="h-[2px] w-[26px] bg-[var(--ui-ink)]" />
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-[var(--ui-hero)] px-[20px] pb-[32px] sm:px-[40px]">
          <div className="flex h-[67px] flex-none items-center justify-between max-sm:-mr-[10px]">
            <span className="text-[28px] font-bold tracking-[-0.03em]"><Starred text="Parallel ✳" size="0.62em" className="mx-[0.12em]" /></span>
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="flex size-[44px] items-center justify-center text-[30px] leading-none">✕</button>
          </div>
          <nav className="mt-[24px] border-t-[2px] border-[var(--ui-ink)]">
            {NAV.map(([label, target]) => (
              <button key={label} type="button" onClick={() => { setOpen(false); onNavigate(label, target); }}
                className="block w-full border-b-[2px] border-[var(--ui-ink)] py-[14px] text-left text-[length:clamp(40px,12vw,56px)] font-bold uppercase leading-none tracking-[-0.03em]">
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
\`\`\`

## src/components/event-website/Hero.jsx
\`\`\`jsx
import Star, { Starred } from './Star';
import { eventDate, useCountdown } from './useCountdown';

const CORNERS = [
  'left-[max(36px,2.8125vw)] top-[max(34px,2.65625vw)] max-sm:left-[8px] max-sm:top-[8px]',
  'right-[max(37px,2.890625vw)] top-[max(34px,2.65625vw)] max-sm:right-[8px] max-sm:top-[8px]',
  'left-[max(36px,2.8125vw)] bottom-[max(47px,3.671875vw)] max-sm:left-[8px] max-sm:bottom-[8px]',
  'right-[max(37px,2.890625vw)] bottom-[max(47px,3.671875vw)] max-sm:right-[8px] max-sm:bottom-[8px]',
];
const LABEL = 'text-[max(21px,1.640625vw)] leading-[max(24px,1.875vw)] tracking-[0.055em] max-sm:text-[16px] max-sm:leading-[20px]';

export default function Hero() {
  const countdown = useCountdown();
  const items = ['One day, ten talks', 'Teatro Capitólio', countdown, 'Free ✳ 240 seats', 'Lisboa (PRT)'];
  return (
    <>
      {/* Above 1280px the hero grows with the window and fills the screen above the marquee. */}
      <section className="relative h-[557px] [--h:max(43.515625vw,calc(100vh_-_12.734375vw))] min-[1281px]:h-[var(--h)] bg-[var(--ui-hero)] uppercase max-lg:h-[max(520px,calc(100svh_-_163px))] max-sm:h-[max(560px,calc(100svh_-_139px))]">
        {CORNERS.map((at) => <Star key={at} size={36} weight={1.6} className={\`absolute h-[max(36px,2.8125vw)] w-[max(36px,2.8125vw)] max-sm:h-[24px] max-sm:w-[24px] \${at}\`} />)}
        <div className="absolute bottom-[max(19px,1.484375vw)] left-[max(127px,9.921875vw)] right-[max(127px,9.921875vw)] top-[max(32px,2.5vw)] flex flex-col items-center rounded-[50%] border-[max(1.5px,0.1171875vw)] border-[var(--ui-ink)] pt-[29px] min-[1281px]:pt-[calc(2.265625vw_+_(var(--h)_-_43.515625vw)_/_2)] font-bold max-lg:inset-x-[40px] max-lg:justify-center max-lg:pt-0 max-sm:inset-x-[20px] max-sm:inset-y-[20px]">
          <p className={LABEL}><Starred text="One day ✳ Ten talks" size="0.7em" className="mx-[0.45em]" /></p>
          <h1 className="mt-[max(47px,3.671875vw)] text-center text-[max(124px,9.6875vw)] leading-[max(104px,8.125vw)] tracking-[-0.012em] max-lg:mt-[28px] max-lg:text-[length:clamp(64px,12vw,124px)] max-lg:leading-[0.86] max-sm:text-[length:17vw]">Parallel<br />Design<br className="sm:hidden" /> Day<br />{eventDate()}</h1>
          <p className={\`mt-[max(41px,3.203125vw)] max-lg:mt-[28px] \${LABEL}\`}><span className="max-sm:hidden"><Starred text="Teatro Capitólio ✳ Lisboa" size="0.7em" className="mx-[0.45em]" /></span><span className="sm:hidden">Lisboa</span></p>
        </div>
      </section>
      <div className="h-[max(96px,7.5vw)] overflow-hidden border-t-[max(2px,0.15625vw)] border-[var(--ui-ink)] bg-[var(--ui-accent)] text-[var(--ui-accent-ink)] max-sm:h-[72px]">
        <div className="marquee flex h-full w-max items-center text-[max(33px,2.578125vw)] font-bold uppercase tracking-[-0.01em] tabular-nums max-sm:text-[24px]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-[max(43px,3.359375vw)] pr-[max(43px,3.359375vw)] max-sm:gap-[28px] max-sm:pr-[28px]" aria-hidden={copy === 1}>
              {items.map((item) => (
                <span key={item.slice(0, 6)} className="flex items-center gap-[max(43px,3.359375vw)] whitespace-nowrap max-sm:gap-[28px]">
                  <span><Starred text={item} size="0.62em" className="mx-[0.2em]" /></span>
                  <Star size={20} weight={1.4} className="h-[max(20px,1.5625vw)] w-[max(20px,1.5625vw)] max-sm:h-[15px] max-sm:w-[15px]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
\`\`\`

## src/components/event-website/images.js
\`\`\`js
// Session images and speaker portraits; an empty value renders a placeholder block of the same size.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/event-website';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

// Sessions: two-tone risograph-style prints, one grainy ink on a pale tint; speakers: waist-up portraits on a plain studio backdrop.
export const IMAGES = {
  keynote: photo('keynote'),
  type: photo('type'),
  screen: photo('screen'),
  grid: photo('grid'),
  lunch: photo('lunch'),
  color: photo('color'),
  motion: photo('motion'),
  tools: photo('tools'),
  panel: photo('panel'),
  closing: photo('closing'),
  // The designer's portraits, matched to the speakers as the film shows them.
  noor: photo('speaker-01'),
  teo: photo('speaker-03'),
  ada: photo('speaker-05'),
  halvard: photo('speaker-04'),
  mira: photo('speaker-06'),
  kenji: photo('speaker-02'),
};
\`\`\`

## src/components/event-website/Img.jsx
\`\`\`jsx
export default function Img({ src, alt, className = '', ph = 'var(--ui-ph)' }) {
  if (src) return <img src={src} alt={alt} loading="lazy" className={\`object-cover \${className}\`} />;
  return <div role="img" aria-label={alt} className={className} style={{ background: ph }} />;
}
\`\`\`

## src/components/event-website/Programme.jsx
\`\`\`jsx
import Img from './Img';
import SectionState from './SectionState';
import { Starred } from './Star';
import { useLift } from './useLift';

// Each band's tilt, alternating direction; the last band lies level.
const TILTS = [-1.12, 0.63, -1.53, 0.36, -0.68, 1.1, -0.9, 0.5, -1.3];
const MONO = 'mono pt-[max(15px,1.171875vw)] text-[max(24px,1.875vw)] leading-[max(31px,2.421875vw)] tracking-[0.02em] max-lg:pt-0 max-lg:text-[16px] max-lg:leading-[22px]';

const lift = (tilt, up, tap) => {
  if (!up) return \`rotate(\${tilt}deg)\`;
  return tap ? \`translateY(-90px) rotate(\${tilt * 1.6}deg)\` : \`translate(min(-28px, -2.1875vw), min(-95px, -7.421875vw)) rotate(\${tilt * 1.2}deg) scale(1.015)\`;
};

export default function Programme({ sessions, status, onRetry }) {
  const { lifted, tap, handlers } = useLift();
  return (
    <section id="programme" className="pt-[max(57px,4.453125vw)] max-sm:pt-[48px]">
      <h2 className="px-[max(48px,3.75vw)] text-[max(82px,6.40625vw)] font-bold leading-[max(82px,6.40625vw)] tracking-[-0.013em] max-lg:px-[40px] max-lg:text-[length:clamp(48px,13vw,82px)] max-lg:leading-none max-sm:px-[20px]">Programme</h2>
      <div className="mt-[max(56px,4.375vw)] max-sm:mt-[36px]">
        <SectionState status={status} count={sessions.length} what="programme" onRetry={onRetry} />
        {sessions.map((s, i) => {
          const last = i === sessions.length - 1;
          const tilt = last ? 0 : TILTS[i % TILTS.length];
          const up = lifted === s.id;
          return (
            <div key={s.id} className={\`relative \${last ? '' : 'h-[max(102px,7.96875vw)] max-lg:h-[130px]'}\`}>
              <article data-band {...handlers(s.id)}
                className="relative -mx-[max(80px,6.25vw)] grid grid-cols-[max(533px,41.640625vw)_max(266px,20.78125vw)_1fr] pb-[max(22px,1.71875vw)] pl-[max(173px,13.515625vw)] pt-[max(22px,1.71875vw)] text-[var(--ui-card-ink)] transition-[transform,box-shadow] duration-[350ms] ease-in-out max-lg:-mx-[30px] max-lg:flex max-lg:cursor-pointer max-lg:flex-col max-lg:px-[70px] max-lg:pb-[28px] max-lg:pt-[18px] max-lg:duration-500 max-lg:ease-[cubic-bezier(0.6,-0.05,0.3,1.3)] max-sm:px-[50px]"
                style={{ background: \`var(--ui-card-\${(i % 9) + 1})\`, transform: lift(tilt, up, tap), boxShadow: up ? 'var(--ui-shadow)' : 'none' }}>
                <div className="max-lg:contents">
                  <h3 className="max-w-[max(505px,39.453125vw)] text-[max(44px,3.4375vw)] font-bold leading-[max(45px,3.515625vw)] tracking-[-0.015em] max-lg:order-2 max-lg:mt-[10px] max-lg:max-w-none max-lg:text-[length:clamp(28px,7.7vw,40px)] max-lg:leading-[1.05] max-lg:[overflow-wrap:anywhere]"><Starred text={s.title} size="0.7em" className="mx-[0.12em]" /></h3>
                  <Img src={s.image} alt={s.title} className="mt-[max(10px,0.78125vw)] h-[max(142px,11.09375vw)] w-[max(376px,29.375vw)] border-[max(1.5px,0.1171875vw)] border-[var(--ui-card-ink)] max-lg:order-4 max-lg:mt-[14px] max-lg:aspect-[376/180] max-lg:h-auto max-lg:w-full max-lg:border-[2px]" />
                </div>
                <p className={\`\${MONO} max-lg:order-1 max-lg:flex max-lg:justify-between max-lg:gap-[12px]\`}><span>{s.time} — {s.duration}</span><br className="max-lg:hidden" /><span>{s.room}</span></p>
                <p className={\`\${MONO} max-lg:order-3 max-lg:mt-[6px] \${s.speaker ? '' : 'max-lg:hidden'}\`}>{s.speaker || s.room}</p>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
\`\`\`

## src/components/event-website/scroll.js
\`\`\`js
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
// A visitor's own scroll, tap or key ends a glide instead of fighting it.
const interrupts = ['wheel', 'touchstart', 'pointerdown', 'keydown'];

/** Scrolls \`el\` to \`to\` over \`ms\` (native smooth scrolling can't be timed). */
export function glide(el, to, ms = 1900, axis = 'top', ease = easeInOut) {
  const key = axis === 'top' ? 'scrollTop' : 'scrollLeft';
  const from = el[key];
  const start = performance.now();
  let stopped = false;
  const stop = (event) => {
    if (event && !event.isTrusted) return;
    stopped = true;
    interrupts.forEach((type) => window.removeEventListener(type, stop, true));
  };
  interrupts.forEach((type) => window.addEventListener(type, stop, { capture: true, passive: true }));
  const step = (now) => {
    if (stopped) return;
    const t = Math.min((now - start) / ms, 1);
    el[key] = from + (to - from) * ease(t);
    if (t < 1) requestAnimationFrame(step);
    else stop();
  };
  requestAnimationFrame(step);
}
\`\`\`

## src/components/event-website/SectionState.jsx
\`\`\`jsx
/** What a data section shows until it has rows: loading, failed (with a retry), or nothing yet. */
export default function SectionState({ status, count, what, onRetry }) {
  const failed = status === 'error';
  if (status === 'ready' && count) return null;
  return (
    <div role={failed ? 'alert' : 'status'} className="mono flex min-h-[max(200px,15.625vw)] flex-col items-start justify-center gap-[20px] px-[max(48px,3.75vw)] text-[max(24px,1.875vw)] max-lg:px-[40px] max-lg:text-[18px] max-sm:px-[20px]">
      <p>{status === 'loading' ? \`Loading the \${what}…\` : failed ? \`We couldn’t load the \${what}.\` : \`The \${what} will be announced soon.\`}</p>
      {failed && (
        <button type="button" onClick={onRetry} className="h-[max(44px,3.4375vw)] bg-[var(--ui-ink)] px-[max(20px,1.5625vw)] font-bold text-[var(--ui-on-ink)]">Try again</button>
      )}
    </div>
  );
}
\`\`\`

## src/components/event-website/seed.js
\`\`\`js
import { base44 } from '@/api/base44Client';

const byAge = (a, b) => (a.created_date ?? '').localeCompare(b.created_date ?? '') || String(a.id).localeCompare(String(b.id));

/**
 * Loads each table, adding its samples once, for a new app. The SiteSetup row is written only after
 * every sample is saved: a reload mid-seed adds just the missing ones (matched on \`key\`), and a table
 * the user later empties stays empty.
 */
export async function loadSeeded(tables) {
  const [setup] = await base44.entities.SiteSetup.list();
  const loaded = {};
  for (const [name, { sort }] of Object.entries(tables)) loaded[name] = await base44.entities[name].list(sort, 1000);
  if (setup) return loaded;
  // Only an admin may write the samples: anyone else arriving before the owner's first visit sees them unsaved.
  const me = await base44.auth.me().catch(() => null);
  if (me?.role !== 'admin') {
    for (const [name, { samples }] of Object.entries(tables)) if (!loaded[name].length) loaded[name] = samples.map((s, i) => ({ id: \`sample-\${i + 1}\`, ...s }));
    return loaded;
  }
  try {
    for (const [name, { samples, key, sort }] of Object.entries(tables)) {
      const entity = base44.entities[name];
      // A table holding rows the app didn't mark was filled by the builder (or the user): it isn't ours to seed.
      const missing = loaded[name].some((r) => !r.sample) ? [] : samples.filter((s) => !loaded[name].some((r) => r[key] === s[key]));
      // One request per table: entity calls are rate-limited per app.
      if (missing.length) await entity.bulkCreate(missing.map((s) => ({ ...s, sample: true })));
      const rows = missing.length ? await entity.list(sort, 1000) : loaded[name];
      // Two first loads at once (a second tab) can both add the samples: the oldest copy of each stays. Only rows
      // marked \`sample\` are dropped, and every load before setup runs this, so a failed delete is retried.
      const seen = new Set();
      const extra = rows.filter((r) => r.sample).sort(byAge).filter((r) => seen.has(r[key]) || !seen.add(r[key]));
      if (extra.length) await entity.deleteMany({ id: { $in: extra.map((r) => r.id) } });
      loaded[name] = rows.filter((r) => !extra.includes(r));
    }
    await base44.entities.SiteSetup.create({ set_up: true });
  } catch {
    // A failed seed leaves the site unset: the next admin visit adds what's missing and drops the copies.
  }
  return loaded;
}
\`\`\`

## src/components/event-website/Speakers.jsx
\`\`\`jsx
import { useEffect, useState } from 'react';
import Img from './Img';
import SectionState from './SectionState';
import { useAutoScroll } from './useAutoScroll';

const ARROW = 'flex h-[max(56px,4.375vw)] w-[max(56px,4.375vw)] items-center justify-center border-[max(1.5px,0.1171875vw)] border-[var(--ui-ink)] text-[max(28px,2.1875vw)] font-bold hover:bg-[var(--ui-ink)] hover:text-[var(--ui-on-ink)] disabled:pointer-events-none disabled:opacity-30';

export default function Speakers({ speakers, status, onRetry }) {
  const strip = useAutoScroll();
  const [edge, setEdge] = useState({ start: true, end: true });
  const measure = () => {
    const el = strip.current;
    if (el) setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [speakers]);
  // Mouse users have no scrollbar (it's hidden) and no swipe: step a card at a time.
  const step = (dir) => {
    const el = strip.current;
    const card = el.firstElementChild;
    el.scrollBy({ left: dir * (card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || 0)), behavior: 'smooth' });
  };

  return (
    <section id="speakers" className="pt-[max(116px,9.0625vw)] max-sm:pt-[96px]">
      <div className="flex items-end justify-between px-[max(48px,3.75vw)] max-lg:px-[40px] max-sm:px-[20px]">
        <h2 className="text-[max(82px,6.40625vw)] font-bold leading-[max(82px,6.40625vw)] tracking-[-0.013em] max-lg:text-[length:clamp(48px,13vw,82px)] max-lg:leading-none">Speakers</h2>
        {!(edge.start && edge.end) && (
          <div className="flex gap-[max(10px,0.78125vw)] max-sm:hidden">
            <button type="button" aria-label="Previous speakers" disabled={edge.start} onClick={() => step(-1)} className={ARROW}>←</button>
            <button type="button" aria-label="Next speakers" disabled={edge.end} onClick={() => step(1)} className={ARROW}>→</button>
          </div>
        )}
      </div>
      <SectionState status={status} count={speakers.length} what="speakers" onRetry={onRetry} />
      <div ref={strip} data-strip onScroll={measure} className={\`no-bar \${speakers.length ? 'flex' : 'hidden'} mt-[max(103px,8.046875vw)] gap-[max(16px,1.25vw)] overflow-x-auto px-[max(48px,3.75vw)] max-lg:mt-[48px] max-lg:snap-x max-lg:snap-mandatory max-lg:scroll-px-[40px] max-lg:px-[40px] max-sm:mt-[36px] max-sm:gap-[12px] max-sm:scroll-px-[20px] max-sm:px-[20px]\`}>
        {speakers.map((p, i) => (
          <article key={p.id} className="flex h-[max(440px,34.375vw)] w-[max(287px,22.421875vw)] flex-none snap-start flex-col p-[max(13px,1.015625vw)] pb-[max(16px,1.25vw)] text-[var(--ui-card-ink)] max-sm:h-[390px] max-sm:w-[75vw]" style={{ background: \`var(--ui-spk-\${(i % 8) + 1})\` }}>
            <div className="relative h-[max(240px,18.75vw)] flex-none overflow-hidden bg-[var(--ui-portrait)] max-sm:h-[190px]">
              <Img src={p.photo} alt={p.name} ph="var(--ui-ph-portrait)" className="absolute left-0 top-1/2 h-[max(261px,20.390625vw)] w-[max(261px,20.390625vw)] -translate-y-1/2 rounded-full border border-[var(--ui-ring)] grayscale max-sm:h-[206px] max-sm:w-[206px]" />
            </div>
            <div className="mt-[max(16px,1.25vw)] flex items-start justify-between gap-[max(12px,0.9375vw)]">
              <h3 className="text-[max(28px,2.1875vw)] font-bold leading-[max(28px,2.1875vw)] tracking-[-0.025em] max-lg:[overflow-wrap:anywhere] max-sm:text-[26px] max-sm:leading-[27px]">{p.name}</h3>
              <span className="mono text-[max(21px,1.640625vw)] leading-[max(28px,2.1875vw)] tracking-[0.02em] max-sm:text-[18px] max-sm:leading-[27px]">({p.country})</span>
            </div>
            <p className="mono mt-auto text-[max(20px,1.5625vw)] leading-[max(27px,2.109375vw)] tracking-[0.02em] max-sm:text-[17px] max-sm:leading-[24px]">{p.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
\`\`\`

## src/components/event-website/Star.jsx
\`\`\`jsx
/** The ✳ ornament, drawn so it never falls back to an emoji glyph. */
export default function Star({ size = '0.72em', weight = 1.8, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={weight} aria-hidden="true" className={\`inline-block flex-none align-[-0.06em] \${className}\`}>
      <path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2 4.2 19.8" />
    </svg>
  );
}

/** Text with every ✳ drawn as a Star. A flat list, not keyed Fragments: the editor tags elements with props a Fragment rejects. */
export function Starred({ text, ...star }) {
  return text.split('✳').flatMap((part, i) => (i > 0 ? [<Star key={i} {...star} />, part] : [part]));
}
\`\`\`

## src/components/event-website/useAutoScroll.js
\`\`\`js
import { useEffect, useRef } from 'react';
import { PHONE, useMedia } from './useMedia';

const EVERY_MS = 3000;
const RESUME_MS = 3000;

/** On phones, steps the strip one card at a time; a touch pauses it until 3 s after the finger lifts. */
export function useAutoScroll() {
  const ref = useRef(null);
  const phone = useMedia(PHONE);

  useEffect(() => {
    const strip = ref.current;
    if (!phone || !strip) return undefined;
    let paused = false;
    let resume;
    const next = () => {
      if (paused) return;
      const card = strip.firstElementChild;
      const step = card ? card.offsetWidth + parseFloat(getComputedStyle(strip).columnGap || 0) : strip.clientWidth;
      const end = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
      strip.scrollTo({ left: end ? 0 : strip.scrollLeft + step, behavior: 'smooth' });
    };
    const hold = () => { paused = true; clearTimeout(resume); };
    const release = () => { clearTimeout(resume); resume = setTimeout(() => { paused = false; }, RESUME_MS); };
    const id = setInterval(next, EVERY_MS);
    strip.addEventListener('touchstart', hold, { passive: true });
    strip.addEventListener('touchend', release);
    strip.addEventListener('touchcancel', release);
    return () => {
      clearInterval(id);
      clearTimeout(resume);
      strip.removeEventListener('touchstart', hold);
      strip.removeEventListener('touchend', release);
      strip.removeEventListener('touchcancel', release);
    };
  }, [phone]);

  return ref;
}
\`\`\`

## src/components/event-website/useCountdown.js
\`\`\`js
import { useEffect, useState } from 'react';

// Doors open 14 Nov, 09:00 in Lisboa (WET, UTC+0 in November): this year's, until the day is over, then next
// year's, so the sample event is never in the past.
const doorsIn = (year) => Date.UTC(year, 10, 14, 9, 0, 0);
// Read at render, not at load: the gallery preview sets its demo clock after the module loads.
const doors = () => {
  const year = new Date().getUTCFullYear();
  return Date.now() < doorsIn(year) + 15 * 3600 * 1000 ? doorsIn(year) : doorsIn(year + 1);
};
const pad = (n) => String(n).padStart(2, '0');

/** The event's date as the hero prints it, e.g. "14.11.26". */
export const eventDate = () => \`14.11.\${String(new Date(doors()).getUTCFullYear()).slice(2)}\`;

/** "58 days 06:24:12", live to the second. */
export function useCountdown() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.max(Math.floor((doors() - now) / 1000), 0);
  if (!s) return 'Doors are open';
  return \`\${Math.floor(s / 86400)} days \${pad(Math.floor(s / 3600) % 24)}:\${pad(Math.floor(s / 60) % 60)}:\${pad(s % 60)} to doors\`;
}
\`\`\`

## src/components/event-website/useEventWebsite.js
\`\`\`js
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from './images';
import { loadSeeded } from './seed';

const SEED_SESSIONS = [
  { time: '09:30', duration: '45 min', room: 'Main Hall', title: 'Keynote: The Shape of Attention', speaker: 'Noor Ayvazian', image: IMAGES.keynote },
  { time: '10:15', duration: '40 min', room: 'Main Hall', title: 'Type at 400 Milliseconds', speaker: 'Teo Marchetti', image: IMAGES.type },
  { time: '11:00', duration: '40 min', room: 'Studio 2', title: 'Designing Without a Screen', speaker: 'Ada Okonkwo', image: IMAGES.screen },
  { time: '11:45', duration: '40 min', room: 'Main Hall', title: 'The Grid Is a Political Object', speaker: 'Halvard Sten', image: IMAGES.grid },
  { time: '12:30', duration: '60 min', room: 'Courtyard', title: 'Lunch ✳ Print Swap', speaker: '', image: IMAGES.lunch },
  { time: '14:00', duration: '40 min', room: 'Studio 2', title: 'Color Systems That Survive Handoff', speaker: 'Mira Lindqvist', image: IMAGES.color },
  { time: '14:45', duration: '40 min', room: 'Main Hall', title: 'Motion as Documentation', speaker: 'Kenji Aoyama', image: IMAGES.motion },
  { time: '15:30', duration: '40 min', room: 'Studio 2', title: 'Slow Tools, Fast Studios', speaker: 'Halvard Sten', image: IMAGES.tools },
  { time: '16:15', duration: '50 min', room: 'Main Hall', title: 'Panel: What We Owe the Next Grid', speaker: 'All six speakers', image: IMAGES.panel },
  { time: '17:00', duration: 'until 19:00', room: 'Main Hall', title: 'Closing ✳ Risograph Party', speaker: 'All speakers + guests', image: IMAGES.closing },
];

const SEED_SPEAKERS = [
  { name: 'Noor Ayvazian', role: 'Creative Director, Atlas Type Bureau', country: 'IST', photo: IMAGES.noor },
  { name: 'Teo Marchetti', role: 'Type Designer, Fonderia Nove', country: 'ITA', photo: IMAGES.teo },
  { name: 'Ada Okonkwo', role: 'Principal Designer, Field Notes Lab', country: 'NGA', photo: IMAGES.ada },
  { name: 'Halvard Sten', role: 'Designer & Educator, Bergen Kunst', country: 'NOR', photo: IMAGES.halvard },
  { name: 'Mira Lindqvist', role: 'Design Systems Lead, Northbound', country: 'FIN', photo: IMAGES.mira },
  { name: 'Kenji Aoyama', role: 'Motion Lead, Studio Hakone', country: 'JPN', photo: IMAGES.kenji },
];

export const SEATS = 240;

const ordered = (samples) => samples.map((row, order) => ({ ...row, order }));
const byOrder = (rows) => [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function useEventWebsite() {
  const [sessions, setSessions] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { Session, Speaker } = await loadSeeded({ Session: { samples: ordered(SEED_SESSIONS), key: 'title' }, Speaker: { samples: ordered(SEED_SPEAKERS), key: 'name' } });
      setSessions(byOrder(Session));
      setSpeakers(byOrder(Speaker));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  return {
    sessions,
    speakers,
    status,
    reload: load,
    // RSVPs are private to each guest (rls), so the duplicate check runs server-side; the page shows the capacity, not a live count.
    claimSeat: async (rsvp) => (await base44.functions.invoke('claimSeat', rsvp)).data,
  };
}
\`\`\`

## src/components/event-website/useLift.js
\`\`\`js
import { useEffect, useState } from 'react';
import { NARROW, useMedia } from './useMedia';

/** Which band is lifted: hovered on desktop; tapped below lg, until a second tap or a tap elsewhere. */
export function useLift() {
  const [lifted, setLifted] = useState(null);
  const tap = useMedia(NARROW);

  useEffect(() => {
    if (!tap) return undefined;
    const away = (e) => !e.target.closest?.('[data-band]') && setLifted(null);
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [tap]);

  const handlers = (id) => (tap
    ? { onClick: () => setLifted((cur) => (cur === id ? null : id)) }
    : { onMouseEnter: () => setLifted(id), onMouseLeave: () => setLifted((cur) => (cur === id ? null : cur)) });

  return { lifted, tap, handlers };
}
\`\`\`

## src/components/event-website/useMedia.js
\`\`\`js
import { useEffect, useState } from 'react';

// Matches the layout's breakpoints: tablet and phone below lg, phone below sm.
export const NARROW = '(max-width: 1023px)';
export const PHONE = '(max-width: 639px)';

export function useMedia(query) {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(query).matches));
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return undefined;
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
\`\`\`

## src/pages/EventWebsite.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import '@/components/event-website/event-website.css';
import Header from '@/components/event-website/Header';
import Hero from '@/components/event-website/Hero';
import Programme from '@/components/event-website/Programme';
import Speakers from '@/components/event-website/Speakers';
import Footer from '@/components/event-website/Footer';
import { glide } from '@/components/event-website/scroll';
import { useEventWebsite } from '@/components/event-website/useEventWebsite';

const NAV_MS = 1900;

export default function EventWebsite() {
  const site = useEventWebsite();
  const scroller = useRef(null);
  const [active, setActive] = useState(null);

  const navigate = (label, target) => {
    const page = scroller.current;
    const el = page.querySelector(\`#\${target}\`);
    setActive(label);
    // Lands with the marquee's last strip still showing below the sticky header, as the design does.
    const header = page.querySelector('header').offsetHeight;
    glide(page, Math.min(el.offsetTop - header - 27 * Math.max(1, page.clientWidth / 1280), page.scrollHeight - page.clientHeight), NAV_MS);
    setTimeout(() => setActive(null), NAV_MS);
  };

  return (
    <div ref={scroller} data-scroll className="pdd no-bar h-screen overflow-y-auto overflow-x-hidden">
      <Header active={active} onNavigate={navigate} />
      <Hero />
      <Programme sessions={site.sessions} status={site.status} onRetry={site.reload} />
      <Speakers speakers={site.speakers} status={site.status} onRetry={site.reload} />
      <Footer onClaim={site.claimSeat} />
    </div>
  );
}
\`\`\`
`;export{e as default};