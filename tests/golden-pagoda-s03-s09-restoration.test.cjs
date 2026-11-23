'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('S03 open royal garden: opaque arch only is hidden, portraits preserved',()=>{
 const css=read('golden-pagoda-s03-rings-and-garden.css');
 assert.match(css,/#couple\.couple-section\[data-art="reference"\] \.couple-arch \{\s*display: none !important;/);
 assert.match(css,/s03-royal-wedding-rings\.webp/);
 const original=read('golden-pagoda-s03-strict-preview.css');
 assert.match(original,/s03-strict-portrait-overlay\.svg/);
 assert.match(original,/s03-strict-garden-composite\.svg/);
 const wording=read('golden-pagoda-s03-royal-wording.js');
 assert.match(wording,/setCopy\('\.couple-separator', 'နှင့်', 'my'\)/);
 for(const f of ['s03-royal-wedding-rings.webp','s03-royal-bride-portrait.webp','s03-royal-groom-portrait.webp'])
   assert.ok(fs.existsSync(path.join(root,'assets/skins/golden-pagoda-garden/section-03',f)),f);
 const html=read('index.html');
 assert.ok(html.indexOf('golden-pagoda-s03-rings-and-garden.css')>html.indexOf('golden-pagoda-s03-royal-wording.css'));
});
test('S09 latest royal ivory frame, whole paper, correct form safeguards',()=>{
 const css=read('golden-pagoda-s09-review.css');
 assert.match(css,/rsvp-royal-frame\.webp/);
 assert.match(css,/border-image-slice:\s*340 45 225 45/);
 assert.match(css,/center top \/ min\(100%, 540px\) auto no-repeat/);
 assert.match(css,/s9-art-wash::after \{\s*display: none;/);
 assert.ok(fs.existsSync(path.join(root,'assets/skins/golden-pagoda-garden/section-09/rsvp-royal-frame.webp')));
 const js=read('section-nine.js');
 assert.match(js,/rootMargin:royalPreview\?'180px 0px 180px 0px':'0px'/);
 assert.match(js,/if\(royalPreview\)return; \/\/ Sample wishes only/);
 assert.match(js,/if\(royalPreview\)return; \/\/ No CAPTCHA/);
 assert.match(js,/RSVP preview \(not sent or saved\)/);
 assert.match(js,/fetch\('\/api\/rsvp',\{/); // Reference skin unchanged.
});
