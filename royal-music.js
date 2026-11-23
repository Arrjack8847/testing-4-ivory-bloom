'use strict';
// Isolated soundtrack player for the Golden Pagoda Garden skin.
(() => {
  if (new URLSearchParams(location.search).get('skin') !== 'golden-pagoda-garden') return;
  const open = document.getElementById('openButton');
  const reset = document.getElementById('resetButton');
  const audio = document.getElementById('royalSoundtrack');
  const button = document.getElementById('royalMusicToggle');
  if (!open || !audio || !button) return;

  const KEY = 'golden-pagoda-garden-music-muted';
  const VOLUME = 0.28;
  const FADE_SECONDS = 2;
  let opened = false;
  let unavailable = false;
  let muted = false;
  let context, gain, frame = 0;
  try { muted = localStorage.getItem(KEY) === 'yes'; } catch (_) {}

  function update() {
    button.hidden = !opened || unavailable;
    button.dataset.muted = muted ? 'yes' : 'no';
    button.setAttribute('aria-label', muted ? 'Play wedding music' : 'Mute wedding music');
    button.setAttribute('aria-pressed', muted ? 'false' : 'true');
    button.title = muted ? 'Play wedding music' : 'Mute wedding music';
  }

  function initialize() {
    if (!audio.src) audio.src = audio.dataset.src;
    if (context) return;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return;
    try {
      context = new Context();
      const source = context.createMediaElementSource(audio);
      gain = context.createGain();
      gain.gain.value = 0;
      source.connect(gain);
      gain.connect(context.destination);
    } catch (_) { context = null; gain = null; }
  }

  function stopFade() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (context && gain) gain.gain.cancelScheduledValues(context.currentTime);
  }

  function fadeIn() {
    stopFade();
    if (context && gain) {
      const now = context.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(VOLUME, now + FADE_SECONDS);
    } else {
      // HTML audio volume cannot be changed on some older iPhones.
      const start = performance.now();
      const tick = now => {
        audio.volume = Math.min(VOLUME, VOLUME * (now - start) / (FADE_SECONDS * 1000));
        if (audio.volume < VOLUME && !audio.paused) frame = requestAnimationFrame(tick);
      };
      audio.volume = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function mute() {
    stopFade();
    audio.muted = true;
    audio.pause();
    if (gain && context) gain.gain.value = 0;
  }

  function play() {
    initialize();
    audio.muted = false;
    if (context && context.state === 'suspended') context.resume().catch(() => {});
    // This play() call occurs directly in the user tap handler on mobile.
    const request = audio.play();
    if (request && typeof request.then === 'function') {
      request.then(() => {
        if (opened && !muted) fadeIn();
        else mute();
      }).catch(() => {
        if (audio.error) unavailable = true;
        muted = true;
        update();
      });
    } else fadeIn();
  }

  audio.addEventListener('error', () => {
    mute();
    unavailable = true;
    update();
    console.warn('Royal soundtrack MP3 missing: assets/audio/endless-beauty-main.mp3');
  });
  open.addEventListener('click', () => {
    opened = true;
    update();
    if (!muted) play();
  });
  button.addEventListener('click', () => {
    muted = !muted;
    try { localStorage.setItem(KEY, muted ? 'yes' : 'no'); } catch (_) {}
    update();
    if (muted) mute();
    else play();
  });
  reset?.addEventListener('click', () => {
    opened = false;
    mute();
    try { audio.currentTime = 0; } catch (_) {}
    update();
  });
  update();
})();