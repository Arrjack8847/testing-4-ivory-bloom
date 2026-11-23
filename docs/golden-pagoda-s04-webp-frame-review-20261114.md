# Section 4 — Royal Frame WebP isolated preview

Artwork source branch: `art/section-04-royal-frame-20261114`; SHA `ca1d79d3db3a6c95b33dfbc01d66ca7e88830aed`.
Artwork: `assets/skins/golden-pagoda-garden/section-04/s04-royal-frame.webp`, 978×1851, WebP lossless with alpha, 520,600 bytes.

**Only Section 4 Royal-skin rendering changes.** Original source WebPs and SVG
candidates remain available and unchanged; no edits to Section 1, event HTML,
JS scroll/camera behavior, site-wide styles or other sections.

Mapping:
- Existing original `.event-reference-card::before` border-image image becomes
  `s04-royal-frame.webp`, retaining the original 200px 28px 26px border-image widths,
  using equivalent 3× source slices `600 84 78 fill`.
- Existing `img#eventSourcePaper` continues to use the prior composite
  `s04-strict-paper-composite.svg` and unmodified scroll camera.
- Single-border choice retained: original inset `::after` outline remains
  visually disabled in Royal mode.

### Quality and release gates

- Repository static comparison, WebP RIFF/VP8L dimensions, alpha flag: checked.
- Actual transparent edge quality, nine-slice lower-lotus deformation,
  crown/text overlap, and source/art alignment: **UNVERIFIED** before new preview.
- Four phone widths: 320×568, 360×740, 390×844, 430×932, both ceremonies;
  check forward/reverse scroll, map/calendar/Waze, petals, and iPhone Safari.
- If the bottom lotus distorts under `78` source slice, make a controlled
  artwork-side correction or explicitly re-test slice adjustment rather than
  altering card geometry. Preserve the frame's exact source bytes for audit.
- The generated WebP still may have chromatic yellow/red edge fringes visible
  against light parchment, requiring further manual visual acceptance.
- Do not merge to `main` or deploy to the Testing-4 production project.
