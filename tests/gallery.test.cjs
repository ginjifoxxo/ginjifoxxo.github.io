const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalize, collection } = require('../public/gallery.js');
// Metadata-only fixtures; no gallery images are fabricated or committed.
const records = Array.from({length:26},(_,i)=>({src:'assets/gallery/'+(i<18?'art':'fursuit')+'/'+i+'.webp', category:i<18?'art':'fursuit',alt:'',width:1200,height:i%2?1600:800}));
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
  const item=collection(normalize(records),'art').preview[1];assert.equal(item.width,1200);assert.equal(item.height,1600);
});
