"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { portfolioProjects } from "@/data/projects";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { useLocale } from "@/context/LocaleContext";
import { getAppById, type OSAppId } from "@/lib/portfolio/osApps";
import {
  MusicContent,
  FinderContent,
} from "./MusicAppContent";
import { NotesContent } from "./NotesAppContent";
import { SettingsContent } from "./SettingsAppContent";

const { profile, contacts } = USER_CONFIG;

function ProfilePhoto({ size = 96 }: { size?: number }) {
  const [failed, setFailed] = useState(false);

  if (!profile.photo || failed) {
    return (
      <div
        className="rounded-full bg-gradient-to-br from-[#5856D6] to-[#007AFF] flex items-center justify-center text-white font-bold shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.32 }}
      >
        {profile.initials}
      </div>
    );
  }

  return (
    <Image
      src={profile.photo}
      alt={profile.name}
      width={size}
      height={size}
      className="rounded-full object-cover shrink-0 ring-2 ring-black/[0.06]"
      onError={() => setFailed(true)}
    />
  );
}

function MemeGrid() {
  const { t } = useLocale();
  const memes = profile.memes ?? [];
  if (memes.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-[#86868b] uppercase tracking-wider mb-3">
        {t("memesTitle")}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {memes.map((src, i) => (
          <MemeTile key={`${src}-${i}`} src={src} index={i} />
        ))}
      </div>
    </div>
  );
}

function MemeTile({ src, index }: { src: string; index: number }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="aspect-square rounded-xl bg-[#f5f5f7] border border-dashed border-black/10 flex items-center justify-center text-[11px] text-[#86868b] p-2 text-center">
        meme {index + 1}
      </div>
    );
  }

  return (
    <div className="aspect-square rounded-xl overflow-hidden bg-[#f5f5f7] border border-black/[0.06]">
      <Image
        src={src}
        alt=""
        width={200}
        height={200}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function SafariContent() {
  const { t } = useLocale();
  return (
    <div className="p-6 md:p-8 text-[#1d1d1f]">
      <p className="text-xs font-medium text-[#86868b] uppercase tracking-wider mb-2">YSM Portfolio</p>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">{profile.name}</h1>
      <p className="text-lg text-[#007AFF] font-medium mb-4">{profile.title}</p>
      <p className="text-[#515154] leading-relaxed mb-6 max-w-md">{t("pitch")}</p>
      <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#34C759]/15 text-[#248A3D] font-semibold">{t("hire")}</span>
    </div>
  );
}

export function AboutContent() {
  const { t } = useLocale();
  return (
    <div className="p-6 md:p-8 text-[#1d1d1f]">
      <h2 className="text-2xl font-semibold mb-4">{t("aboutTitle")}</h2>
      <div className="flex items-start gap-4 mb-6">
        <ProfilePhoto size={88} />
        <div className="min-w-0 pt-1">
          <p className="font-semibold text-lg">{profile.name}</p>
          <p className="text-sm text-[#007AFF] font-medium">{profile.title}</p>
          <p className="text-xs text-[#86868b] mt-1">YSMLB · {t("hire")}</p>
        </div>
      </div>
      <p className="text-[#515154] leading-relaxed">{profile.bio}</p>
      <MemeGrid />
    </div>
  );
}

export function ProjectsContent() {
  const { t } = useLocale();
  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4 px-1">{t("projects")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {portfolioProjects.map((project) => {
          const isClickable = project.link && project.link !== "#";
          const card = (
            <div className="group rounded-xl overflow-hidden border border-black/[0.06] hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div
                className="aspect-[16/10] relative p-4 flex flex-col justify-end"
                style={{ background: project.previewGradient ?? project.accent }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="relative text-white/70 text-[10px] font-mono">0{project.id}</span>
                <h3 className="relative text-white font-bold text-lg leading-tight">{project.title}</h3>
              </div>
              <div className="p-3 bg-[#fafafa]">
                <p className="text-[11px] text-[#86868b] truncate mb-2">{project.category}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-black/5 text-[#515154] uppercase tracking-wide">{tag}</span>
                  ))}
                </div>
                <p className="text-[11px] font-semibold text-[#007AFF] group-hover:underline">
                  {isClickable ? `${t("viewCase")} →` : t("inProgress")}
                </p>
              </div>
            </div>
          );
          return isClickable ? (
            <Link key={project.id} href={project.link}>{card}</Link>
          ) : (
            <div key={project.id} className="opacity-50">{card}</div>
          );
        })}
      </div>
    </div>
  );
}

export function ContactContent() {
  const { t } = useLocale();
  const links = [
    { label: "Email", value: contacts.email, href: `mailto:${contacts.email}?subject=Portfolio Contact` },
    { label: "Telegram", value: contacts.telegramHandle, href: contacts.telegram, external: true },
    { label: "Instagram", value: contacts.instagramHandle, href: contacts.instagram, external: true },
    { label: "GitHub", value: contacts.githubHandle, href: contacts.github, external: true },
  ];
  return (
    <div className="p-6 md:p-8 text-[#1d1d1f]">
      <h2 className="text-2xl font-semibold mb-2">{t("contactTitle")}</h2>
      <p className="text-[#86868b] text-sm mb-6">{t("contactSub")}</p>
      <div className="space-y-3">
        {links.map((link) => (
          <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel="noreferrer" className="flex items-center justify-between p-4 rounded-xl bg-[#f5f5f7] hover:bg-[#007AFF]/10 transition-colors group">
            <div>
              <p className="text-xs text-[#86868b] uppercase tracking-wider">{link.label}</p>
              <p className="font-medium group-hover:text-[#007AFF]">{link.value}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function getWindowContent(id: OSAppId) {
  switch (id) {
    case "safari": return <SafariContent />;
    case "about": return <AboutContent />;
    case "projects": return <ProjectsContent />;
    case "contact": return <ContactContent />;
    case "music": return <MusicContent />;
    case "settings": return <SettingsContent />;
    case "notes": return <NotesContent />;
    case "finder": return <FinderContent />;
    default: return null;
  }
}

export function getWindowTitle(id: OSAppId): string {
  const app = getAppById(id);
  if (app) return app.name;
  return id === "safari" ? `Safari — ${profile.name}` : "Window";
}

export const WINDOW_SIZES: Partial<Record<OSAppId, { w: number; h: number }>> = {
  music: { w: 400, h: 580 },
  finder: { w: 600, h: 440 },
  projects: { w: 640, h: 520 },
  settings: { w: 480, h: 620 },
  notes: { w: 720, h: 540 },
};

export function getWindowSize(id: OSAppId) {
  return WINDOW_SIZES[id] ?? { w: 520, h: 460 };
}
