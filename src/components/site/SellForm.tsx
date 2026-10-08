"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitSell, type FormState } from "@/lib/actions/forms";
import { FormMessage } from "@/components/ui/FormBits";

const EMPTY: FormState = { ok: false, message: "" };

export function SellForm() {
  const [state, formAction] = useActionState(submitSell, EMPTY);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="s-name" className="field-label">
          Your name
        </label>
        <input id="s-name" name="name" required className="field" placeholder="Your name" />
        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="s-email" className="field-label">
          Email
        </label>
        <input
          id="s-email"
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
        <label htmlFor="s-phone" className="field-label">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="s-phone" name="phone" type="tel" className="field" placeholder="(313) 555-0100" />
      </div>
      <div>
        <label htmlFor="s-vehicle" className="field-label">
          Your camper
        </label>
        <input
          id="s-vehicle"
          name="vehicle"
          required
          className="field"
          placeholder="2019 Forest River Cherokee 244DS"
        />
        {state.fieldErrors?.vehicle?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.vehicle[0]}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="s-message" className="field-label">
          Condition &amp; details{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="s-message"
          name="message"
          rows={5}
          className="field"
          placeholder="Mileage, known issues, repairs, whether it's been stored inside…"
        />
      </div>
      <div className="sm:col-span-2 space-y-4">
        <FormMessage state={state} />
        <button type="submit" className="btn btn-primary">
          Get my valuation
        </button>
      </div>
    </form>
  );
}
