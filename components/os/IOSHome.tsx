"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, animate } from "framer-motion";
import {
  getIOSAppsForPage,
  IOS_DOCK_APPS,
  getAppById,
  isWindowApp,
  type OSApp,
  type OSAppId,
} from "@/lib/portfolio/osApps";
import { AppIcon } from "./AppIcon";
import DynamicIsland from "./DynamicIsland";
import { getWindowContent, getWindowTitle } from "./WindowContent";
import MacWallpaper from "./wallpapers/MacWallpaper";
import HeroPitch from "./HeroPitch";
import { useLocale } from "@/context/LocaleContext";
import { useSettings } from "@/context/SettingsContext";

function IOSStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
      );
    update();
    const i = setInterval(update, 10000);
    return () => clearInterval(i);
  }, []);

  return (
    <div
      className="relative shrink-0 z-30 pointer-events-none"
      style={{
        height: "calc(54px + env(safe-area-inset-top, 0px))",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-[26px] pt-[14px]">
        <span className="text-[17px] tabular-nums tracking-[-0.02em] text-white font-semibold w-[72px]">
          {time}
        </span>
        <span className="w-[126px]" aria-hidden />
        <div className="flex items-center gap-[6px] text-white w-[72px] justify-end">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.5" />
            <rect x="5" y="5" width="3" height="7" rx="0.5" />
            <rect x="10" y="2" width="3" height="10" rx="0.5" />
            <rect x="15" y="0" width="3" height="12" rx="0.5" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <path d="M8 2.5C5.5 2.5 3.2 3.5 1.5 5.2L0 3.7C2.2 1.5 5 0 8 0s5.8 1.5 8 3.7l-1.5 1.5C13.8 3.5 11.5 2.5 8 2.5z" />
            <path d="M8 6c-1.8 0-3.4.7-4.6 1.9L2 6.5C3.6 4.9 5.7 4 8 4s4.4.9 6 2.5l-1.4 1.4C11.4 6.7 9.8 6 8 6z" />
            <circle cx="8" cy="10" r="1.5" />
          </svg>
          <div className="w-[25px] h-[12px] rounded-[3px] border border-white/90 relative ml-0.5">
            <div className="absolute inset-[2px] right-[3px] bg-white rounded-[1px]" />
            <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-white/80 rounded-r-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IOSSearchPill() {
  const { t } = useLocale();
  return (
    <div className="mx-[26px] mb-2">
      <div className="flex items-center justify-center gap-2 py-[11px] rounded-full bg-white/12 backdrop-blur-2xl text-white/75">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" />
        </svg>
        <span className="text-[17px] font-normal">{t("iosSearch")}</span>
      </div>
    </div>
  );
}

function IOSAppButton({ app, onOpen }: { app: OSApp; onOpen: (id: OSAppId) => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 600, damping: 28 }}
      onClick={() => onOpen(app.id)}
      className="flex flex-col items-center gap-[5px] outline-none w-[76px]"
    >
      <AppIcon id={app.icon} size={64} />
      <span className="text-white text-[12px] font-normal text-center leading-[13px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] max-w-[76px] line-clamp-2">
        {app.name}
      </span>
    </motion.button>
  );
}

function IOSFullScreenApp({ appId, onClose }: { appId: OSAppId; onClose: () => void }) {
  const isMusic = appId === "music";
  const isScrollable = appId === "settings" || appId === "notes" || appId === "about";
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "8%" }}
      transition={{ type: "spring", damping: 32, stiffness: 380 }}
      className="fixed inset-0 z-[80] overflow-hidden flex flex-col"
      style={{ background: isMusic ? "#000" : "#fff" }}
    >
      <div
        className="flex items-center justify-between px-5 shrink-0 bg-inherit"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))", height: "calc(52px + env(safe-area-inset-top, 0px))" }}
      >
        <button onClick={onClose} className="font-normal text-[17px] text-[#0A84FF]">
          Done
        </button>
        <p className={`font-semibold text-[17px] ${isMusic ? "text-white" : "text-black"}`}>
          {getWindowTitle(appId)}
        </p>
        <div className="w-[52px]" />
      </div>
      <div className={`flex-1 ${isScrollable ? "overflow-y-auto" : "overflow-hidden"} ${isMusic ? "bg-black" : "bg-white"}`}>
        {getWindowContent(appId)}
      </div>
      <div className="h-[34px] shrink-0 flex items-end justify-center pb-2 bg-inherit">
        <div className={`w-[134px] h-[5px] rounded-full ${isMusic ? "bg-white/35" : "bg-black/25"}`} />
      </div>
    </motion.div>
  );
}

function IOSPagePager({
  page,
  setPage,
  showHeroBanner,
  onOpen,
}: {
  page: number;
  setPage: (p: number) => void;
  showHeroBanner: boolean;
  onOpen: (id: OSAppId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const pageCount = 2;

  const snapToPage = useCallback(
    (target: number) => {
      const w = containerRef.current?.offsetWidth ?? 0;
      animate(x, -target * w, { type: "spring", damping: 36, stiffness: 420 });
    },
    [x]
  );

  useEffect(() => {
    snapToPage(page);
  }, [page, snapToPage]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => snapToPage(page));
    ro.observe(el);
    return () => ro.disconnect();
  }, [page, snapToPage]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const w = containerRef.current?.offsetWidth ?? 0;
    const threshold = w * 0.18;
    if (info.offset.x < -threshold && page < pageCount - 1) {
      setPage(page + 1);
    } else if (info.offset.x > threshold && page > 0) {
      setPage(page - 1);
    } else {
      snapToPage(page);
    }
  };

  return (
    <div ref={containerRef} className="flex-1 overflow-hidden relative touch-pan-y">
      <motion.div
        className="flex h-full"
        style={{ x }}
        drag="x"
        dragDirectionLock
        dragConstraints={() => {
          const w = containerRef.current?.offsetWidth ?? 0;
          return { left: -(pageCount - 1) * w, right: 0 };
        }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
      >
        {[getIOSAppsForPage(1), getIOSAppsForPage(2)].map((apps, pi) => (
          <div key={pi} className="min-w-full h-full flex flex-col overflow-hidden">
            {pi === 0 && showHeroBanner && (
              <div className="relative z-10 shrink-0 -mt-3">
                <HeroPitch variant="ios" embedded onProjects={() => onOpen("projects")} />
              </div>
            )}
            <div className="flex-1 px-[22px] pt-1 pb-4 grid grid-cols-4 gap-x-0 gap-y-[22px] content-start justify-items-center">
              {apps.map((app) => (
                <IOSAppButton key={app.id} app={app} onOpen={onOpen} />
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function IOSHome() {
  const [page, setPage] = useState(0);
  const [openApp, setOpenApp] = useState<OSAppId | null>(null);
  const { toggleLocale } = useLocale();
  const { wallpaperIos, showHeroBanner } = useSettings();

  const handleOpen = (id: OSAppId) => {
    const app = getAppById(id);
    if (!app) return;
    if (app.type === "external" && app.url) {
      window.open(app.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (isWindowApp(app)) setOpenApp(id);
  };

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      <MacWallpaper variant={wallpaperIos} />

      <div className="relative z-10 flex flex-col h-full">
        <IOSStatusBar />

        <IOSPagePager
          page={page}
          setPage={setPage}
          showHeroBanner={showHeroBanner}
          onOpen={handleOpen}
        />

        <div className="flex justify-center gap-[6px] py-2 shrink-0">
          {[0, 1].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-300 ${
                page === i ? "w-[7px] h-[7px] bg-white" : "w-[7px] h-[7px] bg-white/35"
              }`}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>

        <IOSSearchPill />

        <div className="mx-3 mb-[max(8px,env(safe-area-inset-bottom))] shrink-0">
          <div className="flex justify-between items-center px-4 py-[13px] rounded-[36px] bg-white/[0.18] backdrop-blur-[40px] border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.25)]">
            {IOS_DOCK_APPS.map((app) => (
              <motion.button
                key={app.id}
                type="button"
                whileTap={{ scale: 0.86 }}
                onClick={() => handleOpen(app.id)}
                className="outline-none"
              >
                <AppIcon id={app.icon} size={56} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Island — fixed поверх всего, при expand перекрывает баннер */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        style={{ top: "calc(11px + env(safe-area-inset-top, 0px))" }}
      >
        <div className="pointer-events-auto">
          <DynamicIsland onOpenMusic={() => handleOpen("music")} />
        </div>
      </div>

      <button
        type="button"
        aria-label="Toggle language"
        onClick={toggleLocale}
        className="absolute top-0 left-0 w-16 h-16 z-[25] opacity-0"
      />

      <AnimatePresence>
        {openApp && (
          <IOSFullScreenApp appId={openApp} onClose={() => setOpenApp(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
