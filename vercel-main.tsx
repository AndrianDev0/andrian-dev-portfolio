import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Header, Hero } from "./components";
import { LanguageProvider } from "./i18n";
import { AppIntro } from "./intro";
import { getProject } from "./projects";
import { AboutSection, BenefitsSection, ContactSection, Footer, Marquee, ProcessSection, ProjectsSection, ServicesSection, TechnologiesSection } from "./sections";
import { ProjectCaseClient } from "./app/projects/[slug]/case-client";
import "./app/globals.css";
import { ThemeProvider } from "./theme";

function HomePage() {
  return <><AppIntro /><Header /><main id="main-content" tabIndex={-1}><Hero /><ProjectsSection /><ServicesSection /><BenefitsSection /><ProcessSection /><TechnologiesSection /><Marquee /><AboutSection /><ContactSection /></main><Footer /></>;
}

function VercelApp() {
  const projectMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) {
    const project = getProject(projectMatch[1]);
    if (project) return <ProjectCaseClient project={project} />;
  }
  return <HomePage />;
}

document.documentElement.style.setProperty("--font-geist", '"Manrope"');
document.documentElement.style.setProperty("--font-geist-mono", '"Manrope"');
document.documentElement.style.setProperty("--font-cyrillic", '"Manrope"');

createRoot(document.getElementById("root")!).render(
  <StrictMode><ThemeProvider><LanguageProvider><VercelApp /></LanguageProvider></ThemeProvider></StrictMode>,
);
