import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{v as t,x as n}from"./vendor-react-BOOIA4XI.js";import{S as r,y as i}from"./vendor-data-DCUikwl_.js";import{S as a}from"./apiErrors-HeE0HITm.js";import{t as o}from"./utils-5ZRoP5r8.js";var s=e(n()),c=.001,l=1,u=`image/webp`,d=`poster.webp`,f=1440,p=8e3,m=4e3;function h(e){return e.type.startsWith(`video/`)||/\.(mp4|webm|mov)$/i.test(e.name)}function g(e,t){return new Promise((n,r)=>{let i=setTimeout(()=>r(Error(`capture timed out`)),t);e.then(e=>{clearTimeout(i),n(e)},e=>{clearTimeout(i),r(e)})})}async function _(e){let t=new Image,n=URL.createObjectURL(e);try{return await g(new Promise(e=>{t.onload=()=>e(t.naturalWidth&&t.naturalHeight?{width:t.naturalWidth,height:t.naturalHeight}:null),t.onerror=()=>e(null),t.src=n}),p)}finally{URL.revokeObjectURL(n)}}async function v(e,t){let n=document.createElement(`video`);n.muted=!0,n.playsInline=!0,n.preload=`auto`,n.style.cssText=`position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0`;let r=URL.createObjectURL(e);document.body.appendChild(n);try{return await new Promise(e=>{let i=null,a=setTimeout(()=>e(i),p);n.onerror=()=>{clearTimeout(a),e(i)},n.onloadedmetadata=()=>{clearTimeout(a);let r=n.videoWidth,o=n.videoHeight;if(!r||!o)return e(null);let s={width:r,height:o};if(i=s,!t)return e(s);let l=setTimeout(()=>e(s),m);n.onseeked=()=>{clearTimeout(l),e({...s,poster:b(n,r,o)})};try{n.currentTime=c}catch{clearTimeout(l),e(s)}},n.src=r})}finally{n.removeAttribute(`src`),n.load(),n.remove(),URL.revokeObjectURL(r)}}function y(e,t){let n=Math.max(e,t),r=n>f?f/n:1;return{w:Math.round(e*r),h:Math.round(t*r)}}function b(e,t,n){try{let{w:r,h:i}=y(t,n),a=document.createElement(`canvas`);a.width=r,a.height=i;let o=a.getContext(`2d`);if(!o)return;o.drawImage(e,0,0,r,i);let s=a.toDataURL(u,l);return s.startsWith(`data:${u}`)?x(s,d):void 0}catch{return}}function x(e,t){let[n,r]=e.split(`,`),i=n.slice(n.indexOf(`:`)+1,n.indexOf(`;`)),a=atob(r),o=new Uint8Array(a.length);for(let e=0;e<a.length;e+=1)o[e]=a.charCodeAt(e);return new File([o],t,{type:i})}async function S(e,{withPoster:t=!0}={}){try{return h(e)?await v(e,t):await _(e)}catch{return null}}var C=16/9,w=.8,T=2.8;function E(e){return Math.min(Math.max(e,w),T)}var D={snug:13,roomy:24,generous:32},O=.5;function k(e,t=0){let n=Math.abs(E(e)-e)<O?D.snug:D.roomy;return Math.max(t,n)}function A(e,t){if(!e.width||!e.height)return;let n=Math.max(e.width,e.height*t);return{maxWidth:n,maxHeight:n/t}}function j(e,t){let n=e&&t?e/t:0;return Number.isFinite(n)&&n>0?n:C}function M(e,t,n){let r=j(e.width,e.height),i=E(r),a=A(t,r);return a?Math.min(i,Math.max(w,(a.maxWidth+2*n)/360)):i}var N=`dc-issues`;function P(){return`<script>
    (function () {
      var post = function (issue) { issue.source = '${N}'; parent.postMessage(issue, '*'); };
      document.addEventListener('securitypolicyviolation', function (e) {
        post({ kind: 'blocked', message: (e.effectiveDirective || e.violatedDirective) + ' blocked ' + (e.blockedURI || 'inline code'), url: e.blockedURI, line: e.lineNumber || undefined });
      });
      window.addEventListener('error', function (e) {
        var el = e.target;
        if (el && el !== window) {
          var tag = (el.tagName || 'resource').toLowerCase(), url = el.src || el.href;
          post(url
            ? { kind: 'resource', message: 'Failed to load ' + tag, url: url }
            : { kind: 'error', message: 'An inline ' + tag + ' could not run because something it imports was blocked or failed to load' });
        } else {
          post({ kind: 'error', message: String(e.message || e.error), line: e.lineno || undefined });
        }
      }, true);
      window.addEventListener('unhandledrejection', function (e) {
        var r = e.reason;
        post({ kind: 'error', message: 'Unhandled rejection: ' + String((r && r.message) || r) });
      });
    })();
  <\/script>`}var F=`dc-frame`;function I(e,t=!1){return`<script>
    (function () {
      var loaded = false;
      var explored = ${!t};
      var seen = null;
      var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(function () { post(); }) : null;
      var observeContent = function () {
        if (!ro || !document.body) return;
        for (var i = 0; i < document.body.children.length; i++) ro.observe(document.body.children[i]);
      };
      // An element "paints" when a person can see it. Wrappers that paint nothing (a transparent
      // full-width section around a floating button) are skipped in favour of their children.
      var MEDIA = /^(img|svg|video|canvas|picture|iframe|input|textarea|select)$/i;
      // Computed colours are rgb()/rgba(); only an rgba() with a zero alpha is transparent (rgb(0, 0, 0) is black).
      var clear = function (color) { return !color || color === 'transparent' || (color.indexOf('rgba(') === 0 && color.slice(-4) === ', 0)'); };
      var paintsBox = function (cs) {
        return !clear(cs.backgroundColor) || cs.backgroundImage !== 'none' || cs.boxShadow !== 'none' ||
          (cs.borderStyle !== 'none' && parseFloat(cs.borderWidth) > 0 && !clear(cs.borderColor)) ||
          (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0);
      };
      var paints = function (el) {
        if (MEDIA.test(el.tagName)) return true;
        if (paintsBox(window.getComputedStyle(el))) return true;
        var before = window.getComputedStyle(el, '::before'), after = window.getComputedStyle(el, '::after');
        if ((before.content !== 'none' && paintsBox(before)) || (after.content !== 'none' && paintsBox(after))) return true;
        for (var n = el.firstChild; n; n = n.nextSibling) {
          if (n.nodeType === 3 && n.textContent.trim()) return true;
        }
        return false;
      };
      var visibleBox = function () {
        var box = { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity };
        var x = window.scrollX || 0, y = window.scrollY || 0;
        var visit = function (el, depth, clip) {
          var cs = window.getComputedStyle(el);
          // Hidden until hover (a tooltip at opacity 0) isn't part of the resting size.
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return;
          var r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0 && cs.display !== 'contents') return;
          var own = { l: r.left + x, t: r.top + y, r: r.right + x, b: r.bottom + y };
          // Slides scrolled out of a carousel's overflow box can't be seen, so they don't count.
          if (clip) own = { l: Math.max(own.l, clip.l), t: Math.max(own.t, clip.t), r: Math.min(own.r, clip.r), b: Math.min(own.b, clip.b) };
          var clippedAway = clip && (own.r <= own.l || own.b <= own.t);
          if (depth > 12 || paints(el)) {
            if (clippedAway) return;
            box.l = Math.min(box.l, own.l); box.t = Math.min(box.t, own.t);
            box.r = Math.max(box.r, own.r); box.b = Math.max(box.b, own.b);
            return;
          }
          var clips = (cs.overflowX && cs.overflowX !== 'visible') || (cs.overflowY && cs.overflowY !== 'visible');
          for (var i = 0; i < el.children.length; i++) visit(el.children[i], depth + 1, clips ? own : clip);
        };
        if (document.body) {
          for (var i = 0; i < document.body.children.length; i++) {
            var child = document.body.children[i];
            if (!/^(script|style|link|meta)$/i.test(child.tagName)) visit(child, 0, null);
          }
        }
        return box.r > box.l && box.b > box.t ? box : null;
      };
      var sizeOf = function (b) { return b ? { width: b.r - b.l, height: b.b - b.t } : null; };
      var area = function (b) { return (b.r - b.l) * (b.b - b.t); };
      var wait = function (ms) { return new Promise(function (done) { setTimeout(done, ms); }); };
      var fire = function (el, types) {
        types.forEach(function (type) { el.dispatchEvent(new MouseEvent(type, { bubbles: !/enter|leave|^focus$|^blur$/.test(type), view: window })); });
      };
      // Open states (a dropdown, a tooltip) count toward the size: hover and click each likely trigger.
      var exploreStates = function () {
        var rest = visibleBox();
        var screen = window.innerWidth * window.innerHeight;
        seen = rest;
        var take = function () {
          var b = visibleBox();
          if (!b) return;
          // A modal backdrop covering the screen isn't the component's size.
          if (rest && area(b) > 0.9 * screen && area(rest) < 0.5 * screen) return;
          seen = seen ? { l: Math.min(seen.l, b.l), t: Math.min(seen.t, b.t), r: Math.max(seen.r, b.r), b: Math.max(seen.b, b.b) } : b;
        };
        var triggers = Array.prototype.slice
          .call(document.querySelectorAll('button, [aria-expanded], [role=button], summary, [aria-haspopup], [tabindex]'))
          // Visible at rest only: open one level, not the toast a choice inside an open menu pops up.
          .filter(function (el) {
            var seenAtRest = el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : el.getClientRects().length;
            return seenAtRest && !el.closest('a[href]');
          })
          .slice(0, 20);
        // Focus events only, never a real focus(): that would pull keyboard focus out of the editor.
        // One trigger that throws is skipped; the rest are still opened.
        return triggers.reduce(function (chain, el) {
          return chain.then(function () {
            if (!el.isConnected) return;
            fire(el, ['pointerover', 'pointerenter', 'mouseover', 'mouseenter', 'focus', 'focusin']);
            return wait(300).then(function () {
              take();
              fire(el, ['pointerout', 'pointerleave', 'mouseout', 'mouseleave', 'blur', 'focusout']);
              if (typeof el.click === 'function') el.click();
              return wait(300);
            }).then(take);
          }).catch(function () {});
        }, Promise.resolve());
      };
      var post = function () {
        if (!loaded) return;
        var body = document.body;
        var minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
        if (body) {
          for (var i = 0; i < body.children.length; i++) {
            var r = body.children[i].getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            if (r.left < minL) minL = r.left;
            if (r.top < minT) minT = r.top;
            if (r.right > maxR) maxR = r.right;
            if (r.bottom > maxB) maxB = r.bottom;
          }
        }
        var hasBox = maxR > minL && maxB > minT;
        var left = hasBox ? minL : 0;
        var top = hasBox ? minT : 0;
        var width = hasBox ? maxR - minL : document.documentElement.scrollWidth;
        var height = hasBox ? maxB - minT : (body ? body.scrollHeight : document.documentElement.scrollHeight);
        parent.postMessage(
          {
            source: '${F}',
            type: 'size',
            token: ${JSON.stringify(e)},
            left: left + (window.scrollX || 0),
            top: top + (window.scrollY || 0),
            width: Math.ceil(width),
            height: Math.ceil(height),
            complete: document.readyState === 'complete' && explored,
            visible: sizeOf(explored && seen ? seen : visibleBox()),
          },
          '*'
        );
        observeContent();
      };
      var reveal = function () { loaded = true; post(); };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { requestAnimationFrame(reveal); });
      } else {
        requestAnimationFrame(reveal);
      }
      window.addEventListener('load', function () {
        post();
        if (explored) return;
        wait(500).then(exploreStates).catch(function () {}).then(function () { explored = true; post(); });
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(post);
      if (ro) {
        ro.observe(document.documentElement);
        if (document.body) ro.observe(document.body);
        observeContent();
      }
    })();
  <\/script>`}var L=[{id:`gsap`,src:`https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`,integrity:`sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt`},{id:`scrolltrigger`,src:`https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js`,integrity:`sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d`},{id:`motion`,src:`https://cdn.jsdelivr.net/npm/motion@10.18.0/dist/motion.umd.js`,integrity:`sha384-iq3kxdE7jSugWwBstQn0g4DqXwGKBhfK5Tq4P2n3vfIi3/TlLugRDsS+Sl1FFMHt`},{id:`swiper`,src:`https://cdn.jsdelivr.net/npm/swiper@11.2.6/swiper-element-bundle.min.js`,integrity:`sha384-fw7XzgFDtPhWC+3+rPvGg2iB/j2bkecvCRKb38zOFw6LuGWajKdL3WD8ajLipsQ2`},{id:`lottie`,src:`https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js`,integrity:`sha384-J8C0MvgX4WP58J4N2W99vCKd2J6z99ynOJ5bEfE6jeP7kVTW1drYtv/jzrxM5jbm`}],R=[`https://cdn.jsdelivr.net/npm/three@0.186.1/`],z=`https://cdn.tailwindcss.com`,B=[`<link rel="preconnect" href="https://fonts.googleapis.com" />`,`<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`].join(`
  `),V=[`default-src 'none'`,`script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' ${z} ${[...L.map(e=>e.src),...R].join(` `)}`,`style-src 'unsafe-inline' https:`,`img-src https: data:`,`font-src https: data:`,`connect-src 'none'`].join(`; `),H=L.map(e=>`<script src="${e.src}" integrity="${e.integrity}" crossorigin="anonymous"><\/script>`).join(`
  `),U=`dc-styles`;function W(){return`<script>
    (function () {
      var grab = function () {
        var css = Array.prototype.map
          .call(document.querySelectorAll('style:not([data-dc-host])'), function (s) { return s.textContent || ''; })
          .join('\\n');
        parent.postMessage({ source: '${U}', type: 'styles', css: css }, '*');
      };
      window.addEventListener('load', function () {
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(grab, 300); });
        else setTimeout(grab, 400);
      });
    })();
  <\/script>`}function G(e,{measure:t=!1,explore:n=!1,token:r=``,stylesCss:i=``,captureStyles:a=!1,interactive:o=!1,reportIssues:s=!1}={}){let c=i.trim().length>0,l=!c||o,u=i.replace(/<\/(style)/gi,`<\\/$1`),d=t?`html, body { margin: 0; padding: 0; background: transparent; }`:`html, body { margin: 0; padding: 0; background: #ffffff; min-height: 100%; }
    body > * { min-height: 100vh; box-sizing: border-box; }`;return`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="${V}" />
  ${s?P():``}
  ${B}
  ${l?`<script src="${z}"><\/script>`:``}
  ${H}
  <style data-dc-host>
    ${d}
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; }
    button { cursor: pointer; }
  </style>
  ${c?`<style>${u}</style>`:``}
</head>
<body>${e}${t?I(r,n):``}${a?W():``}</body>
</html>`}var K=50;function ee(e){if(!Array.isArray(e))return[];let t=[];for(let n of e){let e=typeof n?.id==`string`?n.id.trim():``,r=typeof n?.label==`string`?n.label.trim():``;if(e&&r&&t.push({id:e,label:r}),t.length>=K)break}return t}var q=1,J=640;function te(e,t,n){return e.height>t.height||e.height>n.height&&e.width<=n.width}function ne({pane:e,design:t,content:n,fitContainer:r,tall:i=!1,lockViewport:a=!1}){let o=n?.left??0,s=r?n?.width??t.width:t.width,c=a?Math.min(Math.max(0,o),t.width):o,l=a?Math.max(1,Math.min(o+s,t.width)-c):s,u=n?.top??0,d=r?n?.height??t.height:t.height,f=Math.max(0,e.width),p=Math.max(0,e.height),m=r&&!a?Math.min(Math.max(c+l,t.width),t.width*3):t.width;if(!r){let n=e.width>0?e.width/t.width:0;return{scale:n,frameWidth:m,frameHeight:n>0?Math.max(t.height,e.height/n):t.height,translateX:Math.round(e.width/2-n*(c+l/2)),translateY:Math.round(e.height/2-n*(u+d/2)),ready:n>0}}let h=f>0&&p>0;if(a){let r=h?Math.min(f/l,q):0,i=r>0?p/r:t.height,a=Math.min(Math.max(i,Math.min(t.height,J)),t.height),o=r*Math.max(0,Math.min(u+d,a)-u),s=o>p+1;return{scale:r,frameWidth:m,frameHeight:a,translateX:Math.round(e.width/2-r*(c+l/2)),translateY:Math.round(s?-r*u:e.height/2-r*u-o/2),...s&&{scrollHeight:Math.ceil(o)},ready:r>0&&n!==null}}if(i){let r=h?Math.min(f/l,q):0,i=r>0?p/r:t.height,a=u+d>i;return{scale:r,frameWidth:m,frameHeight:i,translateX:Math.round(e.width/2-r*(c+l/2)),translateY:a?0:Math.round(e.height/2-r*(u+d/2)),ready:r>0&&n!==null}}let g=h?Math.min(f/l,p/d,q):0;return{scale:g,frameWidth:m,frameHeight:Math.min(Math.max(u+d,t.height),t.height*3),translateX:Math.round(e.width/2-g*(c+l/2)),translateY:Math.round(e.height/2-g*(u+d/2)),ready:g>0&&n!==null}}function re({scale:e,translateX:t,translateY:n,frameWidth:r,frameHeight:i},a,o){let s=a??{left:0,top:0,width:r,height:i},c=Math.max(0,t+e*s.left),l=Math.max(0,n+e*s.top),u=Math.min(o.width,t+e*(s.left+s.width)),d=Math.min(o.height,n+e*(s.top+s.height));return{left:c,top:l,width:Math.max(0,u-c),height:Math.max(0,d-l)}}function ie(e,t){let[n,r]=(0,s.useState)({width:0,height:0});return(0,s.useEffect)(()=>{let t=e.current;if(!t)return;r({width:t.clientWidth,height:t.clientHeight});let n=new ResizeObserver(([e])=>{e&&r({width:e.contentRect.width,height:e.contentRect.height})});return n.observe(t),()=>n.disconnect()},[e,t]),n}function ae(e){let t=e;return t&&typeof t.width==`number`&&typeof t.height==`number`&&t.width>=1&&t.height>=1?{width:Math.ceil(t.width),height:Math.ceil(t.height)}:null}function oe(e,t){return e.token===t.token&&e.left===t.left&&e.top===t.top&&e.width===t.width&&e.height===t.height&&e.complete===t.complete&&e.visible?.width===t.visible?.width&&e.visible?.height===t.visible?.height}function se(e,t){let n=(0,s.useRef)(t);n.current=t;let r=e?.visible??e,i=e?.token??``,a=e?.complete??!1,o=r?.width??0,c=r?.height??0;(0,s.useEffect)(()=>{a&&o&&c&&n.current?.({width:o,height:c})},[i,o,c,a])}var Y=t(),ce=`dc-demo`,le=`dc-demo-host`,ue=2e4,de=1500,X=(0,s.forwardRef)(function({html:e,designWidth:t=1280,designHeight:n=800,interactive:r=!1,fitContainer:i=!1,className:a,title:c=`Component preview`,onDemoRegister:l,stylesCss:u=``,capturable:d=!1,lockViewport:f=!1,paneInsetClassName:p=`inset-6`,revealAfterLoad:m=!1,onShownChange:h,fitWidth:g=!1,onContentSize:_,explore:v=!1},y){let b=(0,s.useRef)(null),x=(0,s.useRef)(null),S=(0,s.useRef)(null),C=(0,s.useRef)(null),[w,T]=(0,s.useState)(!1),[E,D]=(0,s.useState)(null),O=(0,s.useRef)({key:``,id:0}),k=`${r}|${i}|${v}|${u}|${e}`;O.current.key!==k&&(O.current={key:k,id:O.current.id+1});let A=`g${O.current.id}`,j=(0,s.useRef)(A);j.current=A;let M=(0,s.useMemo)(()=>G(e,{measure:i,explore:v,token:A,stylesCss:u,interactive:r}),[e,i,v,A,u,r]);(0,s.useImperativeHandle)(y,()=>({runDemoAction:e=>S.current?.contentWindow?.postMessage({source:le,type:`run`,id:e},`*`),captureTarget:()=>C.current??S.current}),[]),(0,s.useEffect)(()=>{if(!l&&!i)return;let e=e=>{if(e.source!==S.current?.contentWindow)return;let r=e.data;if(l&&r?.source===ce&&r.type===`register`&&l(ee(r.actions)),i&&r?.source===`dc-frame`&&r.type===`size`&&r.token===j.current){let e=typeof r.height==`number`?r.height:0,i=typeof r.width==`number`?r.width:0;if(e>=1){let a=Math.min(e,ue,n*3),o=i>=1?i:t,s=typeof r.left==`number`?r.left:0,c=typeof r.top==`number`?r.top:0,l={token:j.current,left:s,top:c,width:o,height:a,complete:r.complete===!0,visible:ae(r.visible)};D(e=>e&&oe(e,l)?e:l)}}};return window.addEventListener(`message`,e),()=>window.removeEventListener(`message`,e)},[l,i,t]);let N=ie(i?x:b,i),P=E&&E.token===A?E:null;se(P,_);let F=(0,s.useRef)({token:``,tall:!1});F.current.token!==A&&(F.current={token:A,tall:!1}),P&&te(P,{height:n},N)&&(F.current={token:A,tall:!0});let I=g||F.current.tall,{scale:L,frameWidth:R,frameHeight:z,translateX:B,translateY:V,ready:H,scrollHeight:U}=ne({pane:N,design:{width:t,height:n},content:P,fitContainer:i,tall:I,lockViewport:f}),[W,K]=(0,s.useState)(!1);(0,s.useEffect)(()=>{if(!m||!H||w)return;let e=setTimeout(()=>K(!0),de);return()=>clearTimeout(e)},[m,H,w]);let[q,J]=(0,s.useState)(!1),X=m?q||H&&(w||W):H;(0,s.useEffect)(()=>{X&&J(!0)},[X]),(0,s.useEffect)(()=>{h?.(X)},[X,h]);let Z=(0,Y.jsx)(`iframe`,{ref:S,title:c,srcDoc:M,sandbox:`allow-scripts`,loading:`lazy`,onLoad:()=>{T(!0),l&&S.current?.contentWindow?.postMessage({source:le,type:`hello`},`*`)},style:{width:R,height:z,border:0,pointerEvents:r||I?`auto`:`none`,opacity:+!!X,transition:`opacity 150ms ease-out`,...i?{position:`absolute`,top:0,left:0,transform:`translate(${B}px, ${V}px) scale(${L})`,transformOrigin:`top left`}:{transform:`scale(${L})`,transformOrigin:`top left`}}});return(0,Y.jsx)(`div`,{ref:b,className:o(`relative h-full w-full overflow-hidden`,i?`bg-transparent`:`bg-white`,a),children:i?(0,Y.jsxs)(`div`,{ref:x,className:o(`absolute`,p,U?`overflow-y-auto overflow-x-hidden`:`overflow-hidden`,f&&`[scrollbar-gutter:stable_both-edges]`),children:[(0,Y.jsx)(`div`,{className:`relative`,style:U?{height:U}:void 0,children:Z}),d&&(0,Y.jsx)(`div`,{ref:C,"aria-hidden":!0,className:`pointer-events-none absolute`,style:re({scale:L,translateX:B,translateY:V,frameWidth:R,frameHeight:z},P,N)})]}):Z})}),Z=2097152,fe=(e,t)=>[`designed-component-source`,e,t??``],pe=(e,t)=>[`designed-component-styles`,e,t??``];async function Q(e){let t=await fetch(e,{headers:{Range:`bytes=0-2097151`}});if(!t.ok)throw Error(`HTTP ${t.status}`);return(await t.text()).slice(0,Z)}function me(e,t,n){let{data:r,isLoading:o,isError:s}=i({queryKey:fe(e,n),queryFn:()=>Q(e),enabled:t&&!!e,...a.STATIC});return{html:r??null,loading:o,error:s}}function he(e,t,n){let{data:r,isSuccess:o,isError:s}=i({queryKey:pe(e,n),queryFn:()=>Q(e),enabled:t&&!!e,...a.STATIC});return{css:r??``,ready:!e||o||s}}function ge(){let e=r();return(0,s.useCallback)((t,n)=>{if(t)return e.prefetchQuery({queryKey:fe(t,n),queryFn:()=>Q(t),...a.STATIC})},[e])}function _e(){let e=r();return(0,s.useCallback)((t,n)=>{if(t)return e.prefetchQuery({queryKey:pe(t,n),queryFn:()=>Q(t),...a.STATIC})},[e])}function ve(e){return/\.(gif|png|jpe?g|webp)$/i.test(e)}function $(e,t){return e&&t?e/t:null}function ye({title:e,sourceFileUrl:t,stylesUrl:n,videoUrl:r,posterUrl:i,videoWidth:a,videoHeight:l,contentWidth:u,contentHeight:d,updatedDate:f,hoverHintLabel:p,errorLabel:m,className:h,fit:g=`cover`,eager:_=!1}){let v=g===`natural`,y=g===`contain`,b=o(`h-full w-full`,y?`object-contain`:`object-cover`),x=(0,s.useRef)(null),S=(0,s.useRef)(null),[C,w]=(0,s.useState)(!1),[T,E]=(0,s.useState)(!1),[D,O]=(0,s.useState)(!1),[k,M]=(0,s.useState)(null);(0,s.useEffect)(()=>{M(null),O(!1)},[r]);let N=!!r,P=N&&ve(r),F=N&&!P&&!!i,I=!N&&!!i,L=$(a,l)??k,R=y&&N?A({width:u,height:d},L??j(a,l)):void 0,z=v&&L?{aspectRatio:String(L)}:R,B=v?o(`relative w-full`,!L&&`aspect-video`):`relative h-full w-full`;(0,s.useEffect)(()=>{let e=x.current;if(!e||C)return;let t=new IntersectionObserver((e,t)=>{e.some(e=>e.isIntersecting)&&(w(!0),t.disconnect())},{rootMargin:`200px`});return t.observe(e),()=>t.disconnect()},[C]);let{html:V,error:H}=me(t,!N&&!I&&C&&(T||_),f),U=ge(),W=_e(),G=()=>{U(t,f),W(n,f)};return(0,Y.jsx)(`div`,{ref:x,className:o(h,R&&`flex items-center justify-center`),onMouseEnter:()=>{E(!0),O(!1),G(),N&&!P&&S.current?.play().catch(()=>void 0)},onMouseLeave:()=>{E(!1),O(!1);let e=S.current;e&&!P&&!F&&(e.pause(),e.currentTime=c)},children:C?P?(0,Y.jsx)(`div`,{style:z,className:B,children:(0,Y.jsx)(`img`,{src:r,alt:e,className:b,onLoad:e=>M($(e.currentTarget.naturalWidth,e.currentTarget.naturalHeight))})}):I?(0,Y.jsx)(`div`,{style:z,className:B,children:(0,Y.jsx)(`img`,{src:i,alt:e,className:b,onLoad:e=>M($(e.currentTarget.naturalWidth,e.currentTarget.naturalHeight))})}):F?(0,Y.jsxs)(`div`,{style:z,className:B,children:[(0,Y.jsx)(`img`,{src:i,alt:e,className:o(b,T&&D&&`invisible`)}),T&&(0,Y.jsx)(`video`,{ref:S,src:`${r}#t=0.001`,muted:!0,loop:!0,playsInline:!0,autoPlay:!0,preload:`none`,className:o(b,`absolute inset-0`,!D&&`invisible`),onCanPlay:()=>O(!0)})]}):N?(0,Y.jsx)(`div`,{style:z,className:B,children:(0,Y.jsx)(`video`,{ref:S,src:`${r}#t=${c}`,muted:!0,loop:!0,playsInline:!0,preload:`metadata`,className:b,onLoadedMetadata:e=>M($(e.currentTarget.videoWidth,e.currentTarget.videoHeight))})}):(T||_)&&V?(0,Y.jsx)(`div`,{style:z,className:B,children:(0,Y.jsx)(X,{html:V,title:e,fitContainer:y})}):(T||_)&&H?(0,Y.jsx)(`div`,{style:z,className:o(B,`flex items-center justify-center text-xs text-red-500`),children:m}):(0,Y.jsx)(`div`,{style:z,className:o(B,`flex items-center justify-center px-3 text-center text-xs text-slate-400`),children:p}):(0,Y.jsx)(`div`,{style:z,className:o(B,!y&&`bg-slate-50`)})})}var be=/\s*\d+$/;function xe(e){return e?e.replace(be,``)||e:``}export{k as _,me as a,L as c,z as d,G as f,j as g,E as h,Q as i,R as l,D as m,ye as n,he as o,N as p,ve as r,X as s,xe as t,U as u,M as v,S as y};