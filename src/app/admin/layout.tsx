import { getSession, destroySession } from "@/lib/auth";
import { AdminGuard } from "@/components/admin/AdminGuard";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/reviews", label: "Reviews" },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/", label: "Back to site" },
  ];

  return (
    <AdminGuard sessionEmail={session?.email ?? null}>
      {session ? (
        <div className="min-h-screen bg-alt">
          <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl">
            <div className="section flex h-14 items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/admin" className="text-[15px] font-semibold tracking-[-0.01em]">
                  Tony Used Campers Admin
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] text-muted">Signed in as {session.email}</span>
                <form action={async () => { "use server"; await destroySession(); }} className="m-0">
                  <button type="submit" className="btn btn-sm btn-ghost">
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </header>

          <div className="section grid gap-10 pb-20 pt-10 lg:grid-cols-[220px_1fr] lg:gap-12">
            <aside className="h-fit rounded-card bg-white p-5">
              <nav className="space-y-1">
                {nav.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-box px-2.5 py-2 text-[15px] text-ink-soft transition-colors hover:bg-alt hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="space-y-8">{children}</main>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </AdminGuard>
  );
}