import { expect, test, type Page } from "@playwright/test";

const languages = [
  {
    code: "ru",
    path: "/",
    heading: /Создаю цифровые продукты для роста бизнеса/,
    carousel: "Избранные проекты",
    menu: "Открыть меню",
    themeLabel: { light: "Включить тёмную тему", dark: "Включить светлую тему" },
  },
  {
    code: "en",
    path: "/en",
    heading: /I build digital products that move businesses forward/,
    carousel: "Selected projects",
    menu: "Open menu",
    themeLabel: { light: "Switch to dark theme", dark: "Switch to light theme" },
  },
] as const;

const themes = ["light", "dark"] as const;
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

async function primeTheme(page: Page, theme: (typeof themes)[number]) {
  await page.addInitScript((value) => localStorage.setItem("andrian-dev-theme", value), theme);
}

async function expectNoHorizontalOverflow(page: Page) {
  const widths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport + 1);
}

for (const language of languages) {
  for (const theme of themes) {
    for (const viewport of viewports) {
      test(`${language.code} / ${theme} / ${viewport.name}: home is usable`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await primeTheme(page, theme);
        await page.goto(language.path, { waitUntil: "networkidle" });

        await expect(page.locator("html")).toHaveAttribute("lang", language.code);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.getByRole("heading", { level: 1, name: language.heading })).toBeVisible();
        await expect(page.getByRole("region", { name: language.carousel })).toBeVisible();
        await expect(page.locator(".service-item")).toHaveCount(4);
        await expect(page.getByRole("button", { name: language.themeLabel[theme] })).toBeVisible();
        await expectNoHorizontalOverflow(page);

        if (viewport.name === "mobile") {
          await page.getByRole("button", { name: language.menu }).click();
          const menu = page.locator("#mobile-navigation");
          await expect(menu).toBeVisible();
          await expect(menu.locator("a")).toHaveCount(6);
          await expectNoHorizontalOverflow(page);
        }

        await page.locator(".theme-toggle").first().click();
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme === "light" ? "dark" : "light");
      });
    }
  }
}

test("language and theme choices survive real navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  await page.locator(".theme-toggle").first().click();
  await page.getByRole("button", { name: "EN" }).click();
  await page.waitForURL("**/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.goto("/en/projects/drop-3d-store", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "RU" }).click();
  await page.waitForURL("**/projects/drop-3d-store");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByRole("heading", { level: 1, name: "DROP / AIR FORCE 1" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

const cases = [
  { slug: "nebo-bistro", title: "NEBO BISTRO" },
  { slug: "drop-3d-store", title: "DROP / AIR FORCE 1" },
  { slug: "tehnotek-prototype", title: "ТЕХНОТЭК" },
] as const;

for (const language of languages) {
  for (const theme of themes) {
    for (const viewport of viewports) {
      test(`${language.code} / ${theme} / ${viewport.name}: all case pages render`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await primeTheme(page, theme);

        for (const project of cases) {
          const prefix = language.code === "en" ? "/en" : "";
          await page.goto(`${prefix}/projects/${project.slug}`, { waitUntil: "networkidle" });
          await expect(page.locator("html")).toHaveAttribute("lang", language.code);
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          await expect(page.getByRole("heading", { level: 1, name: project.title })).toBeVisible();
          await expect(page.locator(".case-story article")).toHaveCount(3);
          await expect(page.locator(".case-project-actions a").first()).toBeVisible();
          await expectNoHorizontalOverflow(page);
        }
      });
    }
  }
}
