# /build Route Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Reskin every component under `/build/*` to the new light-minimal design system from Plan 1, without changing any content, copy, data, or interaction logic (spec §10, "keep content, redesign shell"). Every GSAP animation, form handler, and piece of business logic in this plan is preserved byte-for-byte from the current implementation — only class names, inline styles, and a handful of dead CSS rules change.

**Architecture:** Depends on Plan 1 (tokens, fonts, `ProjectCard`) and Plan 2 (routes already relocated to `/build/*`) being complete. The pattern repeated in every task: old `.card`/`.btn-primary`/`.btn-secondary`/`.heading-*`/`.body*` classes and hardcoded `oklch(...)`/`var(--color-*)` dark-purple values are replaced with the new tokens (`bg-base`, `bg-base-raised`, `text-ink`, `bg-accent-build`, `rounded-card`, `rounded-pill`, `ease-out`) and fonts (`--font-cabinet-grotesk` for headings, `--font-jetbrains-mono` for small technical labels, `--font-general-sans` inherited from the `/build` layout for body text). Two components adopt the shared `ProjectCard` from Plan 1 instead of their own bespoke card markup. The very last task deletes the now-fully-unused old-theme CSS from `globals.css` — it has to be last, because every earlier task is still relying on those old classes until its own turn comes up.

**Tech Stack:** Same as Plan 1/2 — Next.js 15, React 19, TypeScript, Tailwind v4, GSAP (untouched), Swiper, react-multi-carousel.

**On testing:** Every task here is a visual reskin of existing, already-working logic (GSAP timelines, form submission, scroll listeners) — none of it is new behavior, so there's nothing new to unit test. Each task is verified by build success plus a manual browser check that describes exactly what to look at and interact with, consistent with how Plan 1 treated its own CSS/config-only tasks.

---

## File Structure

| File | Change | Task |
|---|---|---|
| `app/build/layout.tsx` | Modify | 1 |
| `components/ThemeToggle.tsx` | Delete | 1 |
| `components/Helper/SectionHeading.tsx` | Modify | 2 |
| `components/Helper/Modal.tsx` | Modify | 2 |
| `components/Home/Navbar/Nav.tsx` | Modify | 3 |
| `components/SplashScreen.tsx` | Modify | 4 |
| `components/Home/Hero/Hero.tsx` | Modify | 5 |
| `components/Home/About/About.tsx` | Modify | 6 |
| `components/Home/About/PhotoCollage.tsx` | Modify | 6 |
| `components/Home/Projects/Projects.tsx` | Modify | 7 |
| `components/Home/Projects/ProjectsSlider.tsx` | Modify | 7 |
| `components/Home/Stack/Stack.tsx` | Modify | 8 |
| `components/Home/Experience/Experience.tsx` | Modify | 9 |
| `components/Home/HomeProjects/HomeProjects.tsx` | Modify | 10 |
| `components/Home/HomeProjects/ProjectsCard.tsx` | Delete | 10 |
| `components/Home/Testimonials/Testimonials.tsx` | Modify | 11 |
| `components/Home/Testimonials/TestimonialSlider.tsx` | Modify | 11 |
| `components/Home/Contact/Contact.tsx` | Modify | 12 |
| `components/Home/Footer/Footer.tsx` | Modify | 13 |
| `app/build/projects/page.tsx` | Modify | 14 |
| `app/build/projects/[projectID]/page.tsx` | Modify | 14 |
| `app/build/blog/page.tsx` | Modify | 15 |
| `app/globals.css` | Modify | 16 |

---

### Task 1: Prepare the `/build` shell

Removes the dark/light theme toggle (dark mode is a non-goal per spec §3, and there's no dark variant of the new tokens for it to toggle to) and establishes the new base background/font for everything under `/build/*`.

- [x] **Step 1:** Replace `app/build/layout.tsx`:

```tsx
import Nav from "@/components/Home/Navbar/Nav";

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base font-[family-name:var(--font-general-sans)] text-ink">
      <Nav />
      {children}
    </div>
  );
}
```

- [x] **Step 2:** Delete `components/ThemeToggle.tsx` (`git rm components/ThemeToggle.tsx`) — nothing else imports it after Step 1.

- [x] **Step 3:** Run `npm run build` — expect success (grep the repo for `ThemeToggle` first if it fails, to confirm no other import was missed).

- [x] **Step 4:** Commit: `git add app/build/layout.tsx && git rm components/ThemeToggle.tsx --cached 2>/dev/null; git add -A && git commit -m "refactor: drop theme toggle, establish /build base shell"`

---

### Task 2: Redesign shared Helper components

`SectionHeading` and `Modal` are used by multiple sections redesigned in later tasks, so they go first.

- [x] **Step 1:** Replace `components/Helper/SectionHeading.tsx`:

```tsx
import React from 'react'

type Props = {
    heading: string;
};

const SectionHeading = ({heading}: Props) => {
  return (
    <h2 className='font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink'>
      {heading}
    </h2>
  )
}

export default SectionHeading
```

- [x] **Step 2:** Replace `components/Helper/Modal.tsx`:

```tsx
"use client";
import React, { ReactNode, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10002] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-base-raised p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/5 text-ink transition-transform duration-200 ease-out hover:scale-110"
          aria-label="Close modal"
        >
          <span className="text-2xl">×</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
```

- [x] **Step 3:** Run `npm run build` — expect success (existing usages of `.heading-2`/old `.card` inside these two files' consumers will still work fine since consumers aren't touched until their own tasks).

- [x] **Step 4:** Commit: `git add components/Helper && git commit -m "refactor: reskin SectionHeading and Modal"`

---

### Task 3: Redesign Nav

Preserves the scroll-based background toggle, the GSAP entrance animation, and every link exactly — only the classes change.

- [x] **Step 1:** Replace `components/Home/Navbar/Nav.tsx`:

```tsx
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
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power4.out" }
      );
    }
  }, [mounted]);

  if (!mounted) {
    return (
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] opacity-0 rounded-pill px-6 py-3">
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
      className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[10000] rounded-pill px-4 py-3 transition-colors duration-200 ease-out ${
        navBg ? "bg-base-raised shadow-[0_4px_24px_rgb(0_0_0_/_0.08)]" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-center gap-4.5 md:gap-8">
        {navLinks.map((link) => {
          const isDownload = typeof link.url === "string" && link.url.endsWith(".docx");

          return isDownload ? (
            <a
              key={link.id}
              href={link.url}
              download="Okata-Miracle-resume.docx"
              className="text-sm md:text-base font-medium text-ink transition-transform duration-200 ease-out hover:scale-110 whitespace-nowrap"
            >
              {link.label}
            </a>
          ) : (
            <Link href={link.url} key={link.id}>
              <span className="text-sm md:text-base font-medium text-ink transition-transform duration-200 ease-out hover:scale-110 inline-block whitespace-nowrap">
                {link.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => router.push("/build/blog")}
          className="rounded-pill bg-accent-build px-3 md:px-4 py-1.5 md:py-2 font-medium text-sm text-ink transition-transform duration-200 ease-out hover:scale-105 whitespace-nowrap active:scale-95"
        >
          Blog
        </button>
      </div>
    </nav>
  );
};

export default Nav;
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Manual check: `npm run dev`, visit `/build`, confirm the nav fades/slides in on load, the background turns solid after scrolling past ~70px, every icon link and the Blog button still work.

- [x] **Step 4:** Commit: `git add components/Home/Navbar/Nav.tsx && git commit -m "refactor: reskin Nav"`

---

### Task 4: Redesign SplashScreen

Same session-storage-gated, GSAP-timed reveal — only the colors/fonts change.

- [x] **Step 1:** Replace `components/SplashScreen.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("hasSeenSplash", "true");
        setIsVisible(false);
      },
    });

    tl.to(".splash-text", {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.3,
    })
      .to(".splash-text", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power4.in",
        delay: 1,
      })
      .to(".splash-screen", {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-screen fixed inset-0 z-[10003] flex items-center justify-center bg-base">
      <div className="splash-text opacity-0" style={{ transform: 'translateY(30px)' }}>
        <h1 className="text-center font-[family-name:var(--font-cabinet-grotesk)] text-6xl md:text-8xl font-bold text-ink">
          OKATA<br />MIRACLE
        </h1>
        <p className="mt-4 text-center font-[family-name:var(--font-jetbrains-mono)] text-sm tracking-widest text-accent-build">
          FRONTEND DEVELOPER
        </p>
      </div>
    </div>
  );
}
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Manual check: clear session storage (DevTools → Application → Session Storage → delete `hasSeenSplash`), reload `/build`, confirm the splash shows the new light background and Cabinet Grotesk wordmark, then fades into the page. Reload again without clearing storage — splash should not reappear (unchanged `sessionStorage` gating).

- [x] **Step 4:** Commit: `git add components/SplashScreen.tsx && git commit -m "refactor: reskin SplashScreen"`

---

### Task 5: Redesign Hero

All refs and the entire GSAP timeline are unchanged — only classes/inline styles change. The CTA still opens the same `Modal`+`Contact` combination as before (changing that interaction is outside this plan's "redesign shell, not flow" scope).

- [x] **Step 1:** Replace `components/Home/Hero/Hero.tsx`:

```tsx
"use client";
import Modal from "@/components/Helper/Modal";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Contact from "../Contact/Contact";
import { gsap } from "gsap";

const Hero = () => {
  const [openModal, setOpenModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const decorRef1 = useRef<HTMLDivElement>(null);
  const decorRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.8, delay: 0.2 })
        .from(nameRef.current?.children || [], { y: 100, opacity: 0, duration: 1.2, stagger: 0.1 }, "-=0.4")
        .from(descRef.current, { y: 50, opacity: 0, duration: 1 }, "-=0.6")
        .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(imageRef.current, { scale: 0.8, opacity: 0, rotation: 5, duration: 1.2 }, "-=1")
        .from([decorRef1.current, decorRef2.current], { scale: 0, opacity: 0, duration: 1, stagger: 0.2 }, "-=0.8");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden" id="home">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-32">
        <div className="space-y-8">
          <div className="space-y-4">
            <p
              ref={subtitleRef}
              className="text-sm uppercase tracking-[0.3em] font-[family-name:var(--font-jetbrains-mono)] text-accent-build"
            >
              Frontend Developer
            </p>
            <h1
              ref={nameRef}
              className="font-[family-name:var(--font-cabinet-grotesk)] text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight text-ink"
            >
              <span className="inline-block">OKATA</span>
              <br />
              <span className="inline-block">MIRACLE</span>
            </h1>
          </div>

          <p ref={descRef} className="max-w-lg text-lg text-ink/70">
            I craft premium, interactive web experiences that blend bold design with smooth animations. Specializing in GSAP, React, and creating sites that leave an impression.
          </p>

          <button
            ref={ctaRef}
            onClick={() => setOpenModal(true)}
            className="group inline-flex items-center gap-3 rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <span>Let&apos;s Work Together</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">→</span>
          </button>
        </div>

        <div ref={imageRef} className="relative">
          <div className="relative aspect-square max-w-md mx-auto">
            <div
              ref={decorRef1}
              className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-accent-build opacity-30 blur-3xl"
            />
            <div
              ref={decorRef2}
              className="absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-accent-build opacity-20 blur-3xl"
            />

            <div className="relative z-10 rounded-card bg-base-raised p-4 transition-transform duration-500 ease-out hover:scale-[1.02]">
              <div className="relative aspect-square overflow-hidden rounded-card">
                <Image
                  src="/images/Miracle_Okata.jpg"
                  alt="Okata Miracle"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 z-20 rounded-card bg-base-raised px-6 py-4">
              <p className="font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build">
                @mimi_codes
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <Contact />
      </Modal>
    </div>
  );
};

export default Hero;
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Manual check: `/build` hero entrance animation still staggers in the same order (subtitle → name → description → CTA → image → decorative blobs); clicking "Let's Work Together" still opens the modal with the contact form.

- [x] **Step 4:** Commit: `git add components/Home/Hero/Hero.tsx && git commit -m "refactor: reskin Hero"`

---

### Task 6: Redesign About + PhotoCollage

All content and GSAP scroll-reveal logic unchanged.

- [x] **Step 1:** Replace `components/Home/About/About.tsx`:

```tsx
"use client";
import SectionHeading from '@/components/Helper/SectionHeading';
import React, { useEffect, useRef } from 'react';
import PhotoCollage from './PhotoCollage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        x: -50, opacity: 0, duration: 1, ease: "power4.out",
      });
      gsap.from(imageRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        x: 50, opacity: 0, duration: 1, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id='about' ref={sectionRef} className='section px-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
          <div ref={contentRef} className='space-y-8'>
            <SectionHeading heading='About mimi' />

            <div className='space-y-6'>
              <p className='text-lg text-ink/70'>
                I&apos;m a <span className="font-semibold text-accent-build">Frontend Developer</span> specializing in creating <span className="font-semibold text-accent-build">intuitive, creative, and responsive user-friendly experiences.</span> With over <span className="font-semibold text-accent-build">2 years of intensive experience</span>, my focus is on full project ownership, from concept through deployment.
              </p>

              <div className='space-y-4'>
                <h3 className='font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink'>
                  Proven Impact
                </h3>

                <div className='space-y-4 rounded-card bg-base-raised p-6'>
                  <div className='flex items-start gap-4'>
                    <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-build' />
                    <div>
                      <h4 className='mb-2 font-bold text-ink'>Traffic &amp; Conversion</h4>
                      <p className='text-sm text-ink/70'>
                        Rescued and rebuilt a critical waitlist for <span className="font-semibold text-accent-build">Synapse Academy</span>, driving traffic from <span className="font-semibold text-accent-build">1-10 visits to 1,000–3,000 per day</span> through SEO optimization and backend improvements.
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-col md:flex-row items-start gap-4'>
                    <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-build' />
                    <div>
                      <h4 className='mb-2 font-bold text-ink'>Seamless UX</h4>
                      <p className='text-sm text-ink/70'>
                        Engineered a live-streaming system for <span className="font-semibold text-accent-build">Nkechi Evangelical Ministry</span>, enabling global followers to watch services directly on-site without third-party software.
                      </p>
                    </div>
                    <div>
                      <h4 className='mb-2 font-bold text-ink'>Full Stack Development</h4>
                      <p className='text-sm text-ink/70'>
                        I built <span className="font-semibold text-accent-build">UniHub</span>. UniHub is the ultimate platform for university students to discover, create, and manage campus events. Join communities, buy tickets, and never miss out on what&apos;s happening on campus.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink'>
                  My Approach
                </h3>
                <p className='text-base text-ink/70'>
                  I excel through <span className="font-semibold text-accent-build">creative problem-solving</span> and <span className="font-semibold text-accent-build">efficient delivery</span>. My technical stack includes React, Next.js, TypeScript, and GSAP. My ambition is to focus on <span className="font-semibold text-accent-build">AI integration and mobile-first application development.</span>
                </p>
              </div>
            </div>
          </div>

          <div ref={imageRef} className='flex justify-center lg:justify-end'>
            <PhotoCollage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

- [x] **Step 2:** Replace `components/Home/About/PhotoCollage.tsx`:

```tsx
import Image from 'next/image'
import React from 'react'

const PhotoCollage = () => {
  return (
    <div className='relative group w-full max-w-md'>
      <div className='rounded-card bg-base-raised p-6 transform rotate-2 transition-all duration-500 ease-out group-hover:rotate-0 hover:scale-105'>
        <div className='relative aspect-[3/4] w-full'>
          <Image
            src={"/images/3.jpg"}
            fill
            alt="mimi_codes"
            className='object-cover rounded-xl'
          />
        </div>
        <p className='text-center mt-6 font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-accent-build'>
          @mimi_codes
        </p>
      </div>

      <div className='absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-accent-build opacity-30 blur-3xl -z-10' />
      <div className='absolute -top-6 -left-6 w-40 h-40 rounded-full bg-accent-build opacity-20 blur-3xl -z-10' />
    </div>
  )
}

export default PhotoCollage
```

- [x] **Step 3:** Run `npm run build` — expect success.

- [x] **Step 4:** Manual check: `/build#about` scroll-reveals text from the left and the photo collage from the right; hovering the photo collage un-rotates it.

- [x] **Step 5:** Commit: `git add components/Home/About && git commit -m "refactor: reskin About and PhotoCollage"`

---

### Task 7: Redesign Projects (Featured Work slider)

The `react-multi-carousel` autoplay/responsive config and the external-link behavior are unchanged.

- [x] **Step 1:** Replace `components/Home/Projects/Projects.tsx`:

```tsx
"use client";
import React, { useEffect, useRef } from 'react';
import ProjectsSlider from './ProjectsSlider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 50, opacity: 0, duration: 1, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='section px-6'>
      <div className='max-w-7xl mx-auto'>
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink text-center mb-16"
        >
          Featured Work
        </h2>
        <ProjectsSlider />
      </div>
    </section>
  );
};

export default Projects;
```

- [x] **Step 2:** Replace `components/Home/Projects/ProjectsSlider.tsx`:

```tsx
"use client";
import { projectsSliderData } from "@/data/data";
import Image from "next/image";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const ProjectsSlider = () => {
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={4000}
      keyBoardControl={true}
      containerClass="pb-12"
      itemClass="px-4"
    >
      {projectsSliderData.map((data, index) => {
        return (
          <a
            key={data.id}
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full group"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-card bg-base-raised transition-transform duration-500 ease-out group-hover:scale-[1.02]">
              <div className="absolute top-6 left-6 z-10 rounded-pill bg-accent-build px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-ink">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative h-72 overflow-hidden">
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div className="flex flex-1 flex-col p-8">
                <h3 className="mb-4 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
                  {data.name}
                </h3>
                <p className="mb-6 flex-1 text-sm text-ink/70 line-clamp-3">
                  {data.description}
                </p>
                <div className="flex items-center gap-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build">
                  <span>View Project</span>
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-2">→</span>
                </div>
              </div>
            </div>
          </a>
        );
      })}
    </Carousel>
  );
};

export default ProjectsSlider;
```

- [x] **Step 3:** Run `npm run build` — expect success.

- [x] **Step 4:** Manual check: the "Featured Work" carousel still autoplays, is draggable, and each slide opens its external `link` in a new tab.

- [x] **Step 5:** Commit: `git add components/Home/Projects && git commit -m "refactor: reskin Projects slider"`

---

### Task 8: Redesign Stack

All GSAP scroll-triggered reveals and the click-to-reveal-label interaction are unchanged. Per-icon brand hex colors are dropped in favor of the new restrained accent system (icons are still identified by shape and label) — a deliberate simplification, not an oversight.

- [x] **Step 1:** Replace `components/Home/Stack/Stack.tsx`:

```tsx
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
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Manual check: icons pop in staggered on scroll; clicking an icon shows its label and highlights it in the accent color; only one icon highlighted at a time.

- [x] **Step 4:** Commit: `git add components/Home/Stack/Stack.tsx && git commit -m "refactor: reskin Stack"`

---

### Task 9: Redesign Experience

**The GSAP scroll-hijack math (card-deck positions, pin, scrub, per-card stagger) must not change in any way** — copy it verbatim. Only the JSX class names/inline styles change. This also fixes a latent bug: the original section used `style={{ backgroundColor: "var(--color-bg-primary)" }}`, referencing a CSS variable that was never defined anywhere in `globals.css` — it silently did nothing. It now gets a real, intentional background.

- [x] **Step 1:** Replace `components/Home/Experience/Experience.tsx`:

```tsx
"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceData } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".experience-card");
      if (!cards.length) return;

      const gap = 32;
      const getCardWidth = () => (window.innerWidth > 768 ? 450 : 350);
      const getDeckX = () => window.innerWidth - getCardWidth() - (window.innerWidth > 768 ? 60 : 20);
      const getCenterTarget = () => window.innerWidth / 2 - getCardWidth() / 2;
      const isMobile = () => window.innerWidth < 768;

      gsap.set(cards, {
        position: "absolute",
        left: 0,
        top: "50%",
        yPercent: -50,
        x: getDeckX,
        rotation: (i) => (i % 1 === 0 ? i * 1 : -i * 1),
        zIndex: (i) => cards.length - i,
        transformOrigin: "center center",
        opacity: 1,
      });

      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${cards.length * 700}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            if (isMobile()) {
              const viewportCenter = window.innerWidth / 2;

              cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
                const maxDistance = window.innerWidth / 2;
                const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);
                gsap.set(card, { opacity });
              });
            }
          },
        },
      });

      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            x: () => getCenterTarget() - (cards.length - 1 - i) * (getCardWidth() + gap),
            rotation: 0,
            ease: "none",
            duration: 1,
          },
          i * 0.2
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex flex-col overflow-hidden bg-base"
    >
      <div className="w-full pt-20">
        <h2
          ref={headingRef}
          className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink text-center px-6"
        >
          Work Experience
        </h2>
      </div>

      <div ref={cardsContainerRef} className="relative flex-1 w-full">
        {experienceData.map((exp, index) => (
          <div
            key={exp.id}
            className="experience-card w-[350px] md:w-[450px] rounded-card bg-base-raised p-8"
          >
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-build font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-ink">
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-build" />
              <span className="font-[family-name:var(--font-jetbrains-mono)] text-sm font-semibold text-accent-build">
                {exp.year}
              </span>
            </div>

            <h3 className="mb-2 font-[family-name:var(--font-cabinet-grotesk)] text-2xl font-bold text-ink">
              {exp.role}
            </h3>
            <p className="mb-6 font-semibold text-accent-build">{exp.company}</p>

            <p className="mb-6 text-sm text-ink/70">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Manual check — this is the highest-risk task in the plan, since the scroll math is intricate: on `/build`, scroll to the Work Experience section. Scroll should "hijack" (pin) while the cards peel off the right-hand deck one by one and spread out until the last card reaches center, at which point normal page scroll resumes. Resize the browser window and confirm the deck still lays out correctly (the math recalculates via `invalidateOnRefresh`). Test on a narrow/mobile-width viewport too — cards should fade based on distance from center while scrolling (the `isMobile()` opacity branch).

- [x] **Step 4:** Commit: `git add components/Home/Experience/Experience.tsx && git commit -m "refactor: reskin Experience, fix undefined --color-bg-primary reference"`

---

### Task 10: Redesign HomeProjects — adopt shared `ProjectCard`

Retires the bespoke `ProjectsCard` in favor of Plan 1's shared `ProjectCard`, themed `accent="build"`. `homeprojectsData` has no `tags` field, so tags render as an empty list (handled gracefully by `ProjectCard`).

- [x] **Step 1:** Replace `components/Home/HomeProjects/HomeProjects.tsx`:

```tsx
"use client";
import SectionHeading from "@/components/Helper/SectionHeading";
import { homeprojectsData } from "@/data/data";
import React, { useEffect, useRef } from "react";
import ProjectCard from "@/components/Shared/ProjectCard";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomeProjects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 50, opacity: 0, duration: 1, ease: "power4.out",
      });

      gsap.from(cardsRef.current?.children || [], {
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
        y: 80, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section px-6">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="text-center mb-16">
          <SectionHeading heading="Here's A Bit of What I've Worked On" />
          <p className="mt-4 text-ink/70">
            Selected projects showcasing my approach to design and development
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {homeprojectsData.map((data) => (
            <ProjectCard
              key={data.id}
              accent="build"
              project={{
                id: String(data.id),
                slug: data.projectID,
                title: data.name,
                description: data.description,
                thumbnail: data.image,
                tags: [],
                href: data.projectID,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/build/projects"
            className="group inline-flex items-center gap-3 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>View All Projects</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200 ease-out">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeProjects;
```

- [x] **Step 2:** Delete `components/Home/HomeProjects/ProjectsCard.tsx` (`git rm components/Home/HomeProjects/ProjectsCard.tsx`) — no longer imported by anything.

- [x] **Step 3:** Run `npm run build` — expect success.

- [x] **Step 4:** Manual check: the two home-page project cards render with image, title, description; clicking one navigates to its `/build/projects/...` detail page (this exercises the `data/data.ts` fix from Plan 2's Task 1 — if that fix is missing, this click 404s); "View All Projects" goes to `/build/projects`.

- [x] **Step 5:** Commit: `git add components/Home/HomeProjects && git commit -m "refactor: adopt shared ProjectCard in HomeProjects"`

---

### Task 11: Redesign Testimonials

The Swiper card-stack effect and all client review data are unchanged.

- [x] **Step 1:** Replace `components/Home/Testimonials/Testimonials.tsx`:

```tsx
"use client";
import SectionHeading from '@/components/Helper/SectionHeading';
import React, { useEffect, useRef } from 'react';
import TestimonialSlider from './TestimonialSlider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 50, opacity: 0, duration: 1, ease: "power4.out",
      });

      gsap.from(sliderRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        y: 80, opacity: 0, duration: 1, delay: 0.3, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className='section px-6'>
      <div className='max-w-7xl mx-auto'>
        <div ref={headingRef} className='text-center mb-16'>
          <SectionHeading heading='What Clients Say' />
          <p className="mt-4 text-ink/70">
            Feedback from people I&apos;ve worked with
          </p>
        </div>

        <div ref={sliderRef} className='flex justify-center'>
          <TestimonialSlider />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
```

- [x] **Step 2:** Replace `components/Home/Testimonials/TestimonialSlider.tsx`:

```tsx
"use client"
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';

import { EffectCards } from "swiper/modules"
import Image from 'next/image';
import { testimonialData } from '@/data/data';

const TestimonialSlider = () => {
  return (
    <div className='w-full max-w-xl'>
      <Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className='w-full h-[450px] md:h-[400px]'
      >
        {testimonialData.map((data, index) => {
          return (
            <SwiperSlide
              key={data.id}
              className='rounded-card bg-base-raised'
            >
              <div className='h-full py-10 px-8 flex flex-col items-center justify-center text-center relative'>
                <div className='relative w-24 h-24 mb-6'>
                  <div className='absolute inset-0 rounded-full bg-accent-build opacity-30 blur-xl' />
                  <Image
                    src={data.image}
                    width={96}
                    height={96}
                    alt={data.name}
                    className='relative rounded-full w-full h-full object-cover border-[3px] border-accent-build'
                  />
                </div>

                <h3 className='font-bold text-lg text-ink mb-6'>
                  {data.name}
                </h3>

                <p className='text-sm leading-relaxed text-ink/70'>
                  &quot;{data.review}&quot;
                </p>

                <div className='absolute top-6 right-6 font-[family-name:var(--font-jetbrains-mono)] text-sm font-bold text-ink opacity-30'>
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

export default TestimonialSlider
```

(Added `relative` to the slide's inner wrapper div — the card-number badge is `absolute`-positioned and needs a positioned ancestor; the old `.card` class supplied `position: relative` implicitly through other rules, so this makes that dependency explicit now that `.card` is gone.)

- [x] **Step 3:** Run `npm run build` — expect success.

- [x] **Step 4:** Manual check: testimonial cards still stack/swipe with Swiper's card effect; each card shows client photo, name, quote, and its number badge in the corner.

- [x] **Step 5:** Commit: `git add components/Home/Testimonials && git commit -m "refactor: reskin Testimonials"`

---

### Task 12: Redesign Contact

Form validation, the `fetch("/api/contact")` call, toast notifications, and the GSAP reveal are all unchanged.

- [x] **Step 1:** Replace `components/Home/Contact/Contact.tsx`:

```tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        y: 80, opacity: 0, duration: 1, ease: "power4.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fullName = (form.fullName as HTMLInputElement).value.trim();
    const email = (form.email as HTMLInputElement).value.trim();
    const message = (form.message as HTMLTextAreaElement).value.trim();

    if (!fullName || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, message }),
      });

      if (res.ok) {
        toast.success("Message sent successfully!");
        form.reset();
      } else {
        const data = await res.json();
        toast.error(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="section px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-card bg-base-raised p-8 md:p-12">
          <div className="mb-10 text-center">
            <h2 className="font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-4xl font-bold text-ink mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-ink/70">
              Have a project in mind? I&apos;m always open to discussing new opportunities and creative collaborations.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-ink/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink/70 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink/70 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full resize-none rounded-xl border border-ink/15 bg-base px-4 py-3 text-ink transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-accent-build"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-pill bg-accent-build py-3 font-semibold text-ink transition-transform duration-200 ease-out active:scale-[0.97] ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:-translate-y-0.5"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? "Sending..." : "Send Message"}
                {!loading && <span>→</span>}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Manual check: submitting the form with empty fields shows the validation toast; a real submission still POSTs to `/api/contact` and shows a success/error toast (check the Network tab if you don't have working `EMAIL_USER`/`EMAIL_PASS` env vars locally — the important thing is the request fires correctly, not that the email actually sends in dev).

- [x] **Step 4:** Commit: `git add components/Home/Contact/Contact.tsx && git commit -m "refactor: reskin Contact"`

---

### Task 13: Redesign Footer

- [x] **Step 1:** Replace `components/Home/Footer/Footer.tsx`:

```tsx
import { footLinks } from '@/constant/constant'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full px-6 py-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='rounded-card bg-base-raised p-8 flex flex-col md:flex-row justify-between items-center gap-6'>
          <p className='text-sm text-ink/60'>
            © 2025 Okata Miracle. All rights reserved.
          </p>

          <div className='flex gap-6'>
            {footLinks.map((link) => (
              <Link
                href={link.url}
                key={link.id}
                className='text-ink/60 transition-transform duration-200 ease-out hover:scale-110 hover:text-ink'
              >
                <span className='text-xl'>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Commit: `git add components/Home/Footer/Footer.tsx && git commit -m "refactor: reskin Footer"`

---

### Task 14: Redesign `/build/projects` and `/build/projects/[projectID]`

The listing page adopts the shared `ProjectCard` (and gets real tags, since `projectsData` — unlike `homeprojectsData` — has a `technology` array). The detail page also gains its own `generateMetadata` — it previously had none and silently fell back to the root layout's generic metadata, and its old static `metadata` export actually had the wrong, listing-page title copy-pasted onto the detail page. Since this file is already being fully rewritten, fixing that is in scope.

- [x] **Step 1:** Replace `app/build/projects/page.tsx`:

```tsx
import React from "react";
import { projectsData } from "@/data/data";
import ProjectCard from "@/components/Shared/ProjectCard";
import SectionHeading from "@/components/Helper/SectionHeading";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Okata Miracle - Frontend Developer",
  description: "Explore Okata Miracle's latest projects built with Next.js, React, and TailwindCSS.",
};

export function generateStaticParams() {
  return projectsData.map((project) => ({
    projectID: project.projectID,
  }));
}

const ProjectsPage = () => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionHeading heading="All Projects" />
          <p className="mt-4 text-lg text-ink/70">
            A collection of my recent work and client projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              accent="build"
              project={{
                id: String(project.id),
                slug: project.projectID,
                title: project.name,
                description: project.description,
                thumbnail: project.image,
                tags: project.technology,
                href: `/build/projects/${project.projectID}`,
              }}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/build"
            className="group inline-flex items-center gap-3 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
```

- [x] **Step 2:** Replace `app/build/projects/[projectID]/page.tsx`:

```tsx
import Footer from '@/components/Home/Footer/Footer';
import { projectsData } from '@/data/data'
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'
import { IoLinkOutline } from "react-icons/io5";

type Props = {
  params: Promise<{
    projectID: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = projectsData.find((p) => p.projectID === resolvedParams.projectID);

  if (!project) {
    return { title: "Project not found | Okata Miracle" };
  }

  return {
    title: `${project.name} | Okata Miracle`,
    description: project.subhead,
  };
}

const ProjectDisplayPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const project = projectsData.find(
    (p) => p.projectID === resolvedParams.projectID
  );

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="font-[family-name:var(--font-cabinet-grotesk)] text-4xl font-bold text-ink">
          Project not found
        </h1>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-32 pb-20 px-6'>
      <div className='max-w-5xl mx-auto'>
        <div className='rounded-card bg-base-raised p-8 md:p-12 mb-12'>
          <h1 className='mb-6 font-[family-name:var(--font-cabinet-grotesk)] text-4xl md:text-5xl font-bold text-ink'>
            {project.name}
          </h1>
          <p className='mb-8 text-lg text-ink/70'>
            {project.subhead}
          </p>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-8'>
            <div>
              <p className='mb-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
                Date
              </p>
              <p className='font-semibold text-ink'>{project.date}</p>
            </div>
            <div>
              <p className='mb-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
                Type
              </p>
              <p className='font-semibold text-ink'>{project.type}</p>
            </div>
            <div className='col-span-2'>
              <p className='mb-2 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
                Client
              </p>
              <p className='font-semibold text-ink'>{project.client}</p>
            </div>
          </div>

          <div className='mb-8'>
            <p className='mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technology.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-pill bg-accent-build/15 px-4 py-2 text-sm font-[family-name:var(--font-jetbrains-mono)] font-medium text-accent-build"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className='mb-8'>
            <p className='mb-3 font-[family-name:var(--font-jetbrains-mono)] text-sm text-accent-build'>
              Description
            </p>
            <p className='leading-relaxed text-ink/70'>{project.description}</p>
          </div>

          <div className='flex flex-wrap gap-4'>
            <Link
              href={project.link}
              className="inline-flex items-center gap-2 rounded-pill bg-accent-build px-6 py-3 font-semibold text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.97]"
              target="_blank"
            >
              <span>Visit Project</span>
              <IoLinkOutline className='text-xl' />
            </Link>
            <Link
              href="/build/projects"
              className="inline-flex items-center gap-2 rounded-pill border border-ink/15 px-6 py-3 font-medium text-ink transition-colors duration-200 ease-out hover:bg-ink/5"
            >
              <span>←</span>
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {[project.image, project.image2, project.image3].map((img, index) => (
            <div key={index} className="overflow-hidden rounded-card bg-base-raised p-6">
              <div className="relative h-64 md:h-96 overflow-hidden rounded-card">
                <Image
                  src={img}
                  alt={`${project.name} screenshot ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProjectDisplayPage
```

- [x] **Step 3:** Run `npm run build` — expect success. Confirm each generated project detail page's `<title>` (visible in the build output's page list or by inspecting `<head>` in the browser) is the project's own name, not the generic listing-page title.

- [x] **Step 4:** Manual check: `/build/projects` shows all projects with tag chips; each card opens its detail page with correct meta info, image gallery, and both action buttons working.

- [x] **Step 5:** Commit: `git add app/build/projects && git commit -m "refactor: reskin projects pages, add per-project metadata"`

---

### Task 15: Reskin `/build/blog`

Also fixes a pre-existing typo (`md"text-lg` — missing colon) encountered while touching this line.

- [x] **Step 1:** Replace `app/build/blog/page.tsx`:

```tsx
import Footer from '@/components/Home/Footer/Footer'
import React from 'react'

const BlogPage = () => {
  return (
    <div className='pt-[15rem] pb-10 w-full'>
        <div className='flex flex-col justify-center items-center gap-10'>
        <div className='flex flex-col gap-4 justify-center items-center'>
            <h1 className='font-[family-name:var(--font-cabinet-grotesk)] text-3xl md:text-5xl font-bold text-ink'>Blog Posts</h1>
            <p className='text-ink/60 text-center font-medium text-base md:text-lg'>Thoughts, startup news and insights on software development</p>
        </div>
        <h1 className='text-ink/60 font-medium text-base md:text-lg'>No articles available yet</h1>

        </div>
        <Footer />
    </div>
  )
}

export default BlogPage
```

- [x] **Step 2:** Run `npm run build` — expect success.

- [x] **Step 3:** Commit: `git add app/build/blog/page.tsx && git commit -m "refactor: reskin blog page"`

---

### Task 16: Remove dead old-theme CSS

Safe now — every component that used to reference the old dark-purple tokens/classes has been migrated in Tasks 1–15. Before deleting, grep to make sure.

- [x] **Step 1:** Confirm nothing still references the classes about to be deleted:

Run: `grep -rn "className=.*\b\(card\|btn-primary\|btn-secondary\|hire-me-btn\|heading-display\|heading-1\|heading-2\|heading-3\|body-large\|nav-icon\|fade-in-up\)\b" --include="*.tsx" app components`

Expected: no matches (every file that used these was rewritten in Tasks 1–15). If anything matches, stop and fix that file first — do not delete its CSS out from under it.

- [x] **Step 2:** Replace the full contents of `app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  /* Light-minimal identity tokens (spec §6). */
  --color-ink: oklch(21% 0.015 55);
  --color-base: oklch(97% 0.01 55);
  --color-base-raised: oklch(99% 0.006 55);
  --color-accent-build: oklch(64% 0.19 45);
  --color-accent-animate: oklch(58% 0.24 300);
  --color-band-dark: oklch(16% 0.02 300);

  --radius-card: 1.25rem;
  --radius-pill: 999px;

  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}

/* Spacing scale - 4pt base. Theme-agnostic; reused by .section below. */
:root {
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 0.75rem;
  --space-lg: 1rem;
  --space-xl: 1.5rem;
  --space-2xl: 2rem;
  --space-3xl: 3rem;
  --space-4xl: 4rem;
  --space-5xl: 6rem;
  --space-6xl: 8rem;
  --space-7xl: 12rem;
}

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  background: var(--color-base);
  color: var(--color-ink);
  position: relative;
  overflow-x: hidden;
  min-width: 320px;
}

/* Section Spacing */
.section {
  padding-top: var(--space-6xl);
  padding-bottom: var(--space-6xl);
}

@media (max-width: 768px) {
  .section {
    padding-top: var(--space-4xl);
    padding-bottom: var(--space-4xl);
  }
}

/* Keeps GSAP's ".stack-btn" scroll-trigger target visible even if a tween
   is interrupted mid-animation (components/Home/Stack/Stack.tsx). */
.stack-btn {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Focus Styles */
*:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 4px;
  border-radius: 4px;
}

/* Selection */
::selection {
  background: oklch(21% 0.015 55 / 0.15);
  color: var(--color-ink);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--color-base);
}

::-webkit-scrollbar-thumb {
  background: oklch(21% 0.015 55 / 0.25);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: oklch(21% 0.015 55 / 0.4);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Mobile-specific fixes */
@media (max-width: 768px) {
  input,
  select,
  textarea,
  button {
    font-size: 16px !important;
  }

  nav {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
}
```

This removes: the old dark-purple `:root` color variables and `--text-*` scale, the noise-gradient `body::before`/`body::after`, `body.light-mode` and its variants, `.card`, `.btn-primary`, `.hire-me-btn`, `.btn-secondary`, `.heading-display`/`.heading-1`/`.heading-2`/`.heading-3`, `.body-large`/`.body`, `.nav-icon`, and the unused `.fade-in-up`/`@keyframes fadeInUp`. It keeps: the new `@theme` tokens, the spacing scale, `.section`, `.stack-btn` (still a live GSAP selector target), and the generic focus/selection/scrollbar/reduced-motion/mobile rules (recolored to the new tokens where they referenced the old ones).

- [x] **Step 3:** Run `npm run build` — expect success.

- [x] **Step 4:** Manual full pass: click through every section of `/build` one more time (nav, hero, about, featured work slider, home projects, stack, experience, testimonials, contact, footer) plus `/build/projects`, a project detail page, and `/build/blog`. Everything should look consistent — light background, ink text, amber accent, Cabinet Grotesk headings — with no leftover dark-purple flashes or unstyled elements.

- [x] **Step 5:** Commit: `git add app/globals.css && git commit -m "chore: remove dead old-theme CSS, /build redesign complete"`

---

## Definition of Done

- [x] `npm run build` and `npm run test` both succeed.
- [x] Every section of `/build` renders in the new light-minimal identity — no old dark-purple styling remains anywhere.
- [x] Every GSAP animation (Nav entrance, Hero stagger, About/Stack/Testimonials/Contact/HomeProjects scroll reveals, the Experience card-deck scroll-hijack, SplashScreen) behaves identically to before this plan — same triggers, same timing, same math.
- [x] The contact form, project navigation (including the home-page preview cards), and the Blog nav button all still work end to end.
- [x] `grep` for the old class names (`card`, `btn-primary`, `btn-secondary`, `hire-me-btn`, `heading-*`, `body-large`, `nav-icon`, `fade-in-up`) across `app` and `components` returns nothing.
- [x] `/build/projects/[projectID]` pages each have their own accurate `<title>`.
