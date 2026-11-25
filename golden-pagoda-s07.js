'use strict';
/* S07 Royal Gallery activation.
   The master coordinator imports this file only after approving the 47-asset
   baseline. The existing section-five.js remains the sole owner of photo
   loading, gallery interactions and native <dialog> navigation. */
(() => {
  const isRoyal = document.documentElement.dataset.goldenPagodaSkin === 'true' &&
    new URLSearchParams(location.search).get('skin') === 'golden-pagoda-garden';
  if (!isRoyal) return;

  const section = document.getElementById('gallery');
  if (!section) return;

  // DOM/tab sequence must match what guests see: groom and bride on top,
  // then the couple together in the center. Gallery loader cached the original
  // slot-indexed buttons before this adapter, so its click/viewer mapping stays
  // correct. The default skin never runs this reorder.
  const grid = section.querySelector('.gallery-photos');
  if (grid) {
    const cards = new Map(Array.from(grid.querySelectorAll('[data-gallery-slot]'))
      .map(node => [Number(node.dataset.gallerySlot), node]));
    if ([0, 1, 2, 3, 4].every(slot => cards.has(slot))) {
      [2, 1, 0, 3, 4].forEach(slot => grid.appendChild(cards.get(slot)));
    }
  }

  // Ivory Bloom Section 1 foreground is a couple cutout, not scenery.
  // Reuse the approved people-free lakeside finale scene in the gallery.
  const inheritedScene = section.querySelector('.gallery-scene-image');
  if (inheritedScene) {
    inheritedScene.removeAttribute('srcset');
    inheritedScene.removeAttribute('src');
  }

  // CSS decorations only start downloading shortly before the gallery is
  // visited. Once active, keep the resolved artwork; toggling visibility on
  // every reverse scroll would waste decoding and cause image flicker.
  function activateArtwork() {
    if (section.dataset.goldenGalleryActive === 'true') return;
    section.dataset.goldenGalleryActive = 'true';
    if (inheritedScene) {
      inheritedScene.src = './assets/skins/golden-pagoda-garden/section-10/finale-scene.webp';
    }
  }

  if (!('IntersectionObserver' in window)) {
    activateArtwork();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    activateArtwork();
    observer.disconnect();
  }, { rootMargin: '260px 0px', threshold: 0 });
  observer.observe(section);
})();
