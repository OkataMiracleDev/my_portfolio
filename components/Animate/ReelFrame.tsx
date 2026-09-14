"use client";

import Image from "next/image";
import Link from "next/link";
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
 * The lead frame: whichever project is flagged featuredOnHome, given the full
 * width of the page.
 *
 * This is deliberately NOT labelled a showreel. There is no showreel cut yet,
 * and calling a single client project one would be a lie told in 20px mono to
 * every visitor. It carries the project's own title instead. When a real reel
 * does exist, it becomes another motion_projects row -- flag it featured and it
 * takes this frame with no code change, or give the component its own prop then
 * if the reel should outrank the featured project.
 */
export default function ReelFrame({ featured }: { featured?: MotionProjectContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(false);

  const embedUrl = featured?.videoEmbedUrl;
  const title = featured?.title;

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
                <VideoEmbed embedUrl={embedUrl} title={title ?? "Featured project"} />
              ) : (
                <>
                  {featured?.thumbnail && (
                    <Image
                      src={featured.thumbnail}
                      alt=""
                      fill
                      sizes="100vw"
                      quality={75}
                      priority
                      className="scale-105 object-cover opacity-30 blur-[2px]"
                      aria-hidden="true"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/70 to-stage/40" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center">
                    {featured && embedUrl ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setPlaying(true)}
                          // The accessible name names the actual film, so a
                          // screen-reader user knows what they are about to
                          // start rather than hearing a generic "play".
                          aria-label={`Play ${featured.title}`}
                          className="group flex h-20 w-20 items-center justify-center rounded-full border border-ink/20 bg-ink/5 backdrop-blur-sm transition-transform duration-200 ease-out hover:scale-105 active:scale-[0.97] md:h-24 md:w-24"
                        >
                          <svg
                            width="22"
                            height="26"
                            viewBox="0 0 22 26"
                            fill="currentColor"
                            className="ml-1 text-ink"
                            aria-hidden="true"
                          >
                            <path d="M0 1.6a1 1 0 0 1 1.5-.87l19 11.4a1 1 0 0 1 0 1.74l-19 11.4A1 1 0 0 1 0 24.4V1.6Z" />
                          </svg>
                        </button>

                        <div>
                          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
                            {featured.title}
                          </h2>
                          <Link
                            href={featured.href}
                            className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink/50 underline decoration-ink/20 underline-offset-4 transition-colors duration-200 ease-out hover:text-ink hover:decoration-ink/50"
                          >
                            <span>Read the case study</span>
                            <span aria-hidden="true">&rarr;</span>
                          </Link>
                        </div>
                      </>
                    ) : featured ? (
                      <>
                        <OkataRing
                          className="okata-ring-drift h-14 w-14 opacity-70 md:h-16 md:w-16"
                          ringColor="var(--color-ink)"
                          strokeWidth={9}
                        />
                        <div>
                          <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold leading-tight tracking-tight text-ink md:text-4xl">
                            {featured.title}
                          </h2>
                          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/50">
                            No cut uploaded for this one yet.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <OkataRing
                          className="okata-ring-drift h-14 w-14 opacity-70 md:h-16 md:w-16"
                          ringColor="var(--color-ink)"
                          strokeWidth={9}
                        />
                        <p className="font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold tracking-tight text-ink md:text-3xl">
                          Nothing featured yet
                        </p>
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
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-5 py-4 md:px-7 md:py-5">
                    <Meta className="text-ink/35">Featured</Meta>
                    {/* The real tool list off the project, not a hardcoded one
                        that would quietly start lying the first time a project
                        was made with something else. */}
                    {featured && featured.tools.length > 0 && (
                      <Meta className="hidden truncate text-ink/35 sm:inline">
                        {featured.tools.join(" · ")}
                      </Meta>
                    )}
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
