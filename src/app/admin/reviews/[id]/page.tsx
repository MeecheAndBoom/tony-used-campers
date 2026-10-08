import { notFound } from "next/navigation";
import { listAllReviews } from "@/lib/reviews";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { editReviewAction } from "@/lib/actions/admin";

type Props = { params: Promise<{ id: string }> };

export default async function EditReviewPage({ params }: Props) {
  const { id } = await params;
  const review = (await listAllReviews()).find((r) => r.id === id);
  if (!review) notFound();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Edit review
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {review.name} — change anything and save; testimonials update
            immediately.
          </p>
        </div>
        <a href="/admin/reviews" className="text-[14px] text-accent hover:underline">
          ← Back to reviews
        </a>
      </div>
      <ReviewForm review={review} action={editReviewAction} submitLabel="Save changes" />
    </>
  );
}