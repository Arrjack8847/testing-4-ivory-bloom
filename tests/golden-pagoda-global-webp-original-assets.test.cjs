'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const files=['s00-lotus-petal-pink-flat.webp','s00-lotus-petal-pink-curled.webp','s00-lotus-petal-ivory.webp'];
const dir='assets/skins/golden-pagoda-garden/shared/petals';
test('All three uploaded original GitHub petal WebPs are present and real WebPs',()=>{
 for(const name of files){
  const bytes=fs.readFileSync(path.join(root,dir,name));
  assert.ok(bytes.byteLength>100000, name+' unexpectedly short');
  assert.equal(bytes.toString('ascii',0,4),'RIFF');
  assert.equal(bytes.toString('ascii',8,12),'WEBP');
 }
});
test('Source transparency and 1254px dimensions are known, no hidden alpha assumptions',()=>{
 const chunks=files.map(name=>fs.readFileSync(path.join(root,dir,name)));
 assert.equal(chunks[0].toString('ascii',12,16),'VP8 ');
 for(const bytes of chunks.slice(1)){
  assert.equal(bytes.toString('ascii',12,16),'VP8X');
  assert.ok((bytes[20]&16)!==0,'expected original alpha flag');
  const w=1+bytes[24]+(bytes[25]<<8)+(bytes[26]<<16);
  const h=1+bytes[27]+(bytes[28]<<8)+(bytes[29]<<16);
  assert.equal(w,1254);assert.equal(h,1254);
 }
 const css=fs.readFileSync(path.join(root,'global-petals.css'),'utf8');
 assert.match(css,/mix-blend-mode: multiply/);
});
test('Native canvas loads only matching three original paths and keeps original nonroyal falling petals',()=>{
 const js=fs.readFileSync(path.join(root,'global-petals.js'),'utf8');
 files.forEach(name=>assert.ok(js.includes('/shared/petals/'+name),'Missing '+name));
 assert.match(js,/const COUNT = 26/);
 assert.match(js,/choice < \.45 \? 0 : choice < \.75 \? 1 : 2/);
 assert.match(js,/context\.bezierCurveTo/);
 assert.match(js,/prefers-reduced-motion: reduce/);
 assert.doesNotMatch(js,/global-petal-ivory-jasmine\.webp/);
});
