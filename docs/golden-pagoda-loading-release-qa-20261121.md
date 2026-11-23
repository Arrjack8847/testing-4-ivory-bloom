# Golden Pagoda — Royal cover loading and lifecycle repair

Date: 2026-11-21 (UTC)
Repository: Arrjack8847/testing-4-golden-pagoda-garden
Source base: main @ f481e53392f87a9d41992f92adb7d66931c80900
Working branch: fix/royal-cover-loading-lifecycle-20261121
Scope: Royal skin only where specified, with one Section 1 controller cache-key bump.
Approved WebP assets, S01–S10 artwork geometry, camera choreography and timing were not changed.

## Root cause confirmed

The Personal Vercel production alias previously served an older source build,
a5fd14e6307184ab8b37bdce57480db807e152d7, that waited for all 16 Royal
WebPs before the hero could become ready. Current main had already improved that
to the three essential sky / palace-horizontal / arch images, with 13 optional
assets loaded afterward. The old production deployment therefore missed a
previously implemented loading improvement.

The Personal project has Vercel SSO protection enabled
(all_except_custom_domains). This work does not change its security settings.

## Source changes

- scene.js: add a 20-second bounded image-request timeout for the Royal skin;
  a hung core request cannot keep data-layers="loading" forever. Existing
  visible fallback continues to allow the Open Invitation button.
  The non-Royal source fallback behavior is unchanged.
- golden-pagoda-s08-s09-split-flutter.js: defer the six offscreen split-wing
  requests until S08/S09 approach within two viewports via IntersectionObserver;
  preserve the original assets, hinges, animations and no-IO fallback.
- section-couple-reference.js: stage the Section 3 Royal background probe and
  groom/bride portrait requests within two viewports, while retaining their
  original URLs, fallback, portrait frame and camera behavior.
- section-three.js: mark the existing Royal S04 paper image lazy.
- index.html: advance the Section 1 script URL query version to avoid stale
  script responses when an older deployment/HTTP cache is involved.
- tests: add bounded-timeout and asset-lifecycle checks; align two existing
  stale test fixtures with the already-approved 60fps S01 paint budget and
  existing bottom RSVP butterfly node.

## Verified evidence

Deployment: dpl_5SvkGQ9hgf9iBabvLqwfQbTbYCH6
Runtime SHA: 6f43cf73e801e8dc21236a472b290020e89732c8
URL: https://golden-pagoda-s01-s10-personal-preview-536spjux3-jack-3b3d.vercel.app/?skin=golden-pagoda-garden
Status: READY (Personal Vercel); preview access requires valid authorization/share token.

- Live HTTP: HTML, scene.js and all three core Royal WebPs each returned 200
  and the image responses had image/webp content types.
- Playwright actual-artwork smoke, Chromium headless shell 159.0.8154.6 on
  Vercel Sandbox / sin1: 4/4 emulated phone profiles PASS
  (320x568, 360x740, 390x844, 430x932). Three essential images decoded
  with positive naturalWidth at every size. No early S08/09 wing-part
  requests and no early Royal groom/bride portrait requests. Open, S03
  portrait prewarm, S08 enhancement and S09 enhancement all passed.
  No JavaScript page errors in these four runs.
- Failure-injection Playwright at 390x844: 2/2 PASS. When hang_1.webp is
  blocked, core remains ready and ornaments become partial. When
  palace-horizontal.webp is blocked, content shows an unavailable-art
  fallback while the Open Invitation button remains functional.
- Node source/mock checks for the changed and neighboring modules:
  14/14 PASS, executed against the locally staged source for the branch,
  including the post-preview test-only corrections.
- Tests were run in an isolated sandbox, not GitHub Actions and not Browser Use.

## Evidence boundaries

- Runtime deployment SHA 6f43... predates only test-file changes on the same
  working branch; all application JS/HTML/CSS remained identical for the
  four-phone and failure-injection browser tests.
- Emulated Chromium does not establish physical iPhone Safari or Telegram
  WebKit performance/memory stability; that gate is NOT_RUN.
- No true mobile-network waterfall, FCP/LCP/INP, device RSS, or real iPhone
  FPS benchmark has been measured. Do not claim a percentage speedup from
  unthrottled sandbox timings.
- Full project-wide test suite has not been executed; the relevant 14 tests
  and six hosted browser scenarios passed.
- 40 linked stylesheets and 24 deferred scripts remain and may be considered
  for a separately benchmarked bundling/critical-path project.
- Guest-facing production alias and SSO configuration must be verified
  separately after promotion.
