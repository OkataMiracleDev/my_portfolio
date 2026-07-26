"use client";

import Link from "next/link";
import PlaygroundShapeMorph from "./Playground/PlaygroundShapeMorph";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

export default function HireCta() {
  const { revealed } = usePlaygroundReveal();

  return (
    <section className="section px-6 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
              Open for projects
            </p>
            <h2 className="max-w-lg font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.92] text-ink md:text-6xl">
              Have a project{" "}
              <span className="font-[family-name:var(--font-accent-script)] italic text-accent-animate">
                in mind?
              </span>
            </h2>
            <p className="mt-5 max-w-md text-lg text-ink/65">
              Always open to motion work, brand, product, or social. No brief too rough.
            </p>
            <Link
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-pill bg-accent-animate px-7 py-3.5 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Let&apos;s talk
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div
            className={`flex flex-col items-center gap-3 transition-all duration-300 ease-out ${
              revealed ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0"
            }`}
          >
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/40">
              One more thing
            </p>
            <PlaygroundShapeMorph />
          </div>
        </div>
      </div>
    </section>
  );
}
