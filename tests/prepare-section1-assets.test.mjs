import test from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT=resolve('scripts/prepare-section1-assets.mjs');
const EXPECTED={
 'sky.webp':[1080,1920],'palace-horizontal.webp':[1448,1086],
 'arch.webp':[941,1672],'drape.webp':[1024,1536],
 'hang_1.webp':[1024,1536],'hang_3.webp':[1024,1536],
 'hang_4.webp':[1024,1536],'peacock.webp':[1024,1536],
 'spike_3.webp':[768,1536],'spike_4.webp':[768,1536],
 'spike_5.webp':[768,1536],'stem_1.webp':[768,1536],
 'stem_2.webp':[768,1536],'leaf_4.webp':[1536,1024],
 'leaf_5.webp':[1536,1024],'leaf_6.webp':[1536,1024],
 'bfly_1.webp':[312,246],'bfly_white.webp':[312,246],
 'royal-name-divider.webp':[690,36],'royal-open-button.webp':[663,147]
};
function stub(w,h,alpha=true){
 // Only the WebP VP8X metadata header is synthetic; this is NOT a full decode test.
 const b=Buffer.alloc(30);
 b.write('RIFF',0,'ascii');b.writeUInt32LE(22,4);b.write('WEBP',8,'ascii');
 b.write('VP8X',12,'ascii');b.writeUInt32LE(10,16);b[20]=alpha?16:0;
 b.writeUIntLE(w-1,24,3);b.writeUIntLE(h-1,27,3);
 return b;
}
function setup(){
 const root=mkdtempSync(join(tmpdir(),'ivory-s1-'));
 const paths={};let i=0;
 for(const [name,[w,h]] of Object.entries(EXPECTED)){
  const folder=i++<13?'public/assets/ivory-bloom':'assets/skins/ivory-bloom';
  const path=join(root,folder,name);mkdirSync(dirname(path),{recursive:true});
  writeFileSync(path,stub(w,h,name!=='sky.webp'));paths[name]=path;
 }
 const run=()=>spawnSync(process.execPath,[SCRIPT],{env:{...process.env,IVORY_SOURCE_ROOT:root,IVORY_OUTPUT_ROOT:join(root,'dist')},encoding:'utf8'});
 return{root,paths,run,cleanup:()=>rmSync(root,{force:true,recursive:true})};
}
test('20 asset files are copied without modification',()=>{
 const f=setup();try{
  const r=f.run();assert.equal(r.status,0,r.stderr);
  const m=JSON.parse(readFileSync(join(f.root,'dist/assets/ivory-bloom/asset-integrity.json'),'utf8'));
  assert.equal(m.count,20);
  for(const [name,source] of Object.entries(f.paths))assert.deepEqual(readFileSync(source),readFileSync(join(f.root,'dist/assets/ivory-bloom',name)));
 }finally{f.cleanup();}
});
test('missing source blocks staging',()=>{const f=setup();try{rmSync(f.paths['drape.webp']);assert.notEqual(f.run().status,0);}finally{f.cleanup();}});
test('wrong dimensions block staging',()=>{const f=setup();try{writeFileSync(f.paths['spike_3.webp'],stub(17,17));assert.notEqual(f.run().status,0);}finally{f.cleanup();}});
test('duplicate sources block staging',()=>{const f=setup();try{
 const other=join(f.root,'assets/skins/ivory-bloom/drape.webp');mkdirSync(dirname(other),{recursive:true});cpSync(f.paths['drape.webp'],other);
 assert.notEqual(f.run().status,0);
}finally{f.cleanup();}});
test('invalid WebP header blocks staging',()=>{const f=setup();try{writeFileSync(f.paths['hang_4.webp'],Buffer.from('corrupt'));assert.notEqual(f.run().status,0);}finally{f.cleanup();}});
