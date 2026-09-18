import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeriesSurface } from "@/components/series-surface";
import { StudyPage } from "@/components/study-page";
import { getPhotographyImages } from "@/lib/gallery";
import { getPiece, getPublishedPieces, resolveImageSource, type Piece } from "@/lib/work";

type Query = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Query>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [...getPublishedPieces().map((piece) => ({ slug: piece.slug })), { slug: "photography" }];
}

function appendQuery(params: URLSearchParams, key: string, value: string | string[] | undefined) {
  if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
  else if (value) params.set(key, value);
}

function backHref(query: Query) {
  const params = new URLSearchParams();
  appendQuery(params, "tag", query.tag);
  appendQuery(params, "view", query.view);
  appendQuery(params, "sort", query.sort);
  const value = params.toString();
  return value ? `/?${value}` : "/";
}

async function photographyPiece(): Promise<Piece> {
  const gallery = await getPhotographyImages();
  const images = gallery.map((image) => ({
    src: image.url,
    alt: "Photography archive frame",
    focal: [0.5, 0.5] as [number, number],
    label: image.pathname
      .replace(/^gallery\//, "")
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " "),
  }));
  return {
    slug: "photography",
    title: "Photography",
    tags: ["Creative Direction", "Photography"],
    kind: "series",
    display: "mosaic",
    featured: false,
    published: true,
    weight: 3,
    order: 5,
    shape: "landscape",
    sortYear: new Date().getFullYear(),
    displayDate: "Archive",
    study: false,
    description: "An evolving visual archive of photographs, experiments, and commissioned frames.",
    descriptor: `${images.length} series · portrait, editorial, film`,
    images,
    frames: images.length,
    blocks: images.length,
    content: "An evolving visual archive of photographs, experiments, and commissioned frames.",
  };
}

async function resolvePiece(slug: string) {
  return slug === "photography" ? photographyPiece() : getPiece(slug);
}

function studyImageSources(content: string): Record<string, string> {
  const sources: Record<string, string> = {};
  const imagePattern = /!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;

  for (const match of content.matchAll(imagePattern)) {
    const source = match[1];
    if (source.startsWith("component:")) continue;
    const cleanSource = source.replace(/#.*$/, "");
    sources[cleanSource] = resolveImageSource(cleanSource).src;
  }

  return sources;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = await resolvePiece(slug);
  if (!piece) return {};
  const title = `${piece.title} — Josh Cole`;
  return {
    title,
    description: piece.description,
    openGraph: {
      title,
      description: piece.description,
      type: "article",
      images: piece.images[0] ? [{ url: piece.images[0].src, alt: piece.images[0].alt }] : undefined,
    },
  };
}

export default async function WorkPiecePage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const piece = await resolvePiece(slug);
  if (!piece) notFound();
  const returnTo = backHref(query);

  if (piece.kind === "study") {
    return (
      <StudyPage
        piece={piece}
        backHref={returnTo}
        imageSources={studyImageSources(piece.content)}
      />
    );
  }

  return <SeriesSurface piece={piece} backHref={returnTo} />;
}
