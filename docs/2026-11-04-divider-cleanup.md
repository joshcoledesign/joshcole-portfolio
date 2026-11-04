# Divider cleanup

The Andculture brief had a static gray rule above its growing pink rule and
another static rule at the end of the chapter. The growing rules now own section
boundaries across case studies, experiment wrappers, About and the screen résumé.
Redundant chapter borders, gallery navigation separators and trailing frames are
removed. Rules at full-browser color changes follow the painted band to the
browser edges; content remains capped at 1680px. Meaningful image/card borders,
footer navigation and the first homepage's static fading rule are preserved.

Verification: production build/TypeScript, ESLint, presentation/motion/cursor and
Culture storage regressions passed. Local HTTP checks preserved all 18 routes,
296 authored blocks, 266 asset hashes, eight About paragraphs, résumé content
and the original PDF. A rendered DOM audit covered 20 pages at 1440px and 390px:
no empty stacked section dividers remained. The two mobile Hype candidates are
the bottom edges of illustrated link cards, not section separators, and remain.
All eleven case studies were also checked at 2400px with no horizontal overflow;
color-boundary rules measured the full 2400px. Andculture was visually reviewed.
Actual Safari and physical phones were not tested.

The newer GenSound snapshot, source prose, assets, Culture behavior, viewer zoom,
sticky navigation and reduced-motion behavior are unchanged. Test evidence is
stored in this chat's artifact directory as `divider-audit-final.json`.
