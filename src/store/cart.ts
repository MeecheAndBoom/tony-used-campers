import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  href: string;
  /** Used campers are one-of-a-kind units. */
  qty: number;
  maxQty: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,

      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) return { items: state.items, open: true };
          return {
            items: [...state.items, { ...item, qty: 1 }],
            open: true,
          };
        }),

      remove: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),

      setQty: (slug, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug
              ? { ...i, qty: Math.max(1, Math.min(qty, i.maxQty)) }
              : i,
          ),
        })),

      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
    }),
    {
      name: "tuc-cart",
      partialize: (state) => ({ items: state.items }) as CartState,
    },
  ),
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.qty, 0);

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.qty * i.price, 0);
