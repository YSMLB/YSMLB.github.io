"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  getIOSAppsForPage,
  IOS_DOCK_APPS,
  getAppById,
  isWindowApp,
  type OSApp,
  type OSAppId,
} from "@/lib/portfolio/osApps";
import { AppIcon } from "./AppIcon";
import { getWindowContent, getWindowTitle } from "./WindowContent";
import IOSWallpaper from "./wallpapers/IOSWallpaper";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";

function IOSStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-between px-7 pt-[14px] pb-1 text-white text-[15px] font-semibold z-20">
      <span className="tabular-nums w-16">{time}</span>
      <div className="absolute left-1/2 -translate-x-1/2 top-[10px] w-[126px] h-[37px] bg-black rounded-[20px] shadow-inner" />
      <div className="flex items-center gap-[5px] w-16 justify-end">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
          <rect x="0" y="7" width="3" height="5" rx="0.5" />
          <rect x="4" y="5" width="3" height="7" rx="0.5" />
          <rect x="8" y="3" width="3" height="9" rx="0.5" />
          <rect x="12" y="1" width="3" height="11" rx="0.5" />
        </svg>
        <div className="w-[25px] h-[12px] border-[1.5px] border-white rounded-[3px] relative ml-0.5">
          <div className="absolute inset-[2px] right-[3px] bg-white rounded-[1px]" />
          <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[5px] bg-white rounded-r-sm" />
        </div>
      </div>
    </div>
  );
}

function IOSAppButton({
  app,
  onOpen,
}: {
  app: OSApp;
  onOpen: (id: OSAppId) => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onClick={() => onOpen(app.id)}
      className="flex flex-col items-center gap-[6px] outline-none"
    >
      <AppIcon id={app.icon} size={62} />
      <span className="text-white text-[11px] font-medium text-center leading-[13px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] max-w-[72px] line-clamp-2">
        {app.name}
      </span>
    </motion.button>
  );
}

function IOSFullScreenApp({
  appId,
  onClose,
}: {
  appId: OSAppId;
  onClose: () => void;
}) {
  const isMusic = appId === "music";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, borderRadius: 32 }}
      animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
      exit={{ opacity: 0, scale: 0.9, borderRadius: 32 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      className="fixed inset-0 z-[80] bg-white overflow-hidden flex flex-col"
    >
      <div
        className={`flex items-center justify-between px-4 shrink-0 safe-area-pt ${
          isMusic ? "bg-[#1c1c1e] text-white" : "bg-[#f2f2f7] text-[#007AFF]"
        }`}
        style={{ paddingTop: "max(14px, env(safe-area-inset-top))", height: 56 }}
      >
        <button onClick={onClose} className="font-medium text-[17px] px-2">
          {isMusic ? "←" : "Done"}
        </button>
        <p className={`font-semibold text-[17px] ${isMusic ? "text-white" : "text-[#1d1d1f]"}`}>
          {getWindowTitle(appId)}
        </p>
        <div className="w-14" />
      </div>
      <div className={`flex-1 overflow-y-auto ${isMusic ? "bg-[#1c1c1e]" : "bg-white"}`}>
        {getWindowContent(appId)}
      </div>
    </motion.div>
  );
}

export default function IOSHome() {
  const [page, setPage] = useState(0);
  const [openApp, setOpenApp] = useState<OSAppId | null>(null);

  const page1Apps = getIOSAppsForPage(1);
  const page2Apps = getIOSAppsForPage(2);

  const handleOpen = (id: OSAppId) => {
    const app = getAppById(id);
    if (!app) return;
    if (app.type === "external" && app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (isWindowApp(app)) {
      setOpenApp(id);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold && page < 1) setPage(1);
    else if (info.offset.x > threshold && page > 0) setPage(0);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <IOSWallpaper />

      <div className="relative z-10 flex flex-col h-full">
        <IOSStatusBar />

        {/* Widget */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 24 }}
          className="px-5 pt-2 pb-1"
        >
          <div className="bg-white/20 backdrop-blur-2xl rounded-[22px] p-4 border border-white/30 shadow-lg">
            <p className="text-white/70 text-[11px] uppercase tracking-wider mb-0.5">
              Portfolio
            </p>
            <p className="text-white text-[22px] font-semibold leading-tight">
              {USER_CONFIG.profile.name}
            </p>
            <p className="text-white/80 text-[13px] mt-0.5">{USER_CONFIG.profile.title}</p>
          </div>
        </motion.div>

        {/* Swipeable pages */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex h-full"
            animate={{ x: `${-page * 100}%` }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          >
            {[page1Apps, page2Apps].map((apps, pageIndex) => (
              <div
                key={pageIndex}
                className="min-w-full px-5 pt-4 grid grid-cols-4 gap-x-2 gap-y-7 content-start"
              >
                {apps.map((app) => (
                  <IOSAppButton key={app.id} app={app} onOpen={handleOpen} />
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Page indicator */}
        <div className="flex justify-center gap-[6px] py-2">
          {[0, 1].map((i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-[7px] rounded-full transition-all duration-300 ${
                page === i ? "w-[7px] bg-white" : "w-[7px] bg-white/35"
              }`}
            />
          ))}
        </div>

        {/* Dock */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 22, stiffness: 200, delay: 0.25 }}
          className="mx-3 mb-5"
        >
          <div className="flex justify-around items-center px-3 py-[10px] bg-white/25 backdrop-blur-3xl rounded-[32px] border border-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
            {IOS_DOCK_APPS.map((app) => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.85 }}
                onClick={() => handleOpen(app.id)}
                className="outline-none"
              >
                <AppIcon id={app.icon} size={56} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {openApp && (
          <IOSFullScreenApp appId={openApp} onClose={() => setOpenApp(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
