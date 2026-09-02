/**
 * One-off image optimizer — generates resized WebP variants of the four
 * photographed topics so the site never ships the ~780 KB originals.
 *
 *   node scripts/optimize-images.mjs
 *
 * Outputs, alongside each source in public/images/topics/:
 *   {name}-640.webp   — cards and index thumbnails (TopicCard, TopicIndex)
 *   {name}-1920.webp  — full-bleed hero backdrops (PageHero image prop)
 *
 * Idempotent: regenerates every variant on each run.
 */
import sharp from "sharp";
import { basename, join } from "node:path";

const TOPICS_DIR = join(process.cwd(), "public", "images", "topics");

const PHOTOS = [
  "astronomy.webp",
  "astrophysics.webp",
  "cosmology.webp",
  "solar-system.webp",
];

const WIDTHS = [640, 1920];

for (const photo of PHOTOS) {
  const src = join(TOPICS_DIR, photo);
  const name = basename(photo, ".webp");

  for (const width of WIDTHS) {
    const out = join(TOPICS_DIR, `${name}-${width}.webp`);
    const info = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toFile(out);
    console.log(
      `${name}-${width}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`
    );
  }
}
