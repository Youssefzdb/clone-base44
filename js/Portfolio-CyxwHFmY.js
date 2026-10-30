var e=`# personal_portfolio — app files

## base44/entities/Discipline.jsonc
\`\`\`json
{"name":"Discipline","type":"object","properties":{"title":{"type":"string","description":"An area of work, shown as a numbered panel"},"items":{"type":"array","items":{"type":"string"},"description":"What the area covers, one short line each"},"order":{"type":"number"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["title","order"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/Project.jsonc
\`\`\`json
{"name":"Project","type":"object","properties":{"title":{"type":"string"},"tag":{"type":"string"},"year":{"type":"string"},"client":{"type":"string"},"role":{"type":"string"},"description":{"type":"string","description":"Case study; paragraphs separated by a blank line"},"cover":{"type":"string","description":"Image URL"},"images":{"type":"array","items":{"type":"string"},"description":"Image URLs for the case-study sequence"},"order":{"type":"number"},"fit":{"type":"string","enum":["cover","contain"],"default":"cover"},"matte":{"type":"string","description":"CSS colour behind a contain-fit image"},"ratio":{"type":"number","default":1,"description":"Grid image width / height"},"sample":{"type":"boolean","description":"A sample row the app added on its first load"}},"required":["title","tag","order"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## base44/entities/SiteSetup.jsonc
\`\`\`json
{"name":"SiteSetup","type":"object","properties":{"set_up":{"type":"boolean","default":true}},"required":["set_up"],"rls":{"read":{},"create":{"user_condition":{"role":"admin"}},"update":{"user_condition":{"role":"admin"}},"delete":{"user_condition":{"role":"admin"}}}}
\`\`\`

## src/components/portfolio/About.jsx
\`\`\`jsx
import Img from './Img';
import Reveal from './Reveal';
import { IMAGES } from './images';

export default function About() {
  return (
    <section data-section="about" className="relative h-screen overflow-hidden max-md:h-auto max-md:pb-[56px]">
      <Reveal className="mx-[29px] max-w-[724px] pt-[100px] max-md:pt-[64px]">
        <p className="pf-serif text-[clamp(32px,3.9vw,75px)] leading-[1.15]">
          I keep deleting until only the load-bearing parts are left. What survives is usually the&nbsp;design.
        </p>
      </Reveal>
      <Img src={IMAGES.portrait} alt="Anna Greenway, seen from behind, holding a white anthurium" className="absolute bottom-0 left-[29px] h-[287px] w-[293px] object-cover grayscale max-md:static max-md:ml-[29px] max-md:mt-[48px] max-md:max-w-[calc(100%-58px)]" />
      <p className="pf-label absolute bottom-[37px] right-[29px] w-[360px] max-w-[45%] text-[16px] leading-[20px] text-[var(--pf-muted)] max-md:static max-md:mx-[29px] max-md:mt-[28px] max-md:w-auto max-md:max-w-none xl:left-[783px] xl:right-auto xl:max-w-none">
        Selected clients — ONYX, MILLI-<wbr />0615, SQUEEZD, KINTO, VEXTA, ST. LAB
      </p>
    </section>
  );
}
\`\`\`

## src/components/portfolio/ChapterMarks.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { SINE } from './scroll';

const MARKS = [{ id: 'I', top: 240 }, { id: 'II', top: 240 }, { id: 'III', top: 467, dark: true }];

export default function ChapterMarks({ chapter }) {
  return MARKS.map(({ id, top, dark }) => (
    <motion.span key={id} aria-hidden="true" initial={false} animate={{ opacity: chapter === id ? 1 : 0, y: chapter === id ? 0 : 23 }} transition={{ duration: 0.6, ease: SINE }} style={{ top }}
      className={\`pf-vert pf-serif pointer-events-none absolute right-[19px] z-40 hidden text-[24px] uppercase leading-none lg:block \${dark ? 'text-[var(--pf-bone)]' : 'text-[var(--pf-body)]'}\`}>
      Chapter {id}
    </motion.span>
  ));
}
\`\`\`

## src/components/portfolio/Contact.jsx
\`\`\`jsx
const LINKS = [['Instagram', 'https://instagram.com'], ['Behance', 'https://behance.net'], ['LinkedIn', 'https://linkedin.com']];

export default function Contact() {
  return (
    <section data-section="contact" data-tone="dark" className="relative flex h-screen flex-col bg-[var(--pf-ink)] px-[29px] pt-[97px] text-[var(--pf-bone)] max-md:h-auto max-md:min-h-screen max-md:pb-[64px] max-md:pt-[72px]">
      <h2 className="pf-display text-[13vw] text-[var(--pf-soft)] max-md:text-[21vw]">Nice to<br />meet you</h2>
      <nav className="absolute right-[60px] top-[104px] flex gap-[27px] text-[18px] leading-[27px] text-[var(--pf-soft)] max-md:static max-md:mt-[40px] max-md:gap-[16px]">
        {LINKS.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" className="hover:text-[var(--pf-bone)] max-md:-my-[9px] max-md:py-[9px]">{label}</a>)}
      </nav>
      <div className="absolute bottom-[74px] left-[29px] max-md:static max-md:mt-auto max-md:pt-[96px]">
        <p className="pf-label text-[16px] leading-[24px] text-[var(--pf-soft)]">Contact to</p>
        <a href="mailto:hello@annagreenway.studio" className="mt-[10px] block w-fit border-b border-[var(--pf-soft)] text-[26.5px] leading-[1.3] max-md:text-[22px]">hello@annagreenway.studio</a>
      </div>
    </section>
  );
}
\`\`\`

## src/components/portfolio/Disciplines.jsx
\`\`\`jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { QUART, clamp, reducedMotion, useScrollRoot, useWide } from './scroll';

function Panel({ n, title, items, open, lit, onEnquire }) {
  return (
    <article className="relative w-full flex-none overflow-hidden border-b border-[var(--pf-divider)] px-[37px] pb-[60px] pt-[100px] max-md:px-[29px] max-md:pb-[56px] max-md:pt-[64px] md:h-full md:w-[480px] md:border-b-0 md:border-r md:pb-0">
      <motion.div initial={false} animate={{ scaleY: lit ? 1 : 0 }} transition={{ duration: 0.7, ease: QUART }} className="absolute inset-0 origin-bottom bg-[var(--pf-bone)]" />
      <div className={\`relative transition-colors duration-500 \${lit ? 'text-[var(--pf-body)]' : ''}\`}>
        <div className={\`pf-display text-[87px] max-md:text-[72px] transition-colors duration-500 \${lit ? '' : 'text-[var(--pf-soft)]'}\`}>{n}</div>
        <motion.div initial={false} animate={{ width: lit ? '100%' : 73 }} transition={{ duration: 0.8, ease: QUART }} className="mt-[79px] h-px bg-current opacity-30 max-md:mt-[40px]" />
        <h3 className="pf-serif mt-[26px] whitespace-nowrap text-[42.5px] uppercase leading-none max-md:whitespace-normal max-md:text-[36px]">{title}</h3>
        <ul className="mt-[95px] text-[21.5px] leading-[42px] max-md:mt-[36px] max-md:text-[19px] max-md:leading-[36px]">
          {items.map((item, i) => (
            <motion.li key={item} initial={false} animate={{ opacity: open ? 1 : 0, y: open ? 0 : 12 }} transition={{ delay: open ? 0.25 + i * 0.09 : 0, duration: 0.5, ease: QUART }}>{item}</motion.li>
          ))}
        </ul>
        <motion.button type="button" onClick={onEnquire} tabIndex={open ? 0 : -1} initial={false} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: open ? 0.5 : 0 }}
          className={\`pf-label mt-[51px] inline-block text-[17.5px] max-md:mt-[22px] max-md:py-[10px] \${open ? '' : 'pointer-events-none'}\`}>Enquire ↗</motion.button>
      </div>
    </article>
  );
}

// One numbered panel per Discipline row: the areas of work, whatever the practice.
export default function Disciplines({ disciplines, onGo }) {
  const root = useScrollRoot();
  const ref = useRef(null);
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const wide = useWide();
  const pinned = wide && !reducedMotion() && disciplines.length > 0;
  const [travel, setTravel] = useState(0);
  const [active, setActive] = useState(-1);
  const x = useMotionValue(0);
  const bar = useMotionValue(0);

  useLayoutEffect(() => {
    if (!pinned) return undefined;
    const measure = () => setTravel(Math.max(trackRef.current.scrollWidth - viewRef.current.clientWidth, 0));
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [pinned, disciplines]);

  // Vertical scroll through the pinned section moves the panels sideways; the panel at the reading position lights up.
  useEffect(() => {
    if (!pinned) { x.set(0); return undefined; }
    const el = root.current;
    const update = () => {
      const box = el.getBoundingClientRect();
      const r = ref.current.getBoundingClientRect();
      const p = clamp((box.top - r.top) / Math.max(r.height - box.height, 1));
      x.set(-p * travel);
      bar.set(p * travel);
      const mid = box.top + box.height / 2;
      setActive(r.top <= mid && r.bottom > mid ? Math.min(Math.floor(p * disciplines.length), disciplines.length - 1) : -1);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [pinned, travel, root, x, bar, disciplines.length]);

  if (!disciplines.length) return null;
  return (
    <section ref={ref} data-section="disciplines" data-tone="dark" data-chapter="III" style={pinned ? { height: \`calc(100vh + \${travel}px)\` } : undefined} className="bg-[var(--pf-ink)] text-[var(--pf-bone)]">
      <div ref={viewRef} className={pinned ? 'sticky top-0 h-screen overflow-hidden' : ''}>
        <motion.div ref={trackRef} style={{ x }} className="flex h-full flex-col md:flex-row">
          {disciplines.map((d, i) => (
            <Panel key={d.id} n={String(i + 1).padStart(2, '0')} title={d.title} items={d.items ?? []} open={!pinned || travel === 0 || active === i} lit={pinned && active === i} onEnquire={() => onGo('contact')} />
          ))}
        </motion.div>
        {pinned && (
          <>
            <motion.div style={{ width: bar }} className="absolute bottom-[40px] left-[37px] h-px bg-[var(--pf-bone)]" />
            <span className="pf-label absolute bottom-[64px] right-[60px] text-[15px] leading-none">Scroll →</span>
          </>
        )}
      </div>
    </section>
  );
}
\`\`\`

## src/components/portfolio/Hero.jsx
\`\`\`jsx
import { motion, useScroll, useTransform } from 'framer-motion';
import Img from './Img';
import { IMAGES } from './images';
import { reducedMotion, useScrollRoot, useWide } from './scroll';

// Five project covers, then the About portrait in colour.
const FRAMES = [
  { src: IMAGES.onyx, alt: 'Onyx Coffee Lab loyalty card' },
  { src: IMAGES.squeezd, alt: 'Squeezd tote full of vegetables' },
  { src: IMAGES.blueShift, alt: 'Reading The Blue Shift' },
  { src: IMAGES.kinto, alt: 'Kinto Matcha menu' },
  { src: IMAGES.vexta, alt: 'Vexta speaker poster' },
  { src: IMAGES.portrait, alt: 'Portrait with an anthurium' },
];

export default function Hero({ onGo }) {
  const { scrollY } = useScroll({ container: useScrollRoot() });
  const wide = useWide();
  const still = reducedMotion() || !wide;
  const introY = useTransform(scrollY, (v) => (still ? 0 : v * 0.08));
  const imageY = useTransform(scrollY, (v) => (still ? 0 : v * -0.16));
  const navOpacity = useTransform(scrollY, [0, 180], [1, 0]);
  const delay = (i) => ({ animationDelay: \`\${i * 0.4}s\`, animationFillMode: i === FRAMES.length - 1 ? 'forwards' : undefined });

  return (
    <section data-section="hero" className="relative z-10 h-screen pl-[32px] pr-[37px] pt-[34px] max-md:h-auto max-md:px-[29px] max-md:pb-[56px] max-md:pt-[20px]">
      <motion.nav style={{ opacity: navOpacity }} className="flex justify-between text-[18px] leading-[27px] lg:grid lg:grid-cols-[513px_1fr_auto]">
        <span>Anna Greenway</span>
        <span className="hidden lg:block">Brand &amp; Art Direction</span>
        <span className="flex gap-[24px] max-md:gap-[8px]">
          <button type="button" onClick={() => onGo('work')} className="max-md:-my-[9px] max-md:px-[8px] max-md:py-[9px]">Work</button>
          <button type="button" onClick={() => onGo('about')} className="max-md:-my-[9px] max-md:-mr-[8px] max-md:px-[8px] max-md:py-[9px]">About</button>
        </span>
      </motion.nav>
      <motion.p style={{ y: introY }} className="mt-[38px] text-[clamp(28px,4.25vw,82px)] leading-[1.12] tracking-[-0.025em]">
        Anna is a designer and art director building brands for people who make things. Based in Lisbon, working wherever the work is.
      </motion.p>
      <motion.div style={{ y: imageY }} className="relative mt-[70px] h-[60vh] overflow-hidden max-md:mt-[40px] max-md:h-auto max-md:aspect-[4/5]">
        {FRAMES.map(({ src, alt }, i) => (
          <Img key={alt} src={src} alt={alt} className="pf-cycle absolute inset-0 h-full w-full object-cover" style={delay(i)} />
        ))}
        <div className="absolute bottom-[17px] right-[19px] flex gap-[7px]" aria-hidden="true">
          {FRAMES.map(({ alt }, i) => (
            <span key={alt} className="relative h-[2px] w-[17px] bg-[var(--pf-dash)]">
              <span className="pf-cycle absolute inset-0 bg-[var(--pf-bone)]" style={delay(i)} />
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
\`\`\`

## src/components/portfolio/images.js
\`\`\`js
// Every photo on the site (an empty URL renders as a placeholder block of the same size).
const PHOTOS = 'https://media.base44.com/images/public/builder-assets/gallery/personal-portfolio';
const photo = (file) => \`\${PHOTOS}/\${file}.webp\`;

export const IMAGES = {
  onyx: photo('onyx-card'),
  blueShift: photo('blue-shift-mag'),
  squeezd: photo('squeezd-tote'),
  kinto: photo('kinto-menu'),
  vexta: photo('vexta-poster'),
  stLab: photo('st-lab-tee'),
  // Hero's sixth frame, and the About portrait (shown greyscale).
  portrait: photo('gallery'),
  // Case-study sequences, shown full width then half width, each in its own shape.
  onyxDetail1: photo('onyx-basket'),
  onyxDetail2: photo('onyx-cans'),
  onyxDetail3: photo('onyx-bag'),
  blueShiftDetail1: photo('blue-shift-stack'),
  blueShiftDetail2: photo('blue-shift-spread'),
  squeezdDetail1: photo('squeezd-picnic'),
  squeezdDetail2: photo('squeezd-net'),
  kintoDetail1: photo('kinto-cafe'),
  kintoDetail2: photo('kinto-set'),
  vextaDetail1: photo('vexta-floor'),
  vextaDetail2: photo('vexta-badge'),
  vextaDetail3: photo('vexta-stage'),
  stLabDetail1: photo('st-lab-rack'),
  stLabDetail2: photo('st-lab-back'),
};
\`\`\`

## src/components/portfolio/Img.jsx
\`\`\`jsx
export default function Img({ src, alt, className = '', style }) {
  return src
    ? <img src={src} alt={alt} loading="lazy" className={className} style={style} />
    : <span role="img" aria-label={alt} className={\`block \${className} bg-[var(--pf-ph)]\`} style={style} />;
}
\`\`\`

## src/components/portfolio/MenuOverlay.jsx
\`\`\`jsx
import { motion } from 'framer-motion';
import { QUART } from './scroll';

const ITEMS = [['Work', 'work'], ['About', 'about'], ['Disciplines', 'disciplines'], ['Contact', 'contact']];

export default function MenuOverlay({ onGo, disciplines }) {
  // Disciplines renders nothing without rows, so its entry would scroll nowhere.
  const items = disciplines ? ITEMS : ITEMS.filter(([, id]) => id !== 'disciplines');
  return (
    <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      className="absolute inset-0 z-40 flex flex-col justify-center gap-[6px] bg-[var(--pf-ink)] px-[29px] text-[var(--pf-bone)] lg:left-[64px]">
      {items.map(([label, id], i) => (
        <motion.button key={id} type="button" onClick={() => onGo(id)} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.7, ease: QUART }}
          className="pf-display w-fit text-left text-[clamp(56px,9.5vw,180px)] hover:italic">
          {label}
        </motion.button>
      ))}
    </motion.nav>
  );
}
\`\`\`

## src/components/portfolio/portfolio.css
\`\`\`css
@font-face{font-family:"Instrument Serif";font-style:normal;font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-serif-400-normal.woff2) format("woff2")}
@font-face{font-family:"Instrument Serif";font-style:italic;font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-serif-400-italic.woff2) format("woff2")}
@font-face{font-family:"Inter";font-style:normal;font-weight:400;font-display:swap;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/inter-variable-normal.woff2) format("woff2")}

/* The look: paper, ground (light sections), ink (dark sections, rail, rules) and accent swatches, plus the type colours. */
:root{
  --swatch-1:#F7F2EA;--swatch-1-ink:#111111;
  --swatch-2:#EDE3D3;--swatch-2-ink:#111111;
  --swatch-3:#4A1F1C;--swatch-3-ink:#FFFFFF;
  --swatch-4:#8A3A2B;--swatch-4-ink:#FFFFFF;
  --pf-paper:var(--swatch-1);--pf-ground:var(--swatch-2);--pf-ink:var(--swatch-3);--pf-accent:var(--swatch-4);
  --pf-body:#2A1311;--pf-muted:#695F56;--pf-bone:#F1E8DC;--pf-mat:#000000;
  --pf-rule:color-mix(in srgb,var(--pf-ink) 16%,transparent);
  --pf-wash:color-mix(in srgb,var(--pf-ground) 80%,transparent);
  --pf-ph:color-mix(in srgb,var(--pf-ink) 14%,var(--pf-ground));
  --pf-soft:color-mix(in srgb,var(--pf-bone) 75%,transparent);
  --pf-dash:color-mix(in srgb,var(--pf-bone) 42%,transparent);
  --pf-divider:color-mix(in srgb,var(--pf-bone) 12%,transparent);
}
/* gallery-look */

.pf{font-family:"Inter",system-ui,-apple-system,"Helvetica Neue",sans-serif;font-weight:400;color:var(--pf-body);background:var(--pf-ground);-webkit-font-smoothing:antialiased}
.pf-serif{font-family:"Instrument Serif",Georgia,serif;font-weight:400}
.pf-display{font-family:"Instrument Serif",Georgia,serif;font-weight:400;line-height:.85;letter-spacing:-.01em;text-transform:uppercase}
.pf-label{text-transform:uppercase;letter-spacing:.14em}
.pf-vert{writing-mode:vertical-rl}
.pf-scroll{scrollbar-width:none}
.pf-scroll::-webkit-scrollbar{display:none}
.pf :focus-visible{outline:2px solid currentColor;outline-offset:3px}
.pf ::selection{background:var(--pf-accent);color:var(--pf-bone)}

/* The hero shows each frame for 0.4s, once, then holds the last (the portrait), as the film does. */
@keyframes pf-cycle{from,to{opacity:1}}
.pf-cycle{opacity:0;animation:pf-cycle .4s step-end}
@media (prefers-reduced-motion:reduce){.pf-cycle{animation:none;opacity:0}.pf-cycle:first-child{opacity:1}}
\`\`\`

## src/components/portfolio/ProjectCard.jsx
\`\`\`jsx
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Img from './Img';
import { QUART, SINE, reducedMotion, useScrollRoot, useWide } from './scroll';

export default function ProjectCard({ project, active, onActive, onOpen, style }) {
  const ref = useRef(null);
  const root = useScrollRoot();
  const still = reducedMotion();
  const wide = useWide();
  const shown = useInView(ref, { root, once: true, amount: 0.12 }) || still;
  const { scrollYProgress } = useScroll({ container: root, target: ref, offset: ['start end', 'end start'] });
  const contain = project.fit === 'contain';
  const scale = useTransform(scrollYProgress, [0, 1], still || contain || !wide ? [1, 1] : [1, 1.08]);
  const ease = { duration: 0.45, ease: SINE };

  return (
    <button ref={ref} type="button" data-card style={style} onClick={onOpen}
      onMouseEnter={() => onActive(true)} onMouseLeave={() => onActive(false)} onFocus={() => onActive(true)} onBlur={() => onActive(false)}
      className="block w-full text-left">
      <span className="relative block overflow-hidden" style={{ aspectRatio: project.ratio || 1, background: contain ? project.matte || 'var(--pf-mat)' : undefined }}>
        <motion.span initial={false} animate={{ y: shown ? '0%' : '100%' }} transition={{ duration: 0.75, ease: QUART }} className="absolute inset-0 block">
          <motion.span style={{ scale }} className="block h-full w-full">
            <Img src={project.cover} alt={\`\${project.title} — \${project.tag}\`} className={\`h-full w-full \${contain ? 'object-contain' : 'object-cover'}\`} />
          </motion.span>
        </motion.span>
        <motion.span initial={false} animate={{ opacity: active ? 1 : 0 }} transition={ease} className="absolute inset-0 flex items-center justify-center bg-[var(--pf-wash)]">
          <motion.span initial={false} animate={{ y: active ? 0 : 28 }} transition={{ duration: 0.6, ease: QUART }} className="pf-serif text-[43px] italic text-[var(--pf-body)]">View project</motion.span>
        </motion.span>
      </span>
      <span className="mt-[22px] flex items-baseline justify-between gap-4">
        <motion.span initial={false} animate={{ x: active ? 8 : 0 }} transition={ease} className="pf-serif text-[35px] uppercase leading-none md:max-xl:text-[28px]">{project.title}</motion.span>
        <span className={\`pf-label text-[15.5px] transition-colors duration-300 \${active ? 'text-[var(--pf-ink)]' : 'text-[var(--pf-muted)]'}\`}>{project.tag}</span>
      </span>
      <span className="relative mt-[16px] block h-px bg-[var(--pf-rule)]">
        <motion.span initial={false} animate={{ scaleX: active ? 1 : 0 }} transition={{ duration: 0.6, ease: QUART }} className="absolute inset-0 origin-left bg-[var(--pf-ink)]" />
      </span>
    </button>
  );
}
\`\`\`

## src/components/portfolio/ProjectDetail.jsx
\`\`\`jsx
import Img from './Img';
import Reveal from './Reveal';

export default function ProjectDetail({ project, next, onBack, onNext }) {
  const contain = project.fit === 'contain';
  const meta = [['Client', project.client], ['Year', project.year], ['Discipline', project.tag], ['Role', project.role]];
  const images = (project.images ?? []).length ? project.images : ['', ''];

  return (
    <article data-section="project" className="min-h-screen overflow-hidden bg-[var(--pf-paper)] pb-[120px]">
      <div className="flex h-[64px] items-center px-[29px]">
        <button type="button" onClick={onBack} className="pf-label -mx-[8px] px-[8px] py-[10px] text-[16px]">← All work</button>
      </div>
      {/* The cover keeps its own shape (\`ratio\`), up to 78vh tall, so a portrait is never cut into a banner. */}
      <div className="flex h-[78vh] justify-center max-md:h-auto" style={{ background: contain ? project.matte || 'var(--pf-mat)' : undefined }}>
        <div className="h-full max-w-full max-md:h-auto max-md:w-full" style={{ aspectRatio: project.ratio || 1 }}>
          <Img src={project.cover} alt={\`\${project.title} — \${project.tag}\`} className={\`h-full w-full \${contain ? 'object-contain' : 'object-cover'}\`} />
        </div>
      </div>
      <h1 className="pf-display mt-[48px] px-[29px] text-[13vw] [overflow-wrap:anywhere] [text-wrap:balance] max-md:mt-[36px] max-md:text-[16vw]">{project.title}</h1>
      <dl className="mx-[29px] mt-[56px] grid max-md:mt-[40px] max-md:gap-x-4 grid-cols-2 gap-y-6 border-t border-[var(--pf-rule)] pt-[20px] md:grid-cols-4">
        {meta.map(([label, value]) => (
          <div key={label}>
            <dt className="pf-label text-[14px] text-[var(--pf-muted)]">{label}</dt>
            <dd className="mt-[8px] text-[18px]">{value || '—'}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-[72px] px-[29px] max-md:mt-[48px] md:ml-[50%]">
        {(project.description ?? '').split(/\\n\\s*\\n/).map((para) => <p key={para} className="mb-[20px] max-w-[560px] text-[21px] leading-[1.45] max-md:text-[18px]">{para}</p>)}
      </div>
      <div className="mt-[72px] flex flex-col gap-[64px] px-[29px] pr-[60px] max-md:mt-[48px] max-md:gap-[32px] max-md:pr-[29px]">
        {images.map((src, i) => (
          <Reveal key={i} className={i % 2 ? 'w-full md:ml-[38%] md:w-1/2' : 'w-full'}>
            {/* A photo keeps its own shape; only an empty slot takes the 16:9 / 4:5 rhythm. */}
            <Img src={src} alt={\`\${project.title}, image \${i + 2}\`} className={\`w-full \${src ? 'h-auto' : i % 2 ? 'aspect-[4/5]' : 'aspect-[16/9]'}\`} />
          </Reveal>
        ))}
      </div>
      {next && (
        <button type="button" onClick={onNext} className="mx-[29px] mt-[120px] block text-left max-md:mt-[80px]">
          <span className="pf-label block text-[16px] text-[var(--pf-muted)]">Next project →</span>
          <span className="pf-display mt-[16px] block text-[8vw] [overflow-wrap:anywhere] max-md:text-[14vw]">{next.title}</span>
        </button>
      )}
    </article>
  );
}
\`\`\`

## src/components/portfolio/ProjectGrid.jsx
\`\`\`jsx
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { reducedMotion, useScrollRoot, useWide } from './scroll';

export default function ProjectGrid({ projects, status, onRetry, onOpen }) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const { scrollYProgress } = useScroll({ container: useScrollRoot(), target: ref, offset: ['start end', 'end start'] });
  // The right column drifts a little slower than the page.
  const wide = useWide();
  const drift = useTransform(scrollYProgress, [0, 1], reducedMotion() || !wide ? [0, 0] : [-30, 90]);
  const columns = [0, 1].map((c) => projects.map((p, i) => [p, i]).filter(([, i]) => i % 2 === c));
  const note = status === 'loading' ? 'Loading the work…' : status === 'error' ? 'The work couldn’t load.' : !projects.length && 'New work soon.';

  return (
    <section ref={ref} data-section="grid" data-chapter="II" className="grid grid-cols-1 gap-[67px] pb-[280px] pl-[29px] pr-[60px] pt-[70px] max-md:pb-[120px] max-md:pr-[29px] max-md:pt-[24px] md:grid-cols-2 md:gap-x-[64px] md:gap-y-0">
      {note && (
        <div role={status === 'error' ? 'alert' : 'status'} className="pf-label flex min-h-[40vh] flex-col items-start justify-center gap-[24px] text-[16px] text-[var(--pf-muted)] md:col-span-2">
          {note}
          {status === 'error' && <button type="button" onClick={onRetry} className="border-b border-current pb-[4px] text-[var(--pf-ink)]">Try again</button>}
        </div>
      )}
      {columns.map((column, c) => (
        // \`contents\` on narrow screens: one column, cards back in project order.
        <motion.div key={c} style={c ? { y: drift } : undefined} className={\`contents md:flex md:flex-col md:gap-[67px] \${c ? 'md:mt-[113px]' : ''}\`}>
          {column.map(([project, i]) => (
            <ProjectCard key={project.id} project={project} style={{ order: i }} active={active === project.id} onOpen={() => onOpen(project)}
              onActive={(on) => setActive((current) => (on ? project.id : current === project.id ? null : current))} />
          ))}
        </motion.div>
      ))}
    </section>
  );
}
\`\`\`

## src/components/portfolio/Rail.jsx
\`\`\`jsx
function Burger({ open, onClick, className = 'flex' }) {
  return (
    <button type="button" onClick={onClick} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} className={className}>
      <span className="flex h-[16px] w-[23px] flex-col justify-between">
        {[0, 1, 2].map((i) => <span key={i} className="h-[1.5px] w-full bg-current" />)}
      </span>
    </button>
  );
}

export default function Rail({ dark, menuOpen, onMenu }) {
  const tone = dark ? 'bg-[var(--pf-ground)] text-[var(--pf-ink)]' : 'bg-[var(--pf-ink)] text-[var(--pf-ground)]';
  return (
    <>
      <aside className={\`absolute inset-y-0 left-0 z-50 hidden w-[64px] transition-colors duration-300 lg:block \${tone}\`}>
        <div className="absolute left-[21px] top-[39px]"><Burger open={menuOpen} onClick={onMenu} /></div>
        <span className="pf-vert absolute left-1/2 top-[100px] -translate-x-1/2 text-[14px] uppercase leading-none tracking-[0.26em]">Folio — Edition</span>
        <span className="pf-vert pf-serif absolute bottom-[63px] left-1/2 -translate-x-1/2 rotate-180 text-[24px] leading-none">Anna Greenway®</span>
      </aside>
      <header className={\`absolute inset-x-0 top-0 z-50 flex h-[52px] items-center justify-between px-4 transition-colors duration-300 lg:hidden \${tone}\`}>
        <span className="pf-serif text-[22px]">Anna Greenway®</span>
        <Burger open={menuOpen} onClick={onMenu} className="-mr-[10px] flex h-[44px] w-[44px] items-center justify-center" />
      </header>
    </>
  );
}
\`\`\`

## src/components/portfolio/Reveal.jsx
\`\`\`jsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { QUART, reducedMotion, useScrollRoot } from './scroll';

/** Fades and slides its children up once they scroll into view. */
export default function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  const shown = useInView(ref, { root: useScrollRoot(), once: true, amount: 0.3 }) || reducedMotion();
  return (
    <motion.div ref={ref} initial={false} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 23 }} transition={{ duration: 0.8, ease: QUART }} className={className}>
      {children}
    </motion.div>
  );
}
\`\`\`

## src/components/portfolio/scroll.js
\`\`\`js
import { createContext, useContext, useEffect, useState } from 'react';

/** The page's scroll container (a ref), for scroll-linked motion and in-view checks. */
export const ScrollRoot = createContext(null);
export const useScrollRoot = () => useContext(ScrollRoot);

export const QUART = [0.25, 1, 0.5, 1];
export const SINE = [0.61, 1, 0.88, 1];
export const clamp = (v) => Math.min(Math.max(v, 0), 1);
export const reducedMotion = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

const WIDE = '(min-width: 768px)';
/** True from 768px up: below it the page runs in one column with no parallax or pinning. */
export function useWide() {
  const [wide, setWide] = useState(() => typeof window === 'undefined' || (window.matchMedia?.(WIDE).matches ?? true));
  useEffect(() => {
    const mq = window.matchMedia?.(WIDE);
    if (!mq) return undefined;
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}
\`\`\`

## src/components/portfolio/seed.js
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

## src/components/portfolio/useChrome.js
\`\`\`js
import { useEffect, useState } from 'react';

const hit = (root, selector, y) => [...root.querySelectorAll(selector)].find((s) => {
  const r = s.getBoundingClientRect();
  return r.top <= y && r.bottom > y;
});

/** What the persistent chrome reads off the scroll: a dark section behind the rail, and the chapter in view. */
export function useChrome(root, view) {
  const [chrome, setChrome] = useState({ dark: false, chapter: null });

  useEffect(() => {
    const el = root.current;
    const update = () => {
      const { top, height } = el.getBoundingClientRect();
      const dark = Boolean(hit(el, '[data-tone="dark"]', top + 40));
      const chapter = hit(el, '[data-chapter]', top + height * 0.6)?.dataset.chapter ?? null;
      setChrome((c) => (c.dark === dark && c.chapter === chapter ? c : { dark, chapter }));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [root, view]);

  return chrome;
}
\`\`\`

## src/components/portfolio/usePortfolio.js
\`\`\`js
import { useCallback, useEffect, useState } from 'react';
import { IMAGES } from './images';
import { loadSeeded } from './seed';

const SEED = [
  {
    title: 'Onyx Coffee Lab', tag: 'Brand Identity', year: '2026', client: 'Onyx Coffee Lab', role: 'Identity, packaging, signage', ratio: 0.82,
    cover: IMAGES.onyx, images: [IMAGES.onyxDetail1, IMAGES.onyxDetail2, IMAGES.onyxDetail3],
    description: 'Onyx roasts in small batches out of a former tile workshop in Marvila. They wanted to look like a lab notebook, not a café menu.\\n\\nThe identity grew outward from the loyalty card: a tilted wordmark, one hand-drawn bloom and a grid of stamps that fills as the habit does.\\n\\nIt runs across cups, bags, cans and the shop’s single sign, always in one ink.',
  },
  {
    title: 'The Blue Shift', tag: 'Editorial Design', year: '2025', client: 'MILLI-0615', role: 'Art direction, layout, type system', ratio: 0.85,
    cover: IMAGES.blueShift, images: [IMAGES.blueShiftDetail1, IMAGES.blueShiftDetail2],
    description: 'A biannual magazine about colour in everyday objects, from denim to dashboards.\\n\\nEach issue is built on a two-column grid that breaks once per spread, with a script masthead redrawn by hand for every cover.',
  },
  {
    title: 'Squeezd', tag: 'Packaging', year: '2024', client: 'Squeezd', role: 'Bottles, labels, tote', ratio: 1,
    cover: IMAGES.squeezd, images: [IMAGES.squeezdDetail1, IMAGES.squeezdDetail2],
    description: 'Cold-pressed juice sold from a market stall, then from a fridge in every corner shop on the street.\\n\\nThe bottles carry one tilted wordmark in a colour per blend, so a shelf reads like a paint chart; the tote says the rest.',
  },
  {
    title: 'Kinto Matcha', tag: 'Brand Identity', year: '2023', client: 'Kinto', role: 'Identity, menus, interior signage', ratio: 0.75,
    cover: IMAGES.kinto, images: [IMAGES.kintoDetail1, IMAGES.kintoDetail2],
    description: 'A matcha bar with twelve seats and one long oak counter.\\n\\nThe mark is the bowl itself, cut from a single sheet of green; the menu is set in a typewriter face, so it can change with the season without a designer.',
  },
  {
    title: 'Vexta', tag: 'Art Direction', year: '2022', client: 'Vexta', role: 'Art direction, speaker posters, wayfinding', ratio: 0.65, fit: 'contain',
    cover: IMAGES.vexta, images: [IMAGES.vextaDetail1, IMAGES.vextaDetail2, IMAGES.vextaDetail3],
    description: 'The visual system for Vexta’s third global AI conference: three days, forty speakers, one hall.\\n\\nEvery speaker got a poster of their own, a name set large over a single generated wave, and the same wave led visitors around the floor.',
  },
  {
    title: 'St. Lab', tag: 'Apparel', year: '2021', client: 'St. Lab', role: 'Graphics, garment line, lookbook', ratio: 0.75,
    cover: IMAGES.stLab, images: [IMAGES.stLabDetail1, IMAGES.stLabDetail2],
    description: 'A first run of T-shirts for a studio that wanted to be worn, not followed.\\n\\nEach graphic is a single hand-drawn line printed one colour on black, numbered on the inside hem.',
  },
].map((p, i) => ({ fit: 'cover', matte: '', order: i + 1, ...p }));

const DISCIPLINES = [
  { title: 'Brand Identity', items: ['Naming', 'Marks & wordmarks', 'Guidelines'] },
  { title: 'Editorial Design', items: ['Books & zines', 'Type systems', 'Print production'] },
  { title: 'Packaging', items: ['Structure', 'Labels & seals', 'Print specs'] },
  { title: 'Digital Experiences', items: ['Art direction', 'Interface design', 'Build'] },
].map((d, i) => ({ order: i + 1, ...d }));

const byOrder = (rows) => [...rows].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function usePortfolio() {
  const [projects, setProjects] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [status, setStatus] = useState('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { Project, Discipline } = await loadSeeded({
        Project: { samples: SEED, key: 'title', sort: 'order' },
        Discipline: { samples: DISCIPLINES, key: 'title', sort: 'order' },
      });
      setProjects(byOrder(Project));
      setDisciplines(byOrder(Discipline));
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  return { projects, disciplines, status, reload: load };
}
\`\`\`

## src/components/portfolio/useUrlParam.js
\`\`\`js
import { useEffect, useMemo, useRef, useState } from 'react';

const read = (name) => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get(name));

/** A query parameter as state: setting it adds a history entry, so Back (and a shared link) returns to it. */
export function useUrlParam(name) {
  const [value, setValue] = useState(() => read(name));
  useEffect(() => {
    const sync = () => setValue(read(name));
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [name]);

  /** \`replace\`: swap the open item (Next project) without adding a step to go back through. */
  const set = (next, replace = false) => {
    setValue(next);
    // Closing what this page opened: step back rather than stack another entry.
    if (next == null && window.history.state?.param === name) return window.history.back();
    if (next === read(name)) return;
    // The gallery's preview frame shares the homepage's history, so it never writes to it.
    if ('__galleryPlaying' in window) return;
    const url = new URL(window.location.href);
    if (next == null) url.searchParams.delete(name);
    else url.searchParams.set(name, next);
    try {
      if (next == null) window.history.replaceState(null, '', url);
      else window.history[replace ? 'replaceState' : 'pushState']({ param: name }, '', url);
    } catch { /* a sandboxed frame without a real URL */ }
  };
  return [value, set];
}

/** A new id for the page's scroll container whenever \`value\` changes. TanStack's router treats the
 *  pushState above as a navigation and restores every scrolled element by this id, so a fresh one
 *  keeps it off the container and the page sets its own scroll. */
export function useScrollKey(value) {
  const n = useRef(0);
  return useMemo(() => n.current++, [value]); // eslint-disable-line react-hooks/exhaustive-deps
}
\`\`\`

## src/components/portfolio/WorkTitle.jsx
\`\`\`jsx
import Reveal from './Reveal';

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];

export default function WorkTitle({ projects, status }) {
  const years = projects.map((p) => Number(p.year)).filter(Boolean);
  const label = years.length
    ? \`\${WORDS[projects.length] ?? projects.length} of them — \${Math.min(...years)} to \${Math.max(...years)}\`
    : status === 'loading' ? 'Six of them — 2021 to 2026' : '';
  return (
    <section data-section="work" data-chapter="I" className="flex h-screen flex-col items-end justify-center pr-[75px] max-md:h-auto max-md:py-[96px] max-md:pr-[29px]">
      <Reveal>
        <h2 className="pf-display text-right text-[13vw] max-md:text-[24vw]">The<br />Work</h2>
      </Reveal>
      <p className="pf-label mr-[7px] mt-[39px] max-md:mr-0 max-md:mt-[24px] max-md:text-[14px] text-[16px] leading-[24px] text-[var(--pf-muted)]">{label}</p>
    </section>
  );
}
\`\`\`

## src/pages/Portfolio.jsx
\`\`\`jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import '@/components/portfolio/portfolio.css';
import { ScrollRoot } from '@/components/portfolio/scroll';
import { usePortfolio } from '@/components/portfolio/usePortfolio';
import { useChrome } from '@/components/portfolio/useChrome';
import { useScrollKey, useUrlParam } from '@/components/portfolio/useUrlParam';
import Rail from '@/components/portfolio/Rail';
import ChapterMarks from '@/components/portfolio/ChapterMarks';
import MenuOverlay from '@/components/portfolio/MenuOverlay';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import WorkTitle from '@/components/portfolio/WorkTitle';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import Disciplines from '@/components/portfolio/Disciplines';
import Contact from '@/components/portfolio/Contact';
import ProjectDetail from '@/components/portfolio/ProjectDetail';

export default function Portfolio() {
  const { projects, disciplines, status, reload } = usePortfolio();
  const root = useRef(null);
  const [openId, setOpenId] = useUrlParam('project');
  const [menu, setMenu] = useState(false);
  const scrollKey = useScrollKey(openId);
  const chrome = useChrome(root, openId);
  const open = projects.find((p) => p.id === openId);
  const next = open && projects[(projects.indexOf(open) + 1) % projects.length];

  const gridTop = useRef(0);
  const show = (project) => { if (!openId) gridTop.current = root.current?.scrollTop ?? 0; setMenu(false); setOpenId(project.id, Boolean(openId)); };
  // Back, Forward and Escape skip show()/go(), and the router can't restore a container whose id changes.
  useLayoutEffect(() => { if (root.current) root.current.scrollTop = openId ? 0 : gridTop.current; }, [openId]);
  const go = (section) => {
    setMenu(false);
    setOpenId(null);
    requestAnimationFrame(() => {
      const target = root.current?.querySelector(\`[data-section="\${section}"]\`);
      root.current?.scrollTo({ top: target?.offsetTop ?? 0, behavior: 'smooth' });
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMenu(false);
      setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <ScrollRoot.Provider value={root}>
      <div className="pf relative h-screen overflow-hidden">
        <Rail dark={chrome.dark || menu} menuOpen={menu} onMenu={() => setMenu((m) => !m)} />
        <main ref={root} data-scroll data-scroll-restoration-id={\`pf-\${scrollKey}\`} className="pf-scroll absolute inset-x-0 bottom-0 top-[52px] overflow-y-auto lg:left-[64px] lg:top-0">
          {open ? (
            <ProjectDetail project={open} next={next} onBack={() => go('grid')} onNext={() => show(next)} />
          ) : (
            <>
              <Hero onGo={go} />
              <About />
              <WorkTitle projects={projects} status={status} />
              <ProjectGrid projects={projects} status={status} onRetry={reload} onOpen={show} />
              <Disciplines disciplines={disciplines} onGo={go} />
              <Contact />
            </>
          )}
        </main>
        {!open && <ChapterMarks chapter={chrome.chapter} />}
        <AnimatePresence>{menu && <MenuOverlay onGo={go} disciplines={disciplines.length > 0} />}</AnimatePresence>
      </div>
    </ScrollRoot.Provider>
  );
}
\`\`\`
`;export{e as default};