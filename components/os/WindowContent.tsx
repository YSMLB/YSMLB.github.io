import Link from "next/link";
import { portfolioProjects } from "@/data/projects";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { getAppById, type OSAppId } from "@/lib/portfolio/osApps";
import {
  MusicContent,
  SettingsContent,
  NotesContent,
  FinderContent,
} from "./MusicAppContent";

const { profile, contacts } = USER_CONFIG;

export function SafariContent() {
  return (
    <div className="p-6 md:p-8 text-[#1d1d1f]">
      <p className="text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">
        YSM Portfolio
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
        {profile.name}
      </h1>
      <p className="text-lg text-[#007AFF] font-medium mb-4">{profile.title}</p>
      <p className="text-[#515154] leading-relaxed mb-6 max-w-md">
        Создаю продукты на Go, C# и React — от архитектуры до интерфейса.
        Открой папку Projects для кейсов, Music для плейлиста.
      </p>
      <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#34C759]/15 text-[#34C759] font-medium">
        {profile.status}
      </span>
    </div>
  );
}

export function AboutContent() {
  return (
    <div className="p-6 md:p-8 text-[#1d1d1f]">
      <h2 className="text-2xl font-semibold mb-4">Обо мне</h2>
      <p className="text-[#515154] leading-relaxed mb-6">{profile.bio}</p>
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f5f5f7]">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5856D6] to-[#007AFF] flex items-center justify-center text-white font-bold text-lg">
          {profile.initials}
        </div>
        <div>
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-[#86868b]">YSMLB · {profile.status}</p>
        </div>
      </div>
    </div>
  );
}

export function ProjectsContent() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4 px-2">Projects</h2>
      <div className="grid gap-1">
        {portfolioProjects.map((project) => {
          const isClickable = project.link && project.link !== "#";
          const inner = (
            <>
              <div
                className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: project.accent }}
              >
                {project.title[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#1d1d1f] truncate">{project.title}</p>
                <p className="text-xs text-[#86868b] truncate">{project.category}</p>
              </div>
              {isClickable && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2" className="shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
            </>
          );
          if (isClickable) {
            return (
              <Link key={project.id} href={project.link} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#007AFF]/10 transition-colors">
                {inner}
              </Link>
            );
          }
          return (
            <div key={project.id} className="flex items-center gap-3 p-3 rounded-xl opacity-50">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ContactContent() {
  const links = [
    { label: "Email", value: contacts.email, href: `mailto:${contacts.email}?subject=Portfolio Contact` },
    { label: "Telegram", value: contacts.telegramHandle, href: contacts.telegram, external: true },
    { label: "Instagram", value: contacts.instagramHandle, href: contacts.instagram, external: true },
    { label: "GitHub", value: contacts.githubHandle, href: contacts.github, external: true },
  ];

  return (
    <div className="p-6 md:p-8 text-[#1d1d1f]">
      <h2 className="text-2xl font-semibold mb-2">Связаться</h2>
      <p className="text-[#86868b] text-sm mb-6">Есть проект? Давайте обсудим.</p>
      <div className="space-y-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7] hover:bg-[#007AFF]/10 transition-colors group"
          >
            <div>
              <p className="text-xs text-[#86868b] uppercase tracking-wider">{link.label}</p>
              <p className="font-medium group-hover:text-[#007AFF] transition-colors">{link.value}</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#86868b]">
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}

export function getWindowContent(id: OSAppId) {
  switch (id) {
    case "safari":
      return <SafariContent />;
    case "about":
      return <AboutContent />;
    case "projects":
      return <ProjectsContent />;
    case "contact":
      return <ContactContent />;
    case "music":
      return <MusicContent />;
    case "settings":
      return <SettingsContent />;
    case "notes":
      return <NotesContent />;
    case "finder":
      return <FinderContent />;
    default:
      return (
        <div className="p-8 text-center text-[#86868b]">
          <p>Открой ссылку через браузер</p>
        </div>
      );
  }
}

export function getWindowTitle(id: OSAppId): string {
  const app = getAppById(id);
  if (app) return app.name;
  switch (id) {
    case "safari":
      return `Safari — ${profile.name}`;
    default:
      return "Window";
  }
}

export const WINDOW_SIZES: Partial<Record<OSAppId, { w: number; h: number }>> = {
  music: { w: 560, h: 540 },
  finder: { w: 580, h: 420 },
  projects: { w: 480, h: 440 },
};

export function getWindowSize(id: OSAppId) {
  return WINDOW_SIZES[id] ?? { w: 520, h: 460 };
}
