"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function PlaygroundToggle() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label="Demo toggle - for fun, no data is saved"
      onClick={() => setChecked((current) => !current)}
      className={`relative h-8 w-14 shrink-0 overflow-hidden rounded-pill border transition-colors duration-200 ease-out ${
        checked ? "border-transparent bg-accent-animate" : "border-ink/10 bg-ink/10"
      }`}
    >
      <motion.span
        animate={{ x: checked ? 26 : 3 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
        className="absolute top-1 left-0 h-6 w-6 rounded-full bg-base shadow-[0_1px_3px_rgb(0_0_0_/_0.35)]"
      />
    </button>
  );
}
