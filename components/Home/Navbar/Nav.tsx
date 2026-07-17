"use client";
import { navLinks } from "@/constant/constant";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const Nav = () => {
  const router = useRouter();
  const [navBg, setNavBg] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = () => {
      setNavBg(window.scrollY >= 70);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (navRef.current && mounted && !hasAnimated.current) {
      hasAnimated.current = true;
      gsap.fromTo(
        navRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power4.out",
        }
      );
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] opacity-0"
        style={{
          padding: "0.75rem 1.5rem",
          borderRadius: "9999px",
        }}
      >
        <div className="flex items-center gap-4 md:gap-8">
          {navLinks.map((link) => (
            <div key={link.id} className="w-6 h-6" />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] transition-all duration-300 ${
        navBg ? "card" : "bg-transparent"
      }`}
      style={{
        padding: "0.75rem 1rem",
        borderRadius: "9999px",
        width: "auto",
      }}
    >
      <div className="flex items-center justify-center gap-4.5 md:gap-8">
        {navLinks.map((link) => {
          const isDownload = typeof link.url === "string" && link.url.endsWith(".docx");

          return isDownload ? (
            <a
              key={link.id}
              href={link.url}
              download="Okata-Miracle-resume.docx"
              className="text-sm md:text-base font-medium transition-all duration-300 hover:scale-110 nav-icon whitespace-nowrap"
            >
              {link.label}
            </a>
          ) : (
            <Link href={link.url} key={link.id}>
              <span className="text-sm md:text-base font-medium transition-all duration-300 hover:scale-110 inline-block nav-icon whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => router.push("/build/blog")}
          className="px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium text-sm md:text-sm transition-all duration-300 hover:scale-105 whitespace-nowrap"
          style={{
            background: 'oklch(0.65 0.25 285)',
            color: 'oklch(1 0 0)',
          }}
        >
          Blog
        </button>
      </div>
    </nav>
  );
};

export default Nav;
