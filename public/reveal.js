(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.GinjiScenes = api; api.init(); }
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  // Different entry/exit bands give long sections a stable, readable viewing area.
  function isVisible(rect, height, active) {
    const margin = height * (active ? .08 : .16);
    return rect.bottom > margin && rect.top < height - margin;
  }
  function init() {
    const root = document.documentElement;
    const scenes = [...document.querySelectorAll('.scene')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    function showAll() {
      root.classList.remove('reveal-enabled', 'intro-running');
      clearTimeout(window.GinjiRevealFallback);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      for (const scene of scenes) scene.inert = false;
    }
    function update() {
      frame = null;
      if (motion.matches || !root.classList.contains('reveal-enabled')) return;
      try {
        for (const scene of scenes) {
          // Offset geometry is unaffected by our scale/filter animation.
          const rect = { top: scene.offsetTop - scrollY, bottom: scene.offsetTop + scene.offsetHeight - scrollY };
          const visible = isVisible(rect, innerHeight, scene.classList.contains('is-visible'));
          scene.classList.toggle('is-passed', rect.bottom <= innerHeight * .16);
          scene.classList.toggle('is-visible', visible);
          scene.inert = !visible;
        }
        clearTimeout(window.GinjiRevealFallback);
      } catch { showAll(); }
    }
    function schedule() { if (frame === null) frame = requestAnimationFrame(update); }
    try {
      if (motion.matches) { showAll(); return; }
      root.classList.add('intro-running');
      requestAnimationFrame(() => requestAnimationFrame(update));
      setTimeout(() => root.classList.remove('intro-running'), 1200);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.querySelector('main'));
      motion.addEventListener('change', () => { if (motion.matches) showAll(); else { root.classList.add('reveal-enabled'); schedule(); } });
      window.addEventListener('pageshow', event => { if (event.persisted) { root.classList.remove('intro-running'); schedule(); } });
    } catch { showAll(); }
  }
  return { isVisible, init };
});
