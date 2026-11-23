'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
test('Section 8 stylesheet is a complete HTML tag and scene.js remains a script',()=>{
  const html=read('index.html');
  assert.match(html,/<link rel="stylesheet" href="golden-pagoda-s08-royal-wording\.css">\s*<script src="scene\.js\?v=20261104-fix1" defer><\/script>/);
  assert.equal((html.match(/<script src="scene\.js\?v=20261104-fix1" defer><\/script>/g)||[]).length,1);
});
test('Gift disclosure never claims to send an unconfigured payment',()=>{
  const s=read('golden-pagoda-s08-royal-wording.js');
  assert.match(s,/trigger\.textContent = 'GIFT DETAILS'/);
  assert.doesNotMatch(s,/trigger\.textContent = 'SEND GIFT'/);
  assert.match(s,/transfers are not enabled/);
});
test('Golden Pagoda RSVP is explicitly frontend-only; default API code preserved',()=>{
  const s=read('section-nine.js');
  assert.match(s,/const royalPreview=new URLSearchParams\(location\.search\)\.get\('skin'\)==='golden-pagoda-garden'/);
  assert.match(s,/const refreshWishes=async\(\)=>\{\s*if\(royalPreview\)return;/);
  assert.match(s,/const setupCaptcha=async\(\)=>\{\s*if\(royalPreview\)return;/);
  assert.match(s,/if\(royalPreview\)\{\s*fields\.name\.textContent=clean;/);
  assert.match(s,/RSVP preview \(not sent or saved\)/);
  assert.match(s,/fetch\('\/api\/rsvp',\{/); // Default skin behavior not removed.
  assert.match(s,/fetch\('\/api\/wishes',\{/);
});
