"use client";

import { useCallback, useState } from "react";
import {
  getAppById,
  isWindowApp,
  type OSAppId,
  type OSWindowState,
} from "@/lib/portfolio/osApps";
import { getWindowTitle } from "@/components/os/WindowContent";

export function useWindowManager() {
  const [windows, setWindows] = useState<OSWindowState[]>([]);
  const [, setTopZ] = useState(10);
  const [activeApp, setActiveApp] = useState<string>("Finder");

  const openApp = useCallback((id: OSAppId) => {
    const app = getAppById(id);
    if (!app) return;

    setActiveApp(app.name);

    if (app.type === "external" && app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (!isWindowApp(app)) return;

    setTopZ((z) => {
      const newZ = z + 1;
      setWindows((prev) => {
        const exists = prev.find((w) => w.id === id);
        if (exists) {
          return prev.map((w) =>
            w.id === id ? { ...w, zIndex: newZ, minimized: false } : w
          );
        }
        return [...prev, { id, title: getWindowTitle(id), zIndex: newZ }];
      });
      return newZ;
    });
  }, []);

  const closeWindow = useCallback((id: OSAppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: OSAppId) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w))
    );
  }, []);

  const focusWindow = useCallback((id: OSAppId) => {
    const app = getAppById(id);
    if (app) setActiveApp(app.name);
    setTopZ((z) => {
      const newZ = z + 1;
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, zIndex: newZ, minimized: false } : w))
      );
      return newZ;
    });
  }, []);

  const activeWindowId = windows.filter((w) => !w.minimized).length
    ? [...windows]
        .filter((w) => !w.minimized)
        .sort((a, b) => b.zIndex - a.zIndex)[0]?.id
    : null;

  const openAppIds = windows.map((w) => w.id);

  return {
    windows,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    activeWindowId,
    openAppIds,
    activeApp,
  };
}
