"use client";

import Image from "next/image";
import Link from "next/link";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";

/** Full-width row used by the shop's "list" view. */
export function ProductRow({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const inCart = useCartStore((s) =>
    s.items.some((i) => i.slug === product.slug),
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-white transition-shadow duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.28)] sm:flex-row">
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-alt sm:aspect-auto sm:w-[240px] md:w-[280px]"
      >
        <Image
          src={product.images[0]}
          alt={`${product.year} ${product.title}`}
          fill
          sizes="(max-width: 640px) 100vw, 280px"
          className="object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors duration-[120ms] group-hover:text-accent">
            {product.title}
          </h3>
          <p className="text-[13px] text-muted">Stock #{product.stockNumber}</p>
        </div>

        <p className="text-[13px] text-muted">
          {product.year} · {product.brand} {product.model} · {product.type}
        </p>

        <p className="line-clamp-2 max-w-[720px] text-[14px] leading-relaxed text-muted">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
          <span>
            <i
              className="fa-solid fa-ruler-horizontal mr-1.5"
              aria-hidden="true"
            />
            {product.specs.length}
          </span>
          <span>
            <i className="fa-solid fa-person mr-1.5" aria-hidden="true" />
            Sleeps {product.specs.sleeps}
          </span>
          <span>
            <i
              className="fa-solid fa-weight-hanging mr-1.5"
              aria-hidden="true"
            />
            {product.specs.weight}
          </span>
          {Number(product.specs.slides) > 0 && (
            <span>{product.specs.slides} slides</span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-[20px] font-semibold tracking-[-0.01em] text-ink">
              {money(product.price)}
            </p>
            {product.monthlyFrom && (
              <p className="text-[13px] text-muted">
                or {money(product.monthlyFrom, true)}/mo.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/shop/${product.slug}`}
              className="text-[14px] font-medium text-accent transition-colors duration-[120ms] hover:underline"
            >
              View details
            </Link>
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
              className="btn btn-primary btn-sm"
            >
              <i
                className={`fa-solid ${inCart ? "fa-check" : "fa-plus"} mr-1.5`}
                aria-hidden="true"
              />
              {inCart ? "In your bag" : "Add to bag"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}