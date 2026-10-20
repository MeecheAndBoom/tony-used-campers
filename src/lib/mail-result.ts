import type { SendResult } from "./mailer";

/**
 * Turns a mail result into query params the admin pages can render. Keeping
 * this tiny and shared means every dashboard action reports the real outcome
 * instead of silently pretending an email went out.
 */
export function mailQuery(
  result: Pick<SendResult, "delivered" | "error"> | undefined,
  kind: string,
) {
  if (result?.delivered) return `mail=${kind}-sent`;
  const reason = (result?.error ?? "The email could not be sent.").slice(0, 220);
  return `mail=${kind}-failed&reason=${encodeURIComponent(reason)}`;
}
