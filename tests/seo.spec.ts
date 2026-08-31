import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { siteConfig } from "../site";

const seoContent = JSON.parse(readFileSync(new URL("../seo-pages.json", import.meta.url), "utf8")) as {
  services: Array<{ slug: string; title: string; h1: string }>;
};
const serviceRoutes = seoContent.services.map((service) => [`/${service.slug}`, service.title, service.h1] as const);
const indexableRoutes: readonly (readonly [string, string, string])[] = [
  ["/", "Разработка сайтов и Telegram-ботов — Andrian.Dev", "Создаю"],
  ["/en", "Websites, Telegram Bots &amp; Automation — Andrian.Dev", "I build"],
  ...serviceRoutes,
  ["/projects/nebo-bistro", "Telegram-бот и Mini App Nebo Bistro", "Telegram-бот и Mini App для Nebo Bistro"],
  ["/en/projects/nebo-bistro", "Nebo Bistro Telegram Bot &amp; Mini App Case", "Telegram bot and Mini App for Nebo Bistro"],
];

test("every indexable route returns unique crawlable HTML", async ({ request }) => {
  const titles = new Set<string>();
  const canonicals = new Set<string>();

  for (const [route, title, h1] of indexableRoutes) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(200);
    expect(response.headers()["content-type"], route).toContain("text/html");
    const html = await response.text();
    expect(html, `${route} title`).toContain(`<title>${title}`);
    expect(html, `${route} h1`).toContain(`<h1>${h1}`);
    const canonical = route === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${route}`;
    expect(html, `${route} canonical`).toContain(`<link rel="canonical" href="${canonical}"`);
    titles.add(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "");
    canonicals.add(canonical);

    if (route === "/" || route === "/en") {
      expect(html, `${route} Russian alternate`).toContain(`hreflang="ru" href="${siteConfig.url}/"`);
      expect(html, `${route} English alternate`).toContain(`hreflang="en" href="${siteConfig.url}/en"`);
      expect(html, `${route} default alternate`).toContain(`hreflang="x-default" href="${siteConfig.url}/"`);
    }
    if (route.endsWith("/projects/nebo-bistro")) {
      expect(html, `${route} case Russian alternate`).toContain(`hreflang="ru" href="${siteConfig.url}/projects/nebo-bistro"`);
      expect(html, `${route} case English alternate`).toContain(`hreflang="en" href="${siteConfig.url}/en/projects/nebo-bistro"`);
    }

    const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    expect(jsonLd.length, `${route} structured data`).toBeGreaterThan(0);
    for (const match of jsonLd) expect(() => JSON.parse(match[1])).not.toThrow();
  }

  expect(titles.size).toBe(indexableRoutes.length);
  expect(canonicals.size).toBe(indexableRoutes.length);
});

test("sitemap contains only the published canonical routes", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const sitemap = await response.text();
  const expectedCanonicals = indexableRoutes.map(([route]) => route === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${route}`);
  for (const [route] of indexableRoutes) {
    const canonical = route === "/" ? `${siteConfig.url}/` : `${siteConfig.url}${route}`;
    expect(sitemap).toContain(`<loc>${canonical}</loc>`);
  }
  const actualCanonicals = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  expect(actualCanonicals.sort()).toEqual(expectedCanonicals.sort());
});

test("unknown pages and missing assets return real 404 responses", async ({ request }) => {
  const page = await request.get("/not-a-real-page");
  expect(page.status()).toBe(404);
  const html = readFileSync(new URL("../dist-vercel/404.html", import.meta.url), "utf8");
  expect(html).toContain('<meta name="robots" content="noindex, follow"');
  expect(html).not.toContain('rel="canonical"');
  expect(html).not.toContain('type="application/ld+json"');
  expect((await request.get("/assets/does-not-exist.js")).status()).toBe(404);
});
