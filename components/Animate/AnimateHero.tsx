"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import HeroLightBeam from "@/components/Shared/HeroLightBeam";
import PlaygroundToggle from "./Playground/PlaygroundToggle";
import PlaygroundToggleButton from "./Playground/PlaygroundToggleButton";
import PlaygroundDraggableSticker from "./Playground/PlaygroundDraggableSticker";
import PlaygroundTiltCard from "./Playground/PlaygroundTiltCard";
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
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pt-28 md:px-12"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <HeroLightBeam accent="animate" />
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

      <div
        className={`absolute right-6 top-24 z-20 rotate-6 transition-all duration-500 ease-out md:right-16 md:top-32 ${
          revealed ? "translate-y-0 opacity-100 delay-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <PlaygroundDraggableSticker />
      </div>

      <div
        className={`absolute bottom-16 left-6 z-20 -rotate-3 transition-all duration-500 ease-out md:bottom-20 md:left-16 ${
          revealed ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <PlaygroundTiltCard />
      </div>

      <div className="relative z-10 w-full max-w-[70rem]">
        <p className="mb-7 flex flex-wrap items-center gap-x-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/55">
          <span>Based remotely</span>
          <span aria-hidden="true" className="text-accent-animate">·</span>
          <span className="tabular-nums">{timeLabel || "--:--"}</span>
          <span aria-hidden="true" className="text-accent-animate">·</span>
          <span>Open to work</span>
        </p>

        <h1 className="max-w-[16ch] font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3.2rem,9vw,8.5rem)] font-bold leading-[0.88] tracking-tight text-ink">
          <span className="block">Motion that</span>
          <span className="block pb-2">
            means{" "}
            <span className="font-[family-name:var(--font-accent-script)] italic text-accent-animate">
              something.
            </span>
          </span>
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink/65">
          Brand animation, UI micro-interactions, and short-form video, built to hold attention and say something while it does.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
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
