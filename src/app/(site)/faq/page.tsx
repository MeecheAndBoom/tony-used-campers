import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about buying used campers, inspections, delivery, payment, trade-ins and service — Tony Used Campers.",
};

const BUYING = [
  {
    question: "How do I know a used camper isn't hiding problems?",
    answer:
      "Every unit on our lot passes a 120-point inspection covering roof seals, water intrusion, brakes, bearings, appliances, slide-outs and propane systems. You get the written report — including the items we repaired — before you pay anything. We also encourage your own inspection on any unit, any time.",
  },
  {
    question: "Are your prices negotiable?",
    answer:
      "The price on the card is what we take — there's no inflated list waiting to be haggled down. Trade-ins are where the negotiation happens: we'll value your current unit in writing and the number moves based on its condition, not on how the sales conversation feels.",
  },
  {
    question: "Can I have the camper inspected by my own mechanic?",
    answer:
      "Yes. Bring your inspector to Michigan Ave or take the unit to your own shop within the first three days. We'd rather you be certain than fast.",
  },
  {
    question: "Do you sell new campers?",
    answer:
      "No — used and certified pre-owned only. It keeps us honest about value: our job is finding you the best three-year-old unit for the money, not moving this year's overstock.",
  },
];

const PAYING = [
  {
    question: "How does payment work?",
    answer:
      "Place your order online or on the lot, and we email payment details within one business day — card link, Zelle, cashier's check or bank transfer. Once payment is confirmed we run the final prep and hand off your camper, typically within 48 hours. Nothing is charged through this website.",
  },
  {
    question: "Do you offer financing?",
    answer:
      "Yes. We work with a panel of RV lenders; terms currently run 60–120 months with rates from 7.49% APR depending on credit. Start with the estimator on our financing page — a soft inquiry only until you formally apply.",
  },
  {
    question: "What forms of payment do you accept?",
    answer:
      "Credit and debit cards (via secure link), Zelle, cashier's checks and bank transfers, and in-person payment at the lot. For Other payment types — money orders, in-house arrangements — tell us at checkout and we'll call you to set it up.",
  },
  {
    question: "Can I trade in my current camper?",
    answer:
      "Absolutely. Send the details through our Sell Your Camper page and you'll have a written valuation within one business day. Trade credit adds $500 over the cash offer.",
  },
];

const DELIVERY = [
  {
    question: "Do you deliver, and what does it cost?",
    answer:
      "Delivery anywhere in Michigan's Lower Peninsula is free, including a full setup walkthrough when the unit arrives. Outside the Lower Peninsula, we quote delivery case by case — ask when you order.",
  },
  {
    question: "How long after payment until I get the camper?",
    answer:
      "Most orders are ready within 48 hours of payment confirmation: final inspection, detailing, propane and systems test, then pickup or delivery scheduling. Larger units needing parts work are quoted up front with a date.",
  },
  {
    question: "What if something breaks after I buy?",
    answer:
      "Most units include a 90-day limited powertrain and appliance warranty serviced here in Detroit. Third-party warranties are honored as well. Your first service visit at 30 days is free — bring it back and we'll check everything over.",
  },
  {
    question: "Can I return a camper?",
    answer:
      "We offer a 3-day / 300-mile exchange window on most units — swap for another camper on the lot. Refund terms are spelled out in our returns policy; like most vehicle dealers, completed sales are exchanges rather than refunds.",
  },
];

export default async function FAQPage() {
  const { site } = await getSettings();
  const groups = [
    { title: "Buying", items: BUYING },
    { title: "Paying", items: PAYING },
    { title: "Delivery & after", items: DELIVERY },
  ];

  return (
    <div className="bg-white">
      <section className="section pb-10 pt-16 md:pt-24">
        <Reveal>
          <h1 className="text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Questions, answered straight.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-4 max-w-[600px] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-muted">
            The things people ask on the phone every week — written down so
            you don&apos;t have to.
          </p>
        </Reveal>
      </section>

      <section className="section grid gap-12 pb-20 md:pb-28 lg:grid-cols-[200px_1fr] lg:gap-16">
        <nav aria-label="FAQ sections" className="hidden lg:block">
          <ul className="sticky top-24 space-y-3 text-[15px]">
            {groups.map((group) => (
              <li key={group.title}>
                <a
                  href={`#${group.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {group.title}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="text-accent hover:underline"
              >
                Still stuck? Ask us
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-14">
          {groups.map((group) => (
            <div
              key={group.title}
              id={group.title.toLowerCase().replace(/[^a-z]+/g, "-")}
            >
              <h2 className="mb-5 text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.015em]">
                {group.title}
              </h2>
              <Accordion items={group.items} />
            </div>
          ))}

          <div className="rounded-card bg-alt p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Not covered here?
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Call{" "}
              <a
                href={`tel:${site.phoneHref}`}
                className="text-accent hover:underline"
              >
                {site.phone}
              </a>{" "}
              or send a message — we answer within one business day.
            </p>
            <Link href="/contact" className="btn btn-primary mt-5">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
