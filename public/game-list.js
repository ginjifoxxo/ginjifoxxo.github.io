(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiGames = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const games = [
    { id: 'ggst', name: 'Guilty Gear Strive', badge: 'GG', fields: ['player', 'main', 'floor'] },
    { id: 'riot', name: 'Riot Games', badge: 'RG', fields: ['riotId', 'favorite', 'status'], subgames: ['League of Legends', 'Teamfight Tactics', 'Valorant'] },
    { id: 'roblox', name: 'Roblox', badge: 'R', fields: ['username', 'experiences', 'status'] },
    { id: 'steam', name: 'Steam', badge: 'S', fields: ['profile', 'friend', 'favorite'] },
  ];
  const copy = {
    vi: { close: 'Đóng', previous: 'Trước', next: 'Tiếp', list: 'Danh sách game', choose: 'Chọn game', pending: 'Chưa thêm', player: 'ID người chơi', main: 'Nhân vật chính', floor: 'Hạng / Tầng', riotId: 'Riot ID', favorite: 'Yêu thích', status: 'Trạng thái', username: 'Tên người dùng', experiences: 'Trải nghiệm', profile: 'Hồ sơ', friend: 'Mã bạn bè' },
    en: { close: 'Close', previous: 'Previous', next: 'Next', list: 'Game list', choose: 'Choose game', pending: 'To be added', player: 'Player ID', main: 'Main character', floor: 'Rank / Floor', riotId: 'Riot ID', favorite: 'Favorites', status: 'Status', username: 'Username', experiences: 'Experiences', profile: 'Profile', friend: 'Friend code' },
  };
  const wrap = index => (index % games.length + games.length) % games.length;
  function slot(index, active) { const distance = wrap(index - active); return distance === 3 ? -1 : distance; }
  function swipe(start, end) {
    const x = end.x - start.x, y = end.y - start.y;
    return Math.abs(x) >= 45 && Math.abs(x) > Math.abs(y) * 1.5 ? (x < 0 ? 1 : -1) : 0;
  }
  let localize = () => {};
  function init({ getLanguage, reducedMotion }) {
    const dialog = document.getElementById('game-dialog'), opener = document.querySelector('.game-list');
    const nav = dialog.querySelector('.game-nav'), stage = dialog.querySelector('.game-stage');
    const close = dialog.querySelector('.game-close'), previous = dialog.querySelector('.game-previous'), next = dialog.querySelector('.game-next');
    const status = dialog.querySelector('.game-announcement');
    const icons = [], cards = [], fields = [];
    let active = 0, built = false, closing = false, closeTimer = null, touch = null, outside = false;
    const text = () => copy[getLanguage() === 'en' ? 'en' : 'vi'];
    const make = (tag, cls, content) => { const el = document.createElement(tag); el.className = cls; if (content) el.textContent = content; return el; };
    function build() {
      for (const [index, game] of games.entries()) {
        const icon = make('button', 'game-nav-item'); icon.type = 'button';
        const badge = make('span', 'game-icon', game.badge); badge.setAttribute('aria-hidden', 'true');
        icon.append(badge, make('span', 'sr-only', game.name));
        icon.addEventListener('click', () => select(index)); nav.append(icon); icons.push(icon);
        const card = make('article', 'game-card'); card.dataset.game = game.id;
        const header = make('header', 'game-card-header'), title = make('h3', 'game-card-title', game.name);
        title.id = 'game-title-' + game.id; card.setAttribute('aria-labelledby', title.id); header.append(title);
        const media = make('div', 'game-card-media');
        const identity = make('span', 'game-identity', game.badge); identity.setAttribute('aria-hidden', 'true');
        const subgames = make('div', 'game-subgames');
        for (let i = 0; i < 3; i++) {
          const chip = make('span', 'game-subgame', game.subgames?.[i] || '—');
          if (!game.subgames) chip.setAttribute('aria-hidden', 'true');
          subgames.append(chip);
        }
        media.append(identity, subgames);
        const meta = make('dl', 'game-card-meta');
        for (const field of game.fields) {
          const row = make('div', 'game-field'), label = make('dt', ''), value = make('dd', '', '—');
          fields.push({ field, label, value }); row.append(label, value); meta.append(row);
        }
        const selector = make('button', 'game-card-select'); selector.type = 'button'; selector.tabIndex = -1;
        selector.setAttribute('aria-label', game.name); selector.addEventListener('click', () => { select(index); icons[index].focus({ preventScroll: true }); });
        card.append(header, media, meta, selector); stage.append(card); cards.push(card);
      }
      built = true;
    }
    function update() {
      const t = text();
      close.setAttribute('aria-label', t.close); previous.setAttribute('aria-label', t.previous); next.setAttribute('aria-label', t.next);
      nav.setAttribute('aria-label', t.choose); stage.setAttribute('aria-label', t.list);
      for (const { field, label, value } of fields) { label.textContent = t[field]; value.setAttribute('aria-label', t.pending); }
      for (let index = 0; index < cards.length; index++) {
        const position = slot(index, active), selected = position === 0;
        cards[index].style.setProperty('--game-slot', position);
        cards[index].classList.toggle('is-active', selected); cards[index].classList.toggle('is-far', position === 2);
        cards[index].setAttribute('aria-hidden', String(!selected));
        cards[index].querySelector('.game-card-select').hidden = selected;
        icons[index].setAttribute('aria-pressed', String(selected)); icons[index].tabIndex = selected ? 0 : -1;
      }
      if (built) status.textContent = games[active].name + ' · ' + (active + 1) + ' / ' + games.length;
    }
    function select(index) { active = wrap(index); update(); }
    function finishClose() { if (closeTimer !== null) clearTimeout(closeTimer); closeTimer = null; if (dialog.open) dialog.close(); }
    function requestClose() {
      if (!dialog.open || closing) return;
      if (reducedMotion.matches) { finishClose(); return; }
      closing = true; dialog.classList.add('is-closing'); closeTimer = setTimeout(finishClose, 220);
    }
    opener.addEventListener('click', () => {
      if (dialog.open) return;
      if (!built) build(); update(); dialog.showModal(); icons[active].focus({ preventScroll: true });
    });
    close.addEventListener('click', requestClose);
    previous.addEventListener('click', () => select(active - 1)); next.addEventListener('click', () => select(active + 1));
    dialog.addEventListener('keydown', event => {
      if (!dialog.open || closing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const keys = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: games.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault(); select(keys[event.key]); icons[active].focus({ preventScroll: true });
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); requestClose(); });
    const isOutside = event => {
      const r = dialog.getBoundingClientRect();
      return event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
    };
    dialog.addEventListener('pointerdown', event => { outside = isOutside(event); });
    dialog.addEventListener('click', event => { if (outside && isOutside(event)) requestClose(); outside = false; });
    dialog.addEventListener('animationend', event => { if (event.target === dialog && closing) finishClose(); });
    dialog.addEventListener('close', () => {
      if (closeTimer !== null) clearTimeout(closeTimer); closeTimer = null; closing = false; outside = false; touch = null;
      dialog.classList.remove('is-closing'); opener.focus({ preventScroll: true });
    });
    stage.addEventListener('pointerdown', event => { if (event.pointerType === 'touch' && event.isPrimary !== false) touch = { id: event.pointerId, x: event.clientX, y: event.clientY }; });
    stage.addEventListener('pointerup', event => {
      if (!touch || touch.id !== event.pointerId) return;
      const direction = swipe(touch, { x: event.clientX, y: event.clientY }); touch = null;
      if (direction && dialog.open && !closing) select(active + direction);
    });
    stage.addEventListener('pointercancel', () => { touch = null; });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && closing) finishClose(); });
    localize = update; update();
  }
  return { games, wrap, slot, swipe, init, localize: () => localize() };
});
