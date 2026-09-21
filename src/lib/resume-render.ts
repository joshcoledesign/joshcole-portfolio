// ─── Resume renderer ──────────────────────────────────────────────────────
// Turns the structured content in resume.ts into (a) the visual HTML body and
// (b) the ATS-readable plaintext block, then injects both into the static
// presentation shell (resume-shell.ts). All layout/formatting lives in the
// shell; this file only lays content into fixed markup, so editing content in
// resume.ts can never disturb the design.

import { RESUME_SHELL } from "./resume-shell-print";
import type { ResumeData, ResumeRole } from "./resume";

/** Escape the three characters that are unsafe in HTML text/attribute content. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ── HTML body ───────────────────────────────────────────────────────────────

function contactHtml(c: ResumeData["contact"]): string {
  const sep = '<span class="sep">·</span>';
  return (
    `<span class="contact-item">${esc(c.location)}</span>` +
    sep +
    `<a class="contact-item" href="${c.site.href}">${esc(c.site.label)}</a>` +
    sep +
    `<a class="contact-item" href="${c.linkedin.href}">${esc(c.linkedin.label)}</a>` +
    sep +
    `<a class="contact-item" href="mailto:${c.email}">${esc(c.email)}</a>` +
    sep +
    `<span class="contact-item">${esc(c.phone)}</span>`
  );
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
  const bullets = role.bullets
    .map((b) => `        <li>${esc(b)}</li>`)
    .join("\n");
  return (
    `    <div class="role">\n` +
    `      <div class="role-head">\n` +
    `        <h3 class="role-title">${roleTitleHtml(role)}</h3>\n` +
    `        <span class="role-date">${esc(role.date)}</span>\n` +
    `      </div>\n` +
    summary +
    `      <ul>\n` +
    `${bullets}\n` +
    `      </ul>\n` +
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
    roleSectionHtml("Experience", data.experience),
    roleSectionHtml("Earlier Career", data.earlier, "earlier"),
  ];

  // Leading "\n\n" and trailing "\n" match the whitespace the shell expects
  // where <div class="sheet"> opens and closes.
  return "\n\n" + parts.join("\n\n") + "\n";
}

// ── Plaintext block (drives Copy / Download .txt / ATS parsing) ──────────────

function roleText(role: ResumeRole): string {
  const qual = role.qual ? ` ${role.qual}` : "";
  const org = role.org ? ` — ${role.org}` : "";
  const head = `${role.title}${qual}${org}  |  ${role.date}`;
  const lines = [head];
  if (role.summary) lines.push(role.summary);
  for (const b of role.bullets) lines.push(`- ${b}`);
  return lines.join("\n");
}

export function renderResumePlainText(data: ResumeData): string {
  const c = data.contact;
  const contactLine = [c.location, c.site.label, c.linkedin.label, c.email, c.phone].join(
    " | "
  );
  const blocks: string[] = [];
  blocks.push(`${data.name.toUpperCase()}\n${data.discipline}\n${contactLine}`);

  blocks.push("SUMMARY");
  for (const p of data.summary) blocks.push(p);

  blocks.push("SELECTED AI WORK");
  for (const r of data.selectedWork) blocks.push(roleText(r));

  blocks.push("SKILLS & TOOLS");
  for (const s of data.skills) blocks.push(`${s.label}: ${s.items}`);

  blocks.push("EXPERIENCE");
  for (const r of data.experience) blocks.push(roleText(r));

  blocks.push("EARLIER CAREER");
  for (const r of data.earlier) blocks.push(roleText(r));

  // Leading/trailing newline match the original <script id="plaintext"> content;
  // the client strips the leading one before copying.
  return "\n" + blocks.join("\n\n") + "\n";
}

// ── Full document ────────────────────────────────────────────────────────────

export function renderResumeDocument(data: ResumeData): string {
  return RESUME_SHELL.replace(
    "<title>Josh Cole — Creative Technologist · AI</title>",
    `<title>${esc(data.name)} — ${esc(data.discipline)}</title>`
  )
    .replace(
      '<meta name="author" content="Josh Cole">',
      `<meta name="author" content="Josh Cole">\n<!-- resume-version: ${esc(data.resumeVersion)} -->`
    )
    .replace("%%PLAINTEXT%%", () => renderResumePlainText(data))
    .replace("%%BODY%%", () => renderResumeBody(data));
}
