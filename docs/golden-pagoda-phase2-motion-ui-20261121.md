# Phase 2 — Golden Pagoda royal motion and mobile UI
Date: 2026-11-21
Repository: Arrjack8847/testing-4-golden-pagoda-garden
Base: Phase 1 branch `perf/golden-pagoda-phase1-cover-20261121`, SHA `a2dc8ff9ff2f5a3595557b1fdfb80f9c472d70f1`
Review branch: `feat/golden-pagoda-phase2-motion-ui-20261121`
Status: review only. No production main merge.

## Memory skills followed
- scroll-animation-engineering
- continuous-section-transitions
- decorative-motion-engineering
- responsive-geometry-calibration
- visual-parity-engineering

## Verified source findings
- S01 Royal uses a 425lvh (4.25H) sticky track with -100lvh natural section overlap, so S02 begins at 3.25H. Royal text remains fixed through its completed reveal and the message covers the hero. This intentional choreography has **not** been retimed or replaced.
- The last rules in `golden-pagoda-s01-bilingual-preview.css` used `var(--royal-y-progress,0)`, but `scene.js` never assigns the property. Those late !important rules effectively cancelled an earlier approved -2px first-name and +6px second-name correction. Added final fixed offsets without modifying x-position, masks, opacity, scroll timing or typography.
- S07 `golden-pagoda-s07.js` **already** reorders the 5 Royal cards to Groom, Bride, Together, Garden, Lake. It intentionally preserves no-crop `object-fit:contain` for 3 portrait photographs. The gallery loader used numeric accessibility labels from the old index ordering; changed Royal-only labels to accessible descriptions. Non-Royal labels remain untouched.
- S08/S09 `golden-pagoda-s08-s09-split-flutter.js` previously called split-wing asset activation for every website skin, even without the Royal skin query. Added a Royal-only gate to prevent unapproved Royal overlays and six needless network requests on non-Royal versions. The original 6 approved uploaded WebPs, measured wing-root hinges, 3D keyframes, 2+2 RSVP butterfly paths and fallback animation remain identical.
- S03 source already uses a retained fixed oval photo window with the approved portrait slots and user-requested text contrast. No blind crop/geometry changes were made without real rendering evidence.

## Edits
- `golden-pagoda-s01-bilingual-preview.css`: restore fixed, approved -2px / +6px name breathing offsets.
- `golden-pagoda-s08-s09-split-flutter.js`: activate Royal butterflies only for `?skin=golden-pagoda-garden`.
- `section-five.js`: descriptive Royal gallery button labels.
- `tests/golden-pagoda-s07.spec.mjs`: update stale portrait-fit expectation and assert the approved DOM/tab order.
- `tests/golden-pagoda-phase2-motion-ui.test.cjs`: new source/runtime simulations.
- `tests/golden-pagoda-phase2-motion-ui.spec.mjs`: four-device Royal handoff, reverse scroll, gallery geometry/viewer and RSVP butterflies.

## In-chat checks (not an actual browser)
- JS source compilation for scene.js, section-five.js and split-wing JS: PASS.
- Royal vs non-Royal split-wing mocked runtime: PASS; 0 Royal asset requests for other skins; 6 Royal assets requested with 1 bottom-zone insertion for Royal.
- Static source checks for S01 approved offsets and 4.25H/3.25H geometry: PASS.
- Static source checks for S07 five-image order and full-image contain: PASS.

## NOT_RUN / remaining acceptance work
- Playwright at 320x568, 360x740, 390x844, 430x932 (test authored only; not yet executed in an actual browser).
- Timed screenshot/reference pixel comparisons for S01/S02 and S03/S07.
- Physical iPhone Safari/WebKit and WebView touch momentum, reverse-scroll, text glyph/face clearance and reduced-motion verification.
- Live Vercel asset responses and animation screenshots on the exact deployment SHA.
- No actual benchmark values or verified iPhone visual sign-off are claimed.

## Commands for independent reproducible QA
`node --test tests/golden-pagoda-phase2-motion-ui.test.cjs`
`npx playwright test tests/golden-pagoda-phase2-motion-ui.spec.mjs`

Keep this change review-only and stacked on Phase 1; preserve Golden Pagoda artwork, scene camera, S02 flow footer, S03 portrait window, S07 original WebPs and S08/S09 approved animation geometry.
