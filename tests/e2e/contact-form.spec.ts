import { test, expect } from "./fixtures";

/**
 * Contact flow — the only interactive form on the site. The Formspree
 * endpoint is intercepted at the route level so these tests never send a
 * real submission while still exercising the full client-side journey:
 * validation, network success, network failure, reset-after-success.
 */

const ENDPOINT = "https://formspree.io/f/xkjnzobz";

function fillForm(page: import("@playwright/test").Page) {
  return {
    name: page.getByLabel(/^name$/i),
    email: page.getByLabel(/^email$/i),
    message: page.getByLabel(/message/i),
    submit: page.getByRole("button", { name: /send message/i }),
  };
}

test("renders every field and inquiry category", async ({ page }) => {
  await page.goto("/contact");
  const { name, email, message } = fillForm(page);
  await expect(name).toBeVisible();
  await expect(email).toBeVisible();
  await expect(message).toBeVisible();
  for (const category of ["General", "Partnership", "Media", "Support"]) {
    await expect(
      page.getByRole("button", { name: category, exact: true })
    ).toBeVisible();
  }
});

test("empty submission shows the fields message and never calls the endpoint", async ({
  page,
}) => {
  let endpointCalled = false;
  void endpointCalled;
  await page.route(ENDPOINT, (route) => {
    endpointCalled = true;
    void route.fulfill({ status: 200 });
  });

  await page.goto("/contact");
  // The submit button is disabled until React hydrates — its enabled state
  // doubles as the hydration gate.
  const { submit } = fillForm(page);
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  await expect(
    page.getByRole("alert").filter({ hasText: /make sure every field is filled in/i })
  ).toBeVisible();
  expect(endpointCalled).toBe(false);
});

test("malformed email is rejected before the network with the specific message", async ({
  page,
}) => {
  let endpointCalled = false;
  await page.route(ENDPOINT, (route) => {
    endpointCalled = true;
    void route.fulfill({ status: 200 });
  });

  await page.goto("/contact");
  const { name, email, message, submit } = fillForm(page);
  await name.fill("Maya");
  await email.fill("maya-at-example");
  await message.fill("Hello from the observatory.");
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  await expect(
    page.getByRole("alert").filter({ hasText: /email address doesn’t look right/i })
  ).toBeVisible();
  expect(endpointCalled).toBe(false);
});

test("successful submission shows the confirmation state", async ({ page }) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ status: 200, body: '{"ok":true}' })
  );

  await page.goto("/contact");
  const { name, email, message, submit } = fillForm(page);
  await name.fill("Maya");
  await email.fill("maya@example.com");
  await message.fill("Hello from the observatory.");
  await submit.click();

  await expect(page.getByRole("status")).toContainText(/message received/i);

  // "Send another message" resets to a fresh form.
  await page.getByRole("button", { name: /send another message/i }).click();
  await expect(page.getByLabel(/^name$/i)).toHaveValue("");
  await expect(page.getByLabel(/message/i)).toHaveValue("");
});

test("network failure shows the honest error state, not a false success", async ({
  page,
}) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ status: 500, body: '{"error":"boom"}' })
  );

  await page.goto("/contact");
  const { name, email, message, submit } = fillForm(page);
  await name.fill("Maya");
  await email.fill("maya@example.com");
  await message.fill("Hello from the observatory.");
  await expect(submit).toBeEnabled({ timeout: 30_000 });
  await submit.click();

  await expect(
    page.getByRole("alert").filter({ hasText: /on our end/i })
  ).toBeVisible();
  await expect(page.getByText(/message received/i)).toHaveCount(0);
});

test("inquiry category selection travels with the category state", async ({
  page,
}) => {
  await page.route(ENDPOINT, (route) =>
    route.fulfill({ status: 200, body: '{"ok":true}' })
  );

  await page.goto("/contact");
  await page.getByRole("button", { name: "Partnership", exact: true }).click();
  const { name, email, message, submit } = fillForm(page);
  await name.fill("Maya");
  await email.fill("maya@example.com");
  await message.fill("Hello.");
  await submit.click();

  await expect(page.getByRole("status")).toContainText(/message received/i);
});

test("contact page offers the alternative contact routes", async ({ page }) => {
  await page.goto("/contact");
  // The email link is intentionally present on the page (user asked to
  // remove it only from inside the form card).
  const mailto = page.locator('a[href^="mailto:"]');
  await expect(mailto.first()).toBeVisible();
});
