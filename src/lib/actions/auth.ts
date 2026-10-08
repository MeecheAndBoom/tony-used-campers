"use server";

import { redirect } from "next/navigation";
import { createSession, verifyCredentials } from "@/lib/auth";

export type LoginState =
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }
  | { ok: true; message?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      ok: false,
      message: "Email and password are required.",
    };
  }

  const session = await verifyCredentials(email, password);
  if (!session) {
    return { ok: false, message: "Invalid email or password." };
  }

  await createSession(session.email, session.name);
  redirect("/admin");
}
