import Link from "next/link";
import { PromptLine } from "@/components/prompt-line";
import type { Piece } from "@/lib/work";
import styles from "./photography-surface.module.css";

const CENTERED_THUMBNAIL_SLUGS = new Set([
  "the-box",
  "plurality",
  "death-rallies-so-divine",
  "breakfast-of-champions",
]);

export function PhotographySurface({
  pieces,
  backHref,
  detailQuery,
}: {
  pieces: Piece[];
  backHref: string;
  detailQuery: string;
}) {
  return (
    <div className={styles.page}>
      <PromptLine href={backHref} command="./work/photography" flag="" />
      <main className={styles.container}>
        <Link href={backHref} className={styles.back}>
          <span aria-hidden="true">&lt;</span>
          <span>cd ..</span>
        </Link>

        <p className={styles.eyebrow}>SERIES · ARCHIVE</p>
        <div className={styles.headingRow}>
          <h1>Photography</h1>
          <span>{pieces.length} collections</span>
        </div>

        <div className={styles.grid}>
          {pieces.map((piece) => {
            const image = piece.thumbnail ?? piece.images[0];
            const objectPosition =
              piece.slug === "toy-lifestyle"
                ? "center bottom"
                : CENTERED_THUMBNAIL_SLUGS.has(piece.slug)
                  ? "center"
                  : undefined;
            return (
              <Link
                key={piece.slug}
                href={`/work/${piece.slug}?${detailQuery}`}
                className={styles.tile}
              >
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.src}
                    alt=""
                    loading="lazy"
                    style={objectPosition ? { objectPosition } : undefined}
                  />
                ) : (
                  <span className={styles.empty}>image pending</span>
                )}
                <span className={styles.scrim} aria-hidden="true" />
                <span className={styles.caption}>
                  <b>{piece.title}</b>
                  <span>{piece.kind === "single" ? "Single" : "Series"} · {piece.descriptor}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
