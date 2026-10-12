/**
 * Moves every asset from one Cloudinary account to another (cloud → cloud).
 * Delivery URLs embed the cloud name, so public_id is preserved and the only
 * difference afterwards is the cloud name in the URL.
 *
 *   node scripts/cloudinary-account-migrate.mjs inventory   old account -> scripts/cloudinary-inventory.json
 *   node scripts/cloudinary-account-migrate.mjs copy        fetch each old asset into the new account
 *   node scripts/cloudinary-account-migrate.mjs rewrite     swap old cloud name for new in src/** and data/*.json
 *   node scripts/cloudinary-account-migrate.mjs db          swap old cloud name for new in every MongoDB string
 *   node scripts/cloudinary-account-migrate.mjs verify      ranged-GET check every new URL
 *
 * New-account creds come from .env.local (CLOUDINARY_*). Old-account creds come
 * from OLD_CLOUD_NAME / OLD_API_KEY / OLD_API_SECRET in the environment (or from
 * .env.local when it still points at the old cloud, i.e. before the cut-over).
 */
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MAP_FILE = path.join(ROOT, "scripts", "cloudinary-map.json");
const INV_FILE = path.join(ROOT, "scripts", "cloudinary-inventory.json");

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

function creds() {
  return loadEnvLocal().then((env) => {
    const old = {
      cloud: process.env.OLD_CLOUD_NAME ?? env.CLOUDINARY_CLOUD_NAME,
      key: process.env.OLD_API_KEY ?? env.CLOUDINARY_API_KEY,
      secret: process.env.OLD_API_SECRET ?? env.CLOUDINARY_API_SECRET,
    };
    const nu = {
      cloud: env.CLOUDINARY_CLOUD_NAME,
      key: env.CLOUDINARY_API_KEY,
      secret: env.CLOUDINARY_API_SECRET,
    };
    return { old, nu };
  });
}

function signedParams(params, secret) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(toSign + secret).digest("hex");
}

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const KIND = { image: "image", video: "video", raw: "raw" };

function deliveryUrl(cloud, item) {
  return `https://res.cloudinary.com/${cloud}/${item.resource_type}/upload/${item.public_id}.${item.format}`;
}

async function head(url, attempts = 3) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: { Range: "0-0" } });
      if (res.ok) return true;
      if (res.status === 404) return false;
      await new Promise((r) => setTimeout(r, 1200 * i));
    } catch {
      await new Promise((r) => setTimeout(r, 1200 * i));
    }
  }
  return false;
}

// ── inventory ───────────────────────────────────────────────────────────────

async function cmdInventory() {
  const { old } = await creds();
  const auth = Buffer.from(`${old.key}:${old.secret}`).toString("base64");
  const items = [];
  for (const type of Object.values(KIND)) {
    let cursor = null;
    do {
      const url =
        `https://api.cloudinary.com/v1_1/${old.cloud}/resources/${type}` +
        `?max_results=100${cursor ? `&next_cursor=${encodeURIComponent(cursor)}` : ""}`;
      const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
      for (const r of json.resources ?? []) {
        items.push({
          public_id: r.public_id,
          resource_type: r.resource_type,
          type: r.type,
          format: r.format,
          bytes: r.bytes,
          secure_url: r.secure_url,
        });
      }
      cursor = json.next_cursor ?? null;
    } while (cursor);
  }
  items.sort((a, b) => a.public_id.localeCompare(b.public_id));
  await fs.writeFile(INV_FILE, JSON.stringify(items, null, 1), "utf8");
  const byType = items.reduce((acc, i) => ((acc[i.resource_type] = (acc[i.resource_type] ?? 0) + 1), acc), {});
  console.log(`inventory: ${items.length} assets from cloud "${old.cloud}"`, byType);
  console.log(`written: ${INV_FILE}`);
}

// ── copy ────────────────────────────────────────────────────────────────────

async function copyOne(item, nu, attempts = 3) {
  const target = deliveryUrl(nu.cloud, item);
  if (process.env.FORCE !== "1" && (await head(target))) return { ...item, url: target, skipped: true };

  const endpoint = `https://api.cloudinary.com/v1_1/${nu.cloud}/${item.resource_type}/upload`;
  const ts = Math.floor(Date.now() / 1000);
  const params = { overwrite: "true", public_id: item.public_id, timestamp: String(ts) };
  const signature = signedParams(params, nu.secret);

  for (let i = 1; i <= attempts; i++) {
    try {
      const body = new FormData();
      body.set("file", item.secure_url); // Cloudinary fetches the source URL
      body.set("api_key", nu.key);
      body.set("signature", signature);
      for (const [k, v] of Object.entries(params)) body.set(k, v);
      const res = await fetch(endpoint, { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
      return { ...item, url: target, id: json.public_id };
    } catch (err) {
      if (i === attempts) throw err;
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
}

async function cmdCopy() {
  const { nu } = await creds();
  const prefix = process.env.PREFIX ?? "tuc/";
  const items = JSON.parse(await fs.readFile(INV_FILE, "utf8")).filter((i) =>
    i.public_id.startsWith(prefix),
  );
  console.log(`copying ${items.length} assets (prefix "${prefix}") -> cloud "${nu.cloud}"`);

  const queue = [...items];
  let done = 0;
  let skipped = 0;
  let failed = 0;
  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      try {
        const r = await copyOne(item, nu);
        if (r.skipped) skipped++;
        else done++;
        if ((done + skipped) % 25 === 0) console.log(`  ${done + skipped}/${items.length}`);
      } catch (err) {
        failed++;
        console.error(`  FAIL ${item.public_id}: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  console.log(`uploaded=${done} skipped=${skipped} failed=${failed}`);
  if (failed) process.exitCode = 1;
}

// ── rewrite source + data + map ─────────────────────────────────────────────

async function cmdRewrite() {
  const { old, nu } = await creds();
  const from = `res.cloudinary.com/${old.cloud}/`;
  const to = `res.cloudinary.com/${nu.cloud}/`;

  const targets = [
    ...(await walk(path.join(ROOT, "src"))).filter((f) => /\.(ts|tsx)$/.test(f)),
    ...(await walk(path.join(ROOT, "data"))).filter((f) => f.endsWith(".json")),
    MAP_FILE,
  ];

  let files = 0;
  let hits = 0;
  for (const file of targets) {
    let text;
    try {
      text = await fs.readFile(file, "utf8");
    } catch {
      continue;
    }
    const n = text.split(from).length - 1;
    if (!n) continue;
    await fs.writeFile(file, text.split(from).join(to), "utf8");
    files++;
    hits += n;
  }
  console.log(`rewrote ${hits} URL(s) across ${files} file(s): ${old.cloud} -> ${nu.cloud}`);

  // leftover audit
  const leftovers = [];
  for (const file of targets) {
    try {
      const text = await fs.readFile(file, "utf8");
      if (text.includes(old.cloud)) leftovers.push(path.relative(ROOT, file));
    } catch {}
  }
  if (leftovers.length) {
    console.error("STILL referencing old cloud:", leftovers.join(", "));
    process.exitCode = 1;
  }
}

// ── database ────────────────────────────────────────────────────────────────

async function cmdDb() {
  const { old, nu } = await creds();
  const env = await loadEnvLocal();
  const from = `res.cloudinary.com/${old.cloud}/`;
  const to = `res.cloudinary.com/${nu.cloud}/`;

  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(env.MONGODB_URI);
  await client.connect();
  try {
    const db = client.db();
    let docs = 0;
    let fields = 0;
    for (const { name } of await db.listCollections().toArray()) {
      const col = db.collection(name);
      for (const doc of await col.find({}).toArray()) {
        const set = {};
        const walkValues = (value, keyPath) => {
          if (typeof value === "string") {
            if (value.includes(from)) set[keyPath] = value.split(from).join(to);
          } else if (Array.isArray(value)) {
            value.forEach((v, i) => walkValues(v, `${keyPath}.${i}`));
          } else if (value && typeof value === "object" && !(value instanceof Date)) {
            for (const [k, v] of Object.entries(value)) walkValues(v, `${keyPath}.${k}`);
          }
        };
        for (const [k, v] of Object.entries(doc)) if (k !== "_id") walkValues(v, k);
        if (Object.keys(set).length) {
          await col.updateOne({ _id: doc._id }, { $set: set });
          docs++;
          fields += Object.keys(set).length;
        }
      }
    }
    console.log(`db: rewrote ${fields} field(s) across ${docs} doc(s)`);
  } finally {
    await client.close();
  }
}

// ── verify ──────────────────────────────────────────────────────────────────

async function cmdVerify() {
  const { nu } = await creds();
  const prefix = process.env.PREFIX ?? "tuc/";
  const items = JSON.parse(await fs.readFile(INV_FILE, "utf8")).filter((i) =>
    i.public_id.startsWith(prefix),
  );
  const queue = [...items];
  let ok = 0;
  const bad = [];
  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      const url = deliveryUrl(nu.cloud, item);
      if (await head(url)) ok++;
      else bad.push(`${item.public_id}.${item.format}`);
    }
  }
  await Promise.all(Array.from({ length: 8 }, worker));
  console.log(`verify: ${ok}/${items.length} reachable on "${nu.cloud}"`);
  if (bad.length) {
    console.error("MISSING:");
    for (const b of bad) console.error("  " + b);
    process.exitCode = 1;
  }
}

const [, , cmd] = process.argv;
if (cmd === "inventory") await cmdInventory();
else if (cmd === "copy") await cmdCopy();
else if (cmd === "rewrite") await cmdRewrite();
else if (cmd === "db") await cmdDb();
else if (cmd === "verify") await cmdVerify();
else {
  console.log("usage: node scripts/cloudinary-account-migrate.mjs <inventory|copy|rewrite|db|verify>");
  process.exitCode = 1;
}
