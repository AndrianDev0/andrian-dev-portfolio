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
    description: "A live restaurant experience that connects Telegram onboarding, an embedded prize wheel, and a clear in-venue reward handoff.",
    technologies: ["TypeScript", "Telegram WebApp", "Cloudflare D1"],
    kind: "bot",
    accent: "#6f8cff",
    liveUrl: "https://t.me/NeboBistroBot",
    previewUrl: process.env.NEXT_PUBLIC_NEBO_PREVIEW_URL ?? "https://t.me/NeboBistroBot",
    challenge: "Turn a restaurant promotion into a short, intuitive guest journey that feels native to Telegram and reaches a clear reward outcome.",
    solution: "The bot greets each guest and opens a mobile-first Mini App with a branded prize wheel. A protected control panel manages the welcome and team access.",
    result: "A deployed end-to-end experience: Telegram onboarding, wheel interaction, prize result, and a clear in-venue handoff to the waiter.",
  },
];

export const projectFacets = [
  { id: "01A", key: "mini-app", label: "NEBO BISTRO / MINI APP" },
  { id: "01B", key: "bot-flow", label: "NEBO BISTRO / BOT FLOW" },
] as const;

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
