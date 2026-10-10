/**
 * Regression test: sendEmail must NEVER reject, even when SMTP is unconfigured,
 * the relay rejects the message, or the disk is unwritable (Vercel's project
 * filesystem is read-only — that EROFS used to 500 admin order/reply actions).
 *
 * Run: node scripts/mailer-test.ts [smtp-fail | unconfigured | unwritable]
 */
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const scenario = process.argv[2] ?? "smtp-fail";

// Load .env.local (same key=value shape the app uses).
const raw = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
for (const line of raw.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !(m[1] in process.env)) {
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

let expectTmpFallback = false;

if (scenario === "unconfigured") {
  delete process.env.SMTP_HOST;
  delete process.env.SMTP_USER;
} else if (scenario === "unwritable") {
  // A *file* named `data` blocks mkdir("data/outbox") — the same ENOTDIR/EROFS
  // failure the old code hit on Vercel. The fallback must use os.tmpdir().
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), "tuc-mtest-"));
  await fs.writeFile(path.join(cwd, "data"), "not a directory");
  process.chdir(cwd);
  expectTmpFallback = true;
} else {
  process.chdir(ROOT);
}

// Import AFTER chdir: OUTBOX is captured from process.cwd() at module load.
const { sendEmail } = await import("../src/lib/mailer.ts");

const payload = {
  to: "test@example.com",
  subject: `Mailer test — ${scenario}`,
  html: "<p>Hello from the mailer test.</p>",
  tag: `mailer-test-${scenario}`,
};

try {
  const result = await sendEmail(payload);
  const where = result.previewPath
    ? expectTmpFallback
      ? "tmp-fallback"
      : "data-outbox"
    : "none";

  if (result.delivered) throw new Error("expected delivered:false (relay should not accept)");
  if (expectTmpFallback && where !== "tmp-fallback") {
    throw new Error(`expected tmp fallback, got "${where}"`);
  }
  if (!expectTmpFallback && scenario === "unconfigured" && where !== "data-outbox") {
    throw new Error(`expected data/outbox preview, got "${where}"`);
  }

  console.log(`PASS [${scenario}] no throw; delivered=false; preview=${where}`);
  if (result.error) console.log(`      error: ${result.error.split("\n")[0]}`);
} catch (err) {
  console.error(`FAIL [${scenario}] sendEmail threw:`, err);
  process.exitCode = 1;
}
