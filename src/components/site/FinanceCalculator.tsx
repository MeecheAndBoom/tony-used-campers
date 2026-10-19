"use client";

import { useState } from "react";
import { money } from "@/lib/format";

/** Every combination must clear this monthly payment. */
const PAYMENT_FLOOR = 350;
const DOWN_MIN = 500;

/** Whichever setup you pick, the headline payment never drops below this. */
function rateForTerm(term: number): number {
  if (term <= 12) return 6.99;
  if (term <= 24) return 7.24;
  if (term <= 36) return 7.49;
  if (term <= 48) return 7.74;
  if (term <= 60) return 7.99;
  return 8.24;
}

function monthlyPayment(principal: number, term: number, ratePct: number): number {
  if (principal <= 0 || term <= 0) return 0;
  const r = ratePct / 100 / 12;
  if (r === 0) return principal / term;
  return (principal * r) / (1 - Math.pow(1 + r, -term));
}

/**
 * Term choices are dense at the short end. The longest term we ever offer is
 * the one whose payment (at that rate) still clears PAYMENT_FLOOR; anything
 * longer would dip below it.
 */
const TERM_CANDIDATES = [3, 4, 5, 6, 9, 12, 15, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];

export function FinanceCalculator() {
  const [price, setPrice] = useState(12000);
  const [down, setDown] = useState(2000);
  const [term, setTerm] = useState(60);

  const downMax = Math.min(price * 0.6, 40000);
  const effectiveDown = Math.min(Math.max(down, DOWN_MIN), downMax);
  const principal = Math.max(price - effectiveDown, 0);

  // Only terms that keep this balance at >= $350/mo stay selectable.
  const affordable = TERM_CANDIDATES.filter(
    (m) => monthlyPayment(principal, m, rateForTerm(m)) >= PAYMENT_FLOOR,
  );
  const minTerm = affordable.length ? affordable[0] : TERM_CANDIDATES[0];
  const maxTerm = affordable.length
    ? affordable[affordable.length - 1]
    : TERM_CANDIDATES[0];
  const effectiveTerm = Math.min(Math.max(term, minTerm), maxTerm);
  const rate = rateForTerm(effectiveTerm);
  const payment = monthlyPayment(principal, effectiveTerm, rate);

  const sliders: {
    id: string;
    label: string;
    value: number;
    set: (v: number) => void;
    min: number;
    max: number;
    step: number;
    format: (v: number) => string;
  }[] = [
    {
      id: "price",
      label: "Camper price",
      value: price,
      set: setPrice,
      min: 4000,
      max: 90000,
      step: 500,
      format: (v) => money(v),
    },
    {
      id: "down",
      label: "Down payment",
      value: effectiveDown,
      set: setDown,
      min: DOWN_MIN,
      max: downMax,
      step: 250,
      format: (v) => money(v),
    },
    {
      id: "term",
      label: "Term",
      value: effectiveTerm,
      set: setTerm,
      min: minTerm,
      max: maxTerm,
      step: 1,
      format: (v) => `${v} months`,
    },
  ];

  return (
    <div className="rounded-card border border-line p-6 md:p-8">
      <div className="space-y-7">
        {sliders.map((slider) => (
          <div key={slider.id}>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={`calc-${slider.id}`}
                className="text-[14px] font-medium text-ink"
              >
                {slider.label}
              </label>
              <span className="text-[15px] font-semibold text-ink">
                {slider.format(slider.value)}
              </span>
            </div>
            <input
              id={`calc-${slider.id}`}
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={slider.value}
              onChange={(e) => slider.set(Number(e.target.value))}
              className="mt-3 w-full cursor-pointer accent-[#0071e3]"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-card bg-alt p-6 text-center">
        <p className="text-[14px] text-muted">Estimated monthly payment</p>
        <p className="mt-1 text-[clamp(2.25rem,5vw,3rem)] font-semibold leading-none tracking-[-0.03em] text-ink">
          {money(payment, true)}
        </p>
        {principal > 0 && (
          <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
            Financing {money(principal)} over {effectiveTerm} months keeps the
            estimate at or above{" "}
            <span className="font-medium text-ink">
              {money(PAYMENT_FLOOR)}/mo
            </span>
            . Terms are capped for smaller balances so the minimum is never
            missed.
          </p>
        )}
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          {rate.toFixed(2)}% illustrative APR over {effectiveTerm} months on{" "}
          {money(principal)} financed. Estimate only — your actual rate depends
          on credit. See our{" "}
          <a href="/legal/finance-disclosure" className="text-accent underline">
            finance disclosure
          </a>
          .
        </p>
      </div>
    </div>
  );
}
