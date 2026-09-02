import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlackHoleHeroSection } from "./blackhole-hero-section";

/**
 * Journey 3 and 6 — the locked engine's render contract in a DOM without
 * WebGL (jsdom): it must mount, keep its canvas out of the a11y tree, keep
 * the copy reachable, and degrade quietly instead of crashing.
 */
describe("BlackHoleHeroSection (locked component)", () => {
  it("renders the host, an aria-hidden canvas, and children above it", () => {
    render(
      <BlackHoleHeroSection>
        <p>Copilot copy</p>
      </BlackHoleHeroSection>
    );

    const canvas = document.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Copilot copy")).toBeInTheDocument();
  });

  it("degrades gracefully without WebGL: marks the host, never throws", () => {
    // jsdom's canvas.getContext returns null, which drives the component's
    // own giveUp("unsupported") path — the exact path a browser without
    // WebGL takes.
    const { container } = render(
      <BlackHoleHeroSection>
        <p>Fallback copy</p>
      </BlackHoleHeroSection>
    );

    const host = container.firstElementChild as HTMLElement;
    expect(host.dataset.webgl).toBe("unsupported");
    // The copy survives the fallback — the reading half stays readable.
    expect(screen.getByText("Fallback copy")).toBeInTheDocument();
  });
});
