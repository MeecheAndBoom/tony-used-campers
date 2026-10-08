"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-alt px-6">
      <div className="w-full max-w-[420px] rounded-card bg-white p-8 shadow-[0_40px_60px_-30px_rgba(0,0,0,0.16)]">
        <h1 className="text-center text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.02em]">
          Dashboard sign in
        </h1>
        <p className="mt-2 text-center text-[14px] text-muted">
          Restricted to Tony Used Campers staff.
        </p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
