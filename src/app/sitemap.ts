import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const STATIC_PAGES = [
  "",
  "/shop",
  "/about",
  "/services",
  "/why-buy-from-us",
  "/finance",
  "/sell",
  "/first-time-buyers",
  "/faq",
  "/testimonials",
  "/contact",
  "/track",
  "/search",
  "/sitemap",
  "/legal/privacy",
  "/legal/terms",
  "/legal/cookies",
  "/legal/shipping",
  "/legal/returns",
  "/legal/accessibility",
  "/legal/disclaimer",
  "/legal/finance-disclosure",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();

  return [
    ...STATIC_PAGES.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: (path === "" || path === "/shop"
        ? "daily"
        : "monthly") as "daily" | "monthly",
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
