# Josh Cole - Portfolio

[joshcolecreative.com](https://joshcolecreative.com) is Josh Cole's portfolio for AI systems design, UX leadership, creative direction, and photography. It is built with Next.js 16 App Router, React 19, and TypeScript, with content authored in Markdown.

## Local development

The repository uses the Node and pnpm versions pinned in `package.json` via Volta.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Before shipping a change, run:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Content authoring

[`docs/content-authoring.md`](docs/content-authoring.md) is the source of truth for frontmatter, image handling, publishing, and route behavior.

- Case studies live in `content/case-studies/`.
- Photography series and singles live in `content/creative/`.
- Case-study assets live in `public/case-studies/<slug>/`.
- Photography assets live in `public/creative/<slug>/`.
- Use `thumbnail` for the homepage work surface. It is independent from `heroImage`.
- Counts are computed from published content; never type them into page copy.
- Do not edit a Markdown body when only a frontmatter change is required.

Standard Markdown links and images are supported:

```markdown
[Internal link](/work/nemo-brand)
![A useful image description](/case-studies/example-study/image.jpg)
```

Image layout modifiers such as `#no-border`, `#pair`, `#feature`, and margin fragments are documented in the authoring guide.

Interactive diagrams use the `component:` image prefix:

```markdown
![Brand Voice Engine](component:voice-engine)
![Identity Pipeline](component:identity-pipeline)
```

Available inline components are registered in `INLINE_COMPONENTS` in `src/components/study-page.tsx`.

## Metadata assets

Next.js App Router serves the site's file-based metadata from `src/app/`:

- `icon.png` - browser and site icon
- `opengraph-image.png` - 1200x630 social-sharing image
- `opengraph-image.alt.txt` - social image description

## Deployment

Vercel deploys the site automatically when changes are merged to `main`. Production is available at [joshcolecreative.com](https://joshcolecreative.com); no manual CLI deployment is required for the normal release workflow.
