"use client";

import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) => s.items.some((i) => i.slug === product.slug));

  return (
    <article className="group flex h-full flex-col rounded-card bg-white transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-alt">
          <Image
            src={product.images[0]}
            alt={`${product.year} ${product.title}`}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
            className="object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          {product.listPrice && product.listPrice > product.price && (
            <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-[0.02em] text-ink shadow-sm backdrop-blur">
              Save {money(product.listPrice - product.price)}
            </span>
          )}
        </div>

        <div className="mt-5 px-1 text-center">
          <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-[120ms] group-hover:text-accent">
            {product.title}
          </h3>
          <p className="mt-1 text-[13px] text-muted">
            {product.year} · {product.type} · Sleeps {product.specs.sleeps}
          </p>
          <p className="mt-3 text-[19px] font-semibold tracking-[-0.01em] text-ink">
            {money(product.price)}
          </p>
          {product.monthlyFrom && (
            <p className="mt-0.5 text-[13px] text-muted">
              or {money(product.monthlyFrom, true)}/mo.
            </p>
          )}
        </div>
      </Link>

      <div className="mt-auto flex justify-center px-1 pb-1 pt-4">
        <button
          type="button"
          disabled={inCart}
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
          className="inline-flex items-center gap-2 rounded-pill px-4 py-2 text-[14px] font-medium text-accent transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-sky active:scale-95 disabled:text-muted-light disabled:hover:bg-transparent"
        >
          <i
            className={`fa-solid ${inCart ? "fa-check" : "fa-plus"}`}
            aria-hidden="true"
          />
          {inCart ? "In your bag" : "Add to bag"}
        </button>
      </div>
    </article>
  );
}
