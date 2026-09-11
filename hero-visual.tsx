"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useLanguage } from "./i18n";
import { selectFeaturedProject } from "./featured-project";
import "./styles/hero-studio.css";

const heroProjects = [
  { id: "nebo", title: "NEBO BISTRO", href: "/projects/nebo-bistro", external: false },
  { id: "drop", title: "DROP / AIR FORCE 1", href: "/projects/drop-3d-store", external: false },
  { id: "tehnotek", title: "ТЕХНОТЭК", href: "/projects/tehnotek-prototype", external: false },
] as const;

function ProjectMedia({ id, ru, active }: { id: (typeof heroProjects)[number]["id"]; ru: boolean; active: boolean }) {
  if (id === "nebo") {
    return (
      <div className="hero-project-media hero-project-media-nebo">
        <figure className="nebo-proof-bot">
          <img src="/nebo/case/bot-welcome-hd.webp" alt={ru ? "Сообщение Telegram-бота Nebo Bistro" : "Nebo Bistro Telegram bot welcome message"} width="1178" height="2560" loading={active ? "eager" : "lazy"} fetchPriority={active ? "high" : "auto"} />
          <figcaption>01 / TELEGRAM BOT</figcaption>
        </figure>
        <figure className="nebo-proof-app">
          <img src="/nebo/case/prize-wheel-hd.webp" alt={ru ? "Колесо призов в мини-приложении Nebo Bistro" : "Prize wheel in the Nebo Bistro mini app"} width="1178" height="2560" loading={active ? "eager" : "lazy"} fetchPriority={active ? "high" : "auto"} />
          <figcaption>02 / MINI APP</figcaption>
        </figure>
        <span className="nebo-proof-direction" aria-hidden="true"><ArrowRight size={15} /></span>
      </div>
    );
  }

  if (id === "drop") {
    return <div className="hero-project-media hero-project-image"><picture><source media="(max-width: 600px)" srcSet="/projects/drop-mobile-first-screen.png" /><img src="/projects/drop-air-force-1.webp" alt={ru ? "Первый экран интерактивного 3D-концепта магазина DROP" : "First screen of the DROP interactive 3D store concept"} width="1280" height="720" loading={active ? "eager" : "lazy"} fetchPriority={active ? "high" : "auto"} decoding="async" /></picture></div>;
  }

  return <div className="hero-project-media hero-project-image hero-project-image-tehnotek"><picture><source media="(max-width: 600px)" srcSet="/projects/tehnotek-mobile-first-screen.png" /><img src="/projects/tehnotek-prototype.webp" alt={ru ? "Первый экран прототипа продуктовой страницы ТЕХНОТЭК" : "First screen of the TEHNOTEK product page prototype"} width="1280" height="720" loading={active ? "eager" : "lazy"} fetchPriority={active ? "high" : "auto"} decoding="async" /></picture></div>;
}

export function HeroVisual() {
  const { language } = useLanguage();
  const ru = language === "ru";
  const [active, setActive] = useState(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const total = heroProjects.length;
  const move = (direction: number) => setActive((current) => (current + direction + total) % total);

  useEffect(() => {
    selectFeaturedProject(heroProjects[active].id);
  }, [active]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  };

  return (
    <section
      className="hero-project-carousel"
      aria-roledescription="carousel"
      aria-label={ru ? "Избранные проекты" : "Selected projects"}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") move(-1);
        if (event.key === "ArrowRight") move(1);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      <div className="hero-project-viewport" aria-live="polite">
        {heroProjects.map((project, index) => {
          const isActive = index === active;
          const projectHref = !project.external && language === "en" ? `/en${project.href}` : project.href;
          const isPrototype = project.id === "tehnotek";
          return (
            <article className={`hero-project-slide hero-project-slide-${project.id}${isActive ? " is-active" : ""}`} aria-hidden={!isActive} key={project.id}>
              <a className="hero-project-frame" href={projectHref} target={project.external ? "_blank" : undefined} rel={project.external ? "noreferrer" : undefined} tabIndex={isActive ? 0 : -1}>
                <div className="hero-project-top">
                  <span><i />{isPrototype ? (ru ? "ПРОТОТИП" : "PROTOTYPE") : project.id === "nebo" ? (ru ? "РЕАЛЬНЫЙ ПРОЕКТ" : "REAL PROJECT") : (ru ? "РАБОЧИЙ КОНЦЕПТ" : "LIVE CONCEPT")}</span>
                  <span>{project.id === "nebo" ? <>BOT <ArrowRight aria-hidden="true" size={12} /> MINI APP</> : project.id === "drop" ? "THREE.JS / WEBGL" : "B2B / PRODUCT PAGE"}</span>
                </div>
                <ProjectMedia id={project.id} ru={ru} active={isActive} />
                <div className="hero-project-footer">
                  <div><strong>{project.title}</strong><span>{project.id === "nebo" ? (ru ? "Привлечение гостей · реклама партнёров" : "Customer acquisition · partner promotion") : project.id === "drop" ? (ru ? "3D-витрина продукта" : "3D product storefront") : (ru ? "Инженерная продуктовая страница" : "Industrial product page")}</span></div>
                  <span className="hero-project-open">{ru ? "Смотреть кейс" : "View case"}<ArrowUpRight aria-hidden="true" size={16} /></span>
                </div>
              </a>
            </article>
          );
        })}
      </div>
      <div className="hero-project-controls">
        <span className="hero-project-count">{String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        <div className="hero-project-dots" aria-label={ru ? "Выбрать проект" : "Choose a project"}>
          {heroProjects.map((project, index) => <button type="button" key={project.id} aria-label={`${ru ? "Показать" : "Show"} ${project.title}`} aria-pressed={index === active} onClick={() => setActive(index)} />)}
        </div>
        <div className="hero-project-arrows">
          <button type="button" onClick={() => move(-1)} aria-label={ru ? "Предыдущий проект" : "Previous project"}><ArrowLeft aria-hidden="true" size={17} /></button>
          <button type="button" onClick={() => move(1)} aria-label={ru ? "Следующий проект" : "Next project"}><ArrowRight aria-hidden="true" size={17} /></button>
        </div>
      </div>
    </section>
  );
}
