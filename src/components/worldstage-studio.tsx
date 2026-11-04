'use client';

import {useEffect,useRef,useState} from 'react';
import Image from 'next/image';

export function WorldstageStudio(){
  const [open,setOpen]=useState(false),[height,setHeight]=useState(1800);
  const frame=useRef<HTMLIFrameElement>(null);
  useEffect(()=>{
    function resize(event:MessageEvent){
      if(event.origin!==location.origin||event.source!==frame.current?.contentWindow)return;
      const data:unknown=event.data;
      if(!data||typeof data!=='object')return;
      const message=data as {type?:unknown;height?:unknown};
      if(message.type==='worldstage:height'&&typeof message.height==='number'&&Number.isFinite(message.height))setHeight(Math.max(800,Math.min(24000,message.height+8)));
    }
    window.addEventListener('message',resize);
    return ()=>window.removeEventListener('message',resize);
  },[]);
  return <section data-story-section id="worldstage-studio" aria-label="Worldstage directing studio" className="border-y border-white/20 py-8"><span data-story-rule aria-hidden="true" />
    <div className="mb-6 flex flex-wrap items-center justify-between gap-5"><div><h2 data-story-intro className="text-3xl tracking-tight">The directing studio.</h2><p className="mt-3 max-w-2xl text-base leading-7 text-[#a6b0aa]">Change the conditions. Discover takes. Paint a performance, compose the shots, and export your film.</p></div><a data-lab-entry="worldstage" href="/experiments/worldstage/studio/index.html" target="_blank" rel="noopener" className="inline-flex min-h-11 items-center border border-[#f1ab71] px-5 py-3 text-sm text-[#f1ab71] focus-visible:outline-2 focus-visible:outline-offset-4">Open full window ↗</a></div>
    {open?<iframe ref={frame} src="/experiments/worldstage/studio/index.html" title="Worldstage full directing studio" sandbox="allow-scripts allow-same-origin allow-downloads" allow="fullscreen" style={{height}} className="w-full border-0 bg-[#0b0d0c]" />:<div className="relative overflow-hidden bg-[#0b0d0c]"><Image src="/portfolio/open-projects/worldstage/wide.webp" width="1280" height="544" alt="The Black Shore scene ready to direct in Worldstage" className="aspect-[40/17] w-full object-cover opacity-75" /><div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/20 p-6"><p className="max-w-xl text-sm leading-6 text-[#b9c2bc]">Landing, weather, engine and cue controls. Saved takes, comparison, camera coverage, editing, sound and film export.</p><button data-lab-entry="worldstage" onClick={()=>setOpen(true)} className="min-h-12 cursor-pointer bg-[#f1ab71] px-7 py-3 font-medium text-[#0b0d0c] focus-visible:outline-2 focus-visible:outline-offset-4">Launch the studio ↗</button></div></div>}
    <p className="mt-5 max-w-3xl text-sm leading-6 text-[#8e9792]">Your takes and films save in this browser. Download performances and finished films to keep a copy. Keep the studio open while painting or exporting.</p>
  </section>;
}
