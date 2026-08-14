"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, CircleDot, Code2, Layers3, MoveUpRight, Send, Sparkles } from "lucide-react";
import { useRef } from "react";
import { benefits, processSteps, services, technologies } from "./content";
import { metrics, siteConfig } from "./site";
import { projectFacets, projects } from "./projects";
import { ContactForm, MagneticButton, Reveal, SectionHeading } from "./components";
import { projectRussian, useLanguage } from "./i18n";
import { NeboBotFlowVisual, NeboMiniAppVisual, ProjectVisual, ServiceVisual } from "./visuals";
import { ShinyText, SpotlightCard } from "./react-bits";

export function ProjectsSection() {
  const { language, t } = useLanguage();
  const project = projects[0];
  const localized = projectRussian[project.slug];
  const facetVisuals = [<NeboMiniAppVisual key="mini-app" />, <NeboBotFlowVisual key="bot-flow" />];

  return (
    <section id="work" className="projects section-pad">
      <div className="container">
        <SectionHeading eyebrow={t.projects.eyebrow} title={<>{t.projects.titleTop}<br /><span className="soft">{t.projects.titleBottom}</span></>} copy={t.projects.copy} />
        <div className="project-list project-list-single">
          <Reveal className="project-reveal">
            <article className={`project-card project-${project.kind} project-flagship`} style={{ "--project-accent": project.accent } as React.CSSProperties}>
              <div className="project-meta">
                <div className="project-index"><span>{project.id}</span><i /></div>
                <div>
                  <p>{(language === "ru" ? localized.category : project.category).toUpperCase()}</p>
                  <h3>{project.title}</h3>
                  <span className="demo-label live-label"><i />{t.projects.real}</span>
                  <p className="project-description">{language === "ru" ? localized.description : project.description}</p>
                  <div className="tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
                  <div className="project-actions">
                    <a className="case-link" href={`/projects/${project.slug}`}>{t.projects.view} <ArrowUpRight size={17} /></a>
                    <a className="case-link case-link-live" href={project.liveUrl} target="_blank" rel="noreferrer">{t.projects.openTelegram} <ArrowUpRight size={17} /></a>
                  </div>
                </div>
              </div>
              <motion.div className="project-visual-shell" initial={{ scale: 0.94, y: 44 }} whileInView={{ scale: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}><ProjectVisual project={project} /></motion.div>
            </article>
          </Reveal>
          <div className="project-layers">
            {projectFacets.map((facet, index) => (
              <Reveal key={facet.key} delay={index * 0.06} className="project-layer-reveal">
                <article className="project-layer-card" id={facet.key}>
                  <div className="project-layer-heading"><span>{facet.id}</span><p>{facet.label}</p></div>
                  <div className="project-layer-copy"><h3>{t.projects.layers[index][0]}</h3><p>{t.projects.layers[index][1]}</p></div>
                  <div className="project-layer-visual">{facetVisuals[index]}</div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const { t } = useLanguage();
  return (
    <section id="services" className="services section-pad">
      <div className="container">
        <SectionHeading eyebrow={t.services.eyebrow} title={<>{t.services.titleTop}<br /><span className="soft">{t.services.titleBottom}</span></>} copy={t.services.copy} />
        <div className="services-grid">
          {services.map((service, index) => <Reveal key={service.id} delay={index * 0.04} className={`service-item service-${index + 1}`}><SpotlightCard spotlightColor={index % 2 === 0 ? "rgba(111, 140, 255, 0.15)" : "rgba(157, 124, 255, 0.13)"}><div className="service-number">{service.id}</div><div className="service-text"><h3>{t.services.items[index][0]}</h3><p>{t.services.items[index][1]}</p><span>{t.services.explore} <ArrowRight size={14} /></span></div><div className="service-visual"><ServiceVisual type={service.visual} /></div></SpotlightCard></Reveal>)}
        </div>
      </div>
    </section>
  );
}

const benefitIcons = [<Sparkles key="sparkles" />, <CircleDot key="circle" />, <MoveUpRight key="move" />, <Layers3 key="layers" />, <Code2 key="code" />];

export function BenefitsSection() {
  const { t } = useLanguage();
  return (
    <section className="benefits section-pad-sm">
      <div className="container benefits-layout">
        <div className="benefits-intro"><p className="eyebrow"><span />{t.benefits.eyebrow}</p><h2>{t.benefits.title} <em>{t.benefits.titleAccent}</em></h2><p>{t.benefits.copy}</p></div>
        <div className="benefit-list">{benefits.map((benefit, index) => <Reveal key={benefit.title} delay={index * 0.035}><article><span className="benefit-icon">{benefitIcons[index]}</span><span className="benefit-number">0{index + 1}</span><div><h3>{t.benefits.items[index][0]}</h3><p>{t.benefits.items[index][1]}</p></div></article></Reveal>)}</div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });
  return (
    <section id="process" className="process section-pad">
      <div className="container">
        <SectionHeading eyebrow={t.process.eyebrow} title={<>{t.process.titleTop}<br /><span className="soft">{t.process.titleBottom}</span></>} copy={t.process.copy} />
        <div className="timeline" ref={ref}><div className="timeline-line"><motion.i style={{ scaleY }} /></div>{processSteps.map((step, index) => <motion.article key={step.id} className="timeline-step" initial={{ opacity: 0.34 }} whileInView={{ opacity: 1 }} viewport={{ amount: 0.55 }} transition={{ duration: 0.45 }}><span className="timeline-index">{step.id}</span><span className="timeline-dot"><i /></span><div><h3>{t.process.items[index][0]}</h3><p>{t.process.items[index][1]}</p></div><span className="timeline-phase">{t.process.phase} {index + 1}</span></motion.article>)}</div>
      </div>
    </section>
  );
}

export function TechnologiesSection() {
  const { t } = useLanguage();
  const first = technologies.slice(0, 6);
  const second = technologies.slice(6);
  return (
    <section className="technologies section-pad-sm"><div className="container"><div className="tech-heading"><p className="eyebrow"><span />{t.technologies.eyebrow}</p><p>{t.technologies.copyTop}<br /><ShinyText text={t.technologies.copyBottom} /></p></div><div className="tech-rows"><div>{first.map((tech) => <span key={tech}>{tech}</span>)}</div><div>{second.map((tech) => <span key={tech}>{tech}</span>)}</div></div></div></section>
  );
}

export function Marquee() {
  const { language } = useLanguage();
  const text = language === "ru" ? "ВЕБ-РАЗРАБОТКА • TELEGRAM-БОТЫ • ВЕБ-ПРИЛОЖЕНИЯ • АВТОМАТИЗАЦИЯ • API • ДИЗАЙН • РАЗРАБОТКА • " : "WEB DEVELOPMENT • TELEGRAM BOTS • WEB APPS • AUTOMATION • API • DESIGN • DEVELOPMENT • ";
  return <div className="marquee" aria-hidden="true"><div><span>{text}</span><span>{text}</span></div></div>;
}

export function AboutSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="about section-pad"><div className="container"><div className="about-top"><p className="eyebrow"><span />{t.about.eyebrow}</p><span className="about-side">{t.about.sideTop}<br />{t.about.sideBottom}</span></div><Reveal><p className="about-statement">{t.about.intro} <em>{t.about.accent}</em> {t.about.tail}</p></Reveal><div className="metrics">{metrics.map((metric, index) => <Reveal key={metric.label} delay={index * 0.07}><div><strong>{metric.value}</strong><span>{t.about.metrics[index]}</span></div></Reveal>)}</div></div></section>
  );
}

export function ContactSection() {
  const { t } = useLanguage();
  const telegramUrl = `https://t.me/${siteConfig.telegram.replace(/^@/, "")}`;
  return (
    <section id="contact" className="contact section-pad"><div className="contact-orb" /><div className="container"><div className="contact-heading"><p className="eyebrow"><span />{t.contact.eyebrow}</p><Reveal><h2>{t.contact.question}</h2></Reveal><Reveal delay={0.06}><h2 className="outline-line">{t.contact.titleTop}<br /><em>{t.contact.titleAccent}</em></h2></Reveal><p>{t.contact.copy}</p></div><div className="contact-layout"><div className="contact-direct"><span>{t.contact.ready}</span><MagneticButton href={telegramUrl} external className="telegram-button">{t.contact.telegram} <Send size={18} /></MagneticButton><a href={`mailto:${siteConfig.email}`}>{siteConfig.email} <ArrowUpRight size={16} /></a><div className="availability"><i /> {t.contact.available}</div></div><ContactForm /></div></div></section>
  );
}

export function Footer() {
  const { t } = useLanguage();
  return <footer><div className="container footer-main"><a className="footer-brand" href="#top"><span />{siteConfig.name}</a><nav aria-label={t.footer.navigation}>{siteConfig.nav.filter((item) => item.href !== "#about").map((item) => <a key={item.href} href={item.href}>{t.nav[siteConfig.nav.findIndex((navItem) => navItem.href === item.href)]}</a>)}</nav><div><a className="footer-social-link" href={`https://t.me/${siteConfig.telegram}`} target="_blank" rel="noreferrer"><span>Telegram</span><i><ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} /></i></a><a className="footer-social-link" href={`mailto:${siteConfig.email}`}><span>Email</span><i><ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.8} /></i></a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span>{t.footer.crafted}</span><a href="#top">{t.footer.back} ↑</a></div></footer>;
}
