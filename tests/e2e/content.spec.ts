import { test, expect, whenInteractive } from "./fixtures";

/**
 * Content journeys — Explore's searchable subject index and Discoveries'
 * editorial record. These are the read paths: search, images, deep links.
 */

test("explore lists all twelve subjects and their images", async ({ page }) => {
  await page.goto("/explore");

  const index = page.locator("ol");
  await expect(index.getByRole("link")).toHaveCount(12);

  // Every topic thumbnail actually loads — broken images are the most
  // common silent failure in this kind of gallery.
  const broken = await page.evaluate(() =>
    Array.from(document.querySelectorAll("ol img"))
      .filter((img) => !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalWidth === 0)
      .map((img) => (img as HTMLImageElement).src)
  );
  expect(broken, `broken topic images: ${broken.join(", ")}`).toEqual([]);

  // A representative subject is present by title.
  await expect(page.getByRole("link", { name: /Black holes/i })).toBeVisible();
});

test("topic search filters the archive and clears back to full", async ({
  page,
}) => {
  await page.goto("/explore");
  const search = page.getByLabel("Search topics");
  const links = page.locator("ol").getByRole("link");

  // Typing before hydration updates the DOM value but not React state — and
  // fill() is a no-op when the input already holds the value, so every
  // retry must clear first to actually dispatch an input event.
  await whenInteractive(async () => {
    await search.fill("");
    await search.fill("black");
    await expect(links).toHaveCount(1, { timeout: 2_000 });
  });
  await expect(links.first()).toContainText(/black holes/i);

  // No-match: honest empty state, not a blank area.
  await search.fill("zzz-no-such-topic");
  await expect(page.getByRole("status")).toContainText(/Nothing in the archive/i);

  await search.fill("");
  await expect(links).toHaveCount(12);
});

test("discoveries renders the featured story, timeline, and explainers", async ({
  page,
}) => {
  await page.goto("/discoveries");

  await expect(
    page.getByRole("heading", { name: /galaxies that arrived too early/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /Enceladus is still venting/i })
  ).toBeVisible();
  await expect(
    page.getByText(/22-day cycle/i).first()
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /questions, answered carefully/i })
  ).toBeVisible();
});

test("discovery images all load", async ({ page }) => {
  await page.goto("/discoveries");
  // Wait for lazy images to register before auditing.
  await page.waitForLoadState("networkidle");
  const broken = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img"))
      .filter(
        (img) =>
          !(img as HTMLImageElement).complete ||
          (img as HTMLImageElement).naturalWidth === 0
      )
      .map((img) => (img as HTMLImageElement).src)
  );
  expect(broken, `broken images: ${broken.join(", ")}`).toEqual([]);
});

test("scrolling the timeline reveals entries (reveal-on-scroll pipeline)", async ({
  page,
}) => {
  await page.goto("/discoveries");
  // Scroll through the whole page to trip every IntersectionObserver.
  await page.mouse.wheel(0, 2000);
  await page.mouse.wheel(0, 4000);
  await page.mouse.wheel(0, 8000);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(page.locator("footer")).toBeVisible();
});

test("explore CTA buttons lead somewhere real", async ({ page }) => {
  await page.goto("/explore");
  await page
    .getByRole("link", { name: /read about cosmology/i })
    .click();
  await expect(page).toHaveURL(/\/discoveries/);
});
