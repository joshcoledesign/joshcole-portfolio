# Shared JetBrains Mono website typography

Josh requested standardizing the existing mono fonts on the site around
JetBrains Mono. The site now self-hosts the official JetBrains Mono v2.304
variable normal and italic faces, weights 100–800, under the existing SIL Open
Font License. Font URLs, version and SHA-256 hashes are recorded in
`src/data/site-mono-fonts.json`.

One shared stylesheet supplies native Next pages, the standalone portfolio
document, web résumé and embedded/standalone lab interfaces. Courier, system
mono fallbacks, Geist Mono UI and genSound's DM Mono are replaced by the shared
family. The native layout reuses the same font instead of fetching an additional
JetBrains copy through Google Fonts.

The labelled **Geist Mono specimen in Emergence** remains original project
evidence; the surrounding case-study metadata, node controls and code UI use
JetBrains Mono. Vinila Variable, intentional serif text, authored copy, original
work images, Figma and the approved PDF/print résumé are preserved.

Worldstage's existing source snapshot is retained: the portfolio adapter applies
the font to the served studio. genSound's font mapping/stylesheet and snapshot
provenance are updated on the current lab without replacing its analysis,
exports or interaction scripts. The adapter is updated for future refreshes.
Dungeon already uses JetBrains Mono internally; its host controls also load the
shared family when the lab is launched. No minified game/runtime files are edited.

## Verification

- Production build, TypeScript and ESLint passed without lint warnings.
- Source/local HTTP integrity passed: 18 registered routes, all 296 authored
  blocks, 270 asset/font hashes, eight About paragraphs, résumé text and exact
  approved PDF download.
- Presentation, lab-cursor and Worldstage preserved-source checks passed.
- Browser font/overflow audit passed on all 20 current pages at 390px and 1280px,
  covering 1,406 rendered mono elements, with only the explicit project specimen
  exempted. All three standalone labs passed at both widths; the 320px homepage
  check passed as well.
- Embedded Dungeon and genSound resolve to JetBrains Mono. Dungeon launch and a
  standalone genSound preset click were checked. All genSound script tags match
  the pre-change release byte-for-byte; both new font binaries expose the expected
  100–800 variable-weight axis.

Derived browser evidence is retained in the originating chat's artifact directory
as `jetbrains-mono-layout-checks.json`. Release starts from `05bb468`; unrelated
local drafts and the pending Premise publication candidate are excluded.
