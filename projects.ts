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

export const projectFacets = [
  { id: "01A", key: "mini-app", label: "NEBO BISTRO / MINI APP" },
  { id: "01B", key: "bot-flow", label: "NEBO BISTRO / BOT FLOW" },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
