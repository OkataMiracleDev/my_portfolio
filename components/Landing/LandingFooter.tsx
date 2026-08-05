import Link from "next/link";
import { footLinks } from "@/constant/constant";

export default function LandingFooter() {
  return (
    <footer className="border-t border-ink/10 px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/50 md:flex-row">
        <p>© {new Date().getFullYear()} Mimi Studios — founded by Okata Miracle</p>
        <div className="flex gap-6">
          {footLinks.map((link) => (
            <Link
              key={link.id}
              href={link.url}
              className="transition-colors duration-200 ease-out hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
