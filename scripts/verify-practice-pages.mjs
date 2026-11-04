import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const sha=value=>createHash('sha256').update(value).digest('hex');
const checks=JSON.parse(fs.readFileSync('src/data/practice-content-checks.json'));
const story=JSON.parse(fs.readFileSync('src/data/about-story.json'));
assert.equal(sha(story.join('\n')),checks.aboutStorySha256);
assert.equal(sha(fs.readFileSync('src/lib/resume.ts','utf8').replaceAll('\r\n','\n')),checks.resumeSourceSha256);
assert.equal(sha(fs.readFileSync('public/files/josh-cole-resume-2026-09-22.1.pdf')),checks.originalPdfSha256);
const decode=text=>text.replace(/<[^>]*>/g,'').replace(/&#(x[0-9a-f]+|[0-9]+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '}[n])).replace(/\s+/g,' ').trim();
const base=process.argv[2];
if(base){
  const get=async path=>{const response=await fetch(new URL(path,base));assert.equal(response.status,200,path);return response;};
  const home=await(await get('/')).text(),about=await(await get('/about')).text(),resume=await(await get('/resume')).text(),sitemap=await(await get('/sitemap.xml')).text();
  for(const [path,html]of [['/',home],['/about',about],['/resume',resume]]){
    for(const match of html.matchAll(/href="([^"]+)"/g))assert.ok(!/^\/(archive|work\/photography)([?#/]|$)/.test(match[1]),'Legacy public link on '+path);
  }
  for(let i=0;i<story.length;i++){
    const match=new RegExp('<p\\b[^>]*data-about-story="'+i+'"[^>]*>([\\s\\S]*?)<\\/p>').exec(about);assert.ok(match,'Missing About paragraph '+i);assert.equal(decode(match[1]),story[i]);
  }
  // Next serializes the site's unrelated 404 boundary into RSC script data.
  const visibleAbout=about.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'');
  assert.ok(!/prompt-seg|git log --oneline|RECENT COMMITS/.test(visibleAbout));
  assert.ok(!/Syne|JetBrains|fonts\.googleapis|linear-gradient|grad-rule|--save-as-pdf/.test(resume));
  const plain=resume.match(/<script type="text\/plain" id="plaintext">([\s\S]*?)<\/script>/)?.[1];assert.ok(plain);assert.equal(sha(plain.replaceAll('\r\n','\n').trim()),checks.resumePlainTextSha256);
  assert.ok(!sitemap.includes('/archive<')&&!sitemap.includes('/work/photography<'));
  const routes=JSON.parse(fs.readFileSync('src/portfolio/routes.json'));const allowed=new Set(routes.map(route=>route.path).concat(['/about','/resume']));for(const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g))assert.ok(allowed.has(new URL(match[1]).pathname),'Legacy sitemap entry '+match[1]);
  const pdf=await get('/resume/download');assert.equal(pdf.headers.get('content-type'),'application/pdf');assert.ok(pdf.headers.get('content-disposition').includes('josh-cole-resume.pdf'));assert.equal(sha(Buffer.from(await pdf.arrayBuffer())),sha(fs.readFileSync('public/files/josh-cole-resume-2026-09-22.1-culture.pdf')));
}
console.log(JSON.stringify({result:'passed',aboutParagraphsPreserved:8,resumeContentPreserved:true,originalPdfPreserved:true,base:base??'source only'}));
