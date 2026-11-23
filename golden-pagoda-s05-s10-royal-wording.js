'use strict';

/* Golden Pagoda Garden — Sections 5–10 copy adapter.
   Match approved S01/S02 romantic Myanmar + understated English wording.
   Live-text only; do not alter art, heights, scroll motion, form endpoints,
   payment state, source assets, or the unskinned Testing-4 reference. */
(() => {
  if (new URLSearchParams(window.location.search).get('skin') !== 'golden-pagoda-garden') return;

  const set = (selector, value, lang = 'my') => {
    const el = document.querySelector(selector);
    if (!el) return null;
    el.textContent = value;
    el.lang = lang;
    if (lang === 'my') el.classList.add('royal-my-text');
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
    set('#runningOrderHeading', 'မင်္ဂလာနေ့ အစီအစဉ်');
    const copy = [
      ['ဧည့်သည်များ ကြိုဆိုခြင်း', 'ဧည့်ခံပွဲ စတင်ခြင်း'],
      ['မင်္ဂလာမောင်နှံ ကြွရောက်ခြင်း'],
      ['မင်္ဂလာအခမ်းအနား', 'ဘဝခရီးသစ်၏ အစ'],
      ['အမှတ်တရ ဓာတ်ပုံများ'],
      ['ဧည့်ခံကျွေးမွေးခြင်း'],
      ['မင်္ဂလာပွဲ ပြီးဆုံးခြင်း']
    ];
    document.querySelectorAll('#runningOrder .order-entry').forEach((row, i) => {
      if (!copy[i]) return;
      const title = row.querySelector('.order-event-text strong');
      const sub = row.querySelector('.order-event-text small');
      if (title) {
        title.textContent = copy[i][0];
        title.lang = 'my';
        title.classList.add('royal-my-text');
      }
      if (sub && copy[i][1]) {
        sub.textContent = copy[i][1];
        sub.lang = 'my';
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
    set('#dressCodeHeading', 'မင်္ဂလာဝတ်စားဆင်ယင်မှု');
    set('#dressCode .dress-intro', 'မင်္ဂလာနေ့လေးကို ပိုမိုလှပစေရန် လိုက်ဖက်သည့် အရောင်လေးများဖြင့် စိတ်ကူးပုံဖော်ထားပါသည်။');
    set('#dressCode .dress-palette:first-child .dress-side', 'သတို့သားဘက်');
    set('#dressCode .dress-palette:last-child .dress-side', 'သတို့သမီးဘက်');
    set('#dressCode .dress-disclosure', 'Sample palette only. Final attire guidance has not been confirmed.', 'en');
    const palettes = document.querySelectorAll('#dressCode .dress-palette');
    palettes[0]?.setAttribute('aria-label', 'Sample groom-side colours');
    palettes[1]?.setAttribute('aria-label', 'Sample bride-side colours');
  }

  // S07 — headings/captions only; do not swap, retouch or claim ownership of photos.
  if (mark('gallery')) {
    set('#gallery .gallery-eyebrow', 'PRECIOUS MOMENTS', 'en');
    set('#galleryHeading', 'ချစ်ခြင်းအမှတ်တရများ');
    set('#gallery .gallery-intro', 'Tap a frame to view', 'en');
    const captions = ['နှစ်ဦးအတူ', 'သတို့သမီး', 'သတို့သား', 'ဥယျာဉ်', 'ရေကန်'];
    document.querySelectorAll('#gallery .gallery-photo').forEach(card => {
      const slot = Number(card.dataset.gallerySlot);
      if (!Number.isInteger(slot) || !captions[slot]) return;
      for (const selector of ['.gallery-slot-label', '.gallery-frame-caption']) {
        const node = card.querySelector(selector);
        if (node) {
          node.textContent = captions[slot];
          node.lang = 'my';
          node.classList.add('royal-my-text');
        }
      }
    });
    set('#gallery .gallery-disclaimer', 'Sample gallery — photographs require the couple’s approval.', 'en');
  }

  // S08 — no invented bank details, gift purchases, or enabled transfers.
  if (mark('weddingGift')) {
    set('#giftEightHeading', 'မင်္ဂလာလက်ဆောင်');
    set('#weddingGift .gift-eight-intro',
      'မင်္ဂလာနေ့လေးသို့ ကြွရောက်ချီးမြှင့်ပေးခြင်းသည် ကျွန်ုပ်တို့အတွက် အဖိုးတန်ဆုံး လက်ဆောင်ဖြစ်ပါသည်။ မေတ္တာဖြင့် လက်ဆောင်ပေးလိုပါက အောက်ပါအချက်အလက်များကို ကြည့်ရှုနိုင်ပါသည်။');
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
    set('#rsvpHeading', 'တက်ရောက်မှုနှင့် ဆုမွန်ကောင်းများ');
    const labels = document.querySelectorAll('#rsvp .s9-field label');
    const labelCopy = ['မိမိအမည်', 'တက်ရောက်မှု', 'ဧည့်သည်ဦးရေ', 'မင်္ဂလာဆုမွန်'];
    labels.forEach((el, i) => {
      if (!labelCopy[i]) return;
      el.textContent = labelCopy[i];
      el.lang = 'my';
      el.classList.add('royal-my-text');
    });
    const guestName = document.getElementById('s9Name');
    if (guestName) { guestName.placeholder = 'မိမိအမည်'; guestName.lang = 'my'; }
    const wish = document.getElementById('s9Wish');
    if (wish) { wish.placeholder = 'မင်္ဂလာဆုမွန်လေး ရေးသားပါ…'; wish.lang = 'my'; }
    set('#s9WishesNote',
      'ခွင့်ပြုချက်ရရှိပြီး စစ်ဆေးအတည်ပြုထားသော ဆုမွန်များကိုသာ အောက်တွင် ဖော်ပြပါမည်။');
    const consent = document.querySelector('#rsvp .s9-consent');
    if (consent) {
      for (const child of consent.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
          child.textContent = ' စစ်ဆေးပြီးနောက် မိမိဆုမွန်ကို အများမြင်နိုင်ရန် ခွင့်ပြုပါသည်။';
          break;
        }
      }
      consent.lang = 'my';
      consent.classList.add('royal-my-text');
    }
    const examples = [
      ['နမူနာဆုမွန် ၁', 'မင်္ဂလာမောင်နှံနှစ်ဦး ချစ်ခြင်းမေတ္တာဖြင့် ပျော်ရွှင်ပါစေ။'],
      ['နမူနာဆုမွန် ၂', 'အတူတကွ လျှောက်လှမ်းမည့် ဘဝခရီးလေး သာယာလှပပါစေ။'],
      ['နမူနာဆုမွန် ၃', 'မေတ္တာနှင့် နားလည်မှုများ အမြဲပြည့်ဝပါစေ။']
    ];
    document.querySelectorAll('#wishesWall .s9-wish').forEach((card, i) => {
      if (!examples[i]) return; // Actual API-backed wishes replace demo cards.
      const who = card.querySelector('.s9-who strong');
      const place = card.querySelector('.s9-who span');
      const message = card.querySelector('p');
      for (const [node, txt] of [[who,examples[i][0]],[place,'SAMPLE'],[message,examples[i][1]]]) {
        if (!node) continue;
        node.textContent = txt;
        node.lang = txt === 'SAMPLE' ? 'en' : 'my';
        if (txt !== 'SAMPLE') node.classList.add('royal-my-text');
      }
    });
    set('#rsvp .s9-demo-note', 'နမူနာဆုမွန်များသာ ဖြစ်ပါသည်။ အမှန်တကယ် ပေးပို့ထားသော စာများ မဟုတ်ပါ။');
  }

  // S10 — identical couple names to S01, no fictitious contacts.
  if (mark('closingMessage')) {
    set('#closingHeading', 'ကျေးဇူးတင်မေတ္တာ');
    set('#closingMessage .closing10-message',
      'ကျွန်ုပ်တို့၏ မင်္ဂလာနေ့လေးတွင် အတူရှိပေးကြမည့်အတွက် ကျေးဇူးအထူးတင်ရှိပါသည်။ မေတ္တာနှင့် ဆုမွန်ကောင်းများကို အမြဲအမှတ်ရနေပါမည်။');
    set('#closingMessage .closing10-signoff', 'WITH LOVE & GRATITUDE', 'en');
    const names = document.querySelectorAll('#closingMessage .closing10-names span');
    for (const [i, txt] of [[0,'သီဟအောင်'],[1,'နှင့်'],[2,'သီရိမေ']]) {
      if (!names[i]) continue;
      names[i].textContent = txt;
      names[i].lang = 'my';
      names[i].classList.add('royal-my-text');
    }
    set('#closingMessage .closing10-disclosure',
      'Example invitation · Contact details are unavailable until verified.', 'en');
  }
})();