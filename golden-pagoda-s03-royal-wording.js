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
  setCopy('.couple-title', 'မင်္ဂလာမောင်နှံ', 'my');

  setCopy('.couple-profile--groom .couple-name', 'သီဟအောင်', 'my');
  setCopy('.couple-profile--groom .couple-role', 'THE GROOM', 'en');
  setCopy('.couple-profile--groom .couple-family', 'ချစ်ခြင်းမေတ္တာဖြင့်', 'my');

  setCopy('.couple-separator', 'နှင့်', 'my');
  const separator = section.querySelector('.couple-separator');
  if (separator) separator.setAttribute('aria-label', 'နှင့်');

  setCopy('.couple-profile--bride .couple-name', 'သီရိမေ', 'my');
  setCopy('.couple-profile--bride .couple-role', 'THE BRIDE', 'en');
  setCopy('.couple-profile--bride .couple-family', 'ဘဝခရီးသစ်ဆီသို့', 'my');

  // Former source-demo parent names were unverified for this couple.
  // Use two short, non-biographical romantic captions instead.
  const groom = section.querySelector('.couple-profile--groom');
  const bride = section.querySelector('.couple-profile--bride');
  if (groom) groom.setAttribute('aria-label', 'သတို့သား သီဟအောင်');
  if (bride) bride.setAttribute('aria-label', 'သတို့သမီး သီရိမေ');

  section.dataset.royalWording = 'true';
})();
