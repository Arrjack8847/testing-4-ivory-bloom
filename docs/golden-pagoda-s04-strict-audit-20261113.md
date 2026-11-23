# Section 4 — Royal Events, strict original-slot artwork adaptation

**Date:** 2026-11-13  
**Source repository:** `Arrjack8847/testing-4-golden-pagoda-garden`  
**Branch:** `test/golden-pagoda-s04-strict-20261113`  
**Base SHA:** `cbd61a15474518e005ba32707ea1720b09331c8c` (S02 isolated test, retaining approved S03 corrections).  
**Target:** `?skin=golden-pagoda-garden`, `#eventDetails`.

## Original source of truth, not unused slots

In the actual Testing-4 source, the **fourth visible section** is Events in `section-three.css` and `section-three.js`. `section-four.css` defines a different, dormant Save-the-Date scene; it is not the fourth active source section. The worker draft `feature/golden-pagoda-s04` changed card geometry and hid the original moving paper and petals; it must not be merged into this strict replacement.

Source-measured 390×844 geometry:
- `.event-section` min-height **1581px**.
- `.event-body` padding **120px 26px 56px**, maximum width **390px**.
- `.event-shared-arch` min-height **1164px**; inset **6px**.
- Nikah card min-height **516.5px**, Reception **617.1px**, gap **30px**.
- Active border-image uses **200px / 28px / 26px** slices with `fill`. Fine inset gold outline stays **7px**.
- `.event-source-paper` is an actively loaded `<img>` inside `.event-stage`; it inherits the original **-190px** top offset, 380px oversized painting plane, object-fit **cover**, and paper-shift camera transform.
- The narrower source has responsive body-height minimums: approx **1742px** at 320px, **1650px** at 360px, **1581px** at 390px and 430px (CSS-derived; rendered measurements not yet run).
- Original 2-event cards, countdown, responsive text, calendar links, Maps, Waze, floating petals and original reduced-motion rules remain.

## All four source Royal assets inspected

| Input WebP | Actual canvas | Alpha flag | Processed destination |
| --- | --- | --- | --- |
| `event-paper-top.webp` | 1080×500 | opaque | `s04-strict-paper-composite.svg`: upper vignette fading into ivory center |
| `event-paper-bottom.webp` | 1080×500 | opaque | Same `s04-strict-paper-composite.svg`: non-repeating lower floral ending |
| `event-arch.webp` | 1080×550 | alpha | `s04-strict-arch-border.svg`: masked Kanote top edge inside 200px border-image top slice |
| `event-corner.webp` | 480×480 | alpha | Same `s04-strict-arch-border.svg`: two soft-masked mirrored floral corners inside original card border-image |

The WebP image headers were read from GitHub and original images independently viewed. The two arch/corner source images show **unwanted rectangular backing areas and edge remnants**, so copying them into positioned CSS layers would violate the approved Section 3 method. The processed SVG uses geometric soft masks as an isolated candidate, **not** a claim of perfect alpha recovery. Pixel-level alpha bounding boxes remain NOT_RUN.

**Original source assets remain in their exact original paths and blobs; no deletion or replacement.**

## Why there are exactly two runtime composite surfaces

1. **Paper:** The original moving `img#eventSourcePaper` now loads the locally processed `s04-strict-paper-composite.svg`. Its existing camera algorithm, transform, cropping and section height remain untouched.
2. **Cards:** The original `.event-reference-card::before` border-image now reads `s04-strict-arch-border.svg` using its unchanged `200 28 26 fill` slices. Both ceremony cards reuse the same border-image surface; no new elements, ornaments or animations are created.

The only original JavaScript edit is a **skin-conditional artwork-loading switch** in `section-three.js`, to select the new SVG for Royal skin and avoid unnecessary third-party source-art probes. Countdown, camera, scroll listeners, reveal effects, and event data are byte-identical to the base branch. `index.html` adds one stylesheet link. The new stylesheet contains only skin-scoped painting and color rules.

## Exact available evidence and gates

| Test / evidence | Status | Reason |
| --- | --- | --- |
| Four original WebPs exist, correctly encoded | **PASS** | GitHub RIFF headers and original visual inspection |
| Original source dimensions, original slot geometry documented | **PASS** | Direct source CSS/HTML/JS audit |
| Existing Section 1–3 source protected, no original WebPs modified | **PASS** | Compare against branch base; only S04 loader/CSS/composites/test |
| Isolated branch staging preview | **PASS** | Deployment `dpl_4FfpEyQfuRtHh2f91dzSjnFjztX1` READY at exact SHA `4ef2ba9fc8a10014f15d61475261b96cc8bf54a2` |
| Staging HTTP files fetched | **PASS** | HTML, section JS, royal CSS, two composite SVGs and both problem sources returned 200 |
| Actual image decoding in Safari/Chromium | **NOT_RUN** | Browser runtime was not invoked |
| 320×568 rendered section geometry and overlap | **NOT_RUN** | Focused Playwright spec authored, not executed |
| 360×740 rendered section geometry and overlap | **NOT_RUN** | Same |
| 390×844 rendered section geometry and overlap | **NOT_RUN** | Same |
| 430×932 rendered section geometry and overlap | **NOT_RUN** | Same |
| Forward and reverse scroll camera | **NOT_RUN** | Original algorithm untouched; runtime regression still needed |
| Countdown/Map/Waze/Calendar click behavior | **NOT_RUN** | Original implementation retained, real interactions not exercised |
| Pixel-level rendered comparison against original | **NOT_RUN** | Original and Royal screenshots not collected in same state |
| Alpha-edge/backing and mask quality | **BLOCKED** | Real rendered screenshots must establish whether candidate masks are sufficient |
| Physical iPhone Safari/Telegram acceptance | **BLOCKED** | No physical device evidence in this session |
| Main merge / release | **NOT_RUN** | Explicitly prohibited until approval |

## Preview and next action

- Source branch: `test/golden-pagoda-s04-strict-20261113`.
- Staging URL: `https://golden-pagoda-s03-strict-full-preview-nmm3am6af.vercel.app/?skin=golden-pagoda-garden`. This uses an existing **test hosting project**, not the Testing-4 production project.
- Required artifact next: four viewport screenshots at same scroll checkpoints, comparison against default Testing-4 Events, iPhone reverse-scroll footage/screenshots, record masks and typography defects, then smallest artwork-side corrections.
- Never classify static CSS measurements, HTTP 200, or staging READY as actual visual QA PASS.

**Release:** HOLD. No merge, no production promotion.

## Superseding test evidence — cloud Chromium, 13 November 2026

**Update to the pre-execution matrix above:** the following completed checks supersede earlier NOT_RUN rows. Headless Playwright Chromium 1.56.1 was executed inside an isolated, ephemeral Vercel Sandbox, not Browser Use and not GitHub Actions. The browser environment was Ubuntu, **not actual iPhone Safari**. Test project was completely separate from the protected Testing-4 production deployment.

**First four-width run, exact source SHA `4ef2ba9fc8a10014f15d61475261b96cc8bf54a2`** (Vercel Sandbox command `cmd_0fc417a802844bb9abe6b046510c`, exit code 0):

| Profile | Royal section height | Original skin height parity | Card width | Paper | Border source / original slices | Horizontal overflow | Reverse camera | Reduced motion | JS errors |
| --- | ---: | --- | ---: | --- | --- | ---: | --- | --- | ---: |
| 320×568 | 1742px | PASS | 270px | PASS (1080×1920) | PASS (200 28 26 fill) | 0 | PASS | PASS | 0 |
| 360×740 | 1650px | PASS | 296px | PASS | PASS | 0 | PASS | PASS | 0 |
| 390×844 | 1581px | PASS | 326px | PASS | PASS | 0 | PASS | PASS | 0 |
| 430×932 | 1581px | PASS | 326px | PASS | PASS | 0 | PASS | PASS | 0 |

At all four sizes, the rendered section used identical height, card width, body padding and arch geometry as the default Testing-4 skin. Existing scroll-driven paper-shift returned to its initial value after a reverse scroll, and Reduced Motion disabled the image transform while preserving readable content. The embedded paper and border SVGs were successfully loaded; original section's four map/calendar anchors stayed in the DOM. These checks are **real browser source/geometry evidence**; they do not constitute final artistic visual parity.

**Second run after initial artwork-request gate fix, source SHA `a96f584ef21054fdaf4a48d277f4e3b42e2f0c0d`** (Vercel Sandbox command `cmd_1d1c016118fb4209bcfbb75bc534`, exit code 0): 320, 360, 390px confirmed Royal paper/arch resources loaded, original heights, no horizontal overflow, zero page errors, and heading opacity reached **1.0 when actually scrolled into view**. At 430px, the *test harness* timed out attempting to use Playwright's stability-waiting `locator.scrollIntoViewIfNeeded()` on an animating element. The old four-width run already passed 430 geometry and reverse scrolling, but the new build's 430 heading-specific retest is **NOT_RUN/INCONCLUSIVE**, not a confirmed application failure.

The initial vendor request counter also included the temporary Vercel share-link bootstrap on **default skin**, contaminating the Royal-only count. A skin-first loading gate was committed in `index.html`, changing only the *pre-script* S04 `data-art` value to `pending`; `section-three.js` still explicitly sets `data-art=reference` for all skins after initialization. A follow-up filtered-request run finished successfully but its ephemeral sandbox expired before the logs could be retrieved. Therefore do **not** claim zero Royal vendor requests as proven; mark that gate **INCONCLUSIVE**.

**Current verified deployment:** staging deployment `dpl_6wnHmoumVGxvJ2E57Qf5HHtQf4Ai` READY, immutable URL `https://golden-pagoda-s03-strict-full-preview-mn5euted3.vercel.app/?skin=golden-pagoda-garden`, deployed code SHA `a96f584ef21054fdaf4a48d277f4e3b42e2f0c0d`. A temporary Vercel share link is required for SSO.

**Gates still open:** pixel-level visual comparison, actual alpha-edge backing/crop inspection, complete updated 430px heading case, Royal-only network proof, physical iPhone Safari/Telegram scroll, and user design approval. The captured full-size browser screenshots were saved in an ephemeral QA sandbox, but could not be transferred in a way that permits reliable independent visual inspection here. Do **not** mark visual acceptance PASS. No production merge/deployment.
