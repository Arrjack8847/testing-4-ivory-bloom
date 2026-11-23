#!/usr/bin/env node
'use strict';
// Run "node scripts/build-styles.cjs" after CSS edits.
// Run "node scripts/build-styles.cjs --check" before a deployment.
// The original CSS files remain the source of truth.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const STYLES = [
  "styles.css",
  "golden-pagoda-skin.css",
  "golden-pagoda-s03-strict-preview.css",
  "golden-pagoda-s03-royal-wording.css",
  "section-two.css",
  "golden-pagoda-s02-strict-preview.css",
  "section-couple.css",
  "section-three.css",
  "section-four.css",
  "order-program.css",
  "section-five.css",
  "golden-pagoda-s07.css",
  "section-six.css",
  "dress-code.css",
  "golden-pagoda-dress-code.css",
  "reference-continuation.css",
  "section-eight-gift.css",
  "golden-pagoda-s08-review.css",
  "section-nine.css",
  "golden-pagoda-s09-review.css",
  "section-ten.css",
  "golden-pagoda-s10-review.css",
  "floral-continuity.css",
  "global-petals.css",
  "golden-pagoda-s04-strict-preview.css",
  "golden-pagoda-s04-decorations-preview.css",
  "golden-pagoda-s04-countdown-preview.css",
  "golden-pagoda-s04-wording-preview.css",
  "golden-pagoda-s04-chatrium-yangon.css",
  "golden-pagoda-s01-bilingual-preview.css",
  "golden-pagoda-s05-s10-royal-wording.css",
  "golden-pagoda-s08-frame-review.css",
  "golden-pagoda-s08-royal-wording.css",
  "golden-pagoda-s03-rings-and-garden.css",
  "golden-pagoda-s03-floral-pavilion.css",
  "golden-pagoda-s09-text-layout.css",
  "golden-pagoda-s08-s09-butterflies.css",
  "golden-pagoda-s08-s09-split-flutter.css",
  "royal-music.css"
];
const GROUPS = [
  {file:'styles-bundle-a.css', paths:STYLES.slice(0,15)},
  {file:'styles-bundle-b.css', paths:STYLES.slice(15,29)},
  {file:'styles-bundle-c.css', paths:STYLES.slice(30)}
];
const STANDALONE = STYLES[29];
function build(paths) {
  let css = '/* Generated from ordered source stylesheets by scripts/build-styles.mjs; do not edit manually. */\n';
  for (const source of paths) {
    const text = fs.readFileSync(path.join(root, source), 'utf8');
    if (/@import\s|@charset\s/i.test(text)) throw new Error('Cannot bundle CSS import: ' + source);
    css += '\n/* START ' + source + ' */\n' + text.trimEnd() + '\n/* END ' + source + ' */\n';
  }
  return css;
}
function checkHtml() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const links = [...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(match => match[1]);
  const expected = [GROUPS[0].file, GROUPS[1].file, STANDALONE, GROUPS[2].file];
  if (JSON.stringify(links) !== JSON.stringify(expected))
    throw new Error('HTML stylesheet order drift: ' + JSON.stringify(links));
  const myanmarCss = fs.readFileSync(path.join(root, STANDALONE), 'utf8');
  if (!/@import\s/.test(myanmarCss))
    throw new Error('Myanmar font import no longer in standalone stylesheet');
}
try {
  if (STYLES.length !== 39) throw new Error('Source manifest count drift');
  checkHtml();
  for (const group of GROUPS) {
    const expected = build(group.paths);
    const file = path.join(root, group.file);
    if (process.argv.includes('--check')) {
      const actual = fs.readFileSync(file, 'utf8');
      if (actual !== expected) throw new Error('Bundle out of date: ' + group.file);
      console.log('PASS ' + group.file + ' (' + group.paths.length + ' sources)');
    } else {
      fs.writeFileSync(file, expected);
      console.log('Built ' + group.file + ' (' + group.paths.length + ' sources)');
    }
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
