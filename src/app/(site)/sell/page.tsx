import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SellForm } from "@/components/site/SellForm";

export const metadata: Metadata = {
  title: "Sell or Trade Your Camper",
  description:
    "Get a written valuation for your used camper or RV — cash offer or trade credit, answered within one business day.",
};

const PROCESS = [
  {
    title: "Send the details",
    body: "Year, make, model and honest condition. Photos help but aren't required for a first estimate.",
  },
  {
    title: "Get a written number",
    body: "We compare against live auction data and our own retail sales, then send a real figure — valid for 14 days.",
  },
  {
    title: "Cash or trade credit",
    body: "Take the cash offer, or apply it to anything on the lot for an extra $500 of credit. We handle all the paperwork.",
  },
];

export default function SellPage() {
  return (
    <div className="bg-white">
      <section className="section pb-12 pt-16 md:pt-24">
        <Reveal>
          <h1 className="max-w-[820px] text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            Sell us your camper.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-5 max-w-[640px] text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-relaxed text-muted">
            Trade-in, consignment or straight cash — we buy campers the same
            way we sell them: written number, no games, answer in one business
            day.
          </p>
        </Reveal>
      </section>

      <Reveal delay={150} className="section">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-alt">
          <Image
            src="https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/life-lot.jpg"
            alt="Campers lined up on the Tony Used Campers lot"
            fill
            priority
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover"
          />
        </div>
      </Reveal>

      {/* 3-step process */}
      <section className="section pt-16 md:pt-24">
        <div className="grid gap-10 md:grid-cols-3">
          {PROCESS.map((step, i) => (
            <Reveal key={step.title} delay={i * 90}>
              <div className="border-t-2 border-ink pt-5">
                <p className="text-[13px] font-semibold text-accent">Step {i + 1}</p>
                <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h2>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="mt-16 bg-alt py-16 md:mt-24 md:py-24">
        <div className="section grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                What&apos;s it worth?
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">
                Fill this in and we&apos;ll come back with a written
                valuation. Prefer to talk it through?{" "}
                <Link href="/contact" className="text-accent hover:underline">
                  Contact the lot
                </Link>{" "}
                or call{" "}
                <a href="tel:+13135550142" className="text-accent hover:underline">
                  (313) 555-0142
                </a>
                .
              </p>
            </Reveal>
            <Reveal delay={150}>
              <ul className="mt-8 space-y-3 text-[15px]">
                {[
                  "No obligation — the estimate is free",
                  "We buy motorhomes, trailers, vans and pop-ups",
                  "Non-running units still have value",
                  "Paperwork and title transfer handled by us",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <i className="fa-solid fa-check mt-1 text-[13px] text-accent" aria-hidden="true" />
                    <span className="text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div className="rounded-card bg-white p-6 md:p-8">
              <SellForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
