"use server";

import { redirect } from "next/navigation";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductInput,
} from "@/lib/products";
import {
  createReview,
  updateReview,
  deleteReview,
  setReviewPublished,
} from "@/lib/reviews";
import { deleteOrder, findOrder, listOrders, updateOrder } from "@/lib/orders";
import { deleteEnquiry, listEnquiries, markEnquiryHandled } from "@/lib/enquiries";
import {
  updateSettings,
  getSettings,
  type CloudinarySettings,
  type PaymentMethodSetting,
  type SiteInfo,
} from "@/lib/settings";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories";
import { sendOrderReply, sendEnquiryReply, sendPaymentInstructions, sendPaymentConfirmed, sendStatusUpdate } from "@/lib/notifications";
import { mailQuery } from "@/lib/mail-result";
import { sendEmail, verifyMailer } from "@/lib/mailer";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  BLOG_CATEGORIES,
  type BlogPostInput,
} from "@/lib/blog";

const PRODUCT_TYPES = [
  "Travel Trailer",
  "Camper Van",
  "Class C Motorhome",
  "Class A Motorhome",
  "Fifth Wheel",
  "Pop-Up",
  "Teardrop",
];

/* ───────────────────────── Products ───────────────────────── */

function parseProduct(formData: FormData): ProductInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const num = (name: string) => {
    const v = Number(formData.get(name) ?? "");
    return Number.isFinite(v) ? v : undefined;
  };
  const lines = (name: string) =>
    str(name)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  return {
    slug: str("slug") || undefined,
    title: str("title"),
    brand: str("brand"),
    model: str("model"),
    year: Number(str("year")) || new Date().getFullYear(),
    condition: (str("condition") === "new" ? "new" : "used") as "used" | "new",
    type: (PRODUCT_TYPES.includes(str("type")) ? str("type") : "Travel Trailer") as ProductInput["type"],
    price: Number(str("price")) || 0,
    listPrice: num("listPrice"),
    monthlyFrom: num("monthlyFrom"),
    stockNumber: str("stockNumber"),
    specs: {
      length: str("specsLength"),
      sleeps: str("specsSleeps"),
      weight: str("specsWeight"),
      axles: str("specsAxles"),
      slides: str("specsSlides"),
    },
    description: str("description"),
    features: lines("features"),
    images: lines("images"),
    status: (str("status") === "draft" ? "draft" : "live") as "live" | "draft",
    featured: formData.get("featured") === "on",
  };
}

export async function createProductAction(formData: FormData) {
  const input = parseProduct(formData);
  if (!input.title || !input.brand || !input.model) {
    redirect("/admin/products/new?error=missing-fields");
  }
  await createProduct(input);
  redirect("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!slug) redirect("/admin/products");
  const input = parseProduct(formData);
  await updateProduct(slug, input);
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (slug) await deleteProduct(slug);
  redirect("/admin/products");
}

/* ───────────────────────── Blog ───────────────────────── */

function parseBlogPost(formData: FormData): BlogPostInput {
  const str = (name: string) => String(formData.get(name) ?? "").trim();
  const lines = (name: string) =>
    str(name)
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

  const category = str("category");
  return {
    slug: str("slug") || undefined,
    title: str("title"),
    excerpt: str("excerpt"),
    category: (BLOG_CATEGORIES.includes(category as never)
      ? category
      : BLOG_CATEGORIES[0]) as BlogPostInput["category"],
    tags: lines("tags"),
    author: str("author") || "Tony Marchetti",
    date: str("date") || new Date().toISOString().slice(0, 10),
    image: str("image") || "https://res.cloudinary.com/qkbrqtav/image/upload/tuc/images/hero-road.jpg",
    body: str("body"),
    readMinutes: Number(str("readMinutes")) || undefined,
    status: (str("status") === "draft" ? "draft" : "live") as "live" | "draft",
    featured: formData.get("featured") === "on",
  };
}

export async function createBlogPostAction(formData: FormData) {
  const input = parseBlogPost(formData);
  if (!input.title || !input.body) {
    redirect("/admin/blog/new?error=missing-fields");
  }
  await createBlogPost(input);
  redirect("/admin/blog");
}

export async function updateBlogPostAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!slug) redirect("/admin/blog");
  const input = parseBlogPost(formData);
  await updateBlogPost(slug, input);
  redirect("/admin/blog");
}

export async function deleteBlogPostAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (slug) await deleteBlogPost(slug);
  redirect("/admin/blog");
}

/* ───────────────────────── Reviews ───────────────────────── */

export async function createReviewAction(formData: FormData) {
  await createReview({
    name: String(formData.get("name") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim() || undefined,
    rating: Number(formData.get("rating")) || 5,
    title: String(formData.get("title") ?? "").trim() || undefined,
    body: String(formData.get("body") ?? "").trim(),
    purchased: String(formData.get("purchased") ?? "").trim() || undefined,
    published: formData.get("published") === "on",
  });
  redirect("/admin/reviews");
}

export async function editReviewAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/admin/reviews");
  await updateReview(id, {
    name: String(formData.get("name") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim() || undefined,
    rating: Number(formData.get("rating")) || 5,
    title: String(formData.get("title") ?? "").trim() || undefined,
    body: String(formData.get("body") ?? "").trim(),
    purchased: String(formData.get("purchased") ?? "").trim() || undefined,
    published: formData.get("published") === "on",
  });
  redirect("/admin/reviews");
}

export async function publishReviewAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) await setReviewPublished(id, true);
  redirect("/admin/reviews");
}

export async function unpublishReviewAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) await setReviewPublished(id, false);
  redirect("/admin/reviews");
}

export async function deleteReviewAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) await deleteReview(id);
  redirect("/admin/reviews");
}

/* ───────────────────────── Orders ───────────────────────── */

export async function deleteOrderAction(formData: FormData) {
  const ref = String(formData.get("ref") ?? "").trim();
  if (ref) await deleteOrder(ref);
  redirect("/admin/orders");
}

/** Reply to an order's customer via SMTP from the order detail page. */
export async function replyToOrderAction(formData: FormData) {
  const ref = String(formData.get("ref") ?? "").trim();
  const message = String(formData.get("reply") ?? "").trim();
  const back = `/admin/orders/${encodeURIComponent(ref)}`;

  if (!ref) redirect("/admin/orders");
  if (!message) redirect(`${back}?mail=reply-empty`);

  const order = await findOrder(ref);
  if (!order) redirect(`${back}?mail=reply-missing`);

  const result = await sendOrderReply(order, message);
  redirect(`${back}?${mailQuery(result, "reply")}`);
}

/**
 * Dashboard controls on the order detail page: send payment instructions,
 * mark the payment received, or move the order status. Each one emails the
 * customer, so the redirect carries the real delivery outcome back to the UI.
 */
export async function updateOrderAction(formData: FormData) {
  const ref = String(formData.get("ref") ?? "").trim();
  if (!ref) return;
  const action = String(formData.get("action") ?? "");
  const order = (await listOrders()).find((o) => o.reference === ref);
  if (!order) return;

  const now = new Date().toISOString();
  let result: Awaited<ReturnType<typeof sendPaymentInstructions>> | undefined;
  let kind = "update";

  if (action === "send-payment") {
    const instructions = String(formData.get("instructions") ?? "");
    const amountDue = Number(formData.get("amountDue") ?? order.total);
    const dueDate = String(formData.get("dueDate") ?? "");
    const methodLabel = String(
      formData.get("methodLabel") ?? order.payment.label,
    );
    const patched = {
      ...order,
      payment: {
        ...order.payment,
        instructions,
        amountDue,
        dueDate,
        label: methodLabel,
        status: "pending" as const,
      },
      status: "Payment Pending" as const,
      statusHistory: [
        ...order.statusHistory,
        { status: "Payment Pending", note: "Payment details emailed to client", at: now },
      ],
    };
    await updateOrder(ref, patched);
    result = await sendPaymentInstructions(patched);
    kind = "payment";
    if (!result.delivered) {
      // Don't leave history claiming an email went out when it didn't.
      const history = patched.statusHistory.map((entry, i) =>
        i === patched.statusHistory.length - 1
          ? { ...entry, note: "Payment details prepared — email could not be sent" }
          : entry,
      );
      await updateOrder(ref, { ...patched, statusHistory: history });
    }
  } else if (action === "mark-paid") {
    const patched = {
      ...order,
      payment: {
        ...order.payment,
        status: "received" as const,
        receivedAt: now,
      },
      status: "Payment Received" as const,
      statusHistory: [
        ...order.statusHistory,
        { status: "Payment Received", note: "Marked as paid by admin", at: now },
      ],
    };
    await updateOrder(ref, patched);
    result = await sendPaymentConfirmed(patched);
    kind = "confirmed";
  } else if (action === "status") {
    const status = String(formData.get("status") ?? order.status) as typeof order.status;
    if (status !== order.status) {
      const patched = {
        ...order,
        status,
        statusHistory: [
          ...order.statusHistory,
          { status, note: "Status updated in dashboard", at: now },
        ],
      };
      await updateOrder(ref, patched);
      result = await sendStatusUpdate(patched);
      kind = "status";
    }
  }
  redirect(
    result
      ? `/admin/orders/${encodeURIComponent(ref)}?${mailQuery(result, kind)}`
      : `/admin/orders/${encodeURIComponent(ref)}?mail=noop`,
  );
}

/* ───────────────────────── Enquiries ───────────────────────── */

/** Reply to an enquiry via SMTP and mark it handled once the email is sent. */
export async function replyToEnquiryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const message = String(formData.get("reply") ?? "").trim();
  if (!id) redirect("/admin/enquiries");
  if (!message) redirect("/admin/enquiries?mail=reply-empty");

  const enquiries = await listEnquiries();
  const enquiry = enquiries.find((e) => e.id === id);
  if (!enquiry) redirect("/admin/enquiries?mail=reply-missing");

  const result = await sendEnquiryReply(enquiry, message);
  // Keep it in the pending pile when the email failed so it isn't forgotten.
  if (result.delivered) await markEnquiryHandled(id);
  redirect(`/admin/enquiries?${mailQuery(result, "reply")}`);
}

export async function deleteEnquiryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) await deleteEnquiry(id);
  redirect("/admin/enquiries");
}

/* ───────────────────────── Email diagnostics ───────────────────────── */

export async function verifyMailerAction() {
  const result = await verifyMailer();
  redirect(
    result.ok
      ? "/admin/diagnostics?verify=ok"
      : `/admin/diagnostics?verify=failed&reason=${encodeURIComponent(
          result.error ?? "The mail server did not respond.",
        )}`,
  );
}

export async function sendTestEmailAction(formData: FormData) {
  const { site } = await getSettings();
  const to = String(formData.get("to") ?? "").trim() || site.adminEmail;
  const result = await sendEmail({
    to,
    subject: "Test email — Tony Used Campers dashboard",
    tag: "admin-test",
    html: `<p>This is a test message from the Tony Used Campers admin dashboard.</p><p>If you can read this, SMTP delivery is working.</p>`,
    text: "This is a test message from the Tony Used Campers admin dashboard. If you can read this, SMTP delivery is working.",
  });
  redirect(
    result.delivered
      ? `/admin/diagnostics?test=sent&to=${encodeURIComponent(to)}`
      : `/admin/diagnostics?test=failed&reason=${encodeURIComponent(
          result.error ?? "The message was not delivered.",
        )}`,
  );
}

/* ───────────────────────── Categories ───────────────────────── */

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  if (name) await createCategory({ name, image });
  redirect("/admin/categories");
}

export async function updateCategoryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  if (id && name) await updateCategory(id, { name, image });
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (id) await deleteCategory(id);
  redirect("/admin/categories");
}

/* ───────────────────────── Settings ───────────────────────── */

function parseHours(formData: FormData) {
  const days = formData.getAll("hoursDays").map((d) => String(d).trim());
  const times = formData.getAll("hoursTime").map((t) => String(t).trim());
  return days
    .map((d, i) => ({ days: d, time: times[i] ?? "" }))
    .filter((h) => h.days || h.time);
}

export async function saveSettingsAction(formData: FormData) {
  const site: Partial<SiteInfo> = {
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("salesEmail") ?? "").trim(),
    adminEmail: String(formData.get("adminEmail") ?? "").trim(),
    hours: parseHours(formData),
  };
  const digits = site.phone?.replace(/\D/g, "");
  if (digits && digits.length >= 10) {
    // Store E.164 so `tel:` links always carry a leading "+".
    site.phoneHref =
      digits.startsWith("1") && digits.length === 11 ? `+${digits}` : `+1${digits}`;
  }

  const ids = formData.getAll("methodId").map((id) => String(id));
  const labels = formData.getAll("methodLabel").map((l) => String(l).trim());
  const hints = formData.getAll("methodHint").map((h) => String(h).trim());
  const paymentMethods: PaymentMethodSetting[] = ids
    .map((id, i) => ({
      id: id.trim() || `method-${i + 1}`,
      label: labels[i] ?? "",
      hint: hints[i] ?? "",
    }))
    .filter((m) => m.label);

  // Cloudinary credentials for dashboard image uploads. The API secret is
  // write-only: leaving it blank keeps whatever is already saved.
  const cloudinary: Partial<CloudinarySettings> = {
    cloudName: String(formData.get("cloudinaryCloudName") ?? "").trim(),
    apiKey: String(formData.get("cloudinaryApiKey") ?? "").trim(),
  };
  const apiSecret = String(formData.get("cloudinaryApiSecret") ?? "").trim();
  if (apiSecret) cloudinary.apiSecret = apiSecret;

  await updateSettings({ site, paymentMethods, cloudinary });
  redirect("/admin/settings?saved=1");
}