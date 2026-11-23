'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('S08 & S09 royal butterfly CSS is last and skin scoped',()=>{
 const html=read('index.html'),css=read('golden-pagoda-s08-s09-butterflies.css');
 assert.match(html,/href="golden-pagoda-s08-s09-butterflies\.css"/);
 assert.ok(html.lastIndexOf('golden-pagoda-s08-s09-butterflies.css')>html.lastIndexOf('golden-pagoda-s09-text-layout.css'));
 assert.match(css,/html\[data-golden-pagoda-skin="true"\] #weddingGift/);
 assert.match(css,/html\[data-golden-pagoda-skin="true"\] #rsvp/);
});
test('Source butterfly artwork is rendered whole without crop or CSS source alterations',()=>{
 const css=read('golden-pagoda-s08-s09-butterflies.css');
 for(const name of ['s08-royal-butterfly.webp','s09-royal-butterfly.webp'])assert.match(css,new RegExp(name.replace('.','\\.')));
 for(const name of ['section-08/s08-royal-butterfly.webp','section-09/s09-royal-butterfly.webp'])
  assert.ok(fs.existsSync(path.join(root,'assets/skins/golden-pagoda-garden',name)));
 assert.match(css,/background-size: contain/);
 assert.match(css,/mix-blend-mode: multiply/);
 assert.doesNotMatch(css,/clip-path|object-fit:\s*cover|scaleX\(/);
});
test('Existing flight paths for one S08 and two S09 butterflies remain',()=>{
 const html=read('index.html'),s8=read('section-eight-gift.css'),s9=read('section-nine.css'),css=read('golden-pagoda-s08-s09-butterflies.css');
 assert.match(html,/class="gift-eight-butterfly"/);
 assert.match(html,/class="s9-butterfly"/);
 assert.match(html,/class="s9-butterfly-forward"/);
 assert.match(s8,/@keyframes gift-eight-shared-flight/);
 assert.match(s9,/@keyframes s9-flight\{/);
 assert.match(s9,/@keyframes s9-flight-forward\{/);
 assert.doesNotMatch(css,/@keyframes gift-eight-shared-flight|@keyframes s9-flight/);
 assert.match(css,/display: none !important/);
});
