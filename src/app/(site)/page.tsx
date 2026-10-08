import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { money } from "@/lib/format";
import { getProducts } from "@/lib/products";
import { getReviews, ratingSummary } from "@/lib/reviews";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { SITE } from "@/lib/constants";
const WHY = [
  {
    title: "120-point inspection",
    body: "Every unit is checked roof-to-tires by our own techs. You get the report — seals, brakes, appliances, slides — before you pay a dollar.",
  },
  {
    title: "Straight pricing",
    body: "The price on the card is the price we take. No doc fee games, no mandatory add-ons, no four-hour finance desk.",
  },
  {
    title: "Delivery or pickup",
    body: "Take it home from Michigan Ave, or we deliver anywhere in the Lower Peninsula with a full walkthrough on arrival.",
  },
];

const CATEGORIES: { type: string; image: string }[] = [
  { type: "Travel Trailer", image: "/images/camper-jayflight.jpg" },
  { type: "Camper Van", image: "/images/camper-solis.jpg" },
  { type: "Class C Motorhome", image: "/images/camper-four-winds.jpg" },
  { type: "Class A Motorhome", image: "/images/camper-leprechaun.jpg" },
  { type: "Fifth Wheel", image: "/images/camper-cougar.jpg" },
  { type: "Pop-Up", image: "/images/camper-popup.jpg" },
  { type: "Teardrop", image: "/images/camper-teardrop.jpg" },
];

const STATS = [
  { value: "120", label: "Point inspection on every unit" },
  { value: "1,900+", label: "Campers delivered since 2009" },
  { value: "4.9", label: "Average rating from 380 reviews" },
  { value: "48 hrs", label: "Typical payment-to-pickup time" },
];

export default async function HomePage() {
  const [featured, reviews] = await Promise.all([
    getProducts({ featured: true }),
    getReviews(),
  ]);
  const shown = featured.slice(0, 4);
  const { average, count } = ratingSummary(reviews);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pb-16 pt-16 md:pb-24 md:pt-24">
        {/* Looping background video — poster covers it until it plays. */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/rv-road.mp4"
          poster="/images/hero-road.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div
          className="absolute inset-0 bg-white/78"
          aria-hidden="true"
        />

        <div className="section relative text-center">
          <Reveal>
            <h1 className="text-balance text-[clamp(2.5rem,6.5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
              Used campers,
              <br className="hidden sm:block" /> ready for the road.
            </h1>
          </Reveal>
          <Reveal delay={90}>
            <p className="text-balance mx-auto mt-6 max-w-[640px] text-[clamp(1.0625rem,2vw,1.3125rem)] leading-relaxed text-muted">
              Inspected, honestly priced and sold from Detroit since 2009.
              Shop {SITE.location.split(",")[0]}&apos;s best-stocked lot of
              pre-owned trailers, vans and motorhomes.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Shop campers
              </Link>
              <Link href="/sell" className="btn btn-ghost btn-lg">
                Sell or trade yours
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240} className="section relative mt-14 md:mt-20">
          <HeroSlideshow />
        </Reveal>
      </section>

      {/* ── Featured inventory ───────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="section">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.015em] text-ink">
                Featured campers.
              </h2>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 text-[17px] text-accent transition-colors duration-[120ms] hover:underline"
              >
                View all inventory
                <i
                  className="fa-solid fa-chevron-right text-[12px] transition-transform duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((product: any, i: number) => (
              <Reveal key={product.slug} delay={i * 70} as="div" className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by category ─────────────────────────────────── */}
      <section className="bg-alt py-16 md:py-24">
        <div className="section">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.015em] text-ink">
                Shop by category.
              </h2>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 text-[17px] text-accent transition-colors duration-[120ms] hover:underline"
              >
                See all inventory
                <i
                  className="fa-solid fa-chevron-right text-[12px] transition-transform duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Reveal>

          <div className="rail mt-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.type}
                href={`/shop?type=${encodeURIComponent(cat.type)}`}
                className="group flex w-[86px] shrink-0 flex-col items-center gap-2.5"
              >
                <span className="grid h-[50px] w-[50px] shrink-0 place-items-center overflow-hidden rounded-full bg-line-soft ring-1 ring-black/5 transition-transform duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                  <Image
                    src={cat.image}
                    alt={cat.type}
                    width={50}
                    height={50}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="text-center text-[12px] font-medium leading-tight text-ink transition-colors duration-[120ms] group-hover:text-accent">
                  {cat.type}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why us ───────────────────────────────────────────── */}
      <section className="bg-alt py-16 md:py-24">
        <div className="section">
          <Reveal>
            <h2 className="max-w-[16ch] text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink">
              Buying used shouldn&apos;t feel like a gamble.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {WHY.map((item, i) => (
              <Reveal key={item.title} delay={i * 80} as="div">
                <h3 className="text-[21px] font-semibold tracking-[-0.01em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-muted">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <Link
              href="/why-buy-from-us"
              className="group mt-12 inline-flex items-center gap-1.5 text-[17px] text-accent transition-colors duration-[120ms] hover:underline"
            >
              Why buy from us
              <i
                className="fa-solid fa-chevron-right text-[12px] transition-transform duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Lifestyle split ──────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="section grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal className="order-2 md:order-1">
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.015em] text-ink">
              The lot on Michigan Ave.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              Tony started wrenching on campers out of a two-bay garage in
              2009. Today the family runs {SITE.address.split(",")[0]} with the
              same rule: nothing leaves the lot until we&apos;d camp in it
              ourselves.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              Walk the inventory, sleep in the bunks, run the A/C. Or buy the
              whole thing online in about five minutes.
            </p>
            <Link href="/about" className="btn btn-secondary mt-8">
              Our story
            </Link>
          </Reveal>

          <Reveal delay={100} className="order-1 md:order-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-alt">
              <Image
                src="/images/about-family.jpg"
                alt="A family relaxing outside their camper"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats (black band) ───────────────────────────────── */}
      <section className="bg-graphite py-16 text-white md:py-24">
        <div className="section">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70} as="div">
                <p className="text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none tracking-[-0.02em]">
                  {stat.value}
                </p>
                <p className="mt-3 max-w-[22ch] text-[15px] leading-snug text-white/60">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="section">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.015em] text-ink">
                What buyers say.
              </h2>
              <p className="text-[15px] text-muted">
                <span className="font-semibold text-ink">{average}</span> average
                from {count} verified reviews
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {reviews.slice(0, 3).map((review: any, i: number) => (
              <Reveal key={review.name} delay={i * 80} as="div">
                <figure className="flex h-full flex-col rounded-card border border-line-soft bg-white p-7">
                  <div
                    className="text-[13px] text-accent"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, star) => (
                      <i
                        key={star}
                        className={
                          star < review.rating
                            ? "fa-solid fa-star"
                            : "fa-regular fa-star"
                        }
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-ink-soft">
                    <p className="font-medium">{review.title}</p>
                    <p className="mt-2 text-muted">{review.body}</p>
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line-soft pt-4 text-[13px] text-muted">
                    <span className="font-medium text-ink">{review.name}</span> ·{" "}
                    {review.city}
                    {review.purchased ? ` · ${review.purchased}` : ""}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-10 flex justify-center">
              <Link href="/testimonials" className="btn btn-secondary">
                Read all reviews
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────────── */}
      <section className="bg-graphite-2 py-20 text-white md:py-28">
        <div className="section text-center">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.875rem,4.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
              Your next camper is already on the lot.
            </h2>
          </Reveal>
          <Reveal delay={90}>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-relaxed text-white/60">
              Reserve online with a payment method that works for you — we&apos;ll
              email the details and hold the unit for 48 hours.
            </p>
          </Reveal>
          <Reveal delay={170}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Browse inventory
              </Link>
              <Link href="/contact" className="btn btn-lg text-white underline-offset-4 hover:underline">
                Talk to a specialist
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────── */}
      <section className="bg-alt py-12">
        <div className="section grid gap-8 text-center sm:grid-cols-3">
          {[
            { title: "Free pickup in Detroit", body: "Mon – Sat, by appointment" },
            { title: `From ${money(9450)}`, body: "Affordable entry-level units in stock" },
            { title: "Trade-ins welcome", body: "Valuation in under 15 minutes" },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-[15px] font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-[13px] text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
