import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage, { metadata } from "./page";
import { pageMeta } from "@/lib/site";

/**
 * Journey A (page level) — the homepage hero's CTAs are the site's primary
 * conversion actions: "Join Orbit Eight" must route to the contact page and
 * "Explore the cosmos" to the explore page, as real navigation links.
 */
describe("Home page hero CTAs", () => {
  it("keeps the home SEO metadata", () => {
    expect(metadata.title).toBe(pageMeta.home.title);
    expect(metadata.description).toBe(pageMeta.home.description);
  });

  it("routes the primary CTA to /contact", () => {
    render(<HomePage />);

    // The hero CTA and the page-bottom CTA section both render this text;
    // every instance must route to the contact page.
    const links = screen.getAllByRole("link", { name: "Join Orbit Eight" });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/contact");
    }
  });

  it("routes the secondary CTA to /explore", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("link", { name: "Explore the cosmos" })
    ).toHaveAttribute("href", "/explore");
  });
});
