"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import { BrandVoiceEngine } from "@/components/diagrams/brand-voice-engine";
import { IdentityPipeline } from "@/components/diagrams/identity-pipeline";
import { PromptLine } from "@/components/prompt-line";
import type { Piece } from "@/lib/work";
import styles from "./study-page.module.css";

type ActiveImage = {
  src: string;
  alt: string;
};

const INLINE_COMPONENTS: Record<string, React.ComponentType> = {
  "identity-pipeline": IdentityPipeline,
  "voice-engine": BrandVoiceEngine,
};

function suppressFirstHeading(content: string) {
  return content.replace(/^\s*#\s+[^\r\n]+\r?\n+/, "");
}

function siblingSvg(src: string) {
  return src.replace(/\.[^./?#]+(?=$|[?#])/, ".svg");
}

function markdownComponents(
  imageSources: Record<string, string>,
  openImage: (image: ActiveImage) => void,
): Components {
  return {
    h1() {
      return null;
    },
    hr() {
      return <div className={styles.rule} aria-hidden="true" />;
    },
    img({ src, alt }) {
      if (typeof src !== "string") return null;

      if (src.startsWith("component:")) {
        const Component = INLINE_COMPONENTS[src.slice("component:".length)];
        return Component ? (
          <div className={styles.diagram}>
            <Component />
          </div>
        ) : null;
      }

      const hash = src.includes("#") ? src.slice(src.indexOf("#")) : "";
      const cleanSource = src.replace(/#.*$/, "");
      const resolvedSource = imageSources[cleanSource] ?? cleanSource;
      const noBorder = hash.includes("no-border");
      const marginTop = hash.match(/mt-(\d+)/)?.[1];
      const marginBottom = hash.match(/mb-(\d+)/)?.[1];
      const caption = alt ?? "";

      return (
        <figure
          className={styles.figure}
          style={{
            marginTop: marginTop ? `${marginTop}px` : undefined,
            marginBottom: marginBottom ? `${marginBottom}px` : undefined,
          }}
        >
          <button
            type="button"
            className={`${styles.imageButton} ${noBorder ? styles.noBorder : ""}`}
            aria-label={`Open image: ${caption}`}
            onClick={() => openImage({ src: resolvedSource, alt: caption })}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedSource}
              alt={caption}
              loading="lazy"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.dataset.fallbackAttempted === "true") {
                  image.hidden = true;
                  return;
                }
                image.dataset.fallbackAttempted = "true";
                image.src = siblingSvg(cleanSource);
              }}
            />
          </button>
          <figcaption>{caption}</figcaption>
        </figure>
      );
    },
    a({ href, children }) {
      return <a href={href}>{children}</a>;
    },
  };
}

export function StudyPage({
  piece,
  backHref,
  imageSources,
}: {
  piece: Piece;
  backHref: string;
  imageSources: Record<string, string>;
}) {
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);
  const content = useMemo(() => suppressFirstHeading(piece.content), [piece.content]);
  const components = useMemo(
    () => markdownComponents(imageSources, setActiveImage),
    [imageSources],
  );
  const meta = [piece.role, piece.displayDate, piece.tags.join(", ")].filter(Boolean).join(" · ");

  useEffect(() => {
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveImage(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
    };
  }, [activeImage]);

  return (
    <div className={styles.page}>
      <PromptLine href={backHref} command={`./work/${piece.slug}`} flag="" />
      <main className={styles.container}>
        <Link href={backHref} className={styles.back}>
          <span aria-hidden="true">&lt;</span>
          <span>cd ..</span>
        </Link>

        <header className={styles.header}>
          <h1>{piece.title}</h1>
          <p className={styles.descriptor}>{piece.descriptor}</p>
          {meta && <p className={styles.meta}>{meta}</p>}
        </header>

        <div className={styles.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeUnwrapImages]}
            components={components}
            urlTransform={(url) =>
              url.startsWith("component:") ? url : defaultUrlTransform(url)
            }
          >
            {content}
          </ReactMarkdown>
        </div>
      </main>

      {activeImage && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt || "Expanded case-study image"}
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            className={styles.close}
            aria-label="Close image"
            onClick={() => setActiveImage(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            onClick={(event) => event.stopPropagation()}
          />
          <p onClick={(event) => event.stopPropagation()}>{activeImage.alt}</p>
        </div>
      )}
    </div>
  );
}
