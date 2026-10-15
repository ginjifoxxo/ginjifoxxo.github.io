const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalize, collection } = require('../public/gallery.js');
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
