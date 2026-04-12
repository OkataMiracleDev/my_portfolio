"use client";
import SectionHeading from "@/components/Helper/SectionHeading";
import { homeprojectsData } from "@/data/data";
import React, { useEffect, useRef } from "react";
import ProjectsCard from "./ProjectsCard";
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
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      });

      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
        },
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <SectionHeading heading="Here's A Bit of What I've Worked On" />
          <p className="body mt-4">
            Selected projects showcasing my approach to design and development
          </p>
        </div>

        {/* Projects Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {homeprojectsData.map((data, index) => (
            <div key={data.id}>
              <ProjectsCard projects={data} index={index} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/projects"
            className="btn-secondary group inline-flex items-center gap-3"
          >
            <span>View All Projects</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProjects;
