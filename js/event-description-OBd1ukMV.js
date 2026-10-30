import{t as e}from"./htmlSanitizer-CQSf7Qgh.js";var t=e=>{let t=document.createElement(`textarea`);return t.innerHTML=e,t.value},n=t=>t?e(t):``,r=e=>e?t(e.replace(/<br\s*\/?>/gi,`
`).replace(/<\/(?:p|li|h[1-6]|blockquote|pre)>/gi,`
`).replace(/<[^>]+>/g,``)).replace(/\n{3,}/g,`

`).trim():``,i=t=>{let n=e(t).trim();return r(n)?n:``};export{r as n,i as r,n as t};