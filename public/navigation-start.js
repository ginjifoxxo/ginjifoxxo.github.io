(() => {
  'use strict';
  // Normalize legacy section URLs before content or anchor scrolling can paint.
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  const navigation = performance.getEntriesByType('navigation')[0];
  const reloading = navigation ? navigation.type === 'reload' : performance.navigation?.type === 1;
  if (!reloading) return;
  const previous = history.scrollRestoration;
  history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, behavior: 'instant' });
  window.addEventListener('pageshow', () => window.scrollTo({ top: 0, behavior: 'instant' }), { once: true });
  // Keep reload restoration disabled through startup; restore normal history
  // behavior on first interaction or before leaving (including BFCache).
  const events = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'pagehide'];
  function restoreHistory() {
    history.scrollRestoration = previous;
    for (const event of events) window.removeEventListener(event, restoreHistory);
  }
  for (const event of events) window.addEventListener(event, restoreHistory, { once: true, passive: true });
})();

// Pre-paint opt-in with a fail-open timeout if the deferred bootstrap fails.
(() => {
  try {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.GinjiRevealFallback = setTimeout(() => document.documentElement.classList.remove('reveal-enabled'), 1800);
    document.documentElement.classList.add('reveal-enabled');
  } catch { document.documentElement.classList.remove('reveal-enabled'); }
})();
