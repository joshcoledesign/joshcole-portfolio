import { RESUME_SHELL as RESUME_SCREEN_SHELL } from "./resume-shell";
const SITE_SCREEN_CSS = `
<style media="screen">
  html,
  body {
    min-height: 100%;
    background-color: #101117;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.028) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.028) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  body { font-size: 10pt; }
  .name { font-size: 20pt; }
  .discipline,
  .contact,
  .section > h2,
  .role-date,
  .role-summary { font-size: 10pt; }
  .role-title { font-size: 11pt; }
  .earlier .role-title { font-size: 10pt; }

  .contact {
    display: flex;
    flex-wrap: wrap;
    white-space: normal;
  }

  .contact-group { white-space: nowrap; }
  .contact .sep { padding: 0 8px; }

  @media (min-width: 821px) {
    .toolbar,
    .sheet {
      width: 8.5in;
    }

    .sheet {
      padding: 36px 0.58in;
    }

    .contact { font-size: 10pt; }
  }

  .toolbar {
    gap: 16px;
    margin-bottom: -4px;
  }

  @media (max-width: 820px) {
    .toolbar {
      margin-bottom: 12px;
    }

    .toolbar button {
      display: inline-flex;
      min-height: 44px;
      align-items: center;
    }

    .contact { gap: 4px 10px; }

    .contact-group { white-space: normal; }
    .contact .contact-item { overflow-wrap: anywhere; }

    .contact .sep {
      display: none;
    }
  }

  .toolbar button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #26c5ff;
  }

  .toolbar button:hover {
    color: #e8e8ea;
  }

  .role-group {
    margin-bottom: 9px;
  }

  .role-group-roles {
    margin: 6px 0 0 12px;
    padding-left: 12px;
    border-left: 1px solid var(--rule);
  }

  .role-group-roles .role {
    margin-bottom: 9px;
  }

  .role-group-roles .role:last-child {
    margin-bottom: 0;
  }
</style>`;

// Keep the approved 10pt body / 11pt role type scale while fitting the
// current site resume onto two US-letter pages. Screen rules stay separate.
const APPROVED_PRINT_CSS = `
<style media="print">
  @page { size: letter portrait; margin: 0.40in 0.50in 0.38in; }
  html { background: #fff; }
  body {
    font-size: 10pt;
    line-height: 1.10;
    font-kerning: normal;
    font-synthesis: none;
    orphans: 2;
    widows: 2;
    text-rendering: geometricPrecision;
  }
  .sheet { width: auto; margin: 0; padding: 0; box-shadow: none; }
  .name {
    margin: 0 0 4.5pt;
    font-size: 20pt;
    letter-spacing: -0.125pt;
    line-height: 1;
  }
  .discipline {
    margin: 0;
    font-size: 10pt;
    letter-spacing: 0.8pt;
    line-height: 1.35;
  }
  .grad-rule { height: 1.875pt; margin: 8.25pt 0 6.75pt; }
  .contact {
    margin: 0 0 5pt;
    font-size: 10pt;
    letter-spacing: 0;
    line-height: 1.35;
    display: flex;
    flex-wrap: wrap;
    white-space: normal;
  }
  .contact-group { white-space: nowrap; }
  .contact .sep { padding: 0 6pt; }
  .section { break-inside: auto; margin-top: 0; }
  .role-group-summary { break-inside: avoid; }
  .section > h2 {
    margin: 2pt 0 1pt;
    padding: 0 0 1.5pt;
    border-bottom-width: 0.5pt;
    break-after: avoid;
    page-break-after: avoid;
    font-size: 10pt;
    letter-spacing: 0.25pt;
    line-height: 1.35;
  }
  .summary p { margin: 0 0 3pt; }
  .skill { margin: 0 0 1pt; line-height: 1.10; }
  .role { margin: 1.5pt 0 0; }
  .role-head { gap: 12pt; }
  .role-title { margin: 0 0 1pt; font-size: 11pt; line-height: 1.2; }
  .role-date { font-size: 10pt; }
  .role-summary {
    margin: 0;
    font-size: 10pt;
    line-height: 1.2;
  }
  .role li {
    padding-left: 10pt;
    margin: 0;
    line-height: 1.10;
  }
  .role li::before {
    top: 0.66em;
    width: 2.25pt;
    height: 2.25pt;
  }
  .role-group { display: contents; }
  .role-group-roles {
    display: contents;
  }
  .role-group-roles .role {
    margin: 1.5pt 0 0 9pt;
    padding-left: 9pt;
    border-left: 0.5pt solid var(--rule);
  }
  /* Keep page two from opening in the middle of a role. */
  .role-group-roles .role:first-child { break-before: page; }
  .earlier .role { margin: 1.5pt 0 0; }
  .earlier .role-title { font-size: 10pt; }
  a { color: inherit; text-decoration: none; }
</style>`;

export const RESUME_SHELL = RESUME_SCREEN_SHELL
  .replace(">Copy plain text</button>", ">--copy-plain-text</button>")
  .replace(">Save as PDF</button>", ">--save-as-pdf</button>")
  .replace(">Download .txt</button>", ">--download-txt</button>")
  .replace(
    "</style>",
    `</style>\n${SITE_SCREEN_CSS}\n${APPROVED_PRINT_CSS}`
  )
  .replace('<div class="sheet">', '<main class="sheet">')
  .replace("\n</div>\n\n<script>\n(function () {", "\n</main>\n\n<script>\n(function () {");
