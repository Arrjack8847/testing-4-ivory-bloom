import {test, expect} from '@playwright/test';

// Run locally on all four configured phones. No GitHub Actions or Browser Use.
const royal = '/?skin=golden-pagoda-garden';

test('Royal S01 camera eases toward scroll while Myanmar names follow exact progress', async ({page}) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(royal, {waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','ready',{timeout:30000});
  await page.locator('#openButton').click();
  // Cover opening has its own 1050ms one-time transition.
  await page.waitForTimeout(1150);
  const frames = await page.evaluate(async () => {
    const scene = document.getElementById('viewport');
    const read = name => Number(scene.style.getPropertyValue(name));
    window.scrollTo({top:scene.clientHeight * 1.6,behavior:'instant'});
    const samples = [];
    for (let i=0;i<18;i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
      samples.push({camera:read('--royal-core-retreat'),
        name:read('--first-name-progress')});
    }
    return samples;
  });
  expect(frames.some(p => p.name > .2 && p.camera < .95)).toBe(true);
  expect(frames.at(-1).camera).toBeGreaterThan(frames[2].camera);
  await expect.poll(() => page.locator('#viewport').evaluate(el =>
    Number(el.style.getPropertyValue('--royal-core-retreat')))).toBeGreaterThan(.995);
  await expect(page.locator('#invitation')).toHaveAttribute('data-scroll-active','yes');
  expect(errors).toEqual([]);
});

test('Royal S01 petals use a bounded canvas at mobile device pixel ratios', async ({page}) => {
  await page.goto(royal, {waitUntil:'domcontentloaded'});
  const canvas = page.locator('#globalPetalCanvas');
  await expect(canvas).toBeVisible();
  const stats = await canvas.evaluate(el => ({
    cssWidth:el.getBoundingClientRect().width,
    pixels:el.width,
    ratio:el.width/el.getBoundingClientRect().width
  }));
  expect(stats.cssWidth).toBeGreaterThan(300);
  expect(stats.ratio).toBeGreaterThanOrEqual(1);
  expect(stats.ratio).toBeLessThanOrEqual(1.51);
});
