// Serves the standalone resume document at /resume.
//
// It is rendered from structured content (src/lib/resume.ts) laid into a fixed
// presentation shell, and returned as a complete, self-contained HTML document
// — intentionally NOT an App Router page, so it renders without the site's
// root layout, nav, and footer chrome. This is the print/ATS artifact.

import { resume } from "@/lib/resume";
import { renderResumeDocument } from "@/lib/resume-render";

// Fully static content — render once at build time.
export const dynamic = "force-static";

export function GET() {
  return new Response(renderResumeDocument(resume), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
