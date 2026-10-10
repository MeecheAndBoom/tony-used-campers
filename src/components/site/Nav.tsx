"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SITE } from "@/lib/constants";
import { cartCount, useCartStore } from "@/store/cart";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track Order" },
] as const;

export function Nav({ siteName = SITE.name }: { siteName?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 nav-blur transition-shadow duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        scrolled ? "shadow-[0_1px_0_rgba(0,0,0,0.08)]" : ""
      }`}
    >
      <nav className="section flex h-12 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="block"
            aria-label={`${siteName} home`}
          >
            <Image
              src="/tony-campers-logo.png"
              alt={siteName}
              width={2117}
              height={743}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[13px] leading-none transition-colors duration-[120ms] hover:text-ink ${
                    pathname.startsWith(link.href)
                      ? "text-ink"
                      : "text-ink-soft"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-full text-[15px] text-ink-soft transition-colors duration-[120ms] hover:bg-black/5 hover:text-ink"
          >
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          </Link>

          <Link
            href="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative grid h-9 w-9 place-items-center rounded-full text-[15px] text-ink-soft transition-colors duration-[120ms] hover:bg-black/5 hover:text-ink"
          >
            <i className="fa-solid fa-bag-shopping" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-[16px] place-items-center rounded-pill bg-accent px-1 text-[10px] font-semibold leading-4 text-white">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid h-9 w-9 place-items-center rounded-full text-[15px] text-ink-soft transition-colors duration-[120ms] hover:bg-black/5 hover:text-ink lg:hidden"
          >
            <i
              className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={`overflow-hidden border-t border-line-soft bg-white/95 backdrop-blur-xl transition-[opacity,transform] duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen
            ? "max-h-[70vh] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <ul className="section flex flex-col py-3">
          {LINKS.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{ transitionDelay: menuOpen ? `${i * 30}ms` : "0ms" }}
                className={`block border-b border-line-soft py-3.5 text-[17px] tracking-[-0.01em] transition-all duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                } ${
                  pathname.startsWith(link.href)
                    ? "text-accent"
                    : "text-ink hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
