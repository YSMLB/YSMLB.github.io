"use client";

import { motion } from "framer-motion";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { useMusic } from "@/context/MusicContext";
import { useSettings } from "@/context/SettingsContext";
import { useLocale } from "@/context/LocaleContext";
import type { OSAppId } from "@/lib/portfolio/osApps";

export function MacNowPlayingBar({ onOpen }: { onOpen: (id: OSAppId) => void }) {
  const { t } = useLocale();
  const { started, isPlaying, currentTrack, togglePlay } = useMusic();
  const { musicEnabled } = useSettings();

  if (!started || !USER_CONFIG.music.enabled || !musicEnabled) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-[76px] left-1/2 -translate-x-1/2 z-[85] flex items-center gap-3 px-3 py-2 rounded-[14px] bg-[#121212]/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[min(380px,calc(100vw-48px))] w-full mx-4"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0 outline-none active:scale-95"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="black">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="black" className="ml-0.5">
            <path d="M8 5v14l11-7-11-7z" />
          </svg>
        )}
      </button>
      <button type="button" onClick={() => onOpen("music")} className="min-w-0 flex-1 text-left outline-none">
        <p className="text-[9px] text-white/55 uppercase tracking-wider">{t("nowPlaying")}</p>
        <p className="text-white text-[13px] font-semibold truncate">{currentTrack.title}</p>
        <p className="text-white/50 text-[11px] truncate">{currentTrack.artist}</p>
      </button>
      <div className="flex items-end gap-[2px] h-3.5 shrink-0">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] bg-[#1DB954] rounded-full"
            animate={isPlaying ? { height: [3, 12, 5, 10, 3] } : { height: 3 }}
            transition={{ duration: 0.75, repeat: isPlaying ? Infinity : 0, delay: i * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
