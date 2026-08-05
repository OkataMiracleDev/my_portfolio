"use client";

import Link from "next/link";
import PlaygroundEtchPad from "./Playground/PlaygroundEtchPad";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

export default function AnimateFooter() {
  const { revealed } = usePlaygroundReveal();

  return (
    <footer className="border-t border-ink/10 px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/50 md:flex-row">
          <p>© {new Date().getFullYear()} Mimi Studios</p>
          <div className="flex gap-6">
            <Link href="/" className="transition-colors duration-200 ease-out hover:text-accent-animate">
              All modes
            </Link>
            <Link href="/build" className="transition-colors duration-200 ease-out hover:text-accent-animate">
              Dev work
            </Link>
            <Link href="/animate/rates" className="transition-colors duration-200 ease-out hover:text-accent-animate">
              Rates
            </Link>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-out ${
            revealed ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <PlaygroundEtchPad />
        </div>
      </div>
    </footer>
  );
}
