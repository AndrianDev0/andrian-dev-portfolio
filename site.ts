export const siteConfig = {
  name: "Andrian.Dev",
  fullName: "ANDRIAN.DEV",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "Andrian.Dev — Websites, Telegram Bots & Automation",
  description: "Modern websites, Telegram bots, web apps, and automations. Современные сайты, Telegram-боты, веб-приложения и автоматизация.",
  telegram: "g1reshnik",
  email: "maa190186@gmail.com",
  budgets: ["up to 30,000 ₽", "30,000–70,000 ₽", "70,000–150,000 ₽", "150,000 ₽+"],
  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const metrics = [
  { value: "01", label: "real project" },
  { value: "02", label: "connected product layers" },
  { value: "100%", label: "responsive interface" },
];
