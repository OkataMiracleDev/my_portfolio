"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkCard from "@/components/Shared/WorkCard";
import { Meta } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { devProjects } from "@/lib/db/schema";

gsap.registerPlugin(ScrollTrigger);

type DevProject = typeof devProjects.$inferSelect;

export default function HomeProjects({ projects }: { projects: DevProject[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-card",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".featured-grid", start: "top 80%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="work"
      // Offsets the fixed nav so the hero's "See the work" jump does not park
      // the heading underneath it.
      className="relative scroll-mt-24 overflow-hidden bg-frame px-6 py-24 md:px-12 md:py-36"
    >
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-accent-build opacity-[0.09] blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[84rem]">
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <Meta className="mb-5 block text-ink/40">Selected work</Meta>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
              What I&apos;ve
              <br />
              actually built<span className="text-signal">.</span>
            </h2>
          </div>
          <Link
            href="/build/projects"
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

        {/* The column count follows the number of featured projects rather
            than always being three. With two projects a fixed three-column
            grid left a whole empty column on desktop, which read as missing
            content instead of as a deliberate two-up. Fewer projects get
            wider cards and more gap, so the row fills either way. */}
        <ul
          className={`featured-grid grid grid-cols-1 ${
            projects.length >= 3
              ? "gap-5 sm:grid-cols-2 lg:grid-cols-3"
              : projects.length === 2
                ? "mx-auto max-w-6xl gap-8 sm:grid-cols-2 lg:gap-10"
                : "mx-auto max-w-2xl"
          }`}
        >
          {projects.map((project, i) => (
            <li key={project.id} className="featured-card">
              <WorkCard
                href={`/build/projects/${project.slug}`}
                image={project.image}
                title={project.name}
                description={project.description}
                index={i}
                eyebrow="Case study"
                tags={project.technology}
                accent="build"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
