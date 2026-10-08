"use client";

import { useState } from "react";

export function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="border-b border-line">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-medium tracking-[-0.01em] text-ink transition-colors duration-[120ms] hover:text-accent"
              >
                {item.question}
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-alt text-[13px] text-ink-soft transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-45 bg-sky text-accent" : ""
                  }`}
                  aria-hidden="true"
                >
                  <i className="fa-solid fa-plus" />
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-[680px] pb-6 text-[16px] leading-[1.65] text-muted">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
