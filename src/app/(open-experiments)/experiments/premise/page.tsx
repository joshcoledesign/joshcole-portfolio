import type {Metadata} from 'next';
import {OpenExperimentFrame} from '@/components/open-experiment-frame';
import {PremiseWorldGallery} from '@/components/premise-world-gallery';

export const metadata:Metadata={title:'Premise — Josh Cole',description:'A sentence becomes a world package: scene, subjects, laws, actions and opening frames. Explore selected worlds from the authoring experiment.',alternates:{canonical:'/experiments/premise'},openGraph:{images:['/portfolio/open-projects/premise-preview.webp']}};

export default function PremisePage(){
  return <OpenExperimentFrame accent="#cfdf8b"><main className="portfolio-page-content">
    <header className="py-12 md:py-20"><p className="mb-8 font-mono text-xs tracking-[.14em] text-[#cfdf8b]">OPEN EXPERIMENT / WORLD AUTHORING</p><h1 className="text-[clamp(68px,14vw,210px)] leading-[.85] tracking-[-.07em]">Premise<span className="text-[#cfdf8b]">.</span></h1><div className="mt-10 grid gap-7 md:grid-cols-2"><h2 data-story-intro className="text-3xl leading-tight tracking-tight sm:text-5xl">One sentence.<br /><span className="text-[#cfdf8b]">A world to inspect.</span></h2><p className="max-w-xl text-base leading-7 text-[#b3bcb0]">An authoring engine turns a sentence into a portable world package: a scene, subjects, laws, actions, controls and a 15-second opening. Explore the images and the structure underneath them.</p></div><p className="mt-10 border-l-2 border-[#cfdf8b] pl-5 font-mono text-xs leading-7 text-[#cfdf8b]">SENTENCE → SCENE + SUBJECTS + LAWS → FIRST FRAME + OPENING</p></header>
    <PremiseWorldGallery />
  </main></OpenExperimentFrame>;
}
