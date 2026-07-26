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
import type { MotionProjectContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type Project = MotionProjectContent;

function LeadProject({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className="featured-work-card group relative block h-full min-h-[26rem] overflow-hidden rounded-[1.75rem] bg-ink md:min-h-[34rem]"
    >
      <Image
        src={project.thumbnail}
        alt={project.title}
        fill
        className="object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-8 md:p-10">
        <p className="mb-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-base/60">
          Placeholder reel
        </p>
        <h3 className="max-w-md font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-base md:text-5xl">
          {project.title}
        </h3>
        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-pill border border-base/25 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-xs text-base/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function PolaroidProject({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className="featured-work-card group block rounded-2xl border border-base/85 bg-base p-3 shadow-[0_24px_60px_rgb(0_0_0_/_0.28)] transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:rotate-0 md:rotate-2"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="px-2 py-4">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/45">
          Placeholder reel
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}

function PhoneFrameProject({ project }: { project: Project }) {
  return (
    <Link
      href={project.href}
      className="featured-work-card group block rounded-2xl border border-base/85 bg-base p-3 shadow-[0_24px_60px_rgb(0_0_0_/_0.28)] transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:rotate-0 md:-rotate-3"
    >
      <div className="mx-auto max-w-[13rem] rounded-[1.75rem] border-[8px] border-ink bg-ink p-1.5">
        <div className="relative aspect-[9/17] overflow-hidden rounded-[1.15rem]">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>
      <div className="px-2 py-4 text-center">
        <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.1em] text-ink/45">
          Placeholder reel
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold text-ink">
          {project.title}
        </h3>
      </div>
    </Link>
  );
}

export default function FeaturedWork({ projects }: { projects: Project[] }) {
  const [lead, second, third] = projects;
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
          stagger: 0.08,
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
    <section ref={sectionRef} className="section bg-band-dark px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-base/45">
              Selected motion
            </p>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-5xl font-bold leading-[0.9] text-base md:text-7xl">
              Featured{" "}
              <span className="font-[family-name:var(--font-accent-script)] italic text-accent-animate">
                work.
              </span>
            </h2>
          </div>
          <Link
            href="/animate/projects"
            className="w-fit rounded-pill border border-base/20 px-5 py-2.5 text-sm font-medium text-base/80 transition-colors duration-200 ease-out hover:bg-base/10"
          >
            View all
          </Link>
        </div>

        {lead && second && third ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
            <LeadProject project={lead} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1">
              <PolaroidProject project={second} />
              <PhoneFrameProject project={third} />
            </div>
          </div>
        ) : (
          <p className="text-base/60">No motion projects published yet.</p>
        )}

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
