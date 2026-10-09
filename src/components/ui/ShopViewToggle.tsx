"use client";

import { useEffect } from "react";
import {
  persistShopView,
  readShopView,
  useShopView,
  type ShopView,
} from "@/store/shopView";

const VIEWS: { id: ShopView; icon: string; label: string }[] = [
  { id: "grid", icon: "fa-th-large", label: "Normal grid" },
  { id: "compact", icon: "fa-table-cells", label: "Compact grid" },
  { id: "list", icon: "fa-list", label: "List" },
];

const seg = (on: boolean) =>
  `grid h-9 w-9 place-items-center rounded-box text-[13px] transition-colors duration-[120ms] ${
    on ? "bg-ink text-white" : "text-ink-soft hover:bg-alt-deep"
  }`;

export function ShopViewToggle() {
  const view = useShopView((s) => s.view);
  const setView = useShopView((s) => s.setView);

  // Apply the saved preference only after mount (avoids SSR hydration drift).
  useEffect(() => {
    setView(readShopView());
  }, [setView]);

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-[13px] text-muted md:inline">View</span>
      <div
        className="flex items-center rounded-pill border border-line bg-white p-1"
        role="group"
        aria-label="Product view"
      >
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-label={v.label}
            title={v.label}
            aria-pressed={view === v.id}
            onClick={() => {
              setView(v.id);
              persistShopView(v.id);
            }}
            className={seg(view === v.id)}
          >
            <i className={`fa-solid ${v.icon}`} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}