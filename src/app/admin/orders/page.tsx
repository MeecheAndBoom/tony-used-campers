import { listOrders } from "@/lib/orders";
import { dateTime, money } from "@/lib/format";
import { deleteOrderAction } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Orders
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            Reserve, send payment details, mark paid and move status.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {orders.length === 0 && (
          <div className="rounded-card border border-line-soft bg-white p-6 text-[15px] text-muted sm:col-span-2 xl:col-span-3">
            No orders in the system yet.
          </div>
        )}
        {orders.map((order) => (
          <article
            key={order.reference}
            className="flex flex-col rounded-card border border-line-soft bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[13px] font-semibold tracking-[0.08em] text-ink">
                {order.reference}
              </span>
              <span
                className={`badge ${
                  order.payment.status === "received"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {order.payment.status === "received" ? "Received" : "Pending"}
              </span>
            </div>

            <p className="mt-3 text-[15px] font-medium text-ink">
              {order.customer.name}
            </p>
            <p className="break-all text-[13px] text-muted">
              {order.customer.email}
            </p>

            <dl className="mt-4 space-y-1.5 border-t border-line-soft pt-3 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Date</dt>
                <dd className="m-0 text-ink">
                  {order.createdAt ? dateTime(order.createdAt) : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Total</dt>
                <dd className="m-0 font-medium text-ink">
                  {money(order.total)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Status</dt>
                <dd className="m-0 text-ink">{order.status}</dd>
              </div>
            </dl>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-3">
              <a
                href={`/admin/orders/${order.reference}`}
                className="text-[13px] text-accent hover:underline"
              >
                View order
              </a>
              <form action={deleteOrderAction}>
                <input type="hidden" name="ref" value={order.reference} />
                <DeleteButton
                  label="Delete"
                  message={`Delete order ${order.reference}? This can't be undone.`}
                />
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
