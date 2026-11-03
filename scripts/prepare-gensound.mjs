import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/prepare-gensound.mjs <gensound-repository>");
const repo = path.resolve(source);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(root, "public/experiments/gensound");
const manifest = JSON.parse(await readFile(path.join(repo, "playground/data/manifest.json"), "utf8"));
const expected = ["beethoven-symphony-8-finale", "chopin-nocturne-op9-no2", "macleod-hitman"];
if (!Array.isArray(manifest.tracks) || manifest.tracks.length !== expected.length ||
    expected.some((name) => !manifest.tracks.includes(name))) {
  throw new Error("Expected exactly the three approved, credited example tracks.");
}

const entries = [
  ["playground/index.html", "index.html"],
  ["playground/analyzer.js", "analyzer.js"],
  ["playground/data/manifest.json", "data/manifest.json"],
  ...expected.map((name) => [`playground/data/${name}.json`, `data/${name}.json`]),
  ["THIRD_PARTY_NOTICES.md", "THIRD_PARTY_NOTICES.md"],
  ["LICENSE", "LICENSE"],
  ["examples/README.md", "EXAMPLE_TRACK_CREDITS.md"],
];
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
// Read and validate everything before changing the owned snapshot.
const files = await Promise.all(entries.map(async ([sourcePath, publicPath]) => {
  const original = await readFile(path.join(repo, sourcePath));
  let bytes = original;
  if (publicPath === "index.html") {
    // The upstream page is an HTML fragment. Supply document and phone viewport
    // metadata without changing its styles, copy, analysis or interaction code.
    bytes = Buffer.from('<!doctype html>\n<html lang="en">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' + original.toString("utf8") + '\n</html>\n');
  }
  if (publicPath.startsWith("data/") && publicPath !== "data/manifest.json") {
    const data = JSON.parse(original);
    if (data.side !== 500 || ["loudness", "frequency", "midi_half", "note_index"].some(
      (key) => typeof data[key] !== "string" || Buffer.from(data[key], "base64").length !== 250000,
    )) throw new Error(`Invalid 250,000-window track data: ${sourcePath}`);
  }
  return { sourcePath, publicPath, original, bytes };
}));
const revision = execFileSync("git", ["-C", repo, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const provenance = {
  sourceRepository: "https://github.com/joshcoledesign/genSound",
  sourceRevision: revision,
  preparedAt: new Date().toISOString(),
  derived: true,
  adaptation: "index.html receives doctype, English language and mobile viewport metadata; all other copied bytes are unchanged.",
  files: files.map(({ sourcePath, publicPath, original, bytes }) => ({
    sourcePath, publicPath, sourceSha256: sha256(original), sha256: sha256(bytes), bytes: bytes.length,
  })),
};
for (const { publicPath, bytes } of files) {
  const target = path.join(destination, publicPath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
}
await writeFile(path.join(destination, "snapshot.json"), JSON.stringify(provenance, null, 2) + "\n");
console.log(`Prepared ${files.length} genSound files from ${revision} (${files.reduce((n, f) => n + f.bytes.length, 0).toLocaleString()} bytes).`);
