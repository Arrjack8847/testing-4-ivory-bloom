# Golden Pagoda Garden — sequential Sections 1–10 review
Date: 2026-11-20
Repository: Arrjack8847/testing-4-golden-pagoda-garden
Base: PR #49, commit 2edecfb
Review branch: review/golden-pagoda-s01-s10-sequential-update-20261120

## Review scope and findings

| Section | Verified against GitHub review source | Result of this pass |
|---|---|---|
| 01 — Royal Cover | Bilingual names, opening script, sky/palace/arch source assets | Source check PASS; approved artwork untouched |
| 02 — Royal Message | No four corner overlays, Myanmar message, full existing parchment and closing ornament | Source check PASS; no artwork changes |
| 03 — Royal Couple | Approved portraits, ring crest and no left/right floral edges | Source check PASS; no artwork changes |
| 04 — Royal Events | Approved royal background, frame and countdown dividers present | Source check PASS; no artwork changes |
| 05 — Royal Timeline | Existing six-step event sequence and ornate timeline paper/seal available | Source check PASS; no artwork changes |
| 06 — Royal Dress Code | Original paper, floral and top/bottom artwork and royal wording registered | Source check PASS; no artwork changes |
| 07 — Royal Gallery | Five original approved portrait files wired to gallery and native dialog | Source check PASS; wiring carried from PR #49 |
| 08 — Royal Wedding Gift | Uploaded royal butterfly image, gold frame and paper present | Source check PASS; fixed dependency on legacy butterfly reference load (royal skin only) |
| 09 — Royal RSVP | Two approved butterfly flight paths, shaped SVG parchment frame, native text fields, preview-only submission disclosure | Source check PASS; protected layout left intact |
| 10 — Royal Closing | Royal finale frame/scenery, ceremony wording, contact controls | Source check PASS; approved artwork untouched |

## Regression checks

All 10 individual section checks passed, executed without GitHub Actions:
- `tests/royal-section-sequential-01-03.test.cjs` — 3/3
- `tests/royal-section-sequential-04-07.test.cjs` — 4/4
- `tests/royal-section-sequential-08-10.test.cjs` — 3/3

This is **static/source QA**, not a claim of verified rendering on an iPhone.

## Shared global decoration status

The continuous 26-particle, reduced-density canvas now uses the three files uploaded in `bb506d05`, copied from GitHub unchanged, with exact original Git blob hashes:

- `assets/skins/golden-pagoda-garden/shared/petals/s00-lotus-petal-pink-flat.webp` — `d5368bea610e3ffd40960a5365d026b7e632b6e3`, 1254×1254 opaque WebP; white matte visually blended via the royal canvas `mix-blend-mode:multiply`.
- `assets/skins/golden-pagoda-garden/shared/petals/s00-lotus-petal-pink-curled.webp` — `7c2729bec6933c45be6e13d7c4e217eca43a03d8`, 1254×1254 WebP with alpha.
- `assets/skins/golden-pagoda-garden/shared/petals/s00-lotus-petal-ivory.webp` — `1ac03092ba97068241b48841ef48830564b96b36`, 1254×1254 WebP with alpha.

These are **lotus** variations; the actual uploaded ivory variant is **not jasmine**. The originals were not resized, recolored, re-encoded, or retouched. The flat white image is visually blended at the canvas level, without editing its bytes. The previous 256×256 planned filenames are no longer referenced. The canvas-drawn fallback remains available when image decoding fails. Full iPhone screenshot QA remains outstanding.

## Release blockers and restrictions

- Vercel deployment limit: latest attempt failed with 402 `api-deployments-free-per-day`. There is no new READY deployment for this review branch.
- Real mobile visual/interaction QA pending: iPhone widths 320/360/390/430, opening sticky names, ornament margins, photo crops, Section 8 butterfly blending, Section 9 RSVP fields and global petal visibility.
- Uploaded S08/S09 butterflies use opaque-white WebPs, blended via CSS multiply over parchment; individual wing flaps are not possible without separate-wing assets.
- No production main updates or merges. No GitHub Actions. No Browser Use.
