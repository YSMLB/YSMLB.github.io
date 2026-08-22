"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { useMusic } from "@/context/MusicContext";
import { useSettings } from "@/context/SettingsContext";

interface BootScreenProps {
  isMobile: boolean;
  onComplete: () => void;
}

export default function BootScreen({ isMobile, onComplete }: BootScreenProps) {
  const { t } = useLocale();
  const { startMusic } = useMusic();
  const { musicEnabled } = useSettings();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"logo" | "loading" | "ready">("logo");

  const handleEnter = useCallback(() => {
    if (musicEnabled) startMusic();
    onComplete();
  }, [startMusic, onComplete, musicEnabled]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("loading"), isMobile ? 500 : 700);
    return () => clearTimeout(t1);
  }, [isMobile]);

  useEffect(() => {
    if (phase !== "loading") return;
    const duration = isMobile ? 1400 : 1800;
    const start = Date.now();
    const interval = setInterval(() => {
      const next = Math.min(((Date.now() - start) / duration) * 100, 100);
      setProgress(next);
      if (next >= 100) {
        clearInterval(interval);
        setPhase("ready");
      }
    }, 16);
    return () => clearInterval(interval);
  }, [phase, isMobile]);

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center select-none"
      onClick={phase === "ready" ? handleEnter : undefined}
    >
      <motion.div
        animate={{ scale: phase === "loading" ? 0.94 : 1, opacity: phase === "ready" ? 0.85 : 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <svg width={isMobile ? 46 : 54} height={isMobile ? 56 : 66} viewBox="0 0 814 1000" fill="white">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-163.7-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.2 0 130.9 2.6 198.3 99.2zm-234-181.1c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.2 32.4-54.4 83.6-54.4 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.8-71.3z" />
        </svg>
      </motion.div>

      {phase === "loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-14 h-[3px] bg-white/15 rounded-full overflow-hidden"
          style={{ width: isMobile ? 100 : 160 }}
        >
          <div className="h-full bg-white rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </motion.div>
      )}

      {phase === "ready" && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          onClick={handleEnter}
          className="mt-14 px-8 py-3 rounded-full bg-white/10 border border-white/25 text-white/90 text-sm font-medium hover:bg-white/15 active:scale-95 transition-all cursor-pointer"
        >
          {t("bootContinue")}
        </motion.button>
      )}
    </motion.div>
  );
}
