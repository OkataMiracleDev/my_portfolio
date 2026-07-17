"use client";
import React, { useState, useEffect, useRef } from "react";
import { ImHtmlFive2 } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { SiTailwindcss } from "react-icons/si";
import { IoLogoJavascript, IoLogoReact } from "react-icons/io5";
import { SiTypescript, SiGooglegemini } from "react-icons/si";
import { RiNextjsFill, RiOpenaiFill } from "react-icons/ri";
import { FaGit, FaGithub, FaNode } from "react-icons/fa";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Stack = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const icons = [
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(bgTextRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 30%" },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "power4.out",
      });

      gsap.from(".stack-btn", {
        scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        scale: 0,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
        ease: "back.out(1.7)",
        clearProps: "transform",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          <div
            ref={bgTextRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            <p
              className="text-center font-[family-name:var(--font-cabinet-grotesk)] font-bold leading-tight text-ink opacity-5"
              style={{ fontSize: 'clamp(3rem, 12vw, 10rem)' }}
            >
              MY<br />STACK
            </p>
          </div>

          <div className="relative z-10 flex justify-center">
            <div
              ref={gridRef}
              className="grid w-full max-w-2xl grid-cols-3 gap-2 rounded-card bg-base-raised p-4 md:grid-cols-4 md:gap-3 md:p-8"
            >
              {icons.map(({ Icon, name }, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`stack-btn relative flex min-h-[70px] flex-col items-center justify-center gap-1 rounded-lg p-3 transition-all duration-200 ease-out md:min-h-[90px] md:rounded-xl md:p-4 ${
                    activeIndex === i
                      ? "scale-105 bg-accent-build text-ink"
                      : "bg-ink/5 text-ink/60 hover:scale-105"
                  }`}
                  aria-label={name}
                >
                  <Icon className="flex-shrink-0 text-xl md:text-2xl" />
                  <span
                    className="text-center text-[8px] font-[family-name:var(--font-jetbrains-mono)] font-semibold leading-tight md:text-[10px]"
                    style={{ opacity: activeIndex === i ? 1 : 0 }}
                  >
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
