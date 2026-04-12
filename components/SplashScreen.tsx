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
    <div
      className="splash-screen fixed inset-0 z-[10003] flex items-center justify-center"
      style={{
        background: 'oklch(0.18 0.04 285)',
      }}
    >
      <div
        className="splash-text opacity-0"
        style={{
          transform: 'translateY(30px)',
        }}
      >
        <h1
          className="heading-display text-center"
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            color: 'var(--color-text-primary)',
          }}
        >
          OKATA<br />MIRACLE
        </h1>
        <p
          className="text-center mt-4 font-mono text-sm tracking-widest"
          style={{ color: 'var(--color-accent-bright)' }}
        >
          FRONTEND DEVELOPER
        </p>
      </div>
    </div>
  );
}
