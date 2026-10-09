# Creative-direction draft media check

Checked locally on 2026-10-09. These pieces are previews only; nothing here has been committed, pushed, or published.

| Page | Images copied | Source | Status |
| --- | ---: | --- | --- |
| Andculture | 6 | `!_portfolio-2026/projects/andculture-rebrand-website` | Source filenames already matched the draft. |
| OUYA | 13 | `!_portfolio-2026/projects/ouya-gaming-brand-work` and `!_portfolio-2026/projects/ouya-gaming-international-commerce-site/screens` | Paired poster source images, E3 photos, and store screenshots mapped to descriptive site filenames. |
| Willow | 5 | `!_portfolio-2026/projects/willowbed-matresses` | Page title and slug changed from Willow Bed to Willow; selected packaging, mark, sketches, pattern, and stationery. |

Each source set was visually reviewed before mapping. All 24 referenced images exist in `public/creative/`, loaded in the local previews, and have corresponding alt text. ESLint and the production build pass. Each draft route returns 200 in development and 404 in production; none appears in the production homepage.

## Review before publishing

Josh approved the copy and stated credits for all three pieces in the ColeOS action, revision 5 (2026-10-09). Andculture displays 2014, OUYA's confirmed display date is 2012–2013, and Willow intentionally displays the approximate date c. 2016.

- OUYA: the supplied OUYA TV source is only a small thumbnail, so it was not used as a gallery frame; the project text still mentions OUYA TV.
- Willow: the actual artwork uses a “willow bed” wordmark, while the project title and route are now “Willow.”
- Review the visual pacing of the 13-image OUYA mosaic; the existing gallery makes some poster and screen captures small until opened in the lightbox.

All three frontmatter files remain `published: false` until Josh approves publication.
