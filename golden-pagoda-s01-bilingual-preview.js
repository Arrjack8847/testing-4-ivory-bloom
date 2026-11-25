'use strict';

/* Opt-in text-only Section 1 review. No change to source scene geometry,
   original S1 artwork/animations, other sections, or any production wording.
   Active for ?skin=golden-pagoda-garden; not gated behind a debug flag */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('skin') !== 'golden-pagoda-garden') return;

  document.documentElement.dataset.goldenPagodaS01Wording = 'true';
  document.title = 'Ivory Bloom — Wedding Invitation';

  const cover = document.getElementById('cover');
  const opened = document.getElementById('opened');
  if (!cover || !opened) return;

  // No monogram, sparkles or extra wording in the refined cover.
  // Keep the existing monogram slot's HEIGHT with CSS to preserve the
  // original Testing-4 text positioning, without presenting any initials.
  const monogram = cover.querySelector('.monogram');
  if (monogram) {
    monogram.replaceChildren();
    monogram.removeAttribute('aria-label');
    monogram.setAttribute('aria-hidden','true');
  }

  const coverHeading = cover.querySelector('.cover-copy .eyebrow');
  if (coverHeading) coverHeading.textContent = 'THE WEDDING OF';

  const coverNames = cover.querySelector('.cover-copy h1');
  if (coverNames) {
    const connector = coverNames.querySelector('em') || document.createElement('em');
    connector.textContent = '&';
    connector.lang = 'en';
    const firstLine = document.createElement('span');
    firstLine.className = 'ivory-cover-name';
    firstLine.textContent = 'Thiha Aung';
    const secondLine = document.createElement('span');
    secondLine.className = 'ivory-cover-name';
    secondLine.textContent = 'Thiri May';
    coverNames.replaceChildren(firstLine, connector, secondLine);
    coverNames.setAttribute('aria-label', 'Thiha Aung and Thiri May');
    coverNames.lang = 'en';
  }

  // Refine the CTA copy without replacing the button or its original event handler.
  const openButton = document.getElementById('openButton');
  if (openButton) { openButton.textContent = 'VIEW INVITATION'; openButton.setAttribute('aria-label', 'View wedding invitation'); }

  const heading = opened.querySelector('.opened-copy .eyebrow');
  if (heading) { heading.textContent = 'THE WEDDING OF'; heading.lang = 'en'; }

  const names = opened.querySelector('.ceremony-names');
  if (names) names.setAttribute('aria-label','Thiha Aung & Thiri May');
  const first = opened.querySelector('.name-first');
  const conjunction = opened.querySelector('.name-amp');
  const second = opened.querySelector('.name-second');
  if (first) { first.textContent = 'Thiha Aung'; first.lang = 'en'; }
  if (conjunction) { conjunction.textContent = '&'; conjunction.lang = 'en'; }
  if (second) { second.textContent = 'Thiri May'; second.lang = 'en'; }

  // Static vertical Myanmar composition — no compact font-width measuring.

  // Reuse the two original guest text slots. They still reveal with the date.
  const guestIntro = opened.querySelector('.guest span');
  const guestEmphasis = opened.querySelector('.guest strong');
  if (guestIntro) { guestIntro.textContent = 'You are cordially'; guestIntro.lang = 'en'; }
  if (guestEmphasis) { guestEmphasis.textContent = 'Invited'; guestEmphasis.lang = 'en'; }

  const swipe = opened.querySelector('.swipe-cue');
  if (swipe) {
    const textNode = Array.from(swipe.childNodes).find(node=>node.nodeType===Node.TEXT_NODE);
    if (textNode) textNode.textContent = 'Swipe Up ';
  }
})();
