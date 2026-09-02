import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHero } from "./page-hero";

vi.mock("@splinetool/react-spline", async () => {
  const { useEffect } = await import("react");
  return {
    default: ({
      scene,
      onLoad,
    }: {
      scene: string;
      onLoad?: () => void;
    }) => {
      useEffect(() => {
        onLoad?.();
      });
      return <div data-testid="spline-scene" data-scene={scene} />;
    },
  };
});

/**
 * Journey E (component level) — PageHero renders either a purely
 * typographic opening, a dimmed photographic backdrop, or the decorative
 * Spline 3D backdrop (lazy-loaded client-side, faded in once loaded).
 */
describe("PageHero", () => {
  it("renders a purely typographic hero when no image is given", () => {
    const { container } = render(<PageHero eyebrow="Contact" title="Say hello." />);

    expect(container.querySelector("img")).toBeNull();
    expect(
      container.querySelector("[data-spline-background]")
    ).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Say hello." })
    ).toBeInTheDocument();
  });

  it("renders the supplied image as a backdrop", () => {
    const { container } = render(
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        image="/images/topics/solar-system-1920.webp"
      />
    );

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute(
      "src",
      "/images/topics/solar-system-1920.webp"
    );
  });

  it("renders a Spline backdrop behind the hero type when a scene is given", async () => {
    const { container } = render(
      <PageHero
        eyebrow="Contact"
        title="Say hello."
        spline="/spline/contact-hero.splinecode"
      />
    );

    // The scene mounts into the lazy Spline component and is wrapped in the
    // decorative backdrop container inside the hero section.
    const scene = await screen.findByTestId("spline-scene");
    expect(scene).toHaveAttribute("data-scene", "/spline/contact-hero.splinecode");
    expect(container.querySelector("[data-spline-background]")).not.toBeNull();

    // No photographic layer — the scene is the only backdrop.
    expect(container.querySelector("img")).toBeNull();
    expect(
      screen.getByRole("heading", { name: "Say hello." })
    ).toBeInTheDocument();
  });
});
