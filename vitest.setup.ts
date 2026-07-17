import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia. Default to "no match" so components
// using usePrefersReducedMotion (or other media queries) render normally
// instead of throwing; tests that care about a specific match override
// window.matchMedia themselves (see hooks/__tests__/usePrefersReducedMotion.test.ts).
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
