"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import HeroLightBeam from "./HeroLightBeam";
import PlaygroundToggle from "./Playground/PlaygroundToggle";
import PlaygroundToggleButton from "./Playground/PlaygroundToggleButton";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

const AnimateHero = () => {
  const shapeRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { revealed } = usePlaygroundReveal();
  const [timeLabel, setTimeLabel] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeLabel(
        new Intl.DateTimeFormat("en", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

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
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pt-24"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeroLightBeam />
      <div
        ref={shapeRef}
        className={`absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-accent-animate opacity-15 blur-3xl md:h-96 md:w-96 ${
          prefersReducedMotion ? "" : "transition-transform duration-500 ease-out"
        }`}
        aria-hidden="true"
      />
      <div
        className={`absolute bottom-10 left-10 h-40 w-40 rounded-[40%_60%_60%_40%/40%_40%_60%_60%] bg-accent-animate opacity-10 blur-2xl ${
          prefersReducedMotion ? "" : "animate-[spin_18s_linear_infinite]"
        }`}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[88rem]">
        <p className="mb-6 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/60">
          Based remotely / {timeLabel || "--:--"} / Open to work
        </p>
        <h1 className="max-w-[13ch] font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(4.5rem,14vw,15rem)] font-black leading-[0.82] tracking-tight text-ink">
          <span className="block">Motion that means</span>
          <span className="block pb-2 italic leading-[0.95]">something.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          Brand animation, UI micro-interactions, and short-form video built to hold attention and say something while it does.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <PlaygroundToggleButton />
          <div
            className={`transition-all duration-300 ease-out ${
              revealed ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <PlaygroundToggle />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimateHero;
