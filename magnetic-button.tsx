"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

export function MagneticButton({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef(0);
  const positionRef = useRef({ x: 0, y: 0 });

  const paint = () => {
    const node = ref.current;
    if (node) node.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`;
    frameRef.current = 0;
  };

  const schedulePaint = () => {
    if (!frameRef.current) frameRef.current = window.requestAnimationFrame(paint);
  };

  const enter = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    rectRef.current = event.currentTarget.getBoundingClientRect();
  };

  const move = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = rectRef.current ?? event.currentTarget.getBoundingClientRect();
    rectRef.current = rect;
    positionRef.current = {
      x: (event.clientX - rect.left - rect.width / 2) * 0.12,
      y: (event.clientY - rect.top - rect.height / 2) * 0.12,
    };
    schedulePaint();
  };

  const reset = () => {
    rectRef.current = null;
    positionRef.current = { x: 0, y: 0 };
    schedulePaint();
  };

  useEffect(() => () => {
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic-button ${className}`}
      onPointerEnter={enter}
      onPointerMove={move}
      onPointerLeave={reset}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span><ArrowUpRight aria-hidden="true" size={19} />
    </a>
  );
}
