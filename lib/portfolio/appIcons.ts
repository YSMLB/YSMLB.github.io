import type { IconId } from "./osApps";

/** PNG paths in /public/icons/apps/ — macOS Big Sur style (icon-icons.com) */
const ICON_FILES: Partial<Record<IconId, string>> = {
  finder: "/icons/apps/finder.png",
  safari: "/icons/apps/safari.png",
  mail: "/icons/apps/mail.png",
  music: "/icons/apps/music.png",
  settings: "/icons/apps/settings.png",
  notes: "/icons/apps/notes.png",
  about: "/icons/apps/about.png",
  contact: "/icons/apps/contact.png",
  projects: "/icons/apps/projects.png",
  telegram: "/icons/apps/telegram.png",
  instagram: "/icons/apps/instagram.png",
  github: "/icons/apps/github.png",
  youtube: "/icons/apps/youtube.png",
  discord: "/icons/apps/discord.png",
  twitter: "/icons/apps/twitter.png",
};

export function getAppIconSrc(id: IconId): string | null {
  return ICON_FILES[id] ?? null;
}
