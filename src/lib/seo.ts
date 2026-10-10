import { SITE } from "./constants";
import type { SiteInfo } from "./settings";
import type { Product as ProductRecord } from "./types";
import type { BlogPost as BlogPostRecord } from "./types";

/**
 * The site's core keyword set — chosen from live US search demand for the
 * used-RV category ("used campers for sale" 12.1K/mo, "used rv campers",
 * "used travel trailers", "used motorhomes for sale", plus Detroit/Michigan
 * local intent). Every page composes its keywords from this set plus its own
 * specifics so the signals stay consistent across the site.
 */
export const SITE_KEYWORDS = [
  "used campers for sale",
  "used RVs for sale",
  "used travel trailers",
  "used motorhomes for sale",
  "used fifth wheels for sale",
  "pre-owned campers",
  "affordable used campers",
  "used Class C motorhomes",
  "used Class A motorhomes",
  "camper dealership Detroit",
  "used campers for sale Michigan",
  "RV dealership Detroit MI",
  "sell my RV Michigan",
  "RV financing Detroit",
];

/** "Travel Trailer" -> "travel trailers", "Class A Motorhome" -> "class a motorhomes" */
function pluralizeType(type: string): string {
  const lower = type.toLowerCase();
  return lower.endsWith("s") ? lower : `${lower}s`;
}

export function productKeywords(product: ProductRecord): string[] {
  return [
    `${product.year} ${product.brand} ${product.model} for sale`,
    `used ${product.brand} ${product.model}`,
    `used ${pluralizeType(product.type)}`,
    `used ${pluralizeType(product.type)} Detroit`,
    `used ${pluralizeType(product.type)} Michigan`,
    product.condition === "new" ? `new ${product.brand} ${product.model}` : undefined,
    "used campers for sale",
    "used RVs for sale",
  ].filter(Boolean) as string[];
}

export function postKeywords(post: BlogPostRecord): string[] {
  return Array.from(
    new Set([...post.tags, post.category.toLowerCase(), ...SITE_KEYWORDS.slice(0, 6)]),
  );
}

/** Title tag for a product — year + unit + price, under ~65 chars where possible. */
export function productTitle(product: ProductRecord): string {
  return `${product.year} ${product.title} for Sale — $${product.price.toLocaleString("en-US")}`;
}

/**
 * Meta description composed from the real spec sheet, so every unit gets a
 * unique, keyword-rich description without anyone writing one by hand.
 */
export function productDescription(product: ProductRecord): string {
  const specs = [
    product.specs.length && `${product.specs.length} long`,
    product.specs.sleeps && `sleeps ${product.specs.sleeps}`,
    product.specs.slides && product.specs.slides !== "0" && `${product.specs.slides} slide-outs`,
    product.specs.weight,
  ]
    .filter(Boolean)
    .join(" · ");
  const base = `Used ${product.year} ${product.brand} ${product.model} — a ${product.type.toLowerCase()} in Detroit, MI. ${specs}. ${product.description}`;
  const financing = product.monthlyFrom
    ? ` Financing from $${product.monthlyFrom}/mo.`
    : "";
  return `${base}${financing}`.replace(/\s+/g, " ").slice(0, 158).trim();
}

export function postDescription(post: BlogPostRecord): string {
  return post.excerpt.slice(0, 158);
}

/* ───────────────────────── JSON-LD builders ───────────────────────── */

type JsonLd = Record<string, unknown>;

/**
 * Site origin without a trailing slash — Vercel's env often ends in "/", and
 * concatenating "/path" onto it would emit malformed `//path` URLs in the
 * sitemap, robots.txt and every JSON-LD graph.
 */
export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");
}

function url(path = ""): string {
  // Absolute URLs (e.g. Cloudinary-hosted assets) pass through untouched.
  if (/^https?:\/\//.test(path)) return path;
  return `${siteOrigin()}${path}`;
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: url(),
    description: SITE.tagline,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url()}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Parse "9:00 AM – 6:00 PM" into schema.org "09:00"/"18:00" hours. */
function parseTime(value: string): string | null {
  const match = value
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hour = Number(match[1]);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

const DAY_NAMES: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};

const DAY_GROUPS: { test: RegExp; days: string[] }[] = [
  { test: /monday\s*[–—-]\s*friday/i, days: ["Mo", "Tu", "We", "Th", "Fr"] },
  { test: /monday\s*[–—-]\s*sunday/i, days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] },
  { test: /saturday\s*[–—-]\s*sunday/i, days: ["Sa", "Su"] },
  { test: /monday/i, days: ["Mo"] },
  { test: /tuesday/i, days: ["Tu"] },
  { test: /wednesday/i, days: ["We"] },
  { test: /thursday/i, days: ["Th"] },
  { test: /friday/i, days: ["Fr"] },
  { test: /saturday/i, days: ["Sa"] },
  { test: /sunday/i, days: ["Su"] },
];

function openingHours(hours: SiteInfo["hours"]): JsonLd[] {
  const out: JsonLd[] = [];
  for (const row of hours) {
    if (/closed/i.test(row.time)) continue;
    const group = DAY_GROUPS.find((g) => g.test.test(row.days));
    const range = row.time.split(/[–—-]/);
    const opens = range[0] ? parseTime(range[0]) : null;
    const closes = range[1] ? parseTime(range[1]) : null;
    if (!group || !opens || !closes) continue;
    out.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: group.days.map(
        (d) => `https://schema.org/${DAY_NAMES[d] ?? d}`,
      ),
      opens,
      closes,
    });
  }
  return out;
}

export function localBusinessJsonLd(
  site: SiteInfo,
  rating?: { average: number; count: number },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    url: url(),
    image: url("https://res.cloudinary.com/hrnohv4p/image/upload/tuc/tony-campers-og.png"),
    description: `${site.name} sells inspected used campers, travel trailers, fifth wheels and motorhomes in ${site.location}.`,
    telephone: site.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.split(",")[0]?.trim() ?? site.address,
      addressLocality: "Detroit",
      addressRegion: "MI",
      postalCode: "48208",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 42.3373, longitude: -83.0644 },
    openingHoursSpecification: openingHours(site.hours),
    areaServed: [
      { "@type": "City", name: "Detroit" },
      { "@type": "State", name: "Michigan" },
    ],
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
          },
        }
      : {}),
  };
}

export function productJsonLd(
  product: ProductRecord,
  site: SiteInfo,
  rating?: { average: number; count: number },
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.year} ${product.title}`,
    description: productDescription(product),
    image: product.images.map((image) => url(image)),
    url: url(`/shop/${product.slug}`),
    sku: product.stockNumber,
    brand: { "@type": "Brand", name: product.brand },
    model: product.model,
    category: product.type,
    itemCondition:
      product.condition === "new"
        ? "https://schema.org/NewCondition"
        : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: url(`/shop/${product.slug}`),
      seller: { "@type": "Organization", name: site.name },
      ...(product.monthlyFrom
        ? {
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "USD",
              minPrice: product.monthlyFrom,
            },
          }
        : {}),
    },
    ...(rating && rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
          },
        }
      : {}),
  };
}

export function articleJsonLd(post: BlogPostRecord): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: postDescription(post),
    image: post.image ? [url(post.image)] : undefined,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    mainEntityOfPage: url(`/blog/${post.slug}`),
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: url("https://res.cloudinary.com/hrnohv4p/image/upload/tuc/tony-campers-logo.png") },
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
  };
}

export function blogJsonLd(posts: BlogPostRecord[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE.name} Blog`,
    url: url("/blog"),
    description:
      "Straight answers on buying, owning and maintaining used campers and RVs — from the lot on Michigan Ave.",
    blogPost: posts.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: url(`/blog/${post.slug}`),
      datePublished: post.date,
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path?: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path !== undefined ? { item: url(item.path) } : {}),
    })),
  };
}

export function faqJsonLd(
  qa: { question: string; answer: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
