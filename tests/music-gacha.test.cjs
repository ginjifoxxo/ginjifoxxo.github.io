const { test } = require('node:test');
const assert = require('node:assert/strict');
const picker = require('../public/music-gacha.js');
const data = require('../public/data/music.json');

test('uniform picker gives every track the same interval regardless of legacy rarity', () => {
  const tracks = data.tracks;
  const counts = new Map(tracks.map(track => [track.id, 0]));
  for (let i = 0; i < tracks.length * 10; i++) {
    const track = picker.pickTrack(tracks, null, () => (i + .5) / (tracks.length * 10));
    counts.set(track.id, counts.get(track.id) + 1);
  }
  assert.ok([...counts.values()].every(count => count === 10));
});
test('empty/single track work and previous track is the only excluded candidate', () => {
  assert.equal(picker.pickTrack([], null), null);
  assert.equal(picker.pickTrack([data.tracks[0]], data.tracks[0].id, () => .5), data.tracks[0]);
  const previous = data.tracks[1].id;
  const selected = new Set();
  for (let i = 0; i < data.tracks.length - 1; i++) selected.add(picker.pickTrack(data.tracks, previous, () => (i + .5) / (data.tracks.length - 1)).id);
  assert.equal(selected.size, data.tracks.length - 1);
  assert.equal(selected.has(previous), false);
});
test('reel remains bounded and places winner at its intended stop', () => {
  const winner = data.tracks[0];
  const reel = picker.buildReel(data.tracks, winner, () => .5);
  assert.equal(reel.cards.length, 21);
  assert.equal(reel.cards[reel.winnerIndex], winner);
});
test('imported tracks are unique, preserve source titles and real video URLs', () => {
  assert.equal(new Set(data.tracks.map(track => track.id)).size, data.tracks.length);
  for (const track of data.tracks) {
    assert.match(track.id, /^[\w-]{11}$/);
    assert.ok(track.rawTitle);
    assert.equal(track.youtubeUrl, 'https://www.youtube.com/watch?v=' + track.id);
    assert.ok(['common', 'rare', 'legendary', 'epic'].includes(track.rarity));
    assert.deepEqual(track.tags, []);
  }
});

test('duration has exactly 21 uniformly distributed integer steps from 7000 to 9000', () => {
  const counts = new Map();
  for (let i = 0; i < 210; i++) {
    const duration = picker.pickDuration(() => (i + .5) / 210);
    counts.set(duration, (counts.get(duration) || 0) + 1);
  }
  assert.deepEqual([...counts.keys()], Array.from({ length: 21 }, (_, i) => 7000 + i * 100));
  assert.ok([...counts.values()].every(count => count === 10));
});

test('landing point is independent and uniform within the inner 10–90 percent', () => {
  const fractions = [0, .125, .5, .875, 1 - Number.EPSILON].map(n => picker.pickLandingFraction(() => n));
  assert.ok(fractions.every(n => n >= .1 && n <= .9));
  assert.equal(fractions[0], .1);
  assert.equal(fractions[2], .5);
  assert.ok(new Set(fractions).size === fractions.length);
  const viewport = { clientWidth: 340 }, card = { offsetLeft: 1800, offsetWidth: 126 };
  for (const fraction of fractions) {
    const translate = picker.getLandingTranslate(viewport, card, fraction);
    const markerWithinCard = viewport.clientWidth / 2 - translate - card.offsetLeft;
    assert.ok(Math.abs(markerWithinCard / card.offsetWidth - fraction) < 1e-12);
  }
});
test('YouTube mobile uses HTTPS same-context app links, desktop retains web tab', () => {
  for (const info of [{ userAgent: 'Android' }, { userAgent: 'iPhone' }, { userAgent: 'iPad' },
    { platform: 'MacIntel', maxTouchPoints: 5 }, { userAgentData: { mobile: true } }])
    assert.equal(picker.youtubeTarget(info), '_self');
  assert.equal(picker.youtubeTarget({ userAgent: 'Windows Chrome' }), '_blank');
});
