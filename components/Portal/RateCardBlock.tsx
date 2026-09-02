"use client";

import { useState } from "react";
import PrintButton from "./PrintButton";
import { currencyBadgeLabel, prefixCurrency } from "@/lib/constants/currencies";
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

function SelectMark({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
        selected
          ? "border-accent-animate bg-accent-animate"
          : "border-ink/30 group-hover:border-ink/55"
      }`}
    >
      {selected && (
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-ink">
          <path
            d="M2 6.4 4.8 9.2 10 3.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
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
        url.searchParams.set("price", prefixCurrency(selectedItem.price, card.currency));
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
    <div className="mb-14">
      {/* Title + currency, on a rule rather than inside a panel */}
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b border-ink/15 pb-5">
        <div>
          <p className="font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-ink/40">
            {selectable ? `${card.lineItems.length} packages` : "Quote"}
          </p>
          <p className="mt-1.5 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-[1] text-ink md:text-3xl">
            {card.title}
          </p>
        </div>
        <span className="rounded-pill border border-accent-animate/30 bg-accent-animate/10 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.65rem] uppercase tracking-[0.06em] text-accent-animate">
          {currencyBadgeLabel(card.currency)}
        </span>
      </div>

      {selectable && (
        <p className="mt-5 text-sm text-ink/55">
          Pick the option that fits — your choice carries down to the summary below.
        </p>
      )}

      {sections.map((group, gi) => {
        let runningIndex = 0;
        for (let s = 0; s < gi; s++) runningIndex += sections[s].items.length;

        return (
          <div key={group.section || gi} className="mt-8">
            {card.layout === "sectioned" && group.section && (
              <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-accent-animate">
                Track {String(gi + 1).padStart(2, "0")} — {group.section}
              </p>
            )}

            <div
              role={selectable ? "radiogroup" : undefined}
              aria-label={selectable ? group.section || card.title : undefined}
              className="divide-y divide-ink/10 border-y border-ink/10"
            >
              {group.items.map((item, i) => {
                const index = runningIndex + i;
                const isSelected = selectable && selected === index;

                return (
                  <button
                    key={i}
                    type="button"
                    role={selectable ? "radio" : undefined}
                    aria-checked={selectable ? isSelected : undefined}
                    disabled={!selectable}
                    onClick={() => selectable && setSelected(index)}
                    className={`group flex w-full items-start gap-4 px-1 py-5 text-left transition-colors duration-200 ${
                      selectable ? "cursor-pointer hover:bg-ink/[0.03]" : "cursor-default"
                    } ${isSelected ? "bg-accent-animate/[0.07]" : ""}`}
                  >
                    {selectable && <SelectMark selected={isSelected} />}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <p
                          className={`font-[family-name:var(--font-cabinet-grotesk)] text-[1.05rem] font-bold ${
                            isSelected ? "text-ink" : "text-ink/90"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="shrink-0 whitespace-nowrap font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-accent-animate">
                          {prefixCurrency(item.price, card.currency)}
                        </p>
                      </div>

                      {item.unit && (
                        <p className="mt-0.5 text-right font-[family-name:var(--font-jetbrains-mono)] text-[0.65rem] uppercase tracking-[0.06em] text-ink/40">
                          {item.unit}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-ink/55">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {card.terms.length > 0 && (
        <div className="mt-10">
          <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
            Terms
          </p>
          <ol className="divide-y divide-ink/10 border-t border-ink/10">
            {card.terms.map((term, i) => (
              <li key={i} className="grid grid-cols-[auto_1fr] gap-4 py-3">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs tabular-nums text-ink/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[62ch] text-sm leading-relaxed text-ink/60">{term}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-10 border-t border-ink/15 pt-6">
        {selectable && selectedItem && (
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-sm text-ink/55">
              Selected — <span className="font-medium text-ink">{selectedItem.title}</span>
            </p>
            <p className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
              {prefixCurrency(selectedItem.price, card.currency)}
              {selectedItem.unit && (
                <span className="ml-1.5 font-[family-name:var(--font-jetbrains-mono)] text-xs font-normal lowercase tracking-normal text-ink/45">
                  {selectedItem.unit}
                </span>
              )}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Accept &amp; get started <span aria-hidden="true">→</span>
          </button>
          <PrintButton className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5" />
        </div>
      </div>
    </div>
  );
}
