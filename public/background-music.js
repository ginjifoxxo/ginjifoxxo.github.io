(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiBackgroundMusic = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  let localize = () => {};
  function init({ getLanguage }) {
    const audio = document.getElementById('background-audio');
    const button = document.querySelector('.music-disc');
    const player = button.parentElement;
    let pending = false, failed = !!audio.error, generation = 0, playing = false, infoTimer;
    function update() {
      const vi = getLanguage() !== 'en';
      const label = failed ? (vi ? 'Nhạc chưa khả dụng' : 'Music unavailable')
        : pending || !audio.paused ? (vi ? 'Tạm dừng' : 'Pause') : (vi ? 'Phát nhạc' : 'Play');
      button.setAttribute('aria-label', label + ' — Chocolate Lemon');
      button.setAttribute('aria-pressed', String(!failed && !audio.paused));
      button.dataset.playing = String(playing && !failed);
      button.disabled = failed;
    }
    function removeFallback() {
      document.removeEventListener('pointerdown', firstInteraction, true);
      document.removeEventListener('keydown', firstInteraction, true);
    }
    function fail() { failed = true; pending = false; playing = false; generation++; removeFallback(); audio.pause(); update(); }
    async function start() {
      if (failed || pending) return;
      const token = ++generation;
      pending = true; audio.volume = .15; update();
      try {
        await audio.play();
        if (token !== generation) return;
        pending = false;
        if (!audio.paused) { playing = true; removeFallback(); }
        update();
      } catch {
        if (token !== generation) return;
        pending = false; playing = false;
        if (audio.error) fail();
        else update(); // Autoplay denial is normal; no prompt or retry loop.
      }
    }
    function firstInteraction(event) {
      if (!event.isTrusted || (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.metaKey || event.altKey || ['Shift','Control','Alt','Meta','Tab'].includes(event.key)))) return;
      removeFallback();
      // The disc's own click performs exactly one predictable Play/Pause action.
      if (event.target.closest('.music-disc')) return;
      start();
    }
    button.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') {
        clearTimeout(infoTimer); player.classList.add('show-info');
        infoTimer = setTimeout(() => player.classList.remove('show-info'), 2800);
      }
    });
    button.addEventListener('click', () => {
      removeFallback();
      if (pending || !audio.paused) {
        generation++; pending = false; playing = false; audio.pause(); update();
      } else start();
    });
    audio.addEventListener('playing', () => { playing = !audio.paused; update(); });
    for (const event of ['pause','waiting','ended']) audio.addEventListener(event, () => { playing = false; update(); });
    audio.addEventListener('error', fail);
    localize = update; update(); player.hidden = false;
    if (failed) return;
    document.addEventListener('pointerdown', firstInteraction, true);
    document.addEventListener('keydown', firstInteraction, true);
    start(); // One best-effort autoplay attempt, followed by at most one genuine gesture retry.
  }
  return { init, localize: () => localize() };
});
