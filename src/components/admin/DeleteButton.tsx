"use client";

export function DeleteButton({
  label,
  message,
}: {
  label: string;
  message: string;
}) {
  return (
    <button
      type="submit"
      className="text-[14px] text-danger hover:underline"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}