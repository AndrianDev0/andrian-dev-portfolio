export type ProjectKind = "website" | "bot" | "app";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  kind: ProjectKind;
  accent: string;
  liveUrl: string;
  previewUrl: string;
  challenge: string;
  solution: string;
  result: string;
};

export type PortfolioHighlight = {
  id: string;
  slug: string;
  title: string;
  category: { en: string; ru: string };
  description: { en: string; ru: string };
  status: { en: string; ru: string };
  technologies: string[];
  accent: string;
  visual: "drop" | "trainer";
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: "01",
    slug: "nebo-bistro",
    title: "NEBO BISTRO",
    category: "Telegram Bot + Mini App",
    description: "A live customer-acquisition campaign that connects Telegram onboarding, restaurant and sponsor rewards, and a clear in-venue handoff.",
    technologies: ["TypeScript", "Telegram WebApp", "Cloudflare D1"],
    kind: "bot",
    accent: "#6f8cff",
    liveUrl: "https://t.me/NeboBistroBot",
    previewUrl: "https://t.me/NeboBistroBot",
    challenge: "Attract new guests and give sponsors a visible but natural role inside a short Telegram promotion. During rollout, the initial Vercel deployment also hit load limits, so the product had to become more resilient without complicating the guest experience.",
    solution: "The bot greets each guest and opens a mobile-first Mini App whose prize wheel combines restaurant and sponsor rewards. The data layer uses Cloudflare D1, while a protected control panel manages content and team access.",
    result: "A deployed acquisition and sponsor-advertising channel: Telegram onboarding, prize interaction, partner result, and a clear in-venue handoff to the waiter.",
  },
];

export const portfolioHighlights: PortfolioHighlight[] = [
  {
    id: "02",
    slug: "drop-3d-store",
    title: "DROP / AIR FORCE 1",
    category: {
      en: "Interactive 3D commerce concept",
      ru: "Интерактивный 3D-концепт магазина",
    },
    description: {
      en: "An art-directed sneaker storefront with a real-time 3D product, scroll choreography, three editions, and a responsive purchase flow.",
      ru: "Иммерсивная витрина кроссовок с 3D-моделью в реальном времени, сценарной прокруткой, тремя версиями товара и адаптивным выбором покупки.",
    },
    status: { en: "LIVE CONCEPT", ru: "РАБОЧИЙ КОНЦЕПТ" },
    technologies: ["React", "Three.js", "WebGL"],
    accent: "#7445ed",
    visual: "drop",
    liveUrl: "https://drop-air-force-1.quad-thatch-5fteamfa.chatgpt.site",
  },
  {
    id: "03",
    slug: "ai-support-trainer",
    title: "AI SUPPORT / 30",
    category: {
      en: "Telegram product architecture",
      ru: "Проектирование Telegram-продукта",
    },
    description: {
      en: "An MVP structure for a guided 30-day program: interactive diagnosis, paid access, daily scenarios, progress tracking, and an instant-support mode.",
      ru: "Архитектура MVP для 30-дневной программы: интерактивная диагностика, оплата и доступ, ежедневные сценарии, сохранение прогресса и режим быстрой поддержки.",
    },
    status: { en: "MVP IN DESIGN", ru: "MVP В ПРОЕКТИРОВАНИИ" },
    technologies: ["Telegram Bot", "AI", "Product Flow"],
    accent: "#61d6b3",
    visual: "trainer",
  },
];

export const projectFacets = [
  { id: "01A", key: "mini-app", label: "NEBO BISTRO / MINI APP" },
  { id: "01B", key: "bot-flow", label: "NEBO BISTRO / BOT FLOW" },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
