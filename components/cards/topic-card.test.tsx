import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopicCard } from "./topic-card";
import { topics } from "@/lib/data";

/**
 * Journey (home "Explore the cosmos") — the topic card renders the topic's
 * image in the right element for its format (SVG illustration vs webp
 * photograph) and routes to its Explore anchor.
 */
describe("TopicCard", () => {
  it("renders an SVG topic through the object element", () => {
    const planets = topics.find((t) => t.slug === "planets")!;
    const { container } = render(<TopicCard topic={planets} />);

    const object = container.querySelector('object[type="image/svg+xml"]');
    expect(object).not.toBeNull();
    expect(object).toHaveAttribute("data", planets.image);
  });

  it("renders a photographed topic as an img with its optimized src", () => {
    const astronomy = topics.find((t) => t.slug === "astronomy")!;
    const { container } = render(<TopicCard topic={astronomy} />);

    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", astronomy.image);
    expect(astronomy.image).toMatch(/-640\.webp$/);
  });

  it("links to the topic's Explore anchor with its title", () => {
    const cosmology = topics.find((t) => t.slug === "cosmology")!;
    render(<TopicCard topic={cosmology} />);

    const link = screen.getByRole("link", { name: /Cosmology/ });
    expect(link).toHaveAttribute("href", "/explore#cosmology");
  });
});
