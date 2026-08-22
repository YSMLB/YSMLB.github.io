import type { ReactNode } from "react";
import type { IconId } from "@/lib/portfolio/osApps";

interface AppIconProps {
  id: IconId;
  size?: number;
  className?: string;
}

export function AppIcon({ id, size = 64, className = "" }: AppIconProps) {
  const s = size;
  const r = s * 0.223;

  const icons: Record<string, ReactNode> = {
    finder: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#007AFF" />
        <path d="M32 14c-6 0-11 4-12 9h24c-1-5-6-9-12-9z" fill="#64D2FF" />
        <rect x="14" y="24" width="36" height="26" rx="4" fill="#64D2FF" />
        <rect x="28" y="18" width="8" height="8" rx="1" fill="#007AFF" />
      </svg>
    ),
    projects: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="folderGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5AC8FA" />
            <stop offset="100%" stopColor="#007AFF" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx={r} fill="url(#folderGrad)" />
        <path d="M8 22c0-2 1.5-4 4-4h12l4 4h24c2.5 0 4 1.5 4 4v26c0 2.5-1.5 4-4 4H12c-2.5 0-4-1.5-4-4V22z" fill="#007AFF" opacity="0.9" />
        <path d="M8 18c0-2 1.5-4 4-4h14l3 3h23c2.5 0 4 1.5 4 4v2H8v-5z" fill="#64D2FF" />
      </svg>
    ),
    about: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#5856D6" />
        <circle cx="32" cy="24" r="10" fill="white" opacity="0.95" />
        <path d="M16 52c0-9 7-16 16-16s16 7 16 16" fill="white" opacity="0.95" />
      </svg>
    ),
    contact: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#34C759" />
        <rect x="14" y="18" width="36" height="28" rx="4" fill="white" />
        <path d="M14 22l18 14 18-14" stroke="#34C759" strokeWidth="3" fill="none" />
      </svg>
    ),
    music: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="musicGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FA243C" />
            <stop offset="100%" stopColor="#FF6B6B" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx={r} fill="url(#musicGrad)" />
        <path d="M38 16v22.5c0 3.5-2.8 6.3-6.3 6.3S25.4 42 25.4 38.5 28.2 32.2 31.7 32.2c1.2 0 2.3.3 3.3.9V22l12-3v-3z" fill="white" />
      </svg>
    ),
    settings: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#8E8E93" />
        <circle cx="32" cy="32" r="14" fill="none" stroke="white" strokeWidth="3" />
        <circle cx="32" cy="32" r="5" fill="white" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="30"
            y="12"
            width="4"
            height="8"
            rx="1"
            fill="white"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
      </svg>
    ),
    notes: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#FFCC00" />
        <rect x="16" y="14" width="32" height="36" rx="3" fill="white" />
        <line x1="22" y1="24" x2="42" y2="24" stroke="#FFCC00" strokeWidth="2" />
        <line x1="22" y1="32" x2="42" y2="32" stroke="#FFCC00" strokeWidth="2" />
        <line x1="22" y1="40" x2="36" y2="40" stroke="#FFCC00" strokeWidth="2" />
      </svg>
    ),
    telegram: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#229ED9" />
        <path d="M14 32l28-12-8 28-6-10-8 6 4-12-18 0z" fill="white" transform="translate(4, 2)" />
      </svg>
    ),
    instagram: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <defs>
          <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="50%" stopColor="#E4405F" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx={r} fill="url(#igGrad)" />
        <rect x="16" y="16" width="32" height="32" rx="8" stroke="white" strokeWidth="3" fill="none" />
        <circle cx="32" cy="32" r="8" stroke="white" strokeWidth="3" fill="none" />
        <circle cx="44" cy="20" r="3" fill="white" />
      </svg>
    ),
    github: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#24292F" />
        <path fill="white" d="M32 12c-11 0-20 9-20 20.2 0 8.9 5.8 16.5 13.8 19.2 1 .2 1.4-.4 1.4-.9v-3.2c-5.6 1.2-6.8-2.7-6.8-2.7-.9-2.3-2.2-2.9-2.2-2.9-1.8-1.2.1-1.2.1-1.2 2 .1 3.1 2.1 3.1 2.1 1.8 3.1 4.7 2.2 5.9 1.7.2-1.3.7-2.2 1.3-2.7-4.5-.5-9.2-2.2-9.2-9.9 0-2.2.8-4 2.1-5.4-.2-.5-.9-2.6.2-5.4 0 0 1.7-.5 5.6 2.1 1.6-.5 3.4-.7 5.1-.7s3.5.2 5.1.7c3.9-2.6 5.6-2.1 5.6-2.1 1.1 2.8.4 4.9.2 5.4 1.3 1.4 2.1 3.2 2.1 5.4 0 7.7-4.7 9.4-9.2 9.9.7.6 1.4 1.8 1.4 3.7v5.5c0 .5.4 1.1 1.4.9 8-2.7 13.8-10.3 13.8-19.2C52 21 43 12 32 12z" />
      </svg>
    ),
    mail: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#007AFF" />
        <rect x="12" y="16" width="40" height="32" rx="6" fill="white" />
        <path d="M12 20l20 16 20-16" stroke="#007AFF" strokeWidth="3" fill="none" />
      </svg>
    ),
    safari: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#0A84FF" />
        <circle cx="32" cy="32" r="18" fill="white" opacity="0.95" />
        <polygon points="32,18 38,38 32,34 26,38" fill="#FF3B30" />
        <polygon points="32,46 26,26 32,30 38,26" fill="#007AFF" />
        <circle cx="32" cy="32" r="3" fill="#333" />
      </svg>
    ),
    youtube: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#FF0000" />
        <path d="M44 32l-16-9v18l16-9z" fill="white" />
      </svg>
    ),
    linkedin: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#0A66C2" />
        <rect x="16" y="26" width="8" height="22" fill="white" />
        <circle cx="20" cy="18" r="5" fill="white" />
        <path d="M28 26h8v3c1.5-2 4-3.5 8-3.5 8 0 10 5 10 13v9h-8v-8c0-2 0-5-3-5s-4 2-4 5v8h-8V26z" fill="white" />
      </svg>
    ),
    twitter: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#000" />
        <path d="M20 18l12 16-12 14h4l10-12 8 12h8l-13-18 11-14h-4l-9 11-7-11h-8z" fill="white" />
      </svg>
    ),
    discord: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#5865F2" />
        <path d="M44 22c-3-2-7-3-11-3l-1 2c-4 1-7 3-10 6-5 8-4 18-1 24 2 1 5 2 7 2l1-2c1 0 3-1 4-2 4 1 8 1 12 0 1 1 3 2 4 2l1 2c3 0 5-1 7-2 3-6 4-16-1-24-3-3-6-5-10-6l-1-2c-4 0-8 1-11 3zm-16 10c2 0 3 2 3 4s-1 4-3 4-3-2-3-4 1-4 3-4zm12 0c2 0 3 2 3 4s-1 4-3 4-3-2-3-4 1-4 3-4z" fill="white" />
      </svg>
    ),
    vk: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#0077FF" />
        <path d="M33 42c-12 0-19-8-20-22h6c1 10 5 14 9 15V20h6v9c4 0 6-4 7-9h6c-1 6-4 10-7 12 3 2 5 6 6 10h-7c-1-4-4-7-8-7v7h-2z" fill="white" />
      </svg>
    ),
    whatsapp: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#25D366" />
        <path d="M32 14c-10 0-18 8-18 18 0 3 1 6 2 8l-2 8 8-2c2 1 5 2 8 2 10 0 18-8 18-18S42 14 32 14zm9 25c-1 3-5 5-7 5-5 0-10-4-12-10-2-5 0-9 4-9 1 0 2 0 2 1l1 3s0 1 1 1 2-3 3-4c0-1 0-2-1-2l-3-1c-1 0-2 1-1 2 1 2 3 5 6 7 2 1 3 1 4 0l2-2c0-1 1 0 2 1z" fill="white" />
      </svg>
    ),
    link: (
      <svg width={s} height={s} viewBox="0 0 64 64" className={className}>
        <rect width="64" height="64" rx={r} fill="#636366" />
        <path d="M28 36l-4 4c-3 3-8 3-11 0s-3-8 0-11l8-8c3-3 8-3 11 0M36 28l4-4c3-3 8-3 11 0s3 8 0 11l-8 8c-3 3-8 3-11 0" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  };

  return icons[id] ?? icons.link;
}
