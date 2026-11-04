import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const read=path=>fs.readFileSync(path);
const json=path=>JSON.parse(read(path));
const hash=value=>createHash('sha256').update(value).digest('hex');
const studio='public/experiments/worldstage/studio/';
const manifest=json('src/worldstage/source-manifest.json');
for(const file of manifest.files.filter(file=>file.sha256))assert.equal(hash(read(file.path)),file.sha256,'Preserved source or artwork changed: '+file.path);
const benchmark=json(studio+'benchmark.json');
assert.equal(hash(JSON.stringify(benchmark.states)),benchmark.stateHash);
const arrival=json('src/worldstage/fixed-arrival.json');
assert.deepEqual(arrival,benchmark.states.slice(0,108));
const html=read(studio+'index.html').toString();
for(const script of html.matchAll(/src="\.\/([^"?]+\.js)"/g))assert.ok(fs.existsSync(studio+script[1]),'Missing studio script');
assert.ok(!read(studio+'painter.js').toString().match(/node:|process\.|writeFile|readFile|ffmpeg/),'Native code leaked into the browser painter');
assert.ok(read(studio+'mediabunny-LICENSE.txt').length>100);
let simulated=0;
const base=process.argv[2];
if(base){
  const post=body=>fetch(new URL('/api/worldstage/performance',base),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  for(const fixture of json('src/worldstage/solver-fixtures.json')){
    const response=await post({action:'audition',settings:fixture.settings});assert.equal(response.status,200);
    const p=await response.json();assert.equal(p.stateHash,fixture.stateHash,fixture.name+' differs from the original solver');assert.equal(p.states.length,fixture.frames);assert.deepEqual(p.states.slice(0,108),arrival);simulated++;
  }
  const response=await post({action:'departure',performance:benchmark});assert.equal(response.status,200);
  const departure=await response.json();assert.deepEqual(departure.states.slice(0,benchmark.states.length),benchmark.states);assert.equal(departure.departure.sourceMotionHash,benchmark.stateHash);
  assert.equal((await post({action:'audition',settings:{seed:NaN}})).status,400);
  assert.equal((await post({action:'audition',settings:{engineDirecting:1,engineIgnition:8,engineShutdown:5}})).status,400);
  assert.equal((await post({action:'departure',performance:{...benchmark,stateHash:'tampered'}})).status,400);
  for(const name of ['field-conditions','type-in-motion','grid-pressure']){
    const response=await fetch(new URL('/experiments/'+name,base),{redirect:'manual'});assert.equal(response.status,308);assert.equal(response.headers.get('location'),'/experiments/culture');
  }
  const home=await(await fetch(base)).text();assert.ok(home.indexOf('color-scheme')<home.indexOf('rel="stylesheet"'));assert.ok(!home.includes('More generative studies'));
}
console.log(JSON.stringify({result:'passed',preservedSources:manifest.files.length,simulated,departurePreserved:!!base,base:base??'source only'}));
