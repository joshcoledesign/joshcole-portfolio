import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "case-studies");
const PUBLIC_DIR = path.join(ROOT, "public");
const CASE_STUDIES_DIR = path.join(PUBLIC_DIR, "case-studies");
const MANIFEST_PATH = path.join(CASE_STUDIES_DIR, "PLACEHOLDERS.md");
const IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;

function cleanReference(reference) {
  return reference.split(/[?#]/, 1)[0];
}

function svgReference(reference) {
  const extension = path.posix.extname(reference);
  return `${reference.slice(0, -extension.length)}.svg`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapText(value, maxCharacters, maxLines = 3) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharacters || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;

  const visible = lines.slice(0, maxLines);
  const remaining = lines.slice(maxLines - 1).join(" ");
  visible[maxLines - 1] = `${remaining.slice(0, Math.max(1, maxCharacters - 1)).trimEnd()}…`;
  return visible;
}

function makeSvg({ alt, fileName, isThumbnail }) {
  const width = isThumbnail ? 1600 : 1500;
  const height = 1000;
  const maxCharacters = Math.floor((width - 64) / 6.8);
  const altLines = wrapText(alt || fileName, maxCharacters);
  const lineHeight = 16;
  const fileY = height - 30 - altLines.length * lineHeight - 10;
  const altMarkup = altLines
    .map(
      (line, index) =>
        `    <text x="32" y="${fileY + 24 + index * lineHeight}" fill="#8C8E9C" font-size="11">${escapeXml(line)}</text>`,
    )
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(alt || fileName)}">
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#FFFFFF" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#26C5FF"/>
      <stop offset="0.5" stop-color="#CA43FF"/>
      <stop offset="1" stop-color="#FF419F"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="#101117"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect width="${width}" height="3" fill="url(#brand)"/>
  <g font-family="'JetBrains Mono', monospace">
    <text x="32" y="${fileY}" fill="#B4B6C2" font-size="12">${escapeXml(fileName)}</text>
${altMarkup}
  </g>
</svg>
`;
}

async function collectReferences() {
  const entries = await readdir(CONTENT_DIR, { withFileTypes: true });
  const references = new Map();

  for (const entry of entries) {
    if (!entry.isFile() || path.extname(entry.name) !== ".md") continue;

    const source = await readFile(path.join(CONTENT_DIR, entry.name), "utf8");
    const { data, content } = matter(source);
    const thumbnail = typeof data.thumbnail === "string" ? cleanReference(data.thumbnail) : null;

    if (thumbnail?.startsWith("/case-studies/")) {
      references.set(thumbnail, {
        alt: typeof data.title === "string" ? data.title : path.posix.basename(thumbnail),
        isThumbnail: true,
      });
    }

    for (const match of content.matchAll(IMAGE_PATTERN)) {
      const reference = cleanReference(match[2]);
      if (!reference.startsWith("/case-studies/")) continue;

      const existing = references.get(reference);
      references.set(reference, {
        alt: match[1] || existing?.alt || path.posix.basename(reference),
        isThumbnail: existing?.isThumbnail || false,
      });
    }
  }

  return references;
}

async function main() {
  const references = await collectReferences();
  const placeholders = [];
  let generatedCount = 0;

  for (const [reference, details] of [...references.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const realPath = path.join(PUBLIC_DIR, reference.slice(1));
    if (existsSync(realPath)) continue;

    const fallbackReference = svgReference(reference);
    const fallbackPath = path.join(PUBLIC_DIR, fallbackReference.slice(1));
    placeholders.push(fallbackReference);

    if (existsSync(fallbackPath)) continue;

    await mkdir(path.dirname(fallbackPath), { recursive: true });
    await writeFile(
      fallbackPath,
      makeSvg({
        alt: details.alt,
        fileName: path.posix.basename(reference),
        isThumbnail: details.isThumbnail || path.posix.basename(reference).startsWith("hero."),
      }),
      "utf8",
    );
    generatedCount += 1;
    console.log(`generated ${fallbackReference}`);
  }

  const manifest = `# Generated case-study placeholders

These SVGs are generated by \`scripts/make-placeholders.mjs\`. The site should try the referenced raster image first and use its SVG sibling only when the raster is missing.

Replace a placeholder by adding the real image at the original path referenced in the case-study markdown. The generator never overwrites real images or existing SVG fallbacks.

${placeholders.map((reference) => `- \`${reference}\``).join("\n")}
`;

  await mkdir(CASE_STUDIES_DIR, { recursive: true });
  await writeFile(MANIFEST_PATH, manifest, "utf8");
  console.log(`${generatedCount} placeholder${generatedCount === 1 ? "" : "s"} generated`);
}

await main();
