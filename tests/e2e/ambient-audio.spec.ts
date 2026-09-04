import { test, expect } from "./fixtures";

/**
 * Ambient music UI — the component plays on the homepage and /about and
 * gates itself off everywhere else. These specs assert the route contract a
 * visitor sees: the sound toggle exists on the ambience routes and nowhere
 * else. (Whether audio actually plays depends on the browser's autoplay
 * policy, which differs between headed and headless — not asserted here.)
 */
test.describe("ambient audio", () => {
  for (const route of ["/", "/about"]) {
    test(`sound toggle is available on ${route || "the homepage"}`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(
        page.getByRole("button", { name: /mute ambience/i })
      ).toBeVisible();
    });
  }

  test("sound toggle is absent on other routes", async ({ page }) => {
    await page.goto("/explore");
    await expect(
      page.getByRole("button", { name: /ambience/i })
    ).toHaveCount(0);
  });
});
