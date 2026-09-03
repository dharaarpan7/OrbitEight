import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiscoveryCard } from "./discovery-card";
import type { Discovery } from "@/lib/data";

/**
 * Journey D — an undated discovery must omit the date entirely rather than
 * render "Invalid Date" text or an invalid <time dateTime=""> element.
 * (The sibling featured-discovery card already guards this; this card must
 * too, since app/explore passes date: "" for the undated feature.)
 */
const dated: Discovery = {
  slug: "early-galaxies",
  category: "Cosmology",
  date: "2026-08-28",
  title: "The galaxies that arrived too early",
  summary: "JWST keeps finding galaxies that formed too soon.",
  readingTime: 6,
  image: "/icon.svg",
};

const undated: Discovery = { ...dated, slug: "undated-entry", date: "" };

const photographed: Discovery = {
  ...dated,
  slug: "fast-radio-burst-repeat",
  image: "/images/discoveries/fast-radio-burst-640.webp",
};

describe("DiscoveryCard", () => {
  it("renders the formatted date for a dated discovery", () => {
    render(<DiscoveryCard discovery={dated} />);

    const time = screen.getByText("Aug 28, 2026");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("datetime", "2026-08-28");
  });

  it("omits the date entirely for an undated discovery", () => {
    const { container } = render(<DiscoveryCard discovery={undated} />);

    expect(screen.queryByText(/Invalid Date/i)).not.toBeInTheDocument();
    expect(container.querySelector("time")).toBeNull();
  });

  it("links to the discovery's own anchor on the timeline", () => {
    render(<DiscoveryCard discovery={dated} />);

    expect(
      screen.getByRole("link", { name: /Read discovery/ })
    ).toHaveAttribute("href", "/discoveries#early-galaxies");
  });

  it("stays text-only by default so home preview rows stay compact", () => {
    const { container } = render(<DiscoveryCard discovery={photographed} />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("object")).toBeNull();
  });

  it("renders the photograph when the timeline asks for an image", () => {
    const { container } = render(
      <DiscoveryCard discovery={photographed} withImage />
    );

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", photographed.image);
    // Photographs take the <img> path — no SVG <object> fallback.
    expect(container.querySelector("object")).toBeNull();
  });

  it("renders an SVG illustration through the object element when asked", () => {
    const { container } = render(<DiscoveryCard discovery={dated} withImage />);

    const object = container.querySelector('object[type="image/svg+xml"]');
    expect(object).not.toBeNull();
    expect(object).toHaveAttribute("data", dated.image);
  });
});
