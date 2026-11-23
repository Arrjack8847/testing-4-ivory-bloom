import { test, expect } from '@playwright/test';

// Isolated Section 2 regression suite. Runs in the repository's existing
// 320/360/390/430 mobile projects; it does NOT invoke GitHub Actions.
const root = '/assets/skins/golden-pagoda-garden/section-02/';
const required = [
  'message-paper.webp',
  'message-canopy.webp',
  'lotus-left.webp',
  'lotus-right.webp',
  'closing-ornament.webp',
  's02-strict-decor-composite.svg'
];

test('S02 original geometry, asset decode, typography and screenshot', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/?skin=golden-pagoda-garden');
  await expect(page.getByRole('button', { name: 'Open Invitation' })).toBeVisible();
  await page.getByRole('button', { name: 'Open Invitation' }).click();
  await page.locator('#message').scrollIntoViewIfNeeded();
  await expect(page.locator('#message')).toHaveClass(/is-visible/);

  for (const name of required) {
    const response = await page.request.get(root + name);
    expect(response.status(), name).toBe(200);
  }

  const decoded = await page.evaluate(async url => {
    const im = new Image();
    im.src = url;
    try { await im.decode(); return im.naturalWidth > 0 && im.naturalHeight > 0; }
    catch { return false; }
  }, root + 's02-strict-decor-composite.svg');
  expect(decoded, 'embedded WebP composite must decode').toBe(true);

  const computed = await page.locator('#message').evaluate(section => {
    const frame = section.querySelector('.letter-frame');
    const lead = section.querySelector('.letter-lead');
    const outer = getComputedStyle(section);
    const inner = getComputedStyle(frame);
    const line = getComputedStyle(lead, '::after');
    return {
      minHeight: parseFloat(outer.minHeight),
      paddingTop: parseFloat(outer.paddingTop),
      paddingLeft: parseFloat(outer.paddingLeft),
      paddingBottom: parseFloat(outer.paddingBottom),
      width: section.getBoundingClientRect().width,
      frameWidth: frame.getBoundingClientRect().width,
      frameMinHeight: parseFloat(inner.minHeight),
      frameTop: frame.getBoundingClientRect().top - section.getBoundingClientRect().top,
      paper: outer.backgroundImage,
      composite: getComputedStyle(section,'::before').backgroundImage,
      separator: line.backgroundImage,
      separatorWidth: parseFloat(line.width),
      leadMarginBottom: parseFloat(getComputedStyle(lead).marginBottom),
      overflow: document.documentElement.scrollWidth - innerWidth
    };
  });

  const width = page.viewportSize().width;
  expect(computed.width).toBe(width);
  expect(computed.minHeight).toBe(width <= 350 ? 0 : 762);
  expect(computed.paddingTop).toBe(187);
  expect(computed.paddingLeft).toBe(22);
  expect(computed.paddingBottom).toBe(width <= 350 ? 80 : 78);
  expect(Math.abs(computed.frameWidth - (width - 44))).toBeLessThan(1);
  expect(computed.frameMinHeight).toBe(width <= 350 ? 556 : 495);
  expect(Math.abs(computed.frameTop - 187)).toBeLessThan(1);
  expect(computed.paper).toContain('message-paper.webp');
  expect(computed.composite).toContain('s02-strict-decor-composite.svg');
  expect(computed.separator).toContain('closing-ornament.webp');
  expect(computed.separatorWidth).toBe(114);
  expect(computed.leadMarginBottom).toBe(61);
  expect(computed.overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);

  await page.locator('#message').screenshot({
    path: testInfo.outputPath('royal-s02-' + width + '.png'),
    animations: 'disabled'
  });
});

test('S02 reverse scroll and reduced-motion compatibility', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/?skin=golden-pagoda-garden');
  await page.getByRole('button', { name: 'Open Invitation' }).click();
  const y = await page.locator('#message').evaluate(x => x.getBoundingClientRect().top + scrollY);
  await page.evaluate(v => scrollTo(0,v+150), y);
  await expect(page.locator('#message .letter-lead')).toBeVisible();
  await page.evaluate(v => scrollTo(0,v-130), y);
  await page.evaluate(v => scrollTo(0,v+260), y);
  const result = await page.locator('#message').evaluate(s => ({
    petal: getComputedStyle(s.querySelector('.letter-petal')).animationName,
    text: s.querySelector('.letter-lead').textContent,
    overflow: document.documentElement.scrollWidth - innerWidth
  }));
  expect(result.petal).toBe('none');
  expect(result.text).toContain('With grateful hearts');
  expect(result.overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('original Testing-4 default skin stays unaffected',async ({page}) => {
  await page.goto('/');
  const computed = await page.locator('#message').evaluate(s => ({
    background: getComputedStyle(s).backgroundImage,
    relief: getComputedStyle(s,'::before').backgroundImage,
    separator: getComputedStyle(s.querySelector('.letter-lead'),'::after').backgroundImage
  }));
  expect(computed.background).not.toContain('message-paper.webp');
  expect(computed.relief).not.toContain('s02-strict-decor-composite.svg');
  expect(computed.separator).not.toContain('closing-ornament.webp');
});
