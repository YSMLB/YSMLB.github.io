"use client";

import { USER_CONFIG } from "@/lib/portfolio/userConfig";

type MacWallpaperVariant = (typeof USER_CONFIG.wallpapers)["mac"];

/** macOS Sequoia default — warm abstract light trails on dark base */
export default function MacWallpaper({ variant }: { variant?: MacWallpaperVariant }) {
  const v = variant ?? USER_CONFIG.wallpapers.mac;

  if (v === "aurora") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#0a0a12]">
        <div className="absolute inset-0 opacity-80" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(0,255,200,0.35), transparent), radial-gradient(ellipse 70% 50% at 80% 20%, rgba(191,90,242,0.4), transparent), radial-gradient(ellipse 60% 50% at 50% 90%, rgba(10,132,255,0.35), transparent)" }} />
      </div>
    );
  }

  if (v === "monterey") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A90C2] via-[#6BA3D0] to-[#87CEEB]" />
        <div className="absolute bottom-0 inset-x-0 h-[55%] bg-gradient-to-t from-[#1B4332] via-[#2D6A4F]/70 to-transparent" />
        <div className="absolute bottom-[8%] left-[10%] w-[50%] h-[40%] rounded-full bg-[#081C15]/40 blur-3xl" />
      </div>
    );
  }

  // sequoia — closest to Apple Sequoia default wallpaper
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a0a08]">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="seqBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d1810" />
            <stop offset="40%" stopColor="#1a0f0a" />
            <stop offset="100%" stopColor="#0d0604" />
          </linearGradient>
          <filter id="seqBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="45" />
          </filter>
        </defs>
        <rect width="1920" height="1080" fill="url(#seqBase)" />
        {/* Warm light ribbons — Sequoia-style */}
        <ellipse cx="480" cy="420" rx="520" ry="180" fill="#FF6B4A" opacity="0.55" filter="url(#seqBlur)" transform="rotate(-12 480 420)" />
        <ellipse cx="1100" cy="320" rx="600" ry="200" fill="#FFB347" opacity="0.45" filter="url(#seqBlur)" transform="rotate(8 1100 320)" />
        <ellipse cx="1500" cy="580" rx="480" ry="160" fill="#E85D75" opacity="0.4" filter="url(#seqBlur)" transform="rotate(-5 1500 580)" />
        <ellipse cx="700" cy="700" rx="550" ry="140" fill="#9B4DCA" opacity="0.35" filter="url(#seqBlur)" transform="rotate(15 700 700)" />
        <ellipse cx="1300" cy="780" rx="400" ry="120" fill="#FF4500" opacity="0.3" filter="url(#seqBlur)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
    </div>
  );
}
