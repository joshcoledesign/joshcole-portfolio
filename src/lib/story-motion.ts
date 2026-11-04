/** Shared progressive enhancement for React pages and standalone portfolio documents. */
export function mountStoryMotion(root:HTMLElement){
    const portrait=root.querySelector<HTMLElement>('[data-about-portrait]');
    const frame=root.querySelector<HTMLElement>('[data-about-portrait-frame]');
    const introductions=root.querySelectorAll<HTMLElement>('[data-about-reveal],[data-story-intro]');
    const rules=[...root.querySelectorAll<HTMLElement>('[data-about-rule],[data-story-rule]')].map(element=>({element,section:element.closest('[data-story-section],section')}));
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const seen=new WeakSet<Element>(),animations=new Set<Animation>();
    let observer:IntersectionObserver|undefined,scrollFrame=0;
    const document=root.ownerDocument;
    const headers=[...document?.querySelectorAll<HTMLElement>('[data-site-header]')??[]];
    let headerHeight=-1;
    function syncHeader(){
      const header=headers.find(element=>element.getClientRects().length);
      const height=header?Math.ceil(header.getBoundingClientRect().height):0;
      if(height!==headerHeight){headerHeight=height;document?.documentElement.style.setProperty('--site-header-height',`${height}px`);}
    }
    const headerObserver=headers.length&&'ResizeObserver' in window?new ResizeObserver(syncHeader):undefined;
    for(const header of headers)headerObserver?.observe(header);
    syncHeader();

    function resetPortrait(){
      portrait?.style.removeProperty('transform');
      portrait?.style.removeProperty('will-change');
      for(const {element}of rules){
        element.style.removeProperty('transform');
        element.style.removeProperty('will-change');
      }
    }
    function updateScroll(){
      scrollFrame=0;
      if(reduced.matches)return;
      const height=window.innerHeight,mobile=window.innerWidth<768;
      // Draw the chapter divider from its stationary section, never a transformed element.
      for(const {element,section}of rules){
        if(!section)continue;
        if(!section.getClientRects().length)continue;
        const rect=section.getBoundingClientRect();
        if(rect.bottom<0||rect.top>height){element.style.removeProperty('will-change');continue;}
        const progress=Math.max(0,Math.min(1,(height-rect.top)/(height*.75)));
        element.style.setProperty('transform',`scaleX(${progress.toFixed(3)})`);
        element.style.setProperty('will-change','transform');
      }
      if(!portrait||!frame)return;
      // Measure the stationary frame so the image's transform never feeds back into its position.
      const rect=frame.getBoundingClientRect();
      if(rect.bottom<0||rect.top>height){portrait.style.removeProperty('will-change');return;}
      const progress=Math.max(-1,Math.min(1,(height/2-rect.top-rect.height/2)/(height/2+rect.height/2)));
      const distance=mobile?14:24;
      portrait.style.setProperty('transform',`translate3d(0,${(-progress*distance).toFixed(2)}px,0) scale(1.08)`);
      portrait.style.setProperty('will-change','transform');
    }
    function schedule(){
      if(!scrollFrame&&!reduced.matches)scrollFrame=requestAnimationFrame(updateScroll);
    }
    function refresh(){syncHeader();schedule();}
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
              {translate:'0 44px',opacity:.45},
              {translate:'0 0',opacity:1},
            ],{duration:1000,easing:'cubic-bezier(.22,1,.36,1)'});
            animations.add(animation);
            animation.finished.then(()=>animations.delete(animation),()=>animations.delete(animation));
          }
        },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
        for(const introduction of introductions)if(!seen.has(introduction))observer.observe(introduction);
      }
      schedule();
    }

    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',refresh,{passive:true});
    reduced.addEventListener('change',syncPreference);
    root.addEventListener('portfolio:view-change',refresh);
    root.addEventListener('toggle',schedule,true);
    syncPreference();
    return ()=>{
      observer?.disconnect();headerObserver?.disconnect();cancelAnimationFrame(scrollFrame);
      document?.documentElement.style.removeProperty('--site-header-height');
      root.removeEventListener('portfolio:view-change',refresh);
      root.removeEventListener('toggle',schedule,true);
      for(const animation of animations)animation.cancel();
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',refresh);
      reduced.removeEventListener('change',syncPreference);
      resetPortrait();
    };
}
