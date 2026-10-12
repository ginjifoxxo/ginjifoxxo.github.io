(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiMusic = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const weights = { common: .50, rare: .28, legendary: .16, epic: .06 };
  function pickRarity(random = Math.random, available = Object.keys(weights)) {
    const total = available.reduce((sum, key) => sum + weights[key], 0);
    let value = random() * total;
    for (const key of available) { value -= weights[key]; if (value < 0) return key; }
    return available.at(-1);
  }
  function pickTrack(tracks, previousId, random = Math.random) {
    const candidates = tracks.length > 1 ? tracks.filter(track => track.id !== previousId) : tracks;
    if (!candidates.length) return null;
    const rarity = pickRarity(random);
    let pool = candidates.filter(track => track.rarity === rarity);
    if (!pool.length) {
      const available = Object.keys(weights).filter(key => candidates.some(track => track.rarity === key));
      const fallback = pickRarity(random, available);
      pool = candidates.filter(track => track.rarity === fallback);
    }
    return pool[Math.floor(random() * pool.length)];
  }
  function buildReel(tracks, winner, random = Math.random) {
    const cards = Array.from({ length: 21 }, () => tracks[Math.floor(random() * tracks.length)]);
    cards[17] = winner;
    return { cards, winnerIndex: 17 };
  }
  function markDiscovered(discovered, id) {
    const fresh = !discovered.has(id);
    discovered.add(id);
    return fresh;
  }
  const copy = {
    vi: {
      title: 'Music Gacha', intro: 'Một vòng quay nhỏ, một bài nhạc mới. Bạn sẽ khám phá được gì hôm nay?',
      close: 'Đóng Music Gacha', loading: 'Đang tải danh sách nhạc…', empty: 'Playlist chưa có bài nhạc khả dụng.',
      error: 'Chưa tải được danh sách nhạc. Hãy đóng rồi mở lại để thử nhé.', rolling: 'Đang tìm một bài nhạc cho bạn…',
      ready: 'Sẵn sàng khám phá một bài nhạc?', again: 'Quay lại ↻', roll: 'Khám phá một bài nhạc', listen: 'Nghe bài này ↗',
      progress: 'Đã khám phá:', new: 'MỚI!', common: 'Thường', rare: 'Hiếm', legendary: 'Huyền thoại', epic: 'Sử thi',
      result: 'Bạn nhận được:', unknown: 'YouTube',
    },
    en: {
      title: 'Music Gacha', intro: 'A little roll, a new song. What will you discover today?',
      close: 'Close Music Gacha', loading: 'Loading the song list…', empty: 'No available songs in this playlist yet.',
      error: 'The song list could not load. Close and reopen to try again.', rolling: 'Finding a song for you…',
      ready: 'Ready to discover a song?', again: 'Roll again ↻', roll: 'Discover a song', listen: 'Listen to this song ↗',
      progress: 'Discovered:', new: 'NEW!', common: 'Common', rare: 'Rare', legendary: 'Legendary', epic: 'Epic',
      result: 'You got:', unknown: 'YouTube',
    },
  };
  let localize = () => {};
  function init({ getLanguage, reducedMotion, readPreference, savePreference }) {
    const dialog = document.getElementById('music-dialog');
    const opener = document.querySelector('.music-gacha');
    const close = dialog.querySelector('.gacha-close');
    const viewport = dialog.querySelector('.reel-viewport');
    const reel = dialog.querySelector('.reel-track');
    const result = dialog.querySelector('.gacha-result');
    const status = dialog.querySelector('.gacha-status');
    const rollButton = dialog.querySelector('.gacha-roll');
    const progress = dialog.querySelector('.gacha-progress');
    let tracks = [], state = 'loading', loadPromise = null, generation = 0;
    let previousId = null, winner = null, isNew = false, animation = null, winnerIndex = null;
    let discovered = new Set();
    try {
      const saved = JSON.parse(readPreference('ginji-music-discovered') || '[]');
      if (Array.isArray(saved)) discovered = new Set(saved.filter(id => typeof id === 'string'));
    } catch { /* A corrupt or blocked preference must not prevent rolling. */ }
    const text = () => copy[getLanguage() === 'en' ? 'en' : 'vi'];
    const element = (tag, className, content) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (content) node.textContent = content;
      return node;
    };
    function thumbnail(track) {
      const image = element('img', 'gacha-thumbnail');
      image.width = 336; image.height = 188;
      image.loading = 'lazy'; image.decoding = 'async'; image.alt = '';
      if (/^https:\/\//.test(track.thumbnail)) image.src = track.thumbnail;
      image.addEventListener('error', () => image.removeAttribute('src'), { once: true });
      return image;
    }
    function card(track) {
      const node = element('article', 'reel-card');
      node.dataset.rarity = track.rarity;
      const rarity = element('span', 'rarity-label', text()[track.rarity]);
      rarity.dataset.rarityLabel = track.rarity;
      node.append(thumbnail(track), rarity, element('h3', '', track.title),
        element('p', '', track.artist || track.channel || text().unknown));
      return node;
    }
    function renderResult() {
      result.replaceChildren();
      result.hidden = !winner || state !== 'result';
      if (result.hidden) return;
      result.dataset.rarity = winner.rarity;
      const info = element('div', 'result-info');
      info.append(element('span', 'rarity-label', text()[winner.rarity]));
      if (isNew) info.append(element('span', 'new-badge', text().new));
      info.append(element('h3', '', winner.title), element('p', '', winner.artist || winner.channel || text().unknown));
      const listen = element('a', 'card-action', text().listen);
      listen.href = winner.youtubeUrl; listen.target = '_blank'; listen.rel = 'noopener noreferrer';
      info.append(listen);
      result.append(thumbnail(winner), info);
    }
    function updateCopy(announce = false) {
      const labels = text();
      dialog.querySelector('h2').textContent = labels.title;
      dialog.querySelector('.gacha-intro').textContent = labels.intro;
      close.setAttribute('aria-label', labels.close);
      rollButton.textContent = state === 'result' ? labels.again : labels.roll;
      rollButton.disabled = !tracks.length || ['loading', 'rolling', 'empty', 'error'].includes(state);
      progress.textContent = labels.progress + ' ' + tracks.filter(track => discovered.has(track.id)).length + ' / ' + tracks.length;
      for (const label of reel.querySelectorAll('[data-rarity-label]')) label.textContent = labels[label.dataset.rarityLabel];
      // Moving cards are aria-hidden; only the final result is announced.
      if (state === 'result' && winner) {
        if (announce || status.textContent) status.textContent = labels.result + ' ' + labels[winner.rarity] + ' — ' + winner.title;
      } else status.textContent = labels[state] || labels.ready;
      renderResult();
    }
    localize = () => { if (dialog.open) updateCopy(); };
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
            if (!track || !/^[\w-]{11}$/.test(track.id) || !track.title || !Object.hasOwn(weights, track.rarity)
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
      state = 'rolling'; status.textContent = ''; updateCopy();
      reel.replaceChildren(...sequence.cards.map(card));
      viewport.hidden = false;
      const from = center(2), to = center(winnerIndex);
      reel.style.transform = 'translate3d(' + from + 'px,0,0)';
      if (!reducedMotion.matches && typeof reel.animate === 'function') {
        animation = reel.animate([
          { transform: 'translate3d(' + from + 'px,0,0)', offset: 0 },
          { transform: 'translate3d(' + (to - 5) + 'px,0,0)', offset: .96 },
          { transform: 'translate3d(' + to + 'px,0,0)', offset: 1 },
        ], { duration: 2600, easing: 'cubic-bezier(.12,.62,.14,1)', fill: 'forwards' });
        await animation.finished.catch(() => {});
      }
      if (token !== generation || !dialog.open) return;
      centerWinner();
      if (animation) animation.cancel();
      animation = null;
      previousId = winner.id;
      isNew = markDiscovered(discovered, winner.id);
      savePreference('ginji-music-discovered', JSON.stringify([...discovered]));
      state = 'result'; updateCopy(true);
    }
    opener.addEventListener('click', async () => {
      dialog.showModal();
      if (tracks.length) { state = 'ready'; updateCopy(); roll(); }
      else { await load(); if (dialog.open && tracks.length) roll(); }
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      generation++;
      if (animation) animation.cancel();
      animation = null;
      reel.replaceChildren(); result.replaceChildren(); winnerIndex = null;
      opener.focus({ preventScroll: true });
    });
    rollButton.addEventListener('click', roll);
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
  return { weights, pickRarity, pickTrack, buildReel, markDiscovered, init, localize: () => localize() };
});
