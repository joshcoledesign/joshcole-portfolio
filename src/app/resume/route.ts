// Serves the standalone resume document at /resume.
//
// It is rendered from structured content (src/lib/resume.ts) laid into a fixed
// presentation shell, and returned as a complete, self-contained HTML document
// — intentionally NOT an App Router page, so it renders without the site's
// root layout, nav, and footer chrome. This is the print/ATS artifact.

import { existsSync } from "node:fs";
import path from "node:path";
import { resume } from "@/lib/resume";
import { renderResumeDocument, resumePdfPath } from "@/lib/resume-render";

// Fully static content — render once at build time.
export const dynamic = "force-static";

export function GET() {
  // Fail the build rather than ship a --save-as-pdf link that 404s when the
  // content version changes without the matching approved PDF in /public.
  const pdf = path.join(process.cwd(), "public", resumePdfPath(resume));
  if (!existsSync(pdf)) {
    throw new Error(`Missing approved resume PDF for ${resume.resumeVersion}: ${pdf}`);
  }

  return new Response(renderResumeDocument(resume), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
