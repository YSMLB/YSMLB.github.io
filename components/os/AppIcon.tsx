import Image from "next/image";
import type { IconId } from "@/lib/portfolio/osApps";
import { getAppIconSrc } from "@/lib/portfolio/appIcons";
import { IconShell } from "./IconShell";

interface AppIconProps {
  id: IconId;
  size?: number;
  className?: string;
}

const BRAND_FALLBACK: Partial<
  Record<IconId, { bg: string; label: string; color?: string }>
> = {
  linkedin: { bg: "#0A66C2", label: "in", color: "#fff" },
  vk: { bg: "#0077FF", label: "VK", color: "#fff" },
  whatsapp: { bg: "#25D366", label: "WA", color: "#fff" },
  link: { bg: "#636366", label: "↗", color: "#fff" },
};

export function AppIcon({ id, size = 60, className = "" }: AppIconProps) {
  const src = getAppIconSrc(id);
  const fallback = BRAND_FALLBACK[id];

  if (src) {
    return (
      <IconShell size={size} className={className}>
        <Image
          src={src}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-cover"
          draggable={false}
          priority={size >= 58}
        />
      </IconShell>
    );
  }

  if (fallback) {
    return (
      <IconShell size={size} className={className}>
        <div
          className="w-full h-full flex items-center justify-center font-bold"
          style={{
            background: fallback.bg,
            color: fallback.color ?? "#fff",
            fontSize: size * 0.28,
          }}
        >
          {fallback.label}
        </div>
      </IconShell>
    );
  }

  return (
    <IconShell size={size} className={className}>
      <div className="w-full h-full bg-[#8E8E93] flex items-center justify-center text-white text-xs font-semibold">
        ?
      </div>
    </IconShell>
  );
}
