import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { siteConfig } from "../site";
import { LanguageProvider } from "../i18n";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-cyrillic", subsets: ["cyrillic", "latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    images: [{ url: "/og-v2.jpg", width: 1200, height: 630, alt: "Andrian.Dev — websites, Telegram bots and Mini Apps" }],
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description, images: ["/og-v2.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${manrope.variable}`}><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
