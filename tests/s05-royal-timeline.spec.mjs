import {test,expect} from '@playwright/test';

async function openRoyal(page){
  const failures=[],errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{
    if(response.url().includes('/assets/skins/golden-pagoda-garden/section-05/') &&
       response.status()>=400)failures.push(response.status()+' '+response.url());
  });
  await page.goto('/?skin=golden-pagoda-garden');
  const section=page.locator('#runningOrder');
  await expect(section).toHaveAttribute('data-section','5');
  await page.getByRole('button',{name:'Open Invitation'}).click();
  await expect(section).toHaveAttribute('aria-hidden','false');
  await page.evaluate(()=>{
    document.documentElement.style.scrollBehavior='auto';
    document.getElementById('runningOrder').scrollIntoView({behavior:'instant',block:'start'});
  });
  return {section,failures,errors};
}

test('five S05 WebPs render and original six event records survive',async({page},testInfo)=>{
  const {section,failures,errors}=await openRoyal(page);
  await expect(section).toHaveAttribute('data-art','royal');
  await expect(section).toHaveAttribute('data-royal-assets','ready');
  await expect(section.locator('.order-royal-art')).toHaveCount(4);
  await expect(section.locator('.order-entry')).toHaveCount(6);
  await expect(section.locator('.order-entry time')).toHaveText([
    '11:00 am','12:00 pm','12:30 pm','1:00 pm','2:00 pm','4:00 pm'
  ]);
  await expect(section.locator('.order-entry strong')).toHaveText([
    'Guests arrive','The couple arrive','Wedding procession',
    'Bersanding & photographs','Lunch is served','Celebration ends'
  ]);
  await expect(section.locator('.order-entry').first()).toContainText('Lunch service opens');
  await expect(section.locator('.order-entry').nth(2)).toContainText('Led by kompang from the main entrance');
  await expect(section.locator('.order-disclosure')).toContainText('example');
  await expect(section.locator('#orderArtworkNotice')).toBeHidden();
  const art=await section.locator('.order-royal-art').evaluateAll(images=>
    images.map(image=>({ok:image.complete&&image.naturalWidth>0,
      alt:image.getAttribute('alt'),aria:image.getAttribute('aria-hidden')}))
  );
  expect(art.every(image=>image.ok && image.alt==='' && image.aria==='true')).toBe(true);
  const background=await section.evaluate(el=>({
    css:getComputedStyle(el).backgroundImage,repeat:getComputedStyle(el).backgroundRepeat
  }));
  expect(background.css).toContain('timeline-paper.webp');
  expect(background.repeat).toContain('repeat');
  await section.screenshot({path:testInfo.outputPath('s05-royal-'+testInfo.project.name+'.png'),
    animations:'disabled'});
  expect(failures).toEqual([]);
  expect(errors).toEqual([]);
});

test('four-phone alignment and boundaries; no horizontal clipping',async({page})=>{
  const {section,failures,errors}=await openRoyal(page);
  await expect(section).toHaveAttribute('data-royal-assets','ready');
  const result=await section.evaluate(el=>{
    const previous=document.getElementById('eventDetails');
    const next=document.getElementById('dressCode');
    const rect=el.getBoundingClientRect();
    const inner=el.querySelector('.order-inner').getBoundingClientRect();
    const rows=[...el.querySelectorAll('.order-entry')].map(node=>{
      const b=node.getBoundingClientRect();
      const t=node.querySelector('.order-event-text').getBoundingClientRect();
      return {top:b.top,bottom:b.bottom,left:b.left,right:b.right,textRight:t.right};
    });
    return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
      sectionLeft:rect.left,sectionRight:rect.right,sectionHeight:rect.height,
      innerLeft:inner.left,innerRight:inner.right,
      beforeGap:rect.top-previous.getBoundingClientRect().bottom,
      afterGap:next.getBoundingClientRect().top-rect.bottom,
      adjacent:previous.nextElementSibling===el,rows};
  });
  expect(result.adjacent).toBe(true);
  expect(Math.abs(result.beforeGap)).toBeLessThanOrEqual(1);
  expect(Math.abs(result.afterGap)).toBeLessThanOrEqual(1);
  expect(result.scrollWidth-result.width).toBeLessThanOrEqual(1);
  expect(result.sectionLeft).toBeGreaterThanOrEqual(-1);
  expect(result.sectionRight).toBeLessThanOrEqual(result.width+1);
  expect(result.sectionHeight).toBeGreaterThanOrEqual(651);
  expect(result.innerLeft).toBeGreaterThanOrEqual(-1);
  expect(result.innerRight).toBeLessThanOrEqual(result.width+1);
  for(let i=0;i<result.rows.length;i++){
    const r=result.rows[i];
    expect(r.left).toBeGreaterThanOrEqual(-1);
    expect(r.right).toBeLessThanOrEqual(result.width+1);
    expect(r.textRight).toBeLessThanOrEqual(result.width+1);
    if(i)expect(r.top).toBeGreaterThanOrEqual(result.rows[i-1].bottom-.5);
  }
  expect(failures).toEqual([]);
  expect(errors).toEqual([]);
});

test('14 schedule items with long descriptions expand without overlap',async({page},testInfo)=>{
  const {section,errors}=await openRoyal(page);
  await page.emulateMedia({reducedMotion:'reduce'});
  await section.evaluate(el=>{
    const list=el.querySelector('.order-timeline');
    for(let i=0;i<8;i++){
      const row=document.createElement('li');
      row.className='order-entry';
      const time=document.createElement('time');
      time.className='order-time';
      time.dateTime='18:00';
      time.textContent='6:00 pm';
      const details=document.createElement('div');
      details.className='order-event-text';
      const title=document.createElement('strong');
      title.textContent='A longer ceremonial procession, family blessing and wedding photography';
      const subtitle=document.createElement('small');
      subtitle.textContent='Guests move through the royal garden in groups, with a detailed note that must wrap naturally on small screens without crossing decorative flourishes.';
      details.append(title,subtitle);
      row.append(time,details);
      list.append(row);
    }
  });
  const metrics=await section.evaluate(el=>{
    const rows=[...el.querySelectorAll('.order-entry')];
    const box=el.getBoundingClientRect();
    return {height:box.height,rows:rows.map(row=>{
      const a=row.getBoundingClientRect(),b=row.querySelector('.order-event-text').getBoundingClientRect();
      return {top:a.top,bottom:a.bottom,textRight:b.right};
    }),scrollWidth:document.documentElement.scrollWidth,width:innerWidth};
  });
  expect(metrics.rows).toHaveLength(14);
  expect(metrics.height).toBeGreaterThan(900);
  expect(metrics.scrollWidth-metrics.width).toBeLessThanOrEqual(1);
  for(let i=1;i<metrics.rows.length;i++){
    expect(metrics.rows[i].top).toBeGreaterThanOrEqual(metrics.rows[i-1].bottom-.5);
    expect(metrics.rows[i].textRight).toBeLessThanOrEqual(metrics.width+1);
  }
  await section.screenshot({path:testInfo.outputPath('s05-royal-long-'+testInfo.project.name+'.png'),
    animations:'disabled'});
  expect(errors).toEqual([]);
});

test('Royal skin skips the hidden camera and reduced motion disables floral sway',async({page})=>{
  const {section,errors}=await openRoyal(page);
  const absoluteTop=await section.evaluate(el=>el.getBoundingClientRect().top+scrollY);
  const sample=async offset=>{
    await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),absoluteTop+offset);
    await page.waitForTimeout(100);
    return Number(await section.getAttribute('data-order-camera'));
  };
  const first=await sample(0),forward=await sample(180),reverse=await sample(0);
  expect(first).toBe(0);
  expect(forward).toBe(0);
  expect(reverse).toBe(0);
  await expect(section).toHaveAttribute('data-order-camera-mode','disabled-royal');
  await page.emulateMedia({reducedMotion:'reduce'});
  await sample(180);
  expect(Math.abs(Number(await section.getAttribute('data-order-camera')))).toBeLessThan(.05);
  await expect(section.locator('.order-royal-floral')).toHaveCSS('animation-name','none');
  await expect(section.locator('.order-heading')).toHaveCSS('opacity','1');
  expect(errors).toEqual([]);
});

test('default non-royal skin retains existing reference layout',async({page})=>{
  const royalRequests=[];
  page.on('request',req=>{
    if(req.url().includes('/assets/skins/golden-pagoda-garden/section-05/'))
      royalRequests.push(req.url());
  });
  await page.goto('/');
  const section=page.locator('#runningOrder');
  await expect(section).toHaveAttribute('data-art','reference');
  await expect(section.locator('.order-royal-art')).toHaveCount(0);
  await expect(section).not.toHaveAttribute('data-royal-assets');
  const background=await section.evaluate(el=>getComputedStyle(el).backgroundImage);
  expect(background).not.toContain('timeline-paper.webp');
  expect(royalRequests).toEqual([]);
});
