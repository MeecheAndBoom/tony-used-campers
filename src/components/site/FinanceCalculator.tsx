"use client";

import { useState } from "react";
import { money } from "@/lib/format";

const RATES = [
  { label: "60 months", rate: 7.49 },
  { label: "72 months", rate: 7.99 },
  { label: "84 months", rate: 8.49 },
  { label: "120 months", rate: 8.99 },
];

export function FinanceCalculator() {
  const [price, setPrice] = useState(24500);
  const [down, setDown] = useState(3000);
  const [term, setTerm] = useState(72);
  const rate = RATES.find((r) => r.label.startsWith(String(term)))?.rate ?? 7.99;

  const principal = Math.max(price - down, 0);
  const monthlyRate = rate / 100 / 12;
  const n = term;
  const payment =
    principal === 0
      ? 0
      : monthlyRate === 0
        ? principal / n
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));

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
      min: 5000,
      max: 90000,
      step: 500,
      format: (v) => money(v),
    },
    {
      id: "down",
      label: "Down payment",
      value: down,
      set: setDown,
      min: 0,
      max: Math.min(price * 0.6, 40000),
      step: 250,
      format: (v) => money(v),
    },
    {
      id: "term",
      label: "Term",
      value: term,
      set: setTerm,
      min: 60,
      max: 120,
      step: 12,
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
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          {rate.toFixed(2)}% illustrative APR over {term} months on{" "}
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
