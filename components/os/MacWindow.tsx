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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.88, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16, transition: { duration: 0.2 } }}
      transition={{ type: "spring", damping: 26, stiffness: 340, mass: 0.8 }}
      style={{ zIndex, width: size.w, maxWidth: "calc(100vw - 32px)" }}
      className={`relative rounded-xl overflow-hidden shadow-2xl border ${
        isActive
          ? "border-white/25 shadow-black/60 ring-1 ring-white/10"
          : "border-white/10 shadow-black/40"
      }`}
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={{ top: 0, left: -200, right: 200, bottom: 400 }}
      onPointerDown={onFocus}
    >
      <div className="h-[52px] bg-[#ebebeb]/90 backdrop-blur-2xl flex items-center px-4 border-b border-black/[0.06] shrink-0 cursor-grab active:cursor-grabbing">
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 transition-all"
            aria-label="Close"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-90 transition-all"
            aria-label="Minimize"
          />
          <div className="w-3 h-3 rounded-full bg-[#28C840] opacity-90" />
        </div>
        <p className="flex-1 text-center text-[13px] font-semibold text-[#3c3c3c]/90 truncate px-4">
          {title}
        </p>
      </div>
      <div
        className="bg-white overflow-y-auto overscroll-contain"
        style={{ maxHeight: size.h - 52, minHeight: Math.min(size.h - 52, 320) }}
      >
        {children}
      </div>
    </motion.div>
  );
}
