import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopResults } from "@/components/ui/ShopResults";
import { Reveal } from "@/components/ui/Reveal";
import { ShopFilters } from "@/components/site/ShopFilters";
import { catalogBrands, getProducts } from "@/lib/products";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Shop used campers",
  description:
    "Browse inspected used travel trailers, camper vans, motorhomes and pop-ups on the lot in Detroit, Michigan.",
};

type Props = {
  searchParams: Promise<{
    type?: string;
    brand?: string;
    sort?: string;
    q?: string;
  }>;
};

function sortProducts<T extends { price: number; year: number; featured: boolean }>(
  items: T[],
  sort: string,
): T[] {
  const out = [...items];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    case "year-desc":
      return out.sort((a, b) => b.year - a.year);
    default:
      return out.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const products = await getProducts({
    ...(params.type ? { type: params.type } : {}),
    ...(params.brand ? { brand: params.brand } : {}),
    ...(params.q ? { q: params.q } : {}),
  });
  const sorted = sortProducts(products, params.sort ?? "featured");
  const { site } = await getSettings();

  return (
    <div className="bg-white">
      <section className="section pt-16 md:pt-24">
        <Reveal>
          <h1 className="text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            {params.q ? `“${params.q}”` : "Every camper on the lot."}
          </h1>
        </Reveal>
        <Reveal delay={90}>
          <p className="mt-4 max-w-[640px] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-muted">
            Inspected, warranty-checked and priced straight. What you see is
            what you pay — delivery available across Michigan.
          </p>
        </Reveal>
      </section>

      <div className="section">
        <Suspense fallback={<div className="py-5" />}>
          <ShopFilters brands={catalogBrands()} count={sorted.length} />
        </Suspense>
      </div>

      <section className="section content-auto pb-20 pt-10 md:pb-28">
        {sorted.length === 0 ? (
          <div className="rounded-card bg-alt px-6 py-16 text-center">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em]">
              Nothing matches those filters.
            </h2>
            <p className="mx-auto mt-2 max-w-[420px] text-[15px] text-muted">
              Try clearing a filter, or call the lot — fresh trade-ins land
              every week and sell fast.
            </p>
            <a href={`tel:${site.phoneHref}`} className="btn btn-primary mt-6">
              Call the lot
            </a>
          </div>
        ) : (
          <ShopResults products={sorted} />
        )}
      </section>
    </div>
  );
}
