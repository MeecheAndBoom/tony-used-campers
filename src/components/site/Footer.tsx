import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import type { SiteInfo } from "@/lib/settings";

const COLUMNS: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { href: "/shop", label: "All campers" },
      { href: "/shop?type=Travel+Trailer", label: "Travel trailers" },
      { href: "/shop?type=Camper+Van", label: "Camper vans" },
      { href: "/shop?type=Class+C+Motorhome", label: "Motorhomes" },
      { href: "/shop?type=Pop-Up", label: "Pop-ups" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/blog", label: "Blog & guides" },
      { href: "/services", label: "Services" },
      { href: "/testimonials", label: "Reviews" },
      { href: "/contact", label: "Contact" },
      { href: "/track", label: "Track an order" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/legal/shipping", label: "Shipping & delivery" },
      { href: "/legal/returns", label: "Returns & refunds" },
      { href: "/legal/finance-disclosure", label: "Finance disclosure" },
      { href: "/contact", label: "Talk to a specialist" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms & conditions" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/cookies", label: "Cookies policy" },
      { href: "/legal/accessibility", label: "Accessibility" },
      { href: "/legal/disclaimer", label: "Disclaimer" },
      { href: "/sitemap", label: "Sitemap" },
    ],
  },
];

export function Footer({ site }: { site?: SiteInfo }) {
  const year = new Date().getFullYear();
  const info = site ?? (SITE as unknown as SiteInfo);
  const supportPhone = { href: `tel:${info.phoneHref}`, label: info.phone };
  const columns = COLUMNS.map((column) =>
    column.heading === "Support"
      ? { ...column, links: [...column.links, supportPhone] }
      : column,
  );

  return (
    <footer className="mt-auto bg-alt text-muted">
      <div className="section py-12 md:py-16">
        <Link
          href="/"
          aria-label={`${info.name} home`}
          className="mb-10 inline-block"
        >
          <Image
            src="https://res.cloudinary.com/hrnohv4p/image/upload/tuc/tony-campers-logo.png"
            alt={info.name}
            width={2117}
            height={743}
            className="h-12 w-auto object-contain"
          />
        </Link>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="mb-3 text-[12px] font-semibold tracking-[0.02em] text-ink">
                {column.heading}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[12px] leading-snug text-muted transition-colors duration-[120ms] hover:text-ink hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-[12px] leading-relaxed">
            {info.name} · {info.address} · {info.phone} ·{" "}
            <a
              href={`mailto:${info.email}`}
              className="transition-colors duration-[120ms] hover:text-ink hover:underline"
            >
              {info.email}
            </a>
          </p>
          <p className="mt-2 text-[12px] leading-relaxed">
            Copyright © {year} {info.name}, LLC. All rights reserved. ·{" "}
            <Link
              href="/legal/privacy"
              className="hover:text-ink hover:underline"
            >
              Privacy Policy
            </Link>{" "}
            ·{" "}
            <Link
              href="/legal/terms"
              className="hover:text-ink hover:underline"
            >
              Terms of Use
            </Link>{" "}
            ·{" "}
            <Link
              href="/legal/cookies"
              className="hover:text-ink hover:underline"
            >
              Cookie Settings
            </Link>
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-light">
            Prices exclude tax, title, registration and doc fees. Vehicles are
            sold as-is unless otherwise stated.
          </p>
        </div>
      </div>
    </footer>
  );
}