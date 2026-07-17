import Link from "next/link";
import { footLinks } from "@/constant/constant";

export default function LandingFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink/60 md:flex-row md:px-12">
      <p>© {new Date().getFullYear()} Okata Miracle. All rights reserved.</p>
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
    </footer>
  );
}
