"use client";

import { useState } from "react";

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";

type Method = { id: string; label: string; hint: string };

/** Add/remove payment methods; posts rows via repeated methodId/methodLabel/methodHint inputs. */
export function PaymentMethodsEditor({ initial }: { initial: Method[] }) {
  const [rows, setRows] = useState<Method[]>(
    initial.length ? initial : [{ id: "", label: "", hint: "" }],
  );

  const update = (index: number, patch: Partial<Method>) =>
    setRows((list) =>
      list.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={i} className="rounded-box border border-line-soft p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <input
                name="methodId"
                value={row.id}
                onChange={(e) => update(i, { id: e.target.value })}
                placeholder="Unique id, e.g. zelle"
                className={FIELD}
              />
            </div>
            <button
              type="button"
              onClick={() => setRows((list) => list.filter((_, idx) => idx !== i))}
              className="shrink-0 text-[13px] text-danger hover:underline"
            >
              Remove
            </button>
          </div>
          <div className="mt-3 space-y-3">
            <input
              name="methodLabel"
              value={row.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Label shown at checkout, e.g. Zelle"
              className={FIELD}
            />
            <input
              name="methodHint"
              value={row.hint}
              onChange={(e) => update(i, { hint: e.target.value })}
              placeholder="One-line hint, e.g. Pay directly from your bank app."
              className={FIELD}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((list) => [...list, { id: "", label: "", hint: "" }])}
        className="text-[14px] text-accent hover:underline"
      >
        + Add payment method
      </button>
    </div>
  );
}