/* eslint-disable @next/next/no-html-link-for-pages -- These links cross into standalone HTML portfolio routes and require document navigation. */
import type {CSSProperties,ReactNode} from 'react';
import {StoryMotion} from '@/components/story-motion';

export function OpenExperimentFrame({accent,children}:{accent:string;children:ReactNode}) {
  return <div data-story-root style={{'--experiment-accent':accent,'--brand-cyan':accent} as CSSProperties} className="min-h-screen bg-[#0b0d0c] text-[#eae7de] selection:bg-[var(--experiment-accent)] selection:text-black">
    <header className="flex min-h-24 items-center justify-between gap-5 border-b border-white/20 px-[5%] py-5">
      <a href="/#experiments" className="py-3 text-sm text-[var(--experiment-accent)] focus-visible:outline-2 focus-visible:outline-offset-4">← All experiments</a>
      <a href="/" aria-label="Josh Cole — home" className="block h-14 w-24 focus-visible:outline-2 focus-visible:outline-offset-4">
        <span aria-hidden="true" className="block h-full w-full bg-[var(--experiment-accent)] [mask-image:url('/portfolio/open-projects/signature.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" />
      </a>
    </header>
    {children}
    <StoryMotion />
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-5 border-t border-white/20 px-[5%] py-9 text-sm">
      <a href="/#experiments" className="py-3 text-[var(--experiment-accent)] focus-visible:outline-2">All experiments ↗</a>
      <span className="text-[#a2aaa6]">Open experiment / Josh Cole</span>
    </footer>
  </div>;
}
