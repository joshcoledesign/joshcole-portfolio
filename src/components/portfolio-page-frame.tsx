/* eslint-disable @next/next/no-html-link-for-pages -- These destinations require full document navigation. */
import type {ReactNode} from 'react';
import localFont from 'next/font/local';

const geist=localFont({src:[
  {path:'../../public/portfolio/media/ccce59465ae5c61930ad.ttf',weight:'400',style:'normal'},
  {path:'../../public/portfolio/media/a8eefb873ba9c9020665.ttf',weight:'500',style:'normal'},
],display:'swap'});

export function PortfolioPageFrame({children}:{children:ReactNode}){
  return <div className={`${geist.className} min-h-screen bg-[#0b0d0c] text-[#efece3] selection:bg-[#42e2ed] selection:text-[#0b0d0c]`}>
    <header className="flex min-h-28 flex-wrap items-center justify-between gap-5 border-b border-[#373d36] px-[5%] py-5">
      <a href="/" aria-label="Josh Cole — home" className="block h-16 w-28 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#42e2ed]"><span aria-hidden="true" className="block h-full w-full bg-[#42e2ed] [mask-image:url('/portfolio/open-projects/signature.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]" /></a>
      <nav aria-label="Main navigation" className="flex flex-wrap gap-x-6 text-sm"><a href="/#case-studies" className="py-3 !text-[#efece3] hover:!text-[#42e2ed]">Case studies</a><a href="/#experiments" className="py-3 !text-[#efece3] hover:!text-[#42e2ed]">Experiments</a><a href="/about" aria-current="page" className="py-3 !text-[#42e2ed]">About</a></nav>
    </header>
    {children}
    <footer className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-[#373d36] px-[5%] py-8 text-sm text-[#a9ada5]"><span className="font-mono text-xs tracking-wider">JOSH COLE / INDEPENDENT PRACTICE</span><div className="flex gap-7"><a href="/" className="py-3 !text-[#42e2ed]">Homepage ↗</a><a href="/resume" className="py-3 !text-[#42e2ed]">Résumé ↗</a></div></footer>
  </div>;
}
