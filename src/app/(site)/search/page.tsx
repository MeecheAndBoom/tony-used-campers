import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/products";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Tony Used Campers inventory and site pages.",
};

const SITE_LINKS = [
  { href: "/shop", label: "Shop all campers" },
  { href: "/about", label: "About us" },
  { href: "/services", label: "Services & repair" },
  { href: "/why-buy-from-us", label: "Why buy from us" },
  { href: "/finance", label: "Financing" },
  { href: "/sell", label: "Sell or trade your camper" },
  { href: "/first-time-buyers", label: "First-time buyer's guide" },
  { href: "/faq", label: "FAQ" },
  { href: "/testimonials", label: "Testimonials & reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track an order" },
];

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const products = await getProducts();
  const inventory = query
    ? products.filter((p) =>
        `${p.title} ${p.brand} ${p.model} ${p.type} ${p.year} ${p.description} ${p.features.join(" ")}`
          .toLowerCase()
          .includes(query),
      )
    : [];
  const pages = query
    ? SITE_LINKS.filter((link) => link.label.toLowerCase().includes(query))
    : [];

  return (
    <div className="bg-white">
      <section className="section pb-8 pt-16 md:pt-24">
        <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">
          Search.
        </h1>

        <form method="GET" className="mt-6 max-w-[560px]">
          <label htmlFor="q" className="sr-only">
            Search the site
          </label>
          <div className="relative">
            <i
              className="fa-solid fa-magnifying-glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-light"
              aria-hidden="true"
            />
            <input
              id="q"
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Search campers, pages, guides…"
              className="field !pl-11"
            />
          </div>
        </form>
      </section>

      <section className="section pb-20 md:pb-28">
        {query && (
          <p className="mb-8 text-[15px] text-muted">
            {inventory.length + pages.length === 0
              ? "No results"
              : `${inventory.length + pages.length} result${inventory.length + pages.length === 1 ? "" : "s"}`}
            {""} for “{q}”
          </p>
        )}

        {inventory.length > 0 && (
          <div className="mb-14">
            <h2 className="mb-6 text-[19px] font-semibold tracking-[-0.01em]">
              Campers
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {inventory.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group flex items-center gap-4 rounded-card border border-line-soft p-3 transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-line hover:shadow-[0_12px_28px_-16px_rgba(0,0,0,0.2)]"
                  >
                    <span className="relative aspect-[4/3] w-[96px] shrink-0 overflow-hidden rounded-box bg-alt">
                      <Image
                        src={product.images[0]}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-medium text-ink transition-colors group-hover:text-accent">
                        {product.title}
                      </span>
                      <span className="mt-0.5 block text-[13px] text-muted">
                        {product.type} · {money(product.price)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pages.length > 0 && (
          <div className="mb-14">
            <h2 className="mb-5 text-[19px] font-semibold tracking-[-0.01em]">
              Pages
            </h2>
            <ul className="max-w-[560px] border-t border-line">
              {pages.map((link) => (
                <li key={link.href} className="border-b border-line-soft">
                  <Link
                    href={link.href}
                    className="block py-3.5 text-[16px] text-ink transition-colors hover:text-accent"
                  >
                    {link.label}
                    <span className="ml-2 text-[13px] text-muted">{link.href}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {query && inventory.length + pages.length === 0 && (
          <div className="rounded-card bg-alt px-6 py-14 text-center">
            <h2 className="text-[20px] font-semibold">Nothing found.</h2>
            <p className="mx-auto mt-2 max-w-[420px] text-[15px] text-muted">
              Try a brand (Jayco, Winnebago), a type (travel trailer, van), or
              just call the lot — we answer.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn btn-primary">
                Browse all campers
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Contact us
              </Link>
            </div>
          </div>
        )}

        {!query && (
          <div className="max-w-[560px]">
            <h2 className="mb-5 text-[19px] font-semibold tracking-[-0.01em]">
              Popular pages
            </h2>
            <ul className="border-t border-line">
              {SITE_LINKS.slice(0, 7).map((link) => (
                <li key={link.href} className="border-b border-line-soft">
                  <Link
                    href={link.href}
                    className="block py-3.5 text-[16px] text-ink transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
