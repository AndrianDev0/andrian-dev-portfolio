import { Header, Hero } from "../components";
import { AboutSection, BenefitsSection, ContactSection, Footer, Marquee, ProcessSection, ProjectsSection, ServicesSection, TechnologiesSection } from "../sections";

export default function Home() {
  return <><Header /><main><Hero /><ProjectsSection /><ServicesSection /><BenefitsSection /><ProcessSection /><TechnologiesSection /><Marquee /><AboutSection /><ContactSection /></main><Footer /></>;
}
