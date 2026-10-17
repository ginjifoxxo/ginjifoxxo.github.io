const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../public/game-list.js');

function harness(reduce = true) {
  let focus, language = 'vi'; const timers = new Map(); let timerId = 0;
  class Node {
    constructor() { this.children = []; this.events = {}; this.attrs = {}; this.dataset = {}; this.style = { setProperty: (k, v) => this.style[k] = v }; this.className = ''; this.hidden = false; }
    append(...nodes) { this.children.push(...nodes); }
    setAttribute(key, value) { this.attrs[key] = value; }
    addEventListener(key, fn) { this.events[key] = fn; }
    focus() { focus = this; }
    get classList() { return { add: key => this.classList.toggle(key, true), remove: key => this.classList.toggle(key, false), toggle: (key, value) => { const names = new Set(this.className.split(' ').filter(Boolean)); if (value) names.add(key); else names.delete(key); this.className = [...names].join(' '); } }; }
    querySelector(selector) { for (const node of this.children) { if (node.className.split(' ').includes(selector.slice(1))) return node; const match = node.querySelector(selector); if (match) return match; } return null; }
    showModal() { this.open = true; }
    close() { this.open = false; this.events.close?.(); }
    getBoundingClientRect() { return { left: 20, right: 900, top: 20, bottom: 700 }; }
  }
  const dialog = new Node(), opener = new Node(), controls = {};
  for (const cls of ['game-nav', 'game-stage', 'game-close', 'game-previous', 'game-next', 'game-announcement']) { const node = new Node(); node.className = cls; controls[cls] = node; dialog.append(node); }
  const motion = { matches: reduce, addEventListener: (_, fn) => motion.change = fn };
  const fs = require('node:fs'), vm = require('node:vm');
  const env = { module: { exports: {} }, document: { getElementById: () => dialog, querySelector: () => opener, createElement: () => new Node() },
    setTimeout: fn => { timers.set(++timerId, fn); return timerId; }, clearTimeout: id => timers.delete(id) };
  vm.createContext(env); vm.runInContext(fs.readFileSync('public/game-list.js', 'utf8'), env);
  env.module.exports.init({ getLanguage: () => language, reducedMotion: motion });
  return { dialog, opener, controls, motion, timers, open: () => opener.events.click(),
    lang: value => { language = value; env.module.exports.localize(); }, focus: () => focus,
    active: () => controls['game-nav'].children.findIndex(n => n.attrs['aria-pressed'] === 'true'),
    key(key) { let prevented = false; dialog.events.keydown({ key, preventDefault: () => prevented = true }); return prevented; } };
}

test('four fixed game identities, circular positions and horizontal intent stay deterministic', () => {
  assert.deepEqual(api.games.map(g => g.name), ['Guilty Gear Strive', 'Riot Games', 'Roblox', 'Steam']);
  assert.deepEqual(api.games[1].subgames, ['League of Legends', 'Teamfight Tactics', 'Valorant']);
  for (let active = 0; active < 4; active++) assert.deepEqual(api.games.map((_, i) => api.slot(i, active)).sort((a,b) => a-b), [-1,0,1,2]);
  assert.equal(api.wrap(-1), 3); assert.equal(api.wrap(4), 0);
  assert.equal(api.swipe({x:100,y:100},{x:40,y:105}),1);
  assert.equal(api.swipe({x:100,y:100},{x:180,y:110}),-1);
  assert.equal(api.swipe({x:100,y:100},{x:120,y:200}),0);
  assert.equal(api.swipe({x:100,y:100},{x:70,y:100}),0);
});

test('lazy render, side selection, icons, keyboard, loop and remembered selection agree', () => {
  const h = harness(), nav = h.controls['game-nav'], stage = h.controls['game-stage'];
  assert.equal(stage.children.length, 0); h.open(); assert.equal(stage.children.length, 4); assert.equal(h.active(), 0);
  stage.children[1].querySelector('.game-card-select').events.click(); assert.equal(h.active(),1);
  for (const i of [3,0,2,1]) { nav.children[i].events.click(); assert.equal(h.active(), i); }
  h.key('End'); assert.equal(h.active(),3); h.key('ArrowRight'); assert.equal(h.active(),0);
  h.key('Home'); h.key('ArrowLeft'); assert.equal(h.active(),3);
  assert.equal(nav.children.filter(n=>n.tabIndex===0).length,1);
  assert.equal(stage.children.filter(n=>n.attrs['aria-hidden']==='false').length,1);
  h.controls['game-close'].events.click(); assert.equal(h.dialog.open,false); assert.equal(h.focus(),h.opener);
  assert.equal(h.key('Home'),false); h.open(); assert.equal(h.active(),3); assert.equal(stage.children.length,4);
});

test('localized generic labels preserve game names and all account values remain empty', () => {
  const h = harness();h.open(); assert.equal(h.controls['game-close'].attrs['aria-label'],'Đóng');
  h.lang('en');assert.equal(h.controls['game-close'].attrs['aria-label'],'Close');
  assert.equal(h.controls['game-next'].attrs['aria-label'],'Next');
  for (const card of h.controls['game-stage'].children) {
    assert.equal(card.children.length,4); assert.equal(card.children[2].children.length,3);
    for (const row of card.children[2].children) assert.equal(row.children[1].textContent,'—');
  }
});

test('backdrop/Escape close restore focus; reduced motion cancels a pending exit', () => {
  const h = harness(false); h.open();let prevented=false;
  h.dialog.events.cancel({preventDefault:()=>prevented=true});assert.ok(prevented);assert.ok(h.dialog.open);
  h.motion.matches=true;h.motion.change();assert.equal(h.dialog.open,false);assert.equal(h.timers.size,0);
  h.open();const inside={target:h.dialog,clientX:50,clientY:50};h.dialog.events.pointerdown(inside);h.dialog.events.click(inside);assert.ok(h.dialog.open);
  const outside={target:h.dialog,clientX:0,clientY:0};h.dialog.events.pointerdown(outside);h.dialog.events.click(outside);assert.equal(h.dialog.open,false);
  assert.equal(h.focus(),h.opener);
});

test('touch swipe selects one neighbor, while vertical movement and cancelled touches do not', () => {
  const h=harness();h.open();const stage=h.controls['game-stage'];
  const start={pointerType:'touch',pointerId:1,clientX:200,clientY:100};
  stage.events.pointerdown(start);stage.events.pointerup({pointerId:1,clientX:100,clientY:105});assert.equal(h.active(),1);
  stage.events.pointerdown(start);stage.events.pointerup({pointerId:1,clientX:180,clientY:250});assert.equal(h.active(),1);
  stage.events.pointerdown(start);stage.events.pointercancel();stage.events.pointerup({pointerId:1,clientX:100,clientY:100});assert.equal(h.active(),1);
});
