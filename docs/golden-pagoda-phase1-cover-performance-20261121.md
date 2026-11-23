# Golden Pagoda Garden — Phase 1 cover performance review
Date: 2026-11-21
Source branch: review/golden-pagoda-s01-s10-sequential-update-20261120
Pinned base commit: b2b1a64bdb4a0c56289c48220403e9dcae089ca6
Work branch: perf/golden-pagoda-phase1-cover-20261121
Status: review-only, not production verified

## AI-Development-Memory playbooks
- mobile-performance-debugging
- rendering-invalidation-optimization
- artwork-lifecycle-optimization
- browser-asset-cache-debugging
- sticky-camera-stability

## Source inspection / primary bottlenecks

1. The Royal cover formerly waited for all 16 WebP files before setting `data-layers="ready"`. A missing hanging leaf or peacock could set the whole scene to `unavailable`, despite successful loading of the sky/palace/gateway.
2. The shared global 26-particle petal field requested a full-canvas repaint on every display-refresh callback. On 120 Hz phones this can be more work than needed for gently drifting petals.
3. The scene controller already scopes scroll CSS variables to `#viewport`, avoids redundant writes, uses native sticky and maintains reverse scroll choreography. These previous optimizations were preserved, not rewritten.
4. The Royal skin uses local asset URLs; no vendor fallback is permitted. Vercel build success alone is not network or WebKit performance evidence.

## Scope of source changes

- `scene.js`: prioritize only three essential Royal assets (`sky.webp`, `palace-horizontal.webp`, `arch.webp`), with high fetch priority and core decode before first ready paint. Stage remaining 13 ornaments with at most 3 concurrent load operations. A decorative load failure produces `data-ornaments="partial"` but leaves `data-layers="ready"`; a core failure retains `unavailable` with visible text and button. Preserve default-skin fallback.
- `global-petals.js`: cap full canvas paints to approximately 30 fps without altering the 26-particle motion model, the three original uploaded WebP files, their sizes, transparency or drawing positions, reduced-motion handling or hidden-tab lifecycle.
- Source and four-phone QA tests added under `tests/golden-pagoda-phase1-cover.*`.

## Observable markers

- `#invitation[data-layers="ready"]`: all three core artwork files attached/decoded for Royal.
- `#invitation[data-ornaments="loading"]`: Royal cover visible; other decoration still loading.
- `#invitation[data-ornaments="complete"]`: all ornaments loaded.
- `#invitation[data-ornaments="partial"]`: one or more optional ornaments failed.
- `#invitation[data-layers="unavailable"]`: one or more core images failed. Existing readable text and button are retained.

## Executed in-chat source simulation (not browser/network profiling)

- Royal core success / priority / max in-flight: PASS
- Royal optional asset missing yet core visible: PASS
- Royal core asset missing goes to fallback: PASS
- Existing reference/default-skin four loader states: PASS
- Global petal paint scheduling at mock 60 Hz: 31 paint calls in simulated 1 s; PASS
- Global WebP drawing and hidden-tab cancellation: PASS (one final clear when hidden, then no further paints)
- Both modified JavaScript files compiled successfully with a JS parser/compiler.

## NOT_RUN / cannot yet claim

- Node source test suite on an actual checked-out private repo.
- Four-phone Playwright browser tests at 320x568, 360x740, 390x844 and 430x932; test files are authored, not executed.
- Live preview request waterfalls, transfer time, cache headers, FCP/LCP/INP/CLS, CPU/frame duration and native memory.
- Physical iPhone Safari/Telegram rendering, touch scrolling, reverse camera comparison and memory/Jetsam validation.
- Pixel parity for all sections. No main merge, GitHub Actions or Browser Use.

## Review and next gate

Run locally with a real checkout: 
`node --test tests/golden-pagoda-phase1-cover.test.cjs`
`npx playwright test tests/golden-pagoda-phase1-cover.spec.mjs`

If a preview is published, validate on the actual preview SHA before release and inspect optional ornaments loading under slow networking. Do not describe a faster first paint, lower native RSS or an iPhone crash fix without real measured evidence. Keep the approved WebP art, S1 typography, camera positions, transition curves, and non-Royal skins untouched. This branch should target its exact consolidated review base before a later production decision.
