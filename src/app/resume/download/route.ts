import { readFile } from "node:fs/promises";
import path from "node:path";
import { resume } from "@/lib/resume";
import { resumePdfPath } from "@/lib/resume-render";

// Build the approved PDF into a stable URL with a download response.
export const dynamic = "force-static";

export async function GET() {
  const pdfPath = path.join(process.cwd(), "public", resumePdfPath(resume));
  const pdf = await readFile(pdfPath);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="josh-cole-resume.pdf"',
      "X-Content-Type-Options": "nosniff",
    },
  });
}
