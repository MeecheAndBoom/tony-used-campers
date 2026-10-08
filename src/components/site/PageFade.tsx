"use client";

import { usePathname } from "next/navigation";

/**
 * Re-mounts its subtree whenever the route changes so every page gets a
 * short fade-and-rise entrance. Param-only changes (filters, search) do not
 * re-trigger it, which keeps in-page updates smooth.
 */
export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
