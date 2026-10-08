import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "First-Time Buyer's Guide",
  description:
    "What to know before buying your first used camper — sizes, classes, budgets, inspection basics and what happens at the lot.",
};

const SECTIONS = [
  {
    id: "class",
    title: "Start with how you'll use it",
    body: [
      "Before looking at a single listing, answer one question honestly: where will you sleep? Weekends at state parks, two-week cross-country runs, and tailgating at Ford Field are three completely different campers.",
      "Weekend warriors who stay in campgrounds with hookups do well with lightweight travel trailers under 24 feet — easy to tow, cheap to store, enough room for a family of four. Full-timers and long-trip people should look at fifth wheels or Class A motorhomes with real storage. If you mostly want a base camp you drive to, a camper van or Class C is the move.",
    ],
  },
  {
    id: "towing",
    title: "Tow vehicle math comes first",
    body: [
      "Every listing tells you the weight. Your vehicle's door jamb sticker tells you what you can pull — and the honest number is the lower of the two when the trailer is fully loaded with your water, gear and food.",
      "Rule of thumb: keep the loaded trailer under 80% of your tow vehicle's capacity for a comfortable first year. A half-ton truck opens up most 24–28 foot trailers; a midsize SUV is happier under 5,000 lb. If you don't have a tow vehicle, budget for one before you budget for the camper.",
    ],
  },
  {
    id: "budget",
    title: "Budget beyond the sticker",
    body: [
      "The purchase price is roughly two-thirds of year-one cost. The rest: insurance ($800–1,500 annually), storage if your driveway won't work ($100–250/month), hitch and weight-distribution setup ($600–1,200), and the first round of hoses, levels, batteries and blocks ($300–500).",
      "Used is where the value is. A three-year-old camper typically sells for 70–75% of what it cost new — and someone else already absorbed the steepest part of the depreciation curve and found whatever the warranty had to fix.",
    ],
  },
  {
    id: "inspection",
    title: "What to inspect (beyond our 120 points)",
    body: [
      "Water is the enemy. Check the roof for cracked sealant, the ceiling inside for staining or soft spots, and around every window and door for caulk that's pulled away. Run every faucet and flush every toilet — then look underneath for drips.",
      "Then the systems: run the fridge on both propane and electric, fire the furnace and the water heater, extend and retract every slide twice, run the awning out and back, and test every outlet and the GFCI. Turn the water pump on and walk away for ten minutes — listen for it cycling when nothing is running.",
      "And the unglamorous parts: tire date codes (replace anything over seven years regardless of tread), bearing play on the hubs, brake condition, and the underside for rust that goes deeper than surface scale. Michigan winters are hard on frames — we show you the underside on every unit.",
    ],
  },
  {
    id: "paperwork",
    title: "Paperwork without surprises",
    body: [
      "You need three things: a clean title in the seller's name that matches their ID, a bill of sale with the VIN, and — in Michigan — a title transfer filed within 15 days. Sales tax is due at registration, not at the sale.",
      "Get any promised repairs or warranty coverage in writing on the bill of sale. Verbal promises evaporate the moment the keys change hands. Ask specifically for the inspection report, maintenance records and any recall completions.",
    ],
  },
  {
    id: "first-visit",
    title: "Your first visit to our lot",
    body: [
      "Come with comfortable shoes and about 90 minutes. Start by climbing inside two or three units — you'll learn your deal-breakers faster from standing in them than from scrolling photos. We'll pull out the inspection report for anything you're serious about.",
      "There's no appointment needed and no pressure to decide. Most first-timers visit twice: once to narrow down the class, once to pick the unit. That's the right pace for something you'll tow for a decade.",
    ],
  },
];

const GLOSSARY = [
  { term: "GVWR", definition: "Gross vehicle weight rating — the maximum loaded weight of the trailer, axle rating included." },
  { term: "Hitch weight", definition: "The downward force the trailer puts on your tow hitch. Determines which weight-distribution setup you need." },
  { term: "Slide-out", definition: "A wall section that extends outward at camp to add interior floor space." },
  { term: "Dry weight", definition: "Weight with no fluids or gear — always lower than what you'll actually tow." },
  { term: "30-amp / 50-amp", definition: "Shore power service levels. 30-amp is standard for most trailers; 50-amp supports two AC units." },
  { term: "Black / gray tank", definition: "Wastewater holding tanks — black is the toilet, gray is sinks and shower." },
];

export default function FirstTimeBuyersPage() {
  return (
    <div className="bg-white">
      <section className="section pb-12 pt-16 md:pt-24">
        <Reveal>
          <h1 className="max-w-[880px] text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            Your first camper, without the guesswork.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-5 max-w-[640px] text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-relaxed text-muted">
            Everything we&apos;d tell you standing on the lot — tow math,
            inspection tricks, real budgets — in one place. Read it before you
            browse, then come argue with us about it.
          </p>
        </Reveal>
      </section>

      <Reveal delay={150} className="section">
        <div className="relative aspect-[16/9] overflow-hidden rounded-card bg-alt">
          <Image
            src="/images/gallery-lounge.jpg"
            alt="Inside a travel trailer with the dinette set up"
            fill
            priority
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="object-cover"
          />
        </div>
      </Reveal>

      <section className="section grid gap-12 pb-16 pt-16 md:pb-20 lg:grid-cols-[220px_1fr] lg:gap-16">
        {/* Sticky TOC */}
        <nav aria-label="Guide contents" className="hidden lg:block">
          <ul className="sticky top-24 space-y-3 text-[15px]">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {section.title}
                </a>
              </li>
            ))}
            <li>
              <a href="#glossary" className="text-accent hover:underline">
                Glossary
              </a>
            </li>
          </ul>
        </nav>

        <div className="max-w-[720px] space-y-14">
          {SECTIONS.map((section) => (
            <Reveal key={section.id} as="article">
              <h2
                id={section.id}
                className="scroll-mt-24 text-[clamp(1.5rem,3vw,2.125rem)] font-semibold leading-[1.15] tracking-[-0.015em]"
              >
                {section.title}
              </h2>
              <div className="mt-4 space-y-5 text-[17px] leading-[1.7] text-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          ))}

          {/* Glossary */}
          <Reveal as="article">
            <h2
              id="glossary"
              className="scroll-mt-24 text-[clamp(1.5rem,3vw,2.125rem)] font-semibold tracking-[-0.015em]"
            >
              Six words worth knowing.
            </h2>
            <dl className="mt-6 border-t border-line">
              {GLOSSARY.map((row) => (
                <div
                  key={row.term}
                  className="grid gap-1 border-b border-line-soft py-4 sm:grid-cols-[160px_1fr] sm:gap-6"
                >
                  <dt className="text-[15px] font-semibold text-ink">
                    {row.term}
                  </dt>
                  <dd className="m-0 text-[15px] leading-relaxed text-muted">
                    {row.definition}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-graphite py-16 md:py-20">
        <div className="section text-center">
          <Reveal>
            <h2 className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              Ready to walk the lot?
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-white/60">
              Bring this guide and your tow vehicle&apos;s numbers. We&apos;ll
              do the math with you.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn btn-primary btn-lg">
                Browse campers
              </Link>
              <Link href="/contact" className="btn btn-lg bg-white/10 text-white hover:bg-white/20">
                Ask a question
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
