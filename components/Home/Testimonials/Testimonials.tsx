"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Meta } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { TestimonialContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * Client quotes, as a grid.
 *
 * This replaces a Swiper card-stack. The stack looked good but showed one quote
 * at a time behind a drag gesture that nothing on the page advertised, so most
 * visitors read quote one and left. A grid shows all of them at once, matches
 * how /animate presents the same content, and drops Swiper (and its two
 * stylesheets) from this route's bundle entirely.
 */
export default function Testimonials({
  testimonials,
}: {
  testimonials: TestimonialContent[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".client-note",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".client-notes", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (testimonials.length === 0) return null;

  return (
    <section ref={sectionRef} className="section px-6 md:px-12">
      <div className="mx-auto max-w-[84rem]">
        <div className="mb-14 md:mb-20">
          <Meta className="mb-5 block text-ink/40">Client notes</Meta>
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
            People I&apos;ve
            <br />
            shipped for<span className="text-signal">.</span>
          </h2>
        </div>

        <ul className="client-notes grid gap-4 md:grid-cols-2 lg:gap-5">
          {testimonials.map((testimonial, i) => (
            <li
              key={testimonial.id}
              className={`client-note ${
                // First note takes the full width and a larger setting, so the
                // grid has an entry point instead of reading as equal boxes.
                i === 0 && testimonials.length > 1 ? "md:col-span-2" : ""
              }`}
            >
              <figure className="flex h-full flex-col justify-between gap-8 rounded-[1.75rem] border border-ink/10 bg-frame/50 p-7 transition-colors duration-300 ease-out hover:border-ink/20 md:p-9">
                <blockquote
                  className={`font-[family-name:var(--font-cabinet-grotesk)] font-bold leading-[1.18] tracking-tight text-ink ${
                    i === 0 && testimonials.length > 1
                      ? "text-2xl md:text-4xl"
                      : "text-xl md:text-2xl"
                  }`}
                >
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3 border-t border-ink/10 pt-6">
                  <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10">
                    <Image
                      src={testimonial.avatar}
                      alt=""
                      fill
                      sizes="40px"
                      quality={75}
                      className="object-cover"
                    />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-medium text-ink">
                      {testimonial.name}
                    </span>
                    {testimonial.role && (
                      <Meta className="text-ink/35">{testimonial.role}</Meta>
                    )}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
