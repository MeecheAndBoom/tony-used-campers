import { mailerConfig } from "@/lib/mailer";
import { hasDatabase } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { verifyMailerAction, sendTestEmailAction } from "@/lib/actions/admin";
import { PendingButton } from "@/components/admin/PendingButton";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-2 border-b border-line-soft py-2.5 text-[14px] last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="break-all text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function Banner({
  tone,
  title,
  detail,
}: {
  tone: "ok" | "error";
  title: string;
  detail?: string;
}) {
  return (
    <div
      role={tone === "ok" ? "status" : "alert"}
      className={`rounded-card border p-4 text-[14px] ${
        tone === "ok"
          ? "border-success/30 bg-success/5 text-success"
          : "border-danger/30 bg-danger/5 text-danger"
      }`}
    >
      <p className="font-medium">{title}</p>
      {detail && <p className="mt-1 break-words opacity-80">{detail}</p>}
    </div>
  );
}

export default async function DiagnosticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    verify?: string;
    test?: string;
    reason?: string;
    to?: string;
  }>;
}) {
  const { verify, test, reason, to } = await searchParams;
  const config = mailerConfig();
  const { site } = await getSettings();

  return (
    <>
      <div>
        <h1 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Email diagnostics
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Check the mail configuration on this server and send yourself a test
          message.
        </p>
      </div>

      {verify === "ok" && (
        <Banner tone="ok" title="SMTP connection succeeded." detail="The host, credentials and TLS settings are valid." />
      )}
      {verify === "failed" && (
        <Banner tone="error" title="SMTP connection failed." detail={reason} />
      )}
      {test === "sent" && (
        <Banner
          tone="ok"
          title={`Test email sent${to ? ` to ${to}` : ""}.`}
          detail="If it does not arrive within a minute, check the spam folder and the domain's SPF/DKIM records."
        />
      )}
      {test === "failed" && (
        <Banner tone="error" title="The test email was not sent." detail={reason} />
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Mail server
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Read from environment variables on the machine serving this page.
          </p>

          <div
            className={`mt-4 rounded-box px-4 py-3 text-[14px] ${
              config.configured
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            }`}
          >
            {config.configured
              ? "SMTP is configured."
              : `SMTP is NOT configured${
                  config.missing.length
                    ? ` — missing ${config.missing.join(", ")}`
                    : ""
                }. Emails are not being delivered from this server.`}
          </div>

          <dl className="mt-4">
            <Row label="Host" value={config.host ?? "—"} />
            <Row label="Port" value={String(config.port)} />
            <Row label="TLS (secure)" value={config.secure ? "Yes" : "No"} />
            <Row label="Username" value={config.user ?? "—"} />
            <Row label="From address" value={config.from ?? "—"} />
            <Row
              label="Database"
              value={hasDatabase() ? "MongoDB configured" : "Local JSON files"}
            />
            <Row label="Admin inbox" value={site.adminEmail || "—"} />
          </dl>

          <form action={verifyMailerAction} className="mt-5">
            <PendingButton
              label="Test SMTP connection"
              pendingLabel="Connecting…"
              className="btn btn-secondary w-full"
            />
          </form>
        </div>

        <div className="rounded-card bg-white p-6">
          <h2 className="text-[18px] font-semibold tracking-[-0.01em]">
            Send a test email
          </h2>
          <p className="mt-1 text-[14px] text-muted">
            Goes through the same mailer as order confirmations and replies.
          </p>
          <form action={sendTestEmailAction} className="mt-4 space-y-3">
            <div>
              <label className="field-label">Send to</label>
              <input
                name="to"
                type="email"
                required
                defaultValue={site.adminEmail}
                className="field"
              />
            </div>
            <PendingButton
              label="Send test email"
              pendingLabel="Sending test…"
              className="btn btn-primary w-full"
            />
          </form>

          <div className="mt-6 border-t border-line-soft pt-4 text-[13px] leading-relaxed text-muted">
            <p className="font-medium text-ink">On Vercel?</p>
            <p className="mt-1">
              Environment variables must be added in Project → Settings →
              Environment Variables, then the project redeployed. Local{" "}
              <code>.env.local</code> values are not uploaded.
            </p>
            <p className="mt-2">
              Required: <code>SMTP_HOST</code>, <code>SMTP_PORT</code>,{" "}
              <code>SMTP_SECURE</code>, <code>SMTP_USER</code>,{" "}
              <code>SMTP_PASS</code>, <code>EMAIL_FROM</code>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
