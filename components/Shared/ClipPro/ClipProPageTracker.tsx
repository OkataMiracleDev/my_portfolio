"use client";

import { useEffect } from "react";
import { flush, track } from "@/lib/clippro-track";

/**
 * /build/clippro analytics: the view, the deepest scroll milestone reached (25/50/75/100% of
 * the page), and active time on the page (only while the tab is visible), sent when the visitor
 * leaves or switches away. Renders nothing.
 */
export default function ClipProPageTracker() {
  useEffect(() => {
    track("view", "page");
    const reached = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max <= 0 ? 100 : (window.scrollY / max) * 100;
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m - 1 && !reached.has(m)) {
          reached.add(m);
          track("scroll", "page", String(m));
        }
      }
    };
    let active = 0;
    let since: number | null = document.visibilityState === "visible" ? performance.now() : null;
    let sent = false;
    const pause = () => {
      if (since !== null) {
        active += performance.now() - since;
        since = null;
      }
    };
    const leave = () => {
      pause();
      if (!sent && active >= 1000) {
        sent = true;
        track("time", "page", undefined, active);
      }
      flush();
    };
    const onVis = () => {
      if (document.visibilityState === "hidden") leave();
      else if (since === null) since = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", leave);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", leave);
      leave();
    };
  }, []);
  return null;
}
