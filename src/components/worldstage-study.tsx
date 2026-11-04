'use client';

import {useRef,useState} from 'react';

const views=[{id:'edit',label:'The edit',note:'Wide → shoreline → wide. One preserved performance.'},{id:'wide',label:'Wide',note:'The complete performance from the wide view.'},{id:'shoreline',label:'Shoreline',note:'The same performance, painted from shoreline coverage.'}] as const;
const moments=[{label:'Arrival',time:0},{label:'Braking detail',time:208/24},{label:'Contact detail',time:396/24},{label:'Shutdown',time:463/24}];
export function WorldstageStudy(){
  const [view,setView]=useState<(typeof views)[number]>(views[0]);
  const [playing,setPlaying]=useState(false);
  const videoRef=useRef<HTMLVideoElement>(null),position=useRef(0),resume=useRef(false);
  function select(next:(typeof views)[number]){if(next.id===view.id)return;position.current=videoRef.current?.currentTime??0;resume.current=!!videoRef.current&&!videoRef.current.paused;setView(next);}
  function seek(time:number){if(videoRef.current)videoRef.current.currentTime=Math.min(time,videoRef.current.duration||time);}
  return <section aria-label="Worldstage recorded performance" className="border-t border-white/20">
    <div className="flex flex-wrap items-center justify-between gap-5 py-6"><p className="font-mono text-xs tracking-widest text-[#f1ab71]">BLACK SHORE / THREE MOONS</p><div className="flex gap-2" aria-label="Camera coverage">{views.map(item=><button key={item.id} onClick={()=>select(item)} aria-pressed={view.id===item.id} className="min-h-11 cursor-pointer border border-white/25 px-5 py-2 text-sm transition-colors hover:border-[#f1ab71] aria-pressed:border-[#f1ab71] aria-pressed:bg-[#f1ab71] aria-pressed:text-[#0b0d0c] focus-visible:outline-2 focus-visible:outline-offset-4">{item.label}</button>)}</div></div>
    <video ref={videoRef} key={view.id} src={'/portfolio/open-projects/worldstage/'+view.id+'.mp4'} poster={'/portfolio/open-projects/worldstage/'+(view.id==='shoreline'?'shoreline':'wide')+'.webp'} controls playsInline preload="metadata" aria-label={'Worldstage recorded performance — '+view.label} className="aspect-[40/17] w-full bg-black" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onLoadedMetadata={event=>{event.currentTarget.currentTime=Math.min(position.current,event.currentTarget.duration-.001);if(resume.current)void event.currentTarget.play().catch(()=>setPlaying(false));}} />
    <div className="flex flex-wrap items-center justify-between gap-5 border-b border-white/20 py-5"><button onClick={()=>{const video=videoRef.current;if(!video)return;if(video.paused)void video.play().catch(()=>setPlaying(false));else video.pause();}} className="min-h-11 cursor-pointer border border-[#f1ab71] px-6 text-sm text-[#f1ab71] focus-visible:outline-2 focus-visible:outline-offset-4">{playing?'Pause film':'Play film'}</button><p role="status" className="text-sm text-[#bbc1be]">{view.note}</p><span className="font-mono text-xs text-[#8e9792]">RECORDED / 464 FRAMES / 19.33s</span></div>
    <div className="grid grid-cols-2 gap-px bg-white/15 sm:grid-cols-4" aria-label="Inspect recorded moments">{moments.map(moment=><button key={moment.label} onClick={()=>seek(moment.time)} className="cursor-pointer bg-[#101413] p-5 text-left transition-colors hover:bg-[#1c2420] focus-visible:outline-2 focus-visible:-outline-offset-2"><span className="mb-2 block font-mono text-xs text-[#f1ab71]">{moment.time.toFixed(1)}s ↗</span><span className="text-sm">{moment.label}</span></button>)}</div>
    <p className="mt-5 max-w-3xl text-sm leading-6 text-[#8e9792]">Recorded outputs from the local directing prototype. Change coverage or inspect a moment here; new simulations and renders run in the studio.</p>
  </section>;
}
