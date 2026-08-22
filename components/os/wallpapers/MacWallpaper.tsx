"use client";

import { USER_CONFIG } from "@/lib/portfolio/userConfig";

type MacWallpaperVariant = (typeof USER_CONFIG.wallpapers)["mac"];

export default function MacWallpaper({ variant }: { variant?: MacWallpaperVariant }) {
  const v = variant ?? USER_CONFIG.wallpapers.mac;

  if (v === "aurora") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0a0e27 0%, #1a1040 30%, #2d1050 55%, #0f2847 80%, #051020 100%)",
          }}
        />
        <div
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[60%] rounded-full opacity-60 blur-[100px]"
          style={{ background: "radial-gradient(circle, #00ffcc 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[10%] -right-[15%] w-[65%] h-[55%] rounded-full opacity-50 blur-[120px]"
          style={{ background: "radial-gradient(circle, #bf5af2 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-[10%] left-[20%] w-[60%] h-[50%] rounded-full opacity-40 blur-[100px]"
          style={{ background: "radial-gradient(circle, #0a84ff 0%, transparent 70%)" }}
        />
      </div>
    );
  }

  if (v === "monterey") {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(165deg, #1e3a5f 0%, #2d5a87 35%, #4a90c2 60%, #87ceeb 85%, #b8dff5 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-[#1a472a]/80 via-[#2d6a4f]/40 to-transparent" />
        <div className="absolute bottom-[15%] left-[5%] w-[40%] h-[35%] rounded-full bg-[#1a472a]/30 blur-3xl" />
      </div>
    );
  }

  // sequoia (default) — macOS Sequoia-style warm mesh
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 scale-105"
        style={{
          background:
            "linear-gradient(145deg, #1a0a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #e94560 100%)",
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="seq1" cx="25%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="seq2" cx="75%" cy="25%" r="40%">
            <stop offset="0%" stopColor="#feca57" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#feca57" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="seq3" cx="55%" cy="75%" r="50%">
            <stop offset="0%" stopColor="#48dbfb" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#48dbfb" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="seq4" cx="15%" cy="80%" r="35%">
            <stop offset="0%" stopColor="#a29bfe" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a29bfe" stopOpacity="0" />
          </radialGradient>
          <filter id="blur">
            <feGaussianBlur stdDeviation="40" />
          </filter>
        </defs>
        <rect width="1920" height="1080" fill="url(#seq1)" filter="url(#blur)" />
        <rect width="1920" height="1080" fill="url(#seq2)" filter="url(#blur)" />
        <rect width="1920" height="1080" fill="url(#seq3)" filter="url(#blur)" />
        <rect width="1920" height="1080" fill="url(#seq4)" filter="url(#blur)" />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
    </div>
  );
}
