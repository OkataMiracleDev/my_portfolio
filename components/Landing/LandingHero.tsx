export default function LandingHero() {
  return (
    <section className="px-6 pb-16 pt-8 md:px-12 md:pb-24">
      <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
        <span
          className="h-2 w-2 rounded-full bg-accent-build"
          aria-hidden="true"
        />
        Open to work
      </p>
      <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-[1.05] text-ink md:text-7xl">
        Okata Miracle
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink/70 md:text-xl">
        Frontend developer and motion designer. I build interfaces that
        work, then I make them move.
      </p>
    </section>
  );
}
