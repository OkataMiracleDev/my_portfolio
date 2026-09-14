"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkCard from "@/components/Shared/WorkCard";
import { Meta } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { devProjects } from "@/lib/db/schema";

gsap.registerPlugin(ScrollTrigger);

type DevProject = typeof devProjects.$inferSelect;

/**
 * Things you can go and click right now, as a horizontal rail.
 *
 * This used to be a react-multi-carousel that autoplayed every 4 seconds. Two
 * problems with that: it moved the target while people were reaching for it,
 * and it cost a third-party library plus its stylesheet for behaviour that CSS
 * scroll-snap does natively. The rail below is a plain overflow-x container --
 * it works without JavaScript, it is keyboard scrollable, it respects the OS
 * scrollbar, and on touch it uses the platform's own momentum rather than an
 * imitation of it.
 */
export default function Projects({ projects }: { projects: DevProject[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".live-card",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (projects.length === 0) return null;

  return (
    <section ref={sectionRef} className="section overflow-hidden">
      <div className="mx-auto max-w-[84rem] px-6 md:px-12">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <Meta className="mb-5 flex items-center gap-3 text-ink/40">
              <span>Live links</span>
              <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
              <span>{String(projects.length).padStart(2, "0")} shipped</span>
            </Meta>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
              In production<span className="text-signal">.</span>
            </h2>
          </div>
          <p className="max-w-xs text-ink/55 md:text-right">
            Not mockups. Real sites with real users, open in a new tab.
          </p>
        </div>
      </div>

      {/* Bleeds off the right edge so it reads as continuing past the viewport
          rather than as a grid that happens to be short. */}
      <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-12 [scrollbar-width:thin]">
        {projects.map((project, i) => (
          <li
            key={project.id}
            className="live-card w-[78vw] max-w-sm shrink-0 snap-start sm:w-[45vw] lg:w-[28rem]"
          >
            <WorkCard
              href={project.link ?? "#"}
              image={project.image}
              title={project.name}
              description={project.description}
              index={i}
              eyebrow="Live"
              tags={project.technology}
              accent="build"
              external
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
