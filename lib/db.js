import fs from "fs";
import path from "path";
import { buildSeed } from "./seed";

// Vercel's filesystem is read-only except /tmp (data there is ephemeral: fine for a demo).
const DIR = process.env.DATA_DIR || (process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data"));
const FILE = path.join(DIR, "db.json");

export function writeDb(db) {
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, FILE); // atomic replace: no half-written file on crash
}

export function readDb() {
  if (!fs.existsSync(FILE)) {
    const seed = buildSeed();
    writeDb(seed);
    return seed;
  }
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}

// Serialises read-modify-write so two concurrent swipes can't clobber each other.
let chain = Promise.resolve();
export function withDb(fn) {
  const run = chain.then(() => {
    const db = readDb();
    const out = fn(db);
    if (out.changed) writeDb(db);
    return out;
  });
  chain = run.catch(() => {});
  return run;
}
