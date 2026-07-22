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
      className={`relative h-8 w-14 rounded-pill transition-colors duration-200 ease-out ${
        checked ? "bg-accent-animate" : "bg-ink/15"
      }`}
    >
      <motion.span
        animate={{ x: checked ? 28 : 4 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.35 }}
        className="absolute top-1 h-6 w-6 rounded-full bg-base-raised"
      />
    </button>
  );
}
