import { SITE, PAYMENT_METHODS } from "@/lib/constants";

export default function AdminSettingsPage() {
  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Settings
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Store configuration and payment methods. Update env vars to change
          these values in production.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Store info
          </h2>
          <dl className="mt-4 grid gap-3 text-[15px]">
            <div>
              <dt className="text-muted">Name</dt>
              <dd>{SITE.name}</dd>
            </div>
            <div>
              <dt className="text-muted">Location</dt>
              <dd>{SITE.location}</dd>
            </div>
            <div>
              <dt className="text-muted">Address</dt>
              <dd>{SITE.address}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd>{SITE.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Sales email</dt>
              <dd>{SITE.email}</dd>
            </div>
            <div>
              <dt className="text-muted">Admin email</dt>
              <dd>{SITE.adminEmail}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Payment methods
          </h2>
          <ul className="mt-4 space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <li key={method.id} className="border-b border-line-soft pb-3 last:border-0">
                <p className="text-[15px] font-medium text-ink">{method.label}</p>
                <p className="mt-0.5 text-[13px] text-muted">{method.hint}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
