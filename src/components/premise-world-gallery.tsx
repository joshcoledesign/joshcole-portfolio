'use client';

import Image from 'next/image';
import {useState} from 'react';
import worlds from '@/data/premise-worlds.json';

export function PremiseWorldGallery(){
  const [worldIndex,setWorldIndex]=useState(0),[frameIndex,setFrameIndex]=useState(0);
  const world=worlds[worldIndex],frame=world.frames[frameIndex];
  return <section data-story-section aria-label="Explore Premise worlds" className="border-t border-white/20 pt-8"><span data-story-rule aria-hidden="true" />
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 data-story-intro className="text-3xl tracking-tight">The world gallery.</h2><p className="font-mono text-xs text-[#cfdf8b]">{String(worldIndex+1).padStart(2,'0')} / {String(worlds.length).padStart(2,'0')} SELECTED WORLDS</p></div>
    <div className="grid items-start gap-7 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-10">
      <nav aria-label="Choose a world" className="min-w-0 lg:sticky lg:top-6"><div className="flex gap-3 overflow-x-auto pb-4 lg:flex-col">{worlds.map((item,index)=><button key={item.id} onClick={()=>{setWorldIndex(index);setFrameIndex(0);}} aria-pressed={worldIndex===index} className="flex w-64 shrink-0 cursor-pointer items-center gap-3 border border-white/15 p-2 text-left text-sm hover:border-[#cfdf8b] aria-pressed:border-[#cfdf8b] aria-pressed:bg-[#cfdf8b]/8 focus-visible:outline-2 focus-visible:outline-offset-2 lg:w-full"><Image unoptimized src={item.frames[0].src} alt="" width={96} height={54} className="aspect-video w-20 shrink-0 object-cover" /><span>{item.title}</span></button>)}</div></nav>
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><h3 className="text-3xl tracking-tight">{world.title}</h3><p role="status" className="font-mono text-xs text-[#cfdf8b]">{frame.label} / {frame.time.toFixed(1)}s</p></div>
        <a href={frame.src} target="_blank" rel="noreferrer" aria-label={'View '+world.title+' full frame'} className="block focus-visible:outline-2 focus-visible:outline-offset-4"><Image unoptimized priority src={frame.src} alt={world.title+' — '+frame.label+' at '+frame.time+' seconds'} width={1280} height={720} className="aspect-video h-auto w-full bg-black object-contain" /></a>
        <div className="mt-3 grid grid-cols-4 gap-2" aria-label="Opening frames">{world.frames.map((item,index)=><button key={item.src} onClick={()=>setFrameIndex(index)} aria-pressed={frameIndex===index} className="min-w-0 cursor-pointer border border-transparent p-1 text-left aria-pressed:border-[#cfdf8b] focus-visible:outline-2 focus-visible:outline-offset-2"><Image unoptimized src={item.src} alt="" width={240} height={135} className="aspect-video w-full object-cover" /><span className="mt-2 block text-xs text-[#b3bcb0]">{index===0?'First frame':item.time.toFixed(1)+'s'}</span></button>)}</div>
        <div className="mt-9 border-y border-white/20 py-7"><p className="mb-3 font-mono text-xs tracking-widest text-[#cfdf8b]">THE SENTENCE</p><p className="text-xl leading-relaxed tracking-tight sm:text-2xl">{world.premise}</p><p className="mt-4 text-sm text-[#98a393]">Medium / {world.medium}</p></div>
        <div className="mt-7 grid gap-7 text-sm leading-7 sm:grid-cols-2"><div><h4 className="mb-3 font-mono text-xs tracking-widest text-[#cfdf8b]">SUBJECTS</h4><ul className="list-inside list-disc text-[#b3bcb0]">{world.subjects.map(name=><li key={name}>{name}</li>)}</ul></div><div><h4 className="mb-3 font-mono text-xs tracking-widest text-[#cfdf8b]">AUTHORED ACTIONS</h4><p className="text-[#b3bcb0]">{world.actions.join(' · ')}</p></div></div>
        <details className="mt-7 border-t border-white/20 pt-5"><summary className="w-fit cursor-pointer py-2 text-sm text-[#cfdf8b] focus-visible:outline-2">Inspect the world’s laws</summary><ul className="mt-4 space-y-4 text-base leading-7 text-[#b3bcb0]">{world.laws.map(law=><li key={law}>{law}</li>)}</ul></details>
        <p className="mt-7 text-sm leading-7 text-[#98a393]">Generated first frames and opening previews from selected world packages. These images show authored intent; this gallery does not run a live world simulation.</p>
      </div>
    </div>
  </section>;
}
