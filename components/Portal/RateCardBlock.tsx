"use client";

import { useState } from "react";
import PrintButton from "./PrintButton";
import { currencyBadgeLabel } from "@/lib/constants/currencies";
import type { rateCards } from "@/lib/db/schema";

type RateCard = typeof rateCards.$inferSelect;
type LineItem = RateCard["lineItems"][number];

function groupBySection(items: LineItem[]) {
  const order: string[] = [];
  const groups = new Map<string, LineItem[]>();
  for (const item of items) {
    const key = item.section?.trim() || "";
    if (!groups.has(key)) {
      order.push(key);
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  return order.map((key) => ({ section: key, items: groups.get(key)! }));
}

export default function RateCardBlock({ card }: { card: RateCard }) {
  const sections = groupBySection(card.lineItems);
  const selectable = card.lineItems.length > 1;
  const [selected, setSelected] = useState(0);
  const selectedItem = card.lineItems[selected];

  function handleAccept() {
    if (card.ctaUrl) {
      const url = new URL(card.ctaUrl, window.location.origin);
      if (selectedItem) {
        url.searchParams.set("package", selectedItem.title);
        url.searchParams.set("price", selectedItem.price);
      }
      window.location.href = url.toString();
      return;
    }
    const subject = selectedItem
      ? `Ready to move forward — ${card.title} (${selectedItem.title})`
      : `Ready to move forward — ${card.title}`;
    window.location.href = `mailto:okatamiracle.dev@gmail.com?subject=${encodeURIComponent(subject)}`;
  }

  return (
    <div className="mb-8 rounded-card border border-ink/10 bg-base-raised p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
          {card.title}
        </p>
        <span className="rounded-pill border border-accent-animate/30 bg-accent-animate/10 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.65rem] uppercase tracking-[0.06em] text-accent-animate">
          {currencyBadgeLabel(card.currency)}
        </span>
      </div>

      {selectable && (
        <p className="mb-4 text-xs text-ink/50">Pick the option that fits, then accept below.</p>
      )}

      {sections.map((group, gi) => {
        let runningIndex = 0;
        for (let s = 0; s < gi; s++) runningIndex += sections[s].items.length;

        return (
          <div key={group.section || gi} className="mb-8 last:mb-0">
            {card.layout === "sectioned" && group.section && (
              <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
                Track {String(gi + 1).padStart(2, "0")} — {group.section}
              </p>
            )}
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-ink/10 sm:grid-cols-2">
              {group.items.map((item, i) => {
                const index = runningIndex + i;
                const isSelected = selectable && selected === index;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectable && setSelected(index)}
                    disabled={!selectable}
                    className={`bg-base p-5 text-left transition-colors ${
                      selectable ? "cursor-pointer" : ""
                    } ${isSelected ? "ring-2 ring-inset ring-accent-animate" : ""}`}
                  >
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      {selectable && (
                        <span
                          className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                            isSelected ? "border-accent-animate bg-accent-animate" : "border-ink/25"
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    {item.description && <p className="mb-4 text-xs text-ink/50">{item.description}</p>}
                    <p className="font-[family-name:var(--font-jetbrains-mono)] text-lg text-accent-animate">
                      {item.price}
                    </p>
                    {item.unit && (
                      <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.06em] text-ink/40">
                        {item.unit}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {card.terms.length > 0 && (
        <div className="mt-8 border-t border-ink/10 pt-6">
          <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
            Terms
          </p>
          <ul className="space-y-2">
            {card.terms.map((term, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/60">
                <span className="text-accent-animate" aria-hidden="true">
                  →
                </span>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3 border-t border-ink/10 pt-6">
        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Accept &amp; get started →
        </button>
        <PrintButton className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5" />
      </div>
    </div>
  );
}
