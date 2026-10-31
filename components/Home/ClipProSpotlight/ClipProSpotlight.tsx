"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FrameTicks, Meta, Tally } from "@/components/Shared/brand/Hud";
import { SourceLink, releaseLine } from "@/components/Shared/ClipPro/ClipProButtons";
import DownloadMenu from "@/components/Shared/ClipPro/DownloadMenu";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CLIPPRO, formatReleaseDate, type ClipProRelease } from "@/lib/clippro";

gsap.registerPlugin(ScrollTrigger);

const POINTS = [
  { label: "Scores", text: "Focus, exposure, motion and sound, every second of every clip." },
  { label: "Local AI", text: "Faces, shot types and searchable transcripts. Nothing is uploaded." },
  { label: "Round-trips", text: "Selects land in Premiere, Resolve, Final Cut or Avid as a timeline." },
  { label: "Updates itself", text: "Signed updates, with the release notes shown before anything installs." },
];

/**
 * The one thing on /build that is software rather than a site: shown straight under the hero,
 * before the live links, because it's the only work here a visitor can take home.
 *
 * Two screens, layered: the focus map in front, the transcript panel behind and offset, so the
 * pair reads as an app with depth rather than a single flat screenshot. On scroll the back
 * screen drifts slower than the front one -- a few dozen pixels, enough to feel layered, not
 * enough to look like a gimmick.
 */
export default function ClipProSpotlight({ releases, unavailable = false }: { releases: ClipProRelease[]; unavailable?: boolean }) {
  const release = releases[0] ?? null;
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".clippro-reveal",
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power4.out", stagger: 0.07, scrollTrigger: { trigger: ".clippro-copy", start: "top 80%" } }
      );
      gsap.fromTo(
        ".clippro-front",
        { y: 70, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ".clippro-stack", start: "top 82%" } }
      );
      gsap.fromTo(".clippro-back", { y: 40 }, { y: -40, ease: "none", scrollTrigger: { trigger: ".clippro-stack", start: "top bottom", end: "bottom top", scrub: true } });
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="clippro" className="relative scroll-mt-24 overflow-hidden px-6 py-24 md:px-12 md:py-36">
      <div
        className="pointer-events-none absolute -right-48 top-1/4 h-[36rem] w-[36rem] rounded-full bg-accent-build opacity-[0.1] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-[84rem] gap-16 md:grid-cols-12 md:items-center md:gap-10">
        <div className="clippro-copy md:col-span-5">
          <div className="clippro-reveal mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Tally tone="accent" className="text-accent-build">
              Free download
            </Tally>
            <Meta className="text-ink/40">{releaseLine(release, formatReleaseDate, unavailable)}</Meta>
          </div>

          <h2 className="clippro-reveal font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
            ClipPro<span className="text-signal">.</span>
          </h2>
          <p className="clippro-reveal mt-6 max-w-md text-xl leading-snug text-ink/85">{CLIPPRO.tagline}</p>
          <p className="clippro-reveal mt-4 max-w-md leading-relaxed text-ink/55">
            A desktop app for editors and shooters. It scores every second of your footage and hands your
            NLE a timeline of only the good parts. Open source, free, built with Rust and Tauri.
          </p>

          <ul className="clippro-reveal mt-9 grid gap-x-8 gap-y-5 border-t border-ink/10 pt-7 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p.label}>
                <Meta className="text-accent-build">{p.label}</Meta>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{p.text}</p>
              </li>
            ))}
          </ul>

          <div className="clippro-reveal mt-10 flex flex-wrap items-center gap-3">
            <DownloadMenu releases={releases} accent="build" />
            <SourceLink />
          </div>
          <div className="clippro-reveal mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={CLIPPRO.pagePath}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 transition-colors duration-200 ease-out hover:text-ink"
            >
              Screens and release notes
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Meta className="text-ink/30">{CLIPPRO.platform}</Meta>
          </div>
        </div>

        <div className="clippro-stack relative md:col-span-7">
          {/* Behind: the transcript screen, offset up and right. */}
          <div
            aria-hidden="true"
            className="clippro-back absolute -right-4 -top-10 hidden w-[78%] rotate-[2.5deg] rounded-[1.75rem] border border-ink/10 bg-frame/80 p-1.5 opacity-60 sm:block md:-right-10 md:-top-14"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-stage">
              <Image src={CLIPPRO.shots[2].src} alt="" fill sizes="40vw" quality={75} className="object-cover object-right-top" />
            </div>
          </div>

          {/* In front: the focus map, framed like the project pages' screens. */}
          <div className="clippro-front relative rounded-[2rem] border border-ink/10 bg-frame p-1.5 shadow-[0_40px_120px_-30px_rgb(0_0_0_/_0.85)] md:p-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage md:rounded-[calc(2rem-0.5rem)]">
              <Image
                src={CLIPPRO.shots[0].src}
                alt={CLIPPRO.shots[0].alt}
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                quality={90}
                className="object-cover"
              />
              <FrameTicks className="m-5" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-stage/80 to-transparent px-5 pb-4 pt-10 md:px-7 md:pb-5">
                <Meta className="text-ink/55">{CLIPPRO.shots[0].label}</Meta>
                <Meta className="text-ink/40">{release ? `ClipPro ${release.version}` : "ClipPro"}</Meta>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
