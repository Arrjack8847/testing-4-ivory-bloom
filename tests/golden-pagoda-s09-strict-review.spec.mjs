import {test,expect} from '@playwright/test';

/* Royal S09 visual regression only; NEVER submit to a production RSVP API. */
const sizes=[[320,568],[360,740],[390,844],[430,932]];
const artworkRoot='/assets/skins/golden-pagoda-garden/section-09/';
const artworks=['rsvp-paper.webp','rsvp-kanote-top.webp','rsvp-floral.webp','rsvp-bottom.webp'];

async function openRsvp(page,skin){
  await page.goto(skin?
    '/?skin=golden-pagoda-garden&section9Reference=0':
    '/?section9Reference=0');
  await page.getByRole('button',{name:'Open Invitation'}).click();
  const el=page.locator('#rsvp');
  await el.scrollIntoViewIfNeeded();
  await expect(el).toHaveAttribute('aria-hidden','false');
  await expect(el).toHaveJSProperty('inert',false);
  await page.evaluate(()=>document.fonts.ready);
  return el;
}
async function sample(section){
  return section.evaluate(el=>{
    const sectionRect=el.getBoundingClientRect();
    const rel=selector=>{
      const rect=el.querySelector(selector).getBoundingClientRect();
      return {top:rect.top-sectionRect.top,width:rect.width,height:rect.height};
    };
    const next=document.getElementById('closingMessage');
    return {
      height:sectionRect.height,
      paddingTop:getComputedStyle(el).paddingTop,
      paddingBottom:getComputedStyle(el).paddingBottom,
      frame:rel('.s9-frame'),
      heading:rel('.s9-heading'),
      firstInput:rel('#s9Name'),
      submit:rel('.s9-submit'),
      wishes:rel('.s9-wall'),
      seam:next.getBoundingClientRect().top-sectionRect.bottom,
      horizontalOverflow:document.documentElement.scrollWidth-innerWidth
    };
  });
}
for(const [width,height] of sizes){
  test('S09 Royal geometry and field interactions '+width+'x'+height,async({page},testInfo)=>{
    await page.setViewportSize({width,height});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const original=await openRsvp(page,false);
    const before=await sample(original);
    expect(await original.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(250, 247, 251)');

    const royal=await openRsvp(page,true);
    const after=await sample(royal);
    for(const field of ['height','paddingTop','paddingBottom','frame','heading','firstInput','submit','wishes'])
      expect(after[field],field).toEqual(before[field]);
    expect(Math.abs(after.seam)).toBeLessThanOrEqual(1);
    expect(after.horizontalOverflow).toBeLessThanOrEqual(1);

    const surfaces=await royal.evaluate(el=>({
      section:getComputedStyle(el).backgroundColor,
      paper:getComputedStyle(el.querySelector('.s9-original-paper')).backgroundImage,
      crest:getComputedStyle(el.querySelector('.s9-frame'),'::after').backgroundImage,
      flower:getComputedStyle(el.querySelector('.s9-art-wash'),'::before').backgroundImage,
      bottom:getComputedStyle(el.querySelector('.s9-art-wash'),'::after').backgroundImage,
      paperRepeat:getComputedStyle(el.querySelector('.s9-original-paper')).backgroundRepeat,
    }));
    expect(surfaces.section).toBe('rgb(247, 239, 226)');
    expect(surfaces.paper).toContain('rsvp-paper.webp');
    expect(surfaces.crest).toContain('rsvp-kanote-top.webp');
    expect(surfaces.flower).toContain('rsvp-floral.webp');
    expect(surfaces.bottom).toContain('rsvp-bottom.webp');
    expect(surfaces.paperRepeat).toBe('no-repeat, no-repeat');

    for(const name of artworks){
      const response=await page.request.get(artworkRoot+name);
      expect(response.status(),name).toBe(200);
      const dimensions=await page.evaluate(src=>new Promise(resolve=>{
        const img=new Image();img.onload=()=>resolve([img.naturalWidth,img.naturalHeight]);
        img.onerror=()=>resolve([0,0]);img.src=src;
      }),artworkRoot+name);
      expect(dimensions[0],name).toBeGreaterThan(0);
      expect(dimensions[1],name).toBeGreaterThan(0);
    }

    const form=royal.locator('#s9RsvpForm');
    await expect(form.locator('#s9Name')).toBeEditable();
    await expect(form.locator('#s9Attendance')).toBeEnabled();
    await form.locator('#s9Attendance').selectOption('no');
    await expect(form.locator('#s9Guests')).toBeDisabled();
    await form.locator('#s9Attendance').selectOption('yes');
    await expect(form.locator('#s9Guests')).toBeEnabled();
    await expect(form.locator('#s9Wish')).toBeEditable();
    await expect(form.locator('.s9-submit')).toBeEnabled();
    // We never click Submit RSVP in a deployed review.
    await royal.screenshot({path:testInfo.outputPath('s09-royal-'+width+'.png'),animations:'disabled'});
    expect(errors).toEqual([]);
  });
}
