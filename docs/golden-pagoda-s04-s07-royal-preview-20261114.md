# Sections 4–7 Royal preview — Section 7 gallery integration

**Base commit:** `6a4d821a6bf38cff2c6f332ce38018be78bf7bfb` — review-only Sections 4, 5 and 6, not production.
**S07 worker source:** `feature/golden-pagoda-s07` at `6b767313dbe24b41fcacc0dc7b625d5bd0d46c9b`.
**Review branch:** `test/golden-pagoda-s04-s07-royal-review-20261114`.

## Scope
- Register Royal S07 CSS immediately after `section-five.css` and JS after `section-five.js` in the existing HTML head. The five-frame markup and dialog HTML remain byte-identical.
- Reuse worker `golden-pagoda-s07.css` / `golden-pagoda-s07.js`: Royal-only quiet parchment, gold portrait frames, two side florals, deferred image activation and disable duplicate heavy scene art.
- Preserve the existing `section-five.js` for local photo loading, disabled placeholders, native accessible dialog, keyboard arrows/Escape, swipe, focus return and missing images. No edits to photos, captions or user data.
- The four independent source artworks already exist at `assets/skins/golden-pagoda-garden/section-07/`: `gallery-paper.webp` 1024×1024 opaque, `photo-frame.webp` 800×1100 alpha, `gallery-floral-left.webp` and `gallery-floral-right.webp` 540×950 alpha. All original source blob SHAs are retained.
- Existing reference/sample images are used ONLY when the URL explicitly includes `galleryReference=1` for private visual review. Regular Royal preview must continue waiting for customer photographs.
- Adapt the S07 worker tests to use the actual integrated CSS and JS, with no redundant style/script injections. Tests retain their approved-asset SHA gate.

## QA and approval gates
- Four-phone visual QA at 320×568, 360×740, 390×844, 430×932; inspect photo frame cropping, transparent corner masks, gold floral overlap, paper discontinuity and Section 6→7 and 7→8 transitions.
- Verify 5 photo frames, five demo/local reference photos only in explicitly authorized comparison mode, dialog opening/closing, ArrowLeft/ArrowRight/Escape and focus restoration.
- Test reverse scroll, Reduced Motion, default non-Royal skin, and monitor renderer/GPU memory and image decoding on an iPhone.
- Do not interpret static asset check or successful Vercel file loads as four-phone runtime QA.
- The final 47-asset approval and copyright/use rights for third-party reference photos remain release gates. This is a **review only** branch; do not merge to `main`, PR #13 or production.
