# Golden Pagoda Garden — 47-artwork staging audit (2026-11-13)

**Status: CANDIDATE / NOT APPROVED FOR DEVELOPMENT.** The 47 production assets were already uploaded by the user. Do not ask for reupload. Do not merge, deploy, or overwrite the approved Section 1.

## Provenance / baseline
- Repository: `Arrjack8847/testing-4-golden-pagoda-garden`
- Protected approved Section 1 parent: `a1a243b0522a2f59c8065f19b5e77625911e58d2`
- GitHub upload: `6975c66ae8b986ac9a42628f732b739731bb7297`, with final `gift-header.webp` on `main` `e01f95a4cd8731c7222e89a73195e2fb8afb34c2`.
- Candidate branch: `assets/golden-pagoda-47-staging-20261113`.
- Exact original manifest copied to `docs/golden-pagoda-47-asset-manifest.csv`.
- All 47 artifacts were staged via references to the *existing repository Git blob SHAs*, with no image recompression or destructive changes. The source folder `myanmar testng/` and root `gift-header.webp` remain unchanged.
- The extra `rsvp-paper (1).webp` duplicate was deliberately excluded from the 47 canonical destinations.

## Independent local artwork audit
- 47/47 Library originals were materialized and independently opened; their byte sizes match corresponding source files in GitHub.
- 44 WebPs: all successfully decoded; image width/height match manifest; alpha/opaque categories match manifest.
- 3 SVGs: XML parses and viewBox values match the manifest.
- 47/47 unique target paths exist on candidate staging.
- The GitHub source-to-candidate copy is byte-exact by construction, because each candidate image reuses its source blob SHA. These checks are **technical**, not blanket visual approval.
- Candidate branch compare against Section 1 baseline: 50 added files (47 artworks + manifest + audit script + QA workflow), **no Section 1 code or art modified**.

## Section 05: Order of the Day
All five approved-file candidates are staged:
- `section-05/timeline-paper.webp` — 1024×1024, opaque; edge-difference metrics x=1.31/y=1.26 (0–255 scale), consistent with repeatable paper
- `section-05/timeline-top.webp` — 1080×420, true alpha
- `section-05/timeline-floral.webp` — 600×900, true alpha
- `section-05/timeline-seal.webp` — 512×512, true alpha
- `section-05/timeline-bottom.webp` — 1080×420, true alpha

Local image decode/geometry/alpha passed for all five. The five-art composition was visually inspected with a checkerboard alpha backdrop. Minor floating specks near ornament edges should be checked during final polish, but no critical Section 5 defect was seen. No DOM, animation, mobile-screen, or default-skin tests have run yet.

## Blocking visual defects in Section 03
1. `section-03/portrait-frame.webp`: the current GitHub upload has visible rectangular ivory backing remnants and extraction noise around the frame. The center itself is transparent; this is **not** a dimension/center-hole failure.
2. `section-03/arch-kanote.webp`: the current GitHub upload contains a faint rectangular backing strip, black/red alpha-edge residue and a degraded silhouette. Pure dimensions and alpha tests do not detect these artistic defects.

Newer candidate copies named `portrait-frame(1).webp` (291,778 bytes) and `arch-kanote(1).webp` (241,428 bytes) were found in ChatGPT Library and inspected. They remove the large rectangular backings, but retain some red fringe/speckle artifacts. They have **not** been silently substituted in GitHub. The current GitHub asset bytes remain intact. Art repair/approval is still required.

## Other review notes
- Gallery, gift and RSVP paper are nominally 1024×1024 opaque; local opposite-edge differences were 5–6 levels (compared with 1–2 for timeline/dress). Prefer non-repeating, stretch-safe placement until continuous tiling is visually confirmed.
- Canopy and event-arch require the existing artwork repair worker's visual sign-off (dimensions/alpha alone are insufficient).
- Final art provenance/licensing, typography contrast and full-site mobile QA remain external release gates.

## CI status
The new GitHub Actions asset-audit workflow was committed to the staging branch, but its first attempts completed as failures without usable step logs/artifacts. **No CI checks are claimed as passed.** The independent local inspection above is the evidence for technical file readiness.

## Next guarded steps
1. Repair/approve Section 03 visual defects and review paper seams; attach clean assets to a new candidate revision.
2. Re-run file validation and receive coordinator artwork approval; record final **approved asset-library commit SHA** (the staging SHA is not yet that approval).
3. Establish master-owned `integration/golden-pagoda-sections-2-10`, preserving the locked Section 1 baseline.
4. Only then start Worker 05's `feature/golden-pagoda-s05` implementation and its 320/360/390/430px forward/reverse/reduced-motion QA.
5. Draft PR to integration branch; no merge or deployment by Worker 05.
