import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page isn't on the lot. Browse used campers for sale, the blog, or head back to the homepage.",
  robots: { index: false, follow: false },
};

const SUGGESTIONS = [
  { href: "/shop", label: "Shop used campers", icon: "fa-caravan" },
  { href: "/blog", label: "Buying guides & blog", icon: "fa-newspaper" },
  { href: "/faq", label: "FAQ", icon: "fa-circle-question" },
  { href: "/contact", label: "Contact us", icon: "fa-envelope" },
] as const;

/**
 * Global 404 — catches unmatched URLs. Renders inside the bare root layout
 * (the site chrome lives in the (site) group), so it carries its own Nav and
 * Footer to stay consistent with every other page.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-12">
        <div className="bg-white">
          <section className="section flex flex-col items-center py-24 text-center md:py-32">
            <p className="text-[clamp(5rem,16vw,10rem)] font-semibold leading-none tracking-[-0.04em] text-alt-deep select-none">
              404
            </p>
            <h1 className="mt-4 text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.02em] text-ink">
              This page isn&apos;t on the lot.
            </h1>
            <p className="mt-4 max-w-[520px] text-[clamp(1rem,1.6vw,1.125rem)] leading-relaxed text-muted">
              The link may be old, the unit may have sold, or the address has a
              typo in it. Everything we have is one tap away.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="btn btn-primary">
                Back to home
              </Link>
              <Link href="/shop" className="btn btn-secondary">
                Browse campers
              </Link>
            </div>

            <ul className="mt-12 grid w-full max-w-[720px] gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-card border border-line-soft bg-alt px-5 py-4 text-[15px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    <i className={`fa-solid ${item.icon} w-5 text-center text-muted`} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
