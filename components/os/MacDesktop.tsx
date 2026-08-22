"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MacMenuBar from "./MacMenuBar";
import MacWindow from "./MacWindow";
import MacDock, { DesktopIcon } from "./MacDock";
import { MacNowPlayingBar } from "./MacNowPlayingBar";
import MacWallpaper from "./wallpapers/MacWallpaper";
import HeroPitch from "./HeroPitch";
import { DESKTOP_APPS, DOCK_APPS, type OSAppId } from "@/lib/portfolio/osApps";
import { getWindowContent } from "./WindowContent";
import { useWindowManager } from "@/hooks/useWindowManager";
import { useMusic } from "@/context/MusicContext";
import { useSettings } from "@/context/SettingsContext";

const WINDOW_OFFSETS: Partial<Record<OSAppId, { x: number; y: number }>> = {
  safari: { x: 480, y: 120 },
  about: { x: 520, y: 160 },
  projects: { x: 560, y: 100 },
  contact: { x: 600, y: 180 },
  music: { x: 440, y: 80 },
  finder: { x: 400, y: 140 },
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
  const { started } = useMusic();
  const { wallpaperMac, autoOpenSafari } = useSettings();

  useEffect(() => {
    if (!started || !autoOpenSafari) return;
    const t = setTimeout(() => openApp("safari"), 400);
    return () => clearTimeout(t);
  }, [started, openApp, autoOpenSafari]);

  const visibleWindows = windows.filter((w) => !w.minimized);

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      <MacWallpaper variant={wallpaperMac} />
      <MacMenuBar activeApp={activeApp} />

      <HeroPitch variant="mac" onProjects={() => openApp("projects")} />

      <div className="absolute top-9 left-5 flex flex-col gap-0.5 z-20">
        {DESKTOP_APPS.map((app) => (
          <DesktopIcon key={app.id} app={app} onOpen={openApp} />
        ))}
      </div>

      <div className="absolute inset-0 top-7 bottom-[68px] pointer-events-none z-30">
        <div className="relative w-full h-full">
          <AnimatePresence mode="popLayout">
            {visibleWindows.map((win) => {
              const offset = WINDOW_OFFSETS[win.id] ?? { x: 120, y: 100 };
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

      <MacNowPlayingBar onOpen={openApp} />
      <MacDock apps={DOCK_APPS} onOpen={openApp} openApps={openAppIds} />
    </div>
  );
}
