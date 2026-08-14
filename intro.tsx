"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "./i18n";

const INTRO_DURATION = 5600;
const INTRO_KEY = "andrian-dev-intro-v1";

export function AppIntro() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forced = new URLSearchParams(window.location.search).get("intro") === "1";
    const alreadySeen = sessionStorage.getItem(INTRO_KEY) === "seen";

    if (reduceMotion || (alreadySeen && !forced)) {
      setVisible(false);
      return;
    }

    document.documentElement.classList.add("intro-lock");
    setArmed(true);
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "seen");
      document.documentElement.classList.remove("intro-lock");
      setVisible(false);
    }, INTRO_DURATION);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove("intro-lock");
    };
  }, []);

  const skip = () => {
    sessionStorage.setItem(INTRO_KEY, "seen");
    document.documentElement.classList.remove("intro-lock");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && armed ? (
        <motion.div
          className="intro-cinematic"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          aria-label={language === "ru" ? "Заставка Andrian.Dev" : "Andrian.Dev intro"}
        >
          <div className="intro-atmosphere" aria-hidden="true" />
          <div className="intro-grid" aria-hidden="true" />

          <div className="intro-world" aria-hidden="true">
            <div className="intro-monitor-wrap">
              <div className="intro-monitor">
                <div className="intro-monitor-camera" />
                <div className="intro-screen">
                  <div className="intro-screen-glow" />
                  <div className="intro-code">
                    <span><i>01</i> const experience = <b>"Andrian.Dev"</b>;</span>
                    <span><i>02</i> build({`{`} design: <em>true</em> {`}`});</span>
                    <span><i>03</i> connect(<b>"ideas"</b>, <b>"impact"</b>);</span>
                    <span><i>04</i> launch(<em>portfolio</em>);</span>
                    <span><i>05</i> status: <strong>READY</strong>;</span>
                  </div>
                  <div className="intro-impact-flash" />
                  <div className="intro-cracks">
                    <i /><i /><i /><i /><i /><i />
                  </div>
                  <div className="intro-scanline" />
                </div>
                <div className="intro-monitor-brand">ANDRIAN.DEV</div>
              </div>
              <div className="intro-stand"><i /></div>
            </div>

            <div className="intro-hammer">
              <div className="intro-hammer-head"><i /></div>
              <div className="intro-hammer-handle" />
            </div>

            <div className="intro-shards">
              {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
            </div>
          </div>

          <div className="intro-chrome">
            <span>{language === "ru" ? "ИНИЦИАЛИЗАЦИЯ / 01" : "INITIALIZING / 01"}</span>
            <span>{language === "ru" ? "ВХОД В СИСТЕМУ" : "ENTERING SYSTEM"}</span>
          </div>
          <div className="intro-progress"><i /></div>
          <button className="intro-skip" type="button" onClick={skip}>
            {language === "ru" ? "Пропустить" : "Skip"}<span>↗</span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
