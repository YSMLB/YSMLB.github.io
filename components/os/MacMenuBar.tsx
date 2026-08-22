"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

interface MacMenuBarProps {
  activeApp?: string;
}

export default function MacMenuBar({ activeApp = "Finder" }: MacMenuBarProps) {
  const { locale, toggleLocale } = useLocale();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleString(locale === "ru" ? "ru-RU" : "en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [locale]);

  return (
    <motion.div
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 26, stiffness: 280, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-[100] h-[28px] flex items-center justify-between px-[18px] text-white text-[13px] select-none"
      style={{
        background: "rgba(0,0,0,0.22)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        borderBottom: "0.5px solid rgba(255,255,255,0.12)",
      }}
    >
      <div className="flex items-center gap-[18px]">
        <svg width="12" height="15" viewBox="0 0 814 1000" fill="white" className="opacity-95">
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-163.7-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.2 0 130.9 2.6 198.3 99.2zm-234-181.1c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.2 32.4-54.4 83.6-54.4 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.8-71.3z" />
        </svg>
        <span className="font-semibold text-[13px]">{activeApp}</span>
        <span className="opacity-75 hidden sm:inline font-normal text-[13px]">File</span>
        <span className="opacity-75 hidden sm:inline font-normal text-[13px]">Edit</span>
        <span className="opacity-75 hidden md:inline font-normal text-[13px]">View</span>
        <span className="opacity-75 hidden lg:inline font-normal text-[13px]">Window</span>
        <span className="opacity-75 hidden lg:inline font-normal text-[13px]">Help</span>
      </div>
      <div className="flex items-center gap-[14px] text-[12px]">
        <button
          onClick={toggleLocale}
          className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-semibold uppercase tracking-wide transition-colors"
        >
          {locale === "ru" ? "RU" : "EN"}
        </button>
        <svg width="14" height="10" viewBox="0 0 16 12" fill="white" opacity="0.9">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 16 12" fill="white" opacity="0.85">
          <path d="M8 2C5.5 2 3.2 3.4 2 5.5c1.2 2.1 3.5 3.5 6 3.5s4.8-1.4 6-3.5C12.8 3.4 10.5 2 8 2z" />
        </svg>
        <span className="tabular-nums font-normal opacity-95">{time}</span>
      </div>
    </motion.div>
  );
}
