const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const scenes = require('../public/reveal.js');
test('scene entry/exit bands are reversible and keep long sections readable', () => {
  assert.equal(scenes.isVisible({top:200,bottom:3000},800,false),true);
  assert.equal(scenes.isVisible({top:-1600,bottom:400},800,true),true);
  assert.equal(scenes.isVisible({top:-3000,bottom:50},800,true),false);
  assert.equal(scenes.isVisible({top:-2900,bottom:200},800,false),true);
  assert.equal(scenes.isVisible({top:750,bottom:1000},800,true),false);
  assert.equal(scenes.isVisible({top:650,bottom:1000},800,false),true);
});
test('hysteresis prevents flicker near either entry boundary', () => {
  const rect = {top:700,bottom:1700};
  assert.equal(scenes.isVisible(rect,800,true),true);
  assert.equal(scenes.isVisible(rect,800,false),false);
});
test('pre-paint bootstrap fails open when scene module is missing', () => {
  const classes = new Set(); let fallback;
  const env = {window:{},location:{hash:''},history:{},performance:{getEntriesByType:()=>[{type:'navigate'}]},
    document:{documentElement:{classList:{add:n=>classes.add(n),remove:n=>classes.delete(n)}}},
    matchMedia:()=>({matches:false}),setTimeout:fn=>{fallback=fn;return 1;}};
  vm.createContext(env);vm.runInContext(fs.readFileSync('public/navigation-start.js','utf8'),env);
  assert.ok(classes.has('reveal-enabled'));fallback();assert.equal(classes.size,0);
});
test('DOM scene updates reverse visibility, guard invisible controls and respect reduced motion', () => {
  function element(top,height) {
    const classes=new Set();return {offsetTop:top,offsetHeight:height,inert:false,classList:{contains:n=>classes.has(n),
      add:(...names)=>names.forEach(n=>classes.add(n)),remove:(...names)=>names.forEach(n=>classes.delete(n)),
      toggle:(n,on)=>on?classes.add(n):classes.delete(n)}};
  }
  const root=element(0,0);root.classList.add('reveal-enabled');
  const groups=[element(0,800),element(800,1600),element(2400,1000),element(3400,500)];
  const rafs=[],events={};let motionChange;
  const motion={matches:false,addEventListener:(_,fn)=>motionChange=fn};
  const env={module:{exports:{}},window:{addEventListener:(n,fn)=>events[n]=fn},scrollY:0,innerHeight:800,
    document:{documentElement:root,querySelectorAll:()=>groups},matchMedia:()=>motion,
    setTimeout:()=>1,clearTimeout(){},requestAnimationFrame:fn=>{rafs.push(fn);return 1;},cancelAnimationFrame(){}};
  vm.createContext(env);vm.runInContext(fs.readFileSync('public/reveal.js','utf8'),env);env.module.exports.init();
  const flush=()=>{while(rafs.length)rafs.shift()();};flush();assert.equal(groups[0].inert,false);assert.equal(groups[2].inert,true);
  env.scrollY=2400;events.scroll();flush();assert.equal(groups[0].inert,true);assert.equal(groups[2].inert,false);
  env.scrollY=0;events.scroll();flush();assert.equal(groups[0].inert,false);
  motion.matches=true;motionChange();assert.ok(groups.every(e=>!e.inert));assert.equal(root.classList.contains('reveal-enabled'),false);
});
