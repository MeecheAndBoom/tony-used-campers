"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/store/cart";

export function AddToCart({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const setOpen = useCartStore((s) => s.setOpen);
  const inCart = useCartStore((s) => s.items.some((i) => i.slug === product.slug));
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();

  function handleAdd() {
    if (inCart) {
      setOpen(true);
      return;
    }
    add({
      slug: product.slug,
      name: product.title,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      href: `/shop/${product.slug}`,
      maxQty: 1,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={handleAdd} className="btn btn-primary btn-lg">
        <i
          className={`fa-solid ${inCart ? "fa-check" : "fa-bag-shopping"}`}
          aria-hidden="true"
        />
        {inCart ? "In your bag" : "Add to bag"}
      </button>
      <button
        type="button"
        onClick={() => {
          if (!inCart) handleAdd();
          router.push("/checkout");
        }}
        className="btn btn-secondary btn-lg"
      >
        Buy now
      </button>
      {justAdded && (
        <span className="text-[14px] text-success" role="status">
          Added to your bag.
        </span>
      )}
    </div>
  );
}
