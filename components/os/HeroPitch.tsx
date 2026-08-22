"use client";

import { motion } from "framer-motion";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";
import { useLocale } from "@/context/LocaleContext";

interface HeroPitchProps {
  variant: "mac" | "ios";
  onProjects: () => void;
  embedded?: boolean;
}

export default function HeroPitch({ variant, onProjects, embedded }: HeroPitchProps) {
  const { t } = useLocale();
  const { profile, contacts } = USER_CONFIG;

  const isMac = variant === "mac";

  return (
    <motion.div
      initial={{ opacity: 0, y: embedded ? 12 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 26, stiffness: 200, delay: embedded ? 0.1 : 0.5 }}
      className={`z-10 pointer-events-auto ${
        isMac
          ? "absolute top-[18%] left-1/2 -translate-x-1/2 w-[min(520px,calc(100vw-48px))]"
          : embedded
            ? "w-full px-[22px] mb-1"
            : "px-5 pt-2 pb-4"
      }`}
    >
      <div
        className={`backdrop-blur-3xl border ${
          isMac
            ? "bg-white/12 border-white/20 rounded-[28px] px-8 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            : embedded
              ? "bg-white/14 border-white/22 rounded-[22px] px-5 pt-5 pb-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
              : "bg-white/22 border-white/35 rounded-[26px] px-5 py-5 shadow-lg"
        }`}
      >
        <p className="text-white/70 text-[11px] uppercase tracking-[0.25em] font-medium mb-2">
          {t("stack")}
        </p>
        <h1
          className={`font-semibold text-white tracking-tight leading-[1.05] ${
            isMac ? "text-4xl md:text-5xl" : embedded ? "text-[26px]" : "text-[28px]"
          }`}
        >
          {profile.name}
        </h1>
        <p className={`text-white/85 mt-2 ${isMac ? "text-lg" : "text-[15px] leading-snug"}`}>
          {profile.title}
        </p>
        <p className={`text-white/65 mt-3 leading-relaxed ${isMac ? "text-sm" : embedded ? "text-[12px] line-clamp-2" : "text-[13px]"}`}>
          {t("pitch")}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="px-3 py-1 rounded-full bg-[#34C759]/25 text-[#86EFAC] text-[11px] font-semibold uppercase tracking-wider border border-[#34C759]/30">
            {t("hire")}
          </span>
        </div>

        <div className={`flex gap-3 mt-5 ${isMac ? "flex-row" : embedded ? "flex-row gap-2" : "flex-col"}`}>
          <a
            href={contacts.telegram}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center justify-center font-semibold rounded-full transition-transform active:scale-95 ${
              isMac
                ? "px-6 py-2.5 bg-white text-black hover:bg-white/90 text-[14px]"
                : embedded
                  ? "px-4 py-2 bg-white text-black text-[13px] flex-1"
                  : "px-5 py-3 bg-white text-black text-[14px]"
            }`}
          >
            {t("ctaTelegram")}
          </a>
          <button
            onClick={onProjects}
            className={`inline-flex items-center justify-center font-semibold rounded-full border border-white/30 text-white hover:bg-white/10 transition-transform active:scale-95 ${
              isMac
                ? "px-6 py-2.5 text-[14px]"
                : embedded
                  ? "px-4 py-2 text-[13px] flex-1"
                  : "px-5 py-3 text-[14px]"
            }`}
          >
            {t("ctaProjects")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
