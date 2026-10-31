"use client";

import { useEffect, type RefObject } from "react";

/**
 * ClipPro analytics, browser side: a small queue flushed with sendBeacon to
 * /api/clippro/events (every few seconds, and when the page is hidden or left). No cookies; a
 * random id per tab (sessionStorage) ties one visit's events together.
 */

export type Surface = "build" | "animate" | "resources" | "page";
type EventType = "view" | "impression" | "dwell" | "scroll" | "time" | "click";

interface QueuedEvent {
  type: EventType;
  surface: Surface;
  label?: string;
  value?: number;
}

const ENDPOINT = "/api/clippro/events";
const queue: QueuedEvent[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;
let listening = false;

export function sessionId(): string {
  try {
    let id = sessionStorage.getItem("clippro-session");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("clippro-session", id);
    }
    return id;
  } catch {
    return "no-storage-session";
  }
}

function context() {
  const params = new URLSearchParams(location.search);
  const utm = {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
  };
  return {
    sessionId: sessionId(),
    path: location.pathname,
    referrer: document.referrer || undefined,
    utm: utm.source || utm.medium || utm.campaign ? utm : undefined,
  };
}

export function flush() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (!queue.length) return;
  const events = queue.splice(0, 25);
  const body = JSON.stringify({ ...context(), events });
  try {
    const sent = navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }));
    if (!sent) void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
  } catch {
    // Analytics never gets in the way.
  }
  if (queue.length) flush();
}

export function track(type: EventType, surface: Surface, label?: string, value?: number) {
  if (typeof window === "undefined") return;
  queue.push({ type, surface, ...(label ? { label } : {}), ...(value !== undefined ? { value: Math.round(value) } : {}) });
  if (!listening) {
    listening = true;
    // Hidden tabs and closing pages are the last chance to send anything.
    document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush());
    window.addEventListener("pagehide", flush);
  }
  if (!timer) timer = setTimeout(flush, 4000);
}

/** Where a download button sends the visitor: the redirect that counts the download. */
export function downloadHref(version: string, surface: Surface): string {
  const s = typeof window === "undefined" ? "" : `&s=${encodeURIComponent(sessionId())}`;
  return `/api/clippro/download?v=${encodeURIComponent(version)}&from=${surface}${s}`;
}

/**
 * Records when a ClipPro section first comes into view (half of it on screen) and, when the
 * visitor leaves or the section scrolls away, how long it was visible in total.
 */
export function useImpression(ref: RefObject<HTMLElement | null>, surface: Surface) {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let seen = false;
    let since: number | null = null;
    let total = 0;
    let reported = false;
    const stop = () => {
      if (since !== null) {
        total += performance.now() - since;
        since = null;
      }
    };
    const report = () => {
      stop();
      if (seen && !reported && total >= 500) {
        reported = true;
        track("dwell", surface, undefined, total);
        flush();
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (!seen) {
            seen = true;
            track("impression", surface);
          }
          if (document.visibilityState === "visible") since = performance.now();
        } else {
          stop();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    const onVis = () => {
      if (document.visibilityState === "hidden") report();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", report);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", report);
      report();
    };
  }, [ref, surface]);
}
