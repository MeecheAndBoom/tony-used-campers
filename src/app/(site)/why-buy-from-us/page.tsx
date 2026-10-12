import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Why Buy From Us",
  description:
    "120-point inspections, straight pricing, written warranties and free Michigan delivery — why buyers choose Tony Used Campers.",
};

const REASONS = [
  {
    icon: "fa-clipboard-check",
    title: "120-point inspection, in writing",
    body: "Roof seals, brakes, appliances, slides, tires, propane — every unit gets a full report before it hits the front row. You read it before you pay.",
  },
  {
    icon: "fa-tag",
    title: "The price is the price",
    body: "No doc fees, no 'market adjustment,' no mandatory finance products. What's on the card is what we take.",
  },
  {
    icon: "fa-file-signature",
    title: "90-day limited warranty",
    body: "Most units ship with in-house powertrain and appliance coverage. Third-party plans are honored and serviced right here.",
  },
  {
    icon: "fa-truck",
    title: "Free Lower-Peninsula delivery",
    body: "Take it home from Michigan Ave or have us bring it to you — with a full setup walkthrough when we arrive.",
  },
  {
    icon: "fa-rotate-left",
    title: "3-day exchange window",
    body: "Sleep on it. Within three days and under 300 miles, swap for another unit on the lot — no restocking games.",
  },
  {
    icon: "fa-phone",
    title: "You get a human",
    body: "One specialist owns your order from first call to handoff. Call the lot, get their direct line, skip the queue.",
  },
];

export default async function WhyBuyFromUsPage() {
  const featured = (await getProducts({ featured: true })).slice(0, 3);

  return (
    <div className="bg-white">
      <section className="section pb-14 pt-16 md:pt-24">
        <Reveal>
          <h1 className="max-w-[820px] text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            Six reasons people come back.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-5 max-w-[640px] text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-relaxed text-muted">
            Anyone can sell you a camper. Here&apos;s what happens after the
            sale — and before it — that keeps 70% of our business referral
            traffic.
          </p>
        </Reveal>
      </section>

      <Reveal delay={150} className="section">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-alt">
          <Image
            src="https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/hero-road.jpg"
            alt="A camper parked at a Michigan campsite at golden hour"
            fill
            priority
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <section className="section section-pad">
        <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <Reveal key={reason.title} delay={(i % 3) * 80}>
              <div className="border-t border-line pt-5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-sky text-[15px] text-accent">
                  <i className={`fa-solid ${reason.icon}`} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.01em]">
                  {reason.title}
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                  {reason.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Comparison strip */}
      <section className="bg-alt py-16 md:py-24">
        <div className="section">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.02em]">
              What&apos;s included with every unit.
            </h2>
          </Reveal>
          <div className="mt-8 overflow-hidden rounded-card bg-white">
            {[
              "120-point written inspection report",
              "Professional detailing inside and out",
              "Fresh oil change and propane test",
              "90-day limited powertrain & appliance warranty",
              "Delivery + setup walkthrough (Lower Peninsula)",
              "One specialist assigned to your order",
              "3-day / 300-mile exchange window",
              "First service visit at 30 days, free",
            ].map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-3.5 px-5 py-4 text-[15px] sm:px-7 ${
                  i ? "border-t border-line-soft" : ""
                }`}
              >
                <i className="fa-solid fa-check text-[13px] text-accent" aria-hidden="true" />
                <span className="text-ink">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section section-pad">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.02em]">
                Ready to see for yourself?
              </h2>
              <Link href="/shop" className="text-[16px] text-accent hover:underline">
                All campers →
              </Link>
            </div>
          </Reveal>
          <div className="mt-9 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
