"use client";
import Modal from "@/components/Helper/Modal";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Contact from "../Contact/Contact";
import HeroLightBeam from "@/components/Shared/HeroLightBeam";
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
      <HeroLightBeam accent="build" />
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
            I craft premium,{" "}
            <span className="font-[family-name:var(--font-accent-script)] italic text-accent-build">
              interactive
            </span>{" "}
            web experiences that blend bold design with smooth animations. Specializing in GSAP, React, and creating sites that leave an impression.
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
                  quality={90}
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
