# Ivory Bloom — Section 1 asset snapshot

Snapshot: 2026-11-23, from Ivory Bloom `main` commit `f55ae2c81a167cc5c3007d7667377af72d6ec501`.

**Privacy warning:** repository was PUBLIC on check. No private source should be imported until its visibility is PRIVATE.

## Inventory

20/20 files present. Exact dimensions were independently checked from the WebP headers; successful full image decoding in a Pillow-powered checkout is still pending.

| Filename | Verified canvas | Current source | Git blob SHA |
|---|---|---|---|
| `sky.webp` | 1080 × 1920 | `public/assets/ivory-bloom/sky.webp` | `2ae035938dbd62ebda1ecd74d7536baa8e5ef05f` |
| `palace-horizontal.webp` | 1448 × 1086 | `public/assets/ivory-bloom/palace-horizontal.webp` | `377d3abfc95fe8e14c901feb116da8f98a58a7e1` |
| `arch.webp` | 941 × 1672 | `assets/skins/ivory-bloom/arch.webp` | `3950d0a1b8a6e7bafd438b65ac0f5e7e5b390ac9` |
| `drape.webp` | 1024 × 1536 | `public/assets/ivory-bloom/drape.webp` | `89b7bcdf6f3a7a0f7d09c988a0c95c10d40c538d` |
| `hang_1.webp` | 1024 × 1536 | `public/assets/ivory-bloom/hang_1.webp` | `891d231fcf82620a08819b431010d13796830502` |
| `hang_3.webp` | 1024 × 1536 | `public/assets/ivory-bloom/hang_3.webp` | `e8a3d087ae97c8838ad5cd27b529b9d4d7162055` |
| `hang_4.webp` | 1024 × 1536 | `public/assets/ivory-bloom/hang_4.webp` | `0f37ac5753b0911df2b534a84c7943113b7132c8` |
| `peacock.webp` | 1024 × 1536 | `public/assets/ivory-bloom/peacock.webp` | `1cefc20bb1a3bc40fabcdd1577067642ad7560df` |
| `spike_3.webp` | 768 × 1536 | `public/assets/ivory-bloom/spike_3.webp` | `48f823a1540929736c2785946ea7bf85cb163973` |
| `spike_4.webp` | 768 × 1536 | `assets/skins/ivory-bloom/spike_4.webp` | `b1069772255af6216ebfca1aa1bef98406f8276b` |
| `spike_5.webp` | 768 × 1536 | `assets/skins/ivory-bloom/spike_5.webp` | `3e7c69d7b96989e119886101d0c7e30fbb73e703` |
| `stem_1.webp` | 768 × 1536 | `assets/skins/ivory-bloom/stem_1.webp` | `960849b5b3d4c0d60406f8b9e1e530e3a832811c` |
| `stem_2.webp` | 768 × 1536 | `assets/skins/ivory-bloom/stem_2.webp` | `497b641774ac983a5f09a170d2eb55e9ef60f647` |
| `leaf_4.webp` | 1536 × 1024 | `assets/skins/ivory-bloom/leaf_4.webp` | `caf7054413f37e790dfb39f960bc04bce9be15cf` |
| `leaf_5.webp` | 1536 × 1024 | `public/assets/ivory-bloom/leaf_5.webp` | `9603bc12f00d8ddc399a9395ada4d7cf6388d984` |
| `leaf_6.webp` | 1536 × 1024 | `public/assets/ivory-bloom/leaf_6.webp` | `161fdc8004e07962f4805763cf64d9a13df41b48` |
| `bfly_1.webp` | 312 × 246 | `public/assets/ivory-bloom/bfly_1.webp` | `08ae406a5f5fc7bf035f05bb141a1cf6c6691e76` |
| `bfly_white.webp` | 312 × 246 | `public/assets/ivory-bloom/bfly_white.webp` | `e5bff72f7b7bec3009a43d855c6ea66b45b6021e` |
| `royal-name-divider.webp` | 690 × 36 | `public/assets/ivory-bloom/royal-name-divider.webp` | `6a859c92625a47d00d2c3a0fa0d3b7f7d505b0e6` |
| `royal-open-button.webp` | 663 × 147 | `assets/skins/ivory-bloom/royal-open-button.webp` | `5157cb89382a1fb72a1f7f3a9f35a16e68248e8e` |

## Integration requirements

- Preserve all original WebP bytes; do not change crop, aspect, alignment, color, or alpha.
- Source folders are split 13 public + 7 assets/skins. Use `node scripts/prepare-section1-assets.mjs` to stage 20 assets into `dist/assets/ivory-bloom` without resampling; its SHA-256 manifest detects changes.
- The static website does **not** exist in this repository yet; an asset directory is not a complete preview.
- Reuse protected Golden Pagoda Section 1 engine only after repository privacy has been changed and confirmed. Keep Golden main untouched.
- Visual checks still required for canopy transparency artifacts, floral gateway edge halos, 320/375/390/430px viewports, two-piece butterfly wings, center-copy clearance, reverse scroll, keyboard focus, and reduced motion.
- Do not deploy or merge solely based on asset inventory.
