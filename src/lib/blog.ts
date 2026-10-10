import { promises as fs } from "fs";
import path from "path";
import { connectDB, hasDatabase } from "./db";
import { BlogPost } from "./models/Blog";
import { SEED_BLOG_POSTS } from "./blog-seed";
import type {
  BlogCategory,
  BlogPost as BlogPostRecord,
} from "./types";

type Filter = {
  category?: BlogCategory | string;
  featured?: boolean;
  q?: string;
  tag?: string;
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Buying Guides",
  "Maintenance",
  "Owning an RV",
  "RV Life",
  "Destinations",
  "Dealership",
];

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_FILE = path.join(DATA_DIR, "blog.json");

function matches(record: BlogPostRecord, filter: Filter) {
  if (filter.featured && !record.featured) return false;
  if (filter.category && record.category !== filter.category) return false;
  if (filter.tag && !record.tags.some((t) => t.toLowerCase() === filter.tag!.toLowerCase()))
    return false;
  if (filter.q) {
    const haystack = `${record.title} ${record.excerpt} ${record.category} ${record.tags.join(" ")} ${record.body}`.toLowerCase();
    if (!haystack.includes(filter.q.toLowerCase())) return false;
  }
  return true;
}

function byDateDesc(a: BlogPostRecord, b: BlogPostRecord) {
  return b.date.localeCompare(a.date);
}

/**
 * Reading time from the body copy — ~220 words per minute, minimum one minute.
 */
export function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * Local JSON store used when Mongo is unavailable. Seeded from the static
 * catalog on first write so admin-created posts survive restarts while the
 * public blog keeps rendering.
 */
async function readLocal(): Promise<BlogPostRecord[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw) as BlogPostRecord[];
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    /* missing or corrupt — fall back to seed */
  }
  return SEED_BLOG_POSTS.map((p) => ({ ...p }));
}

async function writeLocal(posts: BlogPostRecord[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(posts, null, 2), "utf8");
}

/**
 * Published posts for the public blog — MongoDB first, local file, then the
 * static seed catalog, so the blog always renders.
 */
export async function getBlogPosts(filter: Filter = {}): Promise<BlogPostRecord[]> {
  const fallback = (await readLocal()).filter((p) => p.status === "live");

  if (!hasDatabase()) return fallback.filter((p) => matches(p, filter)).sort(byDateDesc);

  try {
    await connectDB();
    const docs = (await BlogPost.find({ status: "live" })
      .sort({ date: -1 })
      .lean()) as unknown as BlogPostRecord[];
    if (docs.length) return docs.filter((doc) => matches(doc, filter));
  } catch {
    /* fall through to the local file */
  }
  return fallback.filter((p) => matches(p, filter)).sort(byDateDesc);
}

export async function getBlogPost(slug: string): Promise<BlogPostRecord | null> {
  const fallback =
    (await readLocal()).find((p) => p.slug === slug && p.status === "live") ?? null;
  if (!hasDatabase()) return fallback;

  try {
    await connectDB();
    const doc = (await BlogPost.findOne({ slug, status: "live" }).lean()) as unknown as
      | BlogPostRecord
      | null;
    return doc ?? fallback;
  } catch {
    return fallback;
  }
}

/** All posts for the admin screen — live and draft, DB first then local. */
export async function listAdminBlogPosts(): Promise<BlogPostRecord[]> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await BlogPost.find().sort({ date: -1 }).lean()) as unknown as
        | BlogPostRecord[]
        | null;
      if (docs?.length) return docs;
    } catch {
      /* fall through to the local file */
    }
  }
  return (await readLocal()).sort(byDateDesc);
}

/** Slug helper for new posts: "How to Winterize Your RV" -> "how-to-winterize-your-rv". */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string, existing: BlogPostRecord[]) {
  let slug = slugify(base) || `post-${Date.now().toString(36)}`;
  const taken = new Set(existing.map((p) => p.slug));
  let i = 2;
  while (taken.has(slug)) {
    slug = `${slugify(base) || "post"}-${i}`;
    i += 1;
  }
  return slug;
}

export type BlogPostInput = Omit<
  BlogPostRecord,
  "slug" | "status" | "featured" | "createdAt" | "updatedAt"
> & {
  slug?: string;
  status?: "live" | "draft";
  featured?: boolean;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPostRecord> {
  const slug = await uniqueSlug(input.slug ?? input.title, await listAdminBlogPosts());
  const now = new Date().toISOString();
  const record: BlogPostRecord = {
    ...input,
    date: input.date || today(),
    slug,
    status: input.status ?? "live",
    featured: input.featured ?? false,
    createdAt: now,
    updatedAt: now,
  };

  if (hasDatabase()) {
    try {
      await connectDB();
      await BlogPost.create(record);
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

export async function updateBlogPost(
  slug: string,
  patch: Partial<BlogPostInput> & { slug?: string },
): Promise<BlogPostRecord | null> {
  const stamped = { ...patch, updatedAt: new Date().toISOString() };

  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await BlogPost.findOneAndUpdate(
        { slug },
        { $set: stamped },
        { new: true },
      ).lean()) as unknown as BlogPostRecord | null;
      if (doc) return doc;
    } catch {
      /* fall through to the local store */
    }
  }
  const list = await readLocal();
  const index = list.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  list[index] = { ...list[index], ...stamped, slug: patch.slug ?? slug };
  await writeLocal(list);
  return list[index];
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await BlogPost.deleteOne({ slug });
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
