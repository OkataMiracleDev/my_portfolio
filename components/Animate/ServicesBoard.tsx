"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OkataRing from "./brand/OkataRing";
import { Meta } from "./brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE = [
  "Brand animation",
  "UI micro-interactions",
  "Short-form video",
  "Title design",
  "Kinetic type",
  "Explainers",
  "Logo reveals",
  "Product motion",
];

const SERVICES = [
  {
    id: "brand",
    timecode: "00:00:01:00",
    title: "Brand animation",
    description:
      "Logo reveals, brand films, and motion identity systems -- the rules for how a brand moves, not just one video of it moving.",
    deliverables: ["Logo reveal", "Brand film", "Motion guidelines"],
  },
  {
    id: "ui",
    timecode: "00:00:02:00",
    title: "UI micro-interactions",
    description:
      "The small moments that make software feel considered. A button that answers you. A transition that explains where you went.",
    deliverables: ["Prototypes", "Lottie / GSAP handoff", "Spec sheets"],
  },
  {
    id: "social",
    timecode: "00:00:03:00",
    title: "Short-form & explainer",
    description:
      "Built to survive the first second and earn the next thirty. Hooks, kinetic type, captions, and cutdowns per platform.",
    deliverables: ["Reels / TikTok", "Explainers", "Ad cutdowns"],
  },
];

function MarqueeRow() {
  return (
    <>
      {MARQUEE.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-8 pr-8">
          <span className="font-[family-name:var(--font-cabinet-grotesk)] text-xl font-bold tracking-tight text-ink/85 md:text-3xl">
            {item}
          </span>
          <OkataRing
            className="h-4 w-4 shrink-0 md:h-5 md:w-5"
            ringColor="var(--color-accent-animate)"
            badgeColor="var(--color-signal)"
            strokeWidth={13}
          />
        </span>
      ))}
    </>
  );
}

export default function ServicesBoard() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-row",
        { y: 44, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".services-list", start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef}>
      {/* Full-bleed marquee. The track holds two identical runs and travels
          exactly -50%, so the second run lands where the first started and the
          seam never shows. Duplicate is hidden from assistive tech. */}
      <div className="okata-marquee relative overflow-hidden border-y border-ink/10 py-5 md:py-7">
        <div className="okata-marquee-track flex w-max items-center">
          <div className="flex items-center">
            <MarqueeRow />
          </div>
          <div className="flex items-center" aria-hidden="true">
            <MarqueeRow />
          </div>
        </div>
        {/* Feathered edges so items enter and leave rather than getting
            guillotined at the viewport border. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base to-transparent md:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base to-transparent md:w-32" />
      </div>

      <div className="section px-6 md:px-12">
        <div className="mx-auto max-w-[84rem]">
          <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <Meta className="mb-5 block text-ink/40">Job sheet</Meta>
              <h2 className="max-w-2xl font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
                Three things,
                <br />
                done properly<span className="text-signal">.</span>
              </h2>
            </div>
            <p className="max-w-xs text-ink/55 md:text-right">
              I&apos;d rather be the obvious choice for three things than a
              maybe for twelve.
            </p>
          </div>

          <div className="services-list border-t border-ink/10">
            {SERVICES.map((service) => (
              <article
                key={service.id}
                className="services-row group relative grid grid-cols-1 gap-5 border-b border-ink/10 py-10 md:grid-cols-12 md:gap-8 md:py-14"
              >
                {/* Hover wash. Sits behind the content, scales from the row's
                    left edge, and is gated to real pointers so a tap on mobile
                    does not leave it stuck on. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-4 -inset-y-px hidden origin-left scale-x-0 rounded-2xl bg-ink/[0.035] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)and(pointer:fine)]:block [@media(hover:hover)and(pointer:fine)]:group-hover:scale-x-100"
                />

                <div className="relative md:col-span-3">
                  <Meta className="text-accent-animate">{service.timecode}</Meta>
                </div>

                <h3 className="relative font-[family-name:var(--font-cabinet-grotesk)] text-3xl font-bold leading-[0.95] tracking-tight text-ink md:col-span-4 md:text-4xl">
                  {service.title}
                </h3>

                <div className="relative md:col-span-5">
                  <p className="max-w-md leading-relaxed text-ink/55">
                    {service.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="rounded-pill border border-ink/10 px-3 py-1 font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
