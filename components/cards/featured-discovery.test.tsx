import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeaturedDiscovery } from "./featured-discovery";
import type { Discovery } from "@/lib/data";

/**
 * Journey 1 — the featured spread accepts both illustration styles: SVG
 * discoveries keep the <object> render path, photographic (webp) topics
 * render as <img>. An undated feature (the Explore spread passes date: "")
 * hides the date instead of printing "Invalid Date".
 */
const base: Discovery = {
  slug: "test-feature",
  category: "Astronomy",
  date: "2026-08-14",
  title: "A dated feature",
  summary: "Summary text.",
  readingTime: 6,
  image: "/images/discoveries/europa.svg",
};

describe("FeaturedDiscovery", () => {
  it("renders SVG-backed discoveries through the object element", () => {
    const { container } = render(<FeaturedDiscovery discovery={base} />);

    const object = container.querySelector('object[type="image/svg+xml"]');
    expect(object).not.toBeNull();
    // The <img> inside is the object's fallback and carries the same src.
    expect(object?.querySelector("img")).toHaveAttribute(
      "src",
      "/images/discoveries/europa.svg"
    );
  });

  it("renders webp-backed discoveries as an img with the image src", () => {
    const webp: Discovery = {
      ...base,
      image: "/images/topics/cosmology-640.webp",
    };
    const { container } = render(<FeaturedDiscovery discovery={webp} />);

    expect(container.querySelector("object")).toBeNull();
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "/images/topics/cosmology-640.webp");
  });

  it("hides the date entirely when the feature is undated", () => {
    const undated: Discovery = { ...base, date: "" };
    render(<FeaturedDiscovery discovery={undated} />);

    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("time") ?? null).toBeNull();
    expect(screen.queryByText("·")).not.toBeInTheDocument();
  });

  it("shows a human-formatted date when one is supplied", () => {
    render(<FeaturedDiscovery discovery={base} />);

    expect(screen.getByText("Aug 14, 2026")).toBeInTheDocument();
  });
});
