"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import { TotemLiveStudy } from "@/components/totem-live-study";
import type galleryData from "@/data/totem-gallery.json";

type Experiment = (typeof galleryData.experiments)[number];
function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
function hashSnapshot() { return window.location.hash.slice(1); }
function serverSnapshot() { return ""; }

export function TotemGallery({ experiments }: { experiments: Experiment[] }) {
  const hash = useSyncExternalStore(subscribeToHash, hashSnapshot, serverSnapshot);
  const indexRef = useRef<HTMLOListElement>(null);
  const active = experiments.find(experiment => experiment.id === hash) ?? experiments[0];
  const index = experiments.indexOf(active);
  const previous = experiments[(index - 1 + experiments.length) % experiments.length];
  const next = experiments[(index + 1) % experiments.length];

  useEffect(() => {
    const list = indexRef.current;
    const selected = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !selected) return;
    const item = selected.getBoundingClientRect();
    const container = list.getBoundingClientRect();
    if (window.matchMedia("(min-width: 1024px)").matches) list.scrollTop += item.top - container.top - (list.clientHeight - item.height) / 2;
    else list.scrollLeft += item.left - container.left - (list.clientWidth - item.width) / 2;
  }, [active.id]);

  function navigateWithKeys(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      window.location.hash = event.key === "ArrowLeft" ? previous.id : next.id;
    }
  }
  const linkStyle = "text-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
      <nav aria-label="Totem collection" className="order-2 min-w-0 lg:order-1 lg:sticky lg:top-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">The collection</p>
        <ol ref={indexRef} className="flex gap-3 overflow-x-auto pb-3 lg:flex-col lg:gap-2">
          {experiments.map((experiment, position) => (
            <li key={experiment.id} className="w-44 shrink-0 lg:w-auto">
              <a href={"#" + experiment.id} aria-current={active.id === experiment.id ? "true" : undefined}
                className={["flex h-full items-center gap-3 border p-2 focus-visible:outline-2 focus-visible:outline-brand-cyan", active.id === experiment.id ? "border-foreground/60 bg-foreground/5" : "border-transparent hover:border-foreground/20"].join(" ")}>
                <Image unoptimized src={experiment.thumbnail} width={48} height={48} alt="" className="h-12 w-12 shrink-0 bg-[#f3f0ec] object-contain p-1" />
                <span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-muted">{String(position + 1).padStart(2, "0")} / {experiment.kind === "illustration" ? "Illustration" : "Live"}</span>
                  <span className="mt-1 block text-sm text-foreground">{experiment.title}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <section aria-label="Selected work. Use left and right arrow keys to browse." tabIndex={0} onKeyDown={navigateWithKeys}
        className="order-1 min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan lg:order-2">
        <div className="mb-5 flex items-start justify-between gap-6">
          <div aria-live="polite" aria-atomic="true">
            <p className="font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")} / {String(experiments.length).padStart(2, "0")}</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">{active.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{active.description}</p>
          </div>
          <div className="flex shrink-0 gap-4 pt-1">
            <a href={"#" + previous.id} aria-label={"Previous: " + previous.title} className={linkStyle}>← Prev</a>
            <a href={"#" + next.id} aria-label={"Next: " + next.title} className={linkStyle}>Next →</a>
          </div>
        </div>
        {active.kind === "illustration" ? (
          <div className="grid min-h-80 grid-cols-1 sm:grid-cols-3 items-center gap-3 bg-[#f3f0ec] px-4 py-8 sm:gap-6 sm:px-8 sm:py-16">
            {active.assets.map(asset => (
              <figure key={asset.src} className="flex flex-col items-center gap-4">
                <a href={asset.src} target="_blank" rel="noreferrer" aria-label={"View " + asset.label}
                  className={"block w-full focus-visible:outline-2 focus-visible:outline-brand-cyan " + (asset.src.endsWith("/crest.svg") ? "bg-[#555555]" : "")}>
                  <Image unoptimized src={asset.src} width={420} height={540} alt={asset.label}
                    className="h-44 w-full object-contain sm:h-[min(38vw,380px)]" priority />
                </a>
                <figcaption className="text-center font-mono text-[10px] uppercase tracking-wider text-[#555555]">{asset.label}</figcaption>
              </figure>
            ))}
          </div>
        ) : <TotemLiveStudy key={active.id} mode={active.kind === "live-print" ? "print" : "motion"} assets={active.assets} />}
        <details className="mt-7 border-t border-foreground/15 pt-4 text-sm text-muted">
          <summary className="w-fit cursor-pointer text-foreground focus-visible:outline-2 focus-visible:outline-brand-cyan">About this work</summary>
          <p className="mt-4 max-w-2xl leading-7">{active.kind === "illustration"
            ? "The original character and ornamental illustrations, shown before generative placement and recoloring."
            : "A live browser adaptation of the original Processing/HYPE study, drawing the same hand-authored SVG paths. The controls change the drawing itself. Browser randomness and trail rendering differ from the native renderer."}</p>
        </details>
      </section>
    </div>
  );
}
