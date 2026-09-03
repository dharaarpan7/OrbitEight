import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { SplineBackground } from "./spline-background";

/**
 * Journey H (component level) — the Spline scene is a purely decorative
 * hero backdrop: a non-interactive, screen-reader-hidden container that
 * lazy-loads the scene client-side (never blocking first paint) and fades
 * it in once the runtime reports the scene is ready.
 */
vi.mock("./spline-canvas", async () => {
  const { useEffect } = await import("react");
  return {
    SplineCanvas: ({
      scene,
      onLoad,
    }: {
      scene: string;
      onLoad?: () => void;
    }) => {
      useEffect(() => {
        onLoad?.();
      });
      return <canvas data-testid="spline-scene" data-scene={scene} />;
    },
  };
});

describe("SplineBackground", () => {
  it("renders a decorative, non-interactive backdrop container", async () => {
    render(<SplineBackground scene="/spline/contact-hero.splinecode" />);

    // The Spline component is lazy-loaded — wait for it to resolve before
    // asserting on the wrapper structure around it.
    const scene = await screen.findByTestId("spline-scene");
    const backdrop = scene.closest("[data-spline-background]") as HTMLElement;
    expect(backdrop).not.toBeNull();
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop.className).toContain("pointer-events-none");
    expect(backdrop.className).toContain("absolute");
    expect(backdrop.className).toContain("inset-0");
  });

  it("loads the scene into the lazy Spline component", async () => {
    render(<SplineBackground scene="/spline/contact-hero.splinecode" />);

    await waitFor(() => {
      expect(screen.getByTestId("spline-scene")).toBeInTheDocument();
    });
    expect(screen.getByTestId("spline-scene")).toHaveAttribute(
      "data-scene",
      "/spline/contact-hero.splinecode"
    );
  });

  it("fades the scene in once the runtime reports it is loaded", async () => {
    const { container } = render(
      <SplineBackground scene="/spline/contact-hero.splinecode" />
    );

    const canvasWrap = container.querySelector(
      "[data-spline-canvas]"
    ) as HTMLElement;
    expect(canvasWrap).not.toBeNull();

    await waitFor(() => {
      expect(canvasWrap.className).toContain("opacity-100");
    });
    expect(canvasWrap.className).toContain("transition-opacity");
  });
});
