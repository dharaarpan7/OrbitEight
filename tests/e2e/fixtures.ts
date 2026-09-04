import { test as base, expect } from "@playwright/test";
import type { Page } from "@playwright/test";

/**
 * Shared E2E fixture. page.goto defaults to "domcontentloaded": the pages
 * carry WebGL shader heroes and Spline backdrops that keep fetching and
 * animating long after the DOM is interactive, so waiting for the plain
 * "load" event can outlast the test timeout on software-rendered WebGL.
 */

type GotoOptions = Parameters<Page["goto"]>[1];

export const test = base.extend<{ page: Page }>({
  // Named `provide`, not the conventional `use`: a parameter named `use`
  // trips the react-hooks rules-of-hooks lint, which reads `await use(page)`
  // as a React hook call inside a non-component function. Playwright only
  // cares about the argument's position, not its name.
  page: async ({ page }, provide) => {
    // The Next.js dev overlay renders as a <nextjs-portal> element that
    // intercepts pointer events over parts of the page — a dev-only artifact
    // no real visitor sees. Hide it, and detach it outright if Next
    // re-appends it. Init scripts run at document creation, before the
    // parser has built <html>, so guard for a null documentElement.
    await page.addInitScript(() => {
      const start = () => {
        const style = document.createElement("style");
        style.textContent =
          "nextjs-portal { display: none !important; pointer-events: none !important; }";
        (document.head || document.documentElement).appendChild(style);
        const detach = () =>
          document
            .querySelectorAll("nextjs-portal")
            .forEach((el) => el.remove());
        detach();
        const observer = new MutationObserver(detach);
        if (document.body) observer.observe(document.body, { childList: true });
        if (document.documentElement)
          observer.observe(document.documentElement, { childList: true });
      };
      if (document.documentElement) start();
      else
        document.addEventListener("DOMContentLoaded", start, { once: true });
    });
    const originalGoto = page.goto.bind(page);
    page.goto = ((url: string, options?: GotoOptions) =>
      originalGoto(url, { waitUntil: "domcontentloaded", ...options })) as Page["goto"];
    await provide(page);
  },
});

/**
 * Interactions that land inside React's hydration window are silent no-ops
 * (the DOM exists, the handlers don't yet). Retry the action until its
 * post-condition holds — on a hydrated page the first attempt succeeds.
 */
export async function whenInteractive(action: () => Promise<void>) {
  await expect(action).toPass({ timeout: 45_000 });
}

export { expect };
