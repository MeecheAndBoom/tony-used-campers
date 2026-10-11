/**
 * Seeds the 30 catalog reviews into Atlas (published) and points every blog
 * post byline at Tony Marchetti. Idempotent: re-runs replace only the docs
 * this script previously inserted (marker field `seed: "catalog-30-v1"`).
 *
 * Run: node scripts/seed-reviews-atlas.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const raw = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { SEED_REVIEWS } = await import("../src/lib/catalog.ts");
const { default: mongoose } = await import("mongoose");
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");
await mongoose.connect(uri);
const db = mongoose.connection.db;
if (!db) throw new Error("Mongo connection has no database");

// ── reviews ────────────────────────────────────────────────────────────────
const MARKER = "catalog-30-v1";
const docs = SEED_REVIEWS.filter((r) => r.published).map((r) => ({
  name: r.name,
  city: r.city,
  rating: r.rating,
  title: r.title,
  body: r.body,
  purchased: r.purchased,
  published: true,
  createdAt: new Date(r.date),
  updatedAt: new Date(r.date),
  seed: MARKER,
}));

const removed = await db.collection("reviews").deleteMany({ seed: MARKER });
const res = await db.collection("reviews").insertMany(docs);
const total = await db.collection("reviews").countDocuments();

const sum = docs.reduce((s, r) => s + r.rating, 0);
console.log(
  `reviews: removed ${removed.deletedCount} old seeded, inserted ${res.insertedCount}, total now ${total}  avg=${(sum / docs.length).toFixed(2)}`,
);

// ── blog authors ───────────────────────────────────────────────────────────
const authors = await db
  .collection("blogposts")
  .distinct("author");
const upd = await db
  .collection("blogposts")
  .updateMany({}, { $set: { author: "Tony Marchetti" } });
console.log(`blogposts: authors were [${authors.join(", ")}] -> ${upd.modifiedCount} set to "Tony Marchetti"`);

await mongoose.disconnect();
