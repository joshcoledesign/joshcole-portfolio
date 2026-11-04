# Current website share preview

Replaced the previous site-design screenshot with a 1200 × 630 JPEG (94,348
bytes) composed from the current live Culture rendering, Geist, Josh's signature
and the approved homepage headline. The actual site rendering was used, not
invented artwork. The share composition omits interactive controls and FPS.

`src/data/site-share-image.json` owns the versioned image path, dimensions, MIME
type and descriptive alt text. Root Next metadata, portfolio HTML generation and
the standalone résumé reference this image. The old file-based PNG is removed
so it cannot override the explicit metadata; its public address redirects to the
new JPEG. Existing project-specific native experiment Open Graph images remain.

Verification: build/TypeScript and ESLint passed. The share regression checks
JPEG dimensions/size, image bytes and MIME type, the legacy redirect, and actual
Open Graph/Twitter metadata on home, About, résumé, Andculture, Culture and
genSound. Source/HTTP integrity checks preserve 18 routes, 296 authored blocks,
266 original asset hashes, eight About paragraphs, résumé content and original
PDF. The composition was visually inspected at its native size.

Social platforms control their existing cached previews; the versioned image
address takes effect when they next fetch the page's metadata. No social post
was created as part of this change.
