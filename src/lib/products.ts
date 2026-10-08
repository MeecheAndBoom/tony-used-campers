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
 * Reads live inventory from MongoDB, falling back to the static catalog
 * when the database is not configured or unreachable.
 */
export async function getProducts(filter: Filter = {}): Promise<ProductRecord[]> {
  const fallback = SEED_PRODUCTS.filter((p) => p.status === "live").filter((p) =>
    matches(p, filter),
  );

  if (!hasDatabase()) return fallback;

  try {
    await connectDB();
    const docs = (await Product.find({ status: "live" })
      .sort({ createdAt: -1 })
      .lean()) as unknown as ProductRecord[];
    if (!docs.length) return fallback;
    return docs.filter((doc) => matches(doc, filter));
  } catch {
    return fallback;
  }
}

export async function getProduct(slug: string): Promise<ProductRecord | null> {
  const fallback = SEED_PRODUCTS.find((p) => p.slug === slug) ?? null;
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

/** Cheap static values used by filters before a DB round-trip. */
export function catalogTypes() {
  return Array.from(new Set(SEED_PRODUCTS.map((p) => p.type)));
}

export function catalogBrands() {
  return Array.from(new Set(SEED_PRODUCTS.map((p) => p.brand))).sort();
}
