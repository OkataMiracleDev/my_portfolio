"use client";

import PlaygroundSlider from "./Playground/PlaygroundSlider";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

const capabilities = [
  { id: "brand", title: "Brand Animation", description: "Logo reveals, brand videos, motion identity systems." },
  { id: "ui", title: "UI Micro-interactions", description: "The small moments that make software feel considered." },
  { id: "social", title: "Social & Explainer", description: "Short-form video built to hold attention and explain fast." },
];

export default function CapabilitiesStrip() {
  const { revealed } = usePlaygroundReveal();

  return (
    <section className="section px-6">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-center font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/50">
          Motion menu
        </p>
        <h2 className="mb-12 text-center font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-black leading-none text-ink md:text-6xl">
          What I do
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {capabilities.map((cap, i) => (
            <div
              key={cap.id}
              className={`rounded-card bg-base-raised p-8 ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <h3 className="mb-3 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
                {cap.title}
              </h3>
              <p className="text-ink/70">{cap.description}</p>
            </div>
          ))}
        </div>
        <div
          className={`mx-auto mt-8 max-w-md transition-all duration-300 ease-out ${
            revealed ? "translate-y-0 opacity-100 delay-75" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <div className="rounded-card border border-ink/10 bg-base-raised p-5 shadow-[0_18px_48px_rgb(0_0_0_/_0.06)]">
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/50">
              Timeline scrubber
            </p>
            <PlaygroundSlider />
          </div>
        </div>
      </div>
    </section>
  );
}
