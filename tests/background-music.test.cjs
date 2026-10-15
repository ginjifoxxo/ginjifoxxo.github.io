const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('public/background-music.js', 'utf8');
function setup(blocked = false) {
  const documentEvents = {}, calls = [], classes = new Set(), frames = new Map(); let lang='vi', next=0;
  const audio={paused:true,error:null,currentTime:42,events:{},volume:1,
    play(){calls.push(this.volume);if(blocked)return Promise.reject(Error('autoplay blocked'));this.paused=false;this.events.playing?.();return Promise.resolve();},
    pause(){this.paused=true;this.events.pause?.();}, addEventListener(n,fn){this.events[n]=fn;}};
  const player={hidden:true,classList:{add:n=>classes.add(n),remove:n=>classes.delete(n)}};
  const button={parentElement:player,dataset:{},events:{},setAttribute(n,v){this[n]=v;},addEventListener(n,fn){this.events[n]=fn;}};
  const env={module:{exports:{}},document:{getElementById:()=>audio,querySelector:()=>button,
    addEventListener:(n,fn)=>documentEvents[n]=fn,removeEventListener:n=>delete documentEvents[n]},setTimeout:()=>1,clearTimeout(){},
    requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id)};
  vm.createContext(env);vm.runInContext(source,env);env.module.exports.init({getLanguage:()=>lang});
  return{audio,button,player,documentEvents,calls,frames,tick(time){const work=[...frames.values()];frames.clear();work.forEach(fn=>fn(time));},click:()=>button.events.click(),localize:()=>{lang='en';env.module.exports.localize();},allow(){blocked=false;},
    gesture(disc=false){documentEvents.pointerdown?.({isTrusted:true,type:'pointerdown',target:{closest:()=>disc}});}};
}
const settle=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
test('autoplay begins at zero, fades exactly to .15, and keeps audio position on pause/resume',async()=>{
  const h=setup();await settle();assert.deepEqual(h.calls,[0]);assert.equal(h.button.dataset.playing,'true');
  h.tick(0);h.tick(600);assert.equal(h.audio.volume,.075);h.tick(1200);assert.equal(h.audio.volume,.15);h.tick(2400);assert.equal(h.audio.volume,.15);
  h.click();assert.equal(h.audio.paused,true);assert.equal(h.button.dataset.playing,'false');assert.equal(h.audio.currentTime,42);
  h.click();await settle();assert.equal(h.audio.paused,false);assert.equal(h.audio.currentTime,42);h.localize();assert.match(h.button['aria-label'],/^Pause/);
});
test('blocked autoplay is quiet; only one later genuine gesture retries',async()=>{
  const h=setup(true);await settle();assert.equal(h.button.disabled,false);assert.equal(h.calls.length,1);assert.equal(h.button.dataset.playing,'false');
  h.allow();h.gesture();await settle();assert.equal(h.calls.length,2);assert.equal(h.audio.paused,false);h.gesture();assert.equal(h.calls.length,2);
  assert.equal(h.audio.volume,0);h.tick(0);h.tick(1200);assert.equal(h.audio.volume,.15);
});
test('disc gesture does not double-toggle automatic retry',async()=>{
  const h=setup(true);await settle();h.allow();h.gesture(true);h.click();await settle();assert.equal(h.calls.length,2);assert.equal(h.audio.paused,false);
});
test('media failure disables control and removes retry handlers',async()=>{
  const h=setup(true);await settle();h.audio.error={code:4};h.audio.events.error();assert.equal(h.button.disabled,true);
  assert.equal(Object.keys(h.documentEvents).length,0);assert.equal(h.button.dataset.playing,'false');
});
test('disc timeline uses play-state rather than resetting its animation',()=>{
  const css=fs.readFileSync('public/styles.css','utf8');assert.match(css,/animation: disc-turn 10s linear infinite; animation-play-state: paused/);
  assert.match(css,/data-playing="true"\] \.disc-face \{ animation-play-state: running/);
});
test('buffering pauses the disc and fade; playing resumes only one fade loop',async()=>{
  const h=setup();await settle();h.tick(0);h.tick(600);h.audio.events.waiting();
  assert.equal(h.button.dataset.playing,'false');assert.equal(h.frames.size,0);assert.equal(h.audio.volume,.075);
  h.audio.events.playing();h.audio.events.playing();assert.equal(h.frames.size,1);
  h.tick(5000);h.tick(5600);assert.equal(h.audio.volume,.15);assert.equal(h.frames.size,0);
});
test('pause during fade cancels pending volume changes without resetting the disc timeline',async()=>{
  const h=setup();await settle();h.tick(0);h.tick(300);h.click();const volume=h.audio.volume;
  h.tick(2000);assert.equal(h.audio.volume,volume);assert.equal(h.frames.size,0);assert.equal(h.audio.currentTime,42);
  h.click();await settle();assert.equal(h.audio.volume,0);assert.equal(h.frames.size,1);
});
test('status badge uses SVG triangle and bars, never text glyphs',()=>{
  const html=fs.readFileSync('public/index.html','utf8'),css=fs.readFileSync('public/styles.css','utf8');
  assert.match(html,/<svg class="disc-play"/);assert.match(html,/<svg class="disc-pause"/);
  assert.doesNotMatch(css,/content:\s*['"](?:▶|Ⅱ|II)['"]/);
});
