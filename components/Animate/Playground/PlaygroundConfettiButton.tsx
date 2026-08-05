"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const PARTICLE_COUNT = 10;

function particleOffsets() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const distance = 42 + (i % 3) * 10;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });
}

export default function PlaygroundConfettiButton() {
  const [burstKey, setBurstKey] = useState<number | null>(null);

  const handleClick = () => {
    setBurstKey(Date.now());
    window.setTimeout(() => setBurstKey(null), 700);
  };

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {burstKey !== null &&
          particleOffsets().map((offset, i) => (
            <motion.span
              key={`${burstKey}-${i}`}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: offset.x, y: offset.y, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className={`pointer-events-none absolute h-2 w-2 rounded-full ${
                i % 2 === 0 ? "bg-accent-animate" : "bg-ink/70"
              }`}
              aria-hidden="true"
            />
          ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Particle burst demo — decorative, not wired to any action"
        className="rounded-pill bg-ink px-5 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-base transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
      >
        Trigger particles
      </button>
    </div>
  );
}
