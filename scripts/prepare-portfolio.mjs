import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {ArrowUpRight,ChevronLeft,ChevronRight} from 'lucide-react';
import ts from 'typescript';
import {decoratePortfolioDocument} from './lib/portfolio-presentation.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'src/portfolio');
const output=path.join(root,'public/portfolio');
const routes=JSON.parse(fs.readFileSync(path.join(source,'routes.json'),'utf8'));
const read=file=>fs.readFileSync(path.join(source,file),'utf8');
const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
let html=read('document.html');
html=decoratePortfolioDocument(html);
html=html.replace('<button type="button" data-contact-reveal>', '<a href="/portfolio/licenses/index.html">Open-source notices ↗</a><button type="button" data-contact-reveal>');
const icons={'arrow-up-right':ArrowUpRight,'chevron-left':ChevronLeft,'chevron-right':ChevronRight};
html=html.replace(/<!--PORTFOLIO_ICON:([^>]+)-->/g,(_match,name)=>renderToStaticMarkup(React.createElement(icons[name],{size:16,'aria-hidden':true})));
for(const route of routes){
 html=html.replace(new RegExp('<a\\b[^>]*data-open-'+(route.type==='case'?'case':'experiment')+'="'+route.view+'"[^>]*>','g'),tag=>tag.replace(/href="[^"]*"/,'href="'+route.path+'"'));
}
html=html.replace(/(<a\b[^>]*data-logo-home[^>]*>)/g,tag=>tag.replace(/href="[^"]*"/,'href="/"'));
html=html.replace(/(<a\b[^>]*data-return-case[^>]*>)/g,tag=>tag.replace(/href="[^"]*"/,'href="/#case-studies"'));
html=html.replace(/(<a\b[^>]*data-return-home[^>]*>)/g,tag=>tag.replace(/href="[^"]*"/,'href="/#experiments"'));
const navigation=read('navigation.js').replace('__PORTFOLIO_ROUTES__',JSON.stringify(routes));
let replacedNavigation=false;
const scripts=fs.readdirSync(path.join(source,'runtime')).filter(name=>name.endsWith('.js')).sort().map(name=>{
 let script=read('runtime/'+name);
 if(script.includes(' const caseViews=')){
  script=script.replace(/ const caseViews=[\s\S]*?else routeFromLocation\(\);/,()=>navigation);
  replacedNavigation=true;
 }
 new Function(script);
 return script;
});
if(!replacedNavigation)throw Error('Missing production navigation integration');
scripts.push(`document.querySelector('[data-contact-reveal]').addEventListener('click',function(){const address=String.fromCharCode(99,111,108,101,116,104,105,114,116,101,101,110)+'@'+String.fromCharCode(112,109,46,109,101);const link=document.createElement('a');link.href='mailto:'+address;link.textContent=address;this.replaceWith(link);});`);
const motionSource=fs.readFileSync(path.join(root,'src/lib/story-motion.ts'),'utf8').replace('export function','function');
const motion=ts.transpileModule(motionSource,{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None}}).outputText;
const motionName='story-'+digest(motion).slice(0,16)+'.js';
scripts.push(`(()=>{${motion};const root=document.getElementById('culture-case-studies');if(root)mountStoryMotion(root);})();`);
const cursor=ts.transpileModule(fs.readFileSync(path.join(root,'src/lib/lab-cursor.ts'),'utf8').replace('export function','function'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None}}).outputText;
scripts.push(`(()=>{${cursor};const root=document.getElementById('culture-case-studies');if(root)mountLabCursor(root);})();`);
const runtime=scripts.join('\n;\n');
const css=read('site.css')+'\n'+read('story.css')+'\n'+read('lab-cursor.css');
const jsName='site-'+digest(runtime).slice(0,16)+'.js',cssName='site-'+digest(css).slice(0,16)+'.css';
fs.mkdirSync(output,{recursive:true});
fs.writeFileSync(path.join(output,motionName),`(()=>{${motion};const root=document.querySelector('[data-story-root]');if(root)mountStoryMotion(root);})();`);
fs.writeFileSync(path.join(source,'story-manifest.json'),JSON.stringify({script:'/portfolio/'+motionName}));
fs.writeFileSync(path.join(output,jsName),runtime);
fs.writeFileSync(path.join(output,cssName),css);
for (const file of fs.readdirSync(output)) {
 if (/^site-[a-f0-9]{16}\.(?:js|css)$/.test(file) && file!==jsName && file!==cssName) fs.unlinkSync(path.join(output,file));
 if (/^story-[a-f0-9]{16}\.js$/.test(file) && file!==motionName) fs.unlinkSync(path.join(output,file));
}
html=html.replace('<!--PORTFOLIO_STYLES-->','<link rel="stylesheet" href="/portfolio/'+cssName+'">');
html=html.replace('<!--PORTFOLIO_SCRIPTS-->','<script defer src="/portfolio/'+jsName+'"></script>');
html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>__PAGE_TITLE__</title><meta name="description" content="__PAGE_DESCRIPTION__"><link rel="canonical" href="__PAGE_URL__"><meta property="og:title" content="__PAGE_TITLE__"><meta property="og:description" content="__PAGE_DESCRIPTION__"><meta property="og:url" content="__PAGE_URL__"><meta property="og:type" content="website"><meta property="og:image" content="https://joshcolecreative.com/opengraph-image.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/icon.png"><meta name="theme-color" content="#0b0d0c">');
html=html.replace('</head>','<noscript><style>.rh-culture{display:none!important}.rh-culture-fallback{display:block!important}</style></noscript></head>');
if(/Unlicensed Trial|GTPlanarTrial|ABCWhyte|data:font\//i.test(html+css+runtime))throw Error('Trial or embedded font data found in production output');
if(/https:\/\/(unpkg|cdn\.jsdelivr|persistent\.oaistatic)/.test(html+runtime))throw Error('Review-host dependency remains');
fs.writeFileSync(path.join(source,'compiled-document.json'),JSON.stringify(html));
fs.writeFileSync(path.join(source,'build-manifest.json'),JSON.stringify({htmlSha256:digest(html),scripts:jsName,styles:cssName,routes:routes.map(r=>r.path)},null,2));
console.log(JSON.stringify({routes:routes.length,htmlBytes:Buffer.byteLength(html),javascriptBytes:Buffer.byteLength(runtime),cssBytes:Buffer.byteLength(css)}));
