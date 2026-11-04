import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file));
const json=file=>JSON.parse(read(file));
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const html=json('src/portfolio/compiled-document.json');
const routes=json('src/portfolio/routes.json');
const source=json('src/portfolio/source-manifest.json');
const build=json('src/portfolio/build-manifest.json');
const decode=text=>text.replace(/&#(x[0-9a-f]+|[0-9]+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n]));
const normalize=text=>decode(text.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
let blocks=0;
for(const document of json('src/portfolio/authored-copy.json')){
  assert.equal(sha(read(document.source).toString().replaceAll('\r\n','\n')),document.sourceSha256,'Authored source changed: '+document.source);
  for(const block of document.blocks){
    const opening=new RegExp('<([a-z0-9]+)\\b[^>]*\\bdata-(?:source-id|extended-source|einstein-source)="'+block.id+'"[^>]*>','i').exec(html);
    assert.ok(opening,'Missing source block: '+block.id);
    const start=opening.index+opening[0].length;
    const tags=new RegExp('</?'+opening[1]+'\\b[^>]*>','gi');tags.lastIndex=start;
    let depth=1,end=start,tag;
    while((tag=tags.exec(html))){depth+=tag[0].startsWith('</')?-1:1;if(!depth){end=tag.index;break;}}
    assert.equal(normalize(html.slice(start,end)),block.text.replace(/\s+/g,' ').trim(),'Copy differs: '+block.id);
    blocks++;
  }
}
assert.equal(sha(html),build.htmlSha256);
const genSound=json('public/experiments/gensound/snapshot.json').files.map(file=>({path:'/experiments/gensound/'+file.publicPath,sha256:file.sha256}));
const caseAssets=fs.readdirSync(path.join(root,'public/portfolio/case-assets'),{recursive:true}).filter(file=>fs.statSync(path.join(root,'public/portfolio/case-assets',file)).isFile()).map(file=>({path:'/portfolio/case-assets/'+file.replaceAll('\\','/'),sha256:sha(read('public/portfolio/case-assets/'+file))}));
const assets=[...source.embeddedAssets,...source.dungeonAssets,...genSound,...caseAssets];
for(const asset of assets)assert.equal(sha(read('public'+asset.path)),asset.sha256,'Asset changed: '+asset.path);
for(const match of html.matchAll(/(?:src|href)="(\/portfolio\/[^"#?]+)"/g))assert.ok(fs.existsSync(path.join(root,'public',match[1])),'Missing image: '+match[1]);
assert.ok(!/Unlicensed Trial|GTPlanarTrial|ABCWhyte|data:font\//i.test(html+read('public/portfolio/'+build.styles)+read('public/portfolio/'+build.scripts)),'Unlicensed study font in output');
assert.ok(!/[CH]:[\\/](?:Users|projects)/i.test(html+read('public/portfolio/'+build.scripts)),'Machine-local path in public output');
assert.equal(new Set(routes.map(r=>r.path)).size,18);

const base=process.argv[2];
if(base){
  const get=async pathname=>{const response=await fetch(new URL(pathname,base),{signal:AbortSignal.timeout(20000)});assert.equal(response.status,200,pathname+' status');return response;};
  for(const route of routes){
    const response=await get(route.path),page=await response.text();
    assert.ok(page.includes('<title>'+route.title+'</title>'),route.path+' title');
    assert.ok(page.includes('rel="canonical" href="https://joshcolecreative.com'+route.path+'"'),route.path+' canonical');
    assert.ok(response.headers.get('content-security-policy')?.includes("object-src 'none'"),route.path+' CSP');
  }
  for(let i=0;i<assets.length;i+=8)await Promise.all(assets.slice(i,i+8).map(async asset=>assert.equal(sha(Buffer.from(await (await get(asset.path)).arrayBuffer())),asset.sha256,asset.path+' deployment differs')));
  for(const name of [build.scripts,build.styles])assert.equal(sha(Buffer.from(await (await get('/portfolio/'+name)).arrayBuffer())),sha(read('public/portfolio/'+name)));
  for(const pathname of ['/archive','/work/photography','/about','/resume','/resume/download','/experiments/gensound/index.html','/portfolio/licenses/index.html','/sitemap.xml'])await get(pathname);
  const sitemap=await (await get('/sitemap.xml')).text();
  for(const route of routes)assert.ok(sitemap.includes('https://joshcolecreative.com'+route.path+'</loc>'),'Route missing from sitemap: '+route.path);
  assert.ok(!sitemap.includes('totem'),'Unrelated draft published');
  assert.equal((await fetch(new URL('/portfolio/not-a-view',base))).status,404);
}
console.log(JSON.stringify({result:'passed',routes:routes.length,authoredBlocks:blocks,verifiedAssetHashes:assets.length,base:base??'source only'}));
