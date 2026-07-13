import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "../usePrefersReducedMotion";

type Listener = (event: MediaQueryListEvent) => void;

function mockMatchMedia(initialMatches: boolean) {
  const listeners: Listener[] = [];
  const mql = {
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_: string, cb: Listener) => {
      listeners.push(cb);
    },
    removeEventListener: (_: string, cb: Listener) => {
      const index = listeners.indexOf(cb);
      if (index !== -1) listeners.splice(index, 1);
    },
    dispatch(nextMatches: boolean) {
      mql.matches = nextMatches;
      listeners.forEach((cb) => cb({ matches: nextMatches } as MediaQueryListEvent));
    },
  };
  window.matchMedia = vi.fn().mockReturnValue(mql);
  return mql;
}

describe("usePrefersReducedMotion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when the media query does not match", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when the media query matches", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("updates when the media query changes after mount", () => {
    const mql = mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mql.dispatch(true);
    });

    expect(result.current).toBe(true);
  });
});
