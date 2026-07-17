"use client";
import SectionHeading from "@/components/Helper/SectionHeading";
import { homeprojectsData } from "@/data/data";
import React, { useEffect, useRef } from "react";
import ProjectCard from "@/components/Shared/ProjectCard";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomeProjects = () => {
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
        y: 80, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <SectionHeading heading="Here's A Bit of What I've Worked On" />
          <p className="mt-4 text-ink/70">
            Selected projects showcasing my approach to design and development
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {homeprojectsData.map((data) => (
            <ProjectCard
              key={data.id}
              accent="build"
              project={{
                id: String(data.id),
                slug: data.projectID,
                title: data.name,
                description: data.description,
                thumbnail: data.image,
                tags: [],
                href: data.projectID,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center">
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
