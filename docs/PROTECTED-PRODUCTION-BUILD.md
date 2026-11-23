# Royal Invitation — Protected Production Build

## Goal
Keep the GitHub source private, publish only static display artwork, and ship
compiled/minified application code without changing the approved design or motion.

## Access protection
- Repository: Arrjack8847/testing-4-golden-pagoda-garden (verified private on 2026-11-22).
- Restrict collaborator access to people who genuinely need source access.
- Do not put tokens, customer records, original design project files, or editable
  source artwork into a public asset folder or production output.
- Existing Git history is private, not deleted. Previously downloaded copies
  cannot be recalled by changing repository visibility.

## Output
Run:
    npm install
    npm run build:protected

Vercel's vercel.json uses this command and serves **dist/**, not the working
repository. This prevents readable source files, tests, documentation,
development scripts, source SVGs, and backstage asset directories from being
served as public static files.

The builder:
- Uses index.html to preserve the *exact original script ordering*.
- Bundles classic scripts in original execution order, retaining scene.js's
  global declarations and independently scoped section scripts.
- Minifies JS without source maps.
- Groups/minifies adjacent stylesheets but does not move @import across
  stylesheet boundaries; keeps the CSS cascade.
- Converts referenced local SVG and PNG/JPEG source artwork to high-quality
  flattened WebPs, preserving alpha.
- Copies only public delivery formats from approved assets directories.
- Excludes development artwork, staging, comparison files and editable masters.
- Prints a build summary. Build errors stop deployment rather than silently
  publishing source.

## Artwork rules
Moving flowers, butterflies, petals, curtains and scenery remain independent
WebPs. Do not flatten multiple animated layers into one picture.
Do not crop, resize or recolor approved original WebP compositions in this task.
Rasterized SVG replacements should be inspected on high-DPI iPhones before
release. Keep full-resolution layered source files in a separately secured
private location, not under publicly shipped asset paths.

## Verification before main
1. Install dependencies and run npm run build:protected.
2. Verify dist/index.html has one local minified JS bundle and minified CSS.
3. Verify no .svg, .map, editable graphics, tests or original .js/.css source
   files are in dist.
4. Verify generated .svg.webp/.png.webp replacements exist.
5. Serve dist locally and verify all ten sections, Open Invitation,
   early-swipe handoff, sticky scroll, independent floral animations,
   butterflies, royal music, RSVP preview, and reduced motion.
6. Compare original and compiled builds on mobile Safari and desktop.
7. Confirm Vercel preview serves from dist and backend API routes still work
   before promoting or merging to production.

## Limitations
The build makes cloning/reuse harder but is not encryption/DRM. The browser
still receives raster art, HTML and executable JavaScript. Screenshots and
reverse engineering remain possible. The project's third-party external
references are not rewritten or licensed by this security build.
