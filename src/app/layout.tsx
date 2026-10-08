import type { Metadata } from "next";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { SITE } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "Shop inspected used campers, travel trailers and motorhomes in Detroit, Michigan. Transparent pricing, nationwide delivery and a simple online checkout.",
  keywords: [
    "used campers Detroit",
    "used RVs Michigan",
    "used travel trailers",
    "camper dealership Detroit",
    "Tony Used Campers",
  ],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description:
      "Inspected used campers, travel trailers and motorhomes in Detroit, Michigan.",
    url: siteUrl,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
