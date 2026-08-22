import type { ReactNode } from "react";

/** Apple squircle — ~22.37% corner radius + subtle gloss */
export function IconShell({
  size,
  children,
  className = "",
}: {
  size: number;
  children: ReactNode;
  className?: string;
}) {
  const radius = size * 0.2237;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius: radius }}
      >
        {children}
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radius,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 28%, transparent 52%)",
        }}
      />
    </div>
  );
}

/** macOS blue folder icon */
export function FolderIcon({ size = 64 }: { size?: number }) {
  const r = size * 0.2237;
  return (
    <IconShell size={size}>
      <svg width={size} height={size} viewBox="0 0 128 128" fill="none">
        <rect width="128" height="128" rx={r * 2} fill="#3B9CF7" />
        <path
          d="M16 44c0-4 3-8 8-8h28l8 8h44c4 0 8 4 8 8v56c0 4-4 8-8 8H24c-4 0-8-4-8-8V44z"
          fill="#5EB3FF"
        />
        <path
          d="M16 36c0-4 3-8 8-8h32l6 6h42c4 0 8 4 8 8v4H16V36z"
          fill="#7CC4FF"
        />
      </svg>
    </IconShell>
  );
}
