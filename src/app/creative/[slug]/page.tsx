import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCreative, getAllCreativeSlugs } from "@/lib/creative";
import { CreativeShowcase } from "@/components/creative-showcase";

export function generateStaticParams() {
  return getAllCreativeSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getCreative(slug);
  if (!piece) return {};
  return { title: `${piece.title} — Josh Cole` };
}

export default async function CreativePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getCreative(slug);
  if (!piece) notFound();
  return <CreativeShowcase {...piece} />;
}
