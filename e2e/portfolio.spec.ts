import { expect, test } from "@playwright/test";

test.describe("Portfolio public routes & responsiveness", () => {
  test("core routes return HTTP 200 and render main landmarks without horizontal overflow", async ({
    page,
  }) => {
    const routes = ["/", "/projects", "/cv", "/contact-us", "/admin/login"];

    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Expected HTTP 200 on ${route}`).toBe(200);
      await expect(page.locator("body")).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow, `Unexpected horizontal overflow on ${route}`).toBeLessThanOrEqual(
        1
      );
    }
  });

  test("navigation menu opens on click and closes cleanly on Escape", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("ki_intro_seen", "1");
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    const menuButton = page.locator('button[aria-label="Open navigation menu"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const menuDialog = page.locator('[role="dialog"][aria-label="Navigation Menu"]');
    await expect(menuDialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menuDialog).toBeHidden();
  });
});
