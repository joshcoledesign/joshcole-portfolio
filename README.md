# joshcole-portfolio

Personal portfolio site built with Next.js, Tailwind CSS, and shadcn/ui.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Case Study Authoring

Case studies live in `content/case-studies/*.md` and use standard markdown rendered via `react-markdown`.

### Links

Standard markdown links render in brand cyan (`#26c5ff`) with an underline on hover:

```markdown
[Link text](https://example.com)
[Internal link](/volumes/creative-immersive/nemo-brand)
```

### Images

```markdown
![Alt text](/case-studies/path/to/image.png)
```

#### Image modifiers

Append hash fragments to the image URL to control rendering. All modifiers are stackable:

| Fragment | Effect | Default |
|---|---|---|
| `#no-border` | Removes the subtle border | Border on |
| `#mt-{px}` | Sets margin-top in pixels | `32px` |
| `#mb-{px}` | Sets margin-bottom in pixels | `32px` |

Examples:

```markdown
<!-- Remove border -->
![Alt](/case-studies/img.png#no-border)

<!-- Custom spacing -->
![Alt](/case-studies/img.png#mt-48#mb-8)

<!-- Combine all -->
![Alt](/case-studies/img.png#no-border#mt-48#mb-0)
```

### Live components

Embed interactive React diagrams using the `component:` prefix:

```markdown
![Brand Voice Engine](component:voice-engine)
![Identity Pipeline](component:identity-pipeline)
```

Available components are registered in `INLINE_COMPONENTS` in `src/components/case-study.tsx`.

### Case study ordering and "Next" end-cap

Each case study shows a "NEXT" card at the bottom linking to the next study in a continuous sequence across all volumes. The order is defined in `CASE_STUDY_ORDER` in `src/lib/case-studies.ts`:

```
Vol I  (AI Systems):        novensia → emergence → ust-rfp-agent
Vol II (UX & Enterprise):   vrc-suite → gprs-sitemap
Vol III (Creative):         lp-7d-ride → union-station-hotel → hype-js
```

The last study in the sequence shows only a `> cd ../volumes` link back to the volumes index.

To add a new case study to the chain, insert its slug into `CASE_STUDY_ORDER` at the desired position.
