"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createTotemMotion, loadTotemShapes, renderTotemPrint, settingsFromSearch, TOTEM_DEFAULTS, TOTEM_PALETTES, type TotemSettings, type TotemShape } from "@/lib/totem-renderer";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("totem-settings", callback);
  return () => { window.removeEventListener("popstate", callback); window.removeEventListener("totem-settings", callback); };
}
function snapshot() { return window.location.search; }
function serverSnapshot() { return ""; }

type Props = { mode: "print" | "motion"; assets: { src: string }[] };
const controlClass = "w-full accent-brand-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-cyan";
const buttonClass = "cursor-pointer border border-foreground/25 px-4 py-2 text-sm text-foreground hover:border-foreground/60 disabled:cursor-wait disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-cyan";

export function TotemLiveStudy({ mode, assets }: Props) {
  const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const settings = useMemo(() => settingsFromSearch(search), [search]);
  const settingsKey = JSON.stringify(settings);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionRef = useRef<ReturnType<typeof createTotemMotion> | null>(null);
  const [shapes, setShapes] = useState<TotemShape[]>([]);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState({ key: "", drawn: 0 });

  function update(key: keyof TotemSettings, value: number) {
    const url = new URL(window.location.href);
    if (value === TOTEM_DEFAULTS[key]) url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event("totem-settings"));
  }
  function reset() {
    const url = new URL(window.location.href);
    for (const key of Object.keys(TOTEM_DEFAULTS)) url.searchParams.delete(key);
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new Event("totem-settings"));
    setPlaying(false);
    if (mode === "motion" && canvasRef.current && shapes.length) motionRef.current = createTotemMotion(canvasRef.current, shapes, TOTEM_DEFAULTS);
  }

  useEffect(() => {
    const controller = new AbortController();
    loadTotemShapes(assets.map(asset => asset.src), controller.signal).then(loaded => { if (!controller.signal.aborted) setShapes(loaded); }).catch((reason: unknown) => {
      if (!controller.signal.aborted) setError(String(reason));
    });
    return () => controller.abort();
  }, [assets]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !shapes.length) return;
    try {
      if (mode === "print") return renderTotemPrint(canvas, shapes, settings, drawn => setProgress({ key: settingsKey, drawn }));
      motionRef.current = createTotemMotion(canvas, shapes, settings);
    } catch (reason) {
      queueMicrotask(() => setError(String(reason)));
    }
  }, [mode, shapes, settings, settingsKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (mode !== "motion" || !canvas) return;
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) setPlaying(false); }, { threshold: 0.15 });
    const hidden = () => { if (document.hidden) setPlaying(false); };
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = () => { if (preference.matches) setPlaying(false); };
    observer.observe(canvas);
    document.addEventListener("visibilitychange", hidden);
    preference.addEventListener("change", reduce);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", hidden); preference.removeEventListener("change", reduce); };
  }, [mode]);

  useEffect(() => {
    if (!playing || !shapes.length) return;
    let frame = 0;
    let previous = 0;
    function animate(now: number) {
      const delta = previous ? Math.min(50, now - previous) * 60 / 1000 : 0;
      previous = now;
      motionRef.current?.paint(delta);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [playing, shapes]);

  const ready = shapes.length > 0 && !error && (mode === "motion" || (progress.key === settingsKey && progress.drawn === settings.density));
  function saveImage() {
    if (!ready) return;
    canvasRef.current?.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `totem-${mode}-seed-${settings.seed}.png`; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="min-w-0">
      <div className="relative flex items-center justify-center border border-foreground/10 bg-panel p-3 sm:p-6">
        <canvas ref={canvasRef} width={1200} height={1200} role="img" aria-label={mode === "print" ? "Live generative composition made from original hand-drawn fragments" : "Live oscillating composition made from original hand-drawn ornaments"} data-render-ready={ready} data-playing={playing} className="aspect-square max-h-[68svh] w-auto max-w-full object-contain" />
        {!shapes.length && !error && <p className="absolute inset-x-0 top-1/2 text-center text-sm text-muted">Loading the original illustrations…</p>}
        {error && <p role="alert" className="absolute inset-x-4 top-1/2 bg-panel p-4 text-center text-sm text-foreground">{error} <button className="ml-2 cursor-pointer underline" onClick={() => window.location.reload()}>Reload</button></p>}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p role="status" className="text-xs text-muted">{error ? "Unable to render this study" : !shapes.length ? "Loading shapes" : mode === "motion" ? playing ? "Live · running" : "Live · paused" : ready ? "Live composition" : `Drawing ${progress.key === settingsKey ? progress.drawn : 0} / ${settings.density}`}</p>
        <div className="flex flex-wrap gap-2">
          {mode === "motion" && <button disabled={!shapes.length || !!error} className={buttonClass} onClick={() => setPlaying(value => !value)}>{playing ? "Pause motion" : "Start motion"}</button>}
          <button className={buttonClass} onClick={() => update("seed", (settings.seed + 1) % 2147483648)}>New variation</button>
          <button disabled={!ready} className={buttonClass} onClick={saveImage}>Save image</button>
          <button className={buttonClass} onClick={reset}>Reset</button>
        </div>
      </div>
      </div>
      <div className="min-w-0 xl:sticky xl:top-6">
      <fieldset className="grid min-w-0 gap-x-6 gap-y-5 border-t border-foreground/15 pt-5 sm:grid-cols-2 xl:grid-cols-1 xl:border-t-0 xl:pt-0">
        <legend className="sr-only">Adjust the live composition</legend>
        <label className="grid gap-2 text-xs text-muted">Seed
          <input type="number" min={0} max={2147483647} value={settings.seed} onChange={event => update("seed", Math.max(0, Math.min(2147483647, Math.floor(Number(event.target.value) || 0))))} className="w-full border border-foreground/25 bg-panel px-3 py-2 font-mono text-sm text-foreground focus-visible:outline-2 focus-visible:outline-brand-cyan" />
        </label>
        <label className="grid gap-2 text-xs text-muted">Palette
          <select aria-label="Palette" value={settings.palette} onChange={event => update("palette", Number(event.target.value))} className="w-full border border-foreground/25 bg-panel px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-brand-cyan">{TOTEM_PALETTES.map((palette, index) => <option key={palette.name} value={index}>{mode === "motion" ? index === 0 ? "Original motion palette" : index === 3 ? "Pastel" : palette.name : palette.name}</option>)}</select>
        </label>
        {mode === "print" ? (
          <label className="grid gap-3 text-xs text-muted">Fragments <span aria-hidden="true" className="font-mono text-foreground">{settings.density}</span><input className={controlClass} type="range" min={25} max={2000} step={25} value={settings.density} onChange={event => update("density", Number(event.target.value))} /></label>
        ) : (
          <label className="grid gap-3 text-xs text-muted">Rotation speed <span aria-hidden="true" className="font-mono text-foreground">{settings.rotation.toFixed(1)}</span><input className={controlClass} type="range" min={0} max={2} step={0.1} value={settings.rotation} onChange={event => update("rotation", Number(event.target.value))} /></label>
        )}
        <label className="grid gap-3 text-xs text-muted">Fragment scale <span aria-hidden="true" className="font-mono text-foreground">{settings.scale.toFixed(1)}×</span><input className={controlClass} type="range" min={0.3} max={2} step={0.1} value={settings.scale} onChange={event => update("scale", Number(event.target.value))} /></label>
        {mode === "motion" && <>
          <label className="grid gap-3 text-xs text-muted">Scale speed <span aria-hidden="true" className="font-mono text-foreground">{settings.speed.toFixed(1)}</span><input className={controlClass} type="range" min={0} max={2} step={0.1} value={settings.speed} onChange={event => update("speed", Number(event.target.value))} /></label>
          <label className="grid gap-3 text-xs text-muted">Trail fade <span aria-hidden="true" className="font-mono text-foreground">{settings.trails}</span><input className={controlClass} type="range" min={0} max={40} step={1} value={settings.trails} onChange={event => update("trails", Number(event.target.value))} /></label>
        </>}
      </fieldset>
      <p className="mt-5 text-xs leading-6 text-muted">Change the controls to draw a new composition. The URL keeps your settings. Save image exports the current 1200 × 1200 canvas.</p>
      </div>
    </div>
  );
}
