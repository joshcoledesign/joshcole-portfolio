import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Exercise the actual enhancement with controlled observer/frame/preference events.
const code=ts.transpileModule(fs.readFileSync('src/lib/story-motion.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function mount(reducedInitially){
  const headerStyles=new Map(),headerRect={height:112};
  const header={getClientRects:()=>[headerRect],getBoundingClientRect:()=>headerRect};
  const ownerDocument={querySelectorAll:()=>[header],documentElement:{style:{setProperty:(key,value)=>headerStyles.set(key,value),removeProperty:key=>headerStyles.delete(key)}}};
  const styles=new Map(),listeners=new Map(),frames=new Map(),animations=[];
  const rect={top:180,bottom:680,height:500};
  const portrait={style:{setProperty:(key,value)=>styles.set(key,value),removeProperty:key=>styles.delete(key)}};
  const chapterRect={top:200,bottom:1000,height:800},ruleStyles=new Map();
  const introductions=Array.from({length:4},()=>({style:{setProperty:(key,value)=>ruleStyles.set(key,value),removeProperty:key=>ruleStyles.delete(key)},closest:()=>({getClientRects:()=>[chapterRect],getBoundingClientRect:()=>chapterRect}),animate(keyframes){const animation={keyframes,cancelled:false,finished:new Promise(()=>{}),cancel(){this.cancelled=true;}};animations.push(animation);return animation;}}));
  const root={ownerDocument,querySelector:selector=>selector==='[data-about-portrait]'?portrait:{getBoundingClientRect:()=>rect},querySelectorAll:()=>introductions,addEventListener:(name,fn)=>listeners.set('root-'+name,fn),removeEventListener:name=>listeners.delete('root-'+name)};
  const media={matches:reducedInitially,listener:null,addEventListener(_type,fn){this.listener=fn;},removeEventListener(){this.listener=null;}};
  let observerCallback,nextFrame=0,cleanup;
  class Observer{
    constructor(callback){this.callback=callback;this.observed=new Set();observerCallback=callback;}
    observe(element){this.observed.add(element);}
    unobserve(element){this.observed.delete(element);}
    disconnect(){this.observed.clear();}
  }
  const browser={innerHeight:720,innerWidth:1280,IntersectionObserver:Observer,matchMedia:()=>media,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name)};
  const exports={};
  new Function('require','exports','window','document','IntersectionObserver','requestAnimationFrame','cancelAnimationFrame',code)(
    ()=>({useEffect:fn=>{cleanup=fn();}}),exports,browser,{querySelector:()=>root},Observer,
    fn=>{frames.set(++nextFrame,fn);return nextFrame;},id=>frames.delete(id),
  );
  cleanup=exports.mountStoryMotion(root);
  return {headerStyles,headerRect,styles,ruleStyles,chapterRect,listeners,frames,animations,media,introductions,rect,browser,cleanup,
    flush(){for(const [id,fn]of [...frames]){frames.delete(id);fn();}},
    enter(element){observerCallback([{target:element,isIntersecting:true}]);},
  };
}

const page=fs.readFileSync('src/app/about/page.tsx','utf8');assert.ok(page.includes('md:sticky md:top-24 md:self-start motion-reduce:!static'),'Chapter headings pin only on desktop with motion allowed');
const normal=mount(false);
assert.equal(normal.headerStyles.get('--site-header-height'),'112px');normal.headerRect.height=160;normal.listeners.get('resize')();assert.equal(normal.headerStyles.get('--site-header-height'),'160px','Wrapped navigation must update the anchor/chapter clearance');
normal.flush();const first=normal.styles.get('transform');assert.ok(first);
normal.listeners.get('root-portfolio:view-change')();assert.equal(normal.frames.size,1,'Internal page changes must refresh visible rules without needing a scroll');normal.flush();
normal.rect.top=-160;normal.rect.bottom=340;normal.listeners.get('scroll')();normal.flush();assert.notEqual(normal.styles.get('transform'),first);
const chapterFirst=normal.ruleStyles.get('transform');normal.chapterRect.top=-100;normal.chapterRect.bottom=700;normal.listeners.get('scroll')();normal.flush();assert.notEqual(normal.ruleStyles.get('transform'),chapterFirst,'Dividers must draw in response to scroll');
assert.equal(normal.frames.size,0,'Motion must not run an idle animation loop');
normal.enter(normal.introductions[0]);normal.enter(normal.introductions[0]);assert.equal(normal.animations.length,1,'Section entrances only play once');
assert.ok(normal.animations[0].keyframes.every(frame=>frame.opacity>=.4),'Heading entrance must retain visible ink');
normal.listeners.get('scroll')();normal.media.matches=true;normal.media.listener();assert.equal(normal.frames.size,0);assert.equal(normal.styles.has('transform'),false);assert.ok(normal.animations.every(animation=>animation.cancelled));
assert.equal(normal.ruleStyles.size,0,'Reduced motion clears divider transforms');
normal.listeners.get('scroll')();assert.equal(normal.frames.size,0,'Reduced motion must prevent scroll animation');
normal.cleanup();assert.equal(normal.headerStyles.size,0);assert.equal(normal.listeners.size,0);assert.equal(normal.media.listener,null);

const reduced=mount(true);assert.equal(reduced.frames.size,0);assert.equal(reduced.animations.length,0);assert.equal(reduced.styles.size,0);
reduced.media.matches=false;reduced.media.listener();reduced.browser.innerWidth=390;reduced.flush();assert.ok(reduced.styles.get('transform'));
const shift=Number(reduced.styles.get('transform').match(/translate3d\(0,([\d.-]+)px/)[1]);assert.ok(Math.abs(shift)<=14);
const scale=Number(reduced.ruleStyles.get('transform').match(/scaleX\(([\d.]+)\)/)[1]);assert.ok(scale>=0&&scale<=1);
reduced.cleanup();assert.equal(reduced.styles.size,0);assert.equal(reduced.ruleStyles.size,0);assert.equal(reduced.frames.size,0);
console.log(JSON.stringify({result:'passed',scrollMotion:true,scrollDrawnDividers:true,oneTimeEntrances:true,reducedMotionInitialAndToggle:true,mobileBound:true,cleanup:true}));
