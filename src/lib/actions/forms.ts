"use server";

import { z } from "zod";
import { saveEnquiry, saveReview } from "@/lib/enquiries";
import { sendEnquiryEmails } from "@/lib/notifications";

export type FormState =
  | { ok: true; message: string; fieldErrors?: never }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

function flatten(error: z.ZodError): FormState {
  return {
    ok: false,
    message: "Please check the highlighted fields and try again.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2, "Choose a subject.").max(160),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — 10 characters minimum.")
    .max(4000),
});

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) return flatten(parsed.error);

  await saveEnquiry({ kind: "contact", ...parsed.data });
  await sendEnquiryEmails(parsed.data);
  return {
    ok: true,
    message: "Message sent. We'll get back to you within one business day.",
  };
}

const financeSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(30).optional(),
  budget: z.string().trim().max(80).optional(),
  message: z.string().trim().max(4000).optional(),
});

export async function submitFinance(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = financeSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    budget: formData.get("budget") || undefined,
    message: formData.get("message") || undefined,
  });
  if (!parsed.success) return flatten(parsed.error);

  const body =
    parsed.data.message ??
    "Interested in financing — please send application details.";
  await saveEnquiry({
    kind: "finance",
    ...parsed.data,
    subject: "Financing application enquiry",
    message: body,
  });
  await sendEnquiryEmails({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: "Financing application enquiry",
    message: body,
  });
  return {
    ok: true,
    message: "Request received. We'll email financing options within one business day.",
  };
}

const sellSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(30).optional(),
  vehicle: z
    .string()
    .trim()
    .min(3, "Tell us what you're selling — year, make, model.")
    .max(200),
  message: z.string().trim().max(4000).optional(),
});

export async function submitSell(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = sellSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    vehicle: formData.get("vehicle"),
    message: formData.get("message") || undefined,
  });
  if (!parsed.success) return flatten(parsed.error);

  const body =
    parsed.data.message ?? "Looking for a valuation or trade-in offer.";
  await saveEnquiry({
    kind: "sell",
    ...parsed.data,
    subject: `Trade-in enquiry: ${parsed.data.vehicle}`,
    message: body,
  });
  await sendEnquiryEmails({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    subject: `Trade-in enquiry: ${parsed.data.vehicle}`,
    message: body,
  });
  return {
    ok: true,
    message: "Sent. We'll come back with a valuation within one business day.",
  };
}

const reviewSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  city: z.string().trim().max(80).optional(),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Pick a star rating.")
    .max(5, "Maximum 5 stars."),
  title: z.string().trim().max(160).optional(),
  body: z
    .string()
    .trim()
    .min(20, "A few more words, please — 20 characters minimum.")
    .max(4000),
  purchased: z.string().trim().max(160).optional(),
});

export async function submitReview(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = reviewSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city") || undefined,
    email: formData.get("email"),
    rating: formData.get("rating"),
    title: formData.get("title") || undefined,
    body: formData.get("body"),
    purchased: formData.get("purchased") || undefined,
  });
  if (!parsed.success) return flatten(parsed.error);

  await saveReview(parsed.data);
  await sendEnquiryEmails({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: `Review submission${parsed.data.title ? `: ${parsed.data.title}` : ""}`,
    message: `${parsed.data.rating}/5 — ${parsed.data.body}`,
  });
  return {
    ok: true,
    message: "Thank you — your review is with our team for approval.",
  };
}
