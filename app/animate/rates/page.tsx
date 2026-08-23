import type { Metadata } from "next";
import Link from "next/link";

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

const RETAINER_TIERS = [
  { name: "Starter", desc: "2–3 short deliverables / mo", price: "$800 /mo" },
  { name: "Growth", desc: "4–6 deliverables / mo", price: "$1,500 /mo" },
  { name: "Studio", desc: "Dedicated weekly capacity", price: "$2,500 /mo" },
];

const ADDONS = [
  { name: "Rush delivery (under 5 business days)", value: "+25%" },
  { name: "Extra revision round (beyond included)", value: "$150 / round" },
  { name: "Source file handoff (.aep, raw assets)", value: "$100" },
  { name: "Voiceover / TTS integration", value: "$150" },
];

const TERMS = [
  "50% deposit to start, balance due on final delivery",
  "2 rounds of revisions included per project — additional rounds billed as add-ons",
  "Project timelines confirmed after scoping call, typically 5–10 business days depending on scope",
  "Retainer clients get priority scheduling over new project inquiries",
  "Usage rights: final files are for the agreed use case (specify: social, web, ads, etc.) — broader licensing available on request",
];

export default function RateCardPage() {
  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
          Rate card — {new Date().getFullYear()}
        </p>
        <h1 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-5xl">
          Pricing, plainly.
        </h1>
        <p className="mb-6 max-w-xl text-lg text-ink/70">
          Project rates for one-off work, plus a retainer option for anyone who needs motion on an
          ongoing basis. Every project starts with a quick call to scope it properly — these are
          starting points, not final quotes.
        </p>

        <section className="mb-16">
          <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
            Track 01
          </p>
          <h2 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            Project-based work
          </h2>
          <p className="mb-8 max-w-xl text-sm text-ink/60">
            Flat fee per deliverable. Price depends on length, complexity, and revision rounds —
            ranges below cover typical scope.
          </p>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card bg-ink/10 md:grid-cols-3">
            {SERVICES.map((service) => (
              <div key={service.title} className="bg-base p-6">
                <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-animate">
                  {service.number}
                </p>
                <h3 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                  {service.title}
                </h3>
                <p className="mb-6 min-h-[3.5rem] text-sm text-ink/60">{service.description}</p>
                <div className="border-t border-ink/10 pt-4 font-[family-name:var(--font-jetbrains-mono)] text-lg text-accent-animate">
                  {service.price}
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.06em] text-ink/40">
                    {service.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
            Track 02
          </p>
          <h2 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            Monthly retainer
          </h2>
          <p className="mb-8 max-w-xl text-sm text-ink/60">
            For brands and teams that need a steady stream of motion work — social content, product
            micro-interactions, ongoing brand animation — without re-scoping a new project every
            time.
          </p>

          <div className="rounded-card border border-accent-animate/30 bg-accent-animate/[0.06] p-8">
            <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-accent-animate">
              Recommended for ongoing clients
            </p>
            <h3 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
              How it works
            </h3>
            <p className="mb-6 max-w-2xl text-sm text-ink/60">
              A fixed number of deliverables or hours per month, billed monthly, with priority
              turnaround over one-off project requests. Unused capacity doesn&apos;t roll over —
              this keeps the retainer sustainable for both sides.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {RETAINER_TIERS.map((tier) => (
                <div key={tier.name} className="rounded-xl border border-ink/10 bg-base p-4">
                  <p className="mb-1 font-[family-name:var(--font-cabinet-grotesk)] text-sm font-bold text-ink">
                    {tier.name}
                  </p>
                  <p className="mb-2 text-xs text-ink/50">{tier.desc}</p>
                  <p className="font-[family-name:var(--font-jetbrains-mono)] text-base text-accent-animate">
                    {tier.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <p className="mb-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-accent-animate">
            Track 03
          </p>
          <h2 className="mb-8 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            Add-ons
          </h2>
          <div className="divide-y divide-ink/10 rounded-card border border-ink/10">
            {ADDONS.map((addon) => (
              <div key={addon.name} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="text-sm text-ink">{addon.name}</span>
                <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate">
                  {addon.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ink/10 pt-10">
          <h2 className="mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
            Terms, at a glance
          </h2>
          <ul className="space-y-3">
            {TERMS.map((term) => (
              <li key={term} className="flex gap-3 text-sm text-ink/60">
                <span className="text-accent-animate" aria-hidden="true">
                  →
                </span>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/animate#contact"
            className="inline-flex items-center gap-2 rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span>Start a project</span>
            <span>→</span>
          </Link>
          <Link
            href="/animate"
            className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Animate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
