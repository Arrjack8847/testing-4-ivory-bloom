import {test,expect} from '@playwright/test';

// Run on four project widths: 320x568, 360x740, 390x844 and 430x932.
// No Browser Use connector or GitHub Actions is required.
const royal='/?skin=golden-pagoda-garden';

async function openRoyal(page) {
  await page.goto(royal,{waitUntil:'domcontentloaded'});
  await expect(page.locator('#invitation')).toHaveAttribute('data-layers','ready',{timeout:30000});
  await page.locator('#openButton').click();
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
  return await page.locator('#viewport').evaluate(el=>el.clientHeight);
}
async function scrollH(page,height,fraction) {
  await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),Math.round(height*fraction));
  await expect.poll(()=>page.evaluate(()=>Math.round(scrollY)),{timeout:5000})
    .toBeCloseTo(Math.round(height*fraction),-1);
}

test('Royal Section 1 -> 2 handoff has no blank gap and reverse scroll restores names',async({page},testInfo)=>{
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const height=await openRoyal(page);
  const scene=page.locator('#sceneTrack');
  const sizes=await scene.evaluate((track)=>{
    const hero=document.getElementById('viewport'),message=document.getElementById('message');
    return {track:track.getBoundingClientRect().height, h:hero.getBoundingClientRect().height,
      margin:parseFloat(getComputedStyle(track).marginBottom),
      start:message.getBoundingClientRect().top+window.scrollY};
  });
  expect(Math.abs(sizes.track/sizes.h-4.25)).toBeLessThan(.015);
  expect(Math.abs(sizes.margin/sizes.h+1)).toBeLessThan(.015);
  expect(Math.abs(sizes.start/sizes.h-3.25)).toBeLessThan(.015);
  await scrollH(page,height,2.35);
  const names=await page.evaluate(()=>{
    const sel=n=>getComputedStyle(document.querySelector('#viewport '+n));
    return {first:sel('.name-first').translate,second:sel('.name-second').translate,
      firstOpacity:Number(sel('.name-first').opacity),secondOpacity:Number(sel('.name-second').opacity)};
  });
  expect(names.first).toContain('-2px');
  expect(names.second).toContain('6px');
  expect(names.firstOpacity).toBeCloseTo(1,2);
  expect(names.secondOpacity).toBeCloseTo(1,2);
  await scrollH(page,height,2.9);
  const seam=await page.evaluate(()=>{
    const m=document.getElementById('message'),h=document.getElementById('viewport');
    return {messageTop:m.getBoundingClientRect().top,heroTop:h.getBoundingClientRect().top,
      messageZ:Number(getComputedStyle(m).zIndex),heroZ:Number(getComputedStyle(h).zIndex),
      overflow:document.documentElement.scrollWidth-innerWidth};
  });
  expect(Math.abs(seam.messageTop-.35*height)).toBeLessThan(3);
  expect(Math.abs(seam.heroTop)).toBeLessThan(2);
  expect(seam.messageZ).toBeGreaterThan(seam.heroZ);
  expect(seam.overflow).toBeLessThanOrEqual(1);
  await scrollH(page,height,3.35);
  await scrollH(page,height,2.35);
  await expect(page.locator('#viewport .name-first')).toHaveCSS('opacity','1');
  await expect(page.locator('#viewport .name-second')).toHaveCSS('opacity','1');
  expect(errors).toEqual([]);
});

test('Royal gallery has Groom and Bride above centered Together with uncropped images',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await openRoyal(page);
  const gallery=page.locator('#gallery');
  await gallery.scrollIntoViewIfNeeded();
  await expect(gallery).toHaveAttribute('data-golden-gallery-active','true');
  const order=await gallery.locator('.gallery-photos [data-gallery-slot]')
    .evaluateAll(nodes=>nodes.map(el=>Number(el.dataset.gallerySlot)));
  expect(order).toEqual([2,1,0,3,4]);
  const groom=gallery.locator('[data-gallery-slot="2"]');
  const bride=gallery.locator('[data-gallery-slot="1"]');
  const together=gallery.locator('[data-gallery-slot="0"]');
  await expect(groom).toBeEnabled();
  await expect(bride).toBeEnabled();
  await expect(together).toBeEnabled();
  await expect(groom).toHaveAttribute('aria-label','View photo: The Groom');
  await expect(bride).toHaveAttribute('aria-label','View photo: The Bride');
  await expect(together).toHaveAttribute('aria-label','View photo: Together');
  // These frames have 150ms-staggered translate/scale entrances. Wait for
  // the observable final alignment, not arbitrary timeouts or half-way frames.
  await expect.poll(()=>gallery.evaluate(el=>{
    const g=el.querySelector('[data-gallery-slot="2"]').getBoundingClientRect();
    const b=el.querySelector('[data-gallery-slot="1"]').getBoundingClientRect();
    return Math.abs(g.top-b.top);
  }),{timeout:6000}).toBeLessThan(3);
  const rectangles=await gallery.evaluate(el=>{
    const r=n=>el.querySelector('[data-gallery-slot="'+n+'"]').getBoundingClientRect().toJSON();
    return {g:r(2),b:r(1),t:r(0)};
  });
  expect(rectangles.g.x).toBeLessThan(rectangles.b.x);
  expect(Math.abs(rectangles.g.y-rectangles.b.y)).toBeLessThan(3);
  expect(rectangles.t.y).toBeGreaterThan(rectangles.b.y+rectangles.b.height);
  expect(Math.abs(rectangles.t.x+rectangles.t.width/2-
    (rectangles.g.x+rectangles.b.x+rectangles.b.width)/2)).toBeLessThan(4);
  for(const slot of [0,1,2])
    await expect(gallery.locator('[data-gallery-slot="'+slot+'"] .gallery-image'))
      .toHaveCSS('object-fit','contain');
  await groom.click();
  await expect(page.locator('#galleryPosition')).toHaveText('1 / 5');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#galleryViewCaption')).toHaveText('The Bride');
  await page.keyboard.press('Escape');
  await expect(groom).toBeFocused();
  expect(errors).toEqual([]);
});

test('Royal Section 9 keeps two top and two bottom split butterflies',async({page})=>{
  await openRoyal(page);
  const rsvp=page.locator('#rsvp');
  await rsvp.scrollIntoViewIfNeeded();
  await expect(rsvp).toHaveClass(/gp-s09-split-ready/,{timeout:30000});
  await expect(rsvp.locator('.s9-bottom-butterfly-zone')).toHaveCount(1);
  await expect(rsvp.locator('.s9-bottom-butterfly-zone > div')).toHaveCount(2);
  await expect(rsvp.locator('.s9-bottom-butterfly-zone')).toHaveCSS('pointer-events','none');
  for(const wing of ['s9-wing-left','s9-wing-right']) {
    await expect(rsvp.locator('.s9-butterfly').first().locator('.'+wing))
      .toHaveCSS('background-size','contain');
  }
});
