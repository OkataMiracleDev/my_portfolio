import type { Metadata } from "next";
import Link from "next/link";
import RetainerPricing from "@/components/Animate/RateCard/RetainerPricing";

export const metadata: Metadata = {
  title: "Rate Card | Mimi Studios",
  description: "Project and retainer pricing for motion design work with Mimi Studios.",
};

const SERVICES = [
  {
    number: "00:00:01:00",
    title: "Brand Animation",
    description: "Logo reveals, brand intros/outros, motion identity systems.",
    price: "$300 – $800",
    unit: "Per deliverable",
  },
  {
    number: "00:00:02:00",
    title: "UI Micro-interactions",
    description: "Button states, transitions, loading sequences — priced per interaction set.",
    price: "$250 – $600",
    unit: "Per interaction set",
  },
  {
    number: "00:00:03:00",
    title: "Social & Explainer",
    description: "Short-form video and explainer content, kinetic typography, up to 60–90 sec.",
    price: "$400 – $1,000",
    unit: "Per video",
  },
];

const ADDONS = [
  { name: "Rush delivery (under 5 business days)", value: "+25%" },
  { name: "Extra revision round (beyond included)", value: "$150 / round" },
  { name: "Source file handoff (.aep, raw assets)", value: "$100" },
  { name: "Voiceover / TTS integration", value: "$150" },
];

const TERMS = [
  "50% deposit to start, balance due on final delivery.",
  "2 rounds of revisions included per project — additional rounds billed as add-ons.",
  "Project timelines confirmed after the scoping call, typically 5–10 business days depending on scope.",
  "Retainer clients get priority scheduling over new project inquiries.",
  "Usage rights: final files are for the agreed use case (social, web, ads, etc.) — broader licensing available on request.",
];

export default function RateCardPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-5xl">
        {/* Hero — asymmetric split: statement left, context right */}
        <header className="grid grid-cols-1 gap-8 border-b border-ink/10 pb-16 md:grid-cols-12 md:gap-12 md:pb-24">
          <div className="md:col-span-7">
            <p className="mb-5 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
              Rate card — {year}
            </p>
            <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-[0.92] text-ink md:text-7xl">
              Pricing,
              <br />
              plainly.
            </h1>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-3">
            <p className="max-w-[42ch] text-[1rem] leading-relaxed text-ink/70">
              Project rates for one-off work, plus a retainer for anyone who needs motion on an
              ongoing basis. Every engagement starts with a short call to scope it properly — these
              are starting points, not final quotes.
            </p>
            <Link
              href="/animate/projects"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-animate underline-offset-4 hover:underline"
            >
              See sample deliverables <span aria-hidden="true">→</span>
            </Link>
          </div>
        </header>

        <RetainerPricing />

        {/* Track 02 — one-off project work */}
        <section className="border-b border-ink/10 py-20 md:py-28">
          <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-accent-animate">
            Track 02 — Project-based work
          </p>
          <h2 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] text-ink md:text-4xl">
            One-off, flat fee per deliverable
          </h2>
          <p className="mb-10 max-w-xl text-sm leading-relaxed text-ink/60 md:text-[1rem]">
            Price depends on length, complexity, and revision rounds — the ranges below cover typical
            scope.
          </p>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card bg-ink/10 md:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.title} className="flex flex-col bg-base p-6 md:p-7">
                <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-animate">
                  {service.number}
                </p>
                <h3 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                  {service.title}
                </h3>
                <p className="mb-8 text-sm leading-relaxed text-ink/60">{service.description}</p>
                <div className="mt-auto border-t border-ink/10 pt-4 font-[family-name:var(--font-jetbrains-mono)] text-xl text-accent-animate">
                  {service.price}
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.06em] text-ink/40">
                    {service.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Track 03 — add-ons */}
        <section className="border-b border-ink/10 py-20 md:py-28">
          <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-accent-animate">
            Track 03 — Add-ons
          </p>
          <h2 className="mb-10 font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] text-ink md:text-4xl">
            Stack these onto any project
          </h2>
          <div className="divide-y divide-ink/10 border-y border-ink/10">
            {ADDONS.map((addon) => (
              <div key={addon.name} className="flex items-center justify-between gap-6 py-4">
                <span className="text-sm text-ink/85">{addon.name}</span>
                <span className="shrink-0 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
                  {addon.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Terms */}
        <section className="py-20 md:py-28">
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] text-ink md:text-4xl">
            Terms, at a glance
          </h2>
          <ol className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
            {TERMS.map((term, i) => (
              <li key={term} className="grid grid-cols-[auto_1fr] gap-5 py-5">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs tabular-nums text-ink/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[65ch] text-sm leading-relaxed text-ink/65">{term}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Close */}
        <div className="flex flex-wrap gap-3 border-t border-ink/10 pt-12">
          <Link
            href="/animate#contact"
            className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span>Book a scoping call</span>
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/animate"
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Mimi Studios</span>
          </Link>
        </div>
        <p className="mt-10 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.1em] text-ink/35">
          Mimi Studios — rate card — valid for {year} — subject to change
        </p>
      </div>
    </div>
  );
}
