# Section 4 — Refined Royal Crown + Elegant Single Border

Review branch: `fix/golden-pagoda-s04-refined-crown-single-border-20261113`

## Design choices (approved in discussion)
- B — Refined Royal Crown
- B — Elegant Single Border
- Preserve original Testing-4 source slots, HTML, live text, camera movement, petals, maps/calendar links, and responsive section geometry.
- No production merge or release without mobile review.

## Assets actually used
Original WebP quartet remains unchanged at `assets/skins/golden-pagoda-garden/section-04/`.
Intact review candidates from `recreated-20261113/` are embedded inside two original rendering surfaces:
- `event-arch (1).webp` 1080×550: cropped and scaled into the crown band to remove pillar dominance.
- `event-corner (1).webp` 480×480: small paired floral details, crop excludes much of tall spire.
- `event-paper-top (1).webp` 1080×500: washed-out upper parchment background, not a competing second border.
- `event-paper-bottom (1).webp` 1080×500: subdued, faded lower paper ending.

Outputs:
- `s04-strict-arch-border.svg`: same 326×617 border-image source and unchanged `200 28 26 fill` slice; gold single edge and smaller crown.
- `s04-strict-paper-composite.svg`: same 1080×1920 moving image slot; blended ivory background.
- `golden-pagoda-s04-strict-preview.css`: removes duplicate inner outline visually, without geometry or animation changes.

## GitHub/source verification (13 November 2026)
- WebP candidates stored and readable. Damaged `myanmar testng/section-04-review/*.jpg` should not be used as replacements.
- Refined source SVG markup has balanced nested `svg` tags, embeds WebP data (not remote images), no script/foreignObject; CSS references the same composite names.
- Compare from `test/golden-pagoda-s04-strict-20261113` contains only these three target paths, with no section HTML, JS, animations, or data modifications.
- Inherited **previous** strict test branch had four-width Chromium geometry/scroll checks for 320×568, 360×740, 390×844, 430×932. Those checks **do not prove** the refined composition's visual quality.

## Open test gates
- New commit has **NOT** been visually rendered/reviewed at four mobile widths. Need check crown/text collision, edge masks, crop alignment, no duplicate curves, reception/nikah balance, and bottom paper transition.
- Real iPhone Safari/Telegram, reverse scroll and long-address checks remain pending.
- Vercel isolated project `golden-pagoda-s04-strict-preview` failed to create a preview for the refined branch: deployment `dpl_3mWMfv57YUzMnGfU5orTQbsJLpcx` is **BLOCKED**, with no build logs. Do not advertise it as a working URL.
- GitHub Actions and Browser Use were **not** invoked.

## Local inspection
On a computer with a checkout of this repository:

```powershell
git fetch
git switch fix/golden-pagoda-s04-refined-crown-single-border-20261113
.\start.ps1
```

Open `http://localhost:8000/?skin=golden-pagoda-garden`, enter the invitation, and scroll to `#eventDetails`. Inspect 320, 360, 390, 430 CSS px with scroll forward/backward; record screenshots and assess against the approved artwork directions. Do not merge until the visual QA report is reviewed.
