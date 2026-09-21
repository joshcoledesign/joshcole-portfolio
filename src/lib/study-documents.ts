export type StudyDocument = {
  src: string;
  previewRoot: string;
  title: string;
  description: string;
  pages: number;
};

const STUDY_DOCUMENTS: Record<string, StudyDocument[]> = {
  novensia: [
    {
      src: "/case-studies/novensia/rory-miller-output.pdf",
      previewRoot: "/case-studies/novensia/rory-miller-output",
      title: "Rory Miller — full output",
      description:
        "A complete Novensia brand-foundation output, shown here as the finished 24-page document.",
      pages: 24,
    },
  ],
};

export function getStudyDocuments(slug: string): StudyDocument[] {
  return STUDY_DOCUMENTS[slug] ?? [];
}
