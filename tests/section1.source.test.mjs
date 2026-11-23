import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync('index.html','utf8');
test('Section 1 contains a full interactive cover and scroll track',()=>{
  for(const id of ['openButton','sceneTrack','animatedScene','viewport','cover','opened','swipeCue','next']){
    assert.match(html,new RegExp('id="'+id+'"'),id);
  }
  assert.match(html,/openButton\.addEventListener\('click', openInvitation\)/);
  assert.match(html,/addEventListener\('scroll', scrollHandler/);
  assert.match(html,/window\.ivoryBloomSection1/);
});
test('all approved on-screen image slots resolve locally',()=>{
  for(const filename of ['sky.webp','palace-horizontal.webp','arch.webp','drape.webp',
    'hang_1.webp','hang_3.webp','hang_4.webp','spike_3.webp','spike_4.webp','spike_5.webp',
    'stem_1.webp','stem_2.webp','leaf_4.webp','leaf_5.webp','leaf_6.webp','peacock.webp',
    'bfly_1.webp','bfly_white.webp','royal-name-divider.webp','royal-open-button.webp']){
    assert.ok(html.includes(filename),filename);
  }
  assert.match(html,/const base = '\.\/assets\/ivory-bloom\//);
});
test('Golden Pagoda scene checkpoints retained in Ivory Bloom',()=>{
  for(const expr of ['smooth(fraction, 1.34, 1.49)','smooth(fraction, 1.51, 1.67)',
    'smooth(fraction, 1.69, 1.79)','smooth(fraction, 1.81, 1.98)',
    'smooth(fraction, 2.02, 2.22)','Math.exp(-dt / 70)']){
    assert.ok(html.includes(expr),expr);
  }
  assert.match(html,/canopy-soft 16\.2s/);
  assert.match(html,/royal-hanging-wind/);
  assert.match(html,/royal-rooted-wind/);
  assert.match(html,/height:425vh;height:425lvh/);
});
test('avoid remote hotlinks and unrelated private projects',()=>{
  assert.doesNotMatch(html,/undangankahwin\.com|testing-4-golden-pagoda-garden|https:\/\/raw\.githubusercontent\.com/);
});
test('keyboard and reduced-motion paths retained',()=>{
  assert.match(html,/prefers-reduced-motion:reduce/);
  assert.match(html,/:focus-visible/);
  assert.match(html,/event\?\.detail === 0/);
  assert.match(html,/opened\.inert = false/);
});

test('iPhone cover: continuous canopy, visible gateway, safe CTA and outer flutter',()=>{
  assert.match(html,/img\.royal-drape-left\{clip-path:none/);
  assert.match(html,/img\.royal-drape-right\{display:none\}/);
  assert.match(html,/top:min\(77%, calc\(100dvh - 78px\)\)/);
  assert.match(html,/bottom:7%;left:50%;height:auto;width:clamp\(420px,120%,560px\)/);
  assert.match(html,/set\('frame-scroll-scale', \(1\.08 - \.08 \* frameChange\)/);
  assert.match(html,/\.invitation\[data-state='cover'\] \.sprite\.plant\{opacity:\.76\}/);
  assert.match(html,/id === 'coverButterflies' \? \(idx \? '84%' : '10%'\)/);
  assert.doesNotMatch(html,/top:53%;left:50%;translate:-50% 0;/);
});
