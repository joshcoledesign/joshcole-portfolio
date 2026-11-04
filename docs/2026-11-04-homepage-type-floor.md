# Homepage type floor and shareable hero

Josh requested a 13px minimum for all homepage text. Rendered text was checked
before editing: supporting styles were 9–12px across navigation, controls, FPS,
section labels, case metadata, captions, experiment links and the footer.

Homepage-scoped rules now raise those styles to 13px, including the mobile case
descriptions and cursor invitation text. Larger type retains its existing size.
Cursor copy can wrap within its viewport bounds. No authored copy, simulation,
case-study typography, width cap or other page layout was changed.

Chromium checks found no rendered homepage text below 13px across 11 widths:
320, 360, 390, 480, 560, 600, 768, 800, 1024, 1440 and 2400px. Each measured 104
text-bearing/control elements, with no horizontal overflow or clipped text
containers. Expanded capture, revealed contact text and the 13px Culture
specimen invitation were also checked at 320px. These are desktop-browser
viewport checks, not physical iPhone/Safari verification.

Production build/TypeScript, lint, source and local HTTP integrity, practice-page
integrity, presentation and cursor regressions passed. This is a type-size check,
not a complete WCAG conformance audit. WCAG sets no universal minimum font size;
AA resize and contrast requirements still apply.

Josh also requested phone access to the LinkedIn screenshot. The existing,
unaltered hero JPEG is published at `/share/josh-cole-hero-linkedin.jpg`, so it can
be opened directly and saved on a phone without access to local Windows files.

## 16px body-copy follow-up

Josh approved seeing the recommended hierarchy: 13px supporting text with 16px
body copy. Homepage hero copy, eleven project descriptions, Dungeon introduction
and method paragraphs, and the GenSound introduction now use 16px at every
breakpoint. Captions, metadata and controls retain the preceding floor; display
headings are unchanged. The scope remains the homepage.

Chromium measured all 16 body-copy elements at 16px at 1440, 768, 390 and 320px
with no horizontal overflow. Production build/TypeScript and source/presentation
integrity passed. Desktop and 390px case-list captures are available at
`/share/homepage-body-16px-desktop.jpg` and `/share/homepage-body-16px-mobile.jpg`.
These previews show actual page content and can be viewed from a phone.
