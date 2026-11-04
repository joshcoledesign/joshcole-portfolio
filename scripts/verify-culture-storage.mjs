import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync('src/portfolio/runtime/00.js','utf8');
function load(saved,{denied=false}={}){
  let disk=saved;
  const context=vm.createContext({window:{},localStorage:{
    getItem(){if(denied)throw Error('Unavailable');return disk;},
    setItem(_key,value){if(denied)throw Error('Unavailable');disk=value;},
  }});
  vm.runInContext(source,context);
  return {store:context.window.portfolioStore,read:()=>JSON.parse(disk)};
}
const previous={modelContent:{kind:'culture-case-studies',structure:'colonies',ink:'pink',seed:42},privateContent:{}};
const current=load(JSON.stringify(previous));
assert.equal(current.store.widgetState.modelContent.structure,undefined,'Old structure must not override a fresh visit');
assert.equal(current.store.widgetState.modelContent.ink,'pink','Keep the independently chosen color');
const selection={...previous,modelContent:{...previous.modelContent,structure:'labyrinth'}};
await current.store.setWidgetState(selection);
assert.equal(current.store.widgetState.modelContent.structure,'labyrinth','Keep choices within the current visit');
assert.equal(current.read().modelContent.structure,undefined,'Do not persist a structure for the next visit');
assert.equal(current.read().modelContent.seed,42);
assert.equal(current.read().modelContent.ink,'pink');
assert.equal(load('not JSON').store.widgetState.modelContent,null);
await load(null,{denied:true}).store.setWidgetState(selection);
console.log(JSON.stringify({result:'passed',oldStructureIgnored:true,currentVisitRetained:true,colorAndSeedPreserved:true,unavailableStorageSafe:true}));
