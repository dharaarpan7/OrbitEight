"use client";

import { useSyncExternalStore, useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Contact form — websitePrompt.md "PAGE 5 — CONTACT". Premium and inviting,
 * with inquiry categories (General / Community / Partnership / Media /
 * Collaboration / Support), inline validation, and success/error states.
 * Submission POSTs the form fields to the Formspree endpoint in lib/site.ts
 * (which forwards to the inbox); Formspree accepts FormData directly.
 */

const INQUIRY_CATEGORIES = [
  "General",
  "Community",
  "Partnership",
  "Media",
  "Collaboration",
  "Support",
] as const;

const inputClasses =
  "w-full rounded-2xl border border-ash bg-surface px-5 py-3 text-sm text-white placeholder:text-tertiary transition-colors focus:border-burnt-amber/60 focus:outline-none";

type Status = "idle" | "submitting" | "success" | "error";

/** Why a submission failed — drives the alert copy so the reader gets a
    specific message instead of a generic shrug. */
type ErrorKind = "fields" | "email" | "network";

/** Loose but honest: something@something.something, no spaces. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Never-firing subscription for the hydration probe below. */
const emptySubscribe = () => () => {};

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("fields");
  const [category, setCategory] = useState<string>("General");
  // A click before React hydrates would trigger the browser's native form
  // submit — a page reload that loses everything the visitor typed. The
  // button stays disabled until hydration attaches the real handler.
  // useSyncExternalStore probes it without an effect: the server snapshot
  // says false, the client snapshot says true, and React flips the value
  // right after hydration.
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Validate the essentials inline — quiet, on-brand. noValidate disables
    // the browser's type="email" check, so the format is verified here.
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) {
      setErrorKind("fields");
      setStatus("error");
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setErrorKind("email");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(site.contactFormEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      // Formspree returns 200/201 on success and 4xx/5xx (or an error JSON
      // with an "errors" field) when the submission is rejected — surface
      // the error state either way rather than reporting a false success.
      if (!response.ok) {
        setErrorKind("network");
        throw new Error(`Formspree responded with ${response.status}`);
      }
      setStatus("success");
      form.reset();
      setCategory("General");
    } catch {
      setErrorKind("network");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-ash/60 bg-surface/60 p-10 text-center sm:p-14"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-solar-flare/40 bg-solar-flare/10">
          <Check className="h-5 w-5 text-solar-flare" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-heading text-h3 font-light text-white">
          Message received.
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-secondary">
          Thank you for writing. We read everything, and we reply to
          everything — usually within a few days.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-8"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-ash/60 bg-surface/60 p-8 sm:p-10 md:p-12"
    >
      {/* Inquiry category */}
      <fieldset>
        <legend className="text-xs uppercase tracking-[0.2em] text-tertiary">
          What is this about?
        </legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {INQUIRY_CATEGORIES.map((option) => {
            const active = category === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(option)}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-solar-flare/70 bg-solar-flare/15 text-white"
                    : "border-ash text-secondary hover:border-burnt-amber/50 hover:text-white"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Inquiry category (buttons above) travels with the submission. */}
      <input type="hidden" name="category" value={category} />

      {/* Name + email */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-tertiary"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Your name"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-tertiary"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Message */}
      <div className="mt-5">
        <label
          htmlFor="contact-message"
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-tertiary"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          placeholder="Tell us what you're looking up at."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 text-sm text-solar-flare">
          {errorKind === "email"
            ? "That email address doesn’t look right — please check it and try again."
            : errorKind === "network"
              ? "Something didn’t send on our end — please try again in a moment."
              : "Something didn’t send — please make sure every field is filled in and try again."}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
        <button
          type="submit"
          className="btn-primary"
          disabled={!hydrated || status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            "Send message"
          )}
        </button>
      </div>
    </form>
  );
}
