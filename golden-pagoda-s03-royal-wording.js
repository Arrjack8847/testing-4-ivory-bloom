'use strict';

/* Golden Pagoda Garden — Section 3 royal wording only.
   Match the approved S01 couple names and S02 Myanmar–English tone.
   Keep the original Testing-4 portrait surfaces, section geometry, reveal,
   scroll camera, artwork and reference (no skin query) entirely unchanged.
   Load AFTER section-couple-reference.js, which applies source-demo copy. */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('skin') !== 'golden-pagoda-garden') return;

  const section = document.getElementById('couple');
  if (!section) return;

  const setCopy = (selector, value, lang) => {
    const element = section.querySelector(selector);
    if (!element) return;
    element.textContent = value;
    element.lang = lang;
  };

  setCopy('.couple-salutation', 'TOGETHER IN LOVE', 'en');
  setCopy('.couple-title', 'The Bride & Groom', 'en');

  setCopy('.couple-profile--groom .couple-name', 'Thiha Aung', 'en');
  setCopy('.couple-profile--groom .couple-role', 'THE GROOM', 'en');
  setCopy('.couple-profile--groom .couple-family', 'With love', 'en');

  setCopy('.couple-separator', '&', 'en');
  const separator = section.querySelector('.couple-separator');
  if (separator) separator.setAttribute('aria-label', '&');

  setCopy('.couple-profile--bride .couple-name', 'Thiri May', 'en');
  setCopy('.couple-profile--bride .couple-role', 'THE BRIDE', 'en');
  setCopy('.couple-profile--bride .couple-family', 'A beautiful beginning', 'en');

  // Former source-demo parent names were unverified for this couple.
  // Use two short, non-biographical romantic captions instead.
  const groom = section.querySelector('.couple-profile--groom');
  const bride = section.querySelector('.couple-profile--bride');
  if (groom) groom.setAttribute('aria-label', 'The groom, Thiha Aung');
  if (bride) bride.setAttribute('aria-label', 'The bride, Thiri May');

  section.dataset.royalWording = 'true';
})();
