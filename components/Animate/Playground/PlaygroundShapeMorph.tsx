"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function PlaygroundShapeMorph() {
  const [morphed, setMorphed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        data-testid="morph-shape"
        data-morphed={morphed}
        animate={{
          borderRadius: morphed ? "9999px" : "12px",
          rotate: morphed ? 45 : 0,
        }}
        transition={{ type: "spring", duration: 0.6, bounce: 0.25 }}
        className="h-16 w-16 bg-accent-animate"
        aria-hidden="true"
      />
      <button
        type="button"
        onClick={() => setMorphed((current) => !current)}
        className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        Morph shape
      </button>
    </div>
  );
}
