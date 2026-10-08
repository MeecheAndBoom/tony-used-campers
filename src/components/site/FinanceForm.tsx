"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitFinance, type FormState } from "@/lib/actions/forms";
import { FormMessage } from "@/components/ui/FormBits";

const EMPTY: FormState = { ok: false, message: "" };

export function FinanceForm() {
  const [state, formAction] = useActionState(submitFinance, EMPTY);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="f-name" className="field-label">
          Full name
        </label>
        <input id="f-name" name="name" required className="field" placeholder="Your name" />
        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="f-email" className="field-label">
          Email
        </label>
        <input
          id="f-email"
          name="email"
          type="email"
          required
          className="field"
          placeholder="you@example.com"
        />
        {state.fieldErrors?.email?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.email[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="f-phone" className="field-label">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="f-phone" name="phone" type="tel" className="field" placeholder="(313) 555-0100" />
      </div>
      <div>
        <label htmlFor="f-budget" className="field-label">
          Budget range <span className="font-normal text-muted">(optional)</span>
        </label>
        <select id="f-budget" name="budget" className="field cursor-pointer">
          <option value="">Select a range…</option>
          <option>Under $15,000</option>
          <option>$15,000 – $25,000</option>
          <option>$25,000 – $40,000</option>
          <option>$40,000+</option>
          <option>Not sure yet</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="f-message" className="field-label">
          Anything else? <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={4}
          className="field"
          placeholder="Unit you're looking at, credit situation, timeline…"
        />
      </div>
      <div className="sm:col-span-2 space-y-4">
        <FormMessage state={state} />
        <button type="submit" className="btn btn-primary">
          Request financing options
        </button>
        <p className="text-[13px] leading-relaxed text-muted">
          Soft credit inquiry only at this stage — no impact on your score. Full
          terms in our finance disclosure.
        </p>
      </div>
    </form>
  );
}
