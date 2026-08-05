"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Signal blue → ease orange sweep — the dial only ever cycles through the
// brand's own two accents, nothing arbitrary.
const HUES = ["oklch(58% 0.24 264)", "oklch(60% 0.22 300)", "oklch(63% 0.21 340)", "oklch(66% 0.19 35)"];

export default function PlaygroundColorDial() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const dialRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const rotate = useMotionValue(0);
  const springRotate = useSpring(rotate, { stiffness: 200, damping: 20 });
  const [hueIndex, setHueIndex] = useState(0);

  const angleFromCenter = (clientX: number, clientY: number) => {
    const rect = dialRef.current!.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const angle = angleFromCenter(e.clientX, e.clientY);
    rotate.set(angle);
    setHueIndex(Math.floor(((angle + 180) / 360) * HUES.length) % HUES.length);
  };

  const stopDragging = () => {
    draggingRef.current = false;
  };

  return (
    <div className="flex items-center gap-3">
      <div
        ref={dialRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
        role="img"
        aria-label="Color dial demo — decorative, not wired to any action"
        className="relative h-14 w-14 shrink-0 touch-none cursor-grab rounded-full border-2 border-ink/20 bg-band-dark active:cursor-grabbing"
      >
        <motion.div
          style={{ rotate: prefersReducedMotion ? 0 : springRotate }}
          className="absolute inset-0"
        >
          <span className="absolute left-1/2 top-1.5 h-3.5 w-1 -translate-x-1/2 rounded-full bg-ink/50" />
        </motion.div>
      </div>
      <span
        className="h-6 w-6 rounded-full transition-colors duration-200"
        style={{ backgroundColor: HUES[hueIndex] }}
        aria-hidden="true"
      />
    </div>
  );
}
