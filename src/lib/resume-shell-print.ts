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

  @media (min-width: 821px) {
    .toolbar,
    .sheet {
      width: 8.5in;
    }

    .sheet {
      padding: 36px 0.58in;
    }

    .contact {
      font-size: 7pt;
      white-space: nowrap;
    }
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

    .contact {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 10px;
      overflow-wrap: anywhere;
    }

    .contact .contact-item {
      white-space: nowrap;
    }

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
</style>`;

// Print-only values are synchronized with the approved 2026-08-27.1
// presentation export. The screen preview remains owned by resume-shell.ts.
const APPROVED_PRINT_CSS = `
<style media="print">
  @page { size: letter portrait; margin: 0.40in 0.58in 0.38in; }
  html { background: #fff; }
  body {
    font-size: 8.5pt;
    line-height: 1.22;
    font-kerning: normal;
    font-synthesis: none;
    orphans: 2;
    widows: 2;
    text-rendering: geometricPrecision;
  }
  .sheet { width: auto; margin: 0; padding: 0; box-shadow: none; }
  .name {
    margin: 0 0 4.5pt;
    font-size: 25pt;
    letter-spacing: -0.125pt;
    line-height: 1;
  }
  .discipline {
    margin: 0;
    font-size: 8pt;
    letter-spacing: 0.8pt;
    line-height: 1.35;
  }
  .grad-rule { height: 1.875pt; margin: 8.25pt 0 6.75pt; }
  .contact {
    margin: 0 0 8.5pt;
    font-size: 7pt;
    letter-spacing: 0;
    line-height: 1.35;
    white-space: nowrap;
  }
  .section { break-inside: auto; margin-top: 0; }
  .section > h2 {
    margin: 7.5pt 0 4pt;
    padding: 0 0 3.75pt;
    border-bottom-width: 0.5pt;
    break-after: avoid;
    page-break-after: avoid;
    font-size: 7pt;
    letter-spacing: 0.25pt;
    line-height: 1.35;
  }
  .summary p { margin: 0 0 6pt; }
  .skill { margin: 0 0 2.75pt; line-height: 1.22; }
  .role { margin: 5.5pt 0 0; }
  .role-head { gap: 12pt; }
  .role-title { margin: 0 0 1pt; font-size: 9.5pt; line-height: 1.2; }
  .role-date { font-size: 7pt; }
  .role-summary {
    margin: 0 0 2.75pt;
    font-size: 8.5pt;
    line-height: 1.2;
  }
  .role li {
    padding-left: 10pt;
    margin: 0 0 1.75pt;
    line-height: 1.22;
  }
  .role li::before {
    top: 0.66em;
    width: 2.25pt;
    height: 2.25pt;
  }
  .earlier .role { margin: 5.5pt 0 0; }
  .earlier .role-title { font-size: 9.5pt; }
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
