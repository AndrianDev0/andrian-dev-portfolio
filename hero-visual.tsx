"use client";

import { ArrowUpRight, Check, Code2, Send } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLanguage } from "./i18n";
import "./styles/hero-studio.css";

export function HeroVisual() {
  const { language } = useLanguage();
  const ru = language === "ru";
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine) and (min-width: 901px)");
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (!media.matches || frame) return;
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--studio-x", `${((event.clientX - rect.left) / rect.width - .5) * 6}deg`);
        node.style.setProperty("--studio-y", `${((event.clientY - rect.top) / rect.height - .5) * -4}deg`);
        frame = 0;
      });
    };
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      node.style.setProperty("--studio-x", "0deg");
      node.style.setProperty("--studio-y", "0deg");
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    media.addEventListener("change", reset);
    return () => { reset(); node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", reset); media.removeEventListener("change", reset); };
  }, []);

  return <div className="studio-visual" ref={ref} role="img" aria-label={ru ? "Единая система: веб-сайт, Telegram-бот и автоматизация" : "One connected system: website, Telegram bot and automation"}>
    <div className="studio-halo" />
    <div className="studio-object" aria-hidden="true">
      <div className="studio-chassis">
        <div className="studio-bar"><span className="studio-dots">● ● ●</span><span>andrian.dev / studio</span><Code2 size={14} /></div>
        <div className="studio-web">
          <div className="studio-web-nav"><b>A / D</b><span>DESIGN & DEVELOPMENT</span><ArrowUpRight size={15} /></div>
          <div className="studio-web-copy"><span className="studio-caption">{ru ? "ОТ ИДЕИ К ПРОДУКТУ" : "FROM IDEA TO PRODUCT"}</span><strong>{ru ? <>Продумано.<br /><em>До детали.</em></> : <>Considered.<br /><em>Every detail.</em></>}</strong><span className="studio-web-link">{ru ? "Сайты с характером" : "Websites with character"}<ArrowUpRight size={17} /></span></div>
          <div className="studio-sculpture"><i /><i /><i /><span>01</span></div>
          <div className="studio-web-bottom"><span>STRATEGY / DESIGN / CODE</span><span>01 — 03</span></div>
        </div>
        <div className="studio-system"><Code2 size={15} /><span>website<span className="studio-code-dot">.</span>connect(bot)</span><span className="studio-connected"><i />CONNECTED</span></div>
      </div>
      <div className="studio-rail"><i /></div>
      <div className="studio-telegram">
        <div className="studio-telegram-head"><span className="studio-send"><Send size={18} /></span><div><b>Telegram</b><span>{ru ? "Ваш цифровой помощник" : "Your digital assistant"}</span></div><span className="studio-online" /></div>
        <div className="studio-chat"><p className="studio-chat-out">{ru ? "Давайте создадим что-то классное." : "Let’s build something great."}</p><p className="studio-chat-in">{ru ? "Начнём с вашей идеи." : "It starts with your idea."}<span className="studio-chat-tick"><Check size={12} /> 12:41</span></p></div>
        <div className="studio-chat-action">{ru ? "Обсудить проект" : "Start a project"}<ArrowUpRight size={16} /></div>
      </div>
      <div className="studio-workflow"><span>AUTOMATION</span><b>LEAD</b><i /><b>BOT</b><i /><b>CRM</b><span className="studio-runtime">0.8s</span></div>
    </div>
    <div className="studio-footnote"><span>ANDRIAN / DIGITAL CRAFT</span><span>WEB + TELEGRAM + SYSTEMS</span></div>
  </div>;
}
