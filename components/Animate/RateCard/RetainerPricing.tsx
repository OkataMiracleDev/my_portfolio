"use client";

import { useState } from "react";
import Link from "next/link";

type Billing = "monthly" | "yearly";

type Tier = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  monthly: number;
  features: string[];
  featured?: boolean;
};

/* Ported from the old RETAINER_TIERS list, expanded with what each tier
   actually includes so the cards can carry a real feature comparison
   instead of a one-line description. */
const TIERS: Tier[] = [
  {
    id: "starter",
    index: "R01",
    name: "Starter",
    tagline: "For brands shipping a handful of things each month.",
    monthly: 800,
    features: [
      "2–3 short deliverables per month",
      "2 revision rounds per deliverable",
      "5–10 business-day turnaround",
      "Email support, next-day replies",
    ],
  },
  {
    id: "growth",
    index: "R02",
    name: "Growth",
    tagline: "The steady-stream setup most teams settle on.",
    monthly: 1500,
    featured: true,
    features: [
      "4–6 deliverables per month",
      "3 revision rounds per deliverable",
      "Priority 3–5 day turnaround",
      "Shared Slack channel",
      "Editable source files included",
    ],
  },
  {
    id: "studio",
    index: "R03",
    name: "Studio",
    tagline: "Reserved capacity — effectively an in-house motion team.",
    monthly: 2500,
    features: [
      "Reserved weekly capacity",
      "Unlimited revision rounds",
      "48–72 hour turnaround",
      "Direct line + weekly sync call",
      "Source files + motion-system docs",
    ],
  },
];

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

function Check({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M2 8.5 6.2 12.5 14 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RetainerPricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const isYearly = billing === "yearly";

  return (
    <section className="border-b border-ink/10 py-20 md:py-28">
      <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-accent-animate">
        Track 01 — Monthly retainer
      </p>
      <h2 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] text-ink md:text-4xl">
        Motion on tap, billed monthly
      </h2>
      <p className="mb-12 max-w-xl text-sm leading-relaxed text-ink/60 md:text-[1rem]">
        For brands and teams that need a steady stream of motion work — social content, product
        micro-interactions, ongoing brand animation — without re-scoping a new project every time.
      </p>

      {/* Billing period toggle */}
      <div className="flex justify-center">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="relative grid grid-cols-2 rounded-pill border border-ink/10 bg-base-raised p-1"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-pill bg-accent-animate transition-transform duration-300 ease-out"
            style={{ transform: isYearly ? "translateX(100%)" : "translateX(0)" }}
          />
          {(["monthly", "yearly"] as const).map((period) => (
            <button
              key={period}
              type="button"
              role="radio"
              aria-checked={billing === period}
              onClick={() => setBilling(period)}
              className={`relative z-10 rounded-pill px-6 py-2 text-sm font-medium capitalize transition-colors duration-200 ${
                billing === period ? "text-ink" : "text-ink/55 hover:text-ink/80"
              }`}
            >
              {period}
              {period === "yearly" && (
                <span className="ml-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.08em] text-ease">
                  −17%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-12 mt-4 text-center font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.1em] text-ink/40">
        {isYearly
          ? "Yearly plans include two months free"
          : "Billed monthly · pause or cancel with 14 days' notice"}
      </p>

      {/* Tiers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TIERS.map((tier) => {
          const yearlyTotal = tier.monthly * 10;
          const perMonth = Math.round(yearlyTotal / 12);
          const big = isYearly ? usd(perMonth) : usd(tier.monthly);
          const sub = isYearly ? `${usd(yearlyTotal)} billed yearly` : "billed monthly";
          const featured = tier.featured;

          return (
            <div
              key={tier.id}
              className={`flex flex-col rounded-card p-7 md:p-8 ${
                featured
                  ? "bg-ink text-[var(--color-base)] shadow-[0_28px_70px_-30px_rgb(79_91_255_/_0.55)] md:-translate-y-4"
                  : "border border-ink/10 bg-base-raised transition-colors duration-200 hover:border-ink/25"
              }`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span
                  className={`font-[family-name:var(--font-jetbrains-mono)] text-xs tracking-[0.08em] ${
                    featured ? "text-[var(--color-base)]/50" : "text-ink/40"
                  }`}
                >
                  {tier.index}
                </span>
                {featured && (
                  <span className="rounded-pill bg-accent-animate px-2.5 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.08em] text-ink">
                    Most chosen
                  </span>
                )}
              </div>

              <h3
                className={`font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold ${
                  featured ? "text-[var(--color-base)]" : "text-ink"
                }`}
              >
                {tier.name}
              </h3>
              <p
                className={`mb-6 mt-1 text-sm ${
                  featured ? "text-[var(--color-base)]/60" : "text-ink/55"
                }`}
              >
                {tier.tagline}
              </p>

              <div key={billing} className="animate-[rate-price-swap_0.35s_var(--ease-out)]">
                <p
                  className={`font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold ${
                    featured ? "text-[var(--color-base)]" : "text-ink"
                  }`}
                >
                  {big}
                  <span
                    className={`ml-1 font-[family-name:var(--font-jetbrains-mono)] text-sm font-normal ${
                      featured ? "text-[var(--color-base)]/50" : "text-ink/45"
                    }`}
                  >
                    / mo
                  </span>
                </p>
                <p
                  className={`mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.08em] ${
                    featured ? "text-[var(--color-base)]/45" : "text-ink/40"
                  }`}
                >
                  {sub}
                </p>
              </div>

              <hr
                className={`my-6 border-0 border-t ${
                  featured ? "border-[var(--color-base)]/15" : "border-ink/10"
                }`}
              />

              <ul className="mb-8 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex gap-3 text-sm ${
                      featured ? "text-[var(--color-base)]/80" : "text-ink/70"
                    }`}
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-animate" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/animate#contact"
                className={`mt-auto flex items-center justify-center gap-2 rounded-pill px-5 py-3 text-sm font-semibold transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97] ${
                  featured
                    ? "bg-[var(--color-base)] text-ink"
                    : "bg-accent-animate text-ink"
                }`}
              >
                Start {tier.name} <span aria-hidden="true">→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
