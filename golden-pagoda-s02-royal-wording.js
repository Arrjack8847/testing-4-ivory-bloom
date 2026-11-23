'use strict';

/* Golden Pagoda Garden — Section 2 live wording only.
   Reuse the original letter frame and five text positions, leaving its
   background, Section 1, scroll choreography, and all animations untouched.
   The reference (no skin query) keeps its original language and content. */
(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('skin') !== 'golden-pagoda-garden') return;

  const content = document.querySelector('#message .letter-content');
  const heading = document.getElementById('messageHeading');
  if (!content || !heading) return;

  const line = (className, text, language = 'my') => {
    const element = document.createElement('p');
    element.className = className;
    element.lang = language;
    element.textContent = text;
    return element;
  };

  content.replaceChildren(
    line('letter-bismillah royal-message-kicker', 'WITH LOVE', 'en'),
    line('letter-lead royal-message-title', 'မင်္ဂလာအခါသမယ'),
    line('royal-message-paragraph', 'ချစ်ခြင်းမေတ္တာနှင့် ပြည့်ဝသော ဘဝခရီးသစ်ကို ကျွန်ုပ်တို့နှစ်ဦး အတူတကွ စတင်တော့မည်ဖြစ်ပါသည်။'),
    line('royal-message-paragraph', 'ကျွန်ုပ်တို့၏ မင်္ဂလာနေ့ရက်လေးတွင် လူကြီးမင်းတို့နှင့်အတူ ပျော်ရွှင်မှုနှင့် အမှတ်တရများကို မျှဝေခွင့်ရမည်ဆိုပါက အထူးဝမ်းမြောက်မိပါသည်။'),
    line('letter-source royal-message-signoff', 'Two hearts, one beautiful journey.', 'en')
  );
  heading.textContent = 'Royal wedding message';

  // Section 2's four optional corner WebPs are intentionally not injected.
  // The approved assets are preserved in GitHub for a possible future skin.
  // All wording, central canopy, letter frame and closing ornament remain.

  // Keep the complete approved closing artwork in normal document flow.
  // This avoids a large fixed padding after the frame, which previously
  // produced a long empty parchment tail on iPhones. The image remains
  // visually outside the reading border, like the top canopy.
  const frame = content.closest('.letter-frame');
  if (frame && !document.querySelector('#message .royal-message-footer')) {
    const footer = document.createElement('img');
    footer.className = 'royal-message-footer';
    footer.src = './assets/skins/golden-pagoda-garden/section-02/closing-ornament.webp';
    footer.width = 600;
    footer.height = 350;
    footer.alt = '';
    footer.setAttribute('aria-hidden', 'true');
    footer.decoding = 'async';
    footer.draggable = false;
    frame.insertAdjacentElement('afterend', footer);
  }
})();
