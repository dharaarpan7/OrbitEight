import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Forks pool times out on this Windows setup; threads are reliable here.
    pool: "threads",
    include: [
      "components/**/*.{test,spec}.{ts,tsx}",
      "app/**/*.{test,spec}.{ts,tsx}",
      "lib/**/*.{test,spec}.{ts,tsx}",
      "scripts/**/*.{test,spec}.mjs",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "components/ui/blackhole-hero-section.tsx",
        "components/ui/editorial-image.tsx",
        "components/ui/animated-shader-hero.tsx",
        "components/ui/spline-background.tsx",
        "components/sections/about-hero.tsx",
        "components/sections/about-story.tsx",
        "components/sections/explore-hero.tsx",
        "components/sections/topic-index.tsx",
        "components/sections/discoveries-hero.tsx",
        "components/sections/page-hero.tsx",
        "components/navigation/navbar.tsx",
        "components/cards/topic-card.tsx",
        "components/cards/featured-discovery.tsx",
        "components/cards/discovery-card.tsx",
        "app/page.tsx",
        "app/about/page.tsx",
        "app/explore/page.tsx",
        "app/discoveries/page.tsx",
        "app/contact/page.tsx",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
