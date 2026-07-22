"use client";

import { usePlaygroundReveal } from "./PlaygroundRevealContext";

export default function PlaygroundToggleButton() {
  const { revealed, toggle } = usePlaygroundReveal();

  return (
    <button
      type="button"
      aria-pressed={revealed}
      onClick={toggle}
      className="rounded-pill bg-nav-dark px-5 py-2.5 font-[family-name:var(--font-jetbrains-mono)] text-xs font-semibold uppercase tracking-[0.08em] text-base transition-transform duration-200 ease-out hover:-rotate-2 hover:scale-105 active:scale-95"
    >
      Poke around
    </button>
  );
}
