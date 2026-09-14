"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import OkataRing from "@/components/Shared/brand/OkataRing";
import { Meta, Tally } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * The /build counterpart to /animate's OperatorSection -- same layout, same
 * portrait, same "here is the person" job.
 *
 * The three impact entries below are the original copy, moved out of the markup
 * and into data so the section can lay them out as a record rather than as
 * three hand-written bullet divs. Every claim is the one that was already
 * published here; none were added.
 */
const IMPACT = [
  {
    id: "traffic",
    label: "Traffic & conversion",
    client: "Synapse Academy",
    body: "Rescued and rebuilt a critical waitlist, driving traffic from 1-10 visits to 1,000-3,000 per day through SEO optimization and backend improvements.",
    metric: "3,000",
    metricLabel: "visits / day",
  },
  {
    id: "ux",
    label: "Seamless UX",
    client: "Nkechi Evangelical Ministry",
    body: "Engineered a live-streaming system enabling global followers to watch services directly on-site, without third-party software.",
    metric: "0",
    metricLabel: "third-party deps",
  },
  {
    id: "scale",
    label: "Scale & infrastructure",
    client: "UniHub",
    body: "Built and shipped an event-discovery platform now running across 50+ university campuses in Nigeria, with Redis-backed caching keeping RSVPs and profile browsing fast under real load, and Paystack handling live ticket sales for organizers.",
    metric: "50+",
    metricLabel: "campuses",
  },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: sectionRef.current, start: "top 72%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="about" className="section scroll-mt-24 px-6 md:px-12">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-20">
          {/* Same portrait, same framing, same ring hooked over the corner as
              /animate -- crossing between routes should feel like meeting the
              same person twice, not two different studios. */}
          <div className="about-reveal relative lg:col-span-5">
            <div
              className="pointer-events-none absolute -inset-8 rounded-full bg-accent-build opacity-20 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-sm rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 lg:mx-0 lg:max-w-none">
              <div className="relative aspect-square overflow-hidden rounded-[calc(2rem-0.375rem)]">
                <Image
                  src="/images/Miracle_Okata.jpg"
                  alt="Miracle Okata"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  quality={90}
                  className="object-cover"
                />
              </div>
              <OkataRing className="absolute -bottom-7 -right-5 h-20 w-20 md:h-24 md:w-24" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <Meta className="about-reveal mb-5 block text-ink/40">Who is writing this</Meta>

            <h2 className="about-reveal font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.4rem,6vw,4.75rem)] font-bold leading-[0.9] tracking-[-0.03em] text-ink">
              Full ownership,
              <br />
              concept to deploy<span className="text-signal">.</span>
            </h2>

            <p className="about-reveal mt-8 max-w-xl text-lg leading-relaxed text-ink/60">
              I&apos;m a frontend developer specialising in intuitive, creative,
              responsive interfaces, with over two years of intensive
              experience. I take projects end to end &mdash; concept through
              deployment &mdash; rather than handing off halfway.
            </p>

            <p className="about-reveal mt-5 max-w-xl leading-relaxed text-ink/50">
              I work through creative problem-solving and efficient delivery.
              React, Next.js, TypeScript and GSAP are the day-to-day; AI
              integration and mobile-first application development are where
              I&apos;m heading next.
            </p>

            <div className="about-reveal mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Tally tone="accent" className="text-ink/45">
                Lagos, Nigeria &mdash; working anywhere
              </Tally>
              <Link
                href="/animate"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 underline decoration-ink/20 underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink/50"
              >
                <span>See the motion half</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Proven impact, as a record rather than a bullet list. */}
        <div className="mt-24 md:mt-32">
          <Meta className="about-reveal mb-8 block text-ink/35">Proven impact</Meta>
          <ol className="border-t border-ink/10">
            {IMPACT.map((entry) => (
              <li
                key={entry.id}
                className="about-reveal grid grid-cols-1 gap-5 border-b border-ink/10 py-9 md:grid-cols-12 md:gap-8 md:py-12"
              >
                <div className="md:col-span-3">
                  <Meta className="text-accent-build">{entry.label}</Meta>
                  <p className="mt-2 text-sm font-medium text-ink">{entry.client}</p>
                </div>

                <p className="max-w-xl leading-relaxed text-ink/55 md:col-span-6">
                  {entry.body}
                </p>

                <div className="md:col-span-3 md:text-right">
                  <p className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-none tracking-[-0.03em] tabular-nums text-ink md:text-5xl">
                    {entry.metric}
                  </p>
                  <Meta className="mt-2 block text-ink/35">{entry.metricLabel}</Meta>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
