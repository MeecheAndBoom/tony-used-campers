import { CartDrawer } from "@/components/site/CartDrawer";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { PageFade } from "@/components/site/PageFade";
import { RouteProgress } from "@/components/site/RouteProgress";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RouteProgress />
      <Nav />
      <main className="flex-1 pt-12">
        <PageFade>{children}</PageFade>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
