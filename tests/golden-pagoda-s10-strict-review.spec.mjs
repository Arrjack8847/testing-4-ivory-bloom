import {test,expect} from '@playwright/test';

/* Section 10 Royal Sunset: compare original slot geometry and verify artwork,
   sticky-camera asset, contact gating, reduced-motion, and reverse scrolling.
   Nothing here makes a backend request, submits an RSVP or merges code. */
const viewports = [[320,568],[360,740],[390,844],[430,932]];
const root='/assets/skins/golden-pagoda-garden/section-10/';
const assets=['finale-scene.webp','finale-royal-frame.webp','finale-lotus-left.webp','finale-lotus-right.webp','finale-gold-ornament.webp'];

async function visit(page,royal) {
  await page.goto(royal?'/?skin=golden-pagoda-garden&section9Reference=0&galleryReference=1':'/?section9Reference=0');
  await page.getByRole('button',{name:'Open Invitation'}).click();
  const section=page.locator('#closingMessage');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('aria-hidden','false');
  await expect(section).toHaveJSProperty('inert',false);
  await page.evaluate(()=>document.fonts.ready);
  return section;
}
async function measure(section) {
  return section.evaluate(el=>{
    const s=el.getBoundingClientRect();
    const rect=(selector)=>{
      const v=el.querySelector(selector).getBoundingClientRect();
      return {top:v.top-s.top,left:v.left-s.left,width:v.width,height:v.height};
    };
    return {
      height:s.height,
      minHeight:getComputedStyle(el).minHeight,
      paddingTop:getComputedStyle(el).paddingTop,
      paddingBottom:getComputedStyle(el).paddingBottom,
      inner:rect('.closing10-inner'),
      frame:rect('.closing10-frame'),
      title:rect('#closingHeading'),
      message:rect('.closing10-message'),
      names:rect('.closing10-names'),
      contacts:rect('.closing10-contacts'),
      credit:rect('.closing10-credit'),
      disclosure:rect('.closing10-disclosure'),
      overflow:document.documentElement.scrollWidth-innerWidth,
      nextOverflow:Math.max(0,el.scrollWidth-el.clientWidth)
    };
  });
}
for(const [width,height] of viewports) {
  test('S10 royal sunset source-slot regression '+width+'x'+height,async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const standard=await visit(page,false);
    const baseline=await measure(standard);
    const baselineAsset=await standard.locator('.closing10-source-scene').getAttribute('src');
    expect(baselineAsset).toContain('assets/section10/scene.webp');

    const royal=await visit(page,true);
    await expect(royal).toHaveAttribute('data-artwork','local-reference');
    const current=await measure(royal);
    for(const k of ['height','minHeight','paddingTop','paddingBottom','inner','frame']) {
      expect(current[k],k).toEqual(baseline[k]);
    }
    // Unlike source artwork geometry, royal live-text spacing is intentionally
    // improved for Myanmar. Every text block must stay within the fixed frame.
    for(const k of ['title','message','names','contacts','credit','disclosure']) {
      expect(current[k].left,k+' left').toBeGreaterThanOrEqual(current.frame.left+4);
      expect(current[k].left+current[k].width,k+' right')
        .toBeLessThanOrEqual(current.frame.left+current.frame.width-4);
      expect(current[k].top,k+' top').toBeGreaterThan(current.frame.top+15);
      expect(current[k].top+current[k].height,k+' bottom')
        .toBeLessThanOrEqual(current.frame.top+current.frame.height-10);
    }
    const rowHeight=await royal.locator('.closing10-names span').first()
      .evaluate(el=>getComputedStyle(el).height);
    expect(parseFloat(rowHeight)).toBeLessThanOrEqual(55);
    expect(current.overflow).toBeLessThanOrEqual(1);
    expect(current.nextOverflow).toBeLessThanOrEqual(1);

    const img=royal.locator('.closing10-source-scene');
    await expect(img).toHaveAttribute('src','.'+root+'finale-scene.webp');
    const render=await royal.evaluate(el=>({
      fill:getComputedStyle(el.querySelector('.closing10-sticky-art'),'::before').backgroundImage,
      frame:getComputedStyle(el.querySelector('.closing10-frame')).backgroundImage,
      oldTopDecoration:getComputedStyle(el.querySelector('.closing10-frame'),'::before').display,
      oldCorners:getComputedStyle(el.querySelector('.closing10-corner')).display,
      ornament:getComputedStyle(el.querySelector('.closing10-rule'),'::after').backgroundImage,
      left:getComputedStyle(el.querySelector('.ref-vine-left')).backgroundImage,
      right:getComputedStyle(el.querySelector('.ref-vine-right')).backgroundImage,
      leftDisplay:getComputedStyle(el.querySelector('.ref-vine-left')).display,
      rightDisplay:getComputedStyle(el.querySelector('.ref-vine-right')).display,
      bg:getComputedStyle(el).backgroundColor
    }));
    expect(render.fill).toContain('finale-scene.webp');
    expect(render.frame).toContain('finale-royal-frame.webp');
    expect(render.oldTopDecoration).toBe('none');
    expect(render.oldCorners).toBe('none');
    expect(render.ornament).toContain('finale-gold-ornament.webp');
    expect(render.left).toContain('finale-lotus-left.webp');
    expect(render.right).toContain('finale-lotus-right.webp');
    expect(render.leftDisplay).not.toBe('none');
    expect(render.rightDisplay).not.toBe('none');
    expect(render.bg).toBe('rgb(240, 210, 162)');

    for(const name of assets){
      const res=await page.request.get(root+name);
      expect(res.status(),name).toBe(200);
      const size=await page.evaluate(url=>new Promise(resolve=>{
        const i=new Image();
        i.onload=()=>resolve([i.naturalWidth,i.naturalHeight]);
        i.onerror=()=>resolve([0,0]);
        i.src=url;
      }),root+name);
      expect(size[0],name).toBeGreaterThan(0);
      expect(size[1],name).toBeGreaterThan(0);
    }
    await expect(royal.locator('.closing10-contact-row button')).toHaveCount(2);
    await expect(royal.locator('.closing10-contact-row button').first()).toBeDisabled();
    await expect(royal.locator('.closing10-contact-row button').last()).toBeDisabled();
    await expect(royal.locator('.closing10-credit')).toContainText('Golden Pagoda Garden');
    await royal.screenshot({path:testInfo.outputPath('royal-s10-'+width+'.png'),animations:'disabled'});

    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
    await page.evaluate(()=>scrollTo(0,0));
    await royal.scrollIntoViewIfNeeded();
    expect(errors).toEqual([]);
  });
}
