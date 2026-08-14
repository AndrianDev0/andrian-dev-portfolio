"use client";

// Adapted from React Bits components: DecryptedText, SpotlightCard and ShinyText.
// Source: https://reactbits.dev/ — customized for Andrian.Dev and existing dependencies.
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#_*+";

export function DecryptedText({
  text,
  className = "",
  encryptedClassName = "",
  speed = 34,
}: {
  text: string;
  className?: string;
  encryptedClassName?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [displayText, setDisplayText] = useState(text);
  const [revealed, setRevealed] = useState(text.length);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const run = useCallback(() => {
    stop();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayText(text);
      setRevealed(text.length);
      return;
    }

    let cursor = 0;
    setRevealed(0);
    timerRef.current = setInterval(() => {
      cursor += 1;
      setRevealed(cursor);
      setDisplayText(
        text.split("").map((character, index) => {
          if (character === " " || index < cursor) return character;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join(""),
      );
      if (cursor >= text.length) {
        stop();
        setDisplayText(text);
      }
    }, speed);
  }, [speed, stop, text]);

  useEffect(() => {
    setDisplayText(text);
    setRevealed(text.length);
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        run();
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [run, stop, text]);

  return (
    <span ref={ref} className={`rb-decrypted ${className}`} aria-label={text}>
      <span aria-hidden="true">
        {displayText.split("").map((character, index) => (
          <span className={index < revealed ? "" : encryptedClassName} key={`${index}-${character}`}>{character}</span>
        ))}
      </span>
    </span>
  );
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(111, 140, 255, 0.14)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const move = (event: ReactMouseEvent<HTMLElement>) => {
    if (!ref.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--rb-mouse-x", `${event.clientX - rect.left}px`);
    ref.current.style.setProperty("--rb-mouse-y", `${event.clientY - rect.top}px`);
    ref.current.style.setProperty("--rb-spotlight", spotlightColor);
  };
  return <article ref={ref} onMouseMove={move} className={`rb-spotlight ${className}`}>{children}</article>;
}

export function ShinyText({
  text,
  className = "",
  speed = 5.5,
  color = "#747c89",
  shineColor = "#d7dcff",
}: {
  text: string;
  className?: string;
  speed?: number;
  color?: string;
  shineColor?: string;
}) {
  const style = {
    "--rb-shine-speed": `${speed}s`,
    "--rb-shine-color": color,
    "--rb-shine-highlight": shineColor,
  } as CSSProperties;
  return <span className={`rb-shiny ${className}`} style={style}>{text}</span>;
}
