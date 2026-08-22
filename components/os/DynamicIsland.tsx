"use client";

import { motion, AnimatePresence } from "framer-motion";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { useMusic, type IslandState } from "@/context/MusicContext";
import { useSettings } from "@/context/SettingsContext";
import { useLocale } from "@/context/LocaleContext";

interface DynamicIslandProps {
  onOpenMusic: () => void;
}

function IslandWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-[12px] shrink-0 pr-0.5">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-[#FA5766]"
          animate={active ? { height: [4, 11, 5, 9, 4] } : { height: 4 }}
          transition={{ duration: 0.65, repeat: active ? Infinity : 0, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

function islandSize(state: IslandState) {
  if (state === "expanded") return { width: 360, height: 88, radius: 44 };
  if (state === "compact") return { width: 202, height: 36, radius: 18 };
  return { width: 126, height: 36, radius: 18 };
}

export default function DynamicIsland({ onOpenMusic }: DynamicIslandProps) {
  const {
    started,
    isPlaying,
    islandState,
    toggleIsland,
    togglePlay,
    currentTrack,
    progress,
  } = useMusic();
  const { t } = useLocale();
  const { musicEnabled } = useSettings();
  const { music } = USER_CONFIG;

  const musicActive = started && music.enabled && musicEnabled;
  const displayState: IslandState = !musicActive
    ? "idle"
    : islandState === "idle"
      ? "compact"
      : islandState;

  const size = islandSize(displayState);

  return (
    <motion.div
      layout={false}
      className={`relative flex items-center justify-center overflow-hidden bg-black max-w-[calc(100vw-52px)] ${
        displayState === "expanded"
          ? "shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
          : "shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
      }`}
      animate={{
        width: size.width,
        height: size.height,
        borderRadius: size.radius,
      }}
      transition={{ type: "spring", damping: 34, stiffness: 480 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {displayState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-[6px]"
          >
            <span className="w-[10px] h-[10px] rounded-full bg-[#1c1c1e]" />
            <span className="w-[14px] h-[14px] rounded-full bg-[#0a0a0a]" />
          </motion.div>
        )}

        {displayState === "compact" && (
          <motion.button
            key="compact"
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleIsland}
            className="flex items-center justify-between w-full h-full px-3 outline-none"
            aria-label={t("nowPlaying")}
          >
            <div
              className="w-[22px] h-[22px] rounded-[5px] shrink-0"
              style={{ background: currentTrack.coverGradient }}
            />
            <IslandWaveform active={isPlaying} />
          </motion.button>
        )}

        {displayState === "expanded" && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 w-full min-w-0"
          >
            <div
              className="w-12 h-12 rounded-lg shrink-0"
              style={{ background: currentTrack.coverGradient }}
            />
            <button
              type="button"
              onClick={onOpenMusic}
              className="min-w-0 flex-1 text-left outline-none"
            >
              <p className="text-white text-[15px] font-semibold truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-white/55 text-[13px] truncate">{currentTrack.artist}</p>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 flex items-center justify-center shrink-0 outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className="ml-0.5">
                  <path d="M8 5v14l11-7-11-7z" />
                </svg>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {displayState === "expanded" && isPlaying && (
        <div
          className="absolute bottom-[6px] left-4 right-4 h-[3px] bg-white/20 rounded-full overflow-hidden"
          aria-hidden
        >
          <div
            className="h-full bg-white/80 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}

      {displayState === "expanded" && (
        <button
          type="button"
          onClick={toggleIsland}
          className="absolute top-2 right-3 w-5 h-5 rounded-full bg-white/15 text-white/70 text-[9px] outline-none flex items-center justify-center"
          aria-label="Collapse"
        >
          ▾
        </button>
      )}
    </motion.div>
  );
}
