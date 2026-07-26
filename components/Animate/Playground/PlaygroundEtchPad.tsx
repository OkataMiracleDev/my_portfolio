"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Point = { id: number; x: number; y: number };

const MAX_POINTS = 24;
const FADE_MS = 500;

export default function PlaygroundEtchPad() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const padRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const [points, setPoints] = useState<Point[]>([]);

  const addPoint = (clientX: number, clientY: number) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const point: Point = { id: Date.now() + Math.random(), x: clientX - rect.left, y: clientY - rect.top };
    setPoints((current) => [...current.slice(-MAX_POINTS + 1), point]);
    window.setTimeout(() => {
      setPoints((current) => current.filter((p) => p.id !== point.id));
    }, FADE_MS);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    drawingRef.current = true;
    addPoint(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;
    addPoint(e.clientX, e.clientY);
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  return (
    <div
      ref={padRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      role="img"
      aria-label="Doodle pad - for fun, no data is saved"
      className="relative h-14 w-28 shrink-0 touch-none overflow-hidden rounded-xl border border-ink/15 bg-base-raised"
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-[family-name:var(--font-jetbrains-mono)] text-[0.55rem] uppercase tracking-[0.08em] text-ink/30">
        doodle here
      </span>
      <AnimatePresence>
        {points.map((point) => (
          <motion.span
            key={point.id}
            initial={{ opacity: 0.8, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="pointer-events-none absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-animate"
            style={{ left: point.x, top: point.y }}
            aria-hidden="true"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
