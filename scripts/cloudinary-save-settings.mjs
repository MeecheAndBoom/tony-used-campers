/**
 * Saves the CLOUDINARY_* credentials from .env.local into the admin Settings
 * document so dashboard image uploads work on the deployed site without
 * touching Vercel environment variables.
 *
 *   node scripts/cloudinary-save-settings.mjs
 *
 * Safe to re-run. At runtime environment variables always win, so this only
 * fills the fallback storage used while those are unset.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const ROOT = process.cwd();

async function loadEnvLocal() {
  const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = await loadEnvLocal();
const { MONGODB_URI, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;

if (!MONGODB_URI || !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error("Missing MONGODB_URI or CLOUDINARY_* values in .env.local");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

const result = await mongoose.connection.collection("settingsstores").updateOne(
  { key: "main" },
  {
    $set: {
      cloudinary: {
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
        apiSecret: CLOUDINARY_API_SECRET,
      },
    },
  },
  { upsert: true },
);

console.log(
  `Saved Cloudinary credentials in settings (${result.matchedCount ? "updated" : "created"} the settings doc).`,
);
await mongoose.disconnect();