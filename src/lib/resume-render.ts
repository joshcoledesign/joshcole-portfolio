// ─── Resume renderer ──────────────────────────────────────────────────────
// Turns the structured content in resume.ts into (a) the visual HTML body and
// (b) the ATS-readable plaintext block, then injects both into the static
// presentation shell (resume-shell.ts). All layout/formatting lives in the
// shell; this file only lays content into fixed markup, so editing content in
// resume.ts can never disturb the design.

import { RESUME_SHELL } from "./resume-shell-print";
import type { ResumeData, ResumeExperienceEntry, ResumeRole, ResumeRoleGroup } from "./resume";
import { SITE_DESCRIPTION, SITE_OG_IMAGE } from "./site-metadata";

/** Escape the three characters that are unsafe in HTML text/attribute content. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── HTML body ───────────────────────────────────────────────────────────────

function contactHtml(c: ResumeData["contact"]): string {
  const sep = '<span class="sep">·</span>';
  const items = [
    `<span class="contact-item">${esc(c.location)}</span>`,
    `<a class="contact-item" href="${c.site.href}">${esc(c.site.label)}</a>`,
    `<a class="contact-item" href="${c.linkedin.href}">${esc(c.linkedin.label)}</a>`,
  ];

  return items
    .map((item, index) =>
      `<span class="contact-group">${item}${index < items.length - 1 ? sep : ""}</span>`
    )
    .join("");
}

function roleTitleHtml(role: ResumeRole): string {
  let html = esc(role.title);
  if (role.qual) html += ` <span class="qual">${esc(role.qual)}</span>`;
  if (role.org) html += ` <span class="org">— ${esc(role.org)}</span>`;
  return html;
}

function roleHtml(role: ResumeRole): string {
  const summary = role.summary
    ? `      <p class="role-summary">${esc(role.summary)}</p>\n`
    : "";
  // Earlier-career entries have no bullets; skip the list so screen readers
  // don't announce an empty one.
  const bullets = role.bullets.length
    ? `      <ul>\n` +
      role.bullets.map((b) => `        <li>${esc(b)}</li>`).join("\n") +
      `\n      </ul>\n`
    : "";
  return (
    `    <div class="role">\n` +
    `      <div class="role-head">\n` +
    `        <h3 class="role-title">${roleTitleHtml(role)}</h3>\n` +
    `        <span class="role-date">${esc(role.date)}</span>\n` +
    `      </div>\n` +
    summary +
    bullets +
    `    </div>`
  );
}

function isRoleGroup(entry: ResumeExperienceEntry): entry is ResumeRoleGroup {
  return "kind" in entry && entry.kind === "group";
}

function roleGroupHtml(group: ResumeRoleGroup): string {
  const roles = group.roles.map(roleHtml).join("\n\n");
  return (
    `    <div class="role-group">\n` +
    `      <div class="role-head role-group-head">\n` +
    `        <h3 class="role-title">${esc(group.title)}</h3>\n` +
    `        <span class="role-date">${esc(group.date)}</span>\n` +
    `      </div>\n` +
    `      <p class="role-summary role-group-summary">${esc(group.summary)}</p>\n` +
    `      <div class="role-group-roles">\n` +
    `${roles}\n` +
    `      </div>\n` +
    `    </div>`
  );
}

function roleSectionHtml(title: string, roles: ResumeRole[], extraClass = ""): string {
  const cls = extraClass ? `section ${extraClass}` : "section";
  const body = roles.map(roleHtml).join("\n\n");
  return (
    `  <section class="${cls}">\n` +
    `    <h2>${esc(title)}</h2>\n\n` +
    `${body}\n` +
    `  </section>`
  );
}

function experienceSectionHtml(entries: ResumeExperienceEntry[]): string {
  const body = entries
    .map((entry) => (isRoleGroup(entry) ? roleGroupHtml(entry) : roleHtml(entry)))
    .join("\n\n");
  return (
    `  <section class="section">\n` +
    `    <h2>Experience</h2>\n\n` +
    `${body}\n` +
    `  </section>`
  );
}

export function renderResumeBody(data: ResumeData): string {
  const header =
    `  <header>\n` +
    `    <h1 class="name">${esc(data.name)}</h1>\n` +
    `    <p class="discipline">${esc(data.discipline)}</p>\n` +
    `    <div class="grad-rule"></div>\n` +
    `    <p class="contact">\n` +
    `      ${contactHtml(data.contact)}\n` +
    `    </p>\n` +
    `  </header>`;

  const summary =
    `  <section class="section summary">\n` +
    `    <h2>Summary</h2>\n` +
    data.summary.map((p) => `    <p>${esc(p)}</p>`).join("\n") +
    `\n  </section>`;

  const skills =
    `  <section class="section">\n` +
    `    <h2>Skills &amp; Tools</h2>\n` +
    data.skills
      .map((s) => `    <p class="skill"><b>${esc(s.label)}:</b> ${esc(s.items)}</p>`)
      .join("\n") +
    `\n  </section>`;

  const parts = [
    header,
    summary,
    roleSectionHtml("Selected AI Work", data.selectedWork),
    skills,
    experienceSectionHtml(data.experience),
    roleSectionHtml("Independent Experience", data.independent),
    roleSectionHtml("Selected Earlier Experience", data.earlier, "earlier"),
  ];

  // Leading "\n\n" and trailing "\n" match the whitespace the shell expects
  // where <div class="sheet"> opens and closes.
  return "\n\n" + parts.join("\n\n") + "\n";
}

// ── Plaintext block (drives Copy plain text) ─────────────────────────────────

function roleText(role: ResumeRole): string {
  const qual = role.qual ? ` ${role.qual}` : "";
  const org = role.org ? ` — ${role.org}` : "";
  const head = `${role.title}${qual}${org}  |  ${role.date}`;
  const lines = [head];
  if (role.summary) lines.push(role.summary);
  for (const b of role.bullets) lines.push(`- ${b}`);
  return lines.join("\n");
}

function roleGroupText(group: ResumeRoleGroup): string {
  return [
    `${group.title}  |  ${group.date}`,
    group.summary,
    ...group.roles.map(roleText),
  ].join("\n\n");
}

export function renderResumePlainText(data: ResumeData): string {
  const c = data.contact;
  const contactLine = [c.location, c.site.label, c.linkedin.label].join(" | ");
  const blocks: string[] = [];
  blocks.push(`${data.name.toUpperCase()}\n${data.discipline}\n${contactLine}`);

  blocks.push("SUMMARY");
  for (const p of data.summary) blocks.push(p);

  blocks.push("SELECTED AI WORK");
  for (const r of data.selectedWork) blocks.push(roleText(r));

  blocks.push("SKILLS & TOOLS");
  for (const s of data.skills) blocks.push(`${s.label}: ${s.items}`);

  blocks.push("EXPERIENCE");
  for (const entry of data.experience) {
    blocks.push(isRoleGroup(entry) ? roleGroupText(entry) : roleText(entry));
  }

  blocks.push("INDEPENDENT EXPERIENCE");
  for (const r of data.independent) blocks.push(roleText(r));

  blocks.push("SELECTED EARLIER EXPERIENCE");
  for (const r of data.earlier) blocks.push(roleText(r));

  // Leading/trailing newline match the original <script id="plaintext"> content;
  // the client strips the leading one before copying.
  return "\n" + blocks.join("\n\n") + "\n";
}

// ── Full document ────────────────────────────────────────────────────────────

/**
 * Remove authoring notes from the shell so none ship in production: HTML
 * comments, CSS comments, and whole-line JavaScript comments.
 */
function stripComments(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->\n?/g, "")
    .replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, open, css: string, close) =>
      open + css.replace(/[ \t]*\/\*[\s\S]*?\*\/[ \t]*\n?/g, "") + close
    )
    .replace(/(<script>)([\s\S]*?)(<\/script>)/g, (_, open, js: string, close) =>
      open + js.replace(/^[ \t]*\/\/.*\n/gm, "") + close
    )
    .replace(/\n{3,}/g, "\n\n");
}

const PRODUCTION_SHELL = stripComments(RESUME_SHELL);

/** Public path of the approved ColeOS PDF for this content version. */
export function resumePdfPath(data: ResumeData): string {
  return `/files/josh-cole-resume-${data.resumeVersion}.pdf`;
}

function headMetaHtml(): string {
  const title = "Resume — Josh Cole";
  const img = SITE_OG_IMAGE;
  return [
    `<meta name="description" content="${esc(SITE_DESCRIPTION)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(SITE_DESCRIPTION)}">`,
    `<meta property="og:image" content="${img.url}">`,
    `<meta property="og:image:type" content="${img.type}">`,
    `<meta property="og:image:width" content="${img.width}">`,
    `<meta property="og:image:height" content="${img.height}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(SITE_DESCRIPTION)}">`,
    `<meta name="twitter:image" content="${img.url}">`,
    `<link rel="icon" href="/icon.png" type="image/png">`,
  ].join("\n");
}

export function renderResumeDocument(data: ResumeData): string {
  const doc = PRODUCTION_SHELL.replace(
    "<title>Josh Cole — Creative Technologist · AI</title>",
    `<title>Resume — ${esc(data.name)}</title>\n${headMetaHtml()}`
  )
    .replace("%%PDF_HREF%%", "/resume/download")
    .replace("%%PLAINTEXT%%", () => renderResumePlainText(data))
    .replace("%%BODY%%", () => renderResumeBody(data));

  // The shell is a fragment: everything before the plaintext block belongs in
  // <head>. Wrapping it gives a standards-mode document with a language.
  const bodyStart = doc.indexOf('<script type="text/plain" id="plaintext">');
  if (bodyStart < 0) throw new Error("Resume shell is missing its plaintext block");
  return (
    `<!DOCTYPE html>\n<html lang="en">\n<head>\n${doc.slice(0, bodyStart)}</head>\n` +
    `<body>\n${doc.slice(bodyStart)}</body>\n</html>\n`
  );
}
