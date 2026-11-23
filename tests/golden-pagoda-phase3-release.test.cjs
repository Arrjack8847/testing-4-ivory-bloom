'use strict';
/* Phase 3, offline/exact-checkout integrity QA. Node 20+ only; no Actions.
 * This suite checks source/asset integrity, not browser screenshots or iPhone RAM.
 */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const manifest=JSON.parse(read('docs/golden-pagoda-phase3-artwork-integrity.json'));

test('all snapshotted Royal artworks retain exact Git object hashes',()=>{
  assert.equal(manifest.baseCommit,'8eea9679294acca3a9a45402febf9753ce9707b0');
  assert.equal(manifest.files.length,manifest.assetCount);
  assert.equal(manifest.assetCount,118);
  let checkedBytes=0;
  for(const entry of manifest.files){
    assert.match(entry.path,/^assets\/skins\/golden-pagoda-garden\/.+\.(webp|png|svg)$/i);
    assert.ok(exists(entry.path),'Missing Royal artwork: '+entry.path);
    const bytes=fs.readFileSync(path.join(root,entry.path));
    assert.equal(bytes.length,entry.bytes,'Artwork size changed: '+entry.path);
    const header=Buffer.from('blob '+bytes.length+'\0');
    const hash=crypto.createHash('sha1').update(header).update(bytes).digest('hex');
    assert.equal(hash,entry.gitBlobSha,'Artwork modified: '+entry.path);
    if(entry.path.endsWith('.webp')){
      assert.equal(bytes.toString('ascii',0,4),'RIFF','Invalid WebP RIFF header: '+entry.path);
      assert.equal(bytes.toString('ascii',8,12),'WEBP','Invalid WebP signature: '+entry.path);
    }
    checkedBytes+=bytes.length;
  }
  assert.equal(checkedBytes,manifest.assetBytes);
});

test('all local stylesheets and deferred scripts referenced by index.html exist',()=>{
  const html=read('index.html');
  const resources=[
    ...Array.from(html.matchAll(/<link\b[^>]*href=["']([^"']+)["']/g),m=>m[1]),
    ...Array.from(html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/g),m=>m[1])
  ];
  assert.ok(resources.length>=50);
  for(const uri of resources){
    if(/^(?:https?:|data:)/i.test(uri))continue;
    const target=uri.split(/[?#]/)[0].replace(/^\.\//,'');
    assert.ok(exists(target),'Missing linked page resource: '+uri);
  }
});

test('all Golden Pagoda CSS static local artwork URLs exist',()=>{
  const css=fs.readdirSync(root).filter(f=>f.startsWith('golden-pagoda')&&f.endsWith('.css'));
  assert.equal(css.length,22);
  let checked=0;
  for(const name of css){
    const raw=read(name);
    const pat=/url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]*))\s*\)/g;
    for(const m of raw.matchAll(pat)){
      const uri=(m[1]||m[2]||m[3]||'').trim();
      if(!uri||/^(?:https?:|data:|#|var\()/i.test(uri))continue;
      const target=uri.split(/[?#]/)[0].replace(/^\.\//,'');
      assert.ok(exists(target),name+' references missing asset '+uri);
      checked++;
    }
  }
  assert.ok(checked>=45,'Expected 45+ local artwork CSS references');
});

test('all root application JavaScript parses without a browser',()=>{
  const files=fs.readdirSync(root).filter(f=>f.endsWith('.js'));
  assert.ok(files.length>=20);
  for(const f of files)assert.doesNotThrow(()=>new vm.Script(read(f),{filename:f}),f+' syntax');
});

test('cover, sticky handoff, petal canvas, and Royal galleries retain approved invariants',()=>{
  const html=read('index.html'),scene=read('scene.js'),css=read('golden-pagoda-s01-bilingual-preview.css');
  assert.match(html,/id="sceneTrack"/);
  assert.match(scene,/const royalCoverCore = \['sky\.webp', 'palace-horizontal\.webp', 'arch\.webp'\]/);
  assert.match(scene,/Math\.min\(3, ornaments\.length\)/);
  assert.match(scene,/document\.documentElement\.style\.overflowY = 'hidden'/);
  assert.match(scene,/document\.documentElement\.style\.overflowY = 'auto'/);
  assert.match(scene,/const rootStyle = heroViewport\.style/);
  assert.match(css,/height:425lvh/);
  assert.match(css,/margin-bottom:-100lvh/);
  const final=css.slice(css.lastIndexOf('/* Phase 2'));
  assert.match(final,/name-first\s*\{\s*translate:0 -2px !important/);
  assert.match(final,/name-second\s*\{\s*translate:0 6px !important/);
  assert.match(read('global-petals.js'),/PAINT_INTERVAL_MS = 1000 \/ 30/);
  const gallery=read('golden-pagoda-s07.js');
  assert.match(gallery,/\[2, 1, 0, 3, 4\]\.forEach/);
  assert.match(read('section-five.js'),/royalGallery\s*\? 'View photo: ' \+ photo\.caption/);
  assert.match(read('golden-pagoda-s07.css'),/object-fit:\s*contain/);
});

test('approved split-wing artwork remains Royal-only and four RSVP sprites remain wired',()=>{
  const js=read('golden-pagoda-s08-s09-split-flutter.js');
  const css=read('golden-pagoda-s08-s09-split-flutter.css');
  // Assert actual request behavior rather than the exact expression used
  // by the already-merged main branch's Royal-only guard.
  const artworkRequests=(search)=>{
    const requested=[];
    class ImageStub {
      naturalWidth=0;
      set src(value){requested.push(value);this.onerror?.();}
    }
    vm.runInNewContext(js,{
      document:{readyState:'complete'},
      location:{search},URLSearchParams,Image:ImageStub,Promise
    },{timeout:1000});
    return requested;
  };
  assert.deepEqual(artworkRequests(''),[],'No Royal assets on default skin');
  assert.deepEqual(artworkRequests('?skin=testing-4'),[],'No Royal assets on reference skin');
  assert.equal(artworkRequests('?skin=golden-pagoda-garden').length,6,'Royal wing parts load');
  assert.match(js,/s9-butterfly-bottom-reverse/);
  assert.match(js,/s9-butterfly-bottom-forward/);
  assert.match(css,/gp-s09-bottom-in-view/);
  for(const [section,stem] of [['08','s08'],['09','s09']])
    for(const part of ['left-wing','right-wing','body'])
      assert.ok(exists('assets/skins/golden-pagoda-garden/section-'+section+'/'+stem+'-butterfly-'+part+'.webp'));
});

test('Royal RSVP release is correctly classified as preview-only, not submitted',()=>{
  const rsvp=read('section-nine.js');
  assert.match(rsvp,/if\(royalPreview\)/);
  assert.match(rsvp,/RSVP preview \(not sent or saved\)/);
  assert.match(rsvp,/Preview only — responses are not sent or saved/);
});
