"use client";

import { Children, isValidElement, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { defaultUrlTransform, type Components } from "react-markdown";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkGfm from "remark-gfm";
import { BrandVoiceEngine } from "@/components/diagrams/brand-voice-engine";
import { IdentityPipeline } from "@/components/diagrams/identity-pipeline";
import { PromptLine } from "@/components/prompt-line";
import type { StudyDocument } from "@/lib/study-documents";
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

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function hastImageSource(node: HastNode | undefined): string | null {
  if (node?.type !== "element" || node.tagName !== "img") return null;
  return typeof node.properties?.src === "string" ? node.properties.src : null;
}

function hashHas(source: string, option: string): boolean {
  const hash = source.includes("#") ? source.slice(source.indexOf("#") + 1) : "";
  return hash.split(/[&,;+]/).includes(option);
}

function wrapImageLayouts(node: HastNode): void {
  if (!node.children?.length) return;
  node.children.forEach(wrapImageLayouts);

  const wrapped: HastNode[] = [];
  for (let index = 0; index < node.children.length; index += 1) {
    const current = node.children[index];
    const currentSource = hastImageSource(current);
    const nextSource = hastImageSource(node.children[index + 1]);
    const thirdSource = hastImageSource(node.children[index + 2]);

    if (
      currentSource &&
      nextSource &&
      hashHas(currentSource, "pair") &&
      hashHas(nextSource, "pair")
    ) {
      wrapped.push({
        type: "element",
        tagName: "div",
        properties: { className: [styles.imagePair] },
        children: [current, node.children[index + 1]],
      });
      index += 1;
      continue;
    }

    if (currentSource && nextSource && thirdSource && hashHas(currentSource, "feature")) {
      wrapped.push({
        type: "element",
        tagName: "div",
        properties: { className: [styles.imageFeature] },
        children: [current, node.children[index + 1], node.children[index + 2]],
      });
      index += 2;
      continue;
    }

    wrapped.push(current);
  }
  node.children = wrapped;
}

function rehypeImageLayouts() {
  return (tree: HastNode) => wrapImageLayouts(tree);
}

function textFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textFromNode(node.props.children);
  return "";
}

function headingId(children: ReactNode): string {
  return textFromNode(children)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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
    h2({ children }) {
      const label = Children.toArray(children).map(textFromNode).join("");
      return (
        <h2
          id={headingId(children)}
          className={label.trim().toLowerCase() === "in brief" ? styles.inBriefHeading : undefined}
        >
          {children}
        </h2>
      );
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
  documents,
}: {
  piece: Piece;
  backHref: string;
  imageSources: Record<string, string>;
  documents: StudyDocument[];
}) {
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const content = useMemo(() => suppressFirstHeading(piece.content), [piece.content]);
  const components = useMemo(
    () => markdownComponents(imageSources, setActiveImage),
    [imageSources],
  );
  const meta = [piece.role, piece.displayDate, piece.tags.join(", ")].filter(Boolean).join(" · ");

  useEffect(() => {
    if (!activeImage) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveImage(null);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'),
      ).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
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
            rehypePlugins={[rehypeUnwrapImages, rehypeImageLayouts]}
            components={components}
            urlTransform={(url) =>
              url.startsWith("component:") ? url : defaultUrlTransform(url)
            }
          >
            {content}
          </ReactMarkdown>
        </div>

        {documents.map((document, index) => {
          const documentHeadingId = `document-${piece.slug}-${index + 1}`;
          return (
            <section
              key={document.src}
              className={styles.documentSection}
              aria-labelledby={documentHeadingId}
            >
              <header className={styles.documentHeader}>
                <p className={styles.documentEyebrow}>
                  output / {String(index + 1).padStart(2, "0")} · {document.pages} pages
                </p>
                <h2 id={documentHeadingId}>{document.title}</h2>
                <p>{document.description}</p>
              </header>

              <div
                className={styles.documentFrame}
                role="region"
                aria-label={`${document.title}, scrollable ${document.pages}-page document`}
                tabIndex={0}
              >
                {Array.from({ length: document.pages }, (_, pageIndex) => {
                  const pageNumber = pageIndex + 1;
                  const paddedPage = String(pageNumber).padStart(2, "0");
                  return (
                    <figure key={pageNumber} className={styles.documentPage}>
                      <Image
                        src={`${document.previewRoot}/page-${paddedPage}.jpg`}
                        alt={`${document.title}, page ${pageNumber} of ${document.pages}`}
                        width={1020}
                        height={1320}
                        sizes="(max-width: 639px) calc(100vw - 64px), 840px"
                        loading="lazy"
                      />
                      <figcaption>
                        {String(pageNumber).padStart(2, "0")} / {document.pages}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>

              <div className={styles.documentActions}>
                <a href={document.src} target="_blank" rel="noreferrer">
                  --open-pdf <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>
          );
        })}
      </main>

      {activeImage && (
        <div
          ref={dialogRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt || "Expanded case-study image"}
          onClick={() => setActiveImage(null)}
        >
          <button
            ref={closeRef}
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
