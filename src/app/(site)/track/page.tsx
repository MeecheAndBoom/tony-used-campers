import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { findOrder, type OrderRecord } from "@/lib/orders";
import { dateTime, money } from "@/lib/format";
import { TRACKING_STEPS, type OrderStatus } from "@/lib/constants";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Track your order",
  description:
    "Look up your Tony Used Campers order with the email address used at checkout and your TUC reference number.",
};

type Props = {
  searchParams: Promise<{ ref?: string; email?: string; error?: string }>;
};

export default async function TrackPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = (params.ref ?? "").trim();
  const email = (params.email ?? "").trim();

  const { site } = await getSettings();

  let order: OrderRecord | null = null;
  let lookupError = "";
  if (reference && email) {
    order = await findOrder(reference, email);
    if (!order) {
      lookupError =
        "We couldn't match that email address and reference. Check both and try again.";
    }
  } else if (params.error) {
    lookupError = "Enter both your email address and order reference.";
  }

  return (
    <div className="bg-white">
      <section className="section pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="mx-auto max-w-[680px]">
          <h1 className="text-balance text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
            Track your order.
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-muted">
            Enter the email you used at checkout and your TUC reference — like{" "}
            <span className="font-mono text-ink">TUC-4K7M2P</span>.
          </p>

          <form
            method="GET"
            className="mt-8 grid gap-4 rounded-card bg-alt p-6 sm:grid-cols-[1fr_200px_auto]"
          >
            <div>
              <label htmlFor="email" className="field-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={email}
                className="field bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="ref" className="field-label">
                Order reference
              </label>
              <input
                id="ref"
                name="ref"
                required
                defaultValue={reference}
                className="field bg-white font-mono uppercase"
                placeholder="TUC-XXXXXX"
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn btn-primary w-full sm:w-auto">
                Track
              </button>
            </div>
          </form>

          {lookupError && (
            <p
              className="mt-4 rounded-box bg-danger/10 px-4 py-3 text-[14px] text-danger"
              role="alert"
            >
              {lookupError}
            </p>
          )}

          {order && (
            <TrackingResult order={order} pickupAddress={site.address} phone={site.phone} phoneHref={site.phoneHref} />
          )}
        </div>
      </section>
    </div>
  );
}

function TrackingResult({
  order,
  pickupAddress,
  phone,
  phoneHref,
}: {
  order: OrderRecord;
  pickupAddress: string;
  phone: string;
  phoneHref: string;
}) {
  const currentIndex = TRACKING_STEPS.findIndex(
    (step) => step.status === order.status,
  );
  const cancelled = order.status === "Cancelled";
  const latest = order.statusHistory[order.statusHistory.length - 1];

  return (
    <div className="mt-10 space-y-8">
      {/* Header card */}
      <div className="rounded-card border border-line p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[20px] font-semibold tracking-[0.06em] text-ink">
              {order.reference}
            </p>
            <p className="mt-1 text-[14px] text-muted">
              Placed {order.createdAt ? dateTime(order.createdAt) : "—"}
            </p>
          </div>
          <span
            className={`badge ${
              cancelled
                ? "bg-danger/10 text-danger"
                : order.status === "Completed"
                  ? "bg-success/10 text-success"
                  : "bg-sky text-accent"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="mt-5 grid gap-4 border-t border-line pt-5 text-[14px] sm:grid-cols-3">
          <div>
            <p className="text-muted">Delivery method</p>
            <p className="mt-0.5 font-medium text-ink">
              {order.delivery.method === "delivery" ? "Delivery" : "Pickup"}
            </p>
          </div>
          <div>
            <p className="text-muted">
              {order.delivery.method === "delivery" ? "Delivering to" : "Pickup at"}
            </p>
            <p className="mt-0.5 font-medium text-ink">
              {order.delivery.method === "delivery"
                ? [
                    order.delivery.address?.line1,
                    [order.delivery.address?.city, order.delivery.address?.state]
                      .filter(Boolean)
                      .join(", "),
                  ]
                    .filter(Boolean)
                    .join(", ") || "To be confirmed"
                : pickupAddress}
            </p>
          </div>
          <div>
            <p className="text-muted">Estimated ready</p>
            <p className="mt-0.5 font-medium text-ink">
              {order.delivery.estimatedDate ?? "Within 48 hours of payment"}
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      {!cancelled && (
        <div className="rounded-card border border-line p-6">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
            Where your order is
          </h2>
          <ol className="mt-6">
            {TRACKING_STEPS.map((step, i) => {
              const done = currentIndex >= 0 && i <= currentIndex;
              const current = i === currentIndex;
              const last = i === TRACKING_STEPS.length - 1;
              return (
                <li key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] transition-colors duration-[200ms] ${
                        done
                          ? "bg-accent text-white"
                          : "bg-alt-deep text-muted-light"
                      } ${current ? "ring-4 ring-sky" : ""}`}
                    >
                      {done ? (
                        <i className="fa-solid fa-check" aria-hidden="true" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    {!last && (
                      <span
                        className={`my-1 w-px flex-1 ${
                          currentIndex >= 0 && i < currentIndex
                            ? "bg-accent"
                            : "bg-line"
                        }`}
                      />
                    )}
                  </div>
                  <div className={`pb-6 ${last ? "pb-0" : ""}`}>
                    <p
                      className={`text-[15px] font-medium ${
                        done ? "text-ink" : "text-muted-light"
                      }`}
                    >
                      {step.label}
                    </p>
                    {current && latest && (
                      <p className="mt-0.5 text-[13px] text-muted">
                        Last updated {dateTime(latest.at)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {cancelled && (
        <div className="rounded-card border border-danger/30 bg-danger/5 p-6">
          <h2 className="text-[17px] font-semibold text-danger">
            This order was cancelled.
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {latest?.note ??
              "Call us if you have questions about a cancellation — we're happy to help."}
          </p>
        </div>
      )}

      {/* Timeline */}
      {order.statusHistory.length > 0 && (
        <div className="rounded-card border border-line p-6">
          <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
            History
          </h2>
          <ul className="mt-4 space-y-3">
            {[...order.statusHistory].reverse().map((entry, i) => (
              <li
                key={`${entry.status}-${entry.at}-${i}`}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-soft pb-3 text-[14px] last:border-0 last:pb-0"
              >
                <span className="text-ink">
                  {entry.status}
                  {entry.note && (
                    <span className="text-muted"> — {entry.note}</span>
                  )}
                </span>
                <span className="text-muted">{dateTime(entry.at)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contents */}
      <div className="rounded-card border border-line p-6">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          What&apos;s in this order
        </h2>
        <ul className="mt-4">
          {order.items.map((item) => (
            <li
              key={item.slug}
              className="flex items-center gap-4 border-b border-line-soft py-4 last:border-0"
            >
              <Link
                href={`/shop/${item.slug}`}
                className="relative aspect-[4/3] w-[84px] shrink-0 overflow-hidden rounded-box bg-alt"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="84px"
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-ink">
                  {item.title}
                </p>
                <p className="text-[13px] text-muted">Qty {item.qty}</p>
              </div>
              <p className="text-[15px] text-ink">{money(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-[16px] font-semibold">
          <span className="text-ink">Total</span>
          <span className="text-ink">{money(order.total)}</span>
        </div>
        <p className="mt-3 text-[13px] text-muted">
          Payment status:{" "}
          <span
            className={order.payment.status === "received" ? "text-success" : "text-warning"}
          >
            {order.payment.status === "received" ? "Received" : "Pending"}
          </span>{" "}
          · Method: {order.payment.label}
        </p>
      </div>

      <p className="text-[14px] text-muted">
        Need help? Call{" "}
        <a
          href={`tel:${phoneHref}`}
          className="font-medium text-accent hover:underline"
        >
          {phone}
        </a>{" "}
        and quote {order.reference}.
      </p>
    </div>
  );
}
