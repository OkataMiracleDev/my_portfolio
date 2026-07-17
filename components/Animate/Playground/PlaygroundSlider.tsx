"use client";
import { useState } from "react";

export default function PlaygroundSlider() {
  const [value, setValue] = useState(50);

  return (
    <div className="flex items-center gap-4">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Demo slider — for fun, no data is saved"
        className="h-2 flex-1 cursor-pointer appearance-none rounded-pill bg-ink/15 accent-accent-animate"
      />
      <span className="w-8 text-right font-[family-name:var(--font-jetbrains-mono)] text-sm text-ink">
        {value}
      </span>
    </div>
  );
}
