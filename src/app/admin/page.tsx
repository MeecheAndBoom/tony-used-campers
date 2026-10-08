import { getSession } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import { listEnquiries } from "@/lib/enquiries";
import { getProducts } from "@/lib/products";
import { getReviews } from "@/lib/reviews";
import { money } from "@/lib/format";

export default async function AdminOverviewPage() {
  const session = await getSession();
  if (!session) return null;

  const [orders, enquiries, products, reviews] = await Promise.all([
    listOrders(),
    listEnquiries(),
    getProducts(),
    getReviews(),
  ]);
  const revenue = orders
    .filter((o) => o.payment.status === "received")
    .reduce((sum, o) => sum + o.total, 0);
  const recent = orders.slice(0, 6);

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Overview
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Snapshot of orders, enquiries and live inventory.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders" value={String(orders.length)} icon="fa-bag-shopping" />
        <StatCard
          label="Enquiries"
          value={String(enquiries.filter((e) => !e.handled).length)}
          icon="fa-envelope"
        />
        <StatCard
          label="Live campers"
          value={String(products.length)}
          icon="fa-caravan"
        />
        <StatCard
          label="Revenue (paid)"
          value={money(revenue)}
          icon="fa-dollar-sign"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Recent orders
          </h2>
          <ul className="mt-4">
            {recent.length === 0 && (
              <p className="text-[15px] text-muted">No orders yet.</p>
            )}
            {recent.map((order) => (
              <li
                key={order.reference}
                className="flex items-center justify-between border-b border-line-soft py-3 text-[14px] last:border-0"
              >
                <span className="min-w-0">
                  <span className="block font-medium text-ink">
                    {order.reference} — {order.customer.name}
                  </span>
                  <span className="text-muted">
                    {order.status} · {money(order.total)}
                  </span>
                </span>
                <a
                  href={`/admin/orders/${order.reference}`}
                  className="text-[13px] text-accent hover:underline"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Quick actions
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="btn btn-primary btn-sm" href="/admin/orders">
              Manage orders
            </a>
            <a className="btn btn-sm bg-alt" href="/admin/products">
              Manage inventory
            </a>
            <a className="btn btn-sm bg-alt" href="/admin/enquiries">
              Reply to enquiries
            </a>
            <a className="btn btn-sm bg-alt" href="/shop" target="_blank">
              View shop
            </a>
          </div>

          <div className="mt-6">
            <h3 className="text-[15px] font-semibold">Pending reviews</h3>
            <p className="mt-1 text-[15px] text-muted">
              {reviews.length} published, new submissions land in{" "}
              <span className="font-medium text-ink">data/reviews-pending.json</span>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-card bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted">{label}</p>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-sky text-[13px] text-accent">
          <i className={`fa-solid ${icon}`} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em] text-ink">
        {value}
      </p>
    </div>
  );
}
