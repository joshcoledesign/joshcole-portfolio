"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { PieceImage } from "@/lib/work";
import styles from "./film-player.module.css";

export function FilmPlayer({ id, title, poster }: { id: string; title: string; poster?: PieceImage }) {
  const [loaded, setLoaded] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (loaded) playerRef.current?.focus();
  }, [loaded]);

  return (
    <section className={styles.section} aria-label={`${title} film`}>
      <div className={styles.player}>
        {loaded ? (
          <iframe
            ref={playerRef}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`}
            title={`${title} film`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={0}
          />
        ) : (
          <button className={styles.poster} type="button" aria-label={`Play ${title} film`} onClick={() => setLoaded(true)}>
            {poster && (
              <Image
                src={poster.src}
                alt=""
                fill
                loading="eager"
                sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1056px) calc(100vw - 96px), 960px"
                style={{ objectPosition: `${poster.focal[0] * 100}% ${poster.focal[1] * 100}%` }}
              />
            )}
            <span className={styles.playLabel}>
              <span className={styles.playIcon} aria-hidden="true">▶</span>
              Play film
            </span>
          </button>
        )}
      </div>
      <p className={styles.caption}>
        <span>Film · Hosted on YouTube</span>
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <span aria-hidden="true">↗</span>
        </a>
      </p>
    </section>
  );
}
