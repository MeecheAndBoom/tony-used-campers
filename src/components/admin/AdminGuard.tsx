"use client";

import { redirect, usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Permissions gate for the dashboard. Redirects signed-out visitors to the
 * login page — except when they are *on* the login page, which must render
 * standalone (the alternative redirects /admin/login back to itself).
 */
export function AdminGuard({
  sessionEmail,
  children,
}: {
  sessionEmail: string | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (!sessionEmail && pathname !== "/admin/login") redirect("/admin/login");
  return <>{children}</>;
}