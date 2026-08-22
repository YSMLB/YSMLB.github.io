"use client";

import { motion } from "framer-motion";
import type { OSAppId } from "@/lib/portfolio/osApps";
import { getWindowSize } from "./WindowContent";

interface MacWindowProps {
  id: OSAppId;
  title: string;
  zIndex: number;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export default function MacWindow({
  id,
  title,
  zIndex,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  children,
}: MacWindowProps) {
  const size = getWindowSize(id);
  const isDark = id === "music";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.86, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 16, transition: { duration: 0.18 } }}
      transition={{ type: "spring", damping: 24, stiffness: 360, mass: 0.75 }}
      style={{
        zIndex,
        width: size.w,
        maxWidth: "calc(100vw - 32px)",
        boxShadow: isActive
          ? "0 22px 70px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.08)"
          : "0 12px 40px rgba(0,0,0,0.4)",
      }}
      className={`relative rounded-[12px] overflow-hidden ${
        isActive ? "ring-1 ring-white/10" : "opacity-[0.97]"
      }`}
      drag
      dragMomentum={false}
      dragElastic={0.04}
      onPointerDown={onFocus}
    >
      <div
        className="h-[52px] flex items-center px-[14px] border-b shrink-0 cursor-grab active:cursor-grabbing"
        style={{
          background: "rgba(236,236,236,0.85)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderColor: "rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex gap-[8px]">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-[12px] h-[12px] rounded-full bg-[#FF5F57] hover:brightness-95 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]"
            aria-label="Close"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-[12px] h-[12px] rounded-full bg-[#FEBC2E] hover:brightness-95 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]"
            aria-label="Minimize"
          />
          <div className="w-[12px] h-[12px] rounded-full bg-[#28C840] opacity-90 shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.12)]" />
        </div>
        <p className="flex-1 text-center text-[13px] font-semibold text-[#3c3c3c] truncate px-4">
          {title}
        </p>
      </div>
      <div
        className={`overscroll-contain ${
          isDark
            ? "bg-[#1c1c1e] overflow-hidden"
            : "bg-white overflow-y-auto"
        }`}
        style={{
          height: size.h - 52,
          maxHeight: size.h - 52,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
