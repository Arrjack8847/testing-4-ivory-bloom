import { test, expect } from '@playwright/test';

// Master review branch registers Royal S06 CSS in index.html; test the deployed integration directly.
const royalAssets = [
  'dress-paper.webp',
  'dress-top.webp',
  'dress-bottom.webp',
  'dress-floral.webp',
];
const royalRoot = '/assets/skins/golden-pagoda-garden/section-06/';
const expectedColours = [
  '#8a9a7b', '#b3c0a4', '#ede7d9',
  '#b4694f', '#dca79a', '#efddd1',
];

async function openRoyalDress(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?skin=golden-pagoda-garden');
  await expect(page.locator('html')).toHaveAttribute('data-golden-pagoda-skin', 'true');
  const dress = page.locator('#dressCode');
  await page.getByRole('button', { name: 'Open Invitation' }).tap();
  await expect(dress).toHaveJSProperty('inert', false);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.getElementById('dressCode').scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await expect(dress).toBeInViewport();
  await expect.poll(() => dress.getAttribute('data-scene-status'), { timeout: 10_000 }).toBe('loaded');
  return { dress, errors };
}

test('Royal Dress Code retains six exact swatches and readable palette layout', async ({ page }, testInfo) => {
  const { dress, errors } = await openRoyalDress(page);
  const actual = await dress.evaluate(section => {
    const palettes = [...section.querySelectorAll('.dress-palette')];
    const swatches = [...section.querySelectorAll('.dress-swatch')];
    const sectionBox = section.getBoundingClientRect();
    return {
      background: getComputedStyle(section).backgroundColor,
      names: palettes.map(e => e.querySelector('.dress-palette-name').textContent.trim()),
      swatches: swatches.map(e => e.style.getPropertyValue('--dress-colour').trim().toLowerCase()),
      swatchWidths: swatches.map(e => e.getBoundingClientRect().width),
      contentBounds: palettes.map(e => {
        const r = e.getBoundingClientRect();
        return [r.left, r.right];
      }),
      sectionBounds: [sectionBox.left, sectionBox.right],
      viewportWidth: innerWidth,
    };
  });
  expect(actual.background).toBe('rgb(246, 234, 217)');
  expect(actual.names).toEqual(['Sage Green & Cream', 'Terracotta & Blush']);
  expect(actual.swatches).toEqual(expectedColours);
  expect(actual.swatchWidths.every(w => w >= 28 && w <= 31)).toBe(true);
  expect(actual.sectionBounds[0]).toBeGreaterThanOrEqual(-1);
  expect(actual.sectionBounds[1]).toBeLessThanOrEqual(actual.viewportWidth + 1);
  for (const [left, right] of actual.contentBounds) {
    expect(left).toBeGreaterThanOrEqual(-1);
    expect(right).toBeLessThanOrEqual(actual.viewportWidth + 1);
  }
  await dress.screenshot({
    path: testInfo.outputPath('royal-dress-code.png'),
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});

test('Royal Dress Code loads all four local WebP assets without broken paths', async ({ page }) => {
  const { dress, errors } = await openRoyalDress(page);
  const paper = dress.locator('#dressSourceScene');
  await expect(paper).toHaveJSProperty('naturalWidth', 1024);
  await expect(paper).toHaveJSProperty('naturalHeight', 1024);
  await expect(paper).toHaveAttribute('src', '.' + royalRoot + 'dress-paper.webp');
  const bg = await dress.evaluate(section => ({
    floral: getComputedStyle(section.querySelector('.dress-art-original')).backgroundImage,
    top: getComputedStyle(section.querySelector('.dress-art'), '::before').backgroundImage,
    bottom: getComputedStyle(section.querySelector('.dress-art'), '::after').backgroundImage,
    paperVisibility: getComputedStyle(section.querySelector('#dressSourceScene')).display,
  }));
  expect(bg.floral).toContain('dress-floral.webp');
  expect(bg.top).toContain('dress-top.webp');
  expect(bg.bottom).toContain('dress-bottom.webp');
  expect(bg.paperVisibility).toBe('block');
  for (const name of royalAssets) {
    const response = await page.request.get(royalRoot + name);
    expect(response.status(), name).toBe(200);
    const body = await response.body();
    expect(body.subarray(0, 4).toString(), name).toBe('RIFF');
    expect(body.subarray(8, 12).toString(), name).toBe('WEBP');
  }
  expect(errors).toEqual([]);
});

test('Royal Dress Code survives repeated reverse-scroll entry', async ({ page }) => {
  const { dress, errors } = await openRoyalDress(page);
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.evaluate(() => document.getElementById('dressCode').scrollIntoView({
      block: 'start', behavior: 'instant',
    }));
    await expect(dress).toBeInViewport();
    await expect(dress.locator('.dress-swatch')).toHaveCount(6);
    await expect(dress).toHaveAttribute('data-scene-status', 'loaded');
  }
  expect(errors).toEqual([]);
});

test('Royal Dress Code reduced motion keeps paper static and all labels visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { dress, errors } = await openRoyalDress(page);
  const state = await dress.evaluate(section => ({
    camera: getComputedStyle(section.querySelector('.dress-art')).transform,
    wingAnimation: getComputedStyle(section.querySelector('.dress-flight-wing-left')).animationName,
    headingOpacity: getComputedStyle(section.querySelector('.dress-heading')).opacity,
    paletteCount: section.querySelectorAll('.dress-palette').length,
  }));
  expect(state.camera).toBe('none');
  expect(state.wingAnimation).toBe('none');
  expect(state.headingOpacity).toBe('1');
  expect(state.paletteCount).toBe(2);
  expect(errors).toEqual([]);
});

test('Default skin remains unaffected when Royal CSS is available', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const dress = page.locator('#dressCode');
  await expect(page.locator('html')).not.toHaveAttribute('data-golden-pagoda-skin', 'true');
  await page.getByRole('button', { name: 'Open Invitation' }).tap();
  await expect(dress.locator('#dressSourceScene')).toHaveAttribute('src', './assets/section6/paper.webp');
  await expect(dress.locator('.dress-swatch')).toHaveCount(6);
  expect(errors).toEqual([]);
});
