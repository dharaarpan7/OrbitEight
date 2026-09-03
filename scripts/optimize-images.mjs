/**
 * One-off image optimizer — generates resized WebP variants of the site's
 * photographed imagery (topic subjects and discovery stories) so the site
 * never ships the originals.
 *
 *   node scripts/optimize-images.mjs
 *
 * Outputs, alongside each source in its public/images/ directory:
 *   {name}-640.webp   — cards and index thumbnails (TopicCard, TopicIndex,
 *                       DiscoveryCard timeline entries)
 *   {name}-1920.webp  — full-bleed hero backdrops (PageHero image prop)
 *
 * Idempotent: regenerates every variant on each run.
 */
import sharp from "sharp";
import { basename, extname, join } from "node:path";

const WIDTHS = [640, 1920];

const TOPICS_DIR = join(process.cwd(), "public", "images", "topics");

const TOPIC_PHOTOS = [
  "astronomy.webp",
  "astrophysics.webp",
  "cosmology.webp",
  "solar-system.webp",
  "planets.webp",
  "exoplanets.webp",
  "stars.webp",
  "galaxies.webp",
  "black-holes.webp",
  "neutron-stars.webp",
  "astrophotography.webp",
  "space-exploration.webp",
];

const DISCOVERIES_DIR = join(process.cwd(), "public", "images", "discoveries");

// Sources may be webp or png (the Gemini render) — every output is webp.
const DISCOVERY_PHOTOS = [
  "fast-radio-burst.webp",
  "early-galaxies.webp",
  "enceladus.webp",
  "interstellar.webp",
  "venus.webp",
  "gw-background.png",
];

async function optimize(dir, photos) {
  for (const photo of photos) {
    const src = join(dir, photo);
    const name = basename(photo, extname(photo));

    for (const width of WIDTHS) {
      const out = join(dir, `${name}-${width}.webp`);
      const info = await sharp(src)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(out);
      console.log(
        `${name}-${width}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`
      );
    }
  }
}

await optimize(TOPICS_DIR, TOPIC_PHOTOS);
await optimize(DISCOVERIES_DIR, DISCOVERY_PHOTOS);
