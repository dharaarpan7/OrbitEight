import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { topics, discoveries, featuredDiscovery } from "./data";

/**
 * Journey 4 — image data integrity: every image the content layer
 * references actually exists under public/, and the reused photographs
 * are optimized variants (not the ~780 KB originals), so pages that show
 * them repeatedly stay fast.
 */
const publicDir = join(process.cwd(), "public");

function sizeKb(publicPath: string): number {
  return statSync(join(publicDir, publicPath)).size / 1024;
}

describe("image data integrity", () => {
  it("references only images that exist in public/", () => {
    const referenced = [
      ...topics.map((t) => t.image),
      ...discoveries.map((d) => d.image),
      featuredDiscovery.image,
    ];

    expect(referenced.length).toBeGreaterThan(0);
    for (const image of referenced) {
      expect(existsSync(join(publicDir, image)), `missing ${image}`).toBe(true);
    }
  });

  it("uses optimized (<300 KB) webp variants for the photographed topics", () => {
    const photoSlugs = [
      "astronomy",
      "astrophysics",
      "cosmology",
      "the-solar-system",
    ];

    for (const topic of topics.filter((t) => photoSlugs.includes(t.slug))) {
      expect(topic.image, `${topic.slug} image`).toMatch(/\.webp$/);
      expect(sizeKb(topic.image), `${topic.image} size`).toBeLessThan(300);
    }
  });

  it("uses an optimized (<500 KB) hero backdrop for the Contact page", () => {
    const hero = "/images/topics/solar-system-1920.webp";

    expect(existsSync(join(publicDir, hero)), `missing ${hero}`).toBe(true);
    expect(sizeKb(hero), `${hero} size`).toBeLessThan(500);
  });
});
