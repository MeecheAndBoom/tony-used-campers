import type { Metadata } from "next";
import { ReviewForm } from "@/components/site/ReviewForm";
import { DeliveryWall } from "@/components/site/DeliveryWall";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { shortDate } from "@/lib/format";
import { getDeliveries } from "@/lib/deliveries";
import { getReviews, ratingSummary } from "@/lib/reviews";
import type { Review } from "@/lib/types";

export const metadata: Metadata = {
  title: "Testimonials & Reviews",
  description:
    "Ratings, reviews and real delivery-day photos from customers who bought used campers at Tony Used Campers in Detroit.",
  keywords: [
    "RV dealer Detroit reviews",
    "used camper dealer Michigan reviews",
    "Tony Used Campers reviews",
    "customer RV delivery photos",
  ],
};

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-0.5 text-[13px] text-[#f5a623]"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={i < rating ? "fa-solid fa-star" : "fa-regular fa-star"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-line-soft bg-white p-6">
      <Stars rating={review.rating} />
      {review.title && (
        <h3 className="mt-3 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
          {review.title}
        </h3>
      )}
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">
        {review.body}
      </p>
      <footer className="mt-5 border-t border-line-soft pt-4 text-[13px]">
        <span className="font-medium text-ink">{review.name}</span>
        <span className="text-muted">
          {review.city ? ` · ${review.city}` : ""}
          {review.purchased ? ` · Bought a ${review.purchased}` : ""}
        </span>
        <span className="mt-1 block text-muted-light">
          {shortDate(review.date)}
        </span>
      </footer>
    </article>
  );
}

export default async function TestimonialsPage() {
  const [reviews, deliveries] = await Promise.all([
    getReviews(),
    getDeliveries(),
  ]);
  const { average, count } = ratingSummary(reviews);

  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    share: count
      ? Math.round((reviews.filter((r) => r.rating === stars).length / count) * 100)
      : 0,
  }));

  return (
    <div className="bg-white">
      {count > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "AggregateRating",
            ratingValue: average,
            reviewCount: count,
            bestRating: 5,
          }}
        />
      )}
      <section className="section pb-8 pt-16 md:pt-24">
        <Reveal>
          <h1 className="text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            What Detroit says about us.
          </h1>
        </Reveal>

        {/* Rating summary */}
        <Reveal delay={90}>
          <div className="mt-9 flex flex-col gap-8 rounded-card bg-alt p-6 sm:flex-row sm:items-center sm:gap-12 sm:p-8">
            <div className="text-center sm:text-left">
              <p className="text-[clamp(3rem,6vw,4rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
                {average}
              </p>
              <div className="mt-2 flex justify-center sm:justify-start">
                <Stars rating={Math.round(average)} />
              </div>
              <p className="mt-1.5 text-[14px] text-muted">
                {count} reviews
              </p>
            </div>

            <div className="flex-1 space-y-1.5">
              {breakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-[13px]">
                  <span className="w-8 text-muted">{row.stars}★</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-pill bg-alt-deep">
                    <span
                      className="block h-full rounded-pill bg-[#f5a623] transition-[width] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${row.share}%` }}
                    />
                  </span>
                  <span className="w-9 text-right text-muted">{row.share}%</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Delivery wall */}
      {deliveries.length > 0 && (
        <section id="deliveries" className="section content-auto pb-16 pt-14">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                The delivery wall.
              </h2>
              <p className="text-[15px] text-muted">
                {deliveries.length} real handovers — every type of camper,
                every kind of family.
              </p>
            </div>
          </Reveal>
          <Reveal delay={90} className="mt-9">
            <DeliveryWall deliveries={deliveries} />
          </Reveal>
        </section>
      )}

      {/* Reviews grid */}
      <section className="section content-auto pb-16 pt-10">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal key={`${review.name}-${review.date}`} delay={(i % 3) * 70}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Submit */}
      <section className="bg-alt py-16 md:py-24">
        <div className="section grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                Bought from us? Tell everyone.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">
                Reviews go to our team first, then publish to this page. No
                editing, no cherry-picking — good or bad, we post what you
                write.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="rounded-card bg-white p-6 md:p-8">
              <ReviewForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
