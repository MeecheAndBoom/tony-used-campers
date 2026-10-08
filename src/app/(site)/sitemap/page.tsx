import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page on the Tony Used Campers website.",
};

const GROUPS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All campers" },
      { href: "/cart", label: "Your bag" },
      { href: "/checkout", label: "Checkout" },
      { href: "/track", label: "Track an order" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/services", label: "Services & repair" },
      { href: "/why-buy-from-us", label: "Why buy from us" },
      { href: "/testimonials", label: "Testimonials & reviews" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Buying tools",
    links: [
      { href: "/finance", label: "Financing" },
      { href: "/sell", label: "Sell or trade your camper" },
      { href: "/first-time-buyers", label: "First-time buyer's guide" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/terms", label: "Terms & conditions" },
      { href: "/legal/cookies", label: "Cookie policy" },
      { href: "/legal/shipping", label: "Shipping & delivery" },
      { href: "/legal/returns", label: "Returns & refunds" },
      { href: "/legal/accessibility", label: "Accessibility" },
      { href: "/legal/disclaimer", label: "Disclaimer" },
      { href: "/legal/finance-disclosure", label: "Finance disclosure" },
    ],
  },
];

export default async function SitemapPage() {
  const products = await getProducts();

  return (
    <div className="bg-white">
      <section className="section pb-20 pt-16 md:pb-28 md:pt-24">
        <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
          Sitemap.
        </h1>
        <p className="mt-3 text-[17px] text-muted">
          Every page, in one place. Looking for a machine-readable version?{" "}
          <Link href="/sitemap.xml" className="text-accent hover:underline">
            sitemap.xml
          </Link>
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="mb-3 text-[13px] font-semibold tracking-[0.02em] text-ink">
                {group.heading}
              </h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="mb-4 text-[13px] font-semibold tracking-[0.02em] text-ink">
            Inventory ({products.length})
          </h2>
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.slug}>
                <Link
                  href={`/shop/${product.slug}`}
                  className="text-[15px] text-muted transition-colors hover:text-accent"
                >
                  {product.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
