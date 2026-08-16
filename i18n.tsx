"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "ru";

const copy = {
  en: {
    nav: ["Work", "Services", "Process", "About", "Contact"],
    startProject: "Start a Project",
    navigation: "Primary navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    hero: {
      label: "WEB DEVELOPMENT / TELEGRAM BOTS / AUTOMATION",
      subtitle: "I build modern websites, Telegram bots, web apps, and automations — from idea and interface to a finished product.",
      viewWork: "View My Work",
      trust: ["Websites", "Telegram Bots", "Web Apps", "Automation"],
      scroll: "SCROLL TO EXPLORE",
    },
    projects: {
      eyebrow: "FEATURED CASE",
      titleTop: "One product.",
      titleBottom: "Multiple layers.",
      copy: "Nebo Bistro is my real Telegram case: a bot and Mini App designed as one connected system.",
      real: "REAL PROJECT",
      view: "Explore the case",
      openTelegram: "Open @NeboBistroBot",
      openMiniApp: "Open Mini App",
      layers: [
        ["Mini App interface", "A mobile prize experience embedded directly inside Telegram — no separate app required."],
        ["Bot flow", "The conversational entry point that welcomes the guest and connects them to the Mini App."],
      ],
    },
    services: {
      eyebrow: "WHAT I DO",
      titleTop: "Development built around",
      titleBottom: "business needs.",
      copy: "The interface is only one layer. I connect design, product logic, and the systems that make the result useful.",
      explore: "EXPLORE",
      items: [
        ["Web Development", "Landing pages, corporate websites, and custom builds with a clear conversion path."],
        ["Telegram Bots", "Lead capture, sales flows, support, subscriptions, catalogs, alerts, and CRM workflows."],
        ["Web Apps", "Dashboards, client accounts, internal systems, and focused web services."],
        ["Automation", "APIs, CRM, Telegram, notifications, and integrations that remove repetitive work."],
      ],
    },
    benefits: {
      eyebrow: "WHY WORK WITH ME",
      title: "Strong products begin with",
      titleAccent: "the right decisions.",
      copy: "I keep every phase connected to the outcome — so visual polish, technical choices, and business goals reinforce each other.",
      items: [
        ["More Than Code", "I start with the problem the product needs to solve — then choose the right interface and technology."],
        ["User-Focused", "Structure and interaction should feel clear without instructions, even when the system behind them is complex."],
        ["Mobile First", "Every key flow is shaped for small screens, real touch targets, and changing contexts."],
        ["End-to-End", "Design direction, development, integrations, testing, and launch stay connected from the first decision."],
        ["Built to Scale", "Clean data and component structures make the next feature easier to add, not harder."],
      ],
    },
    process: {
      eyebrow: "PROCESS",
      titleTop: "From idea",
      titleBottom: "to launch.",
      copy: "A clear path keeps the important decisions visible and prevents surprises late in the project.",
      phase: "PHASE",
      items: [
        ["Discovery", "We discuss the idea, goals, constraints, and the result the product needs to create."],
        ["Analysis", "I define the structure, functionality, priorities, and key user flows."],
        ["Design", "We shape a visual direction that fits the business and makes the product easy to understand."],
        ["Development", "I build the interface, integrations, and core functionality as one coherent system."],
        ["Testing", "Desktop, mobile, edge states, and the scenarios that matter most are checked before release."],
        ["Launch", "The finished product goes live with a clean handoff and a path for future iteration."],
      ],
    },
    technologies: { eyebrow: "TECHNOLOGIES", copyTop: "Reliable tools, chosen for the product —", copyBottom: "not for the trend." },
    about: {
      eyebrow: "ABOUT",
      sideTop: "BASED ONLINE",
      sideBottom: "AVAILABLE WORLDWIDE",
      intro: "I build digital products for businesses. My goal is not just to write code, but to create",
      accent: "clear, fast, visually strong products",
      tail: "that solve real problems.",
      metrics: ["real project", "connected product layers", "responsive interface"],
    },
    contact: {
      eyebrow: "START A PROJECT",
      question: "Have a project idea?",
      titleTop: "Let’s turn it into a",
      titleAccent: "working product.",
      copy: "Tell me what you need — I’ll suggest the right way to build it.",
      ready: "READY WHEN YOU ARE",
      telegram: "Message on Telegram",
      available: "AVAILABLE FOR NEW PROJECTS",
    },
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      contact: "Telegram / Email",
      contactPlaceholder: "@username or email",
      need: "What do you need built?",
      needPlaceholder: "A short description of the product, goal, or problem…",
      budget: "Approximate budget",
      budgetPlaceholder: "Select a range (optional)",
      send: "Send Request",
      sending: "Sending…",
      sent: "Request sent",
      followUp: "I’ll contact you using the details above.",
      incomplete: "Please complete the required fields.",
      error: "Something went wrong. Please try again.",
    },
    footer: { navigation: "Footer navigation", crafted: "DESIGNED & BUILT WITH INTENT", back: "BACK TO TOP" },
    case: {
      allWork: "All work",
      featured: "FEATURED CASE",
      real: "REAL PROJECT",
      label: "CASE STUDY",
      note: "A live Telegram product where the bot and Mini App form one connected guest journey.",
      openTelegram: "Open @NeboBistroBot",
      openMiniApp: "Open live Mini App",
      challengeLabel: "CHALLENGE",
      challengeTitle: "From Telegram entry to a clear reward.",
      solutionLabel: "SOLUTION",
      solutionTitle: "Bot and Mini App as one flow.",
      resultLabel: "RESULT",
      resultTitle: "A live, end-to-end guest experience.",
      points: ["Personalized Telegram onboarding", "Embedded prize-wheel experience", "Protected control panel"],
      similar: "NEED SOMETHING SIMILAR?",
      nextTop: "Let’s build a product",
      nextBottom: "that earns attention.",
      talk: "Let’s Talk",
    },
  },
  ru: {
    nav: ["Проекты", "Услуги", "Процесс", "Обо мне", "Контакты"],
    startProject: "Обсудить проект",
    navigation: "Основная навигация",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    hero: {
      label: "ВЕБ-РАЗРАБОТКА / TELEGRAM-БОТЫ / АВТОМАТИЗАЦИЯ",
      subtitle: "Создаю современные сайты, Telegram-ботов, веб-приложения и автоматизации — от идеи и интерфейса до готового продукта.",
      viewWork: "Смотреть работы",
      trust: ["Сайты", "Telegram-боты", "Веб-приложения", "Автоматизация"],
      scroll: "ЛИСТАЙТЕ ДАЛЬШЕ",
    },
    projects: {
      eyebrow: "РЕАЛЬНЫЙ КЕЙС",
      titleTop: "Один продукт.",
      titleBottom: "Несколько уровней.",
      copy: "Nebo Bistro — мой реальный Telegram-кейс. Бот и Mini App показаны как части одной цельной системы.",
      real: "РЕАЛЬНЫЙ ПРОЕКТ",
      view: "Разобрать кейс",
      openTelegram: "Открыть @NeboBistroBot",
      openMiniApp: "Открыть Mini App",
      layers: [
        ["Интерфейс Mini App", "Мобильная механика с призами прямо внутри Telegram — без отдельного приложения."],
        ["Сценарий бота", "Диалоговый вход, который приветствует гостя и связывает его с Mini App."],
      ],
    },
    services: {
      eyebrow: "ЧТО Я ДЕЛАЮ",
      titleTop: "Разработка вокруг",
      titleBottom: "задач бизнеса.",
      copy: "Интерфейс — только один слой. Я соединяю дизайн, продуктовую логику и системы, которые делают результат полезным.",
      explore: "ПОДРОБНЕЕ",
      items: [
        ["Веб-разработка", "Лендинги, корпоративные сайты и нестандартные проекты с понятным путём к целевому действию."],
        ["Telegram-боты", "Сбор заявок, продажи, поддержка, подписки, каталоги, уведомления и работа с CRM."],
        ["Веб-приложения", "Дашборды, личные кабинеты, внутренние системы и специализированные веб-сервисы."],
        ["Автоматизация", "API, CRM, Telegram, уведомления и интеграции, которые убирают рутинную работу."],
      ],
    },
    benefits: {
      eyebrow: "ПОЧЕМУ СО МНОЙ РАБОТАЮТ",
      title: "Сильный продукт начинается с",
      titleAccent: "верных решений.",
      copy: "Связываю каждый этап с результатом, чтобы визуальный уровень, технологии и цели бизнеса усиливали друг друга.",
      items: [
        ["Больше, чем код", "Сначала разбираюсь, какую задачу должен решить продукт, а затем выбираю подходящий интерфейс и технологии."],
        ["Фокус на пользователе", "Структура и взаимодействие должны быть понятны без инструкций, даже если внутри работает сложная система."],
        ["Сначала мобильные", "Ключевые сценарии проектируются для небольших экранов, реальных касаний и разных условий использования."],
        ["От идеи до запуска", "Дизайн, разработка, интеграции, тестирование и запуск остаются связаны с первого решения."],
        ["Готово к развитию", "Чистая структура данных и компонентов упрощает добавление новых функций в будущем."],
      ],
    },
    process: {
      eyebrow: "ПРОЦЕСС",
      titleTop: "От идеи",
      titleBottom: "до запуска.",
      copy: "Понятный процесс сохраняет важные решения на виду и исключает неприятные сюрпризы ближе к релизу.",
      phase: "ЭТАП",
      items: [
        ["Знакомство", "Обсуждаем идею, цели, ограничения и результат, который должен дать продукт."],
        ["Анализ", "Определяю структуру, функциональность, приоритеты и основные пользовательские сценарии."],
        ["Дизайн", "Создаём визуальное направление, которое подходит бизнесу и делает продукт понятным."],
        ["Разработка", "Собираю интерфейс, интеграции и основную функциональность в единую систему."],
        ["Тестирование", "Проверяю десктоп, мобильные устройства, пограничные состояния и ключевые сценарии."],
        ["Запуск", "Готовый продукт выходит в работу с понятной передачей и возможностью дальнейшего развития."],
      ],
    },
    technologies: { eyebrow: "ТЕХНОЛОГИИ", copyTop: "Надёжные инструменты под задачу —", copyBottom: "а не ради тренда." },
    about: {
      eyebrow: "ОБО МНЕ",
      sideTop: "РАБОТАЮ ОНЛАЙН",
      sideBottom: "ПО ВСЕМУ МИРУ",
      intro: "Создаю цифровые продукты для бизнеса. Моя цель — не просто написать код, а сделать",
      accent: "понятный, быстрый и визуально сильный продукт",
      tail: "который решает реальную задачу.",
      metrics: ["реальный проект", "связанных слоя продукта", "адаптивный интерфейс"],
    },
    contact: {
      eyebrow: "ОБСУДИТЬ ПРОЕКТ",
      question: "Есть идея проекта?",
      titleTop: "Давайте превратим её в",
      titleAccent: "работающий продукт.",
      copy: "Расскажите, что вам нужно — предложу подходящий способ реализации.",
      ready: "МОЖНО НАЧИНАТЬ",
      telegram: "Написать в Telegram",
      available: "ОТКРЫТ ДЛЯ НОВЫХ ПРОЕКТОВ",
    },
    form: {
      name: "Имя",
      namePlaceholder: "Как к вам обращаться",
      contact: "Telegram / Email",
      contactPlaceholder: "@username или email",
      need: "Что нужно разработать?",
      needPlaceholder: "Коротко опишите продукт, цель или задачу…",
      budget: "Примерный бюджет",
      budgetPlaceholder: "Выберите диапазон (необязательно)",
      send: "Отправить заявку",
      sending: "Отправляем…",
      sent: "Заявка отправлена",
      followUp: "Я свяжусь с вами по указанному контакту.",
      incomplete: "Заполните обязательные поля.",
      error: "Не удалось отправить заявку. Попробуйте ещё раз.",
    },
    footer: { navigation: "Навигация в подвале", crafted: "ПРОДУМАНО И РАЗРАБОТАНО", back: "НАВЕРХ" },
    case: {
      allWork: "Все проекты",
      featured: "ФЛАГМАНСКИЙ КЕЙС",
      real: "РЕАЛЬНЫЙ ПРОЕКТ",
      label: "КЕЙС",
      note: "Реальный Telegram-продукт, в котором бот и Mini App образуют единый путь гостя.",
      openTelegram: "Открыть @NeboBistroBot",
      openMiniApp: "Открыть Mini App",
      challengeLabel: "ЗАДАЧА",
      challengeTitle: "От входа в Telegram к понятному призу.",
      solutionLabel: "РЕШЕНИЕ",
      solutionTitle: "Бот и Mini App как единый сценарий.",
      resultLabel: "РЕЗУЛЬТАТ",
      resultTitle: "Работающий путь гостя от начала до конца.",
      points: ["Персональное приветствие в Telegram", "Встроенное колесо призов", "Защищённая панель управления"],
      similar: "НУЖЕН ПОХОЖИЙ ПРОЕКТ?",
      nextTop: "Давайте создадим продукт,",
      nextBottom: "который заслужит внимание.",
      talk: "Обсудить проект",
    },
  },
} as const;

type Copy = (typeof copy)[Language];

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: Copy;
} | null>(null);

function readLanguage(): Language {
  if (typeof document === "undefined") return "en";
  return document.documentElement.dataset.language === "ru" ? "ru" : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
  }, [language]);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    try { window.localStorage.setItem("portfolio-language", next); } catch { /* Storage may be unavailable. */ }
  };

  const value = useMemo(() => ({ language, setLanguage, t: copy[language] }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export const projectRussian: Record<string, { category: string; description: string; challenge: string; solution: string; result: string }> = {
  "nebo-bistro": {
    category: "Telegram-бот + Mini App",
    description: "Работающий ресторанный сценарий: знакомство в Telegram, встроенное колесо призов и понятная выдача выигрыша в заведении.",
    challenge: "Превратить ресторанную промомеханику в короткий и понятный путь гостя, который естественно работает внутри Telegram и приводит к ясному результату.",
    solution: "Бот персонально приветствует гостя и открывает мобильный Mini App с брендированным колесом. Защищённая панель позволяет управлять приветствием и доступом команды.",
    result: "Развёрнутый сценарий от знакомства в Telegram и вращения колеса до экрана приза, который гость показывает официанту.",
  },
};
