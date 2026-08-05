"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PlaygroundColorDial from "./Playground/PlaygroundColorDial";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Credential {
  label: string;
  value: string;
}

function parseValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { target: null as number | null, suffix: value };
  return { target: Number(match[1]), suffix: match[2] };
}

export default function CredentialsBlock({ credentials }: { credentials: Credential[] }) {
  const { revealed } = usePlaygroundReveal();
  const prefersReducedMotion = usePrefersReducedMotion();
  const blockRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const parsed = useMemo(() => credentials.map((item) => parseValue(item.value)), [credentials]);

  useEffect(() => {
    if (!blockRef.current) return;

    const ctx = gsap.context(() => {
      parsed.forEach((item, i) => {
        const el = valueRefs.current[i];
        if (!el || item.target === null) return;

        if (prefersReducedMotion) {
          el.textContent = `${item.target}${item.suffix}`;
          return;
        }

        el.textContent = `0${item.suffix}`;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: item.target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: blockRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${item.suffix}`;
          },
        });
      });
    }, blockRef);

    return () => ctx.revert();
  }, [parsed, prefersReducedMotion]);

  if (credentials.length === 0) return null;

  return (
    <div ref={blockRef} className="featured-work-reveal mt-20 border-t border-ink/15 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-none text-ink md:text-7xl">
          Bragging{" "}
          <span className="text-accent-animate">
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
      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {credentials.map((item, i) => (
          <div
            key={item.label}
            className={`group rounded-card border border-ink/10 bg-base-raised p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent-animate/40 ${
              i % 2 === 0 ? "hover:rotate-[-1deg]" : "hover:rotate-[1deg]"
            }`}
          >
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-animate">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p
              ref={(el) => {
                valueRefs.current[i] = el;
              }}
              className="mt-6 font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink transition-colors duration-300 ease-out group-hover:text-accent-animate md:text-5xl"
            >
              {item.value}
            </p>
            <p className="mt-2 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/45">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
