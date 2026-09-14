"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoEmbed from "./VideoEmbed";
import OkataRing from "./brand/OkataRing";
import { Meta, Tally } from "./brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { MotionProjectContent } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

/**
 * The showreel, given the whole width of the page.
 *
 * There is no reel on file yet -- every row in the motion_projects table still
 * carries the seeded placeholder thumbnail and a null videoEmbedUrl. Rather
 * than fake a player, the frame falls back to a slate: the state an edit bay
 * actually shows when there is no footage loaded. It is honest about being
 * empty and still looks deliberate, and the moment a real videoEmbedUrl lands
 * on the featured project the player takes the same frame with no code change.
 */
export default function ReelFrame({ featured }: { featured?: MotionProjectContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);

  const embedUrl = featured?.videoEmbedUrl;

  useEffect(() => {
    if (prefersReducedMotion || !frameRef.current) return;

    const ctx = gsap.context(() => {
      // The frame opens up as it enters -- a shutter, not a fade. Transform
      // and opacity only, so this stays on the compositor.
      gsap.fromTo(
        frameRef.current,
        { scale: 0.94, opacity: 0, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="reel"
      // Offsets the fixed nav so an in-page jump to #reel does not park the
      // frame's top edge underneath it.
      className="scroll-mt-28 px-4 pb-20 pt-4 md:px-8 md:pb-28"
    >
      <div className="mx-auto w-full max-w-[96rem]">
        {/* Double bezel: an outer tray with a hairline, and the footage core
            nested inside it with a concentric radius. */}
        <div
          ref={frameRef}
          className="rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 md:p-2"
        >
          <div className="relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage md:rounded-[calc(2rem-0.5rem)]">
            <div className="relative aspect-[16/10] w-full md:aspect-[2.39/1]">
              {embedUrl && playing ? (
                <VideoEmbed embedUrl={embedUrl} title="Okata Studios showreel" />
              ) : (
                <>
                  {featured?.thumbnail && (
                    <Image
                      src={featured.thumbnail}
                      alt=""
                      fill
                      sizes="100vw"
                      quality={80}
                      priority
                      className="scale-105 object-cover opacity-25 blur-[2px]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/70 to-stage/40" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
                    {embedUrl ? (
                      <button
                        type="button"
                        onClick={() => setPlaying(true)}
                        className="group flex flex-col items-center gap-4"
                        aria-label="Play the showreel"
                      >
                        <span className="flex h-20 w-20 items-center justify-center rounded-full border border-ink/20 bg-ink/5 backdrop-blur-sm transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-[0.97] md:h-24 md:w-24">
                          <svg width="22" height="26" viewBox="0 0 22 26" fill="currentColor" className="ml-1 text-ink" aria-hidden="true">
                            <path d="M0 1.6a1 1 0 0 1 1.5-.87l19 11.4a1 1 0 0 1 0 1.74l-19 11.4A1 1 0 0 1 0 24.4V1.6Z" />
                          </svg>
                        </span>
                        <Meta className="text-ink/50">Play showreel</Meta>
                      </button>
                    ) : (
                      <>
                        <OkataRing
                          className="okata-ring-drift h-16 w-16 opacity-70 md:h-20 md:w-20"
                          ringColor="var(--color-ink)"
                          strokeWidth={9}
                        />
                        <div>
                          <p className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold tracking-tight text-ink md:text-4xl">
                            Reel {new Date().getFullYear()} is in the cut
                          </p>
                          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/50">
                            Not posting a placeholder reel. The case studies
                            below are the work in the meantime.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Frame furniture. Hidden once a player takes over so it never
                  covers real controls. */}
              {!(embedUrl && playing) && (
                <>
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 md:px-7 md:py-5">
                    <Tally className="text-signal">Rec</Tally>
                    <Meta className="text-ink/35">2.39 : 1</Meta>
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 md:px-7 md:py-5">
                    <Meta className="text-ink/35">Showreel</Meta>
                    <Meta className="hidden text-ink/35 sm:inline">
                      After Effects &middot; GSAP &middot; Blender
                    </Meta>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
