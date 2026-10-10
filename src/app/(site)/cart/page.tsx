import type { Metadata } from "next";
import { CartView } from "@/components/site/CartView";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review the campers you've reserved before checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="bg-white">
      <section className="section pb-20 pt-16 md:pb-28 md:pt-24">
        <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
          Your bag.
        </h1>
        <p className="mt-3 text-[17px] text-muted">
          One-of-a-kind units are held in your bag while you decide.
        </p>
        <div className="mt-10">
          <CartView />
        </div>
      </section>
    </div>
  );
}
