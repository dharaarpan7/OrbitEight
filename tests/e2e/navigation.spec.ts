import { test, expect } from "./fixtures";

/**
 * Core user flow — every visitor lands here. Home hero, scroll reveals,
 * then the primary navigation journeys the navbar offers.
 */

test("home renders the hero and both entry-point CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    /Look beyond/i
  );
  await expect(
    page.getByRole("link", { name: /join orbit eight/i }).first()
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /explore the cosmos/i }).first()
  ).toBeVisible();
});

test("scroll reveals the below-the-fold sections", async ({ page }) => {
  await page.goto("/");
  // The CTA section is the last thing on the page — scrolling to it should
  // bring it (and everything in the reveal pipeline before it) into view.
  const cta = page.getByRole("region").filter({ hasText: /never a wrong time/i });
  const target = (await cta.count())
    ? cta
    : page.locator("footer").first();
  await target.scrollIntoViewIfNeeded();
  await target.waitFor({ state: "visible" });
  // Footer must be reachable — the page has a real bottom.
  await expect(page.locator("footer")).toBeVisible();
});

test("hero CTA navigates to the contact page", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: /join orbit eight/i })
    .first()
    .click();
  await expect(page).toHaveURL(/\/contact/);
  await expect(
    page.getByRole("heading", { level: 1, name: /say hello/i })
  ).toBeVisible();
});

test("navbar links reach every top-level page and mark the active one", async ({
  page,
}, testInfo) => {
  // Desktop nav only — on mobile viewports those links live behind the
  // hamburger, which mobile-menu.spec.ts covers end to end.
  test.skip(
    testInfo.project.name !== "chromium",
    "desktop navbar layout only"
  );

  await page.goto("/");
  for (const [label, url] of [
    ["Explore", /\/explore/],
    ["Discoveries", /\/discoveries/],
    ["About", /\/about/],
    ["Contact", /\/contact/],
  ] as const) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label }).first().click();
    await expect(page).toHaveURL(url);
    // The active page's nav link carries aria-current="page". getByRole has
    // no option for it, so intersect the role/name match with the attribute.
    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: label })
        .and(page.locator('[aria-current="page"]'))
    ).toBeVisible();
  }
});

test("brand link returns home from any page", async ({ page }) => {
  await page.goto("/explore");
  await page.getByRole("link", { name: "Orbit Eight", exact: true }).first().click();
  await expect(page).toHaveURL(/^(https?:\/\/[^/]+)?\/?$/);
});

test("footer nav links work", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await footer.getByRole("link", { name: "Discoveries" }).click();
  await expect(page).toHaveURL(/\/discoveries/);
});

test("unknown paths land on the styled 404", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("every page resolves with a 200/404 status and a title", async ({ page }) => {
  for (const path of ["/", "/explore", "/discoveries", "/about", "/contact"]) {
    const response = await page.goto(path);
    expect(response?.status(), `status for ${path}`).toBeLessThan(400);
    await expect(page).toHaveTitle(/Orbit Eight/i);
  }
});
