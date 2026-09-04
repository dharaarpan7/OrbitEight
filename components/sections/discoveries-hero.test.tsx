import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiscoveriesHero } from "./discoveries-hero";

/**
 * Journey 3 — the redesigned Discoveries page opens in the same cinematic
 * language as Explore (varied so the two pages don't read as clones): the
 * record eyebrow, headline, lede, a scroll cue, and the nebula-glare photo
 * behind the type.
 */
describe("DiscoveriesHero", () => {
  it("renders the record eyebrow, headline, lede, and a scroll cue", () => {
    render(<DiscoveriesHero />);

    expect(screen.getByText("The record")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Discover what’s beyond."
    );
    expect(
      screen.getByText("The universe is constantly revealing something new.")
    ).toBeInTheDocument();
    expect(screen.getByText("Read the record")).toBeInTheDocument();
  });

  it("backs the type with the nebula-glare photograph", () => {
    const { container } = render(<DiscoveriesHero />);

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute(
      "src",
      "/images/heroes/discoveries-hero-1920.webp"
    );
    expect(img).toHaveAttribute("aria-hidden", "true");
  });
});
