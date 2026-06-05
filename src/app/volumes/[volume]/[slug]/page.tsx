import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudy, getAllCaseStudySlugs } from "@/lib/case-studies";
import { CaseStudy } from "@/components/case-study";

export function generateStaticParams() {
  return getAllCaseStudySlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ volume: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return { title: `${study.title} — Josh Cole` };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ volume: string; slug: string }>;
}) {
  const { volume, slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || study.volume !== volume) notFound();
  return <CaseStudy {...study} />;
}
