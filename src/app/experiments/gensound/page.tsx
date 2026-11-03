import type { Metadata } from "next";
import { PromptLine } from "@/components/prompt-line";
import { GensoundLab } from "@/components/gensound-lab";

export const metadata: Metadata = {
  title: "genSound — Audio into generative art | Josh Cole",
  description: "Explore music as generative art in rings and Hilbert layouts. Change the color rules or analyze your own audio locally in your browser.",
  alternates: { canonical: "/experiments/gensound" },
};

export default function GensoundPage() {
  return (
    <main className="mx-auto max-w-[1600px] px-5 pb-20 pt-6 sm:px-10 lg:px-14">
      <PromptLine href="/" command="./experiments/gensound" flag="" />
      <header className="mb-7 mt-8 flex flex-wrap items-end justify-between gap-6 sm:mt-10">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Generative / Audio experiments</p>
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">genSound</h1>
        </div>
        <nav aria-label="genSound links" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
          <a className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand-cyan" href="/experiments/gensound/index.html" target="_blank" rel="noopener noreferrer">Open lab ↗</a>
          <a className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-brand-cyan" href="https://github.com/joshcoledesign/genSound" target="_blank" rel="noopener noreferrer">View source ↗</a>
        </nav>
      </header>
      <GensoundLab />
      <p className="mt-5 max-w-4xl text-xs leading-6 text-muted">
        Example recordings: Chopin, Nocturne Op. 9 No. 2, performed by Peter Johnston (CC0); Beethoven, Symphony No. 8, iv., Musopen recording (public domain); &quot;Hitman&quot; by Kevin MacLeod (incompetech.com), licensed under <a className="underline hover:text-foreground" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Audio analysis is transformed into color; the recordings are not hosted here.
      </p>
      <p className="mt-2 text-xs leading-6 text-muted">
        <a className="underline hover:text-foreground" href="/experiments/gensound/EXAMPLE_TRACK_CREDITS.md">Recording credits</a>{" · "}
        <a className="underline hover:text-foreground" href="/experiments/gensound/THIRD_PARTY_NOTICES.md">Third-party notices</a>
      </p>
    </main>
  );
}
