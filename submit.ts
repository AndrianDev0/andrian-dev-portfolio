import { siteConfig } from "./site";

export type ProjectRequest = {
  name: string;
  contact: string;
  projectDescription: string;
  budget: string;
  website: string;
};

export async function submitProjectRequest(payload: ProjectRequest) {
  if (!payload.name.trim() || !payload.contact.trim() || !payload.projectDescription.trim()) {
    throw new Error("MISSING_FIELDS");
  }

  const name = payload.name.trim();
  const contact = payload.contact.trim();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12_000);
  let response: Response;
  try {
    response = await fetch(`https://formsubmit.co/ajax/${siteConfig.email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        "Имя": name,
        "Telegram / Email": contact,
        "Примерный бюджет": payload.budget.trim() || "не указан",
        "Описание проекта": payload.projectDescription.trim(),
        _subject: `Новая заявка с Andrian.Dev — ${name.slice(0, 80)}`,
        _template: "table",
        _honey: payload.website.trim(),
      }),
    });
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) throw new Error("SUBMISSION_FAILED");
  const result = await response.json() as { success?: boolean | string };
  if (result.success === false || result.success === "false") throw new Error("SUBMISSION_FAILED");

  return { ok: true };
}
