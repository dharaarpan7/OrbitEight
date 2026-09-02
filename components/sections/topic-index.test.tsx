import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopicIndex } from "./topic-index";
import { topics } from "@/lib/data";

/**
 * Journey 2 — the topic archive becomes a numbered index (01–12): every
 * subject is a large typographic row, searchable, and each row leads onward
 * to the discoveries.
 */
describe("TopicIndex", () => {
  it("renders every topic as a numbered row, 01 through 12", () => {
    render(<TopicIndex />);

    for (const topic of topics) {
      expect(screen.getByText(topic.title)).toBeInTheDocument();
    }
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("shows each topic's image as a row thumbnail", () => {
    const { container } = render(<TopicIndex />);

    const thumbs = container.querySelectorAll("img");
    expect(thumbs.length).toBe(topics.length);
    expect(thumbs[0]).toHaveAttribute("src", topics[0].image);
    expect(thumbs[3]).toHaveAttribute("src", topics[3].image);
  });

  it("links each row onward to the discoveries", () => {
    render(<TopicIndex />);

    const first = screen.getByRole("link", { name: /Astronomy/ });
    expect(first).toHaveAttribute("href", "/discoveries");
  });

  it("narrows the index when the archive is searched", () => {
    render(<TopicIndex />);

    fireEvent.change(screen.getByLabelText("Search topics"), {
      target: { value: "black" },
    });

    expect(screen.getByText("Black holes")).toBeInTheDocument();
    expect(screen.queryByText("Astronomy")).not.toBeInTheDocument();
  });
});
