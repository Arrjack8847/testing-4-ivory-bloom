'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
const asset=(section,file)=>exists('assets/skins/golden-pagoda-garden/section-'+section+'/'+file);

test('S01: bilingual royal cover retains names, opened reveal and approved image assets',()=>{
 const js=read('golden-pagoda-s01-bilingual-preview.js');
 const scene=read('scene.js');
 const css=read('golden-pagoda-s01-bilingual-preview.css');
 assert.match(js,/သီဟအောင်/);
 assert.match(js,/သီရိမေ/);
 assert.match(js,/params\.get\('skin'\) !== 'golden-pagoda-garden'/);
 assert.match(scene,/const royalS01WordingPreview = goldenPagodaSkin/);
 assert.match(css,/name-second/);
 for(const f of ['sky.webp','arch.webp','palace-horizontal.webp'])
  assert.ok(exists('assets/skins/golden-pagoda-garden/'+f),f);
});
test('S02: no four corners; bilingual message and closing ornament retained',()=>{
 const js=read('golden-pagoda-s02-royal-wording.js');
 const css=read('golden-pagoda-s02-strict-preview.css');
 assert.match(js,/မင်္ဂလာအခါသမယ/);
 assert.doesNotMatch(js,/corners\.appendChild\(ornament\)/);
 assert.match(css,/royal-corner-assets[\s\S]*display: none !important/);
 assert.ok(asset('02','message-paper.webp'));
 assert.ok(asset('02','closing-ornament.webp'));
});
test('S03: royal couple and ring crest remain; no floral left-right overlay',()=>{
 const css=read('golden-pagoda-s03-floral-pavilion.css');
 const rings=read('golden-pagoda-s03-rings-and-garden.css');
 assert.match(css,/\.couple-botanical-edges[\s\S]*?display: none !important/);
 assert.doesNotMatch(css,/url\([^)]*floral-(?:left|right)\.webp/);
 assert.match(rings,/s03-kanote-lotus-ring-crest\.webp/);
 for(const n of ['s03-kanote-lotus-ring-crest.webp','s03-royal-bride-portrait.webp','s03-royal-groom-portrait.webp'])
  assert.ok(asset('03',n),n);
});
