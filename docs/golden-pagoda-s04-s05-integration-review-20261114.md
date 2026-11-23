# Section 4 + 5 — Isolated Royal Review

- **Base:** `a0a00d2bd4293c4db0618163f4ccdb78a83bd89e` — Section 4 Royal Frame + Ivory Background WebP
- **Section 5 artwork and code:** `40437190e6d1c519d17811d788064aefd82e207e` — existing Royal Timeline development branch
- **Branch:** `test/golden-pagoda-s04-s05-combined-20261114`
- **Scope:** `#runningOrder` (Section 5), retaining `#eventDetails` (Section 4) and all other sections unchanged.

## One-to-one integration

The source Section 5 markup in `index.html` is byte-identical between the two branches, so the integration brings across only:
- `order-program.css` — scoped Royal paper, top Kanote, flowers, seal, lower ornament, responsive timeline
- `order-program.js` — five independent Royal artwork slots, their load-state checks, original reveal/camera logic and reduced-motion
- `tests/s05-royal-timeline.spec.mjs` — four-phone geometry, 14-event stress, transitions, reverse-scroll/reduced motion and original-skin regressions

All five `assets/skins/golden-pagoda-garden/section-05/timeline-*.webp` files **already exist in the Section 4 base branch**, with identical blob SHAs to the source Section 5 branch. No image changes are made.

## Visual gate — not yet approved

- Compare Section 4→5 and 5→6 boundaries in 320×568, 360×740, 390×844 and 430×932.
- Verify 5/5 Royal WebP files load with HTTP 200 and no console errors.
- Check parchment tiling seams, the top crown/text clearance, side floral intrusion, the seal and lower Kanote ornament.
- Check reverse scrolling, reduced motion, global petals and 14-item long programme stress case.
- Check the original plain Testing-4 demo skin stays unchanged.
- Examine real iPhone Safari scroll and performance.
- **Do not merge to main or deploy to the original Testing-4 production website** before a user-approved visual review.

The ceremony and timeline details in the prototype are sample/demo data, not confirmed customer event information.
