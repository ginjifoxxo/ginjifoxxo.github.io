const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const reveals = require('../public/reveal.js');
test('content boundaries mirror exactly for entering from either edge', () => {
  for (const active of [false,true]) for (const top of [-200,40,90,110,650,700,730,810]) {
    const rect={top,bottom:top+80};
    assert.equal(reveals.isVisible(rect,800,active),reveals.isVisible({top:800-rect.bottom,bottom:800-rect.top},800,active));
  }
  assert.equal(reveals.isVisible({top:-1600,bottom:400},800,true),true);
  assert.equal(reveals.isVisible({top:740,bottom:1000},800,true),false);
});
test('4 percent hysteresis holds near both edges without retaining distant content', () => {
  for(const rect of [{top:700,bottom:900},{top:-100,bottom:100}]) {
    assert.equal(reveals.isVisible(rect,800,true),true);
    assert.equal(reveals.isVisible(rect,800,false),false);
  }
  assert.equal(reveals.isVisible({top:-300,bottom:60},800,true),false);
});
test('pre-paint bootstrap fails open if the reveal module is missing', () => {
  const classes=new Set();let fallback;
  const env={window:{},location:{hash:''},history:{},performance:{getEntriesByType:()=>[{type:'navigate'}]},document:{documentElement:{classList:{add:n=>classes.add(n),remove:n=>classes.delete(n)}}},matchMedia:()=>({matches:false}),setTimeout:fn=>{fallback=fn;return 1;}};
  vm.createContext(env);vm.runInContext(fs.readFileSync('public/navigation-start.js','utf8'),env);
  assert.ok(classes.has('reveal-enabled'));fallback();assert.equal(classes.size,0);
});
function setup(reduced=false) {
  function element(top,height,parent=null) {
    const classes=new Set();return {offsetTop:top,offsetHeight:height,offsetParent:parent,contains(target) { return target === this; },classes,
      classList:{contains:n=>classes.has(n),add:(...ns)=>ns.forEach(n=>classes.add(n)),remove:(...ns)=>ns.forEach(n=>classes.delete(n)),toggle:(n,on)=>on?classes.add(n):classes.delete(n)}};
  }
  const root=element(0,0),parent=element(100,3000);root.classList.add('reveal-enabled');
  const blocks=[element(0,80,parent),element(800,200,parent),element(2200,300,parent)];
  const rafs=[],events={};let change;
  const motion={matches:reduced,addEventListener:(_,fn)=>change=fn};
  const env={module:{exports:{}},window:{addEventListener:(n,fn)=>events[n]=fn},scrollY:0,innerHeight:800,
    document:{documentElement:root,activeElement:null,querySelectorAll:()=>blocks,addEventListener:(n,fn)=>events[n]=fn},matchMedia:()=>motion,
    clearTimeout(){},requestAnimationFrame:fn=>{rafs.push(fn);return 1;},cancelAnimationFrame(){}};
  vm.createContext(env);vm.runInContext(fs.readFileSync('public/reveal.js','utf8'),env);env.module.exports.init();
  const flush=()=>{while(rafs.length)rafs.shift()();};flush();
  return {blocks,root,env,motion,change:()=>change(),scroll(y){env.scrollY=y;events.scroll();flush();},flush,events};
}
test('nested blocks repeatedly reveal and exit in both directions without section inert', () => {
  const h=setup(),visible=()=>h.blocks.map(b=>b.classes.has('is-visible'));
  assert.deepEqual(visible(),[true,false,false]);
  for(let i=0;i<3;i++) {
    h.scroll(800);assert.deepEqual(visible(),[false,true,false]);assert.ok(h.blocks[0].classes.has('is-passed'));
    h.scroll(2200);assert.deepEqual(visible(),[false,false,true]);
    h.scroll(800);assert.deepEqual(visible(),[false,true,false]);assert.equal(h.blocks[2].classes.has('is-passed'),false);
    h.scroll(0);assert.deepEqual(visible(),[true,false,false]);
  }
  assert.ok(h.blocks.every(b=>!('inert' in b)));
});
test('reduced motion works at startup and when toggled in either direction', () => {
  const h=setup(true);assert.equal(h.root.classes.has('reveal-enabled'),false);
  h.motion.matches=false;h.change();h.flush();assert.ok(h.root.classes.has('reveal-enabled'));
  h.scroll(2200);h.motion.matches=true;h.change();assert.equal(h.root.classes.has('reveal-enabled'),false);
});
test('keyboard focus reveals its block even outside the visual activation band', () => {
  const h=setup();h.blocks[2].contains=target=>target==='focus';h.env.document.activeElement='focus';
  h.events.focusin();h.flush();assert.ok(h.blocks[2].classes.has('is-visible'));
  h.env.document.activeElement=null;h.events.focusout();h.flush();assert.equal(h.blocks[2].classes.has('is-visible'),false);
});
