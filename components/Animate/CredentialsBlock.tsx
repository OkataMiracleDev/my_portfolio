"use client";

import PlaygroundColorDial from "./Playground/PlaygroundColorDial";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

const credentials = [
  // Placeholder-honest figures for the motion route until real numbers are supplied.
  { label: "Years creating", value: "2+" },
  { label: "Projects shipped", value: "12+" },
  { label: "Tools mastered", value: "6" },
  { label: "Resource drops", value: "3" },
];

export default function CredentialsBlock() {
  const { revealed } = usePlaygroundReveal();

  return (
    <div className="mt-20 border-t border-base/15 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-none text-base md:text-7xl">
          Bragging{" "}
          <span className="font-[family-name:var(--font-accent-script)] italic text-accent-animate">
            rights.
          </span>
        </h3>
        <div
          className={`transition-all duration-300 ease-out ${
            revealed ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <PlaygroundColorDial />
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {credentials.map((item) => (
          <div key={item.label} className="border-t border-base/20 pt-5">
            <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-base/45">
              {item.label}
            </p>
            <p className="mt-4 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-base">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
