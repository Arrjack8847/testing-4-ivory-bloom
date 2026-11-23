import {test,expect} from '@playwright/test';

// Run locally on the four profiles from playwright.config.mjs with the
// exact target Git SHA. This file does not replace physical iPhone Safari QA.
const royal='/?skin=golden-pagoda-garden';

async function openRoyal(page) {
  await page.goto(royal,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','ready',{timeout:35000});
  await expect(page.locator('#openButton')).toBeVisible();
  await page.locator('#openButton').click();
  await expect(page.locator('#invitation')).toHaveAttribute('data-state','opened');
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
}

test('Royal open -> S1 -> S2 -> S3 -> S7 -> S9 -> S10 -> reverse, without missing WebPs',async({page},testInfo)=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await openRoyal(page);
  const heroHeight=await page.locator('#viewport').evaluate(el=>el.clientHeight);
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(heroHeight*2.35));
  await expect.poll(()=>page.locator('#viewport').evaluate(el=>el.style.getPropertyValue('--second-name-progress')))
    .toBe('1.0000');
  const heroRect=await page.locator('#viewport').boundingBox();
  expect(heroRect).not.toBeNull();
  expect(Math.abs(heroRect.y)).toBeLessThanOrEqual(2);

  await page.locator('#message').scrollIntoViewIfNeeded();
  await expect(page.locator('#message .royal-message-footer')).toBeVisible();
  await expect(page.locator('#message .royal-message-paragraph')).toHaveCount(2);

  const couple=page.locator('#couple');
  await couple.scrollIntoViewIfNeeded();
  for(const portrait of ['groom','bride']){
    const img=couple.locator('.couple-profile--'+portrait+' .royal-portrait-window img');
    await expect(img).toHaveCount(1);
    await expect.poll(()=>img.evaluate(el=>el.naturalWidth),{timeout:20000}).toBeGreaterThan(0);
  }

  const gallery=page.locator('#gallery');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute('data-golden-gallery-active','true');
  const cards=gallery.locator('.gallery-photo');
  await expect(cards).toHaveCount(5);
  // Gallery photographs are intentionally lazy-loaded. Bring every frame
  // near the viewport before validating image decoding; waiting at the top
  // would misreport correctly deferred landscape assets as missing.
  for (const slot of [2,1,0,3,4]) {
    const frame=gallery.locator('[data-gallery-slot="'+slot+'"]');
    await frame.scrollIntoViewIfNeeded();
    await expect(frame).toBeEnabled({timeout:20000});
    await expect.poll(()=>frame.locator('img.gallery-image').evaluate(img=>img.naturalWidth),{timeout:20000})
      .toBeGreaterThan(0);
  }
  expect(await cards.evaluateAll(nodes=>nodes.map(node=>Number(node.dataset.gallerySlot))))
    .toEqual([2,1,0,3,4]);

  const rsvp=page.locator('#rsvp');
  await rsvp.scrollIntoViewIfNeeded();
  await expect(rsvp).toHaveClass(/gp-s09-split-ready/,{timeout:20000});
  await expect(rsvp.locator('.s9-bottom-butterfly-zone > div')).toHaveCount(2);

  await page.locator('#closingMessage').scrollIntoViewIfNeeded();
  await expect(page.locator('#closingMessage')).toBeVisible();
  await gallery.scrollIntoViewIfNeeded();
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(heroHeight*2.35));
  await expect.poll(()=>page.locator('#viewport').evaluate(el=>el.style.getPropertyValue('--second-name-progress')))
    .toBe('1.0000');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
  await page.screenshot({path:testInfo.outputPath('phase3-return-'+testInfo.project.name+'.png'),animations:'disabled'});
});

test('Royal gallery lightbox and all five original photos navigate in visual order',async({page})=>{
  await openRoyal(page);
  const gallery=page.locator('#gallery');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery.locator('[data-gallery-slot="2"]')).toBeEnabled();
  await gallery.locator('[data-gallery-slot="2"]').click();
  const modal=page.locator('#galleryDialog');
  await expect(modal).toBeVisible();
  await expect(page.locator('#galleryViewCaption')).toHaveText('The Groom');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#galleryViewCaption')).toHaveText('The Bride');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#galleryViewCaption')).toHaveText('Together');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#galleryViewCaption')).toHaveText('The Garden');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#galleryViewCaption')).toHaveText('The Lake');
  await page.keyboard.press('Escape');
  await expect(modal).not.toBeVisible();
  await expect(gallery.locator('[data-gallery-slot="2"]')).toBeFocused();
});

test('Guest mode never animates Royal butterflies when reduced motion is requested',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await openRoyal(page);
  const rsvp=page.locator('#rsvp');
  await rsvp.scrollIntoViewIfNeeded();
  await expect(rsvp).toHaveClass(/gp-s09-split-ready/,{timeout:20000});
  const wing=rsvp.locator('.s9-butterfly .s9-wing-left').first();
  await expect(wing).toHaveCSS('animation-name','none');
  await expect(wing).toHaveCSS('transform','none');
});
