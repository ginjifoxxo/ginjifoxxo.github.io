const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const data = require('../public/data/music.json');
const source = fs.readFileSync(path.join(__dirname, '../public/music-gacha.js'), 'utf8');

// Minimal DOM harness for async loading/cancellation, not a visual browser substitute.
class Node {
  constructor() {
    this.children = []; this.dataset = {}; this.style = {}; this.listeners = {};
    this.offsetLeft = 0; this.offsetWidth = 180; this.clientWidth = 800;
    this.textContent = ''; this.hidden = false; this.style.setProperty = () => {}; this.classList = { add() {}, remove() {} };
  }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; nodes.forEach((node, i) => node.offsetLeft = i * 192); }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  setAttribute(name, value) { this[name] = value; }
  removeAttribute(name) { delete this[name]; }
  removeEventListener(name, fn) { if (this.listeners[name] === fn) delete this.listeners[name]; }
  querySelectorAll() { return []; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; queueMicrotask(() => this.listeners.close?.()); }
  getBoundingClientRect() { return { left: 100, right: 600, top: 100, bottom: 300 }; }
  animate(frames, options) {
    this.frames = frames; this.options = options;
    let resolve;
    const finished = new Promise(done => resolve = done);
    this.animated = true;
    this.animation = { finished, cancel: resolve, finish: resolve };
    return this.animation;
  }
}
function harness(mode, reduced = true) {
  const names = ['#music-dialog', '#music-result-dialog', '.music-gacha', '.gacha-close', '.reel-viewport', '.reel-track', '.gacha-result', '.gacha-status', 'h2'];
  const nodes = Object.fromEntries(names.map(name => [name, new Node()]));
  nodes['#music-dialog'].querySelector = name => nodes[name];
  nodes['#music-result-dialog'].querySelector = name => nodes[name];
  const timers = new Map(); let timerId = 0;
  const motion = { matches: reduced, addEventListener() {}, removeEventListener() {} };
  let resize; const requests = [];
  const env = { module: { exports: {} }, window: { ResizeObserver: true }, navigator: { userAgent: 'Desktop' }, AbortController,
    setTimeout: (fn, ms) => { const id = ++timerId; timers.set(id, { fn, ms }); return id; },
    clearTimeout: id => timers.delete(id),
    document: { getElementById: id => nodes['#' + id], querySelector: name => nodes[name], createElement: () => new Node() },
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} },
    fetch: async (...args) => { requests.push(args); return ({ ok: mode !== 'failure', status: 503, json: async () => ({ tracks: mode === 'empty' ? [] : data.tracks }) }); },
  };
  vm.createContext(env); vm.runInContext(source, env);
  env.module.exports.init({ getLanguage: () => 'en', reducedMotion: motion });
  return { nodes, timers, motion, requests, resize: () => resize() };
}
const settle = async () => { for (let i = 0; i < 20; i++) await Promise.resolve(); };
test('reduced motion hands off immediately to a separate result dialog', async () => {
  const { nodes } = harness('loaded');
  await nodes['.music-gacha'].listeners.click(); await settle();
  assert.equal(nodes['.reel-track'].animated, undefined);
  assert.equal(nodes['#music-dialog'].open, false);
  assert.equal(nodes['#music-result-dialog'].open, true);
  assert.equal(nodes['.gacha-close'].focused, true);
  assert.equal(nodes['.reel-track'].children.length, 0);
  assert.equal(nodes['.gacha-result'].children.length, 2);
});
for (const mode of ['empty', 'failure']) test(mode + ' dataset reports a friendly status and supports emergency close', async () => {
  const { nodes } = harness(mode);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  nodes['#music-dialog'].listeners.animationend?.({ target: nodes['#music-dialog'], animationName: 'gacha-enter' });
  await opening;
  assert.notEqual(nodes['#music-result-dialog'].open, true);
  assert.match(nodes['.gacha-status'].textContent, mode === 'empty' ? /No available/ : /could not load/);
  nodes['#music-dialog'].close(); await settle();
  assert.equal(nodes['.music-gacha'].focused, true);
});
test('reel waits for entrance and pause, then uses a valid random duration', async () => {
  const { nodes, timers } = harness('loaded', false);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  assert.equal(nodes['.reel-track'].children.length, 21);
  assert.equal(nodes['.reel-track'].animated, undefined);
  nodes['#music-dialog'].listeners.animationend({ target: nodes['#music-dialog'], animationName: 'gacha-enter' });
  await settle();
  assert.equal(nodes['.reel-track'].animated, undefined);
  assert.equal([...timers.values()][0].ms, 120);
  [...timers.values()][0].fn(); await opening;
  const duration = nodes['.reel-track'].options.duration;
  assert.ok(duration >= 7000 && duration <= 9000 && duration % 100 === 0);
  assert.equal(nodes['.reel-track'].frames.length, 2);
  nodes['#music-dialog'].close(); await settle();
  assert.notEqual(nodes['#music-result-dialog'].open, true);
  assert.equal(nodes['.reel-track'].children.length, 0);
});
test('cancelling opening prevents stale spin even after entrance would complete', async () => {
  const { nodes, timers } = harness('loaded', false);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  nodes['#music-dialog'].close(); await settle(); await opening;
  assert.equal(nodes['.reel-track'].animated, undefined);
  assert.notEqual(nodes['#music-result-dialog'].open, true);
  assert.equal(timers.size, 0);
});
test('double-click during opening only prepares one reel', async () => {
  const { nodes } = harness('loaded', false);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  const before = nodes['.reel-track'].children;
  await nodes['.music-gacha'].listeners.click();
  assert.ok(nodes['.reel-track'].children === before);
  nodes['#music-dialog'].close(); await settle(); await opening;
});
test('outside click closes result; inside padding does not', async () => {
  const { nodes } = harness('loaded');
  await nodes['.music-gacha'].listeners.click(); await settle();
  const dialog = nodes['#music-result-dialog'];
  const inside = { target: dialog, clientX: 150, clientY: 150 };
  dialog.listeners.pointerdown(inside); dialog.listeners.click(inside);
  assert.equal(dialog.open, true);
  const outside = { target: dialog, clientX: 20, clientY: 20 };
  dialog.listeners.pointerdown(outside); dialog.listeners.click(outside); await settle();
  assert.equal(dialog.open, false);
  assert.equal(nodes['.music-gacha'].focused, true);
});

test('missing animationend uses the documented safe fallback before the pause', async () => {
  const { nodes, timers } = harness('loaded', false);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  assert.equal([...timers.values()][0].ms, 500);
  [...timers.values()][0].fn(); await settle();
  assert.equal(nodes['.reel-track'].animated, undefined);
  assert.equal([...timers.values()][0].ms, 120);
  [...timers.values()][0].fn(); await opening;
  assert.equal(nodes['.reel-track'].animated, true);
  nodes['#music-dialog'].close(); await settle();
});
test('closing during the post-entrance pause cancels its pending start', async () => {
  const { nodes, timers } = harness('loaded', false);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  nodes['#music-dialog'].listeners.animationend({ target: nodes['#music-dialog'], animationName: 'gacha-enter' });
  await settle();
  nodes['#music-dialog'].close(); await settle(); await opening;
  assert.equal(timers.size, 0);
  assert.equal(nodes['.reel-track'].animated, undefined);
  assert.notEqual(nodes['#music-result-dialog'].open, true);
});

test('landing fraction survives resize and final alignment without changing winner', async () => {
  const { nodes, timers, resize, requests } = harness('loaded', false);
  const opening = nodes['.music-gacha'].listeners.click(); await settle();
  nodes['#music-dialog'].listeners.animationend({ target: nodes['#music-dialog'], animationName: 'gacha-enter' });
  await settle(); [...timers.values()][0].fn(); await opening;
  const reel = nodes['.reel-track'], viewport = nodes['.reel-viewport'];
  const winner = reel.children[17];
  const end = Number(reel.frames[1].transform.match(/translate3d\(([-\d.]+)px/)[1]);
  const fraction = (viewport.clientWidth / 2 - winner.offsetLeft - end) / winner.offsetWidth;
  assert.ok(fraction >= .1 && fraction <= .9);
  const title = winner.children[1].textContent;
  viewport.clientWidth = 320; resize(); await settle();
  const expected = 160 - winner.offsetLeft - winner.offsetWidth * fraction;
  const final = Number(reel.style.transform.match(/translate3d\(([-\d.]+)px/)[1]);
  assert.ok(Math.abs(final - expected) < .000001);
  assert.equal(nodes['.gacha-result'].children[1].children[0].textContent, title);
  assert.equal(requests[0][1].cache, 'no-store');
});
