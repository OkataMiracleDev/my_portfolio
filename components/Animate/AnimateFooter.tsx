import Link from "next/link";

export default function AnimateFooter() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/50 md:flex-row">
        <p>© {new Date().getFullYear()} Okata Miracle</p>
        <div className="flex gap-6">
          <Link href="/" className="transition-colors duration-200 ease-out hover:text-accent-animate">
            All modes
          </Link>
          <Link href="/build" className="transition-colors duration-200 ease-out hover:text-accent-animate">
            Dev work
          </Link>
        </div>
      </div>
    </footer>
  );
}
