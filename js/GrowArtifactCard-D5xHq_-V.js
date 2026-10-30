import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{v as t,x as n}from"./vendor-react-BOOIA4XI.js";import{n as r}from"./I18nProvider-CiAkvXSX.js";import{S as i,m as a,p as o}from"./vendor-data-DCUikwl_.js";import{r as s}from"./errorReporting-K8NfFdxg.js";import{Di as c,io as l,ka as ee,no as u}from"./vendor-ui-FLuz20Mc.js";import{A as d,S as f}from"./apiErrors-BNwL6S8o.js";import{Dl as p,F as te,I as m,Ku as h,P as ne,T as g,W as re,dc as ie,li as _,ua as v,vr as y}from"./cant-radio.store-D7vzVh8P.js";import{t as b}from"./text-Ck2qCZZO.js";import{r as x}from"./button-Cb9S_eUZ.js";import{n as ae}from"./use-mobile-BkCzYCbw.js";import"./index-DSyBe3BM.js";import{t as S}from"./urlSafety-_3aRXIbX.js";import{c as C,l as w}from"./GoogleAdsAPI-ClQpUEjB.js";import{P as T,S as E,b as D,s as oe,y as O}from"./helpers-CYWBj0Ad.js";import{t as se}from"./useAgentEditorToast-CErit9f2.js";import{t as ce}from"./usePortalDarkStyles-BJukc9MJ.js";function k(){return performance.now()}function A(e){return Math.round(k()-e)}function le(e){let t=e?.response?.status;return typeof t==`number`?t:void 0}function ue(e){let t=e;return t?.code===`ERR_CANCELED`||t?.name===`AbortError`||t?.name===`CanceledError`}async function j(e,t,n){let r=k();try{let i=await n();return s(`superagent.multiconversation.${e}`,{...t,duration_ms:A(r),outcome:`success`}),i}catch(n){throw e===`list_load`&&ue(n)||s(`superagent.multiconversation.${e}`,{...t,duration_ms:A(r),outcome:`error`,status_code:le(n)}),n}}function de(e,t){s(`superagent.multiconversation.selection`,{outcome:e,target:t})}function fe(e,t){s(`superagent.multiconversation.conversation_ready`,{...t,duration_ms:A(e)})}var pe=class{constructor(){this.turns=new Map}take(e,t){let n=this.turns.get(e),r=t?n?.findIndex(e=>e.id===t):0;if(!n||r===void 0||r<0)return;let i=n[r],a=n.filter((e,t)=>t!==r);return a.length>0?this.turns.set(e,a):this.turns.delete(e),i}start(e,t){let n=this.turns.has(e)?this.turns.size:this.turns.size+1,r=n>=3?`3+`:`${n}`,i=this.turns.get(e)??[];this.turns.set(e,[...i,{concurrencyBucket:r,id:t,startedAt:k()}])}finish(e,t){let n=this.take(e,t.turnId);n&&s(`superagent.multiconversation.turn_completed`,{completion_source:t.completionSource,concurrency_bucket:n.concurrencyBucket,duration_ms:A(n.startedAt),foreground:t.foreground,outcome:t.outcome})}discard(e,t){this.take(e,t)}abandon(e,t){for(;this.turns.get(e)?.length;)this.finish(e,{completionSource:`stop`,foreground:t,outcome:`abandoned`})}},me=20,he=`agentConversations`,ge=`agentConversation`;function M(e){return[he,e,`direct`]}function N(e,t=`active`){return[...M(e),t]}function P(e,t){return[ge,e,t]}function F({appId:e,builderConversation:t,enabled:n,filter:r=`active`}){return o({queryKey:N(e,r),initialPageParam:``,queryFn:({pageParam:e,signal:n})=>{let i=e||void 0;return j(`list_load`,{phase:i?`load_more`:`initial`},()=>t.getConversationsV2({limit:me,cursor:i,...r===`archived`&&{isArchived:!0}},{signal:n}))},getNextPageParam:e=>e.next_cursor||void 0,enabled:n&&!!e&&!!t,...f.DEFAULT})}function I({appId:e,builderConversation:t}){let n=i();return a({mutationFn:e=>j(`create`,{},()=>t.createConversationV2(e)),onSuccess:t=>{n.setQueryData(P(e,t.id),t),n.setQueryData(N(e,`active`),e=>{let n=e?.pages[0];return!e||!n?{pages:[{items:[t],next_cursor:null}],pageParams:[``]}:{...e,pages:[{...n,items:[t,...n.items.filter(e=>e.id!==t.id)]},...e.pages.slice(1)]}})}})}function L({appId:e,builderConversation:t}){let n=i();return a({mutationFn:({conversationId:e,payload:n})=>t.updateConversation(e,n),onSuccess:(t,{conversationId:r,payload:i})=>{n.setQueryData(P(e,r),e=>e&&{...e,...i});for(let t of[`active`,`archived`])n.setQueryData(N(e,t),e=>e&&{...e,pages:e.pages.map(e=>({...e,items:i.is_archived!==void 0&&i.is_archived!==(t===`archived`)?e.items.filter(e=>e.id!==r):e.items.map(e=>e.id===r?{...e,...i}:e)}))});n.invalidateQueries({queryKey:M(e)})}})}var R=e(n()),_e=[`agents/`,`config/`,`hooks/`,`knowledge/`,`projects/`,`rules/`,`skills/`,`team/`],z=3e4,B=null,V=null,H=(e,t)=>`${e??`anonymous`}:${t}`;function ve(e){V=e??null}function ye(e,t,n=z){return!t||!B||B.ownerKey!==H(e,t)||g.rawFilePaths.length===0?!1:Date.now()-B.at<n}async function U(e,t){if(!e)return;let n=H(t,e);g.loadingFiles=!0;try{let t=await _.listFiles({appId:e,path:`.`,includeAll:!0});if(V!==null&&V!==e)return;let r=(t?.files||[]).filter(e=>!O.has(e.path.split(`/`).pop()||``)&&!D(e.path)),i=r.map(e=>e.path),{tree:a,fileCount:o,folderCount:s}=E(r);g.setFileTree({tree:a,fileCount:o,folderCount:s,rawFilePaths:i,failed:!1}),B={ownerKey:n,at:Date.now()}}catch{if(V!==null&&V!==e)return;let{tree:t,fileCount:n,folderCount:r}=E(T(_e));g.setFileTree({tree:t,fileCount:n,folderCount:r,rawFilePaths:[],failed:!0}),B=null}finally{(V===null||V===e)&&(g.loadingFiles=!1)}}var be=80,xe=12e3,Se=500,Ce=2,we=.02,Te=1.25;function W(){return{height:280,lastGrowth:0,lastRatio:0,lastReportAt:0,rejectedHeight:0,retryUsed:!1}}function Ee(e,t,n){let r=Math.ceil(t),i=Math.min(Math.max(be,r),xe),a=r-e.height,o=r/e.height,s=Math.abs(a-e.lastGrowth)<=Ce,c=o>=Te&&Math.abs(o-e.lastRatio)<=we,l=n-e.lastReportAt<=Se;return a>0&&(s||c)&&l?{height:e.height,lastGrowth:a,lastRatio:o,lastReportAt:n,rejectedHeight:e.retryUsed?e.rejectedHeight:i,retryUsed:!0}:{height:i,lastGrowth:a,lastRatio:o,lastReportAt:n,rejectedHeight:0,retryUsed:l&&e.retryUsed&&!e.rejectedHeight}}function De(e,t){return e.rejectedHeight?{...e,height:e.rejectedHeight,lastReportAt:t,rejectedHeight:0,retryUsed:!0}:e}async function Oe(e,t,n){let r=e.payload;switch(e.type){case`link`:{let e=r?.url;return typeof e!=`string`||!S(e)?(n.error(t(`agentEditor.files.artifactUnsafeLink`)),null):(window.open(e,`_blank`,`noopener,noreferrer`),null)}case`prompt`:{let e=r?.prompt;if(typeof e==`string`&&e.trim()){let r=(g.inputMessage??``).trim();g.inputMessage=r?`${r}\n\n${e}`:e,n.info(t(`agentEditor.files.artifactPromptAdded`))}return null}case`notify`:{let e=r?.message;return typeof e==`string`&&e&&n(e),null}case`tool`:case`intent`:return n.info(t(`agentEditor.files.artifactActionUnsupported`)),null;default:return null}}var G=480,ke=[[`sm`,640],[`md`,768],[`lg`,1024]],Ae=[`screen`,`dvh`,`svh`,`lvh`,`\\[100vh\\]`,`\\[100dvh\\]`],K=(e,t)=>Ae.map(n=>`.${t&&`${t}\\:`}${e}-${n}`).join(`, `),je=[`${K(`min-h`,``)}, [style*="min-height:100vh"], [style*="min-height: 100vh"] { min-height: ${G}px !important; }`,`${K(`h`,``)}, [style^="height:100vh"], [style^="height: 100vh"],
[style*=";height:100vh"], [style*="; height:100vh"],
[style*=";height: 100vh"], [style*="; height: 100vh"] { height: ${G}px !important; }`,...ke.map(([e,t])=>`@media (min-width: ${t}px) {
${K(`min-h`,e)} { min-height: ${G}px !important; }
${K(`h`,e)} { height: ${G}px !important; }
}`)].join(`
`),Me={background:`38 27% 94%`,foreground:`0 0% 4%`,card:`0 0% 100%`,cardForeground:`0 0% 4%`,popover:`0 0% 100%`,popoverForeground:`0 0% 4%`,primary:`21 42% 55%`,primaryForeground:`0 0% 100%`,secondary:`0 0% 96%`,secondaryForeground:`0 0% 9%`,muted:`39 17% 93%`,mutedForeground:`0 0% 45%`,accent:`0 0% 96%`,accentForeground:`0 0% 9%`,destructive:`0 84% 60%`,destructiveForeground:`0 0% 98%`,border:`0 0% 98%`,input:`0 0% 98%`,ring:`21 42% 55%`},Ne={background:`220 5% 11%`,foreground:`0 0% 99%`,card:`0 1% 14%`,cardForeground:`0 0% 99%`,popover:`0 1% 14%`,popoverForeground:`0 0% 99%`,primary:`21 42% 55%`,primaryForeground:`0 0% 99%`,secondary:`0 0% 18%`,secondaryForeground:`0 0% 99%`,muted:`0 0% 18%`,mutedForeground:`0 0% 65%`,accent:`0 0% 18%`,accentForeground:`0 0% 99%`,destructive:`0 62% 30%`,destructiveForeground:`0 0% 99%`,border:`0 0% 16%`,input:`0 0% 16%`,ring:`21 42% 55%`},Pe=`'WixMadeforText', 'Wix Madefor Text', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,Fe=`'WixMadeforMonospace', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`,Ie=`<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Wix+Madefor+Text:wght@400;500;600;700&display=swap">`;function q(e){return[`--background: ${e.background};`,`--foreground: ${e.foreground};`,`--card: ${e.card};`,`--card-foreground: ${e.cardForeground};`,`--popover: ${e.popover};`,`--popover-foreground: ${e.popoverForeground};`,`--primary: ${e.primary};`,`--primary-foreground: ${e.primaryForeground};`,`--secondary: ${e.secondary};`,`--secondary-foreground: ${e.secondaryForeground};`,`--muted: ${e.muted};`,`--muted-foreground: ${e.mutedForeground};`,`--accent: ${e.accent};`,`--accent-foreground: ${e.accentForeground};`,`--destructive: ${e.destructive};`,`--destructive-foreground: ${e.destructiveForeground};`,`--border: ${e.border};`,`--input: ${e.input};`,`--ring: ${e.ring};`].join(`
  `)}function Le(e=!0){let t=e?`overflow: auto !important;`:`overflow: hidden !important;`,n=e?`background: hsl(var(--background)) !important;`:`background: transparent !important;`,r=e?`
  color-scheme: light;`:``,i=e?`
  color-scheme: dark;`:``;return`<style id="__base44_editor_theme__">
:root {
  ${q(Me)}
  --radius: 0.5rem;${r}
}
.dark {
  ${q(Ne)}${i}
}
*, *::before, *::after { box-sizing: border-box; }
/* shadcn's base layer: default every element's border-color to the theme
   token. Without this, Tailwind's bare \`border\` utility only sets width and
   the color falls back to currentColor (near-black text) — so the model's
   \`border\` cards render heavy/dark and the \`--border\` value is ignored.
   Explicit \`border-{color}\` utilities and inline styles still override. */
*, *::before, *::after { border-color: hsl(var(--border)); }
html, body {
  margin: 0 !important;
  padding: 0;
  ${t}
  /* Inline card: transparent, so the real chat surface (a gradient, not the
     single flat \`--background\` stop) shows straight through and the artifact
     reads as inline chat content in both themes. Standalone saved file: opaque
     \`--background\` so it stays readable on its own page. \`--card\` stays
     elevated for emphasis blocks (stat tiles, panels) so hierarchy reads. */
  ${n}
  color: hsl(var(--foreground));
  font-family: ${Pe};
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
/* 8px (vs 16px) — minimal breathing room from the iframe edge so tightly-composed
   dashboards don't ship a fat empty halo before their first element. */
body { padding: 8px; }
${e?``:je}
code, kbd, pre, samp { font-family: ${Fe}; }
a { color: hsl(var(--primary)); }
hr { border: 0; border-top: 1px solid hsl(var(--border)); }
h1, h2, h3, h4, h5, h6 { font-weight: 600; color: hsl(var(--foreground)); }
</style>`}var Re=`<script id="__base44_tw_config__">
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      // A bare \`border\` / \`divide-*\` (no color) falls back to Tailwind
      // preflight's DEFAULT, which is a FIXED gray-200 (#e5e7eb) — subtle on the
      // light card but near-white glare on the dark card. The \`colors.border\`
      // map above only creates the \`border-border\` class; it does NOT set the
      // uncolored default. Point the DEFAULT at the theme token so an uncolored
      // border adapts to dark mode like the rest of the palette. (Explicit
      // \`border-primary\` etc. still override.)
      borderColor: { DEFAULT: 'hsl(var(--border))' },
      divideColor: { DEFAULT: 'hsl(var(--border))' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        // Same two-name stack as \`FONT_SANS_STACK\` above. The
        // sandboxed null-origin iframe lands on \`Wix Madefor Text\`
        // (Google Fonts' name); \`WixMadeforText\` is here only for
        // defense-in-depth in case the iframe ever runs same-origin.
        sans: ['WixMadeforText', 'Wix Madefor Text', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['WixMadeforMonospace', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
};
<\/script>
<script src="https://cdn.tailwindcss.com" id="__base44_tw_cdn__"><\/script>`,ze=`<script id="__base44_artifact_popup_hardening__">
(function () {
  var nativeOpen = typeof window.open === 'function' ? window.open.bind(window) : null;
  function safePopupUrl(url) {
    if (typeof url !== 'string' || !url) return null;
    try {
      var parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
    } catch (e) {
      return null;
    }
  }
  function mergeRel(anchor) {
    var current = (anchor.getAttribute('rel') || '').split(/\\s+/).filter(Boolean);
    if (current.indexOf('noopener') === -1) current.push('noopener');
    if (current.indexOf('noreferrer') === -1) current.push('noreferrer');
    anchor.setAttribute('rel', current.join(' '));
  }
  function closestAnchor(target) {
    if (!target) return null;
    var el = target.nodeType === 1 ? target : target.parentElement;
    return el && el.closest ? el.closest('a[href],a[xlink\\:href]') : null;
  }
  function linkTarget(anchor) {
    var target = (anchor.getAttribute('target') || '').toLowerCase();
    if (target) return target;
    var base = document.querySelector('base[target]');
    return base ? (base.getAttribute('target') || '').toLowerCase() : '';
  }
  function linkHref(anchor) {
    var attr = anchor.getAttribute('href') || anchor.getAttribute('xlink:href');
    if (attr) return attr;
    if (typeof anchor.href === 'string') return anchor.href;
    if (anchor.href && typeof anchor.href.baseVal === 'string') return anchor.href.baseVal;
    return '';
  }
  function hasDownload(anchor) {
    return typeof anchor.hasAttribute === 'function' && anchor.hasAttribute('download');
  }
  function withNoopener(features) {
    var parts = typeof features === 'string' && features
      ? features.split(',').map(function (part) { return part.trim(); }).filter(Boolean)
      : [];
    var keys = parts.map(function (part) { return part.split('=')[0].toLowerCase(); });
    if (keys.indexOf('noopener') === -1) parts.push('noopener');
    if (keys.indexOf('noreferrer') === -1) parts.push('noreferrer');
    return parts.join(',');
  }
  function openHardened(url, target, features) {
    if (!nativeOpen) return null;
    var safeUrl = safePopupUrl(url);
    if (!safeUrl) return null;
    return nativeOpen(safeUrl, target || '_blank', withNoopener(features));
  }
  function hardenAnchor(anchor) {
    try { mergeRel(anchor); } catch (e) {}
    try { anchor.setAttribute('referrerpolicy', 'no-referrer'); } catch (e) {}
  }
  function handleAnchorOpen(event) {
    if (event.defaultPrevented) return;
    if (event.type === 'click' && event.button !== 0) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    var anchor = closestAnchor(event.target);
    if (!anchor || linkTarget(anchor) !== '_blank') return;
    hardenAnchor(anchor);
    if (hasDownload(anchor)) return;
    event.preventDefault();
    return openHardened(linkHref(anchor), '_blank');
  }
  function handleAnchorContextMenu(event) {
    var anchor = closestAnchor(event.target);
    if (!anchor || linkTarget(anchor) !== '_blank') return;
    hardenAnchor(anchor);
    if (!safePopupUrl(linkHref(anchor))) event.preventDefault();
  }
  function preflightAnchorOpen(event) {
    if (event.defaultPrevented) return;
    if (event.type === 'click' && event.button !== 0) return;
    if (event.type === 'auxclick' && event.button !== 1) return;
    var anchor = closestAnchor(event.target);
    if (!anchor || linkTarget(anchor) !== '_blank') return;
    if (!safePopupUrl(linkHref(anchor))) {
      event.preventDefault();
      return;
    }
    hardenAnchor(anchor);
  }
  document.addEventListener('click', preflightAnchorOpen, true);
  document.addEventListener('auxclick', preflightAnchorOpen, true);
  function bindLinkHandlers() {
    document.addEventListener('click', handleAnchorOpen, false);
    document.addEventListener('auxclick', handleAnchorOpen, false);
    document.addEventListener('contextmenu', handleAnchorContextMenu, false);
  }
  setTimeout(bindLinkHandlers, 0);
  function safeOpen(url, target, features) {
    if (url == null || !nativeOpen) return null;
    var targetName = target == null || target === '' ? '_blank' : String(target);
    var normalizedTarget = targetName.toLowerCase();
    if (normalizedTarget === '_self' || normalizedTarget === '_parent' || normalizedTarget === '_top') {
      return nativeOpen(String(url), targetName, features);
    }
    return openHardened(String(url), targetName, features);
  }
  try {
    Object.defineProperty(window, 'open', {
      value: safeOpen,
      configurable: false,
      writable: false
    });
  } catch (e) {
    window.open = safeOpen;
  }
})();
<\/script>`,Be=`<script id="__base44_artifact_height_reporter__">
(function () {
  var raf = null;
  function send() {
    raf = null;
    var h = Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement ? document.documentElement.scrollHeight : 0
    );
    try { parent.postMessage({ type: 'ui-size-change', payload: { height: h } }, '*'); } catch (e) {}
  }
  function schedule() { if (raf == null) raf = requestAnimationFrame(send); }
  if (document.readyState !== 'loading') schedule();
  document.addEventListener('DOMContentLoaded', schedule);
  window.addEventListener('load', schedule);
  if (typeof ResizeObserver !== 'undefined') {
    var ro = new ResizeObserver(schedule);
    function attach() { if (document.body) ro.observe(document.body); }
    if (document.body) attach(); else document.addEventListener('DOMContentLoaded', attach);
  }
})();
<\/script>`;function J(e,t){return`<script id="${t}">document.documentElement.classList.${e?`add`:`remove`}('dark');<\/script>`}function Ve(e){return((e.match(/<html\b[^>]*>/i)?.[0])?.match(/\bdir\s*=\s*["']?(rtl|ltr|auto)\b/i)?.[1])?.toLowerCase()??`auto`}var Y=`<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval' https: data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none'">`;function X(e,t,n={}){let r=[Y,n.preserveBrandStyles?``:J(t,`__base44_dark_class__`),n.hardenPopups?ze:``,n.preserveBrandStyles?``:Ie,n.preserveBrandStyles?``:Le(!n.reportHeight),n.preserveBrandStyles?``:Re,n.reportHeight?Be:``].filter(Boolean).join(`
`);return`<!doctype html><html dir="${Ve(e)}"><head>${r}</head><body>${e}${n.preserveBrandStyles?``:J(t,`__base44_dark_class_post__`)}</body></html>`}var Z=t();function He(e){let t=5381;for(let n=0;n<e.length;n++)t=(t<<5)+t+e.charCodeAt(n)|0;return Math.abs(t).toString(36).slice(0,6)}var Ue=64;function Q(e){let t=e.replace(/^ui:\/\/artifact\//,``)||`artifact`,n=t.replace(/[^a-zA-Z0-9._-]/g,`-`).slice(0,Ue);return`artifacts/${n}${n===t?``:`-${He(t)}`}.html`}function $({artifact:e,isDarkMode:t,appId:n,preserveBrandStyles:i=!1}){let{t:a}=r(),o=se(),s=ae(),{isDark:d,portal:f}=ce(),p=e._meta?.title||a(`agentEditor.files.artifactFallbackTitle`),h=(0,R.useRef)(null),[v,b]=(0,R.useState)(280),x=(0,R.useRef)(W()),S=(0,R.useRef)(0),[T,E]=(0,R.useState)(!1),D=(0,R.useMemo)(()=>X(e.text,t,{reportHeight:!0,hardenPopups:!0,preserveBrandStyles:i}),[e.text,t,i]),O=(0,R.useMemo)(()=>X(e.text,t,{preserveBrandStyles:i,hardenPopups:i}),[e.text,t,i]);return(0,R.useEffect)(()=>{x.current=W(),clearTimeout(S.current),S.current=0,b(280)},[e.text]),(0,R.useEffect)(()=>()=>clearTimeout(S.current),[]),(0,R.useEffect)(()=>{let e=e=>{let t=h.current?.querySelector(`iframe`);if(!t||e.source!==t.contentWindow)return;let n=e.data;if(!(!n||typeof n.type!=`string`)){if(n.type===`ui-size-change`){let e=n.payload?.height;if(typeof e!=`number`||!Number.isFinite(e))return;x.current=Ee(x.current,e,Date.now()),b(x.current.height),x.current.rejectedHeight&&!S.current&&(S.current=window.setTimeout(()=>{S.current=0,x.current=De(x.current,Date.now()),b(x.current.height)},600));return}C.has(n.type)&&Oe(n,a,o)}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[a,o]),(0,Z.jsxs)(`div`,{ref:h,className:`group relative w-full overflow-hidden rounded-xl`,style:{height:v},children:[(0,Z.jsx)(`iframe`,{title:p,srcDoc:D,sandbox:w,className:`h-full w-full border-0`,style:{background:`transparent`}}),n&&(0,Z.jsxs)(ne,{children:[(0,Z.jsx)(re,{asChild:!0,children:(0,Z.jsx)(`button`,{type:`button`,disabled:T,"aria-label":a(`agentEditor.files.artifactActions`),title:a(`agentEditor.files.artifactActions`),className:`absolute top-2 right-2 ${s?`opacity-100`:`opacity-0 group-hover:opacity-100 focus-visible:opacity-100`} transition-opacity ${y.bgCard} ${y.textPrimary} border ${y.border} backdrop-blur-sm rounded-md p-1.5 disabled:opacity-50`,children:T?(0,Z.jsx)(c,{className:`h-3.5 w-3.5 animate-spin`,"aria-hidden":!0}):(0,Z.jsx)(u,{className:`h-3.5 w-3.5`,"aria-hidden":!0})})}),(0,Z.jsxs)(te,{align:`end`,collisionPadding:16,className:`agent-editor font-base44 min-w-[160px] ${f.bg} ${f.border} ${f.shadow} ${d?`dark`:``}`,children:[(0,Z.jsxs)(m,{onSelect:()=>{let t=Q(e.uri).replace(/^artifacts\//,``),n=new Blob([O],{type:`text/html`});oe(n,t)},children:[(0,Z.jsx)(l,{className:`mr-2 h-4 w-4`}),a(`agentEditor.files.downloadArtifact`)]}),(0,Z.jsxs)(m,{onSelect:async()=>{if(!n||T)return;let t=Q(e.uri);E(!0);try{await _.writeFile({appId:n,path:t,content:O}),o.success(a(`agentEditor.files.artifactSaved`,{path:t}),{mainButton:a(`agentEditor.files.viewArtifact`),onMain:()=>{g.openFilePath=t,g.sidebarTab=ie.Chat,g.browserPanelOpen=!1}}),U(n)}catch{o.error(a(`agentEditor.files.artifactSaveFailed`))}finally{E(!1)}},disabled:T,children:[(0,Z.jsx)(ee,{className:`mr-2 h-4 w-4`}),a(`agentEditor.files.saveArtifact`)]})]})]})]})}function We(){let[e,t]=(0,R.useState)(!1);return{previewOpen:e,openPreview:()=>t(!0),closePreview:()=>t(!1)}}function Ge({artifact:e,appId:t,isDarkMode:n}){let{t:i}=r(`grow-shell`),{previewOpen:a,openPreview:o,closePreview:s}=We(),c=e._meta?.title||i(`artifacts.fallbackTitle`),l=i(`artifacts.draft`);return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(h,{padding:`md`,children:(0,Z.jsxs)(d,{preset:`between`,gap:3,children:[(0,Z.jsxs)(d,{preset:`column`,gap:1,className:`min-w-0`,children:[(0,Z.jsx)(b,{"data-hook":`grow-artifact-title`,size:`small`,weight:`medium`,className:`break-words`,children:c}),(0,Z.jsx)(b,{size:`tiny`,tone:`secondary`,children:i(`artifacts.formatDraft`,{format:`HTML`})})]}),(0,Z.jsx)(x,{"data-hook":`grow-artifact-preview`,tone:`secondary`,size:`sm`,onClick:o,children:i(`artifacts.preview`)})]})}),a&&(0,Z.jsx)(p,{"data-testid":`grow-artifact-dialog`,open:!0,onClose:s,title:c,description:l,size:`large`,closeLabel:i(`artifacts.close`),bodyPadding:`none`,maxBodyHeight:`calc(100dvh - 160px)`,className:`agent-editor ${n?`dark`:``}`,children:(0,Z.jsx)(v.Provider,{value:!0,children:(0,Z.jsx)($,{artifact:e,appId:t,isDarkMode:n,preserveBrandStyles:!0})})})]})}export{U as a,M as c,L as d,pe as f,ye as i,F as l,de as m,$ as n,ve as o,fe as p,z as r,P as s,Ge as t,I as u};