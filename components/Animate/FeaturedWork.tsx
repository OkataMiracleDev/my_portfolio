"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CredentialsBlock from "./CredentialsBlock";
import PlaygroundMagneticButton from "./Playground/PlaygroundMagneticButton";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { motionProjectsData } from "@/data/motion-projects";

gsap.registerPlugin(ScrollTrigger);

const frameStyles = [
  "md:mt-0 md:rotate-[-2deg] md:scale-105",
  "md:mt-24 md:rotate-[2.5deg]",
  "md:mt-8 md:rotate-[-3deg] md:scale-95",
];

function ProjectFrame({
  project,
  index,
}: {
  project: (typeof motionProjectsData)[number];
  index: number;
}) {
  const frame = index % 3;

  return (
    <Link
      href={project.href}
      className={`featured-work-card group block rounded-[1.6rem] border border-base/80 bg-base p-3 shadow-[0_28px_80px_rgb(0_0_0_/_0.24)] transition-transform duration-300 ease-out hover:-translate-y-2 ${frameStyles[index]}`}
    >
      <div className="overflow-hidden rounded-[1.1rem] bg-ink">
        {frame === 1 ? (
          <div className="rounded-[1.1rem] border-[12px] border-ink bg-base p-3">
            <div className="mb-3 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
            </div>
          </div>
        ) : frame === 2 ? (
          <div className="mx-auto my-3 max-w-[16rem] rounded-[2rem] border-[10px] border-ink bg-base p-2">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[1.35rem]">
              <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
            </div>
          </div>
        ) : (
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src={project.thumbnail} alt={project.title} fill className="object-cover" />
          </div>
        )}
      </div>
      <div className="px-2 py-5">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-ink/45">
          Placeholder reel
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-black text-ink">
          {project.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-pill bg-accent-animate/15 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-ink/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedWork() {
  const featured = motionProjectsData.slice(0, 3);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { revealed } = usePlaygroundReveal();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll(".featured-work-card");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="section bg-band-dark px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.08em] text-base/45">
              Selected motion
            </p>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-black leading-none text-base md:text-7xl">
              Featured <span className="italic">work.</span>
            </h2>
          </div>
          <Link
            href="/animate/projects"
            className="w-fit rounded-pill border border-base/20 px-5 py-2.5 text-sm font-medium text-base/80 transition-colors duration-200 ease-out hover:bg-base/10"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          {featured.map((project, index) => (
            <ProjectFrame key={project.id} project={project} index={index} />
          ))}
        </div>

        <div
          className={`mt-12 flex justify-center transition-all duration-300 ease-out ${
            revealed ? "translate-y-0 opacity-100 delay-150" : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <PlaygroundMagneticButton />
        </div>

        <CredentialsBlock />
      </div>
    </section>
  );
}
