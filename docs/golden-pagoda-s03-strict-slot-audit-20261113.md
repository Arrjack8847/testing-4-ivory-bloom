# S03 strict one-to-one slot geometry audit — 2026-11-13

**Status:** INITIAL GEOMETRY MEASUREMENT ONLY. No asset edits, preview deployment, PR merge, or Section 1 changes.

Source of truth: `Arrjack8847/testing-4@main`, especially `section-couple.css`, `section-couple-reference.js`, and `index.html`. Assets from `assets/golden-pagoda-47-staging-20261113`; protected Section 1 SHA `a1a243b0522a2f59c8065f19b5e77625911e58d2`.

## Locked policy

Match the **active** reference-mode artwork slots, not unused custom-art selectors. Preserve all section geometry, portrait sizes, the original sticky camera and reverse scrolling, 1.05× portrait focus zoom, existing petal motions, and content behavior. Adjust artwork inside source canvases. Composite unmatched art into an already-active slot. No newly positioned decorative DOM layers. Default skin and Section 1 remain untouched.

## Original Section 3 active measurements

| Original slot | Layout / geometry |
| --- | --- |
| `#couple` | min-height **1840px**, padding **225px 28px 170px**; <=350px min-height **1776px** |
| Sticky reference background | `100lvh` stage, min 480px; `::before` overscan **64px** top/bottom; centered `background-size:cover` |
| Existing arch panel | top **129px**, left/right **12px**, bottom **140px**; reference uses border-image with slices 200/28/26 |
| Live portrait cards | width 72% of inner column (max 334px), cap **240.5px**, aspect ratio **240.5/332.7** |
| Photo animation | focus `scale(1.05)` with existing timeline |
| Camera | Existing sticky/reversible camera logic is mandatory; do not disable scene track |

Original custom-art SVG slots `couple-garden-original.svg` (390×1840), `couple-botanical-edges-original.svg` (390×1840), `couple-canopy-original.svg` (390×295), and `couple-lake-finish-original.svg` (390×178) are **hidden** in active reference mode. Do not treat them as currently visible independent replacement slots.

## Seven uploaded assets → original active slots

| Uploaded asset | Canvas | Proposed mapping |
| --- | --- | --- |
| `couple-garden.webp` | 1080×1920 opaque | Active sticky scene background |
| `canopy.webp` | 1080×500 alpha | Composite into scene, if clear and not duplicate |
| `floral-left.webp` | 600×1100 alpha | Composite into scene if it doesn't obstruct live content |
| `floral-right.webp` | 600×1100 alpha | Composite into scene if it doesn't obstruct live content |
| `lake-transition.webp` | 1080×500 mixed alpha | Composite into scene avoiding second lake/balustrade |
| `arch-kanote.webp` | 1080×700 alpha | Must adapt to existing tall border-image/slice geometry |
| `portrait-frame.webp` | 800×1100 alpha | **Conflict:** no active independent oval-frame overlay slot; preserve original card geometry, do not bake frame into sticky scene |

## Source alpha measurement (decoded alpha >128 pixel bounding box)

| File | Bounding box [left,top,right,bottom] | Fully transparent |
| --- | --- | --- |
| `arch-kanote.webp` | [95,67,1052,584] | 58.49% |
| `canopy.webp` | [9,61,1071,500] | 41.75% |
| `couple-garden.webp` | [0,0,1080,1920] | 0% |
| `floral-left.webp` | [8,235,551,1065] | 48.47% |
| `floral-right.webp` | [234,316,595,1062] | 60.28% |
| `lake-transition.webp` | [0,54,1080,500] | 0.2% |
| `portrait-frame.webp` | [82,16,785,1087] | 69.47% |

These are alpha geometry, **not** direct visual similarity scores. Originals remain intact.

## Four mobile-width CSS cropping simulation

Simulation follows current reference `cover` geometry, with a viewport-height scene and 64px overscan per end, and a 1080×1920 Royal garden source.

| Viewport | Background box | Visible source x range (of 1080px) | Horizontal crop on each side |
| --- | --- | --- | --- |
| 320×568 | 320×696 | 98.62–981.38 | 9.13% |
| 360×740 | 360×868 | 141.84–938.16 | 13.13% |
| 390×844 | 390×972 | 154.81–925.19 | 14.33% |
| 430×932 | 430×1060 | 150.57–929.43 | 13.94% |

Garden architecture, distant pagoda and foreground lotus remain recognizable in the simulated crops. **Not yet verified:** original scene visual checkpoint comparison and live portrait/text clearances.

## Candidate comparison

Separate library repair candidates `arch-kanote(1).webp`, `portrait-frame(1).webp`, `canopy(1).webp`, `floral-left(1).webp`, `floral-right(1).webp` were measured and visually compared. The arch and portrait repair candidates have more complete shapes than the originals, but final alpha-edge, color-fringe, original-slot fit and commercial provenance approval are still pending. No candidate was silently promoted.

## Worker draft warning

Existing `feature/golden-pagoda-s03` CSS changes section min-height to 1740px, changes padding and portrait width, hides the original reference track, and disables/hides some decorative animation. It fails our now-locked strict geometry rule. Do not merge as-is.

## Next checkpoint

1. Obtain matching original reference-mode scenic checkpoint and portrait-overlap screenshots.
2. Align a single Royal scenic composite to the original CSS `cover` cropping; avoid duplicating floral/lake layers.
3. Determine border-image-compatible tall arch composition without stretching carvings.
4. Resolve portrait-frame compatibility without altering live photo geometry/zoom.
5. QA at 320/360/390/430px, forward/reverse scroll and reduced motion, before any merge/deploy.

**No functionality, device, deployment, or copyright approval is asserted by this audit.**
