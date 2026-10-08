"use client";

import Image from "next/image";
import Link from "next/link";
import { cartCount, cartSubtotal, useCartStore } from "@/store/cart";
import { money } from "@/lib/format";

export function CartView() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const count = cartCount(items);
  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    return (
      <div className="rounded-card bg-alt px-6 py-20 text-center">
        <i className="fa-solid fa-bag-shopping text-[28px] text-line" aria-hidden="true" />
        <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.01em]">
          Your bag is empty.
        </h2>
        <p className="mx-auto mt-2 max-w-[400px] text-[15px] text-muted">
          Units are one-of-a-kind — when one&apos;s in your bag, it&apos;s held
          for you while you decide.
        </p>
        <Link href="/shop" className="btn btn-primary mt-7">
          Browse campers
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
      {/* Line items */}
      <div>
        <ul>
          {items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center gap-5 border-b border-line py-6"
            >
              <Link
                href={item.href}
                className="relative aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-box bg-alt sm:w-[160px]"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <Link
                  href={item.href}
                  className="text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-[13px] text-muted">
                  {item.brand} · Qty {item.qty} · One-of-a-kind unit
                </p>
                <button
                  type="button"
                  onClick={() => remove(item.slug)}
                  className="mt-3 text-[13px] text-muted underline transition-colors hover:text-danger"
                >
                  Remove
                </button>
              </div>

              <p className="shrink-0 text-[16px] font-medium text-ink">
                {money(item.price * item.qty)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between">
          <Link href="/shop" className="text-[14px] text-accent hover:underline">
            ← Continue shopping
          </Link>
          <button
            type="button"
            onClick={clear}
            className="text-[14px] text-muted underline transition-colors hover:text-danger"
          >
            Empty bag
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-card bg-alt p-6 lg:sticky lg:top-20">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          Order summary
        </h2>

        <dl className="mt-5 space-y-3 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">
              {count} {count === 1 ? "item" : "items"}
            </dt>
            <dd className="m-0 text-ink">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Delivery / pickup</dt>
            <dd className="m-0 text-ink">Arranged at checkout</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-[17px] font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="m-0 text-ink">{money(subtotal)}</dd>
          </div>
        </dl>

        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          Prices exclude tax, title, registration and doc fees. A specialist
          confirms every order by phone before payment.
        </p>

        <Link href="/checkout" className="btn btn-primary mt-5 w-full">
          Check out
        </Link>
        <Link
          href="/track"
          className="mt-3 block text-center text-[13px] text-muted hover:text-ink hover:underline"
        >
          Already ordered? Track it
        </Link>
      </aside>
    </div>
  );
}
