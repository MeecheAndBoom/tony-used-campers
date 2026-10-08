import { promises as fs } from "fs";
import path from "path";

const OUTBOX = path.join(process.cwd(), "data", "outbox");

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tag?: string;
};

type SendResult = {
  delivered: boolean;
  /** Local path of the rendered message when SMTP is not configured. */
  previewPath?: string;
};

function transportConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
}

/**
 * Sends through the configured SMTP relay. Without SMTP credentials the
 * message is written to `data/outbox/` so the flow stays fully testable.
 */
export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  if (transportConfigured()) {
    const nodemailer = (await import("nodemailer")).default;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transport.sendMail({
      from:
        process.env.EMAIL_FROM ??
        `"Tony Used Campers" <${process.env.SMTP_USER}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return { delivered: true };
  }

  await fs.mkdir(OUTBOX, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeTag = (payload.tag ?? "message").replace(/[^a-z0-9-]/gi, "-");
  const safeTo = payload.to.replace(/[^a-z0-9.@_+-]/gi, "_");
  const file = path.join(OUTBOX, `${stamp}-${safeTag}-${safeTo}.html`);
  const body = `<!-- To: ${payload.to}\nSubject: ${payload.subject} -->\n${payload.html}`;
  await fs.writeFile(file, body, "utf8");
  return { delivered: false, previewPath: file };
}

/** Plain-text fallback derived from the sections of a React Email body. */
export function toText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
