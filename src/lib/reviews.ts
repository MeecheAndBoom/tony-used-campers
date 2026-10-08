import { connectDB, hasDatabase } from "./db";
import { Review } from "./models/Review";
import { SEED_REVIEWS } from "./catalog";
import type { Review as ReviewRecord } from "./types";

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

export function ratingSummary(reviews: ReviewRecord[]) {
  if (!reviews.length) return { average: 0, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    average: Math.round((total / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}
