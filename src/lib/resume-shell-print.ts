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

    .toolbar button,
    .toolbar a {
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

  .toolbar button,
  .toolbar a {
    padding: 0;
    border: 0;
    background: transparent;
    color: #26c5ff;
    font-family: var(--mono);
    font-size: 8.5pt;
    letter-spacing: 0.04em;
    line-height: 1.2;
    text-decoration: none;
  }

  .toolbar button:hover,
  .toolbar a:hover {
    color: #e8e8ea;
  }

  .toolbar a:focus-visible { outline: 2px solid #26C5FF; outline-offset: 2px; }

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
    margin: 6pt 0 2.5pt;
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
  .role { margin: 3.5pt 0 0; }
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
    top: 0.53em;
    width: 2.25pt;
    height: 2.25pt;
  }
  .role-group { display: contents; }
  .role-group-roles {
    display: contents;
  }
  .role-group-roles .role {
    margin: 3.5pt 0 0 9pt;
    padding-left: 9pt;
    border-left: 0.5pt solid var(--rule);
  }
  .role { break-inside: avoid; }
  /* At true 10pt the UST roles cannot share page one, so page two opens on
     them rather than splitting a role across the break. */
  .role-group-roles .role:first-child { break-before: page; }
  .earlier .role { margin: 1.5pt 0 0; }
  .earlier .role-title { font-size: 10pt; }
  a { color: inherit; text-decoration: none; }
</style>`;

// The PDF link points at the approved ColeOS export copied into /public, so the
// site offers the same reviewed file instead of a browser print.
const PDF_BUTTON_JS = `  // Opens the print dialog so the PDF comes from the browser's own renderer —
  // full type quality, real text layer. Client-side PDF libraries rasterize
  // the page and produce a file no applicant tracking system can read.
  // ON THE LIVE SITE: replace this with a link to a PDF built at deploy time.
  document.getElementById('btn-pdf').addEventListener('click', function () {
    window.print();
  });
`;

const TXT_BUTTON_JS = `  document.getElementById('btn-txt').addEventListener('click', function () {
    var url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    var a = document.createElement('a');
    a.href = url;
    a.download = 'josh-cole-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    flash('Downloaded');
  });

`;

/** Replace exactly one occurrence, failing the build if the shell has drifted. */
function replaceOnce(source: string, search: string, replacement: string): string {
  const index = source.indexOf(search);
  if (index < 0 || source.indexOf(search, index + search.length) >= 0) {
    throw new Error(`Resume shell transform expected one match for: ${search.slice(0, 60)}`);
  }
  return source.slice(0, index) + replacement + source.slice(index + search.length);
}

const SHELL_TRANSFORMS: [string, string][] = [
  [">Copy plain text</button>", ">--copy-plain-text</button>"],
  [
    '<button type="button" id="btn-pdf">Save as PDF</button>',
    '<a id="btn-pdf" href="%%PDF_HREF%%" download="josh-cole-resume.pdf">--save-as-pdf</a>',
  ],
  ['\n  <button type="button" id="btn-txt">Download .txt</button>', ""],
  ["'Copy failed — use Download .txt'", "'Copy failed'"],
  [TXT_BUTTON_JS, ""],
  [PDF_BUTTON_JS, ""],
  ["</style>", `</style>\n${SITE_SCREEN_CSS}\n${APPROVED_PRINT_CSS}`],
  ['<div class="sheet">', '<main class="sheet">'],
  ["\n</div>\n\n<script>\n(function () {", "\n</main>\n\n<script>\n(function () {"],
];

export const RESUME_SHELL = SHELL_TRANSFORMS.reduce(
  (shell, [search, replacement]) => replaceOnce(shell, search, replacement),
  RESUME_SCREEN_SHELL
);
