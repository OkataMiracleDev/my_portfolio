import type { ReactNode } from "react";

/**
 * A camera tally light. Opacity-only blink (a real tally does not move), and
 * the blink itself is suppressed under prefers-reduced-motion in globals.css.
 */
export function Tally({
  children,
  tone = "signal",
  className = "",
}: {
  children: ReactNode;
  tone?: "signal" | "accent";
  className?: string;
}) {
  const dot = tone === "signal" ? "bg-signal" : "bg-accent-animate";
  return (
    <span
      className={`inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.18em] ${className}`}
    >
      <span className={`okata-tally h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * Mono metadata, the way a slate or an edit bay readout labels things. Used
 * for every small uppercase label on the route so they stay one voice.
 */
export function Meta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.18em] ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Corner registration marks -- the crop ticks on a film frame. Purely
 * decorative; sits inside a relatively positioned frame.
 */
export function FrameTicks({ className = "" }: { className?: string }) {
  const corner = "absolute h-3 w-3 border-ink/25";
  return (
    <span className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <span className={`${corner} left-0 top-0 border-l border-t`} />
      <span className={`${corner} right-0 top-0 border-r border-t`} />
      <span className={`${corner} bottom-0 left-0 border-b border-l`} />
      <span className={`${corner} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}
