"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cartSubtotal, useCartStore } from "@/store/cart";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function CartDrawer() {
  const open = useCartStore((s) => s.open);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const subtotal = cartSubtotal(items);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line-soft px-6 py-4">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
            Your bag
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors duration-[120ms] hover:bg-black/5 hover:text-ink"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <i
                className="fa-solid fa-bag-shopping text-3xl text-line"
                aria-hidden="true"
              />
              <p className="text-[15px] text-muted">
                Your bag is empty. Find a camper you love.
              </p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="btn btn-primary btn-sm"
              >
                Browse campers
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line-soft">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-4 py-5">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block h-16 w-24 shrink-0 overflow-hidden rounded-[10px] bg-alt"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-ink">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {item.brand} · Qty {item.qty}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(item.slug)}
                      className="mt-2 text-[12px] text-muted underline-offset-2 transition-colors duration-[120ms] hover:text-accent hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="shrink-0 text-[14px] font-medium text-ink">
                    {fmt.format(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-line-soft px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] text-muted">Subtotal</span>
              <span className="text-[19px] font-semibold tracking-[-0.01em]">
                {fmt.format(subtotal)}
              </span>
            </div>
            <p className="mt-1 text-[12px] text-muted-light">
              Taxes, title and registration calculated at checkout.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                Check out
              </Link>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="btn btn-secondary w-full"
              >
                View bag
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
