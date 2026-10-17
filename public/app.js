(() => {
  'use strict';
  const copy = {
    vi: {
      description: 'Hewwooo, welcome to my profile uwu',
      skip: 'Đến nội dung chính', navigation: 'Điều hướng chính',
      heroLead: 'Hewwooo, mình là Ginji. Một “con céo” chill chill thích đi ngẩu. Chào mừng bạn đến với profile của mình nheee~',
      navAbout: 'Về mình', navFursona: 'Fursona', navGallery: 'Thư viện',
      introAlt: 'Ginji, chiếc cáo trắng xanh với nụ cười tinh nghịch.', socialNav: 'Mạng xã hội', newTab: 'mở trong tab mới', fursonaLabel: 'FURSONA', galleryLabel: 'THƯ VIỆN',
      aboutLabel: 'VỀ MÌNH', aboutHeadline1: "Mình hơi hướng nội một chút.", aboutHeadline2: "Nhưng không khó để làm quen đâu :3",
      aboutP1: "Bạn có thể gọi mình là Ginji. Hiện mình đã ăn được 22 nồi bánh chưng, đang học tập cũng như sinh sống tại TP. Hồ Chí Minh.",
      aboutP2: "Mình khá dễ gần và hoà đồng, nhưng cũng hơi hướng nội. Có lúc mình nói rất nhiều, có lúc lại khép kín và trở nên trầm tính. Nhưng đừng vì những điều đó mà ngại ngùng trò chuyện với mình nhé. Nếu muốn bắt chuyện thì cứ thử chủ động trò chuyện cùng mình uwu.",
      interestsTitle: "Những điều mình thích làm",
      gameTitle: "Chơi \"gem\"", gameText: "Đây là điều hiển nhiên mà? Ai mà chẳng thích chơi game chứ? Liệu bạn có chơi những game mình hay chơi không?",
      musicTitle: 'Nghe nhạc', musicText: "Mình thường nghe nhiều thể loại nhạc, liệu có bài hát nào trong số này khiến bạn thích nghe giống mình không?",
      fursonaHeadline: 'Ginji - Kitsune "9 đui"',
      fursonaText: "Đúng vậy, bạn không có nghe nhầm đâu. Đó là một cậu cáo trắng chín đuôi, nhưng trong hình dạng thường ngày cậu ấy sẽ xuất hiện với hai chiếc đuôi, cũng chính là mascot của mình.",
      galleryTitle: "Một chút thế giới nhỏ của mình :3", refCaption: 'Refsheet nhân vật',
      refOpen: 'Phóng to refsheet hiện tại', refClose: 'Đóng ảnh', refLightbox: 'Refsheet phóng to',
      refAltA: 'Refsheet Ginji: kitsune trắng và xanh với hai đuôi, góc nhìn trước, sau và các chi tiết thiết kế.',
      refViewer: 'Refsheet Ginji', refSelector: 'Chọn refsheet', refAltB: 'Refsheet Ginji B: cáo trắng xanh với nhiều đuôi, bảng màu và các biểu cảm đeo kính.', refUnavailable: 'Ảnh này chưa khả dụng. Vẫn hiển thị refsheet hiện tại.', refChanged: 'Đang hiển thị', galleryEmpty: 'Một góc dành cho những artwork sắp tới của Ginji.',
      backToTop: 'Về đầu trang',
      languageLabel: 'Switch to English', languageHint: 'Switch to English', languageAnnouncement: 'Đã chuyển sang tiếng Việt.',
      gameList: "Danh sách game mình thường chơi",
      musicTry: "Nghe thử một bài nhạc không?",
      sleepTitle: 'Đi "ngẩu"',
      sleepText: "Bạn nghĩ gì thế? Đương nhiên phải đi ngủ rồi, hơi bị mê nha trời",
    },
    en: {
      description: 'Hewwooo, welcome to my profile uwu',
      skip: 'Skip to main content', navigation: 'Main navigation',
      heroLead: "Hewwooo, I'm Ginji. I like games, music, and sleep. Welcome to my little profile :3",
      navAbout: 'About Me', navFursona: 'Fursona', navGallery: 'Gallery',
      introAlt: 'Ginji, a white and blue fox with a playful smile.', socialNav: 'Social links', newTab: 'opens in a new tab', fursonaLabel: 'FURSONA', galleryLabel: 'GALLERY',
      aboutLabel: 'ABOUT ME', aboutHeadline1: "I'm a little introverted.", aboutHeadline2: "But I'm easy to talk to :3",
      aboutP1: "You can call me Ginji. I'm 22 and currently studying and living in Ho Chi Minh City.",
      aboutP2: "I'm friendly and easy to get along with, but I can be quiet sometimes. Feel free to say hi and start a conversation with me uwu.",
      interestsTitle: 'Things I Like',
      gameTitle: 'Gaming', gameText: 'I enjoy playing games in my free time. Maybe we play some of the same games.',
      musicTitle: 'Music', musicText: "I listen to many kinds of music. Maybe you'll find a song you like too.",
      fursonaHeadline: 'Ginji — Nine-Tailed Kitsune',
      fursonaText: "Ginji is a white nine-tailed fox. Most of the time, he appears with two tails. He's also my mascot.",
      galleryTitle: 'A little part of my world :3', refCaption: 'Character Reference',
      refOpen: 'View current refsheet', refClose: 'Close image', refLightbox: 'Full refsheet',
      refAltA: 'Ginji reference sheet: a white and blue kitsune with two tails, shown from the front and back with design details.',
      refViewer: 'Ginji refsheet', refSelector: 'Choose refsheet', refAltB: 'Ginji reference sheet B: a white and blue fox with multiple tails, a color palette, and expressions with glasses.', refUnavailable: "This image isn't available. Showing the current refsheet instead.", refChanged: 'Showing', galleryEmpty: 'A space for upcoming artwork of Ginji.',
      backToTop: 'Back to top',
      languageLabel: 'Switch to Vietnamese', languageHint: 'Switch to Vietnamese', languageAnnouncement: 'Switched to English.',
      gameList: 'Games I Play',
      musicTry: 'Try a Random Song',
      sleepTitle: 'Sleep',
      sleepText: "I really like sleeping. That's all :3",
    }
  };
  const languageToggle = document.querySelector('.language-toggle');
  const backToTop = document.querySelector('.back-to-top');
  const header = document.querySelector('.site-header');
  const overview = document.getElementById('overview');
  const starLayer = document.querySelector('.starlight');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sectionControls = Array.from(document.querySelectorAll('.navlinks button'));
  const sections = sectionControls.map(control => document.getElementById(control.dataset.scrollTarget));
  const navlinks = document.querySelector('.navlinks');
  const navIndicator = document.querySelector('.nav-indicator');
  let activeControl = null, navigationTarget = null, indicatorFrame = null;
  function updateIndicator() {
    indicatorFrame = null;
    navIndicator.style.width = activeControl ? activeControl.offsetWidth + 'px' : '0px';
    navIndicator.style.transform = 'translateX(' + (activeControl ? activeControl.offsetLeft : 0) + 'px)';
    navIndicator.classList.toggle('is-visible', !!activeControl);
  }
  function scheduleIndicator() {
    if (indicatorFrame === null) indicatorFrame = requestAnimationFrame(updateIndicator);
  }
  function setActiveSection(id) {
    const next = sectionControls.find(control => control.dataset.scrollTarget === id) || null;
    if (next === activeControl) return;
    activeControl = next;
    for (const link of sectionControls) {
      if (link === activeControl) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scheduleIndicator();
  }
  if ('ResizeObserver' in window) new ResizeObserver(scheduleIndicator).observe(navlinks);
  if (document.fonts) document.fonts.ready.then(() => { reserveLanguageSpace(true); scheduleIndicator(); });
  let currentLanguage = 'vi', scrollPending = false, scrollRaf = null;
  const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Storage may be blocked. */ } };
  function applyLanguage(lang, announce = false) {
    currentLanguage = lang === 'en' ? 'en' : 'vi';
    const text = copy[currentLanguage];
    document.documentElement.lang = currentLanguage;
    document.querySelector('meta[name="description"]').content = text.description;
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = text[el.dataset.i18n];
    for (const el of document.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', text[el.dataset.i18nAria]);
    for (const el of document.querySelectorAll('[data-i18n-alt]')) el.setAttribute('alt', text[el.dataset.i18nAlt]);
    for (const el of document.querySelectorAll('[data-social]')) el.setAttribute('aria-label', el.dataset.social + ' — ' + text.newTab);
    languageToggle.setAttribute('aria-checked', String(currentLanguage === 'en'));
    languageToggle.setAttribute('aria-label', text.languageLabel);
    languageToggle.title = text.languageHint;
    backToTop.title = text.backToTop;
    if (announce) document.getElementById('language-announcement').textContent = text.languageAnnouncement;
    updateRefLabels();
    window.GinjiMusic.localize();
    window.GinjiBackgroundMusic.localize();
    window.GinjiGallery.localize();
    window.GinjiGames.localize();
    scheduleIndicator();
    scheduleScrollUpdate();
  }
  // Reserve the taller translation at the current width, without animating layout.
  // Measure hidden copies; images, canvas and live text are never moved or faded.
  let languageLayoutWidth = 0, languageLayoutFrame = null;
  function reserveLanguageSpace(force = false) {
    const width = document.querySelector('main').clientWidth;
    if (!force && width === languageLayoutWidth) return;
    languageLayoutWidth = width;
    const blocks = document.querySelectorAll('main h2, main h3, main h4, main p:not(.sr-only), .card-action, .refsheet-toolbar');
    for (const block of blocks) {
      if (!block.matches('[data-i18n]') && !block.querySelector('[data-i18n]')) continue;
      block.style.minHeight = '';
      const clone = block.cloneNode(true);
      clone.removeAttribute('id');
      for (const el of clone.querySelectorAll('[id]')) el.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      clone.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;transform:none;transition:none;margin:0;min-height:0;height:auto;width:' + block.getBoundingClientRect().width + 'px';
      block.parentElement.appendChild(clone);
      let height = 0;
      const texts = clone.matches('[data-i18n]') ? [clone] : Array.from(clone.querySelectorAll('[data-i18n]'));
      for (const lang of ['vi', 'en']) {
        for (const el of texts) el.textContent = copy[lang][el.dataset.i18n];
        height = Math.max(height, clone.getBoundingClientRect().height);
      }
      clone.remove();
      block.style.minHeight = Math.ceil(height) + 'px';
    }
  }
  function scheduleLanguageLayout() {
    if (languageLayoutFrame !== null) return;
    languageLayoutFrame = requestAnimationFrame(() => {
      languageLayoutFrame = null;
      reserveLanguageSpace();
      scheduleIndicator();
    });
  }
  let languageRequest = 0, desiredLanguage = currentLanguage, textAnimations = [];
  function cancelTextAnimations() {
    for (const animation of textAnimations) animation.cancel();
    textAnimations = [];
  }
  async function changeLanguage(lang) {
    const request = ++languageRequest;
    desiredLanguage = lang;
    cancelTextAnimations();
    cancelScroll();
    const texts = Array.from(document.querySelectorAll('[data-i18n]')).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && getComputedStyle(el).visibility !== 'hidden';
    });
    const canAnimate = !reducedMotion.matches && typeof Element.prototype.animate === 'function';
    const fade = (from, to) => {
      textAnimations = texts.map(el => el.animate([{ opacity: from }, { opacity: to }], {
        duration: 170, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards'
      }));
      return Promise.all(textAnimations.map(animation => animation.finished.catch(() => {})));
    };
    if (canAnimate) await fade(1, .42);
    if (request !== languageRequest) return;
    const y = window.scrollY;
    applyLanguage(lang, true);
    savePreference('ginji-language', currentLanguage);
    window.scrollTo({ top: y, behavior: 'instant' });
    cancelTextAnimations();
    if (canAnimate && !reducedMotion.matches) await fade(.42, 1);
    if (request === languageRequest) cancelTextAnimations();
  }
  languageToggle.addEventListener('click', () => changeLanguage(desiredLanguage === 'vi' ? 'en' : 'vi'));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) changeLanguage(desiredLanguage);
  });
  let navigationVisible = false;
  function updateNavigation() {
    const bottom = overview.getBoundingClientRect().bottom;
    const threshold = headerClearance() + 80;
    // A 32px band avoids toggling repeatedly at the Hero/About boundary.
    if (!navigationVisible && bottom <= threshold - 16) navigationVisible = true;
    else if (navigationVisible && bottom >= threshold + 16) navigationVisible = false;
    header.classList.toggle('is-visible', navigationVisible);
  }
  function headerClearance() { return header.offsetTop + header.offsetHeight + 24; }
  function updateScroll() {
    scrollPending = false;
    const y = window.scrollY;
    const progress = Math.min(1, Math.max(0, y / Math.max(300, overview.offsetHeight)));
    starLayer.style.setProperty('--star-strength', (1 - .88 * progress).toFixed(3));
    updateNavigation();
    header.classList.toggle('is-scrolled', y > 24);
    const visible = y > window.innerHeight * 2;
    backToTop.classList.toggle('is-visible', visible);
    backToTop.setAttribute('aria-hidden', String(!visible));
    backToTop.tabIndex = visible ? 0 : -1;
    let active = '';
    for (const section of sections) if (section.getBoundingClientRect().top <= headerClearance() + 80) active = section.id;
    setActiveSection(navigationTarget || active);
  }
  function scheduleScrollUpdate() {
    if (scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', () => { scheduleScrollUpdate(); scheduleIndicator(); scheduleLanguageLayout(); }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleScrollUpdate).observe(document.querySelector('main'));
  let wheelTarget = null, wheelLastFrame = null;
  function cancelScroll() {
    if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
    scrollRaf = null;
    wheelTarget = null; wheelLastFrame = null;
    navigationTarget = null;
    scheduleScrollUpdate();
  }
  function destination(target) {
    const top = target === overview ? 0 : target.offsetTop - headerClearance();
    return Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
  }
  function scrollToSection(target) {
    cancelScroll();
    navigationTarget = target.id;
    setActiveSection(navigationTarget);
    const from = window.scrollY;
    const duration = Math.min(1400, Math.max(550, 420 + Math.sqrt(Math.abs(destination(target) - from)) * 17));
    const started = performance.now();
    function finish() {
      window.scrollTo({ top: destination(target), behavior: 'instant' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      scrollRaf = null;
      navigationTarget = null;
      scheduleScrollUpdate();
    }
    if (reducedMotion.matches) { finish(); return; }
    function step(now) {
      if (document.querySelector('dialog[open]')) { cancelScroll(); return; }
      const t = Math.min(1, (now - started) / duration);
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      window.scrollTo({ top: from + (destination(target) - from) * eased, behavior: 'instant' });
      if (t < 1) scrollRaf = requestAnimationFrame(step);
      else finish();
    }
    scrollRaf = requestAnimationFrame(step);
  }
  document.addEventListener('click', event => {
    const control = event.target.closest('button[data-scroll-target]');
    if (!control || event.defaultPrevented) return;
    const target = document.getElementById(control.dataset.scrollTarget);
    if (target) scrollToSection(target);
  });
  const wheelPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  function wheelStep(now) {
    scrollRaf = null;
    if (wheelTarget === null || reducedMotion.matches || document.querySelector('dialog[open]')) { cancelScroll(); return; }
    const delta = wheelLastFrame === null ? 16 : Math.min(50, now - wheelLastFrame);
    wheelLastFrame = now;
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    wheelTarget = Math.max(0, Math.min(max, wheelTarget));
    const remaining = wheelTarget - scrollY;
    if (Math.abs(remaining) < .7) { window.scrollTo({ top: wheelTarget, behavior: 'instant' }); cancelScroll(); return; }
    window.scrollTo({ top: scrollY + remaining * (1 - Math.exp(-delta / 80)), behavior: 'instant' });
    scrollRaf = requestAnimationFrame(wheelStep);
  }
  function onWheel(event) {
    const discrete = event.deltaMode === 1 || (event.deltaMode === 0 && Number.isInteger(event.deltaY) && Math.abs(event.deltaY) >= 80 && event.deltaY % 20 === 0);
    if (event.ctrlKey || event.shiftKey || event.deltaX || !discrete || !wheelPointer.matches || reducedMotion.matches
        || document.querySelector('dialog[open]') || event.target.closest('input, textarea, select, [contenteditable="true"]')) { cancelScroll(); return; }
    // Respect nested scroll containers instead of capturing their wheel input.
    for (let node = event.target; node && node !== document.body; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight && /auto|scroll/.test(getComputedStyle(node).overflowY)) { cancelScroll(); return; }
    }
    event.preventDefault();
    if (wheelTarget === null || navigationTarget) { cancelScroll(); wheelTarget = scrollY; }
    const amount = event.deltaY * (event.deltaMode === 1 ? 32 : 1);
    if (Math.sign(amount) !== Math.sign(wheelTarget - scrollY)) wheelTarget = scrollY;
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const next = Math.max(0, Math.min(max, wheelTarget + amount));
    // A small immediate response, then a short time-based exponential tail (~400ms).
    window.scrollTo({ top: scrollY + (next - wheelTarget) * .18, behavior: 'instant' });
    wheelTarget = next;
    if (scrollRaf === null) scrollRaf = requestAnimationFrame(wheelStep);
  }
  function syncWheelListener() {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('wheel', cancelScroll);
    cancelScroll();
    if (wheelPointer.matches && !reducedMotion.matches) window.addEventListener('wheel', onWheel, { passive: false });
    else window.addEventListener('wheel', cancelScroll, { passive: true });
  }
  syncWheelListener();
  wheelPointer.addEventListener('change', syncWheelListener);
  reducedMotion.addEventListener('change', syncWheelListener);
  window.addEventListener('pointerdown', cancelScroll, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelScroll(); });
  window.addEventListener('touchstart', cancelScroll, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) cancelScroll();
  });
  reducedMotion.addEventListener('change', cancelScroll);
  window.addEventListener('popstate', cancelScroll);

  const refViewer = document.querySelector('.refsheet-viewer');
  const refImage = document.getElementById('refsheet-image');
  const refSelector = document.querySelector('.ref-selector');
  const refIndicator = document.querySelector('.ref-indicator');
  const refButtons = Array.from(document.querySelectorAll('[data-ref]'));
  const refs = { a: { src: 'assets/ginji-refsheet.png', alt: 'refAltA' }, b: { src: 'assets/ginji-refsheet-b.png', alt: 'refAltB' } };
  let currentRef = 'a', refRequest = 0, refStatus = '';
  const refTrigger = document.querySelector('.refsheet-image');
  const refLightbox = document.getElementById('ref-lightbox');
  const fullRefImage = refLightbox.querySelector('img');
  refTrigger.addEventListener('click', () => {
    if (refLightbox.open) return;
    fullRefImage.src = refs[currentRef].src;
    fullRefImage.alt = copy[currentLanguage][refs[currentRef].alt];
    refLightbox.showModal();
  });
  refLightbox.querySelector('button').addEventListener('click', () => refLightbox.close());
  let refBackdropPointer = false;
  refLightbox.addEventListener('pointerdown', event => { refBackdropPointer = event.target === refLightbox; });
  refLightbox.addEventListener('click', event => {
    if (refBackdropPointer && event.target === refLightbox) refLightbox.close();
    refBackdropPointer = false;
  });
  refLightbox.addEventListener('close', () => {
    refBackdropPointer = false;
    refTrigger.focus({ preventScroll: true });
  });
  function updateRefLabels() {
    refImage.alt = copy[currentLanguage][refs[currentRef].alt];
    if (refStatus) updateRefAnnouncement();
    if (refLightbox.open) {
      fullRefImage.src = refs[currentRef].src;
      fullRefImage.alt = refImage.alt;
    }
  }
  function updateRefAnnouncement() {
    document.getElementById('ref-announcement').textContent = copy[currentLanguage][refStatus]
      + (refStatus === 'refChanged' ? ' Ref. ' + currentRef.toUpperCase() : '');
  }
  function updateRefIndicator() {
    const button = refButtons.find(el => el.dataset.ref === currentRef);
    refIndicator.style.width = button.offsetWidth + 'px';
    refIndicator.style.transform = 'translateX(' + (button.offsetLeft - 4) + 'px)';
  }
  function waitForRefFade() {
    if (reducedMotion.matches) return Promise.resolve();
    return new Promise(resolve => {
      const timer = setTimeout(finish, 160);
      function finish() {
        clearTimeout(timer);
        reducedMotion.removeEventListener('change', finish);
        resolve();
      }
      reducedMotion.addEventListener('change', finish, { once: true });
    });
  }
  async function selectRef(key) {
    const request = ++refRequest;
    if (key === currentRef) { refViewer.classList.remove('is-switching'); return; }
    try {
      // Decode before fading; a failed image never blanks or replaces the viewer.
      const next = new Image();
      next.src = refs[key].src;
      await next.decode();
      if (request !== refRequest) return;
      refViewer.classList.add('is-switching');
      await waitForRefFade();
      if (request !== refRequest) return;
      currentRef = key;
      refImage.src = next.src;
      updateRefLabels();
      for (const button of refButtons) button.setAttribute('aria-pressed', String(button.dataset.ref === key));
      updateRefIndicator();
      refStatus = 'refChanged'; updateRefAnnouncement();
    } catch {
      if (request === refRequest) {
        refButtons.find(button => button.dataset.ref === key).disabled = true;
        refStatus = 'refUnavailable'; updateRefAnnouncement();
      }
    } finally { if (request === refRequest) refViewer.classList.remove('is-switching'); }
  }
  for (const button of refButtons) button.addEventListener('click', () => selectRef(button.dataset.ref));
  refSelector.hidden = false;
  requestAnimationFrame(updateRefIndicator);
  if ('ResizeObserver' in window) new ResizeObserver(updateRefIndicator).observe(refSelector);

  const portrait = document.querySelector('.portrait');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let portraitFrame = null, tiltX = 0, tiltY = 0;
  function resetPortrait() {
    if (portraitFrame !== null) cancelAnimationFrame(portraitFrame);
    portraitFrame = null;
    portrait.style.removeProperty('--tilt-x'); portrait.style.removeProperty('--tilt-y');
  }
  portrait.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType !== 'mouse') return;
    const rect = portrait.getBoundingClientRect();
    tiltX = ( .5 - (event.clientY - rect.top) / rect.height) * 5;
    tiltY = ((event.clientX - rect.left) / rect.width - .5) * 5;
    if (portraitFrame !== null) return;
    portraitFrame = requestAnimationFrame(() => {
      portraitFrame = null;
      portrait.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
      portrait.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
    });
  });
  portrait.addEventListener('pointerleave', resetPortrait);
  reducedMotion.addEventListener('change', resetPortrait);
  finePointer.addEventListener('change', resetPortrait);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetPortrait(); });
  window.GinjiGames.init({ getLanguage: () => currentLanguage, reducedMotion });
  window.GinjiMusic.init({ getLanguage: () => currentLanguage, reducedMotion });

  window.GinjiBackgroundMusic.init({ getLanguage: () => currentLanguage });
  window.GinjiGallery.init({ getLanguage: () => currentLanguage });

  const storedLanguage = readPreference('ginji-language');
  applyLanguage(storedLanguage === 'vi' || storedLanguage === 'en' ? storedLanguage : (navigator.language || 'vi').toLowerCase().startsWith('vi') ? 'vi' : 'en');
  desiredLanguage = currentLanguage;
  reserveLanguageSpace(true);
  languageToggle.hidden = false;
  const canvas = document.getElementById('star-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { scheduleScrollUpdate(); return; }
  let width = 0, height = 0, stars = [], raf = null, lastFrame = null, elapsed = 0;
  // Reuse coordinates instead of allocating objects for every star/trail segment.
  const position = { x: 0, y: 0 }, trailPosition = { x: 0, y: 0 };
  const random = (min, max) => min + Math.random() * (max - min);
  function makeStar() {
    const startX = random(-.1, 1.1), drift = random(-.25, .25);
    return { x0: startX, x1: startX + drift - .1, x2: startX - drift + .16, x3: startX + drift,
      phase: Math.random(), duration: random(16000, 34000), size: random(.8, 2.5),
      alpha: random(.22, .58), colour: Math.random() > .4 ? '#628cad' : '#8176b3', trail: Math.random() < .22 };
  }
  function resizeCanvas() {
    width = window.innerWidth; height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = width < 760 ? 58 : 108;
    if (stars.length !== count) stars = Array.from({ length: count }, makeStar);
    if (reducedMotion.matches) drawFrame();
  }
  // Cubic Bézier trajectories give each star a gentle sideways arc as it falls.
  function point(star, t, out) {
    const u = 1 - t;
    out.x = (u*u*u*star.x0 + 3*u*u*t*star.x1 + 3*u*t*t*star.x2 + t*t*t*star.x3) * width;
    out.y = (u*u*u*(-.12) + 3*u*u*t*.12 + 3*u*t*t*.66 + t*t*t*1.12) * height;
  }
  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      const t = (elapsed / star.duration + star.phase) % 1;
      point(star, t, position);
      const p = position, edge = Math.min(1, t * 9, (1 - t) * 9);
      const alpha = star.alpha * edge * (.72 + .28 * Math.sin(elapsed / 2100 + star.phase * 7));
      ctx.strokeStyle = star.colour; ctx.fillStyle = star.colour;
      if (star.trail && !reducedMotion.matches) {
        let previousX = p.x, previousY = p.y;
        for (let j = 1; j <= 9; j++) {
          point(star, Math.max(0, t - j * .004), trailPosition);
          ctx.globalAlpha = alpha * (1 - j / 10) * .45; ctx.lineWidth = .65;
          ctx.beginPath(); ctx.moveTo(trailPosition.x, trailPosition.y); ctx.lineTo(previousX, previousY); ctx.stroke();
          previousX = trailPosition.x; previousY = trailPosition.y;
        }
      }
      ctx.globalAlpha = alpha; const size = star.size;
      ctx.beginPath(); ctx.moveTo(p.x, p.y - size * 2.1); ctx.lineTo(p.x + size * .48, p.y - size * .48);
      ctx.lineTo(p.x + size * 1.65, p.y); ctx.lineTo(p.x + size * .48, p.y + size * .48);
      ctx.lineTo(p.x, p.y + size * 2.1); ctx.lineTo(p.x - size * .48, p.y + size * .48);
      ctx.lineTo(p.x - size * 1.65, p.y); ctx.lineTo(p.x - size * .48, p.y - size * .48); ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function animate(now) {
    raf = null;
    if (document.hidden || reducedMotion.matches) return;
    // Milliseconds, not frame counts: identical speed at any display refresh rate.
    if (lastFrame !== null) elapsed += now - lastFrame;
    lastFrame = now;
    drawFrame();
    raf = requestAnimationFrame(animate);
  }
  function syncMotion() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null; lastFrame = null;
    drawFrame();
    if (!document.hidden && !reducedMotion.matches) raf = requestAnimationFrame(animate);
  }
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', syncMotion);
  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas(); syncMotion();
  scheduleScrollUpdate();
})();
