import type {Metadata} from 'next';
import {OpenExperimentFrame} from '@/components/open-experiment-frame';
import {WorldstageStudy} from '@/components/worldstage-study';
import {WorldstageStudio} from '@/components/worldstage-studio';

export const metadata:Metadata={title:'Worldstage — Josh Cole',description:'A procedural filmmaking experiment: direct a performance, preserve a take and film it through independent camera coverage.',alternates:{canonical:'/experiments/worldstage'},openGraph:{images:['/portfolio/open-projects/worldstage-preview.webp']}};

export default function WorldstagePage(){
  return <OpenExperimentFrame accent="#f1ab71"><main className="portfolio-page-content">
    <header className="py-12 md:py-20"><p className="mb-8 font-mono text-xs tracking-[.14em] text-[#f1ab71]">OPEN EXPERIMENT / PROCEDURAL FILMMAKING</p><h1 className="text-[clamp(52px,10.5vw,160px)] leading-[.9] tracking-[-.065em]">Worldstage<span className="text-[#f1ab71]">.</span></h1><div className="mt-9 grid gap-6 md:grid-cols-2"><h2 data-story-intro className="max-w-xl text-3xl leading-tight tracking-tight sm:text-5xl">Direct a performance.<br /><span className="text-[#f1ab71]">Find the film.</span></h2><p className="max-w-lg text-base leading-7 text-[#b3b9b5]">Define an environment and behaviors. Vary the controls, discover takes, preserve a performance, then capture it through independent camera coverage.</p></div></header>
    <WorldstageStudio />
    <details className="mt-12"><summary className="cursor-pointer py-4 text-xl text-[#f1ab71]">Watch a finished edit +</summary><WorldstageStudy /></details>
    <section className="mt-16 grid gap-9 border-t border-white/20 pt-9 text-base leading-7 md:grid-cols-3" aria-label="Inside Worldstage" data-story-section><span data-story-rule aria-hidden="true" />{[{n:'01 / DIRECT',title:'Conditions become behavior.',text:'Direct wind, landing cues, engine ignition and thrust. Changes can produce a settled landing or an unsuccessful attempt.'},{n:'02 / PRESERVE',title:'Keep the performance.',text:'A selected take retains its recorded motion. Painting and camera edits use that performance, rather than silently making a different one.'},{n:'03 / COVER',title:'One event. More than one view.',text:'Paint wide and shoreline coverage of your saved take. Trim, reorder and compose three shots, mix the performance sound, then export the edit.'}].map(item=><div key={item.n}><p className="mb-5 font-mono text-xs tracking-widest text-[#f1ab71]">{item.n}</p><h2 data-story-intro className="mb-4 text-2xl leading-tight tracking-tight">{item.title}</h2><p className="text-[#a6b0aa]">{item.text}</p></div>)}</section>
    <aside className="mt-12 border-l-2 border-[#f1ab71] py-2 pl-6 text-sm leading-7 text-[#a6b0aa]">This study combines painted source art with recorded motion, layered atmosphere and projected contact. It is an illustrated performance prototype, not a finished production engine.</aside>
  </main></OpenExperimentFrame>;
}
