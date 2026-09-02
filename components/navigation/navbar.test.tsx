import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./navbar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

/**
 * Journey 1 — the navbar's "Join Orbit Eight" CTA must be transparent
 * (ghost), not the solid solar-flare primary, per the user's request.
 */
describe("Navbar — desktop CTA", () => {
  it("renders the Join CTA as a ghost (transparent) button", () => {
    render(<Navbar />);

    // The mobile-menu copy of the button lives inside a `hidden` container,
    // so the role query only surfaces the desktop one.
    const join = screen.getByRole("link", { name: "Join Orbit Eight" });
    expect(join.className).toContain("btn-ghost");
    expect(join.className).not.toContain("btn-primary");
  });
});
