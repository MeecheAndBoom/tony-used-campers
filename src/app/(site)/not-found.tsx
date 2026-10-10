import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page isn't on the lot. Browse used campers for sale, the blog, or head back to the homepage.",
  robots: { index: false, follow: false },
};

/**
 * Site 404 — catches `notFound()` from routes inside the (site) group (a
 * draft or sold-out unit, a retired legal page). Renders inside the site
 * layout, so the Nav and Footer are already there.
 */
export default function SiteNotFound() {
  return (
    <div className="bg-white">
      <section className="section flex flex-col items-center py-24 text-center md:py-32">
        <p className="text-[clamp(5rem,16vw,10rem)] font-semibold leading-none tracking-[-0.04em] text-alt-deep select-none">
          404
        </p>
        <h1 className="mt-4 text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink">
          This page isn&apos;t on the lot.
        </h1>
        <p className="mt-4 max-w-[520px] text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-muted">
          The unit may have sold, the page may have moved, or the address has a
          typo in it. Everything we have is one tap away.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/shop" className="btn btn-secondary">
            Browse campers
          </Link>
          <Link href="/blog" className="btn btn-ghost">
            Read the blog
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[15px] text-muted">
          <Link href="/faq" className="transition-colors hover:text-accent">
            FAQ
          </Link>
          <Link href="/services" className="transition-colors hover:text-accent">
            Services
          </Link>
          <Link href="/sell" className="transition-colors hover:text-accent">
            Sell your camper
          </Link>
          <Link href="/contact" className="transition-colors hover:text-accent">
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
