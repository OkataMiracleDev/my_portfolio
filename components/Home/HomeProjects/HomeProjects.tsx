"use client";
import SectionHeading from "@/components/Helper/SectionHeading";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { devProjects } from "@/lib/db/schema";

gsap.registerPlugin(ScrollTrigger);

type DevProject = typeof devProjects.$inferSelect;

const HomeProjects = ({ projects }: { projects: DevProject[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 50, opacity: 0, duration: 1, ease: "power4.out",
      });

      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        y: 60, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section px-6">
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-10">
          <SectionHeading heading="Here's A Bit of What I've Worked On" />
          <p className="mt-3 text-ink/70">
            Selected projects showcasing my approach to design and development
          </p>
        </div>

        {/* Picture-book spread: two facing "pages" split by a spine, each a
            small tilted photo + a couple lines of copy, not a full card grid. */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 gap-10 rounded-card bg-base-raised px-6 py-10 md:grid-cols-2 md:gap-0 md:divide-x md:divide-ink/10 md:px-4 md:py-12"
        >
          {projects.map((data, index) => (
            <Link
              key={data.id}
              href={`/build/projects/${data.slug}`}
              className="group flex flex-col items-center px-2 text-center md:px-10"
            >
              <div
                className={`relative h-36 w-36 overflow-hidden rounded-2xl bg-base shadow-[0_8px_24px_rgb(0_0_0_/_0.08)] transition-transform duration-300 ease-out group-hover:scale-[1.04] group-hover:rotate-0 md:h-44 md:w-44 ${
                  index % 2 === 0 ? "-rotate-3" : "rotate-3"
                }`}
              >
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  quality={90}
                  className="object-cover"
                />
              </div>

              <span className="mt-5 font-[family-name:var(--font-jetbrains-mono)] text-xs text-accent-build">
                {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-cabinet-grotesk)] text-lg font-bold text-ink">
                {data.name}
              </h3>
              <p className="mt-2 max-w-xs text-sm text-ink/70 line-clamp-2">
                {data.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-build">
                View Project
                <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/build/projects"
            className="group inline-flex items-center gap-3 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>View All Projects</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProjects;
