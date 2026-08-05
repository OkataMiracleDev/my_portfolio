"use client";

import { motion, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PlaygroundTiltCard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rotateX = useSpring(0, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * 24);
    rotateX.set(relY * -24);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: 600 }} className="h-20 w-32 shrink-0">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border border-ink/10 bg-base-raised shadow-[0_16px_36px_rgb(0_0_0_/_0.12)]"
        role="img"
        aria-label="Tilt card demo — decorative, not wired to any action"
      >
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6rem] uppercase tracking-[0.1em] text-ink/50">
          tilt
        </span>
        <span className="text-lg text-accent-animate">
          hi
        </span>
      </motion.div>
    </div>
  );
}
