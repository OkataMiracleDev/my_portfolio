"use client";

import PlaygroundSlider from "./Playground/PlaygroundSlider";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

const capabilities = [
  {
    id: "brand",
    number: "01",
    title: "Brand Animation",
    description: "Logo reveals, brand videos, and motion identity systems that carry a brand's voice into movement.",
  },
  {
    id: "ui",
    number: "02",
    title: "UI Micro-interactions",
    description: "The small moments that make software feel considered, from a button press to a page transition.",
  },
  {
    id: "social",
    number: "03",
    title: "Social & Explainer",
    description: "Short-form video built to hold attention in the first second and explain fast after that.",
  },
];

export default function CapabilitiesStrip() {
  const { revealed } = usePlaygroundReveal();

  return (
    <section className="section px-6 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
          Motion menu
        </p>
        <h2 className="mb-16 max-w-2xl font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-6xl">
          What I do
        </h2>

        <div className="divide-y divide-ink/10 border-t border-ink/10">
          {capabilities.map((cap, i) => (
            <div
              key={cap.id}
              className={`group grid grid-cols-1 gap-4 py-10 md:grid-cols-12 md:items-baseline md:gap-8 ${
                i % 2 === 1 ? "md:text-right" : ""
              }`}
            >
              <div
                className={`font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-animate md:col-span-1 ${
                  i % 2 === 1 ? "md:order-3 md:text-right" : ""
                }`}
              >
                {cap.number}
              </div>
              <h3
                className={`font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink transition-colors duration-200 ease-out group-hover:text-accent-animate md:col-span-5 md:text-3xl ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                {cap.title}
              </h3>
              <p
                className={`max-w-md text-ink/65 md:col-span-6 ${
                  i % 2 === 1 ? "md:order-1 md:ml-auto" : "md:ml-auto"
                }`}
              >
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-10 flex justify-center transition-all duration-300 ease-out ${
            revealed ? "translate-y-0 opacity-100 delay-75" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <div className="w-full max-w-sm rounded-card border border-ink/10 bg-base-raised p-5 shadow-[0_18px_48px_rgb(0_0_0_/_0.06)]">
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/50">
              Not wired to anything, promise
            </p>
            <PlaygroundSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
