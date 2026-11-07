(()=>{
 const root=document.getElementById('culture-case-studies'),page=root.querySelector('[data-detail=dungeon]'),lab=page.querySelector('#dg-live'),frame=page.querySelector('[data-dungeon-frame]'),status=page.querySelector('[data-dg-status]'),loading=page.querySelector('[data-dg-loading]'),guide=page.querySelector('[data-dg-guide-note]'),reduced=matchMedia('(prefers-reduced-motion:reduce)'),presentation="/* Host presentation only; the source app, model, planner and UI handlers are unchanged. */\nbody{background:#101117;background-image:none;}\nbody>header{display:none;}\nbody>main{max-width:none;padding:24px 5% 32px;gap:0;}\nbody>main>div:first-child{display:none;}\nbody>main>div.grid{grid-template-columns:minmax(0,1fr);gap:28px;}\nbody>main>div.grid>div:first-child>div:first-child{gap:22px;}\nbody>main aside{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;align-items:start;}\nbody>main aside>section{height:100%;min-width:0;}\nbody>main section[aria-label=\"Controls\"]{padding:20px;gap:20px;margin-top:12px;}\nbody>main section[aria-label=\"Controls\"] [data-tour=\"horizon\"]{max-width:800px;}\n.text-label,.text-label-dim{color:#acacb1;}\n.text-mono-xs{font-size:13px;line-height:1.65;}\n.world-grid .world-tile{font-size:clamp(12px,1.7vw,23px);}\ninput[type=\"range\"]{min-height:36px;}\nbody>main button{min-height:44px;}\nsection[aria-label=\"Controls\"] label>span{min-height:44px;display:inline-flex;align-items:center;gap:.6ch;}\n[data-tour=\"move-pad\"] button{height:44px;width:44px;}\n[data-dg-focus]{outline:2px solid #ff419f;outline-offset:6px;}\nbody.dg-touring main{padding-top:16px;}\n.dg-exit-fullscreen{display:none;}\nbody.dg-fullscreen>main{max-width:1600px;margin-inline:auto;padding-top:75px;}\nbody.dg-fullscreen>.dg-exit-fullscreen{display:block;position:fixed;z-index:100;right:20px;top:14px;min-height:44px;padding:10px 15px;background:#101117;border:1px solid #26c5ff;color:#26c5ff;font:12px/1.5 monospace;cursor:pointer;}\n@media(max-width:800px){\n body>main{padding:20px 6% 30px;}\n body>main>div.grid>div:first-child>div:first-child{grid-template-columns:1fr;gap:20px;}\n body>main aside{grid-template-columns:1fr;gap:18px;}\n .world-grid .world-tile{font-size:clamp(10px,3.2vw,15px);}\n .text-mono-xs{font-size:12px;}\n body>main section[aria-label=\"Controls\"]{padding:15px;}\n}\n";
 let resizeObserver,mutationObserver,pending=false,started=false,touring=false,queuedTarget=null,frameDocument=null,lastStatus='',needsLanding=false;
 const scrollTo=target=>target.scrollIntoView({block:'start',behavior:reduced.matches?'instant':'smooth'});
 function report(){
  pending=false;if(root.dataset.page!=='dungeon'||!started)return;
  const doc=frame.contentDocument,main=doc?.querySelector('main');if(!main)return;
  const tour=doc.querySelector('[role="dialog"]'),wasTouring=touring;touring=Boolean(tour);doc.body.classList.toggle('dg-touring',touring);
  if(!frame.matches(':fullscreen')){const height=touring?Math.max(460,innerHeight-lab.querySelector('.dg-live-bar').offsetHeight-16):Math.ceil(main.offsetTop+main.offsetHeight+8);if(height>300&&Math.abs(frame.getBoundingClientRect().height-height)>1)frame.style.height=height+'px';}
  if(touring&&!wasTouring)lab.scrollIntoView({block:'start',behavior:'instant'});
  if(!touring&&wasTouring){frame.contentWindow.scrollTo(0,0);lab.scrollIntoView({block:'start',behavior:'instant'});}
  if(needsLanding){needsLanding=false;lab.scrollIntoView({block:'start',behavior:'instant'});}
  const phase=doc.querySelector('[data-tour="prediction-panel"] section>div:first-child>span:last-child')?.textContent.trim();
  const nextStatus=phase?(phase.startsWith('training')?'Model running · '+phase.replace('training · ',''):phase):'Loading the experiment…';
  if(nextStatus!==lastStatus){status.textContent=nextStatus;lastStatus=nextStatus;}
  loading.hidden=true;
  if(queuedTarget&&!touring){const target=queuedTarget;queuedTarget=null;focusControl(target);}
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(report);}}
 function focusControl(name){
  const doc=frame.contentDocument,element=doc?.querySelector('[data-tour="'+name+'"]');if(!element){queuedTarget=name;return;}
  if(doc.querySelector('[role="dialog"]')){queuedTarget=name;guide.textContent='Finish or close the in-game tour, then the selected control will be highlighted.';return;}
  for(const old of doc.querySelectorAll('[data-dg-focus]'))old.removeAttribute('data-dg-focus');element.setAttribute('data-dg-focus','');
  const target=element.querySelector('input,button');target?.focus({preventScroll:true});
  const top=scrollY+frame.getBoundingClientRect().top+element.getBoundingClientRect().top-100;
  window.scrollTo({top,behavior:reduced.matches?'instant':'smooth'});
  const messages={'model-toggle':'Untick world model, then use restart to compare the same seed.','horizon':'Move the horizon from 3 to 25 and compare the ghost paths.','novelty':'Drop a teleporter, then use the move buttons to walk onto a pad.'};guide.textContent=messages[name];
 }
 function prepare(){
  if(!started)return;const doc=frame.contentDocument,main=doc?.querySelector('main');if(!main)return;
  frameDocument=doc;if(!doc.getElementById('dungeon-site-presentation')){const style=doc.createElement('style');style.id='dungeon-site-presentation';style.textContent=presentation;doc.head.append(style);}
  if(!doc.querySelector('.dg-exit-fullscreen')){const exit=doc.createElement('button');exit.type='button';exit.className='dg-exit-fullscreen';exit.textContent='Exit full screen ↙';exit.addEventListener('click',()=>document.exitFullscreen().catch(()=>{}));doc.body.append(exit);}
  resizeObserver?.disconnect();mutationObserver?.disconnect();resizeObserver=new ResizeObserver(schedule);resizeObserver.observe(main);
  mutationObserver=new MutationObserver(schedule);mutationObserver.observe(main,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style']});
  doc.fonts.ready.then(schedule);schedule();
 }
 function start(target=null){
  queuedTarget=target;lab.hidden=false;if(!started){started=true;needsLanding=!target;loading.hidden=false;status.textContent='Preparing the model…';frame.src='/experiments/dry-run-dungeon/runtime/index.html?weights=world-model-p4';}
  scrollTo(lab);if(frameDocument&&target)focusControl(target);
 }
 function stop(){
  if(!started)return;resizeObserver?.disconnect();mutationObserver?.disconnect();if(frame.matches(':fullscreen'))document.exitFullscreen().catch(()=>{});
  started=false;touring=false;frameDocument=null;queuedTarget=null;lastStatus='';frame.removeAttribute('src');frame.style.height='1000px';lab.hidden=true;
  for(const button of page.querySelectorAll('[data-dg-observe]'))button.setAttribute('aria-pressed','false');guide.textContent='Choose a test to open its corresponding control.';
 }
 frame.addEventListener('load',prepare);
 for(const button of page.querySelectorAll('[data-dg-start]'))button.addEventListener('click',()=>start());
 for(const button of page.querySelectorAll('[data-dg-observe]'))button.addEventListener('click',()=>{for(const other of page.querySelectorAll('[data-dg-observe]'))other.setAttribute('aria-pressed',String(other===button));start(button.dataset.dgObserve);});
 for(const link of page.querySelectorAll('[data-dg-scroll]'))link.addEventListener('click',event=>{event.preventDefault();scrollTo(page.querySelector(link.getAttribute('href')));});
 const fullscreen=page.querySelector('[data-dg-fullscreen]');if(!frame.requestFullscreen)fullscreen.hidden=true;else fullscreen.addEventListener('click',()=>frame.requestFullscreen().catch(()=>{status.textContent='Use “Open on its own” for a larger view.';}));
 function update(){if(root.dataset.page==='dungeon')root.querySelector('.rd-home img').src=page.querySelector('[data-dungeon-signature]').dataset.dungeonSignature;else stop();}
 new MutationObserver(update).observe(root,{attributes:true,attributeFilter:['data-page']});
 addEventListener('resize',schedule,{passive:true});document.addEventListener('fullscreenchange',()=>{const full=frame.matches(':fullscreen');frame.setAttribute('scrolling',full?'auto':'no');frame.contentDocument?.body?.classList.toggle('dg-fullscreen',full);schedule();});update();
})();
