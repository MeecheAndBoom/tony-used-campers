import { listEnquiries, markEnquiryHandled } from "@/lib/enquiries";
import { redirect } from "next/navigation";
import { dateTime } from "@/lib/format";

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
          Contact, finance, sell and review submissions. Reply directly to the
          sender's email.
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

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
              <a
                href={`mailto:${enq.email}?subject=Re: ${encodeURIComponent(enq.subject ?? "Your enquiry")}`}
                className="text-[14px] text-accent hover:underline"
              >
                Reply by email →
              </a>
              {!enq.handled && (
                <form action={handleAction}>
                  <input type="hidden" name="id" value={enq.id} />
                  <button type="submit" className="btn btn-sm btn-secondary">
                    Mark as handled
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
