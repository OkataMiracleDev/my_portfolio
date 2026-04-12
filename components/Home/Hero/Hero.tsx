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
      
      // Stagger text animations
      tl.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
      })
      .from(nameRef.current?.children || [], {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
      }, "-=0.4")
      .from(descRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      }, "-=0.6")
      .from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, "-=0.4")
      .from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        rotation: 5,
        duration: 1.2,
      }, "-=1")
      .from([decorRef1.current, decorRef2.current], {
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
      }, "-=0.8");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden" id="home">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-32">
        {/* Left Column - Text */}
        <div className="space-y-8">
          <div className="space-y-4">
            <p 
              ref={subtitleRef}
              className="text-sm uppercase tracking-[0.3em] font-mono" 
              style={{ color: 'var(--color-accent-bright)' }}
            >
              Frontend Developer
            </p>
            <h1 
              ref={nameRef}
              className="heading-display"
              style={{ 
                fontFamily: 'var(--font-space-grotesk)',
              }}
            >
              <span className="inline-block">OKATA</span>
              <br />
              <span className="inline-block">MIRACLE</span>
            </h1>
          </div>
          
          <p 
            ref={descRef}
            className="body-large max-w-lg"
          >
            I craft premium, interactive web experiences that blend bold design with smooth animations. Specializing in GSAP, React, and creating sites that leave an impression.
          </p>

          <button
            ref={ctaRef}
            onClick={() => setOpenModal(true)}
            className="btn-primary group inline-flex items-center gap-3 relative z-10 hire-me-btn"
          >
            <span>Let&apos;s Work Together</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Right Column - Image */}
        <div ref={imageRef} className="relative">
          <div className="relative aspect-square max-w-md mx-auto">
            {/* Decorative elements */}
            <div 
              ref={decorRef1}
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full blur-3xl opacity-40"
              style={{ background: 'oklch(0.65 0.25 285)' }}
            />
            <div 
              ref={decorRef2}
              className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ background: 'oklch(0.55 0.22 270)' }}
            />
            
            {/* Image container */}
            <div className="relative z-10 card p-4 hover:scale-105 transition-transform duration-500">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/Miracle_Okata.jpg"
                  alt="Okata Miracle"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Floating badge */}
            <div 
              className="absolute -bottom-4 -right-4 card px-6 py-4 z-20"
              style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
            >
              <p className="text-sm font-mono" style={{ color: 'var(--color-accent-bright)' }}>
                @mimi_codes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <Contact />
      </Modal>
    </div>
  );
};

export default Hero;
