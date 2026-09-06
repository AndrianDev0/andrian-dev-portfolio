"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "./i18n";
import "./styles/hero-studio.css";

export function HeroVisual() {
  const { language } = useLanguage();
  const ru = language === "ru";

  return (
    <div className="nebo-proof" aria-label={ru ? "Реальный проект Nebo Bistro: путь от Telegram-бота к мини-приложению" : "Real Nebo Bistro project: from Telegram bot to mini app"}>
      <a className="nebo-proof-frame" href="/projects/nebo-bistro" aria-label={ru ? "Открыть кейс Nebo Bistro" : "Open the Nebo Bistro case study"}>
        <div className="nebo-proof-top">
          <span><i />{ru ? "РЕАЛЬНЫЙ ПРОЕКТ" : "REAL PROJECT"}</span>
          <span>BOT <ArrowRight aria-hidden="true" size={12} /> MINI APP</span>
        </div>
        <div className="nebo-proof-media">
          <figure className="nebo-proof-bot">
            <img src="/nebo/case/bot-welcome-hd.webp" alt={ru ? "Сообщение Telegram-бота Nebo Bistro" : "Nebo Bistro Telegram bot welcome message"} width="1178" height="2560" fetchPriority="high" />
            <figcaption>01 / TELEGRAM BOT</figcaption>
          </figure>
          <figure className="nebo-proof-app">
            <img src="/nebo/case/prize-wheel-hd.webp" alt={ru ? "Колесо призов в мини-приложении Nebo Bistro" : "Prize wheel in the Nebo Bistro mini app"} width="1178" height="2560" fetchPriority="high" />
            <figcaption>02 / MINI APP</figcaption>
          </figure>
          <span className="nebo-proof-direction" aria-hidden="true"><ArrowRight size={15} /></span>
        </div>
        <div className="nebo-proof-footer">
          <div><strong>NEBO BISTRO</strong><span>{ru ? "Привлечение гостей · реклама партнёров" : "Customer acquisition · partner promotion"}</span></div>
          <span className="nebo-proof-open">{ru ? "Смотреть кейс" : "View case"}<ArrowUpRight aria-hidden="true" size={16} /></span>
        </div>
      </a>
      <div className="nebo-proof-note" aria-hidden="true"><span>SELECTED WORK / 2026</span><span>@NeboBistroBot</span></div>
    </div>
  );
}
