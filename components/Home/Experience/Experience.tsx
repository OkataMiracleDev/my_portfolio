"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Meta } from "@/components/Shared/brand/Hud";
import type { experienceEntries } from "@/lib/db/schema";

gsap.registerPlugin(ScrollTrigger);

type ExperienceEntry = typeof experienceEntries.$inferSelect;

const Experience = ({ entries }: { entries: ExperienceEntry[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".experience-card");
        if (!cards.length) return;

        const gap = 32;
        const getCardWidth = () => (window.innerWidth > 768 ? 450 : 350);
        const getDeckX = () => window.innerWidth - getCardWidth() - (window.innerWidth > 768 ? 60 : 20);
        const getCenterTarget = () => window.innerWidth / 2 - getCardWidth() / 2;
        const isMobile = () => window.innerWidth < 768;

        gsap.set(cards, {
          position: "absolute",
          left: 0,
          top: "50%",
          yPercent: -50,
          x: getDeckX,
          rotation: (i) => (i % 1 === 0 ? i * 1 : -i * 1),
          zIndex: (i) => cards.length - i,
          transformOrigin: "center center",
          opacity: 1,
        });

        gsap.from(headingRef.current, {
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${cards.length * 700}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              if (isMobile()) {
                const viewportCenter = window.innerWidth / 2;

                cards.forEach((card) => {
                  const cardRect = card.getBoundingClientRect();
                  const cardCenter = cardRect.left + cardRect.width / 2;
                  const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
                  const maxDistance = window.innerWidth / 2;
                  const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);
                  gsap.set(card, { opacity });
                });
              }
            },
          },
        });

        cards.forEach((card, i) => {
          tl.to(
            card,
            {
              x: () => getCenterTarget() - (cards.length - 1 - i) * (getCardWidth() + gap),
              rotation: 0,
              ease: "none",
              duration: 1,
            },
            i * 0.2
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from(".experience-card", {
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        });

        gsap.from(headingRef.current, {
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col bg-base py-16 md:h-screen md:overflow-hidden md:py-0"
    >
      <div className="w-full px-6 md:px-12 md:pt-24">
        <div className="mx-auto max-w-[84rem]">
          <Meta className="mb-5 block text-ink/40">Track record</Meta>
          <h2
            ref={headingRef}
            className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink"
          >
            Where I&apos;ve been<span className="text-signal">.</span>
          </h2>
        </div>
      </div>

      <div
        ref={cardsContainerRef}
        className="mt-10 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:relative md:mt-0 md:block md:flex-1 md:snap-none md:gap-0 md:overflow-visible md:px-0 md:pb-0"
      >
        {entries.map((exp, index) => (
          <div
            key={exp.id}
            className="experience-card w-[80vw] max-w-[350px] shrink-0 snap-center rounded-[1.75rem] border border-ink/10 bg-frame/60 p-8 md:w-[450px] md:max-w-none md:shrink md:snap-align-none"
          >
            <div className="flex items-center justify-between border-b border-ink/10 pb-5">
              <Meta className="text-ink/30">
                {String(index + 1).padStart(2, "0")}
              </Meta>
              <Meta className="text-accent-build">{exp.year}</Meta>
            </div>

            <h3 className="mt-7 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink md:text-3xl">
              {exp.role}
            </h3>
            <p className="mt-2 text-sm font-medium text-accent-build">{exp.company}</p>

            <p className="mt-6 text-sm leading-relaxed text-ink/55">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
