import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{r as t}from"./backend-4ZrxM0vc.js";import{v as n,x as r}from"./vendor-react-BOOIA4XI.js";import{n as i}from"./I18nProvider-B89ak-oG.js";import{S as a,m as o,y as s}from"./vendor-data-DCUikwl_.js";import{$n as c,Di as l,Ir as u,Kt as d,Wo as f,_n as p,bn as m,cr as h}from"./vendor-ui-FLuz20Mc.js";import{n as g}from"./base-eBCdTrda.js";import{n as _}from"./AuthContext-BxpFUehZ.js";import{L as v,R as y,S as b,d as x}from"./apiErrors-HeE0HITm.js";import{Hu as S,K as C,Ku as ee,Nd as w,Sd as T,_a as te,ma as E,qo as D,vd as O,vr as k}from"./cant-radio.store-DV7XPNKK.js";import{t as ne}from"./DownloadImportSmall-BmTWzBhq.js";import{t as A}from"./text-TP5tdv_P.js";import{n as j}from"./accordion--tgUMr4l.js";import{r as M}from"./button-DRk8pJ1m.js";import{p as N,r as P}from"./useAppApiKeyAccess-lgW122mY.js";import{t as F}from"./badge-O72MkKOX.js";import{t as I}from"./input-BGQcMAkX.js";import{t as re}from"./checkbox-BRI8x5VD.js";import{t as ie}from"./CopyButton-DVshlV7E.js";import{d as ae}from"./DsSettingsModal-jKWE6nSC.js";import"./WorkspaceAccountKeyPolicyAPI-Cv_jKpOD.js";import{t as L}from"./useAgentEditorToast-BQKd3nHP.js";import{t as oe}from"./UpgradeRequiredOverlay-CRYPLz5I.js";var R=e(r()),z=new class extends g{getBaseURL(){return`/agents`}list(e){return this.axios.get(`/${e}/webhooks`)}create(e,t){return this.axios.post(`/${e}/webhooks`,t)}update(e,t,n){return this.axios.patch(`/${e}/webhooks/${t}`,n)}remove(e,t){return this.axios.delete(`/${e}/webhooks/${t}`)}test(e,t){return this.axios.post(`/${e}/webhooks/${t}/test`)}},B=[`message.created`,`message.completed`],V=I,H=re,U=F;function W(e){let{user:t}=_(),n=te(E.AGENT_WEBHOOKS),r=a(),[i,c]=(0,R.useState)(!1),[l,u]=(0,R.useState)(null),d=(0,R.useMemo)(()=>[`agent-webhooks`,e],[e]),f=s({queryKey:d,queryFn:()=>z.list(e),enabled:n,...b.DEFAULT}),p=()=>r.invalidateQueries({queryKey:d}),m=o({mutationFn:t=>z.create(e,t),onSuccess:()=>p()}),h=o({mutationFn:({webhookId:t,payload:n})=>z.update(e,t,n),onSuccess:()=>p()}),g=o({mutationFn:t=>z.remove(e,t),onSuccess:()=>p()}),v=t=>z.test(e,t),y=f.data??null,x=(y?.length||0)>=5,S=f.isError?C(f.error,`Failed to load webhooks`):null;return{hasAccess:n,userId:t?.id,webhooks:y,loadError:S,isLoading:f.isLoading,atLimit:x,showForm:i,setShowForm:c,newSecret:l,setNewSecret:u,createWebhook:e=>m.mutateAsync(e),updateWebhook:(e,t)=>h.mutateAsync({webhookId:e,payload:t}),deleteWebhook:e=>g.mutateAsync(e),testWebhook:v}}function G(e,t){t.error(C(e,`Request failed`))}var K=n();function q({onCreate:e,onCreated:t,onCancel:n}){let{t:r}=i(),a=L(),[o,s]=(0,R.useState)(``),[u,d]=(0,R.useState)(``),[f,p]=(0,R.useState)([`message.completed`]),[m,h]=(0,R.useState)(!1),[g,_]=(0,R.useState)(!1),v=e=>p(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]);return(0,K.jsxs)(`div`,{className:`border ${k.borderInput} rounded-lg p-4 space-y-3`,children:[(0,K.jsxs)(`div`,{className:`space-y-1`,children:[(0,K.jsx)(`label`,{className:`text-xs font-medium ${k.textSecondary}`,children:r(`agentEditor.apiDocsTab.webhooksTargetUrl`)}),(0,K.jsx)(V,{value:o,onChange:e=>s(e.target.value),placeholder:`https://your-app.example.com/hooks/base44`,className:`text-xs`})]}),(0,K.jsxs)(`div`,{className:`space-y-1`,children:[(0,K.jsx)(`label`,{className:`text-xs font-medium ${k.textSecondary}`,children:r(`agentEditor.apiDocsTab.webhooksDescriptionLabel`)}),(0,K.jsx)(V,{value:u,onChange:e=>d(e.target.value),placeholder:r(`agentEditor.apiDocsTab.webhooksDescriptionPlaceholder`),className:`text-xs`})]}),(0,K.jsxs)(`div`,{className:`space-y-1.5`,children:[(0,K.jsx)(`label`,{className:`text-xs font-medium ${k.textSecondary}`,children:r(`agentEditor.apiDocsTab.webhooksEventsLabel`)}),(0,K.jsx)(`div`,{className:`space-y-1.5`,children:B.map(e=>(0,K.jsxs)(`label`,{className:`flex items-center gap-2 text-xs cursor-pointer`,children:[(0,K.jsx)(H,{checked:f.includes(e),onCheckedChange:()=>v(e)}),(0,K.jsx)(`code`,{className:`font-mono ${k.textSecondary}`,children:e})]},e))})]}),(0,K.jsx)(`div`,{className:`border ${k.borderInput} rounded-md p-3 space-y-1.5`,children:(0,K.jsxs)(`label`,{className:`flex items-start gap-2 text-xs cursor-pointer`,children:[(0,K.jsx)(H,{checked:m,onCheckedChange:e=>h(!!e),className:`mt-0.5`}),(0,K.jsxs)(`div`,{className:`space-y-0.5`,children:[(0,K.jsxs)(`div`,{className:`font-medium ${k.textSecondary} flex items-center gap-1.5`,children:[(0,K.jsx)(c,{className:`h-3 w-3`}),r(`agentEditor.apiDocsTab.webhooksGenerateSecretLabel`)]}),(0,K.jsx)(`div`,{className:`text-[11px] ${k.textMuted}`,children:r(`agentEditor.apiDocsTab.webhooksGenerateSecretHint`)})]})]})}),(0,K.jsxs)(`div`,{className:`flex items-center justify-end gap-2 pt-1`,children:[(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:n,disabled:g,children:r(`agentEditor.apiDocsTab.webhooksCancel`)}),(0,K.jsxs)(x,{size:`sm`,onClick:async()=>{if(!o.trim()){a.error(r(`agentEditor.apiDocsTab.webhooksTargetRequired`));return}if(f.length===0){a.error(r(`agentEditor.apiDocsTab.webhooksEventsRequired`));return}_(!0);try{let n=await e({target_url:o.trim(),events:f,description:u.trim()||null,generate_secret:m});a.success(r(`agentEditor.apiDocsTab.webhooksCreated`)),t(n)}catch(e){G(e,a)}finally{_(!1)}},disabled:g,className:`gap-1.5`,children:[g&&(0,K.jsx)(l,{className:`h-3.5 w-3.5 animate-spin`}),r(`agentEditor.apiDocsTab.webhooksCreate`)]})]})]})}function se({error:e}){let{t}=i(),[n,r]=(0,R.useState)(!1),a=!!(e.response_body&&e.response_body.trim().length),o=e.attempted_at?new Date(e.attempted_at).toLocaleString():null,s=ce(e,t);return(0,K.jsxs)(`div`,{className:`mt-1 rounded ${k.errorBg||``} px-2 py-1.5 space-y-1`,children:[(0,K.jsxs)(`div`,{className:`text-[11px] ${k.errorText} font-medium flex items-center gap-1.5`,children:[(0,K.jsx)(p,{className:`h-3 w-3 flex-shrink-0`}),(0,K.jsx)(`span`,{className:`truncate`,children:t(`agentEditor.apiDocsTab.webhooksLastError`,{message:e.message})})]}),o&&(0,K.jsx)(`div`,{className:`text-[10px] ${k.textMuted}`,children:o}),s&&(0,K.jsx)(`div`,{className:`text-[11px] ${k.textSecondary}`,children:s}),a&&(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(`button`,{type:`button`,onClick:()=>r(e=>!e),className:`text-[11px] ${k.textMuted} ${k.hoverText} underline`,children:t(n?`agentEditor.apiDocsTab.webhooksHideResponse`:`agentEditor.apiDocsTab.webhooksShowResponse`)}),n&&(0,K.jsx)(`pre`,{className:`text-[11px] font-mono ${k.textSecondary} ${k.bgSubtle} rounded px-2 py-1.5 whitespace-pre-wrap break-all max-h-40 overflow-auto`,children:e.response_body})]})]})}function ce(e,t){return e.status_code===401||e.status_code===403?t(`agentEditor.apiDocsTab.webhooksHint401`):e.status_code===404?t(`agentEditor.apiDocsTab.webhooksHint404`):e.status_code&&e.status_code>=500?t(`agentEditor.apiDocsTab.webhooksHint5xx`):e.error_type===`ConnectTimeout`||e.error_type===`ReadTimeout`?t(`agentEditor.apiDocsTab.webhooksHintTimeout`):e.error_type===`ConnectError`?t(`agentEditor.apiDocsTab.webhooksHintConnect`):null}function le({disabled:e,busy:t,onTest:n,onEdit:r,onToggle:a,onDelete:o}){let{t:s}=i();return(0,K.jsxs)(`div`,{className:`flex items-center gap-1 flex-shrink-0`,children:[(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:n,disabled:t!==null,className:`h-7 px-2 gap-1`,title:s(`agentEditor.apiDocsTab.webhooksTest`),children:t===`test`?(0,K.jsx)(l,{className:`h-3 w-3 animate-spin`}):(0,K.jsx)(h,{className:`h-3 w-3`})}),(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:r,disabled:t!==null,className:`h-7 px-2`,title:s(`agentEditor.apiDocsTab.webhooksEdit`),children:(0,K.jsx)(u,{className:`h-3 w-3`})}),(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:a,disabled:t!==null,className:`h-7 px-2 text-[11px]`,children:t===`toggle`?(0,K.jsx)(l,{className:`h-3 w-3 animate-spin`}):s(e?`agentEditor.apiDocsTab.webhooksEnable`:`agentEditor.apiDocsTab.webhooksDisable`)}),(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:o,disabled:t!==null,className:`h-7 px-2 ${k.errorText}`,title:s(`agentEditor.apiDocsTab.webhooksDelete`),children:t===`delete`?(0,K.jsx)(l,{className:`h-3 w-3 animate-spin`}):(0,K.jsx)(m,{className:`h-3 w-3`})})]})}function ue({webhook:e,onUpdate:t,onCancel:n,onSaved:r,onSecretRevealed:a}){let{t:o}=i(),s=L(),[u,d]=(0,R.useState)(e.target_url),[f,p]=(0,R.useState)(e.description||``),[m,h]=(0,R.useState)(e.events),[g,_]=(0,R.useState)(null),v=e=>h(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e]),y=async()=>{if(!u.trim()){s.error(o(`agentEditor.apiDocsTab.webhooksTargetRequired`));return}if(m.length===0){s.error(o(`agentEditor.apiDocsTab.webhooksEventsRequired`));return}_(`save`);try{await t(e.id,{target_url:u.trim(),description:f.trim()||null,events:m}),s.success(o(`agentEditor.apiDocsTab.webhooksUpdated`)),r()}catch(e){G(e,s)}finally{_(null)}},b=async n=>{if(!(n===`disable`&&!confirm(o(`agentEditor.apiDocsTab.webhooksDisableSigningConfirm`)))){_(`signing`);try{let r=await t(e.id,{signing:n});n===`rotate`&&r.secret?(a(r.id,r.secret),s.success(o(`agentEditor.apiDocsTab.webhooksSigningRotated`))):n===`disable`&&s.success(o(`agentEditor.apiDocsTab.webhooksSigningDisabled`))}catch(e){G(e,s)}finally{_(null)}}};return(0,K.jsxs)(`li`,{className:`border ${k.borderInput} rounded-lg p-3 space-y-3`,children:[(0,K.jsxs)(`div`,{className:`space-y-1`,children:[(0,K.jsx)(`label`,{className:`text-xs font-medium ${k.textSecondary}`,children:o(`agentEditor.apiDocsTab.webhooksTargetUrl`)}),(0,K.jsx)(V,{value:u,onChange:e=>d(e.target.value),className:`text-xs`})]}),(0,K.jsxs)(`div`,{className:`space-y-1`,children:[(0,K.jsx)(`label`,{className:`text-xs font-medium ${k.textSecondary}`,children:o(`agentEditor.apiDocsTab.webhooksDescriptionLabel`)}),(0,K.jsx)(V,{value:f,onChange:e=>p(e.target.value),placeholder:o(`agentEditor.apiDocsTab.webhooksDescriptionPlaceholder`),className:`text-xs`})]}),(0,K.jsxs)(`div`,{className:`space-y-1.5`,children:[(0,K.jsx)(`label`,{className:`text-xs font-medium ${k.textSecondary}`,children:o(`agentEditor.apiDocsTab.webhooksEventsLabel`)}),(0,K.jsx)(`div`,{className:`space-y-1.5`,children:B.map(e=>(0,K.jsxs)(`label`,{className:`flex items-center gap-2 text-xs cursor-pointer`,children:[(0,K.jsx)(H,{checked:m.includes(e),onCheckedChange:()=>v(e)}),(0,K.jsx)(`code`,{className:`font-mono ${k.textSecondary}`,children:e})]},e))})]}),(0,K.jsxs)(`div`,{className:`border ${k.borderInput} rounded-md p-3 space-y-2`,children:[(0,K.jsxs)(`div`,{className:`text-xs font-medium ${k.textSecondary} flex items-center gap-1.5`,children:[(0,K.jsx)(c,{className:`h-3 w-3`}),o(`agentEditor.apiDocsTab.webhooksSigningSectionTitle`)]}),(0,K.jsx)(`div`,{className:`text-[11px] ${k.textMuted}`,children:e.has_secret?o(`agentEditor.apiDocsTab.webhooksSigningCurrentlyOn`):o(`agentEditor.apiDocsTab.webhooksSigningCurrentlyOff`)}),(0,K.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:e.has_secret?(0,K.jsxs)(K.Fragment,{children:[(0,K.jsxs)(x,{size:`sm`,variant:`outline`,onClick:()=>b(`rotate`),disabled:g!==null,className:`text-[11px] gap-1`,children:[g===`signing`&&(0,K.jsx)(l,{className:`h-3 w-3 animate-spin`}),o(`agentEditor.apiDocsTab.webhooksRotateSecret`)]}),(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:()=>b(`disable`),disabled:g!==null,className:`text-[11px] ${k.errorText}`,children:o(`agentEditor.apiDocsTab.webhooksDisableSigning`)})]}):(0,K.jsxs)(x,{size:`sm`,variant:`outline`,onClick:()=>b(`rotate`),disabled:g!==null,className:`text-[11px] gap-1`,children:[g===`signing`&&(0,K.jsx)(l,{className:`h-3 w-3 animate-spin`}),o(`agentEditor.apiDocsTab.webhooksEnableSigning`)]})})]}),(0,K.jsxs)(`div`,{className:`flex items-center justify-end gap-2 pt-1`,children:[(0,K.jsx)(x,{size:`sm`,variant:`ghost`,onClick:n,disabled:g===`save`,children:o(`agentEditor.apiDocsTab.webhooksCancel`)}),(0,K.jsxs)(x,{size:`sm`,onClick:y,disabled:g===`save`,className:`gap-1.5`,children:[g===`save`&&(0,K.jsx)(l,{className:`h-3.5 w-3.5 animate-spin`}),o(`agentEditor.apiDocsTab.webhooksSave`)]})]})]})}function de({webhook:e,onUpdate:t,onDelete:n,onTest:r,onSecretRevealed:a}){let{t:o}=i(),s=L(),[l,u]=(0,R.useState)(null),[p,m]=(0,R.useState)(!1),h=!!e.disabled_at;return p?(0,K.jsx)(ue,{webhook:e,onUpdate:t,onCancel:()=>m(!1),onSaved:()=>m(!1),onSecretRevealed:a}):(0,K.jsx)(`li`,{className:`border ${k.borderInput} rounded-lg p-3 space-y-2`,children:(0,K.jsxs)(`div`,{className:`flex items-start justify-between gap-3`,children:[(0,K.jsxs)(`div`,{className:`min-w-0 flex-1 space-y-1`,children:[(0,K.jsxs)(`div`,{className:`flex items-center gap-2 flex-wrap`,children:[(0,K.jsx)(`code`,{className:`text-xs font-mono ${k.textSecondary} truncate`,children:e.target_url}),h?(0,K.jsxs)(U,{variant:`outline`,className:`text-[10px] gap-1`,children:[(0,K.jsx)(d,{className:`h-2.5 w-2.5`}),o(`agentEditor.apiDocsTab.webhooksStatusDisabled`)]}):(0,K.jsxs)(U,{variant:`outline`,className:`text-[10px] gap-1`,children:[(0,K.jsx)(f,{className:`h-2.5 w-2.5`}),o(`agentEditor.apiDocsTab.webhooksStatusActive`)]}),e.has_secret&&(0,K.jsxs)(U,{variant:`outline`,className:`text-[10px] gap-1`,title:o(`agentEditor.apiDocsTab.webhooksSigningEnabled`),children:[(0,K.jsx)(c,{className:`h-2.5 w-2.5`}),o(`agentEditor.apiDocsTab.webhooksSigningEnabled`)]})]}),e.description&&(0,K.jsx)(`p`,{className:`text-[11px] ${k.textMuted}`,children:e.description}),(0,K.jsx)(`div`,{className:`flex flex-wrap gap-1`,children:e.events.map(e=>(0,K.jsx)(`span`,{className:`text-[10px] font-mono px-1.5 py-0.5 rounded ${k.bgSubtle} ${k.textSecondary}`,children:e},e))}),e.last_error?.message&&(0,K.jsx)(se,{error:e.last_error})]}),(0,K.jsx)(le,{disabled:h,busy:l,onTest:async()=>{u(`test`);try{let t=await r(e.id);t.ok?s.success(o(`agentEditor.apiDocsTab.webhooksTestOk`,{status:t.status_code??``})):s.error(t.error||o(`agentEditor.apiDocsTab.webhooksTestFailed`,{status:t.status_code??`?`}))}catch(e){G(e,s)}finally{u(null)}},onEdit:()=>m(!0),onToggle:async()=>{u(`toggle`);try{await t(e.id,{enabled:!!h}),s.success(o(h?`agentEditor.apiDocsTab.webhooksEnabled`:`agentEditor.apiDocsTab.webhooksDisabled`))}catch(e){G(e,s)}finally{u(null)}},onDelete:async()=>{if(confirm(o(`agentEditor.apiDocsTab.webhooksDeleteConfirm`))){u(`delete`);try{await n(e.id)}catch(e){G(e,s),u(null)}}}})]})})}function fe({secret:e,onDismiss:t}){let{t:n}=i();return(0,K.jsxs)(`div`,{className:`border ${k.borderInput} rounded-lg p-3 space-y-2 ${k.warningBg||``}`,children:[(0,K.jsxs)(`div`,{className:`flex items-start gap-2`,children:[(0,K.jsx)(p,{className:`h-4 w-4 mt-0.5 flex-shrink-0 ${k.warningText||k.textSecondary}`}),(0,K.jsxs)(`div`,{className:`flex-1 space-y-1`,children:[(0,K.jsx)(`p`,{className:`text-xs font-medium ${k.textSecondary}`,children:n(`agentEditor.apiDocsTab.webhooksSecretHeading`)}),(0,K.jsx)(`p`,{className:`text-[11px] ${k.textMuted}`,children:n(`agentEditor.apiDocsTab.webhooksSecretWarning`)})]}),(0,K.jsx)(`button`,{onClick:t,className:`${k.textMuted} ${k.hoverText}`,children:(0,K.jsx)(d,{className:`h-3.5 w-3.5`})})]}),(0,K.jsxs)(`div`,{className:`flex items-center gap-2 ${k.bgSubtle} rounded px-2 py-1.5`,children:[(0,K.jsx)(`code`,{className:`text-[11px] font-mono ${k.textSecondary} flex-1 break-all`,children:e}),(0,K.jsx)(ie,{text:e,title:n(`agentEditor.apiDocsTab.copy`),iconClassName:`h-3 w-3`})]}),(0,K.jsx)(`p`,{className:`text-[11px] ${k.textMuted}`,children:n(`agentEditor.apiDocsTab.webhooksSecretHowTo`)}),(0,K.jsx)(`pre`,{className:`${k.bgSubtle} rounded px-2 py-1.5 text-[11px] font-mono ${k.textSecondary} overflow-x-auto`,children:`// Node.js / Express — HMAC the RAW request body, never JSON.stringify(req.body)
import express from "express";
import crypto from "crypto";

app.post(
  "/hooks/base44",
  express.raw({ type: "application/json" }), // keeps body as a Buffer
  (req, res) => {
    const expected = "sha256=" + crypto
      .createHmac("sha256", process.env.WEBHOOK_SIGNING_SECRET)
      .update(req.body) // <- Buffer, raw bytes
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(req.header("x-base44-signature") || "");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).send("invalid signature");
    }
    const payload = JSON.parse(req.body.toString("utf8"));
    // ...
  },
);`})]})}function J({appId:e}){let{t}=i(),{hasAccess:n,userId:r,webhooks:a,loadError:o,isLoading:s,atLimit:c,showForm:l,setShowForm:u,newSecret:d,setNewSecret:f,createWebhook:p,updateWebhook:m,deleteWebhook:h,testWebhook:g}=W(e),_=`rounded-lg border border-[color:var(--sem-border-separator-default)] p-4 space-y-4`,y=(0,K.jsxs)(`div`,{children:[(0,K.jsx)(A,{as:`h4`,size:`small`,weight:`medium`,tone:`primary`,children:t(`agentEditor.apiDocsTab.webhooksManageTitle`)}),(0,K.jsx)(A,{as:`p`,size:`tiny`,tone:`secondary`,className:`mt-1`,children:t(`agentEditor.apiDocsTab.webhooksManageSubtitle`)})]});return n?(0,K.jsxs)(`div`,{className:_,children:[(0,K.jsxs)(`div`,{className:`flex items-start justify-between gap-4`,children:[y,(0,K.jsx)(M,{variant:`standard`,tone:`secondary`,size:`sm`,className:`flex-shrink-0`,prefixIcon:(0,K.jsx)(w,{}),onClick:()=>u(!l),disabled:c,children:t(`agentEditor.apiDocsTab.webhooksAddButton`)})]}),c&&(0,K.jsx)(`p`,{className:`text-xs ${k.textMuted}`,children:t(`agentEditor.apiDocsTab.webhooksAtLimit`,{max:5})}),l&&(0,K.jsx)(q,{onCreate:p,onCreated:e=>{e.secret&&f({id:e.id,secret:e.secret}),u(!1)},onCancel:()=>u(!1)}),d&&(0,K.jsx)(fe,{secret:d.secret,onDismiss:()=>f(null)}),o&&(0,K.jsx)(`p`,{className:`text-xs ${k.errorText}`,children:o}),s&&a===null&&!o&&(0,K.jsxs)(`div`,{className:`flex items-center gap-2 text-xs ${k.textMuted}`,children:[(0,K.jsx)(v,{size:`xs`}),t(`agentEditor.apiDocsTab.webhooksLoading`)]}),a&&a.length===0&&!l&&(0,K.jsx)(`p`,{className:`text-xs ${k.textMuted}`,children:t(`agentEditor.apiDocsTab.webhooksEmpty`)}),a&&a.length>0&&(0,K.jsx)(`ul`,{className:`space-y-2`,children:a.map(e=>(0,K.jsx)(de,{webhook:e,onUpdate:m,onDelete:h,onTest:g,onSecretRevealed:(e,t)=>f({id:e,secret:t})},e.id))})]}):(0,K.jsxs)(`div`,{className:`relative`,children:[(0,K.jsxs)(`div`,{className:`${_} blur-sm pointer-events-none select-none`,children:[(0,K.jsx)(`div`,{className:`flex items-start justify-between gap-4`,children:y}),(0,K.jsx)(`div`,{className:`border ${k.borderInput} rounded-lg p-3 h-20`}),(0,K.jsx)(`div`,{className:`border ${k.borderInput} rounded-lg p-3 h-20`})]}),(0,K.jsx)(oe,{title:t(`agentEditor.apiDocsTab.webhooksUpgradeTitle`),description:t(`agentEditor.apiDocsTab.webhooksUpgradeDescription`),position:`center`,trackingOrigin:`agent_webhooks_upgrade_overlay`,billingEntry:D,userId:r,appId:e})]})}function pe({appId:e,usesTokens:t,agentsBase:n,authHeader:r}){return`---
name: base44-superagent-${e}
description: Use /skill/agent to call this Base44 Superagent through its external Agent API.
---

# Base44 Superagent API — ${e}

Standalone reference. ${t?`Create a personal access token in your workspace and use it below`:`The API key below is scoped to your account`}; treat it as a secret.

Use this as a Claude-compatible agent skill. Trigger it when the user asks
to call this Superagent, mentions \`/skill/agent\`, or wants another agent
to delegate work to this Base44 agent.

## Base URL
\`\`\`
${n}
\`\`\`

## Authentication
${t?`Pass your token as a header. Tokens are refused in the query string.`:`Pass your API key as a header.`}

\`\`\`
${r}
\`\`\`
`}function me({agentsBase:e,authHeader:t,convPlaceholder:n}){return`
## Quick start
\`\`\`bash
# Create a conversation
curl -X POST "${e}/conversations" -H "${t}" -H "Content-Type: application/json" -d '{}'

# Send a message
curl -X POST "${e}/conversations/${n}/messages" -H "${t}" -H "Content-Type: application/json" \\
  -d '{"role":"user","content":"Hello!"}'
\`\`\`
`}function he({agentsManagementBase:e,authHeader:t}){return`
## Create from a shared template

Use a share URL generated from an existing Superagent. The clone is created in
the authenticated user's active workspace; pass \`X-Active-Workspace-Id\` to
target a specific workspace.

\`\`\`bash
curl -X POST "${e}/from-template" -H "${t}" -H "Content-Type: application/json" \\
  -H "X-Active-Workspace-Id: <workspace_id>" \\
  -d '{"template_url":"https://base44.com/clone-superagent-template/<template_token>"}'
\`\`\`
`}function ge({agentsBase:e,authHeader:t,convPlaceholder:n}){return`
## Conversations

\`\`\`bash
# POST /conversations — create
curl -X POST "${e}/conversations" -H "${t}" -H "Content-Type: application/json" -d '{}'

# GET /conversations — list
curl "${e}/conversations" -H "${t}"

# GET /conversations/{id} — fetch one
curl "${e}/conversations/${n}" -H "${t}"
\`\`\`
`}function _e({agentsBase:e,authHeader:t,convPlaceholder:n}){return`
## Messages

\`\`\`bash
# POST /conversations/{id}/messages — send
curl -X POST "${e}/conversations/${n}/messages" -H "${t}" -H "Content-Type: application/json" \\
  -d '{"role":"user","content":"Hello!","file_urls":[]}'

# DELETE /conversations/{id}/messages/{message_id}
curl -X DELETE "${e}/conversations/${n}/messages/{message_id}" -H "${t}"
\`\`\`
`}function ve({agentsBase:e,authHeader:t}){return`
## Memory

\`\`\`bash
# GET /memory — list
curl "${e}/memory" -H "${t}"

# DELETE /memory/{id}
curl -X DELETE "${e}/memory/{memory_id}" -H "${t}"
\`\`\`
`}function ye({appId:e}){return`
## Response format (conversation)

\`\`\`json
{
  "id": "conversation_id",
  "app_id": "${e}",
  "agent_name": "your_agent",
  "messages": [
    { "id": "msg_1", "role": "user", "content": "..." },
    { "id": "msg_2", "role": "assistant", "content": "..." }
  ]
}
\`\`\`
`}function be(e){let{agentsBase:t,authHeader:n,appId:r}=e;return`
## Webhooks

Subscribe an HTTPS endpoint to receive agent events. HMAC signing is **optional** —
pass \`"generate_secret": true\` when creating a webhook and the response will
include a \`secret\` field **once**. Store it; every subsequent delivery will
carry an \`X-Base44-Signature\` header you can verify.

### Events
- \`message.created\` — fired when a user message is received.
- \`message.completed\` — fired when the assistant's reply is ready.

### Request headers
- \`X-Base44-Event\` — event name.
- \`X-Base44-Delivery\` — unique per attempt; use it to dedupe retries.
- \`X-Base44-Signature\` — \`sha256=<hex>\` HMAC of the raw body (only when signing is enabled).

### Sample payload
\`\`\`json
{
  "event": "message.completed",
  "app_id": "${r}",
  "conversation_id": "conv_xyz",
  "timestamp": "2026-04-21T10:00:00Z",
  "data": {
    "message": { "id": "msg_123", "role": "assistant", "content": "Hi!" }
  }
}
\`\`\`

### Verify the signature

**HMAC the raw request bytes** (\`await req.text()\` / \`express.raw\`) — that's the
only fully reliable method. We sign the **compact** JSON body (no spaces,
unescaped UTF-8), which matches \`JSON.stringify(payload)\`, so if your runtime
only exposes a parsed body \`JSON.stringify(body)\` works as a best-effort
fallback. It can still differ on number formatting (e.g. Python \`1.0\` vs JS
\`1\`), so prefer raw bytes whenever the payload may contain numbers.

**Base44 functions / Deno (\`Deno.serve\` is the required Base44 entrypoint):**
\`\`\`js
Deno.serve(async (req) => {
  const raw = await req.text(); // exact signed bytes — don't re-parse first
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(Deno.env.get("WEBHOOK_SIGNING_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw));
  const expected =
    "sha256=" + [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  // Constant-time compare so verification can't be timing-probed.
  const a = new TextEncoder().encode(expected);
  const b = new TextEncoder().encode(req.headers.get("x-base44-signature") ?? "");
  const ok = a.length === b.length && a.reduce((acc, v, i) => acc | (v ^ b[i]), 0) === 0;
  if (!ok) return new Response("invalid signature", { status: 401 });
  const payload = JSON.parse(raw);
  return new Response(null, { status: 204 });
});
\`\`\`

**Node.js / Express:**
\`\`\`js
import express from "express";
import crypto from "crypto";

app.post(
  "/hooks/base44",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const expected = "sha256=" + crypto
      .createHmac("sha256", process.env.WEBHOOK_SIGNING_SECRET)
      .update(req.body)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(req.header("x-base44-signature") || "");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).send("invalid signature");
    }
    const payload = JSON.parse(req.body.toString("utf8"));
    res.sendStatus(204);
  },
);
\`\`\`

### Manage webhooks

\`\`\`bash
# Subscribe
curl -X POST "${t}/webhooks" -H "${n}" -H "Content-Type: application/json" \\
  -d '{"target_url":"https://your-app.example.com/hooks/base44","events":["message.completed"],"generate_secret":true}'

# List
curl "${t}/webhooks" -H "${n}"

# Update or re-enable
curl -X PATCH "${t}/webhooks/{webhook_id}" -H "${n}" -H "Content-Type: application/json" \\
  -d '{"events":["message.completed","message.created"],"enabled":true}'

# Test delivery
curl -X POST "${t}/webhooks/{webhook_id}/test" -H "${n}"

# Delete
curl -X DELETE "${t}/webhooks/{webhook_id}" -H "${n}"
\`\`\`

### Limits
Up to 5 webhooks per agent. After 20 consecutive failures a webhook is
auto-disabled; re-enable with \`PATCH {"enabled": true}\`.
`}function xe(e){let t={...e,authHeader:N(e.apiKey,e.usesTokens),convPlaceholder:`{conversation_id}`};return[pe(t),me(t),he(t),ge(t),_e(t),ve(t),be(t),ye(t)].join(`
`)}function Se(e,t){let n=new Blob([e],{type:`text/markdown;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=`superagent-${t}-SKILL.md`,document.body.appendChild(i),i.click(),document.body.removeChild(i),URL.revokeObjectURL(r)}function Ce({appId:e,agentsBase:t,authHeader:n,convId:r}){return{quickStartSendMessage:`curl -X POST "${t}/conversations/${r}/messages" \\
  -H "Content-Type: application/json" \\
  -H "${n}" \\
  -d '{
  "role": "user",
  "content": "Hello, how can you help me?"
}'`,createConversation:`curl -X POST "${t}/conversations" \\
  -H "Content-Type: application/json" \\
  -H "${n}" \\
  -d '{"metadata": {}}'`,listConversations:`curl "${t}/conversations" \\
  -H "${n}"`,getConversation:`curl "${t}/conversations/${r}" \\
  -H "${n}"`,sendMessageBody:`{
  "role": "user",
  "content": "Your message here",
  "file_urls": [],
  "additional_message_params": {}
}`,sendMessage:`curl -X POST "${t}/conversations/${r}/messages" \\
  -H "Content-Type: application/json" \\
  -H "${n}" \\
  -d '{"role": "user", "content": "Hello!"}'`,deleteMessage:`curl -X DELETE "${t}/conversations/${r}/messages/{message_id}" \\
  -H "${n}"`,listMemory:`curl "${t}/memory" \\
  -H "${n}"`,deleteMemory:`curl -X DELETE "${t}/memory/{memory_id}" \\
  -H "${n}"`,createWebhook:`curl -X POST "${t}/webhooks" \\
  -H "Content-Type: application/json" \\
  -H "${n}" \\
  -d '{
  "target_url": "https://your-app.example.com/hooks/base44",
  "events": ["message.completed"],
  "description": "Forward replies to my server",
  "generate_secret": true
}'`,listWebhooks:`curl "${t}/webhooks" \\
  -H "${n}"`,patchWebhook:`curl -X PATCH "${t}/webhooks/{webhook_id}" \\
  -H "Content-Type: application/json" \\
  -H "${n}" \\
  -d '{"events": ["message.completed", "message.created"], "enabled": true}'`,testWebhook:`curl -X POST "${t}/webhooks/{webhook_id}/test" \\
  -H "${n}"`,deleteWebhook:`curl -X DELETE "${t}/webhooks/{webhook_id}" \\
  -H "${n}"`,webhookSamplePayload:`{
  "event": "message.completed",
  "app_id": "${e}",
  "conversation_id": "conv_xyz",
  "timestamp": "2026-04-21T10:00:00Z",
  "data": {
    "message": {
      "id": "msg_123",
      "role": "assistant",
      "content": "Hi! How can I help you?",
      "tool_calls": [],
      "file_urls": []
    }
  }
}`,verifySignatureDeno:`// Read the body as a string BEFORE parsing it.
const rawBody = await req.text();
const signatureHeader = req.headers.get("x-base44-signature") ?? "";

const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(Deno.env.get("WEBHOOK_SIGNING_SECRET")!),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign"],
);
const sigBytes = new Uint8Array(
  await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)),
);
const expected = "sha256=" + Array.from(sigBytes)
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");

// Constant-time compare.
const a = new TextEncoder().encode(expected);
const b = new TextEncoder().encode(signatureHeader);
const ok = a.length === b.length &&
  a.reduce((acc, v, i) => acc | (v ^ b[i]), 0) === 0;

if (!ok) return new Response("invalid signature", { status: 401 });

// Only parse AFTER verifying.
const payload = JSON.parse(rawBody);`,verifySignatureNode:`import express from "express";
import crypto from "crypto";

const app = express();

// express.raw gives us the untouched Buffer — required for HMAC verification.
app.post(
  "/hooks/base44",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const rawBody = req.body; // Buffer
    const signatureHeader = req.header("x-base44-signature") || "";

    const expected = "sha256=" + crypto
      .createHmac("sha256", process.env.WEBHOOK_SIGNING_SECRET)
      .update(rawBody)
      .digest("hex");

    const a = Buffer.from(expected);
    const b = Buffer.from(signatureHeader);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).send("invalid signature");
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    // ...handle payload
    res.sendStatus(204);
  },
);`,responseFormat:`{
  "id": "conversation_id",
  "app_id": "${e}",
  "agent_name": "your_agent",
  "messages": [
    {
      "id": "message_id",
      "role": "user",
      "content": "Hello!",
      "tool_calls": [],
      "file_urls": []
    },
    {
      "id": "message_id",
      "role": "assistant",
      "content": "Hi! How can I help you?",
      "tool_calls": [],
      "file_urls": []
    }
  ],
  "metadata": {}
}`}}function Y({code:e,copyLabel:t}){let[n,r]=(0,R.useState)(!1);return(0,K.jsxs)(`div`,{className:`group relative overflow-hidden rounded-md border border-[color:var(--sem-border-separator-default)] bg-[var(--sem-surface-surface-standard)]`,children:[(0,K.jsx)(`div`,{className:`absolute right-1.5 top-1.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100`,children:(0,K.jsx)(S,{size:`tiny`,tone:`ghost`,"aria-label":t,icon:n?(0,K.jsx)(T,{}):(0,K.jsx)(O,{}),onClick:async()=>{await navigator.clipboard.writeText(e),r(!0),setTimeout(()=>r(!1),2e3)}})}),(0,K.jsx)(`pre`,{className:`overflow-x-auto whitespace-pre-wrap break-all p-4 font-mono text-tiny leading-relaxed text-[color:var(--sem-text-icon-primary)]`,children:(0,K.jsx)(`code`,{children:e})})]})}function X({title:e,children:t}){return(0,K.jsxs)(ee,{skin:`outline`,className:`flex flex-col gap-3`,children:[(0,K.jsx)(A,{as:`h4`,size:`small`,weight:`medium`,tone:`primary`,children:e}),t]})}function Z({children:e}){return(0,K.jsx)(A,{as:`p`,size:`tiny`,tone:`secondary`,children:e})}var we={GET:`success`,POST:`accent`,PATCH:`pending`,DELETE:`destructive`};function Q({method:e,path:t,description:n,separator:r,children:i}){return(0,K.jsx)(j,{prefix:(0,K.jsx)(y,{variant:we[e]??`standard`,light:!0,size:`tiny`,children:e}),title:(0,K.jsx)(`code`,{className:`break-all font-mono text-tiny text-[color:var(--sem-text-icon-primary)]`,children:t}),subtitle:n,separator:r,children:(0,K.jsx)(`div`,{className:`flex flex-col gap-3 pb-3`,children:i})})}var $=[{method:`POST`,path:`/conversations`,descKey:`createConversationDesc`,blocks:e=>[e.createConversation]},{method:`GET`,path:`/conversations`,descKey:`listConversationsDesc`,blocks:e=>[e.listConversations],noteKey:`listConversationsNote`},{method:`GET`,path:`/conversations/{conversation_id}`,descKey:`getConversationDesc`,blocks:e=>[e.getConversation]},{method:`POST`,path:`/conversations/{conversation_id}/messages`,descKey:`sendMessageDesc`,requestBody:e=>e.sendMessageBody,blocks:e=>[e.sendMessage],noteKey:`sendMessageNote`},{method:`DELETE`,path:`/conversations/{conversation_id}/messages/{message_id}`,descKey:`deleteMessageDesc`,blocks:e=>[e.deleteMessage]},{method:`GET`,path:`/memory`,descKey:`listMemoryDesc`,blocks:e=>[e.listMemory]},{method:`DELETE`,path:`/memory/{memory_id}`,descKey:`deleteMemoryDesc`,blocks:e=>[e.deleteMemory]},{method:`POST`,path:`/webhooks`,descKey:`webhooksSubscribe`,blocks:e=>[e.createWebhook],noteKey:`webhooksSubscribeDesc`},{method:`GET`,path:`/webhooks`,descKey:`webhooksTitle`,blocks:e=>[e.listWebhooks]},{method:`PATCH`,path:`/webhooks/{webhook_id}`,descKey:`webhooksTitle`,blocks:e=>[e.patchWebhook]},{method:`POST`,path:`/webhooks/{webhook_id}/test`,descKey:`webhooksTitle`,blocks:e=>[e.testWebhook]},{method:`DELETE`,path:`/webhooks/{webhook_id}`,descKey:`webhooksTitle`,blocks:e=>[e.deleteWebhook]}],Te=[{header:`X-Base44-Event`,descKey:`webhooksHeaderEvent`},{header:`X-Base44-Delivery`,descKey:`webhooksHeaderDelivery`},{header:`X-Base44-Signature`,descKey:`webhooksHeaderSignature`}],Ee=[`401`,`403`,`400`,`404`];function De({td:e,snippets:t,copyLabel:n}){return(0,K.jsx)(X,{title:e(`endpoints`),children:(0,K.jsx)(`div`,{className:`flex flex-col`,children:$.map((r,i)=>(0,K.jsxs)(Q,{method:r.method,path:r.path,description:e(r.descKey),separator:i<$.length-1,children:[r.requestBody&&(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`secondary`,className:`uppercase tracking-wide`,children:e(`requestBody`)}),(0,K.jsx)(Y,{code:r.requestBody(t),copyLabel:n})]}),r.blocks(t).map(e=>(0,K.jsx)(Y,{code:e,copyLabel:n},e)),r.noteKey&&(0,K.jsx)(Z,{children:e(r.noteKey)})]},`${r.method} ${r.path}`))})})}function Oe({td:e,snippets:t,copyLabel:n}){return(0,K.jsxs)(X,{title:e(`webhooksTitle`),children:[(0,K.jsx)(Z,{children:e(`webhooksDescription`)}),(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`primary`,children:e(`webhooksEvents`)}),(0,K.jsxs)(`ul`,{className:`flex list-disc flex-col gap-1 pl-5`,children:[(0,K.jsx)(`li`,{children:(0,K.jsx)(Z,{children:e(`webhookEventMessageCreated`)})}),(0,K.jsx)(`li`,{children:(0,K.jsx)(Z,{children:e(`webhookEventMessageCompleted`)})})]}),(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`primary`,children:e(`webhooksHeadersTitle`)}),(0,K.jsx)(`ul`,{className:`flex list-disc flex-col gap-1 pl-5`,children:Te.map(({header:t,descKey:n})=>(0,K.jsx)(`li`,{children:(0,K.jsxs)(Z,{children:[(0,K.jsx)(`code`,{className:`font-mono text-[color:var(--sem-text-icon-primary)]`,children:t}),` — `,e(n)]})},t))}),(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`primary`,children:e(`webhooksSamplePayload`)}),(0,K.jsx)(Y,{code:t.webhookSamplePayload,copyLabel:n}),(0,K.jsx)(j,{title:e(`webhooksVerify`),separator:!1,children:(0,K.jsxs)(`div`,{className:`flex flex-col gap-3 pb-3`,children:[(0,K.jsx)(Z,{children:e(`webhooksVerifyDesc`)}),(0,K.jsx)(Z,{children:e(`webhooksVerifyRawBodyWarning`)}),(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`primary`,children:e(`webhooksVerifyDenoTitle`)}),(0,K.jsx)(Y,{code:t.verifySignatureDeno,copyLabel:n}),(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`primary`,children:e(`webhooksVerifyNodeTitle`)}),(0,K.jsx)(Y,{code:t.verifySignatureNode,copyLabel:n}),(0,K.jsx)(Z,{children:e(`webhooksVerifyPitfalls`)})]})}),(0,K.jsx)(Z,{children:e(`webhooksLimits`)})]})}function ke({td:e}){return(0,K.jsx)(X,{title:e(`errorCodes`),children:(0,K.jsx)(`div`,{className:`grid grid-cols-[auto_1fr] gap-x-4 gap-y-2`,children:Ee.map(t=>(0,K.jsx)(Ae,{code:t,label:e(`error${t}`)},t))})})}function Ae({code:e,label:t}){return(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(`code`,{className:`font-mono text-[12px] text-[color:var(--sem-text-icon-destructive)]`,children:e}),(0,K.jsx)(Z,{children:t})]})}function je({appId:e,conversationId:n}){let{t:r}=i(),{isBlocked:a,canShowDocs:o,usesTokens:s,isSettledPolicy:c,apiKey:l,noticeTitle:u,noticeBody:d}=ae(e),f=L(),p=t(),m=`${p}/api/agents/${e}`,h=`${p}/api/agents`,g=n||`{conversation_id}`,_=N(l,s),v=e=>r(`agentEditor.apiDocsTab.${e}`),y=v(`copy`),b=(0,R.useMemo)(()=>Ce({appId:e,agentsBase:m,authHeader:_,convId:g}),[e,m,_,g]),x=(0,R.useMemo)(()=>xe({appId:e,apiKey:l,usesTokens:s,agentsBase:m,agentsManagementBase:h}),[e,l,s,m,h]),[S,C]=(0,R.useState)(!1);return(0,K.jsxs)(`div`,{className:`flex flex-col gap-6 py-6`,children:[(0,K.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,K.jsxs)(`div`,{children:[(0,K.jsx)(A,{as:`h3`,size:`medium`,weight:`medium`,tone:`primary`,children:v(`title`)}),(0,K.jsx)(A,{as:`p`,size:`small`,tone:`secondary`,className:`mt-1`,children:v(`subtitle`)})]}),(0,K.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,K.jsx)(M,{variant:`standard`,tone:`secondary`,size:`sm`,disabled:!o,prefixIcon:S?(0,K.jsx)(T,{}):(0,K.jsx)(O,{}),onClick:async()=>{if(!a)try{await navigator.clipboard.writeText(x),C(!0),f.success(v(`copyDocsSuccess`)),setTimeout(()=>C(!1),2e3)}catch{f.error(v(`copyDocsFailed`))}},children:v(`copyDocsButton`)}),(0,K.jsx)(M,{variant:`standard`,tone:`secondary`,size:`sm`,disabled:!o,prefixIcon:(0,K.jsx)(ne,{}),onClick:()=>{Se(x,e),f.success(v(`downloadSkillSuccess`))},children:v(`downloadSkillButton`)})]})]}),c?o?(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(X,{title:v(`baseUrl`),children:(0,K.jsx)(Y,{code:m,copyLabel:y})}),(0,K.jsxs)(X,{title:v(`authentication`),children:[(0,K.jsx)(Z,{children:v(s?`tokenAuthDescription`:`authDescription`)}),(0,K.jsx)(Y,{code:_,copyLabel:y})]}),(0,K.jsxs)(X,{title:v(`quickStart`),children:[(0,K.jsx)(Z,{children:v(`quickStartDescription`)}),(0,K.jsx)(A,{as:`p`,size:`tiny`,weight:`medium`,tone:`primary`,children:v(`step2SendMessage`)}),(0,K.jsx)(Y,{code:b.quickStartSendMessage,copyLabel:y})]}),(0,K.jsx)(De,{td:v,snippets:b,copyLabel:y}),(0,K.jsx)(J,{appId:e}),(0,K.jsx)(Oe,{td:v,snippets:b,copyLabel:y}),(0,K.jsxs)(X,{title:v(`responseFormat`),children:[(0,K.jsx)(Z,{children:v(`responseFormatDescription`)}),(0,K.jsx)(Y,{code:b.responseFormat,copyLabel:y})]}),(0,K.jsx)(X,{title:v(`rateLimits`),children:(0,K.jsx)(Z,{children:v(`rateLimitsDescription`)})}),(0,K.jsx)(ke,{td:v})]}):(0,K.jsxs)(K.Fragment,{children:[(0,K.jsx)(P,{title:u,body:d}),(0,K.jsx)(J,{appId:e})]}):null]})}export{je as default};