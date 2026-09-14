"use client";

import { useFormStatus } from "react-dom";

/**
 * The save button for every admin form.
 *
 * Before this existed, each form rendered a bare `<button type="submit">Save</button>`.
 * Server actions on these forms do real work -- a Zod parse, a write to Turso,
 * a revalidatePath, then a redirect -- and on a slow or flaky connection that
 * is seconds of the page looking completely inert. Nothing spun, nothing
 * greyed out, and the button stayed live, so the natural response was to click
 * Save again. On a create form that second submit races the first into a
 * UNIQUE constraint on `slug` and surfaces as an unhandled server error rather
 * than anything a human could act on.
 *
 * useFormStatus reports the pending state of the nearest enclosing <form>,
 * which is why this has to be its own component rendered inside the form
 * rather than a branch in the parent that owns the form element.
 */
export default function SubmitButton({
  children = "Save",
  pendingLabel = "Saving...",
  accent = "animate",
  disabled = false,
  disabledLabel,
  className = "",
}: {
  children?: React.ReactNode;
  /** Shown while the form's action is in flight. */
  pendingLabel?: string;
  accent?: "animate" | "build";
  /** A reason to block submission that is not "already submitting" -- an
   *  in-progress upload, say. */
  disabled?: boolean;
  /** Label for that other reason, e.g. "Uploading...". */
  disabledLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const blocked = pending || disabled;

  // Pending wins the label race: if an upload finished but the save is still
  // going, the button should say what it is currently doing.
  const label = pending ? pendingLabel : disabled && disabledLabel ? disabledLabel : children;

  const accentClass = accent === "build" ? "bg-accent-build" : "bg-accent-animate";

  return (
    <>
      <button
        type="submit"
        disabled={blocked}
        aria-busy={pending}
        className={`inline-flex items-center gap-2.5 rounded-pill ${accentClass} px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out ${
          blocked ? "cursor-not-allowed opacity-50" : "active:scale-[0.97]"
        } ${className}`}
      >
        {pending && <Spinner />}
        <span>{label}</span>
      </button>

      {/* The button is disabled the moment it goes pending, which in most
          browsers drops focus and means a screen reader never hears the label
          change. This says it out loud instead. */}
      <span role="status" aria-live="polite" className="sr-only">
        {pending ? pendingLabel : ""}
      </span>
    </>
  );
}

function Spinner() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      // Faster than Tailwind's 1s default. A quicker spinner makes the same
      // wait feel shorter, which is the only lever available while the
      // database is busy.
      className="animate-spin [animation-duration:0.6s]"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
