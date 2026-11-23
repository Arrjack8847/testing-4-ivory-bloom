'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('Royal first paint is gated only by approved sky, palace and arch', () => {
  const scene = read('scene.js');
  assert.match(scene, /const royalCoverCore = \['sky\.webp', 'palace-horizontal\.webp', 'arch\.webp'\]/);
  assert.match(scene, /const core = await Promise\.all\(royalCoverCore\.map\(loadAndAttachArtwork\)\)/);
  assert.match(scene, /invite\.dataset\.layers = coreReady \? 'ready' : 'unavailable'/);
  assert.match(scene, /invite\.dataset\.ornaments = failed\.size \? 'partial' : 'complete'/);
  assert.match(scene, /Math\.min\(3, ornaments\.length\)/);
  assert.match(scene, /test\.fetchPriority = royalCoverCore\.includes\(name\) \? 'high' : 'low'/);
  // The approved source artwork, royal motion and sticky scene stay intact.
  assert.match(scene, /const rootStyle = heroViewport\.style;/);
  assert.match(scene, /const royalS01WordingPreview = goldenPagodaSkin;/);
  assert.match(scene, /const skinAssetBase = activeSkin/);
});

test('Global petal artwork stays original while full-canvas paint is rate limited', () => {
  const petals = read('global-petals.js');
  assert.match(petals, /const COUNT = 26/);
  assert.match(petals, /const PAINT_INTERVAL_MS = 1000 \/ 30/);
  assert.match(petals, /const ROYAL_COVER_INTERVAL_MS = 1000 \/ 60/);
  assert.match(petals, /const interval = royalCoverVisible \? ROYAL_COVER_INTERVAL_MS : PAINT_INTERVAL_MS/);
  assert.match(petals, /lastPaint && now - lastPaint < interval - 1/);
  assert.match(petals, /requestAnimationFrame\(tick\)/);
  assert.match(petals, /document\.hidden/);
  assert.match(petals, /prefers-reduced-motion/);
  for (const name of [
    's00-lotus-petal-pink-flat.webp',
    's00-lotus-petal-pink-curled.webp',
    's00-lotus-petal-ivory.webp'
  ]) {
    assert.ok(petals.includes(name), 'Original petal missing: ' + name);
  }
});
