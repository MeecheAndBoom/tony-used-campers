import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "@/lib/actions/admin";
import { PaymentMethodsEditor } from "@/components/admin/PaymentMethodsEditor";
import { HoursEditor } from "@/components/admin/HoursEditor";

type Props = {
  searchParams: Promise<{ saved?: string }>;
};

const FIELD =
  "w-full rounded-box border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors placeholder:text-muted-light focus:border-accent focus:ring-2 focus:ring-sky";
const LABEL = "field-label block";

export default async function AdminSettingsPage({ searchParams }: Props) {
  const { saved } = await searchParams;
  const settings = await getSettings();
  const { site, paymentMethods } = settings;

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Settings
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Store info, opening hours and payment methods. Changes save to the
          database and show across the site and in emails immediately.
        </p>
      </div>

      {saved === "1" && (
        <div className="rounded-box bg-success/10 px-4 py-3 text-[14px] text-success">
          Settings saved and live on the site.
        </div>
      )}

      <form action={saveSettingsAction} className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Store info
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={LABEL}>
                Store name
              </label>
              <input id="name" name="name" defaultValue={site.name} className={FIELD} />
            </div>
            <div>
              <label htmlFor="tagline" className={LABEL}>
                Tagline
              </label>
              <input id="tagline" name="tagline" defaultValue={site.tagline} className={FIELD} />
            </div>
            <div>
              <label htmlFor="location" className={LABEL}>
                Location
              </label>
              <input id="location" name="location" defaultValue={site.location} className={FIELD} />
            </div>
            <div>
              <label htmlFor="address" className={LABEL}>
                Address
              </label>
              <input id="address" name="address" defaultValue={site.address} className={FIELD} />
            </div>
            <div>
              <label htmlFor="phone" className={LABEL}>
                Phone
              </label>
              <input id="phone" name="phone" defaultValue={site.phone} className={FIELD} />
            </div>
            <div>
              <label htmlFor="salesEmail" className={LABEL}>
                Sales email
              </label>
              <input
                id="salesEmail"
                name="salesEmail"
                type="email"
                defaultValue={site.email}
                className={FIELD}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="adminEmail" className={LABEL}>
                Admin email <span className="font-normal text-muted">(receives notifications)</span>
              </label>
              <input
                id="adminEmail"
                name="adminEmail"
                type="email"
                defaultValue={site.adminEmail}
                className={FIELD}
              />
            </div>
          </div>
        </section>

        <div className="space-y-8">
          <section className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Opening hours
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Shown on the contact page and order emails.
            </p>
            <div className="mt-5">
              <HoursEditor initial={site.hours} />
            </div>
          </section>

          <section className="rounded-card bg-white p-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
              Payment methods
            </h2>
            <p className="mt-1 text-[14px] text-muted">
              Add, edit or remove the options customers pick at checkout. Orders
              already placed keep their original method.
            </p>
            <div className="mt-5">
              <PaymentMethodsEditor initial={paymentMethods} />
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button type="submit" className="btn btn-primary">
              Save settings
            </button>
          </div>
        </div>
      </form>
    </>
  );
}