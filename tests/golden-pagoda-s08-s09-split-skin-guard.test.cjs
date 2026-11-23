'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'..','golden-pagoda-s08-s09-split-flutter.js'),'utf8');
function fakeRun(search){
 const loaded=[],classes=[];
 const roots={
  '#weddingGift':{classList:{add:n=>classes.push('S8:'+n)},querySelector:()=>null,insertBefore:()=>{}}, 
  '#rsvp':{classList:{add:n=>classes.push('S9:'+n)},querySelector:()=>null,insertBefore:()=>{}}
 };
 class ImageStub {
  naturalWidth=1254;
  set src(path){loaded.push(path);this.onload?.();}
 }
 const document={readyState:'complete',querySelector:selector=>roots[selector]||null,createElement:()=>({className:'',innerHTML:'',setAttribute:()=>{}})};
 const context={document,window:{},Image:ImageStub,location:{search},URLSearchParams,Promise};
 vm.runInNewContext(code,context,{timeout:500});
 return {loaded,classes,flush:async()=>{await Promise.resolve();await Promise.resolve();await Promise.resolve();}};
}
test('Reference skin never downloads or activates royal wing parts',async()=>{
 const p=fakeRun('?skin=testing-4');await p.flush();
 assert.deepEqual(p.loaded,[]);
 assert.deepEqual(p.classes,[]);
});
test('No skin query never changes original butterfly motion',async()=>{
 const p=fakeRun('');await p.flush();
 assert.deepEqual(p.loaded,[]);
 assert.deepEqual(p.classes,[]);
});
test('Golden Pagoda loads six original wing/body assets and activates both sections',async()=>{
 const p=fakeRun('?skin=golden-pagoda-garden');await p.flush();
 assert.equal(p.loaded.length,6);
 assert.ok(p.loaded.every(x=>/assets\/skins\/golden-pagoda-garden\/section-0[89]\/s0[89]-butterfly-/.test(x)));
 assert.ok(p.classes.includes('S8:gp-s08-split-ready'));
 assert.ok(p.classes.includes('S9:gp-s09-split-ready'));
});
