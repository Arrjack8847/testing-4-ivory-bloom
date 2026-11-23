# Golden Pagoda Garden — Phase 3 release verification (2026-11-21)

## Source and environment

- Application: `Arrjack8847/testing-4-golden-pagoda-garden`, Royal skin `?skin=golden-pagoda-garden`.
- Comparison source: S01–S10 PR #50 SHA `b2b1a64bdb4a0c56289c48220403e9dcae089ca6`.
- Phase 1: PR #51 SHA `a2dc8ff9ff2f5a3595557b1fdfb80f9c472d70f1`.
- Phase 2: PR #52 SHA `8eea9679294acca3a9a45402febf9753ce9707b0`.
- Exact Phase 2 Vercel preview: `https://golden-pagoda-s01-s10-personal-preview-5lv8sats7-jack-3b3d.vercel.app/?skin=golden-pagoda-garden`
- Personal Vercel deployment: `dpl_2htwJWLDP1emHBnSEq1ikL3Xfp9Y`, READY and tagged with exact Phase 2 SHA.
- This Phase 3 branch is stacked on Phase 2, not on production `main`.

## Completed verification (source/API inspection)

| Gate | Result | Evidence / limits |
| --- | --- | --- |
| Git source consistency | PASS | PRs #50, #51, #52 remain open draft; head and base SHAs match the stacked chain; `main` separate |
| Vercel deployment state | PASS | Vercel READY on the exact Phase 2 SHA; does not prove rendering or network speed |
| Artwork immutability | PASS | Compared 118 Royal `.webp`, `.svg`, `.png` paths and blob SHAs across S01–S10 review, Phase 1 and Phase 2; **zero art changes** |
| Asset existence | PASS | Git tree complete; all 16 cover layers, 5 Royal Gallery images, 6 split-wing parts and 3 petal source WebPs present |
| CSS artwork references | PASS | 22 Royal CSS files inspected, 51 static relative asset URLs; **zero missing paths** |
| HTML links | PASS | 37 local stylesheet references and 22 deferred script references exist (query strings stripped) |
| JS source compilation | PASS on inspected files | `scene.js`, `global-petals.js`, Royal adapters, gallery and couple loaders; portable offline test authored for all root JS |
| Core/optional image handling | PASS (isolated source simulation) | 3 essential images prioritized, optional ornament failure does not blank cover |
| Petal frame budget | PASS (isolated source simulation) | Mock 60 Hz loop painted 31 frames in 1s; hidden-tab stop simulated; not a real FPS trace |
| Royal butterfly gate | PASS (isolated source simulation) | 0 Royal image requests on other skin, 6 on Royal, bottom RSVP pair created |
| S01→S02 layout contract | PASS (static CSS/source) | Royal 425lvh track with −100lvh overlap; S02 enters at 3.25H |
| Royal S07 DOM order | PASS (static source) | Groom, Bride, Together, Garden, Lake; original photo files remain unmodified |

## Release blockers (not implicitly passed)

| Gate | Result | Action needed |
| --- | --- | --- |
| Full Node suite | NOT_RUN | Requires the actual private source checkout with image bytes; authored `tests/golden-pagoda-phase3-release.test.cjs` |
| Four-phone Playwright — isolated fixture | PASS (36/36) | Executed 9 tests × 4 profiles in remote Chromium on exact Phase 3 application source with stand-in image responses; **not** a live-image visual or native iPhone pass |
| Device screenshots / synchronized reference | NOT_RUN | Compare 320×568, 360×740, 390×844, 430×932 at matching animation checkpoints |
| Physical iPhone Safari/WebKit | BLOCKED | No connected physical device or Jetsam/WebContent diagnostics; Chromium simulation would not prove iOS stability |
| Preview HTTP / Vitals | BLOCKED | Vercel READY verified, but preview URL inaccessible through available external HTTP tools; no waterfall, FCP, LCP, INP, CLS, GPU/RSS, FPS claims |
| RSVP submission | FAIL for production | Royal `section-nine.js` explicitly creates **preview text only**, and does not send/save submissions. Must integrate approved service/storage if clients need real RSVPs |
| Share/brand metadata | NEEDS WORK | `index.html` still defaults to `Celestial Lake — Mobile Invitation`, and a share without `?skin=golden-pagoda-garden` serves the source reference |
| Artwork rights | NOT VERIFIED | Git hashes preserve files but cannot certify commercial source rights |
| Production merge | NOT_READY | Do not merge stack into `main` while above acceptance gates remain unresolved |

## Replay commands (four-phone browser suite executed in a temporary remote fixture; full local Node suite not executed)

```bash
node --test tests/golden-pagoda-phase1-cover.test.cjs tests/golden-pagoda-phase2-motion-ui.test.cjs tests/golden-pagoda-phase3-release.test.cjs
npx playwright test tests/golden-pagoda-phase1-cover.spec.mjs tests/golden-pagoda-phase2-motion-ui.spec.mjs tests/golden-pagoda-phase3-mobile.spec.mjs
GOLDEN_PAGODA_APPROVED_SHA=8eea9679294acca3a9a45402febf9753ce9707b0 npx playwright test tests/golden-pagoda-s07.spec.mjs
```

Playwright project settings define small-phone 320×568, android-360 360×740, iphone-390 390×844, large-phone 430×932. These are browser emulations, **not** physical phones. Use no GitHub Actions or Browser Use. Preserve images, motion, scroll pacing, and textual source.

## Release decision

**NO-GO for commercial production at this checkpoint.** Source and asset QA pass, but real phone rendering and performance are unverified, and the Royal RSVP is not an operational form. Keep PRs #50–#52 and this QA PR in review. If a customer wants a visual-only demo instead of real RSVP, label it clearly and configure a customer-safe branded entry URL after final visual approval.

## Four-phone Playwright execution — isolated remote fixture (2026-11-21)

The full three-suite Playwright matrix was **actually executed**, not inferred from code inspection. A temporary Vercel Sandbox was provisioned on the user's Personal account in `sin1` (2 vCPU, 4 GiB RAM), running Node 24, `@playwright/test` **1.65.1**, and Chromium headless shell **159.0.8154.6**. The exact Phase 3 site CSS, JS, and HTML were transferred from GitHub source SHA `e4fa4848267f0f696b1e768071b9159021854ba9`. It used a local isolated HTTP server at `127.0.0.1:8000` and substituted neutral `.webp`, `.svg`, and `.png` responses for unavailable private artwork; no source artwork or production deployment was modified.

The Vercel Phase 3 preview was **not** the browser test target: direct access redirects to Vercel SSO, and the sandbox had no accepted authentication. Project-wide SSO protection was never disabled. A short-lived deployment-specific share link was generated and then revoked without use for testing; no share link was committed or logged.

| Emulated profile | Phase 1 cover | Phase 2 motion/UI | Phase 3 guest journey | Total |
| --- | ---: | ---: | ---: | ---: |
| 320×568 | 3/3 | 3/3 | 3/3 | **9/9 PASS** |
| 360×740 | 3/3 | 3/3 | 3/3 | **9/9 PASS** |
| 390×844 | 3/3 | 3/3 | 3/3 | **9/9 PASS** |
| 430×932 | 3/3 | 3/3 | 3/3 | **9/9 PASS** |
| **Total** | **12/12** | **12/12** | **12/12** | **36/36 PASS** |

Command executed in temporary sandbox (working directory with exact checked-out source files but stubbed artwork):

```bash
npx playwright test \
  tests/golden-pagoda-phase1-cover.spec.mjs \
  tests/golden-pagoda-phase2-motion-ui.spec.mjs \
  tests/golden-pagoda-phase3-mobile.spec.mjs \
  --workers=2 --reporter=list
```

Final result: **exit code 0, 36 passed (1.2m)**. The initial full run had 33 passes and 3 identical S07 geometry failures (320, 360, 430px), because a staggered reveal was still translating the groom/bride cards when the bounding boxes were inspected. The test was corrected to `expect.poll` the actual final alignment (no sleep, no weakened threshold), then the focused four-phone S07 test passed 4/4 and the entire suite passed 36/36. The correction is committed to `tests/golden-pagoda-phase2-motion-ui.spec.mjs` on this Phase 3 QA branch.

### Strict interpretation

**PASS:** Chromium source-level layout contracts, image failure recovery, non-scrollable cover, S01/S02 reverse handoff, interactive gallery order, RSVP split-wing activation, accessibility and reduced-motion behavior, across four device-emulated viewports.

**STILL NOT VERIFIED:** Actual approved artwork rendering/faces, file download/decode performance, pixel parity, native iOS/WebKit, real-world FPS/memory/crash behavior, commercial artwork rights and live RSVP submissions. The original Phase 3 **production NO-GO** decision stands.
