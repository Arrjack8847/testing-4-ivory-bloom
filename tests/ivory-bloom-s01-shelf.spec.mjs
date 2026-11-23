import { test, expect } from '@playwright/test';

// Section 1 ivory shelf regression. The primary defect was an inherited
// .animated-scene::after { inset: 0 } rule, which pinned a fixed-size shelf
// to the TOP despite specifying bottom: 0. Test computed geometry rather than
// screenshot color alone, because the shelf WebP has transparent margins.
const mobileSizes = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 393, height: 852 },
  { width: 430, height: 932 },
];

test('Ivory shelf stays at the bottom, behind cover controls, then exits', async ({ page }, testInfo) => {
  // One project checks the five sizes; other existing projects keep their own
  // reference tests without duplicating this matrix.
  test.skip(testInfo.project.name !== 'iphone-390', 'Shelf-specific five-size matrix runs on one browser project');

  for (const size of mobileSizes) {
    await page.setViewportSize(size);
    await page.goto('/?skin=golden-pagoda-garden');
    await page.waitForFunction(() => {
      const invitation = document.getElementById('invitation');
      return invitation?.dataset.layers === 'ready' && invitation.dataset.state === 'cover';
    }, null, { timeout: 25_000 });

    const measurements = await page.evaluate(() => {
      const viewport = document.getElementById('viewport');
      const scene = viewport.querySelector('.animated-scene');
      const pseudo = getComputedStyle(scene, '::after');
      const s = scene.getBoundingClientRect();
      const v = viewport.getBoundingClientRect();
      const top = Number.parseFloat(pseudo.top);
      const height = Number.parseFloat(pseudo.height);
      return {
        shelfTop: s.top + top,
        shelfBottom: s.top + top + height,
        viewportTop: v.top,
        viewportBottom: v.bottom,
        viewportWidth: v.width,
        shelfWidth: Number.parseFloat(pseudo.width),
        shelfOpacity: Number.parseFloat(pseudo.opacity),
        blend: pseudo.mixBlendMode,
        image: pseudo.backgroundImage,
      };
    });

    expect(measurements.image).toContain('s01-ivory-bottom-shelf.webp');
    expect(measurements.blend).toBe('normal');
    expect(measurements.shelfOpacity).toBeGreaterThan(0.99);
    expect(measurements.shelfTop).toBeGreaterThan(measurements.viewportTop + 0.75 * size.height);
    expect(Math.abs(measurements.shelfBottom - measurements.viewportBottom)).toBeLessThan(3);
    expect(Math.abs(measurements.shelfWidth - measurements.viewportWidth)).toBeLessThan(2);

    const button = page.locator('#openButton');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await page.screenshot({ path: testInfo.outputPath(`ivory-shelf-cover-${size.width}x${size.height}.png`) });
    await button.click();
    await expect(page.locator('#invitation')).toHaveAttribute('data-state', 'opened');
    await expect.poll(async () => page.locator('.animated-scene').evaluate(
      el => Number.parseFloat(getComputedStyle(el, '::after').opacity)
    ), { timeout: 3000 }).toBeLessThan(0.02);
    await page.screenshot({ path: testInfo.outputPath(`ivory-shelf-opened-${size.width}x${size.height}.png`) });
  }

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?skin=golden-pagoda-garden');
  await page.waitForFunction(() => document.getElementById('invitation')?.dataset.layers === 'ready');
  const reduced = await page.locator('.animated-scene').evaluate(el =>
    getComputedStyle(el, '::after').transitionDuration
  );
  expect(reduced).toBe('0s');
});
