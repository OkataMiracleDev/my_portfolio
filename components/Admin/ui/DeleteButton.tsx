"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/** How long an armed button waits before disarming itself. */
const DISARM_MS = 4000;

/**
 * Destructive action, done properly.
 *
 * What this replaces, in every list in the admin:
 *
 *   async function handleDelete(id) {
 *     if (!confirm("Delete this? This cannot be undone.")) return;
 *     setItems((prev) => prev.filter((i) => i.id !== id));   // optimistic
 *     await deleteAction(id);                                // never checked
 *   }
 *
 * Three problems with that. `window.confirm` is a blocking native dialog that
 * some browsers suppress outright. The row is removed from local state before
 * the server action resolves and the result is never inspected, so a delete
 * that fails -- a dropped connection, an auth expiry -- silently removes the
 * row from the screen while the record is still in the database, and stays
 * wrong until a manual refresh. And every list carried its own copy of the
 * `useState` bookkeeping to support that optimism.
 *
 * Instead: an inline two-step confirm (no native dialog, no modal machinery,
 * fully keyboard reachable), a real pending state, and `router.refresh()` on
 * success so the list re-renders from the database rather than from a guess.
 * Failures surface as a toast and leave the row where it is.
 *
 * Because this owns the mutation, the lists around it no longer need to be
 * client components at all.
 */
export default function DeleteButton({
  action,
  label = "item",
  className = "",
}: {
  /** Pre-bound server action, e.g. `deletePostAction.bind(null, item.id)`. */
  action: () => Promise<unknown>;
  /** Noun used in the confirm and error copy: "post", "client", "plugin". */
  label?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // An armed button left alone is a trap for the next click. Disarm it.
  useEffect(() => {
    if (!armed || pending) return;
    timeoutRef.current = setTimeout(() => setArmed(false), DISARM_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [armed, pending]);

  function handleConfirm() {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
        toast.success(`Deleted ${label}.`);
      } catch (error) {
        console.error(error);
        toast.error(`Could not delete that ${label}. It is still there.`);
      } finally {
        setArmed(false);
      }
    });
  }

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className={`rounded-pill border border-ink/15 px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45 transition-colors duration-200 ease-out hover:border-signal/50 hover:text-signal ${className}`}
      >
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={pending}
        autoFocus
        aria-label={`Confirm deleting this ${label}`}
        className="rounded-pill bg-signal px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-stage transition-transform duration-200 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Deleting" : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        disabled={pending}
        className="rounded-pill border border-ink/15 px-3 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45 transition-colors duration-200 ease-out hover:text-ink disabled:opacity-40"
      >
        Cancel
      </button>
    </span>
  );
}
