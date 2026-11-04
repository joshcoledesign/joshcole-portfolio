'use client';

import {useEffect} from 'react';

/** Progressive enhancement: the server-rendered story is always fully visible. */
export function AboutMotion(){
  useEffect(()=>{
    const root=document.querySelector<HTMLElement>('[data-about-motion]');
    if(!root)return;
    const portrait=root.querySelector<HTMLElement>('[data-about-portrait]');
    const frame=root.querySelector<HTMLElement>('[data-about-portrait-frame]');
    const introductions=root.querySelectorAll<HTMLElement>('[data-about-reveal]');
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen=new WeakSet<Element>(),animations=new Set<Animation>();
    let observer:IntersectionObserver|undefined,scrollFrame=0;

    function resetPortrait(){
      portrait?.style.removeProperty('transform');
      portrait?.style.removeProperty('will-change');
    }
    function updateScroll(){
      scrollFrame=0;
      if(reduced.matches||!portrait||!frame)return;
      // Measure the stationary frame so the image's transform never feeds back into its position.
      const rect=frame.getBoundingClientRect(),height=window.innerHeight;
      if(rect.bottom<0||rect.top>height){portrait.style.removeProperty('will-change');return;}
      const progress=Math.max(-1,Math.min(1,(height/2-rect.top-rect.height/2)/(height/2+rect.height/2)));
      const distance=window.innerWidth<768?7:12;
      portrait.style.setProperty('transform',`translate3d(0,${(-progress*distance).toFixed(2)}px,0) scale(1.045)`);
      portrait.style.setProperty('will-change','transform');
    }
    function schedule(){
      if(!scrollFrame&&!reduced.matches)scrollFrame=requestAnimationFrame(updateScroll);
    }
    function syncPreference(){
      observer?.disconnect();
      cancelAnimationFrame(scrollFrame);scrollFrame=0;
      for(const animation of animations)animation.cancel();
      animations.clear();
      resetPortrait();
      if(reduced.matches)return;
      if('IntersectionObserver' in window){
        observer=new IntersectionObserver(entries=>{
          for(const entry of entries){
            if(!entry.isIntersecting||seen.has(entry.target)||reduced.matches)continue;
            seen.add(entry.target);observer?.unobserve(entry.target);
            if(typeof entry.target.animate!=='function')continue;
            const animation=entry.target.animate([
              {translate:'0 12px',opacity:.82},
              {translate:'0 0',opacity:1},
            ],{duration:650,easing:'cubic-bezier(.2,.75,.2,1)'});
            animations.add(animation);
            animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));
          }
        },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
        for(const introduction of introductions)if(!seen.has(introduction))observer.observe(introduction);
      }
      schedule();
    }

    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    reduced.addEventListener('change',syncPreference);
    syncPreference();
    return ()=>{
      observer?.disconnect();cancelAnimationFrame(scrollFrame);
      for(const animation of animations)animation.cancel();
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
      reduced.removeEventListener('change',syncPreference);
      resetPortrait();
    };
  },[]);
  return null;
}
