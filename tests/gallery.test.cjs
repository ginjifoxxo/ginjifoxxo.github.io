const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalize, collection, thumbnailSource } = require('../public/gallery.js');
// Metadata-only fixtures; no gallery images are fabricated or committed.
const records = Array.from({length:26},(_,i)=>({src:'assets/gallery/'+(i<18?'art':'fursuit')+'/'+i+'.webp', category:i<18?'art':'fursuit',alt:'',width:1200,height:i%2?1600:800,...(i<5?{featuredOrder:i+1}:{}),...(i>=5&&i<10?{categoryPreviewOrder:i-4}:{}),...(i>=18&&i<23?{categoryPreviewOrder:i-17}:{})}));
test('filters give five previews with correct continuation counts',()=>{
  const items=normalize(records);for(const [filter,total,remaining] of [['all',26,21],['art',18,13],['fursuit',8,3]]){
    const group=collection(items,filter);assert.equal(group.items.length,total);assert.equal(group.preview.length,5);assert.equal(group.remaining,remaining);
  }
  assert.equal(collection(items.slice(0,4),'all').remaining,0);assert.equal(collection([],'all').remaining,0);
});
test('categories must match explicit folder; no invented alt or external source accepted',()=>{
  assert.equal(normalize([...records,records[0],{src:'https://external/a.png',category:'art',alt:''},{src:'assets/gallery/art/../x.png',category:'art',alt:''},{src:'assets/gallery/art/x.png',category:'fursuit',alt:''},{src:'assets/gallery/art/x.png',category:'art'}]).length,26);
  assert.throws(()=>normalize({}));assert.equal(normalize([]).length,0);
});
test('natural dimensions survive filtering and preview selection',()=>{
  const item=collection(normalize(records),'art').preview[1];assert.equal(item.width,records[6].width);assert.equal(item.height,records[6].height);
});
test('published gallery records point to real supplied files with valid dimensions and descriptions',()=>{
  const fs=require('node:fs'),path=require('node:path');
  const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../public/data/gallery.json'),'utf8'));
  assert.equal(normalize(data).length,data.length);
  for(const item of data){
    assert.ok(fs.existsSync(path.join(__dirname,'../public',item.src)),item.src);
    assert.ok(Number.isInteger(item.width)&&item.width>0);
    assert.ok(Number.isInteger(item.height)&&item.height>0);
    assert.ok(item.alt.trim().length>0);
  }
});
test('All preview follows the exact curated five while full collection remains complete and ordered',()=>{
  const data=require('../public/data/gallery.json');
  const expected=['assets/gallery/fursuit/f444739072.jpg','assets/gallery/art/1D0B7C4632D45BF540CB873C7D2F38CA.png','assets/gallery/fursuit/1-10.jpg','assets/gallery/art/2025-04-23-19-28-25-019.jpg','assets/gallery/art/98270F26C29495430D81591E6AB18146.png'];
  assert.deepEqual(collection(data,'all').preview.map(i=>i.src),expected);
  assert.deepEqual(collection(data,'all').items,data);
  assert.deepEqual(collection([...data,{src:'assets/gallery/art/later.webp',category:'art'}],'all').preview.map(i=>i.src),expected);
  for(const category of ['art','fursuit']) { const preview=collection(data,category).preview;assert.equal(preview.length,5);assert.ok(preview.every(i=>i.category===category&&!expected.includes(i.src))); }
  assert.deepEqual(data.filter(i=>i.featuredOrder).map(i=>i.featuredOrder).sort(),[1,2,3,4,5]);
});
test('a missing featured record is not replaced by an arbitrary image',()=>{
  const data=require('../public/data/gallery.json');const subset=data.filter(i=>i.featuredOrder!==3);
  assert.equal(collection(subset,'all').preview.length,4);
});

test('curated previews and four mini images are deterministic, disjoint, and leave full categories complete',()=>{
 const data=require('../public/data/gallery.json');
 for(const filter of ['all','art','fursuit']) {
  const group=collection(data,filter),srcs=group.preview.map(i=>i.src),more=group.more.map(i=>i.src);
  assert.equal(srcs.length,5);assert.equal(more.length,4);assert.equal(new Set([...srcs,...more]).size,9);
  assert.deepEqual(group,collection(data,filter));
  assert.ok(group.more.every(i=>filter==='all'||i.category===filter));
  assert.deepEqual(group.items,filter==='all'?data:data.filter(i=>i.category===filter));
  for(const item of [...group.preview,...group.more]) if(item.previewPosition)assert.match(item.previewPosition,/^\d{1,3}% \d{1,3}%$/);
 }
});

test('thumbnail selection uses derivatives and real dimensions, with safe small/medium/original fallbacks',()=>{
 const original={src:'assets/gallery/art/source.png',category:'art',width:2400,height:1600};
 const medium={...original,previewSrc:'assets/gallery/previews/art/source.webp',previewWidth:1200,previewHeight:800};
 const small={...medium,smallPreviewSrc:'assets/gallery/previews-small/art/source.webp',smallPreviewWidth:600,smallPreviewHeight:400};
 assert.deepEqual(thumbnailSource(small),{src:medium.previewSrc,width:1200,height:800});
 assert.deepEqual(thumbnailSource(small,true),{src:small.smallPreviewSrc,width:600,height:400});
 assert.deepEqual(thumbnailSource(medium,true),thumbnailSource(medium));
 assert.deepEqual(thumbnailSource(original,true),{src:original.src,width:2400,height:1600});
 for(const path of ['https://other/x.webp','assets/gallery/previews/fursuit/x.webp','assets/gallery/previews/art/../x.webp'])
  assert.equal(thumbnailSource({...medium,previewSrc:path}).src,original.src);
});

test('all committed derivatives exist and each filter stays below 2 MB without loading originals',()=>{
 const fs=require('node:fs'),path=require('node:path'),data=require('../public/data/gallery.json');
 const paths=new Set();
 for(const item of data)for(const small of [false,true]){
  const thumb=thumbnailSource(item,small);assert.notEqual(thumb.src,item.src);assert.ok(!paths.has(thumb.src));paths.add(thumb.src);
  assert.ok(thumb.width>0&&thumb.height>0&&Math.max(thumb.width,thumb.height)<=(small?600:1200));
  assert.ok(fs.statSync(path.join(__dirname,'../public',thumb.src)).size>0);
 }
 for(const filter of ['all','art','fursuit']){
  const group=collection(data,filter),sources=[...group.preview.map(i=>thumbnailSource(i).src),...group.more.map(i=>thumbnailSource(i,true).src)];
  assert.ok(sources.reduce((sum,src)=>sum+fs.statSync(path.join(__dirname,'../public',src)).size,0)<2000000);
 }
});

test('rendering stays lazy; failed small images fall back once per source and dialog/lightbox release DOM',async()=>{
 const vm=require('node:vm'),fs=require('node:fs');
 function element(){return {children:[],dataset:{},style:{},events:{},classList:{toggle(){}},
  append(...nodes){this.children.push(...nodes);},replaceChildren(...nodes){this.children=nodes;},
  setAttribute(n,v){this[n]=v;},removeAttribute(n){delete this[n];},
  addEventListener(n,fn){this.events[n]=fn;},querySelectorAll(){return [];},focus(){},
  showModal(){this.open=true;},close(){this.open=false;this.events.close?.();}};}
 const preview=element(),full=element(),image=element(),dialog=element(),lightbox=element(),filters=element(),empty=element();
 const closeDialog=element(),closeImage=element();dialog.querySelector=()=>closeDialog;
 lightbox.querySelector=s=>s==='img'?image:closeImage;
 const ids={'gallery-preview':preview,'gallery-full':full,'gallery-dialog':dialog,'gallery-lightbox':lightbox};
 const env={module:{exports:{}},document:{getElementById:id=>ids[id],createElement:element,
  querySelector:s=>s==='.gallery-filters'?filters:empty,querySelectorAll:()=>[]},
  matchMedia:()=>({matches:false,addEventListener(){}}),fetch:async()=>({ok:true,json:async()=>require('../public/data/gallery.json')})};
 vm.createContext(env);vm.runInContext(fs.readFileSync('public/gallery.js','utf8'),env);
 env.module.exports.init({getLanguage:()=> 'vi'});for(let i=0;i<8;i++)await Promise.resolve();
 assert.equal(full.children.length,0);assert.equal(preview.children.length,6);
 const main=preview.children[0].children[0];assert.match(main.src,/\/previews\//);
 assert.equal(main.loading,'lazy');assert.equal(main.decoding,'async');assert.equal(main.fetchPriority,'low');
 const more=preview.children[5],mini=more.children[0].children[0];assert.match(mini.src,/\/previews-small\//);
 mini.events.error();assert.match(mini.src,/\/previews\//);
 mini.events.error();assert.doesNotMatch(mini.src,/\/previews/);const original=mini.src;
 mini.events.error();assert.equal(mini.src,original);
 more.events.click();assert.equal(full.children.length,40);assert.ok(full.children.every(b=>b.children[0].src.includes('/previews/')));
 full.children[0].events.click();assert.equal(image.src,require('../public/data/gallery.json')[0].src);
 closeImage.events.click();assert.equal(image.src,undefined);
 closeDialog.events.click();assert.equal(full.children.length,0);
});
