(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiMusic = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  function pickTrack(tracks, previousId, random = Math.random) {
    const candidates = tracks.length > 1 ? tracks.filter(track => track.id !== previousId) : tracks;
    return candidates.length ? candidates[Math.floor(random() * candidates.length)] : null;
  }
  function buildReel(tracks, winner, random = Math.random) {
    const cards = Array.from({ length: 21 }, () => tracks[Math.floor(random() * tracks.length)]);
    cards[17] = winner;
    return { cards, winnerIndex: 17 };
  }
  const copy = {
    vi: { rolling: 'Đang chọn một bài nhạc', close: 'Đóng kết quả', loading: 'Đang tải danh sách nhạc…', empty: 'Playlist chưa có bài nhạc khả dụng.', error: 'Chưa tải được danh sách nhạc. Nhấn Escape để đóng và thử lại.', listen: 'Nghe bài này ↗', unknown: 'YouTube' },
    en: { rolling: 'Choosing a song', close: 'Close result', loading: 'Loading the song list…', empty: 'No available songs in this playlist yet.', error: 'The song list could not load. Press Escape to close and try again.', listen: 'Listen to this song ↗', unknown: 'YouTube' },
  };
  let localize = () => {};
  function init({ getLanguage, reducedMotion }) {
    const dialog = document.getElementById('music-dialog');
    const opener = document.querySelector('.music-gacha');
    const resultDialog = document.getElementById('music-result-dialog');
    const close = resultDialog.querySelector('.gacha-close');
    const viewport = dialog.querySelector('.reel-viewport');
    const reel = dialog.querySelector('.reel-track');
    const result = resultDialog.querySelector('.gacha-result');
    const status = dialog.querySelector('.gacha-status');
    let tracks = [], state = 'loading', loadPromise = null, generation = 0;
    let previousId = null, winner = null, animation = null, winnerIndex = null;
    const text = () => copy[getLanguage() === 'en' ? 'en' : 'vi'];
    const element = (tag, className, content) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (content) node.textContent = content;
      return node;
    };
    function thumbnail(track) {
      const image = element('img', 'gacha-thumbnail');
      image.width = 160; image.height = 160;
      image.loading = 'lazy'; image.decoding = 'async'; image.alt = '';
      if (/^https:\/\//.test(track.thumbnail)) image.src = track.thumbnail;
      image.addEventListener('error', () => image.removeAttribute('src'), { once: true });
      return image;
    }
    function card(track) {
      const node = element('article', 'reel-card');
      node.append(thumbnail(track), element('h3', '', track.title),
        element('p', '', track.artist || track.channel || text().unknown));
      return node;
    }
    function renderResult() {
      result.replaceChildren();
      if (!winner) return;
      const info = element('div', 'result-info');
      const title = element('h3', '', winner.title);
      title.id = 'music-result-title';
      const author = element('p', '', winner.artist || winner.channel || text().unknown);
      author.id = 'music-result-author';
      const listen = element('a', 'card-action', text().listen);
      listen.href = winner.youtubeUrl; listen.target = '_blank'; listen.rel = 'noopener noreferrer';
      info.append(title, author, listen);
      result.append(thumbnail(winner), info);
    }
    function updateCopy() {
      dialog.querySelector('h2').textContent = text().rolling;
      close.setAttribute('aria-label', text().close);
      status.hidden = state === 'rolling' || state === 'ready' || state === 'result';
      status.textContent = status.hidden ? '' : text()[state];
      viewport.hidden = state !== 'rolling';
      if (resultDialog.open) renderResult();
    }
    localize = () => { if (dialog.open || resultDialog.open) updateCopy(); };
    function center(index) {
      const node = reel.children[index];
      return viewport.clientWidth / 2 - node.offsetLeft - node.offsetWidth / 2;
    }
    function centerWinner() {
      if (winnerIndex !== null && reel.children[winnerIndex]) reel.style.transform = 'translate3d(' + center(winnerIndex) + 'px,0,0)';
    }
    async function load() {
      if (loadPromise) return loadPromise;
      state = 'loading'; updateCopy();
      loadPromise = (async () => {
        try {
          const response = await fetch('data/music.json');
          if (!response.ok) throw new Error('Dataset HTTP ' + response.status);
          const data = await response.json();
          if (!Array.isArray(data.tracks)) throw new Error('Invalid music dataset');
          const seen = new Set();
          tracks = data.tracks.filter(track => {
            if (!track || !/^[\w-]{11}$/.test(track.id) || !track.title
                || track.youtubeUrl !== 'https://www.youtube.com/watch?v=' + track.id || seen.has(track.id)) return false;
            seen.add(track.id); return true;
          });
          state = tracks.length ? 'ready' : 'empty';
        } catch { state = 'error'; tracks = []; }
        if (dialog.open) updateCopy();
      })();
      await loadPromise;
      loadPromise = null;
    }
    async function roll() {
      if (!tracks.length || state === 'rolling' || !dialog.open) return;
      const token = ++generation;
      winner = pickTrack(tracks, previousId);
      const sequence = buildReel(tracks, winner);
      winnerIndex = sequence.winnerIndex;
      state = 'rolling'; updateCopy();
      reel.replaceChildren(...sequence.cards.map(card));
      viewport.hidden = false;
      viewportWidth = viewport.clientWidth;
      const from = center(2), to = center(winnerIndex);
      reel.style.transform = 'translate3d(' + from + 'px,0,0)';
      if (!reducedMotion.matches && typeof reel.animate === 'function') {
        animation = reel.animate([
          { transform: 'translate3d(' + from + 'px,0,0)', offset: 0 },
          { transform: 'translate3d(' + to + 'px,0,0)', offset: 1 },
        ], { duration: 8500, easing: 'cubic-bezier(.12,.62,.24,1)', fill: 'forwards' });
        await animation.finished.catch(() => {});
      }
      if (token !== generation || !dialog.open) return;
      centerWinner();
      if (animation) animation.cancel();
      animation = null;
      previousId = winner.id;
      state = 'result';
      renderResult();
      dialog.close();
      resultDialog.showModal();
      close.focus({ preventScroll: true });
    }
    opener.addEventListener('click', async () => {
      if (dialog.open || resultDialog.open) return;
      dialog.showModal();
      if (tracks.length) { state = 'ready'; updateCopy(); roll(); }
      else { await load(); if (dialog.open && tracks.length) roll(); }
    });
    close.addEventListener('click', () => resultDialog.close());
    // Both dialogs retain an invisible escape route via the backdrop.
    for (const popup of [dialog, resultDialog]) {
      let outsidePointer = false;
      const isOutside = event => {
        const rect = popup.getBoundingClientRect();
        return event.target === popup && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
      };
      popup.addEventListener('pointerdown', event => { outsidePointer = isOutside(event); });
      popup.addEventListener('click', event => {
        if (outsidePointer && isOutside(event)) popup.close();
        outsidePointer = false;
      });
    }
    dialog.addEventListener('close', () => {
      reel.replaceChildren(); winnerIndex = null;
      if (resultDialog.open) return; // Automatic handoff must not restore background focus.
      generation++;
      if (animation) animation.cancel();
      animation = null;
      opener.focus({ preventScroll: true });
    });
    resultDialog.addEventListener('close', () => {
      result.replaceChildren();
      opener.focus({ preventScroll: true });
    });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && animation) animation.finish(); });
    let viewportWidth = 0;
    if ('ResizeObserver' in window) new ResizeObserver(() => {
      if (!dialog.open) return;
      const nextWidth = viewport.clientWidth;
      if (nextWidth === viewportWidth) return;
      const wasSized = viewportWidth > 0;
      viewportWidth = nextWidth;
      if (!wasSized) return;
      if (animation) animation.finish();
      else centerWinner();
    }).observe(viewport);
  }
  return { pickTrack, buildReel, init, localize: () => localize() };
});
