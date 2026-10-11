/** One-off: inspect the Atlas reviews + blog author state before seeding. */
import { promises as fs } from "node:fs";
import path from "node:path";

const raw = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const { default: mongoose } = await import("mongoose");
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");
await mongoose.connect(uri);
const db = mongoose.connection.db;
if (!db) throw new Error("Mongo connection has no database");

const collections = await db.listCollections().toArray();
console.log("collections:", collections.map((c) => c.name).join(", "));

const reviews = await db.collection("reviews").find({}).toArray();
console.log(`\nreviews (${reviews.length}):`);
for (const r of reviews) {
  console.log(`  ${r._id}  ${r.rating}★  published=${r.published}  ${r.name}  "${(r.title ?? "").slice(0, 40)}"`);
}

const posts = await db.collection("blogposts").find({}, { projection: { title: 1, author: 1, slug: 1 } }).toArray();
console.log(`\nblogposts (${posts.length}):`);
for (const p of posts) console.log(`  ${p.author}  —  ${(p.title ?? "").slice(0, 55)}`);

await mongoose.disconnect();
