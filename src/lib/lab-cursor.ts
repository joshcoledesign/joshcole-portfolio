/** Decorative lab invitation. Native links, focus and pointer behavior remain intact. */
export function mountLabCursor(root:HTMLElement){
  const projects:Record<string,{name:string;detail:string;ink:string}>={
    culture:{name:'CULTURE',detail:'LIVING SYSTEM',ink:'#42e2ed'},
    hype:{name:'HYPE',detail:'DRAWING × CODE',ink:'#ff639f'},
    gensound:{name:'GENSOUND',detail:'AUDIO → COLOR',ink:'#42e2ed'},
    worldstage:{name:'WORLDSTAGE',detail:'DIRECTING',ink:'#f1ab71'},
    dungeon:{name:'DRY RUN DUNGEON',detail:'WORLD MODEL',ink:'#42e2ed'},
  };
  const doc=root.ownerDocument,win=doc.defaultView;
  if(!win)return ()=>{};
  const fine=win.matchMedia('(any-hover: hover) and (any-pointer: fine)'),reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
  const tag=doc.createElement('div');tag.className='lab-specimen';tag.hidden=true;tag.setAttribute('aria-hidden','true');
  const cross=doc.createElement('span');cross.className='lab-specimen-cross';
  const fragment=doc.createElement('span');fragment.className='lab-specimen-fragment';
  const copy=doc.createElement('span');copy.className='lab-specimen-copy';
  const action=doc.createElement('span');action.className='lab-specimen-action';
  const meta=doc.createElement('span');meta.className='lab-specimen-meta';copy.append(action,meta);tag.append(cross,fragment,copy);doc.body.append(tag);
  let active:HTMLElement|null=null,frame=0,point={x:0,y:0},keyboard=false;
  const entry=(node:EventTarget|null)=>node instanceof win.Element?node.closest<HTMLElement>('[data-lab-entry]'):null;
  function hide(){active=null;tag.hidden=true;win!.cancelAnimationFrame(frame);frame=0;tag.classList.remove('is-following');}
  function place(){
    frame=0;if(!active)return;
    const box=tag.getBoundingClientRect(),anchor=active.getBoundingClientRect();
    const width=doc.documentElement?.clientWidth||win!.innerWidth,height=doc.documentElement?.clientHeight||win!.innerHeight;
    let x=keyboard||reduced.matches?anchor.right+12:point.x+22;
    let y=keyboard||reduced.matches?anchor.top:point.y+22;
    if(x+box.width>width-12)x=keyboard||reduced.matches?anchor.left-box.width-12:point.x-box.width-22;
    if(y+box.height>height-12)y=keyboard||reduced.matches?anchor.bottom-box.height:point.y-box.height-22;
    x=Math.max(12,Math.min(x,width-box.width-12));y=Math.max(12,Math.min(y,height-box.height-12));
    tag.style.transform=`translate3d(${Math.round(x)}px,${Math.round(y)}px,0)`;
  }
  function queue(){if(!frame)frame=win!.requestAnimationFrame(place);}
  function show(target:HTMLElement,fromKeyboard:boolean){
    const project=target.dataset.labEntry,info=projects[project??''];if(!info)return;
    if(active===target&&keyboard===fromKeyboard)return;
    active=target;keyboard=fromKeyboard;tag.classList.remove('is-following');tag.dataset.project=project;
    const ink=project==='culture'?win!.getComputedStyle(target).getPropertyValue('--rh-ink').trim():'';
    tag.style.setProperty('--specimen-ink',ink||info.ink);
    action.textContent=target.dataset.labAction==='studio'?'EXPLORE STUDIO ↗':target.dataset.labAction==='experiment'?'EXPLORE EXPERIMENT ↗':'ENTER LAB ↗';
    meta.textContent=info.name+' / '+info.detail;fragment.replaceChildren();
    if(project==='hype'){const image=doc.createElement('img');image.src='/case-studies/hype-js/totem/cast/ornaments.svg';image.alt='';fragment.append(image);}
    else for(let i=0;i<(project==='gensound'?7:project==='dungeon'?4:3);i++){const part=doc.createElement('i');fragment.append(part);}
    tag.hidden=false;place();tag.getBoundingClientRect();
    // Position the first frame directly, then allow a little trailing movement.
    queue();
  }
  function move(event:PointerEvent){
    if(event.pointerType!=='mouse'||!fine.matches){hide();return;}
    point={x:event.clientX,y:event.clientY};const target=entry(event.target);
    if(!target||!root.contains(target)){hide();return;}
    show(target,false);if(!reduced.matches){tag.classList.add('is-following');queue();}
  }
  function leave(event:PointerEvent){if(active&&!active.contains(event.relatedTarget as Node|null))hide();}
  function focus(event:FocusEvent){const target=entry(event.target);if(fine.matches&&target?.matches(':focus-visible'))show(target,true);}
  function activate(event:MouseEvent){if(entry(event.target))hide();}
  function scroll(){if(keyboard&&active)queue();else hide();}
  function preference(){if(!fine.matches)hide();else if(active){tag.classList.remove('is-following');place();}}
  function escape(event:KeyboardEvent){if(event.key==='Escape')hide();}
  root.addEventListener('pointerover',move);root.addEventListener('pointermove',move);root.addEventListener('pointerout',leave);
  root.addEventListener('focusin',focus);root.addEventListener('focusout',hide);root.addEventListener('pointerdown',hide);root.addEventListener('click',activate);
  root.addEventListener('portfolio:view-change',hide);doc.addEventListener('keydown',escape);
  win.addEventListener('scroll',scroll,{passive:true});win.addEventListener('resize',hide,{passive:true});win.addEventListener('blur',hide);
  fine.addEventListener('change',preference);reduced.addEventListener('change',preference);
  return ()=>{
    hide();tag.remove();root.removeEventListener('pointerover',move);root.removeEventListener('pointermove',move);root.removeEventListener('pointerout',leave);
    root.removeEventListener('focusin',focus);root.removeEventListener('focusout',hide);root.removeEventListener('pointerdown',hide);root.removeEventListener('click',activate);
    root.removeEventListener('portfolio:view-change',hide);doc.removeEventListener('keydown',escape);
    win.removeEventListener('scroll',scroll);win.removeEventListener('resize',hide);win.removeEventListener('blur',hide);
    fine.removeEventListener('change',preference);reduced.removeEventListener('change',preference);
  };
}
