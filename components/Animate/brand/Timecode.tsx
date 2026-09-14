"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const FPS = 24;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function format(elapsedMs: number) {
  const totalFrames = Math.floor((elapsedMs / 1000) * FPS);
  const frames = totalFrames % FPS;
  const totalSeconds = Math.floor(totalFrames / FPS);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
}

/**
 * A 24fps timecode counting from the moment the visitor arrived.
 *
 * The value is written straight to the DOM node from inside the animation
 * frame rather than held in state -- 24 setState calls a second would re-render
 * this subtree 24 times a second for a string that is four digits of noise.
 * The write is skipped when the string has not actually changed, and the loop
 * stops entirely while the tab is hidden.
 *
 * Rendered with tabular-nums and a fixed character count so the surrounding
 * layout never reflows as the digits roll.
 */
export default function Timecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // A counter ticking 24 times a second is exactly the kind of perpetual
    // motion prefers-reduced-motion exists to suppress. Show a static slate.
    if (prefersReducedMotion) {
      node.textContent = "00:00:00:00";
      return;
    }

    const start = performance.now();
    let frame = 0;
    let last = "";

    const tick = () => {
      const next = format(performance.now() - start);
      if (next !== last) {
        node.textContent = next;
        last = next;
      }
      frame = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(frame);
      if (document.visibilityState === "visible") frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [prefersReducedMotion]);

  return (
    <span
      ref={ref}
      // The running count is decoration, not information -- a screen reader
      // announcing it 24 times a second would be unusable.
      aria-hidden="true"
      className={`tabular-nums ${className}`}
    >
      00:00:00:00
    </span>
  );
}
