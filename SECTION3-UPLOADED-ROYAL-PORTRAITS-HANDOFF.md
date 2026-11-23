# Section 3 — Royal Couple Portrait Integration

## Completed
- Original groom and bride WebPs are committed under `assets/skins/golden-pagoda-garden/section-03/`; the original bytes were preserved.
- Groom `s03-royal-groom-portrait.webp`: 1024 × 1536, 365,412 bytes, SHA-256 `ae61f5de74f36def060f038fc4a83be2a3cc310297e67f22829178d0c20ff747`, Git blob `da2df3229bfcc6918ea55897a722c20e60087e58`.
- Bride `s03-royal-bride-portrait.webp`: 1024 × 1536, 420,246 bytes, SHA-256 `28d1f3c354739c826f797f4dcd3fa68746dbdd1d86b036d6d01bb23af1530ef4`, Git blob `c8a1dac9335a3b013f65fc77b0249220df4da50d`.
- `section-couple-reference.js` chooses the local images only with `?skin=golden-pagoda-garden` and resolves local relative paths correctly in image-load diagnostics.
- `golden-pagoda-s03-strict-preview.css` positions the photos within the existing oval Kanote frame without modifying either WebP, frame source or 1.05× focal zoom.
- The existing Section 3 Myanmar wording and its camera, reveal and Reduced Motion behavior remain unchanged.

## Verification
- The GitHub Section 3 directory listing confirms both original image files, exact sizes and Git blob SHAs.
- The Vercel preview deployment is READY for the commit containing the binary assets.
- Visual inspection on a real iPhone and viewport-by-viewport screenshot QA remain to be confirmed; deployment READY alone does not prove the final composition is visually perfect.

## Scope
- Review branch: `review/golden-pagoda-s03-uploaded-portraits-20261115`.
- Do not alter approved Section 1 or Section 2 artwork, and do not merge into `main` without review.
