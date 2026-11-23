import {test, expect} from '@playwright/test';

// Run the Royal Gallery matrix only after Master has supplied the signed asset SHA:
//   GOLDEN_PAGODA_APPROVED_SHA=<approved-commit> npx playwright test tests/golden-pagoda-s07.spec.mjs
// Master preview now registers both Royal S07 files in the actual index.html.
// Do not inject duplicate scripts or styles in the integrated tests.
const tinyWebp = Buffer.from(
  'UklGRiwAAABXRUJQVlA4ICAAAABwAQCdASoKABAAAgA0JZQCdAGIQAD+7e02x7gwm7AwAA==',
  'base64'
);
const assetRoot = '/assets/skins/golden-pagoda-garden/section-07';
const signedBaseline = process.env.GOLDEN_PAGODA_APPROVED_SHA;

test('S07 stylesheet and script do not alter the default skin', async ({page}) => {
  await page.goto('/?galleryReference=0');
  const section = page.locator('#gallery');
  const priorBackground = await section.evaluate(el => getComputedStyle(el).backgroundColor);
  await expect(section).not.toHaveAttribute('data-golden-gallery-active', 'true');
  expect(await section.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(priorBackground);
  await expect(page.locator('.gallery-scene-image')).toHaveAttribute('src','./assets/scene.webp');
});

test('S07 approved art, five frames, keyboard lightbox, reverse scroll', async ({page},testInfo) => {
  test.skip(!signedBaseline, 'Master has not supplied an approved immutable 47-asset SHA');
  const {width,height} = testInfo.project.use.viewport;
  expect([[320,568],[360,740],[390,844],[430,932]]).toContainEqual([width,height]);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/assets/gallery/photo-*.webp', route =>
    route.fulfill({status:200, contentType:'image/webp', body:tinyWebp}));

  const errors=[];
  page.on('pageerror',error => errors.push(error.message));
  await page.goto('/?skin=golden-pagoda-garden&galleryReference=0');
  for(const file of ['gallery-paper.webp','photo-frame.webp','gallery-floral-left.webp','gallery-floral-right.webp']){
    const response=await page.request.get(`${assetRoot}/${file}`);
    expect(response.status(),file+' must be in the signed release').toBe(200);
    expect(response.headers()['content-type'] || '').toContain('image');
  }
  await page.getByRole('button',{name:'Open Invitation'}).click();
  const gallery=page.locator('#gallery');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute('data-golden-gallery-active','true');
  await expect(page.locator('.gallery-scene-image')).toHaveAttribute('src', /palace-horizontal[.]webp$/);
  const scene=await gallery.evaluate(el=>{
    const image=el.querySelector('.gallery-scene-image');
    const wash=el.querySelector('.gallery-scene-wash');
    return {fit:getComputedStyle(image).objectFit, position:getComputedStyle(image).objectPosition,
      washOpacity:getComputedStyle(wash).opacity,
      backdropDisplay:getComputedStyle(el.querySelector('.gallery-scene-backdrop')).display,
      paperImage:getComputedStyle(el,'::before').backgroundImage};
  });
  expect(scene.fit).toBe('cover');
  expect(scene.position).toBe('50% 50%');
  expect(scene.washOpacity).toBe('0.1');
  expect(scene.backdropDisplay).toBe('block');
  expect(scene.paperImage).toBe('none');
  const slots=page.locator('#gallery [data-gallery-slot]');
  await expect(slots).toHaveCount(5);
  // The approved Royal DOM and keyboard order is Groom, Bride, Together,
  // Garden, Lake. Full-image contain is deliberate: no portrait cropping.
  expect(await slots.evaluateAll(nodes=>nodes.map(n=>Number(n.dataset.gallerySlot))))
    .toEqual([2,1,0,3,4]);
  for(let i=0;i<5;i++)await expect(slots.nth(i)).toBeEnabled();
  await expect(slots.nth(0)).toHaveAttribute('aria-label','View photo: The Groom');
  await expect(slots.nth(0).locator('.gallery-image')).toHaveCSS('object-fit','contain');
  const frame=await slots.nth(0).evaluate(el=>getComputedStyle(el,'::before').backgroundImage);
  expect(frame).toContain('photo-frame.webp');
  const fit=await gallery.evaluate(el=>{
    const portraits=[0,1,2].map(i=>{
      const button=el.querySelector('[data-gallery-slot="'+i+'"]');
      const caption=button.querySelector('.gallery-frame-caption');
      const a=button.getBoundingClientRect(),c=caption.getBoundingClientRect();
      return {border:getComputedStyle(button).borderTopWidth,
        inside:c.left>=a.left && c.right<=a.right && c.top>=a.top && c.bottom<=a.bottom};
    });
    const landscapes=[3,4].map(i=>{
      const button=el.querySelector('[data-gallery-slot="'+i+'"]');
      return {border:getComputedStyle(button).borderTopWidth,
        extraFrame:getComputedStyle(button,'::before').content};
    });
    return {portraits,landscapes};
  });
  expect(fit.portraits.every(x=>x.border==='0px'&&x.inside)).toBe(true);
  expect(fit.landscapes.every(x=>x.border==='2px'&&x.extraFrame==='none')).toBe(true);
  await gallery.screenshot({path:testInfo.outputPath(`s07-royal-gallery-${width}.png`),animations:'disabled'});

  await slots.nth(0).click();
  const dialog=page.locator('#galleryDialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button',{name:'Close photo viewer'})).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(dialog).toHaveAttribute('data-gallery-orientation','landscape');
  await expect(page.locator('#galleryViewCaption')).toHaveText('The Lake');
  await page.keyboard.press('ArrowRight');
  await expect(dialog).toHaveAttribute('data-gallery-orientation','portrait');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(slots.nth(0)).toBeFocused();
  await expect(page.locator('#galleryViewImage')).not.toHaveAttribute('src',/.+/);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute('data-golden-gallery-active','true');
  expect(errors).toEqual([]);
});

test('S07 reduced-motion presentation does not animate frames', async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/?skin=golden-pagoda-garden&galleryReference=0');
  await expect(page.locator('#gallery .gallery-photo').first()).toHaveCSS('animation-name','none');
});
