"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/products";
import { newReference, saveOrder, type OrderRecord } from "@/lib/orders";
import { sendOrderPlacedEmails } from "@/lib/notifications";
import { getSettings } from "@/lib/settings";

const addressSchema = z.object({
  line1: z.string().trim().max(160).optional(),
  city: z.string().trim().max(80).optional(),
  state: z.string().trim().max(40).optional(),
  zip: z.string().trim().max(16).optional(),
});

const schema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1),
        qty: z.number().int().min(1).max(1),
      }),
    )
    .min(1, "Your cart is empty."),
  customer: z.object({
    name: z.string().trim().min(2, "Please enter your name.").max(120),
    email: z.string().trim().email("Please enter a valid email address.").max(200),
    phone: z
      .string()
      .trim()
      .min(7, "Please enter a phone number we can reach you at.")
      .max(30)
      .optional()
      .or(z.literal("")),
    notes: z.string().trim().max(1000).optional(),
  }),
  delivery: z.object({
    method: z.enum(["pickup", "delivery"]),
    address: addressSchema.optional(),
  }),
  payment: z.object({
    method: z.string().min(1, "Choose a payment method."),
    methodOther: z
      .string()
      .trim()
      .min(3, "Tell us how you'd like to pay.")
      .max(300)
      .optional(),
  }),
});

export type PlaceOrderInput = z.input<typeof schema>;

export type PlaceOrderResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const data = parsed.data;

  // Re-price every line server-side — never trust client totals.
  const catalog = await getProducts();
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  const items: OrderRecord["items"] = [];
  for (const line of data.items) {
    const product = bySlug.get(line.slug);
    if (!product || product.status !== "live") {
      return {
        ok: false,
        error: `“${line.slug}” is no longer available. Remove it and try again.`,
      };
    }
    items.push({
      slug: product.slug,
      title: `${product.year} ${product.brand} ${product.model}`,
      image: product.images[0] ?? "",
      price: product.price,
      qty: 1,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const deliveryFee = data.delivery.method === "delivery" ? 0 : 0;
  const total = subtotal + deliveryFee;

  const { paymentMethods } = await getSettings();
  const knownMethod = paymentMethods.some(
    (m) => m.id === data.payment.method,
  );
  const method = knownMethod ? data.payment.method : "other";

  const now = new Date().toISOString();
  const order: OrderRecord = {
    reference: newReference(),
    items,
    subtotal,
    deliveryFee,
    total,
    customer: {
      name: data.customer.name,
      email: data.customer.email.toLowerCase(),
      ...(data.customer.phone ? { phone: data.customer.phone } : {}),
      ...(data.customer.notes ? { notes: data.customer.notes } : {}),
    },
    delivery: {
      method: data.delivery.method,
      ...(data.delivery.method === "delivery" && data.delivery.address
        ? { address: data.delivery.address }
        : {}),
    },
    payment: {
      method,
      ...(method === "other" && data.payment.methodOther
        ? { methodOther: data.payment.methodOther }
        : {}),
      label:
        paymentMethods.find((m) => m.id === method)?.label ??
        data.payment.methodOther ??
        "Other",
      status: "pending",
    },
    status: "Placed",
    statusHistory: [{ status: "Placed", at: now }],
    createdAt: now,
  };

  await saveOrder(order);
  // Emails are best-effort: the order exists even if SMTP fails.
  await sendOrderPlacedEmails(order);

  redirect(`/checkout/success/${order.reference}`);
}
