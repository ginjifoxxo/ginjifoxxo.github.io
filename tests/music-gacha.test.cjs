const { test } = require('node:test');
const assert = require('node:assert/strict');
const picker = require('../public/music-gacha.js');
const data = require('../public/data/music.json');

test('rarity boundaries match 50/28/16/6 percentages', () => {
  const counts = { common: 0, rare: 0, legendary: 0, epic: 0 };
  for (let i = 0; i < 10000; i++) counts[picker.pickRarity(() => (i + .5) / 10000)]++;
  assert.deepEqual(counts, { common: 5000, rare: 2800, legendary: 1600, epic: 600 });
});
test('empty pools fall back, one track works, and immediate repeats are excluded', () => {
  assert.equal(picker.pickTrack([], null), null);
  const only = [data.tracks[0]];
  assert.equal(picker.pickTrack(only, only[0].id, () => .99), only[0]);
  let previous = null;
  for (let i = 0; i < 500; i++) {
    const track = picker.pickTrack(data.tracks, previous, () => (i % 97) / 97);
    assert.ok(track); assert.notEqual(track.id, previous); previous = track.id;
  }
  const common = data.tracks.filter(track => track.rarity === 'common').slice(0, 2);
  assert.ok(common.includes(picker.pickTrack(common, null, () => .99)));
});
test('reel remains bounded and places winner at its intended stop', () => {
  const winner = data.tracks[0];
  const reel = picker.buildReel(data.tracks, winner, () => .5);
  assert.equal(reel.cards.length, 21);
  assert.equal(reel.cards[reel.winnerIndex], winner);
});
test('collection counts a discovery once', () => {
  const collection = new Set();
  assert.equal(picker.markDiscovered(collection, data.tracks[0].id), true);
  assert.equal(picker.markDiscovered(collection, data.tracks[0].id), false);
  assert.equal(collection.size, 1);
});
test('imported tracks are unique, preserve source titles and real video URLs', () => {
  assert.equal(new Set(data.tracks.map(track => track.id)).size, data.tracks.length);
  for (const track of data.tracks) {
    assert.match(track.id, /^[\w-]{11}$/);
    assert.ok(track.rawTitle);
    assert.equal(track.youtubeUrl, 'https://www.youtube.com/watch?v=' + track.id);
    assert.ok(Object.hasOwn(picker.weights, track.rarity));
    assert.deepEqual(track.tags, []);
  }
});
