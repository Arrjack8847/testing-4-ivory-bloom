import {test,expect} from '@playwright/test';

// Run locally on 320x568, 360x740, 390x844, 430x932:
// npx playwright test tests/royal-s01-final-polish.spec.mjs
// No GitHub Actions, and no Browser Use connector.
const url='/?skin=golden-pagoda-garden';
async function ready(page) {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','ready',{timeout:30000});
  await expect(page.locator('#invitation')).toHaveAttribute('data-ornaments','complete',{timeout:30000});
  await expect.poll(()=>page.locator('.depth.canopy .royal-drape-left').evaluate(el=>el.naturalWidth))
    .toBeGreaterThan(0);
  return errors;
}
test('both complete Royal curtains are independently anchored but use exactly the same WebP',async({page},testInfo)=>{
  const errors=await ready(page);
  const left=page.locator('.depth.canopy .royal-drape-left');
  const right=page.locator('.depth.canopy .royal-drape-right');
  await expect(left).toHaveCount(1);
  await expect(right).toHaveCount(1);
  const state=await page.evaluate(()=>{
    const l=document.querySelector('.royal-drape-left'),r=document.querySelector('.royal-drape-right');
    const css=el=>getComputedStyle(el);
    return {
      sameSource:l.currentSrc===r.currentSrc,
      widths:[l.naturalWidth,r.naturalWidth],
      heights:[l.naturalHeight,r.naturalHeight],
      leftClip:css(l).clipPath,rightClip:css(r).clipPath,
      leftAnimation:css(l).animationName,rightAnimation:css(r).animationName,
      leftDuration:css(l).animationDuration,rightDuration:css(r).animationDuration,
      horizontalOverflow:document.documentElement.scrollWidth-innerWidth
    };
  });
  expect(state.sameSource).toBe(true);
  expect(state.widths[0]).toBe(state.widths[1]);
  expect(state.heights[0]).toBe(state.heights[1]);
  expect(state.leftClip).toContain('50%');
  expect(state.rightClip).toContain('50%');
  expect(state.leftAnimation).toBe('royal-drape-left-breeze');
  expect(state.rightAnimation).toBe('royal-drape-right-breeze');
  expect(state.leftDuration).toBe('16.2s');
  expect(state.rightDuration).toBe('16.2s');
  expect(state.horizontalOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:testInfo.outputPath('royal-cover-two-curtains.png')});
  expect(errors).toEqual([]);
});

test('Royal garden motion uses six hanging and six rooted layers with independent live phases',async({page})=>{
  const errors=await ready(page);
  const data=await page.locator('#animatedScene').evaluate(el=>{
    const css=selector=>[...el.querySelectorAll(selector)]
      .filter(img=>img.naturalWidth>0)
      .map(img=>({animation:getComputedStyle(img).animationName,
        delay:getComputedStyle(img).animationDelay,origin:getComputedStyle(img).transformOrigin}));
    return {hanging:css('.sprite.hanging img.swing'),plants:css('.sprite.plant img.plant-sway')};
  });
  expect(data.hanging).toHaveLength(6);
  expect(data.plants).toHaveLength(6);
  expect(data.hanging.every(item=>item.animation==='royal-hanging-wind')).toBe(true);
  expect(data.plants.every(item=>item.animation==='royal-rooted-wind')).toBe(true);
  expect(new Set(data.hanging.map(item=>item.delay)).size).toBeGreaterThanOrEqual(4);
  expect(errors).toEqual([]);
});

test('tap camera and both completed Myanmar names stay pinned during forward/reverse reading',async({page},testInfo)=>{
  const errors=await ready(page);
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.documentElement).overflowY))
    .toBe('hidden');
  await page.locator('#openButton').click();
  await page.waitForTimeout(1100);
  await expect(page.locator('#invitation')).toHaveAttribute('data-state','opened');
  const H=await page.locator('#viewport').evaluate(el=>el.clientHeight);
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const scroll=async fraction=>{
    await page.evaluate(top=>scrollTo({top,behavior:'instant'}),Math.round(H*fraction));
    await expect.poll(()=>page.evaluate(()=>Math.round(scrollY))).toBeCloseTo(Math.round(H*fraction),-1);
  };
  await scroll(2.35);
  await expect.poll(()=>page.locator('#viewport').evaluate(el=>Number(el.style.getPropertyValue('--second-name-progress'))))
    .toBeGreaterThan(.99);
  const capture=()=>page.evaluate(()=>{
    const one=document.querySelector('#viewport .name-first');
    const two=document.querySelector('#viewport .name-second');
    return {firstY:one.getBoundingClientRect().y,secondY:two.getBoundingClientRect().y,
      firstTranslate:getComputedStyle(one).translate,secondTranslate:getComputedStyle(two).translate,
      horizontalOverflow:document.documentElement.scrollWidth-innerWidth};
  });
  const before=await capture();
  await page.screenshot({path:testInfo.outputPath('royal-names-held.png')});
  await scroll(2.85);
  const after=await capture();
  expect(Math.abs(after.firstY-before.firstY)).toBeLessThan(2);
  expect(Math.abs(after.secondY-before.secondY)).toBeLessThan(2);
  expect(before.firstTranslate).toContain('-2px');
  expect(before.secondTranslate).toContain('6px');
  expect(after.horizontalOverflow).toBeLessThanOrEqual(1);
  await scroll(.75);
  await scroll(2.35);
  const reversed=await capture();
  expect(Math.abs(reversed.firstY-before.firstY)).toBeLessThan(2);
  expect(Math.abs(reversed.secondY-before.secondY)).toBeLessThan(2);
  expect(errors).toEqual([]);
});

test('reduced motion shows all original curtain pixels without swinging',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors=await ready(page);
  const data=await page.evaluate(()=>[...document.querySelectorAll(
    '.royal-drape-left,.royal-drape-right,.sprite.hanging .swing,.sprite.plant .plant-sway')]
    .filter(el=>el.naturalWidth>0)
    .map(el=>getComputedStyle(el).animationName));
  expect(data.length).toBeGreaterThan(2);
  expect(data.every(name=>name==='none')).toBe(true);
  expect(errors).toEqual([]);
});
