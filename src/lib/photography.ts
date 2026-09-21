import { PILLARS } from "@/lib/tags";
import {
  getPublishedCards,
  getPublishedPieces,
  type Piece,
  type PieceCard,
  type PieceImage,
} from "@/lib/work";

const HERO_SLUG = "retropolitan";

function byOrder<T extends Pick<PieceCard, "order" | "sortYear" | "title">>(a: T, b: T) {
  if (a.order !== null || b.order !== null) {
    if (a.order === null) return 1;
    if (b.order === null) return -1;
    if (a.order !== b.order) return a.order - b.order;
  }
  return b.sortYear - a.sortYear || a.title.localeCompare(b.title);
}

function orderedPhotography<T extends Piece | PieceCard>(pieces: T[]): T[] {
  const photography = pieces.filter((piece) => piece.tags.includes("Photography"));
  const hero = photography.find((piece) => piece.slug === HERO_SLUG);
  const rest = photography
    .filter((piece) => piece.slug !== HERO_SLUG)
    .sort(byOrder);
  return hero ? [hero, ...rest] : rest;
}

function tileImage(piece: PieceCard): PieceImage | null {
  const source = piece.thumbnail ?? piece.images[0];
  return source ? { ...source, label: piece.title } : null;
}

function categoryWords(pieces: PieceCard[]): string[] {
  const excluded = new Set<string>([...PILLARS, "Photography"]);
  const counts = new Map<string, number>();
  const firstSeen = new Map<string, number>();
  let index = 0;

  for (const piece of pieces) {
    for (const tag of piece.tags) {
      if (excluded.has(tag)) continue;
      if (!firstSeen.has(tag)) firstSeen.set(tag, index++);
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts]
    .sort(([tagA, countA], [tagB, countB]) =>
      countB - countA || (firstSeen.get(tagA) ?? 0) - (firstSeen.get(tagB) ?? 0),
    )
    .slice(0, 3)
    .map(([tag]) => tag.toLowerCase());
}

export function getPhotographyCards(): PieceCard[] {
  return orderedPhotography(getPublishedCards());
}

export function getPhotographyPieces(): Piece[] {
  return orderedPhotography(getPublishedPieces());
}

export function getPhotographyCard(): PieceCard {
  const pieces = getPhotographyCards();
  const images = pieces.flatMap((piece) => {
    const image = tileImage(piece);
    return image ? [image] : [];
  });
  const collectionCount = pieces.length;
  const words = categoryWords(pieces);

  return {
    slug: "photography",
    title: "Photography",
    tags: ["Creative Direction", "Photography"],
    kind: "series",
    display: "mosaic",
    featured: false,
    published: true,
    weight: 4,
    order: 6,
    shape: "square",
    sortYear: Math.max(...pieces.map((piece) => piece.sortYear), 0),
    displayDate: "Archive",
    study: false,
    description: "Photography series and singles.",
    descriptor: `${collectionCount} collections · ${words.join(", ")}`,
    images,
    frames: images.length,
    blocks: Math.max(images.length, 1),
  };
}
