import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SeriesSurface } from "@/components/series-surface";
import { StudyPage } from "@/components/study-page";
import { PhotographySurface } from "@/components/photography-surface";
import { getPhotographyCard, getPhotographyPieces } from "@/lib/photography";
import { getStudyDocuments } from "@/lib/study-documents";
import { getPiece, getPublishedPieces, resolveImageSource, type Piece } from "@/lib/work";

type Query = Record<string, string | string[] | undefined>;
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Query>;
};

export const dynamic = "force-dynamic";

const SLUG_ALIASES: Record<string, string> = {
  multiples: "plurality",
};

export function generateStaticParams() {
  return [...getPublishedPieces().map((piece) => ({ slug: piece.slug })), { slug: "photography" }];
}

function appendQuery(params: URLSearchParams, key: string, value: string | string[] | undefined) {
  if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
  else if (value) params.set(key, value);
}

function navigationParams(query: Query) {
  const params = new URLSearchParams();
  appendQuery(params, "tag", query.tag);
  appendQuery(params, "view", query.view);
  appendQuery(params, "sort", query.sort);
  return params;
}

function hasPhotographyParent(query: Query) {
  return Array.isArray(query.from)
    ? query.from.includes("photography")
    : query.from === "photography";
}

function backHref(query: Query) {
  const params = navigationParams(query);
  const value = params.toString();
  const parent = hasPhotographyParent(query) ? "/work/photography" : "/";
  return value ? `${parent}?${value}` : parent;
}

function photographyDetailQuery(query: Query) {
  const params = navigationParams(query);
  params.set("from", "photography");
  return params.toString();
}

function photographyPiece(): Piece {
  return { ...getPhotographyCard(), content: "" };
}

function resolvePiece(slug: string) {
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
  const alias = SLUG_ALIASES[slug];
  if (alias) {
    const redirectParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) appendQuery(redirectParams, key, value);
    const suffix = redirectParams.toString();
    redirect(suffix ? `/work/${alias}?${suffix}` : `/work/${alias}`);
  }
  const piece = await resolvePiece(slug);
  if (!piece) notFound();
  const returnTo = backHref(query);

  if (slug === "photography") {
    return (
      <PhotographySurface
        pieces={getPhotographyPieces()}
        backHref={returnTo}
        detailQuery={photographyDetailQuery(query)}
      />
    );
  }

  if (piece.kind === "study") {
    return (
      <StudyPage
        piece={piece}
        backHref={returnTo}
        imageSources={studyImageSources(piece.content)}
        documents={getStudyDocuments(piece.slug)}
      />
    );
  }

  return <SeriesSurface piece={piece} backHref={returnTo} />;
}
