import Link from "next/link";
import type { RouteChoice } from "@/data/landing";

interface RouteChoiceCardProps {
  choice: RouteChoice;
}

export default function RouteChoiceCard({ choice }: RouteChoiceCardProps) {
  const isBuild = choice.accent === "build";
  const accentBg = isBuild ? "bg-accent-build" : "bg-accent-animate";
  const accentText = isBuild ? "text-accent-build" : "text-accent-animate";
  const accentOutline = isBuild
    ? "focus-visible:outline-accent-build"
    : "focus-visible:outline-accent-animate";

  return (
    <Link
      href={choice.href}
      data-testid="route-choice-card"
      data-accent={choice.accent}
      className={`group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-ink/10 bg-base-raised p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgb(0_0_0_/_0.14)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 md:p-10 ${accentOutline}`}
    >
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full ${accentBg} opacity-0 blur-3xl transition-opacity duration-500 ease-out group-hover:opacity-20`}
        aria-hidden="true"
      />

      <div className="relative">
        <span
          className={`inline-flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] ${accentText}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${accentBg}`} aria-hidden="true" />
          {isBuild ? "Frontend dev" : "Motion design"}
        </span>
        <h2 className="mt-4 font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-[0.92] text-ink md:text-6xl">
          {choice.title}
        </h2>
        <p className="mt-4 max-w-sm text-base text-ink/70">{choice.description}</p>
      </div>

      <span className="relative mt-8 inline-flex items-center gap-2 font-semibold text-ink">
        Enter {choice.title}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 ease-out group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </Link>
  );
}
