"use client";

import { USER_CONFIG } from "@/lib/portfolio/userConfig";

type IOSWallpaperVariant = (typeof USER_CONFIG.wallpapers)["ios"];

export default function IOSWallpaper({ variant }: { variant?: IOSWallpaperVariant }) {
  const v = variant ?? USER_CONFIG.wallpapers.ios;

  if (v === "ios17") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 40%, #3a3a3c 70%, #48484a 100%)",
          }}
        />
        <div
          className="absolute top-[-20%] left-[-30%] w-[90%] h-[70%] rounded-full opacity-40 blur-[80px]"
          style={{ background: "#636366" }}
        />
      </div>
    );
  }

  if (v === "gradient") {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(160deg, #667eea 0%, #764ba2 100%)",
        }}
      />
    );
  }

  // ios18 — light blue mesh like iOS 18 default
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #a8d8ff 0%, #7eb8f7 35%, #5a9fd4 65%, #3d7ab8 100%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 390 844"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="iosg1" cx="30%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iosg2" cx="80%" cy="40%" r="45%">
            <stop offset="0%" stopColor="#c4e0ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c4e0ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iosg3" cx="20%" cy="70%" r="55%">
            <stop offset="0%" stopColor="#6eb5ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6eb5ff" stopOpacity="0" />
          </radialGradient>
          <filter id="iosblur">
            <feGaussianBlur stdDeviation="25" />
          </filter>
        </defs>
        <rect width="390" height="844" fill="url(#iosg1)" filter="url(#iosblur)" />
        <rect width="390" height="844" fill="url(#iosg2)" filter="url(#iosblur)" />
        <rect width="390" height="844" fill="url(#iosg3)" filter="url(#iosblur)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#2563a8]/30 to-transparent" />
    </div>
  );
}
