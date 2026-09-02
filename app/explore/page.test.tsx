import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ExplorePage, { metadata } from "./page";
import { pageMeta } from "@/lib/site";

/**
 * Journey 2 — the assembled redesigned Explore page: the cinematic hero
 * leads, the featured topic spread and the numbered subject index follow,
 * the closing CTA still routes, and SEO metadata is unchanged.
 */
describe("Explore page (redesigned)", () => {
  it("keeps the Explore SEO metadata", () => {
    expect(metadata.title).toBe(pageMeta.explore.title);
    expect(metadata.description).toBe(pageMeta.explore.description);
  });

  it("opens with the cinematic hero copy", () => {
    render(<ExplorePage />);

    expect(screen.getByText("Explore the cosmos.")).toBeInTheDocument();
    expect(screen.getByText("Begin the descent")).toBeInTheDocument();
  });

  it("features Cosmology with its photograph in the editorial spread", () => {
    render(<ExplorePage />);

    expect(screen.getByText("The largest view")).toBeInTheDocument();
    // The featured visual is the cosmology photo, scoped to the spread so
    // the index thumbnail for the same topic doesn't satisfy the check.
    const spread = screen
      .getByText("The largest view")
      .closest("section") as HTMLElement;
    const img = spread.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/images/topics/cosmology-640.webp");
    // No broken "Invalid Date" from the undated feature.
    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Read about cosmology/ })
    ).toHaveAttribute("href", "/discoveries");
  });

  it("keeps the numbered subject index with every topic", () => {
    render(<ExplorePage />);

    expect(screen.getByText("The subjects")).toBeInTheDocument();
    // The index renders every topic once (the featured spread no longer
    // duplicates one of them).
    for (const topic of ["Astronomy", "Black holes", "Astrophotography"]) {
      expect(screen.getAllByText(topic).length).toBe(1);
    }
  });

  it("closes with CTAs routed to /contact and /discoveries", () => {
    render(<ExplorePage />);

    for (const link of screen.getAllByRole("link", {
      name: "Join Orbit Eight",
    })) {
      expect(link).toHaveAttribute("href", "/contact");
    }
    expect(
      screen.getByRole("link", { name: /Read the discoveries/ })
    ).toHaveAttribute("href", "/discoveries");
  });
});
