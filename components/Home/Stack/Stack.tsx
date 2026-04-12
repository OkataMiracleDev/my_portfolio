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
    { Icon: ImHtmlFive2, name: "HTML5", color: "#E34F26" },
    { Icon: DiCss3, name: "CSS3", color: "#1572B6" },
    { Icon: SiTailwindcss, name: "Tailwind", color: "#06B6D4" },
    { Icon: IoLogoJavascript, name: "JavaScript", color: "#F7DF1E" },
    { Icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
    { Icon: RiNextjsFill, name: "Next.js", color: "#000000" },
    { Icon: IoLogoReact, name: "React", color: "#61DAFB" },
    { Icon: FaGit, name: "Git", color: "#F05032" },
    { Icon: FaGithub, name: "GitHub", color: "#181717" },
    { Icon: SiGooglegemini, name: "Gemini", color: "#4285F4" },
    { Icon: RiOpenaiFill, name: "OpenAI", color: "#412991" },
    { Icon: FaNode, name: "Node.js", color: "#339933" },
  ];

useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Background Text Animation
      gsap.from(bgTextRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 30%",
          // markers: true, // Uncomment to debug scroll positions
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "power4.out",
      });

      // 2. Buttons Grid Animation
      // FIX: Use a string selector instead of gridRef.current.children
      gsap.from(".stack-btn", {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
        scale: 0,
        opacity: 0,
        duration: 0.2,
        stagger: 0.05,
        ease: "back.out(1.7)",
        // FIX: Clears GSAP's inline transform so Tailwind's hover:scale-105 works again
        clearProps: "transform", 
      });
    }, sectionRef); // Scope is locked to sectionRef

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Background text */}
          <div 
            ref={bgTextRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          >
            <p 
              className="font-bold text-center leading-tight opacity-5"
              style={{ 
                fontSize: 'clamp(3rem, 12vw, 10rem)',
                fontFamily: 'var(--font-space-grotesk)',
                color: 'var(--color-text-primary)',
              }}
            >
              MY<br />STACK
            </p>
          </div>

          {/* Icons grid */}
          <div className="relative z-10 flex justify-center">
            <div 
              ref={gridRef}
              className="card p-4 md:p-8 grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-2xl"
            >
              {icons.map(({ Icon, name }, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`
                    stack-btn relative rounded-lg md:rounded-xl p-3 md:p-4 transition-all duration-300 
                    flex flex-col items-center justify-center gap-1 min-h-[70px] md:min-h-[90px] group
                    ${
                      activeIndex === i
                        ? "scale-105"
                        : "hover:scale-105"
                    }
                  `}
                  style={{
                    background: activeIndex === i 
                      ? 'oklch(0.65 0.25 285)' 
                      : 'oklch(0.25 0.04 285 / 0.5)',
                    color: activeIndex === i 
                      ? 'oklch(1 0 0)' 
                      : 'var(--color-text-secondary)',
                    boxShadow: activeIndex === i 
                      ? '0 8px 24px oklch(0.65 0.25 285 / 0.4)' 
                      : 'none',
                  }}
                  aria-label={name}
                >
                  <Icon className="text-xl md:text-2xl flex-shrink-0" />
                  <span 
                    className="text-[8px] md:text-[10px] font-mono font-semibold text-center leading-tight"
                    style={{
                      opacity: activeIndex === i ? 1 : 0,
                    }}
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
