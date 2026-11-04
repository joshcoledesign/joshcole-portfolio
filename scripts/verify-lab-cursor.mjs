import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const code=ts.transpileModule(fs.readFileSync('src/lib/lab-cursor.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
class Element{
  constructor(){this.dataset={};this.children=[];this.style={setProperty:(k,v)=>{this.style[k]=v;}};this.attributes={};this.classes=new Set();this.classList={add:k=>this.classes.add(k),remove:k=>this.classes.delete(k)};this.events=new Map();this.hidden=false;}
  setAttribute(k,v){this.attributes[k]=v;}append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}remove(){this.removed=true;}
  addEventListener(k,v){this.events.set(k,v);}removeEventListener(k){this.events.delete(k);}
  closest(){return this.dataset.labEntry?this:null;}contains(node){return node===this;}matches(){return true;}
  getBoundingClientRect(){return this.rect??{left:0,top:0,right:240,bottom:64,width:240,height:64};}
}
function mount(){
  const root=new Element(),body=new Element(),doc=new Element(),win=new Element(),frames=new Map();
  const fine={matches:true,addEventListener(_e,fn){this.change=fn;},removeEventListener(){delete this.change;}},reduced={...fine,matches:false};
  Object.assign(win,{Element,innerWidth:800,innerHeight:600,matchMedia:q=>q.includes('reduced')?reduced:fine,getComputedStyle:()=>({getPropertyValue:()=> '#42e2ed'}),requestAnimationFrame:fn=>{frames.set(1,fn);return 1;},cancelAnimationFrame:id=>frames.delete(id)});
  doc.defaultView=win;doc.body=body;doc.createElement=()=>new Element();root.ownerDocument=doc;root.contains=()=>true;
  const exports={};new Function('exports',code)(exports);const stop=exports.mountLabCursor(root),tag=body.children[0];
  const target=new Element();target.dataset.labEntry='culture';target.rect={left:650,top:500,right:790,bottom:550,width:140,height:50};
  return {root,doc,win,frames,fine,reduced,tag,target,stop,move(x=780,y=580){root.events.get('pointermove')({target,pointerType:'mouse',clientX:x,clientY:y});},flush(){for(const [id,fn]of [...frames]){frames.delete(id);fn();}}};
}
const m=mount();m.move();m.flush();assert.equal(m.tag.hidden,false);assert.equal(m.tag.dataset.project,'culture');assert.equal(m.tag.attributes['aria-hidden'],'true');
const [x,y]=[...m.tag.style.transform.matchAll(/(\d+)px/g)].map(x=>Number(x[1]));assert.ok(x>=12&&x+240<=788&&y>=12&&y+64<=588,'Tag stays inside screen near either edge');assert.equal(m.frames.size,0,'No idle frame loop');
for(const project of ['culture','hype','gensound','worldstage','dungeon']){m.target.dataset.labEntry=project;m.root.events.get('pointerout')({relatedTarget:null});m.move();m.flush();assert.equal(m.tag.dataset.project,project);}
m.target.dataset.labAction='studio';m.root.events.get('pointerout')({relatedTarget:null});m.move();assert.equal(m.tag.children[2].children[0].textContent,'EXPLORE STUDIO ↗');
m.reduced.matches=true;m.reduced.change();const stationary=m.tag.style.transform;m.move(300,200);m.flush();assert.equal(m.tag.style.transform,stationary,'Reduced Motion keeps a stationary invitation');assert.equal(m.tag.classes.has('is-following'),false);
m.win.events.get('scroll')();assert.equal(m.tag.hidden,true);m.root.events.get('focusin')({target:m.target});assert.equal(m.tag.hidden,false,'Keyboard focus gets a stationary invitation');m.win.events.get('scroll')();m.flush();assert.equal(m.tag.hidden,false,'Keyboard invitation survives focus scrolling');m.doc.events.get('keydown')({key:'Escape'});assert.equal(m.tag.hidden,true);
m.fine.matches=false;m.fine.change();m.move();assert.equal(m.tag.hidden,true,'Coarse input never gets a floating tag');
m.stop();assert.equal(m.tag.removed,true);assert.equal(m.frames.size,0);assert.equal(m.root.events.size,0);assert.equal(m.win.events.size,0);assert.equal(m.doc.events.size,0);
const html=JSON.parse(fs.readFileSync('src/portfolio/compiled-document.json','utf8'));
for(const project of ['culture','hype','gensound','worldstage','dungeon'])assert.ok(html.includes(`data-lab-entry="${project}"`));
assert.ok(!html.includes('data-lab-entry="premise"'),'A gallery must not claim a live authoring lab');
assert.ok(/data-open-experiment="gensound"[^>]*data-lab-action="experiment"/.test(html),'Overview links describe exploration rather than a direct launch');
assert.ok(/data-dg-observe="horizon"[^>]*data-lab-entry="dungeon"/.test(html),'Dungeon observation entries launch the lab too');
const css=fs.readFileSync('src/portfolio/lab-cursor.css','utf8');assert.ok(css.includes('pointer-events:none'));assert.ok(!css.includes('cursor:none'));
console.log(JSON.stringify({result:'passed',projects:5,edgeClamping:true,noIdleLoop:true,reducedMotion:true,keyboardAndCoarseInput:true,cleanup:true,accurateDestinations:true}));
