import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Journey F — the site must have a browser-tab icon. Next.js auto-serves
 * app/icon.svg as the favicon when the file exists, so the guarantee is
 * simply that a well-formed SVG icon is present.
 */
describe("favicon", () => {
  it("ships a well-formed SVG icon at app/icon.svg", () => {
    const iconPath = path.resolve(__dirname, "icon.svg");
    const svg = readFileSync(iconPath, "utf8");

    expect(svg.trimStart().startsWith("<svg")).toBe(true);
    expect(svg).toContain("viewBox=");
  });
});
