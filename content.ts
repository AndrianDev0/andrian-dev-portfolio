import { seoServices, serviceRoutePath } from "./site-registry";

const serviceVisuals = ["browser", "chat", "dashboard", "nodes"] as const;

if (seoServices.length !== serviceVisuals.length) {
  throw new Error("Every SEO service needs a home-page visual");
}

export const services = seoServices.map((service, index) => ({
  id: String(index + 1).padStart(2, "0"),
  visual: serviceVisuals[index]!,
  href: serviceRoutePath(service.slug),
}));

export const benefits = [
  { id: "01" },
  { id: "02" },
  { id: "03" },
  { id: "04" },
  { id: "05" },
] as const;

export const processSteps = [
  { id: "01" },
  { id: "02" },
  { id: "03" },
  { id: "04" },
  { id: "05" },
  { id: "06" },
] as const;

export const technologies = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Telegram Bot API", "REST API", "PostgreSQL", "Git",
] as const;
