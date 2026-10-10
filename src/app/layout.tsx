import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { SITE_KEYWORDS } from "@/lib/seo";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s — ${site.name}`,
    },
    description:
      "Shop inspected used campers, travel trailers, fifth wheels and motorhomes in Detroit, Michigan. Transparent pricing, nationwide delivery and a simple online checkout.",
    keywords: [...SITE_KEYWORDS, site.name, `${site.name} Detroit`],
    openGraph: {
      title: `${site.name} — ${site.tagline}`,
      description:
        "Inspected used campers, travel trailers and motorhomes in Detroit, Michigan.",
      url: siteUrl,
      siteName: site.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/tony-campers-og.png",
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.tagline}`,
      description:
        "Inspected used campers, travel trailers and motorhomes in Detroit, Michigan.",
      images: ["/tony-campers-og.png"],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    manifest: "/site.webmanifest",
    other: { "theme-color": "#ffffff" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}