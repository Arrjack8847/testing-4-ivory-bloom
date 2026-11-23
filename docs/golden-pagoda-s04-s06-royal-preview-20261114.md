# Sections 4–6 Royal review — S06 integration handoff

Base review commit: `2511253af4f1e01c9a219a318a1271c32f831e06` (S04 WebP frame + parchment; S05 Royal Timeline).
Source Section 6 worker branch: `feature/golden-pagoda-s06` at `72f8fd28b6a1a6d9092b28bebd7083e4756aa56a`.
Review branch: `test/golden-pagoda-s04-s05-s06-royal-review-20261114`.

## Changes
- Registered `golden-pagoda-dress-code.css` immediately after `dress-code.css` in the existing HTML head; no other HTML change.
- Reused source CSS scoped entirely to `html[data-golden-pagoda-skin="true"] #dressCode`.
- Reused worker `dress-code.js`: switches only the Royal skin to the local `section-06/dress-paper.webp` while preserving the original paper for the default skin, flight, reveal, camera and Reduced Motion.
- Reused and adapted S06 Playwright suite: load the stylesheet through the real HTML rather than injecting it again in the test runner.
- Four WebP asset blobs were already present with identical SHAs, so no artwork added/recreated.
- All six original swatches remain unchanged: Groom #8a9a7b, #b3c0a4, #ede7d9; Bride #b4694f, #dca79a, #efddd1.
- S04 and S05 code and assets were not modified in this integration.

## Remaining gates
- Browser execution of 320×568, 360×740, 390×844 and 430×932 Playwright projects, physical iPhone forward/reverse scroll and Reduced Motion remain pending unless measured separately.
- Inspect original Section 5→6 and Section 6→7 transition, top/bottom gold ornament edges, side floral against swatches, art visibility, and source paper crop.
- Check all four WebPs load and no JS console errors.
- Verify the original non-Royal skin remains unchanged.
- Section 6 draft PR #3 remains unmerged; this independent review branch does not replace its PR.
- No production deployment or merge into `main`. Final 47-asset baseline approval remains a release gate.

This is only a review/testing build, not final visual approval.
