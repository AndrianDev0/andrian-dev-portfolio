"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { MagneticButton } from "../../../components";
import { projectRussian, useLanguage } from "../../../i18n";
import type { Project } from "../../../projects";
import { siteConfig } from "../../../site";
import { CaseStudyVisual } from "../../../visuals";
import { ThemeToggle } from "../../../theme";

export function ProjectCaseClient({ project }: { project: Project }) {
  const { language, setLanguage, t } = useLanguage();
  const localized = projectRussian[project.slug];
  const category = language === "ru" ? localized.category : project.category;
  const description = language === "ru" ? localized.description : project.description;
  const challenge = language === "ru" ? localized.challenge : project.challenge;
  const solution = language === "ru" ? localized.solution : project.solution;
  const result = language === "ru" ? localized.result : project.result;

  return (
    <main className="case-page" style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <nav className="case-nav"><a className="brand" href="/"><span className="brand-mark"><i /></span><span className="brand-word">{siteConfig.name}</span></a><div className="case-nav-actions"><div className="language-switcher" role="group" aria-label="Language / Язык"><button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button><button type="button" className={language === "ru" ? "is-active" : ""} aria-pressed={language === "ru"} onClick={() => setLanguage("ru")}>RU</button></div><ThemeToggle className="theme-toggle-case" /><a href="/#work"><ArrowLeft size={16} /> {t.case.allWork}</a></div></nav>
      <section className="case-hero container">
        <div className="case-head-meta"><span>{project.id} / {t.case.featured}</span><span>{category.toUpperCase()}</span><span className="demo-label live-label"><i />{t.case.real}</span></div>
        <h1>{project.title}</h1>
        <div className="case-summary"><p>{description}</p><div>{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
        <div className="case-project-actions"><a href={project.liveUrl} target="_blank" rel="noreferrer">{t.case.openTelegram} <ArrowUpRight size={16} /></a><a href={project.previewUrl} target="_blank" rel="noreferrer">{t.case.openMiniApp} <ArrowUpRight size={16} /></a></div>
        <div className="case-visual"><CaseStudyVisual kind={project.kind} /></div>
      </section>
      <section className="case-body container">
        <aside><span>{t.case.label}</span><p>{t.case.note}</p></aside>
        <div className="case-story">
          <article><span>01 / {t.case.challengeLabel}</span><h2>{t.case.challengeTitle}</h2><p>{challenge}</p></article>
          <article><span>02 / {t.case.solutionLabel}</span><h2>{t.case.solutionTitle}</h2><p>{solution}</p><ul>{t.case.points.map((point) => <li key={point}><Check size={15} /> {point}</li>)}</ul></article>
          <article><span>03 / {t.case.resultLabel}</span><h2>{t.case.resultTitle}</h2><p>{result}</p></article>
        </div>
      </section>
      <section className="case-next"><div className="container"><span>{t.case.similar}</span><h2>{t.case.nextTop}<br />{t.case.nextBottom}</h2><MagneticButton href="/#contact">{t.case.talk} <ArrowRight size={17} /></MagneticButton></div></section>
      <footer className="case-footer"><div className="container"><span>© {new Date().getFullYear()} {siteConfig.name}</span><a href={`https://t.me/${siteConfig.telegram}`} target="_blank" rel="noreferrer">Telegram <ArrowUpRight size={14} /></a></div></footer>
    </main>
  );
}
