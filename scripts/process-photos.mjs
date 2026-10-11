/**
 * One-time asset processing: converts the raw WhatsApp customer/founder
 * JPEGs (photo-sources/) into optimized WebP files served by the site.
 *
 *   node scripts/process-photos.mjs
 *
 * Sources are never modified; re-running overwrites the WebP outputs only.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MAX_EDGE = 1500; // long-edge cap, plenty for retina grid tiles
const QUALITY = 78;

/** source file → output name (delivery photos) */
const DELIVERIES = [
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.15 AM.jpeg", "deliveries/grey-wolf.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.16 AM (1).jpeg", "deliveries/mallard-ultralite.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.16 AM (2).jpeg", "deliveries/jayco-summit-popup.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.16 AM.jpeg", "deliveries/jayco-eagle-fifth-wheel.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.17 AM (1).jpeg", "deliveries/newmar-kountry-star.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.17 AM.jpeg", "deliveries/coachmen-concord.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.18 AM (1).jpeg", "deliveries/freedom-express-blast.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.18 AM.jpeg", "deliveries/grand-design-astoria.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.20 AM (1).jpeg", "deliveries/family-trailer.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.20 AM (2).jpeg", "deliveries/freedom-express-couple.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.20 AM.jpeg", "deliveries/terrain-ultralite.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.21 AM.jpeg", "deliveries/trail-cruiser.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.22 AM (1).jpeg", "deliveries/grand-design-imagine.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.22 AM.jpeg", "deliveries/jayco-eagle-ht-hitched.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.24 AM.jpeg", "deliveries/class-a-keys.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.25 AM (1).jpeg", "deliveries/lexington-class-c.webp"],
  // "5.36.25 AM" skipped — near-duplicate of the 5.36.21 Trail Cruiser shot
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.26 AM (1).jpeg", "deliveries/freedom-express-select.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.26 AM.jpeg", "deliveries/aluma-lite-family.webp"],
  ["carav-live-review/WhatsApp Image 2026-10-10 at 5.36.27 AM.jpeg", "deliveries/solaire-super-lite.webp"],
];

const FOUNDER = [
  ["carav-founder-set/WhatsApp Image 2026-10-10 at 5.47.43 AM.jpeg", "founder/family-portrait.webp"],
  ["carav-founder-set/WhatsApp Image 2026-10-10 at 5.47.46 AM.jpeg", "founder/fair-day.webp"],
  ["carav-founder-set/WhatsApp Image 2026-10-10 at 5.47.44 AM.jpeg", "founder/station-day.webp"],
];

async function convert(srcRel, outRel, outDir) {
  const src = path.join(ROOT, "photo-sources", srcRel);
  const out = path.join(ROOT, "public", "images", outRel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  const before = (await fs.stat(src)).size;
  const info = await sharp(src)
    .rotate() // honor EXIF orientation
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);
  const after = (await fs.stat(out)).size;
  console.log(
    `${outRel.padEnd(32)} ${info.width}x${info.height}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
  );
}

let failed = 0;
for (const [src, out] of [...DELIVERIES, ...FOUNDER]) {
  try {
    await convert(src, out);
  } catch (err) {
    failed += 1;
    console.error(`FAILED ${src}: ${err.message}`);
  }
}
console.log(failed ? `\n${failed} file(s) failed` : "\nAll photos processed.");
