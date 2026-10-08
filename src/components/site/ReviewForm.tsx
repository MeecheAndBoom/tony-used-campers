"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitReview, type FormState } from "@/lib/actions/forms";

const EMPTY: FormState = { ok: false, message: "" };

export function ReviewForm() {
  const [state, formAction] = useActionState(submitReview, EMPTY);
  const [rating, setRating] = useState(5);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="r-name" className="field-label">
          Your name
        </label>
        <input id="r-name" name="name" required className="field" placeholder="First and last" />
        {state.fieldErrors?.name?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="r-city" className="field-label">
          City <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="r-city" name="city" className="field" placeholder="Detroit, MI" />
      </div>
      <div>
        <label htmlFor="r-email" className="field-label">
          Email <span className="font-normal text-muted">(never published)</span>
        </label>
        <input
          id="r-email"
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
        <label htmlFor="r-purchased" className="field-label">
          Camper you bought <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="r-purchased"
          name="purchased"
          className="field"
          placeholder="2018 Jayco Jay Flight"
        />
      </div>

      <div className="sm:col-span-2">
        <span className="field-label">Rating</span>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              onClick={() => setRating(value)}
              className={`grid h-10 w-10 place-items-center rounded-full text-[18px] transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-90 ${
                value <= rating ? "text-[#f5a623]" : "text-line"
              } hover:bg-alt`}
            >
              <i className={value <= rating ? "fa-solid fa-star" : "fa-regular fa-star"} aria-hidden="true" />
            </button>
          ))}
          <input type="hidden" name="rating" value={rating} />
        </div>
        {state.fieldErrors?.rating?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.rating[0]}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="r-title" className="field-label">
          Headline <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="r-title"
          name="title"
          className="field"
          placeholder="Best buying experience in Michigan"
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="r-body" className="field-label">
          Your review
        </label>
        <textarea
          id="r-body"
          name="body"
          rows={5}
          required
          className="field"
          placeholder="What was the process like — inspection, price, delivery?"
        />
        {state.fieldErrors?.body?.[0] && (
          <p className="mt-1.5 text-[13px] text-danger">{state.fieldErrors.body[0]}</p>
        )}
      </div>

      <div className="sm:col-span-2 space-y-4">
        {state.message && (
          <p
            role={state.ok ? "status" : "alert"}
            className={`rounded-box px-4 py-3 text-[14px] ${
              state.ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
            }`}
          >
            {state.message}
          </p>
        )}
        <button type="submit" className="btn btn-primary">
          Submit review
        </button>
      </div>
    </form>
  );
}
