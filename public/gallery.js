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
    const featured = items.filter(item => Number.isInteger(item.featuredOrder)).sort((a, b) => a.featuredOrder - b.featuredOrder).slice(0, 5);
    const excluded = new Set(featured.map(item => item.src));
    const preview = filter === 'all'
      ? featured
      : matches.filter(item => !excluded.has(item.src) && Number.isInteger(item.categoryPreviewOrder)).sort((a, b) => a.categoryPreviewOrder - b.categoryPreviewOrder).slice(0, 5);
    const visible = new Set(preview.map(item => item.src));
    const more = matches.filter(item => !visible.has(item.src) && Number.isInteger(item.moreOrder?.[filter])).sort((a, b) => a.moreOrder[filter] - b.moreOrder[filter]).slice(0, 4);
    return { items: matches, preview, more, remaining: Math.max(0, matches.length - preview.length) };
  }
  function thumbnailSource(item, small = false) {
    const valid = (key, folder) => typeof item[key + 'Src'] === 'string'
      && item[key + 'Src'].startsWith('assets/gallery/' + folder + '/' + item.category + '/')
      && !item[key + 'Src'].split('/').includes('..')
      && /\.webp$/i.test(item[key + 'Src']);
    const key = small && valid('smallPreview', 'previews-small') ? 'smallPreview'
      : valid('preview', 'previews') ? 'preview' : '';
    return { src: key ? item[key + 'Src'] : item.src,
      width: key ? item[key + 'Width'] : item.width,
      height: key ? item[key + 'Height'] : item.height };
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
    function thumbnail(item, cropped = false, small = false) {
      const img = make('img', ''); img.loading = 'lazy'; img.decoding = 'async'; img.alt = item.alt;
      const thumb = thumbnailSource(item, small);
      img.src = thumb.src; img.fetchPriority = 'low';
      if (Number.isInteger(thumb.width) && thumb.width > 0 && Number.isInteger(thumb.height) && thumb.height > 0) {
        img.width = thumb.width; img.height = thumb.height;
      }
      const compact = thumbnailSource(item, true);
      if (!small && thumb.src !== item.src && compact.src !== thumb.src && compact.width > 0 && compact.width < thumb.width) {
        img.srcset = compact.src + ' ' + compact.width + 'w, ' + thumb.src + ' ' + thumb.width + 'w';
        img.sizes = cropped ? '(max-width: 599px) 100vw, (max-width: 900px) 60vw, 720px'
          : '(max-width: 599px) 100vw, (max-width: 900px) 50vw, 33vw';
      }
      // A missing derivative must not break the image or retry indefinitely.
      const fallbacks = [small ? thumbnailSource(item) : null, { src: item.src, width: item.width, height: item.height }]
        .filter((source, index, list) => source && source.src !== thumb.src && list.findIndex(other => other?.src === source.src) === index);
      img.addEventListener('error', () => {
        const next = fallbacks.shift();
        if (!next) return;
        img.removeAttribute('srcset'); img.removeAttribute('sizes');
        img.width = next.width; img.height = next.height; img.src = next.src;
      });
      if (cropped && /^\d{1,3}% \d{1,3}%$/.test(item.previewPosition || '')) img.style.objectPosition = item.previewPosition;
      return img;
    }
    function tile(item, index, cropped = false) {
      const button = make('button', 'gallery-item');
      button.type = 'button'; button.dataset.number = String(index + 1);
      button.setAttribute('aria-haspopup', 'dialog');
      button.append(thumbnail(item, cropped));
      button.addEventListener('click', () => openImage(item, button));
      return button;
    }
    function render() {
      const group = collection(items, filter);
      preview.classList.toggle('gallery-collage', group.preview.length === 5 && group.items.length > 5);
      for (const name of ['all', 'art', 'fursuit']) preview.classList.toggle('gallery-layout-' + name, name === filter);
      preview.replaceChildren(...group.preview.map((item, index) => tile(item, index, true)));
      empty.hidden = group.items.length > 0;
      if (group.items.length > 5) {
        const more = make('button', 'gallery-more'); more.type = 'button'; more.setAttribute('aria-haspopup', 'dialog');
        const collage = make('span', 'gallery-more-images'); collage.setAttribute('aria-hidden', 'true');
        for (const item of group.more) { const img = thumbnail(item, true, true); img.alt = ''; collage.append(img); }
        more.append(collage);
        const label = make('span', 'gallery-more-label'); more.append(label);
        more.addEventListener('click', () => {
          triggers.set(dialog, more);
          full.replaceChildren(...group.items.map((item, index) => tile(item, index))); labels(); dialog.showModal();
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
  return { normalize, collection, thumbnailSource, init, localize: () => localize() };
});
