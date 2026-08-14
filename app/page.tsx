import { Header, Hero } from "../components";
import { AppIntro } from "../intro";
import { AboutSection, BenefitsSection, ContactSection, Footer, Marquee, ProcessSection, ProjectsSection, ServicesSection, TechnologiesSection } from "../sections";

export default function Home() {
  return <><AppIntro /><Header /><main><Hero /><ProjectsSection /><ServicesSection /><BenefitsSection /><ProcessSection /><TechnologiesSection /><Marquee /><AboutSection /><ContactSection /></main><Footer /></>;
}
