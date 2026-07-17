import Link from "next/link";
import type { RouteChoice } from "@/data/landing";

interface RouteChoiceCardProps {
  choice: RouteChoice;
}

export default function RouteChoiceCard({ choice }: RouteChoiceCardProps) {
  const accentBg =
    choice.accent === "build" ? "bg-accent-build" : "bg-accent-animate";
  const accentOutline =
    choice.accent === "build"
      ? "focus-visible:outline-accent-build"
      : "focus-visible:outline-accent-animate";

  return (
    <Link
      href={choice.href}
      data-testid="route-choice-card"
      data-accent={choice.accent}
      className={`group relative block overflow-hidden rounded-card bg-base-raised p-8 transition-transform duration-[250ms] ease-out hover:-translate-y-1 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-4 ${accentOutline}`}
    >
      <span
        className={`mb-6 inline-block h-2 w-12 rounded-pill ${accentBg} transition-all duration-[250ms] ease-out group-hover:w-20`}
        aria-hidden="true"
      />
      <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold text-ink md:text-4xl">
        {choice.title}
      </h2>
      <p className="mt-3 text-base text-ink/70">{choice.description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink transition-transform duration-200 ease-out group-hover:translate-x-1">
        Enter
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
