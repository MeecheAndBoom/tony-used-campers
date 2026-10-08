import { listEnquiries, markEnquiryHandled } from "@/lib/enquiries";
import { redirect } from "next/navigation";
import { dateTime } from "@/lib/format";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { replyToEnquiryAction, deleteEnquiryAction } from "@/lib/actions/admin";

async function handleAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  if (id) await markEnquiryHandled(id);
  redirect("/admin/enquiries");
}

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries();

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Enquiries
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Contact, finance, sell and review submissions. Write a reply below and
          it&apos;s emailed to the sender (SMTP), or delete once resolved.
        </p>
      </div>

      <div className="space-y-4">
        {enquiries.length === 0 && (
          <div className="rounded-card bg-white p-6 text-[15px] text-muted">
            Nothing in the inbox yet.
          </div>
        )}
        {enquiries.map((enq) => (
          <article key={enq.id} className="rounded-card bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-medium text-ink">
                  {enq.kind.toUpperCase()} · {enq.subject ?? "General enquiry"}
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  {enq.name} ·{" "}
                  <a href={`mailto:${enq.email}`} className="text-accent hover:underline">
                    {enq.email}
                  </a>
                  {enq.phone ? ` · ${enq.phone}` : ""}
                  {" · "}
                  {dateTime(enq.createdAt)}
                </p>
              </div>
              <span
                className={`badge ${enq.handled ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
              >
                {enq.handled ? "Handled" : "Pending"}
              </span>
            </div>

            {enq.message && (
              <p className="mt-4 whitespace-pre-line text-[15px] leading-[1.65] text-muted">
                {enq.message}
              </p>
            )}
            {enq.budget && (
              <p className="mt-2 text-[14px] text-muted">Budget: {enq.budget}</p>
            )}
            {enq.vehicle && (
              <p className="mt-1 text-[14px] text-muted">Vehicle: {enq.vehicle}</p>
            )}

            {/* Reply box — emails the sender and marks handled */}
            <form action={replyToEnquiryAction} className="mt-5 border-t border-line-soft pt-4">
              <input type="hidden" name="id" value={enq.id} />
              <label htmlFor={`reply-${enq.id}`} className="field-label">
                Reply to {enq.email}
              </label>
              <textarea
                id={`reply-${enq.id}`}
                name="reply"
                rows={3}
                className="field"
                placeholder="Draft your reply… (sent by email, sender marked handled)"
              />
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn btn-sm btn-primary">
                  Send reply
                </button>
                <a
                  href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject ?? "Your enquiry")}`}
                  className="text-[14px] text-accent hover:underline"
                >
                  Open in mail app →
                </a>
              </div>
            </form>

            {/* Row actions — siblings, never nested inside the reply form */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {!enq.handled && (
                <form action={handleAction}>
                  <input type="hidden" name="id" value={enq.id} />
                  <button type="submit" className="btn btn-sm btn-secondary">
                    Mark as handled
                  </button>
                </form>
              )}
              <form action={deleteEnquiryAction}>
                <input type="hidden" name="id" value={enq.id} />
                <DeleteButton label="Delete enquiry" message="Delete this enquiry? This can't be undone." />
              </form>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}