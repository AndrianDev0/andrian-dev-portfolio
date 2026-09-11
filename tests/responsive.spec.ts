import { expect, test } from "@playwright/test";

const viewports = [
  { name: "narrow-mobile", width: 320, height: 700 },
  { name: "small-mobile", width: 375, height: 667 },
  { name: "mobile", width: 390, height: 844 },
  { name: "large-mobile", width: 430, height: 932 },
  { name: "mobile-landscape", width: 844, height: 390 },
  { name: "compact-desktop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
] as const;

for (const viewport of viewports) {
  test(`${viewport.name}: home stays aligned without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });

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

    await page.getByRole("button", { name: "RU" }).click();
    const heroLines = await page.locator(".hero-line").evaluateAll((elements) =>
      elements.map((element) => ({
        visibleWidth: element.clientWidth,
        contentWidth: element.scrollWidth,
      })),
    );
    for (const line of heroLines) {
      expect(line.contentWidth).toBeLessThanOrEqual(line.visibleWidth + 1);
    }
  });
}

test("hero project carousel supports buttons and keyboard navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });

  const carousel = page.getByRole("region", { name: "Избранные проекты" });
  await expect(carousel.getByText("NEBO BISTRO", { exact: true })).toBeVisible();
  const neboImage = await carousel.locator(".hero-project-slide.is-active .nebo-proof-app img").evaluate((image) => ({
    src: (image as HTMLImageElement).currentSrc,
    fit: getComputedStyle(image).objectFit,
  }));
  expect(neboImage.src).toContain("prize-wheel-hd.webp");
  expect(neboImage.fit).toBe("contain");

  await carousel.getByRole("button", { name: "Следующий проект" }).click();
  await expect(carousel.getByText("DROP / AIR FORCE 1", { exact: true })).toBeVisible();
  const dropImage = await carousel.locator(".hero-project-slide.is-active img").evaluate((image) => ({
    src: (image as HTMLImageElement).currentSrc,
    fit: getComputedStyle(image).objectFit,
  }));
  expect(dropImage.src).toContain("drop-mobile-first-screen.png");
  expect(dropImage.fit).toBe("cover");
  const openControl = await carousel.locator(".hero-project-slide.is-active .hero-project-open").evaluate((control) => {
    const icon = control.querySelector("svg") as SVGElement;
    const controlRect = control.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect();
    return {
      x: Math.abs(controlRect.x + controlRect.width / 2 - (iconRect.x + iconRect.width / 2)),
      y: Math.abs(controlRect.y + controlRect.height / 2 - (iconRect.y + iconRect.height / 2)),
    };
  });
  expect(openControl.x).toBeLessThan(1);
  expect(openControl.y).toBeLessThan(1);
  await expect(page.locator(".project-flagship").getByRole("heading", { name: "DROP / AIR FORCE 1" })).toBeVisible();
  await expect(page.locator(".project-flagship").getByText("РАБОЧИЙ КОНЦЕПТ", { exact: true })).toBeVisible();
  await expect(page.locator(".project-layers")).toHaveCount(0);

  await carousel.focus();
  await carousel.press("ArrowRight");
  await expect(carousel.getByText("ТЕХНОТЭК", { exact: true })).toBeVisible();
  await expect(carousel.getByText("ПРОТОТИП", { exact: true })).toBeVisible();
  const tehnotekImage = await carousel.locator(".hero-project-slide.is-active img").evaluate((image) => ({
    src: (image as HTMLImageElement).currentSrc,
    fit: getComputedStyle(image).objectFit,
  }));
  expect(tehnotekImage.src).toContain("tehnotek-mobile-first-screen.png");
  expect(tehnotekImage.fit).toBe("cover");
  await expect(page.locator(".project-flagship").getByRole("heading", { name: "ТЕХНОТЭК" })).toBeVisible();
  await expect(page.locator(".project-flagship").getByText("ПРОТОТИП", { exact: true })).toBeVisible();

  await carousel.getByRole("button", { name: "Показать NEBO BISTRO" }).click();
  await expect(page.locator(".project-flagship").getByRole("heading", { name: "NEBO BISTRO" })).toBeVisible();
  await expect(page.locator(".project-layers")).toBeVisible();
});

test("project case is reachable and has its own content", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects/nebo-bistro", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "NEBO BISTRO" })).toBeVisible();
  await expect(page.locator(".case-visual")).toBeVisible();
  await expect(page.locator(".case-gallery-card")).toHaveCount(4);
  await expect(page.locator(".case-gallery-card img").first()).toHaveAttribute("loading", "lazy");

  const gallery = await page.locator(".case-gallery-grid").evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }));
  expect(gallery.scrollWidth).toBeGreaterThan(gallery.clientWidth);
  expect(gallery.documentWidth).toBeLessThanOrEqual(gallery.viewportWidth + 1);
  await expect(page).toHaveTitle(/Nebo Bistro/i);
});

for (const projectCase of [
  { slug: "drop-3d-store", title: "DROP / AIR FORCE 1", liveLabel: /Открыть рабочий концепт/, image: "drop-air-force-1.webp" },
  { slug: "tehnotek-prototype", title: "ТЕХНОТЭК", liveLabel: /Открыть прототип/, image: "tehnotek-prototype.webp" },
] as const) {
  test(`mobile: ${projectCase.slug} has a complete case study`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/projects/${projectCase.slug}`, { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: projectCase.title })).toBeVisible();
    await expect(page.locator(".case-story article")).toHaveCount(3);
    await expect(page.getByRole("link", { name: projectCase.liveLabel })).toBeVisible();
    const caseVisual = await page.locator(".case-highlight-visual .selected-work-visual").evaluate((visual) => {
      const image = visual.querySelector("img") as HTMLImageElement;
      const rect = visual.getBoundingClientRect();
      return { image: image.currentSrc, width: rect.width, height: rect.height };
    });
    expect(caseVisual.image).toContain(projectCase.image);
    expect(caseVisual.width).toBeGreaterThan(330);
    expect(caseVisual.height / caseVisual.width).toBeLessThan(0.65);
    await expect(page).toHaveTitle(new RegExp(projectCase.slug === "drop-3d-store" ? "DROP" : "ТЕХНОТЭК", "i"));
  });
}

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
] as const) {
  test(`${viewport.name}: SEO service pages stay readable and aligned`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/razrabotka-sajtov", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { level: 1, name: /Разработка сайтов под ключ/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Обсудить задачу/ }).first()).toBeVisible();
    await expect(page.locator(".seo-feature-grid article")).toHaveCount(4);

    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      sections: [...document.querySelectorAll<HTMLElement>(".seo-feature-grid article")].map((section) => {
        const rect = section.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      }),
    }));

    expect(layout.document).toBeLessThanOrEqual(layout.viewport + 1);
    for (const section of layout.sections) {
      expect(section.left).toBeGreaterThanOrEqual(-1);
      expect(section.right).toBeLessThanOrEqual(layout.viewport + 1);
    }
  });
}
