"use client";

import { NAV_ITEMS, type SectionId } from "@/lib/portfolio/constants";
import { useCursorHandlers } from "./CustomCursor";

interface HeaderProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
  onContactClick: () => void;
  setIsCursorHovered: (v: boolean) => void;
}

export default function Header({
  activeSection,
  onNavigate,
  onContactClick,
  setIsCursorHovered,
}: HeaderProps) {
  const cursor = useCursorHandlers(setIsCursorHovered);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        <button
          onClick={() => onNavigate("hero")}
          {...cursor}
          className="font-mono font-bold text-white text-sm tracking-[0.2em] uppercase hover:text-[var(--accent)] transition-colors cursor-auto md:cursor-none"
        >
          YSM.
        </button>

        <nav className="hidden md:flex gap-8 font-mono text-[10px] uppercase tracking-widest text-gray-400">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.id === "contact"
                  ? onContactClick()
                  : onNavigate(item.id)
              }
              {...cursor}
              className={`transition-colors relative group cursor-none ${
                activeSection === item.id ? "text-white" : "hover:text-white"
              }`}
            >
              <span className="relative z-10">{item.label}</span>
              <span
                className={`absolute -bottom-2 left-1/2 h-[1px] bg-[var(--accent)] transition-all ${
                  activeSection === item.id
                    ? "w-full -translate-x-1/2"
                    : "w-0 group-hover:w-full group-hover:-translate-x-1/2"
                }`}
              />
            </button>
          ))}
        </nav>

        <button
          onClick={onContactClick}
          {...cursor}
          className="hidden md:block font-mono text-[10px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors cursor-none border border-white/10 px-4 py-2 rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Contact
        </button>

        <span className="md:hidden font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest">
          Amir
        </span>
      </div>
    </header>
  );
}
