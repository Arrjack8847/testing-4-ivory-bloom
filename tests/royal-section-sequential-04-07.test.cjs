'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const exists=f=>fs.existsSync(path.join(root,f));
const asset=(n,p)=>exists('assets/skins/golden-pagoda-garden/section-'+n+'/'+p);

test('S04: ornate royal event decorations and date/countdown assets remain available',()=>{
 const html=read('index.html');
 const css=read('golden-pagoda-s04-countdown-preview.css');
 assert.match(html,/id="eventDetails"/);
 assert.match(html,/data-section="4"/);
 assert.match(css,/countdown-divider-top\.webp/);
 for(const f of ['s04-royal-background.webp','s04-royal-frame.webp','countdown-divider-top.webp','countdown-divider-bottom.webp'])
  assert.ok(asset('04',f),f);
});
test('S05: wedding timeline keeps six programmed steps and the existing ornament assets',()=>{
 const js=read('golden-pagoda-s05-s10-royal-wording.js');
 const html=read('index.html');
 assert.match(html,/id="runningOrder"/);
 assert.match(js,/ဧည့်သည်များ ကြိုဆိုခြင်း/);
 assert.match(js,/မင်္ဂလာပွဲ ပြီးဆုံးခြင်း/);
 for(const f of ['timeline-paper.webp','timeline-floral.webp','timeline-seal.webp'])
  assert.ok(asset('05',f),f);
});
test('S06: royal dress code wording/palette retains its paper and floral artwork',()=>{
 const js=read('golden-pagoda-s05-s10-royal-wording.js');
 const html=read('index.html');
 const css=read('golden-pagoda-dress-code.css');
 assert.match(html,/id="dressCode"/);
 assert.match(js,/mark\('dressCode'\)/);
 assert.match(css,/#dressCode/);
 for(const f of ['dress-paper.webp','dress-floral.webp','dress-top.webp','dress-bottom.webp'])
  assert.ok(asset('06',f),f);
});
test('S07: five approved royal photos wired to gallery and original dialog stays intact',()=>{
 const js=read('section-five.js');
 const html=read('index.html');
 assert.match(html,/id="gallery"/);
 assert.match(html,/id="galleryDialog"/);
 assert.match(js,/const ROYAL_PHOTOS = Object\.freeze/);
 const photos=[
  'section-07/s07-royal-couple-portrait.webp',
  'section-03/s03-royal-bride-portrait.webp',
  'section-03/s03-royal-groom-portrait.webp',
  'section-07/s07-royal-garden-walk.webp',
  'section-07/s07-royal-lakeside-portrait.webp'];
 for(const file of photos){
  assert.match(js,new RegExp(file.replace('.','\\.')));
  assert.ok(exists('assets/skins/golden-pagoda-garden/'+file),file);
 }
 assert.match(js,/dialog\.showModal\(\)/);
});
