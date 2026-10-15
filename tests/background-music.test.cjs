const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('public/background-music.js', 'utf8');
function setup() {
  const frames = new Map(); let next = 0, calls = 0, lang = 'vi';
  const audio = { paused: true, volume: 1, error: null, events: {},
    addEventListener(name, fn) { this.events[name] = fn; },
    play() { calls++; this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; this.events.pause?.(); } };
  const action = {};
  const button = { dataset: {}, hidden: true, querySelector: () => action, events: {},
    setAttribute(name, value) { this[name] = value; }, addEventListener(name, fn) { this.events[name] = fn; } };
  const env = { module: { exports: {} },
    document: { getElementById: () => audio, querySelector: () => button },
    requestAnimationFrame: fn => { frames.set(++next, fn); return next; }, cancelAnimationFrame: id => frames.delete(id) };
  vm.createContext(env); vm.runInContext(source, env);
  env.module.exports.init({ getLanguage: () => lang });
  return { audio, button, action, frames, calls: () => calls,
    click: () => button.events.click(), localize: () => { lang = 'en'; env.module.exports.localize(); },
    tick(time) { const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(time)); } };
}
test('never autoplays; explicit play fades from zero to .35 over 800ms', async () => {
  const h = setup(); assert.equal(h.calls(), 0); assert.equal(h.audio.paused, true);
  await h.click(); assert.equal(h.audio.volume, 0); assert.equal(h.button['aria-pressed'], 'true');
  h.tick(100); h.tick(500); assert.equal(h.audio.volume, .175);
  h.tick(900); assert.equal(h.audio.volume, .35); assert.equal(h.frames.size, 0);
  await h.click(); assert.equal(h.audio.paused, true); assert.equal(h.audio.volume, 0);
  await h.click(); h.tick(1000); h.tick(1800); assert.equal(h.audio.volume, .35);
  h.localize(); assert.match(h.button['aria-label'], /^Pause/);
});
test('pause during fade cancels scheduled volume work immediately', async () => {
  const h = setup(); await h.click(); h.tick(0); h.tick(300); await h.click();
  h.tick(900); assert.equal(h.audio.paused, true); assert.equal(h.audio.volume, 0); assert.equal(h.frames.size, 0);
});
test('rapid play/pause cannot leave a stale fade running', async () => {
  const h = setup(); let resolve;
  h.audio.play = () => { h.audio.paused = false; return new Promise(done => resolve = done); };
  const play = h.click(); await h.click(); resolve(); await play;
  assert.equal(h.audio.paused, true); assert.equal(h.frames.size, 0);
});
test('load errors disable control; browser play rejection is safely retryable', async () => {
  const h = setup(); h.audio.play = () => Promise.reject(Error('blocked'));
  await h.click(); assert.equal(h.button.disabled, false); assert.equal(h.button['aria-pressed'], 'false');
  h.audio.error = { code: 4 }; h.audio.events.error();
  assert.equal(h.button.disabled, true); assert.match(h.button['aria-label'], /chưa khả dụng/);
  assert.equal(h.frames.size, 0);
});
