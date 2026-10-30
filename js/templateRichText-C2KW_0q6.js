var e=`
.ds-template-description { overflow-wrap: anywhere; }
.ds-template-description :is(img, video, iframe, table) { max-width: 100%; }
.ds-template-description :is(img, video) { height: auto; }
.ds-template-description h1, .ds-template-description h2, .ds-template-description h3 { font-family: var(--font-titles); font-weight: var(--fw-semibold); color: var(--sem-text-icon-primary); }
.ds-template-description h1 { font-size: var(--fs-h2); line-height: var(--lh-8); margin-bottom: var(--space-3); }
.ds-template-description h2 { font-size: var(--fs-h3); line-height: var(--lh-7); margin-bottom: var(--space-2); }
.ds-template-description h3 { font-size: var(--fs-medium); line-height: var(--lh-7); margin-bottom: var(--space-2); }
.ds-template-description p { margin-bottom: var(--space-2); }
.ds-template-description ul, .ds-template-description ol { margin-bottom: var(--space-2); padding-left: var(--space-5); }
.ds-template-description ul { list-style: disc; }
.ds-template-description ol { list-style: decimal; }
.ds-template-description li { margin-bottom: var(--space-1); }
.ds-template-description :is(strong, b) { font-weight: var(--fw-semibold); }
.ds-template-description :is(em, i) { font-style: italic; }
.ds-template-description a { color: var(--sem-text-icon-accent); text-decoration: underline; }
.ds-template-description blockquote { margin: var(--space-2) 0; padding-left: var(--space-3); border-left: 2px solid var(--sem-border-separator-default); color: var(--sem-text-icon-secondary); }
.ds-template-description code { padding: 0.125em var(--space-1); border-radius: var(--radius-sm); background: var(--sem-surface-surface-dark-stone); font-size: var(--fs-small); }
.ds-template-description pre { margin-bottom: var(--space-2); padding: var(--space-3); border-radius: var(--radius-md); background: var(--sem-surface-surface-dark-stone); overflow-x: auto; }
.ds-template-description pre code { padding: 0; background: transparent; }
.ds-template-description > *:last-child { margin-bottom: 0; }
`,t=e=>e.replace(/&nbsp;| /g,` `);export{t as n,e as t};