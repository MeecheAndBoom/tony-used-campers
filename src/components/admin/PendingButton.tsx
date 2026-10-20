"use client";

import { useFormStatus } from "react-dom";

/**
 * Submit button that reflects the enclosing form's server-action state.
 * Server components can render it directly inside a <form action={…}> so
 * admins get immediate feedback ("Sending…") instead of a dead-looking click.
 */
export function PendingButton({
  label,
  pendingLabel = "Working…",
  className = "btn btn-primary",
  disabled = false,
  pendingTitle,
}: {
  label: string;
  pendingLabel?: string;
  className?: string;
  /** Disable independently of the pending state (e.g. already paid). */
  disabled?: boolean;
  pendingTitle?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      title={pending ? pendingTitle ?? pendingLabel : undefined}
      className={`${className} ${pending ? "cursor-wait opacity-80" : ""}`}
    >
      {pending && (
        <i
          className="fa-solid fa-circle-notch fa-spin mr-2"
          aria-hidden="true"
        />
      )}
      {pending ? pendingLabel : label}
    </button>
  );
}
