(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GinjiGames = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  'use strict';
  const games = [
    { id: 'ggst', name: 'Guilty Gear Strive', logo: 'assets/games/logos/ggst.png', background: 'assets/games/backgrounds/ggst-anji.webp', position: '48% 44%', fields: ['player', 'main', 'floor'] },
    { id: 'riot', name: 'Riot Games', logo: 'assets/games/logos/riot.png', variants: [
      { id: 'lol', name: 'League of Legends', vi: 'LMHT', en: 'League', background: 'assets/games/backgrounds/riot-lol-kennen.webp', position: '60% 42%' },
      { id: 'tft', name: 'Teamfight Tactics', vi: 'ĐTCL', en: 'TFT', background: 'assets/games/backgrounds/riot-tft-pegu.webp', position: '52% 50%' },
      { id: 'valorant', name: 'Valorant', vi: 'Valorant', en: 'Valorant', background: 'assets/games/backgrounds/riot-valorant-omen.webp', position: '50% 38%' },
    ], fields: ['riotId', 'favorite', 'status'] },
    { id: 'roblox', name: 'Roblox', logo: 'assets/games/logos/roblox.png', background: 'assets/games/backgrounds/roblox-furry.webp', position: '60% 42%', fields: ['username', 'experiences', 'status'] },
    { id: 'steam', name: 'Steam', logo: 'assets/games/logos/steam.png', fields: ['profile', 'friend', 'favorite'] },
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
    const icons = [], cards = [], fields = [], riotButtons = [], riotImages = [];
    let riotActive = 0, riotTimer = null, riotReady = false;
    let active = 0, built = false, closing = false, closeTimer = null, touch = null, outside = false;
    const text = () => copy[getLanguage() === 'en' ? 'en' : 'vi'];
    const make = (tag, cls, content) => { const el = document.createElement(tag); el.className = cls; if (content) el.textContent = content; return el; };
    function stopRiot() { if (riotTimer !== null) clearTimeout(riotTimer); riotTimer = null; }
    function scheduleRiot() {
      stopRiot();
      if (riotReady && dialog.open && !closing && active === 1 && !document.hidden && !reducedMotion.matches) {
        riotTimer = setTimeout(() => { riotTimer = null; chooseRiot((riotActive + 1) % 3); }, 3500);
      }
    }
    function updateRiot() {
      const language = getLanguage() === 'en' ? 'en' : 'vi';
      riotButtons.forEach((button, index) => {
        button.textContent = games[1].variants[index][language];
        button.setAttribute('aria-pressed', String(index === riotActive));
        button.tabIndex = active === 1 ? 0 : -1;
      });
      riotImages.forEach((image, index) => image.classList.toggle('is-current', index === riotActive));
    }
    function chooseRiot(index) { riotActive = index; updateRiot(); scheduleRiot(); }
    function backgroundImage(variant) {
      const image = make('img', 'game-background-image'); image.alt = ''; image.decoding = 'async';
      image.src = variant.background; image.style.objectPosition = variant.position;
      return image;
    }
    function build() {
      for (const [index, game] of games.entries()) {
        const icon = make('button', 'game-nav-item'); icon.type = 'button';
        const badge = make('img', 'game-icon'); badge.src = game.logo; badge.alt = ''; badge.setAttribute('aria-hidden', 'true');
        icon.append(badge, make('span', 'sr-only', game.name));
        icon.addEventListener('click', () => select(index)); nav.append(icon); icons.push(icon);
        const card = make('article', 'game-card'); card.dataset.game = game.id;
        const header = make('header', 'game-card-header'), title = make('h3', 'game-card-title', game.name);
        title.id = 'game-title-' + game.id; card.setAttribute('aria-labelledby', title.id); header.append(title);
        const background = make('div', 'game-card-background'); background.setAttribute('aria-hidden', 'true');
        if (game.variants) {
          for (const variant of game.variants) { const image = backgroundImage(variant); background.append(image); riotImages.push(image); }
        } else if (game.background) background.append(backgroundImage(game));
        const overlay = make('div', 'game-card-overlay'); overlay.setAttribute('aria-hidden', 'true');
        const content = make('div', 'game-card-content'), media = make('div', 'game-card-context');
        if (game.id === 'steam') {
          const identity = make('img', 'game-steam-identity'); identity.src = game.logo; identity.alt = '';
          media.append(identity, make('span', 'game-steam-placeholder', '—'));
        }
        if (game.variants) {
          const tabs = make('div', 'game-riot-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Riot Games');
          game.variants.forEach((variant, index) => {
            const button = make('button', 'game-riot-tab'); button.type = 'button'; button.setAttribute('aria-label', variant.name);
            button.addEventListener('click', () => chooseRiot(index)); tabs.append(button); riotButtons.push(button);
          });
          media.append(tabs);
        }
        const meta = make('dl', 'game-card-meta');
        for (const field of game.fields) {
          const row = make('div', 'game-field'), label = make('dt', ''), value = make('dd', '', '—');
          fields.push({ field, label, value }); row.append(label, value); meta.append(row);
        }
        const selector = make('button', 'game-card-select'); selector.type = 'button'; selector.tabIndex = -1;
        selector.setAttribute('aria-label', game.name); selector.addEventListener('click', () => { select(index); icons[index].focus({ preventScroll: true }); });
        content.append(header, media, meta); card.append(background, overlay, content, selector); stage.append(card); cards.push(card);
      }
      built = true;
      updateRiot();
      // Decode only the three small Riot backgrounds before allowing crossfades.
      Promise.all(riotImages.map(image => image.decode().catch(() => {}))).then(() => {
        riotReady = true; scheduleRiot();
      });
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
      updateRiot();
      if (built) status.textContent = games[active].name + ' · ' + (active + 1) + ' / ' + games.length;
    }
    function select(index) { active = wrap(index); update(); scheduleRiot(); }
    function finishClose() { if (closeTimer !== null) clearTimeout(closeTimer); closeTimer = null; if (dialog.open) dialog.close(); }
    function requestClose() {
      if (!dialog.open || closing) return;
      stopRiot();
      if (reducedMotion.matches) { finishClose(); return; }
      closing = true; dialog.classList.add('is-closing'); closeTimer = setTimeout(finishClose, 220);
    }
    opener.addEventListener('click', () => {
      if (dialog.open) return;
      if (!built) build(); update(); dialog.showModal(); scheduleRiot(); icons[active].focus({ preventScroll: true });
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
      stopRiot();
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
    document.addEventListener('visibilitychange', scheduleRiot);
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches && closing) finishClose(); scheduleRiot(); });
    localize = update; update();
  }
  return { games, wrap, slot, swipe, init, localize: () => localize() };
});
