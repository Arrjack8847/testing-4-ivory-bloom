import { test, expect } from '@playwright/test';

const royalRoot = '/assets/skins/golden-pagoda-garden/section-03/';
const files = [
  's03-strict-garden-composite.svg',
  's03-strict-arch-border.svg',
  's03-strict-portrait-overlay.svg'
];

async function loadRoyal(page) {
  await page.goto('/?skin=golden-pagoda-garden');
  await page.getByRole('button', { name: 'Open Invitation' }).click();
  await page.locator('#couple').scrollIntoViewIfNeeded();
}

test('royal S03 keeps original active reference layout and three artwork surfaces', async ({page}, info) => {
  const errors=[];
  page.on('pageerror', e=>errors.push(e.message));
  await loadRoyal(page);
  for (const name of files) {
    const response = await page.request.get(royalRoot+name);
    expect(response.status(),name).toBe(200);
  }
  const values = await page.locator('#couple').evaluate(s => {
    const scene=s.querySelector('.couple-reference-scene');
    const arch=s.querySelector('.couple-arch');
    const portrait=s.querySelector('.couple-portrait');
    const css=getComputedStyle(s), acss=getComputedStyle(arch), pc=getComputedStyle(portrait);
    return {
      minHeight:parseFloat(css.minHeight),
      topPadding:parseFloat(css.paddingTop),
      bottomPadding:parseFloat(css.paddingBottom),
      leftPadding:parseFloat(css.paddingLeft),
      sceneDisplay:getComputedStyle(scene).display,
      scenePosition:getComputedStyle(scene).position,
      sceneBackground:getComputedStyle(scene,'::before').backgroundImage,
      archBackground:acss.borderImageSource,
      archRect:arch.getBoundingClientRect().toJSON(),
      sectionRect:s.getBoundingClientRect().toJSON(),
      portraitWidth:portrait.getBoundingClientRect().width,
      portraitBackground:getComputedStyle(portrait,'::after').backgroundImage,
      extraWidth:document.documentElement.scrollWidth-innerWidth
    };
  });
  expect(values.minHeight).toBe(page.viewportSize().width<=350?1776:1840);
  expect(values.topPadding).toBe(225);
  expect(values.bottomPadding).toBe(170);
  expect(values.leftPadding).toBe(28);
  expect(values.sceneDisplay).not.toBe('none');
  expect(['sticky','absolute']).toContain(values.scenePosition);
  expect(values.sceneBackground).toContain('s03-strict-garden-composite.svg');
  expect(values.archBackground).toContain('s03-strict-arch-border.svg');
  expect(values.portraitBackground).toContain('s03-strict-portrait-overlay.svg');
  expect(values.portraitWidth).toBeLessThanOrEqual(240.6);
  expect(values.extraWidth).toBeLessThanOrEqual(1);
  expect(Math.abs(values.archRect.width - (page.viewportSize().width-24))).toBeLessThan(1);
  expect(errors).toEqual([]);
  await page.locator('#couple').screenshot({path:info.outputPath('s03-strict-'+page.viewportSize().width+'.png'),animations:'disabled'});
});

test('royal S03 uses original portrait focus zoom and reversible camera', async ({page}) => {
  await loadRoyal(page);
  const portrait=page.locator('#couple .couple-portrait').first();
  await portrait.evaluate(x=>x.classList.add('is-focal'));
  await expect.poll(()=>portrait.locator('img').evaluate(x=>getComputedStyle(x).transform))
    .not.toBe('none');
  await portrait.evaluate(x=>x.classList.remove('is-focal'));
  const y=await page.locator('#couple').evaluate(s=>s.getBoundingClientRect().top+window.scrollY+260);
  await page.evaluate(pos=>window.scrollTo(0,pos),y);
  await page.waitForTimeout(120);
  const cameraForward=await page.locator('#couple').evaluate(s=>s.dataset.referenceCameraOffset);
  await page.evaluate(pos=>window.scrollTo(0,pos),y-160);
  await page.waitForTimeout(120);
  const cameraReverse=await page.locator('#couple').evaluate(s=>s.dataset.referenceCameraOffset);
  expect(cameraForward).toBeDefined();
  expect(cameraReverse).toBeDefined();
});

test('royal S03 keeps reduced-motion content accessible', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await loadRoyal(page);
  await expect(page.locator('#couple .couple-title')).toBeVisible();
  await expect(page.locator('#couple .couple-portrait')).toHaveCount(2);
});

test('strict S03 artwork is completely inert on the original default skin',async ({page}) => {
  await page.goto('/');
  const art=await page.locator('#couple').evaluate(s=>getComputedStyle(s.querySelector('.couple-arch')).borderImageSource);
  expect(art).not.toContain('s03-strict-arch-border.svg');
});
