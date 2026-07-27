import { Fragment } from "react";
import type { FunFactCard } from "@/data/landing";

interface FunStuffGridProps {
  facts: FunFactCard[];
}

function toKey(label: string) {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export default function FunStuffGrid({ facts }: FunStuffGridProps) {
  return (
    <section className="border-y border-ink/10 px-6 py-10 md:px-12">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-card border border-ink/10 bg-base-raised">
        <div className="flex items-center gap-1.5 border-b border-ink/10 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-ink/15" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-ink/15" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-ink/15" aria-hidden="true" />
          <span className="ml-2 font-[family-name:var(--font-jetbrains-mono)] text-[0.65rem] uppercase tracking-[0.14em] text-ink/35">
            ~/status.log
          </span>
        </div>

        <div className="grid grid-cols-[1rem_auto_1fr] items-baseline gap-x-2 gap-y-2 px-4 py-4 font-[family-name:var(--font-jetbrains-mono)] text-xs sm:gap-x-3 sm:px-6 sm:py-5 sm:text-sm">
          {facts.map((fact) => {
            const isStatus = fact.id === "status";
            return (
              <Fragment key={fact.id}>
                <span className="text-accent-build">{">"}</span>
                <span className="truncate text-ink/45">{toKey(fact.label)}</span>
                <span className="flex min-w-0 items-baseline gap-2 truncate text-ink">
                  <span className="truncate">&quot;{fact.value}&quot;</span>
                  {isStatus && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </Fragment>
            );
          })}
          <span className="text-accent-build">{">"}</span>
          <span className="animate-pulse text-ink/30" aria-hidden="true">
            _
          </span>
        </div>
      </div>
    </section>
  );
}
