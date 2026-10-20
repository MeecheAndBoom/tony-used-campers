import { findOrder } from "@/lib/orders";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dateTime, money } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/constants";
import { getSettings } from "@/lib/settings";
import {
  deleteOrderAction,
  replyToOrderAction,
  updateOrderAction,
} from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PendingButton } from "@/components/admin/PendingButton";
import { MailNotice } from "@/components/admin/MailNotice";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ mail?: string; reason?: string }>;
}) {
  const { ref } = await params;
  const { mail, reason } = await searchParams;
  const order = await findOrder(ref);
  if (!order) notFound();

  const { site } = await getSettings();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
            Order {order.reference}
          </h1>
          <p className="mt-1 text-[15px] text-muted">
            {order.customer.name} · {order.customer.email} · Placed{" "}
            {order.createdAt ? dateTime(order.createdAt) : "—"}
          </p>
        </div>
        <Link href="/admin/orders" className="text-[14px] text-accent hover:underline">
          ← Back to orders
        </Link>
      </div>

      <MailNotice mail={mail} reason={reason} />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left */}
        <div className="space-y-8">
          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Items & totals
            </h2>
            <ul className="mt-4">
              {order.items.map((item) => (
                <li
                  key={item.slug}
                  className="flex items-center justify-between border-b border-line-soft py-3 text-[14px] last:border-0"
                >
                  <span>
                    {item.title}
                    <span className="text-muted"> · Qty {item.qty}</span>
                  </span>
                  <span>{money(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line-soft pt-4 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{money(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery / pickup</dt>
                <dd>{order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}</dd>
              </div>
              <div className="flex justify-between border-t border-line-soft pt-3 text-[17px] font-semibold">
                <dt>Total</dt>
                <dd>{money(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Customer & delivery
            </h2>
            <dl className="mt-4 grid gap-4 text-[15px] sm:grid-cols-2">
              <div>
                <dt className="text-muted">Name</dt>
                <dd>{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd>{order.customer.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd>{order.customer.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Method</dt>
                <dd>
                  {order.delivery.method === "delivery" ? "Delivery" : "Pickup"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted">Address</dt>
                <dd>
                  {order.delivery.method === "delivery"
                    ? [
                        order.delivery.address?.line1,
                        [order.delivery.address?.city, order.delivery.address?.state, order.delivery.address?.zip]
                          .filter(Boolean)
                          .join(", "),
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"
                    : `Pickup at lot — ${site.address}`}
                </dd>
              </div>
              {order.customer.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-muted">Notes</dt>
                  <dd className="whitespace-pre-line">{order.customer.notes}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              History
            </h2>
            <ul className="mt-4 space-y-2 text-[14px]">
              {[...order.statusHistory].reverse().map((entry, i) => (
                <li key={`${entry.at}-${i}`} className="flex justify-between">
                  <span>
                    {entry.status}
                    {entry.note && <span className="text-muted"> — {entry.note}</span>}
                  </span>
                  <span className="text-muted">{dateTime(entry.at)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reply to customer */}
          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Reply to customer
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Emailed to {order.customer.email} via SMTP (no status change, no
              auto-reply emails). For updates that notify the client, use the
              status controls instead.
            </p>
            <form action={replyToOrderAction} className="mt-4 space-y-3">
              <input type="hidden" name="ref" value={order.reference} />
              <textarea
                name="reply"
                rows={4}
                required
                className="field"
                placeholder="Write a message to the customer…"
              />
              <PendingButton label="Send reply" pendingLabel="Sending reply…" />
            </form>
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-8">
          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Send payment details (email #3)
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Fills the “Payment instructions” email with amount, method and
              instructions. Changes status to Payment Pending.
            </p>
            <form action={updateOrderAction} className="mt-5 space-y-4">
              <input type="hidden" name="ref" value={order.reference} />
              <input type="hidden" name="action" value="send-payment" />
              <div>
                <label className="field-label">Method label</label>
                <input
                  name="methodLabel"
                  defaultValue={order.payment.label}
                  className="field"
                  placeholder="Cashier's Check / Bank Transfer"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Amount due</label>
                  <input
                    name="amountDue"
                    type="number"
                    step="0.01"
                    defaultValue={order.total}
                    className="field"
                  />
                </div>
                <div>
                  <label className="field-label">Due date</label>
                  <input
                    name="dueDate"
                    type="date"
                    defaultValue={order.payment.dueDate ?? ""}
                    className="field"
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Instructions</label>
                <textarea
                  name="instructions"
                  rows={5}
                  className="field"
                  defaultValue={
                    order.payment.instructions ??
                    `Pay to: ${site.name}\n\nMail cashier's check to:\n${site.address}\n\nReference: ${order.reference}`
                  }
                />
              </div>
              <PendingButton
                label="Send payment instructions"
                pendingLabel="Sending payment details…"
                className="btn btn-primary w-full"
              />
            </form>
          </div>

          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Mark as payment received
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Sends confirmation email #4 and advances status to Payment Received.
            </p>
            <form action={updateOrderAction} className="mt-4">
              <input type="hidden" name="ref" value={order.reference} />
              <input type="hidden" name="action" value="mark-paid" />
              <PendingButton
                label={
                  order.payment.status === "received"
                    ? "Already marked as received"
                    : "Mark as payment received"
                }
                pendingLabel="Sending confirmation…"
                disabled={order.payment.status === "received"}
                className="btn btn-secondary w-full"
              />
            </form>
          </div>

          <div className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Update order status
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Moves the stepper and emails the client (status update #5).
            </p>
            <form action={updateOrderAction} className="mt-4 space-y-3">
              <input type="hidden" name="ref" value={order.reference} />
              <input type="hidden" name="action" value="status" />
              <select name="status" defaultValue={order.status} className="field">
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <PendingButton
                label="Apply status update"
                pendingLabel="Sending status update…"
                className="btn btn-primary w-full"
              />
            </form>
          </div>

          <div className="rounded-card border border-danger/30 bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Danger zone
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Permanently removes this order and its history.
            </p>
            <form action={deleteOrderAction} className="mt-4">
              <input type="hidden" name="ref" value={order.reference} />
              <DeleteButton
                label="Delete order"
                message={`Delete order ${order.reference} and all its history? This can't be undone.`}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}