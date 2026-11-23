'use strict';
const test=require('node:test'), assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('The global canvas uses all three royal WebP petals without affecting other skins',()=>{
 const js=read('global-petals.js');
 for(const name of ['s00-lotus-petal-pink-flat.webp','s00-lotus-petal-pink-curled.webp','s00-lotus-petal-ivory.webp'])assert.match(js,new RegExp(name.replace('.','\\.')));
 assert.match(js,/\.get\('skin'\) === 'golden-pagoda-garden'/);
 assert.match(js,/choice < \.45 \? 0 : choice < \.75 \? 1 : 2/);
 assert.match(js,/const royalPetalImages = royal \?/);
});

test('Preserve 26-particle continuity, native draw fallback, pause and reduced motion',()=>{
 const js=read('global-petals.js'),css=read('global-petals.css');
 assert.match(js,/const COUNT = 26/);
 assert.match(js,/visibleInRoyal: i % 4 !== 0/);
 assert.match(js,/context\.drawImage\(img, -size \/ 2, -size \/ 2, size, size\)/);
 assert.match(js,/context\.bezierCurveTo/);
 assert.match(js,/visibilitychange/);
 assert.match(js,/prefers-reduced-motion: reduce/);
 assert.match(css,/#message \.letter-petal/);
 assert.match(css,/\.global-petals-active \.s9-rsvp \.s9-petals/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/mix-blend-mode: multiply/);
});

test('Royal image rendering is a non-blocking optional enhancement',()=>{
 const js=read('global-petals.js');
 assert.match(js,/img && img\.complete && img\.naturalWidth > 0/);
 assert.match(js,/context\.restore\(\);\s*return;/);
 assert.match(js,/naturalSize/);
 assert.doesNotMatch(js,/\.style\.display|document\.createElement\('img'\)/);
});
