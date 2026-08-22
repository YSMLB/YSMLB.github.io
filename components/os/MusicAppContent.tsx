"use client";

import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { getMusicEmbedUrl } from "@/lib/portfolio/yandexMusic";

export function MusicContent() {
  const { music } = USER_CONFIG;
  const embedUrl = getMusicEmbedUrl();

  return (
    <div className="flex flex-col h-full min-h-[420px] bg-[#1c1c1e] text-white">
      {/* Album header — Spotify/Music style */}
      <div
        className="relative px-6 pt-6 pb-8 shrink-0"
        style={{ background: music.coverGradient }}
      >
        <div className="flex items-end gap-5">
          <div
            className="w-28 h-28 rounded-lg shadow-2xl shrink-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.25)" }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white" opacity="0.9">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <div className="min-w-0 pb-1">
            <p className="text-[11px] uppercase tracking-widest text-white/70 mb-1">
              {music.playlistSubtitle}
            </p>
            <h2 className="text-2xl font-bold truncate">{music.playlistTitle}</h2>
            <p className="text-sm text-white/80 mt-1">{USER_CONFIG.profile.name}</p>
          </div>
        </div>
      </div>

      {/* Player area */}
      <div className="flex-1 px-4 py-4 bg-[#1c1c1e]">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title="Yandex Music Player"
            allow="autoplay; fullscreen"
            className="w-full rounded-xl border-0 bg-[#2c2c2e]"
            style={{ height: 280 }}
          />
        ) : (
          <div className="rounded-xl bg-[#2c2c2e] p-6 text-center">
            <p className="text-white/90 font-medium mb-2">Подключи Яндекс Музыку</p>
            <p className="text-sm text-white/50 leading-relaxed">
              Открой <code className="text-[#FA243C]">lib/portfolio/userConfig.ts</code>
              <br />
              и вставь ссылку на плейлист в{" "}
              <code className="text-white/70">music.yandexShareUrl</code>
            </p>
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-white/10 text-[11px] text-white/40 text-center">
        Powered by Yandex Music · Настройки в CONFIG.md
      </div>
    </div>
  );
}

export function SettingsContent() {
  return (
    <div className="p-6 text-[#1d1d1f]">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>
      <div className="space-y-4">
        {[
          { label: "Appearance", value: "Dark" },
          { label: "Wallpaper", value: USER_CONFIG.wallpapers.mac },
          { label: "Machine Name", value: USER_CONFIG.profile.machineName },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center py-3 border-b border-black/5"
          >
            <span className="text-[#515154]">{row.label}</span>
            <span className="font-medium capitalize">{row.value}</span>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs text-[#86868b]">
        Редактируй настройки в lib/portfolio/userConfig.ts
      </p>
    </div>
  );
}

export function NotesContent() {
  return (
    <div className="p-6 bg-[#FFFCED] min-h-[300px] text-[#1d1d1f]">
      <p className="text-xs text-[#86868b] mb-2">Today</p>
      <h2 className="text-2xl font-bold mb-4">Portfolio Notes</h2>
      <p className="leading-relaxed text-[#515154]">
        • Backend: Go, C#
        <br />
        • Frontend: React, Next.js
        <br />
        • Open for freelance & full-time
        <br />• Contact via Telegram or Mail app
      </p>
    </div>
  );
}

export function FinderContent() {
  return (
    <div className="flex min-h-[360px]">
      <div className="w-36 bg-[#f5f5f7] border-r border-black/5 py-3 shrink-0">
        {["Favorites", "Projects", "About", "Contact"].map((item, i) => (
          <div
            key={item}
            className={`px-4 py-1.5 text-[13px] ${i === 0 ? "bg-[#007AFF]/15 text-[#007AFF] font-medium" : "text-[#515154]"}`}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-1 p-4 grid grid-cols-3 gap-4 content-start">
        {["Projects", "About Me", "Contact", "Music", "Safari"].map((name) => (
          <div key={name} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-black/5">
            <div className="w-12 h-12 rounded-lg bg-[#007AFF]/20 flex items-center justify-center text-[#007AFF] font-bold">
              {name[0]}
            </div>
            <span className="text-[11px] text-[#515154] text-center">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
