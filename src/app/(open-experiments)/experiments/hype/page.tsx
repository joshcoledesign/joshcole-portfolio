import type {Metadata} from 'next';
import Link from 'next/link';
import {OpenExperimentFrame} from '@/components/open-experiment-frame';
import {TotemGallery} from '@/components/totem-gallery';
import gallery from '@/data/totem-gallery.json';

export const metadata:Metadata={title:'Hype — Josh Cole',description:'Hand-drawn illustration, generative composition and motion. Explore the original cast and change the live studies.',alternates:{canonical:'/experiments/hype'},openGraph:{images:['/portfolio/open-projects/hype-field-preview.webp']}};

export default function HypePage(){
  return <OpenExperimentFrame accent="#ff639f">
    <main className="portfolio-page-content">
      <header className="border-b border-white/20 py-12 md:py-20">
        <p className="mb-5 font-mono text-xs tracking-[.14em] text-[#ff639f]">OPEN EXPERIMENT / ILLUSTRATION × CODE</p>
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <h1 className="text-[clamp(90px,17vw,240px)] leading-[.82] tracking-[-.075em]">Hype<span className="text-[#ff639f]">.</span></h1>
          <div className="max-w-xl"><h2 data-story-intro className="text-3xl leading-tight tracking-tight sm:text-5xl">The hand sets<br />the vocabulary.</h2><p className="mt-6 max-w-md text-base leading-7 text-[#b3b9b5]">I draw the shapes and choose the colors. Code finds the arrangements. Meet the original cast, then make a composition or set it in motion.</p></div>
        </div>
      </header>
      <section aria-label="Hype live exhibition" className="py-10 md:py-16" data-story-section><span data-story-rule aria-hidden="true" />
        <TotemGallery experiments={gallery.experiments} />
      </section>
      <section className="grid gap-7 border-t border-white/20 pt-9 text-base leading-7 text-[#b3b9b5] md:grid-cols-2" data-story-section><span data-story-rule aria-hidden="true" />
        <div><h2 data-story-intro className="mb-3 text-2xl tracking-tight text-[#eae7de]">A hand inside the system.</h2><p>The native work was made in Processing with the HYPE framework. These live browser adaptations draw the original SVG paths; their randomness and trail rendering differ from the native renderer.</p></div>
        <div><p>The Cast preserves the original illustrations. The Field changes placement, density, scale and palette. Oscillating adds rotation, scale and trails. Save image exports the visible canvas.</p><Link href="/work/hype-js" className="mt-5 inline-block py-3 text-[#ff639f] underline-offset-4 hover:underline">Read the original HYPE study ↗</Link><a href="/portfolio/licenses/hype-bsd.txt" className="ml-5 inline-block py-3 text-sm underline-offset-4 hover:underline">HYPE software notice ↗</a></div>
      </section>
    </main>
  </OpenExperimentFrame>;
}
