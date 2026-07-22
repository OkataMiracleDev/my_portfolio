"use client";

import Link from "next/link";
import PlaygroundShapeMorph from "./Playground/PlaygroundShapeMorph";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

export default function HireCta() {
  const { revealed } = usePlaygroundReveal();

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-4xl rounded-card bg-base-raised p-8 text-center md:p-12">
        <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-black text-ink md:text-5xl">
          Have a project in mind?
        </h2>
        <p className="mt-3 text-ink/70">Always open to motion work for brand, product, or social.</p>
        <div
          className={`mx-auto mt-6 flex justify-center transition-all duration-300 ease-out ${
            revealed ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <PlaygroundShapeMorph />
        </div>
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
