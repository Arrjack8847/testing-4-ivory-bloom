'use strict';
// Review-only source safeguards; run locally with node --test (no GitHub Actions).
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const src=p=>fs.readFileSync(path.join(root,p),'utf8');
test('S03 retains garden and uses approved premium rings with readable bilingual text',()=>{
 const rings=src('golden-pagoda-s03-rings-and-garden.css');
 const copy=src('golden-pagoda-s03-royal-wording.css');
 assert.match(rings,/couple-arch\\s*\\{\\s*display: none !important;/);
 assert.match(rings,/s03-royal-rings\\.webp/);
 assert.match(rings,/background-size: contain, 95% 90%/);
 assert.match(copy,/feathered ivory behind live text only/);
 assert.ok(fs.existsSync(path.join(root,'assets/skins/golden-pagoda-garden/section-03/s03-royal-rings.webp')));
});
test('S09 filled parchment stays clipped to royal frame with existing RSVP preview safeguards',()=>{
 const css=src('golden-pagoda-s09-review.css');
 assert.match(css,/rsvp-royal-frame-paper\\.svg/);
 assert.match(css,/border-image-slice: 340 45 225 45 fill/);
 assert.match(css,/background: transparent/);
 const asset=src('assets/skins/golden-pagoda-garden/section-09/rsvp-royal-frame-paper.svg');
 assert.match(asset,/clipPath id="paper-interior"/);
 assert.match(asset,/approved-paper/);
 const js=src('section-nine.js');
 assert.match(js,/RSVP preview \\(not sent or saved\\)/);
});
test('S10 latest readable Myanmar text is retained, preserving frame geometry',()=>{
 const css=src('golden-pagoda-s05-s10-royal-wording.css');
 assert.match(css,/height: 54px/);
 assert.match(css,/height: 48px/);
 assert.match(css,/closing10-message\\.royal-my-text/);
});
