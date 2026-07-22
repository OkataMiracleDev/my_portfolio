"use client";

import { useState } from "react";
import { motion, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function PlaygroundMagneticButton() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [pressed, setPressed] = useState(false);
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      type="button"
      aria-label="Demo magnetic button - for fun, no data is saved"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ x, y }}
      className={`rounded-pill bg-accent-animate px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out ${
        pressed ? "scale-95" : ""
      }`}
    >
      Try me
    </motion.button>
  );
}
