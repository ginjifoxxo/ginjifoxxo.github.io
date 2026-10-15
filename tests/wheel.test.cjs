const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const app=fs.readFileSync('public/app.js','utf8');
const source=app.slice(app.indexOf('  const wheelPointer'),app.indexOf("  window.addEventListener('touchstart'"));
function harness(){
  let next=0,modal=false;const frames=new Map(),body={},listeners={};
  const env={wheelTarget:null,wheelLastFrame:null,scrollRaf:null,navigationTarget:null,scrollY:0,innerHeight:800,
    reducedMotion:{matches:false,addEventListener(){}},Number,Math,
    document:{body,hidden:false,documentElement:{scrollHeight:5000},querySelector:()=>modal?{}:null,addEventListener(){}},
    window:{matchMedia:()=>({matches:true,addEventListener(){}}),scrollTo:({top})=>env.scrollY=top,
      addEventListener:(n,fn,options)=>listeners[n]={fn,options},removeEventListener:n=>delete listeners[n]},
    requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},getComputedStyle:()=>({overflowY:'visible'}),
    cancelScroll:()=>{if(env.scrollRaf!==null)frames.delete(env.scrollRaf);env.scrollRaf=null;env.wheelTarget=null;env.wheelLastFrame=null;env.navigationTarget=null;}};
  vm.createContext(env);vm.runInContext(source,env);
  return{env,frames,listeners,setModal:()=>modal=true,wheel(delta,extra={}){let prevented=false;env.onWheel({deltaMode:0,deltaY:delta,deltaX:0,target:body,preventDefault:()=>prevented=true,...extra});return prevented;},tick(time){const c=[...frames.values()];frames.clear();c.forEach(fn=>fn(time));}};
}
test('discrete wheel reacts immediately, then settles in a short clamped tail',()=>{
 const h=harness();h.env.document.body.closest=()=>null;
 assert.equal(h.wheel(120),true);assert.ok(h.env.scrollY>0 && h.env.scrollY<120);
 for(let t=0;t<500;t+=16)h.tick(t);
 assert.equal(h.env.scrollY,120);assert.equal(h.frames.size,0);
 h.env.scrollY=4190;h.wheel(120);for(let t=0;t<500;t+=16)h.tick(t);assert.equal(h.env.scrollY,4200);
});
test('fine trackpad, touch-like small deltas, zoom and modal input stay native',()=>{
 const h=harness();h.env.document.body.closest=()=>null;
 assert.equal(h.wheel(4.5),false);assert.equal(h.wheel(120,{ctrlKey:true}),false);
 h.setModal();assert.equal(h.wheel(120),false);assert.equal(h.env.scrollY,0);
});
test('modal opening and reduced motion cancel a pending wheel RAF',()=>{
 const h=harness();h.env.document.body.closest=()=>null;h.wheel(120);const y=h.env.scrollY;h.setModal();h.tick(16);assert.equal(h.frames.size,0);assert.equal(h.env.scrollY,y);
 const k=harness();k.env.document.body.closest=()=>null;k.wheel(120);k.env.reducedMotion.matches=true;k.tick(16);assert.equal(k.frames.size,0);
});
test('reversing wheel direction discards the old momentum target',()=>{
 const h=harness();h.env.document.body.closest=()=>null;h.env.scrollY=1000;h.wheel(120);
 const turningPoint=h.env.scrollY;h.wheel(-120);assert.ok(h.env.scrollY<turningPoint);
 for(let t=0;t<500;t+=16)h.tick(t);assert.ok(h.env.scrollY<1000);assert.equal(h.frames.size,0);
});
