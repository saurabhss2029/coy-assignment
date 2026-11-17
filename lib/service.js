// Pure business logic. No I/O, so it is unit-testable and the privacy rules live in ONE place.

/** Strip server-only fields. `likesMe` must never leave the server. */
function toPublic(profile) {
  const { likesMe, ...rest } = profile; // eslint-disable-line no-unused-vars
  return rest;
}

/** Profiles the user has not swiped on. Order is by id and independent of `likesMe`,
 *  so feed position can never leak who already liked you. */
function getFeed(db) {
  return db.profiles.filter((p) => !(p.id in db.swipes)).map(toPublic);
}

function getMatches(db) {
  return db.matches
    .map((m) => {
      const p = db.profiles.find((x) => x.id === m.profileId);
      return p ? { ...toPublic(p), matchedAt: m.matchedAt } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.matchedAt.localeCompare(a.matchedAt));
}

/** Mutates `db`. Returns { status, body, changed }.
 *  The response for a non-mutual like is byte-identical to a pass: no signal about who liked you. */
function applySwipe(db, profileId, direction, now = new Date()) {
  const id = Number(profileId);
  if (!Number.isInteger(id) || !["like", "pass"].includes(direction)) {
    return { status: 400, changed: false, body: { error: "profileId (integer) and direction ('like' | 'pass') are required" } };
  }
  const profile = db.profiles.find((p) => p.id === id);
  if (!profile) return { status: 404, changed: false, body: { error: "Profile not found" } };

  // Idempotent: first swipe wins, so replays/double-taps can't flip a pass into a like.
  if (id in db.swipes) return { status: 200, changed: false, body: { match: false, alreadySwiped: true } };

  db.swipes[id] = direction;
  const isMatch = direction === "like" && profile.likesMe === true;
  if (isMatch) db.matches.push({ profileId: id, matchedAt: now.toISOString() });

  return { status: 200, changed: true, body: isMatch ? { match: true, profile: toPublic(profile) } : { match: false } };
}

module.exports = { toPublic, getFeed, getMatches, applySwipe };
