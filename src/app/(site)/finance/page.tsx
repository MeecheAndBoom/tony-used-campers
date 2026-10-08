import type { Metadata } from "next";
import Link from "next/link";
import { FinanceCalculator } from "@/components/site/FinanceCalculator";
import { FinanceForm } from "@/components/site/FinanceForm";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Financing",
  description:
    "Estimate monthly payments and request financing for a used camper — Tony Used Campers, Detroit.",
};

const STEPS = [
  {
    title: "Ask for options",
    body: "Send the form with the unit you're eyeing. We reply with terms from our lender panel — usually same day.",
  },
  {
    title: "Pick your terms",
    body: "Choose your term and down payment. Soft credit inquiry first; the hard pull happens only when you apply.",
  },
  {
    title: "Sign and pick up",
    body: "E-sign the docs, we handle the rest, and your camper is ready for pickup — often within 48 hours.",
  },
];

export default function FinancePage() {
  return (
    <div className="bg-white">
      <section className="section pb-12 pt-16 md:pt-24">
        <Reveal>
          <h1 className="max-w-[820px] text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-ink">
            Payments that fit the trip.
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-5 max-w-[640px] text-[clamp(1.0625rem,1.8vw,1.3125rem)] leading-relaxed text-muted">
            Roughly two-thirds of our buyers finance. Here&apos;s what it
            costs, how long it takes, and how to ask — no rate shopping your
            credit to death.
          </p>
        </Reveal>
      </section>

      <section className="section grid gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold tracking-[-0.015em]">
              Estimate your payment
            </h2>
            <div className="mt-6">
              <FinanceCalculator />
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.125rem)] font-semibold tracking-[-0.015em]">
              How it works
            </h2>
            <ol className="mt-6">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5 border-b border-line-soft py-5 last:border-0">
                  <span className="text-[15px] font-semibold text-accent">0{i + 1}</span>
                  <div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-card bg-alt p-5 text-[14px] leading-relaxed text-muted">
              <strong className="font-semibold text-ink">Straight facts:</strong>{" "}
              rates currently run 7.49%–8.99% APR depending on term and credit,
              with 10–20% down typical. Rates are subject to change without
              notice — see the{" "}
              <Link href="/legal/finance-disclosure" className="text-accent underline">
                finance disclosure
              </Link>
              .
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-alt py-16 md:py-24">
        <div className="section grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                Request financing options
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">
                Tell us your budget and which camper caught your eye. One
                specialist owns the thread — no handoffs, no call queue.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150}>
            <div className="rounded-card bg-white p-6 md:p-8">
              <FinanceForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
