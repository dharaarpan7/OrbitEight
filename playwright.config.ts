import { defineConfig, devices } from "@playwright/test";

/**
 * E2E — real browser, real dev server, real user flows. These specs guard
 * the journeys vitest can't: navigation, mobile menu, scroll reveals,
 * search filtering, and the contact form's network path (Formspree mocked
 * at the route level so tests never send real submissions).
 *
 * Reveal-on-scroll note: .reveal elements start opacity-0 and animate in
 * via IntersectionObserver; specs assert visibility AFTER scrolling, and
 * animations are allowed to settle rather than being disabled.
 */

export default defineConfig({
  testDir: "./tests/e2e",
  // One worker at a time: each page spins up a WebGL shader hero and a
  // Spline backdrop, which software-rasterize on this machine — parallel
  // workers thrash the GPU and stall every navigation.
  workers: 1,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  timeout: 60_000,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "playwright-results.json" }],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  // Client-side Link transitions through the dev server can be slow on
  // software-rendered WebGL pages — the default 5s expect timeout fails
  // navigations that are merely pending, not broken.
  expect: { timeout: 15_000 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
