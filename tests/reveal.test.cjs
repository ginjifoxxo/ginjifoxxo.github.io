const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const bootstrap = fs.readFileSync('public/navigation-start.js', 'utf8');
const reveal = fs.readFileSync('public/reveal.js', 'utf8');
function setup(reduced = false, supported = true) {
  const classes = new Set(), rafs = [], timers = new Map(), groups = [0,1,2].map(() => ({ classList: { add(name) { this[name] = true; } } }));
  let callback, motionChanged; const observed = new Set();
  const root = { classList: { add: n => classes.add(n), remove: n => classes.delete(n) } };
  const motion = { matches: reduced, addEventListener: (_, fn) => motionChanged = fn };
  const window = { addEventListener() {} };
  const env = { window, location: { hash: '' }, history: {}, performance: { getEntriesByType: () => [{ type: 'navigate' }] },
    document: { documentElement: root, querySelectorAll: () => groups }, matchMedia: () => motion,
    setTimeout: (fn, ms) => { timers.set(1, { fn, ms }); return 1; }, clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => rafs.push(fn), IntersectionObserver: class {
      constructor(fn) { callback = fn; } observe(el) { observed.add(el); } unobserve(el) { observed.delete(el); } disconnect() { observed.clear(); }
    } };
  if (supported) window.IntersectionObserver = env.IntersectionObserver;
  vm.createContext(env); vm.runInContext(bootstrap, env);
  return { classes, groups, timers, observed, motion, start() { vm.runInContext(reveal, env); while (rafs.length) rafs.shift()(); },
    enter(group) { callback([{ target: group, isIntersecting: true }]); }, reduce() { motion.matches = true; motionChanged(); } };
}
test('pre-paint opt-in is fail-open when reveal script is unavailable', () => {
  const h = setup(); assert.ok(h.classes.has('reveal-enabled'));
  assert.equal(h.timers.get(1).ms, 1800); h.timers.get(1).fn();
  assert.equal(h.classes.has('reveal-enabled'), false);
});
test('groups are observed once and remain revealed after leaving', () => {
  const h = setup(); h.start(); assert.equal(h.observed.size, 3);
  assert.equal(h.groups[2].classList['is-revealed'], undefined);
  h.enter(h.groups[0]); assert.equal(h.observed.has(h.groups[0]), false);
  assert.equal(h.groups[0].classList['is-revealed'], true); assert.equal(h.timers.size, 0);
  assert.equal(h.observed.size, 2); h.reduce(); assert.equal(h.classes.size, 0); assert.equal(h.observed.size, 0);
});
test('reduced motion or unsupported observer shows content immediately', () => {
  for (const h of [setup(true), setup(false, false)]) { h.start(); assert.equal(h.classes.size, 0); assert.equal(h.timers.size, 0); }
});
test('observer initialization error reveals content safely', () => {
  const h = setup(); h.groups[Symbol.iterator] = () => { throw Error('bootstrap failure'); };
  h.start(); assert.equal(h.classes.size, 0); assert.equal(h.timers.size, 0);
});
