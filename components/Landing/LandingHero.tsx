"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const MIMI_TEXT = "Mimi";
const STUDIOS_TEXT = "Studios ";
const MEANS_TEXT = "does motion.";
const HEADING_LENGTH = MIMI_TEXT.length + STUDIOS_TEXT.length + MEANS_TEXT.length;

function useTypewriter(length: number, enabled: boolean, speed = 45, startDelay = 300) {
  const [revealed, setRevealed] = useState(enabled ? 0 : length);

  useEffect(() => {
    if (!enabled) {
      setRevealed(length);
      return;
    }

    let timeoutId: number;
    let count = 0;

    timeoutId = window.setTimeout(function tick() {
      count += 1;
      setRevealed(count);
      if (count < length) {
        timeoutId = window.setTimeout(tick, speed);
      }
    }, startDelay);

    return () => window.clearTimeout(timeoutId);
  }, [length, enabled, speed, startDelay]);

  return revealed;
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-[0.8em] w-[0.06em] translate-y-[0.08em] animate-pulse bg-current align-middle"
    />
  );
}

export default function LandingHero() {
  const [timeLabel, setTimeLabel] = useState("");
  const prefersReducedMotion = usePrefersReducedMotion();
  const revealed = useTypewriter(HEADING_LENGTH, !prefersReducedMotion);

  const mimiVisible = MIMI_TEXT.slice(0, Math.min(MIMI_TEXT.length, revealed));
  const afterMimi = Math.max(0, revealed - MIMI_TEXT.length);
  const studiosVisible = STUDIOS_TEXT.slice(0, Math.min(STUDIOS_TEXT.length, afterMimi));
  const afterStudios = Math.max(0, afterMimi - STUDIOS_TEXT.length);
  const meansVisible = MEANS_TEXT.slice(0, Math.min(MEANS_TEXT.length, afterStudios));

  const mimiTyping = revealed > 0 && revealed <= MIMI_TEXT.length;
  const studiosTyping = afterMimi > 0 && afterMimi <= STUDIOS_TEXT.length;
  const meansTyping = afterStudios > 0 && afterStudios <= MEANS_TEXT.length;

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
        <span>PH, Nigeria</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">{timeLabel || "--:--"}</span>
        <span aria-hidden="true">·</span>
        <span>Open to work</span>
      </p>

      <h1
        className="relative max-w-[18ch] font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3rem,9vw,7.5rem)] font-bold leading-[0.9] tracking-tight text-ink"
        aria-label={`${MIMI_TEXT} ${STUDIOS_TEXT}${MEANS_TEXT}`}
      >
        <span aria-hidden="true">
          <span className="block">
            {mimiVisible}
            {mimiTyping && <Caret />}
          </span>
          <span className="block">
            {studiosVisible}
            {studiosTyping && <Caret />}
            <span className="text-accent-build">
              {meansVisible}
              {meansTyping && <Caret />}
            </span>
          </span>
        </span>
      </h1>

      <p className="relative mt-6 max-w-xl text-lg text-ink/70 md:text-xl">
        Frontend development and motion design, built on intention, not decoration.
        Pick a lane below.
      </p>
    </section>
  );
}
