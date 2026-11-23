import { test, expect } from '@playwright/test';

/* Section 10 template-frame QA. The new 1038x2160 royalty is a ONE-TO-ONE
   replacement of the original existing CSS frame surface, not a new slot.
   No RSVP submissions or guest data/API writes.  Do not infer test pass until run. */
const sizes = [[320,568],[360,740],[390,844],[430,932]];
const frameUrl='/assets/skins/golden-pagoda-garden/section-10/finale-royal-frame.webp';

async function open(page,royal) {
  await page.goto(royal ? '/?skin=golden-pagoda-garden&section9Reference=0&galleryReference=1'
                        : '/?section9Reference=0');
  await page.getByRole('button',{name:'Open Invitation'}).click();
  const section=page.locator('#closingMessage');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute('aria-hidden','false');
  await page.evaluate(()=>document.fonts.ready);
  return section;
}
async function layout(section) {
  return section.evaluate(el=>{
    const rect=el.getBoundingClientRect();
    const measure=selector=>{
      const r=el.querySelector(selector).getBoundingClientRect();
      return [r.x,r.y-rect.y,r.width,r.height];
    };
    return {
      section:[rect.width,rect.height],
      padding:getComputedStyle(el).padding,
      inner:measure('.closing10-inner'),
      frame:measure('.closing10-frame'),
      heading:measure('#closingHeading'),
      message:measure('.closing10-message'),
      rule:measure('.closing10-rule'),
      names:measure('.closing10-names'),
      contact:measure('.closing10-contacts'),
      credit:measure('.closing10-credit'),
      overflow:document.documentElement.scrollWidth-innerWidth
    };
  });
}
for(const [width,height] of sizes){
  test('S10 original template fit at '+width+'x'+height,async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const baseline=await open(page,false);
    const original=await layout(baseline);
    const royal=await open(page,true);
    const refined=await layout(royal);

    for(const key of ['section','padding','inner','frame'])
      expect(refined[key],key).toEqual(original[key]);
    // The original frame and sticky section are unchanged, but the text has
    // a newly balanced rhythm. Verify all live text remains inside the frame.
    for(const key of ['heading','message','rule','names','contact','credit']) {
      const box=refined[key],frame=refined.frame;
      expect(box[0],key+' left').toBeGreaterThanOrEqual(frame[0]+4);
      expect(box[0]+box[2],key+' right').toBeLessThanOrEqual(frame[0]+frame[2]-4);
      expect(box[1],key+' top').toBeGreaterThan(frame[1]+10);
      expect(box[1]+box[3],key+' bottom').toBeLessThanOrEqual(frame[1]+frame[3]-10);
    }
    expect(refined.overflow).toBeLessThanOrEqual(1);
    await expect(royal).toHaveAttribute('data-artwork','local-reference');

    const painted=await royal.evaluate(el=>{
      const frame=el.querySelector('.closing10-frame');
      const style=getComputedStyle(frame);
      const left=getComputedStyle(el.querySelector('.ref-vine-left'));
      const right=getComputedStyle(el.querySelector('.ref-vine-right'));
      const wash=getComputedStyle(el.querySelector('.closing10-inner'),'::before');
      const credit=getComputedStyle(el.querySelector('.closing10-credit'));
      return {
        frameUrl:style.backgroundImage,frameHeight:style.height,
        framePosition:style.backgroundPosition,frameSize:style.backgroundSize,
        frameTopDecoration:getComputedStyle(frame,'::before').display,
        frameBottomDecoration:getComputedStyle(frame,'::after').display,
        lowerDiamonds:getComputedStyle(el.querySelector('.closing10-corner')).display,
        leftUrl:left.backgroundImage,rightUrl:right.backgroundImage,
        leftDisplay:left.display,rightDisplay:right.display,
        lotusPosition:left.backgroundPosition,
        wash:wash.backgroundImage,credit:credit.backgroundImage,
        petals:document.querySelectorAll('#globalPetalCanvas').length,
        callDisabled:el.querySelector('.closing10-contact-row button').disabled,
        whatsappDisabled:el.querySelectorAll('.closing10-contact-row button')[1].disabled
      };
    });
    expect(painted.frameUrl).toContain('finale-royal-frame.webp');
    expect(painted.frameHeight).toBe('720px');
    expect(painted.frameSize).toBe('100% 100%');
    expect(painted.frameTopDecoration).toBe('none');
    expect(painted.frameBottomDecoration).toBe('none');
    expect(painted.lowerDiamonds).toBe('none');
    expect(painted.leftUrl).toContain('finale-lotus-left.webp');
    expect(painted.rightUrl).toContain('finale-lotus-right.webp');
    expect(painted.leftDisplay).not.toBe('none');
    expect(painted.rightDisplay).not.toBe('none');
    expect(painted.lotusPosition).toContain('69%');
    expect(painted.wash).toContain('radial-gradient');
    expect(painted.credit).toBe('none');
    expect(painted.petals).toBe(1);
    expect(painted.callDisabled).toBe(true);
    expect(painted.whatsappDisabled).toBe(true);
    await expect(royal.locator('.closing10-credit')).toContainText('Golden Pagoda Garden');

    const response=await page.request.get(frameUrl);
    expect(response.status()).toBe(200);
    const dimensions=await page.evaluate(url=>new Promise(resolve=>{
      const img=new Image();
      img.onload=()=>resolve([img.naturalWidth,img.naturalHeight]);
      img.onerror=()=>resolve([0,0]);
      img.src=url;
    }),frameUrl);
    expect(dimensions).toEqual([1038,2160]);

    await royal.screenshot({path:testInfo.outputPath('s10-template-frame-'+width+'.png'),animations:'disabled'});
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.evaluate(()=>window.scrollTo(0,0));
    await royal.scrollIntoViewIfNeeded();
    expect(errors).toEqual([]);
  });
}
