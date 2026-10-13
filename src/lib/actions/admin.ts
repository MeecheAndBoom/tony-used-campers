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
import { deleteOrder, findOrder } from "@/lib/orders";
import { deleteEnquiry, listEnquiries, markEnquiryHandled } from "@/lib/enquiries";
import {
  updateSettings,
  type CloudinarySettings,
  type PaymentMethodSetting,
  type SiteInfo,
} from "@/lib/settings";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories";
import { sendOrderReply, sendEnquiryReply } from "@/lib/notifications";
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
  if (ref && message) {
    const order = await findOrder(ref);
    if (order) await sendOrderReply(order, message);
  }
  redirect(`/admin/orders/${encodeURIComponent(ref)}`);
}

/* ───────────────────────── Enquiries ───────────────────────── */

/** Reply to an enquiry via SMTP and mark it handled. */
export async function replyToEnquiryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const message = String(formData.get("reply") ?? "").trim();
  if (id && message) {
    const enquiries = await listEnquiries();
    const enquiry = enquiries.find((e) => e.id === id);
    if (enquiry) await sendEnquiryReply(enquiry, message);
    await markEnquiryHandled(id);
  }
  redirect("/admin/enquiries");
}

export async function deleteEnquiryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (id) await deleteEnquiry(id);
  redirect("/admin/enquiries");
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