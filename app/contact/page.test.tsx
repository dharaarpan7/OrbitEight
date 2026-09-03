import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage, { metadata } from "./page";
import { pageMeta } from "@/lib/site";

/**
 * Journey H — the Contact page opens with the Spline 3D scene as a
 * decorative backdrop behind the hero type: lazy-loaded client-only (never
 * blocking first paint), aria-hidden and pointer-inert so the page stays
 * fully interactive, fading in once the scene reports it is ready. The
 * scene is self-hosted (skill recommendation) rather than fetched from
 * prod.spline.design. No photographic layer — the scene is the only
 * backdrop, so nothing overlaps it. SEO metadata is unchanged.
 */
vi.mock("@/components/ui/spline-canvas", async () => {
  const { useEffect } = await import("react");
  const SplineCanvas = ({
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
  };
  return { default: SplineCanvas, SplineCanvas };
});

describe("Contact page", () => {
  it("keeps the Contact SEO metadata", () => {
    expect(metadata.title).toBe(pageMeta.contact.title);
    expect(metadata.description).toBe(pageMeta.contact.description);
  });

  it("opens with the hero copy", () => {
    render(<ContactPage />);

    expect(screen.getByText("Say hello.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Questions, ideas, observations, collaborations — the inbox is open. So is the sky."
      )
    ).toBeInTheDocument();
  });

  it("renders the self-hosted Spline scene behind the hero type", async () => {
    render(<ContactPage />);

    // The Spline component is lazy-loaded — wait for it to resolve before
    // asserting on the wrapper structure around it.
    const scene = await screen.findByTestId("spline-scene");
    expect(scene).toHaveAttribute("data-scene", "/spline/contact-hero.splinecode");

    // Decorative only: aria-hidden, non-interactive, absolutely positioned.
    const backdrop = scene.closest("[data-spline-background]") as HTMLElement;
    expect(backdrop).not.toBeNull();
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop.className).toContain("pointer-events-none");
    expect(backdrop.className).toContain("absolute");
    expect(backdrop.className).toContain("inset-0");
  });

  it("fades the scene in once the runtime reports it is loaded", async () => {
    const { container } = render(<ContactPage />);

    const canvasWrap = container.querySelector(
      "[data-spline-canvas]"
    ) as HTMLElement;
    expect(canvasWrap).not.toBeNull();

    await screen.findByTestId("spline-scene");
    expect(canvasWrap.className).toContain("opacity-100");
    expect(canvasWrap.className).toContain("transition-opacity");
  });

  it("renders no photographic layer overlapping the scene", () => {
    render(<ContactPage />);

    expect(document.querySelector("img")).toBeNull();
  });
});
