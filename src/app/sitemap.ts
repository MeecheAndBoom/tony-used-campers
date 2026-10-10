import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { getBlogPosts } from "@/lib/blog";
import { siteOrigin } from "@/lib/seo";

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
  "/blog",
  "/testimonials",
  "/contact",
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

/** Utility routes — reachable but noindexed, so they stay out of the index. */
const EXCLUDED = new Set(["/track", "/search"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([getProducts(), getBlogPosts()]);
  const now = new Date();
  const siteUrl = siteOrigin();

  return [
    ...STATIC_PAGES.filter((path) => !EXCLUDED.has(path)).map((path) => ({
      url: `${siteUrl}${path || "/"}`,
      lastModified: now,
      changeFrequency: (path === "" || path === "/shop"
        ? "daily"
        : path === "/blog"
          ? "weekly"
          : "monthly") as "daily" | "weekly" | "monthly",
      priority: path === "" ? 1 : path === "/shop" ? 0.9 : path === "/blog" ? 0.8 : 0.6,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
