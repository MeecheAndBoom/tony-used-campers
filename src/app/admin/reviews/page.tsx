import { listAllReviews } from "@/lib/reviews";
import { shortDate } from "@/lib/format";
import { DeleteButton } from "@/components/admin/DeleteButton";
import {
  createReviewAction,
  publishReviewAction,
  unpublishReviewAction,
  deleteReviewAction,
} from "@/lib/actions/admin";
import { ReviewForm } from "@/components/admin/ReviewForm";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-[13px] text-[#f5a623]" aria-hidden="true">
      {Array.from({ length: rating }, (_, i) => (
        <i key={i} className="fa-solid fa-star" />
      ))}
    </span>
  );
}

function ReviewCard({
  review,
  pending,
}: {
  review: { id: string; name: string; city?: string; rating: number; title?: string; body: string; date?: string };
  pending: boolean;
}) {
  return (
    <li className="flex flex-col rounded-box border border-line-soft p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-medium text-ink">{review.name}</span>
          <Stars rating={review.rating} />
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          {review.date ? <span className="text-muted">{shortDate(review.date)}</span> : null}
          {review.city ? <span className="text-muted">{review.city}</span> : null}
        </div>
      </div>
      {review.title ? (
        <p className="mt-1.5 text-[15px] font-medium text-ink">{review.title}</p>
      ) : null}
      <p className="mt-1.5 flex-1 text-[15px] leading-relaxed text-muted">
        {review.body}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line-soft pt-3">
        <a href={`/admin/reviews/${review.id}`} className="text-[14px] text-accent hover:underline">
          Edit
        </a>
        {pending ? (
          <form action={publishReviewAction}>
            <input type="hidden" name="id" value={review.id} />
            <button type="submit" className="text-[14px] text-accent hover:underline">
              Publish
            </button>
          </form>
        ) : (
          <form action={unpublishReviewAction}>
            <input type="hidden" name="id" value={review.id} />
            <button type="submit" className="text-[14px] text-muted hover:text-ink hover:underline">
              Unpublish
            </button>
          </form>
        )}
        <form action={deleteReviewAction}>
          <input type="hidden" name="id" value={review.id} />
          <DeleteButton label="Delete" message="Delete this review? This can't be undone." />
        </form>
      </div>
    </li>
  );
}

export default async function AdminReviewsPage() {
  const reviews = await listAllReviews();
  const published = reviews.filter((r) => r.published);
  const pending = reviews.filter((r) => !r.published);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.01em]">
            Reviews
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {published.length} published · {pending.length} awaiting approval.
          </p>
        </div>
      </div>

      <div className="rounded-card bg-white p-6">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          Add a review
        </h2>
        <div className="mt-4">
          <ReviewForm action={createReviewAction} submitLabel="Add review" />
        </div>
      </div>

      {pending.length > 0 && (
        <div className="rounded-card bg-white p-6">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
            Awaiting approval
          </h2>
          <ul className="mt-4 grid gap-4">
            {pending.map((r) => (
              <ReviewCard key={r.id} review={r} pending />
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-card bg-white p-6">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          Published
        </h2>
        {published.length === 0 ? (
          <p className="mt-3 text-[15px] text-muted">
            Nothing published yet — publish a pending review or add one above.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {published.map((r) => (
              <ReviewCard key={r.id} review={r} pending={false} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}