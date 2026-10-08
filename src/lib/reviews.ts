import { connectDB, hasDatabase } from "./db";
import { Review } from "./models/Review";
import { SEED_REVIEWS } from "./catalog";
import type { Review as ReviewRecord } from "./types";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PENDING_FILE = path.join(DATA_DIR, "reviews-pending.json");

export async function getReviews(): Promise<ReviewRecord[]> {
  const fallback = SEED_REVIEWS.filter((r) => r.published);
  if (!hasDatabase()) return fallback;

  try {
    await connectDB();
    const docs = (await Review.find({ published: true })
      .sort({ createdAt: -1 })
      .lean()) as unknown as ReviewRecord[];
    return docs.length ? docs : fallback;
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
  try {
    const raw = await fs.readFile(PENDING_FILE, "utf8");
    return JSON.parse(raw) as PendingReview[];
  } catch {
    return [];
  }
}

export function ratingSummary(reviews: ReviewRecord[]) {
  if (!reviews.length) return { average: 0, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}
