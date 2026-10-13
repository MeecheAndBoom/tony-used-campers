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
  const { site, paymentMethods, cloudinary } = settings;
  const envMedia = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
  const mediaReady =
    envMedia || Boolean(cloudinary.cloudName && cloudinary.apiKey && cloudinary.apiSecret);

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

        <section className="rounded-card bg-white p-6 lg:col-span-2">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Image uploads
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Cloudinary account used when you upload photos in Products,
            Categories and Blog. Server environment variables take priority
            when set; otherwise the values saved here are used.
          </p>

          {envMedia ? (
            <div className="mt-4 rounded-box bg-sky px-4 py-3 text-[14px] text-ink-soft">
              Using credentials from the server environment
              (<span className="font-mono text-[13px]">CLOUDINARY_*</span>)
              — the saved values below are ignored while those are set.
            </div>
          ) : null}

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="cloudinaryCloudName" className={LABEL}>
                Cloud name
              </label>
              <input
                id="cloudinaryCloudName"
                name="cloudinaryCloudName"
                defaultValue={cloudinary.cloudName}
                placeholder="qkbrqtav"
                autoComplete="off"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="cloudinaryApiKey" className={LABEL}>
                API key
              </label>
              <input
                id="cloudinaryApiKey"
                name="cloudinaryApiKey"
                defaultValue={cloudinary.apiKey}
                placeholder="123456789012345"
                autoComplete="off"
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="cloudinaryApiSecret" className={LABEL}>
                API secret
              </label>
              <input
                id="cloudinaryApiSecret"
                name="cloudinaryApiSecret"
                type="password"
                placeholder={
                  cloudinary.apiSecret ? "Saved — leave blank to keep" : "Enter API secret"
                }
                autoComplete="new-password"
                className={FIELD}
              />
              <p className="mt-1.5 text-[12px] text-muted">
                Never shown back for safety. Leave blank to keep the saved secret.
              </p>
            </div>
          </div>

          {mediaReady ? (
            <p className="mt-4 flex items-center gap-2 text-[14px] text-success">
              <i className="fa-solid fa-circle-check" aria-hidden="true" />
              Uploads are configured.
            </p>
          ) : (
            <p className="mt-4 flex items-center gap-2 text-[14px] text-warning">
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
              Add all three values to turn on image uploads.
            </p>
          )}
        </section>
      </form>
    </>
  );
}