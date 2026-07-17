"use client";
import { useState } from "react";

export default function PlaygroundToggle() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label="Demo toggle — for fun, no data is saved"
      onClick={() => setChecked((c) => !c)}
      className={`relative h-8 w-14 rounded-pill transition-colors duration-200 ease-out ${
        checked ? "bg-accent-animate" : "bg-ink/15"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-base-raised transition-transform duration-200 ease-out ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}
