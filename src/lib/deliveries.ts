import { promises as fs } from "fs";
import path from "path";
import type { Delivery } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "deliveries.json");

/**
 * Delivery-day customer photos, curated in `data/deliveries.json`
 * (process with scripts/process-photos.mjs after adding new sources).
 * Captions are intentionally anonymous — no customer names or locations.
 */
export async function getDeliveries(): Promise<Delivery[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed as Delivery[];
  } catch {
    // fall through — page renders without photos
  }
  return [];
}
