'use strict';

/* Section 04 — approved Yangon example venues for Golden Pagoda Garden only.
   Do not modify the reference Testing-4 skin, date/time labels, original
   artwork, sticky-scroll choreography, or existing animation keyframes. */
(() => {
  if (new URLSearchParams(window.location.search).get('skin') !== 'golden-pagoda-garden' ||
      document.documentElement.dataset.goldenPagodaSkin !== 'true') return;

  const section = document.getElementById('eventDetails');
  if (!section) return;

  for (const [id, title] of [['eventNikahHeading', 'Wedding Ceremony'], ['eventReceptionHeading', 'Wedding Reception']]) {
    const heading = document.getElementById(id);
    if (heading) { heading.textContent = title; heading.lang = 'en'; heading.setAttribute('aria-label', title); }
  }

  const hotel = 'Chatrium Hotel Royal Lake Yangon';
  const street = '40 Natmauk Road, Tamwe Township, Yangon 11211, Myanmar';
  const destination = hotel + ', ' + street;
  const googleUrl = 'https://www.google.com/maps/dir/?' + new URLSearchParams({
    api: '1', destination
  });
  const wazeUrl = 'https://www.waze.com/ul?' + new URLSearchParams({
    q: hotel, navigate: 'yes'
  });

  const venues = [
    {card: '.event-card-nikah', room: 'Pool Garden', type: 'ceremony'},
    {card: '.event-card-reception', room: 'Grand Ballroom', type: 'reception'}
  ];
  let configured = 0;

  for (const venue of venues) {
    const card = section.querySelector(venue.card);
    if (!card) continue;
    const place = card.querySelector('.event-card-place');
    const address = card.querySelector('.event-card-address');
    const google = card.querySelector('.event-map-link:not(.event-waze-link)');
    if (!place || !address || !google) continue;

    // Keep the source HTML slots, text-reveal wrappers, and their positions.
    // Set visible location in two clear lines without replacing original art.
    place.textContent = venue.room;
    address.replaceChildren();
    const hotelLine = document.createElement('span');
    hotelLine.className = 'royal-event-hotel';
    hotelLine.textContent = hotel;
    const streetLine = document.createElement('span');
    streetLine.className = 'royal-event-street';
    streetLine.textContent = street;
    address.append(hotelLine, streetLine);

    let actions = google.closest('.event-card-links');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'event-card-links';
      google.before(actions);
      actions.append(google);
    }
    google.href = googleUrl;
    google.textContent = 'Google Maps';
    google.setAttribute('aria-label', 'Google Maps directions to ' + venue.room + ' at ' + hotel);

    let waze = actions.querySelector('.event-waze-link');
    if (!waze) {
      waze = document.createElement('a');
      waze.className = 'event-map-link event-waze-link';
      actions.append(waze);
    }
    waze.href = wazeUrl;
    waze.target = '_blank';
    waze.rel = 'noopener noreferrer';
    waze.textContent = 'Waze';
    waze.setAttribute('aria-label', 'Waze directions to ' + venue.room + ' at ' + hotel);
    card.dataset.royalVenue = venue.type;
    configured++;
  }

  if (configured !== venues.length) return;

  const headline = section.querySelector('.event-prototype-label');
  if (headline) headline.textContent = 'WEDDING DETAILS · YANGON · SAMPLE';

  const countdown = section.querySelector('.event-countdown-grid');
  if (countdown) countdown.setAttribute('aria-label',
    'Countdown to the sample wedding reception in Yangon, Myanmar');

  // Match the unchanged displayed sample reception (7:30–10:30 PM) to
  // Yangon UTC+06:30 instead of inheriting the old Malaysia UTC+08 offset.
  const calendar = section.querySelector('.event-calendar-link');
  if (calendar) {
    const calendarUrl = new URL('https://www.google.com/calendar/render');
    calendarUrl.search = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'The Wedding of Thiha Aung & Thiri May — Sample Reception',
      dates: '20270123T130000Z/20270123T160000Z',
      ctz: 'Asia/Yangon',
      location: 'Grand Ballroom, ' + destination,
      details: 'Sample wedding invitation only. Date, hours and venue are illustrative and are not a confirmed booking.'
    }).toString();
    calendar.href = calendarUrl.href;
    calendar.setAttribute('aria-label', 'Add the unconfirmed sample Yangon reception to Google Calendar');
  }

  const notice = document.getElementById('eventDirectionsNote');
  if (notice) notice.textContent =
    'Sample Yangon wedding details only — date, times and venue are illustrative, not a confirmed booking.';

  section.dataset.royalVenueLocation = 'chatrium-yangon';
})();
