import { Header, Hero } from "./components";
import {
  AboutSection,
  BenefitsSection,
  ContactSection,
  Footer,
  Marquee,
  ProcessSection,
  ProjectsSection,
  ServicesSection,
  TechnologiesSection,
} from "./sections";

export default function HomeApp() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <ProjectsSection />
        <ServicesSection />
        <BenefitsSection />
        <ProcessSection />
        <TechnologiesSection />
        <Marquee />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
