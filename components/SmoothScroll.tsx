"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      // Let Lenis own in-page anchor jumps. Without this the browser performs
      // its own scroll for an href="#id" click while Lenis keeps animating
      // toward where it thought it was going, and the two fight for the
      // scroll position. Paired with the removal of `scroll-behavior: smooth`
      // in globals.css, which was the third party to that argument.
      anchors: true,
    });

    // Drive Lenis from GSAP's own ticker (instead of a separate rAF loop) and
    // notify ScrollTrigger on every Lenis tick, so pinned/scrubbed triggers
    // (e.g. Experience's card-deck scroll) recalculate in the same frame as
    // the smoothed scroll position instead of lagging a frame behind.
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return null;
}
