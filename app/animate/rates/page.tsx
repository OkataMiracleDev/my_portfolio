import type { Metadata } from "next";
import Link from "next/link";
import RetainerPricing from "@/components/Animate/RateCard/RetainerPricing";
import {
  getRetainerTiers,
  getRateServices,
  getRateAddons,
  getRateTerms,
} from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Rate Card | Okata Studios",
  description: "Project and retainer pricing for motion design work with Okata Studios.",
};

// Prices are edited in /admin/rates and revalidatePath'd on save, but the page
// also prints the current year, so it cannot be fully static anyway.
export const dynamic = "force-dynamic";

export default async function RateCardPage() {
  const year = new Date().getFullYear();
  const [tiers, services, addons, terms] = await Promise.all([
    getRetainerTiers(),
    getRateServices(),
    getRateAddons(),
    getRateTerms(),
  ]);

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

        <RetainerPricing tiers={tiers} />

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

          <div
            className={`grid grid-cols-1 gap-px overflow-hidden rounded-card bg-ink/10 ${
              services.length === 1
                ? ""
                : services.length === 2
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
            }`}
          >
            {services.map((service) => (
              <div key={service.id} className="flex flex-col bg-base p-6 md:p-7">
                <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-animate">
                  {service.timecode}
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
            {addons.map((addon) => (
              <div key={addon.id} className="flex items-center justify-between gap-6 py-4">
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
            {terms.map((term, i) => (
              <li key={term.id} className="grid grid-cols-[auto_1fr] gap-5 py-5">
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs tabular-nums text-ink/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[65ch] text-sm leading-relaxed text-ink/65">{term.body}</span>
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
            <span>Back to Okata Studios</span>
          </Link>
        </div>
        <p className="mt-10 font-[family-name:var(--font-jetbrains-mono)] text-[0.7rem] uppercase tracking-[0.1em] text-ink/35">
          Okata Studios — rate card — valid for {year} — subject to change
        </p>
      </div>
    </div>
  );
}
