'use strict';
/* Royal Section 1 final polish: offline source/cascade contract.
   Run locally: node --test tests/royal-s01-final-polish.test.cjs
   No GitHub Actions. This does not claim rendered iPhone QA. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const read = name => fs.readFileSync(path.join(root,name),'utf8');
const scene = read('scene.js');
const royal = read('golden-pagoda-skin.css');
const bundle = read('styles-bundle-a.css');
const wording = read('golden-pagoda-s01-bilingual-preview.css');
const html = read('index.html');

test('Royal double curtain is rendered from two full copies of the identical approved artwork', () => {
  assert.match(scene, /if \(goldenPagodaSkin && filename === 'drape\.webp'\)/);
  assert.match(scene, /img\.classList\.add\('royal-drape-left'\)/);
  assert.match(scene, /royalRightDrape = img\.cloneNode\(false\)/);
  assert.match(scene, /wrapper\.appendChild\(royalRightDrape\)/);
  assert.match(scene, /if \(royalRightDrape\) byFile\.get\(filename\)\.push\(royalRightDrape\)/);
  assert.match(royal, /\.royal-drape-left\s*\{\s*clip-path:inset\(0 50% 0 0\)/);
  assert.match(royal, /\.royal-drape-right\s*\{[\s\S]*?clip-path:inset\(0 0 0 50%\)/);
  assert.match(royal, /transform-origin:31% 0%/);
  assert.match(royal, /transform-origin:69% 0%/);
  assert.match(royal, /royal-drape-left-breeze 16\.2s/);
  assert.match(royal, /royal-drape-right-breeze 16\.2s/);
  assert.match(royal, /@supports not \(clip-path:inset\(0\)\)/);
});

test('One wind field coordinates all Royal hanging and rooted images without touching fixed art', () => {
  assert.match(scene, /if \(goldenPagodaSkin && \(classes\.includes\('hanging'\) \|\| classes\.includes\('plant'\)\)\)/);
  assert.match(scene, /const mirrored = classes\.includes\('flipped'\) \? -1 : 1/);
  assert.match(scene, /const phase = -\(2\.4 \+ x \/ 100 \* 1\.35/);
  assert.match(scene, /--royal-gust-left/);
  assert.match(scene, /--royal-gust-right/);
  assert.match(royal, /animation:royal-hanging-wind/);
  assert.match(royal, /animation:royal-rooted-wind/);
  assert.match(royal, /@keyframes royal-hanging-wind/);
  assert.match(royal, /@keyframes royal-rooted-wind/);
  assert.match(royal, /\.sprite\.hanging \.swing\s*\{\s*transform-origin:50% 0%/);
  assert.match(royal, /\.sprite\.plant \.plant-sway\s*\{\s*transform-origin:50% 100%/);
  assert.doesNotMatch(royal, /\.peacock-sprite[\s\S]{0,50}animation:/);
  assert.doesNotMatch(royal, /requestAnimationFrame/);
  assert.match(royal, /prefers-reduced-motion:reduce/);
  assert.match(royal, /animation:none!important/);
});

test('Camera stays touch-responsive and curtain parent follows same opening easing as gateway', () => {
  assert.match(scene, /window\.addEventListener\('touchstart', engageScrollMode/);
  assert.match(scene, /window\.addEventListener\('wheel', engageScrollMode/);
  assert.match(scene, /const blend = 1 - Math\.exp\(-dt \/ 70\)/);
  assert.match(scene, /const palaceRetreat = easeBetween\(cameraFraction, \.22, \.72\)/);
  assert.match(royal, /\.sky-layer,\.depth\.arch,\.depth\.canopy,\.sprite\.hanging,\.sprite\.front/);
  assert.match(royal, /transition-duration:1050ms/);
  assert.match(royal, /transition-timing-function:cubic-bezier\(\.22,\.61,\.36,1\)/);
  assert.match(scene, /if \(goldenPagodaSkin\) timer = setTimeout\(tryNext, 20000\)/);
});

test('The approved Myanmar name positions and 1.09H reading hold are unchanged', () => {
  const lock = wording.slice(wording.indexOf('/* Phase 2 — recover the approved name breathing offsets.'));
  assert.match(lock, /\.name-first\s*\{\s*translate:0 -2px !important/);
  assert.match(lock, /\.name-second\s*\{\s*translate:0 6px !important/);
  assert.match(wording, /height:425lvh/);
  assert.match(wording, /margin-bottom:-100lvh/);
  assert.match(scene, /const textShift = royalS01WordingPreview\s*\? 0/);
  assert.match(scene, /const greeting = royalS01WordingPreview/);
  assert.match(scene, /const firstName = royalS01WordingPreview/);
  assert.match(scene, /const secondName = royalS01WordingPreview/);
  assert.match(scene, /const rootStyle = heroViewport\.style/);
  assert.doesNotMatch(royal, /\.name-(?:first|second)|\.ceremony-names/);
});

test('Production stylesheet bundle embeds this exact Royal CSS without changing stylesheet order', () => {
  const start = bundle.indexOf('/* START golden-pagoda-skin.css */\n');
  const end = bundle.indexOf('/* END golden-pagoda-skin.css */', start);
  assert.ok(start>=0&&end>start);
  const rendered = bundle.slice(start + '/* START golden-pagoda-skin.css */\n'.length, end);
  assert.equal(rendered, royal.trimEnd()+'\n');
  const styles = [...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(x=>x[1]);
  assert.deepEqual(styles,['styles-bundle-a.css','styles-bundle-b.css','golden-pagoda-s01-bilingual-preview.css','styles-bundle-c.css']);
  assert.match(html,/scene\.js\?v=20261121-load1/);
});
