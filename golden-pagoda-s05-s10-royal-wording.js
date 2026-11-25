'use strict';

/* Golden Pagoda Garden — Sections 5–10 copy adapter.
   Match approved S01/S02 romantic Myanmar + understated English wording.
   Live-text only; do not alter art, heights, scroll motion, form endpoints,
   payment state, source assets, or the unskinned Testing-4 reference. */
(() => {
  if (new URLSearchParams(window.location.search).get('skin') !== 'golden-pagoda-garden') return;

  const set = (selector, value, lang = 'copy') => {
    const el = document.querySelector(selector);
    if (!el) return null;
    el.textContent = value;
    el.lang = 'en';
    if (lang === 'copy') el.classList.add('royal-my-text');
    return el;
  };
  const mark = id => {
    const el = document.getElementById(id);
    if (el) el.dataset.royalWording = 'true';
    return el;
  };

  // S05 — the original six example clock times remain unchanged/unverified.
  if (mark('runningOrder')) {
    set('#runningOrder .order-eyebrow', 'WEDDING DAY', 'en');
    set('#runningOrderHeading', 'Order of the Day');
    const copy = [
      ['Welcome Guests', 'Reception begins'],
      ['Arrival of the Couple'],
      ['Wedding Ceremony', 'A beautiful beginning'],
      ['Wedding Photography'],
      ['Wedding Reception'],
      ['Farewell']
    ];
    document.querySelectorAll('#runningOrder .order-entry').forEach((row, i) => {
      if (!copy[i]) return;
      const title = row.querySelector('.order-event-text strong');
      const sub = row.querySelector('.order-event-text small');
      if (title) {
        title.textContent = copy[i][0];
        title.lang = 'en';
        title.classList.add('royal-my-text');
      }
      if (sub && copy[i][1]) {
        sub.textContent = copy[i][1];
        sub.lang = 'en';
        sub.classList.add('royal-my-text');
      }
    });
    set('#runningOrder .order-disclosure', 'Sample running order. Event times have not been confirmed.', 'en');
    const timeline = document.querySelector('#runningOrder .order-timeline');
    if (timeline) timeline.setAttribute('aria-label', 'Illustrative wedding programme — times unconfirmed');
  }

  // S06 — swatch hex values are untouched; they remain illustrative.
  if (mark('dressCode')) {
    set('#dressCode .dress-eyebrow', 'COLOUR PALETTE', 'en');
    set('#dressCodeHeading', 'Dress Code');
    set('#dressCode .dress-intro', 'For a beautifully coordinated celebration, we invite you to take inspiration from our chosen colour palettes.');
    set('#dressCode .dress-palette:first-child .dress-side', 'Groom\'s Side');
    set('#dressCode .dress-palette:last-child .dress-side', 'Bride\'s Side');
    set('#dressCode .dress-disclosure', 'Sample palette only. Final attire guidance has not been confirmed.', 'en');
    const palettes = document.querySelectorAll('#dressCode .dress-palette');
    palettes[0]?.setAttribute('aria-label', 'Sample groom-side colours');
    palettes[1]?.setAttribute('aria-label', 'Sample bride-side colours');
  }

  // S07 — headings/captions only; do not swap, retouch or claim ownership of photos.
  if (mark('gallery')) {
    set('#gallery .gallery-eyebrow', 'PRECIOUS MOMENTS', 'en');
    set('#galleryHeading', 'Our Gallery');
    set('#gallery .gallery-intro', 'Tap a frame to view', 'en');
    const captions = ['Together', 'The Bride', 'The Groom', 'Garden', 'Lakeside'];
    document.querySelectorAll('#gallery .gallery-photo').forEach(card => {
      const slot = Number(card.dataset.gallerySlot);
      if (!Number.isInteger(slot) || !captions[slot]) return;
      for (const selector of ['.gallery-slot-label', '.gallery-frame-caption']) {
        const node = card.querySelector(selector);
        if (node) {
          node.textContent = captions[slot];
          node.lang = 'en';
          node.classList.add('royal-my-text');
        }
      }
    });
    set('#gallery .gallery-disclaimer', 'Sample gallery — photographs require the couple’s approval.', 'en');
  }

  // S08 — no invented bank details, gift purchases, or enabled transfers.
  if (mark('weddingGift')) {
    set('#giftEightHeading', 'Wedding Gift');
    set('#weddingGift .gift-eight-intro',
      'Your presence is the greatest gift of all. If you wish to give a gift, please view the details below.');
    const trigger = document.getElementById('giftEightTrigger');
    if (trigger) {
      for (const child of trigger.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) { child.textContent = ' GIFT DETAILS'; break; }
      }
      trigger.setAttribute('aria-label', 'Preview gift details; transfers are not enabled');
    }
    set('#giftEightDisclaimer',
      'Example only — bank accounts, gift purchases and reservations are not enabled.', 'en');
  }

  // S09 — remove the unverified RSVP deadline and demo family identities.
  // Leave the form values, consent checkbox, submit handlers and API untouched.
  if (mark('rsvp')) {
    set('#rsvp .s9-eyebrow', 'WITH LOVE', 'en');
    set('#rsvpHeading', 'RSVP & Best Wishes');
    const labels = document.querySelectorAll('#rsvp .s9-field label');
    const labelCopy = ['Full Name', 'Attendance', 'Number of Guests', 'Your Wishes'];
    labels.forEach((el, i) => {
      if (!labelCopy[i]) return;
      el.textContent = labelCopy[i];
      el.lang = 'en';
      el.classList.add('royal-my-text');
    });
    const guestName = document.getElementById('s9Name');
    if (guestName) { guestName.placeholder = 'Full Name'; guestName.lang = 'en'; }
    const wish = document.getElementById('s9Wish');
    if (wish) { wish.placeholder = 'Write a few warm words…'; wish.lang = 'en'; }
    set('#s9WishesNote',
      'Only wishes shared with permission and approved for publication appear below.');
    const consent = document.querySelector('#rsvp .s9-consent');
    if (consent) {
      for (const child of consent.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = ' Allow my wish to be shared publicly after review.';
          break;
        }
      }
      consent.lang = 'en';
      consent.classList.add('royal-my-text');
    }
    const examples = [
      ['Sample Wish 1', 'Wishing you both a lifetime of love and happiness.'],
      ['Sample Wish 2', 'May your new journey together be filled with joy.'],
      ['Sample Wish 3', 'May love and understanding always fill your home.']
    ];
    document.querySelectorAll('#wishesWall .s9-wish').forEach((card, i) => {
      if (!examples[i]) return; // Actual API-backed wishes replace demo cards.
      const who = card.querySelector('.s9-who strong');
      const place = card.querySelector('.s9-who span');
      const message = card.querySelector('p');
      for (const [node, txt] of [[who,examples[i][0]],[place,'SAMPLE'],[message,examples[i][1]]]) {
        if (!node) continue;
        node.textContent = txt;
        node.lang = 'en';
        if (txt !== 'SAMPLE') node.classList.add('royal-my-text');
      }
    });
    set('#rsvp .s9-demo-note', 'Sample wishes only — not actual guest submissions.');
  }

  // S10 — identical couple names to S01, no fictitious contacts.
  if (mark('closingMessage')) {
    set('#closingHeading', 'Thank You');
    set('#closingMessage .closing10-message',
      'Thank you for sharing in our special day. Your love, kindness and warm wishes will always hold a place in our hearts.');
    set('#closingMessage .closing10-signoff', 'WITH LOVE & GRATITUDE', 'en');
    set('#closingMessage .closing10-credit', 'JACKNEX STUDIO', 'en');
    const names = document.querySelectorAll('#closingMessage .closing10-names span');
    for (const [i, txt] of [[0,'Thiha Aung'],[1,'&'],[2,'Thiri May']]) {
      if (!names[i]) continue;
      names[i].textContent = txt;
      names[i].lang = 'en';
      names[i].classList.add('royal-my-text');
    }
    set('#closingMessage .closing10-disclosure',
      'Example invitation · Contact details are unavailable until verified.', 'en');
  }
})();