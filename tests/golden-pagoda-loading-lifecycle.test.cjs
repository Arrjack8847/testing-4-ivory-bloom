'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = filename => fs.readFileSync(path.join(root, filename), 'utf8');

function makeRoyalLoader(mode) {
  const scene = read('scene.js');
  const start = scene.indexOf('function loadArtwork(name) {');
  const end = scene.indexOf('async function loadAndAttachArtwork(name) {', start);
  assert.ok(start > 0 && end > start);
  const activeTimers = new Map();
  const failed = new Set();
  let nextTimer = 0;
  class ImageStub {
    set src(value) {
      this._src = value;
      if (mode === 'loaded') this.onload?.();
      if (mode === 'failed') this.onerror?.();
    }
    get src() { return this._src; }
  }
  const context = {
    goldenPagodaSkin: true, activeSkin:'golden-pagoda-garden',
    royalCoverCore:['sky.webp','palace-horizontal.webp','arch.webp'],
    skinAssetBase:'./assets/skins/golden-pagoda-garden/',
    REMOTE:'https://example.invalid/',forceRemote:false,
    failed,Image:ImageStub,
    setTimeout(cb,ms) { const id = ++nextTimer; activeTimers.set(id,{cb,ms}); return id; },
    clearTimeout(id) { activeTimers.delete(id); }
  };
  vm.runInNewContext(scene.slice(start,end)+'\nthis.loadArtwork = loadArtwork;',context);
  return {loadArtwork:context.loadArtwork,activeTimers,failed};
}

test('Royal core ready does not retain an image timeout', async () => {
  const ctx = makeRoyalLoader('loaded');
  const result = await ctx.loadArtwork('sky.webp');
  assert.equal(result.okay,true);
  assert.equal(ctx.failed.size,0);
  assert.equal(ctx.activeTimers.size,0);
});

test('Hung Royal core request terminates safely after the bounded deadline', async () => {
  const ctx = makeRoyalLoader('hung');
  const promise = ctx.loadArtwork('arch.webp');
  assert.equal(ctx.activeTimers.size,1);
  const [{cb,ms}] = [...ctx.activeTimers.values()];
  assert.equal(ms,20000);
  cb();
  const result = await promise;
  assert.equal(result.okay,false);
  assert.ok(ctx.failed.has('arch.webp'));
  assert.equal(ctx.activeTimers.size,0);
});

test('Royal core still gates first paint, ornament failure cannot blank it', () => {
  const scene = read('scene.js');
  assert.match(scene,/const royalCoverCore = \['sky\.webp', 'palace-horizontal\.webp', 'arch\.webp'\]/);
  assert.match(scene,/invite\.dataset\.layers = coreReady \? 'ready' : 'unavailable'/);
  assert.match(scene,/invite\.dataset\.ornaments = failed\.size \? 'partial' : 'complete'/);
  assert.match(scene,/Math\.min\(3, ornaments\.length\)/);
  assert.match(scene,/const rootStyle = heroViewport\.style/);
});

test('Royal later-section artwork is prewarmed, not a cover dependency', () => {
  const couple = read('section-couple-reference.js');
  const event = read('section-three.js');
  const html = read('index.html');
  assert.match(couple,/royalPrewarmQueue/);
  assert.match(couple,/rootMargin:'200% 0px 200% 0px'/);
  assert.match(couple,/queueRoyalPrewarm\(\(\) => \{ sceneProbe\.src/);
  assert.match(couple,/queueRoyalPrewarm\(\(\) => \{[\s\S]*?img\.src = item\.url/);
  assert.match(event,/paper\.loading = 'lazy'/);
  assert.match(html,/scene\.js\?v=20261121-load1/);
});

test('S8/S9 Royal split-wing WebPs wait until their section is near', async () => {
  const code = read('golden-pagoda-s08-s09-split-flutter.js');
  const requests = [], activated = [], observers = [];
  const gift = {classList:{add:n=>activated.push('S8:'+n)},querySelector:()=>null,insertBefore:()=>{}};
  const rsvp = {classList:{add:n=>activated.push('S9:'+n)},querySelector:()=>null,insertBefore:()=>{}};
  class ImageStub { constructor(){this.naturalWidth=1;} set src(url){requests.push(url);this.onload?.();} }
  class Observer {
    constructor(callback,options){this.callback=callback;this.options=options;observers.push(this);}
    observe() {} unobserve() {} disconnect() {}
  }
  const doc = {
    readyState:'complete',
    querySelector: selector=>selector==='#weddingGift'?gift:selector==='#rsvp'?rsvp:null,
    createElement:()=>({className:'',innerHTML:'',setAttribute:()=>{}})
  };
  vm.runInNewContext(code,{
    document:doc,window:{IntersectionObserver:Observer},location:{search:'?skin=golden-pagoda-garden'},
    URLSearchParams,Image:ImageStub,IntersectionObserver:Observer,Promise
  });
  assert.equal(requests.length,0,'Cover must not download distant wing parts');
  assert.equal(observers[0].options.rootMargin,'200% 0px 200% 0px');
  observers[0].callback([{isIntersecting:true,target:gift}]);
  for(let i=0;i<5;i++) await Promise.resolve();
  assert.equal(requests.length,3);
  assert.ok(activated.includes('S8:gp-s08-split-ready'));
  observers[0].callback([{isIntersecting:true,target:rsvp}]);
  for(let i=0;i<5;i++) await Promise.resolve();
  assert.equal(requests.length,6);
  assert.ok(activated.includes('S9:gp-s09-split-ready'));
});
