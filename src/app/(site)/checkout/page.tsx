import type { Metadata } from "next";
import { CheckoutForm } from "@/components/site/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your camper order — pickup or delivery from Detroit.",
};

export default function CheckoutPage() {
  return (
    <div className="bg-white">
      <section className="section pb-20 pt-16 md:pb-28 md:pt-24">
        <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
          Checkout.
        </h1>
        <p className="mt-3 max-w-[560px] text-[17px] leading-relaxed text-muted">
          About a minute. Nothing is charged today — we confirm your order by
          phone, then email secure payment details.
        </p>
        <div className="mt-12">
          <CheckoutForm />
        </div>
      </section>
    </div>
  );
}
