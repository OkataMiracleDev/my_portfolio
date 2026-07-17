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
