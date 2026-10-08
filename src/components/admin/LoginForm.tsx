"use client";

import { useActionState, useEffect, useRef } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const EMPTY: LoginState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, EMPTY);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5">
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field"
          placeholder="admin@tonyusedcampers.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
          placeholder="••••••••"
        />
      </div>
      {state.ok === false && state.message && (
        <p className="rounded-box bg-danger/10 px-4 py-3 text-[14px] text-danger" role="alert">
          {state.message}
        </p>
      )}
      <button type="submit" className="btn btn-primary">
        Sign in
      </button>
      <p className="text-center text-[13px] text-muted">
        Default credentials from ADMIN_EMAIL / ADMIN_PASSWORD if MongoDB isn't
        connected.
      </p>
    </form>
  );
}
