import Script from "next/script";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { PageFade } from "@/components/site/PageFade";
import { RouteProgress } from "@/components/site/RouteProgress";
import { getSettings } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { site } = await getSettings();

  return (
    <>
      <RouteProgress />
      <Nav siteName={site.name} />
      <main className="flex-1 pt-12">
        <PageFade>{children}</PageFade>
      </main>
      <Footer site={site} />
      <CartDrawer />
      <Script
        id="chatway"
        src="https://cdn.chatway.app/widget.js?id=Fc8seOuv9Yy3"
        strategy="afterInteractive"
      />
    </>
  );
}