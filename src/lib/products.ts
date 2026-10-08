import { promises as fs } from "fs";
import path from "path";
import { connectDB, hasDatabase } from "./db";
import { Product } from "./models/Product";
import { SEED_PRODUCTS } from "./catalog";
import type { Product as ProductRecord } from "./types";

type Filter = {
  type?: string;
  brand?: string;
  featured?: boolean;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_FILE = path.join(DATA_DIR, "products.json");

function matches(record: ProductRecord, filter: Filter) {
  if (filter.featured && !record.featured) return false;
  if (filter.type && record.type !== filter.type) return false;
  if (filter.brand && record.brand !== filter.brand) return false;
  if (typeof filter.minPrice === "number" && record.price < filter.minPrice)
    return false;
  if (typeof filter.maxPrice === "number" && record.price > filter.maxPrice)
    return false;
  if (filter.q) {
    const haystack = `${record.title} ${record.brand} ${record.model} ${record.type} ${record.year}`.toLowerCase();
    if (!haystack.includes(filter.q.toLowerCase())) return false;
  }
  return true;
}

/**
 * Local JSON catalog used when Mongo is unavailable. Seeded from the static
 * catalog on first write so admin-created/edited units survive restarts while
 * the storefront keeps rendering.
 */
async function readLocal(): Promise<ProductRecord[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as ProductRecord[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* missing or corrupt — fall back to seed */
  }
  return SEED_PRODUCTS.map((p) => ({ ...p }));
}

async function writeLocal(products: ProductRecord[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(products, null, 2), "utf8");
}

/**
 * Reads live inventory from MongoDB, falling back to the local catalog (or the
 * static seed) when the database is not configured or unreachable.
 */
export async function getProducts(filter: Filter = {}): Promise<ProductRecord[]> {
  const fallback = (await readLocal()).filter((p) => p.status === "live");

  if (!hasDatabase()) return fallback.filter((p) => matches(p, filter));

  try {
    await connectDB();
    const docs = (await Product.find({ status: "live" })
      .sort({ createdAt: -1 })
      .lean()) as unknown as ProductRecord[];
    if (docs.length) return docs.filter((doc) => matches(doc, filter));
  } catch {
    /* fall through to the local catalog */
  }
  return fallback.filter((p) => matches(p, filter));
}

export async function getProduct(slug: string): Promise<ProductRecord | null> {
  const fallback =
    (await readLocal()).find((p) => p.slug === slug && p.status === "live") ??
    null;
  if (!hasDatabase()) return fallback;

  try {
    await connectDB();
    const doc = (await Product.findOne({ slug, status: "live" }).lean()) as unknown as
      | ProductRecord
      | null;
    return doc ?? fallback;
  } catch {
    return fallback;
  }
}

/** All products for the admin screen — live and draft, DB first then local. */
export async function listAdminProducts(): Promise<ProductRecord[]> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await Product.find().sort({ createdAt: -1 }).lean()) as unknown as
        | ProductRecord[]
        | null;
      if (docs?.length) return docs;
    } catch {
      /* fall through to the local catalog */
    }
  }
  return readLocal();
}

/** Slug helper for new units: "2022 Jayco Jay Flight" -> "2022-jayco-jay-flight". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, existing: ProductRecord[]) {
  let slug = slugify(base) || `camper-${Date.now().toString(36)}`;
  const taken = new Set(existing.map((p) => p.slug));
  let i = 2;
  while (taken.has(slug)) {
    slug = `${slugify(base) || "camper"}-${i}`;
    i += 1;
  }
  return slug;
}

export type ProductInput = Omit<
  ProductRecord,
  "slug" | "status" | "featured" | "createdAt"
> & {
  slug?: string;
  status?: "live" | "draft";
  featured?: boolean;
};

export async function createProduct(input: ProductInput): Promise<ProductRecord> {
  const slug = await uniqueSlug(input.slug ?? `${input.year} ${input.brand} ${input.model}`, await readLocal());
  const record: ProductRecord = {
    ...input,
    slug,
    status: input.status ?? "live",
    featured: input.featured ?? false,
  };

  if (hasDatabase()) {
    try {
      await connectDB();
      await Product.create(record);
      return record;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  list.unshift(record);
  await writeLocal(list);
  return record;
}

export async function updateProduct(
  slug: string,
  patch: Partial<ProductInput> & { slug?: string },
): Promise<ProductRecord | null> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await Product.findOneAndUpdate(
        { slug },
        { $set: patch },
        { new: true },
      ).lean()) as unknown as ProductRecord | null;
      if (doc) return doc;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  list[index] = { ...list[index], ...patch, slug: patch.slug ?? slug };
  await writeLocal(list);
  return list[index];
}

export async function deleteProduct(slug: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await Product.deleteOne({ slug });
      if (res.deletedCount) return true;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  const next = list.filter((p) => p.slug !== slug);
  if (next.length === list.length) return false;
  await writeLocal(next);
  return true;
}

/** Cheap static values used by filters before a DB round-trip. */
export function catalogTypes() {
  return Array.from(new Set(SEED_PRODUCTS.map((p) => p.type)));
}

export function catalogBrands() {
  return Array.from(new Set(SEED_PRODUCTS.map((p) => p.brand))).sort();
}