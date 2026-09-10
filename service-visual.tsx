const visualContent = {
  browser: {
    code: "WWW.",
    eyebrow: "STRUCTURE / UI / CODE",
    steps: ["LAND", "EXPLAIN", "CONVERT"],
  },
  chat: {
    code: "/BOT",
    eyebrow: "DIALOG / LOGIC / ACTION",
    steps: ["START", "QUALIFY", "RESULT"],
  },
  dashboard: {
    code: "DATA",
    eyebrow: "INPUT / STATE / DECISION",
    steps: ["COLLECT", "PROCESS", "DISPLAY"],
  },
  nodes: {
    code: "FLOW",
    eyebrow: "TRIGGER / LOGIC / RESULT",
    steps: ["EVENT", "CONNECT", "DONE"],
  },
} as const;

export function ServiceVisual({ type }: { type: string }) {
  const content = visualContent[type as keyof typeof visualContent] ?? visualContent.browser;

  return (
    <div className={`service-schematic service-schematic-${type}`} aria-hidden="true">
      <span className="service-schematic-label">{content.eyebrow}</span>
      <strong>{content.code}</strong>
      <div className="service-schematic-path">
        {content.steps.map((step, index) => (
          <span key={step}><b>0{index + 1}</b>{step}</span>
        ))}
      </div>
      <i className="service-schematic-mark" />
    </div>
  );
}
