/** One-off SMTP diagnostic: verifies the .env.local credentials against the relay. */
import { promises as fs } from "node:fs";
import path from "node:path";

const raw = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const nodemailer = (await import("nodemailer")).default;
const transport = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT ?? 587),
  secure: env.SMTP_SECURE === "true",
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

try {
  const info = await transport.verify();
  console.log("SMTP verify OK:", info);
} catch (err) {
  console.error("SMTP verify FAILED:", err.message);
  process.exitCode = 1;
}
