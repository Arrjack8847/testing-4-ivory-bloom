# Section 4 — Royal Ivory Parchment WebP test

- Asset from `art/section-04-royal-frame-20261114` commit `f070f69ca09ee6014970800158c1b4e979d5aa4b`.
- Imported blob `28fc1caad3f34ff6d56a82e97753eb2356e2fa01`: `s04-royal-background.webp`, 1080 × 1920, WebP, 310160 bytes, opaque.
- The already-approved transparent `s04-royal-frame.webp` remains untouched.
- Only the Royal `#eventSourcePaper` source switches from the previous embedded SVG composite to the user-provided WebP; the existing camera and scroll algorithms, CSS crop, 3× `border-image` frame slicing, card content and positions are not changed.
- The original Testing-4 skin must continue to use its existing original images, not this Royal WebP.
- The four-width Section 4 source regression file follows the new `paper.currentSrc` and `border-image` expectations.

## Checks and approval gate

Source check: dimensions/format and opaque artwork inspected. Only Section 4 Royal-skin image path modified, plus added asset and adjusted test assertions.

**Not a release:** physical iPhone Safari and Telegram checks, mobile four-width scroll QA, crown alignment, text contrast and painted-background cropping remain visual approval gates. Do not merge to main or replace production files.
