'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Section 7 uses five approved images for Golden Pagoda, not reference photos',()=>{
 const js=read('section-five.js');
 assert.match(js,/const royalGallery =/);
 assert.match(js,/const ROYAL_PHOTOS = Object\.freeze/);
 assert.match(js,/royalGallery \? 'royal' : 'local'/);
 assert.match(js,/if \(ROYAL_PHOTOS\.includes\(src\)\) return src;/);
 const files=['section-07/s07-royal-couple-portrait.webp','section-03/s03-royal-bride-portrait.webp','section-03/s03-royal-groom-portrait.webp','section-07/s07-royal-garden-walk.webp','section-07/s07-royal-lakeside-portrait.webp'];
 for(const f of files) {
  assert.ok(js.includes(f),f+' missing JS mapping');
  assert.ok(fs.existsSync(path.join(root,'assets/skins/golden-pagoda-garden',f)),f+' missing file');
 }
});
test('Global petals and original butterflies remain integrated',()=>{
 const html=read('index.html'),petals=read('global-petals.js'),butterflies=read('golden-pagoda-s08-s09-butterflies.css');
 assert.match(html,/global-petals\.js/);
 assert.match(petals,/const COUNT = 26/);
 assert.match(petals,/s00-lotus-petal-ivory\.webp/);
 assert.match(butterflies,/s08-royal-butterfly\.webp/);
 assert.match(butterflies,/s09-royal-butterfly\.webp/);
 for(const f of ['section-08/s08-royal-butterfly.webp','section-09/s09-royal-butterfly.webp'])
  assert.ok(fs.existsSync(path.join(root,'assets/skins/golden-pagoda-garden',f)),f);
});
test('All ten sections exist and protected layout assets are referenced',()=>{
 const html=read('index.html');
 for(let i=2;i<=9;i++)assert.ok(html.includes('data-section="'+i+'"'),'Section '+i);
 for(const id of ['cover','message','couple','eventDetails','runningOrder','dressCode','gallery','weddingGift','rsvp','closingMessage'])
  assert.ok(html.includes('id="'+id+'"'),'Missing section ID '+id);
 assert.match(read('golden-pagoda-s09-review.css'),/rsvp-royal-frame-paper\.svg/);
 assert.match(read('golden-pagoda-s03-rings-and-garden.css'),/s03-kanote-lotus-ring-crest\.webp/);
 assert.match(read('golden-pagoda-s03-floral-pavilion.css'),/display: none !important/);
});
