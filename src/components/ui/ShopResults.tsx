"use client";

import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardCompact } from "@/components/ui/ProductCardCompact";
import { ProductRow } from "@/components/ui/ProductRow";
import { useShopView } from "@/store/shopView";
import type { Product } from "@/lib/types";

/** Renders the shop results in the user's chosen layout: grid, compact, or list. */
export function ShopResults({ products }: { products: Product[] }) {
  const view = useShopView((s) => s.view);

  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 3) * 70}>
            <ProductRow product={product} />
          </Reveal>
        ))}
      </div>
    );
  }

  if (view === "compact") {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={(i % 5) * 50}>
            <ProductCardCompact product={product} />
          </Reveal>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product, i) => (
        <Reveal key={product.slug} delay={(i % 3) * 70}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}