"use client";

// Adapted from React Bits components: SpotlightCard and ShinyText.
// Source: https://reactbits.dev/ — customized for Andrian.Dev and existing dependencies.
import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

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
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const finePointerRef = useRef<boolean | null>(null);

  const enter = (event: ReactPointerEvent<HTMLElement>) => {
    rectRef.current = event.currentTarget.getBoundingClientRect();
  };

  const move = (event: ReactPointerEvent<HTMLElement>) => {
    finePointerRef.current ??= window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (
      !ref.current
      || !finePointerRef.current
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const rect = rectRef.current ?? event.currentTarget.getBoundingClientRect();
    rectRef.current = rect;
    pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      const node = ref.current;
      if (node) {
        node.style.setProperty("--rb-mouse-x", `${pointerRef.current.x}px`);
        node.style.setProperty("--rb-mouse-y", `${pointerRef.current.y}px`);
        node.style.setProperty("--rb-spotlight", spotlightColor);
      }
      frameRef.current = 0;
    });
  };

  useEffect(() => () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
  }, []);

  return <article ref={ref} onPointerEnter={enter} onPointerMove={move} onPointerLeave={() => { rectRef.current = null; }} className={`rb-spotlight ${className}`}>{children}</article>;
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
