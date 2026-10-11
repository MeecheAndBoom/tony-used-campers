import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { money } from "@/lib/format";
import { getProducts } from "@/lib/products";
import { getReviews, ratingSummary } from "@/lib/reviews";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { HeroVideo } from "@/components/site/HeroVideo";
import { getSettings } from "@/lib/settings";
import { getCategories } from "@/lib/categories";
import { getBlogPosts } from "@/lib/blog";
import { getDeliveries } from "@/lib/deliveries";
import { DeliveryStrip } from "@/components/site/DeliveryStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd, websiteJsonLd, blogJsonLd } from "@/lib/seo";
import type { Product, Review } from "@/lib/types";
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

const STATIC_STATS_BEFORE_RATING = [
  { value: "120", label: "Point inspection on every unit" },
  { value: "700+", label: "Campers delivered since 2015" },
];
const STAT_AFTER_RATING = { value: "48 hrs", label: "Typical payment-to-pickup time" };

export default async function HomePage() {
  const [featured, reviews, categories, posts, deliveries] = await Promise.all([
    getProducts({ featured: true }),
    getReviews(),
    getCategories(),
    getBlogPosts(),
    getDeliveries(),
  ]);
  const { site } = await getSettings();
  const shown = featured.slice(0, 4);
  const stripDeliveries = deliveries.filter((d) => d.featured).slice(0, 10);
  const { average, count } = ratingSummary(reviews);
  const STATS = [
    ...STATIC_STATS_BEFORE_RATING,
    { value: String(average), label: `Average rating from ${count} reviews` },
    STAT_AFTER_RATING,
  ];

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={localBusinessJsonLd(site, { average, count })} />
      <JsonLd data={blogJsonLd(posts)} />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pb-16 pt-16 md:pb-24 md:pt-24">
        {/* Looping background video — poster covers it if autoplay is blocked.
            Video stays in the repo (static, never changes); images are on Cloudinary. */}
        <HeroVideo
          src="/video/rv-road.mp4"
          poster="https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/hero-road.jpg"
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
              Inspected, honestly priced and sold from Detroit since 2015.
              Shop {site.location.split(",")[0]}&apos;s best-stocked lot of
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

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?type=${encodeURIComponent(cat.name)}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-transparent">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-contain transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-center text-[14px] font-medium leading-tight text-ink transition-colors duration-[120ms] group-hover:text-accent">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
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
            {shown.map((product: Product, i: number) => (
              <Reveal key={product.slug} delay={i * 70} as="div" className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fresh off the lot ───────────────────────────────── */}
      {stripDeliveries.length > 0 && (
        <section className="bg-white pb-16 md:pb-24">
          <div className="section">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.015em] text-ink">
                  Fresh off the lot.
                </h2>
                <Link
                  href="/testimonials#deliveries"
                  className="group inline-flex items-center gap-1.5 text-[17px] text-accent transition-colors duration-[120ms] hover:underline"
                >
                  See every delivery
                  <i
                    className="fa-solid fa-chevron-right text-[12px] transition-transform duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={90} className="mt-10">
              <DeliveryStrip deliveries={stripDeliveries} />
            </Reveal>
          </div>
        </section>
      )}

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
              2015. Today the family runs {site.address.split(",")[0]} with the
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
                src="https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/deliveries/jayco-eagle-ht-hitched.webp"
                alt="Customers hitched up with their fifth wheel on delivery day"
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
            {reviews.slice(0, 3).map((review: Review, i: number) => (
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
