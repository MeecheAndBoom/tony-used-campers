"use client";

import { useState } from "react";

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";

type HoursRow = { days: string; time: string };

/** Add/remove opening-hours rows; posts via repeated hoursDays/hoursTime inputs. */
export function HoursEditor({ initial }: { initial: HoursRow[] }) {
  const [rows, setRows] = useState<HoursRow[]>(
    initial.length ? initial : [{ days: "", time: "" }],
  );

  const update = (index: number, key: "days" | "time", value: string) =>
    setRows((list) =>
      list.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            name="hoursDays"
            value={row.days}
            onChange={(e) => update(i, "days", e.target.value)}
            placeholder="Days, e.g. Monday – Friday"
            className={FIELD}
          />
          <input
            name="hoursTime"
            value={row.time}
            onChange={(e) => update(i, "time", e.target.value)}
            placeholder="Hours, e.g. 9:00 AM – 6:00 PM"
            className={FIELD}
          />
          <button
            type="button"
            onClick={() => setRows((list) => list.filter((_, idx) => idx !== i))}
            className="shrink-0 text-[13px] text-danger hover:underline"
            aria-label="Remove hours row"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((list) => [...list, { days: "", time: "" }])}
        className="text-[14px] text-accent hover:underline"
      >
        + Add hours row
      </button>
    </div>
  );
}