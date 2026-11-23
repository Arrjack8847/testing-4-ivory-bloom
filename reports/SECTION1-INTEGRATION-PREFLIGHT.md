# Ivory Bloom — Section 1 guarded integration preflight

Checked on 2026-11-23 against `Arrjack8847/testing-4-ivory-bloom` main commit `f55ae2c81a167cc5c3007d7667377af72d6ec501`.

## Verified on GitHub

- All 20 agreed Section 1 WebP filenames exist across the two asset folders.
- WebP headers for all 20 match the Golden Pagoda Section 1 canvas dimensions.
- Header flags indicate alpha for 19 decorative files; the sky is an opaque background.
- All 20 image files rendered in the inspection viewer, but full file-decoding/alpha-opacity QA should run through Pillow before approving the build.
- The folder `assets/skins/ivory-bloom/` contains seven files. Static sites do not automatically serve this folder; explicit asset copying or resolver configuration is required.
- The repository is **PUBLIC** as checked on 2026-11-23; the original Golden Pagoda repository is private.
- Ivory Bloom currently contains artwork and README, not the invitation application.

## Blockers and safe integration sequence

1. Change Ivory Bloom repository visibility from public to private using GitHub repository Settings → Danger Zone → Change repository visibility.
2. Recheck visibility before importing any private engine source code. This preflight deliberately performs no source import.
3. Reuse Golden Pagoda Section 1 engine files with the same camera, scroll choreography, drape anchors, and butterfly motion. Do not edit Golden Pagoda's protected branch.
4. Configure the `ivory-bloom` skin so all 20 approved artworks resolve locally; do not fall back to remote provider art.
5. Validate files locally: `python3 scripts/check_section1_assets.py --json` (requires Pillow).
6. Independently run four mobile viewport visual comparisons, opening, scrolling, reduced motion, and overflow checks before a preview deployment.
7. Do not merge or deploy until source exposure and image usage rights have been verified.

No CI/GitHub Actions, deployment, or changes to existing artwork are performed by this preflight branch.
