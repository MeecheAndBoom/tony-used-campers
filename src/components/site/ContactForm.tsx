"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type FormState } from "@/lib/actions/forms";
import { FormMessage } from "@/components/ui/FormBits";

const EMPTY: FormState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn btn-primary">
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, EMPTY);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="c-name" className="field-label">
          Name
        </label>
        <input id="c-name" name="name" required className="field" placeholder="Your name" />
        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="c-email" className="field-label">
          Email
        </label>
        <input
          id="c-email"
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
        <label htmlFor="c-phone" className="field-label">
          Phone <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="c-phone" name="phone" type="tel" className="field" placeholder="(313) 555-0100" />
      </div>
      <div>
        <label htmlFor="c-subject" className="field-label">
          Subject
        </label>
        <select id="c-subject" name="subject" required className="field cursor-pointer">
          <option value="">Choose one…</option>
          <option>A question about a camper</option>
          <option>Scheduling a viewing</option>
          <option>Delivery question</option>
          <option>Service &amp; repair</option>
          <option>Order or payment support</option>
          <option>Something else</option>
        </select>
        {state.fieldErrors?.subject?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.subject[0]}</p>
        )}
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="field-label">
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          required
          className="field"
          placeholder="How can we help?"
        />
        {state.fieldErrors?.message?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.message[0]}</p>
        )}
      </div>
      <div className="sm:col-span-2 space-y-4">
        <FormMessage state={state} />
        <Submit />
      </div>
    </form>
  );
}
