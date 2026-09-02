import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage, { metadata } from "./page";
import { pageMeta } from "@/lib/site";

/**
 * Journey 1, 4, 5 — the assembled About page: the black hole hero leads,
 * the story sections survive the redesign with the new bridge in place,
 * the final CTA still routes correctly, and SEO metadata is unchanged.
 */
describe("About page", () => {
  it("keeps the About SEO metadata", () => {
    expect(metadata.title).toBe(pageMeta.about.title);
    expect(metadata.description).toBe(pageMeta.about.description);
  });

  it("opens with the black hole hero copy", () => {
    render(<AboutPage />);

    expect(
      screen.getByText("A place for people who look beyond Earth.")
    ).toBeInTheDocument();
    // The hero and the final CTA both carry this link; both must route home.
    const join = screen.getAllByRole("link", { name: "Join Orbit Eight" });
    expect(join.length).toBeGreaterThanOrEqual(1);
    for (const link of join) expect(link).toHaveAttribute("href", "/contact");
  });

  it("bridges from the hero into the story, then keeps the existing sections", () => {
    render(<AboutPage />);

    // Journey 5 — the bridge from the black hole into the narrative.
    expect(screen.getByText("The eighth orbit")).toBeInTheDocument();
    expect(
      screen.getByText("Past the edge of the familiar.")
    ).toBeInTheDocument();

    // The editorial sections survive the redesign.
    expect(screen.getByText("Why we exist")).toBeInTheDocument();
    expect(screen.getByText("Who it is for")).toBeInTheDocument();
    expect(screen.getByText("Our vision")).toBeInTheDocument();
  });

  it("closes with the final CTA routed to /contact and /explore", () => {
    render(<AboutPage />);

    for (const link of screen.getAllByRole("link", { name: "Join Orbit Eight" })) {
      expect(link).toHaveAttribute("href", "/contact");
    }
    for (const link of screen.getAllByRole("link", {
      name: "Explore the cosmos",
    })) {
      expect(link).toHaveAttribute("href", "/explore");
    }
  });
});
