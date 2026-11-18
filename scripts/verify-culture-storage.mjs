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
assert.equal(current.store.widgetState.modelContent.ink,undefined,'Legacy Pink must not override the new Cyan default');
assert.equal(load(JSON.stringify({...previous,modelContent:{...previous.modelContent,ink:'acid'}})).store.widgetState.modelContent.ink,undefined,'Reset legacy palette choices consistently');
assert.equal(current.store.widgetState.modelContent.seed,42,'Keep the saved seed through the palette migration');
assert.equal(load(null).store.widgetState.modelContent,null,'Fresh visits use runtime defaults');
const selection={...previous,modelContent:{...previous.modelContent,paletteVersion:2,structure:'labyrinth'}};
await current.store.setWidgetState(selection);
assert.equal(current.store.widgetState.modelContent.structure,'labyrinth','Keep choices within the current visit');
assert.equal(current.read().modelContent.structure,undefined,'Do not persist a structure for the next visit');
assert.equal(current.read().modelContent.seed,42);
assert.equal(current.read().modelContent.ink,'pink');
assert.equal(load(JSON.stringify(current.read())).store.widgetState.modelContent.ink,'pink','Preserve a color explicitly chosen from the refreshed palette');
assert.equal(current.read().modelContent.paletteVersion,2);
assert.equal(load('not JSON').store.widgetState.modelContent,null);
await load(null,{denied:true}).store.setWidgetState(selection);
console.log(JSON.stringify({result:'passed',legacyPaletteReset:true,newColorChoicePreserved:true,oldStructureIgnored:true,currentVisitRetained:true,seedPreserved:true,unavailableStorageSafe:true}));
