# Approved copy integration

Integrated Luna's approved local handoff into portfolio main's latest release
base, `7ae6a9674f860643de13a6c7d53267e845b47b2d`. The original handoff is retained
in `2026-11-04-approved-copy-handoff.md`; its historical status describes the
review worktrees before this integration.

All 17 portfolio source-file diffs were applied, including the ten authored
Markdown files, attributed renderer blocks, metadata, About, and Hype copy.
Generated portfolio bundles and manifests were rebuilt in the receiving checkout.
All 296 source blocks retain their attribution. Saints includes photographed
subjects, built sets including the large table, subject/object compositing,
digital painting, grading, light matching, and retouching. The resume source,
plaintext and original PDF remain unchanged.

GenSound's three copy replacements were applied to its latest source, preserving
the newer header/source link and all export code. They are merged in source PR 5
at `165d5649c9c6e74f02c452aa516e840d9fcd6b76`; the portfolio snapshot records that
revision. Reversing the text replacements reproduces the prior source (normalized
line endings). Inline scripts, analyzer, and analysis data are unchanged.

Validation completed in the receiving release checkout:

- Production build, TypeScript and ESLint passed.
- Source and local HTTP integrity passed: 18 routes, 296 blocks, 266 asset hashes.
- Practice-page checks passed: eight About paragraphs and unchanged resume/PDF.
- About motion, site presentation and lab specimen-cursor regressions passed.
- Chromium viewport checks passed for Saints, Fractured, Novensia, About and Hype
  at 1440px and 390px, with expected copy and no horizontal overflow.
- GenSound's approved copy, source link and 500/2000px controls were verified.
  A full-screen Hilbert save reported success at 2000px and retained viewer state;
  size synchronization passed. Download-event capture did not return file bytes,
  so no new pixel-accuracy claim is made. Prior export tests remain documented
  in `docs/gensound-publication.md`.

No new dependency, layout, analysis, drawing or motion behavior was introduced.
Actual Safari and physical-phone checks were not performed. The original owner
checkouts and both Luna review worktrees were preserved.

The Hype descriptions are approved website copy. Future upstream Hype exhibition
regeneration must carry these descriptions forward, as the original handoff notes.
