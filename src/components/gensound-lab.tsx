"use client";

import { useEffect, useRef } from "react";

export function GensoundLab() {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = frame.current;
    if (!iframe) return;
    let observer: ResizeObserver | undefined;

    const observe = () => {
      observer?.disconnect();
      const document = iframe.contentDocument;
      const app = document?.querySelector<HTMLElement>(".app");
      if (!document || !app) return;
      const resize = () => {
        // Observe content rather than the document's viewport-sized body so the
        // frame can shrink again after moving from phone to desktop width.
        const height = Math.ceil(app.offsetTop + app.offsetHeight + 16);
        iframe.style.height = `${height}px`;
      };
      observer = new ResizeObserver(resize);
      observer.observe(app);
      resize();
    };

    iframe.addEventListener("load", observe);
    observe();
    return () => {
      iframe.removeEventListener("load", observe);
      observer?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={frame}
      src="/experiments/gensound/index.html"
      title="genSound Color Lab — audio into generative art"
      allow="fullscreen; clipboard-write"
      allowFullScreen
      className="block min-h-[900px] w-full rounded-lg border border-white/10 bg-[#121316]"
    />
  );
}
