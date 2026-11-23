'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const asset=(n,f)=>exists('assets/skins/golden-pagoda-garden/section-'+n+'/'+f);

test('S08: the approved full butterfly moves without a dependency on older reference sprites',()=>{
 const css=read('golden-pagoda-s08-s09-butterflies.css');
 const html=read('index.html');
 assert.match(html,/id="weddingGift"/);
 assert.match(css,/s08-royal-butterfly\.webp/);
 assert.match(css,/#weddingGift \.gift-eight-butterfly \{[\s\S]*?visibility: visible;[\s\S]*?opacity: \.87;[\s\S]*?animation: gift-eight-butterfly-drift/);
 assert.match(css,/display: none !important/);
 assert.ok(asset('08','s08-royal-butterfly.webp'));
 assert.ok(asset('08','s08-royal-frame.webp'));
 assert.ok(asset('08','gift-paper.webp'));
});
test('S09: both butterfly flight tracks and the original shaped RSVP frame remain',()=>{
 const css=read('golden-pagoda-s08-s09-butterflies.css');
 const base=read('section-nine.css');
 const frame=read('golden-pagoda-s09-review.css');
 const text=read('golden-pagoda-s09-text-layout.css');
 assert.match(css,/s09-royal-butterfly\.webp/);
 assert.match(base,/@keyframes s9-flight\{/);
 assert.match(base,/@keyframes s9-flight-forward\{/);
 assert.match(frame,/rsvp-royal-frame-paper\.svg/);
 assert.match(text,/grid-template-columns: minmax\(0, 1fr\)/);
 assert.match(read('section-nine.js'),/RSVP preview \(not sent or saved\)/);
 assert.ok(asset('09','s09-royal-butterfly.webp'));
 assert.ok(asset('09','rsvp-paper.webp'));
 assert.ok(asset('09','rsvp-royal-frame-paper.svg'));
});
test('S10: royal closing keeps the approved frame, artwork, names and accessible controls',()=>{
 const html=read('index.html');
 const css=read('golden-pagoda-s10-review.css');
 const wording=read('golden-pagoda-s05-s10-royal-wording.js');
 assert.match(html,/id="closingMessage"/);
 assert.match(css,/finale-royal-frame\.webp/);
 assert.match(wording,/mark\('closingMessage'\)/);
 for(const f of ['finale-royal-frame.webp','finale-scene.webp','finale-kanote.webp'])
  assert.ok(asset('10',f),f);
});
