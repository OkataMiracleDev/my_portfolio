import type { FunFactCard } from "@/data/landing";

interface FunStuffGridProps {
  facts: FunFactCard[];
}

export default function FunStuffGrid({ facts }: FunStuffGridProps) {
  return (
    <section className="px-6 pb-16 md:px-12 md:pb-24">
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {facts.map((fact) => (
          <li
            key={fact.id}
            className="rounded-card bg-base-raised p-5 transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              {fact.label}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {fact.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
