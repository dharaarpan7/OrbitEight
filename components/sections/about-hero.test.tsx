import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { AboutHero } from "./about-hero";

/**
 * Journey 1, 2, 4 — the About hero wrapper's contract with the locked
 * engine: what copy it renders, where its CTAs lead, and which props it
 * passes for wide vs narrow viewports. The WebGL engine itself is mocked
 * (jsdom has no real WebGL); it is covered separately by its own test file.
 */
vi.mock("@/components/ui/blackhole-hero-section", async () => {
  const React = await import("react");
  return {
    // Children are React elements whose dev-mode internals are circular —
    // serialize the engine props only, and render children straight through.
    BlackHoleHeroSection: ({
      children,
      ...engineProps
    }: Record<string, unknown>) =>
      React.createElement(
        "div",
        {
          "data-testid": "blackhole",
          "data-props": JSON.stringify(engineProps),
        },
        children as never
      ),
  };
});

/** Replace the matchMedia stub with one returning a fixed match state. */
function setNarrow(matches: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query === "(max-width: 767px)" ? matches : false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function renderedProps(): Record<string, unknown> {
  return JSON.parse(
    screen.getByTestId("blackhole").getAttribute("data-props") || "{}"
  );
}

beforeEach(() => {
  setNarrow(false);
});

describe("AboutHero — copy (journey 1)", () => {
  it("renders the About eyebrow, headline, and lede", () => {
    render(<AboutHero />);

    expect(screen.getByText("About")).toBeInTheDocument();
    expect(
      screen.getByText("A place for people who look beyond Earth.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Orbit Eight is a community of space enthusiasts — possessed by wonder, and careful with it."
      )
    ).toBeInTheDocument();
  });
});

describe("AboutHero — hero CTAs removed (journey 4)", () => {
  it("renders no CTA links in the hero — conversion lives in the page's bottom CTA section", () => {
    render(<AboutHero />);

    expect(screen.queryByRole("link", { name: "Join Orbit Eight" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Explore the cosmos" })).toBeNull();
    // The reading copy itself stays.
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});

describe("AboutHero — engine props (journeys 1 and 2)", () => {
  it("uses the brand solar-flare mid tone for the disc", () => {
    render(<AboutHero />);
    expect(renderedProps().midColor).toBe("#F5A623");
  });

  it("frames the hole right with a left scrim on wide viewports", () => {
    setNarrow(false);
    render(<AboutHero />);

    expect(renderedProps().focus).toEqual([0.72, 0.46]);
    expect(renderedProps().scrim).toBe("left");
  });

  it("turns the layout 90° on narrow viewports: hole low, scrim from the top", () => {
    setNarrow(true);
    render(<AboutHero />);

    expect(renderedProps().focus).toEqual([0.5, 0.76]);
    expect(renderedProps().scrim).toBe("top");
  });

  it("reduces the ray count on narrow viewports", () => {
    setNarrow(true);
    render(<AboutHero />);
    expect(renderedProps().steps).toBeLessThan(300);
  });
});

describe("AboutHero — scroll-time throttling (journey 4)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setNarrow(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("drops the ray budget while the page is scrolling and restores it at rest", () => {
    render(<AboutHero />);

    // At rest, wide viewports get the rebalanced budget — full 300 steps
    // measures ~120ms/frame on an Intel HD 520, so the baseline is 240.
    expect(renderedProps().steps).toBe(240);
    expect(renderedProps().resolution).toBe(0.6);

    // The moment the page scrolls, the engine gets a cheaper ray budget so
    // the raymarch never competes with the scroll for the frame budget.
    // `steps` is a uniform-only change: it takes effect on the very next
    // frame without rebuilding render targets, so the accumulated image
    // history is preserved and the frame never pops.
    act(() => {
      fireEvent.scroll(window);
    });
    expect(renderedProps().steps).toBe(90);

    // Resolution, maxDpr, and style MUST stay constant through the scroll
    // cycle. Changing them mid-scroll forces the engine's ResizeObserver
    // path, which drops the render targets, resets the temporal-average
    // history (settled = 0), and slams a single low-resolution sample on
    // screen at alpha = 1 — twice per scroll burst, once each for the
    // cheapen and the restore. That visible pop is the flicker this test
    // guards against ever coming back.
    expect(renderedProps().resolution).toBe(0.6);
    expect(renderedProps().maxDpr).toBe(1.75);
    expect(renderedProps().style).toBeUndefined();

    // A short cooldown after scrolling stops, then the rest budget returns.
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(renderedProps().steps).toBe(240);
    expect(renderedProps().resolution).toBe(0.6);
    expect(renderedProps().maxDpr).toBe(1.75);
    expect(renderedProps().style).toBeUndefined();
  });
});
