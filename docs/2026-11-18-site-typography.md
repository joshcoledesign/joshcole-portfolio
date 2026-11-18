# Shared site typography and hero spacing

Josh approved Schibsted Grotesk for regular body copy across the site, Vinila
Variable for display headings, and JetBrains Mono for UI. The shared local
stylesheet is public/portfolio/fonts/site-typography.css. Its three role tokens
are consumed by the portfolio renderer, native Next pages, web résumé and labs.
The existing licensed Schibsted font and OFL are reused; Vinila remains served
through Adobe Fonts project wno7axa. No package dependency was added.

Case-study prose, About, experiment descriptions and résumé text use the body
role. Navigation and controls use the UI role. Existing deliberate serif display
accents and labelled project specimens, including Emergence's Geist Mono, remain
authentic. The approved résumé PDF and browser-print Geist presentation remain.

The larger desktop gap above Culture is 40px shorter: about 319px at a 1755px
viewport, with the title/control gaps still 12px and 24px. The original 1280px
and phone content flow are retained.

genSound and Dungeon receive only document/font adapters; their script tags are
unchanged. Source hashes and derived hashes record Dungeon's HTML adaptation.
Worldstage's source snapshot remains intact and its importer supplies the shared
font roles. genSound's snapshot and importer retain the latest analysis/export
code and record the presentation adaptation. No original work images are edited.

Validation covers build, TypeScript, lint, authored content, asset hashes,
About/résumé/PDF integrity, original Worldstage sources, desktop/phone font roles
and layout, standalone lab controls, and the adjusted hero geometry.
