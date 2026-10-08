import { listPendingReviews, getReviews } from "@/lib/reviews";

export default async function AdminReviewsPage() {
  const [published, pending] = await Promise.all([getReviews(), listPendingReviews()]);

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Reviews
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          {published.length} published, {pending.length} awaiting approval.
        </p>
      </div>

      <div className="rounded-card bg-white p-6">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          Awaiting approval
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-[15px] text-muted">Nothing waiting.</p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {pending.map((r, i) => (
              <li
                key={`${r.name}-${i}`}
                className="rounded-box border border-line-soft p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-ink">{r.name}</p>
                  <p className="text-[13px] text-muted">
                    {Array.from({ length: r.rating }, () => "★").join("")}
                  </p>
                </div>
                {r.title ? (
                  <p className="mt-1.5 text-[15px] font-medium">{r.title}</p>
                ) : null}
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}