import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

for (const viewport of viewports) {
  test(`${viewport.name}: home stays aligned without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/?intro=0", { waitUntil: "networkidle" });

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".service-item")).toHaveCount(4);

    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      cards: [...document.querySelectorAll<HTMLElement>(".service-item")].map((card) => {
        const rect = card.getBoundingClientRect();
        return { left: rect.left, right: rect.right, height: rect.height };
      }),
    }));

    expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
    for (const card of layout.cards) {
      expect(card.left).toBeGreaterThanOrEqual(-1);
      expect(card.right).toBeLessThanOrEqual(layout.viewport + 1);
      expect(card.height).toBeGreaterThan(300);
    }
  });
}

test("project case is reachable and has its own content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/nebo-bistro", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "NEBO BISTRO" })).toBeVisible();
  await expect(page.locator(".case-visual")).toBeVisible();
  await expect(page).toHaveTitle(/NEBO BISTRO/);
});
