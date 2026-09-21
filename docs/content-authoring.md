# Content authoring

This is the authoring contract for work shown on the site. Update this guide whenever a loader or renderer change affects how content is written.

## Where content lives

- Studies live in `content/case-studies/` and use `kind: "study"`.
- Series and singles live in `content/creative/` and use `kind: "series"` or `kind: "single"`.
- Study images live under `public/case-studies/<slug>/` and are referenced as `/case-studies/<slug>/<file>`.
- Series and single images live under `public/creative/<slug>/` and are referenced as `/creative/<slug>/<file>`.
- `frames` and `blocks` are computed by the loader. Never add them to frontmatter.

## Study frontmatter

Required fields are `title`, `slug`, `kind`, `descriptor`, `summary`, `weight`, `order`, `sortYear`, `displayDate`, and `tags`. Keep `display: "single"`. `role`, `year`, `thumbnail`, and `heroImage` are optional presentation fields. `published` defaults to `true`; set it to `false` to remove the study from its route, the map, lists, groups, and counts.

`thumbnail` is the work-surface image. It does not replace `heroImage`, which remains available to renderers that explicitly use it. `weight` is an integer from 1–3. `order` is the arranged-map position. `shape` is `landscape`, `portrait`, or `square` and defaults to `landscape`. `sortYear` is numeric and used only for sorting; `displayDate` prints exactly as written.

```yaml
---
title: "Example Study"
slug: "example-study"
kind: "study"
display: "single"
descriptor: "a short map caption"
summary: "One sentence used for metadata and the study description."
role: "Design and build"
published: true
featured: false
thumbnail: "/case-studies/example-study/grid.jpg"
heroImage: "/case-studies/example-study/hero.jpg"
weight: 2
order: 40
shape: "landscape"
sortYear: 2026
displayDate: "2025–Present"
tags:
  - "AI Systems"
  - "Design Systems"
---
```

## Series and single frontmatter

Required fields are `title`, `slug`, `kind`, `descriptor`, `thumbnail`, `images`, `weight`, `order`, `shape`, `sortYear`, `displayDate`, and `tags`. Use `display: "mosaic"` for a series that should show multiple frames and `display: "single"` for one image. `thumbnail` controls the map and photography mosaic but never changes the order of `images` on the piece route.

An image may be a path string or an object. Use an object when the frame needs authored `alt`, `focal`, or `story` data. `story` appears in the frame lightbox. `focal` is an `[x, y]` pair from 0–1. `video` is optional; when present, use a YouTube URL or ID. It renders above the frames only on the piece route. Keep an unfinished video piece at `published: false`.

```yaml
---
title: "EXAMPLE SERIES"
slug: "example-series"
kind: "series"
display: "mosaic"
descriptor: "one shoot, told in three frames"
published: true
featured: false
thumbnail: "/creative/example-series/example-cover.jpg"
video: "https://youtu.be/example-id"
images:
  - src: "/creative/example-series/example-01.jpg"
    alt: "A useful description of the first frame"
    focal: [0.4, 0.5]
    story: "Optional writing shown when this frame opens."
  - src: "/creative/example-series/example-02.jpg"
    alt: "A useful description of the second frame"
  - "/creative/example-series/example-03.jpg"
weight: 2
order: 42
shape: "landscape"
sortYear: 2026
displayDate: "2026"
tags:
  - "Creative Direction"
  - "Photography"
  - "Editorial"
---
```

For a single, use the same file for `thumbnail` and the only `images` entry:

```yaml
kind: "single"
display: "single"
thumbnail: "/creative/example-single/example.jpg"
images:
  - "/creative/example-single/example.jpg"
```

## Study images and URL suffixes

Images use normal Markdown. Alt text is required content: it becomes the image's `alt` attribute and its visible caption.

```md
![A dashboard showing the final review state](/case-studies/example-study/review.jpg)
```

Add presentation options in the URL fragment. The file path before `#` remains the disk path.

- `#no-border` removes the image border.
- `#mb-48` sets 48px of space below the figure. The numeric value may change.
- `#pair` places two consecutive images marked `#pair` side by side at equal width.
- `#feature` starts a three-image composition: the marked image takes the left two-thirds and the next two consecutive images stack in the right third.

At 768px and below, `pair` and `feature` collapse to one column in source order. Combine options inside one fragment with `&`.

```md
![First comparison](/case-studies/example-study/before.jpg#pair&no-border)

![Second comparison](/case-studies/example-study/after.jpg#pair&no-border&mb-48)

![Featured overview](/case-studies/example-study/overview.jpg#feature)

![Supporting detail one](/case-studies/example-study/detail-01.jpg)

![Supporting detail two](/case-studies/example-study/detail-02.jpg)
```

## Inline components

Use the `component:` image syntax for a registered diagram. The alt text remains the accessible description supplied by the surrounding renderer or component.

```md
![Brand Voice Engine four-stage pipeline](component:voice-engine)
```

Registered component names are `voice-engine` and `identity-pipeline`.

## Pull quotes

A Markdown blockquote becomes a pull quote with larger type and the brand-gradient hairline. Do not add quotation marks unless they are part of the authored sentence.

```md
> The voice profile captures techniques, not phrases.
```

## Section jump lists

Use an `## In brief` heading followed by a normal Markdown list. Link each item to an `##` heading on the same page.

```md
## In brief

- [The problem](#the-problem): what made the work necessary.
- [What I built](#what-i-built): the system and the decisions behind it.
- [Where it's going](#where-its-going): the next layer.

## The problem

...
```

Heading IDs are generated from the heading text: lowercase it, remove apostrophes and other punctuation, change spaces to hyphens, and collapse repeated hyphens. For example, `Where it's going` becomes `where-its-going`. The In brief list renders smaller than body copy, and anchored headings retain clearance beneath the sticky prompt line.

## Missing images and placeholders

Reference the final raster path in Markdown or frontmatter even when the file is not ready. Run `pnpm placeholders` to create the in-brand SVG sibling and update `public/case-studies/PLACEHOLDERS.md`. The site tries the real path first and falls back to the SVG. To replace a placeholder, drop the real file at the referenced path; nothing in Markdown changes.

The generator never overwrites a real image or an existing SVG fallback.

## Copy and voice

- Body copy is verbatim. Build work never edits, shortens, improves, or reflows it.
- If a fact or wording needs review, add a `TODO(josh):` comment in frontmatter. Do not invent client names, dates, metrics, outcomes, or credits.
- Use a true em dash (`—`) with spaces around it for an aside or role separator. Do not substitute `--` or use an em dash as generic decoration.
- Use plain words and sentence case for generated interface copy.
- Do not use: “leverage,” “utilize,” “synergy,” “innovative,” “thought leader,” “passionate about,” “results-driven,” “proven track record,” or “frontier.”
- Do not add year counts or age references.
