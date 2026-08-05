"use client";

import { motion } from "motion/react";

export default function PlaygroundDraggableSticker() {
  return (
    <motion.div
      drag
      dragConstraints={{ top: -60, bottom: 60, left: -80, right: 80 }}
      dragElastic={0.15}
      whileDrag={{ scale: 1.08, rotate: -6 }}
      initial={{ rotate: -10 }}
      className="flex h-24 w-24 shrink-0 cursor-grab select-none flex-col items-center justify-center rounded-full border border-ink/10 bg-base-raised text-center shadow-[0_16px_36px_rgb(0_0_0_/_0.12)] active:cursor-grabbing"
      aria-label="Draggable element — decorative, not wired to any action"
      role="button"
      tabIndex={0}
    >
      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6rem] uppercase leading-tight tracking-[0.08em] text-ink/60">
        drag
      </span>
    </motion.div>
  );
}
