import { test, expect } from '@playwright/test';

/* Royal S08 isolated review: preserve source geometry, existing disclosure
   functionality, original skin isolation, and verify the four uploaded assets.
   This test intentionally has not been declared passing until actually run. */
const widths = [
  { width: 320, height: 568 },
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
];
const prefix = '/assets/skins/golden-pagoda-garden/section-08/';
const assets = ['gift-paper.webp', 'gift-header.webp','gift-floral.webp','gift-kanote-border.svg'];

async function navigateToGift(page, skin) {
  await page.goto('/' + (skin ? '?skin=golden-pagoda-garden' : '?galleryReference=0'));
  await page.getByRole('button', {name: 'Open Invitation'}).click();
  const gift = page.locator('#weddingGift');
  await gift.scrollIntoViewIfNeeded();
  await expect(gift).toHaveAttribute('aria-hidden', 'false');
  await expect(gift).toHaveJSProperty('inert', false);
  return gift;
}
async function metrics(gift) {
  return gift.evaluate(el=>{
    const base = el.getBoundingClientRect();
    const rel = node => {
      const rect = el.querySelector(node).getBoundingClientRect();
      return {top:rect.top-base.top,height:rect.height,width:rect.width};
    };
    return {
      minHeight:getComputedStyle(el).minHeight,
      sectionHeight:base.height,
      heading:rel('.gift-eight-heading'),
      intro:rel('.gift-eight-intro'),
      button:rel('#giftEightTrigger'),
      contentWidth:el.querySelector('.gift-eight-content').getBoundingClientRect().width,
      scrollOverflow:document.documentElement.scrollWidth-innerWidth,
    };
  });
}
for(const size of widths) {
  test('S08 original mobile layout and royalty at '+size.width,async({page},testInfo)=>{
    await page.setViewportSize(size);
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));

    const original = await navigateToGift(page,false);
    const base = await metrics(original);
    const normalCss = await original.evaluate(el=>getComputedStyle(el).backgroundColor);
    expect(normalCss).toBe('rgb(92, 38, 79)');

    const royal = await navigateToGift(page,true);
    const now = await metrics(royal);
    expect(now.minHeight).toBe(base.minHeight);
    expect(now.sectionHeight).toBe(base.sectionHeight);
    expect(now.heading.top).toBeCloseTo(base.heading.top,0);
    expect(now.intro.top).toBeCloseTo(base.intro.top,0);
    expect(now.button.top).toBeCloseTo(base.button.top,0);
    expect(now.button.height).toBeCloseTo(base.button.height,0);
    expect(now.contentWidth).toBeCloseTo(base.contentWidth,0);
    expect(now.scrollOverflow).toBeLessThanOrEqual(1);

    const surfaces = await royal.evaluate(el=>({
      section:getComputedStyle(el).backgroundColor,
      paper:getComputedStyle(el.querySelector('.gift-eight-art')).backgroundImage,
      paperRepeat:getComputedStyle(el.querySelector('.gift-eight-art')).backgroundRepeat,
      header:getComputedStyle(el.querySelector('.gift-eight-heading'),'::before').backgroundImage,
      headerPosition:getComputedStyle(el.querySelector('.gift-eight-heading'),'::before').position,
      frame:getComputedStyle(el.querySelector('.gift-eight-content'),'::before').backgroundImage,
      flowers:getComputedStyle(el.querySelector('.gift-eight-content'),'::after').backgroundImage,
      floralDuplicated:getComputedStyle(el.querySelector('.gift-eight-send'),'::before').backgroundImage,
    }));
    expect(surfaces.section).toBe('rgb(245, 236, 220)');
    expect(surfaces.paper).toContain('gift-paper.webp');
    expect(surfaces.paperRepeat).toBe('no-repeat');
    expect(surfaces.header).toContain('gift-header.webp');
    expect(surfaces.headerPosition).toBe('absolute');
    expect(surfaces.frame).toContain('gift-kanote-border.svg');
    expect(surfaces.flowers).toContain('gift-floral.webp');
    expect(surfaces.floralDuplicated).toBe('none');

    for(const file of assets) {
      const res=await page.request.get(prefix+file);
      expect(res.status(),file).toBe(200);
      if(file.endsWith('.svg')) expect(await res.text()).toMatch(/<svg\b/);
      else {
        const img=await page.evaluate(async src => {
          const i=new Image();i.src=src;
          try {await i.decode();return [i.naturalWidth,i.naturalHeight];}
          catch {return [0,0];}
        },prefix+file);
        expect(img[0],file).toBeGreaterThan(0);
        expect(img[1],file).toBeGreaterThan(0);
      }
    }

    await royal.screenshot({path:testInfo.outputPath('s08-closed-'+size.width+'.png'),animations:'disabled'});
    const button=royal.locator('#giftEightTrigger');
    await expect(button).toHaveAttribute('aria-expanded','false');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded','true');
    await expect(royal.locator('#giftEightBanks')).toBeVisible();
    await expect(royal.locator('#giftEightWishlist')).toBeVisible();
    await expect(royal.locator('.gift-eight-copy')).toHaveCount(2);
    await expect(royal.locator('.gift-eight-copy').first()).toBeDisabled();
    await royal.screenshot({path:testInfo.outputPath('s08-open-'+size.width+'.png'),animations:'disabled'});
    await button.click();
    await expect(royal.locator('#giftEightBanks')).toBeHidden();
    await expect(royal.locator('#giftEightWishlist')).toBeHidden();
    expect(errors).toEqual([]);
  });
}
