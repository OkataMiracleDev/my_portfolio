"use client";
import { useState } from "react";

export default function PlaygroundShapeMorph() {
  const [morphed, setMorphed] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        data-testid="morph-shape"
        data-morphed={morphed}
        className={`h-16 w-16 bg-accent-animate transition-all duration-500 ease-in-out ${
          morphed ? "rounded-full rotate-45" : "rounded-lg rotate-0"
        }`}
        aria-hidden="true"
      />
      <button
        onClick={() => setMorphed((m) => !m)}
        className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
      >
        Morph shape
      </button>
    </div>
  );
}
