import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const source='src/worldstage/source', output='public/experiments/worldstage/studio';
fs.mkdirSync(output,{recursive:true});
const read=name=>fs.readFileSync(path.join(source,name),'utf8');
fs.writeFileSync('src/worldstage/fixed-arrival-encoded.json',JSON.stringify(fs.readFileSync('src/worldstage/fixed-arrival.json','utf8')));
const settings=fs.readFileSync('src/worldstage/solver/director-settings.ts','utf8');
const pilots=fs.readFileSync('src/worldstage/solver/pilot-styles.ts','utf8');
fs.writeFileSync(output+'/studio-config.js',ts.transpileModule(settings+'\n'+pilots,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
for(const name of fs.readdirSync(source+'/director').filter(name=>name.endsWith('.js'))){
  let text=read('director/'+name);
  if(name==='motion-preview.js')text=text.replaceAll("'/assets/","'./assets/");
  if(name==='studio.js'||name==='shot-editor.js'){
    text="import {studioApi,mediaUrl} from './browser-store.js';\n"+text;
    if(name==='studio.js')text=text.replace(/async function api\(path,options\)\{[^\n]+\}/,"async function api(path,options){return studioApi(path,options?.body?JSON.parse(options.body):undefined);}");
    else text=text.replace(/async function api\(path,body\)\{[^\n]+\}/,"async function api(path,body){return studioApi(path,body);}");
    text=text.replace(/`\/(media|sequence-media)\/\$\{([^}]+)\}\/([a-z]+)(\?download)?`/g,(_m,group,id,kind)=>`mediaUrl(${id},'${kind}',${group==='sequence-media'})`);
  }
  if(name==='studio.js')text=text.replace("$('#download-film').hidden=motionMode;","$('#download-film').textContent='↓ Export '+(take.extension??'mp4').toUpperCase();$('#download-film').hidden=motionMode;");
  if(name==='shot-editor.js')text=text.replace("function showExport(job){","function showExport(job){$('#sequence-mp4').textContent='↓ Sequence '+(job.extension??'mp4').toUpperCase();");
  fs.writeFileSync(output+'/'+name,text);
}
fs.copyFileSync(source+'/director/studio.css',output+'/studio.css');
fs.appendFileSync(output+'/studio.css',"\n:root{color-scheme:dark}html{background:#0b0d0c}.local{font-size:11px} .studio-storage{max-width:850px;color:#aebbc4;font:13px/1.7 system-ui;margin:20px 0} @media(max-width:760px){.workspace{display:flex;flex-direction:column}.screen-column,.controls{width:100%;min-width:0}.scene-heading{gap:12px}.stage-nav{flex-wrap:wrap}.topbar .edition{display:none}}\n");
let html=read('director/index.html').replace('href="/studio.css"','href="./studio.css"').replace('src="/studio.js"','src="./studio.js"').replace('href="/" aria-label="Worldstage studio"','href="/experiments/worldstage" target="_top" aria-label="Worldstage overview"').replace('Local studio','Browser studio').replace('Stored on this computer','Saved in this browser').replace('href="/references"','href="./references.html"').replaceAll('/media/benchmark/poster','/portfolio/open-projects/worldstage/wide.webp').replaceAll('/media/benchmark/film','/portfolio/open-projects/worldstage/wide.mp4').replace('/media/benchmark/performance?download','./benchmark.json');
html=html.replace('</head>','<meta name="color-scheme" content="dark"><meta name="theme-color" content="#0b0d0c"><style>html,body{background:#0b0d0c;color:#e7ecef}</style></head>').replace('<footer>','<p class="studio-storage" role="note">Your takes and films save in this browser. Download performances and films to keep a copy. Painting and export run on your device; keep this tab open until they finish.</p><footer>').replace('</body>','<script type="module" src="./embed.js"></script></body>');
fs.writeFileSync(output+'/index.html',html);
let painter=read('director-render.mts.txt');
const imports=painter.split('\n').filter(line=>/^import .*from '\.\.\/director\//.test(line)).map(line=>line.replace('../director/','./')).join('\n')+"\nimport {DEFAULT_SETTINGS} from './studio-config.js';";
let body=painter.slice(painter.indexOf('const vectorLanding='),painter.indexOf('\nconst cf='));
body=body.replace(/const settings=configPath\?[^\n]+/, 'const settings=savedPerformance.settings;');
body=body.replace(/const previewFrame=Number\(previewFrameText\);[\s\S]*?(?=const W=)/,'');
body=body.replace(/const platePath=[\s\S]*?(?=const smooth=)/,"const [plate,ship,flame]=await Promise.all([loadImage(cameraView==='shoreline'?'./assets/shoreline-background.png':'./assets/background.png'),loadImage(cameraView==='shoreline'?'./assets/shoreline-ship.png':'./assets/ship.png'),loadImage('./assets/exhaust.png')]);\n");
body=body.replace(/await writeFile\([^\n]+/g,'').replace("process.env.WORLDSTAGE_DIAGNOSTICS==='1'",'false').replace("console.log('SAVED_PERFORMANCE',savedPerformance.stateHash);",'');
const prelude=`const createCanvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};\nconst loadImage=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('The scene artwork could not load.'));image.src=src;});\n`;
painter=imports+'\n'+prelude+"export async function createPainter(savedPerformance,cameraView='wide'){\n"+body+"\nreturn {canvas,draw(frame){draw(Math.max(0,Math.min(recorded.length-1,Math.floor(frame))));return canvas;}};\n}";
const compiled=ts.transpileModule(painter,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext},reportDiagnostics:true});
if(compiled.diagnostics?.some(d=>d.category===ts.DiagnosticCategory.Error))throw Error('Painter adaptation did not compile');
fs.writeFileSync(output+'/painter.js',compiled.outputText);
fs.copyFileSync('node_modules/mediabunny/dist/bundles/mediabunny.min.mjs',output+'/mediabunny.mjs');
fs.copyFileSync('node_modules/mediabunny/LICENSE',output+'/mediabunny-LICENSE.txt');
console.log('Prepared the original Worldstage editor and browser painter.');
