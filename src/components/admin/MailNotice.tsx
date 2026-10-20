/**
 * Feedback strip for dashboard actions that send email. Server-rendered from
 * the `mail` / `reason` query params so it survives the action's redirect.
 */
import Link from "next/link";

export function MailNotice({
  mail,
  reason,
}: {
  mail?: string;
  reason?: string;
}) {
  if (!mail) return null;

  const messages: Record<string, string> = {
    "reply-sent": "Reply emailed to the customer.",
    "payment-sent": "Payment instructions emailed to the customer.",
    "confirmed-sent": "Confirmation email sent to the customer.",
    "status-sent": "Status update emailed to the customer.",
    "reply-empty": "Write a message before sending.",
    "reply-missing": "That record could not be found.",
    noop: "No change — the record already has that status.",
  };

  if (mail.endsWith("-failed")) {
    return (
      <div
        role="alert"
        className="rounded-card border border-danger/30 bg-danger/5 p-4 text-[14px] text-danger"
      >
        <p className="font-medium">
          The record was updated, but the email could not be sent.
        </p>
        <p className="mt-1 break-words text-danger/80">
          {reason ?? "The mail server rejected the message."}
        </p>
        <p className="mt-2 text-danger/80">
          Check the SMTP settings on the server, then use{" "}
          <Link href="/admin/diagnostics" className="underline">
            Email diagnostics
          </Link>{" "}
          to send a test.
        </p>
      </div>
    );
  }

  const text = messages[mail];
  if (!text) return null;

  return (
    <p
      role="status"
      className="rounded-card bg-success/10 px-4 py-3 text-[14px] text-success"
    >
      {text}
    </p>
  );
}
