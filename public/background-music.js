(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiBackgroundMusic = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  let localize = () => {};
  function init({ getLanguage }) {
    const audio = document.getElementById('background-audio');
    const button = document.querySelector('.background-music');
    const action = button.querySelector('.music-action');
    let pending = false, failed = !!audio.error, generation = 0, frame = null;
    const cancelFade = () => { if (frame !== null) cancelAnimationFrame(frame); frame = null; };
    function update() {
      const vi = getLanguage() !== 'en';
      const playing = pending || !audio.paused;
      const label = failed ? (vi ? 'Nhạc chưa khả dụng' : 'Music unavailable')
        : playing ? (vi ? 'Tạm dừng' : 'Pause') : (vi ? 'Phát nhạc' : 'Play');
      action.textContent = label;
      button.setAttribute('aria-label', label + ' — Chocolate Lemon');
      button.setAttribute('aria-pressed', String(playing && !failed));
      button.title = label + ' — Chocolate Lemon';
      button.disabled = failed;
    }
    function pause() {
      generation++; pending = false; cancelFade();
      audio.pause(); audio.volume = 0; update();
    }
    button.addEventListener('click', async () => {
      if (failed) return;
      if (pending || !audio.paused) { pause(); return; }
      const token = ++generation;
      pending = true; audio.volume = 0; update();
      try {
        // Called directly in the user's gesture, never from a timer or page load.
        await audio.play();
        if (token !== generation || audio.paused) return;
        pending = false; update();
        let started = null;
        function fade(now) {
          frame = null;
          if (token !== generation || audio.paused) return;
          if (started === null) started = now;
          const progress = Math.min(1, (now - started) / 800);
          audio.volume = .35 * progress;
          if (progress < 1) frame = requestAnimationFrame(fade);
        }
        frame = requestAnimationFrame(fade);
      } catch {
        if (token !== generation) return;
        pending = false; cancelFade();
        if (audio.error) failed = true;
        update(); // A rejected browser play request remains safely retryable.
      }
    });
    audio.addEventListener('pause', () => {
      if (!audio.paused) return;
      pending = false; cancelFade(); update();
    });
    audio.addEventListener('error', () => { failed = true; pause(); });
    localize = update;
    update(); button.hidden = false;
  }
  return { init, localize: () => localize() };
});
