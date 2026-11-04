// Culture presentation of the approved résumé content. Screen and paper share Geist.
import storyManifest from '@/portfolio/story-manifest.json';
export const RESUME_SHELL = `
<meta charset="utf-8">
<title>Josh Cole — Creative Technologist · AI</title>
<meta name="author" content="Josh Cole">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0b0d0c">
<style>
@font-face{font-family:Geist;src:url('/portfolio/media/ccce59465ae5c61930ad.ttf') format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:Geist;src:url('/portfolio/media/a8eefb873ba9c9020665.ttf') format('truetype');font-weight:500;font-style:normal;font-display:swap}
:root{color-scheme:dark;--surface:#0b0d0c;--ink:#efece3;--muted:#a9ada5;--accent:#42e2ed;--rule:#373d36;background:var(--surface)}
*{box-sizing:border-box}
body{margin:0;background:var(--surface);color:var(--ink);font:400 17px/1.65 Geist,Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline;text-underline-offset:4px}
a:focus-visible,button:focus-visible{outline:2px solid var(--accent);outline-offset:5px}
.toolbar{position:sticky;top:0;z-index:40;background:var(--surface);display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 5%;border-bottom:1px solid var(--rule)}
.resume-home{display:block;flex:none;width:112px;height:62px}
.resume-home span{display:block;width:100%;height:100%;background:var(--accent);mask:url('/portfolio/open-projects/signature.svg') center/contain no-repeat}
.resume-actions{display:flex;align-items:center;justify-content:flex-end;gap:12px;flex-wrap:wrap}
.toolbar button,.toolbar .download{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border:1px solid var(--rule);background:transparent;color:var(--ink);font:400 14px/1.3 Geist,Arial,sans-serif;cursor:pointer;text-decoration:none}
.toolbar button:hover,.toolbar .download:hover{border-color:var(--accent);color:var(--accent)}
.toolbar .download{color:var(--accent);border-color:var(--accent)}
.status{min-height:20px;min-width:3em;color:var(--muted);font:12px/1.5 monospace}
.sheet{width:100%;max-width:1680px;margin:64px auto 100px;padding:0 min(5vw,84px)}
.name{margin:0;font-size:clamp(52px,7.8vw,96px);font-weight:500;line-height:1;letter-spacing:-.065em}
.discipline{margin:22px 0 0;font-size:clamp(19px,2.6vw,28px);line-height:1.3;letter-spacing:-.02em}
.resume-rule{height:1px;background:var(--accent);margin:32px 0 22px}
.contact{display:flex;flex-wrap:wrap;gap:6px 0;margin:0;color:var(--muted);font:12px/1.7 monospace}
.contact-group{display:inline-flex;align-items:baseline;flex-wrap:wrap}.contact-item{overflow-wrap:anywhere}.contact .sep{padding:0 14px;color:var(--rule)}
.section{margin-top:48px;padding-top:28px;scroll-margin-top:calc(var(--site-header-height,112px) + 24px)}
[data-story-section]{position:relative}
[data-story-rule]{position:absolute;inset-inline:0;top:0;height:1px;background:var(--accent);transform-origin:left;pointer-events:none}
@media screen and (min-width:901px){.section{display:grid;grid-template-columns:240px minmax(0,1fr);column-gap:6%}.section>h2{grid-column:1;grid-row:1/span 30;align-self:start}.section>:not(h2):not([data-story-rule]){grid-column:2}.section p{max-width:78ch}}
@media screen and (min-width:901px) and (prefers-reduced-motion:no-preference){.section>h2{position:sticky;top:calc(var(--site-header-height,112px) + 24px)}}
.section>h2{margin:0 0 22px;font:400 12px/1.5 monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.section p{margin:0 0 16px}.summary p{font-size:19px;line-height:1.65}
.skill b{font-weight:500;color:var(--ink)}.skill{color:var(--muted)}
.role{margin:28px 0 0}.role-head{display:flex;align-items:baseline;justify-content:space-between;gap:24px}.role-title{margin:0;font-size:22px;line-height:1.3;font-weight:500;letter-spacing:-.025em}
.role-title .qual{font-size:16px;font-weight:400;color:var(--muted)}.role-title .org{font-weight:400}.role-date{flex:none;font:12px/1.5 monospace;color:var(--muted)}
.role .role-summary,.role-group>.role-summary{margin:12px 0 14px;color:var(--muted);font-size:16px;line-height:1.65}
.role ul{margin:14px 0 0;padding-left:22px}.role li{padding-left:3px;margin:7px 0}.role li::marker{color:var(--accent)}
.role-group-roles{margin-top:24px;padding-left:24px;border-left:1px solid var(--rule)}
.earlier .role{margin-top:18px}.earlier .role-title{font-size:18px}
@media(max-width:640px){.toolbar{gap:14px;flex-wrap:wrap}.resume-actions{width:100%;justify-content:flex-start;gap:10px}.toolbar button,.toolbar .download{padding:10px 12px;font-size:13px}.sheet{margin-top:40px}.contact{display:grid;gap:7px}.contact .sep{display:none}.role-head{display:block}.role-date{display:block;margin-top:8px}.role-group-roles{padding-left:16px}.section{margin-top:36px}.role-title{font-size:21px}.summary p{font-size:18px}}
@media(max-width:480px){:root{--site-header-height:180px}}
@media print{
[data-story-rule]{display:none}
@page{size:letter portrait;margin:.40in .50in .38in}
:root{color-scheme:light;--surface:#fff;--ink:#141916;--muted:#515b54;--accent:#166874;--rule:#bbc3bd;background:#fff}
html,body{background:#fff;color:var(--ink)}body{font-size:10pt;line-height:1.10;font-kerning:normal;font-synthesis:none;orphans:2;widows:2}
.toolbar{display:none}.sheet{width:auto;max-width:none;margin:0;padding:0}.name{margin:0 0 4.5pt;font-size:24pt;letter-spacing:-.7pt;line-height:1}
.discipline{margin:0;font-size:10pt;line-height:1.35;letter-spacing:.1pt}.resume-rule{height:1pt;margin:8pt 0 6pt;print-color-adjust:exact;-webkit-print-color-adjust:exact}
.contact{margin:0 0 5pt;font:9pt/1.35 Geist,Arial,sans-serif;display:flex;flex-wrap:wrap;gap:0}.contact-group{white-space:nowrap}.contact .sep{display:inline;padding:0 6pt}
.section{break-inside:auto;border:0;padding:0;margin:0}.section>h2{margin:6pt 0 2.5pt;padding:0 0 1.5pt;border-bottom:.5pt solid var(--rule);font:500 10pt/1.35 Geist,Arial,sans-serif;letter-spacing:.3pt;break-after:avoid;page-break-after:avoid}
.section p,.summary p{margin:0 0 3pt;font-size:10pt;line-height:1.10}.section .skill{margin:0 0 1pt;line-height:1.10}
.role{margin:3.5pt 0 0;break-inside:avoid}.role-head{display:flex;gap:12pt}.role-title{font-size:11pt;line-height:1.2;letter-spacing:-.1pt}.role-title .qual{font-size:10pt}.role-date{display:inline;margin:0;font:10pt/1.2 Geist,Arial,sans-serif}
.role .role-summary,.role-group>.role-summary{margin:0;font-size:10pt;line-height:1.2}.role ul{margin:0;padding-left:10pt}.role li{padding:0;margin:0;line-height:1.10}.role li::marker{color:var(--ink)}
.role-group,.role-group-roles{display:contents}.role-group-roles .role{margin:3.5pt 0 0 9pt;padding-left:9pt;border-left:.5pt solid var(--rule)}.role-group-roles .role:first-child{break-before:page}
.earlier .role{margin:1.5pt 0 0}.earlier .role-title{font-size:10pt}a{color:inherit;text-decoration:none}
}
</style>
<script type="text/plain" id="plaintext">%%PLAINTEXT%%</script>
<div class="toolbar" data-site-header>
  <a href="/" class="resume-home" aria-label="Josh Cole — home"><span aria-hidden="true"></span></a>
  <div class="resume-actions" role="group" aria-label="Résumé options"><button type="button" id="btn-copy">Copy plain text</button><a class="download" href="%%PDF_HREF%%" download="josh-cole-resume.pdf">Download PDF ↗</a><span id="status" class="status" role="status" aria-live="polite"></span></div>
</div>
<main class="sheet" data-story-root>%%BODY%%</main>
<script defer src="${storyManifest.script}"></script>
<script>
(()=>{const text=document.getElementById('plaintext').textContent.replace(/^\\n/,''),status=document.getElementById('status');
document.getElementById('btn-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);status.textContent='Copied';}catch{const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;left:-9999px';document.body.append(field);field.select();status.textContent=document.execCommand('copy')?'Copied':'Copy unavailable';field.remove();}});
})();
</script>`;
