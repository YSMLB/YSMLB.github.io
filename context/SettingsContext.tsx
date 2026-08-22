"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { USER_CONFIG } from "@/lib/portfolio/userConfig";

export type WallpaperId = "sequoia" | "aurora" | "monterey";
export type AppearanceId = "auto" | "light" | "dark";

export interface SettingsState {
  deviceName: string;
  wallpaperMac: WallpaperId;
  wallpaperIos: WallpaperId;
  appearance: AppearanceId;
  reduceMotion: boolean;
  showHeroBanner: boolean;
  autoOpenSafari: boolean;
  musicEnabled: boolean;
}

const STORAGE_KEY = "ysm-portfolio-settings";

const DEFAULTS: SettingsState = {
  deviceName: USER_CONFIG.profile.machineName,
  wallpaperMac: USER_CONFIG.wallpapers.mac,
  wallpaperIos: USER_CONFIG.wallpapers.ios,
  appearance: "auto",
  reduceMotion: false,
  showHeroBanner: true,
  autoOpenSafari: USER_CONFIG.autoOpenSafari,
  musicEnabled: USER_CONFIG.music.enabled,
};

function loadSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

interface SettingsContextValue extends SettingsState {
  setDeviceName: (name: string) => void;
  setWallpaperMac: (id: WallpaperId) => void;
  setWallpaperIos: (id: WallpaperId) => void;
  setAppearance: (id: AppearanceId) => void;
  setReduceMotion: (v: boolean) => void;
  setShowHeroBanner: (v: boolean) => void;
  setAutoOpenSafari: (v: boolean) => void;
  setMusicEnabled: (v: boolean) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  const patch = useCallback((partial: Partial<SettingsState>) => {
    setSettings((s) => ({ ...s, ...partial }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULTS), []);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setDeviceName: (deviceName) => patch({ deviceName }),
        setWallpaperMac: (wallpaperMac) => patch({ wallpaperMac }),
        setWallpaperIos: (wallpaperIos) => patch({ wallpaperIos }),
        setAppearance: (appearance) => patch({ appearance }),
        setReduceMotion: (reduceMotion) => patch({ reduceMotion }),
        setShowHeroBanner: (showHeroBanner) => patch({ showHeroBanner }),
        setAutoOpenSafari: (autoOpenSafari) => patch({ autoOpenSafari }),
        setMusicEnabled: (musicEnabled) => patch({ musicEnabled }),
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must use SettingsProvider");
  return ctx;
}
