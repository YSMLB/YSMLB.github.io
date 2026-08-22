"use client";

import type { ReactNode } from "react";
import { useLocale } from "@/context/LocaleContext";
import {
  useSettings,
  type WallpaperId,
  type AppearanceId,
} from "@/context/SettingsContext";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6">
      <p className="text-[13px] text-[#86868b] uppercase tracking-wide px-4 mb-2">{title}</p>
      <div className="mx-4 rounded-xl overflow-hidden bg-white border border-black/[0.06] divide-y divide-black/[0.06]">
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[15px] text-[#1d1d1f]">{label}</p>
        {hint && <p className="text-[12px] text-[#86868b] mt-0.5">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors outline-none ${
        checked ? "bg-[#34C759]" : "bg-[#e9e9eb]"
      }`}
    >
      <span
        className={`absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-lg bg-[#e9e9eb] p-0.5 gap-0.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors outline-none ${
            value === opt.id ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const WALLPAPERS: { id: WallpaperId; label: string; color: string }[] = [
  { id: "sequoia", label: "Sequoia", color: "#2d1810" },
  { id: "aurora", label: "Aurora", color: "#0a0a12" },
  { id: "monterey", label: "Monterey", color: "#4A90C2" },
];

export function SettingsContent() {
  const { locale, setLocale, t } = useLocale();
  const {
    deviceName,
    setDeviceName,
    wallpaperMac,
    setWallpaperMac,
    wallpaperIos,
    setWallpaperIos,
    appearance,
    setAppearance,
    reduceMotion,
    setReduceMotion,
    showHeroBanner,
    setShowHeroBanner,
    autoOpenSafari,
    setAutoOpenSafari,
    musicEnabled,
    setMusicEnabled,
    resetSettings,
  } = useSettings();

  return (
    <div className="h-full min-h-[480px] overflow-y-auto bg-[#f2f2f7] py-4">
      <Section title={locale === "ru" ? "Основные" : "General"}>
        <Row label={locale === "ru" ? "Имя устройства" : "Device Name"}>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full sm:w-[200px] px-3 py-2 rounded-lg border border-black/10 text-[15px] bg-[#f2f2f7] outline-none focus:ring-2 focus:ring-[#007AFF]/30"
          />
        </Row>
        <Row label={locale === "ru" ? "Язык" : "Language"}>
          <Segmented
            options={[
              { id: "ru", label: "RU" },
              { id: "en", label: "EN" },
            ]}
            value={locale}
            onChange={setLocale}
          />
        </Row>
      </Section>

      <Section title={locale === "ru" ? "Экран" : "Display"}>
        <Row
          label={locale === "ru" ? "Обои Mac" : "Mac Wallpaper"}
          hint={locale === "ru" ? "Фон рабочего стола" : "Desktop background"}
        >
          <div className="flex gap-2">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                type="button"
                onClick={() => setWallpaperMac(wp.id)}
                title={wp.label}
                className={`w-10 h-10 rounded-lg border-2 transition-transform outline-none ${
                  wallpaperMac === wp.id ? "border-[#007AFF] scale-110" : "border-transparent"
                }`}
                style={{ background: wp.color }}
              />
            ))}
          </div>
        </Row>
        <Row
          label={locale === "ru" ? "Обои iPhone" : "iPhone Wallpaper"}
          hint={locale === "ru" ? "Фон домашнего экрана" : "Home screen background"}
        >
          <div className="flex gap-2">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                type="button"
                onClick={() => setWallpaperIos(wp.id)}
                title={wp.label}
                className={`w-10 h-10 rounded-lg border-2 transition-transform outline-none ${
                  wallpaperIos === wp.id ? "border-[#007AFF] scale-110" : "border-transparent"
                }`}
                style={{ background: wp.color }}
              />
            ))}
          </div>
        </Row>
        <Row label={locale === "ru" ? "Тема" : "Appearance"}>
          <Segmented<AppearanceId>
            options={[
              { id: "auto", label: "Auto" },
              { id: "light", label: "Light" },
              { id: "dark", label: "Dark" },
            ]}
            value={appearance}
            onChange={setAppearance}
          />
        </Row>
        <Row label={locale === "ru" ? "Баннер на iPhone" : "iPhone Hero Banner"}>
          <Toggle checked={showHeroBanner} onChange={setShowHeroBanner} />
        </Row>
      </Section>

      <Section title={locale === "ru" ? "Портфолио" : "Portfolio"}>
        <Row label={locale === "ru" ? "Фоновая музыка" : "Background Music"}>
          <Toggle checked={musicEnabled} onChange={setMusicEnabled} />
        </Row>
        <Row label={locale === "ru" ? "Открывать Safari при входе" : "Open Safari on Login"}>
          <Toggle checked={autoOpenSafari} onChange={setAutoOpenSafari} />
        </Row>
        <Row label={locale === "ru" ? "Меньше анимаций" : "Reduce Motion"}>
          <Toggle checked={reduceMotion} onChange={setReduceMotion} />
        </Row>
      </Section>

      <Section title={locale === "ru" ? "О приложении" : "About"}>
        <Row label="YSM Portfolio">
          <span className="text-[15px] text-[#86868b]">v1.0</span>
        </Row>
        <Row label={locale === "ru" ? "Статус" : "Status"}>
          <span className="text-[15px] text-[#34C759] font-medium">{t("hire")}</span>
        </Row>
      </Section>

      <div className="px-4 pb-8">
        <button
          type="button"
          onClick={resetSettings}
          className="w-full py-3 rounded-xl bg-white border border-black/[0.06] text-[#FF3B30] text-[15px] font-medium outline-none active:bg-black/[0.03]"
        >
          {locale === "ru" ? "Сбросить настройки" : "Reset Settings"}
        </button>
      </div>
    </div>
  );
}
