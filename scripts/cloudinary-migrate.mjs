/**
 * Migrates every content asset in public/ to Cloudinary and rewrites the
 * app to fetch from there.
 *
 *   node scripts/cloudinary-migrate.mjs upload  [--limit N]   upload files -> scripts/cloudinary-map.json
 *   node scripts/cloudinary-migrate.mjs rewrite               apply map to src/** and data/*.json
 *   node scripts/cloudinary-migrate.mjs db                    apply map to every MongoDB string value
 *   node scripts/cloudinary-migrate.mjs db-audit              report docs still referencing local assets
 *   node scripts/cloudinary-migrate.mjs verify                range-GET check every Cloudinary URL
 *   node scripts/cloudinary-migrate.mjs destroy <id> [kind]   remove one asset
 *
 * Credentials come from .env.local (CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET).
 * public_id is derived from the local path (tuc/<path>), so runs are idempotent:
 * existing assets are skipped unless FORCE=1.
 */
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const MAP_FILE = path.join(ROOT, "scripts", "cloudinary-map.json");
const ID_PREFIX = "tuc";
/** Cloudinary transformation applied to the hero video only. */
const VIDEO_TRANSFORMATION = "q_auto,w_1280,c_limit";

// ── env ─────────────────────────────────────────────────────────────────────

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

// ── asset inventory ─────────────────────────────────────────────────────────

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** All content images plus the logo and OG image. The hero video intentionally
 *  stays in public/video (static asset, never changes). Browser chrome
 *  (favicons, manifest icons) also stays local. */
async function collectAssets() {
  const files = [];
  files.push(...(await walk(path.join(PUBLIC_DIR, "images"))));
  for (const name of ["tony-campers-logo.png", "tony-campers-og.png"]) {
    files.push(path.join(PUBLIC_DIR, name));
  }
  const ASSET_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
  return files
    .filter((abs) => ASSET_EXT.test(abs))
    .map((abs) => ({
      abs,
      /** e.g. /images/carav-cat/Travel Trailer.png */
      local: "/" + path.relative(PUBLIC_DIR, abs).split(path.sep).join("/"),
    }));
}

const isVideo = (local) => local.endsWith(".mp4");

function publicIdFor(local) {
  // Extension-free public_id — Cloudinary re-attaches the stored format on delivery.
  return `${ID_PREFIX}${local.replace(/\.[a-z0-9]+$/i, "").replace(/\s+/g, "_")}`;
}

function urlFor(local, cloud) {
  const kind = isVideo(local) ? "video" : "image";
  const transform = isVideo(local) ? `${VIDEO_TRANSFORMATION}/` : "";
  const ext = local.slice(local.lastIndexOf("."));
  return `https://res.cloudinary.com/${cloud}/${kind}/upload/${transform}${publicIdFor(local)}${ext}`;
}

// ── upload ──────────────────────────────────────────────────────────────────

function signedParams(params, secret) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + secret).digest("hex");
}

/** Ranged-GET existence check — Cloudinary free tier rate-limits rapid HEADs (420). */
async function head(url, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: { Range: "0-0" } });
      if (res.ok) return true;
      if (res.status === 404) return false;
      await new Promise((r) => setTimeout(r, 1500 * i));
    } catch {
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
  return false;
}

async function uploadOne(asset, env, cloud, attempts = 3) {
  const url = urlFor(asset.local, cloud);
  if (process.env.FORCE !== "1" && (await head(url))) return { ...asset, url, skipped: true };

  const kind = isVideo(asset.local) ? "video" : "image";
  const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/${kind}/upload`;
  const ts = Math.floor(Date.now() / 1000);
  const params = { overwrite: "true", public_id: publicIdFor(asset.local), timestamp: String(ts) };
  const signature = signedParams(params, env.CLOUDINARY_API_SECRET);

  const bytes = await fs.readFile(asset.abs);
  const body = new FormData();
  body.set("file", new Blob([bytes]), path.basename(asset.local));
  body.set("api_key", env.CLOUDINARY_API_KEY);
  body.set("signature", signature);
  for (const [k, v] of Object.entries(params)) body.set(k, v);

  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(endpoint, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
      if (process.env.DEBUG === "1") console.log(`  uploaded: public_id=${json.public_id} url=${json.secure_url}`);
      return { ...asset, url, id: json.public_id };
    } catch (err) {
      if (i === attempts) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

async function cmdUpload(limit) {
  const env = await loadEnvLocal();
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const secret = env.CLOUDINARY_API_SECRET;
  if (!cloud || !apiKey || !secret) throw new Error("Missing CLOUDINARY_* vars in .env.local");

  const assets = (await collectAssets()).sort((a, b) => a.local.localeCompare(b.local));
  const todo = limit ? assets.slice(0, limit) : assets;
  console.log(`cloud=${cloud}  assets=${assets.length}  this run=${todo.length}`);

  const map = {};
  let done = 0;
  let failed = 0;
  const queue = [...todo];
  async function worker() {
    while (queue.length) {
      const asset = queue.shift();
      try {
        const r = await uploadOne(asset, env, cloud);
        map[asset.local] = r.url;
        done++;
        if (done % 25 === 0) console.log(`  ${done}/${todo.length}`);
      } catch (err) {
        failed++;
        console.error(`  FAIL ${asset.local}: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`uploaded/skipped=${done} failed=${failed}`);

  // merge with any previous map so partial runs stay useful
  let previous = {};
  try {
    previous = JSON.parse(await fs.readFile(MAP_FILE, "utf8"));
  } catch {}
  await fs.writeFile(MAP_FILE, JSON.stringify({ ...previous, ...map }, null, 1), "utf8");
  console.log(`map written: ${MAP_FILE}`);
  if (failed) process.exitCode = 1;
}

// ── rewrite source + data files ─────────────────────────────────────────────

async function cmdRewrite() {
  const map = JSON.parse(await fs.readFile(MAP_FILE, "utf8"));
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);

  const targets = [
    ...(await walk(path.join(ROOT, "src"))).filter((f) => /\.(ts|tsx)$/.test(f)),
    ...(await walk(path.join(ROOT, "data"))).filter((f) => f.endsWith(".json")),
  ];

  let changed = 0;
  for (const file of targets) {
    let text = await fs.readFile(file, "utf8");
    const before = text;
    // template-literal wrappers first (e.g. `${siteUrl}/tony-campers-logo.png`)
    text = text.replace(/\$\{[^}]+\}(\/tony-campers-[a-z0-9-]+\.(?:png|jpg))/gi, (m, p) =>
      map[p] && !map[p].includes(m) ? map[p] : m,
    );
    for (const key of keys) {
      // (?<!tuc) guards against re-replacing keys inside already-converted
      // Cloudinary URLs (.../upload/tuc/images/...), keeping runs idempotent.
      const pattern = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      text = text.replace(new RegExp(`(?<!tuc)${pattern}`, "g"), map[key]);
    }
    if (text !== before) {
      await fs.writeFile(file, text, "utf8");
      changed++;
    }
  }
  console.log(`rewrote ${changed} files`);

  // leftover audit — anything still pointing at local assets
  const leftovers = [];
  for (const file of targets) {
    const text = await fs.readFile(file, "utf8");
    for (const m of text.matchAll(/["'(](\/(?:images|video)\/[^"')]+|\/tony-campers-[a-z0-9-]+\.(?:png|jpg))/g)) {
      leftovers.push(`${path.relative(ROOT, file)}: ${m[1]}`);
    }
  }
  if (leftovers.length) {
    console.error("LEFTOVER local asset refs:");
    for (const l of [...new Set(leftovers)]) console.error("  " + l);
    process.exitCode = 1;
  } else {
    console.log("no leftover local asset references");
  }
}

// ── database ────────────────────────────────────────────────────────────────

async function cmdDb() {
  const env = await loadEnvLocal();
  const map = JSON.parse(await fs.readFile(MAP_FILE, "utf8"));
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);

  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db();
    const collections = (await db.listCollections().toArray()).map((c) => c.name);
    let total = 0;
    for (const name of collections) {
      const col = db.collection(name);
      const docs = await col.find({}).toArray();
      for (const doc of docs) {
        const set = {};
        const walkValues = (value, keyPath) => {
          if (typeof value === "string") {
            let next = value;
            for (const key of keys) {
              if (next === key) { next = map[key]; break; }
              if (next.startsWith(key + "/") || next.startsWith(key + " ")) {
                next = map[key] + next.slice(key.length);
                break;
              }
            }
            if (next !== value) set[keyPath] = next;
          } else if (Array.isArray(value)) {
            value.forEach((v, i) => walkValues(v, `${keyPath}.${i}`));
          } else if (value && typeof value === "object" && !(value instanceof Date)) {
            for (const [k, v] of Object.entries(value)) walkValues(v, `${keyPath}.${k}`);
          }
        };
        for (const [k, v] of Object.entries(doc)) if (k !== "_id") walkValues(v, k);
        if (Object.keys(set).length) {
          await col.updateOne({ _id: doc._id }, { $set: set });
          total += Object.keys(set).length;
        }
      }
    }
    console.log(`db updated: ${total} field(s) across ${collections.length} collection(s)`);
  } finally {
    await client.close();
  }
}

// ── verify ──────────────────────────────────────────────────────────────────

async function cmdVerify() {
  const map = JSON.parse(await fs.readFile(MAP_FILE, "utf8"));
  const entries = Object.entries(map);
  let ok = 0;
  const bad = [];
  const queue = [...entries];
  async function worker() {
    while (queue.length) {
      const [local, url] = queue.shift();
      if (await head(url)) ok++;
      else bad.push(`${local} -> ${url}`);
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log(`verified ${ok}/${entries.length} URLs`);
  if (bad.length) {
    console.error("FAILED urls:");
    for (const b of bad) console.error("  " + b);
    process.exitCode = 1;
  }
}

// ── cleanup ─────────────────────────────────────────────────────────────────

/** One-off asset removal: node scripts/cloudinary-migrate.mjs destroy <public_id> [image|video] */
async function cmdDestroy(publicId, kind = "image") {
  const env = await loadEnvLocal();
  const cloud = env.CLOUDINARY_CLOUD_NAME;
  const ts = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp: String(ts) };
  const signature = signedParams(params, env.CLOUDINARY_API_SECRET);
  const body = new FormData();
  body.set("api_key", env.CLOUDINARY_API_KEY);
  body.set("signature", signature);
  for (const [k, v] of Object.entries(params)) body.set(k, v);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/${kind}/destroy`, { method: "POST", body });
  console.log(`destroy ${publicId}: HTTP ${res.status} ${await res.text()}`);
}

// ── db audit ────────────────────────────────────────────────────────────────

/** Reports any Mongo string value still pointing at a local /images|/video path. */
async function cmdDbAudit() {
  const env = await loadEnvLocal();
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db();
    let flagged = 0;
    for (const { name } of await db.listCollections().toArray()) {
      for (const doc of await db.collection(name).find({}).toArray()) {
        const hits = [];
        const scan = (value, keyPath) => {
          if (typeof value === "string") {
            if (/^\/(images|video)\//.test(value) || /^\/tony-campers-/.test(value)) hits.push(keyPath);
          } else if (Array.isArray(value)) value.forEach((v, i) => scan(v, `${keyPath}.${i}`));
          else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) scan(v, `${keyPath}.${k}`);
        };
        for (const [k, v] of Object.entries(doc)) if (k !== "_id") scan(v, k);
        if (hits.length) {
          flagged++;
          console.error(`${name} ${doc._id}: ${hits.join(", ")}`);
        }
      }
    }
    console.log(flagged ? `${flagged} doc(s) still reference local assets` : "db clean — no local asset references");
    if (flagged) process.exitCode = 1;
  } finally {
    await client.close();
  }
}

// ── cli ─────────────────────────────────────────────────────────────────────

const [, , cmd, ...rest] = process.argv;
const limitIdx = rest.indexOf("--limit");
const limit = limitIdx >= 0 ? Number(rest[limitIdx + 1]) : 0;

if (cmd === "upload") await cmdUpload(limit);
else if (cmd === "rewrite") await cmdRewrite();
else if (cmd === "db") await cmdDb();
else if (cmd === "db-audit") await cmdDbAudit();
else if (cmd === "verify") await cmdVerify();
else if (cmd === "destroy") await cmdDestroy(rest[0], rest[1] ?? "image");
else {
  console.log("usage: node scripts/cloudinary-migrate.mjs <upload|rewrite|db|db-audit|verify|destroy> [--limit N]");
  process.exitCode = 1;
}
