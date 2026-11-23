'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Royal Section 1 keeps the previously approved vertical Myanmar breathing positions',()=>{
  const css=source('golden-pagoda-s01-bilingual-preview.css');
  const tail=css.slice(css.lastIndexOf('/* Phase 2'));
  assert.match(tail,/name-first\s*\{\s*translate:0 -2px !important/);
  assert.match(tail,/name-second\s*\{\s*translate:0 6px !important/);
  assert.match(css,/height:425lvh/);
  assert.match(css,/margin-bottom:-100lvh/);
  assert.match(source('scene.js'),/const textShift = royalS01WordingPreview\s*\? 0/);
  assert.match(source('scene.js'),/const rootStyle = heroViewport\.style/);
});

test('Split-wing enhancement makes no downloads or DOM changes on another skin',async()=>{
  const js=source('golden-pagoda-s08-s09-split-flutter.js');
  const assets=[];
  const changed=[];
  class ImageStub {
    constructor(){this.naturalWidth=1}
    set src(url){assets.push(url);Promise.resolve().then(()=>this.onload?.())}
  }
  function run(skin){
    const seen=assets.length;
    const target={
      classList:{add:name=>changed.push(name)},
      querySelector:()=>null,
      insertBefore:()=>{}
    };
    const doc={
      readyState:'complete',
      documentElement:{dataset:{goldenPagodaSkin:skin?'true':undefined}},
      querySelector:()=>target,
      createElement:()=>({className:'',setAttribute:()=>{},innerHTML:''})
    };
    vm.runInNewContext(js,{
      document:doc,window:{location:{search:skin?'?skin=golden-pagoda-garden':''}},
      location:{search:skin?'?skin=golden-pagoda-garden':''},
      URLSearchParams,Image:ImageStub,Promise,IntersectionObserver:undefined
    });
    return assets.length-seen;
  }
  assert.equal(run(false),0,'The default skin must not request any Royal wing WebPs');
  assert.deepEqual(changed,[]);
  assert.equal(run(true),6,'Royal skin should request exactly 3 S08 + 3 S09 assets');
  await Promise.resolve();await Promise.resolve();await Promise.resolve();
  assert.ok(changed.includes('gp-s08-split-ready'));
  assert.ok(changed.includes('gp-s09-split-ready'));
});

test('Royal gallery uses existing source art and accessible descriptive photo names',()=>{
  const gallery=source('section-five.js'),adapter=source('golden-pagoda-s07.js');
  for(const src of ['s07-royal-couple-portrait.webp','s03-royal-bride-portrait.webp',
    's03-royal-groom-portrait.webp','s07-royal-garden-walk.webp','s07-royal-lakeside-portrait.webp']){
    assert.ok(gallery.includes(src),'Missing '+src);
  }
  assert.match(adapter,/\[2, 1, 0, 3, 4\]\.forEach\(slot => grid\.appendChild\(cards\.get\(slot\)\)\)/);
  assert.match(gallery,/royalGallery\s*\? 'View photo: ' \+ photo\.caption/);
  assert.match(gallery,/\[2, 1, 0, 3, 4\]\.filter/);
  const css=source('golden-pagoda-s07.css');
  assert.match(css,/object-fit:\s*contain/); // no new cropping
});

test('Four RSVP butterflies remain and split WebPs are never changed',()=>{
  const css=source('golden-pagoda-s08-s09-split-flutter.css');
  const js=source('golden-pagoda-s08-s09-split-flutter.js');
  assert.match(js,/s9-bottom-butterfly-zone/);
  assert.match(js,/s9-butterfly-bottom-reverse/);
  assert.match(js,/s9-butterfly-bottom-forward/);
  assert.match(css,/transform-origin:79% 51%!important/);
  assert.match(css,/transform-origin:21% 51%!important/);
  assert.match(css,/@keyframes gp-split-flap-left/);
  assert.match(css,/gp-s09-bottom-in-view/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
