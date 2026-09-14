"use client";

import { useEffect, useRef, useState, useTransition } from "react";

const DISARM_MS = 4000;

/**
 * A button for an action you should not be able to trigger by accident,
 * without a native confirm() dialog.
 *
 * DeleteButton is the destructive-delete flavour of this; this is the generic
 * one, used where the action is consequential but is not a delete -- rotating
 * a client's portal link, for instance, which silently breaks whatever URL
 * they already have.
 */
export default function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Confirm",
  pendingLabel = "Working",
  className = "",
}: {
  onConfirm: () => Promise<unknown> | void;
  children: React.ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [pending, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!armed || pending) return;
    timeoutRef.current = setTimeout(() => setArmed(false), DISARM_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [armed, pending]);

  const base =
    "rounded-pill border px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] transition-colors duration-200 ease-out";

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        className={`${base} border-ink/15 text-ink/50 hover:border-ink/35 hover:text-ink ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        autoFocus
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await onConfirm();
            } finally {
              setArmed(false);
            }
          })
        }
        className={`${base} border-transparent bg-signal text-stage disabled:opacity-60`}
      >
        {pending ? pendingLabel : confirmLabel}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => setArmed(false)}
        className={`${base} border-ink/15 text-ink/45 hover:text-ink disabled:opacity-40`}
      >
        Cancel
      </button>
    </span>
  );
}
