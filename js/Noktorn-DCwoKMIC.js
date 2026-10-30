var e=`# product_landing_page — app files

## base44/entities/PreOrder.jsonc
\`\`\`json
{"name":"PreOrder","type":"object","properties":{"product_id":{"type":"string"},"product_name":{"type":"string"},"quantity":{"type":"integer","minimum":1,"default":1},"name":{"type":"string"},"email":{"type":"string","format":"email"},"total":{"type":"number"},"status":{"type":"string","enum":["pending","confirmed","cancelled"],"default":"pending"}},"required":["product_id","quantity","name","email","total"],"rls":{"create":{"$or":[{"data.status":"pending"},{"user_condition":{"role":"admin"}}]},"read":{"$or":[{"created_by_id":"{{user.id}}"},{"user_condition":{"role":"admin"}}]},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Product.jsonc
\`\`\`json
{"name":"Product","type":"object","properties":{"name":{"type":"string"},"colourway":{"type":"string","enum":["Rose","Mint","Sand"]},"price":{"type":"number"},"description":{"type":"string"},"image":{"type":"string"},"sort_order":{"type":"integer"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["name","colourway","price"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/SiteSetup.jsonc
\`\`\`json
{"name":"SiteSetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## src/components/noktorn/Details.jsx
\`\`\`jsx
import { useLayoutEffect, useRef, useState } from 'react';
import Img from './Img';
import { IMAGES } from './images';
import { pinProgress, reducedMotion } from './scroll';
import { useMobile } from './useMobile';

const SHOTS = [
  [IMAGES.detailCap, 'Clay cap over the rose shade, close up'],
  [IMAGES.detailMint, 'Mint shade edge over the rust base'],
  [IMAGES.detailNavy, 'Fluted navy base, close up'],
  [IMAGES.detailFourth, 'Mint shade pleats, close up'],
];

export default function Details({ sectionRef, view }) {
  const mobile = useMobile();
  const boxRef = useRef(null);
  const rowRef = useRef(null);
  const [path, setPath] = useState({ from: 0, to: 0 });
  // The row enters 160px right (scaled above 1280px) and stops with its last photo in full, as far from the right edge as the first starts from the left.
  useLayoutEffect(() => {
    if (mobile) return undefined;
    const measure = () => {
      const row = rowRef.current;
      const last = row.lastElementChild;
      const overflow = row.offsetLeft * 2 + (last ? last.offsetLeft + last.offsetWidth : 0) - boxRef.current.clientWidth;
      setPath({ from: 160 * Math.max(1, window.innerWidth / 1280), to: -Math.max(overflow, 0) });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mobile]);
  // Scroll-linked, no easing, across the pinned section. Phones swipe the row instead.
  const x = mobile || reducedMotion() ? 0 : path.from + (path.to - path.from) * pinProgress(sectionRef.current, view);
  return (
    <section ref={sectionRef} id="details" data-section="details" className="h-[200vh] bg-[var(--swatch-3)] max-[901px]:h-auto max-[901px]:pb-14 max-[901px]:pt-16">
      <div ref={boxRef} className="sticky top-0 h-screen overflow-hidden max-[901px]:static max-[901px]:h-auto">
        <h2 className="absolute left-[max(37px,2.890625vw)] top-[max(114px,8.90625vw)] text-[max(80px,6.25vw)] font-medium leading-none tracking-[-0.035em] text-[var(--swatch-1)] max-[901px]:static max-[901px]:whitespace-nowrap max-[901px]:px-5 max-[901px]:text-[36px]">Rose. Mint. Sand.</h2>
        <p className="absolute right-[max(37px,2.890625vw)] top-[max(130px,10.15625vw)] w-[max(280px,21.875vw)] text-[max(14px,1.09375vw)] leading-[1.5] tracking-[-0.01em] text-[var(--ui-muted)] max-[901px]:static max-[901px]:mt-4 max-[901px]:w-auto max-[901px]:px-5 max-[901px]:text-[16px]">
          Three colourways, one silhouette. Matte finishes throughout, so each lamp reads as one object from across the room.
        </p>
        <div ref={rowRef} className="absolute left-[max(37px,2.890625vw)] top-[max(293px,22.890625vw)] flex gap-[max(21px,1.640625vw)] max-[901px]:static max-[901px]:mt-8 max-[901px]:snap-x max-[901px]:snap-mandatory max-[901px]:gap-3 max-[901px]:overflow-x-auto max-[901px]:scroll-px-5 max-[901px]:px-5 max-[901px]:[scrollbar-width:none] max-[901px]:[&::-webkit-scrollbar]:hidden" style={{ transform: \`translateX(\${x}px)\` }}>
          {SHOTS.map(([src, alt]) => <Img key={alt} src={src} alt={alt} className="h-[max(373px,29.140625vw)] w-[max(413px,32.265625vw)] flex-none rounded-[max(7px,0.546875vw)] object-cover max-[901px]:h-[300px] max-[901px]:w-[280px] max-[901px]:snap-start max-[901px]:rounded-[8px]" />)}
        </div>
      </div>
    </section>
  );
}
\`\`\`

## src/components/noktorn/Exploded.jsx
\`\`\`jsx
import { useEffect } from 'react';
import Img from './Img';
import { IMAGES } from './images';
import { pinProgress, reducedMotion } from './scroll';
import { useMobile } from './useMobile';

const FEATURES = [
  ['01', 'Five parts. No tools.', 'Cap, shade, bulb, socket, base. Everything twists apart by hand.'],
  ['02', 'Standard E27 bulb.', 'Any warm-white bulb fits. Ours ships in the box, 2700K.'],
  ['03', 'Weighted base.', 'Fluted, cast and finished by hand so it sits still on a busy desk.'],
];
// Phones show one still of the sequence instead of the scroll-driven scene.
const MOBILE_FRAME = 53;

export default function Exploded({ sectionRef, view }) {
  const frames = IMAGES.explode;
  const mobile = useMobile();
  const p = reducedMotion() ? 1 : pinProgress(sectionRef.current, view);
  const frame = mobile ? MOBILE_FRAME : Math.round(p * (frames.length - 1));
  useEffect(() => { if (!mobile) frames.forEach((src) => { new Image().src = src; }); }, [frames, mobile]);

  // 200vh of scroll pinned to one screen plays the frame sequence; with a single still instead, drop the 200vh and the pin.
  return (
    <section ref={sectionRef} id="exploded" data-section="exploded" className="h-[200vh] bg-[var(--ui-ground)] max-[901px]:h-auto max-[901px]:px-5 max-[901px]:pb-14 max-[901px]:pt-16">
      <div className="sticky top-0 h-screen overflow-hidden max-[901px]:static max-[901px]:h-auto">
        <h2 className="absolute left-[max(37px,2.890625vw)] top-[max(84px,6.5625vw)] text-[max(51px,3.984375vw)] font-medium leading-none tracking-[-0.035em] max-[901px]:static max-[901px]:text-[40px]">Comes apart.<br />Stays together.</h2>
        <div aria-hidden="true" className="nk-mask absolute inset-y-0 left-1/2 w-[max(400px,31.25vw)] -translate-x-1/2 max-[901px]:static max-[901px]:mx-auto max-[901px]:mt-6 max-[901px]:w-full max-[901px]:max-w-[480px] max-[901px]:translate-x-0">
          <Img src={frames[frame] ?? ''} alt="The lamp coming apart" className="h-full w-full object-contain max-[901px]:h-auto" />
        </div>
        <p className="sr-only">As you scroll, the lamp separates into its five parts: cap, shade, bulb, socket and base.</p>
        <ol className="absolute right-[max(67px,5.234375vw)] top-[max(120px,9.375vw)] flex h-[max(513px,40.078125vw)] w-[max(293px,22.890625vw)] flex-col justify-between max-[901px]:static max-[901px]:mt-8 max-[901px]:h-auto max-[901px]:w-auto max-[901px]:justify-start max-[901px]:gap-7">
          {FEATURES.map(([n, title, body]) => (
            <li key={n} className="max-[901px]:grid max-[901px]:grid-cols-[36px_1fr]">
              <div className="nk-label text-[max(11px,0.859375vw)] text-[var(--swatch-1)] max-[901px]:row-span-2 max-[901px]:pt-[4px] max-[901px]:text-[14px]">{n}</div>
              <h3 className="mt-[max(9px,0.703125vw)] text-[max(20px,1.5625vw)] font-medium leading-none tracking-[-0.03em] max-[901px]:mt-0 max-[901px]:text-[21px]">{title}</h3>
              <p className="mt-[max(9px,0.703125vw)] text-[max(12.7px,0.9921875vw)] leading-[1.5] text-[var(--ui-muted)] max-[901px]:mt-2 max-[901px]:text-[16px]">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
\`\`\`

## src/components/noktorn/Footer.jsx
\`\`\`jsx
import Img from './Img';
import { IMAGES } from './images';

export default function Footer({ sectionRef, price, waiting, onPreOrder }) {
  return (
    <footer ref={sectionRef} data-section="footer" className="relative h-screen overflow-hidden bg-[var(--swatch-2)] text-[var(--ui-white)] max-[901px]:h-auto max-[901px]:min-h-[640px]">
      <Img src={IMAGES.footer} alt="Noktorn lamps in every colourway on studio plinths" className="absolute inset-0 h-full w-full object-cover object-bottom" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,20,18,.6)_0%,rgba(18,20,18,.35)_32%,rgba(18,20,18,.05)_55%,rgba(18,20,18,.4)_100%)]" />
      <div className="absolute inset-x-0 top-[max(76px,5.9375vw)] flex flex-col items-center max-[901px]:top-[72px] max-[901px]:px-5 max-[901px]:text-center">
        <h2 className="text-[max(56px,4.375vw)] font-medium leading-none tracking-[-0.04em] max-[901px]:text-[44px]">Upgrade your desk</h2>
        <p className="mt-[max(17px,1.328125vw)] text-[max(14.7px,1.1484375vw)] tracking-[-0.02em] max-[901px]:mt-4 max-[901px]:text-[16px]">Noktorn ships in November. Pre-orders open now.</p>
        <button type="button" onClick={onPreOrder} disabled={waiting} className="mt-[max(19px,1.484375vw)] disabled:cursor-wait disabled:opacity-60 h-[max(41px,3.203125vw)] w-[max(143px,11.171875vw)] rounded-[max(4px,0.3125vw)] bg-[var(--swatch-4)] text-[max(13.3px,1.0390625vw)] font-bold tracking-[-0.02em] text-[var(--swatch-4-ink)] hover:brightness-[.92] max-[901px]:mt-6 max-[901px]:h-12 max-[901px]:w-auto max-[901px]:px-7 max-[901px]:text-[16px] max-[901px]:font-medium">
          Pre-order - \${price}
        </button>
      </div>
      <div className="absolute bottom-[max(22px,1.71875vw)] left-[max(37px,2.890625vw)] text-[max(27px,2.109375vw)] font-bold leading-none tracking-[-0.035em] max-[901px]:bottom-[58px] max-[901px]:left-5 max-[901px]:text-[28px]">Noktorn</div>
      <div className="nk-label absolute bottom-[max(29px,2.265625vw)] right-[max(37px,2.890625vw)] text-[max(10.7px,0.8359375vw)] leading-none max-[901px]:bottom-[36px] max-[901px]:left-5 max-[901px]:right-auto max-[901px]:text-[12px]">© 2026 Noktorn Lighting AB · Malmö</div>
    </footer>
  );
}
\`\`\`

## src/components/noktorn/Hero.jsx
\`\`\`jsx
import Img from './Img';
import { IMAGES } from './images';

export default function Hero({ sectionRef }) {
  return (
    <section ref={sectionRef} data-section="hero" className="relative h-screen overflow-hidden bg-[var(--swatch-1)] max-[901px]:h-[100svh]">
      <h2 className="sr-only">Noktorn</h2>
      {/* The photo has wide margins: at 72vw the lamp spans ~38vw, as in the film, its base on the bottom edge behind the wordmark. Phones: 212% puts the lamp itself at ~112% of the width. */}
      <Img src={IMAGES.hero} alt="The Noktorn lamp: clay cap, rose shade, moss base"
        className="absolute left-1/2 top-[max(4.6875vw,calc(100%-51.57vw))] w-[max(919px,71.8vw)] max-w-none -translate-x-1/2 [filter:drop-shadow(0_40px_54px_rgba(0,0,0,.35))] max-[901px]:top-[292px] max-[901px]:h-auto max-[901px]:w-[212%] max-[901px]:max-w-none max-[901px]:[filter:drop-shadow(0_40px_50px_rgba(0,0,0,.35))]" />
      {/* In front of the lamp, as in the film: the lamp shows through the gaps between the letters. */}
      <svg aria-hidden="true" viewBox="0 0 1280 240" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[max(240px,18.75vw)] w-full max-[901px]:hidden">
        <text x="8" y="233" textLength="1267" lengthAdjust="spacingAndGlyphs" fontSize="318" fontWeight="500" fill="var(--ui-white)">NOKTORN</text>
      </svg>
      <svg aria-hidden="true" viewBox="0 0 350 144" preserveAspectRatio="none" className="absolute inset-x-5 top-[150px] hidden h-[144px] w-[calc(100%-40px)] max-[901px]:block">
        <text x="0" y="143" textLength="350" lengthAdjust="spacingAndGlyphs" fontSize="198" fontWeight="500" fill="var(--ui-white)">NOKTORN</text>
      </svg>
    </section>
  );
}
\`\`\`

## src/components/noktorn/images.js
\`\`\`js
// Every photo on the site; an empty one renders as a placeholder block of the same size.
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/product-landing-page';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

// One lamp, the same product in every shot (colourways aside): a cut-out on pure white, no horizon, floor or
// cast shadow. Only \`footer\` is a lit studio scene.
// gallery-one-subject: a gallery build makes every new photo from its first one, so the product stays the same.
export const IMAGES = {
  hero: photo('hero'),
  // The exploded sequence, in order; scroll picks the frame (Exploded.jsx pins its section for it).
  explode: Array.from({ length: 72 }, (_, i) => photo(\`explode-\${String(i + 1).padStart(3, '0')}\`)),
  detailCap: photo('detail-cap'),
  detailMint: photo('detail-mint'),
  detailNavy: photo('detail-navy'),
  detailFourth: photo('detail-pleats'),
  productRose: photo('product-rose'),
  productMint: photo('product-mint'),
  productSand: photo('product-sand'),
  footer: photo('footer'),
};
\`\`\`

## src/components/noktorn/Img.jsx
\`\`\`jsx
export default function Img({ src, alt, className = '', style }) {
  return src
    ? <img src={src} alt={alt} className={className} style={style} />
    : <div role="img" aria-label={alt} className={\`\${className} bg-[var(--ui-ph)]\`} style={style} />;
}
\`\`\`

## src/components/noktorn/Nav.jsx
\`\`\`jsx
import { useState } from 'react';
import NavMenu from './NavMenu';

const LINKS = [['Light', 'exploded'], ['Craft', 'details'], ['Pricing', 'pricing']];

export default function Nav({ onDark, onGo, waiting, onPreOrder }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className={\`sticky top-0 z-30 -mb-[max(59px,4.609375vw)] flex h-[max(59px,4.609375vw)] items-center justify-between px-[max(37px,2.890625vw)] max-[901px]:absolute max-[901px]:inset-x-0 max-[901px]:top-[60px] max-[901px]:mb-0 max-[901px]:h-[48px] max-[901px]:px-5 max-[901px]:text-[var(--ui-white)] \${onDark ? 'text-[var(--ui-white)]' : 'text-[var(--ui-ink)]'}\`}>
      <button type="button" onClick={() => onGo('hero')} className="text-[max(17.5px,1.3671875vw)] font-bold tracking-[-0.03em] max-[901px]:h-11 max-[901px]:text-[20px]">Noktorn</button>
      <nav className={\`absolute left-1/2 top-[max(17px,1.328125vw)] flex h-[max(33px,2.578125vw)] -translate-x-1/2 items-center gap-[max(22px,1.71875vw)] rounded-[max(5px,0.390625vw)] px-[max(17px,1.328125vw)] text-[max(13.3px,1.0390625vw)] tracking-[-0.01em] max-[901px]:hidden \${onDark ? 'bg-[var(--ui-pill-light)]' : 'bg-[var(--ui-pill-dark)]'}\`}>
        {LINKS.map(([label, id]) => <button key={id} type="button" onClick={() => onGo(id)}>{label}</button>)}
      </nav>
      <button type="button" onClick={onPreOrder} disabled={waiting} aria-busy={waiting} className="h-[max(33px,2.578125vw)] disabled:cursor-wait w-[max(111px,8.671875vw)] rounded-[max(4px,0.3125vw)] bg-[var(--swatch-1)] text-[max(12.3px,0.9609375vw)] font-bold tracking-[-0.025em] text-[var(--ui-white)] hover:brightness-[.92] max-[901px]:hidden">Pre-order now</button>
      <button type="button" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)} className="-mr-[11px] hidden h-11 w-11 flex-col items-center justify-center gap-[5px] max-[901px]:flex">
        {[0, 1, 2].map((i) => <span key={i} className="h-[2px] w-[22px] bg-current" />)}
      </button>
      {menu && <NavMenu links={LINKS} waiting={waiting} onGo={(id) => { setMenu(false); onGo(id); }} onPreOrder={() => { setMenu(false); onPreOrder(); }} onClose={() => setMenu(false)} />}
    </header>
  );
}
\`\`\`

## src/components/noktorn/NavMenu.jsx
\`\`\`jsx
import { useEffect } from 'react';

export default function NavMenu({ links, waiting, onGo, onPreOrder, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-40 flex flex-col bg-[var(--swatch-2)] px-5 pt-[60px] text-[var(--ui-white)]">
      <div className="flex h-[48px] items-center justify-between">
        <button type="button" onClick={() => onGo('hero')} className="h-11 text-[20px] font-bold tracking-[-0.03em]">Noktorn</button>
        <button type="button" aria-label="Close menu" onClick={onClose} className="relative -mr-[11px] h-11 w-11">
          <span className="absolute left-[11px] top-[21px] h-[2px] w-[22px] rotate-45 bg-current" />
          <span className="absolute left-[11px] top-[21px] h-[2px] w-[22px] -rotate-45 bg-current" />
        </button>
      </div>
      <nav className="mt-10 flex flex-col">
        {links.map(([label, id]) => (
          <button key={id} type="button" onClick={() => onGo(id)} className="h-16 text-left text-[40px] font-medium leading-none tracking-[-0.035em]">{label}</button>
        ))}
      </nav>
      <button type="button" onClick={onPreOrder} disabled={waiting} className="mt-8 h-12 disabled:opacity-60 rounded-[4px] bg-[var(--swatch-4)] text-[16px] font-medium tracking-[-0.02em] text-[var(--swatch-4-ink)]">Pre-order now</button>
    </div>
  );
}
\`\`\`

## src/components/noktorn/noktorn.css
\`\`\`css
@font-face{font-family:"Neue Haas Grotesk Display Pro";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-400-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk Display Pro";font-weight:500;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-500-normal.woff2) format("woff2")}
@font-face{font-family:"Neue Haas Grotesk Display Pro";font-weight:700;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/neue-haas-grotesk-700-normal.woff2) format("woff2")}
@font-face{font-family:"Univers LT Std";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/wix-fonts/univers-lt-std-400-normal.woff2) format("woff2")}

/* The look: accent (hero, headline, buttons), block (footer), surface (details), CTA (footer button), plus the UI colors. */
:root{
  --swatch-1:#1F4DE0;--swatch-1-ink:#FFFFFF;
  --swatch-2:#101826;--swatch-2-ink:#FFFFFF;
  --swatch-3:#EDEFF2;--swatch-3-ink:#111111;
  --swatch-4:#C7F03A;--swatch-4-ink:#111111;
  --ui-ink:#121412;--ui-white:#FFFFFF;--ui-ground:#F8F8F8;
  --ui-muted:rgba(18,20,18,.7);--ui-line:rgba(18,20,18,.1);--ui-ph:rgba(18,20,18,.08);
  --ui-pill-dark:rgba(18,20,18,.05);--ui-pill-light:rgba(255,255,255,.14);--ui-scrim:rgba(16,24,38,.5);
}
/* gallery-look */

.nk{font-family:"Neue Haas Grotesk Display Pro","Helvetica Neue",Helvetica,sans-serif;color:var(--ui-ink);background:var(--ui-white);-webkit-font-smoothing:antialiased}
.nk-label{font-family:"Univers LT Std","Helvetica Neue",sans-serif;text-transform:uppercase;letter-spacing:.16em}
.nk-mask{-webkit-mask-image:linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%);mask-image:linear-gradient(90deg,transparent 0%,black 12%,black 88%,transparent 100%)}
.nk :focus-visible{outline:2px solid var(--swatch-1);outline-offset:2px}
\`\`\`

## src/components/noktorn/PreOrderModal.jsx
\`\`\`jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const MAX = 5;
const field = 'mt-1.5 h-11 w-full rounded-[4px] border border-[var(--ui-line)] px-3 text-[15px] text-[var(--ui-ink)] outline-none focus:border-[var(--swatch-1)]';

export default function PreOrderModal({ products, initialId, onClose, onSubmit }) {
  const [productId, setProductId] = useState(initialId);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [failed, setFailed] = useState(false);
  const [emailLeft, setEmailLeft] = useState(false);
  const product = products.find((p) => p.id === productId) ?? products[0];
  const emailOk = /^\\S+@\\S+\\.\\S+$/.test(email.trim());
  const valid = product && name.trim() && emailOk;

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setFailed(false);
    try {
      setPlaced(await onSubmit({ product, quantity, name: name.trim(), email: email.trim() }));
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--ui-scrim)]" onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label="Pre-order Noktorn" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()} className="relative w-[460px] rounded-[10px] bg-[var(--ui-white)] p-7 max-[901px]:max-h-[calc(100svh-32px)] max-[901px]:max-w-[calc(100vw-32px)] max-[901px]:overflow-y-auto max-[901px]:p-5">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-[var(--ui-muted)] hover:text-[var(--ui-ink)]"><X size={20} /></button>
        {placed ? (
          <>
            <h3 className="pr-10 text-[28px] font-medium tracking-[-0.03em]">You’re on the list.</h3>
            <p className="mt-3 text-[15px] leading-[1.5] text-[var(--ui-muted)]">
              {placed.quantity} × {placed.product_name}, \${placed.total}. We’ll email {placed.email} when it ships in November.
            </p>
            <button type="button" onClick={onClose} className="mt-6 h-11 w-full rounded-[4px] bg-[var(--ui-ink)] text-[14px] font-bold text-[var(--ui-white)]">Done</button>
          </>
        ) : (
          <form onSubmit={submit}>
            <h3 className="pr-10 text-[28px] font-medium tracking-[-0.03em]">Pre-order Noktorn</h3>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {products.map((p) => (
                <button key={p.id} type="button" aria-pressed={p.id === product?.id} onClick={() => setProductId(p.id)}
                  className={\`rounded-[4px] border px-3 py-2.5 text-left text-[14px] font-medium \${p.id === product?.id ? 'border-[var(--swatch-1)] text-[var(--swatch-1)]' : 'border-[var(--ui-line)]'}\`}>
                  {p.colourway}<span className="block text-[13px] font-normal text-[var(--ui-muted)]">\${p.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-[14px]">
              <span className="text-[var(--ui-muted)]">Quantity</span>
              <span className="flex items-center gap-3 font-medium">
                <button type="button" aria-label="One fewer" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded-[4px] border border-[var(--ui-line)] disabled:opacity-40 max-[901px]:h-11 max-[901px]:w-11">−</button>
                {quantity}
                <button type="button" aria-label="One more" disabled={quantity >= MAX} onClick={() => setQuantity((q) => Math.min(MAX, q + 1))} className="h-8 w-8 rounded-[4px] border border-[var(--ui-line)] disabled:opacity-40 max-[901px]:h-11 max-[901px]:w-11">+</button>
              </span>
            </div>
            {quantity >= MAX && <p role="status" className="mt-2 text-right text-[13px] text-[var(--ui-muted)]">Up to {MAX} per pre-order.</p>}
            <label className="mt-4 block text-[13px] text-[var(--ui-muted)]">Name<input value={name} onChange={(e) => setName(e.target.value)} className={field} /></label>
            <label className="mt-3 block text-[13px] text-[var(--ui-muted)]">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setEmailLeft(true)} aria-invalid={emailLeft && !emailOk} className={field} /></label>
            {emailLeft && email.trim() && !emailOk && <p role="alert" className="mt-1.5 text-[13px] text-[var(--swatch-1)]">Enter a valid email, like name@example.com.</p>}
            {failed && <p role="alert" className="mt-4 text-[13px] text-[var(--swatch-1)]">Couldn’t place the pre-order. Please try again.</p>}
            <button type="submit" disabled={!valid || saving} className="mt-6 h-11 w-full rounded-[4px] bg-[var(--swatch-1)] text-[14px] font-bold text-[var(--ui-white)] disabled:opacity-40">
              Place pre-order{product ? \` - $\${product.price * quantity}\` : ''}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
\`\`\`

## src/components/noktorn/Pricing.jsx
\`\`\`jsx
import Img from './Img';

export default function Pricing({ sectionRef, products, status, onRetry, onPreOrder }) {
  const note = status === 'loading' ? 'Loading colourways…' : status === 'error' ? 'We couldn’t load the colourways.' : !products.length && 'Pre-orders open soon.';
  return (
    <section ref={sectionRef} id="pricing" data-section="pricing" className="relative h-screen bg-[var(--ui-white)] max-[901px]:h-auto max-[901px]:px-5 max-[901px]:pb-14 max-[901px]:pt-16">
      <h2 className="absolute left-[max(37px,2.890625vw)] top-[max(76px,5.9375vw)] text-[max(43px,3.359375vw)] font-medium leading-none tracking-[-0.035em] max-[901px]:static max-[901px]:text-[36px]">Choose your Noktorn</h2>
      {note && (
        <div role={status === 'error' ? 'alert' : 'status'} className="absolute inset-x-[max(37px,2.890625vw)] top-[max(200px,15.625vw)] flex items-center gap-[max(16px,1.25vw)] text-[max(16px,1.25vw)] text-[var(--ui-muted)] max-[901px]:static max-[901px]:mt-8 max-[901px]:flex-col max-[901px]:items-start max-[901px]:text-[16px]">
          {note}
          {status === 'error' && (
            <button type="button" onClick={onRetry} className="h-[max(41px,3.203125vw)] rounded-[max(4px,0.3125vw)] bg-[var(--ui-ink)] px-[max(20px,1.5625vw)] text-[max(13.3px,1.0390625vw)] font-bold text-[var(--ui-white)] max-[901px]:h-12 max-[901px]:text-[16px]">Try again</button>
          )}
        </div>
      )}
      <div className="absolute inset-x-[max(37px,2.890625vw)] top-[max(200px,15.625vw)] grid grid-cols-3 gap-[max(27px,2.109375vw)] max-[901px]:static max-[901px]:mt-8 max-[901px]:grid-cols-1 max-[901px]:gap-4">
        {products.map((p, i) => (
          <article key={p.id} className="relative h-[max(440px,34.375vw)] rounded-[max(8px,0.625vw)] border border-[var(--ui-line)] bg-[var(--ui-white)] px-[max(23px,1.796875vw)] pt-[max(22px,1.71875vw)] max-[901px]:h-auto max-[901px]:rounded-[12px] max-[901px]:p-[18px]">
            <div className="h-[max(253px,19.765625vw)] overflow-hidden rounded-[max(4px,0.3125vw)] max-[901px]:h-[220px]">
              <Img src={p.image} alt={p.name} className="h-full w-full scale-[1.08] object-contain" />
            </div>
            <div className="mt-[max(44px,3.4375vw)] flex items-baseline justify-between text-[max(20px,1.5625vw)] font-medium leading-none tracking-[-0.03em] max-[901px]:mt-5 max-[901px]:text-[22px]">
              <h3>{p.name}</h3><span>\${p.price}</span>
            </div>
            <p className="mt-[max(9px,0.703125vw)] text-[max(12.7px,0.9921875vw)] tracking-[-0.01em] text-[var(--ui-muted)] max-[901px]:mt-2 max-[901px]:text-[15px]">{p.description}</p>
            <button type="button" onClick={() => onPreOrder(p.id)}
              className={\`absolute bottom-[max(23px,1.796875vw)] left-[max(23px,1.796875vw)] h-[max(41px,3.203125vw)] w-[max(99px,7.734375vw)] rounded-[max(4px,0.3125vw)] text-[max(13.3px,1.0390625vw)] font-bold tracking-[-0.02em] text-[var(--ui-white)] hover:brightness-[.92] max-[901px]:static max-[901px]:mt-5 max-[901px]:h-12 max-[901px]:w-full max-[901px]:text-[16px] max-[901px]:font-medium \${i === 0 ? 'bg-[var(--swatch-1)]' : 'bg-[var(--ui-ink)]'}\`}>
              Pre-order
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
\`\`\`

## src/components/noktorn/scroll.js
\`\`\`js
const clamp = (v) => Math.min(Math.max(v, 0), 1);

/** How far the page has scrolled through a pinned (taller than the viewport) section, 0 to 1. */
export const pinProgress = (el, { top, height }) =>
  el ? clamp((top - el.offsetTop) / Math.max(el.offsetHeight - height, 1)) : 0;

export const reducedMotion = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
\`\`\`

## src/components/noktorn/seed.js
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

## src/components/noktorn/useMobile.js
\`\`\`js
import { useEffect, useState } from 'react';

const QUERY = '(max-width: 900px)';

/** Phones and small tablets: sections flow naturally, with no scroll-linked scenes. */
export function useMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && Boolean(window.matchMedia?.(QUERY).matches));
  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return undefined;
    const on = () => setMobile(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return mobile;
}
\`\`\`

## src/components/noktorn/useNoktorn.js
\`\`\`js
import { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from './images';
import { loadSeeded } from './seed';

const SEED = [
  { name: 'Noktorn Rose', colourway: 'Rose', price: 340, description: 'Clay cap, rose shade, moss base.', image: IMAGES.productRose, sort_order: 1 },
  { name: 'Noktorn Mint', colourway: 'Mint', price: 340, description: 'Indigo cap, mint shade, rust base.', image: IMAGES.productMint, sort_order: 2 },
  { name: 'Noktorn Sand', colourway: 'Sand', price: 380, description: 'Copper cap, sand shade, navy base.', image: IMAGES.productSand, sort_order: 3 },
];

export function useNoktorn() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { Product } = await loadSeeded({ Product: { samples: SEED, key: 'name', sort: 'sort_order' } });
      setProducts([...Product].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  return {
    products,
    status,
    reload: load,
    preOrder: ({ product, quantity, name, email }) => base44.entities.PreOrder.create({
      product_id: product.id,
      product_name: product.name,
      quantity,
      name,
      email,
      total: product.price * quantity,
      status: 'pending',
    }),
  };
}
\`\`\`

## src/pages/Noktorn.jsx
\`\`\`jsx
import { useEffect, useRef, useState } from 'react';
import '@/components/noktorn/noktorn.css';
import Nav from '@/components/noktorn/Nav';
import Hero from '@/components/noktorn/Hero';
import Exploded from '@/components/noktorn/Exploded';
import Details from '@/components/noktorn/Details';
import Pricing from '@/components/noktorn/Pricing';
import Footer from '@/components/noktorn/Footer';
import PreOrderModal from '@/components/noktorn/PreOrderModal';
import { useNoktorn } from '@/components/noktorn/useNoktorn';

export default function Noktorn() {
  const { products, status, reload, preOrder } = useNoktorn();
  const scrollRef = useRef(null);
  const hero = useRef(null);
  const exploded = useRef(null);
  const details = useRef(null);
  const pricing = useRef(null);
  const footer = useRef(null);
  const sections = { hero, exploded, details, pricing, footer };
  const [view, setView] = useState(() => ({ top: 0, height: typeof window === 'undefined' ? 720 : window.innerHeight }));
  const [ordering, setOrdering] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOrdering(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (id) => scrollRef.current.scrollTo({ top: sections[id].current.offsetTop, behavior: 'smooth' });
  // Until the colourways load there is nothing to pre-order; if they failed, Pricing shows why and a retry.
  const open = (id) => {
    if (status === 'error') go('pricing');
    else if (products.length) setOrdering(id ?? products[0].id);
  };
  const waiting = status === 'loading' || (status === 'ready' && !products.length);
  // White nav over the hero and the footer photo, ink over the light sections.
  const onDark = view.top < (hero.current?.offsetHeight ?? view.height) - 30 || view.top + 30 >= (footer.current?.offsetTop ?? Infinity);

  return (
    <div ref={scrollRef} data-scroll onScroll={(e) => setView({ top: e.currentTarget.scrollTop, height: e.currentTarget.clientHeight })}
      className="nk relative h-screen overflow-y-auto overflow-x-hidden">
      <Nav onDark={onDark} onGo={go} waiting={waiting} onPreOrder={() => open()} />
      <h1 className="sr-only">Noktorn desk lamp</h1>
      <main>
        <Hero sectionRef={hero} />
        <Exploded sectionRef={exploded} view={view} />
        <Details sectionRef={details} view={view} />
        <Pricing sectionRef={pricing} products={products} status={status} onRetry={reload} onPreOrder={open} />
      </main>
      <Footer sectionRef={footer} price={products[0]?.price ?? 340} waiting={waiting} onPreOrder={() => open()} />
      {ordering && <PreOrderModal products={products} initialId={ordering} onClose={() => setOrdering(null)} onSubmit={preOrder} />}
    </div>
  );
}
\`\`\`
`;export{e as default};