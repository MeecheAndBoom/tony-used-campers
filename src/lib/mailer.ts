import { promises as fs } from "fs";
import os from "os";
import path from "path";

const OUTBOX = path.join(process.cwd(), "data", "outbox");

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tag?: string;
};

export type SendResult = {
  delivered: boolean;
  /** Local path of the rendered message when SMTP is not used. */
  previewPath?: string;
  /** Present when SMTP delivery was attempted and failed. */
  error?: string;
};function transportConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

/** Non-secret snapshot of the mail configuration, for admin diagnostics. */
export function mailerConfig() {
  const missing = [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
  ].filter((name) => !process.env[name as keyof NodeJS.ProcessEnv]);

  return {
    configured: missing.length === 0,
    host: process.env.SMTP_HOST ?? null,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER ?? null,
    from: process.env.EMAIL_FROM ?? process.env.SMTP_USER ?? null,
    missing,
  };
}

function createTransport() {
  return import("nodemailer").then(({ default: nodemailer }) =>
    nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Without these a blocked/black-holed SMTP port hangs until the host
      // kills the request, which looked like "nothing happens" in the admin.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    }),
  );
}

/** Opens (and closes) a connection to the relay. Used by admin diagnostics. */
export async function verifyMailer(): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (!transportConfigured()) {
    return {
      ok: false,
      error: `SMTP is not configured. Missing: ${mailerConfig().missing.join(", ")}`,
    };
  }
  try {
    const transport = await createTransport();
    try {
      await transport.verify();
      return { ok: true };
    } finally {
      transport.close();
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Writes a rendered message for inspection/testing. Tries `data/outbox/`
 * (writable locally), then the OS temp dir (serverless runtimes such as
 * Vercel have a read-only project filesystem). Never throws — an unwritable
 * disk must not break the caller.
 */
async function writeOutbox(payload: EmailPayload): Promise<string | undefined> {
  const body = `<!-- To: ${payload.to}\nSubject: ${payload.subject} -->\n${payload.html}`;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeTag = (payload.tag ?? "message").replace(/[^a-z0-9-]/gi, "-");
  const safeTo = payload.to.replace(/[^a-z0-9.@_+-]/gi, "_");
  const name = `${stamp}-${safeTag}-${safeTo}.html`;

  for (const dir of [OUTBOX, path.join(os.tmpdir(), "tuc-outbox")]) {
    try {
      await fs.mkdir(dir, { recursive: true });
      const file = path.join(dir, name);
      await fs.writeFile(file, body, "utf8");
      return file;
    } catch {
      /* try the next location */
    }
  }
  return undefined;
}

/**
 * Sends through the configured SMTP relay. Without SMTP credentials — or if
 * the relay rejects the message — a copy is written to the outbox when
 * possible. This function never rejects: email is best-effort and must never
 * crash the page or server action that triggered it.
 */
export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  try {
    if (transportConfigured()) {
      try {
        const transport = await createTransport();

        await transport.sendMail({
          from:
            process.env.EMAIL_FROM ??
            `"Tony Used Campers" <${process.env.SMTP_USER}>`,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        });
        console.info(`[email] sent (${payload.tag}) to ${payload.to}`);
        return { delivered: true };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[email] SMTP delivery failed (${payload.tag}): ${message}`);
        return {
          delivered: false,
          previewPath: await writeOutbox(payload),
          error: message,
        };
      }
    }

    console.warn(`[email] SMTP not configured — wrote preview for ${payload.tag}`);
    return {
      delivered: false,
      previewPath: await writeOutbox(payload),
      error: `SMTP is not configured on this server (missing ${mailerConfig().missing.join(", ")}).`,
    };
  } catch (error) {
    // Belt and braces: a send must never reject.
    return {
      delivered: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/** Plain-text fallback derived from the sections of a React Email body. */
export function toText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}
