"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Meta } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Credential {
  label: string;
  value: string;
}

/**
 * Splits "40+" into a countable 40 and a literal "+". Values that do not start
 * with digits ("Lagos, NG") are returned whole and simply never animate.
 */
function parseValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { target: null as number | null, suffix: value };
  return { target: Number(match[1]), suffix: match[2] };
}

export default function SpecSheet({ credentials }: { credentials: Credential[] }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const blockRef = useRef<HTMLDivElement>(null);
  // <dd> has no dedicated interface in lib.dom, so these are plain HTMLElement.
  const valueRefs = useRef<Array<HTMLElement | null>>([]);
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
          scrollTrigger: { trigger: blockRef.current, start: "top 82%", once: true },
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
    <section className="px-6 pb-24 md:px-12 md:pb-36">
      <div ref={blockRef} className="mx-auto max-w-[84rem]">
        <Meta className="mb-8 block text-ink/35">Spec sheet</Meta>

        {/* A readout, not a card grid: hairline rules and big tabular numbers,
            the way a camera body or an edit bay prints its own state. */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-ink/10 md:grid-cols-4">
          {credentials.map((item, i) => (
            <div
              key={item.label}
              className="group bg-base px-5 py-8 transition-colors duration-300 ease-out hover:bg-frame md:px-7 md:py-10"
            >
              <Meta className="text-accent-animate">
                {String(i + 1).padStart(2, "0")}
              </Meta>
              <dd
                ref={(el) => {
                  valueRefs.current[i] = el;
                }}
                className="mt-7 font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.03em] tabular-nums text-ink"
              >
                {item.value}
              </dd>
              <dt className="mt-3 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-ink/40">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
