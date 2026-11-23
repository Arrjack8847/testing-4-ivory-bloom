# Royal invitation — CSS critical-path consolidation

Date: 2026-11-21
Repository: Arrjack8847/testing-4-golden-pagoda-garden
Base: main @ 29649e3fe532578a4d42569c6a6c19b402a33e13
Branch: perf/royal-stylesheet-critical-path-20261121
Preview deployment: dpl_7sztNRqYb7JGYt8CVteEuDPq3U5S
Preview source: aab088d12fca036d85fae5c480df5a79e6196139

## Engineering reason

The first screen previously contained **39 local CSS link requests** (plus the Google
Fonts link) and **24 deferred script tags**. All 39 CSS files applied to the
whole invitation before first paint, even though most rules concern later
sections. The 39 individual files total approximately 405,844 uncompressed
bytes; HTTP header/connection savings were suspected but not measured.

## What changed

- Stylesheet tags reduced from 39 to **four local links**, retaining the
  original cascade order. Original source stylesheets stay present and editable.
- Added styles-bundle-a.css (15 unchanged source files in original order),
  styles-bundle-b.css (14 sources), and styles-bundle-c.css (9 sources).
- Left golden-pagoda-s01-bilingual-preview.css separate, at its original
  cascade position: its @import for Noto Serif Myanmar must remain valid.
  Concatenating it after declarations would silently break the import.
- No changes to any approved WebP, typography values, CSS declaration,
  JavaScript runtime file, animation keyframe, timing, layout or source URL.
- Deterministic maintenance: node scripts/build-styles.cjs regenerates the
  three generated files after any CSS edit. Run
  node scripts/build-styles.cjs --check before shipping.
- Added tests/royal-css-bundles.test.cjs checking exact source equivalence,
  link ordering, Myanmar import and 24 deferred scripts.

## Verification and limits

PASS: all three bundle byte-for-byte source equivalence and order checks
executed with Node on an isolated Vercel Sandbox against the published
preview; 3/3 corresponding tests PASS.
PASS: preview deployment reached READY on the exact source SHA.
PASS: an isolated Chromium diagnostic opened the candidate preview at
390x844; main Royal cover data-layers became ready, 5 total head stylesheet
links (the four local links plus the existing external font link), no
JavaScript page errors in that diagnostic.
BLOCKED: repeated A/B browser rendering parity across four phone profiles;
Vercel temporary shared-preview auth repeatedly redirected fresh isolated
browser contexts to the SSO login, despite successful one-off preview renders
and authenticated live-file fetches.
NOT_RUN: physical iPhone Safari/Telegram, FCP/LCP field data,
throttled mobile-network request waterfall or renderer RSS. Do not claim
measured speedup, 60fps, real iPhone stability or perfect screenshot parity.
UNCHANGED: project SSO protection, guest access controls, all 24 JS scripts,
all artwork, Sections 1–10 camera and animation behavior.

## Follow-up after production integration

Verify production HTML contains four local stylesheet links and that the
three bundles, Myanmar stylesheet, core WebP assets and scene.js return 200.
Use the existing four-phone browser test suite and physical iPhone in a
separate device-validation release gate, and rerun the bundle generator
whenever any original CSS source changes. Do not turn on GitHub Actions.
