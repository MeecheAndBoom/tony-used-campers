import type { AdminReview } from "@/lib/reviews";

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";
const LABEL = "field-label block";

function Stars({ defaultValue }: { defaultValue?: number }) {
  const value = defaultValue ?? 5;
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="rating" className={LABEL}>
        Rating
      </label>
      <select id="rating" name="rating" defaultValue={value} className={FIELD}>
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} star{n === 1 ? "" : "s"}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ReviewForm({
  review,
  action,
  defaultPublished,
  submitLabel = "Save review",
}: {
  review?: AdminReview;
  /** Server action passed in from the page (create or edit). */
  action: (formData: FormData) => void | Promise<void>;
  defaultPublished?: boolean;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-card bg-white p-6 sm:grid-cols-2">
      {review ? <input type="hidden" name="id" value={review.id} /> : null}
      <div>
        <label htmlFor="name" className={LABEL}>
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={review?.name}
          placeholder="Maria Rodriguez"
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="city" className={LABEL}>
          City <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="city"
          name="city"
          defaultValue={review?.city}
          placeholder="Detroit, MI"
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="title" className={LABEL}>
          Title <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="title"
          name="title"
          defaultValue={review?.title}
          placeholder="Couldn't be happier"
          className={FIELD}
        />
      </div>
      <div>
        <label htmlFor="purchased" className={LABEL}>
          Bought a <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="purchased"
          name="purchased"
          defaultValue={review?.purchased}
          placeholder="2022 Jayco Jay Flight"
          className={FIELD}
        />
      </div>
      <div>
        <Stars defaultValue={review?.rating} />
      </div>
      <div className="flex items-center gap-3 self-end pb-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={review?.published ?? defaultPublished ?? true}
          className="h-4 w-4 accent-[#0071e3]"
        />
        <label htmlFor="published" className="text-[15px] text-ink">
          Published on the site
        </label>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="body" className={LABEL}>
          Review
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          required
          defaultValue={review?.body}
          placeholder="Tell us about your experience…"
          className={FIELD}
        />
      </div>
      <div className="flex items-center justify-end gap-3 sm:col-span-2">
        <a href="/admin/reviews" className="btn btn-ghost">
          Cancel
        </a>
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}