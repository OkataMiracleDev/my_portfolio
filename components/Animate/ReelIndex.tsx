"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FrameTicks, Meta } from "./brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MotionProjectContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/**
 * The work, as an edit-bay index: a list of takes on the left, one big frame on
 * the right showing whichever take you are pointing at.
 *
 * This replaces the autoplaying carousel that used to live here. A carousel
 * decides for the visitor and then moves the target while they reach for it;
 * an index lets them scan all of it at once and look closer at whatever caught
 * them. It also degrades honestly -- on mobile there is no room for a sticky
 * preview, so each row simply carries its own frame.
 */
export default function ReelIndex({ projects }: { projects: MotionProjectContent[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const active = projects[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reel-row",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".reel-rows", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-frame px-6 py-24 md:px-12 md:py-36"
    >
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent-animate opacity-[0.09] blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[84rem]">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <Meta className="mb-5 flex items-center gap-3 text-ink/40">
              <span>Selected work</span>
              {projects.length > 0 && (
                <>
                  <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
                  <span>{String(projects.length).padStart(2, "0")} takes</span>
                </>
              )}
            </Meta>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
              The work<span className="text-signal">.</span>
            </h2>
          </div>
          <Link
            href="/animate/projects"
            className="group inline-flex w-fit items-center gap-2 rounded-pill border border-ink/15 py-1.5 pl-5 pr-1.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
          >
            <span>Every project</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/10 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="border-t border-ink/10 py-16 text-ink/50">
            No motion projects published yet.
          </p>
        ) : (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reel-rows border-t border-ink/10 lg:col-span-7">
              {projects.map((project, i) => {
                const isActive = i === activeIndex;
                return (
                  <Link
                    key={project.id}
                    href={project.href}
                    className="reel-row group relative block border-b border-ink/10 py-7 md:py-9"
                    onMouseEnter={() => setActiveIndex(i)}
                    // Focus drives the preview too, so the frame follows a
                    // keyboard user through the list exactly as it follows a
                    // pointer.
                    onFocus={() => setActiveIndex(i)}
                  >
                    <div className="flex items-baseline gap-5 md:gap-7">
                      <Meta
                        className={`shrink-0 transition-colors duration-200 ease-out ${
                          isActive ? "text-signal" : "text-ink/25"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </Meta>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-[1.05] tracking-tight transition-colors duration-200 ease-out md:text-4xl ${
                            isActive ? "text-ink" : "text-ink/55"
                          }`}
                        >
                          {project.title}
                        </h3>

                        {/* Mobile carries its own frame -- there is no room
                            beside the list for a shared one. */}
                        <div className="relative mt-5 aspect-[16/10] w-full overflow-hidden rounded-xl bg-stage lg:hidden">
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            fill
                            sizes="100vw"
                            quality={75}
                            className="object-cover"
                          />
                        </div>

                        <ul className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-pill border border-ink/10 px-2.5 py-0.5 font-[family-name:var(--font-jetbrains-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-ink/40"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <span
                        aria-hidden="true"
                        className={`hidden shrink-0 text-ink/30 transition-transform duration-200 ease-out group-hover:translate-x-1 md:block ${
                          isActive ? "text-ink/60" : ""
                        }`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M7 17L17 7M17 7H9M17 7V15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Sticky preview. Desktop only, and aria-hidden because every
                frame it can show is already reachable as a link in the list
                beside it -- announcing it again is pure duplication. */}
            <div className="hidden lg:col-span-5 lg:block" aria-hidden="true">
              <div className="sticky top-28">
                <div className="rounded-[1.75rem] border border-ink/10 bg-stage/60 p-1.5">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-stage">
                    {prefersReducedMotion ? (
                      <Image
                        src={active.thumbnail}
                        alt=""
                        fill
                        sizes="40vw"
                        quality={75}
                        className="object-cover"
                      />
                    ) : (
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={active.id}
                          className="absolute inset-0"
                          // Blur across the swap. Without it you read two
                          // stacked photographs crossfading; with it the eye
                          // accepts one image transforming into another.
                          initial={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(8px)" }}
                          transition={{ duration: 0.55, ease: EASE_OUT }}
                        >
                          <Image
                            src={active.thumbnail}
                            alt=""
                            fill
                            sizes="40vw"
                            quality={75}
                            className="object-cover"
                          />
                        </motion.div>
                      </AnimatePresence>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-stage/90 via-transparent to-stage/30" />
                    <FrameTicks className="m-4" />

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <Meta className="text-accent-animate">
                        {active.tools.slice(0, 2).join(" / ") || "In progress"}
                      </Meta>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/65">
                        {active.description}
                      </p>
                    </div>

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
                      <Meta className="text-ink/40">
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </Meta>
                      <Meta className="text-ink/40">Preview</Meta>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
