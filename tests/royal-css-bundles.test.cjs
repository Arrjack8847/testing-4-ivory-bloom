'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');

test('CSS bundles match every original stylesheet byte-for-byte and in order', () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, [path.join(root, 'scripts/build-styles.cjs'), '--check'], {cwd:root, encoding:'utf8'});
  });
});

test('HTML keeps the exact blocking CSS order and Myanmar font import', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const links = [...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(m=>m[1]);
  assert.deepEqual(links, [
    'styles-bundle-a.css',
    'styles-bundle-b.css',
    'golden-pagoda-s01-bilingual-preview.css',
    'styles-bundle-c.css'
  ]);
  const myanmar = fs.readFileSync(path.join(root, links[2]), 'utf8');
  assert.match(myanmar, /@import\s/);
  for (const bundle of [links[0],links[1],links[3]]) {
    const css=fs.readFileSync(path.join(root,bundle),'utf8');
    assert.doesNotMatch(css,/@import\s|@charset\s/i);
  }
});

test('The 24 original deferred scripts and source image URLs remain untouched', () => {
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const scripts=[...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(m=>m[1]);
  assert.equal(scripts.length,24);
  assert.ok(scripts.includes('scene.js?v=20261121-load1'));
  assert.match(html, /data-src="\.\/assets\/audio\/endless-beauty-main\.mp3"/);
  assert.match(html, /id="invitation"/);
});
