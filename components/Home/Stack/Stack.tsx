"use client";

import { useEffect, useRef, useState } from "react";
import { ImHtmlFive2 } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { SiTailwindcss, SiTypescript, SiGooglegemini } from "react-icons/si";
import { IoLogoJavascript, IoLogoReact } from "react-icons/io5";
import { RiNextjsFill, RiOpenaiFill } from "react-icons/ri";
import { FaGit, FaGithub, FaNode } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Meta } from "@/components/Shared/brand/Hud";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const ICONS = [
  { Icon: ImHtmlFive2, name: "HTML5" },
  { Icon: DiCss3, name: "CSS3" },
  { Icon: SiTailwindcss, name: "Tailwind" },
  { Icon: IoLogoJavascript, name: "JavaScript" },
  { Icon: SiTypescript, name: "TypeScript" },
  { Icon: RiNextjsFill, name: "Next.js" },
  { Icon: IoLogoReact, name: "React" },
  { Icon: FaGit, name: "Git" },
  { Icon: FaGithub, name: "GitHub" },
  { Icon: SiGooglegemini, name: "Gemini" },
  { Icon: RiOpenaiFill, name: "OpenAI" },
  { Icon: FaNode, name: "Node.js" },
];

/**
 * The stack, inside terminal chrome.
 *
 * The terminal window was already here and is the one device on /build that
 * was genuinely on-brand, so it stays and everything around it was rebuilt to
 * match: the same double-bezel tray as /animate's footage frames, the same
 * mono metadata, the same hairline borders. This is the workshop's answer to
 * the cutting room's film frame.
 */
export default function Stack() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".stack-btn", {
        scrollTrigger: { trigger: ".stack-grid", start: "top 82%" },
        // Never from scale(0) -- nothing in the real world appears out of
        // nothing. 0.9 plus opacity reads as arriving, not materialising.
        scale: 0.9,
        opacity: 0,
        duration: 0.35,
        stagger: 0.035,
        ease: "power3.out",
        clearProps: "transform",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="section px-6 md:px-12">
      <div className="mx-auto max-w-[84rem]">
        <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <Meta className="mb-5 block text-ink/40">Toolchain</Meta>
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-[clamp(2.6rem,7vw,5.5rem)] font-bold leading-[0.88] tracking-[-0.03em] text-ink">
              What I reach for<span className="text-signal">.</span>
            </h2>
          </div>
          <p className="max-w-xs text-ink/55 md:text-right">
            Tap one. Boring on purpose &mdash; these are the things I know well
            enough to be fast in.
          </p>
        </div>

        {/* Double bezel: outer tray with a hairline, terminal nested inside it
            at a concentric radius. */}
        <div className="rounded-[2rem] border border-ink/10 bg-frame/60 p-1.5 md:p-2">
          <div className="overflow-hidden rounded-[calc(2rem-0.375rem)] bg-stage md:rounded-[calc(2rem-0.5rem)]">
            <div className="flex items-center gap-2 border-b border-ink/10 px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-signal/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
              <Meta className="ml-3 text-ink/35">~/stack --list</Meta>
              <Meta className="ml-auto hidden text-ink/25 sm:inline">
                {String(ICONS.length).padStart(2, "0")} entries
              </Meta>
            </div>

            <ul className="stack-grid grid grid-cols-3 gap-2 p-4 sm:grid-cols-4 md:gap-3 md:p-8 lg:grid-cols-6">
              {ICONS.map(({ Icon, name }, i) => {
                const active = activeIndex === i;
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(active ? null : i)}
                      aria-pressed={active}
                      className={`stack-btn relative flex min-h-[84px] w-full flex-col items-center justify-center gap-2 rounded-xl p-3 transition-colors duration-200 ease-out md:min-h-[104px] ${
                        active
                          ? "bg-accent-build text-ink"
                          : "bg-ink/[0.04] text-ink/55 hover:bg-ink/[0.08] hover:text-ink"
                      }`}
                    >
                      <Icon className="shrink-0 text-xl md:text-2xl" aria-hidden="true" />
                      <span
                        className={`text-center font-[family-name:var(--font-jetbrains-mono)] text-[9px] font-medium leading-tight tracking-[0.08em] md:text-[10px] ${
                          active ? "text-ink" : "text-ink/40"
                        }`}
                      >
                        {active ? `> ${name}` : name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
