"use client";

export function FormMessage({
  state,
}: {
  state: { ok: boolean; message: string; fieldErrors?: Record<string, string[]> | undefined };
}) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-box px-4 py-3 text-[14px] ${
        state.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
      }`}
    >
      {state.message}
    </p>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
  className = "btn btn-primary",
}: {
  pending: boolean;
  label: string;
  pendingLabel: string;
  className?: string;
}) {
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : label}
    </button>
  );
}
