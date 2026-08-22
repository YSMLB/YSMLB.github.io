"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { OSApp, OSAppId } from "@/lib/portfolio/osApps";
import { AppIcon } from "./AppIcon";

interface MacDockProps {
  apps: OSApp[];
  onOpen: (id: OSAppId) => void;
  openApps: OSAppId[];
}

const ICON_SIZE = 52;
const MAX_SCALE = 1.65;
const INFLUENCE = 100;

function getScale(
  mouseX: number | null,
  iconCenter: number
): number {
  if (mouseX === null) return 1;
  const dist = Math.abs(mouseX - iconCenter);
  if (dist > INFLUENCE) return 1;
  const t = 1 - dist / INFLUENCE;
  return 1 + (MAX_SCALE - 1) * t * t;
}

export default function MacDock({ apps, onOpen, openApps }: MacDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [scales, setScales] = useState<number[]>(() => apps.map(() => 1));

  const updateScales = useCallback(
    (clientX: number | null) => {
      if (!dockRef.current || clientX === null) {
        setScales(apps.map(() => 1));
        setMouseX(null);
        return;
      }
      const dockRect = dockRef.current.getBoundingClientRect();
      const localX = clientX - dockRect.left;
      setMouseX(localX);
      setScales(
        apps.map((_, i) => {
          const el = iconRefs.current[i];
          if (!el) return 1;
          const elRect = el.getBoundingClientRect();
          const center = elRect.left - dockRect.left + elRect.width / 2;
          return getScale(localX, center);
        })
      );
    },
    [apps]
  );

  const handleMouseMove = (e: React.MouseEvent) => updateScales(e.clientX);
  const handleMouseLeave = () => updateScales(null);

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[90] pb-1">
      <motion.div
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 180, delay: 0.3 }}
        className="flex items-end gap-[6px] px-3 py-2 bg-white/20 backdrop-blur-3xl border border-white/25 rounded-[22px] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        style={{ paddingBottom: mouseX !== null ? 12 : 8 }}
      >
        {apps.map((app, i) => {
          const scale = scales[i] ?? 1;
          const isOpen = openApps.includes(app.id);
          return (
            <button
              key={app.id}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              onClick={() => onOpen(app.id)}
              className="relative flex flex-col items-center outline-none"
              style={{
                transform: `translateY(${-(scale - 1) * 28}px)`,
                transition:
                  mouseX === null
                    ? "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "transform 0.08s ease-out",
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                }}
              >
                <AppIcon id={app.icon} size={ICON_SIZE} />
              </div>
              {isOpen && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-white/90 shadow-sm" />
              )}
              {mouseX !== null && scale > 1.15 && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/75 text-white text-[10px] rounded-md whitespace-nowrap pointer-events-none">
                  {app.name}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

interface DesktopIconProps {
  app: OSApp;
  onOpen: (id: OSAppId) => void;
}

export function DesktopIcon({ app, onOpen }: DesktopIconProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onOpen(app.id)}
      onDoubleClick={() => onOpen(app.id)}
      className="flex flex-col items-center gap-1.5 w-[76px] p-2 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors group select-none"
    >
      <div className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <AppIcon id={app.icon} size={54} />
      </div>
      <span className="text-white text-[11px] text-center leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] font-medium px-1">
        {app.name}
      </span>
    </motion.button>
  );
}
