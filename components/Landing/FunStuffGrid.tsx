import type { FunFactCard } from "@/data/landing";

interface FunStuffGridProps {
  facts: FunFactCard[];
}

export default function FunStuffGrid({ facts }: FunStuffGridProps) {
  return (
    <section className="border-y border-ink/10 px-6 py-8 md:px-12">
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 md:justify-between">
        {facts.map((fact) => (
          <li key={fact.id} className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/45">
              {fact.label}
            </span>
            <span className="text-sm font-semibold text-ink">{fact.value}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
