import "@testing-library/jest-dom/vitest";

/**
 * jsdom has no matchMedia. Components guard with typeof checks, but the
 * narrow-viewport tests need to drive it, so install a controllable stub:
 * tests replace window.matchMedia when they need specific matches.
 */
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

/**
 * jsdom has no IntersectionObserver either. <Reveal> and the black hole
 * component both construct one; a never-firing stub keeps them renderable
 * (content stays in the DOM — visibility is CSS opacity, not unmounting).
 */
if (typeof window !== "undefined" && typeof IntersectionObserver === "undefined") {
  class IntersectionObserverStub implements IntersectionObserver {
    root = null;
    rootMargin = "";
    thresholds: ReadonlyArray<number> = [];
    constructor(_callback: IntersectionObserverCallback) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
}
