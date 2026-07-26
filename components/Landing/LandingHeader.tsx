"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const MODE_LINKS = [
  { id: "build", label: "Build", href: "/build#contact" },
  { id: "animate", label: "Animate", href: "/animate#contact" },
];

export default function LandingHeader() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-12">
      <Link
        href="/"
        className="font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink"
      >
        Okata Miracle
      </Link>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
        >
          Say hello
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-10 mt-2 w-44 overflow-hidden rounded-card bg-base-raised py-1.5 shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]"
          >
            {MODE_LINKS.map((link) => (
              <Link
                key={link.id}
                role="menuitem"
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
