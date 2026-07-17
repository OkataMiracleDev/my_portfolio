import Link from "next/link";

export default function LandingHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link
        href="/"
        className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink"
      >
        Okata Miracle
      </Link>
      <Link
        href="/build#contact"
        className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        Say hello
      </Link>
    </header>
  );
}
