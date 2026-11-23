# Phase 3 — Myanmar Royal Section 1 final polish (items 1–4)

**Branch:** `fix/royal-s01-final-motion-polish-20261122`  
**Starting source:** target `main` @ `19c49bb11d2944a5ac4eee544cce796c9d95e1c9` (includes #59 Royal loading fix, #60 CSS bundles and approved Section 3 additions)  
**Review:** Section 1 only, `?skin=golden-pagoda-garden`  
**Constraints:** No GitHub Actions, no Browser Use, no artwork edits, no changes to production `main`, no re-layout of Myanmar names.

## 1. Ivory-and-gold curtains: correct the image geometry

The original approved `assets/skins/golden-pagoda-garden/drape.webp` is **one transparent 1024×1536 artwork containing both left and right curtains**. It is not a standalone right curtain. Rotating the whole plate around the former `82% 3%` pivot moved the left attachment away from its top anchor.

The branch preserves the identical WebP bytes and creates **two render instances** of the same file on Royal only. Each instance displays its complementary left or right half; the full resulting composition remains visible, with no dropped source pixels and without editing, stretching, recoloring, retouching or mirroring the approved art. The left stays in layout flow to retain canopy height and the right is a full-size positioned overlay. The top anchors are visually estimated at `31% 0%` and `69% 0%` from the artwork's two upper floral attachment clusters.

Each curtain has its own 16.2s wind cycle and a one-second phase difference, with gust peaks around ±2.2–2.55°. CSS animation affects only the children; the original gateway and full canopy wrapper geometry are untouched. Render-only masks are used **only to split the composition for independent animation**; both halves together still present the complete approved image. An old-browser fallback renders the original full image without split motion.

These pivot estimates are based on inspecting the actual uploaded art, **not pixel-perfect runtime validation**.

## 2. A coherent living Royal Garden

The six Royal hanging sprites and six rooted plant sprites are loaded as before from untouched artwork. Previously, individually timed decorations could appear to follow unrelated wind rhythms. The new one-time Royal-specific setup uses:

- A common approximately 16-second breeze cycle with two visible swings and a stronger gust.
- Independent right-to-left phase offsets based on the existing sprite x positions and original amplitudes.
- A shared wave family with different displacement: hanging flowers ~±3.5–4.2° and gust peaks up to ~5°, rooted plants ~±1.9–2.7° with gentler gusts.
- Mirrored wrapper compensation so the physical left/right wind direction remains coherent even with reflected source instances.
- The same top and bottom pivots as approved and **no new JavaScript RAF loop**.

The leaves and peacocks remain still. The user-approved camera, palace and arch do not swing. Ambient hidden/offscreen and reduced-motion policies remain authoritative.

## 3. Cinematic open and early-swipe handoff

The currently approved `1050ms cubic-bezier(.22,.61,.36,1)` Royal opening transition already controls the sky, gateway, hanging sprites and foreground; Phase 3 adds the **curtain wrapper** to that same coordinated transition. The curtains therefore depart with the gilt arch instead of lingering 300ms longer.

The source's existing `70ms` frame-rate-independent scroll camera smoothing, touchstart/wheel immediate scroll mode, one-time opening and reversibility are retained. **No camera endpoints, sticky section heights, gateway positions or early-swipe semantics changed.**

## 4. Wedding-name readability and reading hold

The approved bilingual name reveal and fixed positions remain unchanged: first Myanmar name offset `-2px`, second `+6px`, full-word opacity scroll reveals, stationary text through the end of Section 1, and existing Section 2 overlay starting at 3.25 viewport heights. The 4.25H scene track and -1H overlap give 1.09H after the final copy completes around 2.16H.

No extra flowers, text masks, new fonts, change in name sizes, new scrims or animated letters are introduced. The scene stage remains behind the text overlay.

## Bundle/release correctness

The production `index.html` links only 4 CSS resources since PR #60. This branch updates `golden-pagoda-skin.css` **and** regenerates `styles-bundle-a.css` with the modified source in the original 15-file cascade order. The approved bilingual preview stays standalone for its `@import`. The 20s image-request timeout from merged PR #59 remains intact.

### Verification evidence

| Gate | State | Evidence |
| --- | --- | --- |
| Latest merged base includes PRs #59 and #60 | PASS (GitHub) | Starting main SHA above |
| Exact approved WebP binaries untouched | PASS (GitHub changed-file diff) | No `.webp` changes |
| Source syntax `scene.js` | PASS | V8 parse against current branch |
| Two curtains + separate anchors + common URL | PASS (source) | Cloning and byFile registration |
| Six hanging / six rooted wind families | PASS (source) | Original 16-asset Royal loader and scoped CSS |
| Curtain/gateway opening transition synchronized | PASS (source) | `1050ms` Royal selector including canopy |
| New 5 offline regression tests | PASS in isolated source harness (5/5) | Repo test `tests/royal-s01-final-polish.test.cjs` |
| Generated bundle source equality | PASS (source) | Exact new `golden-pagoda-skin.css` segment |
| Actual four-phone Playwright | NOT_RUN | Authenticated local checkout/browser was not available |
| Physical iPhone Safari/Telegram/60fps/memory | NOT_RUN | Requires device/runtime instrumentation |
| Hinge stability and text clearance in rendered frames | NOT_RUN | Verify at 320, 360, 390 and 430px |
| Live Vercel preview | PENDING at report creation | Preview will be appended to PR after deployment |

**Do not claim measured 60fps, exact pixel alignment or completed on-device QA from source tests alone.** The two image instances could add decoded-image memory; that is a specific phone-profiling consideration.

### QA commands for a full checkout

```bash
node --test tests/royal-s01-final-polish.test.cjs
node scripts/build-styles.cjs --check
npx playwright test tests/royal-s01-final-polish.spec.mjs --reporter=list
```

**Release recommendation:** review the Royal preview and complete the actual four-phone and iPhone rendering gates before merging into `main`. `main` and approved assets are untouched.
