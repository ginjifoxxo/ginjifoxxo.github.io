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
    this.textContent = ''; this.hidden = false;
  }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; nodes.forEach((node, i) => node.offsetLeft = i * 192); }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  setAttribute(name, value) { this[name] = value; }
  removeAttribute(name) { delete this[name]; }
  querySelectorAll() { return []; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.listeners.close?.(); }
  animate() {
    let resolve;
    const finished = new Promise(done => resolve = done);
    this.animated = true;
    return { finished, cancel: resolve, finish: resolve };
  }
}
function harness(mode, reduced = true) {
  const names = ['#music-dialog', '.music-gacha', '.gacha-close', '.reel-viewport', '.reel-track',
    '.gacha-result', '.gacha-status', '.gacha-roll', '.gacha-progress', 'h2', '.gacha-intro'];
  const nodes = Object.fromEntries(names.map(name => [name, new Node()]));
  nodes['#music-dialog'].querySelector = name => nodes[name];
  const env = { module: { exports: {} }, window: {},
    document: { getElementById: () => nodes['#music-dialog'], querySelector: name => nodes[name], createElement: () => new Node() },
    fetch: async () => ({ ok: mode !== 'failure', status: 503, json: async () => ({ tracks: mode === 'empty' ? [] : data.tracks }) }),
  };
  vm.createContext(env); vm.runInContext(source, env);
  let saved = null;
  env.module.exports.init({ getLanguage: () => 'en', reducedMotion: { matches: reduced, addEventListener() {} },
    readPreference: () => '{corrupt', savePreference: (_, value) => saved = value });
  return { nodes, saved: () => saved };
}
test('reduced motion reveals a real result immediately and handles corrupt storage', async () => {
  const { nodes, saved } = harness('loaded');
  await nodes['.music-gacha'].listeners.click();
  assert.equal(nodes['.reel-track'].animated, undefined);
  assert.equal(nodes['.reel-track'].children.length, 21);
  assert.match(nodes['.gacha-status'].textContent, /You got:/);
  assert.equal(nodes['.gacha-progress'].textContent, 'Discovered: 1 / ' + data.tracks.length);
  assert.equal(JSON.parse(saved()).length, 1);
});
for (const mode of ['empty', 'failure']) test(mode + ' dataset disables rolling and restores focus on close', async () => {
  const { nodes } = harness(mode);
  await nodes['.music-gacha'].listeners.click();
  assert.equal(nodes['.gacha-roll'].disabled, true);
  assert.match(nodes['.gacha-status'].textContent, mode === 'empty' ? /No available/ : /could not load/);
  nodes['#music-dialog'].close();
  assert.equal(nodes['.music-gacha'].focused, true);
});
test('closing during a roll cancels discovery and removes temporary cards', async () => {
  const { nodes, saved } = harness('loaded', false);
  await nodes['.music-gacha'].listeners.click();
  assert.equal(nodes['.reel-track'].animated, true);
  nodes['#music-dialog'].close();
  await Promise.resolve(); await Promise.resolve();
  assert.equal(saved(), null);
  assert.equal(nodes['.reel-track'].children.length, 0);
});
