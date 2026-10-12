(() => {
  'use strict';
  const copy = {
    vi: {
      description: 'Ginji (CoCo) — sinh viên Luật, thích game, âm nhạc và những ngày trời âm u.',
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
      galleryTitle: "Một chút thế giới nhỏ của mình :3", refCaption: 'Refsheet nhân vật', refView: 'Xem ảnh đầy đủ',
      refAltA: 'Refsheet Ginji: kitsune trắng và xanh với hai đuôi, góc nhìn trước, sau và các chi tiết thiết kế.',
      refViewer: 'Refsheet Ginji', refSelector: 'Chọn refsheet', refAltB: 'Refsheet Ginji B: cáo trắng xanh với nhiều đuôi, bảng màu và các biểu cảm đeo kính.', refUnavailable: 'Ảnh này chưa khả dụng. Vẫn hiển thị refsheet hiện tại.', refChanged: 'Đang hiển thị', galleryEmpty: 'Một góc dành cho những artwork sắp tới của Ginji.',
      helloLabel: 'MỘT LỜI CHÀO', helloHeadline: 'Đừng ngại nói',
      helloText: 'Nếu bạn cũng thích game, âm nhạc hay chỉ muốn trò chuyện một chút, có lẽ chúng mình sẽ có chuyện để kể.',
      helloNote: 'Mình có thể hơi chậm mở lời. Nhưng rất vui khi bạn ghé qua.',
      backToTop: 'Về đầu trang',
      languageLabel: 'Hiển thị bằng tiếng Anh', languageHint: 'Switch to English', languageAnnouncement: 'Đã chuyển sang tiếng Việt.',
      gameList: "Danh sách game mình thường chơi",
      gamePending: "Danh sách game đang được cập nhật.",
      musicTry: "Nghe thử một bài nhạc không?",
      sleepTitle: 'Đi "ngẩu"',
      sleepText: "Bạn nghĩ gì thế? Đương nhiên phải đi ngủ rồi, hơi bị mê nha trời",
    },
    en: {
      description: 'Ginji (CoCo) — a law student into games, music and cloudy days.',
      skip: 'Skip to main content', navigation: 'Main navigation',
      heroLead: 'Hewwooo, I’m Ginji — a chill lil fox who loves wandering around. Welcome to my profileee~',
      navAbout: 'About Me', navFursona: 'Fursona', navGallery: 'Gallery',
      introAlt: 'Ginji, a white and blue fox with a playful smile.', socialNav: 'Social links', newTab: 'opens in a new tab', fursonaLabel: 'FURSONA', galleryLabel: 'GALLERY',
      aboutLabel: 'ABOUT ME', aboutHeadline1: "I'm a little introverted.", aboutHeadline2: "But I'm not that hard to get to know :3",
      aboutP1: "You can call me Ginji. I've made it through 22 pots of bánh chưng so far, and I'm currently studying and living in Ho Chi Minh City.",
      aboutP2: "I'm pretty easy to get along with and sociable, though I'm also a bit introverted. Sometimes I talk a lot; other times I close myself off and get quiet. But don't let that make you hesitate to talk to me. If you want to start a conversation, just give it a try and come chat with me uwu.",
      interestsTitle: "Things I like to do",
      gameTitle: "Playing \"gem\"", gameText: "I mean, isn't it obvious? Who doesn't like playing games? Do you play any of the games I usually play?",
      musicTitle: 'Listen to music', musicText: "I listen to lots of different genres. Is there a song in here that you might end up liking as much as I do?",
      fursonaHeadline: "Ginji - Kitsune with \"9 lil' tails\"",
      fursonaText: "Yep, you heard that right. He's a white nine-tailed fox, but in his everyday form he usually appears with just two tails — and he's also my mascot.",
      galleryTitle: "A little world of my own :3", refCaption: 'Character reference sheet', refView: 'View full image',
      refAltA: 'Ginji reference sheet: a white and blue kitsune with two tails, front and back views, and character design details.',
      refViewer: 'Ginji reference sheets', refSelector: 'Choose a reference sheet', refAltB: 'Ginji reference sheet B: a white and blue fox with multiple tails, a colour palette and expressions wearing glasses.', refUnavailable: 'This image is unavailable. Keeping the current reference sheet.', refChanged: 'Showing', galleryEmpty: 'A little space for Ginji’s upcoming artwork.',
      helloLabel: 'A LITTLE HELLO', helloHeadline: 'Feel free to say',
      helloText: 'If you’re into games, music or just a little conversation, we might have a few stories to share.',
      helloNote: 'I might be slow to say the first word. But I’m glad you stopped by.',
      backToTop: 'Back to top',
      languageLabel: 'Display in English', languageHint: 'Chuyển sang tiếng Việt', languageAnnouncement: 'Switched to English.',
      gameList: "Games I usually play",
      gamePending: "The game list is being updated.",
      musicTry: "Wanna hear a song?",
      sleepTitle: 'Go "eepy"',
      sleepText: "What did you think? Of course I have to sleep. I'm kind of obsessed with it, seriously.",
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
  function cancelScroll() {
    if (scrollRaf !== null) cancelAnimationFrame(scrollRaf);
    scrollRaf = null;
    navigationTarget = null;
    scheduleScrollUpdate();
  }
  function destination(target) {
    const top = target === overview ? 0 : window.scrollY + target.getBoundingClientRect().top - headerClearance();
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
  window.addEventListener('wheel', cancelScroll, { passive: true });
  window.addEventListener('touchstart', cancelScroll, { passive: true });
  window.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) cancelScroll();
  });
  reducedMotion.addEventListener('change', cancelScroll);
  window.addEventListener('popstate', cancelScroll);

  const refViewer = document.querySelector('.refsheet-viewer');
  const refImage = document.getElementById('refsheet-image');
  const refFullLink = document.querySelector('.refsheet-full-link');
  const refSelector = document.querySelector('.ref-selector');
  const refIndicator = document.querySelector('.ref-indicator');
  const refButtons = Array.from(document.querySelectorAll('[data-ref]'));
  const refs = { a: { src: 'assets/ginji-refsheet.png', alt: 'refAltA' }, b: { src: 'assets/ginji-refsheet-b.png', alt: 'refAltB' } };
  let currentRef = 'a', refRequest = 0;
  function updateRefLabels() {
    refImage.alt = copy[currentLanguage][refs[currentRef].alt];
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
      refFullLink.href = refs[key].src;
      for (const button of refButtons) button.setAttribute('aria-pressed', String(button.dataset.ref === key));
      updateRefIndicator();
      refViewer.querySelector('.ref-current').textContent = 'Ref. ' + key.toUpperCase();
      document.getElementById('ref-announcement').textContent = copy[currentLanguage].refChanged + ' Ref. ' + key.toUpperCase();
    } catch {
      if (request === refRequest) {
        refButtons.find(button => button.dataset.ref === key).disabled = true;
        document.getElementById('ref-announcement').textContent = copy[currentLanguage].refUnavailable;
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
  document.querySelector('.game-list').addEventListener('click', () => {
    document.getElementById('game-status').hidden = false;
  });
  window.GinjiMusic.init({ getLanguage: () => currentLanguage, reducedMotion });

  const storedLanguage = readPreference('ginji-language');
  applyLanguage(storedLanguage === 'vi' || storedLanguage === 'en' ? storedLanguage : (navigator.language || 'vi').toLowerCase().startsWith('vi') ? 'vi' : 'en');
  desiredLanguage = currentLanguage;
  reserveLanguageSpace(true);
  languageToggle.hidden = false;
  // Observe individual reading blocks, keeping long content visible until fully out of view.
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.classList.toggle('is-revealed', entry.isIntersecting);
    }, { rootMargin: '24px 0px', threshold: 0 });
    for (const el of document.querySelectorAll('.hero, .social-links, .section-heading, .about, .interests-head, .card, .gallery-intro, .refsheet-viewer, .gallery-empty, .hello > div, .hello > .note')) {
      const rect = el.getBoundingClientRect();
      el.classList.toggle('is-revealed', rect.bottom >= -24 && rect.top <= window.innerHeight + 24);
      el.classList.add('reveal');
      revealObserver.observe(el);
    }
  }

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
