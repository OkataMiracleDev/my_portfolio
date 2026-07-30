"use client";

import { useEffect, useState } from "react";

export default function LandingHero() {
  const [timeLabel, setTimeLabel] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTimeLabel(
        new Intl.DateTimeFormat("en", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-10 md:px-12 md:pb-32">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent-build opacity-[0.1] blur-2xl md:-right-32 md:-top-32 md:h-96 md:w-96 md:opacity-[0.12] md:blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-accent-animate opacity-[0.08] blur-2xl md:-left-32 md:top-1/2 md:bottom-auto md:h-96 md:w-96 md:opacity-[0.1] md:blur-3xl"
        aria-hidden="true"
      />

      <p className="relative mb-6 flex flex-wrap items-center gap-x-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/55">
        <span>Lagos, Nigeria</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">{timeLabel || "--:--"}</span>
        <span aria-hidden="true">·</span>
        <span>Open to work</span>
      </p>

      <h1 className="relative max-w-[18ch] font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.9] tracking-tight text-ink">
        <span className="block">Okata</span>
        <span className="block">
          Miracle{" "}
          <span className="font-[family-name:var(--font-accent-script)] italic text-ink/70">
            makes things.
          </span>
        </span>
      </h1>

      <p className="relative mt-6 max-w-xl text-lg text-ink/70 md:text-xl">
        A frontend developer and a motion designer. Same person, two crafts.
        Pick a lane below.
      </p>
    </section>
  );
}
