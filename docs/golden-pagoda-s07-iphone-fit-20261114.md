# Section 7 — iPhone screenshot fit correction

Base: `bb041b42b8224dedf925cf07428643bd8e5c3371`. Review screenshot 14 Nov 2026 (iPhone), Section 7.

## Problems actually observed
- The bottom labels on the portrait cards overlap the Kanote carvings.
- The outer rounded CSS border adds a second heavy border around the Royal WebP.
- Landscape cards use nested heavy gold borders unlike the portrait frame.
- The comparison-only licensing notice occupies a large ornate card at the gallery bottom.
- Floral accents are close to the large script heading.

## Corrective scope
- S07-only CSS overrides: keep portrait frame painting as the only ornate border, place legible caption badges over the photographs and above the lower ornaments, simplify landscape border to a single slim gold line, and move floral accents outward slightly.
- Compact the explicit sample-photo rights note in Section 7 markup; keep it shown only when `galleryReference=1`. Never imply public commercial-use rights.
- Extend the existing S07 review test with geometric caption-in-card assertions (still gated by the existing asset approval variable).
- The five image buttons, source photos, gallery loader, keyboard/swipe lightbox, gallery placement and all other sections remain unchanged.
- Neither default Testing-4 skin nor production `main` is touched.

## Outstanding validation
This change requires iPhone screenshot review and 320, 360, 390, 430px Playwright QA. A READY Vercel build or valid asset paths do not establish pixel visual quality or successful interaction testing. If frame background has unneeded alpha pigment, fix artwork before editing other layout rules.
