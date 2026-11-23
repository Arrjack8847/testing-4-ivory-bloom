import {test,expect} from '@playwright/test';

// Royal-specific performance regressions. Run locally (never via GitHub Actions)
// on all four configured mobile profiles, with real animations enabled.
const url = '/?skin=golden-pagoda-garden';
const core = ['.sky-layer img', '.depth.palace img', '.depth.arch img'];

test('the three essential Royal layers paint while optional ornament fails',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/assets/skins/golden-pagoda-garden/hang_1.webp',route=>route.abort());
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','ready',{timeout:30000});
  await expect(page.locator('#invitation')).toHaveAttribute('data-ornaments','partial',{timeout:30000});
  await expect(page.locator('#networkNote')).toBeHidden();
  for(const selector of core) {
    await expect.poll(()=>page.locator('#animatedScene '+selector).first().evaluate(img=>img.naturalWidth)).toBeGreaterThan(0);
  }
  await page.locator('#openButton').click();
  await expect(page.locator('#invitation')).toHaveAttribute('data-state','opened');
  expect(errors).toEqual([]);
});

test('a missing Royal palace is recoverable and never blocks invitation text or CTA',async({page})=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/assets/skins/golden-pagoda-garden/palace-horizontal.webp',route=>route.abort());
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','unavailable',{timeout:30000});
  await expect(page.locator('#invitation')).toHaveAttribute('data-ornaments','unavailable');
  await expect(page.locator('#networkNote')).toBeVisible();
  await expect(page.locator('#cover')).toBeVisible();
  await page.locator('#openButton').click();
  await expect(page.locator('#invitation')).toHaveAttribute('data-state','opened');
  expect(errors).toEqual([]);
});

// Send an actual mobile compositor gesture instead of relying on scrollTo():
// programmatic scroll can succeed even when user touch scrolling is locked.
// This spec uses the Chromium CDP on the configured four phone profiles.
async function swipeUp(page) {
  const size = page.viewportSize();
  const x = Math.round(size.width * .53);
  const startY = Math.round(size.height * .82);
  const distance = Math.round(size.height * .55);
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('Input.dispatchTouchEvent',{
      type:'touchStart',touchPoints:[{x,y:startY,id:0}]
    });
    for (let i=1;i<=12;i++) {
      await session.send('Input.dispatchTouchEvent',{
        type:'touchMove',
        touchPoints:[{x,y:startY-Math.round(distance*i/12),id:0}]
      });
      await page.waitForTimeout(16);
    }
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  } finally {
    await session.detach();
  }
}

test('the unopened cover blocks real swipes; the opened invitation scrolls natively',async({page})=>{
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','ready',{timeout:30000});
  await expect(page.locator('html')).toHaveClass(/invitation-cover-locked/);
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.body).position)).toBe('fixed');
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.documentElement).overflowY)).toBe('hidden');

  await swipeUp(page);
  await page.waitForTimeout(250);
  expect(await page.evaluate(()=>window.scrollY)).toBe(0);
  await page.mouse.wheel(0,500);
  await page.waitForTimeout(100);
  expect(await page.evaluate(()=>window.scrollY)).toBe(0);

  // The cover CTA must remain tappable; removing listeners must restore
  // genuinely native scrolling, not just switch a CSS property.
  await page.locator('#openButton').click();
  await expect(page.locator('#invitation')).toHaveAttribute('data-state','opened');
  await expect(page.locator('html')).not.toHaveClass(/invitation-cover-locked/);
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.body).position)).not.toBe('fixed');
  await expect.poll(()=>page.evaluate(()=>getComputedStyle(document.documentElement).overflowY)).toBe('auto');
  await swipeUp(page);
  await expect.poll(()=>page.evaluate(()=>window.scrollY)).toBeGreaterThan(25);
});
