import { listOrders, updateOrder } from "@/lib/orders";
import { redirect } from "next/navigation";
import { dateTime, money } from "@/lib/format";
import { sendPaymentInstructions, sendPaymentConfirmed, sendStatusUpdate } from "@/lib/notifications";
import { deleteOrderAction } from "@/lib/actions/admin";
import { DeleteButton } from "@/components/admin/DeleteButton";

async function updateAction(formData: FormData) {
  "use server";
  const ref = String(formData.get("ref") ?? "").trim();
  if (!ref) return;
  const action = String(formData.get("action") ?? "");
  const order = (await listOrders()).find((o) => o.reference === ref);
  if (!order) return;

  const now = new Date().toISOString();
  if (action === "send-payment") {
    const instructions = String(formData.get("instructions") ?? "");
    const amountDue = Number(formData.get("amountDue") ?? order.total);
    const dueDate = String(formData.get("dueDate") ?? "");
    const methodLabel = String(
      formData.get("methodLabel") ?? order.payment.label,
    );
    const patched = {
      ...order,
      payment: {
        ...order.payment,
        instructions,
        amountDue,
        dueDate,
        label: methodLabel,
        status: "pending" as const,
      },
      status: "Payment Pending" as const,
      statusHistory: [
        ...order.statusHistory,
        { status: "Payment Pending", note: "Payment details emailed to client", at: now },
      ],
    };
    await updateOrder(ref, patched);
    await sendPaymentInstructions(patched);
  } else if (action === "mark-paid") {
    const patched = {
      ...order,
      payment: {
        ...order.payment,
        status: "received" as const,
        receivedAt: now,
      },
      status: "Payment Received" as const,
      statusHistory: [
        ...order.statusHistory,
        { status: "Payment Received", note: "Marked as paid by admin", at: now },
      ],
    };
    await updateOrder(ref, patched);
    await sendPaymentConfirmed(patched);
  } else if (action === "status") {
    const status = String(formData.get("status") ?? order.status) as typeof order.status;
    if (status !== order.status) {
      const patched = {
        ...order,
        status,
        statusHistory: [
          ...order.statusHistory,
          { status, note: "Status updated in dashboard", at: now },
        ],
      };
      await updateOrder(ref, patched);
      await sendStatusUpdate(patched);
    }
  }
  redirect(`/admin/orders/${ref}`);
}

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

      <div className="overflow-hidden rounded-card bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead className="bg-alt text-left text-[13px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Payment</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-6 text-muted">
                    No orders in the system yet.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <tr key={order.reference} className="border-t border-line-soft">
                  <td className="px-5 py-3 font-mono text-[13px] font-semibold tracking-[0.08em] text-ink">
                    {order.reference}
                  </td>
                  <td className="px-5 py-3">
                    <span className="block text-ink">{order.customer.name}</span>
                    <span className="text-muted">{order.customer.email}</span>
                  </td>
                  <td className="px-5 py-3 text-muted">
                    {order.createdAt ? dateTime(order.createdAt) : "—"}
                  </td>
                  <td className="px-5 py-3 text-ink">{money(order.total)}</td>
                  <td className="px-5 py-3 text-muted">
                    {order.payment.label} ·{" "}
                    <span className={order.payment.status === "received" ? "text-success" : "text-warning"}>
                      {order.payment.status === "received" ? "Received" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{order.status}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-4">
                      <a
                        href={`/admin/orders/${order.reference}`}
                        className="text-[13px] text-accent hover:underline"
                      >
                        Open
                      </a>
                      <form action={deleteOrderAction}>
                        <input type="hidden" name="ref" value={order.reference} />
                        <DeleteButton
                          label="Delete"
                          message={`Delete order ${order.reference}? This can't be undone.`}
                        />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export { updateAction };
