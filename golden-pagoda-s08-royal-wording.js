'use strict';

/* Section 8 bilingual royal wording, matching the approved S01/S02
 * hierarchy: small English kicker, one Myanmar message and a short English
 * signoff. The reference skin, existing artwork, interactions and scroll
 * system are not changed. */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('skin') !== 'golden-pagoda-garden') return;

  const section = document.getElementById('weddingGift');
  if (!section) return;
  const heading = section.querySelector('#giftEightHeading');
  const intro = section.querySelector('.gift-eight-intro');
  const trigger = section.querySelector('#giftEightTrigger');
  if (!heading || !intro || !trigger) return;

  const span = (className, content, lang) => {
    const element = document.createElement('span');
    element.className = className;
    element.textContent = content;
    element.lang = lang;
    return element;
  };

  heading.replaceChildren(
    span('gift-eight-royal-kicker', 'WITH GRATITUDE', 'en'),
    span('gift-eight-royal-title', 'မင်္ဂလာလက်ဆောင်', 'my')
  );
  heading.setAttribute('aria-label', 'Wedding Gift — မင်္ဂလာလက်ဆောင်');

  intro.replaceChildren(
    span('gift-eight-royal-message',
      'ကျွန်ုပ်တို့၏ မင်္ဂလာပွဲသို့ ကြွရောက်ချီးမြှင့်ပေးခြင်းသည်ပင် အဖိုးတန်ဆုံး လက်ဆောင်ဖြစ်ပါသည်။',
      'my'),
    span('gift-eight-royal-signoff', 'With love and gratitude.', 'en')
  );

  // Mirror S01's restrained English CTA: preserve this exact button node,
  // aria-controls, aria-expanded and the gift disclosure event listener.
  // This is a preview-only disclosure, not a real gift transfer.
  trigger.textContent = 'GIFT DETAILS';
  trigger.setAttribute('aria-label', 'Preview wedding gift details; transfers are not enabled');
})();
