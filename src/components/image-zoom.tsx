"use client";

import { useState } from "react";
import styles from "./image-zoom.module.css";

export function ImageZoom({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState(100);
  const change = (value: number) => setZoom(Math.max(25, Math.min(300, value)));
  return (
    <div className={styles.viewer} onClick={event => event.stopPropagation()}>
      <div className={styles.controls} role="group" aria-label="Image zoom controls">
        <button type="button" aria-label="Zoom out" disabled={zoom === 25} onClick={() => change(zoom - 25)}>−</button>
        <label>Zoom <output>{zoom}%</output><input type="range" min="25" max="300" step="5" value={zoom} aria-label="Image zoom" onChange={event => change(Number(event.target.value))} /></label>
        <button type="button" aria-label="Zoom in" disabled={zoom === 300} onClick={() => change(zoom + 25)}>+</button>
      </div>
      <div className={styles.pan} tabIndex={0} role="region" aria-label="Scrollable image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} style={{ width: `calc(min(100%, 1680px) * ${zoom / 100})` }} />
      </div>
    </div>
  );
}
