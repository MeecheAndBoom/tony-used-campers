import { connectDB, hasDatabase } from "./db";
import { Review } from "./models/Review";
import { SEED_REVIEWS } from "./catalog";
import type { Review as ReviewRecord } from "./types";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PENDING_FILE = path.join(DATA_DIR, "reviews-pending.json");
const PUBLISHED_FILE = path.join(DATA_DIR, "reviews.json");

/** Admin-facing review with a stable id (Mongo _id or locally-assigned). */
export type AdminReview = ReviewRecord & { id: string };

function newId() {
  return `rev_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

async function readJson<T>(file: string): Promise<T[] | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

async function writeJson(file: string, list: unknown[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
}

/** Mongo docs carry createdAt; the UI renders a `date` string. */
function withDates<T extends ReviewRecord & { createdAt?: Date | string }>(
  docs: T[],
): Array<T & { date: string }> {
  return docs.map((doc) => ({
    ...doc,
    date: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : (doc.date ?? new Date().toISOString()),
  }));
}

export async function getReviews(): Promise<ReviewRecord[]> {
  const fallback = SEED_REVIEWS.filter((r) => r.published);
  if (!hasDatabase()) return fallback;

  try {
    await connectDB();
    const docs = (await Review.find({ published: true })
      .sort({ createdAt: -1 })
      .lean()) as unknown as Array<ReviewRecord & { createdAt?: Date | string }>;
    return docs.length ? withDates(docs) : fallback;
  } catch {
    return fallback;
  }
}

type PendingReview = ReviewRecord & { date?: string };

/** Unpublished submissions, from MongoDB when available else the local file. */
export async function listPendingReviews(): Promise<PendingReview[]> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await Review.find({ published: false })
        .sort({ createdAt: -1 })
        .lean()) as unknown as PendingReview[];
      if (docs.length) return docs;
    } catch {
      /* fall through to the local file */
    }
  }
  return (await readJson<PendingReview>(PENDING_FILE)) ?? [];
}

/**
 * Every review for the admin screen (published + pending). Mongo docs get
 * their `_id`; local entries get a stable id persisted into the file.
 */
export async function listAllReviews(): Promise<AdminReview[]> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const docs = (await Review.find()
        .sort({ published: 1, createdAt: -1 })
        .lean()) as unknown as Array<ReviewRecord & { _id: unknown }>;
      if (docs.length) {
        return docs.map((doc) => {
          const createdAt = (doc as unknown as { createdAt?: Date | string })
            .createdAt;
          return {
            ...doc,
            id: String(doc._id),
            date: createdAt
              ? new Date(createdAt).toISOString()
              : new Date().toISOString(),
          } as AdminReview;
        });
      }
    } catch {
      /* fall through to local */
    }
  }

  const published =
    (await readJson<AdminReview>(PUBLISHED_FILE)) ??
    SEED_REVIEWS.filter((r) => r.published).map((r, i) => ({ ...r, id: `seed-${i}` }));
  const pendingRaw = (await readJson<PendingReview>(PENDING_FILE)) ?? [];
  const pending: AdminReview[] = pendingRaw.map((r, i) => ({
    ...r,
    published: false,
    id: (r as Partial<AdminReview>).id ?? `pending-${i}`,
  }));
  // Persist ids for pending entries so later edits/deletes are stable.
  await writeJson(PENDING_FILE, pending);
  return [...pending, ...published];
}

/** Seed the local published store from the catalog before persisting. */
async function ensurePublishedFile() {
  const existing = await readJson<AdminReview>(PUBLISHED_FILE);
  if (existing) return existing;
  const seeded = SEED_REVIEWS.filter((r) => r.published).map((r, i) => ({
    ...r,
    id: `seed-${i}`,
  }));
  await writeJson(PUBLISHED_FILE, seeded);
  return seeded;
}

export type ReviewInput = {
  name: string;
  city?: string;
  rating: number;
  title?: string;
  body: string;
  purchased?: string;
  published: boolean;
};

export async function createReview(input: ReviewInput): Promise<AdminReview> {
  const record: AdminReview & { _id?: unknown } = {
    ...input,
    id: newId(),
    date: new Date().toISOString(),
  };

  if (hasDatabase()) {
    try {
      await connectDB();
      const doc = (await Review.create({
        name: input.name,
        city: input.city,
        rating: input.rating,
        title: input.title,
        body: input.body,
        purchased: input.purchased,
        published: input.published,
      })) as unknown as { _id: unknown };
      return { ...input, date: new Date().toISOString(), id: String(doc._id) };
    } catch {
      /* fall through to local */
    }
  }

  if (input.published) {
    const list = await ensurePublishedFile();
    record.id = record.id ?? newId();
    list.unshift(record as AdminReview);
    await writeJson(PUBLISHED_FILE, list);
  } else {
    const pending = (await readJson<PendingReview>(PENDING_FILE)) ?? [];
    record.id = record.id ?? newId();
    pending.unshift(record as AdminReview);
    await writeJson(PENDING_FILE, pending);
  }
  return record as AdminReview;
}

export async function updateReview(
  id: string,
  patch: Partial<ReviewInput>,
): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await Review.updateOne({ _id: id }, { $set: patch });
      if (res.matchedCount) return true;
    } catch {
      /* fall through to local */
    }
  }

  const published = await readJson<AdminReview>(PUBLISHED_FILE);
  if (published) {
    const index = published.findIndex((r) => r.id === id);
    if (index !== -1) {
      const cur = published[index];
      const patched = { ...cur, ...patch, published: patch.published ?? cur.published };
      if (patch.published === false) {
        published.splice(index, 1);
        await writeJson(PUBLISHED_FILE, published);
        const pending = (await readJson<PendingReview>(PENDING_FILE)) ?? [];
        pending.unshift(patched as PendingReview);
        await writeJson(PENDING_FILE, pending);
      } else {
        published[index] = patched;
        await writeJson(PUBLISHED_FILE, published);
      }
      return true;
    }
  }

  const pending = (await readJson<PendingReview>(PENDING_FILE)) ?? [];
  const pendingIndex = pending.findIndex((r) => (r as Partial<AdminReview>).id === id);
  if (pendingIndex !== -1) {
    const cur = {
      ...pending[pendingIndex],
      id: (pending[pendingIndex] as Partial<AdminReview>).id ?? newId(),
    };
    const patched = { ...cur, ...patch, published: patch.published ?? false };
    if (patch.published) {
      pending.splice(pendingIndex, 1);
      await writeJson(PENDING_FILE, pending);
      const pub = await ensurePublishedFile();
      pub.unshift(patched as AdminReview);
      await writeJson(PUBLISHED_FILE, pub);
    } else {
      pending[pendingIndex] = patched as PendingReview;
      await writeJson(PENDING_FILE, pending);
    }
    return true;
  }
  return false;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (hasDatabase()) {
    try {
      await connectDB();
      const res = await Review.deleteOne({ _id: id });
      if (res.deletedCount) return true;
    } catch {
      /* fall through to local */
    }
  }

  const published = await readJson<AdminReview>(PUBLISHED_FILE);
  if (published) {
    const next = published.filter((r) => r.id !== id);
    if (next.length !== published.length) {
      await writeJson(PUBLISHED_FILE, next);
      return true;
    }
  }

  const pending = (await readJson<PendingReview>(PENDING_FILE)) ?? [];
  const nextPending = pending.filter(
    (r) => (r as Partial<AdminReview>).id !== id,
  );
  if (nextPending.length !== pending.length) {
    await writeJson(PENDING_FILE, nextPending);
    return true;
  }
  return false;
}

export async function setReviewPublished(
  id: string,
  published: boolean,
): Promise<boolean> {
  return updateReview(id, { published });
}

export function ratingSummary(reviews: ReviewRecord[]) {
  if (!reviews.length) return { average: 0, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}