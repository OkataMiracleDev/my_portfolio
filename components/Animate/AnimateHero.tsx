"use client";
import React, { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const AnimateHero = () => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !shapeRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    shapeRef.current.style.transform = `translate(${relX * 40}px, ${relY * 40}px)`;
  };

  const handleMouseLeave = () => {
    if (!shapeRef.current) return;
    shapeRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <section
      className="relative flex min-h-[90vh] items-center overflow-hidden px-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={shapeRef}
        className={`absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-accent-animate opacity-20 blur-3xl md:h-96 md:w-96 ${
          prefersReducedMotion ? "" : "transition-transform duration-500 ease-out"
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute left-10 bottom-10 h-40 w-40 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-accent-animate opacity-10 blur-2xl ${
          prefersReducedMotion ? "" : "animate-[spin_18s_linear_infinite]"
        }`}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-ink/15 px-4 py-1.5 text-sm font-medium text-ink/70">
          <span className="h-2 w-2 rounded-full bg-accent-animate" aria-hidden="true" />
          Motion Designer
        </p>
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-6xl font-bold leading-[0.95] tracking-tight text-ink md:text-8xl">
          Motion that means something.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Brand animation, UI micro-interactions, and short-form video — built to hold attention and say something while it does.
        </p>
      </div>
    </section>
  );
};

export default AnimateHero;
