const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm');
const source = fs.readFileSync('public/app.js', 'utf8');

function setup() {
  const node = dataset => ({ dataset, attributes: {}, getBoundingClientRect: () => ({ top: 100, bottom: 200 }), setAttribute(k, v) { this.attributes[k] = v; } });
  const title = node({ i18n: 'heroLead' }), control = node({ i18nAria: 'navigation' });
  const portrait = node({ i18nAlt: 'introAlt' }), social = node({ social: 'Discord' });
  const toggle = node({}), top = node({}), announcement = {}, meta = {}, preference = {}, events = {};
  toggle.addEventListener = (name, fn) => events[name] = fn;
  const elements = { '[data-i18n]': [title], '[data-i18n-aria]': [control], '[data-i18n-alt]': [portrait], '[data-social]': [social] };
  const env = { document: { documentElement: {}, querySelector: () => meta,
    querySelectorAll: selector => elements[selector] || [], getElementById: () => announcement },
    languageToggle: toggle, backToTop: top, reducedMotion: { matches: true, addEventListener() {} },
    window: { scrollY: 1200, innerHeight: 800, scrollTo() {}, GinjiMusic: { localize() {} }, GinjiBackgroundMusic: { localize() {} }, GinjiGallery: { localize() {} } },
    getComputedStyle: () => ({ visibility: 'visible' }),
    savePreference: (key, value) => preference[key] = value,
    updateRefLabels() {}, scheduleIndicator() {}, scheduleScrollUpdate() {}, cancelScroll() {} };
  vm.createContext(env);
  const dictionary = source.slice(source.indexOf('  const copy ='), source.indexOf('  const languageToggle ='));
  const apply = source.slice(source.indexOf('  function applyLanguage('), source.indexOf('  // Reserve the taller'));
  const change = source.slice(source.indexOf('  let languageRequest ='), source.indexOf('  let navigationVisible ='));
  vm.runInContext(dictionary + '\nlet currentLanguage = "vi";\n' + apply + change, env);
  return { env, title, control, portrait, social, toggle, top, announcement, meta, preference, events };
}

test('language switch describes the next action and announces the language actually activated', async () => {
  const h = setup();
  h.env.applyLanguage('vi');
  assert.equal(h.toggle.attributes['aria-label'], 'Switch to English');
  assert.equal(h.toggle.title, 'Switch to English');
  await h.events.click();
  assert.equal(h.env.document.documentElement.lang, 'en');
  assert.equal(h.toggle.attributes['aria-checked'], 'true');
  assert.equal(h.toggle.attributes['aria-label'], 'Switch to Vietnamese');
  assert.equal(h.toggle.title, 'Switch to Vietnamese');
  assert.equal(h.announcement.textContent, 'Switched to English.');
  assert.equal(h.preference['ginji-language'], 'en');
  assert.equal(h.control.attributes['aria-label'], 'Main navigation');
  assert.equal(h.portrait.attributes.alt, 'Ginji, a white and blue fox with a playful smile.');
  assert.equal(h.social.attributes['aria-label'], 'Discord — opens in a new tab');
  assert.equal(h.top.title, 'Back to top');
  assert.equal(h.meta.content, 'Ginji — a law student who likes games, music, and quiet days.');
  await h.events.click();
  assert.equal(h.env.document.documentElement.lang, 'vi');
  assert.equal(h.toggle.attributes['aria-checked'], 'false');
  assert.equal(h.toggle.attributes['aria-label'], 'Switch to English');
  assert.equal(h.announcement.textContent, 'Đã chuyển sang tiếng Việt.');
  assert.equal(h.preference['ginji-language'], 'vi');
  assert.equal(h.control.attributes['aria-label'], 'Điều hướng chính');
});

test('an existing refsheet announcement and image alt follow later language changes', () => {
  const announcement = {};
  const env = { currentLanguage: 'vi', currentRef: 'b', refStatus: 'refChanged',
    refImage: {}, refLightbox: { open: false }, refs: { b: { alt: 'refAltB' } },
    document: { getElementById: () => announcement } };
  vm.createContext(env);
  const dictionary = source.slice(source.indexOf('  const copy ='), source.indexOf('  const languageToggle ='));
  const labels = source.slice(source.indexOf('  function updateRefLabels()'), source.indexOf('  function updateRefIndicator()'));
  vm.runInContext(dictionary + labels, env);
  env.updateRefLabels(); assert.equal(announcement.textContent, 'Đang hiển thị Ref. B');
  env.currentLanguage = 'en'; env.updateRefLabels();
  assert.equal(announcement.textContent, 'Showing Ref. B');
  assert.match(env.refImage.alt, /a color palette/);
  env.refStatus = 'refUnavailable'; env.updateRefLabels();
  assert.equal(announcement.textContent, "This image isn't available. Showing the current refsheet instead.");
});
