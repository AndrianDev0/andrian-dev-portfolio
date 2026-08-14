export const services = [
  {
    id: "01",
    title: "Web Development",
    copy: "Landing pages, corporate websites, and custom builds with a clear conversion path.",
    visual: "browser",
  },
  {
    id: "02",
    title: "Telegram Bots",
    copy: "Lead capture, sales flows, support, subscriptions, catalogs, alerts, and CRM workflows.",
    visual: "chat",
  },
  {
    id: "03",
    title: "Web Apps",
    copy: "Dashboards, client accounts, internal systems, and focused web services.",
    visual: "dashboard",
  },
  {
    id: "04",
    title: "Automation",
    copy: "APIs, CRM, Telegram, notifications, and integrations that remove repetitive work.",
    visual: "nodes",
  },
] as const;

export const benefits = [
  { title: "More Than Code", copy: "I start with the problem the product needs to solve — then choose the right interface and technology." },
  { title: "User-Focused", copy: "Structure and interaction should feel clear without instructions, even when the system behind them is complex." },
  { title: "Mobile First", copy: "Every key flow is shaped for small screens, real touch targets, and changing contexts." },
  { title: "End-to-End", copy: "Design direction, development, integrations, testing, and launch stay connected from the first decision." },
  { title: "Built to Scale", copy: "Clean data and component structures make the next feature easier to add, not harder." },
] as const;

export const processSteps = [
  { id: "01", title: "Discovery", copy: "We discuss the idea, goals, constraints, and the result the product needs to create." },
  { id: "02", title: "Analysis", copy: "I define the structure, functionality, priorities, and key user flows." },
  { id: "03", title: "Design", copy: "We shape a visual direction that fits the business and makes the product easy to understand." },
  { id: "04", title: "Development", copy: "I build the interface, integrations, and core functionality as one coherent system." },
  { id: "05", title: "Testing", copy: "Desktop, mobile, edge states, and the scenarios that matter most are checked before release." },
  { id: "06", title: "Launch", copy: "The finished product goes live with a clean handoff and a path for future iteration." },
] as const;

export const technologies = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Telegram Bot API", "REST API", "PostgreSQL", "Git",
] as const;
