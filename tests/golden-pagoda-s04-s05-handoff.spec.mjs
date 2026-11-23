import { test, expect } from '@playwright/test';

async function openAtSeam(page) {
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  await page.goto('/?skin=golden-pagoda-garden');
  await page.getByRole('button', { name: 'Open Invitation' }).click();
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    const top = document.getElementById('runningOrder').getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top - innerHeight * .5, behavior: 'instant' });
  });
  return errors;
}

test('Royal Events ornament clears the boundary and both paper tones blend', async ({ page }, testInfo) => {
  const errors = await openAtSeam(page);
  const metrics = await page.evaluate(() => {
    const events = document.getElementById('eventDetails');
    const order = document.getElementById('runningOrder');
    const ornamentParent = events.querySelector('.event-countdown');
    const deco = getComputedStyle(ornamentParent, '::after');
    const last = ornamentParent.getBoundingClientRect();
    const e = events.getBoundingClientRect();
    const o = order.getBoundingClientRect();
    return {
      adjacent: events.nextElementSibling === order,
      gap: o.top - e.bottom,
      decorationBottom: last.top + parseFloat(deco.top) + parseFloat(deco.height),
      eventBottom: e.bottom,
      reservedBottom: parseFloat(getComputedStyle(ornamentParent).marginBottom),
      eventFade: getComputedStyle(events, '::after').backgroundImage,
      orderFade: getComputedStyle(order, '::before').backgroundImage,
      sectionWidth: o.width,
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  });
  expect(metrics.adjacent).toBe(true);
  expect(Math.abs(metrics.gap)).toBeLessThanOrEqual(1.5);
  expect(metrics.decorationBottom).toBeLessThanOrEqual(metrics.eventBottom - 1);
  expect(metrics.reservedBottom).toBeGreaterThanOrEqual(154);
  expect(metrics.eventFade).toContain('linear-gradient');
  expect(metrics.orderFade).toContain('linear-gradient');
  expect(metrics.sectionWidth).toBeLessThanOrEqual(page.viewportSize().width + 1);
  expect(metrics.overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: testInfo.outputPath('s04-s05-royal-handoff-' + testInfo.project.name + '.png'), animations: 'disabled' });
  expect(errors).toEqual([]);
});

test('Royal timeline prewarms artwork near entry and skips the hidden reference camera', async ({ page }) => {
  const errors = await openAtSeam(page);
  const order = page.locator('#runningOrder');
  await expect(order).toHaveAttribute('data-royal-prewarm', 'started');
  await expect(order).toHaveAttribute('data-royal-assets', 'ready');
  await expect(order.locator('.order-royal-art')).toHaveCount(4);
  expect(await order.locator('.order-royal-art').evaluateAll(items =>
    items.every(img => img.complete && img.naturalWidth > 0))).toBe(true);
  await expect(order).toHaveAttribute('data-order-camera-mode', 'disabled-royal');
  const first = await order.evaluate(el => ({camera:el.dataset.orderCamera, stage:el.style.getPropertyValue('--order-stage-y')}));
  await page.evaluate(() => { const e=document.getElementById('runningOrder'); const top=e.getBoundingClientRect().top+scrollY; scrollTo({top:top+180,behavior:'instant'}); });
  await page.waitForTimeout(120);
  await page.evaluate(() => { const e=document.getElementById('runningOrder'); const top=e.getBoundingClientRect().top+scrollY; scrollTo({top:top-150,behavior:'instant'}); });
  await page.waitForTimeout(120);
  const last = await order.evaluate(el => ({camera:el.dataset.orderCamera,stage:el.style.getPropertyValue('--order-stage-y')}));
  expect(last).toEqual(first);
  expect(last.camera).toBe('0');
  expect(last.stage).toBe('');
  expect(errors).toEqual([]);
});

test('reduced motion still shows all Royal Timeline copy and ornaments', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors = await openAtSeam(page);
  const order = page.locator('#runningOrder');
  await expect(order).not.toHaveAttribute('data-reveal-ready');
  await expect(order.locator('.order-heading')).toHaveCSS('opacity', '1');
  await expect(order.locator('.order-royal-floral')).toHaveCSS('animation-name', 'none');
  await expect(order).toHaveAttribute('data-order-camera', '0');
  expect(errors).toEqual([]);
});
