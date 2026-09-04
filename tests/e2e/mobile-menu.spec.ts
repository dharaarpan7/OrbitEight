import { test, expect, whenInteractive } from "./fixtures";

/**
 * Mobile user flow — the full-screen menu is the only navigation on small
 * viewports, so open/close, Escape, focus handling, and scroll-lock carry
 * the whole mobile journey.
 */

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 412, height: 915 } }); // Pixel-ish

  test("toggle opens the menu and every link navigates", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toBeVisible();

    await toggle.click();
    const menu = page.locator("#mobile-menu");
    // The first tap can land before React hydrates (a silent no-op) — retry
    // until the menu actually opens.
    await whenInteractive(async () => {
      if (await menu.isHidden()) await toggle.click();
      await expect(menu).toBeVisible({ timeout: 2_000 });
    });
    // Body scroll is locked while the overlay is open.
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("hidden");

    // The menu panel is a sibling of the <nav>, wired to the toggle via
    // aria-controls — target it directly.
    await page
      .locator("#mobile-menu")
      .getByRole("link", { name: "Discoveries" })
      .click();
    // Client-side transition through the dev server can outlast the default
    // 5s on software-rendered WebGL pages — under full-suite load the commit
    // has been observed past 15s, so give this first transition real room.
    await expect(page).toHaveURL(/\/discoveries/, { timeout: 30_000 });
    // Navigation closes the overlay and unlocks scroll.
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe("");
  });

  test("Escape closes the menu and focus returns to the toggle", async ({
    page,
  }) => {
    await page.goto("/");
    const menu = page.locator("#mobile-menu");
    await whenInteractive(async () => {
      await page.getByRole("button", { name: /open menu/i }).click();
      await expect(menu).toBeVisible({ timeout: 2_000 });
    });
    await expect(menu).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    // Focus lands back on the toggle specifically (it now reads "Open menu").
    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("aria-label", "Open menu");
  });

  test("deep pages open with the menu hidden", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#mobile-menu")).toBeHidden();
    await expect(
      page.getByRole("heading", { level: 1, name: /say hello/i })
    ).toBeVisible();
  });
});
