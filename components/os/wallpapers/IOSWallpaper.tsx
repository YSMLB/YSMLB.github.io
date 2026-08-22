"use client";

import { USER_CONFIG } from "@/lib/portfolio/userConfig";

type IOSWallpaperVariant = (typeof USER_CONFIG.wallpapers)["ios"];

/** iOS 18 default — light blue fluid waves */
export default function IOSWallpaper({ variant }: { variant?: IOSWallpaperVariant }) {
  const v = variant ?? USER_CONFIG.wallpapers.ios;

  if (v === "ios17") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#2C2C2E] via-[#3A3A3C] to-[#48484A]" />
    );
  }

  if (v === "gradient") {
    return <div className="absolute inset-0 bg-gradient-to-br from-[#667eea] to-[#764ba2]" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#5B9BD5]">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ios18base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A8D4F0" />
            <stop offset="45%" stopColor="#6BAEE8" />
            <stop offset="100%" stopColor="#3D7AB8" />
          </linearGradient>
          <filter id="iosBlur">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <rect width="390" height="844" fill="url(#ios18base)" />
        <ellipse cx="80" cy="180" rx="160" ry="120" fill="white" opacity="0.35" filter="url(#iosBlur)" />
        <ellipse cx="320" cy="320" rx="180" ry="100" fill="#C5E4FF" opacity="0.5" filter="url(#iosBlur)" />
        <ellipse cx="100" cy="520" rx="200" ry="90" fill="#7EB8E8" opacity="0.45" filter="url(#iosBlur)" />
        <ellipse cx="280" cy="680" rx="150" ry="80" fill="white" opacity="0.25" filter="url(#iosBlur)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
    </div>
  );
}
