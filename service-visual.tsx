const visualContent = {
  browser: {
    src: "/services/web-development.webp",
    small: "/services/web-development-sm.webp",
    label: "WEB / INTERFACE",
    index: "01",
  },
  chat: {
    src: "/services/telegram-bot.webp",
    small: "/services/telegram-bot-sm.webp",
    label: "TELEGRAM / FLOW",
    index: "02",
  },
  dashboard: {
    src: "/services/web-app.webp",
    small: "/services/web-app-sm.webp",
    label: "PRODUCT / DATA",
    index: "03",
  },
  nodes: {
    src: "/services/automation.webp",
    small: "/services/automation-sm.webp",
    label: "SYSTEM / CONNECT",
    index: "04",
  },
} as const;

export function ServiceVisual({ type }: { type: string }) {
  const content = visualContent[type as keyof typeof visualContent] ?? visualContent.browser;

  return (
    <div className={`service-photo service-photo-${type}`} aria-hidden="true">
      <img
        src={content.src}
        srcSet={`${content.small} 640w, ${content.src} 1200w`}
        sizes="(max-width: 600px) calc(100vw - 80px), (max-width: 900px) 42vw, 360px"
        alt=""
        width="1200"
        height="800"
        loading="lazy"
        decoding="async"
      />
      <span className="service-photo-label">{content.label}</span>
      <span className="service-photo-index">{content.index}</span>
    </div>
  );
}
