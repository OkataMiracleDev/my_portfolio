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

const gridColsFor = (count: number) =>
  count >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : count === 2 ? "sm:grid-cols-2" : "max-w-md";

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
              className={`grid grid-cols-1 items-start gap-4 print:grid-cols-1 ${gridColsFor(group.items.length)}`}
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
                    className={`group flex h-full flex-col rounded-card p-6 text-left transition-colors duration-200 md:p-7 ${
                      isSelected
                        ? "bg-ink text-[var(--color-base)] shadow-[0_28px_70px_-30px_rgb(79_91_255_/_0.5)]"
                        : selectable
                          ? "cursor-pointer border border-ink/12 bg-base-raised hover:border-ink/30"
                          : "border border-ink/12 bg-base-raised"
                    }`}
                  >
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <span
                        className={`font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.14em] ${
                          isSelected ? "text-[var(--color-base)]/45" : "text-ink/35"
                        }`}
                      >
                        {`PKG ${String(index + 1).padStart(2, "0")}`}
                      </span>
                      {isSelected && (
                        <span className="rounded-pill bg-accent-animate px-2.5 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.6rem] uppercase tracking-[0.08em] text-ink">
                          Selected
                        </span>
                      )}
                    </div>

                    <h4
                      className={`font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold ${
                        isSelected ? "text-[var(--color-base)]" : "text-ink"
                      }`}
                    >
                      {item.title}
                    </h4>

                    <p
                      className={`mt-3 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold ${
                        isSelected ? "text-[var(--color-base)]" : "text-accent-animate"
                      }`}
                    >
                      {prefixCurrency(item.price, card.currency)}
                    </p>
                    {item.unit && (
                      <p
                        className={`mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.65rem] uppercase tracking-[0.06em] ${
                          isSelected ? "text-[var(--color-base)]/45" : "text-ink/40"
                        }`}
                      >
                        {item.unit}
                      </p>
                    )}

                    {item.description && (
                      <>
                        <hr
                          className={`my-5 border-0 border-t ${
                            isSelected ? "border-[var(--color-base)]/15" : "border-ink/10"
                          }`}
                        />
                        <p
                          className={`text-sm leading-relaxed print:line-clamp-none ${
                            isSelected
                              ? "text-[var(--color-base)]/75"
                              : "line-clamp-[8] text-ink/55"
                          }`}
                        >
                          {item.description}
                        </p>
                      </>
                    )}

                    {selectable && (
                      <span
                        className={`mt-auto inline-flex w-fit items-center gap-1.5 rounded-pill px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                          isSelected
                            ? "bg-[var(--color-base)] text-ink"
                            : "bg-accent-animate/12 text-accent-animate group-hover:bg-accent-animate group-hover:text-ink"
                        }`}
                      >
                        {isSelected ? "Selected ✓" : "Select this package"}
                      </span>
                    )}
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
