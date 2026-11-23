import { test, expect } from '@playwright/test';

/* S04 strict regression. Four existing phone profiles:
   320x568, 360x740, 390x844, 430x932. No GitHub Actions.
   Original S04 scroll/animation algorithms remain in section-three.js. */
const artRoot = '/assets/skins/golden-pagoda-garden/section-04/';
const originals = [
  'event-paper-top.webp','event-paper-bottom.webp',
  'event-arch.webp','event-corner.webp'
];
const processed = ['s04-royal-background.webp','s04-royal-frame.webp'];

async function openEvents(page) {
  await page.goto('/?skin=golden-pagoda-garden');
  await page.getByRole('button', {name:'Open Invitation'}).click();
  await page.locator('#eventDetails').scrollIntoViewIfNeeded();
  await expect(page.locator('#eventDetails')).toHaveAttribute('aria-hidden','false');
  return page.locator('#eventDetails');
}

test('royal Section 4 retains geometry, assets and both working ceremonies',async ({page},info)=>{
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const events=await openEvents(page);
  for(const file of [...originals,...processed]){
    const res=await page.request.get(artRoot+file);
    expect(res.status(),file).toBe(200);
  }
  await expect(events).toHaveAttribute('data-reference-paper','loaded');
  const m=await events.evaluate(s=>{
    const paper=s.querySelector('.event-source-paper');
    const cards=[...s.querySelectorAll('.event-reference-card')];
    const body=s.querySelector('.event-body');
    const frame=s.querySelector('.event-shared-arch');
    const css=getComputedStyle(s);
    const i=paper.getBoundingClientRect();
    const c=cards[0].getBoundingClientRect();
    const k=getComputedStyle(cards[0], '::before');
    return {
      minHeight:parseFloat(css.minHeight),
      bodyMin:parseFloat(getComputedStyle(body).minHeight),
      bodyPad:parseFloat(getComputedStyle(body).paddingTop),
      bodyWidth:body.getBoundingClientRect().width,
      cardCount:cards.length,
      cardWidth:c.width,cardMinHeight:parseFloat(getComputedStyle(cards[0]).minHeight),
      archMinHeight:parseFloat(getComputedStyle(frame).minHeight),
      borderWidth:k.borderTopWidth, borderImage:k.borderImageSource,
      borderSlice:k.borderImageSlice,paper:paper.currentSrc,
      paperNatural:[paper.naturalWidth,paper.naturalHeight],
      paperTransform:getComputedStyle(paper).transform,
      overflow:document.documentElement.scrollWidth-innerWidth,
      sectionHeight:s.getBoundingClientRect().height,
      frameWidth:frame.getBoundingClientRect().width,
      paperRect:[i.width,i.height]
    };
  });
  const width=page.viewportSize().width;
  expect(m.minHeight).toBe(1581);
  expect(m.bodyPad).toBe(120);
  expect(m.bodyMin).toBe(width===320?1742:width===360?1650:1581);
  expect(m.cardCount).toBe(2);
  expect(m.archMinHeight).toBe(1164);
  expect(m.borderImage).toContain('s04-royal-frame.webp');
  expect(m.borderSlice).toContain('200');
  expect(m.paper).toContain('s04-royal-background.webp');
  expect(m.paperNatural).toEqual([1080,1920]);
  expect(m.overflow).toBeLessThanOrEqual(1);
  expect(m.cardWidth).toBeGreaterThan(200);
  expect(errors).toEqual([]);
  await expect(events.locator('#eventNikahHeading')).toHaveText('Akad Nikah');
  await expect(events.locator('#eventReceptionHeading')).toHaveText('Wedding Reception');
  await expect(events.locator('#eventDirections')).toHaveAttribute('href',/maps\/search/);
  await expect(events.locator('.event-waze-link')).toHaveAttribute('href',/waze.com/);
  await expect(events.locator('.event-calendar-link')).toHaveAttribute('href',/calendar\/render/);
  await expect(events.locator('#eventCountDays')).not.toBeEmpty();
  await events.screenshot({path:info.outputPath('royal-s04-'+width+'.png'),animations:'disabled'});
});

test('original Section 4 paper camera responds in forward and reverse scroll',async ({page})=>{
  const events=await openEvents(page);
  const y=await events.evaluate(el=>el.getBoundingClientRect().top+window.scrollY);
  await page.evaluate(y=>window.scrollTo({top:y+100,behavior:'instant'}),y);
  await expect.poll(()=>events.getAttribute('data-event-paper-shift')).not.toBe(null);
  const first=Number(await events.getAttribute('data-event-paper-shift'));
  await page.evaluate(y=>window.scrollTo({top:y+650,behavior:'instant'}),y);
  await expect.poll(async()=>Number(await events.getAttribute('data-event-paper-shift'))).not.toBe(first);
  await page.evaluate(y=>window.scrollTo({top:y+100,behavior:'instant'}),y);
  await expect.poll(async()=>Number(await events.getAttribute('data-event-paper-shift'))).toBeCloseTo(first,0);
});

test('royal event section stays inert for default Testing-4 skin',async ({page})=>{
  await page.goto('/');
  const art=await page.locator('#eventDetails').evaluate(s=>{
    const c=s.querySelector('.event-reference-card');
    return {
      varSource:getComputedStyle(c).getPropertyValue('--event-arch-source'),
      previewPaper:s.querySelector('.event-source-paper').getAttribute('src'),
      bg:getComputedStyle(s).backgroundColor
    };
  });
  expect(art.varSource).not.toContain('s04-royal-frame.webp');
  expect(art.previewPaper||'').not.toContain('s04-royal-background.webp');
});

test('reduced-motion does not hide the ceremony or animate the paper',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  const events=await openEvents(page);
  const data=await events.evaluate(s=>({
    headingOpacity:getComputedStyle(s.querySelector('#eventNikahHeading')).opacity,
    paperTransform:getComputedStyle(s.querySelector('.event-source-paper')).transform,
    count:s.querySelectorAll('.event-reference-card').length,
    access:s.getAttribute('aria-hidden')
  }));
  expect(data.count).toBe(2);
  expect(data.access).toBe('false');
  expect(data.headingOpacity).toBe('1');
  expect(data.paperTransform).toBe('none');
});

test('royal event skin does not request vendor reference imagery',async ({page})=>{
  const requests=[];
  page.on('request',req=>{
    if(req.url().includes('undangankahwin.com/images/concierge/'))requests.push(req.url());
  });
  await openEvents(page);
  await expect(page.locator('#eventDetails')).toHaveAttribute('data-reference-paper','loaded');
  expect(requests.filter(url=>/paper\.webp|arch_event\.svg|bfly_white\.webp/.test(url))).toEqual([]);
});
