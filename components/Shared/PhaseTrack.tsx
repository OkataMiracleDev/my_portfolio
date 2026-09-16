import {
  RETAINER_PHASES,
  RETAINER_PHASE_LABELS,
  TERMINAL_PHASE,
  phaseIndex,
  type RetainerPhase,
} from "@/lib/constants/retainer-phases";

/**
 * The production pipeline, drawn.
 *
 * A retainer client's first question is always "where is my thing right now",
 * and a status word on its own does not answer it -- "Compositing" only means
 * something if you can see what comes before and after it. The track shows the
 * whole pipeline at once with everything completed filled in, so the answer is
 * a glance rather than a reading exercise.
 *
 * Rendered as an ordered list so that with styles off, or in a screen reader,
 * it is still a numbered pipeline with the current step marked via
 * aria-current.
 */
export default function PhaseTrack({
  phase,
  compact = false,
}: {
  phase: string;
  /** Dots only, for a list row. The full version labels every step. */
  compact?: boolean;
}) {
  const currentIndex = phaseIndex(phase);
  const done = phase === TERMINAL_PHASE;

  if (compact) {
    return (
      <ol className="flex items-center gap-1" aria-label={`Phase: ${RETAINER_PHASE_LABELS[phase as RetainerPhase] ?? phase}`}>
        {RETAINER_PHASES.map((step, i) => {
          const reached = i <= currentIndex;
          return (
            <li
              key={step}
              aria-current={i === currentIndex ? "step" : undefined}
              title={RETAINER_PHASE_LABELS[step]}
              className={`h-1.5 rounded-full transition-colors duration-300 ease-out ${
                i === currentIndex ? "w-5" : "w-1.5"
              } ${
                reached
                  ? done
                    ? "bg-accent-build"
                    : "bg-accent-animate"
                  : "bg-ink/15"
              }`}
            />
          );
        })}
      </ol>
    );
  }

  return (
    <ol className="grid gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
      {RETAINER_PHASES.map((step, i) => {
        const reached = i <= currentIndex;
        const current = i === currentIndex;

        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className={`relative overflow-hidden rounded-xl border px-3.5 py-3 transition-colors duration-300 ease-out ${
              current
                ? "border-accent-animate/50 bg-accent-animate/[0.08]"
                : reached
                  ? "border-ink/12 bg-frame"
                  : "border-dashed border-ink/10 bg-transparent"
            }`}
          >
            <span
              className={`block font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] ${
                current ? "text-accent-animate" : reached ? "text-ink/35" : "text-ink/20"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
              {reached && !current && <span className="ml-1.5">&#10003;</span>}
            </span>
            <span
              className={`mt-1.5 block text-sm leading-tight ${
                current ? "font-medium text-ink" : reached ? "text-ink/55" : "text-ink/25"
              }`}
            >
              {RETAINER_PHASE_LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** The current phase as a standalone pill, for headers and list rows. */
export function PhaseBadge({ phase }: { phase: string }) {
  const label = RETAINER_PHASE_LABELS[phase as RetainerPhase] ?? phase;
  const done = phase === TERMINAL_PHASE;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] ${
        done
          ? "border-accent-build/40 text-accent-build"
          : "border-accent-animate/40 text-accent-animate"
      }`}
    >
      {!done && (
        <span className="okata-tally h-1.5 w-1.5 shrink-0 rounded-full bg-accent-animate" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}
