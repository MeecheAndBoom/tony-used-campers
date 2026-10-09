"use client";

import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";

/** Dense tile used by the shop's "compact grid" view. */
export function ProductCardCompact({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) =>
    s.items.some((i) => i.slug === product.slug),
  );

  return (
    <article className="group flex h-full flex-col rounded-box bg-white p-2.5 transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-box bg-alt">
          <Image
            src={product.images[0]}
            alt={`${product.year} ${product.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          {product.listPrice && product.listPrice > product.price && (
            <span className="absolute left-2 top-2 rounded-pill bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-[0.02em] text-ink shadow-sm backdrop-blur">
              Save {money(product.listPrice - product.price)}
            </span>
          )}
        </div>
        <h3 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-[120ms] group-hover:text-accent">
          {product.title}
        </h3>
      </Link>

      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          {money(product.price)}
        </p>
        <button
          type="button"
          disabled={inCart}
          aria-label={inCart ? "In your bag" : `Add ${product.title} to bag`}
          onClick={() =>
            add({
              slug: product.slug,
              name: product.title,
              brand: product.brand,
              price: product.price,
              image: product.images[0],
              href: `/shop/${product.slug}`,
              maxQty: 1,
            })
          }
          className="grid h-8 w-8 place-items-center rounded-full text-[13px] text-accent transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-sky active:scale-95 disabled:text-muted-light disabled:hover:bg-transparent"
        >
          <i
            className={`fa-solid ${inCart ? "fa-check" : "fa-plus"}`}
            aria-hidden="true"
          />
        </button>
      </div>
    </article>
  );
}