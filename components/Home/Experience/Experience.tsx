"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceData } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // gsap.context ensures all animations are properly scoped and cleaned up on unmount
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".experience-card");
      if (!cards.length) return;

      const gap = 32;

      // Use functions for these values so they recalculate if the user resizes the window
      const getCardWidth = () => (window.innerWidth > 768 ? 450 : 350);
      
      // Calculate the starting "Deck" position (far right with some padding)
      const getDeckX = () => window.innerWidth - getCardWidth() - (window.innerWidth > 768 ? 60 : 20);
      
      // Calculate where the exact center of the screen is for the final card
      const getCenterTarget = () => window.innerWidth / 2 - getCardWidth() / 2;

      // Check if mobile
      const isMobile = () => window.innerWidth < 768;

      // 1. Initial State: Stack ALL cards on the right side
      gsap.set(cards, {
        position: "absolute",
        left: 0, // We base movement off 0 and just use x translation
        top: "50%",
        yPercent: -50,
        x: getDeckX,
        // Give them a messy deck look. Odd cards rotate one way, even cards the other
        rotation: (i) => (i % 1 === 0 ? i * 1 : -i * 1), 
        // The first card to leave (index 0) needs to be on top of the deck
        zIndex: (i) => cards.length - i, 
        transformOrigin: "center center",
        opacity: 1,
      });

      // 2. Heading entrance animation
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // 3. Create the Main Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // The scroll distance depends on how many cards there are
          end: () => `+=${cards.length * 700}`, 
          pin: true,
          scrub: 1, // Smooth scrubbing
          invalidateOnRefresh: true, // Recalculates x values on window resize
          onUpdate: () => {
            // Only apply opacity effect on mobile
            if (isMobile()) {
              const viewportCenter = window.innerWidth / 2;
              
              cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                
                // Calculate distance from viewport center
                const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
                const maxDistance = window.innerWidth / 2;
                
                // Calculate opacity based on distance (center = 1, edges = 0.3)
                const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);
                
                // Use set instead of to for immediate updates during scrub
                gsap.set(card, { opacity });
              });
            }
          },
        },
      });

      // 4. Animate each card to its final spread position
      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            // Calculate final position: Last card goes to center, previous cards go further left
            x: () => getCenterTarget() - (cards.length - 1 - i) * (getCardWidth() + gap),
            rotation: 0, // Straighten out as it leaves the deck
            ease: "none",
            duration: 1, // Uniform duration...
          },
          i * 0.2 // ...but stagger their start times so they peel off the deck one by one
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="w-full pt-20">
        <h2
          ref={headingRef}
          className="heading-2 text-center px-6"
        >
          Work Experience
        </h2>
      </div>

      {/* Notice the flex classes are gone. 
        This is now just a full-width/height relative container holding absolute cards.
      */}
      <div 
        ref={cardsContainerRef} 
        className="relative flex-1 w-full"
      >
        {experienceData.map((exp, index) => (
          <div
            key={exp.id}
            className="experience-card card p-8 w-[350px] md:w-[450px]"
            // Removing flex-shrink-0 because it's no longer in a flex container
          >
            {/* Card number */}
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-full font-mono text-sm font-bold mb-6"
              style={{
                background: "oklch(0.65 0.25 285)",
                color: "oklch(1 0 0)",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            {/* Year badge */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-accent)" }}
              />
              <span
                className="font-mono text-sm font-semibold"
                style={{ color: "var(--color-accent-bright)" }}
              >
                {exp.year}
              </span>
            </div>

            {/* Role and Company */}
            <h3 className="heading-3 mb-2">{exp.role}</h3>
            <p
              className="font-semibold mb-6"
              style={{ color: "var(--color-accent-bright)" }}
            >
              {exp.company}
            </p>

            {/* Description */}
            <p className="body text-sm mb-6">{exp.description}</p>

            {/* Technologies */}
            {/* <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-mono font-medium"
                  style={{
                    background: "oklch(0.65 0.25 285 / 0.2)",
                    color: "var(--color-accent-bright)",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div> */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;