import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';

const image=JSON.parse(fs.readFileSync('src/data/site-share-image.json','utf8'));
const bytes=fs.readFileSync('public'+image.path);
assert.equal(bytes.readUInt16BE(0),0xffd8,'Share card must be a JPEG');
let size;
for(let offset=2;offset<bytes.length;){
  assert.equal(bytes[offset],0xff,'Invalid JPEG marker');
  const marker=bytes[offset+1],length=bytes.readUInt16BE(offset+2);
  if([0xc0,0xc1,0xc2].includes(marker)){size={width:bytes.readUInt16BE(offset+7),height:bytes.readUInt16BE(offset+5)};break;}
  offset+=length+2;
}
assert.deepEqual(size,{width:image.width,height:image.height});
assert.ok(bytes.length<300000,'Keep share previews lightweight');
const compiled=JSON.parse(fs.readFileSync('src/portfolio/compiled-document.json','utf8'));
assert.ok(!compiled.includes('/opengraph-image.png'),'Do not advertise the stale image address');
const base=process.argv[2];
if(base){
  const tags=(html,attribute,key)=>[...html.matchAll(/<meta\b[^>]*>/g)].filter(m=>m[0].includes(`${attribute}="${key}"`)).map(m=>m[0].match(/content="([^"]*)"/)?.[1]);
  for(const path of ['/','/about','/resume','/work/andculture','/experiments/culture','/experiments/gensound']){
    const response=await fetch(new URL(path,base));assert.equal(response.status,200,path);
    const html=await response.text();
    for(const [attribute,key]of [['property','og:image'],['name','twitter:image']]){
      assert.deepEqual(tags(html,attribute,key),['https://joshcolecreative.com'+image.path],`${path}: ${key}`);
    }
    for(const [key,value]of [['og:image:width',String(image.width)],['og:image:height',String(image.height)],['og:image:alt',image.alt]])assert.deepEqual(tags(html,'property',key),[value],path+': '+key);
  }
  const sha=value=>createHash('sha256').update(value).digest('hex');
  const response=await fetch(new URL(image.path,base));assert.equal(response.status,200);assert.ok(response.headers.get('content-type').includes(image.type));assert.equal(sha(Buffer.from(await response.arrayBuffer())),sha(bytes));
  const old=await fetch(new URL('/opengraph-image.png',base),{redirect:'manual'});assert.equal(old.status,307);assert.equal(new URL(old.headers.get('location'),base).pathname,image.path);
}
console.log(JSON.stringify({result:'passed',image:image.path,...size,bytes:bytes.length,base:base??'source only'}));
