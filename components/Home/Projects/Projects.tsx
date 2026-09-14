"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WorkCard from "@/components/Shared/WorkCard";
import { Meta } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { devProjects } from "@/lib/db/schema";

type DevProject = typeof devProjects.$inferSelect;

/** Travel speed along the arc, in CSS pixels per second. Calm, not urgent. */
const SPEED = 70;
/** How far the ends of the arc dip below its apex, in pixels. */
const ARC_DEPTH_DESKTOP = 78;
const ARC_DEPTH_MOBILE = 34;
/** Cards lean outward as they descend, like objects on a turntable. */
const MAX_TILT = 4.5;

/**
 * Live work, travelling along a shallow arc.
 *
 * The previous version was a static scroll-snap rail, which was honest but
 * inert. This moves the cards continuously along a curve -- up to an apex in
 * the middle, down and away at both ends -- so the section reads as something
 * running rather than something parked.
 *
 * Why JavaScript and not CSS keyframes: the arc has to be computed from the
 * container's actual width and the card's actual width, both of which change
 * with the viewport. A keyframe path would need hardcoded pixel coordinates
 * (CSS `offset-path: path()` takes absolute units) and would be wrong at every
 * size but the one it was authored for. The loop below is one rAF writing N
 * transform strings -- N is the number of projects, so single digits -- and it
 * writes full `transform` strings rather than individual properties so the
 * compositor handles them.
 *
 * It stops when: the pointer is over it, anything inside it has focus, the tab
 * is hidden, or the visitor prefers reduced motion. Under reduced motion the
 * whole mechanism is skipped and the original scroll-snap rail renders instead,
 * which is the honest fallback -- not a frozen version of a moving thing.
 */
export default function Projects({ projects }: { projects: DevProject[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLLIElement | null>>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Held in a ref as well so the rAF loop can read the latest value without
  // being torn down and rebuilt on every pause toggle.
  const runningRef = useRef(true);
  runningRef.current = !paused && !hovered;

  const total = projects.length;

  const registerCard = useCallback(
    (index: number) => (node: HTMLLIElement | null) => {
      cardRefs.current[index] = node;
    },
    []
  );

  useEffect(() => {
    if (prefersReducedMotion || total === 0) return;
    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;
    let last = performance.now();
    // Distance travelled so far, in pixels, modulo the span.
    let travelled = 0;

    let span = 0;
    let cardWidth = 0;
    let arcDepth = ARC_DEPTH_DESKTOP;

    const measure = () => {
      const stageWidth = stage.clientWidth;
      cardWidth = cardRefs.current[0]?.offsetWidth ?? 320;
      arcDepth = window.innerWidth < 768 ? ARC_DEPTH_MOBILE : ARC_DEPTH_DESKTOP;
      // Wide enough that a card fully clears the viewport before it wraps, and
      // wide enough that N cards never crowd into each other.
      span = Math.max(stageWidth + cardWidth * 1.4, total * cardWidth * 1.18);
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(stage);

    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;

      if (runningRef.current) {
        travelled = (travelled + SPEED * delta) % span;
      }

      for (let i = 0; i < total; i += 1) {
        const node = cardRefs.current[i];
        if (!node) continue;

        // phase 0 = entering at the right, 1 = fully exited at the left.
        const phase = ((travelled / span + i / total) % 1 + 1) % 1;
        const x = span / 2 - phase * span;
        // -1 at the right end, 0 at the apex, +1 at the left end.
        const d = (phase - 0.5) * 2;
        const curve = d * d;

        const y = arcDepth * curve;
        const scale = 1 - 0.16 * curve;
        const tilt = -d * MAX_TILT;
        // Opaque across the middle; only the last stretch at each end fades,
        // so cards arrive and leave rather than blinking in and out.
        const edge = Math.abs(d);
        const opacity = edge < 0.8 ? 1 : Math.max(0, (1 - edge) / 0.2);

        node.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        node.style.opacity = opacity.toFixed(3);
        // Cards nearer the apex sit in front of the ones falling away.
        node.style.zIndex = String(Math.round((1 - curve) * 100));
      }

      frame = requestAnimationFrame(tick);
    };

    const handleVisibility = () => {
      cancelAnimationFrame(frame);
      if (document.visibilityState === "visible") {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", handleVisibility);
      resizeObserver.disconnect();
    };
  }, [prefersReducedMotion, total]);

  if (total === 0) return null;

  const header = (
    <div className="mx-auto max-w-[84rem] px-6 md:px-12">
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <Meta className="mb-5 flex flex-wrap items-center gap-3 text-ink/40">
            <span>Live links</span>
            <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
            <span>{String(total).padStart(2, "0")} shipped</span>
            {!prefersReducedMotion && (
              <>
                <span aria-hidden="true" className="h-px w-10 bg-ink/20" />
                {/* WCAG 2.2.2: anything that moves on its own for more than
                    five seconds needs a way to stop it that does not depend on
                    hovering. */}
                <button
                  type="button"
                  onClick={() => setPaused((current) => !current)}
                  aria-pressed={paused}
                  className="rounded-pill border border-ink/15 px-2.5 py-0.5 text-[0.6875rem] uppercase tracking-[0.18em] text-ink/45 transition-colors duration-200 ease-out hover:border-ink/35 hover:text-ink"
                >
                  {paused ? "Play" : "Pause"}
                </button>
              </>
            )}
          </Meta>
          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
            In production<span className="text-signal">.</span>
          </h2>
        </div>
        <p className="max-w-xs text-ink/55 md:text-right">
          Not mockups. Real sites with real users, open in a new tab.
        </p>
      </div>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <section className="section overflow-hidden">
        {header}
        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:px-12 [scrollbar-width:thin]">
          {projects.map((project, i) => (
            <li
              key={project.id}
              className="w-[78vw] max-w-sm shrink-0 snap-start sm:w-[45vw] lg:w-[28rem]"
            >
              <WorkCard
                href={project.link ?? "#"}
                image={project.image}
                title={project.name}
                description={project.description}
                index={i}
                eyebrow="Live"
                tags={project.technology}
                accent="build"
                external
              />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="section overflow-hidden">
      {header}

      <div
        ref={stageRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        // Focus inside the stage stops it too, so a keyboard user is never
        // chasing a link that is sliding away from them.
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={() => setHovered(false)}
        className="relative mx-auto h-[30rem] w-full max-w-[110rem] md:h-[34rem]"
      >
        <ul className="absolute inset-0">
          {projects.map((project, i) => (
            <li
              key={project.id}
              ref={registerCard(i)}
              // Positioned from the stage's centre; the loop supplies the
              // horizontal offset, so left-1/2 plus -ml-[half] centres it.
              //
              // The inline transform is the pre-hydration pose. Without it
              // every card renders stacked on the same point until the first
              // animation frame lands, which on a slow connection is a visible
              // pile of cards sitting on top of each other. Percentages here
              // are relative to the card's own width, so this approximates the
              // arc's spacing without needing to know the container size --
              // the rAF loop overwrites it on its first tick.
              style={{
                willChange: "transform, opacity",
                transform: `translate3d(${((i - (total - 1) / 2) * 118).toFixed(1)}%, ${(
                  ARC_DEPTH_DESKTOP *
                  ((i - (total - 1) / 2) / Math.max(1, (total - 1) / 2)) ** 2
                ).toFixed(1)}px, 0)`,
              }}
              className="absolute left-1/2 top-0 -ml-[9rem] w-[18rem] sm:-ml-[11rem] sm:w-[22rem] lg:-ml-[14rem] lg:w-[28rem]"
            >
              <WorkCard
                href={project.link ?? "#"}
                image={project.image}
                title={project.name}
                description={project.description}
                index={i}
                eyebrow="Live"
                tags={project.technology}
                accent="build"
                external
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
