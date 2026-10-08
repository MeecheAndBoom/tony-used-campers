import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClearCartOnMount } from "@/components/site/ClearCartOnMount";
import { findOrder } from "@/lib/orders";
import { getSettings } from "@/lib/settings";

type Props = { params: Promise<{ ref: string }> };

export const metadata: Metadata = { title: "Order confirmed" };

const STEPS = [
  {
    title: "We confirm by phone",
    body: "A specialist calls within one business day to walk through the unit and answer questions.",
  },
  {
    title: "Payment details arrive by email",
    body: "Your exact amount, method and due date — sent to the email you gave at checkout.",
  },
  {
    title: "Prep and handoff",
    body: "Payment confirmed, we run the final inspection and schedule pickup or delivery.",
  },
];

export default async function OrderSuccessPage({ params }: Props) {
  const { ref } = await params;
  const order = await findOrder(ref.toUpperCase());
  if (!order) notFound();
  const { site } = await getSettings();

  return (
    <div className="bg-white">
      <ClearCartOnMount />
      <section className="section pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-[680px] text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sky text-[20px] text-accent">
            <i className="fa-solid fa-check" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-balance text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em]">
            Order received.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted">
            Thanks, {order.customer.name.split(" ")[0]}. We&apos;ve emailed a
            confirmation to{" "}
            <span className="text-ink">{order.customer.email}</span> with your
            order reference.
          </p>

          <div className="mt-8 rounded-card border border-line px-6 py-5">
            <p className="text-[13px] text-muted">Your order reference</p>
            <p className="mt-1 font-mono text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[0.08em] text-ink">
              {order.reference}
            </p>
            <p className="mt-2 text-[13px] text-muted">
              Save this with your email address to track your order.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/track?ref=${order.reference}`} className="btn btn-primary">
              Track your order
            </Link>
            <Link href="/shop" className="btn btn-ghost">
              Keep browsing
            </Link>
          </div>
        </div>

        {/* Next steps */}
        <div className="mx-auto mt-16 max-w-[900px]">
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title}>
                <p className="text-[13px] font-semibold text-accent">0{i + 1}</p>
                <h2 className="mt-2 text-[17px] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-card bg-alt p-6 text-center">
            <p className="text-[15px] text-muted">
              Questions right now? Call{" "}
              <a
                href={`tel:${site.phoneHref}`}
                className="font-medium text-accent hover:underline"
              >
                {site.phone}
              </a>{" "}
              and reference {order.reference}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
