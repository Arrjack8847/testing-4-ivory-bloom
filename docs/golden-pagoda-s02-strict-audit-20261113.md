# S02 Royal Message — Strict Artwork-First Adaptation (2026-11-13)

**Scope:** `#message`, `?skin=golden-pagoda-garden` only.  
**Isolated branch:** `test/golden-pagoda-s02-strict-20261113`  
**Base:** `fix/golden-pagoda-s03-iphone-visual-20261113` @ `4f406e4d9a65bc555849882723364eea67f6722c`.  
**Original source:** `Arrjack8847/testing-4@main` `section-two.css` blob `e0fea13b747006ac1567e6768a1476433847b2d0` and `section-two.js` blob `f9841aa24d8d3abe606e6c048664cdf08c045b0a`. The target's original files are byte-identical to these blobs.

## Strictly retained geometry and behavior

- Reference at 390×844: #message CSS min-height **762px**, padding **187px 22px 78px**; frame width **346px** and minimum height **495px**; letter-content max-width **334px**.
- Existing <=350px rule retained verbatim: `min-height:0`, bottom padding **80px**, frame minimum height **556px**, 22px side inset.
- Existing `section-two.js` IntersectionObserver, open-state guard, visibility-aware petal lifecycle, reduced motion, reveal timing and scroll behavior unchanged.
- `index.html` changes only to load the new, skin-scoped `golden-pagoda-s02-strict-preview.css` after `section-two.css`; there is no added decorative DOM.
- No camera, animation, scroll driver, Section 1 or Section 3 modifications.

## Actual source assets — technical inspection

WebP headers were inspected from the GitHub binaries, and the five images visually inspected. Dimensions and alpha-support flags are grounded in the RIFF/VP8X/VP8 headers; **exact alpha pixel bounding boxes were not decoded/measured**.

| Original file | Source canvas | Encoded alpha | Runtime |
|---|---:|---|---|
| `message-paper.webp` | 1080×1920 | no (opaque) | #message background image, `cover` |
| `message-canopy.webp` | 1080×400 | yes | Embedded in S02 decor composite at x=0, y=54, 1080×400 |
| `lotus-left.webp` | 720×1100 | yes | Embedded in S02 decor composite at x=-145, y=860, 610×932, margin-fade mask |
| `lotus-right.webp` | 720×1100 | yes | Embedded in S02 decor composite at x=615, y=860, 610×932, margin-fade mask |
| `closing-ornament.webp` | 600×350 | yes | Replaces **existing active** `.letter-lead::after` thin separator inside original 61px text gap |

**Processed asset:** `assets/skins/golden-pagoda-garden/section-02/s02-strict-decor-composite.svg`. Embeds the original three transparent WebPs as data URLs, so SVG-as-CSS-image loading does not rely on forbidden external resource fetches. Uses the existing `#message::before` paper-relief overlay slot. The composite has the same 1080×1920 viewBox as the parchment and both use `background-size:cover`; avoids aspect distortion and keeps artwork registration aligned at changing section heights.

**Asset policy:** All five original WebP files are unchanged, not deleted, and remain available for review or future replacement.

## Visual intent and constraints

- Canopy ends near the existing frame top (~187px at a 390px viewport), without inserting a new HTML layer.
- Soft-edged lotus margins preserve the readable center; original color and animation layers are preserved.
- Closing divider takes the existing lead/quote separator slot. This is intentionally above the quotation, not a newly positioned footer beneath all text. Repositioning below the entire letter would require evidence that it fits the original frame/pagoda geometry.
- Antique-gold border/text tint is skin-only. The default Testing-4 appearance remains inert.
- **Outstanding visual risk:** The uploaded transparent decorations appear to have colored alpha-edge halos in isolated viewing; real render on warm parchment and 4 widths must determine whether source-edge cleaning is warranted. No pixel-level alpha clean-up is claimed.

## Verification matrix — status at authoring

| Gate | Status | Evidence / limit |
|---|---|---|
| Current S03 reference branch read and base SHA verified | PASS | `4f406e4d9a65bc555849882723364eea67f6722c` |
| Original Testing-4 CSS and JS unmodified | PASS | Source blob SHA comparison, only new skin CSS and stylesheet link |
| Five uploaded WebPs identified and original paths preserved | PASS | GitHub file headers and existing original objects |
| Source sizes and alpha capability | PASS | VP8X/VP8 headers decoded; exact alpha **bounds NOT_RUN** |
| Asset composites mapped to original surfaces | PASS (source-level) | #message background, existing #message::before, existing lead rule |
| Four-width rendered geometry and text overlap | NOT_RUN | Playwright spec provided; requires execution and screenshots |
| Four-width asset loading and WebP-in-SVG decode | NOT_RUN | Playwright spec provided; no completed browser run |
| Forward/reverse scroll and reduced motion | NOT_RUN | Original implementation preserved; regression suite not executed |
| Same-frame original/new pixel comparison | NOT_RUN | Needs rendered baseline + isolated preview screenshots |
| Real iPhone Safari screenshot and reverse scroll | BLOCKED | No physical-device evidence available in this session |
| Production deployment and merge | NOT_RUN | Intentionally prohibited without approval |

## Test procedure and acceptance

Run focused spec (no GitHub Actions): `npx playwright test tests/golden-pagoda-s02-strict.spec.mjs`. The existing Playwright config covers 320×568, 360×740, 390×844, 430×932. Compare S02 screenshots to the same viewport checkpoint on the original source. Test opening, forward/backward scroll, no missing artwork, no clipping/overflow, reduced motion and iPhone Safari.

The test source is a **proposed test**, not evidence that it passed. Report actual run status and physical device status separately; do not merge or publish production until approved.
