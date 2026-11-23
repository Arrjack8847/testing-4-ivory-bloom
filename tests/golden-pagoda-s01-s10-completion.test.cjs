'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=file=>fs.readFileSync(path.join(root,file),'utf8');
const exists=file=>fs.existsSync(path.join(root,file));

test('S01 royal names and greeting run at normal skin URL without wordingPreview flag',()=>{
 const src=source('golden-pagoda-s01-bilingual-preview.js');
 const hero=source('scene.js');
 assert.match(src,/params.get\('skin'\) !== 'golden-pagoda-garden'\) return/);
 assert.doesNotMatch(src,/params.get\('wordingPreview'\) !== '1'\) return/);
 assert.match(src,/သီဟအောင်/);assert.match(src,/သီရိမေ/);
 assert.match(hero,/const royalS01WordingPreview = goldenPagodaSkin;/);
 const css=source('golden-pagoda-s01-bilingual-preview.css');
 assert.match(css,/name-second\s*\{\s*translate:0 calc\(-46px/);
});

test('S02 hides optional four corners and retains bilingual royal message',()=>{
 const js=source('golden-pagoda-s02-royal-wording.js');
 const css=source('golden-pagoda-s02-strict-preview.css');
 assert.doesNotMatch(js,/corners\.appendChild\(ornament\)|royal-corner-assets'\s*;/);
 assert.match(css,/#message \.royal-corner-assets,[\s\S]*?#message \.royal-corner-asset[\s\S]*?display: none !important/);
 assert.match(js,/closing-ornament\.webp/);
 assert.match(js,/မင်္ဂလာအခါသမယ/);
});

test('S03 keeps open garden and original portraits without side floral overlays; ring crest remains',()=>{
 const florals=source('golden-pagoda-s03-floral-pavilion.css');
 const rings=source('golden-pagoda-s03-rings-and-garden.css');
 const html=source('index.html');
 assert.doesNotMatch(florals,/url\([^)]*floral-(left|right)\.webp/);
 assert.match(florals,/\.couple-botanical-edges\s*\{[\s\S]*?display: none !important/);
 assert.match(florals,/\.couple-botanical-edges::after\s*\{[\s\S]*?content: none !important/);
 assert.match(rings,/s03-kanote-lotus-ring-crest\.webp/);
 assert.match(rings,/width: min\(220px, 60vw\)/);
 assert.match(rings,/background-size: contain/);
 assert.match(rings,/radial-gradient/);
 assert.match(rings,/drop-shadow/);
 assert.match(rings,/\.couple-arch\s*\{\s*display: none !important/);
 assert.ok(exists('assets/skins/golden-pagoda-garden/section-03/s03-kanote-lotus-ring-crest.webp'));
 for(const f of ['s03-royal-groom-portrait.webp','s03-royal-bride-portrait.webp']) {
   assert.ok(exists('assets/skins/golden-pagoda-garden/section-03/'+f));
 }
 assert.match(html,/golden-pagoda-s03-floral-pavilion.css/);
});

test('S09 shaped paper frame exists; original MVP preview RSVP is not sent or saved',()=>{
 assert.ok(exists('assets/skins/golden-pagoda-garden/section-09/rsvp-royal-frame-paper.svg'));
 const css=source('golden-pagoda-s09-review.css');
 assert.match(css,/rsvp-royal-frame-paper.svg/);
 assert.match(css,/border-image-slice: 340 45 225 45 fill/);
 assert.match(source('section-nine.js'),/RSVP preview \(not sent or saved\)/);
});

test('S10 current typography remains and sections 4 through 8 stay registered',()=>{
 const html=source('index.html');
 for(const [n,id] of [[4,'eventDetails'],[5,'runningOrder'],[6,'dressCode'],[7,'gallery'],[8,'weddingGift'],[10,'closingMessage']]) {
   assert.match(html,new RegExp('id="'+id+'"[^>]*data-section="'+n+'"|data-section="'+n+'"[^>]*id="'+id+'"'));
 }
 const css=source('golden-pagoda-s05-s10-royal-wording.css');
 assert.match(css,/height: 54px/);
 assert.match(css,/height: 48px/);
});
