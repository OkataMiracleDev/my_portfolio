"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import OkataRing from "./brand/OkataRing";
import Timecode from "./brand/Timecode";
import { Meta, Tally } from "./brand/Hud";
import PlaygroundToggleButton from "./Playground/PlaygroundToggleButton";

/**
 * The headline is three masked lines that wipe up on load. Each line's inner
 * span carries the animation; the parent clips it. Delays are staggered 90ms
 * apart -- long enough to read as a cascade, short enough that the whole
 * headline has landed before a visitor could have started reading it.
 */
const HEADLINE = ["Motion", "that means", "something."];

export default function AnimateHero() {
  const [lagosTime, setLagosTime] = useState("");

  useEffect(() => {
    // Rendered only after mount: the server has no idea what time it is in
    // Lagos relative to the visitor, and formatting on both sides would
    // guarantee a hydration mismatch.
    const update = () => {
      setLagosTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Africa/Lagos",
        }).format(new Date())
      );
    };

    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="okata-stage relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* The mark, enormous and barely lit, turning once every 44 seconds.
          Anchored off the right edge so it reads as a light source behind the
          type rather than as a logo sitting on the page. */}
      <OkataRing
        className="okata-ring-drift pointer-events-none absolute -right-[30%] top-[6%] h-[38rem] w-[38rem] opacity-[0.055] md:-right-[12%] md:h-[52rem] md:w-[52rem]"
        ringColor="var(--color-ink)"
        badgeColor="var(--color-accent-animate)"
        strokeWidth={7}
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-accent-animate opacity-[0.13] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-40 pt-32 md:px-12 md:pb-44">
        <div className="mx-auto w-full max-w-[84rem]">
          <div className="okata-rise mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 md:mb-10">
            <Tally className="text-signal">Rec</Tally>
            <Meta className="text-ink/40">
              Okata Studios &mdash; motion design
            </Meta>
            <Meta className="hidden text-ink/40 sm:inline">Lagos, NG</Meta>
          </div>

          <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(3.4rem,12vw,11rem)] font-bold leading-[0.84] tracking-[-0.035em] text-ink">
            {HEADLINE.map((line, i) => (
              <span key={line} className="okata-line">
                <span style={{ animationDelay: `${i * 90}ms` }}>
                  {i === HEADLINE.length - 1 ? (
                    <>
                      something<span className="text-signal">.</span>
                    </>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end md:gap-8">
            <p
              className="okata-rise max-w-md text-lg leading-relaxed text-ink/60 md:col-span-5"
              style={{ animationDelay: "420ms" }}
            >
              I&apos;m Miracle. I animate brands, interfaces and short-form video
              &mdash; the kind that earns the second the viewer gives it, then
              keeps the next five.
            </p>

            <div
              className="okata-rise flex flex-wrap items-center gap-3 md:col-span-4"
              style={{ animationDelay: "500ms" }}
            >
              <Link
                href="#reel"
                className="group inline-flex items-center gap-2 rounded-pill bg-ink py-1.5 pl-5 pr-1.5 text-sm font-medium text-stage transition-transform duration-200 ease-out active:scale-[0.97]"
              >
                {/* Not "watch the reel" -- this jumps to the featured
                    project, and there is no showreel cut yet to watch. */}
                <span>Watch the latest</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stage/10 transition-transform duration-200 ease-out group-hover:translate-y-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 5v14M12 19l-6-6M12 19l6-6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
              <Link
                href="#contact"
                className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink/75 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
              >
                Start a project
              </Link>
            </div>

            {/* The operator chip. One small, unmistakably human object in an
                otherwise machined frame -- the route's whole personal claim in
                44 by 200 pixels. */}
            <div
              className="okata-rise flex items-center gap-3 md:col-span-3 md:justify-self-end"
              style={{ animationDelay: "580ms" }}
            >
              <span className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/15">
                <Image
                  src="/images/Miracle_Okata.jpg"
                  alt="Miracle Okata"
                  fill
                  sizes="44px"
                  quality={90}
                  className="object-cover"
                  priority
                />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-medium text-ink">Miracle Okata</span>
                <Meta className="text-ink/40">Motion designer</Meta>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slate. The strip a camera writes its state onto -- running timecode,
          frame rate, the operator's local time, and the one genuinely playful
          control on the page. */}
      <div className="relative z-10 border-t border-ink/10 px-6 py-4 md:px-12">
        <div className="mx-auto flex w-full max-w-[84rem] flex-wrap items-center gap-x-6 gap-y-3">
          <Timecode className="font-[family-name:var(--font-jetbrains-mono)] text-[0.6875rem] tracking-[0.14em] text-accent-animate" />
          <Meta className="hidden text-ink/30 sm:inline">24 fps</Meta>
          <Meta className="hidden text-ink/30 md:inline">
            Lagos {lagosTime || "--:--"}
          </Meta>
          <div className="ml-auto">
            <PlaygroundToggleButton />
          </div>
        </div>
      </div>
    </section>
  );
}
