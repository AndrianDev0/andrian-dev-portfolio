"use client";

// Adapted from React Bits Light Rays for the Andrian.Dev intro.
// Source: https://reactbits.dev/backgrounds/light-rays
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

type LightRaysProps = {
  className?: string;
  color?: string;
  speed?: number;
  spread?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
};

const vertex = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uSpread;
uniform float uMouseInfluence;

float ray(vec2 source, vec2 direction, vec2 point, float seed, float speed) {
  vec2 delta = point - source;
  vec2 normalizedDelta = normalize(delta);
  vec2 mouseDirection = normalize(uMouse * uResolution - source);
  vec2 finalDirection = normalize(mix(direction, mouseDirection, uMouseInfluence));
  float angle = max(dot(normalizedDelta, finalDirection), 0.0);
  float beam = pow(angle, 1.0 / max(uSpread, 0.001));
  float distanceFade = clamp(1.0 - length(delta) / (uResolution.x * 1.35), 0.0, 1.0);
  float shimmer = 0.52 + 0.18 * sin(angle * seed + uTime * speed);
  return beam * distanceFade * shimmer;
}

void main() {
  vec2 point = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
  vec2 source = vec2(uResolution.x * 0.72, -uResolution.y * 0.12);
  vec2 direction = normalize(vec2(-0.22, 1.0));
  float first = ray(source, direction, point, 31.7, 1.15 * uSpeed);
  float second = ray(source + vec2(uResolution.x * 0.08, 0.0), direction, point, 18.4, 0.82 * uSpeed);
  float strength = first * 0.58 + second * 0.36;
  float vignette = smoothstep(0.0, 0.22, gl_FragCoord.y / uResolution.y) *
    smoothstep(0.0, 0.18, 1.0 - gl_FragCoord.y / uResolution.y);
  gl_FragColor = vec4(uColor * strength * 1.45, clamp(strength * vignette * 1.3, 0.0, 1.0));
}`;

function toRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean.length === 3 ? clean.split("").map((part) => part + part).join("") : clean, 16);
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

export function LightRays({
  className = "",
  color = "#768cff",
  speed = 0.55,
  spread = 0.72,
  followMouse = true,
  mouseInfluence = 0.055,
}: LightRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let disposed = false;
    let renderer: Renderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    const mouse = { x: 0.5, y: 0.42 };
    const smoothMouse = { x: 0.5, y: 0.42 };

    try {
      renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
      const gl = renderer.gl;
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.display = "block";
      container.appendChild(gl.canvas);

      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] as [number, number] },
        uMouse: { value: [mouse.x, mouse.y] as [number, number] },
        uColor: { value: toRgb(color) },
        uSpeed: { value: speed },
        uSpread: { value: spread },
        uMouseInfluence: { value: followMouse ? mouseInfluence : 0 },
      };

      const mesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, { vertex, fragment, uniforms, transparent: true }),
      });

      const resize = () => {
        const width = Math.max(container.clientWidth, 1);
        const height = Math.max(container.clientHeight, 1);
        renderer?.setSize(width, height);
        uniforms.uResolution.value = [width * (renderer?.dpr || 1), height * (renderer?.dpr || 1)];
      };

      const move = (event: PointerEvent) => {
        if (!followMouse) return;
        const rect = container.getBoundingClientRect();
        mouse.x = (event.clientX - rect.left) / rect.width;
        mouse.y = (event.clientY - rect.top) / rect.height;
      };

      const loop = (time: number) => {
        if (disposed || !renderer) return;
        smoothMouse.x += (mouse.x - smoothMouse.x) * 0.045;
        smoothMouse.y += (mouse.y - smoothMouse.y) * 0.045;
        uniforms.uMouse.value = [smoothMouse.x, smoothMouse.y];
        uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
        frame = requestAnimationFrame(loop);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      window.addEventListener("pointermove", move, { passive: true });
      resize();
      frame = requestAnimationFrame(loop);

      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        window.removeEventListener("pointermove", move);
        const canvas = gl.canvas;
        canvas.parentNode?.removeChild(canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch {
      renderer = null;
      return;
    }
  }, [color, followMouse, mouseInfluence, speed, spread]);

  return <div ref={containerRef} className={`rb-light-rays ${className}`.trim()} aria-hidden="true" />;
}
