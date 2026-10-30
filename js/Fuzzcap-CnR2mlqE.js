var e=`# clicker_idle_game — app files

## src/components/fuzzcap/Backdrop.jsx
\`\`\`jsx
// Fixed positions so the first frame is always the same; each mote drifts up on its own loop.
const MOTES = [[8, 72, 0], [17, 40, -7], [29, 84, -3], [41, 58, -11], [56, 90, -5], [63, 34, -9], [74, 66, -2], [86, 48, -13], [93, 80, -6], [49, 22, -10]];

/** The ground: colour gradient (in .fz), a fine film grain and a few dust motes rising slowly. */
export default function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="fz-grain absolute inset-0" />
      {MOTES.map(([x, y, delay], i) => (
        <span key={i} className="fz-mote absolute h-[3px] w-[3px] rounded-full bg-[var(--swatch-3)]"
          style={{ left: \`\${x}%\`, top: \`\${y}%\`, animationDelay: \`\${delay}s\` }} />
      ))}
    </div>
  );
}
\`\`\`

## src/components/fuzzcap/Bubbles.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';

const CENTER = [380, 186];
const RX = 218;
const RY = 74;
const PERIOD = 7000;
const FLY = 900;
const SIZE = 42;
const BUBBLES = [1, 2, 3, 4, 5];

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

/** Five jelly bubbles orbiting the character in an ellipse, passing in front of it on the near side.
 *  \`from\` (scene units) is where they fly out from when just bought; each one "+1"s now and then. */
export default function Bubbles({ from, onEmit }) {
  const refs = useRef([]);
  const fromRef = useRef(from);
  const emitRef = useRef(onEmit);
  emitRef.current = onEmit;

  useEffect(() => {
    let start = null;
    const positions = [];
    let frame;
    const step = (now) => {
      start ??= now;
      const t = now - start;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const angle = (t / PERIOD) * Math.PI * 2 + (i / BUBBLES.length) * Math.PI * 2;
        const depth = Math.sin(angle);
        let x = CENTER[0] + Math.cos(angle) * RX;
        let y = CENTER[1] + depth * RY + Math.sin(t / 600 + i * 1.7) * 6;
        const launch = fromRef.current;
        if (launch && t < FLY + i * 80) {
          const k = easeOut(Math.max(0, (t - i * 80) / FLY));
          x = launch[0] + (x - launch[0]) * k;
          y = launch[1] + (y - launch[1]) * k;
        }
        positions[i] = [x, y];
        const scale = 0.8 + 0.25 * (depth + 1) / 2;
        el.style.transform = \`translate(\${x - SIZE / 2}px, \${y - SIZE / 2}px) scale(\${scale})\`;
        el.style.zIndex = depth > 0 ? 4 : 1;
      });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    let n = 0;
    const timer = setInterval(() => {
      const p = positions[n++ % BUBBLES.length];
      if (p) emitRef.current?.(p[0] + 14, p[1] - 22, 'bubble');
    }, 1100);
    return () => { cancelAnimationFrame(frame); clearInterval(timer); };
  }, []);

  // Pink, blue, orange, green, purple: glossy spheres drawn in CSS (.fz-bubble).
  return BUBBLES.map((n, i) => (
    <span key={n} ref={(el) => { refs.current[i] = el; }} aria-hidden className="fz-bubble pointer-events-none absolute left-0 top-0 rounded-full"
      style={{ width: SIZE, height: SIZE, transform: 'scale(0)', '--bubble': \`var(--ui-bubble-\${n})\` }} />
  ));
}
\`\`\`

## src/components/fuzzcap/Bursts.jsx
\`\`\`jsx
const SPARKS = [0, 1, 2, 3, 4, 5].map((i) => {
  const angle = (i / 6) * Math.PI * 2 + 0.4;
  const reach = 34 + (i % 3) * 10;
  return { dx: Math.cos(angle) * reach, dy: Math.sin(angle) * reach - 12, color: \`var(--ui-spark-\${(i % 3) + 1})\` };
});

export default function Bursts({ bursts }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[6]">
      {bursts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          {b.kind === 'tap' ? (
            <>
              <span className="fz-serif fz-float absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[42px] italic leading-none text-[var(--ui-ink)]">+1</span>
              {SPARKS.map((s, i) => (
                <span key={i} className="fz-spark absolute -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full"
                  style={{ background: s.color, '--dx': \`\${s.dx}px\`, '--dy': \`\${s.dy}px\` }} />
              ))}
            </>
          ) : (
            <span className={\`fz-serif fz-float-small absolute -translate-x-1/2 -translate-y-1/2 text-[17px] italic leading-none \${b.kind === 'bubble' ? 'text-[var(--ui-pop)]' : 'text-[var(--ui-muted)]'}\`}>+1</span>
          )}
        </div>
      ))}
    </div>
  );
}
\`\`\`

## src/components/fuzzcap/FitName.jsx
\`\`\`jsx
import { useLayoutEffect, useRef } from 'react';

/** A card name that shrinks to fit its box rather than clipping (on phones it may wrap; a single long word still shrinks). */
export default function FitName({ children }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const fit = () => {
      el.style.fontSize = '';
      const room = el.parentElement.clientWidth - parseFloat(getComputedStyle(el.parentElement).paddingLeft) * 2;
      if (el.scrollWidth > room) el.style.fontSize = \`\${parseFloat(getComputedStyle(el).fontSize) * (room / el.scrollWidth)}px\`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el.parentElement);
    return () => observer.disconnect();
  }, []);
  return <span ref={ref} className="block whitespace-nowrap">{children}</span>;
}
\`\`\`

## src/components/fuzzcap/fuzzcap.css
\`\`\`css
/* Instrument Serif for the logo, counter and titles; Inter Tight for all UI text. */
@font-face{font-family:"Instrument Serif";font-weight:400;font-style:normal;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-serif-400-normal.woff2) format("woff2")}
@font-face{font-family:"Instrument Serif";font-weight:400;font-style:italic;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/instrument-serif-400-italic.woff2) format("woff2")}
@font-face{font-family:"Inter Tight";font-weight:400;src:url(https://media.base44.com/files/public/builder-assets/google-fonts/inter-tight-400-normal.woff2) format("woff2")}

/* The look (Yellow): ground, ink, panel white and the pale haze at the top (--swatch-N); the rest of the UI. */
:root{
  --swatch-1:#FBDF0B;--swatch-1-ink:#141014;
  --swatch-2:#141014;--swatch-2-ink:#FFFFFF;
  --swatch-3:#FFFFFF;--swatch-3-ink:#141014;
  --swatch-4:#FCF8E5;--swatch-4-ink:#141014;
  --ui-ink:var(--swatch-2);--ui-on-ink:var(--swatch-3);--ui-line:var(--swatch-2);
  --ui-track:#E2E1E4;--ui-muted:#6E6A6E;--ui-pop:#E8457A;
  --ui-spark-1:#FFFFFF;--ui-spark-2:#FFF3A6;--ui-spark-3:#FF9EC4;
  --ui-bubble-1:#EC2F6E;--ui-bubble-2:#3FB9E6;--ui-bubble-3:#F2602C;--ui-bubble-4:#27B98A;--ui-bubble-5:#9A5BE3;
}
/* gallery-look */

.fz{font-family:"Inter Tight",system-ui,-apple-system,sans-serif;font-weight:400;color:var(--ui-ink);-webkit-font-smoothing:antialiased;
  background:linear-gradient(to bottom,var(--swatch-4) 0%,var(--swatch-4) 10%,color-mix(in srgb,var(--swatch-1) 12%,var(--swatch-4)) 17%,color-mix(in srgb,var(--swatch-1) 35%,var(--swatch-4)) 25%,color-mix(in srgb,var(--swatch-1) 60%,var(--swatch-4)) 33%,color-mix(in srgb,var(--swatch-1) 85%,var(--swatch-4)) 45%,var(--swatch-1) 58%,var(--swatch-1) 100%) fixed;
  -webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;overscroll-behavior:none}
.fz-serif{font-family:"Instrument Serif",Georgia,serif;font-weight:400;letter-spacing:0}
.fz-grain{opacity:.38;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.fz-mote{opacity:0;animation:fz-mote 16s linear infinite}

.fz-logo{font-size:27px}
.fz-label{font-size:14px;letter-spacing:.5px;line-height:1}
.fz-counter{font-size:100px;margin-top:4px}
.fz-title{font-size:44px;line-height:1;margin-bottom:27px}

.fz-card{background:var(--swatch-3);border:1px solid var(--ui-line);border-radius:15px;--fz-card-pad:6px;--fz-card-gap:6px}
.fz-upgrade{height:98px}
.fz-upgrade:disabled{cursor:default}
.fz-box{background:var(--swatch-3);border:1px solid var(--ui-line);border-radius:9px}
.fz-tile,.fz-tile-bg{background:linear-gradient(to bottom,var(--swatch-3) 0%,var(--swatch-4) 25%,var(--swatch-1) 100%)}
.fz-tile{width:70px;border:1px solid var(--ui-line);border-radius:9px}
.fz-name{height:39px;padding:0 10px;font-size:20px;line-height:1;letter-spacing:-0.035em}
.fz-grove .fz-name{font-size:24px}
.fz-meta{padding:0 10px;font-size:16px;line-height:1.1}
.fz-pill{font-size:10.5px;line-height:1;padding:3px 7px 2px;letter-spacing:.5px}
.fz-ready{border-width:2px;padding:5px;animation:fz-pulse 1.3s ease-in-out infinite}
.fz-flash{animation:fz-flash .6s ease-out forwards}
.fz-auto{font-size:13px;letter-spacing:.5px;padding:6px 16px;min-height:36px}

.fz-shadow{background:radial-gradient(closest-side,color-mix(in srgb,var(--ui-ink) 20%,transparent),transparent)}
.fz-aura{border:1px solid color-mix(in srgb,var(--swatch-3) 45%,transparent)}
.fz-hit{touch-action:manipulation;-webkit-user-select:none;user-select:none;cursor:pointer}
.fz-hit:focus-visible{outline:2px dashed var(--ui-ink);outline-offset:-60px}
.fz-bubble{background:radial-gradient(circle at 34% 28%,var(--swatch-3) 0 7%,color-mix(in srgb,var(--bubble) 65%,var(--swatch-3)) 16%,var(--bubble) 52%,color-mix(in srgb,var(--bubble) 72%,var(--ui-ink)) 100%);box-shadow:0 6px 10px color-mix(in srgb,var(--ui-ink) 10%,transparent)}
.fz-veil{background:color-mix(in srgb,var(--swatch-4) 62%,transparent);animation:fz-fade .4s ease-out both}
.fz-victory{width:426px;padding:7px;gap:10px}
.fz-victory .fz-box{padding:22px 0 18px;border-radius:10px}
.fz-victory-label{font-size:13px;line-height:1}
.fz-victory-title{font-size:80px;line-height:.95;margin-top:6px}
.fz-victory-total{font-size:64px;line-height:1;margin-top:4px}
.fz-victory-cta{height:40px;margin-top:6px;font-size:15px}
.fz-mobile .fz-victory{width:min(90vw,426px)}
.fz-mobile .fz-victory-title{font-size:clamp(52px,17vw,80px)}

.fz-float{animation:fz-float 1.2s cubic-bezier(.2,.7,.3,1) forwards}
.fz-float-small{animation:fz-float-small 1.1s ease-out forwards}
.fz-spark{animation:fz-spark .9s ease-out forwards}
.fz-count-pop{animation:fz-count .24s ease-out}
.fz-breathe{transform-origin:50% 95%;animation:fz-breathe 2.4s ease-in-out infinite alternate}
.fz-sprout-pop{transform-origin:50% 95%;animation:fz-sprout .65s cubic-bezier(.3,1.5,.5,1) both}
.fz-pop-in{animation:fz-pop-in .5s cubic-bezier(.3,1.5,.5,1) both}
.fz-bob{animation:fz-bob 2.6s ease-in-out infinite alternate}
.fz-victory-in{animation:fz-victory .5s cubic-bezier(.2,1.4,.4,1) both}

@keyframes fz-float{from{transform:translate(-50%,-50%);opacity:1}to{transform:translate(-50%,calc(-50% - 100px));opacity:0}}
@keyframes fz-float-small{from{transform:translate(-50%,-50%);opacity:.9}to{transform:translate(-50%,calc(-50% - 60px));opacity:0}}
@keyframes fz-spark{0%{transform:translate(0,0) scale(1);opacity:1}45%{transform:translate(var(--dx),var(--dy)) scale(1);opacity:1}100%{transform:translate(var(--dx),calc(var(--dy) + 44px)) scale(.5);opacity:0}}
@keyframes fz-count{0%{transform:scale(1)}35%{transform:scale(1.05)}100%{transform:scale(1)}}
@keyframes fz-breathe{from{transform:scale(1,1)}to{transform:scale(1.02,1.045)}}
@keyframes fz-sprout{from{transform:translateY(24px) scale(0)}to{transform:none}}
@keyframes fz-pop-in{from{transform:scale(0)}to{transform:none}}
@keyframes fz-bob{from{translate:0 0}to{translate:0 -9px}}
@keyframes fz-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ui-ink) 0%,transparent)}50%{box-shadow:0 0 0 3px color-mix(in srgb,var(--ui-ink) 16%,transparent)}}
@keyframes fz-flash{from{opacity:.9}to{opacity:0}}
@keyframes fz-fade{from{opacity:0}}
@keyframes fz-victory{from{transform:scale(.85);opacity:0}}
.fz-leave{animation:fz-leave ease-in both;pointer-events:none}
@keyframes fz-leave{to{opacity:0}}
@keyframes fz-mote{0%{transform:translateY(0);opacity:0}10%{opacity:.8}85%{opacity:.6}100%{transform:translateY(-38vh);opacity:0}}

/* Phones: a single column — header, the scene, a 2×2 grid of taller cards. */
.fz-safe{padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)}
.fz-mobile .fz-logo{font-size:40px}
.fz-mobile .fz-counter{font-size:clamp(64px,19vw,88px)}
.fz-mobile .fz-title{font-size:34px;margin-bottom:12px}
.fz-mobile .fz-upgrade{height:auto;min-height:104px;--fz-card-pad:5px;--fz-card-gap:5px}
.fz-mobile .fz-ready{padding:4px}
.fz-mobile .fz-tile{width:clamp(36px,12vw,60px)}
.fz-mobile .fz-name{height:auto;min-height:46px;padding:6px 8px;font-size:clamp(13px,4.3vw,17px);line-height:1.05}
.fz-mobile .fz-name>span{white-space:normal}
.fz-mobile .fz-meta{flex-wrap:wrap;row-gap:6px;padding:7px 8px;font-size:clamp(11.5px,3.5vw,14px)}
.fz-mobile .fz-meta .fz-pill{margin-left:0}
.fz-mobile .fz-meta>span{white-space:normal}
.fz-mobile .fz-bar{flex-basis:100%}

@media (prefers-reduced-motion:reduce){.fz-mote,.fz-breathe,.fz-bob,.fz-ready{animation:none}}
\`\`\`

## src/components/fuzzcap/GrovePanel.jsx
\`\`\`jsx
import { useEased } from '@/components/fuzzcap/useEased';

const R = 61;
const C = 2 * Math.PI * R;

/** The Grove: a ring gauge toward the next upgrade and the auto output. */
export default function GrovePanel({ progress, rate }) {
  const shown = useEased(progress);
  return (
    <section className="fz-grove flex flex-col">
      <h2 className="fz-serif fz-title italic">Grove</h2>
      <div className="fz-card flex flex-col gap-[6px] p-[6px]">
        <div className="fz-box flex flex-col">
          <div className="fz-name flex items-center border-b border-[var(--ui-line)] uppercase">Progress</div>
          <div className="relative flex h-[181px] items-center justify-center">
            <svg width="146" height="146" viewBox="0 0 146 146" className="absolute" aria-hidden>
              <circle cx="73" cy="73" r={R} fill="none" stroke="var(--ui-track)" strokeWidth="11" />
              <circle cx="73" cy="73" r={R} fill="none" stroke="var(--ui-ink)" strokeWidth="11" strokeDasharray={C}
                strokeDashoffset={C * (1 - shown)} transform="rotate(-90 73 73)" />
            </svg>
            <span className="fz-serif relative text-[48px] leading-none">{Math.round(shown * 100)}%</span>
          </div>
        </div>
        <div className="fz-box flex flex-col">
          <div className="fz-name flex items-center border-b border-[var(--ui-line)] uppercase">Auto output</div>
          <div className="flex h-[75px] items-end justify-between px-[11px] pb-[12px]">
            <span className="fz-serif leading-none"><span className="text-[64px]">{rate ? \`+\${rate}\` : 0}</span><span className="text-[18px]"> /s</span></span>
            <span className="fz-ui pb-[4px] text-[18px] uppercase">Tap +1</span>
          </div>
        </div>
      </div>
    </section>
  );
}
\`\`\`

## src/components/fuzzcap/Header.jsx
\`\`\`jsx
export function Logo() {
  return (
    <div className="fz-logo flex items-center gap-[0.36em]">
      <span aria-hidden className="h-[0.46em] w-[0.46em] rounded-full bg-[var(--ui-ink)]" />
      <span className="fz-serif italic leading-none">Fuzzcap</span>
    </div>
  );
}

/** "SQUISH" over the counter, which pops a little on every change. */
export function Counter({ value }) {
  return (
    <div className="flex flex-col items-center" aria-live="polite">
      <span className="fz-label uppercase">Squish</span>
      <span key={value} className="fz-serif fz-counter fz-count-pop block leading-none">{value.toLocaleString('en-US')}</span>
    </div>
  );
}

export function AutoPill({ rate }) {
  return (
    <span className="fz-auto inline-flex items-center gap-[8px] rounded-full border border-[var(--ui-ink)] bg-[var(--swatch-3)] uppercase">
      Auto <span className="fz-serif text-[1.35em] normal-case leading-none">{rate ? \`+\${rate}\` : 0} /s</span>
    </span>
  );
}
\`\`\`

## src/components/fuzzcap/Scene.jsx
\`\`\`jsx
import { useRef } from 'react';
import { CHARACTER, image } from '@/components/fuzzcap/upgrades';
import { useBursts } from '@/components/fuzzcap/useBursts';
import Bubbles from '@/components/fuzzcap/Bubbles';
import Sprouts from '@/components/fuzzcap/Sprouts';
import Bursts from '@/components/fuzzcap/Bursts';

// A jelly squash: wide and short, then a damped wobble back, anchored at the feet.
const SQUASH = [
  { transform: 'scale(1,1)' },
  { transform: 'scale(1.1,0.87)', offset: 0.14 },
  { transform: 'scale(0.95,1.06)', offset: 0.34 },
  { transform: 'scale(1.03,0.97)', offset: 0.54 },
  { transform: 'scale(0.99,1.01)', offset: 0.76 },
  { transform: 'scale(1,1)' },
];

/** The 760×560 scene: the character on its shadow, and whatever the owned upgrades add around it. */
export default function Scene({ owned, fresh, launchFrom, mobile, onSquish, sceneRef }) {
  const bodyRef = useRef(null);
  const { bursts, add, tap } = useBursts(sceneRef);
  const has = (id) => owned.includes(id);

  const squish = (event) => {
    onSquish();
    tap(event);
    bodyRef.current?.animate(SQUASH, { duration: 600, easing: 'ease-out' });
  };

  return (
    <div ref={sceneRef} className="relative h-[560px] w-[760px]">
      {!has('bubbles') && <div aria-hidden className="fz-aura absolute left-[185px] top-[52px] h-[390px] w-[390px] rounded-full" />}
      <div aria-hidden className="fz-shadow absolute left-[205px] top-[478px] h-[44px] w-[350px]" />
      {has('halo') && (
        <img src={image('upgrade-4-jelly-halo')} alt="" draggable={false}
          className={\`fz-bob pointer-events-none absolute left-[322px] top-[-6px] z-[2] w-[116px] select-none \${fresh === 'halo' ? 'fz-pop-in' : ''}\`} />
      )}
      {has('syrup') && [[150, 230, 1], [560, 214, -1]].map(([x, y, flip], i) => (
        <img key={i} src={image('upgrade-3-syrup-drops')} alt="" draggable={false}
          className={\`fz-bob pointer-events-none absolute z-[2] w-[64px] select-none \${fresh === 'syrup' ? 'fz-pop-in' : ''}\`}
          style={{ left: x, top: y, scale: \`\${flip} 1\`, animationDelay: \`\${i * 0.8}s\` }} />
      ))}
      <button type="button" onPointerDown={squish} onClick={(e) => { if (e.detail === 0) squish(); }}
        onKeyDown={(e) => { if (e.repeat && e.key === 'Enter') e.preventDefault(); }}
        className="fz-hit absolute left-[164px] top-[39px] z-[2] h-[485px] w-[431px] rounded-full outline-none">
        <span className="sr-only">Squish</span>
        <span ref={bodyRef} className="block h-full w-full" style={{ transformOrigin: '50% 95%' }}>
          <img src={CHARACTER} alt="Fuzzcap" draggable={false} className="pointer-events-none h-full w-full select-none" />
        </span>
      </button>
      {has('bubbles') && <Bubbles from={fresh === 'bubbles' ? launchFrom : null} onEmit={add} />}
      {has('sprouts') && <Sprouts mobile={mobile} pop={fresh === 'sprouts'} onEmit={add} />}
      <Bursts bursts={bursts} />
    </div>
  );
}
\`\`\`

## src/components/fuzzcap/Sprouts.jsx
\`\`\`jsx
import { useEffect, useRef } from 'react';
import { CHARACTER } from '@/components/fuzzcap/upgrades';

const GROUND = 500;
// The character's feet sit at 95% of its image's height.
const FEET = 0.951;
const SPOTS = {
  desktop: [[-248, 0.82], [-186, 1], [186, 1], [248, 0.82]],
  mobile: [[-226, 0.82], [-172, 1], [172, 1], [226, 0.82]],
};

/** Four small copies of the character on the ground, two each side; they pop up when bought and breathe. */
export default function Sprouts({ mobile, pop, onEmit }) {
  const emitRef = useRef(onEmit);
  emitRef.current = onEmit;
  const spots = SPOTS[mobile ? 'mobile' : 'desktop'];

  useEffect(() => {
    let n = 0;
    const timer = setInterval(() => {
      const [dx, size] = spots[[1, 3, 0, 2][n++ % 4]];
      emitRef.current?.(380 + dx, GROUND - 92 * size, 'sprout');
    }, 1300);
    return () => clearInterval(timer);
  }, [spots]);

  return spots.map(([dx, size], i) => {
    const h = 98 * size;
    const w = h * (640 / 720);
    return (
      <div key={i} className="pointer-events-none absolute z-[3]" style={{ left: 380 + dx - w / 2, top: GROUND - h * FEET, width: w, height: h }}>
        <div className="fz-shadow absolute left-1/2 h-[12px] w-[70%] -translate-x-1/2" style={{ top: h * FEET - 6 }} />
        <div className={pop ? 'fz-sprout-pop h-full w-full' : 'h-full w-full'} style={{ animationDelay: \`\${i * 90}ms\` }}>
          <img src={CHARACTER} alt="" draggable={false} className="fz-breathe h-full w-full select-none object-contain"
            style={{ animationDelay: \`\${i * 0.45}s\` }} />
        </div>
      </div>
    );
  });
}
\`\`\`

## src/components/fuzzcap/UpgradeCard.jsx
\`\`\`jsx
import FitName from '@/components/fuzzcap/FitName';

/** One upgrade: Locked (price and a filling bar), Ready (pulsing border, READY pill) or Owned (rate, OWNED pill). */
export default function UpgradeCard({ upgrade, state, progress, flash, onBuy }) {
  const owned = state === 'owned';
  return (
    <button type="button" onClick={onBuy} disabled={state !== 'ready'} aria-label={\`\${upgrade.name}, \${upgrade.cost} squish, \${state}\`}
      className={\`fz-card fz-upgrade relative flex w-full gap-[var(--fz-card-gap)] overflow-hidden p-[var(--fz-card-pad)] text-left \${state === 'ready' ? 'fz-ready' : ''}\`}>
      <span className="fz-tile relative flex-none overflow-hidden">
        <img src={upgrade.image} alt="" draggable={false} className={\`h-full w-full select-none \${upgrade.id === 'sprouts' ? 'object-cover object-top' : 'object-contain'}\`} />
      </span>
      <span className="fz-box flex min-w-0 flex-1 flex-col">
        <span className="fz-name flex items-center border-b border-[var(--ui-line)] uppercase">
          <FitName>{upgrade.name}</FitName>
        </span>
        <span className="fz-meta flex flex-1 items-center gap-[10px]">
          <span className="whitespace-nowrap">{owned ? \`+\${upgrade.rate}/s\` : \`\${upgrade.cost} squish\`}</span>
          {state === 'locked' && (
            <span className="fz-bar relative h-[8px] min-w-0 flex-1 overflow-hidden rounded-full border border-[var(--ui-line)]">
              <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--ui-ink)] transition-[width] duration-500 ease-out" style={{ width: \`\${progress * 100}%\` }} />
            </span>
          )}
          {state !== 'locked' && (
            <span className={\`fz-pill ml-auto rounded-full border border-[var(--ui-ink)] uppercase \${owned ? 'bg-[var(--ui-ink)] text-[var(--ui-on-ink)]' : ''}\`}>
              {owned ? 'Owned' : 'Ready'}
            </span>
          )}
        </span>
      </span>
      {flash && <span aria-hidden className="fz-flash pointer-events-none absolute inset-0 bg-[var(--swatch-3)]" />}
    </button>
  );
}
\`\`\`

## src/components/fuzzcap/upgrades.js
\`\`\`js
const MEDIA = 'https://media.base44.com/images/public/builder-assets/gallery/clicker-idle-game';
export const image = (name) => \`\${MEDIA}/\${name}.webp\`;

export const CHARACTER = image('character');

export const UPGRADES = [
  { id: 'bubbles', name: 'Jelly Bubbles', cost: 10, rate: 1, image: image('upgrade-1-jelly-bubbles') },
  { id: 'sprouts', name: 'Fuzzy Sprouts', cost: 30, rate: 3, image: image('upgrade-2-fuzzy-sprouts') },
  { id: 'syrup', name: 'Syrup Drops', cost: 120, rate: 8, image: image('upgrade-3-syrup-drops') },
  { id: 'halo', name: 'Jelly Halo', cost: 500, rate: 25, image: image('upgrade-4-jelly-halo') },
];

// The round completes once 60 squish have been earned in all (spent included), as in the clips.
export const ROUND_GOAL = 60;

export const rateOf = (owned) => UPGRADES.reduce((sum, u) => sum + (owned.includes(u.id) ? u.rate : 0), 0);

/** The first upgrade not yet owned, or null once all are. */
export const nextUpgrade = (owned) => UPGRADES.find((u) => !owned.includes(u.id)) ?? null;

export const cardState = (upgrade, owned, score) =>
  owned.includes(upgrade.id) ? 'owned' : score >= upgrade.cost ? 'ready' : 'locked';
\`\`\`

## src/components/fuzzcap/useBursts.js
\`\`\`js
import { useCallback, useEffect, useRef, useState } from 'react';

const LIFE = 1300;
// Taps without a pointer position (keyboard, the preview's demo) land around the top of the head, as in the clip.
const HEAD = [[332, 96], [396, 70], [352, 118], [410, 104], [318, 78], [380, 124]];

/** Floating "+1"s and sparkle bursts, in scene units (the scene is 760×560). */
export function useBursts(sceneRef) {
  const [bursts, setBursts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = useCallback((x, y, kind) => {
    const id = nextId.current++;
    setBursts((list) => [...list, { id, x, y, kind }]);
    timers.current.push(setTimeout(() => setBursts((list) => list.filter((b) => b.id !== id)), LIFE));
  }, []);

  /** A tap's burst: at the pointer when there is one (viewport px → scene units, through any CSS zoom). */
  const tap = useCallback((event) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    if (event?.clientX != null && rect?.width) {
      const scale = rect.width / 760;
      add((event.clientX - rect.left) / scale, (event.clientY - rect.top) / scale, 'tap');
    } else {
      const [x, y] = HEAD[nextId.current % HEAD.length];
      add(x, y, 'tap');
    }
  }, [add, sceneRef]);

  return { bursts, add, tap };
}
\`\`\`

## src/components/fuzzcap/useEased.js
\`\`\`js
import { useEffect, useRef, useState } from 'react';

/** Follows \`target\` smoothly (exponential ease), starting at it so the first frame is at rest. */
export function useEased(target, speed = 6) {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    let frame;
    let last = null;
    const step = (now) => {
      const dt = last === null ? 0 : Math.min(Math.max(now - last, 0), 100) / 1000;
      last = now;
      const next = current.current + (target - current.current) * (1 - Math.exp(-speed * dt));
      current.current = Math.abs(target - next) < 0.001 ? target : next;
      setValue(current.current);
      if (current.current !== target) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, speed]);
  return value;
}
\`\`\`

## src/components/fuzzcap/useFuzzcap.js
\`\`\`js
import { useCallback, useEffect, useRef, useState } from 'react';
import { ROUND_GOAL, UPGRADES, rateOf } from '@/components/fuzzcap/upgrades';

const KEY = 'fuzzcap-save-v1';
const FRESH = { score: 0, earned: 0, taps: 0, owned: [], won: false };
const OFFLINE_CAP_MS = 8 * 3600 * 1000;

// Time away earns at the auto rate, up to 8 hours.
const load = () => {
  try {
    const { savedAt, ...saved } = { ...FRESH, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
    const away = savedAt ? Math.min(Math.max(Date.now() - savedAt, 0), OFFLINE_CAP_MS) : 0;
    const gain = Math.floor((rateOf(saved.owned) * away) / 1000);
    return { ...saved, score: saved.score + gain, earned: saved.earned + gain };
  } catch {
    return FRESH;
  }
};

const save = (game) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...game, savedAt: Date.now() }));
  } catch {
    // Storage can be unavailable (private mode); the game keeps running in memory.
  }
};

/** The game: score, upgrades and auto income, saved to this device. */
export function useFuzzcap() {
  const [game, setGame] = useState(load);
  const [victory, setVictory] = useState(false);
  const rate = rateOf(game.owned);

  const gameRef = useRef(game);
  gameRef.current = game;
  const adopted = useRef(false); // the latest change came from another tab's save: writing it back would ping-pong
  // Saved on every tap or purchase, and every second for auto income.
  useEffect(() => {
    if (adopted.current) adopted.current = false;
    else save(gameRef.current);
  }, [game.taps, game.owned, game.won]);
  useEffect(() => {
    const timer = setInterval(() => save(gameRef.current), 1000);
    // Another tab's save is the latest game: adopt it, so two tabs don't overwrite each other's progress.
    const onStorage = (e) => {
      if (e.key !== KEY || !e.newValue) return;
      try {
        const { savedAt, ...other } = JSON.parse(e.newValue);
        adopted.current = true;
        setGame({ ...FRESH, ...other });
      } catch {
        // unreadable: keep this tab's game
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Auto income accrues on a timer (it keeps earning in a background tab, where frames stop) and lands a whole
  // squish at a time, so the page re-renders per point.
  const rateRef = useRef(rate);
  rateRef.current = rate;
  useEffect(() => {
    let last = performance.now();
    let pending = 0;
    const timer = setInterval(() => {
      const now = performance.now();
      pending += (rateRef.current * Math.min(Math.max(now - last, 0), OFFLINE_CAP_MS)) / 1000;
      last = now;
      if (pending >= 1) {
        const gain = Math.floor(pending);
        pending -= gain;
        setGame((g) => ({ ...g, score: g.score + gain, earned: g.earned + gain }));
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (game.won) return;
    if (game.earned >= ROUND_GOAL) {
      setGame((g) => ({ ...g, won: true }));
      setVictory(true);
    }
  }, [game.earned, game.won]);

  const squish = useCallback(() => setGame((g) => ({ ...g, score: g.score + 1, earned: g.earned + 1, taps: g.taps + 1 })), []);

  const buy = useCallback((id) => {
    const upgrade = UPGRADES.find((u) => u.id === id);
    const g = gameRef.current;
    if (g.owned.includes(id) || g.score < upgrade.cost) return false;
    setGame((prev) => ({ ...prev, score: prev.score - upgrade.cost, owned: [...prev.owned, id] }));
    return true;
  }, []);

  return { ...game, rate, victory, squish, buy, closeVictory: () => setVictory(false) };
}
\`\`\`

## src/components/fuzzcap/useFuzzcapUi.js
\`\`\`js
import { useCallback, useEffect, useRef, useState } from 'react';
import { UPGRADES } from '@/components/fuzzcap/upgrades';

/** Purchases as the scene shows them: which upgrade was just bought (it animates in), from where, and the card flash. */
export function useFuzzcapUi(game) {
  const sceneRef = useRef(null);
  const [fresh, setFresh] = useState(null);
  const [launchFrom, setLaunchFrom] = useState(null);
  const [flash, setFlash] = useState(null);

  const { buy: purchase } = game;
  const buy = useCallback((id, card) => {
    if (!purchase(id)) return;
    setLaunchFrom(null);
    const scene = sceneRef.current?.getBoundingClientRect();
    if (card && scene?.width) {
      const rect = card.getBoundingClientRect();
      const scale = scene.width / 760;
      setLaunchFrom([(rect.left + rect.width * 0.15 - scene.left) / scale, (rect.top + rect.height / 2 - scene.top) / scale]);
    }
    setFresh(id);
    setFlash(id);
    setTimeout(() => setFlash((f) => (f === id ? null : f)), 650);
  }, [purchase]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.target?.closest?.('input, textarea, [contenteditable]')) return;
      // A focused button (the one just clicked) takes Space and Enter itself; the number keys still buy.
      if (e.key === ' ' || e.key === 'Enter') {
        if (!e.target?.closest?.('button')) { e.preventDefault(); sceneRef.current?.querySelector('button')?.click(); }
        return;
      }
      const upgrade = UPGRADES[Number(e.key) - 1];
      if (upgrade) buy(upgrade.id, null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [buy]);

  return { sceneRef, fresh, launchFrom, flash, buy };
}
\`\`\`

## src/components/fuzzcap/useViewport.js
\`\`\`js
import { useEffect, useState } from 'react';

const MOBILE = 768;
// Portrait and near-square windows (tablets upright, the builder's narrow preview) take the phone column, centred.
const MIN_RATIO = 1.2;
const COLUMN = 640;
// The desktop scene is composed at 1280×720 and scales with the window's height (narrower windows by width).
const DESIGN_H = 720;
const MIN_W = 1100;

const measure = () => {
  const [w, h] = typeof window === 'undefined' ? [1280, 720] : [window.innerWidth, window.innerHeight];
  const mobile = w < MOBILE || w / h < MIN_RATIO;
  // On the phone column the 760×560 scene (its middle ~540 units carry the character, bubbles and sprouts) takes the
  // column's width and about 42% of the height, never so small the character stops reading; taller content scrolls.
  const column = Math.min(w, COLUMN);
  const sceneZoom = Math.min(column / 540, Math.max(0.55, (h * 0.42) / 540), 1.15);
  return { mobile, zoom: mobile ? 1 : Math.min(h / DESIGN_H, w / MIN_W), sceneZoom, w, h };
};

export function useViewport() {
  const [viewport, setViewport] = useState(measure);
  useEffect(() => {
    const onResize = () => setViewport(measure());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return viewport;
}
\`\`\`

## src/components/fuzzcap/VictoryCard.jsx
\`\`\`jsx
import { useState } from 'react';

const LEAVE_MS = 450;

/** "Round complete" over a soft veil: the live total and "Keep squishing", which fades it out while the game carries on. */
export default function VictoryCard({ earned, zoom, onClose }) {
  const [leaving, setLeaving] = useState(false);
  const close = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onClose, LEAVE_MS);
  };
  return (
    <div className={\`fz-veil fixed inset-0 z-50 flex items-center justify-center \${leaving ? 'fz-leave' : ''}\`}
      style={leaving ? { animationDuration: \`\${LEAVE_MS}ms\` } : undefined} role="dialog" aria-modal="true" aria-label="Round complete">
      <div className="fz-victory fz-card fz-victory-in flex flex-col" style={{ zoom }}>
        <div className="fz-box fz-tile-bg flex flex-col items-center">
          <span className="fz-victory-label uppercase">Round complete</span>
          <span className="fz-serif fz-victory-title italic">Squished it!</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="fz-serif fz-victory-total">{Math.floor(earned)}</span>
          <span className="fz-victory-label uppercase">Total squish</span>
        </div>
        <button type="button" onClick={close} className="fz-victory-cta rounded-full bg-[var(--ui-ink)] uppercase text-[var(--ui-on-ink)]">
          Keep squishing
        </button>
      </div>
    </div>
  );
}
\`\`\`

## src/pages/Fuzzcap.jsx
\`\`\`jsx
import '@/components/fuzzcap/fuzzcap.css';
import { UPGRADES, cardState, nextUpgrade } from '@/components/fuzzcap/upgrades';
import { useFuzzcap } from '@/components/fuzzcap/useFuzzcap';
import { useFuzzcapUi } from '@/components/fuzzcap/useFuzzcapUi';
import { useViewport } from '@/components/fuzzcap/useViewport';
import { AutoPill, Counter, Logo } from '@/components/fuzzcap/Header';
import Scene from '@/components/fuzzcap/Scene';
import UpgradeCard from '@/components/fuzzcap/UpgradeCard';
import GrovePanel from '@/components/fuzzcap/GrovePanel';
import VictoryCard from '@/components/fuzzcap/VictoryCard';
import Backdrop from '@/components/fuzzcap/Backdrop';

export default function Fuzzcap() {
  const game = useFuzzcap();
  const ui = useFuzzcapUi(game);
  const { mobile, zoom, sceneZoom, w, h } = useViewport();
  const score = Math.floor(game.score);
  const next = nextUpgrade(game.owned);

  const cards = UPGRADES.map((u) => (
    <UpgradeCard key={u.id} upgrade={u} state={cardState(u, game.owned, game.score)} progress={Math.min(1, game.score / u.cost)}
      flash={ui.flash === u.id} onBuy={(e) => ui.buy(u.id, e.currentTarget)} />
  ));
  const scene = (
    <Scene owned={game.owned} fresh={ui.fresh} launchFrom={ui.launchFrom} mobile={mobile} onSquish={game.squish} sceneRef={ui.sceneRef} />
  );

  return (
    <div className={\`fz relative \${mobile ? 'fz-mobile min-h-[100dvh]' : 'h-screen overflow-hidden'}\`}>
      <Backdrop />
      {mobile ? (
        <main className="fz-safe relative z-[1] mx-auto flex min-h-[100dvh] w-full max-w-[640px] flex-col">
          <header className="flex flex-col items-center gap-[10px] pt-[14px]">
            <Logo />
            <Counter value={score} />
            <AutoPill rate={game.rate} />
          </header>
          {/* The scene's own height (y −10…530), clipped only at the sides where it is empty, so nothing reaches header or cards. */}
          <div className="relative flex-none overflow-hidden" style={{ height: 540 * sceneZoom }}>
            <div className="absolute left-1/2 top-0" style={{ zoom: sceneZoom, marginLeft: -380, marginTop: 10 }}>{scene}</div>
          </div>
          <div className="flex-1" />
          <section className="px-[24px] pb-[18px]">
            <h2 className="fz-serif fz-title italic">Upgrades</h2>
            <div className="grid grid-cols-2 gap-[16px]">{cards}</div>
          </section>
        </main>
      ) : (
        <main className="relative z-[1] overflow-hidden" style={{ zoom, width: w / zoom, height: h / zoom }}>
          <div className="absolute inset-x-0 top-1/2 h-[720px] -translate-y-1/2">
            <div className="absolute left-[43px] top-[37px]"><Logo /></div>
            <div className="absolute left-1/2 top-[36px] -translate-x-1/2"><Counter value={score} /></div>
            <div className="absolute left-1/2 top-[148px] -ml-[380px]">{scene}</div>
            <section className="absolute left-[43px] top-[157px] flex w-[286px] flex-col">
              <h2 className="fz-serif fz-title italic">Upgrades</h2>
              <div className="flex flex-col gap-[11px]">{cards}</div>
            </section>
            <div className="absolute right-[43px] top-[157px] w-[286px]">
              <GrovePanel progress={next ? Math.min(1, game.score / next.cost) : 1} rate={game.rate} />
            </div>
          </div>
        </main>
      )}
      {game.victory && (
        <VictoryCard earned={game.earned} zoom={zoom} onClose={game.closeVictory} />
      )}
    </div>
  );
}
\`\`\`
`;export{e as default};