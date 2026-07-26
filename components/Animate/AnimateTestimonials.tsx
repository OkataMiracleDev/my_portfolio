"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { TestimonialContent } from "@/types/content";
import PlaygroundOrbit from "./Playground/PlaygroundOrbit";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";

gsap.registerPlugin(ScrollTrigger);

export default function AnimateTestimonials({ testimonials }: { testimonials: TestimonialContent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { revealed } = usePlaygroundReveal();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const quotes = sectionRef.current.querySelectorAll(".testimonial-quote");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        quotes,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="section relative px-6 md:px-12">
      <div
        className={`absolute left-4 top-10 rotate-12 transition-all duration-500 ease-out md:left-10 ${
          revealed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <PlaygroundOrbit />
      </div>
      <div className="mx-auto max-w-4xl">
        <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-ink/50">
          Word on the street
        </p>
        <h2 className="mb-16 max-w-xl font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-ink md:text-6xl">
          What clients{" "}
          <span className="font-[family-name:var(--font-accent-script)] italic text-accent-animate">
            say.
          </span>
        </h2>

        <div className="space-y-16">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.id}
              className={`testimonial-quote flex flex-col gap-6 md:flex-row md:items-start md:gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse md:text-right" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="shrink-0 font-[family-name:var(--font-cabinet-grotesk)] text-7xl leading-none text-accent-animate/25 md:text-8xl"
              >
                &rdquo;
              </span>
              <div className={i % 2 === 1 ? "md:ml-auto" : ""}>
                <p className="max-w-xl font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-snug text-ink md:text-3xl">
                  {testimonial.quote}
                </p>
                <div
                  className={`mt-6 flex items-center gap-3 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{testimonial.name}</p>
                    <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.06em] text-ink/50">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
