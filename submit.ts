import { siteConfig } from "./site";

export type ProjectRequest = {
  name: string;
  contact: string;
  projectDescription: string;
  budget: string;
};

export async function submitProjectRequest(payload: ProjectRequest) {
  if (!payload.name.trim() || !payload.contact.trim() || !payload.projectDescription.trim()) {
    throw new Error("MISSING_FIELDS");
  }

  const subject = `Заявка с Andrian.Dev — ${payload.name.trim()}`;
  const body = [
    `Имя: ${payload.name.trim()}`,
    `Контакт: ${payload.contact.trim()}`,
    `Бюджет: ${payload.budget.trim() || "не указан"}`,
    "",
    "Описание проекта:",
    payload.projectDescription.trim(),
  ].join("\n");

  return {
    ok: true,
    mailto: `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}
