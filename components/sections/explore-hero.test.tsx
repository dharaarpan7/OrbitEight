import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExploreHero } from "./explore-hero";

/**
 * Journey 2 — the redesigned Explore page opens on a cinematic, CSS-only
 * deep-space hero (no second WebGL canvas): archive eyebrow, headline, lede,
 * and a scroll cue that invites the descent into the archive.
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
});
