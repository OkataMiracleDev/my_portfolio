"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CredentialsBlock from "./CredentialsBlock";
import PlaygroundMagneticButton from "./Playground/PlaygroundMagneticButton";
import { usePlaygroundReveal } from "./Playground/PlaygroundRevealContext";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MotionProjectContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

type Project = MotionProjectContent;

const NOISE_TEXTURE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const AUTOPLAY_MS = 6500;

function CornerArrow() {
  return (
    <span className="absolute right-6 top-6 z-20 flex h-10 w-10 -translate-y-2 items-center justify-center rounded-full border border-base/25 bg-ink/40 text-base opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "next" ? "Next project" : "Previous project"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-base/15 text-base/60 transition-all duration-200 ease-out hover:border-base/30 hover:text-base active:scale-95"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className={direction === "prev" ? "rotate-180" : undefined}
      >
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function CarouselSlide({ project }: { project: Project }) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={project.thumbnail}
          alt=""
          fill
          quality={75}
          className="scale-110 object-cover opacity-60 blur-2xl saturate-[1.3]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      </div>

      <div className="relative z-10 grid h-full grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_1.1fr] md:gap-10 md:p-12">
        <div className="flex flex-col justify-end">
          {project.tags[0] && (
            <p className="mb-4 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-accent-animate">
              {project.tags[0]}
            </p>
          )}
          <h3 className="line-clamp-2 max-w-md font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold leading-[0.95] text-base md:text-5xl">
            {project.title}
          </h3>
          <p className="mt-4 line-clamp-3 max-w-sm text-sm leading-relaxed text-base/65 md:text-base">
            {project.description}
          </p>
          <div className="mt-6 hidden flex-wrap gap-2 md:flex">
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

        <div className="relative hidden md:flex md:items-center md:justify-center">
          <div className="relative aspect-[4/3] w-full -rotate-2 overflow-hidden rounded-2xl border border-base/10 shadow-[0_30px_80px_rgb(0_0_0_/_0.45)] transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-[1.02]">
            <Image src={project.thumbnail} alt={project.title} fill quality={90} className="object-cover" />
          </div>
        </div>
      </div>
    </>
  );
}

interface Credential {
  label: string;
  value: string;
}

export default function FeaturedWork({
  projects,
  credentials,
}: {
  projects: Project[];
  credentials: Credential[];
}) {
  const total = projects.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { revealed } = usePlaygroundReveal();

  const active = projects[activeIndex];

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (prefersReducedMotion || isPaused || isDragging || total < 2) return;
    const id = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setActiveIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion, isPaused, isDragging, total]);

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const els = sectionRef.current.querySelectorAll(".featured-work-reveal");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        els,
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

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || total < 2) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      goTo(Math.round(ratio * (total - 1)));
    },
    [goTo, total]
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (total < 2) return;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event.clientX);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromPointer(event.clientX);
  };

  const endDrag = () => setIsDragging(false);

  const handleTrackKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  return (
    <section ref={sectionRef} className="section relative overflow-hidden bg-band-dark px-6 md:px-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_TEXTURE}")` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent-animate opacity-[0.12] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-accent-animate opacity-[0.08] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 flex items-center gap-3 font-[family-name:var(--font-jetbrains-mono)] text-xs uppercase tracking-[0.14em] text-base/45">
              <span>Selected motion</span>
              {total > 0 && (
                <>
                  <span aria-hidden="true" className="h-px w-8 bg-base/20" />
                  <span>{String(total).padStart(2, "0")} reels</span>
                </>
              )}
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

        {active ? (
          <div
            className="featured-work-reveal"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            <Link
              href={active.href}
              className="group relative block h-[30rem] overflow-hidden rounded-[2rem] bg-ink md:h-[38rem]"
            >
              {prefersReducedMotion ? (
                <div className="absolute inset-0">
                  <CarouselSlide project={active} />
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                  >
                    <CarouselSlide project={active} />
                  </motion.div>
                </AnimatePresence>
              )}
              <CornerArrow />
            </Link>

            {total > 1 && (
              <div className="mt-6 flex items-center gap-4">
                <NavButton direction="prev" onClick={() => goTo(activeIndex - 1)} />

                <div
                  ref={trackRef}
                  role="slider"
                  aria-label="Selected project"
                  aria-valuemin={1}
                  aria-valuemax={total}
                  aria-valuenow={activeIndex + 1}
                  tabIndex={0}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onKeyDown={handleTrackKeyDown}
                  className="relative h-6 flex-1 cursor-pointer touch-none outline-none"
                >
                  <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-pill bg-base/15">
                    <motion.div
                      className="h-full rounded-pill bg-accent-animate"
                      animate={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE_IN_OUT }}
                    />
                  </div>
                  <motion.div
                    className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent-animate shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                    animate={{
                      left: `calc(${(activeIndex / Math.max(1, total - 1)) * 100}% - 6px)`,
                      scale: isDragging ? 1.3 : 1,
                    }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE_IN_OUT }}
                  />
                </div>

                <NavButton direction="next" onClick={() => goTo(activeIndex + 1)} />

                <p className="font-[family-name:var(--font-jetbrains-mono)] text-xs tabular-nums text-base/50">
                  {String(activeIndex + 1).padStart(2, "0")}
                  <span className="text-base/25"> / </span>
                  {String(total).padStart(2, "0")}
                </p>
              </div>
            )}
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

        <CredentialsBlock credentials={credentials} />
      </div>
    </section>
  );
}
