import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TopicCard } from "./topic-card";
import { topics } from "@/lib/data";

/**
 * Journey (home "Explore the cosmos") — every topic card ships the topic's
 * optimized 640px photograph (all twelve topics are webp images now; the
 * SVG-placeholder branch of EditorialImage no longer applies to topics) and
 * routes to its Explore anchor.
 */
describe("TopicCard", () => {
  it("renders every topic as an optimized webp photograph", () => {
    for (const topic of topics) {
      const { container, unmount } = render(<TopicCard topic={topic} />);

      const img = container.querySelector("img");
      expect(img, topic.slug).not.toBeNull();
      expect(img).toHaveAttribute("src", topic.image);
      expect(topic.image, topic.slug).toMatch(/-640\.webp$/);
      // No topic is an SVG illustration anymore — no <object> fallback path.
      expect(
        container.querySelector('object[type="image/svg+xml"]'),
      ).toBeNull();

      unmount();
    }
  });

  it("links to the topic's Explore anchor with its title", () => {
    const cosmology = topics.find((t) => t.slug === "cosmology")!;
    render(<TopicCard topic={cosmology} />);

    const link = screen.getByRole("link", { name: /Cosmology/ });
    expect(link).toHaveAttribute("href", "/explore#cosmology");
  });
});
