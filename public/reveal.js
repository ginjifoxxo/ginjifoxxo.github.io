(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.GinjiScenes = api; api.init(); }
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  // Mirrored boundaries and a small 4% hysteresis work in either direction.
  function isVisible(rect, height, active) {
    const margin = height * (active ? .10 : .14);
    return rect.bottom > margin && rect.top < height - margin;
  }
  function layoutTop(element) {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  }
  function init() {
    const root = document.documentElement;
    const blocks = [...document.querySelectorAll('[data-scroll-reveal]')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = null;
    function showAll() {
      root.classList.remove('reveal-enabled');
      clearTimeout(window.GinjiRevealFallback);
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    }
    function update() {
      frame = null;
      if (motion.matches || !root.classList.contains('reveal-enabled')) return;
      try {
        // Read all untransformed layout boxes before writing visual states.
        const measurements = blocks.map(block => {
          const top = layoutTop(block) - scrollY;
          return { block, top, bottom: top + block.offsetHeight };
        });
        for (const rect of measurements) {
          const block = rect.block;
          const visible = block.contains(document.activeElement) || isVisible(rect, innerHeight, block.classList.contains('is-visible'));
          block.classList.toggle('is-passed', rect.bottom <= innerHeight * .14);
          block.classList.toggle('is-visible', visible);
        }
        clearTimeout(window.GinjiRevealFallback);
      } catch { showAll(); }
    }
    function schedule() { if (frame === null) frame = requestAnimationFrame(update); }
    try {
      if (motion.matches) showAll();
      else { root.classList.add('reveal-enabled'); requestAnimationFrame(() => requestAnimationFrame(update)); }
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule, { passive: true });
      document.addEventListener('focusin', schedule);
      document.addEventListener('focusout', schedule);
      if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(schedule);
        observer.observe(document.querySelector('main'));
        for (const block of blocks) observer.observe(block);
      }
      motion.addEventListener('change', () => { if (motion.matches) showAll(); else { root.classList.add('reveal-enabled'); schedule(); } });
      window.addEventListener('pageshow', schedule);
    } catch { showAll(); }
  }
  return { isVisible, init };
});
