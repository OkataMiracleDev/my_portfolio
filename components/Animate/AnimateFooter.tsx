import Link from "next/link";

export default function AnimateFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink/60 md:flex-row md:px-12">
      <p>© {new Date().getFullYear()} Okata Miracle. All rights reserved.</p>
      <div className="flex gap-6">
        <Link href="/" className="transition-colors duration-200 ease-out hover:text-ink">
          ← All modes
        </Link>
        <Link href="/build" className="transition-colors duration-200 ease-out hover:text-ink">
          View dev work
        </Link>
      </div>
    </footer>
  );
}
