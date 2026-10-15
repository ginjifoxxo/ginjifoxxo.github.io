(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiGallery = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  function normalize(records) {
    if (!Array.isArray(records)) throw Error('Gallery must be an array');
    const seen = new Set();
    return records.filter(item => {
      if (!item || !['art','fursuit'].includes(item.category) || typeof item.src !== 'string' || typeof item.alt !== 'string') return false;
      if (!item.src.startsWith('assets/gallery/' + item.category + '/') || item.src.split('/').includes('..') || !/\.(png|jpe?g|webp|avif|gif)$/i.test(item.src) || seen.has(item.src)) return false;
      seen.add(item.src); return true;
    });
  }
  function collection(items, filter) {
    const matches = filter === 'all' ? items : items.filter(item => item.category === filter);
    const preview = filter === 'all'
      ? matches.filter(item => Number.isInteger(item.featuredOrder)).sort((a, b) => a.featuredOrder - b.featuredOrder).slice(0, 5)
      : matches.slice(0, 5);
    return { items: matches, preview, remaining: Math.max(0, matches.length - preview.length) };
  }
  let localize = () => {};
  function init({ getLanguage }) {
    const preview = document.getElementById('gallery-preview');
    const full = document.getElementById('gallery-full');
    const filters = document.querySelector('.gallery-filters');
    const empty = document.querySelector('.gallery-empty');
    const dialog = document.getElementById('gallery-dialog');
    const lightbox = document.getElementById('gallery-lightbox');
    const image = lightbox.querySelector('img');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let items = [], filter = 'all', request = 0, animation = null;
    const triggers = new Map();
    const vi = () => getLanguage() !== 'en';
    const make = (tag, cls) => { const el = document.createElement(tag); el.className = cls; return el; };
    function labels() {
      filters.setAttribute('aria-label', vi() ? 'Lọc thư viện' : 'Gallery filters');
      dialog.setAttribute('aria-label', vi() ? 'Thư viện — ' + filter : 'Gallery — ' + filter);
      lightbox.setAttribute('aria-label', vi() ? 'Ảnh phóng to' : 'Full gallery image');
      dialog.querySelector('.gallery-close').setAttribute('aria-label', vi() ? 'Đóng thư viện' : 'Close gallery');
      lightbox.querySelector('button').setAttribute('aria-label', vi() ? 'Đóng ảnh' : 'Close image');
      for (const el of document.querySelectorAll('.gallery-more-label')) el.textContent = vi() ? 'Xem thêm' : 'View more';
      for (const el of document.querySelectorAll('.gallery-item')) el.setAttribute('aria-label', (vi() ? 'Phóng to ảnh' : 'Open image') + ': ' + (el.querySelector('img').alt || el.dataset.number));
    }
    function openImage(item, trigger) {
      triggers.set(lightbox, trigger);
      image.src = item.src; image.alt = item.alt;
      lightbox.showModal();
    }
    function tile(item, index) {
      const button = make('button', 'gallery-item');
      button.type = 'button'; button.dataset.number = String(index + 1);
      button.setAttribute('aria-haspopup', 'dialog');
      const img = make('img', ''); img.loading = 'lazy'; img.decoding = 'async'; img.alt = item.alt;
      const thumb = item.previewSrc;
      img.src = typeof thumb === 'string' && thumb.startsWith('assets/gallery/' + item.category + '/') && !thumb.split('/').includes('..') ? thumb : item.src;
      if (Number.isInteger(item.width) && item.width > 0 && Number.isInteger(item.height) && item.height > 0) {
        img.width = item.width; img.height = item.height;
      }
      button.append(img);
      button.addEventListener('click', () => openImage(item, button));
      return button;
    }
    function render() {
      const group = collection(items, filter);
      preview.classList.toggle('gallery-collage', group.preview.length === 5 && group.items.length > 5);
      preview.replaceChildren(...group.preview.map(tile));
      empty.hidden = group.items.length > 0;
      if (group.items.length > 5) {
        const more = make('button', 'gallery-more'); more.type = 'button'; more.setAttribute('aria-haspopup', 'dialog');
        const label = make('span', 'gallery-more-label'); more.append(label);
        more.addEventListener('click', () => {
          triggers.set(dialog, more);
          full.replaceChildren(...group.items.map(tile)); labels(); dialog.showModal();
        });
        preview.append(more);
      }
      for (const button of filters.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.galleryFilter === filter));
      labels();
    }
    async function select(next) {
      if (next === filter && !animation) return;
      const token = ++request;
      animation?.cancel();
      const animate = !motion.matches && typeof preview.animate === 'function';
      if (animate) {
        animation = preview.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: .25, transform: 'scale(.99)' }], { duration: 140, fill: 'forwards' });
        await animation.finished.catch(() => {});
      }
      if (token !== request) return;
      filter = next; animation?.cancel(); render();
      if (animate && !motion.matches) {
        animation = preview.animate([{ opacity: .25, transform: 'scale(.99)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 200 });
        await animation.finished.catch(() => {});
      }
      if (token === request) animation = null;
    }
    for (const button of filters.querySelectorAll('button')) button.addEventListener('click', () => select(button.dataset.galleryFilter));
    for (const popup of [dialog, lightbox]) {
      popup.querySelector('button').addEventListener('click', () => popup.close());
      let outside = false;
      const isOutside = event => {
        if (popup === lightbox) return event.target === popup;
        const r = popup.getBoundingClientRect();
        return event.target === popup && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
      };
      popup.addEventListener('pointerdown', event => { outside = isOutside(event); });
      popup.addEventListener('click', event => { if (outside && isOutside(event)) popup.close(); outside = false; });
      popup.addEventListener('close', () => {
        outside = false; triggers.get(popup)?.focus({ preventScroll: true });
        if (popup === dialog) full.replaceChildren();
        else image.removeAttribute('src');
      });
    }
    motion.addEventListener('change', () => { if (motion.matches) animation?.finish(); });
    localize = labels; labels();
    fetch('data/gallery.json', { cache: 'no-cache' }).then(response => {
      if (!response.ok) throw Error('Gallery unavailable');
      return response.json();
    }).then(data => { items = normalize(data); filters.hidden = items.length === 0; render(); }).catch(() => {
      items = []; filters.hidden = true; render(); // Keep the existing translated empty state.
    });
  }
  return { normalize, collection, init, localize: () => localize() };
});
