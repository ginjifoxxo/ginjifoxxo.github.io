(() => {
  'use strict';
  const root = document.documentElement;
  let observer;
  const showAll = () => {
    root.classList.remove('reveal-enabled');
    clearTimeout(window.GinjiRevealFallback);
    observer?.disconnect();
  };
  try {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches || !('IntersectionObserver' in window)) { showAll(); return; }
    const groups = document.querySelectorAll('[data-reveal]');
    observer = new IntersectionObserver(entries => {
      clearTimeout(window.GinjiRevealFallback);
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px 60px 0px', threshold: 0 });
    // Establish the hidden style before starting transitions, even with cached CSS.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      try {
        for (const group of groups) observer.observe(group);
      } catch { showAll(); }
    }));
    motion.addEventListener('change', () => { if (motion.matches) showAll(); });
    window.addEventListener('pageshow', event => { if (event.persisted) showAll(); });
  } catch { showAll(); }
})();
