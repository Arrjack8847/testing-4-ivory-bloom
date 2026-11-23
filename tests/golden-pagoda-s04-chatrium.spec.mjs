import {test,expect} from '@playwright/test';

const royalUrl = process.env.GP_TEST_URL || '/?skin=golden-pagoda-garden';
const hotel = 'Chatrium Hotel Royal Lake Yangon';
const address = '40 Natmauk Road, Tamwe Township, Yangon 11211, Myanmar';

test('Section 4 Royal ceremony/reception use approved Yangon venue and two maps each', async ({page}) => {
  await page.goto(royalUrl);
  await expect(page.locator('#eventDetails')).toHaveAttribute('data-royal-venue-location','chatrium-yangon');

  for (const [cls,room,word] of [
    ['.event-card-nikah','Pool Garden','မင်္ဂလာအခမ်းအနား'],
    ['.event-card-reception','Grand Ballroom','မင်္ဂလာဧည့်ခံပွဲ']
  ]) {
    const card=page.locator('#eventDetails '+cls);
    await expect(card.locator('.event-card-title')).toHaveText(word);
    await expect(card.locator('.event-card-place')).toHaveText(room);
    await expect(card.locator('.royal-event-hotel')).toHaveText(hotel);
    await expect(card.locator('.royal-event-street')).toHaveText(address);
    const anchors=card.locator('.event-card-links a');
    await expect(anchors).toHaveCount(2);
    await expect(anchors.nth(0)).toHaveText('Google Maps');
    await expect(anchors.nth(1)).toHaveText('Waze');
    const google=new URL(await anchors.nth(0).getAttribute('href'));
    const waze=new URL(await anchors.nth(1).getAttribute('href'));
    expect(google.hostname).toBe('www.google.com');
    expect(google.searchParams.get('api')).toBe('1');
    expect(google.searchParams.get('destination')).toContain(hotel);
    expect(google.searchParams.get('destination')).toContain('Yangon');
    expect(waze.hostname).toBe('www.waze.com');
    expect(waze.searchParams.get('q')).toBe(hotel);
    expect(waze.searchParams.get('navigate')).toBe('yes');
    await expect(anchors.nth(0)).toHaveAttribute('target','_blank');
    await expect(anchors.nth(1)).toHaveAttribute('rel',/noopener/);
  }
  await expect(page.locator('#eventDetails')).not.toContainText('Kuala Lumpur');
});

test('Royal Section 4 keeps sample hours, correct Yangon calendar and usable mobile map layout',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(royalUrl);
  const section=page.locator('#eventDetails');
  await expect(section.locator('.event-card-nikah .event-card-time')).toContainText('10:00 AM');
  await expect(section.locator('.event-card-reception .event-card-time')).toContainText('7:30 PM');
  await expect(section.locator('.event-card-reception .event-card-time')).toContainText('10:30 PM');
  const calendarUrl=new URL(await section.locator('.event-calendar-link').getAttribute('href'));
  expect(calendarUrl.searchParams.get('dates')).toBe('20270123T130000Z/20270123T160000Z');
  expect(calendarUrl.searchParams.get('ctz')).toBe('Asia/Yangon');
  expect(calendarUrl.searchParams.get('location')).toContain('Grand Ballroom, '+hotel);
  await expect(page.locator('#eventDirectionsNote')).toContainText('not a confirmed booking');
  for(const cls of ['.event-card-nikah','.event-card-reception']){
    const measurement=await section.locator(cls).evaluate(card=>{
      const box=card.getBoundingClientRect();
      const buttons=[...card.querySelectorAll('.event-card-links a')].map(el=>el.getBoundingClientRect());
      const street=card.querySelector('.royal-event-street').getBoundingClientRect();
      return {
        card:{left:box.left,right:box.right,top:box.top,bottom:box.bottom,height:box.height},
        buttons:buttons.map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom})),
        street:{left:street.left,right:street.right,top:street.top,bottom:street.bottom}
      };
    });
    expect(measurement.buttons).toHaveLength(2);
    expect(measurement.buttons[0].right).toBeLessThan(measurement.buttons[1].left);
    for(const b of measurement.buttons){
      expect(b.left).toBeGreaterThanOrEqual(measurement.card.left-2);
      expect(b.right).toBeLessThanOrEqual(measurement.card.right+2);
      expect(b.bottom).toBeLessThanOrEqual(measurement.card.bottom+2);
    }
    expect(measurement.street.right).toBeLessThanOrEqual(measurement.card.right+2);
    expect(measurement.street.bottom).toBeLessThan(measurement.buttons[0].top);
  }
});

test('Reference Testing-4 skin keeps its Malaysian example venues unchanged',async ({page})=>{
  const other=new URL(royalUrl,'http://127.0.0.1:8000');
  other.searchParams.delete('skin');
  await page.goto(other.href);
  await expect(page.locator('#eventDetails .event-card-nikah .event-card-place')).toHaveText('Masjid Wilayah Persekutuan');
  await expect(page.locator('#eventDetails .event-card-reception .event-card-place')).toHaveText('Grand Ballroom, St. Regis Kuala Lumpur');
  await expect(page.locator('#eventDetails .event-card-nikah .event-card-links')).toHaveCount(0);
  await expect(page.locator('#eventDetails .event-card-reception .event-card-links a')).toHaveCount(2);
});
