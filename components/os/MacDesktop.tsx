"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MacMenuBar from "./MacMenuBar";
import MacWindow from "./MacWindow";
import MacDock, { DesktopIcon } from "./MacDock";
import MacWallpaper from "./wallpapers/MacWallpaper";
import { DESKTOP_APPS, DOCK_APPS, type OSAppId } from "@/lib/portfolio/osApps";
import { getWindowContent } from "./WindowContent";
import { useWindowManager } from "@/hooks/useWindowManager";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";

const WINDOW_OFFSETS: Partial<Record<OSAppId, { x: number; y: number }>> = {
  safari: { x: 60, y: 48 },
  about: { x: 100, y: 72 },
  projects: { x: 140, y: 40 },
  contact: { x: 180, y: 88 },
  music: { x: 90, y: 36 },
  finder: { x: 40, y: 56 },
  settings: { x: 200, y: 64 },
  notes: { x: 120, y: 100 },
};

export default function MacDesktop() {
  const {
    windows,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    activeWindowId,
    openAppIds,
    activeApp,
  } = useWindowManager();

  useEffect(() => {
    if (USER_CONFIG.autoOpenSafari) {
      const timer = setTimeout(() => openApp("safari"), 700);
      return () => clearTimeout(timer);
    }
  }, [openApp]);

  const visibleWindows = windows.filter((w) => !w.minimized);

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      <MacWallpaper />

      <MacMenuBar activeApp={activeApp} />

      {/* Desktop icons — left column */}
      <div className="absolute top-9 left-4 md:left-6 flex flex-col gap-1 pt-3 z-20">
        {DESKTOP_APPS.map((app) => (
          <DesktopIcon key={app.id} app={app} onOpen={openApp} />
        ))}
      </div>

      <div className="absolute top-9 right-6 pt-3 hidden xl:block z-10">
        <p className="text-white/25 text-sm font-medium tracking-wide">
          {USER_CONFIG.profile.machineName}
        </p>
      </div>

      {/* Windows */}
      <div className="absolute inset-0 top-7 bottom-[72px] pointer-events-none z-30">
        <div className="relative w-full h-full">
          <AnimatePresence mode="popLayout">
            {visibleWindows.map((win) => {
              const offset = WINDOW_OFFSETS[win.id] ?? { x: 80, y: 60 };
              return (
                <div
                  key={win.id}
                  className="pointer-events-auto absolute"
                  style={{ left: offset.x, top: offset.y }}
                >
                  <MacWindow
                    id={win.id}
                    title={win.title}
                    zIndex={win.zIndex}
                    isActive={activeWindowId === win.id}
                    onClose={() => closeWindow(win.id)}
                    onMinimize={() => minimizeWindow(win.id)}
                    onFocus={() => focusWindow(win.id)}
                  >
                    {getWindowContent(win.id)}
                  </MacWindow>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <MacDock apps={DOCK_APPS} onOpen={openApp} openApps={openAppIds} />
    </div>
  );
}
