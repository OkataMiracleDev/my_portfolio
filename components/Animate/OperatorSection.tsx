"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OkataRing from "./brand/OkataRing";
import { Meta, Tally } from "./brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * COPY REVIEW: every sentence in PARAGRAPHS below is first-person and written
 * on Miracle's behalf from what the repo already asserts (Lagos, the dual
 * motion + frontend practice, the tool list on the motion projects). None of it
 * claims a client, a number, or a year that is not already published elsewhere
 * on this site -- but it is still someone else's voice putting words in their
 * mouth, so it is grouped here rather than scattered through the markup, to be
 * read once and edited in one place.
 */
const PARAGRAPHS = [
  "I got into motion because a logo reveal made me feel something, and I wanted to know how. That is still the whole job: figure out what a thing should make someone feel, then build the seconds that do it.",
  "I also write the code. Most motion people hand off a file and hope; I can take an animation all the way into the browser myself, which means I design things that are actually buildable and then go build them.",
];

const TOOLS = [
  "After Effects",
  "GSAP",
  "Premiere Pro",
  "Figma",
  "Illustrator",
  "Blender",
];

export default function OperatorSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".operator-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="section px-6 md:px-12">
      <div className="mx-auto grid max-w-[84rem] gap-14 lg:grid-cols-12 lg:items-center lg:gap-20">
        {/* Portrait. Deliberately the one warm, hand-drawn object on an
            otherwise machined route -- the violet ground is left exactly as
            drawn rather than recoloured to match the palette, because the
            point of it is that it is not system furniture. */}
        <div className="operator-reveal relative lg:col-span-5">
          <div
            className="pointer-events-none absolute -inset-8 rounded-full bg-accent-animate opacity-20 blur-[90px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-sm rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 lg:mx-0 lg:max-w-none">
            <div className="relative aspect-square overflow-hidden rounded-[calc(2rem-0.375rem)]">
              <Image
                src="/images/Miracle_Okata.jpg"
                alt="Miracle Okata"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                quality={90}
                className="object-cover"
              />
            </div>

            {/* The mark, hooked over the corner of the frame the way a sticker
                sits half on and half off a laptop lid. */}
            <OkataRing
              className="absolute -bottom-7 -right-5 h-20 w-20 md:h-24 md:w-24"
              ringColor="var(--color-ink)"
              badgeColor="var(--color-signal)"
              badgeInk="var(--color-stage)"
              showGlyph
              strokeWidth={10}
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <Meta className="operator-reveal mb-5 block text-ink/40">
            Behind the camera
          </Meta>

          <h2 className="operator-reveal font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink">
            One person,
            <br />
            both halves<span className="text-signal">.</span>
          </h2>

          <div className="mt-8 space-y-5">
            {PARAGRAPHS.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="operator-reveal max-w-xl text-lg leading-relaxed text-ink/60"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="operator-reveal mt-10">
            <Meta className="mb-4 block text-ink/35">Tools I actually open</Meta>
            <ul className="flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="rounded-pill border border-ink/10 bg-frame/40 px-3.5 py-1.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/50"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div className="operator-reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Tally className="text-ink/45">Lagos, Nigeria &mdash; working anywhere</Tally>
            <Link
              href="/build"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 underline decoration-ink/20 underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink/50"
            >
              <span>See the code half</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
