/**
 * @deprecated Используй lib/portfolio/userConfig.ts — этот файл для обратной совместимости
 */
import { USER_CONFIG } from "./userConfig";

export const CONTACT = USER_CONFIG.contacts;

export const SKILLS = [
  "Go",
  "C#",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "Next.js",
  "REST API",
] as const;

export const STATS = [
  { value: "4+", label: "проекта" },
  { value: "Go / C# / React", label: "стек" },
  { value: "Open", label: "for work" },
] as const;

export const NAV_ITEMS = [
  { id: "hero", label: "Home", mobileLabel: "Home" },
  { id: "about", label: "Обо мне", mobileLabel: "Обо мне" },
  { id: "projects", label: "Работы", mobileLabel: "Работы" },
  { id: "contact", label: "Контакт", mobileLabel: "Контакт" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];
