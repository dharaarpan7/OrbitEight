import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExploreHero } from "./explore-hero";

/**
 * Journey 2 — the redesigned Explore page opens on a cinematic hero (no
 * WebGL canvas): archive eyebrow, headline, lede, a scroll cue that invites
 * the descent into the archive, and the star-funnel photo behind the type.
 */
describe("ExploreHero", () => {
  it("renders the archive eyebrow, headline, lede, and a scroll cue", () => {
    render(<ExploreHero />);

    expect(screen.getByText("The archive")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Explore the cosmos."
    );
    expect(
      screen.getByText(
        "From the smallest worlds to the largest structures in the universe, there is always more to understand."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Begin the descent")).toBeInTheDocument();
  });

  it("backs the type with the star-funnel photograph", () => {
    const { container } = render(<ExploreHero />);

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/images/heroes/explore-hero-1920.webp");
    expect(img).toHaveAttribute("aria-hidden", "true");
  });
});
