import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Hero from "./animated-shader-hero";

/**
 * Journey A — the hero's CTAs are the site's primary conversion actions:
 * when a button carries an href it must render as a real navigation link,
 * and the onClick fallback must keep working for action buttons.
 * Journey B — the WebGL pointer handlers attach canvas listeners; those
 * listeners must be removed when the component unmounts, so a StrictMode
 * remount never leaves a stale handler on the canvas.
 */

/** Minimal WebGL2 stand-in: every method is a no-op returning an object,
 *  enough to carry the renderer through setup/render without a GPU. */
const glStub = new Proxy(
  {},
  {
    get: () => () => ({}),
  }
) as unknown as WebGL2RenderingContext;

describe("Hero CTAs", () => {
  it("renders the primary button as a link when it carries an href", () => {
    render(
      <Hero
        headline={{ line1: "Look beyond", line2: "the horizon." }}
        subtitle="Test subtitle"
        buttons={{
          primary: { text: "Join Orbit Eight", href: "/contact" },
        }}
      />
    );

    expect(screen.getByRole("link", { name: "Join Orbit Eight" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders the secondary button as a link when it carries an href", () => {
    render(
      <Hero
        headline={{ line1: "Look beyond", line2: "the horizon." }}
        subtitle="Test subtitle"
        buttons={{
          secondary: { text: "Explore the cosmos", href: "/explore" },
        }}
      />
    );

    expect(
      screen.getByRole("link", { name: "Explore the cosmos" })
    ).toHaveAttribute("href", "/explore");
  });

  it("falls back to a button with onClick when no href is given", () => {
    const onClick = vi.fn();
    render(
      <Hero
        headline={{ line1: "Look beyond", line2: "the horizon." }}
        subtitle="Test subtitle"
        buttons={{
          primary: { text: "Do a thing", onClick },
        }}
      />
    );

    const button = screen.getByRole("button", { name: "Do a thing" });
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("Hero pointer handler cleanup", () => {
  const baseProps = {
    headline: { line1: "Look beyond", line2: "the horizon." },
    subtitle: "Test subtitle",
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("removes the canvas pointer listeners on unmount", () => {
    // A GPU-less jsdom never reaches the effect body, so stub the context.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(glStub);
    // Reduced motion keeps the rAF loop from starting under the stub.
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    const removeSpy = vi.spyOn(HTMLCanvasElement.prototype, "removeEventListener");

    try {
      const { unmount } = render(<Hero {...baseProps} />);
      unmount();

      for (const type of ["pointerdown", "pointerup", "pointerleave", "pointermove"]) {
        expect(removeSpy).toHaveBeenCalledWith(type, expect.any(Function));
      }
    } finally {
      window.matchMedia = original;
    }
  });
});
