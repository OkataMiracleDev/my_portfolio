import Link from "next/link";

export default function HireCta() {
  return (
    <section className="px-6 pb-24">
      <div className="max-w-4xl mx-auto rounded-card bg-base-raised p-8 md:p-12 text-center">
        <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl md:text-3xl font-bold text-ink">
          Have a project in mind?
        </h2>
        <p className="mt-3 text-ink/70">Always open to motion work — brand, product, or social.</p>
        <Link
          href="/build#contact"
          className="mt-6 inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          Let&apos;s talk
        </Link>
      </div>
    </section>
  );
}
