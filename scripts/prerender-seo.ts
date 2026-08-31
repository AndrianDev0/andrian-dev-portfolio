import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import seoContent from "../seo-pages.json";
import { siteConfig } from "../site";

const ORIGIN = siteConfig.url;
const LAST_MODIFIED = "2026-08-31";
type Service = (typeof seoContent.services)[number];

type PageMeta = {
  lang: "ru" | "en";
  title: string;
  description: string;
  canonical: string;
  locale: string;
  schema: unknown;
  alternates?: { ru: string; en: string; xDefault: string };
  useSocialImage?: boolean;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function schemaJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function replaceMeta(html: string, attribute: "name" | "property", key: string, content: string) {
  const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attribute}="${safeKey}"\\s+content="[^"]*"\\s*\\/?>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function replaceCanonical(html: string, canonical: string) {
  return html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonical}" />`);
}

function replaceAlternates(html: string, alternates?: PageMeta["alternates"]) {
  const withoutAlternates = html.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"\s*\/?>/gi, "");
  if (!alternates) return withoutAlternates;
  const tags = [
    `<link rel="alternate" hreflang="ru" href="${alternates.ru}" />`,
    `<link rel="alternate" hreflang="en" href="${alternates.en}" />`,
    `<link rel="alternate" hreflang="x-default" href="${alternates.xDefault}" />`,
  ].join("\n    ");
  return withoutAlternates.replace("</head>", `    ${tags}\n  </head>`);
}

function replaceStructuredData(html: string, schema: unknown) {
  const block = `<!-- seo:structured-data:start -->\n    <script type="application/ld+json">${schemaJson(schema)}</script>\n    <!-- seo:structured-data:end -->`;
  return html.replace(/<!-- seo:structured-data:start -->[\s\S]*?<!-- seo:structured-data:end -->/i, block);
}

function applyMeta(template: string, meta: PageMeta) {
  let html = template.replace(/<html\s+lang="[^"]+">/i, `<html lang="${meta.lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  html = replaceMeta(html, "name", "description", meta.description);
  html = replaceMeta(html, "property", "og:title", meta.title);
  html = replaceMeta(html, "property", "og:description", meta.description);
  html = replaceMeta(html, "property", "og:url", meta.canonical);
  html = replaceMeta(html, "property", "og:locale", meta.locale);
  html = replaceMeta(
    html,
    "property",
    "og:image:alt",
    meta.lang === "ru"
      ? "Andrian.Dev — разработка сайтов и Telegram-ботов"
      : "Andrian.Dev — websites and Telegram bots",
  );
  html = replaceMeta(html, "name", "twitter:title", meta.title);
  html = replaceMeta(html, "name", "twitter:description", meta.description);
  html = replaceCanonical(html, meta.canonical);
  html = replaceAlternates(html, meta.alternates);
  html = replaceStructuredData(html, meta.schema);
  if (meta.useSocialImage === false) {
    html = html.replace(/\s*<meta\s+property="og:image(?::[^"]+)?"\s+content="[^"]*"\s*\/?>/gi, "");
    html = html.replace(/\s*<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/gi, "");
    html = html.replace(/<meta\s+name="twitter:card"\s+content="[^"]*"\s*\/?>/i, '<meta name="twitter:card" content="summary" />');
  }
  return html;
}

function wrapRoot(content: string) {
  return `<div id="root">${content}</div>`;
}

function injectRoot(template: string, content: string) {
  return template.replace('<div id="root"></div>', wrapRoot(content));
}

const serviceCards = seoContent.services.map((service) => `
  <article>
    <h3>${escapeHtml(service.h1)}</h3>
    <p>${escapeHtml(service.description)}</p>
    <a href="/${service.slug}">Подробнее об услуге →</a>
  </article>`).join("");

function homeFallback(language: "ru" | "en") {
  const ru = language === "ru";
  const prefix = ru ? "" : "/en";
  return `<div class="seo-static-home">
    <header class="seo-static-nav">
      <a class="brand" href="${prefix || "/"}"><span class="brand-mark"><i></i></span><span class="brand-word">Andrian.Dev</span></a>
      <nav aria-label="${ru ? "Основная навигация" : "Primary navigation"}"><a href="#work">${ru ? "Проекты" : "Work"}</a><a href="#services">${ru ? "Услуги" : "Services"}</a><a href="#process">${ru ? "Процесс" : "Process"}</a><a href="#contact">${ru ? "Контакты" : "Contact"}</a></nav>
      <a href="${ru ? "/en" : "/"}">${ru ? "EN" : "RU"}</a>
    </header>
    <main>
      <section class="seo-static-hero">
        <span>${ru ? "ВЕБ-РАЗРАБОТКА / TELEGRAM-БОТЫ / АВТОМАТИЗАЦИЯ" : "WEB DEVELOPMENT / TELEGRAM BOTS / AUTOMATION"}</span>
        <h1>${ru ? "Создаю <em>цифровые продукты</em> для роста бизнеса." : "I build <em>digital products</em> that move businesses forward."}</h1>
        <p>${ru ? "Создаю сайты, Telegram-ботов, веб-приложения и автоматизацию для бизнеса — от структуры и интерфейса до интеграций, тестирования и запуска." : "I build modern websites, Telegram bots, web apps, and automations — from structure and interface to integrations, testing, and launch."}</p>
        <div class="seo-static-actions"><a href="#contact">${ru ? "Обсудить проект" : "Start a project"}</a><a href="#work">${ru ? "Смотреть работы" : "View my work"}</a></div>
      </section>
      <section class="seo-static-case" id="work"><h2>${ru ? "Реальный кейс: Telegram-бот и Mini App для Nebo Bistro" : "Real case: Telegram bot and Mini App for Nebo Bistro"}</h2><p>${ru ? "Работающий ресторанный сценарий: знакомство в Telegram, встроенное колесо призов и понятная выдача выигрыша в заведении." : "A live restaurant journey with Telegram onboarding, an embedded prize wheel, and a clear in-venue reward handoff."}</p><a href="${prefix}/projects/nebo-bistro">${ru ? "Разобрать кейс" : "Explore the case"} →</a></section>
      <section class="seo-static-section" id="services"><h2>${ru ? "Услуги разработки для бизнеса" : "Development services for business"}</h2><div class="seo-static-grid">${ru ? serviceCards : `<article><h3>Web development</h3><p>Landing pages, corporate websites and custom builds.</p><a href="#contact">Discuss a website →</a></article><article><h3>Telegram bots</h3><p>Lead capture, sales, support, catalogs and integrations.</p><a href="#contact">Discuss a bot →</a></article><article><h3>Web apps</h3><p>Dashboards, accounts and internal tools.</p><a href="#contact">Discuss a web app →</a></article><article><h3>Automation</h3><p>API, CRM, Telegram and notification workflows.</p><a href="#contact">Discuss automation →</a></article>`}</div></section>
      <section class="seo-static-case" id="process"><h2>${ru ? "От идеи до запуска" : "From idea to launch"}</h2><p>${ru ? "Знакомство, анализ, дизайн, разработка, тестирование и запуск остаются частью одного понятного процесса." : "Discovery, analysis, design, development, testing and launch stay connected in one clear process."}</p></section>
      <section class="seo-static-section" id="contact"><h2>${ru ? "Обсудить проект" : "Start a project"}</h2><p>${ru ? "Расскажите, что вам нужно — предложу подходящий способ реализации." : "Tell me what you need and I will suggest the right way to build it."}</p><div class="seo-static-actions"><a href="https://t.me/g1reshnik">Telegram</a><a href="mailto:maa190186@gmail.com">maa190186@gmail.com</a></div></section>
    </main>
    <footer class="seo-static-footer"><span>© ${new Date().getFullYear()} Andrian.Dev</span><a href="https://t.me/g1reshnik">Telegram</a></footer>
  </div>`;
}

function serviceFallback(service: Service) {
  const features = service.features.map((feature, index) => `<article><span>0${index + 1}</span><h3>${escapeHtml(feature.title)}</h3><p>${escapeHtml(feature.text)}</p></article>`).join("");
  const process = service.process.map((step, index) => `<li><span>ЭТАП 0${index + 1}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></li>`).join("");
  const includes = service.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const faq = service.faq.map((item) => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("");
  const caseSection = service.slug === "telegram-boty" ? `<section class="seo-section seo-case-callout"><div class="container seo-case-card"><div><p class="eyebrow">РЕАЛЬНЫЙ КЕЙС</p><h2>Telegram-бот и Mini App для Nebo Bistro</h2></div><p>Работающий ресторанный сценарий с колесом призов и панелью управления.</p><a href="/projects/nebo-bistro">Посмотреть кейс →</a></div></section>` : "";
  return `<div class="seo-page">
    <header class="seo-header"><nav class="seo-nav container"><a class="brand" href="/"><span class="brand-mark"><i></i></span><span class="brand-word">Andrian.Dev</span></a><div class="seo-nav-links"><a href="/#work">Кейс</a><a href="/#services">Услуги</a><a href="/#process">Процесс</a><a href="/#contact">Контакты</a></div><div class="seo-nav-actions"><a class="nav-cta" href="/#contact">Обсудить проект</a></div></nav></header>
    <main>
      <section class="seo-hero"><div class="container seo-hero-layout"><div class="seo-hero-copy"><nav class="seo-breadcrumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span>/</span><span>Услуги</span></nav><p class="eyebrow">${escapeHtml(service.eyebrow)}</p><h1>${escapeHtml(service.h1)}</h1><p class="seo-lead">${escapeHtml(service.lead)}</p><div class="seo-hero-actions"><a class="button button-primary" href="/#contact">Обсудить задачу →</a><a class="button button-ghost" href="https://t.me/g1reshnik">Написать в Telegram</a></div></div><aside class="seo-hero-panel"><span>ANDRIAN.DEV / SERVICE</span><strong>ЗАДАЧА<br>→ ПРОДУКТ</strong><div><span>01 Анализ</span><span>02 Интерфейс</span><span>03 Разработка</span><span>04 Запуск</span></div></aside></div></section>
      <section class="seo-section seo-overview"><div class="container"><div class="seo-section-heading"><p class="eyebrow">ВОЗМОЖНОСТИ</p><h2>${escapeHtml(service.overviewTitle)}</h2></div><div class="seo-feature-grid">${features}</div></div></section>
      <section class="seo-section seo-includes"><div class="container seo-includes-layout"><div><p class="eyebrow">СОСТАВ РАБОТ</p><h2>${escapeHtml(service.includesTitle)}</h2></div><ul>${includes}</ul></div></section>
      <section class="seo-section seo-process"><div class="container"><div class="seo-section-heading"><p class="eyebrow">ПРОЦЕСС</p><h2>${escapeHtml(service.processTitle)}</h2></div><ol class="seo-process-grid">${process}</ol></div></section>
      <section class="seo-section seo-pricing"><div class="container seo-pricing-card"><div><p class="eyebrow">ОЦЕНКА ПРОЕКТА</p><h2>${escapeHtml(service.pricingTitle)}</h2></div><p>${escapeHtml(service.pricingText)}</p><a href="/#contact">Получить оценку →</a></div></section>
      ${caseSection}
      <section class="seo-section seo-faq"><div class="container seo-faq-layout"><div><p class="eyebrow">FAQ</p><h2>Частые вопросы</h2><p>Короткие ответы о составе, оценке и запуске проекта.</p></div><div class="seo-faq-list">${faq}</div></div></section>
      <section class="seo-related"><div class="container"><span>СЛЕДУЮЩАЯ УСЛУГА</span><a href="/${service.relatedSlug}"><h2>${escapeHtml(service.relatedLabel)}</h2><span>↗</span></a></div></section>
      <section class="seo-cta"><div class="container"><p class="eyebrow">ОБСУДИТЬ ПРОЕКТ</p><h2>Расскажите, что нужно сделать.</h2><p>Предложу подходящий формат реализации и понятный следующий шаг.</p><a class="button button-primary" href="/#contact">Перейти к заявке →</a></div></section>
    </main>
    <footer class="seo-footer"><div class="container"><a class="footer-brand" href="/">Andrian.Dev</a><div class="seo-footer-links">${seoContent.services.map((item) => `<a href="/${item.slug}">${escapeHtml(item.h1)}</a>`).join("")}</div><div><a href="https://t.me/g1reshnik">Telegram</a><a href="mailto:maa190186@gmail.com">maa190186@gmail.com</a></div></div></footer>
  </div>`;
}

function caseFallback(language: "ru" | "en") {
  const ru = language === "ru";
  const home = ru ? "/" : "/en";
  return `<div class="seo-page"><header class="seo-header"><nav class="seo-nav container"><a class="brand" href="${home}"><span class="brand-mark"><i></i></span><span class="brand-word">Andrian.Dev</span></a><div class="seo-nav-actions"><a class="nav-cta" href="${home}#contact">${ru ? "Обсудить проект" : "Start a project"}</a></div></nav></header><main><section class="seo-hero"><div class="container seo-hero-layout"><div class="seo-hero-copy"><nav class="seo-breadcrumbs"><a href="${home}">${ru ? "Главная" : "Home"}</a><span>/</span><span>${ru ? "Кейс" : "Case study"}</span></nav><p class="eyebrow">NEBO BISTRO / TELEGRAM</p><h1>${ru ? "Telegram-бот и Mini App для Nebo Bistro" : "Telegram bot and Mini App for Nebo Bistro"}</h1><p class="seo-lead">${ru ? "Реальный ресторанный Telegram-кейс: персональное приветствие, Mini App с колесом призов и защищённая панель управления." : "A live restaurant Telegram case: personalized onboarding, a Mini App prize wheel and a protected control panel."}</p><div class="seo-hero-actions"><a class="button button-primary" href="https://t.me/NeboBistroBot">${ru ? "Открыть бота" : "Open the bot"}</a><a class="button button-ghost" href="${home}#contact">${ru ? "Обсудить похожий проект" : "Discuss a similar project"}</a></div></div><aside class="seo-hero-panel"><span>LIVE PRODUCT / 01</span><strong>NEBO<br>BISTRO</strong><div><span>BOT</span><span>MINI APP</span><span>PRIZE FLOW</span><span>ADMIN</span></div></aside></div></section><section class="seo-section seo-overview"><div class="container"><div class="seo-section-heading"><p class="eyebrow">01 / ${ru ? "ЗАДАЧА" : "CHALLENGE"}</p><h2>${ru ? "Перенести промеханику ресторана в Telegram" : "Bring a restaurant promotion into Telegram"}</h2></div><div class="seo-feature-grid"><article><h3>${ru ? "Задача" : "Challenge"}</h3><p>${ru ? "Сделать короткий и понятный путь гостя от знакомства до приза." : "Create a short and clear guest journey from onboarding to reward."}</p></article><article><h3>${ru ? "Решение" : "Solution"}</h3><p>${ru ? "Объединить бота, Mini App и управление в одной системе." : "Connect the bot, Mini App and management tools in one system."}</p></article><article><h3>${ru ? "Результат" : "Result"}</h3><p>${ru ? "Работающий сценарий от приветствия до выдачи выигрыша в заведении." : "A working flow from greeting to in-venue reward handoff."}</p></article><article><h3>${ru ? "Технологии" : "Technology"}</h3><p>TypeScript, Telegram WebApp, Cloudflare D1.</p></article></div></div></section><section class="seo-cta"><div class="container"><h2>${ru ? "Нужен похожий продукт?" : "Need something similar?"}</h2><a class="button button-primary" href="${home}#contact">${ru ? "Обсудить проект" : "Start a project"}</a><a class="button button-ghost" href="${ru ? "/telegram-boty" : `${home}#services`}">${ru ? "Разработка Telegram-ботов" : "Telegram bot development"}</a></div></section></main></div>`;
}

function homeSchema(language: "ru" | "en") {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: "Andrian.Dev", inLanguage: ["ru", "en"] },
      { "@type": "Person", "@id": `${ORIGIN}/#person`, name: "Andrian", alternateName: "Andrian.Dev", url: `${ORIGIN}/`, email: "mailto:maa190186@gmail.com", jobTitle: language === "ru" ? "Веб-разработчик" : "Web developer", sameAs: ["https://t.me/g1reshnik"], knowsAbout: ["Web development", "Telegram bots", "Web applications", "Business automation"] },
      { "@type": "Service", "@id": `${ORIGIN}/#services`, name: language === "ru" ? "Разработка сайтов, Telegram-ботов и веб-приложений" : "Websites, Telegram bots and web application development", provider: { "@id": `${ORIGIN}/#person` }, areaServed: "Worldwide", url: `${ORIGIN}/#services` },
    ],
  };
}

function serviceSchema(service: Service) {
  const url = `${ORIGIN}/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${url}#service`, name: service.h1, description: service.description, url, provider: { "@type": "Person", "@id": `${ORIGIN}/#person`, name: "Andrian", alternateName: "Andrian.Dev", url: `${ORIGIN}/`, sameAs: ["https://t.me/g1reshnik"] }, areaServed: "Worldwide", inLanguage: "ru" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Главная", item: `${ORIGIN}/` }, { "@type": "ListItem", position: 2, name: service.h1, item: url }] },
      { "@type": "FAQPage", mainEntity: service.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
    ],
  };
}

function caseSchema(language: "ru" | "en") {
  const english = language === "en";
  const url = english ? `${ORIGIN}/en/projects/nebo-bistro` : `${ORIGIN}/projects/nebo-bistro`;
  const home = english ? `${ORIGIN}/en` : `${ORIGIN}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CreativeWork", "@id": `${url}#project`, name: english ? "Nebo Bistro Telegram Bot and Mini App" : "Telegram-бот и Mini App Nebo Bistro", description: english ? "A live restaurant Telegram product combining a bot, Mini App prize wheel and protected control panel." : "Реальный ресторанный Telegram-продукт: бот, Mini App с колесом призов и защищённая панель управления.", url, inLanguage: language, creator: { "@id": `${ORIGIN}/#person` } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: english ? "Home" : "Главная", item: home }, { "@type": "ListItem", position: 2, name: "Nebo Bistro", item: url }] },
    ],
  };
}

async function writePage(outDir: string, route: string, html: string) {
  const filePath = path.join(outDir, ...`${route}.html`.split("/").filter(Boolean));
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html, "utf8");
}

export async function generateSeoPages(outDir: string) {
  const indexPath = path.join(outDir, "index.html");
  const template = await readFile(indexPath, "utf8");
  const alternates = { ru: `${ORIGIN}/`, en: `${ORIGIN}/en`, xDefault: `${ORIGIN}/` };

  const russianHome = injectRoot(applyMeta(template, {
    lang: "ru",
    title: "Разработка сайтов и Telegram-ботов — Andrian.Dev",
    description: "Создаю сайты, Telegram-ботов, веб-приложения и автоматизацию для бизнеса: от структуры и интерфейса до интеграций, тестирования и запуска.",
    canonical: `${ORIGIN}/`,
    locale: "ru_RU",
    schema: homeSchema("ru"),
    alternates,
  }), homeFallback("ru"));
  await writeFile(indexPath, russianHome, "utf8");

  const englishHome = injectRoot(applyMeta(template, {
    lang: "en",
    title: "Websites, Telegram Bots & Automation — Andrian.Dev",
    description: "Modern websites, Telegram bots, web apps and automation — from structure and interface to integrations, testing and launch.",
    canonical: `${ORIGIN}/en`,
    locale: "en_US",
    schema: homeSchema("en"),
    alternates,
  }), homeFallback("en"));
  await writePage(outDir, "en", englishHome);

  for (const service of seoContent.services) {
    const canonical = `${ORIGIN}/${service.slug}`;
    const html = injectRoot(applyMeta(template, {
      lang: "ru",
      title: service.title,
      description: service.description,
      canonical,
      locale: "ru_RU",
      schema: serviceSchema(service),
    }), serviceFallback(service));
    await writePage(outDir, service.slug, html);
  }

  const caseAlternates = { ru: `${ORIGIN}/projects/nebo-bistro`, en: `${ORIGIN}/en/projects/nebo-bistro`, xDefault: `${ORIGIN}/projects/nebo-bistro` };
  const russianCase = injectRoot(applyMeta(template, {
    lang: "ru",
    title: "Telegram-бот и Mini App Nebo Bistro — кейс | Andrian.Dev",
    description: "Реальный ресторанный Telegram-кейс: персональное приветствие, Mini App с колесом призов и защищённая панель управления.",
    canonical: `${ORIGIN}/projects/nebo-bistro`,
    locale: "ru_RU",
    schema: caseSchema("ru"),
    alternates: caseAlternates,
    useSocialImage: false,
  }), caseFallback("ru"));
  await writePage(outDir, "projects/nebo-bistro", russianCase);

  const englishCase = injectRoot(applyMeta(template, {
    lang: "en",
    title: "Nebo Bistro Telegram Bot & Mini App Case — Andrian.Dev",
    description: "A live restaurant Telegram case with personalized onboarding, a Mini App prize wheel and a protected control panel.",
    canonical: `${ORIGIN}/en/projects/nebo-bistro`,
    locale: "en_US",
    schema: caseSchema("en"),
    alternates: caseAlternates,
    useSocialImage: false,
  }), caseFallback("en"));
  await writePage(outDir, "en/projects/nebo-bistro", englishCase);

  const notFound = replaceMeta(applyMeta(template, {
    lang: "ru",
    title: "Страница не найдена — Andrian.Dev",
    description: "Запрошенная страница не найдена.",
    canonical: `${ORIGIN}/404`,
    locale: "ru_RU",
    schema: { "@context": "https://schema.org", "@type": "WebPage", name: "Страница не найдена" },
    useSocialImage: false,
  }), "name", "robots", "noindex, follow")
    .replace(/\s*<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, "")
    .replace(/\s*<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, "")
    .replace(/\s*<!-- seo:structured-data:start -->[\s\S]*?<!-- seo:structured-data:end -->/i, "")
    .replace('<div id="root"></div>', '<div id="root"><main class="route-error"><p>404</p><h1>Страница не найдена</h1><a href="/">Вернуться на Andrian.Dev</a></main></div>')
    .replace(/\s*<script\s+type="module"[^>]*><\/script>/i, "");
  await writeFile(path.join(outDir, "404.html"), notFound, "utf8");
  await writeFile(path.join(outDir, "sitemap.xml"), createSitemap(), "utf8");
  await writeFile(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`, "utf8");
}

export function createSitemap() {
  const serviceUrls = seoContent.services.map((service) => `  <url><loc>${ORIGIN}/${service.slug}</loc><lastmod>${LAST_MODIFIED}</lastmod></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n  <url><loc>${ORIGIN}/</loc><lastmod>${LAST_MODIFIED}</lastmod><xhtml:link rel="alternate" hreflang="ru" href="${ORIGIN}/"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en"/><xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}/"/></url>\n  <url><loc>${ORIGIN}/en</loc><lastmod>${LAST_MODIFIED}</lastmod><xhtml:link rel="alternate" hreflang="ru" href="${ORIGIN}/"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en"/><xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}/"/></url>\n${serviceUrls}\n  <url><loc>${ORIGIN}/projects/nebo-bistro</loc><lastmod>${LAST_MODIFIED}</lastmod><xhtml:link rel="alternate" hreflang="ru" href="${ORIGIN}/projects/nebo-bistro"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en/projects/nebo-bistro"/></url>\n  <url><loc>${ORIGIN}/en/projects/nebo-bistro</loc><lastmod>${LAST_MODIFIED}</lastmod><xhtml:link rel="alternate" hreflang="ru" href="${ORIGIN}/projects/nebo-bistro"/><xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}/en/projects/nebo-bistro"/></url>\n</urlset>\n`;
}
