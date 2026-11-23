import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const out='artwork-review/release-camera';
mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const profiles=[
  {name:'small-320',width:320,height:568,scale:2},
  {name:'android-360',width:360,height:740,scale:3},
  {name:'iphone-390',width:390,height:844,scale:3},
  {name:'large-430',width:430,height:932,scale:3}
];
const expected=[
 'sky.webp','palace-horizontal.webp','arch.webp','drape.webp','peacock.webp',
 'hang_3.webp','spike_3.webp','hang_1.webp','hang_4.webp','spike_4.webp',
 'spike_5.webp','stem_1.webp','stem_2.webp','leaf_4.webp','leaf_5.webp','leaf_6.webp'
];
const results=[];
const assert=(condition,description,detail={})=>{
  if(!condition)throw new Error(description+' '+JSON.stringify(detail));
};
const nearly=(a,b,tolerance=2)=>Math.abs(a-b)<=tolerance;
for(const profile of profiles) {
  const context=await browser.newContext({
    viewport:{width:profile.width,height:profile.height},
    deviceScaleFactor:profile.scale,isMobile:true,hasTouch:true,
    locale:'en-US'
  });
  const page=await context.newPage();
  const errors=[],badRequests=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{
    if(r.url().includes('/assets/skins/golden-pagoda-garden/') && r.status()>=400)
      badRequests.push(r.status()+' '+r.url());
  });
  await page.goto('http://127.0.0.1:8000/?skin=golden-pagoda-garden',
    {waitUntil:'domcontentloaded'});
  await page.addStyleTag({content:'html{scroll-behavior:auto!important}'});
  await page.waitForFunction(()=>document.querySelector('#invitation')?.dataset.layers==='ready',
    null,{timeout:22000});
  const sprites=await page.evaluate(async names=>{
    const root='./assets/skins/golden-pagoda-garden/';
    return await Promise.all(names.map(async name=>{
      const img=new Image();
      img.src=root+name;
      await img.decode();
      return {name,width:img.naturalWidth,height:img.naturalHeight};
    }));
  },[...expected,'bfly_1.webp','bfly_white.webp']);
  assert(sprites.length===18&&sprites.every(x=>x.width>0&&x.height>0),
    'Missing or empty WebP',sprites);
  const snapshot=async position=>{
    await page.waitForTimeout(760);
    const state=await page.evaluate(()=>{
      const rect=selector=>{
        const el=document.querySelector(selector);
        if(!el)return null;
        const r=el.getBoundingClientRect();
        return {x:+r.x.toFixed(2),y:+r.y.toFixed(2),
          width:+r.width.toFixed(2),height:+r.height.toFixed(2)};
      };
      const src=selector=>document.querySelector(selector)?.currentSrc||'';
      return {
        invite:document.querySelector('#invitation')?.dataset.state,
        layers:document.querySelector('#invitation')?.dataset.layers,
        selected:document.documentElement.dataset.goldenPagodaSkin,
        scrollY,
        viewport:{width:innerWidth,height:innerHeight},
        stage:rect('#stage'),
        pagoda:rect('#animatedScene .depth.palace img'),
        palaceSrc:src('#animatedScene .depth.palace img'),
        skySrc:src('#animatedScene .sky-layer img'),
        archSrc:src('#animatedScene .depth.arch img'),
        peacocks:[...document.querySelectorAll('#animatedScene .peacock-sprite img')]
          .map(img=>({src:img.currentSrc,visible:getComputedStyle(img.parentElement).display!=='none'})),
        butterflies:[...document.querySelectorAll('.butterfly')]
          .map(el=>el.style.getPropertyValue('--fly-image')),
        oldTrees:[...document.querySelectorAll('#animatedScene .depth.tree')]
          .some(el=>getComputedStyle(el).display!=='none'),
        oldReeds:[...document.querySelectorAll('#animatedScene .depth.reeds')]
          .some(el=>getComputedStyle(el).display!=='none'),
        masterShown:getComputedStyle(document.querySelector('#masterArt')).display!=='none'
      };
    });
    assert(state.layers==='ready'&&state.selected==='true',profile.name+' release skin not ready',state);
    assert(state.palaceSrc.endsWith('/palace-horizontal.webp')&&
      state.skySrc.endsWith('/sky.webp')&&state.archSrc.endsWith('/arch.webp'),
      profile.name+' incorrect imagery',state);
    assert(state.peacocks.length===2&&state.peacocks.every(x=>
      x.visible&&x.src.endsWith('/peacock.webp')),
      profile.name+' missing peacocks',state);
    assert(state.butterflies.length===4&&state.butterflies.every(s=>
      s.includes('/assets/skins/golden-pagoda-garden/')),
      profile.name+' butterfly mapping is not local',state);
    assert(!state.oldTrees&&!state.oldReeds&&!state.masterShown,
      profile.name+' duplicate old layers',state);
    assert(state.pagoda?.width>profile.width && state.pagoda?.height>profile.height*.5,
      profile.name+' horizontal scene not sized',state);
    await page.screenshot({path:join(out,profile.name+'-'+position+'.jpg'),
      type:'jpeg',quality:76,fullPage:false});
    results.push({profile:profile.name,position,...state});
    return state;
  };
  const cover=await snapshot('cover');
  const choreography=async()=>page.evaluate(()=>{
    const style=selector=>getComputedStyle(document.querySelector(selector));
    return {
      gateway:+style('#animatedScene .depth.arch').opacity,
      canopy:+style('#animatedScene .depth.canopy').opacity,
      peacock:+style('#animatedScene .peacock-sprite').opacity,
      hanging:+style('#animatedScene .sprite.hanging').opacity,
      butterfly:style('.butterfly-cover .violet').animationName,
      wing:style('.butterfly-cover .violet .butterfly-wing-l').animationName,
      flower:style('#animatedScene .sprite.hanging .swing').animationName,
      coverButterflies:+style('.butterfly-cover').opacity,
      heroButterflies:+style('.butterfly-hero').opacity
    };
  });
  const coverLayers=await choreography();
  assert(coverLayers.gateway>.9&&coverLayers.canopy>.9&&
    coverLayers.butterfly!=='none'&&coverLayers.wing!=='none'&&
    coverLayers.flower!=='none',
    profile.name+' cover gateway/butterfly/garden choreography missing',coverLayers);
  await page.locator('#openButton').click();
  await page.waitForFunction(()=>document.querySelector('#invitation')?.dataset.state==='opened',
    null,{timeout:12000});
  // Opening must be real, continuous motion — not a jump masked by two
  // screenshots. The heavy 4:3 artwork moves via composited translate/scale,
  // and its bottom layout anchor remains constant throughout.
  const motion=async()=>page.evaluate(()=>{
    const img=document.querySelector('#animatedScene .depth.palace img');
    const r=img.getBoundingClientRect(),s=getComputedStyle(img);
    return {y:r.y,width:r.width,bottom:s.bottom,translate:s.translate,
      transition:s.transitionProperty};
  });
  await page.waitForTimeout(430);
  const early=await motion();
  await page.waitForTimeout(570);
  const middle=await motion();
  assert(early.bottom===middle.bottom&&early.transition.includes('translate')&&
    !early.transition.includes('bottom'),
    profile.name+' panorama should animate without layout-bottom transitions',{early,middle});
  assert(early.width>cover.pagoda.width+5&&middle.width>early.width+5&&
    early.y<cover.pagoda.y-5&&middle.y<early.y-5,
    profile.name+' pagoda/lake opening did not progress smoothly',
    {start:cover.pagoda,early,middle});
  await page.waitForTimeout(350);
  const opened=await snapshot('opened');
  const openedLayers=await choreography();
  assert(openedLayers.gateway<.08&&openedLayers.canopy<.08&&
    openedLayers.peacock<.08,
    profile.name+' opening should reveal the uncluttered pagoda and lake',openedLayers);
  assert(opened.pagoda.width>=middle.width-2&&opened.pagoda.y<=middle.y+2,
    profile.name+' opening did not settle monotonically',{early,middle,opened:opened.pagoda});
  await page.evaluate(()=>window.scrollTo(0,Math.round(
    document.querySelector('#viewport').clientHeight*1.5)));
  await page.waitForTimeout(1500);
  const scrolled=await snapshot('scroll-1p5h');
  const scrolledLayers=await choreography();
  assert(scrolledLayers.gateway>.9&&scrolledLayers.canopy>.9&&
    scrolledLayers.peacock>.9&&scrolledLayers.hanging>.9,
    profile.name+' scroll must restore ceremonial gateway, peacocks and flowers',
    scrolledLayers);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(850);
  const reverse=await snapshot('reverse-top');
  const reverseLayers=await choreography();
  assert(reverseLayers.gateway<.08&&reverseLayers.canopy<.08&&
    reverseLayers.peacock<.08,
    profile.name+' reverse scroll must return to the opened lake',reverseLayers);
  const h=cover.stage.height,sy=cover.stage.y;
  assert(cover.pagoda.y>=sy+.29*h&&cover.pagoda.y<=sy+.40*h,
    profile.name+' pagoda overlaps cover typography',cover.pagoda);
  assert(opened.pagoda.y<=sy+.10*h &&
    opened.pagoda.y+opened.pagoda.height>=sy+.96*h,
    profile.name+' temple/lake plate clipped after opening',opened.pagoda);
  for(const [a,b] of [[cover,scrolled],[opened,reverse]]) {
    for(const dim of ['x','y','width','height'])
      assert(nearly(a.pagoda[dim],b.pagoda[dim]),
        profile.name+' forward/reverse camera geometry drift '+dim,
        {a:a.pagoda,b:b.pagoda});
  }
  assert(errors.length===0,profile.name+' JavaScript errors',errors);
  assert(badRequests.length===0,profile.name+' missing skin assets',badRequests);
  // A fast first swipe must switch to deterministic scroll geometry before the
  // long opening easing finishes. Returning to scroll 0 must not re-arm easing.
  await page.goto('http://127.0.0.1:8000/?skin=golden-pagoda-garden',
    {waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#invitation')?.dataset.layers==='ready');
  await page.locator('#openButton').click();
  await page.waitForTimeout(120);
  await page.evaluate(()=>window.scrollTo(0,Math.round(
    document.querySelector('#viewport').clientHeight*.6)));
  await page.waitForFunction(()=>document.querySelector('#invitation')?.dataset.scrollActive==='yes',
    null,{timeout:3500});
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(240);
  const fastReverse=await page.evaluate(()=>{
    const img=document.querySelector('#animatedScene .depth.palace img');
    const r=img.getBoundingClientRect(),style=getComputedStyle(img);
    return {state:document.querySelector('#invitation').dataset.state,
      scrollActive:document.querySelector('#invitation').dataset.scrollActive,
      scrollY,transition:style.transitionDuration,
      rect:{x:r.x,y:r.y,width:r.width,height:r.height}};
  });
  assert(fastReverse.state==='opened'&&fastReverse.scrollActive==='yes'&&
    fastReverse.scrollY===0&&
    fastReverse.transition.split(',').every(x=>parseFloat(x)===0),
    profile.name+' first swipe re-armed opening transition',fastReverse);
  for(const dim of ['x','y','width','height'])
    assert(nearly(fastReverse.rect[dim],opened.pagoda[dim],2),
      profile.name+' early-swipe reverse camera drift '+dim,
      {fast:fastReverse.rect,opened:opened.pagoda});
  assert(errors.length===0&&badRequests.length===0,
    profile.name+' early swipe produced script errors or 404s',{errors,badRequests});
  // Ensure the base invitation still opens without this skin attribute.
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'domcontentloaded'});
  const baseSelected=await page.evaluate(()=>
    document.documentElement.hasAttribute('data-golden-pagoda-skin'));
  assert(!baseSelected,profile.name+' default template activated the royal skin');
  await context.close();
  console.log('PASS '+profile.name+': 4 camera states, 18 WebPs, opening, reverse and baseline isolation');
}
await browser.close();
writeFileSync(join(out,'geometry.json'),JSON.stringify({profiles:profiles.length,
  states:results.length,errors:0,results},null,2)+'\n');
console.log('PASS: '+results.length+' release scene captures across 4 mobile viewports.');
