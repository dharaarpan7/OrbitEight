import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DiscoveriesPage, { metadata } from "./page";
import { pageMeta } from "@/lib/site";

/**
 * Journey 3 — the assembled redesigned Discoveries page: cinematic hero,
 * featured spread, timeline feed, phenomena, explainers, closing CTA, and
 * unchanged SEO metadata.
 */
describe("Discoveries page (redesigned)", () => {
  it("keeps the Discoveries SEO metadata", () => {
    expect(metadata.title).toBe(pageMeta.discoveries.title);
    expect(metadata.description).toBe(pageMeta.discoveries.description);
  });

  it("opens with the cinematic hero copy", () => {
    render(<DiscoveriesPage />);

    expect(screen.getByText("Discover what’s beyond.")).toBeInTheDocument();
    expect(screen.getByText("Read the record")).toBeInTheDocument();
  });

  it("leads with the featured discovery in a magazine spread", () => {
    render(<DiscoveriesPage />);

    expect(
      screen.getByText("The galaxies that arrived too early")
    ).toBeInTheDocument();
  });

  it("keeps the timeline feed, phenomena, and explainers", () => {
    render(<DiscoveriesPage />);

    expect(
      screen.getByText("Latest discoveries")
    ).toBeInTheDocument();
    expect(screen.getByText("Enceladus is still venting its ocean")).toBeInTheDocument();
    expect(screen.getByText("Solar eclipses")).toBeInTheDocument();
    expect(screen.getByText("How do we detect exoplanets?")).toBeInTheDocument();
  });

  /**
   * Journey C — a reader following a card's "Read discovery" link lands on
   * the timeline entry itself: each entry renders the id the cards link to.
   */
  it("gives every timeline entry an anchor id that the cards link to", () => {
    render(<DiscoveriesPage />);

    const readLinks = screen.getAllByRole("link", {
      name: /Read discovery/,
    });
    expect(readLinks.length).toBeGreaterThan(0);

    const container = readLinks[0].closest("main, body") ?? document.body;
    for (const link of readLinks) {
      const href = link.getAttribute("href") ?? "";
      const slug = href.split("#")[1];
      const target = container.querySelector(`#${slug}`);
      expect(target).not.toBeNull();
    }
  });

  it("closes with CTAs routed to /contact and /explore", () => {
    render(<DiscoveriesPage />);

    for (const link of screen.getAllByRole("link", {
      name: "Join Orbit Eight",
    })) {
      expect(link).toHaveAttribute("href", "/contact");
    }
    expect(
      screen.getByRole("link", { name: /Explore the subjects/ })
    ).toHaveAttribute("href", "/explore");
  });
});
