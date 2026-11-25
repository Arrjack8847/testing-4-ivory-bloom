'use strict';

/* Section 03 — Royal Floating Parchment, Golden Pagoda Garden skin only.
 * Reuse the existing portrait DOM, gold overlays, ring separator and scroll
 * controller. Use fictional sample parent identities for the public demo.
 */
(() => {
  if (new URLSearchParams(window.location.search).get('skin') !== 'golden-pagoda-garden') return;
  const section = document.getElementById('couple');
  if (!section || section.dataset.royalPaper === 'ready') return;

  const root = './assets/skins/golden-pagoda-garden/section-03/';
  const images = {
    parchment: 's03-royal-parchment-card.webp',
    plaque: 's03-royal-parentage-plaque.webp',
    lotus: 's03-royal-card-lotus.webp'
  };
  const profiles = [
    {selector: '.couple-profile--groom', titleMy: 'Beloved son of', parents: 'U Aung Myint & Daw Khin Than'},
    {selector: '.couple-profile--bride', titleMy: 'Beloved daughter of', parents: 'U Min Zaw & Daw Thida Win'}
  ];
  const decorativeImage = (file, className) => {
    const img = document.createElement('img');
    img.className = className;
    img.src = root + file;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    img.loading = 'lazy';
    img.draggable = false;
    return img;
  };

  const stacks = [];
  for (const config of profiles) {
    const profile = section.querySelector(config.selector);
    if (!profile) continue;
    const portrait = profile.querySelector('.couple-portrait');
    const name = profile.querySelector('.couple-name');
    const role = profile.querySelector('.couple-role');
    const family = profile.querySelector('.couple-family');
    if (!portrait || !name || !role || !family) continue;

    const stack = document.createElement('div');
    stack.className = 'royal-paper-stack';
    const paper = decorativeImage(images.parchment, 'royal-paper-art');
    stack.append(paper, name, role);

    const plaque = document.createElement('div');
    plaque.className = 'royal-parentage-plaque';
    plaque.appendChild(decorativeImage(images.plaque, 'royal-parentage-art'));
    const myanmar = document.createElement('span');
    myanmar.className = 'royal-parentage-my';
    myanmar.lang = 'en';
    myanmar.textContent = config.titleMy;
    plaque.appendChild(myanmar);
    stack.appendChild(plaque);

    // Fictional sample parent names; keep live text editable per wedding.
    family.textContent = config.parents;
    family.lang = 'en';
    family.dataset.parentNames = 'sample';
    stack.appendChild(family);
    stack.appendChild(decorativeImage(images.lotus, 'royal-lotus-footer'));

    // Moving the existing text nodes preserves their scroll-reveal observers.
    // The portrait stays in its original place for existing focal zoom logic.
    portrait.insertAdjacentElement('afterend', stack);
    stacks.push(stack);
  }

  if (stacks.length !== profiles.length) return;
  section.dataset.royalPaper = 'ready';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) {
    stacks.forEach(stack => stack.classList.add('is-in-view'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in-view');
      observer.unobserve(entry.target);
    }
  }, {rootMargin: '0px 0px -8% 0px', threshold: 0.05});
  stacks.forEach(stack => observer.observe(stack));
  section.dataset.royalPaperMotion = 'ready';
})();
