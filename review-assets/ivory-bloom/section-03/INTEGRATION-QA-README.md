# Ivory Bloom Section 03 — experimental 15-file replacement

**SAFE REVIEW ONLY — NOT PRODUCTION APPROVED.** Based on preview branch. Existing CSS/JS/SVG and section animation positions are untouched.
Owner authorized replacement of all 15, conditioned on Official Artwork Creation Rules. These exports are NOT represented as fully passing those rules. All fifteen have correct native canvas sizes and valid WebP encoding; all have been uniformly scaled within their canvas without crop/stretch and transparent/opaque behavior verified, where known. Alpha bounding/padding, exact subject position, photo identity, and mobile render remain unverified.

**MAJOR BLOCKERS:** groom ivory suit vs approved Section1 black tuxedo; unverified couple identity; portrait frame source oval vs candidate arch; candidate `s03-royal-card-lotus.webp` is a plaque, not floral-only footer; lake candidate scene differs from original terrace fade; full arch candidate differs from shallow ornament. **DO NOT MERGE** until these are corrected and approved.

Runtime details: section-couple-reference.js uses the bride/groom files; golden-pagoda-s03-parchment.js loads parchment, plaque and footer; golden-pagoda-s03-rings-and-garden.css uses ring crest. CSS currently hides .couple-arch and .couple-botanical-edges. Existing 3 SVG composites remain unchanged.

| Asset | Canvas | QA caveat |
|---|---|---|
| `arch-kanote.webp` | 1080 × 700 | Whole arch differs from source shallow canopy; currently hidden by CSS. Visual-source geometry NOT CERTIFIED. |
| `canopy.webp` | 1080 × 500 | Source ratio fits, new canvas with proportional resample. Source alpha margin NOT CERTIFIED. |
| `couple-garden.webp` | 1080 × 1920 | Unverified couple identity/outfits; proportional contain with background padding; placement NOT CERTIFIED. |
| `floral-left.webp` | 600 × 1100 | Side botanical layer currently hidden; proportional contain; source margins NOT CERTIFIED. |
| `floral-right.webp` | 600 × 1100 | Side botanical layer currently hidden; proportional contain; source margins NOT CERTIFIED. |
| `lake-transition.webp` | 1080 × 500 | Source is terrace-to-ivory fade; candidate is different lake view; gradient alpha added. Subject geometry NOT CERTIFIED. |
| `portrait-frame.webp` | 800 × 1100 | Source gold oval; candidate arched floral shape; central window NOT CERTIFIED. |
| `s03-kanote-lotus-ring-crest.webp` | 1000 × 579 | Canvas matches; source alpha registration and relative icon scale NOT CERTIFIED. |
| `s03-royal-bride-portrait.webp` | 1024 × 1536 | Source couple identity was not available for face-by-face comparison. NOT CERTIFIED. |
| `s03-royal-card-lotus.webp` | 1983 × 793 | Source is transparent floral footer; candidate contains ornamental plaque. Role NOT CERTIFIED. |
| `s03-royal-groom-portrait.webp` | 1024 × 1536 | Groom candidate wears champagne suit, Section 1 locked attire black tuxedo. FAIL. |
| `s03-royal-parchment-card.webp` | 971 × 1619 | Near source canvas; proportional fit and top/bottom padding; original alpha margins NOT CERTIFIED. |
| `s03-royal-parentage-plaque.webp` | 1983 × 793 | Canvas matches and center blank; transparent painted bounds not certified. |
| `s03-royal-rings.webp` | 1254 × 1254 | Canvas matches; original alpha margins not certified. |
| `s03-royal-wedding-rings.webp` | 192 × 192 | Proportional scaling to 192x192; exact original icon bounds NOT CERTIFIED. |

Tests: WebP decoding, dimensions, alpha: PASS for all 15. Exact alpha margins/source anchors/mobile screenshots/couple identity: NOT_VERIFIED. CSS/JS/SVG no changes: verified by Git diff once uploaded.

Do not deploy, merge, or treat this branch as approved without full artwork review.