const test = require("node:test");
const assert = require("node:assert/strict");
const { buildSeed } = require("../lib/seed");
const { getFeed, getMatches, applySwipe } = require("../lib/service");

const liker = (db) => db.profiles.find((p) => p.likesMe).id;
const nonLiker = (db) => db.profiles.find((p) => !p.likesMe).id;

test("seed has 30+ complete profiles, some of whom already liked the user", () => {
  const db = buildSeed();
  assert.ok(db.profiles.length >= 30);
  assert.ok(db.profiles.some((p) => p.likesMe));
  for (const p of db.profiles) {
    for (const k of ["name", "age", "photo", "bio", "place", "interests"]) assert.ok(p[k], `${p.name} missing ${k}`);
  }
});

test("feed never exposes likesMe", () => {
  const feed = getFeed(buildSeed());
  assert.ok(feed.every((p) => !("likesMe" in p)));
});

test("mutual like creates a match and returns the profile without likesMe", () => {
  const db = buildSeed();
  const r = applySwipe(db, liker(db), "like");
  assert.equal(r.body.match, true);
  assert.ok(!("likesMe" in r.body.profile));
  assert.equal(getMatches(db).length, 1);
});

test("one-sided like does not match and is indistinguishable from a pass", () => {
  const db = buildSeed();
  const a = applySwipe(db, nonLiker(db), "like");
  const b = applySwipe(db, db.profiles.filter((p) => !p.likesMe)[1].id, "pass");
  assert.deepEqual(a.body, { match: false });
  assert.deepEqual(b.body, { match: false });
  assert.equal(getMatches(db).length, 0);
});

test("passing someone who liked you never creates a match", () => {
  const db = buildSeed();
  const r = applySwipe(db, liker(db), "pass");
  assert.deepEqual(r.body, { match: false });
  assert.equal(getMatches(db).length, 0);
});

test("a swiped profile never reappears in the feed", () => {
  const db = buildSeed();
  const id = nonLiker(db);
  applySwipe(db, id, "pass");
  assert.ok(!getFeed(db).some((p) => p.id === id));
});

test("swiping is idempotent: a pass cannot be flipped into a like", () => {
  const db = buildSeed();
  const id = liker(db);
  applySwipe(db, id, "pass");
  const again = applySwipe(db, id, "like");
  assert.equal(again.body.match, false);
  assert.equal(again.changed, false);
  assert.equal(getMatches(db).length, 0);
});

test("validates input", () => {
  const db = buildSeed();
  assert.equal(applySwipe(db, "abc", "like").status, 400);
  assert.equal(applySwipe(db, 1, "superlike").status, 400);
  assert.equal(applySwipe(db, 9999, "like").status, 404);
});

test("feed empties after swiping everyone", () => {
  const db = buildSeed();
  db.profiles.forEach((p) => applySwipe(db, p.id, "pass"));
  assert.equal(getFeed(db).length, 0);
});
