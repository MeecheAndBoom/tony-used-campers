"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_TYPES } from "@/lib/constants";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "year-desc", label: "Newest year" },
] as const;

export function ShopFilters({
  brands,
  count,
}: {
  brands: string[];
  count: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const active = (key: string) => params.get(key) ?? "";

  function set(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const chip = (on: boolean) =>
    `rounded-pill px-4 py-2 text-[14px] font-medium transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95 ${
      on
        ? "bg-ink text-white"
        : "bg-alt text-ink-soft hover:bg-alt-deep"
    }`;

  return (
    <div className="sticky top-12 z-30 -mx-6 border-b border-line-soft bg-white/85 px-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 py-5">
        {/* Type chips */}
        <div className="rail" role="group" aria-label="Filter by type">
          <button
            type="button"
            onClick={() => set("type", "")}
            className={chip(!active("type"))}
          >
            All campers
          </button>
          {PRODUCT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => set("type", active("type") === type ? "" : type)}
              className={chip(active("type") === type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Brand select */}
          <label className="flex items-center gap-2 text-[14px] text-muted">
            <i className="fa-solid fa-filter" aria-hidden="true" />
            <select
              value={active("brand")}
              onChange={(e) => set("brand", e.target.value)}
              className="cursor-pointer rounded-pill border border-line bg-white px-3.5 py-2 text-[14px] text-ink transition-colors duration-[120ms] hover:border-muted-light"
              aria-label="Filter by brand"
            >
              <option value="">Any brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </label>

          {/* Sort select */}
          <label className="flex items-center gap-2 text-[14px] text-muted">
            Sort
            <select
              value={active("sort") || "featured"}
              onChange={(e) => set("sort", e.target.value)}
              className="cursor-pointer rounded-pill border border-line bg-white px-3.5 py-2 text-[14px] text-ink transition-colors duration-[120ms] hover:border-muted-light"
              aria-label="Sort results"
            >
              {SORTS.map((sort) => (
                <option key={sort.id} value={sort.id}>
                  {sort.label}
                </option>
              ))}
            </select>
          </label>

          <span className="ml-auto text-[14px] text-muted">
            {count} {count === 1 ? "camper" : "campers"}
          </span>
        </div>
      </div>
    </div>
  );
}
