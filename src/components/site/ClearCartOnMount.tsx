"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Empties the bag once the order confirmation has rendered. */
export function ClearCartOnMount() {
  const clear = useCartStore((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
