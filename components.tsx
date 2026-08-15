"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useLanguage } from "./i18n";
import { siteConfig } from "./site";
import { submitProjectRequest } from "./submit";
import { DecryptedText } from "./react-bits";
import { ThemeToggle } from "./theme";

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: React.ReactNode; copy?: string }) {
  return (
    <div className="section-heading">
      <Reveal><p className="eyebrow"><span />{eyebrow}</p></Reveal>
      <Reveal delay={0.05}><h2>{title}</h2></Reveal>
      {copy ? <Reveal delay={0.1}><p className="section-copy">{copy}</p></Reveal> : null}
    </div>
  );
}

export function MagneticButton({ href, children, className = "", external = false }: { href: string; children: React.ReactNode; className?: string; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate3d(0,0,0)"; };
  return (
    <a ref={ref} href={href} className={`magnetic-button ${className}`} onMouseMove={move} onMouseLeave={reset} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      <span>{children}</span><ArrowUpRight aria-hidden="true" size={19} />
    </a>
  );
}

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav className="nav-shell" aria-label={t.navigation}>
        <a className="brand" href="#top" aria-label={`${siteConfig.name} home`}><span className="brand-mark"><i /></span><span className="brand-word">{siteConfig.name}</span></a>
        <div className="nav-links">{siteConfig.nav.map((item, index) => <a key={item.href} href={item.href}>{t.nav[index]}</a>)}</div>
        <div className="nav-actions">
          <div className="language-switcher" role="group" aria-label="Language / Язык">
            <button type="button" className={language === "en" ? "is-active" : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
            <button type="button" className={language === "ru" ? "is-active" : ""} aria-pressed={language === "ru"} onClick={() => setLanguage("ru")}>RU</button>
          </div>
          <ThemeToggle />
          <a className="nav-cta" href="#contact">{t.startProject} <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.9} /></a>
        </div>
        <button type="button" className="menu-button" aria-label={open ? t.closeMenu : t.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div id="mobile-navigation" className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            {siteConfig.nav.map((item, index) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}><span>0{index + 1}</span>{t.nav[index]}</a>)}
            <a className="mobile-menu-cta" href="#contact" onClick={() => setOpen(false)}>{t.startProject} <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.9} /></a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function HeroVisual() {
  const { language } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let nextX = 0;
    let nextY = 0;
    const paint = () => { node.style.setProperty("--mx", nextX.toFixed(2)); node.style.setProperty("--my", nextY.toFixed(2)); frame = 0; };
    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const rect = node.getBoundingClientRect();
      nextX = (event.clientX - rect.left) / rect.width - 0.5;
      nextY = (event.clientY - rect.top) / rect.height - 0.5;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const reset = () => { nextX = 0; nextY = 0; if (!frame) frame = requestAnimationFrame(paint); };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", reset);
    return () => { node.removeEventListener("pointermove", onMove); node.removeEventListener("pointerleave", reset); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return (
    <div className="hero-visual" ref={ref} role="img" aria-label={language === "ru" ? "Система цифровых продуктов: сайт, Telegram-бот и автоматизация" : "A connected system of a website, Telegram bot, and automation"}>
      <div className="visual-aura" /><div className="visual-grid" />
      <div className="depth-scene">
        <div className="machine-shadow" />
        <div className="core-machine">
          <div className="core-topline"><span>PRODUCT SYSTEM</span><span className="signal">LIVE</span></div>
          <div className="core-screen"><span className="core-kicker">DIGITAL CORE / 01</span><strong>IDEA<br />TO&nbsp;IMPACT</strong><div className="core-meter"><i /><i /><i /><i /><i /></div></div>
          <div className="core-footer"><span>DESIGN</span><span>BUILD</span><span>CONNECT</span></div>
        </div>
        <div className="float-card website-card" aria-hidden="true">
          <div className="mini-window-bar"><i /><i /><i /><span>andrian.dev / web</span></div>
          <div className="mini-web"><span className="mini-logo">WEB / INTERFACE</span><strong>{language === "ru" ? <>Сложное —<br />понятно.</> : <>Make complexity<br />feel clear.</>}</strong><div className="mini-web-lines"><i /><i /></div><b>{language === "ru" ? "ОТКРЫТЬ" : "EXPLORE"} →</b></div>
        </div>
        <div className="float-card bot-card" aria-hidden="true">
          <div className="bot-head"><span className="avatar"><ArrowUpRight aria-hidden="true" /></span><span><b>Telegram Flow</b><small>TELEGRAM BOT · {language === "ru" ? "В СЕТИ" : "ONLINE"}</small></span><i /></div>
          <div className="bot-message user">{language === "ru" ? "Хочу заказать сайт" : "I want to order a website"}</div><div className="bot-message bot">{language === "ru" ? "Отлично. Какой формат нужен?" : "Great. What type do you need?"}</div>
          <div className="bot-options"><span>{language === "ru" ? "Лендинг" : "Landing"}</span><span>{language === "ru" ? "Бизнес" : "Business"}</span><span>{language === "ru" ? "Веб-сервис" : "Web App"}</span></div>
        </div>
        <div className="float-card automation-card" aria-hidden="true"><div className="card-label"><span>AUTOMATION</span><b>RUNNING</b></div><div className="flow-row"><span>LEAD</span><i /><span>BOT</span><i /><span>CRM</span><i /><span>SALE</span></div><div className="flow-status"><span>Workflow 04</span><strong>0.8s</strong></div></div>
        <div className="float-card code-card" aria-hidden="true"><div className="code-top"><i /><i /><i /><span>project.ts</span></div><pre><em>const</em> project = {`{`}<br />&nbsp;&nbsp;design: <b>true</b>,<br />&nbsp;&nbsp;development: <b>true</b>,<br />&nbsp;&nbsp;automation: <b>true</b><br />{`}`}</pre></div>
        <div className="datum datum-one" aria-hidden="true"><span>01</span><i />{language === "ru" ? "СИСТЕМА ГОТОВА" : "SYSTEM READY"}</div><div className="datum datum-two" aria-hidden="true"><span>99</span><i />{language === "ru" ? "СКОРОСТЬ" : "PERFORMANCE"}</div>
      </div>
    </div>
  );
}

export function Hero() {
  const { language, t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const visualOpacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  return (
    <section id="top" className="hero" ref={ref}>
      <div className="hero-noise" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <motion.p className="hero-label" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}><span className="hero-label-dot" /><DecryptedText text={t.hero.label} encryptedClassName="hero-label-encrypted" /></motion.p>
          <h1>
            <span className="hero-line-mask"><motion.span className="hero-line" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}>{language === "ru" ? <>Создаю <em>цифровые</em></> : <>I build <em>digital</em></>}</motion.span></span>
            <span className="hero-line-mask"><motion.span className="hero-line" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>{language === "ru" ? <><em>продукты</em> для</> : <><em>products</em> that move</>}</motion.span></span>
            <span className="hero-line-mask"><motion.span className="hero-line" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}>{language === "ru" ? "роста бизнеса." : "businesses forward."}</motion.span></span>
          </h1>
          <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.7 }}>{t.hero.subtitle}</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.7 }}><a className="button button-primary" href="#contact">{t.startProject} <ArrowRight size={18} /></a><a className="button button-ghost" href="#work">{t.hero.viewWork} <span>↓</span></a></motion.div>
          <motion.div className="hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.7 }}><span>{t.hero.trust[0]}</span><i /><span>{t.hero.trust[1]}</span><i /><span>{t.hero.trust[2]}</span><i /><span>{t.hero.trust[3]}</span></motion.div>
        </div>
        <motion.div className="hero-visual-wrap" style={{ y: visualY, scale: visualScale, opacity: visualOpacity }}><HeroVisual /></motion.div>
      </div>
      <motion.a className="scroll-cue" href="#work" style={{ opacity: scrollOpacity }}><span>{t.hero.scroll}</span><ArrowDown aria-hidden="true" size={15} /></motion.a>
    </section>
  );
}

export function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("loading");
    setMessage("");
    const form = new FormData(formElement);
    try {
      const result = await submitProjectRequest({
        name: String(form.get("name") ?? ""),
        contact: String(form.get("contact") ?? ""),
        projectDescription: String(form.get("projectDescription") ?? ""),
        budget: String(form.get("budget") ?? ""),
      });
      if (!result.ok) throw new Error("SUBMISSION_FAILED");
      formElement.reset();
      setStatus("success");
    } catch (error) {
      setMessage(error instanceof Error && error.message === "MISSING_FIELDS" ? t.form.incomplete : t.form.error);
      setStatus("error");
    }
  };
  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field-row"><label><span>{t.form.name} *</span><input name="name" autoComplete="name" required maxLength={100} placeholder={t.form.namePlaceholder} /></label><label><span>{t.form.contact} *</span><input name="contact" autoComplete="email" required maxLength={150} placeholder={t.form.contactPlaceholder} /></label></div>
      <label><span>{t.form.need} *</span><textarea name="projectDescription" required maxLength={3000} rows={5} placeholder={t.form.needPlaceholder} /></label>
      <label><span>{t.form.budget}</span><select name="budget" defaultValue=""><option value="">{t.form.budgetPlaceholder}</option>{siteConfig.budgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}</select></label>
      <button className="submit-button" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <><span className="spinner" /> {t.form.sending}</> : <>{t.form.send} <ArrowUpRight size={19} /></>}
      </button>
      <div className="form-feedback" aria-live="polite">{status === "success" ? <span className="success-message"><i><Check aria-hidden="true" size={16} /></i><span><b>{t.form.sent}</b>{t.form.followUp}</span></span> : status === "error" ? <span className="error-message">{message}</span> : null}</div>
    </form>
  );
}
