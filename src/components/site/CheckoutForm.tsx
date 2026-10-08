"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { money } from "@/lib/format";
import { cartSubtotal, useCartStore } from "@/store/cart";
import { placeOrder, type PlaceOrderInput } from "@/lib/actions/orders";
import type { PaymentMethodSetting } from "@/lib/settings";

type Errors = Record<string, string[]>;

export function CheckoutForm({
  paymentMethods = [],
  pickupAddress = "4120 Michigan Ave, Detroit, MI 48208",
}: {
  paymentMethods?: PaymentMethodSetting[];
  pickupAddress?: string;
}) {
  const items = useCartStore((s) => s.items);
  const subtotal = cartSubtotal(items);

  const [method, setMethod] = useState(paymentMethods[0]?.id ?? "card");
  const [delivery, setDelivery] = useState<"pickup" | "delivery">("pickup");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [pending, startTransition] = useTransition();

  if (items.length === 0) {
    return (
      <div className="rounded-card bg-alt px-6 py-16 text-center">
        <h2 className="text-[22px] font-semibold">Your bag is empty.</h2>
        <p className="mx-auto mt-2 max-w-[400px] text-[15px] text-muted">
          Add a camper first — checkout takes about a minute.
        </p>
        <Link href="/shop" className="btn btn-primary mt-6">
          Browse campers
        </Link>
      </div>
    );
  }

  const fieldError = (name: string) =>
    errors[name]?.[0] ? (
      <p className="mt-1.5 text-[13px] text-danger" role="alert">
        {errors[name][0]}
      </p>
    ) : null;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError("");

    const form = new FormData(event.currentTarget);
    const str = (key: string) => String(form.get(key) ?? "").trim();

    const input: PlaceOrderInput = {
      items: items.map((item) => ({ slug: item.slug, qty: item.qty })),
      customer: {
        name: str("name"),
        email: str("email"),
        phone: str("phone"),
        notes: str("notes") || undefined,
      },
      delivery: {
        method: delivery,
        ...(delivery === "delivery"
          ? {
              address: {
                line1: str("address") || undefined,
                city: str("city") || undefined,
                state: str("state") || undefined,
                zip: str("zip") || undefined,
              },
            }
          : {}),
      },
      payment: {
        method,
        methodOther: method === "other" ? str("methodOther") : undefined,
      },
    };

    startTransition(async () => {
      try {
        const result = await placeOrder(input);
        if (!result.ok) {
          setFormError(result.error);
          if (result.fieldErrors) setErrors(result.fieldErrors);
        }
        // On success the server action redirects — no local state to set.
      } catch {
        setFormError("Something went wrong placing your order. Please try again.");
      }
    });
  }

  const inputCls = (name: string) => `field ${errors[name] ? "border-danger" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
      <div className="space-y-12">
        {/* ── 1. Contact ─────────────────────────────── */}
        <section>
          <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
            1. Contact details
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="field-label">
                Full name
              </label>
              <input
                id="name"
                name="name"
                autoComplete="name"
                required
                className={inputCls("name")}
                placeholder="Maria Rodriguez"
              />
              {fieldError("name")}
            </div>
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputCls("email")}
                placeholder="you@example.com"
              />
              <p className="mt-1.5 text-[12px] text-muted">
                Your order reference is sent here.
              </p>
              {fieldError("email")}
            </div>
            <div>
              <label htmlFor="phone" className="field-label">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className={inputCls("phone")}
                placeholder="(313) 555-0100"
              />
              <p className="mt-1.5 text-[12px] text-muted">
                We confirm every order by phone.
              </p>
              {fieldError("phone")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="field-label">
                Order notes <span className="font-normal text-muted">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className={inputCls("notes")}
                placeholder="Trade-in details, questions, preferred call times…"
              />
              {fieldError("notes")}
            </div>
          </div>
        </section>

        {/* ── 2. Delivery ────────────────────────────── */}
        <section>
          <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
            2. Pickup or delivery
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {(
              [
                {
                  id: "pickup" as const,
                  title: "Pickup in Detroit",
                  body: `${pickupAddress} — in person, inspected before you take it.`,
                },
                {
                  id: "delivery" as const,
                  title: "Delivery",
                  body: "Anywhere in Michigan's Lower Peninsula, free.",
                },
              ]
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setDelivery(option.id)}
                aria-pressed={delivery === option.id}
                className={`rounded-card border p-5 text-left transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  delivery === option.id
                    ? "border-accent bg-sky shadow-[0_0_0_3px_rgba(0,113,227,0.12)]"
                    : "border-line hover:border-muted-light"
                }`}
              >
                <span className="flex items-center gap-2.5 text-[16px] font-medium text-ink">
                  <i
                    className={`fa-solid ${option.id === "pickup" ? "fa-warehouse" : "fa-truck"}`}
                    aria-hidden="true"
                  />
                  {option.title}
                </span>
                <span className="mt-1.5 block text-[14px] leading-relaxed text-muted">
                  {option.body}
                </span>
              </button>
            ))}
          </div>

          {delivery === "delivery" && (
            <div className="mt-6 grid gap-5 rounded-card bg-alt p-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="field-label">
                  Street address
                </label>
                <input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  required
                  className={inputCls("address")}
                  placeholder="1230 Woodward Ave"
                />
                {fieldError("address")}
              </div>
              <div>
                <label htmlFor="city" className="field-label">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  className={inputCls("city")}
                  placeholder="Detroit"
                />
                {fieldError("city")}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label htmlFor="state" className="field-label">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    autoComplete="address-level1"
                    required
                    defaultValue="MI"
                    className={inputCls("state")}
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="field-label">
                    ZIP
                  </label>
                  <input
                    id="zip"
                    name="zip"
                    autoComplete="postal-code"
                    required
                    inputMode="numeric"
                    className={inputCls("zip")}
                    placeholder="48201"
                  />
                  {fieldError("zip")}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── 3. Payment method ──────────────────────── */}
        <section>
          <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
            3. Payment method
          </h2>
          <p className="mt-2 text-[14px] text-muted">
            Nothing is charged now. We email your payment details after you
            place the order.
          </p>

          <div className="mt-6 space-y-3" role="radiogroup" aria-label="Payment method">
            {(paymentMethods.length ? paymentMethods : [{ id: "card", label: "Card", hint: "Card payment" }]).map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3.5 rounded-card border p-4 transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  method === option.id
                    ? "border-accent bg-sky shadow-[0_0_0_3px_rgba(0,113,227,0.12)]"
                    : "border-line hover:border-muted-light"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.id}
                  checked={method === option.id}
                  onChange={() => setMethod(option.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#0071e3]"
                />
                <span>
                  <span className="block text-[16px] font-medium text-ink">
                    {option.label}
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">
                    {option.hint}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {method === "other" && (
            <div className="mt-5">
              <label htmlFor="methodOther" className="field-label">
                Tell us how you&apos;d like to pay
              </label>
              <textarea
                id="methodOther"
                name="methodOther"
                rows={2}
                required
                className={inputCls("methodOther")}
                placeholder="e.g. Money order, crypto, in-house financing…"
              />
              {fieldError("methodOther")}
            </div>
          )}
        </section>
      </div>

      {/* ── Summary ─────────────────────────────────── */}
      <aside className="h-fit rounded-card bg-alt p-6 lg:sticky lg:top-20">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
          Your order
        </h2>

        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.slug} className="flex justify-between gap-3 text-[14px]">
              <span className="text-ink">
                {item.name}
                <span className="block text-[12px] text-muted">Qty {item.qty}</span>
              </span>
              <span className="shrink-0 text-ink">{money(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-3 border-t border-line pt-4 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="m-0 text-ink">{money(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">
              {delivery === "delivery" ? "Delivery" : "Pickup"}
            </dt>
            <dd className="m-0 text-ink">Free</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-[17px] font-semibold">
            <dt className="text-ink">Total</dt>
            <dd className="m-0 text-ink">{money(subtotal)}</dd>
          </div>
        </dl>

        {formError && (
          <p
            className="mt-4 rounded-box bg-danger/10 px-3 py-2.5 text-[13px] text-danger"
            role="alert"
          >
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary mt-5 w-full"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>

        <p className="mt-3 text-[12px] leading-relaxed text-muted">
          By placing this order you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-ink">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline hover:text-ink">
            privacy policy
          </Link>
          . Nothing is charged until we email your payment details.
        </p>
      </aside>
    </form>
  );
}
