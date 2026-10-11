/**
 * Sync data/reviews.json (local/admin fallback store) from the catalog seed.
 * Run: node scripts/sync-reviews-json.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const { SEED_REVIEWS } = await import("../src/lib/catalog.ts");

const seeded = SEED_REVIEWS.filter((r) => r.published).map((r, i) => ({
  ...r,
  id: `seed-${i}`,
}));

const out = path.join(process.cwd(), "data", "reviews.json");
await fs.writeFile(out, JSON.stringify(seeded, null, 2) + "\n", "utf8");

const total = seeded.reduce((sum, r) => sum + r.rating, 0);
const avg = Math.round((total / seeded.length) * 10) / 10;
const byStars = [5, 4, 3, 2, 1]
  .map((s) => `${s}★=${seeded.filter((r) => r.rating === s).length}`)
  .join("  ");
console.log(`wrote ${seeded.length} reviews -> data/reviews.json   avg=${avg}  ${byStars}`);
